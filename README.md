# Slot Hub

Slot Hub 正式網站的原始碼。正式站 `https://www.slothub.com.tw/` 已由本 Repository 透過 Cloudflare Pages（project `slothub`）提供服務，不再使用 Wix；`slothub.com.tw` 以 301 導向 `www`。

第一版包含可操作的全站搜尋、遊戲探索器、最多三款的分享式比較，以及以 Content Collections 維護的遊戲、廠商與教學資料。

## 專案邊界

- 正式網域 `www.slothub.com.tw` 可被索引（HTML `index,follow`、canonical 指向 `https://www.slothub.com.tw/`、`/sitemap.xml` 列出正式網址）。
- `/search/`、`/compare/` 與帶 query 的 `/games/` 為工具頁，回傳 `X-Robots-Tag: noindex, follow`。
- `*.pages.dev` 預覽主機一律 `noindex,nofollow`（見 `slothub-site/functions/_middleware.js`）。
- 舊 Wix 網址的 301 對照表在 `slothub-site/src/lib/legacy-wix-routes.mjs`。
- DNS、Cloudflare 網域設定與索引政策的變更需經專案負責人核准。

## 本機開發

```bash
cd slothub-site
npm ci
npm run dev
npm run verify
```

## Cloudflare Pages

| 設定 | 值 |
|---|---|
| Project name | `slothub` |
| Production branch | `main` |
| Root directory | `slothub-site` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js | `20` |
| `PUBLIC_SITE_ENV` | `production`（preview 分支為 `preview`，見 `slothub-site/wrangler.jsonc`） |

推送到 `main` 即部署正式站，請在推送前執行 `npm run verify`。
