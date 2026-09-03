# Slot Hub 引導式遊戲探索 Pilot v1 規格

文件狀態：`APPROVED FOR IMPLEMENTATION`

建立日期：2026-09-03

適用範圍：`/tools/` 的單一引導式遊戲探索 Pilot

## 1. 白話目標

完整 Explorer 能處理多種條件，但第一次使用者不一定知道要先選哪個欄位。這個 Pilot 只把兩個容易理解、已有正式結構化資料的選擇，轉成交由 `/games/` 執行的精確條件：先選主要玩法，再視需要選一項功能。

它不是推薦引擎，也不替使用者挑遊戲。畫面必須先展示所選條件、目前 30 款 published Games 中的真實結果數及將要開啟的 Explorer 條件；使用者確認後才前往遊戲庫。

## 2. 人工核准的產品決定

- Pilot 放在既有 `/tools/`，不建立新永久路由。
- 第一個選擇是必填的主要玩法，沿用 Explorer 的 `mechanism` 名稱與值。
- 第二個選擇是可選且最多一項的遊戲功能，沿用 Explorer 的 `features` 名稱與值。
- 主要玩法只提供目前有 published Game 且不是 `other` 的正式選項：賠線、多路贏法、Megaways、群集賠付、任意位置賠付。
- 可選功能第一版限定：連鎖消除、Bonus Buy、倍數、免費旋轉，以及「不限功能」。
- 條件採 AND；選擇功能後，遊戲必須同時符合主要玩法及該功能。
- 結果數必須由現有 published Game catalog 與 Explorer filtering logic 即時計算，不另建統計資料。
- 有結果時，CTA 使用現有 serializer 產生精確 `/games/?mechanism=...&features=...` URL。
- 結果為 0 時顯示真實的 0 款及調整方向，不輸出前往結果的 CTA，也不補入其他遊戲。
- Pilot 不保存、排序或顯示推薦結果卡；遊戲結果的唯一 owner 仍是 `/games/`。

## 3. 頁面角色與狀態責任

| 層級 | 責任 |
| --- | --- |
| `/tools/` Pilot | 協助使用者形成一組簡單條件、預覽真實筆數與精確 Explorer URL |
| Explorer state helper | 驗證、篩選及序列化 `mechanism` 與單一 `features` 條件 |
| `/games/` | 正式結果、分享 URL、Reload、Back／Forward、排序、更多篩選及 Game detail 入口 |
| published Game records | 所有候選資格與結果筆數的唯一資料來源 |

Pilot 自己不成為新的 URL owner，不使用 sessionStorage、localStorage 或隱藏推薦狀態。

## 4. 互動契約

1. 初始狀態沒有預選主要玩法；結果區提示先選主要玩法，不提供 CTA。
2. 選擇主要玩法後，立即顯示中文名稱、真實結果數與精確 mechanism URL。
3. 選擇一項功能後，以完整條件重新計算；再次選擇其他功能會取代上一項，不形成多 Feature AND。
4. 「不限功能」只移除功能條件，不清除主要玩法。
5. 結果大於 0 時，顯示「在遊戲庫查看 N 款」的真實連結。
6. 結果等於 0 時，保留條件摘要及 0 款，說明可改選一項條件；不渲染結果 CTA。
7. CTA 進入 `/games/` 後，Explorer 必須從 URL 恢復相同 mechanism／feature 與相同結果數。

## 5. 文案與風險邊界

- 模組名稱使用「用兩個條件開始探索」。
- 說明強調這是已收錄資料的條件組合，不是遊戲推薦。
- 使用「主要玩法」「可選一項功能」「符合條件」；不使用「適合你」「最佳」「熱門」「容易贏」。
- 不把 Feature 寫成主要賠付 Mechanism，也不因名稱相近改寫 taxonomy。
- 不提供投注、勝率、回本或獲利建議。
- 0 款是有效且必須誠實呈現的結果，不使用 Provider、系列、主題或其他條件補位。

## 6. UI 與可及性

- 保留既有三張工具卡；Pilot 是其後的獨立操作區，不取代完整 Explorer。
- 桌機採「選擇區＋條件回條」雙欄；390px 與 320px 改為單欄。
- 主要玩法及功能使用具 `legend` 的單選群組；每個選項至少 44px 觸控高度。
- 條件回條使用文字、筆數及可複製辨識的精確路徑，不只靠顏色傳達狀態。
- CTA 必須是真正 `<a href>`；0 款與未完成狀態不得產生無目的地 anchor。
- 鍵盤依 DOM 順序操作，`focus-visible` 清楚，狀態變更結果使用禮貌的 live region。
- JavaScript 關閉時，保留 Pilot 說明並提供五個 mechanism-only 精確 Explorer 連結；不假裝可執行動態組合。
- 1440×900、390×844、320×844 不得產生頁面級水平溢位，長 URL 必須安全換行。

## 7. 資料與工程邊界

實作應：

- 新增一個只負責 Pilot 選項與輸出投影的最小純函式；
- 呼叫既有 `emptyExplorerState`、`filterAndSortGames` 與 `gamesIndexUrl`；
- 在 `/tools/` 載入目前 published Game catalog；
- 使用一個小型 React island 處理選擇，不改完整 Explorer；
- 只新增 scoped CSS，不改其他工具、Game detail 或 Guide；
- 新增一支最小 verifier 並接入既有 `npm run verify`。

不得修改 Schema、taxonomy、Game data、Explorer URL schema、Search、Compare、relationship、Guide、Knowledge Map、首頁或 `/slots/`。

## 8. 驗收條件

- 以全部 30 款 published Games 計算。
- 五個 mechanism 與四個 feature 值全部來自既有 taxonomy，沒有 `other`。
- 無功能與單一功能條件的結果數皆與 `filterAndSortGames` 一致。
- 正向條件輸出精確 URL，沒有 `?q=`，沒有第二個 Feature。
- 至少驗證一組 0 款條件：顯示 0 且沒有結果 CTA。
- 進入 `/games/`、Reload 後條件與結果數一致。
- `/tools/` 既有 Search／Explorer／Compare 入口不變。
- 1440×900、390×844、320×844、鍵盤、無 JavaScript、focus-visible、44px touch target 通過。
- `a:not([href])` 為 0；console、hydration、runtime errors 為 0。
- 完整 Preview `npm run verify`、內部連結、Preview safeguards 與 `git diff --check` 通過。

## 9. 不包含事項

- 推薦分數、排名、AI、個人化、使用者喜好記錄。
- 玩法問卷、多步 wizard、多個 Feature、RTP／波動度／最高倍數提問。
- 新結果頁、永久 Feature 頁、薄內容頁或新的 Explorer URL 參數。
- CPA、娛樂城、「立即遊玩」、投注策略或獲利暗示。
- 第 9 項遊戲 DNA Pilot。

## 10. 核准與施工狀態

使用者已於 2026-09-03 核准「主要玩法＋可選單一功能」方案，並授權依既有架構連續完成本機施工、驗證、Commit、Push、CI、Cloudflare Pages Preview 與線上回讀。若需要新增產品決策、資料、Schema、taxonomy、URL schema 或超出單一 Pilot，必須停止。

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_ITEM: 第8項 引導式遊戲探索 Pilot`

`CURRENT_STEP: 第8-1／8-2步 規格同步與本機施工`

`CURRENT_STATE: APPROVED_FOR_IMPLEMENTATION`

`WEBSITE_CHANGED: NO`

`NEXT_ALLOWED_ACTION: 依核准規格完成單一 Pilot、完整驗證、Commit、Push、Preview 部署與線上回讀；不得開始第9項`
