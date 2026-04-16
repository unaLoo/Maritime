import type { CustomLayerInterface, Map as MapboxMap } from "mapbox-gl";

// @ts-expect-error JS module without declaration file.
import { createHydrodynamicLayerController as createHydrodynamicLayerControllerImpl } from "./hydrodynamicLayer.js";

type HydrodynamicLayerController = {
  initialize: (map: MapboxMap) => Promise<CustomLayerInterface>;
  destroy: () => void;
};

export function createHydrodynamicLayerController(
  input: Record<string, unknown>
): HydrodynamicLayerController {
  return createHydrodynamicLayerControllerImpl(input) as HydrodynamicLayerController;
}