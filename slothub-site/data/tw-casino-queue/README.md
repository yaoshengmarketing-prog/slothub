# 台灣娛樂城遊戲佇列（tw-casino-queue）

這是 Slot Hub 目前**唯一**的遊戲收錄工作順序。站主說「請繼續」或每日排程啟動時，一律從 `queue.csv` 取下一批；舊的 `external-intake/horizontal-provider-intake-batch-*` 遊標全部暫停，只保留為歷史紀錄。

## 欄位

| 欄位 | 說明 |
|---|---|
| queue_id | 固定編號，檔案順序＝優先順序，不得重排 |
| zh_name | 台灣大廳常見中文名（遊戲的身分以原廠為準） |
| provider | 大廳標示的遊戲商；`QT:xxx` 表示經 QT 聚合，原廠是 xxx |
| provider_tier | A＝16 家中 10 家以上上架，B＝6–9，C＝3–5，D＝2 以下或只在聚合館 |
| game_casino_count / lobby_clicks_sum | 這款在幾家看得到／大廳點擊數加總，只用來排序 |
| work_type | existing-check、existing-enrich、new-page、msi-draft、rg-candidate |
| slothub_slug | 盤點時判斷已存在的頁面；空白＝盤點時沒找到 |
| queue_state | todo → in_progress → pr_open → done；或 blocked／skipped |
| blocker | blocked 的原因（必填） |
| pr | 處理這筆的 PR 編號 |
| note | skipped 的原因、併入哪一頁（例：`duplicate-of:<slug>`）、未公布欄位 |

## 取下一批

1. 跳過 queue_state 不是 `todo` 的列。
2. 從最上面往下取 **5 筆、同一 provider**（遇到不同 provider 就停，不足 5 筆也可以）。
3. 先把這幾筆改成 `in_progress` 再開工。

## 每一筆的完成標準（全部做到才算 done）

1. **先去重**：用 provider＋中文名／英文原名／別名／原廠 Game ID 搜尋 `src/content/games`。命中就改做「補既有頁」，不開新頁；佇列裡另一列其實是同一款（翻譯不同）就把那列標 `skipped`，note 寫 `duplicate-of:<queue_id 或 slug>`。
2. **原廠身分**：找到原廠官方單款頁或官方遊戲規則／Paytable。找不到 → `blocked`，寫原因，不建頁。娛樂城頁、聚合商頁、第三方站都不能當身分或數值來源。
3. **資料**：RTP、波動度、最高倍數、輪軸／線數、功能只用原廠官方數字；沒有就留空並標「原廠未公布」，不猜、不抄其他站。
4. **圖片**：原廠官方圖，存進 `public/assets/games/`。
5. **Demo**：原廠精確單款 Demo，實際打開確認是同一款才放；沒有就記 not-verified。
6. **中文名**：顯示名順序＝原廠繁中官方名 → 原廠簡中轉繁（OpenCC s2twp）→ 台灣大廳名 → 玩家常用名；其他名稱放 aliases。
7. **同名不同款**：不同遊戲商的同名遊戲，標題帶遊戲商名稱，兩頁互相連結並寫明不是同一款。
8. 新頁用英文 kebab-case slug；完成標準 1–7 都做到的頁，在 PR 內直接設為 `published`（PR 合併即 draft→published 核准，取代 `docs/game-intake-workflow-v1.md` 的另行人工核准）；做不到的維持 `draft` 或標 blocked，不得硬發布。
9. 驗證全過（見下）後才改 `pr_open`，PR 合併後下一次執行改 `done`。

## 驗證

```
npm ci
npm run verify:data
npm run verify:search
npm run verify:provider-official-urls
npm run verify:tw-queue
npm run build
PUBLIC_SITE_ENV=preview npm run verify
npm run verify:tw-queue -- --diff   # 本分支新增的內容不得含禁字（競品網域、RG 推廣網域、推廣碼），必須 0 筆
```

## 不能做的事

- Codex 只開 PR，不合併、不 push main；佇列 PR 由站主授權的審核助理（Grok Bot）審過後合併，合併即 draft→published 核准；刪頁、轉址、noindex 仍須站主核准。
- 不刪頁、不加轉址、不 noindex 線上頁。
- 不在 repo 寫娛樂城網址、推廣碼或競品網站。
- 不為每批新增 verify script 或 progress JSON；進度只寫在這個 queue.csv。
