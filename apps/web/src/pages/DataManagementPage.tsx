import {
  ArrowUpRight,
  FolderOpen,
  HardDriveUpload,
  Layers3,
  RefreshCw,
  ShipWheel,
  Waves,
  Mountain,
  Wind
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import {
  fetchAssets,
  fetchDynamicInputFiles,
  fetchEncChartFiles,
  fetchEncJobs,
  fetchHydroInputFiles,
  fetchHydroJobs,
  fetchTerrainInputFiles,
  fetchTerrainJobs,
  triggerEncBuild,
  triggerHydroBuild,
  triggerTerrainBuild,
  uploadDynamicInputFolder,
  uploadVisualizationAssets,
  uploadEncChartFiles,
  uploadHydroInputFile,
  uploadTerrainInputFile
} from "../api/client";
import type {
  AssetRecord,
  DynamicInputFileRecord,
  EncBuildJobRecord,
  EncChartFileRecord,
  HydroInputFileRecord,
  HydroJobRecord,
  TerrainInputFileRecord,
  TerrainJobRecord
} from "../types";

type DataTab = "enc" | "hydro" | "terrain" | "dynamic" | "visual";

const folderUploadInputAttrs = {
  webkitdirectory: "true",
  directory: "true"
} as unknown as InputHTMLAttributes<HTMLInputElement>;

export function DataManagementPage() {
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [charts, setCharts] = useState<EncChartFileRecord[]>([]);
  const [jobs, setJobs] = useState<EncBuildJobRecord[]>([]);
  const [hydroFiles, setHydroFiles] = useState<HydroInputFileRecord[]>([]);
  const [hydroJobs, setHydroJobs] = useState<HydroJobRecord[]>([]);
  const [terrainFiles, setTerrainFiles] = useState<TerrainInputFileRecord[]>([]);
  const [dynamicFiles, setDynamicFiles] = useState<DynamicInputFileRecord[]>([]);
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
  const [pendingDynamicFiles, setPendingDynamicFiles] = useState<File[]>([]);
  const [pendingVisualFiles, setPendingVisualFiles] = useState<File[]>([]);
  const [visualAssetType, setVisualAssetType] = useState<"geojson" | "model" | "texture">("geojson");
  const [activeTab, setActiveTab] = useState<DataTab>("enc");
  const dynamicFolderInputRef = useRef<HTMLInputElement | null>(null);

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
  const dynamicFolderName =
    pendingDynamicFiles[0] &&
    (pendingDynamicFiles[0] as File & { webkitRelativePath?: string }).webkitRelativePath
      ? ((pendingDynamicFiles[0] as File & { webkitRelativePath?: string }).webkitRelativePath ?? "").split("/")[0]
      : "";

  useEffect(() => {
    void reloadAll();
  }, []);

  async function reloadAll() {
    setLoading(true);
    setError("");
    try {
      const [assetRows, chartRows, jobRows, hydroFileRows, hydroJobRows, terrainFileRows, terrainJobRows, dynamicFileRows] = await Promise.all([
        fetchAssets(),
        fetchEncChartFiles(),
        fetchEncJobs(),
        fetchHydroInputFiles(),
        fetchHydroJobs(),
        fetchTerrainInputFiles(),
        fetchTerrainJobs(),
        fetchDynamicInputFiles()
      ]);
      setAssets(assetRows);
      setCharts(chartRows);
      setJobs(jobRows);
      setHydroFiles(hydroFileRows);
      setHydroJobs(hydroJobRows);
      setTerrainFiles(terrainFileRows);
      setTerrainJobs(terrainJobRows);
      setDynamicFiles(dynamicFileRows);
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

  async function onUploadDynamicInputFolder() {
    if (pendingDynamicFiles.length === 0) {
      setError("请先选择 Dynamic 输入文件夹。");
      return;
    }
    setError("");
    try {
      await uploadDynamicInputFolder(pendingDynamicFiles, dynamicFolderName || "dynamic");
      setPendingDynamicFiles([]);
      if (dynamicFolderInputRef.current) dynamicFolderInputRef.current.value = "";
      await reloadAll();
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <div className="page">
      <div className="panel page-hero">
        <div className="page-hero-main">
          <div>
            <div className="page-eyebrow">Data Workspace</div>
            <div className="page-title-row">
              <h1 className="page-title">数据管理</h1>
            </div>
            <p className="page-description">可视化资源上传、处理与发布</p>
          </div>
        </div>
        <div className="page-hero-actions">
          <button
            className="secondary-btn icon-btn"
            onClick={() => void reloadAll()}
            disabled={loading}
            title="刷新当前数据"
            aria-label="刷新当前数据"
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            <span>刷新</span>
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="data-tabs-header">
          <div className="page-tabs">
            <button className={activeTab === "enc" ? "active" : ""} onClick={() => setActiveTab("enc")}>
              <ShipWheel size={15} />
              <span>海图</span>
            </button>
            <button className={activeTab === "hydro" ? "active" : ""} onClick={() => setActiveTab("hydro")}>
              <Waves size={15} />
              <span>水文场</span>
            </button>
            <button className={activeTab === "terrain" ? "active" : ""} onClick={() => setActiveTab("terrain")}>
              <Mountain size={15} />
              <span>地形</span>
            </button>
            <button className={activeTab === "dynamic" ? "active" : ""} onClick={() => setActiveTab("dynamic")}>
              <Wind size={15} />
              <span>水动力场</span>
            </button>
            <button className={activeTab === "visual" ? "active" : ""} onClick={() => setActiveTab("visual")}>
              <Layers3 size={15} />
              <span>其他可视化资源</span>
            </button>
          </div>
          <div className="section-meta">共 {assets.length} 个已发布资产</div>
        </div>
      </div>

      {activeTab === "enc" ? (
        <>
          <SectionPanel
            title="ENC S-57 .000 文件上传"
            description="上传原始海图数据，作为后续瓦片构建的输入源。"
            accent="blue"
          >
            <div className="inline-form">
              <input
                type="file"
                accept=".000"
                multiple
                onChange={(e) => setPendingFiles(Array.from(e.target.files ?? []))}
              />
              <button className="primary-btn" onClick={() => void onUploadCharts()}>
                <HardDriveUpload size={16} />
                <span>上传海图文件</span>
              </button>
            </div>
          </SectionPanel>
          <SectionPanel
            title="ENC 瓦片构建"
            description="选择海图文件，填写数据集标识并触发构建。"
            accent="blue"
          >
            <DataTable
              columns={["选择", "ID", "文件名", "存储路径", "上传时间"]}
              emptyText="暂无海图文件，请先上传。"
              rows={charts.map((row) => (
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
                  <td title={row.stored_path} className="cell-muted">{row.stored_path}</td>
                  <td>{row.created_at}</td>
                </tr>
              ))}
            />
            <div className="inline-form">
              <label>
                Dataset ID
                <input value={datasetId} onChange={(e) => setDatasetId(e.target.value)} required />
              </label>
              <button className="primary-btn" onClick={() => void onTriggerBuild()}>
                <Layers3 size={16} />
                <span>构建矢量瓦片</span>
              </button>
            </div>
          </SectionPanel>
          <SectionPanel title="任务状态" description="实时查看构建进度、产出路径和错误消息。">
            <DataTable
              columns={["Job ID", "Dataset", "状态", "消息", "merged.mbtiles", "更新时间"]}
              emptyText="暂无任务记录。"
              rows={jobs.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.dataset_id}</td>
                  <td><StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge></td>
                  <td title={row.message} className="cell-muted">{row.message}</td>
                  <td title={row.merged_mbtiles_path ?? ""} className="cell-muted">{row.merged_mbtiles_path ?? "-"}</td>
                  <td>{row.updated_at}</td>
                </tr>
              ))}
            />
          </SectionPanel>
          <SectionPanel title="已发布数据（ENC）" description="发布后的数据资产，保持原有字段与访问链接。">
            <AssetTable rows={encAssets} />
          </SectionPanel>
        </>
      ) : null}

      {activeTab === "hydro" ? (
        <>
          <SectionPanel title="Hydro 原文件上传（GRIB / GeoJSON）" description="管理原始水文输入文件。">
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
              <button className="primary-btn" onClick={() => void onUploadHydroInput()}>
                <HardDriveUpload size={16} />
                <span>上传 Hydro 输入文件</span>
              </button>
            </div>
          </SectionPanel>
          <SectionPanel title="Hydro 瓦片构建" description="通过变量、bbox 和格式选项控制构建过程。">
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
              <button className="primary-btn" onClick={() => void onTriggerHydroBuild()}>
                <Layers3 size={16} />
                <span>构建水文场瓦片</span>
              </button>
            </div>
            <DataTable
              columns={["选择", "ID", "文件名", "格式", "路径", "上传时间"]}
              emptyText="暂无 Hydro 输入文件。"
              rows={hydroFiles.map((row) => (
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
                  <td><StatusBadge tone="neutral">{row.input_format}</StatusBadge></td>
                  <td title={row.stored_path} className="cell-muted">{row.stored_path}</td>
                  <td>{row.created_at}</td>
                </tr>
              ))}
            />
          </SectionPanel>
          <SectionPanel title="任务状态" description="查看水文场任务状态、输出目录和构建消息。">
            <DataTable
              columns={["Job ID", "Dataset", "格式", "场类型", "变量", "状态", "消息", "tiles_dir", "更新时间"]}
              emptyText="暂无 Hydro 任务。"
              rows={hydroJobs.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.dataset_id}</td>
                  <td>{row.input_format}</td>
                  <td>{row.field_kind}</td>
                  <td>{row.variables.join(",")}</td>
                  <td><StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge></td>
                  <td title={row.message} className="cell-muted">{row.message}</td>
                  <td title={row.tiles_dir ?? ""} className="cell-muted">{row.tiles_dir ?? "-"}</td>
                  <td>{row.updated_at}</td>
                </tr>
              ))}
            />
          </SectionPanel>
          <SectionPanel title="已发布数据（Hydro）" description="发布后的标量或矢量水文资产。">
            <AssetTable rows={hydroAssets} />
          </SectionPanel>
        </>
      ) : null}

      {activeTab === "terrain" ? (
        <>
          <SectionPanel title="Terrain 输入上传（GeoTIFF / GeoJSON）" description="为地形瓦片构建准备 DEM 或边界数据。">
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
              <button className="primary-btn" onClick={() => void onUploadTerrainInput()}>
                <HardDriveUpload size={16} />
                <span>上传 Terrain 输入文件</span>
              </button>
            </div>
            <DataTable
              columns={["ID", "文件名", "格式", "角色", "路径", "上传时间"]}
              emptyText="暂无 Terrain 输入文件。"
              rows={terrainFiles.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.original_name}</td>
                  <td><StatusBadge tone="neutral">{row.input_format}</StatusBadge></td>
                  <td><StatusBadge tone="neutral">{row.file_role}</StatusBadge></td>
                  <td title={row.stored_path} className="cell-muted">{row.stored_path}</td>
                  <td>{row.created_at}</td>
                </tr>
              ))}
            />
          </SectionPanel>
          <SectionPanel title="Terrain 构建（Terrain-RGB PNG）" description="保留原有参数配置，优化布局与交互状态。">
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
              <button className="primary-btn" onClick={() => void onTriggerTerrainBuild()}>
                <Layers3 size={16} />
                <span>构建 Terrain</span>
              </button>
            </div>
          </SectionPanel>
          <SectionPanel title="Terrain 任务状态" description="查看地形构建任务执行进度与输出。">
            <DataTable
              columns={["Job ID", "Dataset", "格式", "DEM ID", "Boundary ID", "状态", "消息", "tiles_dir", "更新时间"]}
              emptyText="暂无 Terrain 任务。"
              rows={terrainJobs.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.dataset_id}</td>
                  <td>{row.input_format}</td>
                  <td>{row.dem_file_id}</td>
                  <td>{row.boundary_file_id ?? "-"}</td>
                  <td><StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge></td>
                  <td title={row.message} className="cell-muted">{row.message}</td>
                  <td title={row.tiles_dir ?? ""} className="cell-muted">{row.tiles_dir ?? "-"}</td>
                  <td>{row.updated_at}</td>
                </tr>
              ))}
            />
          </SectionPanel>
          <SectionPanel title="已发布数据（Terrain）" description="展示已发布的 Terrain-RGB 资产。">
            <AssetTable rows={terrainAssets} />
          </SectionPanel>
        </>
      ) : null}

      {activeTab === "dynamic" ? (
        <>
          <SectionPanel title="Dynamic 输入上传（文件夹）" description="以文件夹为单位管理水动力场时序输入资源。">
            <div className="inline-form">
              <input
                ref={dynamicFolderInputRef}
                type="file"
                {...folderUploadInputAttrs}
                multiple
                style={{ display: "none" }}
                onChange={(e) => setPendingDynamicFiles(Array.from(e.target.files ?? []))}
              />
              <input
                type="text"
                readOnly
                value={dynamicFolderName}
                placeholder="未选择文件夹"
              />
              <button type="button" className="secondary-btn" onClick={() => dynamicFolderInputRef.current?.click()}>
                <FolderOpen size={16} />
                <span>选择文件夹</span>
              </button>
              <button className="primary-btn" onClick={() => void onUploadDynamicInputFolder()}>
                <HardDriveUpload size={16} />
                <span>上传 Dynamic 输入文件夹</span>
              </button>
            </div>
            <DataTable
              columns={["ID", "文件名", "目录", "路径", "上传时间"]}
              emptyText="暂无 Dynamic 输入资源。"
              rows={dynamicFiles.map((row) => {
                const directory = row.relative_dir || row.folder_name;
                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.original_name}</td>
                    <td title={directory} className="cell-muted">{directory}</td>
                    <td title={row.stored_path} className="cell-muted">{row.stored_path}</td>
                    <td>{row.created_at}</td>
                  </tr>
                );
              })}
            />
          </SectionPanel>
        </>
      ) : null}

      {activeTab === "visual" ? (
        <>
          <SectionPanel title="其他可视化资源上传（GeoJSON / GLTF / PNG）" description="补充模型、纹理和 GeoJSON 等视觉资源。">
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
              <button className="primary-btn" onClick={() => void onUploadVisualAssets()}>
                <HardDriveUpload size={16} />
                <span>上传可视化资源</span>
              </button>
            </div>
          </SectionPanel>
          <SectionPanel title="已发布数据（其他可视化资源）" description="按资源类别分组展示已托管资源。">
            <div className="subsection-heading">GeoJSON</div>
            <AssetTable rows={visualGeojsonAssets} />
            <div className="subsection-heading">Models (GLTF/GLB)</div>
            <AssetTable rows={visualModelAssets} />
            <div className="subsection-heading">Textures (PNG)</div>
            <AssetTable rows={visualTextureAssets} />
          </SectionPanel>
        </>
      ) : null}
      {!!error && <div className="error">{error}</div>}
    </div>
  );
}

function SectionPanel({
  title,
  description,
  accent,
  children
}: {
  title: string;
  description?: string;
  accent?: "blue" | "default";
  children: ReactNode;
}) {
  return (
    <div className={`panel section-panel ${accent === "blue" ? "section-panel-blue" : ""}`}>
      <div className="section-header">
        <div>
          <div className="panel-title">{title}</div>
          {description ? <div className="panel-description">{description}</div> : null}
        </div>
      </div>
      {children}
    </div>
  );
}

function DataTable({
  columns,
  rows,
  emptyText
}: {
  columns: string[];
  rows: React.ReactNode[];
  emptyText: string;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? rows : (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function AssetTable({ rows }: { rows: AssetRecord[] }) {
  return (
    <DataTable
      columns={["ID", "Dataset", "Kind", "Path", "URL", "Created At"]}
      emptyText="暂无已发布资产。"
      rows={rows.map((row) => (
        <tr key={row.id}>
          <td>{row.id}</td>
          <td>{row.dataset_id}</td>
          <td><StatusBadge tone="neutral">{row.asset_kind}</StatusBadge></td>
          <td title={row.disk_path} className="cell-muted">{row.disk_path}</td>
          <td title={row.access_url ?? ""}>
            {row.access_url ? (
              <a href={row.access_url} target="_blank" rel="noreferrer" className="link-with-icon">
                <span>{row.access_url}</span>
                <ArrowUpRight size={14} />
              </a>
            ) : (
              "-"
            )}
          </td>
          <td>{row.created_at}</td>
        </tr>
      ))}
    />
  );
}

function StatusBadge({
  tone,
  children
}: {
  tone: "success" | "warning" | "error" | "neutral";
  children: ReactNode;
}) {
  return <span className={`status-badge status-${tone}`}>{children}</span>;
}

function statusTone(status: string): "success" | "warning" | "error" | "neutral" {
  if (status === "success") return "success";
  if (status === "failed") return "error";
  if (status === "running" || status === "queued") return "warning";
  return "neutral";
}

