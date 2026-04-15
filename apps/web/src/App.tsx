import { useState } from "react";
import "./style.css";
import { DataManagementPage } from "./pages/DataManagementPage";
import { SceneEditorPage } from "./pages/SceneEditorPage";

export default function App() {
  const [tab, setTab] = useState<"data" | "scene">("data");

  return (
    <div className="root">
      <div className="toolbar">
        <div className="toolbar-brand">
          <strong>Maritime Scene Builder</strong>
        </div>
        <div className="toolbar-tabs">
          <button className={tab === "data" ? "active" : ""} onClick={() => setTab("data")}>
            数据管理
          </button>
          <button className={tab === "scene" ? "active" : ""} onClick={() => setTab("scene")}>
            场景编辑与可视化
          </button>
        </div>
      </div>

      <div className="content">{tab === "data" ? <DataManagementPage /> : <SceneEditorPage />}</div>
    </div>
  );
}

