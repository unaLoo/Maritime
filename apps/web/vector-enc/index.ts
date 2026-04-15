export { EncOverlayCustomLayer } from "./enc";
export type { EncOverlayBuildOptions } from "./enc";
export { Runtime, TemporalScalarFieldLayer, TemporalVectorFieldLayer } from "./hydroField";
export { ThreeMapLayer } from "./3dEnhance/ThreeMapLayer";
export { addGLTF } from "./3dEnhance/addGLTF";
export { addDynamicDirection } from "./3dEnhance/addDynamicDirection";
export { addBreathWall } from "./3dEnhance/addBreathWall";

// 以下仍保留占位实现，先确保海图链路优先可用。
// 后续接入 hydro/terrain 时再切换到真实实现导出。
import type { CustomLayerInterface } from "mapbox-gl";

export class TerrainLayer implements CustomLayerInterface {
  id = "terrain-layer-placeholder";
  type: "custom" = "custom";
  renderingMode: "3d" = "3d";
  constructor(_options?: Record<string, unknown>) {
    void _options;
  }
  onAdd(): void {}
  render(): void {}
}

