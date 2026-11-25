# 台灣娛樂城遊戲佇列（tw-casino-queue）

站主說「請繼續」或每日排程啟動時，以 `queue.csv` 為唯一工作順序，依本文件作業。`external-intake/horizontal-provider-intake-batch-*` 與 `nextCursor` 已暫停，只保留為歷史紀錄。

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

## A. 遊戲商順序

由上往下找 `queue.csv` 第一筆 `queue_state=todo` 的列，以該列的 `provider` 為目前遊戲商。依檔案順序處理該遊戲商的待辦。該家已無 `todo` 或本次執行已跳過該家時，依同樣順序找下一筆可處理的 `todo`，轉做該列的遊戲商。

## B. 收集官方目錄，再分批建頁

1. **收集（harvest）**：一次收集該遊戲商的官網、官方遊戲目錄、官方 press kit 或 media kit，比對 `queue.csv` 裡該 `provider` 的所有列。存至 `slothub-site/data/tw-casino-queue/provider-data/<provider-slug>.json`。檔案已存在就沿用並補缺。
2. **建頁**：依該資料檔分批新增或補充既有遊戲頁。

```json
{
  "provider": "<queue.csv 的 provider 原字串>",
  "harvestedAt": "YYYY-MM-DD",
  "catalogSources": ["<官方目錄網址>"],
  "games": [
    {
      "queueIds": ["Q00005"],
      "officialName": "英文官方名",
      "officialPageUrl": null,
      "officialImageUrl": null,
      "rtp": null,
      "volatility": null,
      "maxWin": null,
      "demoUrl": null,
      "zhNames": ["找到的中文名"],
      "matchConfidence": "high",
      "matchNote": "比對依據（Game ID、圖片、英文名、官方中文名等）"
    }
  ]
}
```

`officialPageUrl`、`officialImageUrl` 分別填官方單款頁、官方圖片網址，無資料時填 `null`。`rtp`、`volatility`、`maxWin` 填官方公布值，未公布填 `null`。`demoUrl` 只填實際開啟並確認為同一款的原廠單款 Demo，缺少時填 `null`。`matchConfidence` 只接受 `high`、`medium`、`low`。所有網址限原廠或原廠官方 CDN 的 HTTPS 網址。資料檔禁止放娛樂城網址、推廣碼或競品網站。

## C. 單款卡關就繼續

- 單款無法完成時，把該列標為 `blocked`，在 `blocker` 填 `<類別>: <具體細節>`，立刻做下一款。類別只可用 `no-official-page`、`no-official-image`、`demo-unavailable`、`name-uncertain`、`provider-unconfirmed`、`duplicate-ambiguous`、`source-geo-blocked`、`other`。
- 細節寫清楚缺少的資料、查核的來源及所見 HTTP 狀態。官方網址證據記在該家的資料檔（如 `matchNote`）或 PR 說明。`queue.csv` 只寫來源頁名、狀態和問題，維持無網址。
- 找不到 Demo 或無法確認時記 `not-verified`，可繼續做其餘項目。單純缺 Demo 不構成 `blocked`，即使類別清單包含 `demo-unavailable`。
- 同一家在建頁階段連續 3 款 `blocked` 時，本次跳過該家並換下一家。將原因記在該家的資料檔頂層 `skipNote` 及該家 PR 說明。
- 只有環境故障才中止整次執行，例如網路中斷、瀏覽器完全不可用、驗證工具本身故障或 git 衝突。中止前先儲存 `queue.csv` 與 `provider-data/` 進度並回報。

## D. 發布品質門檻

1. **先去重**：用 provider＋中文名／英文原名／別名／原廠 Game ID 搜尋 `src/content/games`。命中就補既有頁。佇列另一列若只是同款的不同譯名，標 `skipped`，在 `note` 寫 `duplicate-of:<queue_id 或 slug>`。
2. **確認原廠身分與內容**：以官方單款頁、官方遊戲規則或 Paytable 確認身分，並至少取得原廠遊戲介紹或功能說明。娛樂城、聚合商與第三方頁面不得作為身分或數值來源。
3. **官方數字與圖片**：RTP、波動度、最高倍數、輪軸／線數與功能數值只用原廠公布的資料。未公布的數字留空並標「原廠未公布」。使用原廠官方圖片並存入 `public/assets/games/`。
4. **中文名**：顯示名依序採原廠繁中官方名 → 原廠簡中轉繁（OpenCC s2twp）→ 台灣大廳名 → 玩家常用名，其他名稱放入 `aliases`。
5. **同名不同款**：不同遊戲商的同名遊戲，標題帶遊戲商名稱，兩頁互相連結並明確說明各自是不同的遊戲。
6. **頁面狀態**：新頁用英文 kebab-case slug。通過原廠身分、官方圖片、中文名與去重檢查，且具備原廠遊戲介紹或功能說明，才可在 PR 設為 `status: published`。缺少 Demo 可照常發布並記 `not-verified`。內容不足的頁維持 `draft`，不得發布薄頁。PR 合併即為 draft→published 核准，取代 `docs/game-intake-workflow-v1.md` 的另行人工核准。

## E. 每次執行的量與 PR

- 開工前先處理既有 `tw-queue/` PR 的審查意見，完成修正、重跑驗證，並 push 到原分支。
- 每次執行以所有 PR 合計至少 10 款為目標，時間允許就繼續做，一次最多開 3 個 PR。
- 每個 PR 最多約 10 款，且只含一家遊戲商。10 款是上限，不是配額：某家只剩 6 款，就做完這 6 款開 PR，再換下一家另開新的 PR；絕不混不同遊戲商湊滿 10 款。
- 「至少 10 款」是整次執行所有 PR 合計（最多 3 個 PR）。
- PR 說明須有逐款表。RTP、波動、最高倍數各自未公布時填「原廠未公布」。並附上本 PR 的 blocked 依類別統計。

| queue_id | 中文名 | 英文官方名 | slug | 新頁／補頁 | published／draft | 官方頁網址 | RTP／波動／最高倍數 | Demo 狀態 |
|---|---|---|---|---|---|---|---|---|

| 類別 | 數量 | queue_id 清單 |
|---|---|---|

## F. 狀態流轉

`todo` → `in_progress` → `pr_open` → `done`，另有 `blocked` 和 `skipped`。開始處理某列時改為 `in_progress`，驗證全過後才改為 `pr_open` 並填 PR 編號。PR 合併後，下一次執行將對應的 `pr_open` 改為 `done`。PR 關閉且未合併時，將對應的 `pr_open` 改回 `todo` 並在 `note` 記錄原因。

## G. 不能做的事

- Codex 只開 PR，不合併、不 push main。佇列 PR 由站主授權的審核助理（Grok Bot）審過後合併，合併即 draft→published 核准。刪頁、轉址、noindex 仍須站主核准。
- 不在 repo 寫娛樂城網址、推廣碼或競品網站。不提及、不連結、不抄禁用的競品網站。
- 不為每批新增驗證腳本或進度 JSON，`provider-data/*.json` 除外。
- 未經站主當次同意不使用付費瀏覽器。

## H. 驗證

在 `slothub-site` 執行下列指令。`--diff` 會檢查新增行的禁字，包括競品網域、RG 推廣網域和推廣碼，必須為 0 筆。佇列和本文件不得含網址，原廠網址可存在 `provider-data/`。

```sh
npm ci
npm run verify:data
npm run verify:search
npm run verify:provider-official-urls
npm run verify:tw-queue
npm run build
PUBLIC_SITE_ENV=preview npm run verify
npm run verify:tw-queue -- --diff
```
