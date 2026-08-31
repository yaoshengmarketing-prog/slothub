# Slot Hub 核心動線一致性 v1 只讀規格

文件狀態：`APPROVED FOR LOCAL IMPLEMENTATION`

盤點日期：2026-08-31

依據：`docs/slot-hub-master-blueprint-v2.md`、`docs/slot-hub-work-roadmap.md` 與目前本機 Preview 實作

範圍：第 2 項「核心動線一致性」第 2-1 步，只讀盤點 Search、Explorer、Game detail、Compare、Header 數量、跨頁狀態交接、假 CTA 與過時文案

> 本文件記錄目前行為、使用者問題與候選互動契約，不授權修改網站、測試、Schema、taxonomy、資料、內容、Commit、Push 或部署。

## 1. 白話摘要

目前遊戲資料、搜尋排名、Explorer 篩選、Game detail 與最多三款 Compare 的核心功能都能正常運作；分享 Explorer 與 Compare 網址也已具備可用基礎。真正不一致的是「狀態如何進入網址、如何被上一頁還原」：

1. 首頁與 `/search/` 的搜尋詞只存在 React 記憶體，沒有寫入 `?q=`。首頁也沒有提交到完整 Search 的動作。因此 Search 網址不能分享，重新整理或由結果返回後會失去搜尋詞與結果。
2. `/games/` 能由網址完整恢復 Explorer 條件，但條件變更一律使用 `replaceState`。使用者按上一頁不會逐步返回先前篩選狀態，而會離開遊戲庫。
3. 首頁與 `/slots/` 的嵌入式 Explorer 是暫時狀態。透過「在完整遊戲庫開啟這組條件」可正確交接；若直接點遊戲卡，返回後條件會重置。首頁另有固定的「查看完整遊戲庫」裸連結，可能讓已選條件被忽略。
4. Compare 分享網址、重新整理、三款限制與 URL 清理可正常運作；但選擇變更也只用 `replaceState`，且沒有 `popstate` 還原。瀏覽器上一頁不能撤回清除或回到前一組比較。Header 數量以 `localStorage` 為準，Compare 頁則是「有 query 時 URL 優先，否則 localStorage」，權責尚未形成完整契約。
5. `/slots/` 的 RTP 與波動度各有一個看似連結、實際沒有 `href` 的「探索遊戲」入口。這兩個 Data Topic 尚無精確 Explorer 條件，不應渲染假連結。
6. 首頁與 Provider 頁仍有「首批遊戲」「第一版公開四家 Seed Data」等已被 30 Games／11 Providers 超越的文字。

這些問題屬於 v2 第 2 項；不需要重做搜尋演算法、首頁、Schema 或資料模型。

## 2. 盤點方法與基線

### 2.1 基線

- Git HEAD：`d0ac6ddbd70941a24023c35ad744d0a6fde2c3f7`
- HEAD 是尚未 Push 的 v2 藍圖／路線表核准 Commit；本輪不修改、amend、rebase、reset 或 Push。
- 公開基線：30 Games、11 Providers、11 Guides、166 筆 Game → Guide 關聯。
- 本機環境：`PUBLIC_SITE_ENV=preview`。

### 2.2 驗證方式

- 直接閱讀 Search、Explorer、Compare、Header、URL serializer、頁面與既有測試程式。
- 以本機 Preview 實際輸入、點擊、重新整理、上一頁、下一頁與直接開啟分享 URL。
- 以 1440×900、390×844、320×844 檢查首頁、Search、Slots、Games、Game detail 與 Compare。
- 瀏覽器因垂直捲軸而分別得到 1425、375、305 CSS px 的文件可用寬度；所有頁面的 `document.documentElement.scrollWidth` 與 `clientWidth` 相同，沒有頁面級水平溢位。
- Compare 寬表只在 `.compare-scroll` 內部捲動，沒有推寬整頁。
- 瀏覽器實測沒有 console error、console warning、hydration error 或 runtime error。

## 3. 現有頁面角色與狀態 owner

| 頁面／入口 | 現有角色 | 現有狀態 owner | 判定 |
| --- | --- | --- | --- |
| 首頁 Search | 即時顯示最多 8 筆跨類型結果 | 元件內 `q` state | `PARTIAL`：不是完整 Search 的入口，狀態不可分享 |
| `/search/` | 完整 Search 的頁面外殼與同一份搜尋目錄 | 元件內 `q` state | `FAIL`：網址、輸入框與結果沒有同步 |
| 首頁 Explorer | 低門檻嵌入式探索、最多先顯示 8 款 | 元件內 Explorer state | `PARTIAL`：有精確 handoff，但直接進 Game 後返回會重置 |
| `/slots/` Explorer | 老虎機情境入口與 subtype／知識入口 | 元件內 Explorer state | `PARTIAL`：handoff 未固定帶 `type=slots`，Data Topic 有假 CTA |
| `/games/` | 完整 Explorer 唯一 owner | URL query 與元件 state | `PASS_WITH_HISTORY_GAP`：可恢復與正規化，但所有變更只 replace |
| Game detail | 核對單款身份、資料、來源、Guide 與加入 Compare | 路由＋`localStorage` Compare selection | `PASS`：返回 owner 頁時，能否恢復取決於前頁是否把狀態寫入 URL |
| Compare | 最多三款並排、分享比較組合 | URL query 優先；無 query 時 `localStorage` | `PASS_WITH_HISTORY_GAP`：分享可用，歷史與權責未完整同步 |
| Header 比較數量 | 顯示跨頁暫存的 Compare 數量 | `localStorage` 原始陣列長度 | `PARTIAL`：即時事件正常，但未自行正規化未知、重複或超過三款資料 |

## 4. Search 實際狀態來源

### 4.1 現況

| 項目 | 實際行為 |
| --- | --- |
| 搜尋輸入 | `SearchHub.tsx` 的 React `useState('')` |
| 結果 | 由共用 `rankSearch()` 即時計算，最多 8 筆 |
| URL | `searchUrl(query)` helper 已存在，但目前 Search UI 未使用 |
| 首頁交接 | 沒有 `<form>`、提交按鈕或 Enter 導向 `/search/` 的行為 |
| 重新整理 | 清空輸入與結果 |
| 返回 | 從結果返回 `/search/` 或首頁時，輸入與結果清空 |
| 直接分享 | `/search/?q=死者之書` 保留網址文字，但 UI 不讀取，輸入空白、0 筆結果 |
| 查詢支援 | 中文、英文、aliases、空白與無結果訊息本身正常 |
| SEO | `/search/` 原則為 noindex；Preview 實際維持 `noindex,nofollow` |

### 4.2 實測

- `麻將胡了`：可找到 Mahjong Ways 與 Mahjong Ways 2。
- `Starburst`：可找到 Starburst 與 NetEnt Provider。
- alias `死者之書`：可找到 Rich Wilde and the Book of Dead。
- 無結果字串：顯示清楚的無結果訊息。
- 空白：不渲染結果區。
- 首頁輸入後按 Enter：網址仍為 `/`，沒有進入完整 Search。
- `/search/?q=死者之書` 直接開啟與重新整理：網址有 query，但輸入框與結果沒有恢復。
- `/search/` 搜尋後進入 Game detail 再返回：回到空白 Search。

### 4.3 使用者影響

- 分享連結與重新整理不可靠。
- 搜尋結果頁名稱看似正式 owner，實際卻不擁有 URL 狀態。
- 使用者從結果閱讀資料後返回，必須重新輸入。
- Search 結果卡沒有直接「加入 Compare」；目前路徑必須先進 Game detail。這不一定是缺陷，但需維持清楚角色，不能在第 2 項順手擴成新的結果卡功能。

## 5. Explorer 實際狀態來源

### 5.1 URL schema

| 狀態 | Query 參數 | 備註 |
| --- | --- | --- |
| 關鍵字 | `q` | 非空白文字 |
| Provider | `provider` | published catalog 中的合法 slug |
| 主類型 | `type` | 目前有效值包含 `slots` |
| Subtype | `subtype` | taxonomy 中且目前 catalog 有使用的值 |
| Mechanism | `mechanism` | 現有 Game 使用的合法值 |
| Features | `features` | 逗號分隔、去重、固定排序；多 Feature 使用 AND |
| 最低 RTP | `rtp-min` | 目前只接受 96、96.2、96.5 |
| 統一波動度 | `volatility` | 只接受目前 catalog 中的統一值 |
| 最低最高倍數 | `max-win-min` | 目前只接受 5000、10000、25000 |
| 排序 | `sort` | relevance、name-asc、RTP／Max Win 升降冪；預設值不輸出 |

### 5.2 正確行為

- `/games/` 是完整 Explorer 唯一 owner，只有此處啟用 `urlState`。
- 直接分享 URL、重新整理與由 Game detail 返回，能恢復相同條件與結果。
- Serializer 會固定 query 與多選值順序，避免相同狀態產生多個網址。
- 未知參數、無效值、重複 Feature 會被安全忽略或去重，再以 `replaceState` 正規化。
- Feature 內部 AND、不同 facet 之間 AND。
- 數值缺值在篩選時被排除，排序時放在已知值之後，不會當成 0。
- 清除全部條件後回到乾淨 `/games/`。
- 首頁與 `/slots/` 篩選後會出現精確 handoff 連結。
- `/slots/` subtype 卡片使用精確 `type=slots&subtype=...` URL。

### 5.3 不一致

- `/games/` 每次變更都呼叫 `history.replaceState`，沒有建立可逐步返回的篩選歷史。實測先選 PG SOFT、再加 Wild，按上一頁直接回首頁，而不是回到只選 PG SOFT。
- 首頁或 Slots 直接從嵌入式 Explorer 點 Game detail，返回後嵌入式條件重置。這符合目前「暫時入口」實作，但 UI 沒有明確說明。
- 首頁有兩個不同角色的遊戲庫入口：篩選後出現的精確 handoff，以及永遠指向裸 `/games/` 的「查看完整遊戲庫」。在已有條件時，後者會遺失條件。
- Slots 的嵌入式 Explorer handoff 只序列化使用者已選條件；如果只選 Provider，網址不包含 `type=slots`。在目前 30 款皆為 slots 時結果相同，但沒有保存 Slots 入口的產品語境，也不利未來多類型 catalog。

## 6. Compare 實際狀態來源

### 6.1 權責現況

| 情境 | 權威來源 | 實際行為 |
| --- | --- | --- |
| 遊戲卡／Game detail 加入移除 | `localStorage['slothub-compare']` | 去重、只接受目前頁面提供的合法 slug、最多 3 款 |
| Header 數量 | localStorage 原始 JSON 陣列長度 | 自訂事件與 storage event 後即時更新 |
| 開啟 `/compare/?games=...` | URL query | query 存在時勝過 localStorage；去重、過濾未知、截為 3 款 |
| 開啟 `/compare/` | localStorage | 還原上次跨頁選擇並把 URL 正規化為 `?games=...` |
| Compare 內新增／移除／清空 | Compare state＋localStorage＋URL | 三者同步，但只使用 `replaceState` |

### 6.2 正確行為

- 從 Game detail、Games 卡片加入或移除，Header 數量會即時更新。
- 第三款後選擇器停用，維持最多三款。
- 分享 URL 與重新整理能恢復比較組合。
- query 與 localStorage 衝突時，現有規則明確採 query 優先並同步回 localStorage。
- 重複 slug 被去重，未知 slug 被忽略，超過三款被截斷；網址會正規化。
- 清空後為 `/compare/`、Header 0、localStorage 空陣列。
- Compare → Game detail → 返回可恢復目前比較組合。

### 6.3 不一致

- Compare 內所有改變只使用 `replaceState`，也沒有監聽 `popstate`。清空後按上一頁只會離開 Compare；不能用瀏覽器返回復原清空前的三款。
- Header 只讀 localStorage 的陣列長度，不自行去重、驗證 slug 或限制三款。正常 UI 寫入時結果正確，但手動或舊版殘留資料可能造成暫時錯數。
- Header 連結固定為裸 `/compare/`，需等 Compare hydration 後才由 localStorage 正規化網址。功能可用，但 URL 與顯示數量不是同一瞬間的權威來源。
- Compare workspace 使用 `client:only="react"`；核心比較表需要 JavaScript。這是既有架構事實，本規格只要求第 2 項維持現有功能，不把無 JavaScript Compare 重建列入範圍。

## 7. 跨頁情境結果

| 情境 | 預期 | 實際 | 結果 |
| --- | --- | --- | --- |
| 首頁搜尋 → Search → Game detail → 上一頁 | 首頁提交 query 到 `/search/?q=...`，返回保留搜尋 | 首頁沒有進入完整 Search 的提交；直接點結果後返回只保留首頁路由，query 清空 | `FAIL` |
| 首頁 Explorer → Games → Game detail → 上一頁 | handoff 保存條件，Games 與返回結果一致 | 使用精確 handoff 可成立；若直接點嵌入式卡片再返回，首頁條件重置；裸「查看完整遊戲庫」會丟條件 | `PARTIAL` |
| Slots Explorer → Games → Game detail → 上一頁 | handoff 保存 Slots 語境與條件 | 已選條件可交接並由 Games 恢復；未固定帶 `type=slots`，直接點卡片返回時重置 | `PARTIAL` |
| Search → 加入 Compare → Compare | Search 結果可沿清楚路徑加入並進 Compare | 必須 Search → Game detail → 加入 → Header／Compare；可完成但多一步 | `PARTIAL` |
| Games → 加入 Compare → Compare → Game detail | 選擇、Header、Compare URL 與返回狀態一致 | 正常；目前 localStorage 與 Compare query 可保留 | `PASS` |
| 直接開 Search 分享 URL | query、輸入與結果一致 | URL 有 `q`，UI 不讀取 | `FAIL` |
| 直接開 Explorer 分享 URL | 條件、排序與結果一致 | 正常；無效 query 會安全正規化 | `PASS` |
| 直接開 Compare 分享 URL | 合法三款、URL、Header、localStorage 一致 | 正常；query 優先，未知／重複／超量安全清理 | `PASS` |

## 8. 假 CTA 與過時文案

### 8.1 假 CTA

| 路由 | 顯示 | 實際問題 | 負責檔案 | 是否屬第 2 項 |
| --- | --- | --- | --- | --- |
| `/slots/` Knowledge Map／RTP | `探索遊戲 →` | `<a>` 無 `href`；Data Topic 目前沒有精確 Explorer URL | `src/pages/slots/index.astro` | 是 |
| `/slots/` Knowledge Map／波動度 | `探索遊戲 →` | `<a>` 無 `href`；Data Topic 目前沒有精確 Explorer URL | `src/pages/slots/index.astro` | 是 |

1440、390、320 三種寬度都各找到 2 個 `a:not([href])`。首頁、Games、Search、Compare 未找到同類無 `href` 假入口。Guide relationship catalog 在 Search 與 Guide detail 已正確抑制無精確 URL 的 Data Topic Explorer CTA，因此建議沿用同一原則，不建立新 URL schema。

### 8.2 過時文案

| 路由 | 現有文字 | 負責檔案 | 判定 |
| --- | --- | --- | --- |
| `/` | `30 款首批遊戲` | `src/pages/index.astro` | 數量正確，但「首批」已過時，屬第 2 項 |
| `/` | `第一批編輯精選` | `src/pages/index.astro` | 歷史批次語氣已過時，屬第 2 項 |
| `/` | `第一版仍以老虎機為核心` | `src/pages/index.astro` | 產品方向仍正確，但「第一版」已過時，屬第 2 項 |
| `/providers/` | `第一版公開四家 Seed Data` | `src/pages/providers/index.astro` | 與目前 11 Providers 明確矛盾，屬第 2 項 |
| `/providers/{slug}/` | `{N} 款首批資料` | `src/pages/providers/[slug].astro` | 「首批」已過時，屬第 2 項 |
| `/fishing-games/` | `內容會隨首批遊戲資料逐步增加` | `src/pages/fishing-games/index.astro` | 歷史批次語氣已過時；可在第 2 項一併移除，但不得改變 Fishing 產品範圍 |

## 9. 建議的產品互動契約

### 9.1 共通原則

1. 正式 owner 頁的可分享狀態必須以 URL 為權威；React state 只負責當前渲染。
2. 只有跨頁持續但不適合放在所有頁面 URL 的 Compare 暫存選擇使用 localStorage。
3. URL parser 必須忽略未知或過時值；serializer 必須輸出固定順序、去重後的 canonical tool-state URL。
4. 無效狀態的正規化使用 `replaceState`，不建立垃圾歷史項目。
5. 使用者明確提交或改變離散狀態時使用 `pushState`；連續文字輸入的中間狀態使用 debounce 後 `replaceState`，避免每個字元建立一筆歷史。
6. 所有 owner 頁監聽 `popstate`，依 URL 完整恢復 UI 與結果，不以舊 React state 覆蓋網址。
7. 首頁與 Slots 是入口，不是第二個 owner；只在本地暫存嵌入式狀態，透過精確連結交接到 owner。
8. 呼叫 `pushState` 或 `replaceState` 前先比較 canonical URL 與目前 URL；完全相同時 no-op，不建立重複 history entry。
9. 首頁跨頁提交使用正常導覽，自然建立新的瀏覽歷史；owner 頁明確提交只有在 canonical URL 不同時才 push。
10. 無效或過時 query 的正規化只使用 `replaceState`。

### 9.2 Search 契約

- 唯一 owner：`/search/`。
- 唯一 query：`q`；空白 trim 後視為無搜尋，輸出乾淨 `/search/`。
- 首頁 Search 應使用可提交的 GET form 或等效可鍵盤提交語意；Enter／提交以正常導覽 push 到 `/search/?q=...`。
- `/search/` 初次載入、重新整理與 `popstate` 必須由 `q` 恢復輸入與結果。
- `/search/` 文字輸入可 debounce 後 `replaceState`；使用者按 Enter／明確提交時可 `pushState`。是否保留「每次提交」歷史需人工決定，不能為每個按鍵 push。
- 未知 query 不報錯；空值回乾淨 URL；沒有結果仍保留合法 `q` 供分享。
- Search 排名演算法、索引目錄與 noindex 原則維持不變。

### 9.3 Explorer 契約

- 唯一 owner：`/games/`；沿用現有 query schema，不新增參數。
- 離散操作（Provider、Mechanism、Feature、RTP、波動度、最高倍數、Subtype、排序、清除）建議 `pushState`，讓上一頁還原上一組已提交篩選。
- Explorer 文字搜尋 `q` 建議 debounce 後 `replaceState`；按 Enter／明確提交可建立一筆 `pushState`。
- `popstate` 依 URL 恢復全部 state 與結果；現有 parser／serializer、AND、缺值與排序規則維持。
- 無效／重複／過時 query 以現有 parser 安全降級，再用 `replaceState` 正規化。
- 首頁嵌入式 Explorer 維持暫時狀態；有條件時所有「前往完整遊戲庫」主入口都應使用同一精確 handoff URL。
- Slots 嵌入式 Explorer handoff 應始終包含 `type=slots`，再合併使用者條件；subtype 卡片規則維持。
- 是否要讓嵌入式 Explorer 在返回時恢復狀態，需人工決定。推薦 v1 不新增 sessionStorage：將主要動作清楚導向 `/games/` owner；直接進 Game detail 後返回仍可重置，避免製造第二份狀態系統。

### 9.4 Compare 契約

- Compare 頁權威：URL `games=slug-a,slug-b,slug-c`，順序即欄位順序；最多三個、去重、只保留 published Game。
- 跨頁暫存與 Header 數量：localStorage，內容必須是與 Compare URL 相同的正規化 slug 陣列。
- 有 `games` query 時 URL 優先並同步 localStorage；無 query 時 localStorage 作為繼續上次選擇的 fallback，然後以 `replaceState` 正規化 URL。
- 第一次直接開啟裸 `/compare/` 時可以使用 localStorage fallback；透過 `popstate` 回到裸 `/compare/` 時，裸網址代表明確空白比較狀態，不得再次從 localStorage 補回遊戲。
- Compare 內新增、移除、清空屬離散操作，建議 `pushState`；`popstate` 依 URL 還原選擇，同步 localStorage 與 Header。
- 未知、重複、超量 query 以 `replaceState` 清理，不產生額外歷史。
- 遊戲卡與 Game detail 的加入／移除繼續更新 localStorage 與 Header；前往 Compare 時使用當下正規化選擇生成 URL。
- Header count 必須反映正規化後的 0～3，而不是未驗證陣列長度。
- 清空後 URL、Header、localStorage 都為空；若以 Back 返回清空前歷史，三者必須一起恢復。

## 10. 已核准互動決策

2026-08-31 人工核准以下五項產品決策，作為第 2-2 步本機施工依據：

1. 採用「離散操作 push、連續文字 replace」的共同 history 契約，並套用第 9.1 節的 canonical URL 防重複規則。
2. 首頁與 Slots 嵌入式 Explorer 維持暫時狀態，不建立第二個持久化 owner；直接進 Game detail 後返回可以重置。
3. Search 結果維持先進 Game detail，再加入 Compare，不新增結果卡 Add Compare。
4. Slots handoff 固定加入 `type=slots`，再合併使用者條件。
5. Provider 與 Fishing 的過時批次文案一併納入第 2 項。

### 10.1 History 粒度

| 方案 | 行為 | 影響 |
| --- | --- | --- |
| A：全部 `replaceState` | 維持現況 | URL 可分享，但 Back 不能逐步撤回；不符合第 2 項目標 |
| B：每次輸入都 `pushState` | 每個按鍵、每個 filter 都可返回 | 歷史污染嚴重，不推薦 |
| C：離散操作 push、文字輸入 replace、提交 push | Filter／Compare 可逐步返回，文字輸入不污染歷史 | **推薦**；需統一 Search／Explorer／Compare 的提交定義 |

已核准方案 C。Search／Explorer 明確提交時，只有 canonical URL 與目前 URL 不同才建立一筆 history；相同網址 no-op。

### 10.2 嵌入式 Explorer 返回狀態

| 方案 | 影響 |
| --- | --- |
| A：首頁／Slots 也寫入自己的 URL 或 sessionStorage | 返回可恢復，但產生第二套 owner 與較大範圍 |
| B：維持暫時狀態，強化精確 handoff 到 `/games/` | 架構最小、角色清楚；直接卡片路徑返回仍重置 |

已核准 B；直接從嵌入式卡片進 Game detail，返回後重置是刻意保留的行為。

### 10.3 Search 結果加入 Compare

- 方案 A：維持 Search → Game detail → Add Compare，角色單純。
- 方案 B：Search 結果新增 Add Compare，縮短一步，但會修改 Search 結果卡互動與手機負擔。

已核准 A；本輪不擴張結果卡能力。

## 11. 建議施工範圍與候選檔案

### 11.1 最小施工內容

1. Search 讀寫 `q`、首頁提交 handoff、reload／popstate。
2. Explorer 與 Compare 採核准的 history 契約。
3. Header count 使用正規化 Compare selection。
4. 首頁／Slots 的 Explorer 主 handoff 一致，Slots 固定保存 `type=slots`。
5. `/slots/` 不再渲染無精確 URL 的 Data Topic「探索遊戲」假連結；保留「了解概念」。
6. 移除已列出的批次／Seed Data 過時文字，不改產品內容。
7. 擴充既有 Search、Explorer、Compare 與 UI 測試，覆蓋 URL、reload、popstate、handoff 與三種 viewport。

### 11.2 候選檔案

- `src/components/SearchHub.tsx`
- `src/components/GameExplorer.tsx`
- `src/components/CompareWorkspace.tsx`
- `src/components/SiteHeader.astro`
- `src/lib/urls.ts`（若只需沿用 helper，可能不必修改）
- `src/lib/game-explorer-state.mjs`（原則上不改規則，只在 history helper 確有必要時評估）
- `src/pages/index.astro`
- `src/pages/search/index.astro`
- `src/pages/slots/index.astro`
- `src/pages/providers/index.astro`
- `src/pages/providers/[slug].astro`
- `src/pages/fishing-games/index.astro`
- `scripts/test-search.mjs`
- `scripts/test-game-explorer.mjs`
- Compare／核心動線所需的一支最小測試（若現有測試無法承接，可提案新增一支；不得先建大型框架）

實作前應以人工核准後的契約重新鎖定檔案清單；候選不等於全部都必須修改。

## 12. 明確不包含

- 全面重做首頁或 Search UI。
- 新搜尋演算法、AI 搜尋、推薦系統或 CPA。
- 新 Schema、taxonomy、Game／Provider／Guide 資料或 relationship owner。
- 新 Explorer facet、Compare v2 資料判讀、Game detail 相同玩法探索。
- Guide detail、Knowledge Diagram、Guide Typography 或內容改寫。
- Wix、migration、301、410、GSC、DNS、舊內容搬移或正式索引設定。
- 將 Compare 改造成無 JavaScript 應用。
- 讓首頁或 Slots 成為第二個正式 Explorer owner。

## 13. 驗收條件

### 13.1 Search

- 首頁 query 能以可提交、可鍵盤操作的方式進 `/search/?q=...`。
- 直接開啟、重新整理、分享、上一頁／下一頁時，URL、輸入框與結果一致。
- 空白、中文、英文、alias、無結果與無效編碼安全處理。
- Search noindex 原則不變。

### 13.2 Explorer

- 現有全部參數、排序、Feature AND、跨 facet AND、缺值規則維持。
- 離散篩選的 Back／Forward 依核准契約恢復。
- 首頁與 Slots handoff 產生精確 `/games/?...`；Slots 保留 `type=slots`。
- 清除、未知、重複、過時 query 的 URL 與 UI 一致。

### 13.3 Compare

- 加入、移除、三款限制、清空、URL、localStorage 與 Header 0～3 同步。
- 分享、reload、Back／Forward、query 與 storage 衝突、未知／重複／超量 slug 全部符合契約。
- Compare → Game detail → Back 不遺失組合。

### 13.4 CTA、文案與回歸

- `/slots/` 不存在 `a:not([href])` 假 CTA；無精確 Explorer URL 時只顯示合法入口。
- 已列過時文案移除或改為當前、非批次語氣。
- 1440、390、320 無頁面級水平溢位；Compare 只在內部捲動。
- 表單、按鈕與連結具正確語意與鍵盤操作。
- console、hydration、runtime errors 為 0。
- 30/30 資料、Search、Explorer、relationship、Game detail、Compare、Build、內部連結與 Preview safeguards 全部通過。
- Preview 維持 HTML `noindex,nofollow`、HTTP `X-Robots-Tag: noindex, nofollow`、空 sitemap、無 canonical。

## 14. 基線測試結果

執行命令（PowerShell 等效語法）：

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
$env:PUBLIC_SITE_ENV='preview'
npm run verify
```

結果：`PASS`

- 資料審計：30／30。
- Search、Explorer、Guide relationship：通過。
- Astro Check：0 errors、0 warnings、95 hints。
- Static Build：62 pages。
- Build safeguards：13 outputs、16 media files、13 safeguards 通過。
- Game detail fixtures、166-entry relationship UI、Knowledge Diagram、內部連結：通過。
- `git diff --check`：在文件完成後另行執行並記錄於固定出口。

既有單元測試通過不代表上述 browser history 缺口不存在；現有測試主要驗證純函式、資料結果與靜態輸出，沒有完整覆蓋 Search URL hydration 或 Compare／Explorer 的 history traversal。

## 15. 人工決策結果

五項決策均已核准進入第 2-2 步本機施工；本文件不再有待決互動選項。施工不得擴張至第 11.2 節以外的新產品能力。

## 16. 下一階段建議

依已核准決策進入第 2-2 步本機最小施工。施工應先鎖定 URL／history 行為測試，再修改 Search、Explorer、Compare 與兩個假 CTA；不得直接跳到首頁重做、Compare v2 或第 3 項。

## 17. 文件出口

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_ITEM: 第2項 核心動線一致性`

`CURRENT_STEP: 第2-1步 只讀盤點核心動線與建立產品互動規格`

`CURRENT_STATE: READONLY_SPEC_COMPLETE`

`WEBSITE_CHANGED: NO`

`SEARCH_RESULT: PARTIAL；搜尋內容本身正常，但 URL hydration、分享、reload、Back／Forward 與首頁 handoff 未完成`

`EXPLORER_RESULT: PARTIAL；分享、reload、正規化與資料規則正常，但離散條件只 replaceState，嵌入式返回狀態與 Slots type 語境不完整`

`COMPARE_RESULT: PARTIAL；分享、三款限制與 URL／storage 清理正常，但 history traversal、popstate 與 Header 正規化權責未完成`

`CROSS_FLOW_RESULT: PARTIAL；Games／Compare 主路徑可用，Search 與嵌入式 Explorer 返回狀態有斷點`

`FAKE_CTA_RESULT: FAIL；/slots/ 的 RTP、波動度各有一個無 href 的探索遊戲入口`

`STALE_COPY_RESULT: FAIL；首頁、Provider 與 Fishing 仍有首批／第一版四家 Seed Data 等過時文字`

`TEST_RESULTS: PASS；完整 Preview npm run verify 通過，Astro Check 0 errors／0 warnings，Build 62 pages；瀏覽器三種寬度無整頁溢位與 runtime errors`

`HUMAN_DECISIONS_REQUIRED: NO；五項互動決策已於 2026-08-31 核准供本機施工`

`FILES_CHANGED: docs/slot-hub-core-flow-consistency-v1-readonly-spec.md；docs/slot-hub-work-roadmap.md`

`GIT_STATUS: 基線 main 保留未 Push 的 d0ac6ddbd70941a24023c35ad744d0a6fde2c3f7；本輪只有兩份核准文件變更，既有未追蹤目錄與 audit 文件未納入`

`NEXT_ALLOWED_ACTION: 人工審查第2項只讀規格並決定第2-2步施工範圍`

`COMMIT_ALLOWED: NO`

`PUSH_ALLOWED: NO`

`DEPLOY_ALLOWED: NO`

`HUMAN_APPROVAL_REQUIRED: YES`
