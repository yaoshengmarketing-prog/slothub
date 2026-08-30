# Slot Hub v1 下一階段優先順序只讀盤點

文件狀態：`READ-ONLY REVIEW`

盤點日期：2026-08-30  
依據：`docs/slot-hub-master-blueprint-v1.md`、目前 30 款 published Game、11 家 published Provider、11 篇 published Guide，以及現行首頁、遊戲庫、Guide 總覽、Game detail、搜尋、探索與比較實作。

> 本文件只比較下一階段的產品優先順序，不授權修改網站、內容、資料、CSS、Schema、測試、正式網域、Wix、DNS 或 301。沒有查閱外部網站、流量或搜尋量，也不以未追蹤原型或人工審查目錄作產品事實。

## 1. 目前可確認的產品底座

- 30 款 published Game 全部具有本機圖片、`alt`、第一方或已核准官方素材來源 URL 與取得日期，遊戲圖片資料覆蓋為 `30/30`。
- 11 家 published Provider 中 4 家有正式 Logo，另外 7 家使用文字縮寫 fallback；這是 Provider 視覺一致性缺口，不是遊戲圖片缺值。
- 11 篇 published Guide 均有永久路由；其中 Bonus Buy、Cascading、Max Win 三篇已有經人工驗證的 Knowledge Diagram。
- 搜尋、Game Explorer、最多三款比較、URL 分享、Guide／Game 雙向關聯、Game detail 情境式知識入口已可使用。
- Preview 已有 `noindex,nofollow`、空 sitemap、無 production canonical 與 Pages header safeguard；正式網域目前仍由 Wix 提供服務。
- 藍圖中的會員、收藏、CMS、D1、排行、預測、系列永久頁與大量 taxonomy 頁均未獲准，也不是本盤點的候選下一步。

## 2. 五個方向總排序

| 優先 | 方向 | 使用者價值 | v1 上線阻擋性 | 工作量／風險 | 結論 |
| --- | --- | --- | --- | --- | --- |
| 1 | 11 篇 Guide 的內容完整度與過薄頁面 | 高；修正使用者從遊戲資料頁進入後看不到足夠解釋的落差 | 技術上不阻止部署，但會形成明顯的公開內容品質缺口 | 中；主要風險是第一方來源、內容重複與一次擴張過多 | **唯一推薦的下一階段** |
| 2 | 正式網域、舊站內容與 301 上線前準備 | 間接但必要；讓新站真正可被公開使用與索引 | **是，正式切換前的硬門檻** | 中高；需要 Wix／GSC URL inventory、redirect 決策與索引政策人工核准 | 內容品質閘門完成後立即進入獨立 migration readiness 範圍 |
| 3 | 首頁、遊戲庫、Guide 總覽與 Game detail 動線 | 中；可減少首頁過長與過時文案造成的認知摩擦 | 否；核心路徑已可完成 | 中低；若沒有行為資料，容易變成主觀改版 | 先做小型可用性稽核，不立即重設版面 |
| 4 | 遊戲與 Guide 圖片覆蓋及視覺缺口 | 低至中；有助辨識與內容節奏，但目前遊戲辨識已完整 | 否 | 中；官方素材權利、比例與行動版節奏需逐項審查 | 不建立全 Guide 圖片 KPI，按文章需求個別核准 |
| 5 | 尚未完成的互動工具 | 目前低；核心搜尋、探索、比較已存在 | 否 | 中高；新工具易引入錯誤承諾或缺乏使用證據 | 等真實使用回饋，不從舊 backlog 自動啟動 |

排序同時考量「現在做的使用者價值」與「是否應在公開索引前完成」。正式遷移是唯一絕對的切換硬門檻，但若先切換再補內容，三個高曝光薄頁會直接成為正式站品質問題。因此建議先完成一個受控的核心 Guide 補強階段，再凍結公開 URL 清單並進入遷移準備。

## 3. 方向一：遊戲與 Guide 的官方圖片覆蓋及視覺缺口

### 現況

- 30/30 published Game 有本機主圖、替代文字、來源 URL 與取得日期；Game card、Game detail、Guide 代表遊戲均可重用同一份圖片資料。
- 圖片比例與格式不完全一致（PNG、JPEG、WebP；橫式、方形與直式素材都有），但既有卡片與資料頁已經過 contain／裁切與手機檢查。
- Guide Schema 沒有主圖欄位，也沒有要求每篇文章配置圖片。三篇 Guide 使用語意化 HTML Knowledge Diagram；其他 Guide 維持 Editorial Reading。
- Guide detail 的代表遊戲區已從 published Game projection 顯示官方遊戲圖，不需在 Guide 手抄圖片。

### 真正缺口

- 不是「遊戲沒有圖片」，而是部分 Provider 缺少 Logo（7/11）與 Guide 是否需要情境圖仍沒有逐篇內容理由。
- 若把官方遊戲封面固定放到每篇 Guide 首屏，會把知識頁推向遊戲大廳外觀，違反已核准的 Editorial Reading 方向。
- Game Context 只適合文章中段、且必須與具名案例直接對應；目前沒有證據支持全站批次加入。

### 使用者可感受到的改善

- 補齊有可靠來源的 Provider Logo，可改善廠商辨識。
- 在確有比較或辨認需求的 Guide 中加入少量案例圖，可降低長文抽象感；但對 RTP、波動度等概念，圖解或文字通常比遊戲封面更有教學價值。

### 現在不做是否阻止第一版上線

否。Game 圖片已完整，Guide 也有正常純文字降級；Provider fallback 可讀且不造成空白。

### 工作量與風險

- 工作量：中。Provider Logo 需逐家核對官方素材；Guide 圖片需逐篇內容與版權審查。
- 風險：為追求視覺一致而使用低權重圖片、形成裝飾性首屏、增加 LCP，或建立第二份圖片 mapping。

### 是否符合既有藍圖

符合「官方圖片可追溯」與「未知不補造」原則，但藍圖沒有要求每篇 Guide 必須有圖。

### 建議優先順序

第 4。後續只在文章內容需要時個別核准，不開啟另一輪批次 Diagram 或 Game Context 生產。

## 4. 方向二：11 篇 Guide 的內容完整度與過薄頁面

### 現況

以去除空白後的正文長度作相對盤點（只用來找異常，不把字數當品質 KPI）：

| Guide | 約略非空白字元 | H2 | 第一方來源連結 | 判定 |
| --- | ---: | ---: | ---: | --- |
| `volatility-explained` | 97 | 0 | 0 | 明顯過薄；卻承接結構化 `volatility` |
| `rtp-explained` | 99 | 0 | 0 | 明顯過薄；承接 `rtp` 與 `rtp-variants` |
| `slot-beginners-guide` | 114 | 0 | 0 | 明顯過薄；同時是首頁主要新手入口 |
| `slot-terms-glossary` | 248 | 4 | 0 | 簡短但屬快速查詢格式；需判斷詞條覆蓋，不宜只看字數 |
| `fishing-games-basics` | 270 | 2 | 0 | 簡短且目前無捕魚機資料；藍圖明確延後擴建 |
| 其餘 6 篇核心老虎機 Guide | 約 4,229–7,478 | 7–11 | 7–17 | 已有完整章節、案例與來源，非本階段缺口 |

RTP Guide 會由有主要 RTP 或多版本 RTP 的遊戲反向連入；Volatility Guide 會由有原廠或統一波動度的遊戲反向連入。這兩頁雖短，曝光不是孤立的 Guide 總覽流量，而是直接位於 Game detail 的「了解這項資料」路徑。新手 Guide 又是首頁主要 CTA，因此三者的薄度會被核心流程放大。

### 真正缺口

- 缺少使用者完成判讀所需的問題結構、例子、來源邊界與下一步探索方式。
- RTP 未充分解釋多版本、長期理論值與單次結果、版本可比性；波動度未充分解釋廠商原文與統一分類的限制；新手頁沒有形成可執行的資料閱讀順序。
- 問題不是「沒有更多 Diagram」。三頁首先需要完整正文與第一方證據；是否使用圖解必須依已核准 Diagram 使用規則另行判斷。

### 使用者可感受到的改善

- 從 Game detail 點擊 RTP、波動度後，可以真正回答「這個數字如何讀、不能推導什麼」。
- 首頁新手入口能形成「先看資料 → 找遊戲 → 比較」的完整入門路徑。
- 正式站公開時，Guide library 不再同時混有完整長文與只有兩段的內容落差。

### 現在不做是否阻止第一版上線

- 技術上：否。
- 產品品質上：建議視為正式索引前的內容閘門。三頁已是公開資訊架構與反向關聯的一部分，不是尚未連結的草稿。

### 工作量與風險

- 工作量：中。建議以同一個「核心薄 Guide 補強 v1」產品範圍管理，但依 Guide Content Workflow 逐篇完成 Brief、來源核對、內容審查與 Preview 發布。
- 風險：同時重寫三篇造成審查量失控；重複既有 Max Win／Mechanism 文章；把統計概念寫成結果預測。
- 控制方式：執行順序固定為 RTP → 波動度 → 新手；每篇在人工內容關卡獨立停止，不要求一次發布三篇。

### 是否符合既有藍圖

高度符合。藍圖把「看不懂 RTP、波動度、賠付機制或 Feature」列為核心需求，且 Guide 是概念解釋的正式實體。

### 建議優先順序

第 1，且是本文件唯一推薦的下一階段。

## 5. 方向三：首頁、遊戲庫、Guide 總覽及 Game detail 的視覺與動線

### 現況

- 首頁已串接搜尋、Explorer、編輯選擇、Guide、Provider 與捕魚機入口。
- `/games/` 已提供可分享 URL 的 Provider、Mechanism、Feature、RTP、波動度、最高倍數、子類型篩選與排序。
- Guide 總覽依 category 分組，Guide detail 連向代表遊戲與精確 Explorer query。
- Game detail 已把 Mechanism／RTP／波動度／Max Win Guide 放在資料欄位旁，Feature Guide 放在獨立區塊並支援 overflow。

### 真正缺口

- 首頁直接輸出全部 11 篇 Guide，內容增加後會持續拉長，缺少明確的「新手必讀／最新或核心」呈現規則。
- 首頁仍使用「首批遊戲」「第一批編輯精選」語彙；Provider 總覽仍寫「第一版公開四家 Seed Data」，已與 30 款 Game、11 家 Provider 現況不一致。
- 沒有真實行為分析證據能證明目前哪個區塊需要大改；現階段不適合以主觀印象重新設計首頁或 Explorer。

### 使用者可感受到的改善

- 修正過時文案能提高可信度。
- 收斂首頁 Guide 列表可讓搜尋與探索保持主要入口，Guide library 承接完整瀏覽。
- 小型跨頁任務測試可確認返回狀態、行動版操作與比較入口是否仍清楚。

### 現在不做是否阻止第一版上線

否，但過時數量文案應在正式上線候選 QA 中修正；它是小型內容一致性問題，不需要擴張成整站改版。

### 工作量與風險

- 工作量：低至中。
- 風險：缺少行為證據時過度重設首頁、重複建立內容挑選邏輯，或改壞已通過的手機與無障礙行為。

### 是否符合既有藍圖

符合三條核心流程與「教學是第二入口」原則；大幅視覺改版則沒有藍圖必要性。

### 建議優先順序

第 3。Guide 補強後再做一次小型 launch-candidate 文案與動線 QA，不重設整套版面。

## 6. 方向四：尚未完成但對使用者有價值的互動工具

### 現況

- 搜尋處理名稱、aliases、Provider、Guide 及已建立關聯的中英文概念意圖。
- Explorer 支援結構化篩選、Features AND、URL 狀態、重新整理與瀏覽器歷史。
- Compare 支援最多三款、加入／移除、URL 分享、手機內部橫向捲動與缺值顯示。
- 工具總覽已能完成「搜尋 → 探索 → 比較」的主要工作。

### 真正缺口

- 目前沒有使用資料證明還缺哪一個互動工具。
- 舊 backlog 的 RTP expectation calculator 不是現行藍圖授權；它容易被誤解為結果預測，且不比補強 RTP 教學更優先。
- Bonus Buy 三態、系列、年份等額外篩選仍需資料覆蓋與產品價值另案審查，不能因欄位存在就自動加入。

### 使用者可感受到的改善

在有真實需求前只能推測。相較之下，修正已存在的薄 Guide 能直接改善目前可走到的路徑。

### 現在不做是否阻止第一版上線

否。核心需求 1–5 已有搜尋、Explorer、Compare、Game detail 與 Guide 承接。

### 工作量與風險

- 工作量：中至高。
- 風險：以技術可行性代替需求、引入勝率／回報暗示、擴大資料與 URL 治理。

### 是否符合既有藍圖

目前沒有一個新工具已被藍圖定為近期必做；排行、預測、會員與收藏更明確屬於不得自行開發。

### 建議優先順序

第 5。等待 Preview／正式站的實際搜尋、篩選與比較回饋後再決定。

## 7. 方向五：正式網域、舊站內容與 301 上線前準備

### 現況

- Repository 仍明確記錄正式網站由 Wix 提供；Cloudflare Pages 是 Preview。
- production mode 已預留 `https://www.slothub.com.tw` canonical、published 路由 sitemap 與 production robots 行為。
- Pages `.pages.dev` middleware、HTML meta、HTTP header、空 sitemap 與無 canonical 已持續通過 Preview safeguard。
- 尚未看到 Wix／GSC 的完整舊 URL inventory、逐 URL 去向、保留／合併／移除決策或核准的 301 mapping。
- 正式 query URL 的 edge robots／canonical 行為仍是已知延後項目；不能宣稱 production query-specific policy 已完成。

### 真正缺口

- 舊 Wix URL 與內容 inventory。
- 舊 URL → 新 URL 的一對一、合併、410／保留決策及查核責任人。
- production robots、canonical、sitemap、Pages headers、custom domain 與 DNS 切換的核准矩陣。
- 正式候選 build、HTTP headers、內部連結、Search Console／分析工具與回復方案的驗收清單。
- 切換時間、Wix 保留期、DNS 權限與回滾方式等人工營運決策。

### 使用者可感受到的改善

完成後使用者才能在正式品牌網址穩定進入新站，舊連結也不會大量失效；但在切換前它不會改善 Preview 內容本身。

### 現在不做是否阻止第一版上線

是。這是正式網域切換與索引開放前的硬門檻，不能用 Preview 已成功部署代替。

### 工作量與風險

- 工作量：中高，取決於舊站 URL 數量與內容重疊。
- 風險：遺漏高價值舊 URL、錯誤 301、Pages 與 Wix 同時服務、canonical 指錯、過早解除 noindex、DNS 回滾困難。

### 是否符合既有藍圖

符合藍圖與舊架構文件的正式上線邊界；但任何 DNS、Wix、301 或索引變更仍需獨立人工授權。

### 建議優先順序

第 2。建議在核心薄 Guide 完成並凍結第一版公開 URL／內容清單後，立即建立獨立的「正式上線 Migration Readiness」只讀範圍。

## 8. 唯一推薦的下一階段

### `Core Guide Content Completion v1`

只處理三個已發布、已在核心路徑曝光的薄 Guide，順序如下：

1. `rtp-explained`
2. `volatility-explained`
3. `slot-beginners-guide`

這是一個產品範圍，但執行時仍須遵守 Guide Content Workflow，逐篇經過只讀 Brief、第一方來源核對、內容草稿／既有文章補強、模擬 published、人工內容審查與獨立發布關卡。不得一次把三篇同時改完後才審查。

### 為什麼現在做最值得

- 它修正的是目前使用者已經會走到的頁面，不是新增可能沒人使用的能力。
- RTP 與波動度是 Game detail 核心數據與 Explorer 篩選的共同語言；內容薄弱會削弱整個「資料 → 看懂概念」承諾。
- 新手 Guide 是首頁主要入口，其品質直接影響第一次使用者是否理解網站價值。
- 30 款遊戲、11 篇 Guide、關聯 resolver、圖文排版與驗證底座已足以支援補強，不需修改 Schema、taxonomy 或 UI。
- 完成後再進入正式網域 migration readiness，可以避免把已知薄頁直接帶入正式索引。

### 預計影響頁面

- `/guide/rtp-explained/`
- `/guide/volatility-explained/`
- `/guide/slot-beginners-guide/`
- 既有 Game detail 的 RTP／波動度 Guide 入口只需回歸，不應改程式。
- 首頁新手 CTA、Guide 總覽、Search、Guide → Game、Game → Guide 只需驗證，不應重設。

### 預計可能修改的檔案

每篇取得人工核准後，原則上限於：

- `docs/` 下該 Guide 的只讀 Brief／來源盤點。
- `src/content/guides/rtp-explained.md`
- `src/content/guides/volatility-explained.md`
- `src/content/guides/slot-beginners-guide.md`
- 只有當既有測試含過時內容預期時，才最小更新相應 Guide／relationship 測試；不預設修改程式。

不應修改：Game、Provider、Schema、taxonomy、resolver、Search、Explorer、Compare、Guide template、全站 CSS、正式網域、Wix、DNS、301 或索引政策。

### 是否需要額外人工決策

需要：

1. 人工核准此下一階段及第一篇先從 RTP 開始。
2. 每篇 Brief 進入正文補強前的內容範圍與第一方來源核准。
3. 是否維持既有 title／slug／relationship owner；預設維持，不主動改名或移交。
4. 每篇 published 內容更新與 Push／Preview 部署核准。
5. 三篇完成後，另行核准正式上線 Migration Readiness；本文件不授權讀取 Wix／GSC、建立 301、修改 DNS 或解除索引保護。

## 9. 本輪未執行

- 未查網或讀取 Wix／GSC。
- 未修改任何 Game、Guide、Provider、頁面、CSS、Schema、taxonomy、測試或部署設定。
- 未建立新工具或其他 Knowledge Diagram。
- 未處理或提交 `.prototype/`、`guide-typography-review/`、`guide-knowledge-diagram-review/`、`guide-cascading-diagram-review/`、`guide-max-win-diagram-review/`。
- 未 Commit、Push 或部署。

## 10. 固定尾段

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_STATE: READONLY_PRIORITY_AUDIT_COMPLETE`

`PRIORITY_ORDER: 1) Guide 內容完整度；2) 正式上線 Migration Readiness；3) 核心頁面動線；4) 圖片與視覺缺口；5) 新互動工具`

`RECOMMENDED_NEXT_STAGE: Core Guide Content Completion v1`

`FILES_CHANGED: docs/slot-hub-v1-next-stage-priority-readonly-audit.md`

`NEXT_ALLOWED_ACTION: 人工決定是否核准 Core Guide Content Completion v1，並從 RTP Guide 的只讀 Brief 開始`

`COMMIT_ALLOWED: NO`

`PUSH_ALLOWED: NO`

`DEPLOY_ALLOWED: NO`

`HUMAN_APPROVAL_REQUIRED: YES`
