# Slot Hub Guide Content Workflow v1

> 文件狀態：`APPROVED v1`
>
> 文件用途：規範 Slot Hub Guide 從選題、只讀 Brief、草稿、關聯與畫面審查、發布到 Preview 線上結案的唯一工作流。
>
> 本文件不取代產品藍圖、Guide 關聯規格或任何已核准的工程規格。

## 1. 文件依據與治理順位

本工作流依據下列文件與已完成案例整理：

1. `docs/slot-hub-master-blueprint-v1.md`
2. `docs/guide-game-relationship-v1-readonly-spec.md`
3. `docs/game-intake-workflow-v1.md`，僅參考狀態、人工關卡與固定尾段格式
4. `docs/slot-payout-mechanisms-guide-brief.md`
5. `docs/max-win-guide-v1-readonly-brief.md`
6. `docs/slot-multiplier-guide-v1-readonly-brief.md`
7. `src/content/guides/slot-payout-mechanisms-explained.md`
8. `src/content/guides/slot-max-win-explained.md`
9. `src/content/guides/slot-multiplier-explained.md`
10. 現有 Guide Schema、relationship resolver／catalog、Search 投影與 UI／驗證程式

治理順位如下：

1. `slot-hub-master-blueprint-v1.md` 是產品方向、優先順序與執行邊界的最高依據。
2. `guide-game-relationship-v1-readonly-spec.md` 是目前 Guide 關聯模型的依據。
3. 已核准的單一任務指令決定該輪可修改檔案與可跨越的狀態。
4. 本工作流只管理 Guide 的製作與發布流程，不自行創造產品授權。

若文件、程式現況或任務指令彼此不一致，Agent 必須停止並回報實際差異，不得假設文件或程式必然正確，也不得自行選擇其中一方覆蓋另一方。

## 2. 工作流權限邊界

本工作流可以管理：

- 已經人工核准主題的搜尋意圖與內容缺口盤點。
- 第一方來源研究與只讀 Brief。
- Guide draft 的撰寫、局部修正與來源核對。
- Guide frontmatter 關聯宣告及必要的關聯所有權審查。
- 本機暫時模擬 `published`、完整驗證及恢復 `draft`。
- 經人工核准後的發布 Commit、Push、Preview 部署與線上回讀。

本工作流本身不授權：

- 自行選定或替換新主題。
- 修改 Schema、taxonomy、relationship resolver、URL schema 或索引規則。
- 建立 Mechanism、Feature、Data Topic 或其他 SEO 集合頁。
- 未經核准執行 `draft → published`、Push、部署或正式發布。
- 修改正式網域、Wix、DNS、301、canonical、robots 或索引政策。
- 以全文關鍵字、標題、tags 或 AI 推測建立正式關聯。
- 將遊戲收錄工作流的 Provider、Game、圖片或候選規則直接套用到 Guide。

## 3. 核心資料與關聯原則

### 3.1 Guide 是關聯的單一權威來源

Guide v1 只能透過核准的 frontmatter 欄位宣告正式關聯：

- `relatedMechanisms`
- `relatedFeatures`
- `relatedDataTopics`

目前 `relatedDataTopics` 的合法值為：

- `rtp`
- `rtp-variants`
- `volatility`
- `max-win`

Game 不保存第二份人工 `relatedGuides`。正反向關係都由 published Guide 的 frontmatter 與 published Game 資料推導。

### 3.2 關聯必須精確

- Frontmatter 只宣告文章真正完整承接的概念。
- 合法概念尚無 Guide 時，應正常回傳空結果，不得 fallback 猜測。
- Scatter Feature 不等於 Scatter Pays Mechanism。
- Cascading、Tumble、Avalanche 通常是 Feature，不得因名稱相似改成第二個 Mechanism。
- 同一文章承接多個概念代表多個獨立關係，不代表 Explorer 的 AND 查詢。
- Resolver 目前不會自行選定「主要文章」，因此重複所有權必須在發布前明確審查。

### 3.3 關聯排序與入口限制

- Game detail 依既有規則排序：Mechanism → Data Topic → Feature，最多三篇並去重。
- Guide 代表遊戲由共用 resolver 推導，不在 frontmatter 手抄遊戲清單。
- 代表遊戲排序必須穩定，可重複驗證。
- Guide、Search、Explorer、Game detail 與 Slots Knowledge Map 必須使用同一份關聯投影，不得各自維護第二份 mapping。

## 4. 精確 Explorer URL 規則

只有存在語意精確、由結構化條件產生的 Explorer URL，才可顯示「探索遊戲」CTA。

- Mechanism：目前可產生精確的 `mechanism` 篩選 URL。
- Feature：目前可產生精確的 `features` 篩選 URL。
- Data Topic：目前沒有對應的精確結構化條件 URL，因此只顯示「了解概念」、代表遊戲及 Game 反向關聯。

禁止事項：

- 不得使用 `?q=概念名稱` 冒充結構化資料篩選。
- 不得因文章有代表遊戲，就將文字搜尋結果包裝成精確 Explorer 集合。
- 不得針對單篇文章在 Search 或 UI 寫死特例。
- 未來若要為 Data Topic 新增精確 URL，必須另行取得 URL schema 與產品核准。

## 5. 來源層級

### A 級：第一方正式來源

- A1：官方 Game Rules、Paytable、遊戲內規則、正式技術文件。
- A2：官方產品頁、官方發布稿、官方 Client Hub。

精確的 RTP、波動度、最高倍數、投注條件、盤面、賠付規則與 Feature 判定，優先要求 A 級來源。A 級來源仍需保留原始標籤、單位、適用條件與完整語境；「官方」不代表 Agent 的解讀必然正確。

### B 級：官方授權合作方

只能補充官方未公開的缺值，且必須清楚標示來源角色，不得覆蓋相互衝突的第一方規則。

### C 級：產業媒體或資料庫

只作查找線索與交叉比對，不作精確數值或規則判定的主要證據。

### 不接受的正式證據

- 搜尋摘要
- AI 回答
- 娛樂城轉述
- 無來源文章
- 無法追溯原文的舊報告結論

既有站內資料或驗證報告可以協助定位來源，但不等於已重新取得第一方證據。找不到完整語境時，應刪除、降級或收斂敘述，不得用舊資料狀態補足證據。

## 6. 固定狀態總覽

本工作流共有 15 個固定狀態：10 個正常流程狀態，以及 5 個返回或停止狀態。

正常流程：

`TOPIC_SELECTED` → `READONLY_BRIEF_IN_PROGRESS` → `READONLY_BRIEF_COMPLETE` → `CONTENT_DRAFT_IN_PROGRESS` → `RELATIONSHIP_PREVIEW_REVIEW` → `CONTENT_DRAFT_READY_FOR_REVIEW` → `READY_TO_PUBLISH` → `PUBLISHING_TO_PREVIEW` → `PUBLISHED_TO_PREVIEW` → `CLOSED`

返回或停止狀態：

- `RETURN_FOR_SOURCE_FIX`
- `RETURN_FOR_CONTENT_FIX`
- `RETURN_FOR_RELATIONSHIP_FIX`
- `RETURN_FOR_UI_FIX`
- `BLOCKED`

返回修正完成後，回到原本失敗的審查階段，不必從選題重新開始。

## 7. 固定狀態定義

### 7.1 `TOPIC_SELECTED`

- 進入條件：主題已獲人工正式核准，且入選目的、搜尋意圖與產品價值可辨識。
- 允許動作：確認內容類型、任務範圍、預定 slug 線索與 Brief 盤點項目。
- 允許修改檔案：任務明確授權的選題或規格文件；預設不修改網站內容。
- 可查官方來源：否；進入下一狀態後才開始正式研究。
- 可建立或修改 Guide：否。
- Commit：只有任務另行核准時可提交選題文件。
- Push：否。
- Deploy：否。
- 完成條件：確認屬於 Mechanism、Feature、Data Topic、一般知識或其他類型，且不因 taxonomy 已存在就自動建文。
- 下一正常狀態：`READONLY_BRIEF_IN_PROGRESS`。
- 失敗返回：產品價值或主題邊界不明時進入 `BLOCKED`。
- 人工核准：進入本狀態需要；同一已授權任務內可自動開始 Brief。

### 7.2 `READONLY_BRIEF_IN_PROGRESS`

- 進入條件：主題已核准，且 Brief 研究範圍明確。
- 允許動作：盤點 published Game／Guide、第一方來源、原廠術語、代表案例、重複內容、預定關聯、正反向影響、Search／Explorer／Guide detail 呈現、最多三篇排序與風險。
- 允許修改檔案：本主題唯一 Brief 文件。
- 可查官方來源：是。
- 可建立或修改 Guide：否。
- Commit：否；Brief 完成並審查後另行提交。
- Push：否。
- Deploy：否。
- 完成條件：來源與語意足以判斷是否能進入文章草稿，並列出 Schema、taxonomy、resolver、URL 或產品決策需求。
- 下一正常狀態：`READONLY_BRIEF_COMPLETE`。
- 失敗返回：來源不足進入 `RETURN_FOR_SOURCE_FIX`；需要新架構決策進入 `BLOCKED`。
- 人工核准：研究過程不需要；完成 Brief 後需要人工審查。

### 7.3 `READONLY_BRIEF_COMPLETE`

- 進入條件：Brief 內容完整、格式檢查通過，且清楚給出能否進入草稿的判定。
- 允許動作：人工審查、局部來源補證、文字修正與獨立 Brief Commit。
- 允許修改檔案：該 Brief 文件；補證時不得順帶建立 Guide。
- 可查官方來源：是。
- 可建立或修改 Guide：否。
- Commit：可；Brief 必須使用獨立 Commit。
- Push：否，除非另有明確核准。
- Deploy：否。
- 完成條件：Brief 已獨立提交，且人工明確核准進入 Guide draft。
- 下一正常狀態：`CONTENT_DRAFT_IN_PROGRESS`。
- 失敗返回：來源問題進入 `RETURN_FOR_SOURCE_FIX`；主題或架構問題進入 `BLOCKED`。
- 人工核准：是；未經審查不得直接進入文章草稿。

### 7.4 `CONTENT_DRAFT_IN_PROGRESS`

- 進入條件：Brief 已人工核准並獨立提交，Guide 的 slug、內容邊界與預定關聯已確認。
- 允許動作：依 Brief 撰寫完整文章、加入已核對來源、設定 frontmatter、進行關聯所有權審查、補必要的局部測試。
- 允許修改檔案：新 Guide draft；經核准的既有 Guide frontmatter 所有權移交；必要且已在任務範圍內的共用投影與測試。
- 可查官方來源：是。
- 可建立或修改 Guide：是；新 Guide 初始必須為 `status: draft`。
- Commit：開發中不提交；完成模擬與內容 QA 後再建立 draft Commit。
- Push：否。
- Deploy：否。
- 完成條件：文章完整、來源可追溯、關聯宣告精確、沒有讀者不應看到的內部流程文字，且可進入本機模擬。
- 下一正常狀態：`RELATIONSHIP_PREVIEW_REVIEW`。
- 失敗返回：依問題進入對應的 RETURN 狀態或 `BLOCKED`。
- 人工核准：同一核准草稿任務內不需要逐步確認；任何涉及既有 published Guide frontmatter 的關聯所有權移交或範圍擴張都需要人工核准。新 Guide 自己的 frontmatter 可依已核准 Brief 執行。

### 7.5 `RELATIONSHIP_PREVIEW_REVIEW`

- 進入條件：Guide draft 與 frontmatter 已完成，可在本機安全模擬 published。
- 允許動作：暫時將 Guide 改為 `published`，檢查所有關聯入口、排序與響應式，並在仍為模擬 `published` 的狀態下執行與 GitHub Actions 相同的完整驗證；全部通過後才恢復 `draft`。
- 允許修改檔案：Guide 的暫時 status；核准範圍內的局部內容、frontmatter、共用投影或測試修正。
- 可查官方來源：是，僅用於解決審查發現的來源問題。
- 可建立或修改 Guide：是；不得永久保留模擬發布狀態。
- Commit：不得提交暫時 `published`；模擬通過並恢復 `draft` 後可準備 draft Commit。
- Push：否。
- Deploy：否。
- 完成條件：Guide → Game、Game → Guide、Guide 總覽、Search、Explorer、Slots Knowledge Map、代表遊戲、最多三篇排序、0／1／2／3 篇、桌機與 390×844 手機、長標題及 draft 隔離均通過；完整 CI 命令已在模擬 `published` 狀態下成功執行，且 Guide 已恢復 `draft`。
- 下一正常狀態：`CONTENT_DRAFT_READY_FOR_REVIEW`。
- 失敗返回：來源、內容、關聯或 UI 問題進入對應 RETURN 狀態；需要新 Schema／taxonomy／resolver／URL 決策時進入 `BLOCKED`。
- 人工核准：本機模擬不需要；任何涉及既有 published Guide frontmatter 的關聯所有權移交都需要事前人工核准。

### 7.6 `CONTENT_DRAFT_READY_FOR_REVIEW`

- 進入條件：模擬發布通過、Guide 已恢復 `draft`、必要測試通過，且 draft Commit 邊界清楚。
- 允許動作：建立 Guide draft Commit、提交文章全文與驗證結果供人工內容審查；依審查結果做局部修正或 amend。
- 允許修改檔案：Guide draft、已核准的 frontmatter 所有權移交、必要的共用投影與測試；不得擴張到未核准 UI／Schema。
- 可查官方來源：是。
- 可建立或修改 Guide：是；只允許審查需要的局部修正。
- Commit：可；Guide draft 與 Brief 原則上使用不同 Commit。必要的所有權移交、共用投影修正與測試可與 Guide draft 同一 Commit，但必須在回報中說明原因。
- Push：否。
- Deploy：否。
- 完成條件：人工內容、來源、關聯與畫面審查通過，所有修正已重新測試，Commit 保持 `status: draft`。
- 下一正常狀態：`READY_TO_PUBLISH`。
- 失敗返回：依人工審查結果進入對應 RETURN 狀態。
- 人工核准：是。

### 7.7 `READY_TO_PUBLISH`

- 進入條件：內容、來源、關聯、UI 與本機測試均通過，draft Commit 已完成。
- 允許動作：只等待人工發布決定；可只讀核對 Commit、工作目錄、遠端與發布範圍。
- 允許修改檔案：無；若人工要求局部修正，回到對應 RETURN 狀態。
- 可查官方來源：只在新問題出現時可核對。
- 可建立或修改 Guide：不得改為 `published`，直到取得明確人工發布核准。
- Commit：否。
- Push：否。
- Deploy：否。
- 完成條件：取得 `draft → published`、獨立發布 Commit、Push 與 Preview 部署的明確人工核准。
- 下一正常狀態：`PUBLISHING_TO_PREVIEW`。
- 失敗返回：依問題進入對應 RETURN 狀態；人工決定延後時維持 `READY_TO_PUBLISH`。
- 人工核准：是，屬於固定發布關卡。

### 7.8 `PUBLISHING_TO_PREVIEW`

- 進入條件：人工已明確核准 `draft → published`、獨立發布 Commit、Push 與 Preview 部署。
- 允許動作：只將核准 Guide 的 `status` 改為 `published`，修改明確核准的日期欄位，建立獨立發布 Commit，安全 Push，等待 GitHub Actions 與 Cloudflare Pages。
- 允許修改檔案：核准 Guide 的發布狀態及任務明確允許的日期欄位；不得順帶修改正文或其他程式。
- 可查官方來源：否。
- 可建立或修改 Guide：只允許核准的發布狀態變更。
- Commit：可，且發布狀態必須使用獨立 Commit。
- Push：可，僅限人工核准的 Commit；遠端有新 Commit 時停止，不自行 rebase、merge 或 force push。
- Deploy：可，僅限既有 GitHub → Cloudflare Pages Preview 流程。
- 完成條件：GitHub Actions 已以完整命令驗證成功、Cloudflare Pages Deployment 成功，且 Deployment SHA 與發布 Commit 一致；三項缺一不可。
- 下一正常狀態：`PUBLISHED_TO_PREVIEW`。
- 失敗返回：CI 的來源、內容、關聯或 UI 驗證失敗時進入對應 RETURN 狀態；Node、權限、遠端衝突或無法判定的基礎設施問題進入 `BLOCKED`。只有仍在既有授權內、可安全等待或重試的部署程序才維持 `PUBLISHING_TO_PREVIEW`。Cloudflare 成功但 GitHub Actions 失敗時，不得前進。
- 人工核准：進入本狀態前需要；核准範圍內可自動完成 Commit、Push、CI 與部署等待。

### 7.9 `PUBLISHED_TO_PREVIEW`

- 進入條件：GitHub Actions 完整驗證成功、Cloudflare Pages Deployment 成功，且 Deployment SHA 對應正確發布 Commit；三項必須同時成立。
- 允許動作：只執行線上回讀與結果回報。
- 允許修改檔案：無。
- 可查官方來源：否；若線上回讀揭露來源問題，進入 `RETURN_FOR_SOURCE_FIX`。
- 可建立或修改 Guide：否。
- Commit：否。
- Push：否。
- Deploy：否，不得在本狀態再次部署。
- 完成條件：新 Guide、Guide 總覽、Search、Game detail、關聯所有權、精確 Explorer URL、代表遊戲、內部連結、響應式、console、Preview safeguards 與 Git 狀態全部線上驗證通過。
- 下一正常狀態：`CLOSED`。
- 失敗返回：依問題進入 `RETURN_FOR_SOURCE_FIX`、`RETURN_FOR_CONTENT_FIX`、`RETURN_FOR_RELATIONSHIP_FIX` 或 `RETURN_FOR_UI_FIX`；後續修正、Commit、Push 與重新部署必須重新取得人工核准。
- 人工核准：線上回讀不需要新增核准；任何修正與重新發布需要人工核准。

### 7.10 `CLOSED`

- 進入條件：線上回讀、SEO safeguards、Git 同步與工作目錄狀態全部確認。
- 允許動作：只回報結案結果。
- 允許修改檔案：無。
- 可查官方來源：否。
- 可建立或修改 Guide：否。
- Commit：否。
- Push：否。
- Deploy：否。
- 完成條件：發布範圍已完整閉環，沒有待處理 blocker。
- 下一正常狀態：無；新主題需重新取得核准並從 `TOPIC_SELECTED` 開始。
- 失敗返回：不適用；若線上驗證尚未完成，不得進入本狀態。
- 人工核准：開始新範圍時需要。

### 7.11 `RETURN_FOR_SOURCE_FIX`

- 進入條件：身份、精確數值、標籤、單位、條件或第一方來源不足／誤讀。
- 允許動作：補第一方來源、移除未證實敘述、降低結論強度、修正引用與重新驗證。
- 允許修改檔案：原 Brief、Guide draft 及直接相關的來源測試；不得擴張架構。
- 可查官方來源：是。
- 可建立或修改 Guide：是，限局部來源修正。
- Commit：可 amend 尚未 Push 的對應 Brief／draft Commit；不得改寫已發布歷史。
- Push：否，除非重新通過發布人工關卡。
- Deploy：否。
- 完成條件：所有精確敘述均可回到合格來源，且原審查案例通過。
- 下一正常狀態：回到原本失敗的 Brief、內容或 Preview 審查階段。
- 失敗返回：仍無足夠證據時維持本狀態；需產品／架構決策時進入 `BLOCKED`。
- 人工核准：同一核准範圍內的安全局部修正不需要；變更核心結論時需要重新審查。

### 7.12 `RETURN_FOR_CONTENT_FIX`

- 進入條件：文章敘述、單位、風險語言、讀者語意、重複內容或內部流程文字不符合要求。
- 允許動作：局部修正文句與段落，保留未受影響內容並重新跑相關測試。
- 允許修改檔案：該 Guide draft；必要時同步其 Brief 的非歷史性錯誤，但不得回頭篡改只讀盤點結論。
- 可查官方來源：是。
- 可建立或修改 Guide：是，限局部內容修正。
- Commit：可 amend 尚未 Push 的 Guide draft Commit。
- Push：否。
- Deploy：否。
- 完成條件：指定問題修正，來源、關聯、搜尋、Build 與隔離回歸通過。
- 下一正常狀態：回到 `CONTENT_DRAFT_READY_FOR_REVIEW` 或原 Preview 審查階段。
- 失敗返回：新來源問題進入 `RETURN_FOR_SOURCE_FIX`；需架構決策進入 `BLOCKED`。
- 人工核准：局部修正後需要重新內容審查。

### 7.13 `RETURN_FOR_RELATIONSHIP_FIX`

- 進入條件：重複所有權、錯誤反向關聯、不精確 CTA、錯誤 AND query 或關聯排序／去重問題。
- 允許動作：修正核准的 Guide frontmatter 所有權、共用投影或測試，並重新進行完整關聯模擬。
- 允許修改檔案：相關 Guide frontmatter、核准範圍內的共用 relationship／Search 投影與測試。
- 可查官方來源：視概念定義是否需要而定。
- 可建立或修改 Guide：是，限 frontmatter 或直接相關內容。
- Commit：可 amend 尚未 Push 的 Guide draft Commit；若修正超出原 Commit 邊界需人工決定。
- Push：否。
- Deploy：否。
- 完成條件：正反向關係、所有權唯一性、精確 URL、排序與所有 UI 入口回歸通過。
- 下一正常狀態：回到 `RELATIONSHIP_PREVIEW_REVIEW`。
- 失敗返回：需要 Schema／taxonomy／resolver／URL 新決策時進入 `BLOCKED`。
- 人工核准：任何涉及既有 published Guide frontmatter 的關聯所有權移交，或超出既有模型時需要。

### 7.14 `RETURN_FOR_UI_FIX`

- 進入條件：水平溢位、長標題、0／1／2／3 狀態、CTA、圖片、互動或手機版顯示錯誤。
- 允許動作：在核准範圍內做最小 UI 修正，重測桌機與 390×844 手機。
- 允許修改檔案：直接造成問題的元件、樣式及 UI 測試；不得順帶改版。
- 可查官方來源：否，除非畫面錯誤來自資料語意。
- 可建立或修改 Guide：通常否；若只是標題或內容造成的排版問題，可在原內容範圍局部修正。
- Commit：可 amend 尚未 Push 的 draft Commit，或依人工指示建立獨立 fix Commit。
- Push：否。
- Deploy：否。
- 完成條件：問題可重現、根因已修正，相關畫面與完整回歸通過。
- 下一正常狀態：回到 `RELATIONSHIP_PREVIEW_REVIEW` 或原線上前審查階段。
- 失敗返回：需要擴大 UI／URL／架構範圍時進入 `BLOCKED`。
- 人工核准：原任務內的最小安全修正不需要；改版或範圍擴張需要。

### 7.15 `BLOCKED`

- 進入條件：需要新的產品、Schema、taxonomy、resolver、URL、正式索引決策；出現非預期檔案、遠端新 Commit、權限阻擋或範圍衝突。
- 允許動作：保留現況、蒐集只讀證據並清楚回報 blocker 與可選方案。
- 允許修改檔案：原則上無；只有為呈現 blocker 而明確授權的報告檔。
- 可查官方來源：若有助界定 blocker，可只讀查閱。
- 可建立或修改 Guide：否，除非人工重新核准。
- Commit：否。
- Push：否。
- Deploy：否。
- 完成條件：人工解除 blocker、重新定義範圍或作出必要決策。
- 下一正常狀態：回到被阻斷前的狀態。
- 失敗返回：維持 `BLOCKED`。
- 人工核准：是。

## 8. 標準作業流程

### 8.1 選題核准

選題時必須確認：

- 使用者要解決的問題與搜尋意圖。
- 現有內容缺口與產品價值。
- 主要角色是 Mechanism、Feature、Data Topic、一般知識或其他內容。
- 是否已有同意圖 Guide。
- 是否會涉及新 Schema、taxonomy、resolver、URL 或集合頁。

Taxonomy 已存在只代表資料可分類，不代表已核准建立文章。

### 8.2 只讀 Brief

Brief 至少包含：

- 現有 published Game 與 Guide 覆蓋。
- 第一方來源與原文語境。
- 原廠術語、單位、條件與不同廠商的語意差異。
- 代表案例及不適合統一的反例。
- 與既有內容的重複風險。
- 預定 frontmatter 關聯。
- Guide → Game、Game → Guide 的影響。
- Search、Explorer、Guide detail 與 Slots Knowledge Map 的預期呈現。
- Game detail 最多三篇的排序影響。
- 內容風險與禁止敘述。
- 是否需要產品、Schema、taxonomy、resolver 或 URL 決策。

Brief 必須獨立 Commit。未經人工審查，不得進入 Guide draft。

### 8.3 Guide Draft

- 依核准 Brief 建立，初始必須為 `status: draft`。
- 精確數據只採已核對的第一方來源。
- 保留原始標籤、單位、條件與來源，不任意換算。
- 不把內部製作狀態、欄位缺口、Agent 判定或工作流文字寫給讀者。
- 文章教使用者理解資料，不提供勝率、下注、獲利或保證結果暗示。
- Frontmatter 只宣告文章真正承接的關聯。
- 不在 Guide 手抄衍生 Game 清單，也不在 Game 端建立第二份關聯。

### 8.4 關聯所有權審查

發布前必須回答：

- 同一 Mechanism、Feature 或 Data Topic 是否已有 Guide。
- 新 Guide 是取代、補充還是並存。
- 若移交所有權，應從哪篇既有 Guide frontmatter 移除關聯。
- 舊文章正文是否仍正確；若正確，只改 frontmatter，不為所有權移交重寫正文。
- 多篇並存是否會造成 Game detail 重複、前三篇擠壓或 Search 意圖混淆。

Resolver 不會自行選定主要文章，不能把重複所有權留給 UI 猜測。

### 8.5 模擬發布

1. 暫時把新 Guide 改為 `published`。
2. 若新 Guide 接管既有 Deferred taxonomy，先檢查 relationship tests、relationship UI tests，以及 Search／Explorer 的所有權預期，移除或改寫已過時的 Deferred 假設；其他仍延後概念的斷言必須保留。
3. 實際檢查 Guide → Game、Game → Guide、Guide 總覽、Search、Explorer、Slots Knowledge Map、代表遊戲及最多三篇排序。
4. 覆蓋 0／1／2／3 篇 Guide 的 Game detail 狀態。
5. 檢查桌機、390×844 手機、長中文標題及整頁水平溢位。
6. 在 Guide 仍為模擬 `published` 的狀態下，從 `slothub-site/` 執行與 GitHub Actions 相同的完整命令：

   ```powershell
   $env:ASTRO_TELEMETRY_DISABLED='1'
   $env:PUBLIC_SITE_ENV='preview'
   npm run verify
   ```

   上述為 Windows PowerShell 語法；其他 shell 應使用等效的環境變數設定語法。無論使用哪一種 shell，都必須設定相同的 `ASTRO_TELEMETRY_DISABLED=1`、`PUBLIC_SITE_ENV=preview`，並執行相同的 `npm run verify`。

7. 不得先恢復 `draft` 再執行完整驗證；只有完整命令成功後，才恢復 `status: draft` 並進入人工內容審查。
8. 恢復 `draft` 後，確認 draft 不出現在公開路由、Search、relationship index 或靜態輸出。

暫時 `published` 狀態不得進入 Commit。

### 8.6 內容與來源審查

- 每個精確數值都要能回到第一方原文、標籤、單位及成立條件。
- 官方來源本身不代表文章解讀正確，仍需核對語境。
- 找不到完整語境時，刪除或降低敘述，不以既有報告或站內欄位代替證據。
- 不因數字曾出現在舊資料中就視為已驗證。
- 一處問題優先局部修正與 amend，不必重寫整篇。
- 修正後只重跑相關檢查不夠；仍需完成來源、關聯、Search、Build、內部連結與 draft 隔離回歸。

### 8.7 Draft Commit

- Brief 與 Guide draft 原則上使用兩個獨立 Commit。
- 經人工核准的既有 published Guide frontmatter 關聯所有權移交、必要的共用投影修正及測試，可與 Guide draft 同一 Commit，但必須清楚列出原因和檔案。
- 不得提交本機模擬用的 `published` 狀態。
- 局部審查修正可 amend 尚未 Push 的對應 draft Commit。
- Commit 前必須確認 `git diff --check`、精確檔案清單及工作目錄狀態。

### 8.8 發布人工關卡

未取得明確人工核准，不得執行：

- `draft → published`
- 發布 Commit
- Push
- Cloudflare Pages 部署

發布狀態使用獨立 Commit，不與文章正文或其他功能變更混合。

未取得核准時維持 `READY_TO_PUBLISH`。取得核准後進入 `PUBLISHING_TO_PREVIEW`，不得直接跳到已部署狀態。

### 8.9 發布執行

在 `PUBLISHING_TO_PREVIEW`：

1. 只修改核准 Guide 的發布狀態及明確核准的日期欄位。
2. 建立獨立發布 Commit。
3. Push 前核對遠端；若有新 Commit，進入 `BLOCKED`，不得自行 rebase、merge 或 force push。
4. 安全 Push，等待 GitHub Actions 與 Cloudflare Pages。
5. GitHub Actions 失敗時依失敗性質進入對應 RETURN 狀態或 `BLOCKED`；不得因 Cloudflare 已成功部署而繼續前進。
6. 只有 GitHub Actions 完整驗證成功、Cloudflare Pages Deployment 成功，且 Deployment SHA 對應正確發布 Commit 後，才進入 `PUBLISHED_TO_PREVIEW`。

### 8.10 線上回讀與結案

`PUBLISHED_TO_PREVIEW` 只允許線上回讀與結果回報，不允許修改檔案、Commit、Push 或再次部署。線上回讀至少確認：

- Deployment URL 對應正確發布 Commit。
- 新 Guide HTTP 200。
- Guide 總覽、Search、Game detail 與所有關聯入口正確。
- 關聯所有權唯一，沒有重複或錯誤 fallback。
- 只有精確 Mechanism／Feature Explorer URL 顯示探索 CTA。
- 代表遊戲、圖片、Provider、內部連結與前三篇排序正確。
- 桌機與 390×844 手機沒有整頁水平溢位。
- Browser console 沒有 error。
- Preview HTML 為 `noindex,nofollow`。
- HTTP Header 為 `X-Robots-Tag: noindex, nofollow`。
- Preview sitemap 保持空白。
- Preview 不輸出 production canonical。
- Git 工作目錄乾淨，ahead／behind 與部署 SHA 一致。

只有全部通過，才可進入 `CLOSED`。線上發現問題時，必須進入對應 RETURN 狀態；後續修正、Commit、Push 與重新部署都必須重新取得人工核准。

## 9. 標準本機驗證清單

依變更範圍至少執行：

- Guide Schema／Content Collection 驗證。
- Relationship resolver 正向與反向測試。
- 關聯所有權、排序、去重及合法空關聯測試。
- Search「了解概念／探索遊戲／單款遊戲」意圖測試。
- Explorer 單一與多條件回歸。
- Guide detail 代表遊戲及 CTA 測試。
- Game detail fixtures 與 0／1／2／3 篇狀態。
- Slots Knowledge Map 共用投影測試。
- Draft 隔離。
- Astro Check。
- Static Build。
- 內部連結。
- 桌機與 390×844 手機視覺檢查。
- Preview safeguards。
- `git diff --check`。

`RELATIONSHIP_PREVIEW_REVIEW` 的完整驗證不得用上述局部命令組合取代 GitHub Actions 使用的 `npm run verify`，也不得在恢復 `draft` 後才執行。

若任一工具名稱或測試入口與現況不一致，先以只讀方式確認實際腳本；不得為符合文件名稱另建重複測試。

## 10. 失敗與返回路徑

| 問題 | 返回狀態 | 處理原則 |
| --- | --- | --- |
| 身份、來源、原始標籤、單位或條件不足 | `RETURN_FOR_SOURCE_FIX` | 補第一方證據、刪除或降低敘述 |
| 文章敘述、單位換算、風險語言或讀者語意錯誤 | `RETURN_FOR_CONTENT_FIX` | 局部修正，不重寫未受影響內容 |
| 重複所有權、錯誤反向關聯、錯誤 CTA 或 AND query | `RETURN_FOR_RELATIONSHIP_FIX` | 修正單一權威關聯並重跑正反向測試 |
| 溢位、CTA、互動、長標題或響應式錯誤 | `RETURN_FOR_UI_FIX` | 修正根因，不以隱藏內容規避 |
| 需要 Schema、taxonomy、resolver、URL 或產品新決策 | `BLOCKED` | 停止並等待人工核准 |
| 遠端出現新 Commit | `BLOCKED` | 停止，不自行 rebase、merge 或 force push |
| CI 的來源驗證失敗 | `RETURN_FOR_SOURCE_FIX` | 補證、刪除或降低未通過的來源敘述 |
| CI 的文章內容驗證失敗 | `RETURN_FOR_CONTENT_FIX` | 局部修正內容並重新取得發布授權 |
| CI 的 Relationship／Search／Explorer 所有權驗證失敗 | `RETURN_FOR_RELATIONSHIP_FIX` | 修正正式所有權預期並完整回歸 |
| CI 的 UI／響應式驗證失敗 | `RETURN_FOR_UI_FIX` | 修正 UI 根因並重測桌機與手機 |
| Node、權限、遠端衝突或無法判定的基礎設施問題 | `BLOCKED` | 停止並回報，不自行擴張或覆蓋遠端 |
| 仍在既有授權內、可安全等待或重試的部署程序 | `PUBLISHING_TO_PREVIEW` | 只允許等待或安全重試；不得藉此修改內容或程式 |
| Cloudflare 成功但 GitHub Actions 失敗 | 對應 RETURN 狀態或 `BLOCKED` | 不得進入 `PUBLISHED_TO_PREVIEW` 或 `CLOSED` |
| 線上來源、內容、關聯或 UI 驗證失敗 | 對應 RETURN 狀態 | 停止線上發布閉環；修正與重新發布需重新核准 |
| 非預期檔案或範圍擴張 | `BLOCKED` | 保留現況並回報精確差異 |

修正完成後回到原本失敗的審查階段，不必從 `TOPIC_SELECTED` 重新開始。

## 11. 自動續行與人工關卡

### 11.1 自動續行

當下列條件同時成立時，Agent 應在同一任務內直接執行下一個已授權動作：

- 沒有人工關卡。
- 沒有 blocker。
- 下一階段仍在明確授權的檔案與動作範圍內。
- 測試或審查結果允許進入下一狀態。

Agent 可以發送進度回報，但不能把進度回報當成停止點，也不應在每完成一項測試後重新詢問。

### 11.2 必須停止的人工關卡

- 選題正式核准。
- Brief 進入 Guide draft。
- Schema、taxonomy、resolver 或 URL 修改。
- 任何涉及既有 published Guide frontmatter 的關聯所有權移交。
- `draft → published`。
- Push 與部署。
- 正式網域與索引政策。
- 非預期檔案或範圍擴張。
- 遠端新 Commit。

同一任務可以連續跨越多個不需要人工核准的狀態，但不得以「自動續行」擴張授權。

## 12. 每階段固定尾段

每次階段回報必須完整包含下列欄位；不適用時填 `N/A`，不得省略：

```text
STAGE_RESULT:
CURRENT_STATE:
GUIDE_SLUG:
GUIDE_TITLE:
RELATIONSHIP_TYPE:
SOURCE_STATUS:
CONTENT_QA_RESULT:
RELATIONSHIP_RESULT:
UI_RESULT:
TEST_RESULTS:
PUBLISHED_SIMULATION_RESULT:
EXACT_CI_COMMAND_RETESTED:
RELATIONSHIP_EXPECTATION_MIGRATIONS:
BLOCKERS:
FILES_CHANGED:
COMMIT_SHA:
GIT_STATUS:
NEXT_ALLOWED_ACTION:
COMMIT_ALLOWED:
PUSH_ALLOWED:
DEPLOY_ALLOWED:
HUMAN_APPROVAL_REQUIRED:
```

`STAGE_RESULT` 應清楚表達是否可前進、需返回修正或已阻擋；不得只寫「已完成」。

## 13. Decision Log：已驗證案例

### 13.1 賠付機制 Guide

- 類型：Mechanism 型文章。
- 實證：一篇文章承接 Paylines、Ways to Win、Megaways、Cluster Pays、Pay Anywhere 五個 Mechanism。
- 所有權：發布前從術語表移除 Paylines／Ways 關聯；術語表仍保留 Cascading／Bonus Buy 的 Feature 關聯。
- Explorer：五個概念各自產生獨立、精確的篩選 URL，不合成 AND query。
- 教訓：Resolver 不會自動決定主要文章，所有權移交必須明確驗證。

### 13.2 最高倍數 Guide

- 類型：Data Topic 型文章，承接 `max-win`。
- 實證：Data Topic 可提供「了解概念」、代表遊戲與 Game 反向關聯，但在沒有精確結構化 URL 時不顯示「探索遊戲」。
- 共用修正：Data Topic 的 URL 行為在共用 Search／Guide 投影層統一處理，不針對單篇文章硬編碼。
- 來源教訓：多單位、原廠標籤與第一方語境需重新核對；舊報告或站內數值不能取代原始證據，未證實敘述應局部刪除並 amend。
- 排序：啟用前需實際檢查具備 `maxWinMultiplier` 的 Game 反向關聯與最多三篇組合，不因關聯合法就假設畫面排序必然合理。

以上案例是工作流的實證來源，不是未來 Guide 必須複製的標題、章節、案例數量或內容模板。

### 13.3 2026-08-29 人工審查通過

- 文件狀態由 `DRAFT FOR REVIEW` 更新為 `APPROVED v1`。
- 新增 `PUBLISHING_TO_PREVIEW`，將發布狀態修改、發布 Commit、Push、CI 與 Cloudflare 部署，和部署完成後的唯讀線上回讀分離。
- `READY_TO_PUBLISH` 只等待人工核准；`PUBLISHED_TO_PREVIEW` 只執行線上回讀，避免同一狀態同時具有寫入與唯讀權限。
- 明確規定任何涉及既有 published Guide frontmatter 的關聯所有權移交都需要人工核准；新 Guide 自己的 frontmatter 仍可依已核准 Brief 執行。

### 13.4 2026-08-29 Multiplier Guide 正式 CI 實證

- Multiplier Guide 在發布前模擬中曾回報 Relationship 測試通過，但完整 `npm run verify` 是在恢復 `draft` 後執行，因此兩支仍將 `multiplier` 視為 Deferred 的過時斷言未被觸發。
- 正式發布後，GitHub Actions 在 published 狀態執行相同命令，才揭露 relationship 與 relationship UI 測試的所有權預期尚未遷移。
- 工作流因此要求完整 CI 命令必須在 Guide 仍為模擬 `published` 時執行；接管 Deferred taxonomy 時，必須同步檢查 Relationship、Relationship UI、Search 與 Explorer 的所有權預期。
- 完整驗證通過後才能恢復 `draft` 並進入人工內容審查，避免草稿路徑掩蓋正式發布狀態才會出現的失敗。
- 本次 Cloudflare Pages 曾在 GitHub Actions 失敗時仍成功產生 Deployment，證明部署成功不能取代 CI。此後只有 GitHub Actions 完整驗證成功、Cloudflare Pages Deployment 成功且 SHA 對應發布 Commit 三項同時成立，才能進入 `PUBLISHED_TO_PREVIEW`；CI 失敗必須依來源、內容、關聯、UI 或基礎設施性質分流。

## 14. 本文件審查出口

```text
STAGE_RESULT: PASS_TO_NEXT_STAGE
CURRENT_STATE: WORKFLOW_APPROVED_V1
GUIDE_SLUG: N/A
GUIDE_TITLE: N/A
RELATIONSHIP_TYPE: N/A
SOURCE_STATUS: 已核對現行 Guide Brief、已發布 Guide 實證、現有 Schema、resolver／catalog、Search 與 UI 驗證程式
CONTENT_QA_RESULT: 工作流已通過人工審查，並涵蓋治理、狀態、來源、關聯、驗證、返回路徑與 Decision Log
RELATIONSHIP_RESULT: N/A
UI_RESULT: N/A
TEST_RESULTS: Markdown 格式、結構與尾端空白檢查通過
PUBLISHED_SIMULATION_RESULT: N/A
EXACT_CI_COMMAND_RETESTED: N/A
RELATIONSHIP_EXPECTATION_MIGRATIONS: N/A
BLOCKERS: NONE
FILES_CHANGED: docs/guide-content-workflow-v1.md
COMMIT_SHA: 由本輪提交結果回報
GIT_STATUS: 本文件已建立獨立本地 Commit，工作目錄乾淨
NEXT_ALLOWED_ACTION: 後續新 Guide 任務依 APPROVED v1 重新取得範圍核准
COMMIT_ALLOWED: NO
PUSH_ALLOWED: NO
DEPLOY_ALLOWED: NO
HUMAN_APPROVAL_REQUIRED: YES
```
