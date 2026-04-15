# Maritime Web（React 最小骨架）

## 启动

```bash
cd Maritime
pnpm install
cd apps/web
copy .env.example .env.local
# 在 .env.local 中填写 VITE_MAPBOX_ACCESS_TOKEN
cd ../..
pnpm dev:web
```

## 说明

- 当前 `apps/web/vector-enc` 与 `apps/web/WaterLayer` 是最小占位实现，接口名与目标集成方式保持一致。
- 你可以将现有成熟实现覆盖到同名目录，`src/main.ts` 基本无需大改。
- 场景通过 `GET /api/scenes/default` 拉取并按 `view + layers` 渲染。

