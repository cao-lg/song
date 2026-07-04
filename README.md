# Canto Party · 超級無敵估歌仔

復古 8-bit 像素風粵語歌猜歌網頁應用，基於 iTunes Search API 官方 30 秒預覽音源。

## 技術棧
- React 18 + TypeScript + Vite
- Tailwind CSS 3（自定義像素風主題）
- Zustand（狀態管理）
- React Router DOM（路由）
- Cloudflare Pages Functions（iTunes API 代理）

## 本地開發

```bash
npm install
npm run dev        # 啟動開發伺服器 http://localhost:5173
npm run check      # TypeScript 類型檢查
npm run build      # 生產構建到 dist/
```

開發環境下，前端會自動 fallback 到 JSONP 直連 iTunes API（無需 Functions）。

## 部署到 Cloudflare Pages

1. 將倉庫連接到 Cloudflare Pages
2. 構建命令：`npm run build`
3. 輸出目錄：`dist`
4. `functions/api/get-songs.ts` 會自動映射為 `/api/get-songs`，作為 iTunes API 的同域代理

## 音源方案

- **主方案（生產）**：Cloudflare Pages Functions 代理 `/api/get-songs`，轉發 `https://itunes.apple.com/search?media=music&country=hk&lang=zh_hk`，自帶 1 小時邊緣快取
- **備選方案（開發）**：JSONP 直連 iTunes，零後端成本快速驗證

## 版權聲明
- 頁面底部固定標注：`Preview provided courtesy of Apple Music`
- 僅使用官方 30 秒預覽片段，非商用娛樂用途
