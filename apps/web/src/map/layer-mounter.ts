import mapboxgl from "mapbox-gl";
import type { SceneLayer } from "../types";
import {
  EncOverlayCustomLayer,
  Runtime,
  TemporalScalarFieldLayer,
  TemporalVectorFieldLayer,
  TerrainLayer,
  ThreeMapLayer,
  addBreathWall,
  addDynamicDirection,
  addGLTF
} from "../../vector-enc";
import { createHydrodynamicLayerController } from "../../hydrodynamic-layer/index";

export async function mountSceneLayers(map: mapboxgl.Map, layers: SceneLayer[]): Promise<() => void> {
  let runtime: InstanceType<typeof Runtime> | null = null;
  const getRuntime = (): InstanceType<typeof Runtime> => {
    if (!runtime) runtime = new Runtime(map);
    return runtime;
  };

  for (const layer of layers) {
    if (!layer.enabled) continue;
    await mountLayer(map, layer, getRuntime);
  }

  return () => {
    runtime?.remove();
  };
}

async function mountLayer(
  map: mapboxgl.Map,
  layer: SceneLayer,
  getRuntime: () => InstanceType<typeof Runtime>
): Promise<void> {
  switch (layer.type) {
    case "enc":
      mountEncLayer(map, layer);
      return;
    case "terrain":
      mountTerrainLayer(map, layer);
      return;
    case "hydro_scalar":
      mountHydroScalarLayer(getRuntime(), layer);
      return;
    case "hydro_vector":
      mountHydroVectorLayer(getRuntime(), layer);
      return;
    case "water":
    case "hydrodynamic":
      await mountWaterLayer(map, layer);
      return;
    case "enhance_3d":
      await mount3dEnhanceLayer(map, layer);
      return;
    default:
      return;
  }
}

function mountEncLayer(map: mapboxgl.Map, layer: SceneLayer): void {
  const encLayer = new EncOverlayCustomLayer(layer.config);
  if (!map.getLayer(encLayer.id)) {
    map.addLayer(encLayer as unknown as mapboxgl.AnyLayer);
  }
}

function mountTerrainLayer(map: mapboxgl.Map, layer: SceneLayer): void {
  const terrainLayer = new TerrainLayer(layer.config);
  (terrainLayer as { id?: string }).id = layer.id;
  if (!map.getLayer(terrainLayer.id)) {
    map.addLayer(terrainLayer as unknown as mapboxgl.AnyLayer);
  }
}

function mountHydroScalarLayer(runtime: InstanceType<typeof Runtime>, layer: SceneLayer): void {
  const sourceId = `${layer.id}-source`;
  runtime.tileManager.addSource({
    id: sourceId,
    type: "temporal_scalar",
    url: String(layer.config.url ?? ""),
    minzoom: Number(layer.config.minzoom ?? 0),
    maxzoom: Number(layer.config.maxzoom ?? 14)
  });
  runtime.addLayer(
    new TemporalScalarFieldLayer({ id: layer.id, sourceId, ...layer.config } as unknown as ConstructorParameters<
      typeof TemporalScalarFieldLayer
    >[0])
  );
}

function mountHydroVectorLayer(runtime: InstanceType<typeof Runtime>, layer: SceneLayer): void {
  const sourceId = `${layer.id}-source`;
  runtime.tileManager.addSource({
    id: sourceId,
    type: "temporal_vector",
    url: String(layer.config.url ?? ""),
    minzoom: Number(layer.config.minzoom ?? 0),
    maxzoom: Number(layer.config.maxzoom ?? 14)
  });
  runtime.addLayer(
    new TemporalVectorFieldLayer({ id: layer.id, sourceId, ...layer.config } as unknown as ConstructorParameters<
      typeof TemporalVectorFieldLayer
    >[0])
  );
}

async function mountWaterLayer(map: mapboxgl.Map, layer: SceneLayer): Promise<void> {
  const controller = createHydrodynamicLayerController(layer.config);
  const waterLayer = await controller.initialize(map);
  if (!map.getLayer(waterLayer.id)) {
    map.addLayer(waterLayer as unknown as mapboxgl.AnyLayer);
  }
}

function getOrCreateThreeLayer(map: mapboxgl.Map): ThreeMapLayer {
  const existing = map.getLayer("three-scene-layer");
  if (existing) {
    return existing as unknown as ThreeMapLayer;
  }
  const threeLayer = new ThreeMapLayer();
  map.addLayer(threeLayer as unknown as mapboxgl.AnyLayer);
  return threeLayer;
}

function collectLngLat(geometry: any): [number, number][] {
  const out: [number, number][] = [];
  const walk = (value: any) => {
    if (!Array.isArray(value)) return;
    if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") {
      out.push([value[0], value[1]]);
      return;
    }
    for (const item of value) {
      walk(item);
    }
  };
  walk(geometry?.coordinates);
  return out;
}

function normalizeFeature(raw: any, featureIndex: number): any {
  if (!raw || typeof raw !== "object") {
    throw new Error("3dEnhance GeoJSON 内容为空");
  }
  if (raw.type === "FeatureCollection") {
    const features = Array.isArray(raw.features) ? raw.features : [];
    if (features.length === 0) {
      throw new Error("3dEnhance GeoJSON 没有 feature");
    }
    const idx = Math.min(Math.max(featureIndex, 0), features.length - 1);
    return features[idx];
  }
  if (raw.type === "Feature") {
    return raw;
  }
  return { type: "Feature", geometry: raw };
}

async function mount3dEnhanceLayer(map: mapboxgl.Map, layer: SceneLayer): Promise<void> {
  const mode = String(layer.config.mode ?? "").trim();
  const geojsonUrl = String(layer.config.geojsonUrl ?? "").trim();
  if (!mode || !geojsonUrl) return;

  const response = await fetch(geojsonUrl);
  if (!response.ok) {
    throw new Error(`3dEnhance GeoJSON 请求失败: ${response.status}`);
  }
  const rawGeojson = (await response.json()) as unknown;
  const feature = normalizeFeature(rawGeojson, Number(layer.config.featureIndex ?? 0));
  const coords = collectLngLat(feature.geometry);
  if (coords.length === 0) {
    throw new Error("3dEnhance feature 中没有可用坐标");
  }

  const threeLayer = getOrCreateThreeLayer(map);
  const anchor =
    (Array.isArray(layer.config.anchor) && (layer.config.anchor as number[]).length >= 2
      ? [Number((layer.config.anchor as number[])[0]), Number((layer.config.anchor as number[])[1])]
      : coords[0]) as [number, number];
  threeLayer.setAnchor(anchor);

  if (mode === "gltf_model") {
    const modelUrl = String(layer.config.modelUrl ?? "").trim();
    if (!modelUrl) {
      throw new Error("gltf_model 模式必须提供 modelUrl");
    }
    await addGLTF(
      threeLayer,
      layer.id,
      modelUrl,
      anchor,
      Number(layer.config.altitude ?? 0)
    );
    return;
  }

  if (mode === "dynamic_arrow") {
    await addDynamicDirection(threeLayer, {
      id: layer.id,
      lineString: feature,
      direction: Number(layer.config.direction ?? 1) === -1 ? -1 : 1,
      speed: Number(layer.config.speed ?? 0.5),
      color: String(layer.config.color ?? "#88e7ff"),
      width: Number(layer.config.width ?? 300),
      arrowSize: Number(layer.config.arrowSize ?? 0.5),
      repeat: Number(layer.config.repeat ?? 50),
      opacity: Number(layer.config.opacity ?? 1),
      textureUrl: String(layer.config.textureUrl ?? "")
    });
    return;
  }

  if (mode === "breath_wall") {
    addBreathWall(threeLayer, {
      id: layer.id,
      geojson: feature,
      height: Number(layer.config.height ?? 200),
      color: String(layer.config.color ?? "#ffd392"),
      minAlpha: Number(layer.config.minAlpha ?? 0.2),
      maxAlpha: Number(layer.config.maxAlpha ?? 0.8),
      breathingFreq: Number(layer.config.breathingFreq ?? 0.4)
    });
  }
}

