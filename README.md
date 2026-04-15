# Maritime 最小可运行骨架

本目录已初始化 `apps/api + apps/web` 最小骨架，与你的 `TECH_SOLUTION.md` 对齐。

## 1) 启动后端

```bash
cd Maritime/apps/api
uv venv
.venv\Scripts\activate
uv pip install -r requirements.txt
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## 2) 启动前端

```bash
cd Maritime
pnpm install
# copy apps\web\.env.example apps\web\.env.local
# 编辑 .env.local 填写 VITE_MAPBOX_ACCESS_TOKEN
pnpm dev:web
```

## 3) 默认可访问接口

- [http://127.0.0.1:8000/healthz](http://127.0.0.1:8000/healthz)
- [http://127.0.0.1:8000/api/scenes/default](http://127.0.0.1:8000/api/scenes/default)

## 4) ENC 发布约定

若要验证 TileJSON/瓦片接口，请放置：

`storage/derived/enc/<dataset_id>/merged.mbtiles`

然后访问：

- `/api/tiles/enc/<dataset_id>/merged.mbtiles/tilejson.json`
- `/api/tiles/enc/<dataset_id>/merged.mbtiles/{z}/{x}/{y}.pbf`

