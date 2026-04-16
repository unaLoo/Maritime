from __future__ import annotations

import json
import sqlite3
import subprocess
import threading
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, File, Form, HTTPException, Request, Response, UploadFile
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import (
    DERIVED_ROOT,
    ENCTILER_ROOT,
    HYDROTILER_ROOT,
    PYTHON_BIN,
    RAW_ROOT,
    TERRAINTILER_ROOT,
    UV_BIN,
)
from .db import get_conn, init_db


app = FastAPI(title="Maritime API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    RAW_ROOT.mkdir(parents=True, exist_ok=True)
    DERIVED_ROOT.mkdir(parents=True, exist_ok=True)
    init_db()


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/scenes/{scene_id}")
def get_scene(scene_id: str) -> dict:
    with get_conn() as conn:
        row = conn.execute("SELECT payload_json FROM scenes WHERE id = ?", (scene_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail=f"Scene not found: {scene_id}")
    return json.loads(row["payload_json"])


@app.get("/api/scenes")
def list_scenes() -> list[dict[str, str]]:
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT id, created_at FROM scenes ORDER BY created_at DESC"
        ).fetchall()
    return [{"id": row["id"], "created_at": row["created_at"]} for row in rows]


class SceneUpsertPayload(BaseModel):
    payload: dict


@app.put("/api/scenes/{scene_id}")
def upsert_scene(scene_id: str, body: SceneUpsertPayload) -> dict[str, str]:
    payload_json = json.dumps(body.payload, ensure_ascii=False)
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO scenes (id, payload_json)
            VALUES (?, ?)
            ON CONFLICT(id) DO UPDATE SET payload_json = excluded.payload_json
            """,
            (scene_id, payload_json),
        )
        conn.commit()
    return {"status": "ok", "scene_id": scene_id}


@app.get("/api/data/assets")
def list_assets() -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, dataset_id, asset_kind, disk_path, created_at
            FROM published_assets
            ORDER BY created_at DESC, id DESC
            """
        ).fetchall()
    return [
        {
            "id": row["id"],
            "dataset_id": row["dataset_id"],
            "asset_kind": row["asset_kind"],
            "disk_path": row["disk_path"],
            "access_url": _build_asset_access_url(
                row["dataset_id"], row["asset_kind"], row["disk_path"]
            ),
            "created_at": row["created_at"],
        }
        for row in rows
    ]


class AssetRegisterPayload(BaseModel):
    dataset_id: str
    asset_kind: str
    disk_path: str


@app.post("/api/data/assets/register")
def register_asset(body: AssetRegisterPayload) -> dict[str, str]:
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO published_assets (dataset_id, asset_kind, disk_path)
            VALUES (?, ?, ?)
            """,
            (body.dataset_id, body.asset_kind, body.disk_path),
        )
        conn.commit()
    return {"status": "ok"}


@app.post("/api/data/enc/charts/upload")
async def upload_enc_charts(files: list[UploadFile] = File(...)) -> dict:
    if not files:
        raise HTTPException(status_code=400, detail="请选择至少一个 .000 文件")

    upload_dir = RAW_ROOT / "enc" / "charts"
    upload_dir.mkdir(parents=True, exist_ok=True)

    created: list[dict] = []
    for item in files:
        name = item.filename or ""
        if not name.lower().endswith(".000"):
            raise HTTPException(status_code=400, detail=f"仅支持 .000 文件: {name}")
        target = upload_dir / f"{datetime.now().strftime('%Y%m%d%H%M%S%f')}_{Path(name).name}"
        content = await item.read()
        target.write_bytes(content)
        with get_conn() as conn:
            cursor = conn.execute(
                """
                INSERT INTO enc_chart_files (original_name, stored_path)
                VALUES (?, ?)
                """,
                (name, str(target)),
            )
            conn.commit()
            created.append(
                {
                    "id": cursor.lastrowid,
                    "original_name": name,
                    "stored_path": str(target),
                }
            )
    return {"status": "ok", "items": created}


@app.get("/api/data/enc/charts")
def list_enc_charts() -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, original_name, stored_path, created_at
            FROM enc_chart_files
            ORDER BY created_at DESC, id DESC
            """
        ).fetchall()
    return [
        {
            "id": row["id"],
            "original_name": row["original_name"],
            "stored_path": row["stored_path"],
            "created_at": row["created_at"],
        }
        for row in rows
    ]


class EncBuildPayload(BaseModel):
    dataset_id: str
    chart_file_ids: list[int]


@app.post("/api/data/enc/build")
def trigger_enc_build(body: EncBuildPayload) -> dict:
    dataset_id = body.dataset_id.strip()
    if not dataset_id:
        raise HTTPException(status_code=400, detail="dataset_id 不能为空")
    if not body.chart_file_ids:
        raise HTTPException(status_code=400, detail="请至少选择一个海图文件")

    with get_conn() as conn:
        placeholders = ",".join(["?"] * len(body.chart_file_ids))
        rows = conn.execute(
            f"""
            SELECT id, stored_path
            FROM enc_chart_files
            WHERE id IN ({placeholders})
            """,
            tuple(body.chart_file_ids),
        ).fetchall()
    if len(rows) != len(body.chart_file_ids):
        raise HTTPException(status_code=400, detail="存在无效的 chart_file_ids")

    input_paths = [row["stored_path"] for row in rows]
    job_id = uuid4().hex
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO enc_jobs (id, dataset_id, chart_file_ids_json, status, message)
            VALUES (?, ?, ?, ?, ?)
            """,
            (job_id, dataset_id, json.dumps(body.chart_file_ids), "queued", "任务已创建"),
        )
        conn.commit()

    thread = threading.Thread(
        target=_run_enc_build_job,
        args=(job_id, dataset_id, input_paths),
        daemon=True,
    )
    thread.start()
    return {"status": "ok", "job_id": job_id}


@app.get("/api/data/enc/jobs")
def list_enc_jobs() -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, dataset_id, chart_file_ids_json, status, message, merged_mbtiles_path, created_at, updated_at
            FROM enc_jobs
            ORDER BY created_at DESC
            """
        ).fetchall()
    return [
        {
            "id": row["id"],
            "dataset_id": row["dataset_id"],
            "chart_file_ids": json.loads(row["chart_file_ids_json"]),
            "status": row["status"],
            "message": row["message"],
            "merged_mbtiles_path": row["merged_mbtiles_path"],
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }
        for row in rows
    ]


@app.post("/api/data/hydro/files/upload")
async def upload_hydro_file(file: UploadFile = File(...), input_format: str = "grib") -> dict:
    fmt = input_format.strip().lower()
    if fmt not in {"grib", "geojson"}:
        raise HTTPException(status_code=400, detail="input_format 仅支持 grib 或 geojson")

    original_name = file.filename or ""
    if fmt == "grib" and not (original_name.lower().endswith(".grib") or original_name.lower().endswith(".grb")):
        raise HTTPException(status_code=400, detail="grib 输入请上传 .grib/.grb 文件")
    if fmt == "geojson" and not (original_name.lower().endswith(".geojson") or original_name.lower().endswith(".json")):
        raise HTTPException(status_code=400, detail="geojson 输入请上传 .geojson/.json 文件")

    upload_dir = RAW_ROOT / "hydro" / fmt
    upload_dir.mkdir(parents=True, exist_ok=True)
    target = upload_dir / f"{datetime.now().strftime('%Y%m%d%H%M%S%f')}_{Path(original_name).name}"
    target.write_bytes(await file.read())

    with get_conn() as conn:
        cursor = conn.execute(
            """
            INSERT INTO hydro_input_files (original_name, stored_path, input_format)
            VALUES (?, ?, ?)
            """,
            (original_name, str(target), fmt),
        )
        conn.commit()
        file_id = cursor.lastrowid

    return {
        "status": "ok",
        "item": {
            "id": file_id,
            "original_name": original_name,
            "stored_path": str(target),
            "input_format": fmt,
        },
    }


@app.get("/api/data/hydro/files")
def list_hydro_files() -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, original_name, stored_path, input_format, created_at
            FROM hydro_input_files
            ORDER BY created_at DESC, id DESC
            """
        ).fetchall()
    return [
        {
            "id": row["id"],
            "original_name": row["original_name"],
            "stored_path": row["stored_path"],
            "input_format": row["input_format"],
            "created_at": row["created_at"],
        }
        for row in rows
    ]


class HydroBuildPayload(BaseModel):
    dataset_id: str
    input_file_ids: list[int]
    input_format: str
    field_kind: str
    variables: list[str]
    min_zoom: int = 0
    max_zoom: int = 7
    compress: bool = True
    cfgrib_filter: dict | None = None
    bbox: list[float] | None = None


@app.post("/api/data/hydro/build")
def trigger_hydro_build(body: HydroBuildPayload) -> dict:
    dataset_id = body.dataset_id.strip()
    input_format = body.input_format.strip().lower()
    field_kind = body.field_kind.strip().lower()
    if not dataset_id:
        raise HTTPException(status_code=400, detail="dataset_id 不能为空")
    if input_format not in {"grib", "geojson"}:
        raise HTTPException(status_code=400, detail="input_format 仅支持 grib 或 geojson")
    if field_kind not in {"scalar", "vector"}:
        raise HTTPException(status_code=400, detail="field_kind 仅支持 scalar 或 vector")
    if field_kind == "scalar" and len(body.variables) != 1:
        raise HTTPException(status_code=400, detail="scalar 场 variables 必须是 1 个变量")
    if field_kind == "vector" and len(body.variables) != 2:
        raise HTTPException(status_code=400, detail="vector 场 variables 必须是 2 个变量")
    if not body.input_file_ids:
        raise HTTPException(status_code=400, detail="请至少选择一个输入文件")
    if input_format == "grib" and not body.cfgrib_filter:
        raise HTTPException(status_code=400, detail="grib 构建需要 cfgrib_filter")
    if body.bbox is not None:
        if len(body.bbox) != 4:
            raise HTTPException(status_code=400, detail="bbox 必须是 [lon_min, lat_min, lon_max, lat_max]")
        lon_min, lat_min, lon_max, lat_max = body.bbox
        if lon_min >= lon_max or lat_min >= lat_max:
            raise HTTPException(status_code=400, detail="bbox 范围不合法：需满足 lon_min < lon_max 且 lat_min < lat_max")

    with get_conn() as conn:
        placeholders = ",".join(["?"] * len(body.input_file_ids))
        rows = conn.execute(
            f"""
            SELECT id, stored_path, input_format
            FROM hydro_input_files
            WHERE id IN ({placeholders})
            """,
            tuple(body.input_file_ids),
        ).fetchall()
    if len(rows) != len(body.input_file_ids):
        raise HTTPException(status_code=400, detail="存在无效的 input_file_ids")
    if any(row["input_format"] != input_format for row in rows):
        raise HTTPException(status_code=400, detail="选择的文件 input_format 与构建参数不一致")

    input_paths = [row["stored_path"] for row in rows]
    job_id = uuid4().hex
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO hydro_jobs (
                id, dataset_id, input_file_ids_json, input_format, field_kind, variables_json, status, message
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                job_id,
                dataset_id,
                json.dumps(body.input_file_ids),
                input_format,
                field_kind,
                json.dumps(body.variables),
                "queued",
                "任务已创建",
            ),
        )
        conn.commit()

    thread = threading.Thread(
        target=_run_hydro_build_job,
        args=(
            job_id,
            dataset_id,
            input_paths,
            input_format,
            field_kind,
            body.variables,
            body.min_zoom,
            body.max_zoom,
            body.compress,
            body.cfgrib_filter,
            body.bbox,
        ),
        daemon=True,
    )
    thread.start()
    return {"status": "ok", "job_id": job_id}


@app.get("/api/data/hydro/jobs")
def list_hydro_jobs() -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, dataset_id, input_file_ids_json, input_format, field_kind, variables_json, status, message, tiles_dir, created_at, updated_at
            FROM hydro_jobs
            ORDER BY created_at DESC
            """
        ).fetchall()
    return [
        {
            "id": row["id"],
            "dataset_id": row["dataset_id"],
            "input_file_ids": json.loads(row["input_file_ids_json"]),
            "input_format": row["input_format"],
            "field_kind": row["field_kind"],
            "variables": json.loads(row["variables_json"]),
            "status": row["status"],
            "message": row["message"],
            "tiles_dir": row["tiles_dir"],
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }
        for row in rows
    ]


@app.post("/api/data/terrain/files/upload")
async def upload_terrain_file(
    file: UploadFile = File(...),
    input_format: str = "geotiff",
    file_role: str = "dem",
) -> dict:
    fmt = input_format.strip().lower()
    role = file_role.strip().lower()
    if fmt not in {"geotiff", "geojson"}:
        raise HTTPException(status_code=400, detail="input_format 仅支持 geotiff 或 geojson")
    if role not in {"dem", "boundary"}:
        raise HTTPException(status_code=400, detail="file_role 仅支持 dem 或 boundary")
    if fmt == "geotiff" and role != "dem":
        raise HTTPException(status_code=400, detail="geotiff 输入仅支持 dem 文件")

    original_name = file.filename or ""
    lower_name = original_name.lower()
    if fmt == "geotiff" and not (lower_name.endswith(".tif") or lower_name.endswith(".tiff")):
        raise HTTPException(status_code=400, detail="geotiff 输入请上传 .tif/.tiff")
    if fmt == "geojson" and not (lower_name.endswith(".geojson") or lower_name.endswith(".json")):
        raise HTTPException(status_code=400, detail="geojson 输入请上传 .geojson/.json")

    upload_dir = RAW_ROOT / "terrain" / fmt / role
    upload_dir.mkdir(parents=True, exist_ok=True)
    target = upload_dir / f"{datetime.now().strftime('%Y%m%d%H%M%S%f')}_{Path(original_name).name}"
    target.write_bytes(await file.read())

    with get_conn() as conn:
        cursor = conn.execute(
            """
            INSERT INTO terrain_input_files (original_name, stored_path, input_format, file_role)
            VALUES (?, ?, ?, ?)
            """,
            (original_name, str(target), fmt, role),
        )
        conn.commit()
        file_id = cursor.lastrowid

    return {
        "status": "ok",
        "item": {
            "id": file_id,
            "original_name": original_name,
            "stored_path": str(target),
            "input_format": fmt,
            "file_role": role,
        },
    }


@app.get("/api/data/terrain/files")
def list_terrain_files() -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, original_name, stored_path, input_format, file_role, created_at
            FROM terrain_input_files
            ORDER BY created_at DESC, id DESC
            """
        ).fetchall()
    return [
        {
            "id": row["id"],
            "original_name": row["original_name"],
            "stored_path": row["stored_path"],
            "input_format": row["input_format"],
            "file_role": row["file_role"],
            "created_at": row["created_at"],
        }
        for row in rows
    ]


@app.post("/api/data/dynamic/files/upload")
async def upload_dynamic_folder_files(
    files: list[UploadFile] = File(...),
    relative_paths: list[str] = Form(...),
    folder_name: str = Form("dynamic"),
) -> dict:
    if not files:
        raise HTTPException(status_code=400, detail="请至少选择一个 dynamic 文件")
    if len(files) != len(relative_paths):
        raise HTTPException(status_code=400, detail="relative_paths 与 files 数量不一致")

    safe_folder_name = Path(folder_name.strip() or "dynamic").name
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
    root_dir = RAW_ROOT / "dynamic" / f"{timestamp}_{safe_folder_name}"
    root_dir.mkdir(parents=True, exist_ok=True)

    created: list[dict] = []
    with get_conn() as conn:
        for item, relative_path in zip(files, relative_paths):
            original_name = item.filename or ""
            normalized = relative_path.replace("\\", "/").lstrip("/")
            if not normalized:
                normalized = Path(original_name).name
            rel_path = Path(normalized)
            if rel_path.is_absolute() or ".." in rel_path.parts:
                raise HTTPException(status_code=400, detail=f"非法相对路径: {relative_path}")

            # 浏览器目录上传通常会把顶层目录名包含在 webkitRelativePath 中，
            # 这里去掉与 folder_name 相同的首层目录，避免出现 .../<folder>/<folder>/... 的双层结构。
            rel_parts = list(rel_path.parts)
            if rel_parts and rel_parts[0] == safe_folder_name and len(rel_parts) > 1:
                rel_path = Path(*rel_parts[1:])

            target = root_dir / rel_path
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(await item.read())

            relative_dir = rel_path.parent.as_posix() if rel_path.parent != Path(".") else ""
            cursor = conn.execute(
                """
                INSERT INTO dynamic_input_files (folder_name, original_name, relative_dir, stored_path)
                VALUES (?, ?, ?, ?)
                """,
                (safe_folder_name, rel_path.name, relative_dir, str(target)),
            )
            created.append(
                {
                    "id": cursor.lastrowid,
                    "folder_name": safe_folder_name,
                    "original_name": rel_path.name,
                    "relative_dir": relative_dir,
                    "stored_path": str(target),
                }
            )
        conn.commit()

    return {"status": "ok", "root_path": str(root_dir), "items": created}


@app.get("/api/data/dynamic/files")
def list_dynamic_files() -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, folder_name, original_name, relative_dir, stored_path, created_at
            FROM dynamic_input_files
            ORDER BY created_at DESC, id DESC
            """
        ).fetchall()
    return [
        {
            "id": row["id"],
            "folder_name": row["folder_name"],
            "original_name": row["original_name"],
            "relative_dir": row["relative_dir"],
            "stored_path": row["stored_path"],
            "created_at": row["created_at"],
        }
        for row in rows
    ]


class TerrainBuildPayload(BaseModel):
    dataset_id: str
    input_format: str
    dem_file_id: int
    boundary_file_id: int | None = None
    zoom: str = "1-9"
    tile_size: int = 256
    workers: int = 8
    invert_z: bool = False
    geojson_z_field: str = "elevation"
    grid_res_m: float = 10.0
    bounds_buffer_m: float = 0.0


@app.post("/api/data/terrain/build")
def trigger_terrain_build(body: TerrainBuildPayload) -> dict:
    dataset_id = body.dataset_id.strip()
    input_format = body.input_format.strip().lower()
    if not dataset_id:
        raise HTTPException(status_code=400, detail="dataset_id 不能为空")
    if input_format not in {"geotiff", "geojson"}:
        raise HTTPException(status_code=400, detail="input_format 仅支持 geotiff 或 geojson")

    with get_conn() as conn:
        dem_row = conn.execute(
            """
            SELECT id, stored_path, input_format, file_role
            FROM terrain_input_files
            WHERE id = ?
            """,
            (body.dem_file_id,),
        ).fetchone()
        if not dem_row:
            raise HTTPException(status_code=400, detail="dem_file_id 无效")
        if dem_row["file_role"] != "dem":
            raise HTTPException(status_code=400, detail="dem_file_id 对应文件角色必须是 dem")
        if dem_row["input_format"] != input_format:
            raise HTTPException(status_code=400, detail="dem 文件 input_format 与构建参数不一致")

        boundary_path: str | None = None
        if input_format == "geojson":
            if not body.boundary_file_id:
                raise HTTPException(status_code=400, detail="geojson 输入必须提供 boundary_file_id")
            boundary_row = conn.execute(
                """
                SELECT id, stored_path, input_format, file_role
                FROM terrain_input_files
                WHERE id = ?
                """,
                (body.boundary_file_id,),
            ).fetchone()
            if not boundary_row:
                raise HTTPException(status_code=400, detail="boundary_file_id 无效")
            if boundary_row["file_role"] != "boundary":
                raise HTTPException(status_code=400, detail="boundary_file_id 对应文件角色必须是 boundary")
            if boundary_row["input_format"] != "geojson":
                raise HTTPException(status_code=400, detail="boundary 文件必须是 geojson")
            boundary_path = boundary_row["stored_path"]
        elif body.boundary_file_id is not None:
            raise HTTPException(status_code=400, detail="geotiff 输入不应提供 boundary_file_id")

    job_id = uuid4().hex
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO terrain_jobs (
                id, dataset_id, input_format, dem_file_id, boundary_file_id, status, message
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                job_id,
                dataset_id,
                input_format,
                body.dem_file_id,
                body.boundary_file_id,
                "queued",
                "任务已创建",
            ),
        )
        conn.commit()

    thread = threading.Thread(
        target=_run_terrain_build_job,
        args=(
            job_id,
            dataset_id,
            input_format,
            dem_row["stored_path"],
            boundary_path,
            body.zoom,
            body.tile_size,
            body.workers,
            body.invert_z,
            body.geojson_z_field,
            body.grid_res_m,
            body.bounds_buffer_m,
        ),
        daemon=True,
    )
    thread.start()
    return {"status": "ok", "job_id": job_id}


@app.get("/api/data/terrain/jobs")
def list_terrain_jobs() -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, dataset_id, input_format, dem_file_id, boundary_file_id, status, message, tiles_dir, created_at, updated_at
            FROM terrain_jobs
            ORDER BY created_at DESC
            """
        ).fetchall()
    return [
        {
            "id": row["id"],
            "dataset_id": row["dataset_id"],
            "input_format": row["input_format"],
            "dem_file_id": row["dem_file_id"],
            "boundary_file_id": row["boundary_file_id"],
            "status": row["status"],
            "message": row["message"],
            "tiles_dir": row["tiles_dir"],
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }
        for row in rows
    ]


@app.post("/api/data/geojson/upload")
async def upload_geojson_files(files: list[UploadFile] = File(...)) -> dict:
    if not files:
        raise HTTPException(status_code=400, detail="请至少选择一个 GeoJSON 文件")

    upload_dir = DERIVED_ROOT / "geojson"
    upload_dir.mkdir(parents=True, exist_ok=True)
    created: list[dict] = []

    for item in files:
        original_name = item.filename or ""
        lower_name = original_name.lower()
        if not (lower_name.endswith(".geojson") or lower_name.endswith(".json")):
            raise HTTPException(status_code=400, detail=f"仅支持 .geojson/.json 文件: {original_name}")

        raw = await item.read()
        try:
            parsed = json.loads(raw.decode("utf-8"))
        except Exception as exc:  # noqa: BLE001
            raise HTTPException(status_code=400, detail=f"GeoJSON 解析失败: {original_name}") from exc

        geojson_type = parsed.get("type")
        if geojson_type not in {"FeatureCollection", "Feature"}:
            raise HTTPException(
                status_code=400,
                detail=f"GeoJSON 顶层 type 必须是 FeatureCollection 或 Feature: {original_name}",
            )

        dataset_id = Path(original_name).stem
        target_name = f"{dataset_id}_{datetime.now().strftime('%Y%m%d%H%M%S%f')}.geojson"
        target = upload_dir / target_name
        target.write_text(json.dumps(parsed, ensure_ascii=False), encoding="utf-8")

        with get_conn() as conn:
            cursor = conn.execute(
                """
                INSERT INTO published_assets (dataset_id, asset_kind, disk_path)
                VALUES (?, ?, ?)
                """,
                (dataset_id, "geojson", str(target)),
            )
            conn.commit()
            created.append(
                {
                    "id": cursor.lastrowid,
                    "dataset_id": dataset_id,
                    "asset_kind": "geojson",
                    "disk_path": str(target),
                    "access_url": _build_asset_access_url(dataset_id, "geojson", str(target)),
                }
            )

    return {"status": "ok", "items": created}


@app.post("/api/data/visual-assets/upload")
async def upload_visual_assets(
    files: list[UploadFile] = File(...),
    asset_type: str = "geojson",
) -> dict:
    if not files:
        raise HTTPException(status_code=400, detail="请至少选择一个文件")

    kind = asset_type.strip().lower()
    if kind not in {"geojson", "model", "texture"}:
        raise HTTPException(status_code=400, detail="asset_type 仅支持 geojson/model/texture")

    upload_dir = DERIVED_ROOT / "visual-assets" / kind
    upload_dir.mkdir(parents=True, exist_ok=True)
    created: list[dict] = []

    for item in files:
        original_name = item.filename or ""
        lower_name = original_name.lower()
        dataset_id = Path(original_name).stem

        if kind == "geojson":
            if not (lower_name.endswith(".geojson") or lower_name.endswith(".json")):
                raise HTTPException(status_code=400, detail=f"GeoJSON 仅支持 .geojson/.json: {original_name}")
            raw = await item.read()
            try:
                parsed = json.loads(raw.decode("utf-8"))
            except Exception as exc:  # noqa: BLE001
                raise HTTPException(status_code=400, detail=f"GeoJSON 解析失败: {original_name}") from exc
            geojson_type = parsed.get("type")
            if geojson_type not in {"FeatureCollection", "Feature"}:
                raise HTTPException(
                    status_code=400,
                    detail=f"GeoJSON 顶层 type 必须是 FeatureCollection 或 Feature: {original_name}",
                )
            target_name = f"{dataset_id}_{datetime.now().strftime('%Y%m%d%H%M%S%f')}.geojson"
            target = upload_dir / target_name
            target.write_text(json.dumps(parsed, ensure_ascii=False), encoding="utf-8")
            asset_kind = "geojson"
        elif kind == "model":
            if not (lower_name.endswith(".gltf") or lower_name.endswith(".glb")):
                raise HTTPException(status_code=400, detail=f"模型仅支持 .gltf/.glb: {original_name}")
            ext = ".glb" if lower_name.endswith(".glb") else ".gltf"
            target_name = f"{dataset_id}_{datetime.now().strftime('%Y%m%d%H%M%S%f')}{ext}"
            target = upload_dir / target_name
            target.write_bytes(await item.read())
            asset_kind = "model_gltf"
        else:
            if not lower_name.endswith(".png"):
                raise HTTPException(status_code=400, detail=f"纹理仅支持 .png: {original_name}")
            target_name = f"{dataset_id}_{datetime.now().strftime('%Y%m%d%H%M%S%f')}.png"
            target = upload_dir / target_name
            target.write_bytes(await item.read())
            asset_kind = "texture_png"

        with get_conn() as conn:
            cursor = conn.execute(
                """
                INSERT INTO published_assets (dataset_id, asset_kind, disk_path)
                VALUES (?, ?, ?)
                """,
                (dataset_id, asset_kind, str(target)),
            )
            conn.commit()
            created.append(
                {
                    "id": cursor.lastrowid,
                    "dataset_id": dataset_id,
                    "asset_kind": asset_kind,
                    "disk_path": str(target),
                    "access_url": _build_asset_access_url(dataset_id, asset_kind, str(target)),
                }
            )

    return {"status": "ok", "items": created}


@app.get("/api/tiles/enc/{dataset_id}/mbtiles/merged.mbtiles/tilejson.json")
def get_enc_tilejson(dataset_id: str, request: Request) -> dict:
    return _build_enc_tilejson(dataset_id, request, "/api/tiles/enc/{dataset_id}/mbtiles/merged.mbtiles")


def _build_enc_tilejson(dataset_id: str, request: Request, tile_base_template: str) -> dict:
    mbtiles_path = _resolve_mbtiles_path(dataset_id)
    metadata = _read_mbtiles_metadata(mbtiles_path)
    minzoom = int(metadata.get("minzoom", "0"))
    maxzoom = int(metadata.get("maxzoom", "14"))
    bounds = metadata.get("bounds", "-180,-85.05112878,180,85.05112878")
    center = metadata.get("center", "0,0,2")
    tile_base = tile_base_template.format(dataset_id=dataset_id)
    tiles_url = str(request.base_url).rstrip("/") + f"{tile_base}/{{z}}/{{x}}/{{y}}.pbf"

    vector_layers: list[dict] = []
    json_metadata_raw = metadata.get("json")
    if json_metadata_raw:
        try:
            parsed = json.loads(json_metadata_raw)
            if isinstance(parsed, dict):
                raw_layers = parsed.get("vector_layers")
                if isinstance(raw_layers, list):
                    vector_layers = raw_layers
        except json.JSONDecodeError:
            vector_layers = []

    payload = {
        "tilejson": "pbf",
        "name": metadata.get("name", f"enc-{dataset_id}"),
        "description": metadata.get("description", ""),
        "version": metadata.get("version", "2"),
        "attribution": metadata.get("attribution", ""),
        "scheme": "xyz",
        "format": "pbf",
        "minzoom": minzoom,
        "maxzoom": maxzoom,
        "bounds": [float(v) for v in bounds.split(",")],
        "center": [float(v) for v in center.split(",")],
        "tiles": [tiles_url],
    }
    if vector_layers:
        payload["vector_layers"] = vector_layers
    return payload


@app.get("/api/tiles/enc/{dataset_id}/mbtiles/merged.mbtiles/{z}/{x}/{y}.pbf")
def get_enc_tile(dataset_id: str, z: int, x: int, y: int) -> Response:
    return _get_enc_tile(dataset_id, z, x, y)


def _get_enc_tile(dataset_id: str, z: int, x: int, y: int) -> Response:
    mbtiles_path = _resolve_mbtiles_path(dataset_id)
    tms_y = (1 << z) - 1 - y
    with sqlite3.connect(mbtiles_path) as conn:
        row = conn.execute(
            """
            SELECT tile_data
            FROM tiles
            WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?
            """,
            (z, x, tms_y),
        ).fetchone()
    if not row:
        # 参考原 Node 服务：瓦片缺失返回 204，避免前端把缺失瓦片当作错误处理。
        return Response(status_code=204)

    tile_data: bytes = row[0]
    headers = {
        "Content-Type": "application/vnd.mapbox-vector-tile",
    }
    # MBTiles 常见存储为 gzip 压缩 MVT；若缺少该响应头，mapbox-gl 会按未压缩 protobuf 解析并报错。
    if len(tile_data) >= 2 and tile_data[0] == 0x1F and tile_data[1] == 0x8B:
        headers["Content-Encoding"] = "gzip"

    return Response(content=tile_data, headers=headers)


@app.get("/api/tiles/hydro/{dataset_id}/{field_kind}/{z}/{x}/{y}.bin")
def get_hydro_tile_bin(dataset_id: str, field_kind: str, z: int, x: int, y: int) -> Response:
    # 优先返回未压缩 .bin；若不存在则回退到 .bin.gz 并设置 gzip 头。
    plain_path = _resolve_hydro_tile_path(dataset_id, field_kind, z, x, y, compressed=False)
    if plain_path.exists():
        return Response(content=plain_path.read_bytes(), media_type="application/octet-stream")

    gz_path = _resolve_hydro_tile_path(dataset_id, field_kind, z, x, y, compressed=True)
    if gz_path.exists():
        return Response(
            content=gz_path.read_bytes(),
            media_type="application/octet-stream",
            headers={"Content-Encoding": "gzip"},
        )

    return Response(status_code=204)


@app.get("/api/tiles/hydro/{dataset_id}/{field_kind}/{z}/{x}/{y}.bin.gz")
def get_hydro_tile_bin_gz(dataset_id: str, field_kind: str, z: int, x: int, y: int) -> Response:
    gz_path = _resolve_hydro_tile_path(dataset_id, field_kind, z, x, y, compressed=True)
    if not gz_path.exists():
        return Response(status_code=204)
    return Response(
        content=gz_path.read_bytes(),
        media_type="application/octet-stream",
        headers={"Content-Encoding": "gzip"},
    )


@app.get("/api/tiles/terrain/{dataset_id}/{z}/{x}/{y}.png")
def get_terrain_tile_png(dataset_id: str, z: int, x: int, y: int) -> Response:
    tile_path = DERIVED_ROOT / "terrain" / dataset_id / str(z) / str(x) / f"{y}.png"
    if not tile_path.exists():
        return Response(status_code=204)
    return Response(content=tile_path.read_bytes(), media_type="image/png")


def _resolve_mbtiles_path(dataset_id: str) -> Path:
    # 约定路径：storage/derived/enc/<dataset_id>/merged.mbtiles
    path = DERIVED_ROOT / "enc" / dataset_id / "merged.mbtiles"
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"MBTiles not found for dataset: {dataset_id}")
    return path


def _read_mbtiles_metadata(path: Path) -> dict[str, str]:
    with sqlite3.connect(path) as conn:
        rows = conn.execute("SELECT name, value FROM metadata").fetchall()
    return {name: value for name, value in rows}


def _resolve_hydro_tile_path(
    dataset_id: str,
    field_kind: str,
    z: int,
    x: int,
    y: int,
    *,
    compressed: bool,
) -> Path:
    kind = field_kind.strip().lower()
    if kind not in {"scalar", "vector"}:
        raise HTTPException(status_code=400, detail=f"Invalid hydro field_kind: {field_kind}")
    suffix = ".bin.gz" if compressed else ".bin"
    return DERIVED_ROOT / "hydro" / dataset_id / kind / str(z) / str(x) / f"{y}{suffix}"


def _build_asset_access_url(dataset_id: str, asset_kind: str, disk_path: str) -> str | None:
    if asset_kind == "enc_mbtiles":
        return f"/api/tiles/enc/{dataset_id}/mbtiles/merged.mbtiles/tilejson.json"
    if asset_kind == "hydro_bin_scalar":
        return f"/api/tiles/hydro/{dataset_id}/scalar/{{z}}/{{x}}/{{y}}.bin"
    if asset_kind == "hydro_bin_vector":
        return f"/api/tiles/hydro/{dataset_id}/vector/{{z}}/{{x}}/{{y}}.bin"
    if asset_kind == "terrain_rgb_png":
        return f"/api/tiles/terrain/{dataset_id}/{{z}}/{{x}}/{{y}}.png"
    if asset_kind == "geojson":
        path = Path(disk_path)
        try:
            relative = path.relative_to(DERIVED_ROOT).as_posix()
        except ValueError:
            return None
        return f"/static/{relative}"
    if asset_kind == "model_gltf":
        path = Path(disk_path)
        try:
            relative = path.relative_to(DERIVED_ROOT).as_posix()
        except ValueError:
            return None
        return f"/static/{relative}"
    if asset_kind == "texture_png":
        path = Path(disk_path)
        try:
            relative = path.relative_to(DERIVED_ROOT).as_posix()
        except ValueError:
            return None
        return f"/static/{relative}"
    return None


app.mount("/static", StaticFiles(directory=DERIVED_ROOT), name="static")
app.mount("/raw", StaticFiles(directory=RAW_ROOT), name="raw")


def _run_enc_build_job(job_id: str, dataset_id: str, input_paths: list[str]) -> None:
    _update_enc_job(job_id, status="running", message="EncTiler 处理中")
    try:
        if not ENCTILER_ROOT.exists():
            raise RuntimeError(f"ENCTILER_ROOT 不存在: {ENCTILER_ROOT}")

        cmd = [
            PYTHON_BIN,
            str(ENCTILER_ROOT / "main.py"),
            *input_paths,
            "--workdir",
            str(ENCTILER_ROOT),
            "--output-name",
            dataset_id,
        ]
        subprocess.run(cmd, check=True, cwd=str(ENCTILER_ROOT))

        source_mbtiles = ENCTILER_ROOT / "output" / dataset_id / "mbtiles" / "merged.mbtiles"
        if not source_mbtiles.exists():
            raise RuntimeError(f"未找到 merged.mbtiles: {source_mbtiles}")

        target_dir = DERIVED_ROOT / "enc" / dataset_id
        target_dir.mkdir(parents=True, exist_ok=True)
        target_mbtiles = target_dir / "merged.mbtiles"
        target_mbtiles.write_bytes(source_mbtiles.read_bytes())

        with get_conn() as conn:
            conn.execute(
                """
                INSERT INTO published_assets (dataset_id, asset_kind, disk_path)
                VALUES (?, ?, ?)
                """,
                (dataset_id, "enc_mbtiles", str(target_mbtiles)),
            )
            conn.commit()

        _update_enc_job(
            job_id,
            status="success",
            message="生成完成",
            merged_mbtiles_path=str(target_mbtiles),
        )
    except Exception as exc:
        _update_enc_job(job_id, status="failed", message=str(exc))


def _update_enc_job(
    job_id: str,
    *,
    status: str,
    message: str,
    merged_mbtiles_path: str | None = None,
) -> None:
    with get_conn() as conn:
        conn.execute(
            """
            UPDATE enc_jobs
            SET status = ?, message = ?, merged_mbtiles_path = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (status, message, merged_mbtiles_path, job_id),
        )
        conn.commit()


def _run_hydro_build_job(
    job_id: str,
    dataset_id: str,
    input_paths: list[str],
    input_format: str,
    field_kind: str,
    variables: list[str],
    min_zoom: int,
    max_zoom: int,
    compress: bool,
    cfgrib_filter: dict | None,
    bbox: list[float] | None,
) -> None:
    _update_hydro_job(job_id, status="running", message="HydroTiler 处理中")
    try:
        if not HYDROTILER_ROOT.exists():
            raise RuntimeError(f"HYDROTILER_ROOT 不存在: {HYDROTILER_ROOT}")

        tiles_dir = DERIVED_ROOT / "hydro" / dataset_id / ("scalar" if field_kind == "scalar" else "vector")
        tiles_dir.mkdir(parents=True, exist_ok=True)
        temp_dir = DERIVED_ROOT / "hydro" / dataset_id / "_tmp"
        temp_dir.mkdir(parents=True, exist_ok=True)
        config_path = DERIVED_ROOT / "hydro" / dataset_id / f"job.{job_id}.json"

        reader_cfg: dict = {}
        if input_format == "grib":
            reader_cfg = {
                "open": {
                    "mode": "cfgrib_filter",
                    "cfgrib_filter": cfgrib_filter or {},
                }
            }

        job_config = {
            "schema_version": 1,
            "input": {
                "format": input_format,
                "paths": input_paths if len(input_paths) > 1 else input_paths[0],
            },
            "field": {
                "kind": field_kind,
                "variables": variables,
            },
            "reader": reader_cfg,
            "tile": {
                "min_zoom": min_zoom,
                "max_zoom": max_zoom,
                "compress": compress,
            },
            "output": {
                "tiles_dir": str(tiles_dir),
                "temp_dir": str(temp_dir),
            },
        }
        if bbox is not None:
            job_config["input"]["bbox"] = bbox
        config_path.write_text(json.dumps(job_config, ensure_ascii=False, indent=2), encoding="utf-8")

        cmd = [
            PYTHON_BIN, 
            str(HYDROTILER_ROOT / "main.py"), 
            "-c", str(config_path)
        ]
        subprocess.run(cmd, check=True, cwd=str(HYDROTILER_ROOT))

        asset_kind = "hydro_bin_scalar" if field_kind == "scalar" else "hydro_bin_vector"
        with get_conn() as conn:
            conn.execute(
                """
                INSERT INTO published_assets (dataset_id, asset_kind, disk_path)
                VALUES (?, ?, ?)
                """,
                (dataset_id, asset_kind, str(tiles_dir)),
            )
            conn.commit()

        _update_hydro_job(
            job_id,
            status="success",
            message="生成完成",
            tiles_dir=str(tiles_dir),
        )
    except Exception as exc:
        _update_hydro_job(job_id, status="failed", message=str(exc), tiles_dir=None)


def _update_hydro_job(
    job_id: str,
    *,
    status: str,
    message: str,
    tiles_dir: str | None = None,
) -> None:
    with get_conn() as conn:
        conn.execute(
            """
            UPDATE hydro_jobs
            SET status = ?, message = ?, tiles_dir = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (status, message, tiles_dir, job_id),
        )
        conn.commit()


def _run_terrain_build_job(
    job_id: str,
    dataset_id: str,
    input_format: str,
    dem_path: str,
    boundary_path: str | None,
    zoom: str,
    tile_size: int,
    workers: int,
    invert_z: bool,
    geojson_z_field: str,
    grid_res_m: float,
    bounds_buffer_m: float,
) -> None:
    _update_terrain_job(job_id, status="running", message="TerrainTiler 处理中")
    try:
        if not TERRAINTILER_ROOT.exists():
            raise RuntimeError(f"TERRAINTILER_ROOT 不存在: {TERRAINTILER_ROOT}")

        tiles_dir = DERIVED_ROOT / "terrain" / dataset_id
        tiles_dir.mkdir(parents=True, exist_ok=True)
        # 注意：tmp 不能放在 dist(tiles_dir) 目录内部。
        # TerrainTiler 在切片阶段可能会重建 dist，若 tmp 在 dist 下会被一并删除，
        # 从而触发后续 rasterio.open(rgbified_dem) 找不到文件。
        tmp_dir = DERIVED_ROOT / "terrain" / "_tmp" / dataset_id / job_id
        tmp_dir.mkdir(parents=True, exist_ok=True)

        cmd = [
            PYTHON_BIN,
            str(TERRAINTILER_ROOT / "main.py"),
            "--dem",
            dem_path,
            "--dist",
            str(tiles_dir),
            "--zoom",
            zoom,
            "--tmp",
            str(tmp_dir),
            "--tile-size",
            str(tile_size),
            "--workers",
            str(workers),
        ]
        if input_format == "geojson":
            if not boundary_path:
                raise RuntimeError("geojson 输入缺少 boundary_path")
            cmd.extend(
                [
                    "--input-type",
                    "geojson",
                    "--boundary",
                    boundary_path,
                    "--geojson-z-field",
                    geojson_z_field,
                    "--grid-res-m",
                    str(grid_res_m),
                    "--bounds-buffer-m",
                    str(bounds_buffer_m),
                ]
            )
        if invert_z:
            cmd.append("--invert-z")

        subprocess.run(cmd, check=True, cwd=str(TERRAINTILER_ROOT))

        with get_conn() as conn:
            conn.execute(
                """
                INSERT INTO published_assets (dataset_id, asset_kind, disk_path)
                VALUES (?, ?, ?)
                """,
                (dataset_id, "terrain_rgb_png", str(tiles_dir)),
            )
            conn.commit()

        _update_terrain_job(job_id, status="success", message="生成完成", tiles_dir=str(tiles_dir))
    except Exception as exc:
        _update_terrain_job(job_id, status="failed", message=str(exc), tiles_dir=None)


def _update_terrain_job(
    job_id: str,
    *,
    status: str,
    message: str,
    tiles_dir: str | None = None,
) -> None:
    with get_conn() as conn:
        conn.execute(
            """
            UPDATE terrain_jobs
            SET status = ?, message = ?, tiles_dir = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (status, message, tiles_dir, job_id),
        )
        conn.commit()

