# Maritime 技术方案（第一版）

本文档用于固化当前阶段达成一致的实现方案。目标是在 `Maritime/` 下快速搭建可运行的涉海场景集成可视化系统，优先跑通数据处理到可视化的完整链路。

## 1. 目标与范围

- 基于现有基础建设（EncTiler、HydroTiler、TerrainTiler、vector-enc、WaterLayer）快速搭建系统。
- 一切新增工程代码在 `Maritime/` 下开展。
- 当前阶段不涉及用户、权限、多租户等概念。
- 当前阶段不引入 docker-compose，依赖本机已有环境。

## 2. 总体架构

系统采用 Monorepo 形态，`Maritime/` 内包含前后端与运行时数据目录。

### 2.1 目录建议

```text
Maritime/
  apps/
    api/                      # Python 后端（API、任务执行、元数据、瓦片发布）
    web/                      # 前端应用（Mapbox + vector-enc + WaterLayer）
      vector-enc/             # 从兄弟目录复制进来并在 web 内维护
      WaterLayer/             # 从兄弟目录复制进来并在 web 内维护
  storage/
    raw/                      # 原始上传数据
    derived/                  # 处理产物（mbtiles、terrain tiles、hydro tiles）
```

## 3. 组件边界与复用策略

### 3.1 后端工具链（不复制）

以下工具保留在兄弟目录，通过环境变量指向绝对路径调用：

- `EncTiler`
- `HydroTiler`
- `TerrainTiler`

说明：

- 不在 `Maritime/` 内复制这三个工具实现。
- 后端通过 subprocess 调用其现有 CLI。

### 3.2 前端图层库（复制）

以下前端库复制到 `Maritime/apps/web/` 内：

- `vector-enc`
- `WaterLayer`

说明：

- 作为 web 子工程内资产统一维护，保证版本可控并降低跨目录依赖复杂度。
- `WaterLayer` 仅当作一个 mapbox custom layer 使用，关注配置参数与集成方式，不关注内部实现细节。

## 4. 后端方案（Python）

推荐使用 FastAPI（或同类 Python Web 框架），满足以下职责。

### 4.1 元数据存储（SQLite）

采用 SQLite 保存最小元数据模型：

- 数据集记录（数据类型、来源、状态）
- 原始文件记录（路径、大小、格式）
- 任务记录（类型、状态、开始结束时间、错误信息）
- 产物登记（仅登记产物路径与发布信息）
- 场景记录（`view + layers` JSON）

当前不包含用户、角色、权限字段。

### 4.2 任务执行器（先简单）

先采用轻量实现（后台任务/线程池/异步子进程）：

- 上传后创建任务。
- 调用既有 CLI 执行处理。
- 完成后登记产物路径，不做复杂调度与分布式队列。

### 4.3 三类处理任务调用方式

- Enc：
  - 调用 `EncTiler/main.py`
  - 关键产物只关注 `merged.mbtiles`
- Terrain：
  - 调用 `TerrainTiler/main.py`
  - 产物为 `z/x/y.png`
- Hydro：
  - 调用 `hydrotiler build -c <job.v1.json>`
  - 产物为时序 `bin` 瓦片目录

## 5. 发布与托管方案

### 5.1 ENC 发布（单文件 merged.mbtiles）

不单独起 mbtiles 服务，后端内置接口实现：

- 基于 `pymbtiles`（或等价能力）读取 `merged.mbtiles`
- 提供 TileJSON 接口
- 提供矢量瓦片读取接口（按 z/x/y）

前端只需要 `sourceBaseUrl`，并按现有 `vector-enc` 约定拼接访问。

### 5.2 其他资源发布

通过 `StaticFiles` 统一发布静态资源：

- Terrain 瓦片目录（png）
- Hydro 瓦片目录（bin / bin.gz）
- 图标与静态资源（后续手工拷贝）
- WaterLayer 运行所需静态配置/资源

## 6. 前端集成方案（apps/web）

### 6.1 基础

- 技术栈：Vite + TypeScript + Mapbox GL
- 包管理：pnpm

### 6.2 图层集成

- `enc` 图层：使用 `vector-enc` 的 `EncOverlayCustomLayer`
- `terrain` 图层：使用 `TerrainLayer`
- `hydro` 图层：使用 `Runtime + TemporalScalarFieldLayer/TemporalVectorFieldLayer`
- `water` 图层：使用复制后的 `WaterLayer`，按 custom layer 方式挂载

说明：WaterLayer 在系统中仅是普通图层类型之一。

## 7. 场景配置模型（第一版）

场景采用配置驱动，结构固定为：

- `view`
- `layers`（若干图层）

建议示例：

```json
{
  "version": 1,
  "name": "demo-scene",
  "view": {
    "center": [114.02814, 22.4729],
    "zoom": 10,
    "bearing": 0,
    "pitch": 45
  },
  "layers": [
    {
      "id": "enc-1",
      "type": "enc",
      "enabled": true,
      "config": {
        "sourceBaseUrl": "/api/tiles/enc/dataset-001",
        "iconBaseUrl": "/static/enc-icons",
        "theme": "DAY_BRIGHT",
        "showLand": true,
        "showSoundings": true
      }
    },
    {
      "id": "terrain-1",
      "type": "terrain",
      "enabled": true,
      "config": {
        "terrainTileURL": "/static/terrain/task-001/{z}/{x}/{y}.png",
        "maskURL": "/static/mask/demo.geojson",
        "exaggeration": 5
      }
    },
    {
      "id": "hydro-1",
      "type": "hydro_scalar",
      "enabled": true,
      "config": {
        "url": "/static/hydro/task-002/{z}/{x}/{y}.bin",
        "minzoom": 1,
        "maxzoom": 7,
        "globalMin": -25,
        "globalMax": 1
      }
    },
    {
      "id": "water-1",
      "type": "water",
      "enabled": true,
      "config": {
        "dataResource": {
          "path": "/static/water/assets/Resources/",
          "config": "config2.json"
        },
        "style": {
          "lightColor": "#FFF4D6",
          "terrainColor": "#FFFFFF",
          "waterShallowColor": "#06D5FF",
          "waterDeepColor": "#0D1AA8",
          "waterOpacity": 0.8,
          "waterDepthDensity": 0.3
        },
        "animation": {
          "swapDuration": 2000,
          "swapTimeStart": 0.75,
          "swapTimeEnd": 1.0
        }
      }
    }
  ]
}
```

## 8. 分阶段落地计划（快速可用）

### Phase 1：骨架搭建

- 建立 `Maritime/apps/api` 与 `Maritime/apps/web`
- 建立 SQLite 与最小数据表
- 建立 `storage/raw`、`storage/derived`

### Phase 2：打通一条处理链

- 先接入 Terrain 或 Hydro 任一链路
- 完成上传、任务、产物登记、静态发布、前端加载

### Phase 3：接入 Enc 全链路

- 调用 EncTiler 生成 `merged.mbtiles`
- 用后端 `pymbtiles` 接口发布 TileJSON + 瓦片
- 前端接入 enc 图层

### Phase 4：场景配置驱动

- 场景 CRUD
- 前端按 `view + layers` 动态渲染
- 将 WaterLayer 作为 `type: water` 图层接入配置

## 9. 环境变量建议

后端建议约定以下环境变量：

- `ENCTILER_ROOT`
- `HYDROTILER_ROOT`
- `TERRAINTILER_ROOT`
- `MARITIME_STORAGE_ROOT`
- `SQLITE_PATH`

说明：前三者指向兄弟目录绝对路径，用于调用现有工具链。

## 10. 当前结论

本方案已对齐以下关键决策：

- 前端库 `vector-enc`、`WaterLayer` 复制到 `apps/web` 内维护
- 后端工具链继续通过兄弟目录绝对路径调用
- ENC 只托管 `merged.mbtiles` 单文件，后端内置 `pymbtiles` 发布接口
- 其他瓦片与图标统一静态发布
- 场景模型采用 `view + layers`，WaterLayer 仅作为普通图层类型

