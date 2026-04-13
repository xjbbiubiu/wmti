# 五迷老师趣味测试（WMTI）

Vue 3 + Express 的趣味问卷：29 题 → 四维分型 + 可截图分享的结果卡。

## 本地运行

**终端 1 — 后端（默认 3000）**

```bash
cd backend && npm install && npm run dev
```

**终端 2 — 前端（Vite 开发服务器，/api 代理到 3000）**

```bash
cd frontend && npm install && npm run dev
```

浏览器打开 Vite 提示的地址（一般为 `http://localhost:5173`）。前端请求使用相对路径 `/api/...`，依赖 Vite `proxy`；若需直连后端，可在 `frontend/.env.development` 设置 `VITE_API_BASE=http://localhost:3000`。

## 测试

```bash
cd backend && npm test
```

## 题量

题库见 `backend/src/data/questions.js`，当前为 **16** 道题。
