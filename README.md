# Slot Hub

Slot Hub 的獨立重建專案。正式網站目前仍由 Wix 提供服務；本 Repository 只承載新站技術地基與 Cloudflare Pages 預覽環境。

第一版包含可操作的全站搜尋、遊戲探索器、最多三款的分享式比較，以及以 Content Collections 維護的遊戲、廠商與教學資料。

## 專案邊界

- 不修改 Wix、`slothub.com.tw` DNS 或既有網址。
- 不建立 301，不綁定正式網域。
- 預覽環境預設 `noindex,nofollow`。
- 暫時首頁不是正式首頁，也不包含未核准的品牌或遊戲事實。

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
| `PUBLIC_SITE_ENV` | `preview` |

正式切換前必須另案移除預覽索引保護並完成 DNS、canonical、redirect 與 Wix 遷移驗收。本次不執行這些動作。
