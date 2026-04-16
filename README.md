# Maritime

- 项目设计 `TECH_SOLUTION.md` 
- 后端 `apps/api` 
- 前端 `apps/web` 
- 数据 `storage`、`storage`

## 1) 后端 FastAPI

```bash
cd Maritime/apps/api
uv venv
.venv\Scripts\activate
uv pip install -r requirements.txt
uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## 2) 前端 Vite + React + Mapbox GL

```bash
cd Maritime
pnpm install
！！！ 添加 .env.local 填写 VITE_MAPBOX_ACCESS_TOKEN
pnpm dev:web
```

## 3) 测试可访问接口

- [http://127.0.0.1:8000/healthz](http://127.0.0.1:8000/healthz)
- [http://127.0.0.1:8000/api/scenes/default](http://127.0.0.1:8000/api/scenes/default)
