import { useMemo, useEffect, useState } from "react";
import { fetchAssets, fetchScene, fetchSceneList, saveScene } from "../api/client";
import { SceneMapPreview } from "../components/SceneMapPreview";
import type { AssetRecord, SceneConfig, SceneLayer, SceneListItem } from "../types";

const DEFAULT_SCENE_ID = "default";

type EditorMode = "form" | "json";
type AddLayerType = "enc" | "hydro_scalar" | "hydro_vector" | "terrain" | "gltf_model" | "breath_wall" | "dynamic_arrow";

type BuildLayerParams = {
  layerType: AddLayerType;
  selectedEncAssetId: string;
  encIconBaseUrl: string;
  selectedHydroAssetId: string;
  selectedTerrainAssetId: string;
  selectedGeojsonAssetId: string;
  enhanceModelUrl: string;
  enhanceTextureUrl: string;
  encAssets: AssetRecord[];
  hydroAssets: AssetRecord[];
  terrainAssets: AssetRecord[];
  geojsonAssets: AssetRecord[];
};

export function SceneEditorPage() {
  const [editorMode, setEditorMode] = useState<EditorMode>("form");
  const [sceneId, setSceneId] = useState(DEFAULT_SCENE_ID);
  const [selectedSceneId, setSelectedSceneId] = useState(DEFAULT_SCENE_ID);
  const [newSceneId, setNewSceneId] = useState("");

  const [formScene, setFormScene] = useState<SceneConfig>(createEmptyScene(DEFAULT_SCENE_ID));
  const [jsonText, setJsonText] = useState("");
  const [previewScene, setPreviewScene] = useState<SceneConfig | null>(null);

  const [sceneOptions, setSceneOptions] = useState<SceneListItem[]>([]);
  const [encAssets, setEncAssets] = useState<AssetRecord[]>([]);
  const [hydroAssets, setHydroAssets] = useState<AssetRecord[]>([]);
  const [terrainAssets, setTerrainAssets] = useState<AssetRecord[]>([]);
  const [geojsonAssets, setGeojsonAssets] = useState<AssetRecord[]>([]);

  const [newLayerType, setNewLayerType] = useState<AddLayerType>("enc");
  const [isAddLayerModalOpen, setIsAddLayerModalOpen] = useState(false);
  const [selectedEncAssetId, setSelectedEncAssetId] = useState("");
  const [encIconBaseUrl, setEncIconBaseUrl] = useState("/static/enc-icons");
  const [selectedHydroAssetId, setSelectedHydroAssetId] = useState("");
  const [selectedTerrainAssetId, setSelectedTerrainAssetId] = useState("");
  const [selectedGeojsonAssetId, setSelectedGeojsonAssetId] = useState("");
  const [enhanceModelUrl, setEnhanceModelUrl] = useState("/static/models/demo.glb");
  const [enhanceTextureUrl, setEnhanceTextureUrl] = useState("/static/arr.png");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    void initializePage();
  }, []);

  useEffect(() => {
    if (!info) return;
    const timer = window.setTimeout(() => setInfo(""), 2600);
    return () => window.clearTimeout(timer);
  }, [info]);

  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => setError(""), 3200);
    return () => window.clearTimeout(timer);
  }, [error]);

  const layerTypeLabelMap: Record<AddLayerType, string> = useMemo(
    () => ({
      enc: "海图",
      hydro_scalar: "水文环境场（标量）",
      hydro_vector: "水文环境场（矢量）",
      terrain: "地形",
      gltf_model: "模型",
      breath_wall: "呼吸墙",
      dynamic_arrow: "动态箭头"
    }),
    []
  );

  async function initializePage() {
    await Promise.all([
      loadScene(DEFAULT_SCENE_ID),
      loadSceneOptions(),
      loadEncAssets(),
      loadHydroAssets(),
      loadTerrainAssets(),
      loadGeojsonAssets()
    ]);
  }

  function applyFormScene(nextScene: SceneConfig) {
    setFormScene(nextScene);
    setJsonText(JSON.stringify(nextScene, null, 2));
    setPreviewScene(nextScene);
  }

  function setFormSceneWith(mutator: (scene: SceneConfig) => SceneConfig) {
    const next = mutator(formScene);
    applyFormScene(next);
  }

  async function loadScene(targetId: string) {
    setError("");
    setInfo("");
    try {
      const scene = await fetchScene(targetId);
      setSceneId(targetId);
      setSelectedSceneId(targetId);
      applyFormScene(scene);
      setInfo(`已加载场景: ${targetId}`);
    } catch (err) {
      setError(String(err));
    }
  }

  async function onSelectScene(nextSceneId: string) {
    setSelectedSceneId(nextSceneId);
    await loadScene(nextSceneId);
  }

  function onCreateScene() {
    setError("");
    setInfo("");
    const id = newSceneId.trim();
    if (!id) {
      setError("请填写新场景 ID。");
      return;
    }
    const template = createEmptyScene(id);
    setSceneId(id);
    setSelectedSceneId(id);
    applyFormScene(template);
    setInfo("新场景草稿已创建，点击保存后会写入列表。");
  }

  async function onSave() {
    setError("");
    setInfo("");
    try {
      const scene = editorMode === "json" ? parseDraftScene(jsonText) : formScene;
      await saveScene(sceneId, scene);
      if (editorMode === "json") setFormScene(scene);
      setPreviewScene(scene);
      setInfo("保存成功。");
      await loadSceneOptions();
    } catch (err) {
      setError(String(err));
    }
  }

  function onPreview() {
    setError("");
    setInfo("");
    try {
      const scene = editorMode === "json" ? parseDraftScene(jsonText) : formScene;
      if (editorMode === "json") setFormScene(scene);
      setPreviewScene(scene);
      setInfo("预览已更新。");
    } catch (err) {
      setError(String(err));
    }
  }

  function onSwitchEditorMode(nextMode: EditorMode) {
    if (nextMode === editorMode) return;
    setError("");
    setInfo("");
    if (nextMode === "form") {
      try {
        const parsed = parseDraftScene(jsonText);
        applyFormScene(parsed);
      } catch (err) {
        setError(`JSON 无法解析，无法切换到表单配置。${String(err)}`);
        return;
      }
    } else {
      setJsonText(JSON.stringify(formScene, null, 2));
    }
    setEditorMode(nextMode);
  }

  function onAddLayer() {
    setError("");
    setInfo("");
    try {
      const nextLayer = buildLayerByType({
        layerType: newLayerType,
        selectedEncAssetId,
        encIconBaseUrl,
        selectedHydroAssetId,
        selectedTerrainAssetId,
        selectedGeojsonAssetId,
        enhanceModelUrl,
        enhanceTextureUrl,
        encAssets,
        hydroAssets,
        terrainAssets,
        geojsonAssets
      });
      setFormSceneWith((scene) => ({ ...scene, layers: [...scene.layers, nextLayer] }));
      setInfo(`已添加图层: ${nextLayer.id}`);
      setIsAddLayerModalOpen(false);
    } catch (err) {
      setError(String(err));
    }
  }

  function onRemoveLayer(layerId: string) {
    setError("");
    setInfo("");
    setFormSceneWith((scene) => ({ ...scene, layers: scene.layers.filter((layer) => layer.id !== layerId) }));
    setInfo(`已移除图层: ${layerId}`);
  }

  async function loadSceneOptions() {
    try {
      const rows = await fetchSceneList();
      setSceneOptions(rows);
    } catch (err) {
      setError(String(err));
    }
  }

  async function loadEncAssets() {
    try {
      const assets = await fetchAssets();
      const filtered = assets.filter((a) => a.asset_kind === "enc_mbtiles" && !!a.access_url);
      setEncAssets(filtered);
      if (!selectedEncAssetId && filtered.length > 0) setSelectedEncAssetId(String(filtered[0].id));
    } catch (err) {
      setError(String(err));
    }
  }

  async function loadHydroAssets() {
    try {
      const assets = await fetchAssets();
      const filtered = assets.filter((a) => a.asset_kind === "hydro_bin_scalar" || a.asset_kind === "hydro_bin_vector");
      setHydroAssets(filtered);
      if (!selectedHydroAssetId && filtered.length > 0) setSelectedHydroAssetId(String(filtered[0].id));
    } catch (err) {
      setError(String(err));
    }
  }

  async function loadTerrainAssets() {
    try {
      const assets = await fetchAssets();
      const filtered = assets.filter((a) => a.asset_kind === "terrain_rgb_png");
      setTerrainAssets(filtered);
      if (!selectedTerrainAssetId && filtered.length > 0) setSelectedTerrainAssetId(String(filtered[0].id));
    } catch (err) {
      setError(String(err));
    }
  }

  async function loadGeojsonAssets() {
    try {
      const assets = await fetchAssets();
      const filtered = assets.filter((a) => a.asset_kind === "geojson" && !!a.access_url);
      setGeojsonAssets(filtered);
      if (!selectedGeojsonAssetId && filtered.length > 0) setSelectedGeojsonAssetId(String(filtered[0].id));
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <div className="editor-layout">
      <div className="panel scene-editor-panel">
        <div className="panel-title">场景编辑</div>
        <div className="editor-mode-tabs">
          <button className={editorMode === "form" ? "active" : ""} onClick={() => onSwitchEditorMode("form")}>表单配置</button>
          <button className={editorMode === "json" ? "active" : ""} onClick={() => onSwitchEditorMode("json")}>JSON 配置</button>
        </div>

        <div className="inline-form">
          <label>已保存场景<select value={selectedSceneId} onChange={(e) => void onSelectScene(e.target.value)}>{sceneOptions.map((item) => (<option key={item.id} value={item.id}>{item.id}</option>))}</select></label>
          <label>新建场景 ID<input value={newSceneId} onChange={(e) => setNewSceneId(e.target.value)} /></label>
          <button onClick={onCreateScene}>新建场景</button>
          <label>当前编辑场景<input value={sceneId} readOnly /></label>
          <button onClick={onSave}>保存</button>
          <button onClick={onPreview}>应用预览</button>
        </div>

        <div className="scene-editor-scroll">
          {editorMode === "form" ? (
            <>
            <div className="panel-subtitle">1. 元数据块</div>
            <div className="inline-form scene-form-block">
              <label>name（场景名称）<input value={formScene.name} onChange={(e) => setFormSceneWith((s) => ({ ...s, name: e.target.value }))} /></label>
            </div>

            <div className="panel-subtitle">2. 视图块</div>
            <div className="inline-form scene-form-block">
              <label>center lng<input type="number" step="0.000001" value={formScene.view.center[0]} onChange={(e) => setFormSceneWith((s) => ({ ...s, view: { ...s.view, center: [Number(e.target.value), s.view.center[1]] } }))} /></label>
              <label>center lat<input type="number" step="0.000001" value={formScene.view.center[1]} onChange={(e) => setFormSceneWith((s) => ({ ...s, view: { ...s.view, center: [s.view.center[0], Number(e.target.value)] } }))} /></label>
              <div className="view-compact-row">
                <label>zoom<input type="number" step="0.1" value={formScene.view.zoom} onChange={(e) => setFormSceneWith((s) => ({ ...s, view: { ...s.view, zoom: Number(e.target.value) } }))} /></label>
                <label>bearing<input type="number" step="1" value={formScene.view.bearing ?? 0} onChange={(e) => setFormSceneWith((s) => ({ ...s, view: { ...s.view, bearing: Number(e.target.value) } }))} /></label>
                <label>pitch<input type="number" step="1" value={formScene.view.pitch ?? 0} onChange={(e) => setFormSceneWith((s) => ({ ...s, view: { ...s.view, pitch: Number(e.target.value) } }))} /></label>
              </div>
            </div>

            <div className="panel-subtitle">3. 图层块</div>
            <div className="inline-form scene-form-block">
              <button onClick={() => setIsAddLayerModalOpen(true)}>添加图层</button>
            </div>

            <div className="table-wrap scene-layer-table">
              <table>
                <thead><tr><th>图层 ID</th><th>类型</th><th>启用</th><th>参数摘要</th><th>操作</th></tr></thead>
                <tbody>
                  {formScene.layers.length === 0 ? (<tr><td colSpan={5}>当前没有图层，请在上方选择类型并添加。</td></tr>) : (
                    formScene.layers.map((layer) => (
                      <tr key={layer.id}>
                        <td>{layer.id}</td><td>{layer.type}</td>
                        <td><input type="checkbox" checked={layer.enabled} onChange={(e) => setFormSceneWith((scene) => ({ ...scene, layers: scene.layers.map((item) => (item.id === layer.id ? { ...item, enabled: e.target.checked } : item)) }))} /></td>
                        <td title={JSON.stringify(layer.config)}>{Object.keys(layer.config).join(", ")}</td>
                        <td><button onClick={() => onRemoveLayer(layer.id)}>移除</button></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            </>
          ) : (
            <>
            <div className="panel-subtitle">JSON 配置模式（高级）</div>
            <textarea className="json-editor" value={jsonText} onChange={(e) => setJsonText(e.target.value)} spellCheck={false} />
            </>
          )}
        </div>
      </div>

      <SceneMapPreview scene={previewScene} />
      {isAddLayerModalOpen ? (
        <div className="modal-backdrop" onClick={() => setIsAddLayerModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="panel-title">添加图层</div>
            <div className="inline-form">
              <label>图层类型<select value={newLayerType} onChange={(e) => setNewLayerType(e.target.value as AddLayerType)}>{Object.entries(layerTypeLabelMap).map(([value, label]) => (<option key={value} value={value}>{label}</option>))}</select></label>

              {newLayerType === "enc" ? (<><label>已发布 ENC 资产<select value={selectedEncAssetId} onChange={(e) => setSelectedEncAssetId(e.target.value)}><option value="">请选择</option>{encAssets.map((asset) => (<option key={asset.id} value={String(asset.id)}>{asset.dataset_id} ({asset.asset_kind})</option>))}</select></label><label>Icon Base URL<input value={encIconBaseUrl} onChange={(e) => setEncIconBaseUrl(e.target.value)} /></label></>) : null}
              {newLayerType === "hydro_scalar" || newLayerType === "hydro_vector" ? (<><label>已发布 Hydro 资产<select value={selectedHydroAssetId} onChange={(e) => setSelectedHydroAssetId(e.target.value)}><option value="">请选择</option>{hydroAssets.filter((a) => (newLayerType === "hydro_scalar" ? a.asset_kind === "hydro_bin_scalar" : a.asset_kind === "hydro_bin_vector")).map((asset) => (<option key={asset.id} value={String(asset.id)}>{asset.dataset_id} ({asset.asset_kind})</option>))}</select></label></>) : null}
              {newLayerType === "terrain" ? (<><label>已发布 Terrain 资产<select value={selectedTerrainAssetId} onChange={(e) => setSelectedTerrainAssetId(e.target.value)}><option value="">请选择</option>{terrainAssets.map((asset) => (<option key={asset.id} value={String(asset.id)}>{asset.dataset_id} ({asset.asset_kind})</option>))}</select></label></>) : null}
              {newLayerType === "gltf_model" || newLayerType === "breath_wall" || newLayerType === "dynamic_arrow" ? (<><label>GeoJSON 资产<select value={selectedGeojsonAssetId} onChange={(e) => setSelectedGeojsonAssetId(e.target.value)}><option value="">请选择</option>{geojsonAssets.map((asset) => (<option key={asset.id} value={String(asset.id)}>{asset.dataset_id}</option>))}</select></label>{newLayerType === "gltf_model" ? (<label>模型 URL<input value={enhanceModelUrl} onChange={(e) => setEnhanceModelUrl(e.target.value)} /></label>) : null}{newLayerType === "dynamic_arrow" ? (<label>箭头纹理 URL<input value={enhanceTextureUrl} onChange={(e) => setEnhanceTextureUrl(e.target.value)} /></label>) : null}</>) : null}
            </div>
            <div className="modal-actions">
              <button onClick={() => setIsAddLayerModalOpen(false)}>取消</button>
              <button onClick={onAddLayer}>确认添加</button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="toast-stack">
        {!!info && <div className="toast toast-info">{info}</div>}
        {!!error && <div className="toast toast-error">{error}</div>}
      </div>
    </div>
  );
}

function buildLayerByType(params: BuildLayerParams): SceneLayer {
  const { layerType, selectedEncAssetId, encIconBaseUrl, selectedHydroAssetId, selectedTerrainAssetId, selectedGeojsonAssetId, enhanceModelUrl, enhanceTextureUrl, encAssets, hydroAssets, terrainAssets, geojsonAssets } = params;
  const now = Date.now();

  if (layerType === "enc") {
    if (!selectedEncAssetId) throw new Error("请先选择一个已发布 ENC 资产。");
    const encAsset = encAssets.find((a) => String(a.id) === selectedEncAssetId);
    if (!encAsset?.access_url) throw new Error("选中的 ENC 资产缺少可访问 URL。");
    const sourceBaseUrl = encAsset.access_url.replace(/\/merged\.mbtiles\/tilejson\.json$/, "");
    return { id: `enc-${now}`, type: "enc", enabled: true, config: { sourceBaseUrl, iconBaseUrl: encIconBaseUrl.trim() || "/static/enc-icons", theme: "DAY_BRIGHT", showLand: true, showSoundings: true } };
  }

  if (layerType === "hydro_scalar" || layerType === "hydro_vector") {
    if (!selectedHydroAssetId) throw new Error("请先选择一个 Hydro 资产。");
    const asset = hydroAssets.find((a) => String(a.id) === selectedHydroAssetId);
    if (!asset?.access_url) throw new Error("选中的 Hydro 资产缺少可访问 URL。");
    if (layerType === "hydro_scalar" && asset.asset_kind !== "hydro_bin_scalar") throw new Error("当前图层类型要求选择标量 Hydro 资产。");
    if (layerType === "hydro_vector" && asset.asset_kind !== "hydro_bin_vector") throw new Error("当前图层类型要求选择矢量 Hydro 资产。");
    return layerType === "hydro_scalar"
      ? { id: `hydro-scalar-${now}`, type: "hydro_scalar", enabled: true, config: { url: asset.access_url, minzoom: 0, maxzoom: 7, globalMin: -25, globalMax: 25 } }
      : { id: `hydro-vector-${now}`, type: "hydro_vector", enabled: true, config: { url: asset.access_url, minzoom: 0, maxzoom: 7, globalMinU: 0, globalMaxU: 8, globalMinV: 0, globalMaxV: 8, speedFactor: 0.0002 } };
  }

  if (layerType === "terrain") {
    if (!selectedTerrainAssetId) throw new Error("请先选择一个 Terrain 资产。");
    const asset = terrainAssets.find((a) => String(a.id) === selectedTerrainAssetId);
    if (!asset?.access_url) throw new Error("选中的 Terrain 资产缺少可访问 URL。");
    return { id: `terrain-${now}`, type: "terrain", enabled: true, config: { terrainTileURL: asset.access_url, exaggeration: 5, withContour: true, withLighting: true, interval: 5, elevationRange: [-300, 2], shallowColor: [34, 76, 80], deepColor: [255, 255, 255] } };
  }

  if (!selectedGeojsonAssetId) throw new Error("请先选择一个 GeoJSON 资产。");
  const geojsonAsset = geojsonAssets.find((a) => String(a.id) === selectedGeojsonAssetId);
  if (!geojsonAsset?.access_url) throw new Error("选中的 GeoJSON 资产缺少 URL。");
  const enhanceModeMap: Record<"gltf_model" | "breath_wall" | "dynamic_arrow", "gltf_model" | "breath_wall" | "dynamic_arrow"> = { gltf_model: "gltf_model", breath_wall: "breath_wall", dynamic_arrow: "dynamic_arrow" };
  const enhanceMode = enhanceModeMap[layerType];
  return {
    id: `enhance3d-${enhanceMode}-${now}`,
    type: "enhance_3d",
    enabled: true,
    config: {
      mode: enhanceMode,
      geojsonUrl: geojsonAsset.access_url,
      featureIndex: 0,
      color: enhanceMode === "breath_wall" ? "#ffd392" : "#88e7ff",
      speed: 0.5,
      width: 300,
      arrowSize: 0.5,
      repeat: 50,
      opacity: 1,
      height: 200,
      minAlpha: 0.2,
      maxAlpha: 0.8,
      breathingFreq: 0.4,
      modelUrl: enhanceModelUrl.trim(),
      textureUrl: enhanceTextureUrl.trim()
    }
  };
}

function parseDraftScene(text: string): SceneConfig {
  try {
    return JSON.parse(text) as SceneConfig;
  } catch {
    throw new Error("JSON 格式不合法。");
  }
}

function createEmptyScene(sceneId: string): SceneConfig {
  return { version: 1, name: sceneId, view: { center: [114.02814, 22.4729], zoom: 10, bearing: 0, pitch: 45 }, layers: [] };
}
