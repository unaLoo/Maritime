from __future__ import annotations

import json
import sqlite3
from contextlib import contextmanager

from .config import SQLITE_PATH


@contextmanager
def get_conn():
    SQLITE_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(SQLITE_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def init_db() -> None:
    with get_conn() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS scenes (
                id TEXT PRIMARY KEY,
                payload_json TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS published_assets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                dataset_id TEXT NOT NULL,
                asset_kind TEXT NOT NULL,
                disk_path TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS enc_chart_files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                original_name TEXT NOT NULL,
                stored_path TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS enc_jobs (
                id TEXT PRIMARY KEY,
                dataset_id TEXT NOT NULL,
                chart_file_ids_json TEXT NOT NULL,
                status TEXT NOT NULL,
                message TEXT,
                merged_mbtiles_path TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS hydro_input_files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                original_name TEXT NOT NULL,
                stored_path TEXT NOT NULL,
                input_format TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS hydro_jobs (
                id TEXT PRIMARY KEY,
                dataset_id TEXT NOT NULL,
                input_file_ids_json TEXT NOT NULL,
                input_format TEXT NOT NULL,
                field_kind TEXT NOT NULL,
                variables_json TEXT NOT NULL,
                status TEXT NOT NULL,
                message TEXT,
                tiles_dir TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS terrain_input_files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                original_name TEXT NOT NULL,
                stored_path TEXT NOT NULL,
                input_format TEXT NOT NULL,
                file_role TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS terrain_jobs (
                id TEXT PRIMARY KEY,
                dataset_id TEXT NOT NULL,
                input_format TEXT NOT NULL,
                dem_file_id INTEGER NOT NULL,
                boundary_file_id INTEGER,
                status TEXT NOT NULL,
                message TEXT,
                tiles_dir TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            """
        )

        has_default = conn.execute("SELECT 1 FROM scenes WHERE id = ?", ("default",)).fetchone()
        if not has_default:
            default_scene = {
                "version": 1,
                "name": "default-scene",
                "view": {"center": [114.02814, 22.4729], "zoom": 10, "bearing": 0, "pitch": 45},
                "layers": [
                ],
            }
            conn.execute(
                "INSERT INTO scenes (id, payload_json) VALUES (?, ?)",
                ("default", json.dumps(default_scene, ensure_ascii=False)),
            )
        conn.commit()

