import { useEffect, useState } from "react";
import {
  fetchAssets,
  fetchEncChartFiles,
  fetchEncJobs,
  fetchHydroInputFiles,
  fetchHydroJobs,
  fetchTerrainInputFiles,
  fetchTerrainJobs,
  triggerEncBuild,
  triggerHydroBuild,
  triggerTerrainBuild,
  uploadVisualizationAssets,
  uploadEncChartFiles,
  uploadHydroInputFile,
  uploadTerrainInputFile
} from "../api/client";
import type {
  AssetRecord,
  EncBuildJobRecord,
  EncChartFileRecord,
  HydroInputFileRecord,
  HydroJobRecord,
  TerrainInputFileRecord,
  TerrainJobRecord
} from "../types";

type DataTab = "enc" | "hydro" | "terrain" | "visual";

export function DataManagementPage() {
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [charts, setCharts] = useState<EncChartFileRecord[]>([]);
  const [jobs, setJobs] = useState<EncBuildJobRecord[]>([]);
  const [hydroFiles, setHydroFiles] = useState<HydroInputFileRecord[]>([]);
  const [hydroJobs, setHydroJobs] = useState<HydroJobRecord[]>([]);
  const [terrainFiles, setTerrainFiles] = useState<TerrainInputFileRecord[]>([]);
  const [terrainJobs, setTerrainJobs] = useState<TerrainJobRecord[]>([]);
  const [selectedChartIds, setSelectedChartIds] = useState<number[]>([]);
  const [selectedHydroFileIds, setSelectedHydroFileIds] = useState<number[]>([]);
  const [datasetId, setDatasetId] = useState("");
  const [hydroDatasetId, setHydroDatasetId] = useState("");
  const [hydroInputFormat, setHydroInputFormat] = useState<"grib" | "geojson">("grib");
  const [hydroFieldKind, setHydroFieldKind] = useState<"scalar" | "vector">("scalar");
  const [hydroVariablesText, setHydroVariablesText] = useState("t");
  const [cfgribFilterText, setCfgribFilterText] = useState('{"shortName":"10u"}');
  const [hydroBboxText, setHydroBboxText] = useState("");
  const [terrainDatasetId, setTerrainDatasetId] = useState("");
  const [terrainInputFormat, setTerrainInputFormat] = useState<"geotiff" | "geojson">("geotiff");
  const [terrainUploadRole, setTerrainUploadRole] = useState<"dem" | "boundary">("dem");
  const [terrainDemFileId, setTerrainDemFileId] = useState("");
  const [terrainBoundaryFileId, setTerrainBoundaryFileId] = useState("");
  const [terrainZoom, setTerrainZoom] = useState("1-9");
  const [terrainZField, setTerrainZField] = useState("elevation");
  const [terrainGridResM, setTerrainGridResM] = useState("10");
  const [terrainBoundsBufferM, setTerrainBoundsBufferM] = useState("0");
  const [terrainInvertZ, setTerrainInvertZ] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingHydroFile, setPendingHydroFile] = useState<File | null>(null);
  const [pendingTerrainFile, setPendingTerrainFile] = useState<File | null>(null);
  const [pendingVisualFiles, setPendingVisualFiles] = useState<File[]>([]);
  const [visualAssetType, setVisualAssetType] = useState<"geojson" | "model" | "texture">("geojson");
  const [activeTab, setActiveTab] = useState<DataTab>("enc");

  const encAssets = assets.filter((row) => row.asset_kind === "enc_mbtiles");
  const hydroAssets = assets.filter(
    (row) => row.asset_kind === "hydro_bin_scalar" || row.asset_kind === "hydro_bin_vector"
  );
  const terrainAssets = assets.filter((row) => row.asset_kind === "terrain_rgb_png");
  const visualAssets = assets.filter(
    (row) =>
      row.asset_kind === "geojson" ||
      row.asset_kind === "model_gltf" ||
      row.asset_kind === "texture_png"
  );
  const visualGeojsonAssets = visualAssets.filter((row) => row.asset_kind === "geojson");
  const visualModelAssets = visualAssets.filter((row) => row.asset_kind === "model_gltf");
  const visualTextureAssets = visualAssets.filter((row) => row.asset_kind === "texture_png");

  useEffect(() => {
    void reloadAll();
  }, []);

  async function reloadAll() {
    setLoading(true);
    setError("");
    try {
      const [assetRows, chartRows, jobRows, hydroFileRows, hydroJobRows, terrainFileRows, terrainJobRows] = await Promise.all([
        fetchAssets(),
        fetchEncChartFiles(),
        fetchEncJobs(),
        fetchHydroInputFiles(),
        fetchHydroJobs(),
        fetchTerrainInputFiles(),
        fetchTerrainJobs()
      ]);
      setAssets(assetRows);
      setCharts(chartRows);
      setJobs(jobRows);
      setHydroFiles(hydroFileRows);
      setHydroJobs(hydroJobRows);
      setTerrainFiles(terrainFileRows);
      setTerrainJobs(terrainJobRows);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function onUploadCharts() {
    if (pendingFiles.length === 0) {
      setError("请先选择一个或多个 .000 文件。");
      return;
    }
    setError("");
    try {
      await uploadEncChartFiles(pendingFiles);
      setPendingFiles([]);
      await reloadAll();
    } catch (err) {
      setError(String(err));
    }
  }

  async function onTriggerBuild() {
    if (!datasetId.trim()) {
      setError("请填写 Dataset ID。");
      return;
    }
    if (selectedChartIds.length === 0) {
      setError("请至少勾选一个海图文件。");
      return;
    }
    setError("");
    try {
      await triggerEncBuild({
        dataset_id: datasetId.trim(),
        chart_file_ids: selectedChartIds
      });
      setSelectedChartIds([]);
      await reloadAll();
    } catch (err) {
      setError(String(err));
    }
  }

  function toggleChartSelection(id: number) {
    setSelectedChartIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }

  function toggleHydroSelection(id: number) {
    setSelectedHydroFileIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  }

  async function onUploadHydroInput() {
    if (!pendingHydroFile) {
      setError("请先选择 Hydro 输入文件。");
      return;
    }
    setError("");
    try {
      await uploadHydroInputFile(pendingHydroFile, hydroInputFormat);
      setPendingHydroFile(null);
      await reloadAll();
    } catch (err) {
      setError(String(err));
    }
  }

  async function onTriggerHydroBuild() {
    if (!hydroDatasetId.trim()) {
      setError("请填写 Hydro Dataset ID。");
      return;
    }
    if (selectedHydroFileIds.length === 0) {
      setError("请至少勾选一个 Hydro 输入文件。");
      return;
    }
    const variables = hydroVariablesText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (hydroFieldKind === "scalar" && variables.length !== 1) {
      setError("标量场 variables 只能填写 1 个变量（例如 t）。");
      return;
    }
    if (hydroFieldKind === "vector" && variables.length !== 2) {
      setError("矢量场 variables 需要填写 2 个变量（例如 u,v）。");
      return;
    }

    let cfgribFilter: Record<string, unknown> | undefined = undefined;
    if (hydroInputFormat === "grib") {
      try {
        cfgribFilter = JSON.parse(cfgribFilterText);
      } catch {
        setError("cfgrib_filter 必须是合法 JSON。");
        return;
      }
    }

    let bbox: [number, number, number, number] | undefined = undefined;
    if (hydroBboxText.trim()) {
      const nums = hydroBboxText
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => Number.isFinite(n));
      if (nums.length !== 4) {
        setError("bbox 格式错误，请填写: lon_min,lat_min,lon_max,lat_max");
        return;
      }
      bbox = [nums[0], nums[1], nums[2], nums[3]];
    }

    setError("");
    try {
      await triggerHydroBuild({
        dataset_id: hydroDatasetId.trim(),
        input_file_ids: selectedHydroFileIds,
        input_format: hydroInputFormat,
        field_kind: hydroFieldKind,
        variables,
        min_zoom: 0,
        max_zoom: 7,
        compress: true,
        cfgrib_filter: cfgribFilter,
        bbox
      });
      setSelectedHydroFileIds([]);
      await reloadAll();
    } catch (err) {
      setError(String(err));
    }
  }

  async function onUploadVisualAssets() {
    if (pendingVisualFiles.length === 0) {
      setError("请先选择一个或多个可视化资源文件。");
      return;
    }
    setError("");
    try {
      await uploadVisualizationAssets(pendingVisualFiles, visualAssetType);
      setPendingVisualFiles([]);
      await reloadAll();
    } catch (err) {
      setError(String(err));
    }
  }

  async function onUploadTerrainInput() {
    if (!pendingTerrainFile) {
      setError("请先选择 Terrain 输入文件。");
      return;
    }
    if (terrainInputFormat === "geotiff" && terrainUploadRole !== "dem") {
      setError("GeoTIFF 仅支持作为 dem 上传。");
      return;
    }
    setError("");
    try {
      await uploadTerrainInputFile({
        file: pendingTerrainFile,
        inputFormat: terrainInputFormat,
        fileRole: terrainUploadRole
      });
      setPendingTerrainFile(null);
      await reloadAll();
    } catch (err) {
      setError(String(err));
    }
  }

  async function onTriggerTerrainBuild() {
    const datasetId = terrainDatasetId.trim();
    if (!datasetId) {
      setError("请填写 Terrain Dataset ID。");
      return;
    }
    const demId = Number(terrainDemFileId);
    if (!Number.isInteger(demId) || demId <= 0) {
      setError("请选择有效的 DEM 文件 ID。");
      return;
    }
    let boundaryId: number | undefined = undefined;
    if (terrainInputFormat === "geojson") {
      boundaryId = Number(terrainBoundaryFileId);
      if (!Number.isInteger(boundaryId) || boundaryId <= 0) {
        setError("GeoJSON 模式请填写有效的 boundary 文件 ID。");
        return;
      }
    }

    const gridResM = Number(terrainGridResM);
    const boundsBufferM = Number(terrainBoundsBufferM);
    if (!Number.isFinite(gridResM) || gridResM <= 0) {
      setError("grid_res_m 必须是正数。");
      return;
    }
    if (!Number.isFinite(boundsBufferM) || boundsBufferM < 0) {
      setError("bounds_buffer_m 不能为负数。");
      return;
    }

    setError("");
    try {
      await triggerTerrainBuild({
        dataset_id: datasetId,
        input_format: terrainInputFormat,
        dem_file_id: demId,
        boundary_file_id: boundaryId,
        zoom: terrainZoom.trim() || "1-9",
        invert_z: terrainInvertZ,
        geojson_z_field: terrainZField.trim() || "elevation",
        grid_res_m: gridResM,
        bounds_buffer_m: boundsBufferM
      });
      await reloadAll();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <div className="page">
      <div className="panel">
        <div className="data-tabs-header">
          <div className="page-tabs">
            <button className={activeTab === "enc" ? "active" : ""} onClick={() => setActiveTab("enc")}>
              海图
            </button>
            <button className={activeTab === "hydro" ? "active" : ""} onClick={() => setActiveTab("hydro")}>
              水文场
            </button>
            <button className={activeTab === "terrain" ? "active" : ""} onClick={() => setActiveTab("terrain")}>
              地形
            </button>
            <button className={activeTab === "visual" ? "active" : ""} onClick={() => setActiveTab("visual")}>
              其他可视化资源
            </button>
          </div>
          <button
            className="icon-refresh-btn"
            onClick={() => void reloadAll()}
            disabled={loading}
            title="刷新当前数据"
            aria-label="刷新当前数据"
          >
            {loading ? "…" : "↻"}
          </button>
        </div>
      </div>

      {activeTab === "enc" ? (
        <>
          <div className="panel">
            <div className="panel-title">ENC S-57 .000 文件上传</div>
            <div className="inline-form">
              <input
                type="file"
                accept=".000"
                multiple
                onChange={(e) => setPendingFiles(Array.from(e.target.files ?? []))}
              />
              <button onClick={() => void onUploadCharts()}>上传海图文件</button>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">ENC 瓦片构建</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>选择</th>
                    <th>ID</th>
                    <th>文件名</th>
                    <th>存储路径</th>
                    <th>上传时间</th>
                  </tr>
                </thead>
                <tbody>
                  {charts.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedChartIds.includes(row.id)}
                          onChange={() => toggleChartSelection(row.id)}
                        />
                      </td>
                      <td>{row.id}</td>
                      <td>{row.original_name}</td>
                      <td title={row.stored_path}>{row.stored_path}</td>
                      <td>{row.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="inline-form">
              <label>
                Dataset ID
                <input value={datasetId} onChange={(e) => setDatasetId(e.target.value)} required />
              </label>
              <button onClick={() => void onTriggerBuild()}>构建矢量瓦片</button>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">任务状态</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Dataset</th>
                    <th>状态</th>
                    <th>消息</th>
                    <th>merged.mbtiles</th>
                    <th>更新时间</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.dataset_id}</td>
                      <td>{row.status}</td>
                      <td title={row.message}>{row.message}</td>
                      <td title={row.merged_mbtiles_path ?? ""}>{row.merged_mbtiles_path ?? "-"}</td>
                      <td>{row.updated_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">已发布数据（ENC）</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Dataset</th>
                    <th>Kind</th>
                    <th>Path</th>
                    <th>URL</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {encAssets.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.dataset_id}</td>
                      <td>{row.asset_kind}</td>
                      <td title={row.disk_path}>{row.disk_path}</td>
                      <td title={row.access_url ?? ""}>
                        {row.access_url ? (
                          <a href={row.access_url} target="_blank" rel="noreferrer">
                            {row.access_url}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{row.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}

      {activeTab === "hydro" ? (
        <>
          <div className="panel">
            <div className="panel-title">Hydro 原文件上传（GRIB / GeoJSON）</div>
            <div className="inline-form">
              <label>
                输入格式
                <select
                  value={hydroInputFormat}
                  onChange={(e) => setHydroInputFormat(e.target.value as "grib" | "geojson")}
                >
                  <option value="grib">grib</option>
                  <option value="geojson">geojson</option>
                </select>
              </label>
              <input
                type="file"
                accept={hydroInputFormat === "grib" ? ".grib,.grb" : ".geojson,.json"}
                onChange={(e) => setPendingHydroFile(e.target.files?.[0] ?? null)}
              />
              <button onClick={() => void onUploadHydroInput()}>上传 Hydro 输入文件</button>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">Hydro 瓦片构建</div>
            <div className="inline-form">
              <label>
                Dataset ID
                <input value={hydroDatasetId} onChange={(e) => setHydroDatasetId(e.target.value)} />
              </label>
              <label>
                输入格式
                <select
                  value={hydroInputFormat}
                  onChange={(e) => setHydroInputFormat(e.target.value as "grib" | "geojson")}
                >
                  <option value="grib">grib</option>
                  <option value="geojson">geojson</option>
                </select>
              </label>
              <label>
                场类型
                <select
                  value={hydroFieldKind}
                  onChange={(e) => setHydroFieldKind(e.target.value as "scalar" | "vector")}
                >
                  <option value="scalar">scalar</option>
                  <option value="vector">vector</option>
                </select>
              </label>
              <label>
                Variables
                <input
                  value={hydroVariablesText}
                  onChange={(e) => setHydroVariablesText(e.target.value)}
                  placeholder="scalar:t | vector:u,v"
                />
              </label>
              <label>
                bbox(可选)
                <input
                  value={hydroBboxText}
                  onChange={(e) => setHydroBboxText(e.target.value)}
                  placeholder="lon_min,lat_min,lon_max,lat_max"
                />
              </label>
              {hydroInputFormat === "grib" ? (
                <label>
                  cfgrib_filter(JSON)
                  <input value={cfgribFilterText} onChange={(e) => setCfgribFilterText(e.target.value)} />
                </label>
              ) : null}
              <button onClick={() => void onTriggerHydroBuild()}>构建水文场瓦片</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>选择</th>
                    <th>ID</th>
                    <th>文件名</th>
                    <th>格式</th>
                    <th>路径</th>
                    <th>上传时间</th>
                  </tr>
                </thead>
                <tbody>
                  {hydroFiles.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedHydroFileIds.includes(row.id)}
                          onChange={() => toggleHydroSelection(row.id)}
                        />
                      </td>
                      <td>{row.id}</td>
                      <td>{row.original_name}</td>
                      <td>{row.input_format}</td>
                      <td title={row.stored_path}>{row.stored_path}</td>
                      <td>{row.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">任务状态</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Dataset</th>
                    <th>格式</th>
                    <th>场类型</th>
                    <th>变量</th>
                    <th>状态</th>
                    <th>消息</th>
                    <th>tiles_dir</th>
                    <th>更新时间</th>
                  </tr>
                </thead>
                <tbody>
                  {hydroJobs.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.dataset_id}</td>
                      <td>{row.input_format}</td>
                      <td>{row.field_kind}</td>
                      <td>{row.variables.join(",")}</td>
                      <td>{row.status}</td>
                      <td title={row.message}>{row.message}</td>
                      <td title={row.tiles_dir ?? ""}>{row.tiles_dir ?? "-"}</td>
                      <td>{row.updated_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">已发布数据（Hydro）</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Dataset</th>
                    <th>Kind</th>
                    <th>Path</th>
                    <th>URL</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {hydroAssets.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.dataset_id}</td>
                      <td>{row.asset_kind}</td>
                      <td title={row.disk_path}>{row.disk_path}</td>
                      <td title={row.access_url ?? ""}>
                        {row.access_url ? (
                          <a href={row.access_url} target="_blank" rel="noreferrer">
                            {row.access_url}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{row.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}

      {activeTab === "terrain" ? (
        <>
          <div className="panel">
            <div className="panel-title">Terrain 输入上传（GeoTIFF / GeoJSON）</div>
            <div className="inline-form">
              <label>
                输入格式
                <select
                  value={terrainInputFormat}
                  onChange={(e) => {
                    const v = e.target.value as "geotiff" | "geojson";
                    setTerrainInputFormat(v);
                    if (v === "geotiff") setTerrainUploadRole("dem");
                  }}
                >
                  <option value="geotiff">geotiff</option>
                  <option value="geojson">geojson</option>
                </select>
              </label>
              <label>
                文件角色
                <select
                  value={terrainUploadRole}
                  onChange={(e) => setTerrainUploadRole(e.target.value as "dem" | "boundary")}
                  disabled={terrainInputFormat === "geotiff"}
                >
                  <option value="dem">dem</option>
                  <option value="boundary">boundary</option>
                </select>
              </label>
              <input
                type="file"
                accept={terrainInputFormat === "geotiff" ? ".tif,.tiff" : ".geojson,.json"}
                onChange={(e) => setPendingTerrainFile(e.target.files?.[0] ?? null)}
              />
              <button onClick={() => void onUploadTerrainInput()}>上传 Terrain 输入文件</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>文件名</th>
                    <th>格式</th>
                    <th>角色</th>
                    <th>路径</th>
                    <th>上传时间</th>
                  </tr>
                </thead>
                <tbody>
                  {terrainFiles.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.original_name}</td>
                      <td>{row.input_format}</td>
                      <td>{row.file_role}</td>
                      <td title={row.stored_path}>{row.stored_path}</td>
                      <td>{row.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">Terrain 构建（Terrain-RGB PNG）</div>
            <div className="inline-form">
              <label>
                Dataset ID
                <input value={terrainDatasetId} onChange={(e) => setTerrainDatasetId(e.target.value)} />
              </label>
              <label>
                输入格式
                <select
                  value={terrainInputFormat}
                  onChange={(e) => setTerrainInputFormat(e.target.value as "geotiff" | "geojson")}
                >
                  <option value="geotiff">geotiff</option>
                  <option value="geojson">geojson</option>
                </select>
              </label>
              <label>
                DEM 文件 ID
                <input value={terrainDemFileId} onChange={(e) => setTerrainDemFileId(e.target.value)} />
              </label>
              {terrainInputFormat === "geojson" ? (
                <label>
                  Boundary 文件 ID
                  <input
                    value={terrainBoundaryFileId}
                    onChange={(e) => setTerrainBoundaryFileId(e.target.value)}
                  />
                </label>
              ) : null}
              <label>
                zoom
                <input value={terrainZoom} onChange={(e) => setTerrainZoom(e.target.value)} placeholder="1-9" />
              </label>
              <label>
                invert_z
                <input
                  type="checkbox"
                  checked={terrainInvertZ}
                  onChange={(e) => setTerrainInvertZ(e.target.checked)}
                />
              </label>
              {terrainInputFormat === "geojson" ? (
                <>
                  <label>
                    geojson_z_field
                    <input value={terrainZField} onChange={(e) => setTerrainZField(e.target.value)} />
                  </label>
                  <label>
                    grid_res_m
                    <input value={terrainGridResM} onChange={(e) => setTerrainGridResM(e.target.value)} />
                  </label>
                  <label>
                    bounds_buffer_m
                    <input
                      value={terrainBoundsBufferM}
                      onChange={(e) => setTerrainBoundsBufferM(e.target.value)}
                    />
                  </label>
                </>
              ) : null}
              <button onClick={() => void onTriggerTerrainBuild()}>构建 Terrain</button>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">Terrain 任务状态</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Dataset</th>
                    <th>格式</th>
                    <th>DEM ID</th>
                    <th>Boundary ID</th>
                    <th>状态</th>
                    <th>消息</th>
                    <th>tiles_dir</th>
                    <th>更新时间</th>
                  </tr>
                </thead>
                <tbody>
                  {terrainJobs.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.dataset_id}</td>
                      <td>{row.input_format}</td>
                      <td>{row.dem_file_id}</td>
                      <td>{row.boundary_file_id ?? "-"}</td>
                      <td>{row.status}</td>
                      <td title={row.message}>{row.message}</td>
                      <td title={row.tiles_dir ?? ""}>{row.tiles_dir ?? "-"}</td>
                      <td>{row.updated_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">已发布数据（Terrain）</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Dataset</th>
                    <th>Kind</th>
                    <th>Path</th>
                    <th>URL</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {terrainAssets.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.dataset_id}</td>
                      <td>{row.asset_kind}</td>
                      <td title={row.disk_path}>{row.disk_path}</td>
                      <td title={row.access_url ?? ""}>
                        {row.access_url ? (
                          <a href={row.access_url} target="_blank" rel="noreferrer">
                            {row.access_url}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{row.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}

      {activeTab === "visual" ? (
        <>
          <div className="panel">
            <div className="panel-title">其他可视化资源上传（GeoJSON / GLTF / PNG）</div>
            <div className="inline-form">
              <label>
                资源类型
                <select
                  value={visualAssetType}
                  onChange={(e) => setVisualAssetType(e.target.value as "geojson" | "model" | "texture")}
                >
                  <option value="geojson">geojson</option>
                  <option value="model">model(gltf/glb)</option>
                  <option value="texture">texture(png)</option>
                </select>
              </label>
              <input
                type="file"
                accept={
                  visualAssetType === "geojson"
                    ? ".geojson,.json"
                    : visualAssetType === "model"
                    ? ".gltf,.glb"
                    : ".png"
                }
                multiple
                onChange={(e) => setPendingVisualFiles(Array.from(e.target.files ?? []))}
              />
              <button onClick={() => void onUploadVisualAssets()}>上传可视化资源</button>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">已发布数据（其他可视化资源）</div>

            <div className="panel-title visual-section-title">GeoJSON</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Dataset</th>
                    <th>Kind</th>
                    <th>Path</th>
                    <th>URL</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {visualGeojsonAssets.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.dataset_id}</td>
                      <td>{row.asset_kind}</td>
                      <td title={row.disk_path}>{row.disk_path}</td>
                      <td title={row.access_url ?? ""}>
                        {row.access_url ? (
                          <a href={row.access_url} target="_blank" rel="noreferrer">
                            {row.access_url}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{row.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel-title visual-section-title">Models (GLTF/GLB)</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Dataset</th>
                    <th>Kind</th>
                    <th>Path</th>
                    <th>URL</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {visualModelAssets.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.dataset_id}</td>
                      <td>{row.asset_kind}</td>
                      <td title={row.disk_path}>{row.disk_path}</td>
                      <td title={row.access_url ?? ""}>
                        {row.access_url ? (
                          <a href={row.access_url} target="_blank" rel="noreferrer">
                            {row.access_url}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{row.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel-title visual-section-title">Textures (PNG)</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Dataset</th>
                    <th>Kind</th>
                    <th>Path</th>
                    <th>URL</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {visualTextureAssets.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.dataset_id}</td>
                      <td>{row.asset_kind}</td>
                      <td title={row.disk_path}>{row.disk_path}</td>
                      <td title={row.access_url ?? ""}>
                        {row.access_url ? (
                          <a href={row.access_url} target="_blank" rel="noreferrer">
                            {row.access_url}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{row.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
      {!!error && <div className="error">{error}</div>}
    </div>
  );
}

