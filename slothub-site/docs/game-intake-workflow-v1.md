# Slot Hub 遊戲收錄閉環工作流 v1

> 狀態：`APPROVED v1`
>
> 本文件是遊戲候選獲准後的操作流程，不取代、修改或擴張 `docs/slot-hub-master-blueprint-v1.md`。產品定位、收錄原則、資料標準、網址、taxonomy、Schema 與發布門檻仍以 `APPROVED v1` 藍圖及後續明確產品決策為準；本工作流只規定一筆候選如何從候選名單走到 Preview 驗收關閉。

## 1. 目的與適用範圍

本工作流用於：

- 避免候選、驗證、草稿、發布與部署授權混在同一階段。
- 讓 Codex 在已授權範圍內持續完成資料核對、測試與安全修正，不必每個小步驟停下詢問。
- 讓每個階段都有唯一狀態、固定出口、允許修改範圍及下一個可執行動作。
- 保證未核准資料不會因建立檔案、Build 或 Preview 模擬而意外公開。

Relax Gaming 的 intake manifest 另以 `importStatus`／`collectionOutcome` 記錄作業進度。Game frontmatter 的 `status: published` 表示該檔進入網站建置後會公開，不證明檔案已提交、Push 或部署。批次準備與本機驗證期間，manifest 應記為 `imported`；只有遊戲已在 `origin/main`，且對應部署完成並經線上回讀，才可把 manifest 改為 `published`。完整驗證會拒絕 manifest 中指向未提交遊戲的 `published` 標記。

本工作流不授權：

- 自行決定產品方向或改寫藍圖。
- 自行修改 Schema、taxonomy 或 enum。
- 自行把 `draft` 改成 `published`。
- 自行 Push、部署或更動正式網域、DNS、301、Wix、canonical 或索引規則。

## 2. 基本原則

1. 一款遊戲在任一時間只能有一個主要狀態。
2. 同批遊戲可以一起推進，但每款都要保留自己的判定與缺口。
3. 狀態描述的是已完成事實，不用未來預期提前標示。
4. 缺少選填欄位不等於失敗；身份衝突、重大數值衝突、錯誤 Provider 或無法追溯來源才是阻擋。
5. 所有精確數值、系列與 Mechanism 依藍圖來源規則處理；找不到就留空，不以推測填滿。
6. `status: draft` 是資料發布隔離，不是工作流狀態的替代品。
7. 任一階段發現非預期檔案、遠端新 Commit、身份衝突，或重大且尚未解決、會影響身份、核心數值、Provider、系列或發布可靠性的來源衝突時，立即停止跨階段操作並回報。可以判讀、完整保存且不影響核心資料的來源差異，可以留在同一階段繼續處理。
8. 每款 published Game 必須對應一個 published Provider record，讓使用者一定能從 Game detail 前往站內廠商頁；無法確認 Provider 身份的遊戲不得發布。
9. 每個 published Provider 必須有可追溯的 `officialUrl`，作為「廠商官網」入口。Provider 官方網站與單款 Demo 是兩份不同資料，不得互相代替。
10. Demo／官方單款遊戲頁／第三方同款頁屬獨立的可選補充；只有核實精確單款目的地才加入。找不到時保留真實缺值或狀態，不得拿 Provider 首頁、通用大廳或搜尋頁補成 Demo。

## 3. 固定狀態與權限

### 3.1 `CANDIDATE`

定義：

- 只有候選名稱與入選目的。
- 不代表正式身份、Provider、繁中名稱、系列或資料已確認。
- 不得建立 Provider／Game Collection 檔案或下載圖片。

允許工作：

- 在候選／選批文件中記錄名稱、選擇目的、待驗證問題及替代候選。
- 比對現有資料是否有明顯同名候選；不得將結果當成完整身份驗證。

固定出口：

- 名單經人工定案：`PASS_TO_NEXT_STAGE`，進入 `READONLY_VALIDATION`。
- 尚需產品取捨：`PRODUCT_DECISION_REQUIRED`。
- 暫不驗證：`KEEP_AS_CANDIDATE`。
- 明確不收錄：`REJECT`。

權限：

- `FILES_ALLOWED_TO_CHANGE`: 候選選批文件；不得修改 Provider／Game／圖片／Schema／網站。
- `COMMIT_ALLOWED`: 只有明確要求提交候選文件時可以。
- `PUSH_ALLOWED`: 否。
- `DEPLOY_ALLOWED`: 否。
- `HUMAN_APPROVAL_REQUIRED`: 是；候選名單正式定案是人工關卡。

### 3.2 `READONLY_VALIDATION`

定義：

- 核對官方來源、正式身份、名稱、Provider、系列、Mechanism、Features、數值與圖片來源。
- 只能新增或修正本批驗證報告，不建立內容資料或圖片資產。

允許工作：

- 依藍圖來源優先順序查證。
- 比對現有 Game／Provider、Schema、taxonomy 與公開路由。
- 在同一階段持續補證、修正報告內部不一致及重跑只讀統計。

固定出口：

- 身份與最低來源門檻通過：`PASS_TO_NEXT_STAGE`，狀態成為 `ELIGIBLE_FOR_DRAFT`。
- 可修正的資料缺口：`RETURN_FOR_DATA_FIX`，留在 `READONLY_VALIDATION`。
- 需要 Schema／taxonomy 決策：`TAXONOMY_DECISION_REQUIRED`。
- 需要收錄範圍或產品關係決策：`PRODUCT_DECISION_REQUIRED`。
- 證據不足但仍值得保留：`KEEP_AS_CANDIDATE`，退回 `CANDIDATE`。
- 身份錯誤、重複或不適合收錄：`REJECT`。

權限：

- `FILES_ALLOWED_TO_CHANGE`: 本批 readonly validation 報告。
- `COMMIT_ALLOWED`: 驗證報告經審查或任務明確要求後，可以建立獨立本地文件 Commit。
- `PUSH_ALLOWED`: 否。
- `DEPLOY_ALLOWED`: 否。
- `HUMAN_APPROVAL_REQUIRED`: 階段內補證不需要；候選身份取捨、taxonomy／Schema 或產品決策需要。

### 3.3 `ELIGIBLE_FOR_DRAFT`

定義：

- 正式身份、Provider 與最低來源門檻已通過。
- 可以建立必要的 Provider／Game draft，並準備已核對來源的官方圖片。
- 仍不代表可以發布。

允許工作：

- 依驗證報告建立最小資料草稿。
- 若 Provider 尚不存在，建立通過驗證且符合現有 Schema 的 Provider draft。
- 準備官方圖片、保存來源、尺寸、取得日期與處理說明。
- 執行 Schema、資料審計、圖片存在性與 draft 隔離測試。

固定出口：

- 草稿與圖片建立完成且隔離通過：`PASS_TO_NEXT_STAGE`，進入 `DRAFT_READY`。
- 資料或圖片來源需要補正：`RETURN_FOR_DATA_FIX`。
- 現有欄位無法安全承接：`TAXONOMY_DECISION_REQUIRED`。
- 發現不應建立本批：`PRODUCT_DECISION_REQUIRED` 或 `KEEP_AS_CANDIDATE`。

權限：

- `FILES_ALLOWED_TO_CHANGE`: 本批 Provider draft、Game draft、官方圖片及必要的批次資料報告；不含 Schema／taxonomy／頁面。
- `COMMIT_ALLOWED`: 草稿審查通過且任務明確要求時，可以建立範圍受限的本地 Commit。
- `PUSH_ALLOWED`: 否。
- `DEPLOY_ALLOWED`: 否。
- `HUMAN_APPROVAL_REQUIRED`: 一般 draft 建立與隔離測試不需要逐步核准；新增 Schema／taxonomy、擴大候選或非預期 Provider 關係需要。

### 3.4 `DRAFT_READY`

定義：

- Provider／Game 資料與圖片已建立。
- 所有資料保持 `status: draft`。
- 已通過內容驗證、資料審計、圖片檢查及共同狀態邏輯的隔離測試。

最低隔離要求：

- 不產生公開單款路由或 Provider 路由。
- 不進遊戲庫、搜尋、比較、Provider 遊戲清單、sitemap、RSS 或靜態輸出。
- 圖片可以存在於資產目錄，但不得形成公開遊戲入口。

固定出口：

- 草稿完整且隔離通過：`PASS_TO_NEXT_STAGE`，進入 `PREVIEW_REVIEW`。
- 資料缺口或隔離失敗：`RETURN_FOR_DATA_FIX`。
- 圖片或版面預期已有明顯問題：`RETURN_FOR_VISUAL_FIX`。
- 欄位定義阻擋：`TAXONOMY_DECISION_REQUIRED`。

權限：

- `FILES_ALLOWED_TO_CHANGE`: 本批 draft、圖片與驗證報告；安全修正限於本批資料。任何共用程式修改必須另行界定。
- `COMMIT_ALLOWED`: 可以依明確任務提交已審查的 draft／圖片；Commit 不改發布狀態。
- `PUSH_ALLOWED`: 否。
- `DEPLOY_ALLOWED`: 否。
- `HUMAN_APPROVAL_REQUIRED`: 隔離驗證與本批安全資料修正不需要；擴大程式、Schema 或 taxonomy 範圍需要。

### 3.5 `PREVIEW_REVIEW`

定義：

- 在本機暫時把本批 Provider／Game 模擬為 `published`，只供 Build 與視覺／功能驗收。
- 檢查卡片、資料頁、搜尋、比較、系列、Provider、桌機與手機。
- 審查完成後必須恢復全部資料為 `draft`，並確認工作目錄只保留另行核准的修正或完全乾淨。

必查項目：

- 公開數量與預期一致。
- 卡片圖片、雙語名稱、缺值收合及長名稱正常。
- 單款資料、Provider 與系列關聯正確。
- 搜尋名稱／aliases、比較 1／2／3 款及響應式正常。
- 桌機與 390×844 手機沒有頁面級水平溢位。
- 資料審計、Astro Check、Static Build、內部連結及 Preview safeguards 通過。

固定出口：

- 內容與畫面通過：`PASS_TO_NEXT_STAGE`，恢復 draft 後進入 `READY_TO_PUBLISH`。
- 資料問題：`RETURN_FOR_DATA_FIX`，回到 `DRAFT_READY`。
- 畫面問題：`RETURN_FOR_VISUAL_FIX`，修正後重新執行 `PREVIEW_REVIEW`。
- 共用分類問題：`TAXONOMY_DECISION_REQUIRED`。
- 產品呈現需要決策：`PRODUCT_DECISION_REQUIRED`。

權限：

- `FILES_ALLOWED_TO_CHANGE`: 暫時只改本批狀態；審查後恢復。另經範圍確認的資料或視覺修正可以保留。
- `COMMIT_ALLOWED`: 不得提交純模擬的 `published` 狀態；經審查核准的獨立修正可另行 Commit。
- `PUSH_ALLOWED`: 否。
- `DEPLOY_ALLOWED`: 否。
- `HUMAN_APPROVAL_REQUIRED`: 階段內模擬、測試與安全修正不需要；任何 Schema／taxonomy 或範圍擴張需要。

### 3.6 `READY_TO_PUBLISH`

定義：

- 本批內容、圖片、功能與畫面審查通過。
- Repository 內仍為 `status: draft`。
- 只有此狀態的資料才有資格在人工核准後改為 `published`。

固定出口：

- 人工核准發布：`PASS_TO_NEXT_STAGE`；執行 `draft → published`、發布 Commit、Push 與 Preview 部署後進入 `PUBLISHED_TO_PREVIEW`。
- 發布前發現資料退化：`RETURN_FOR_DATA_FIX`。
- 發布前發現視覺退化：`RETURN_FOR_VISUAL_FIX`。
- 人工決定延後發布：維持 `READY_TO_PUBLISH`，不得退回 `KEEP_AS_CANDIDATE`，也不得自行改成其他狀態。

權限：

- `FILES_ALLOWED_TO_CHANGE`: 未獲發布核准前不得改資料狀態；只允許處理明確發現的範圍內修正。
- `COMMIT_ALLOWED`: 修正可按任務要求 Commit；發布狀態 Commit 必須取得人工核准。
- `PUSH_ALLOWED`: 否，直到取得 Push／部署核准。
- `DEPLOY_ALLOWED`: 否，直到取得 Push／部署核准。
- `HUMAN_APPROVAL_REQUIRED`: 是；`draft → published` 及 Push／部署是人工關卡。

### 3.7 `PUBLISHED_TO_PREVIEW`

定義：

- 已在明確人工核准下改成 `published`。
- 發布 Commit、Push、CI 與 Cloudflare Pages Preview 已完成。
- 尚需線上回讀，不能只以 Build 或部署成功視為結案。

線上回讀：

- 預期遊戲／Provider 數量。
- 新路由 HTTP 200。
- 遊戲庫、搜尋、比較、Provider 與系列關聯。
- 圖片 HTTP 200 與實際載入。
- 桌機與 390×844 手機。
- HTML Meta Robots、`X-Robots-Tag`、空白 Preview sitemap 與無 Preview canonical。
- GitHub Actions、Cloudflare Deployment 與 Commit 對應。

固定出口：

- 線上與 Git 同步全部通過：`PASS_TO_NEXT_STAGE`，進入 `CLOSED`。
- 線上資料錯誤：`RETURN_FOR_DATA_FIX`。
- 線上畫面錯誤：`RETURN_FOR_VISUAL_FIX`。
- 遠端、部署或產品狀態不一致：`PRODUCT_DECISION_REQUIRED`，停止後續操作。

權限：

- `FILES_ALLOWED_TO_CHANGE`: 原發布範圍內的必要修正；不得順便修改其他內容。
- `COMMIT_ALLOWED`: 修正 Commit 需遵守原發布授權範圍；超出範圍需人工核准。
- `PUSH_ALLOWED`: 只有原任務已明確授權，且遠端無新 Commit／衝突時可以。
- `DEPLOY_ALLOWED`: 只有原任務已明確授權時可以。
- `HUMAN_APPROVAL_REQUIRED`: 發布授權已在前一關取得；發現範圍外問題、遠端分岔或需擴張修改時需要再次核准。

### 3.8 `CLOSED`

定義：

- 數量、路由、搜尋、比較、圖片、防索引、CI、Cloudflare Deployment 與 Git 同步全部確認。
- 正式網域、Wix、DNS、301 與正式索引規則沒有因 Preview 發布而改動。

固定出口：

- `PASS_TO_NEXT_STAGE`：本批流程結束；下一個允許動作是另行選擇新候選或開立明確維護任務。
- 若結案後發現回歸，依問題回到 `DRAFT_READY`、`PREVIEW_REVIEW` 或 `PUBLISHED_TO_PREVIEW`，並使用相應返回出口。

權限：

- `FILES_ALLOWED_TO_CHANGE`: 無；新的修改必須建立新任務與範圍。
- `COMMIT_ALLOWED`: 否，除非新任務明確授權。
- `PUSH_ALLOWED`: 否。
- `DEPLOY_ALLOWED`: 否。
- `HUMAN_APPROVAL_REQUIRED`: 開始下一批、正式站切換或任何新範圍時需要。

## 4. 狀態轉移

```text
CANDIDATE
  └─ 人工定案 ─→ READONLY_VALIDATION
       ├─ 身份／來源通過 ─→ ELIGIBLE_FOR_DRAFT
       ├─ 資料補證 ─→ READONLY_VALIDATION
       ├─ taxonomy／產品決策 ─→ 停止等待人工決策
       ├─ 證據不足 ─→ CANDIDATE
       └─ 不適合 ─→ REJECT

ELIGIBLE_FOR_DRAFT
  └─ 建立 draft／圖片／隔離驗證 ─→ DRAFT_READY
       ├─ 資料修正 ─→ DRAFT_READY
       └─ 通過 ─→ PREVIEW_REVIEW

PREVIEW_REVIEW
  ├─ 資料修正 ─→ DRAFT_READY
  ├─ 視覺修正 ─→ PREVIEW_REVIEW
  └─ 通過並恢復 draft ─→ READY_TO_PUBLISH

READY_TO_PUBLISH
  └─ 人工核准 draft → published 與 Push／部署
       └─→ PUBLISHED_TO_PREVIEW
              ├─ 線上資料／視覺修正 ─→ PUBLISHED_TO_PREVIEW
              └─ 全部回讀通過 ─→ CLOSED
```

任何 `TAXONOMY_DECISION_REQUIRED` 或 `PRODUCT_DECISION_REQUIRED` 都會暫停狀態轉移，不得以 `other`、空白推測、額外檔案或未授權程式修改繞過。

## 5. 每階段固定報告尾段

每一階段報告最後必須完整輸出以下欄位，不得只寫「完成」：

```text
STAGE_RESULT: PASS_TO_NEXT_STAGE | RETURN_FOR_DATA_FIX | RETURN_FOR_VISUAL_FIX | TAXONOMY_DECISION_REQUIRED | PRODUCT_DECISION_REQUIRED | KEEP_AS_CANDIDATE | REJECT
CURRENT_STATE: <八個固定狀態之一>
NEXT_ALLOWED_ACTION: <下一個明確可執行動作；若停止則寫等待的決策>
FILES_ALLOWED_TO_CHANGE: <精確檔案或目錄範圍；沒有則寫 NONE>
COMMIT_ALLOWED: YES | NO | ONLY_WITH_EXPLICIT_APPROVAL
PUSH_ALLOWED: YES | NO | ONLY_WITH_EXPLICIT_APPROVAL
DEPLOY_ALLOWED: YES | NO | ONLY_WITH_EXPLICIT_APPROVAL
HUMAN_APPROVAL_REQUIRED: YES | NO；<需要核准的具體事項>
```

若同批遊戲有不同結果，先逐款輸出結果，再以整批最保守且不阻擋安全補證的結果作為 `STAGE_RESULT`。單款 `REJECT` 不必阻止其他已通過遊戲前進，但必須從下一階段允許檔案清單排除。

## 6. 自動續行規則

### 可以自主完成

- 同一階段內的官方資料取得、來源核對與報告一致性修正。
- Schema／taxonomy 的只讀對照。
- 既有資料審計、搜尋測試、Astro Check、Build、連結檢查及 Preview safeguards。
- draft 隔離驗證。
- 已界定範圍內、可恢復且不改產品語意的安全修正。
- 測試期間暫時模擬 published，前提是完成後恢復 draft 並確認 Git 狀態。

- 當 `STAGE_RESULT: PASS_TO_NEXT_STAGE` 且 `HUMAN_APPROVAL_REQUIRED: NO` 時，Codex 必須在同一任務內直接執行 `NEXT_ALLOWED_ACTION`，不得只回報下一步後結束工作。
- 可以發送進度回報，但不能把進度回報當成停止點。
- 只有到達人工關卡、發生明確 blocker、超出允許檔案範圍或觸發本工作流固定停止條件時才能結束。
- 同一任務可以連續跨越多個不需人工核准的狀態。
- 若下一階段標示 `HUMAN_APPROVAL_REQUIRED: YES` 或符合下列人工關卡，回報允許動作並停止；不得把「可以做」解讀成「已授權跨越人工關卡」。

### 必須停止的人工關卡

- 候選名單正式定案。
- Schema、taxonomy 或 enum 修改。
- `draft → published`。
- Push 或部署。
- 正式網域、DNS、301、Wix、canonical 或索引規則修改。
- 發現非預期檔案、身份衝突、重大且尚未解決並會影響身份、核心數值、Provider、系列或發布可靠性的來源衝突，或遠端新 Commit。可判讀、已完整保存且不影響核心資料的來源差異不屬於停止條件。
- 必須擴大原任務檔案範圍才能解決的問題。

遠端有新 Commit 時，只能先 Fetch、核對差異並回報；不得 force push 或覆蓋遠端。若已明確授權 Push，且核對後可安全 rebase，仍須確保沒有衝突及非預期內容。

## 7. 第三批產品決策

本節記錄專案負責人已明確定案的第三批候選；仍須從 `CANDIDATE` 進入 `READONLY_VALIDATION`，不代表已核准建立 Game／Provider draft 或發布。

| 順序 | 正式候選 | 入選目的 |
| ---: | --- | --- |
| 1 | Jump High／跳高高 | 補 CQ9 Gaming 與亞洲／繁中搜尋入口。 |
| 2 | Super Ace | 補 JILI Provider 與亞洲搜尋廣度。 |
| 3 | Bonanza | 補 Big Time Gaming 與 Megaways 零覆蓋。 |
| 4 | Gonzo’s Quest | 增加 NetEnt 深度並驗證 Avalanche／Cascading 原廠語意。 |
| 5 | Legacy of Dead | 增加 Play’n GO 深度並驗證與既有 Dead Series 的正式關係。 |
| 6 | Reactoonz | 增加 Cluster Pays 與品牌化 Features 樣本。 |

### Fortune Rabbit 調整

- Fortune Rabbit 保留為未來 `CANDIDATE`，不屬於第三批六款。
- 第三批由 Super Ace 取代 Fortune Rabbit。
- 理由：PG SOFT 已有四款，且相似名稱不等於正式系列的判定已由 Fortune Tiger／Ox 驗證；JILI 尚未收錄，Super Ace 對 Provider 與亞洲搜尋的補位價值更高。
- 這項調整不回寫或篡改 `docs/24-game-coverage-and-third-batch-selection.md`；該文件保留當時盤點與推薦 Fortune Rabbit 的歷史結論。

## 8. 第三批目前狀態與下一步

```text
STAGE_RESULT: PASS_TO_NEXT_STAGE
CURRENT_STATE: CANDIDATE
NEXT_ALLOWED_ACTION: 依藍圖對第三批六款執行 READONLY_VALIDATION，只新增第三批驗證報告，不建立 Provider／Game 或圖片。
FILES_ALLOWED_TO_CHANGE: docs/third-six-games-readonly-validation.md（實際檔名可在任務中確認）；不得修改內容資料、Schema、taxonomy 或網站。
COMMIT_ALLOWED: NO
PUSH_ALLOWED: NO
DEPLOY_ALLOWED: NO
HUMAN_APPROVAL_REQUIRED: NO；第三批候選名單已由專案負責人在本次指令中正式定案。若驗證發現 taxonomy／產品問題則重新需要人工決策。
```
