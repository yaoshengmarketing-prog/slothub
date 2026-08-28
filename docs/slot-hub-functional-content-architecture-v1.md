# Slot Hub 功能與內容關聯架構 v1

> 文件狀態：`CURRENT`  
> 文件性質：資訊架構與長期邏輯藍圖  
> 基準程式版本：`870b4d2438e657f0ddeb1374b3d8431ac8afc694`  
> 本輪範圍：只建立架構文件，不修改網站功能、資料 Schema、URL、索引規則、既有頁面或遊戲資料。

## 1. 文件目的

本文件定義 Slot Hub 的功能、內容實體與關聯方式，讓目前以 Astro Content Collections 建立的網站，可以在不破壞既有路由與使用流程的前提下，逐步成長為以遊戲資料為核心、教學內容負責解釋、搜尋與篩選負責探索、比較表負責決策輔助的資料型網站。

本文件不是 CMS、D1、後台或新頁面的實作規格。凡標記為 `FUTURE`、`IDEA` 或 `DO_NOT_BUILD_YET` 的項目，本階段均不得據此自行建立。

## 2. 狀態標記

| 狀態 | 定義 |
|---|---|
| `CURRENT` | 現有程式或內容已具備，可依目前行為使用 |
| `NEXT` | 已確認為合理的下一階段方向，但仍需獨立核准後才能實作 |
| `FUTURE` | 長期藍圖預留，尚未進入近期實作範圍 |
| `IDEA` | 值得保留的可能性，仍需搜尋需求、資料量或使用者行為驗證 |
| `DO_NOT_BUILD_YET` | 明確禁止在目前階段建立或擴張 |

狀態標記描述的是「能力目前所處階段」，不是資料品質評分，也不代表排程承諾。

## 3. 核心原則

| 原則 | 狀態 | 定義 |
|---|---|---|
| 遊戲資料是核心實體 | `CURRENT` | Game 是搜尋、篩選、比較、系列、廠商及教學關聯的共同中心 |
| 搜尋負責探索 | `CURRENT` | 搜尋名稱、別名、廠商與教學；搜尋不是 taxonomy 頁面產生器 |
| 篩選負責條件組合 | `CURRENT` | 依可驗證的結構化欄位縮小遊戲集合 |
| 系列負責作品關係 | `CURRENT` | 現有 Game 已能保存 seriesId、系列名稱、代數及 relatedGames |
| 系列獨立頁 | `FUTURE` | 只有通過系列頁門檻後，才可成為永久入口 |
| 賠付機制描述如何中獎 | `CURRENT` | Mechanism 與 Feature 必須維持不同語意 |
| Feature 描述遊戲功能 | `CURRENT` | Feature 是結構化屬性與篩選候選，不等同於永久頁面 |
| 教學解釋資料並反向導流 | `NEXT` | Guide 應連接代表遊戲及已套條件的探索結果 |
| 遊戲頁反向顯示相關教學 | `NEXT` | 需依明確關聯欄位產生，不靠正文關鍵字猜測 |
| 比較表是使用工具 | `CURRENT` | 比較最多三款遊戲，不產生大量 SEO 落地頁 |
| CMS、D1、後台 | `DO_NOT_BUILD_YET` | 僅預留實體與關聯概念，本階段不得導入 |

## 4. 使用者探索流程

### 4.1 名稱導向

`CURRENT`

使用者輸入繁中名稱、英文原名、別名或廠商名稱，搜尋結果導向：

- 單款遊戲頁；
- 廠商頁；
- 教學頁。

目前搜尋也能利用系列名稱與摘要作輔助比對。搜尋結果頁本身是工具入口，不是可大量索引的搜尋落地頁。

### 4.2 條件導向

`CURRENT`

使用者從遊戲庫依廠商、主類型、子類型、最低 RTP、波動度等結構化條件縮小集合，再進入單款遊戲頁或加入比較。

`NEXT`

未來可在資料量與欄位取得率足夠時，加入 Feature、賠付機制、Bonus Buy、最高倍數區間、發行年份等篩選，但每一個篩選都必須使用已驗證欄位，缺值不得視為否定值或零。

### 4.3 概念導向

`NEXT`

使用者先閱讀 RTP、波動度、Megaways、群集賠付、Bonus Buy 等教學，理解概念後：

1. 查看少量代表遊戲；
2. 前往已套用對應條件的完整遊戲探索結果；
3. 進入單款遊戲頁；
4. 視需要加入比較。

### 4.4 關係導向

`CURRENT`

單款遊戲頁可顯示明確指定的相關遊戲、同系列遊戲及同廠商遊戲。

`NEXT`

單款遊戲頁可顯示與該遊戲明確關聯的教學；教學頁也可反向顯示代表遊戲、廠商、系列、機制或 Feature。

## 5. 功能邊界

### 5.1 搜尋

| 能力 | 狀態 | 邊界 |
|---|---|---|
| 搜尋遊戲名稱與別名 | `CURRENT` | 支援繁中、英文與標準化比對 |
| 搜尋廠商 | `CURRENT` | 廠商名稱、品牌名、別名及摘要可參與搜尋 |
| 搜尋教學 | `CURRENT` | 標題、描述與 tags 可參與搜尋 |
| 系列名稱輔助搜尋 | `CURRENT` | 目前作 supporting field，不代表系列已有獨立頁 |
| 搜尋 Feature／機制概念 | `NEXT` | 優先命中教學或遊戲，不自動建立 taxonomy 頁 |
| 搜尋結果大量索引 | `DO_NOT_BUILD_YET` | 查詢參數與結果組合不得變成大量索引頁 |
| AI 語意搜尋 | `IDEA` | 需先證明現有搜尋無法滿足需求，再另行評估 |

搜尋與篩選的界線：搜尋處理「使用者怎麼稱呼它」，篩選處理「遊戲有哪些已驗證屬性」。

### 5.2 篩選

| 條件 | 狀態 | 永久頁原則 |
|---|---|---|
| 廠商 | `CURRENT` | 已有永久廠商頁；篩選仍可作工具操作 |
| 主類型／子類型 | `CURRENT` | 目前作探索分類，是否增建更多入口需另行審查 |
| RTP | `CURRENT` | 只作數值篩選，不為任意門檻建 SEO 頁 |
| 波動度 | `CURRENT` | 只作結構化篩選 |
| Feature | `NEXT` | 先作標籤與篩選，不自動建頁 |
| 賠付機制 | `NEXT` | 可作篩選；永久入口須另過內容門檻 |
| Bonus Buy | `NEXT` | 必須保留有／無／未確認三態 |
| 最高倍數區間 | `IDEA` | 只作工具條件，不建立任意倍數頁 |
| 發行年份 | `IDEA` | 只作工具條件，不自動建立年份頁 |
| 任意多條件組合 | `DO_NOT_BUILD_YET` | 不轉成可索引 SEO 頁 |

篩選結果應維持工具結果。即使未來可分享篩選狀態，也不代表該 URL 自動取得 canonical 或索引資格。

### 5.3 系列

| 能力 | 狀態 | 規則 |
|---|---|---|
| Game 保存系列 ID、名稱與代數 | `CURRENT` | 系列關係以可核對資料為準 |
| 遊戲頁顯示同系列作品 | `CURRENT` | 明確 relatedGames 優先，再使用相同 seriesId |
| Series 作獨立資料實體 | `FUTURE` | 未來 CMS 可獨立管理 |
| 系列永久頁 | `FUTURE` | 至少兩款已確認作品、明確來源、獨立內容價值 |
| 單款遊戲自動形成系列頁 | `DO_NOT_BUILD_YET` | 不因一筆 seriesName 出現就建頁 |
| 猜測續作關係 | `DO_NOT_BUILD_YET` | 名稱相似不足以證明系列關係 |

系列頁若未來成立，應提供系列範圍、作品順序、關係說明及系列內作品探索，而不是只列出兩張遊戲卡。

### 5.4 賠付機制

`CURRENT`

Mechanism 回答「遊戲用什麼規則形成中獎組合」，例如：

- Paylines／賠線；
- Ways to Win／多路贏法；
- Megaways；
- Cluster Pays／群集賠付；
- 其他已確認機制。

`NEXT`

賠付機制可成為遊戲探索條件，並連接解釋該機制的教學。

`FUTURE`

只有同時具備以下條件時，才可建立永久機制入口：

1. 有明確搜尋需求；
2. 有足夠已驗證遊戲；
3. 能提供獨立概念解釋；
4. 不與既有教學頁競爭同一搜尋意圖；
5. 有穩定的內部連結角色。

`DO_NOT_BUILD_YET`

不得因 schema 中出現一個 mechanism 值，就自動產生公開頁面。

### 5.5 Feature

`CURRENT`

Feature 回答「遊戲具有哪些功能」，例如免費旋轉、Wild、Scatter、Multiplier、Hold & Spin、Cascading、Bonus Buy。

Feature 不等於賠付機制。Cascading 等概念可能同時被舊分類用於 subtype，未來應以用途區分：

- 用來描述遊戲核心類型或探索集合時，屬分類語境；
- 用來描述單款遊戲具備的功能時，屬 Feature 語境。

`NEXT`

Feature 可加入遊戲篩選，也可由教學明確關聯。

`DO_NOT_BUILD_YET`

Feature 目前只作結構化標籤與篩選，不得按每個值自動建立永久頁。

`IDEA`

若某 Feature 未來具有穩定搜尋需求、足夠遊戲及獨立解釋價值，可重新審查是否由「教學頁」或「集合頁」承接，但兩者不可同時競爭同一意圖。

### 5.6 教學

| 能力 | 狀態 | 規則 |
|---|---|---|
| 教學集合與永久頁 | `CURRENT` | 已有 guides collection 與 `/guide/{slug}/` |
| 解釋概念 | `CURRENT` | 文章主體負責說明資料、術語或玩法 |
| 明確關聯欄位 | `NEXT` | 預留 relatedGames、relatedProviders、relatedSeries、relatedMechanisms、relatedFeatures |
| 少量代表遊戲 | `NEXT` | 由明確關聯挑選，不由正文關鍵字自動猜測 |
| 導向完整探索結果 | `NEXT` | 使用受控的篩選狀態，不創造可索引組合頁 |
| 遊戲頁反向顯示教學 | `NEXT` | 關聯需能雙向解析並避免重複維護 |
| 關鍵字自動建立關係 | `DO_NOT_BUILD_YET` | 正文提到某詞不代表語意關係成立 |
| 大量模板化教學 | `DO_NOT_BUILD_YET` | 不為填 taxonomy 而建立薄內容 |

教學頁與集合頁的意圖分工：

- 「什麼是／怎麼運作／差異」由教學承接；
- 「有哪些遊戲／找遊戲／比較遊戲」由探索集合承接；
- 同一核心意圖不得同時由兩個永久頁競爭。

### 5.7 比較表

| 能力 | 狀態 | 規則 |
|---|---|---|
| 最多三款並排比較 | `CURRENT` | 使用結構化資料，缺值顯示為未知 |
| 分享所選遊戲 | `CURRENT` | query string 保存工具狀態 |
| 搜尋／篩選後加入比較 | `CURRENT` | 比較是探索流程的下游工具 |
| 比較結果大量索引 | `DO_NOT_BUILD_YET` | 任意遊戲組合不建立 SEO 落地頁 |
| 自動宣稱最佳遊戲 | `DO_NOT_BUILD_YET` | 高 RTP、高倍數或特定 Feature 不等於全面較優 |
| 儲存個人比較 | `IDEA` | 需有明確使用需求後再評估帳號或持久化 |

## 6. 永久網址與索引決策

| 頁面／狀態 | 網址角色 | 狀態 | 索引原則 |
|---|---|---|---|
| 單款遊戲 | 永久實體頁 | `CURRENT` | 依已核准 production 規則 |
| 廠商 | 永久實體頁 | `CURRENT` | 只為 published 記錄產生 |
| 教學 | 永久內容頁 | `CURRENT` | 只為 published 記錄產生 |
| 系列 | 條件式永久頁 | `FUTURE` | 通過系列門檻後才可建立 |
| 賠付機制 | 條件式永久入口 | `FUTURE` | 通過搜尋、資料量與內容門檻 |
| Feature | 篩選／標籤 | `DO_NOT_BUILD_YET` | 不自動建頁 |
| RTP、波動度、最高倍數、Bonus Buy、發行年份 | 篩選條件 | `CURRENT`／`NEXT` | 不為任意值或區間建頁 |
| 搜尋結果 | 工具頁 | `CURRENT` | 不大量索引 |
| 篩選組合 | 工具狀態 | `CURRENT`／`NEXT` | 不大量索引 |
| 比較結果 | 工具狀態 | `CURRENT` | 不大量索引 |

任何新的永久網址在加入 URL helper、route、canonical 或 sitemap 之前，都必須先完成獨立的搜尋意圖與薄頁風險審查。本文件不直接核准任何新 URL。

## 7. 教學與遊戲的關聯模型

### 7.1 預留欄位

以下只定義語意，不代表本輪修改 Schema：

| 關聯 | 狀態 | 目標 |
|---|---|---|
| `Guide.relatedGames` | `FUTURE` | 明確指定代表遊戲 |
| `Guide.relatedProviders` | `FUTURE` | 連接廠商背景或廠商教學 |
| `Guide.relatedSeries` | `FUTURE` | 連接系列脈絡 |
| `Guide.relatedMechanisms` | `FUTURE` | 連接教學所解釋的中獎機制 |
| `Guide.relatedFeatures` | `FUTURE` | 連接教學所解釋的功能 |
| Game 反向 Guide 關聯 | `FUTURE` | 由關聯解析產生，避免兩邊各自維護而失配 |

`DO_NOT_BUILD_YET`

- 不掃描正文關鍵字後自動寫入關聯；
- 不因 tags 文字相同就視為正式關聯；
- 不把所有符合條件的遊戲塞進教學頁；
- 不在關聯尚未驗證時輸出公開模組。

### 7.2 教學頁輸出原則

`NEXT`

通過核准後的教學頁可包含：

1. 概念解釋；
2. 2 至 6 款有代表性的遊戲；
3. 前往完整遊戲探索結果的入口；
4. 必要時連接廠商或系列頁。

代表遊戲數量不是固定 SEO 模板。應依主題與資料品質決定，沒有可靠代表遊戲時可以不顯示。

### 7.3 遊戲頁反向輸出

`NEXT`

遊戲頁可顯示少量真正相關的教學，例如某遊戲採用 Megaways 時連到 Megaways 概念教學。反向關聯應由 Guide 的明確關聯或未來中央關聯表解析，不在 Game 與 Guide 兩側重複手動維護兩份清單。

## 8. 防止薄頁、重複頁與意圖競爭

以下全部為 `CURRENT` 架構治理原則，並對未來新頁生效：

1. 不因出現一個 taxonomy 值就自動建頁。
2. 系列頁至少需要兩款已確認作品、明確來源與獨立內容價值。
3. Feature／機制頁需要搜尋需求、足夠遊戲及獨立解釋價值。
4. 同一搜尋意圖不能同時建立互相競爭的教學頁與集合頁。
5. 任意篩選組合只能作工具結果，不轉成大量 SEO 頁。
6. 缺值不得被轉成「無」、零或否定條件，避免錯誤集合頁。
7. 頁面數量不能由 taxonomy 值數量自動決定。
8. 新永久頁必須先定義 owner intent、資料門檻、內容門檻、canonical 與 sitemap 資格。

### 8.1 頁面資格檢查

`FUTURE`

系列、機制或其他 taxonomy 永久頁在建立前，至少回答：

- 使用者是否真的會獨立搜尋這個主題？
- 現有哪一頁應承接這個意圖？
- 有多少已發布且已驗證的遊戲？
- 是否能提供不只是遊戲卡清單的獨立內容？
- 與教學頁、Hub 或篩選結果是否重疊？
- 資料不足時，頁面是否應保持不存在？

`DO_NOT_BUILD_YET`

本文件不設定一個適用所有 taxonomy 的固定遊戲數門檻；除了系列頁的至少兩款基準外，其餘需依搜尋需求與內容價值共同判斷。

## 9. 未來 CMS 實體藍圖

以下實體全部標記為 `FUTURE`，整體 CMS、D1 與後台能力標記為 `DO_NOT_BUILD_YET`。

| 實體 | 長期責任 | 主要關聯 |
|---|---|---|
| Game | 遊戲核心資料與狀態 | Provider、Series、Mechanism、Feature、Guide、Source |
| Provider | 開發商、發行商、聚合商或平台 | Game、Guide、Source |
| Series | 系列識別、別名、作品順序與來源 | Game、Guide、Source |
| Mechanism | 中獎形成規則的標準概念 | Game、Guide、Source |
| Feature | 遊戲功能的標準概念 | Game、Guide、Source |
| Guide | 解釋型內容與明確關聯 | Game、Provider、Series、Mechanism、Feature |
| Source／Verification | 來源、核對日期、欄位可信度與變更紀錄 | 所有需查證實體 |

### 9.1 關聯方向

`FUTURE`

- Game 屬於一個主要 Provider，可視資料需要連接其他角色；
- Game 可屬於零或一個已確認 Series；
- Game 可有一個主要 Mechanism；
- Game 可有多個 Feature；
- Guide 可明確連接多個 Game、Provider、Series、Mechanism 或 Feature；
- Source／Verification 可支援實體級或欄位級核對，但粒度需另行設計。

### 9.2 本階段禁止事項

`DO_NOT_BUILD_YET`

- 不導入 D1、R2、CMS 或管理後台；
- 不把 Content Collections 搬入資料庫；
- 不建立 API、登入、權限或編輯工作流；
- 不新增 Series、Mechanism、Feature collection；
- 不修改現有 Game、Provider、Guide Schema；
- 不建立 migration；
- 不為未來實體提前建立空公開頁。

現有 Content Collections 仍是 `CURRENT` source of truth。未來若更換 repository，應維持正規化 mapping layer，使前端視圖不因儲存方式更換而全面重寫。

## 10. 下一批遊戲候選

| 項目 | 狀態 | 規則 |
|---|---|---|
| 18 款候選遊戲 | `IDEA` | `CANDIDATE－待驗證候選`，不是核准清單 |
| 分三批、每批 6 款驗證 | `IDEA` | 只描述可能的驗證節奏 |
| 建立遊戲資料 | `DO_NOT_BUILD_YET` | 本輪不得建立 |
| 發布候選遊戲頁 | `DO_NOT_BUILD_YET` | 未核准、未查證前不得發布 |
| 因候選名單擴張 taxonomy 頁 | `DO_NOT_BUILD_YET` | 候選數量不構成建頁理由 |

候選遊戲必須經過身份、廠商、正式名稱、來源、資料欄位、圖片權利與重複項目核對，並取得獨立核准後，才可進入建立或發布流程。

## 11. 與現有程式架構的相容性

### 11.1 已一致

`CURRENT`

- Game、Provider、Guide 已是獨立 Content Collections。
- 單款遊戲、廠商與教學已有永久路由。
- 搜尋已涵蓋遊戲、廠商與教學，並支援遊戲別名與系列名稱。
- Game Explorer 已區分搜尋與結構化篩選。
- Game 已有 seriesId、seriesNameZhHant、installment、relatedGames。
- Game 已區分 winMechanism 與 features。
- 比較表與搜尋頁已被定位為工具頁，且不進 sitemap。
- 只有 published 記錄生成公開內容頁；未知資料保持缺值。
- Content Collections 經 mapping layer 提供前端資料，與未來 repository 替換方向一致。

### 11.2 現況落差，不構成本輪修改理由

| 落差 | 狀態 | 說明 |
|---|---|---|
| Series 尚非獨立 collection | `FUTURE` | 目前使用 Game 內欄位，足以支援現階段同系列關係 |
| Guide 尚無明確 related 欄位 | `NEXT` | 現有只有 category 與 tags；不得用 tags 直接冒充正式關聯 |
| 遊戲頁尚未反向顯示教學 | `NEXT` | 需等明確關聯模型獲准 |
| Explorer 尚無 Feature／Mechanism 等完整篩選 | `NEXT` | 現有篩選可繼續使用，不需本輪擴張 |
| 篩選狀態尚無受控分享規格 | `NEXT` | 未來若加入 query state，仍不得自動索引 |
| Feature 與 subtype 有部分語意重疊 | `NEXT` | 例如 cascading；未來需依「分類」與「功能」用途治理 |
| Scatter Pays 尚未成為 winMechanism enum | `NEXT` | 現況由 legacy paylines 文字推導顯示；需另案決定是否正規化 |
| guides 與空的 guide 內容目錄並存 | `CURRENT` | 實際 collection 使用 `src/content/guides`；空目錄不影響本藍圖，但後續整理應避免誤用 |

### 11.3 可能風險

`NEXT`

1. 若未來同時把 subtype、Mechanism、Feature 都直接建成公開集合頁，會快速產生重複意圖與薄頁。
2. 若 Guide 關聯只靠 tags 或正文文字推斷，會出現錯誤推薦、失效反向連結與關聯漂移。
3. 若篩選 query URL 被 sitemap、canonical 或內部連結無限制擴散，會形成大量近似頁。
4. 若 Series 在沒有獨立來源與內容前自動建頁，名稱相似遊戲可能被錯誤合併。
5. 若 CMS 實體提前實作，會在關聯門檻尚未定案前固化錯誤資料模型。

## 12. 後續決策順序

| 順序 | 能力 | 狀態 |
|---|---|---|
| 1 | 確認教學與遊戲的明確關聯欄位及唯一維護方向 | `NEXT` |
| 2 | 定義受控的 Feature／Mechanism 篩選與分享狀態 | `NEXT` |
| 3 | 以實際內容量驗證系列頁資格 | `FUTURE` |
| 4 | 以搜尋需求判斷機制應由教學頁或集合頁承接 | `FUTURE` |
| 5 | 累積足夠資料後再設計 CMS 實體與 repository 介面 | `DO_NOT_BUILD_YET` |

任何一步進入實作前，都需要新的明確任務。本文件本身不授權程式、Schema、URL、索引、頁面或資料變更。
