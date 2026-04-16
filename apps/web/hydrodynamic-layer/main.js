import mapboxgl from "mapbox-gl";
import { createHydrodynamicLayerController } from "./hydrodynamicLayer.js";

const MAP_STYLE = "mapbox://styles/mapbox/light-v10";
const MAP_CENTER = [114.028140134, 22.472900679];
const MAP_ZOOM = 12;

const hydrodynamicSceneInput = {
  dataResource: {
    path: "./assets/Resources/",
    config: "config2.json"
  },
  style: {
    lightColor: "#FFF4D6",
    terrainColor: "#FFFFFF",
    waterShallowColor: "#06D5FF",
    waterDeepColor: "#0D1AA8",
    waterOpacity: 0.8,
    waterDepthDensity: 0.3
  },
  animation: {
    swapDuration: 2000,
    swapTimeStart: 0.75,
    swapTimeEnd: 1.0
  }
};

let mapInstance = null;
let hydrodynamicLayerController = null;

async function initMap() {
  mapInstance = new mapboxgl.Map({
    container: "map-container",
    style: MAP_STYLE,
    center: MAP_CENTER,
    zoom: MAP_ZOOM,
    antialias: true,
    projection: "mercator"
  });

  mapInstance.on("load", async () => {
    try {
      hydrodynamicLayerController = createHydrodynamicLayerController(hydrodynamicSceneInput);
      const hydrodynamicLayer = await hydrodynamicLayerController.initialize(mapInstance);
      mapInstance.addLayer(hydrodynamicLayer);
    } catch (error) {
      console.error("Failed to initialize hydrodynamic layer:", error);
    }
  });
}

function teardown() {
  hydrodynamicLayerController?.destroy();
  if (mapInstance) {
    mapInstance.remove();
  }
  mapInstance = null;
  hydrodynamicLayerController = null;
}

window.addEventListener("DOMContentLoaded", () => {
  initMap().catch((error) => {
    console.error("Failed to initialize map:", error);
  });
});

window.addEventListener("beforeunload", teardown);

