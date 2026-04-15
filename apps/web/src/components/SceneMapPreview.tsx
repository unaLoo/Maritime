import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { SceneConfig } from "../types";
import { mountSceneLayers } from "../map/layer-mounter";

type SceneMapPreviewProps = {
  scene: SceneConfig | null;
};

const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined;

export function SceneMapPreview({ scene }: SceneMapPreviewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!scene) return;
    if (!token) {
      setError("缺少 VITE_MAPBOX_ACCESS_TOKEN，请先配置 apps/web/.env.local");
      return;
    }
    if (!mapContainerRef.current) return;

    let removed = false;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: scene.view.center,
      zoom: scene.view.zoom,
      bearing: scene.view.bearing ?? 0,
      pitch: scene.view.pitch ?? 0,
      antialias: true,
      projection: "mercator"
    });

    let unmountLayers: (() => void) | null = null;
    map.on("load", async () => {
      if (removed) return;
      unmountLayers = await mountSceneLayers(map, scene.layers);
    });

    return () => {
      removed = true;
      unmountLayers?.();
      map.remove();
    };
  }, [scene]);

  return (
    <div className="map-preview">
      <div className="panel-title">场景预览</div>
      <div ref={mapContainerRef} className="map-preview-canvas" />
      {!!error && <div className="error">{error}</div>}
    </div>
  );
}

