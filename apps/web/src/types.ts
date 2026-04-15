export type SceneConfig = {
  version: number;
  name: string;
  view: {
    center: [number, number];
    zoom: number;
    bearing?: number;
    pitch?: number;
  };
  layers: SceneLayer[];
};

export type SceneLayer = {
  id: string;
  type: "enc" | "terrain" | "hydro_scalar" | "hydro_vector" | "water" | "enhance_3d";
  enabled: boolean;
  config: Record<string, unknown>;
};

export type AssetRecord = {
  id: number;
  dataset_id: string;
  asset_kind: string;
  disk_path: string;
  access_url?: string | null;
  created_at: string;
};

export type EncChartFileRecord = {
  id: number;
  original_name: string;
  stored_path: string;
  created_at: string;
};

export type EncBuildJobRecord = {
  id: string;
  dataset_id: string;
  chart_file_ids: number[];
  status: "queued" | "running" | "success" | "failed";
  message: string;
  merged_mbtiles_path: string | null;
  created_at: string;
  updated_at: string;
};

export type HydroInputFileRecord = {
  id: number;
  original_name: string;
  stored_path: string;
  input_format: "grib" | "geojson";
  created_at: string;
};

export type HydroJobRecord = {
  id: string;
  dataset_id: string;
  input_file_ids: number[];
  input_format: "grib" | "geojson";
  field_kind: "scalar" | "vector";
  variables: string[];
  status: "queued" | "running" | "success" | "failed";
  message: string;
  tiles_dir: string | null;
  created_at: string;
  updated_at: string;
};

export type TerrainInputFileRecord = {
  id: number;
  original_name: string;
  stored_path: string;
  input_format: "geotiff" | "geojson";
  file_role: "dem" | "boundary";
  created_at: string;
};

export type TerrainJobRecord = {
  id: string;
  dataset_id: string;
  input_format: "geotiff" | "geojson";
  dem_file_id: number;
  boundary_file_id: number | null;
  status: "queued" | "running" | "success" | "failed";
  message: string;
  tiles_dir: string | null;
  created_at: string;
  updated_at: string;
};

export type SceneListItem = {
  id: string;
  created_at: string;
};

