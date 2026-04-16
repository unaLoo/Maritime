import { Database, Layers3 } from "lucide-react";
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
          <div className="toolbar-brand-copy">
            <strong>Maritime Scene Builder</strong>
            <span>Maritime Visualization Platform</span>
          </div>
        </div>
        <div className="toolbar-tabs">
          <button className={tab === "data" ? "active" : ""} onClick={() => setTab("data")}>
            <Database size={16} strokeWidth={2} />
            <span>数据管理</span>
          </button>
          <button className={tab === "scene" ? "active" : ""} onClick={() => setTab("scene")}>
            <Layers3 size={16} strokeWidth={2} />
            <span>场景编辑与可视化</span>
          </button>
        </div>
      </div>

      <div className="content">{tab === "data" ? <DataManagementPage /> : <SceneEditorPage />}</div>
    </div>
  );
}

