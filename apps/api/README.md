# Maritime API（最小骨架）

## 启动

```bash
cd apps/api
uv venv
.venv\Scripts\activate
uv pip install -r requirements.txt
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## 当前能力

- `GET /healthz`：健康检查
- `GET /api/scenes/default`：默认场景配置
- `GET /api/tiles/enc/{dataset_id}/merged.mbtiles/tilejson.json`：ENC TileJSON
- `GET /api/tiles/enc/{dataset_id}/merged.mbtiles/{z}/{x}/{y}.pbf`：ENC 矢量瓦片读取
- `/static/*`：静态资源（挂载 `storage/derived`）

## 约定

- ENC mbtiles 路径：`storage/derived/enc/<dataset_id>/merged.mbtiles`
- SQLite 默认路径：`apps/api/maritime.db`
- 可通过环境变量覆盖：
  - `MARITIME_STORAGE_ROOT`
  - `SQLITE_PATH`

