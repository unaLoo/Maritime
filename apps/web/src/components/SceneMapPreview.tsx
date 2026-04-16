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
  const [viewState, setViewState] = useState({
    lng: scene?.view.center[0] ?? 0,
    lat: scene?.view.center[1] ?? 0,
    zoom: scene?.view.zoom ?? 0,
    bearing: scene?.view.bearing ?? 0,
    pitch: scene?.view.pitch ?? 0
  });

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

    const syncViewState = () => {
      const center = map.getCenter();
      setViewState({
        lng: center.lng,
        lat: center.lat,
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch()
      });
    };

    syncViewState();

    let unmountLayers: (() => void) | null = null;
    map.on("load", async () => {
      if (removed) return;
      syncViewState();
      unmountLayers = await mountSceneLayers(map, scene.layers);
    });
    map.on("move", syncViewState);
    map.on("rotate", syncViewState);
    map.on("pitch", syncViewState);
    map.on("zoom", syncViewState);

    return () => {
      removed = true;
      unmountLayers?.();
      map.remove();
    };
  }, [scene]);

  return (
    <div className="map-preview">
      <div className="map-preview-header">
        <div>
          <div className="panel-title">场景预览</div>
        </div>
      </div>
      <div ref={mapContainerRef} className="map-preview-canvas" />
      <div className="map-status-bar">
        <div className="map-status-item">
          <span className="map-status-label">Lng</span>
          <span className="map-status-value">{formatViewNumber(viewState.lng, 5)}</span>
        </div>
        <div className="map-status-item">
          <span className="map-status-label">Lat</span>
          <span className="map-status-value">{formatViewNumber(viewState.lat, 5)}</span>
        </div>
        <div className="map-status-item">
          <span className="map-status-label">Zoom</span>
          <span className="map-status-value">{formatViewNumber(viewState.zoom, 2)}</span>
        </div>
        <div className="map-status-item">
          <span className="map-status-label">Bearing</span>
          <span className="map-status-value">{formatViewNumber(viewState.bearing, 1)}</span>
        </div>
        <div className="map-status-item">
          <span className="map-status-label">Pitch</span>
          <span className="map-status-value">{formatViewNumber(viewState.pitch, 1)}</span>
        </div>
      </div>
      {!!error && <div className="error">{error}</div>}
    </div>
  );
}

function formatViewNumber(value: number, digits: number) {
  return Number.isFinite(value) ? value.toFixed(digits) : "-";
}

