# Slot Hub Wix 內容與網域搬移 v1

狀態：READY FOR CLOUDFLARE DOMAIN ONBOARDING
基準日期：2026-09-19  
正式網址：`https://www.slothub.com.tw`

## 這次搬什麼

本輪以 Wix 交接檔列出的 75 篇為完整核對集合，採「內容責任相同才搬或轉」的原則，不用文章篇數決定去向。

- **9 篇重建搬移**：在新站建立完整 Guide；不是把舊 HTML 原封不動貼過來。
- **9 個舊來源合併**：只把能補足既有 Guide 的段落併入，不建立重複薄頁。
- **24 條一對一 301**：舊公開 URL 有明確承接內容，才導到新永久頁。
- **40 條無等價頁的舊公開 URL**：不導首頁或不相干文章，切站後維持正常 404；未來若另有經人工核准的內容再個別處理。
- **11 篇未發布草稿**：沒有已確認公開 URL，不虛構 301；其中 Gamble 與 Demo 重建為新 Guide，中斷紀錄及其他草稿不搬。

機器可讀的唯一網址決策來源為 `src/lib/legacy-wix-routes.mjs`。該檔同時保存 24 條 redirect、40 條未指定承接頁的公開 path，以及 11 個未發布 draft ID。

## 9 篇新站重建頁

| 新站 Guide | 內容責任 | 舊公開網址 |
| --- | --- | --- |
| `/guide/slot-screen-beginners-guide/` | 看懂 Balance、Bet、Win、Paytable、Help 與畫面狀態 | `/post/slots-beginners-how-to-start` |
| `/guide/slot-rng-explained/` | RNG、結果與動畫的界線，以及歷史結果不能預測下一局 | `/post/rng-random-number-generator-explained` |
| `/guide/slot-near-miss-explained/` | near-miss 的視覺與心理感受，不把它當成進度 | `/post/slot-near-miss-explained` |
| `/guide/slot-hold-and-win-explained/` | 鎖定、補位、剩餘次數、重置與停止條件 | `/post/hold-and-win-explained` |
| `/guide/slot-jackpot-explained/` | 固定獎、累積獎池、層級與參與資格 | `/post/jackpot-explained` |
| `/guide/slot-chasing-losses/` | 辨認追輸、停止新投入及取得支持 | `/post/chasing-losses-urge-how-to-handle` |
| `/guide/slot-gambling-harm-signs/` | 生活影響、自我檢視與求助入口 | `/post/electronic-game-overuse-signs` |
| `/guide/slot-gamble-feature-explained/` | Gamble、Collect 與 Multiplier 的差異 | 無公開 Wix URL |
| `/guide/slot-demo-vs-real-money/` | 官網、官方遊戲頁、Demo 與真錢模式的資料邊界 | 無公開 Wix URL |

畫面、RNG、Hold & Win、Gamble 等抽象概念目前以清楚文字、表格與既有可及性樣式承接。未經逐張核對的 Wix 圖不搬；也不生成看似官方的遊戲畫面。風險教育文章不使用情緒化人物或金錢圖片。

## 9 個合併來源

| 舊來源 | 新站承接頁 | 合併內容 |
| --- | --- | --- |
| 中獎線判讀 | Paytable Guide | 用局號、盤面與總派彩核對同一局 |
| Reels／Rows | 術語 Guide | 盤面座標、動態高度及盤面不等於 Ways |
| 總額／單線／單次 | Paytable Guide | 投注單位與 Total Bet 算例 |
| 舊 Paytable 教學 | Paytable Guide | 派彩基準、淨結果與避免重複加總 |
| 舊波動度教學 | Volatility Guide | 相同平均值、不同分布的假想例子 |
| Wild 教學 | Symbols Guide | 替代與加倍是兩件事 |
| Scatter 教學 | Symbols Guide | 同局觸發與跨局收集不同 |
| Free Spins 教學 | Symbols Guide | 剩餘回合與 retrigger 計數 |
| 舊 Cascading 教學 | Cascading Guide | 同一付費回合的逐段派彩對帳 |

Multiplier 與 Megaways 舊文已有更完整的新站承接頁，只做 301，不把較舊正文覆蓋回去。原規劃的獨立「中獎線」頁改併 Paytable，避免重複內容。

## 301 的實作位置

舊路徑由現有 Cloudflare Pages `functions/_middleware.js` 在 `context.next()` 前精確判斷：

1. 只處理 GET／HEAD。
2. 接受舊 URL 有或沒有尾斜線。
3. 保留 query string。
4. Preview 導回同一 `pages.dev` host，讓切 DNS 前即可測試。
5. 正式 apex `slothub.com.tw` 一步導到 `https://www.slothub.com.tw` 的最終目的頁，避免 redirect chain。
6. 沒有等價內容的舊 URL 不套規則，正常落入 404。

不使用 `public/_redirects`：本專案已有根層 Pages middleware，Cloudflare Pages 文件說由 Functions 處理的請求不套用 `_redirects`。同一批規則也不另建 Cloudflare Bulk Redirects，避免兩個 owner 互相衝突。

## 索引與 SEO 切換矩陣

| 環境／頁型 | HTML robots | HTTP X-Robots-Tag | canonical | sitemap |
| --- | --- | --- | --- | --- |
| `*.pages.dev` Preview | `noindex,nofollow` | `noindex, nofollow` | 不輸出 | 空集合 |
| 正式內容頁 | `index,follow` | 不加 noindex | `www.slothub.com.tw` self-canonical | 列入 |
| 正式 Search／Compare | `noindex,follow` | `noindex, follow` | self-canonical | 不列入 |
| 正式 `/games/?...` 篩選狀態 | owner HTML 可讀 | `noindex, follow` | 指向乾淨 `/games/` | 不逐組合列入 |

`public/_headers` 不再放全站 noindex；環境感知的 HTTP robots 與安全標頭由 middleware 統一負責。`robots.txt` 公開 sitemap 位置。正式網域與 `pages.dev` 會共用同一份 Pages build，因此 middleware 會依 hostname 在邊緣層移除 `pages.dev` 的 canonical、強制 HTML noindex，並回傳空 sitemap；Preview 仍保有 HTML、HTTP 與空 sitemap 三層保護。

## 名稱伺服器切換前可完成的事

1. 新內容、301 map、Preview 與 production candidate build 全部驗證。
2. GitHub Actions 同時跑 Preview 與 production-readiness 兩種環境。
3. Cloudflare zone 內完整複製 Wix 現有 DNS 記錄；不能只相信 quick scan，MX、DKIM、SPF、驗證 TXT 等須逐筆核對。
4. Pages production build 透過版本控管的 `wrangler.jsonc` 設 `PUBLIC_SITE_ENV=production`，Preview branch 以 `env.preview` 覆寫為 `preview`；CI 另用明確環境值驗證兩種輸出。
5. 從 Pages 的 Custom domains 流程加入 `slothub.com.tw` 與 `www.slothub.com.tw`；未切 NS 前 pending 屬正常現象，不可只手工加 CNAME。
6. 確認 registrar 沒有舊 DNSSEC／DS；如有，須依 Cloudflare 指示處理後才能安全切換。

## 使用者最後手動步驟

使用者在網域註冊商把名稱伺服器改為 Cloudflare 指定的兩組 NS。此動作才會把正式流量從 Wix 切到 Cloudflare；在此之前不得把 Preview 說成正式上線。

## NS 切換後仍要執行的回讀

- Cloudflare zone、SSL 與兩個 Custom domains 均為 active。
- `http/https`、apex／www 最終只保留一個正式 URL。
- 24 條舊 URL 都是單次 301，目的頁 200；40 條無等價頁不被導到首頁。
- 正式內容頁 canonical、robots 與非空 sitemap 正確；pages.dev 仍 noindex。
- Search、Explorer、Compare、Game、Provider 與 23 篇 Guide 回讀正常。
- 原 DNS 中的郵件與驗證記錄仍可用。
- GSC 提交新 sitemap；同網域換主機不使用 Change of Address。

## 已知限制

本表完整處理交接檔中的 75 篇，但不宣稱涵蓋 Wix 曾存在過的所有歷史 path、外部 backlink 或人工建立過的舊 redirect。切換後應持續觀察 Cloudflare 404 與 GSC，若發現有真正等價內容的歷史 URL，再加入同一版本控管 map；不能將未知 URL 批次導首頁。
