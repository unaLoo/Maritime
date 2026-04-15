import type { CustomLayerInterface, Map as MapboxMap } from "mapbox-gl";

type WaterSceneController = {
  initialize: (map: MapboxMap) => Promise<CustomLayerInterface>;
  destroy: () => void;
};

export function createWaterSceneController(input: Record<string, unknown>): WaterSceneController {
  return {
    async initialize(_map: MapboxMap): Promise<CustomLayerInterface> {
      console.info("[WaterLayer placeholder] initialize", input);
      return {
        id: "water-layer-placeholder",
        type: "custom",
        renderingMode: "3d",
        onAdd: () => undefined,
        render: () => undefined
      };
    },
    destroy() {}
  };
}

