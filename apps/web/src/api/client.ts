import type {
  AssetRecord,
  EncBuildJobRecord,
  EncChartFileRecord,
  HydroInputFileRecord,
  HydroJobRecord,
  TerrainInputFileRecord,
  TerrainJobRecord,
  SceneConfig,
  SceneListItem
} from "../types";

export async function fetchScene(sceneId: string): Promise<SceneConfig> {
  const response = await fetch(`/api/scenes/${sceneId}`);
  if (!response.ok) {
    throw new Error(`加载场景失败: ${response.status}`);
  }
  return (await response.json()) as SceneConfig;
}

export async function saveScene(sceneId: string, payload: SceneConfig): Promise<void> {
  const response = await fetch(`/api/scenes/${sceneId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload })
  });
  if (!response.ok) {
    throw new Error(`保存场景失败: ${response.status}`);
  }
}

export async function fetchSceneList(): Promise<SceneListItem[]> {
  const response = await fetch("/api/scenes");
  if (!response.ok) {
    throw new Error(`加载场景列表失败: ${response.status}`);
  }
  return (await response.json()) as SceneListItem[];
}

export async function fetchAssets(): Promise<AssetRecord[]> {
  const response = await fetch("/api/data/assets");
  if (!response.ok) {
    throw new Error(`加载数据资产失败: ${response.status}`);
  }
  return (await response.json()) as AssetRecord[];
}

export async function uploadGeojsonAssets(files: File[]): Promise<void> {
  if (files.length === 0) return;
  const form = new FormData();
  for (const file of files) {
    form.append("files", file);
  }
  const response = await fetch("/api/data/geojson/upload", {
    method: "POST",
    body: form
  });
  if (!response.ok) {
    throw new Error(`上传 GeoJSON 失败: ${response.status}`);
  }
}

export async function uploadVisualizationAssets(
  files: File[],
  assetType: "geojson" | "model" | "texture"
): Promise<void> {
  if (files.length === 0) return;
  const form = new FormData();
  for (const file of files) {
    form.append("files", file);
  }
  const response = await fetch(`/api/data/visual-assets/upload?asset_type=${assetType}`, {
    method: "POST",
    body: form
  });
  if (!response.ok) {
    throw new Error(`上传可视化资源失败: ${response.status}`);
  }
}

export async function registerAsset(payload: {
  dataset_id: string;
  asset_kind: string;
  disk_path: string;
}): Promise<void> {
  const response = await fetch("/api/data/assets/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`登记资产失败: ${response.status}`);
  }
}

export async function uploadEncChartFiles(files: File[]): Promise<void> {
  if (files.length === 0) return;
  const form = new FormData();
  for (const file of files) {
    form.append("files", file);
  }
  const response = await fetch("/api/data/enc/charts/upload", {
    method: "POST",
    body: form
  });
  if (!response.ok) {
    throw new Error(`上传 .000 文件失败: ${response.status}`);
  }
}

export async function fetchEncChartFiles(): Promise<EncChartFileRecord[]> {
  const response = await fetch("/api/data/enc/charts");
  if (!response.ok) {
    throw new Error(`加载海图文件列表失败: ${response.status}`);
  }
  return (await response.json()) as EncChartFileRecord[];
}

export async function triggerEncBuild(payload: {
  dataset_id: string;
  chart_file_ids: number[];
}): Promise<{ job_id: string }> {
  const response = await fetch("/api/data/enc/build", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`触发 ENC 构建失败: ${response.status}`);
  }
  return (await response.json()) as { job_id: string };
}

export async function fetchEncJobs(): Promise<EncBuildJobRecord[]> {
  const response = await fetch("/api/data/enc/jobs");
  if (!response.ok) {
    throw new Error(`加载 ENC 任务失败: ${response.status}`);
  }
  return (await response.json()) as EncBuildJobRecord[];
}

export async function uploadHydroInputFile(file: File, inputFormat: "grib" | "geojson"): Promise<void> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`/api/data/hydro/files/upload?input_format=${inputFormat}`, {
    method: "POST",
    body: form
  });
  if (!response.ok) {
    throw new Error(`上传 Hydro 输入文件失败: ${response.status}`);
  }
}

export async function fetchHydroInputFiles(): Promise<HydroInputFileRecord[]> {
  const response = await fetch("/api/data/hydro/files");
  if (!response.ok) {
    throw new Error(`加载 Hydro 输入文件失败: ${response.status}`);
  }
  return (await response.json()) as HydroInputFileRecord[];
}

export async function triggerHydroBuild(payload: {
  dataset_id: string;
  input_file_ids: number[];
  input_format: "grib" | "geojson";
  field_kind: "scalar" | "vector";
  variables: string[];
  min_zoom: number;
  max_zoom: number;
  compress: boolean;
  cfgrib_filter?: Record<string, unknown>;
  bbox?: [number, number, number, number];
}): Promise<{ job_id: string }> {
  const response = await fetch("/api/data/hydro/build", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`触发 Hydro 构建失败: ${response.status}`);
  }
  return (await response.json()) as { job_id: string };
}

export async function fetchHydroJobs(): Promise<HydroJobRecord[]> {
  const response = await fetch("/api/data/hydro/jobs");
  if (!response.ok) {
    throw new Error(`加载 Hydro 任务失败: ${response.status}`);
  }
  return (await response.json()) as HydroJobRecord[];
}

export async function uploadTerrainInputFile(payload: {
  file: File;
  inputFormat: "geotiff" | "geojson";
  fileRole: "dem" | "boundary";
}): Promise<void> {
  const form = new FormData();
  form.append("file", payload.file);
  const response = await fetch(
    `/api/data/terrain/files/upload?input_format=${payload.inputFormat}&file_role=${payload.fileRole}`,
    {
      method: "POST",
      body: form
    }
  );
  if (!response.ok) {
    throw new Error(`上传 Terrain 输入文件失败: ${response.status}`);
  }
}

export async function fetchTerrainInputFiles(): Promise<TerrainInputFileRecord[]> {
  const response = await fetch("/api/data/terrain/files");
  if (!response.ok) {
    throw new Error(`加载 Terrain 输入文件失败: ${response.status}`);
  }
  return (await response.json()) as TerrainInputFileRecord[];
}

export async function triggerTerrainBuild(payload: {
  dataset_id: string;
  input_format: "geotiff" | "geojson";
  dem_file_id: number;
  boundary_file_id?: number;
  zoom?: string;
  tile_size?: number;
  workers?: number;
  invert_z?: boolean;
  geojson_z_field?: string;
  grid_res_m?: number;
  bounds_buffer_m?: number;
}): Promise<{ job_id: string }> {
  const response = await fetch("/api/data/terrain/build", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`触发 Terrain 构建失败: ${response.status}`);
  }
  return (await response.json()) as { job_id: string };
}

export async function fetchTerrainJobs(): Promise<TerrainJobRecord[]> {
  const response = await fetch("/api/data/terrain/jobs");
  if (!response.ok) {
    throw new Error(`加载 Terrain 任务失败: ${response.status}`);
  }
  return (await response.json()) as TerrainJobRecord[];
}

