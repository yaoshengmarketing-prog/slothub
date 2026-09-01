# Slot Hub Compare 資料判讀 v2 只讀規格

文件狀態：`APPROVED FOR LOCAL IMPLEMENTATION`

盤點日期：2026-09-01

目前產品依據：`docs/slot-hub-master-blueprint-v2.md`

目前工作項目：第 4 項「Compare 資料判讀 v2」第 4-2 步。

> 第 4-1 步規格已通過人工審查；第 4-2 步只授權依本文件核准範圍進行本機施工、測試與建立本機 Commit，不授權 Push、部署、Schema、taxonomy 或 Game data 變更。

## 1. 白話摘要

目前 Compare 已經能可靠保存最多三款遊戲、分享 URL、恢復 Back／Forward、同步 Header 數量，並把 9 類資料並排。但「有值」不等於「可直接拿來比高低」：

- RTP 是長期理論比例，10 款遊戲另有多版本；現在只顯示主要值與「多版本」標記，未顯示版本清單。
- 波動度同時存在原廠文字、數字量表、品牌詞彙及 Slot Hub 統一層；現在只顯示統一值，會讓 `LOW-MED` 等有原文但未統一的遊戲看起來像完全沒有資料。
- 25 款有統一最高倍數，但原始標籤只有 16 款；`Winning ratio`、`original bet`、`Max Exposure` 及整局／局部上限不能只看數字大小。
- `winCount` 在 Paylines、Ways、Megaways 及其他機制中不是同一單位；現在同列顯示「條／路」已比裸數字安全，但仍缺少機制語境。
- 除 Bonus Buy 外，多數缺值現在都只顯示 `—`，使用者無法知道是尚未核實、原廠未公開，還是欄位不適用。

Compare v2 應保留現有三款狀態契約，把畫面改為「身份與資料狀態 → 核心數據 → 玩法結構 → 功能與來源」四段。每個容易誤解的欄位要在欄名附近提供短判讀說明；原廠值與 Slot Hub 統一值並列；缺值只使用目前證據能支持的文字，不建立分數、總排名或「哪款最好贏」結論。

## 2. 已固定的 Compare 狀態契約

第 2 項已完成的契約是本規格的既有基礎，不重新設計：

1. 最多選擇三款 published Games。
2. `/compare/?games=slug-a,slug-b,slug-c` 是正式分享狀態。
3. Compare URL 有 `games` 時優先於 `localStorage`；沒有時才讀取既有儲存選擇。
4. 選取、移除及清空是離散操作，更新 canonical URL 並同步 `localStorage` 與 Header 數量。
5. Reload、Back／Forward 依 URL 恢復畫面，並將正規化後結果同步回儲存狀態。
6. 未知 slug、重複 slug 及第四款以後的 slug 會安全忽略。
7. Compare query 維持工具狀態及 `noindex`，不建立 SEO 集合頁。

現行責任位置：

| 責任 | 現行 owner |
| --- | --- |
| URL parse、正規化及 serializer | `src/lib/core-flow-state.mjs` |
| Compare 選取、history、localStorage 及表格 | `src/components/CompareWorkspace.tsx` |
| Published Game 投影 | `src/lib/game-catalog.ts` |
| Header 數量與 Compare URL | `src/components/SiteHeader.astro` |
| 頁面與 Preview robots | `src/pages/compare/index.astro` |

## 3. 現行介面與資料投影

### 3.1 現行畫面

Compare 頁目前包含：

1. 頁首標題與「最多三款／分享 URL」說明。
2. 加入遊戲的下拉選單。
3. 一個可水平及垂直捲動的 `div` grid。
4. 遊戲圖片、中文／原文名稱、系列及移除按鈕。
5. 9 個資料列：廠商、主要 RTP、統一波動度、最高倍數、賠付機制、軸數 × 列數、賠線／Ways 數量、Bonus Buy、核心 Features。
6. 捲動後出現的 sticky 遊戲身份列。
7. 清除全部操作。

### 3.2 現行投影缺口

`GameCatalogItem` 現在足以支援 Search、Explorer 與 Compare 基礎，但 Compare v2 所需的下列現有 Game 欄位尚未投影：

- `maxWinLabelOriginal`
- `gameId`
- `jackpotType`
- `sources`
- `lastVerifiedAt`
- 完整來源連結及核對日期

已投影但沒有完整呈現的欄位包括：

- `rtpVariants`：只顯示「多版本」，不顯示實際版本值。
- `volatilityOriginal`：投影存在，但 Compare 未顯示。
- `releaseDate`：投影存在，但 Compare 未顯示。
- `paylines`：只在 helper fallback 或其他頁使用，Compare 主要顯示 `winCount`。
- `bonusFeatures`：投影存在，但 Compare 不顯示。

本規格不要求新增 Schema；第 4-2 步若獲核准，可擴充同一 published Game catalog projection，不能建立第二份 Compare-only Game facts mapping。

## 4. 30 款 published Game 欄位覆蓋

### 4.1 Coverage

| 欄位 | 有值 | 缺值 | 覆蓋率 | 影響 Compare 的重點 |
| --- | ---: | ---: | ---: | --- |
| Provider | 30 | 0 | 100% | 身份完整，不代表優劣 |
| Series ID | 15 | 15 | 50% | 有正式系列才能顯示；缺值不等於沒有關聯 |
| Series 顯示名稱 | 12 | 18 | 40% | 現行 identity 可能只有 installment 或無系列文字 |
| Release date | 17 | 13 | 56.7% | 日期可直接閱讀，但不能解讀成品質 |
| Game ID | 9 | 21 | 30% | 格式由 Provider 定義，只作身份核對 |
| 主要 RTP | 17 | 13 | 56.7% | 不能把缺值當 0；需搭配版本與來源 |
| RTP variants | 10 | 20 | 33.3% | 10 款有 2～7 個值；不能只顯示「多版本」後仍把主要值當唯一版本 |
| Volatility 原始值 | 20 | 10 | 66.7% | 包含文字、1～5量表、數字及品牌語彙 |
| Volatility 統一值 | 17 | 13 | 56.7% | Slot Hub 編輯層，不是產業共同尺度 |
| Max Win 統一倍數 | 25 | 5 | 83.3% | 基準、範圍及條件並非全部同質 |
| Max Win 原始標籤 | 16 | 14 | 53.3% | 只有 16 款可直接在 Compare 顯示完整原廠語境 |
| Win Mechanism | 30 | 0 | 100% | 類別可安全並排；`other` 不可硬翻成已知機制 |
| winCount | 18 | 12 | 60% | 「條、路、最多 Ways」不可混為同一單位 |
| paylines 原始說明 | 24 | 6 | 80% | 自由文字可保留語意，不能做跨機制數字排名 |
| reels | 27 | 3 | 90% | 23 款為簡單 `NxM`，4 款為動態／不規則描述，3 款缺值 |
| rows | 23 | 7 | 76.7% | 不能和描述型 reels 強制拼成固定盤面 |
| 固定／動態盤面 | 0 個獨立欄位 | 30 | 0% | 目前只能從原文辨識，不能建立全量正式分類 |
| Features | 30 | 0 | 100% | 每款有結構化標記；標記數量不是品質或中獎機率 |
| Bonus Buy boolean | 13 | 17 | 43.3% | 12 true、1 false、17 undefined，三種狀態必須分開 |
| Bonus Buy Feature | 12 | 18 | 40% | 12 款已標記；不能因有 Bonus／Free Spins 自動補入 |
| Jackpot Feature | 1 | 29 | 3.3% | 只有 Storm of Seth 2 標記；不是完整 jackpot 類型資料 |
| jackpotType | 0 | 30 | 0% | v2 不應建立 Jackpot 類型比較列 |
| Sources | 30 | 0 | 100% | 每款有 1～5 筆來源 |
| lastVerifiedAt | 30 | 0 | 100% | 全部為 2026-08-28 或 2026-08-29，可安全呈現 |
| updatedAt | 30 | 0 | 100% | 內容更新日期，不等同每個欄位的第一方發布日期 |

### 4.2 會影響判讀的具體案例

#### Mahjong Ways／Mahjong Ways 2

- 兩款都有 7 個 RTP values；現行畫面只顯示主要值與「多版本」。
- Mahjong Ways 2 同時保存 advertised/theoretical `100,000x` 與十億次模擬語境下的 `Max Exposure 1,708x`；單顯示 `100,000×` 容易讓人以為所有最高倍數欄位完全同質。
- 兩款都是 Ways to Win，但 `1,024 ways` 與 `2,000 ways` 只能說明組合數，不代表後者比較容易得獎。

#### Super Ace

- 原廠波動度有 `LOW-MED`，但沒有 Slot Hub 統一值；現行 Compare 顯示 `—`，遮蔽了「有原文、未強制統一」的狀態。
- 有 `MAX WIN: 10000x` 及 `1,024 ways`，可呈現原文，但不能因數字相同就推導與其他 Provider 完全同質。

#### Storm of Seth 2: Awakening

- 原始最高倍數標籤是 `Winning ratio`，目前統一欄顯示 `81,000×`；必須保留原標籤及可比性警告，不能自動解讀成 `x total bet`。
- `winMechanism: other` 與原始 `paylines: Ways to Win` 並存，顯示 taxonomy 尚未足以把原廠描述轉成一般機制。
- 有 Jackpot Feature，但 30 款都沒有 `jackpotType`；不能藉此比較 fixed／progressive 等類型。

#### Sweet Bonanza

- `21,175x original bet` 有明確原始基準；與只寫 `Max Win` 或 `Winning ratio` 的欄位不能省略基準直接排名。
- 缺少主要 RTP 且 `bonusBuy` 未填，不代表 RTP 為 0 或不支援購買功能。

#### Bonanza

- 盤面為 6 軸、每軸 2～7 個符號並含額外 carts，不適合壓成固定 `reels × rows`。
- `up to 117,649 ways` 是動態上限；缺少 `winCount` 不等於沒有 Ways。

#### Gates of Olympus

- 有原始波動度 `highly volatile`，但沒有統一值；現行 Compare 顯示 `—`。
- 缺少 RTP、Max Win 及 Bonus Buy boolean 時都只能說「尚未核實」，不能從同系列或 Feature 推導。

#### Starburst

- `bonusBuy: false` 是目前唯一明確 false，可與 12 個 true 及 17 個 undefined 驗證三態顯示。
- 波動度同時保存 `3.1` 與歷史低波動文字，說明原文不應被壓成跨廠商精確刻度。

#### Reactoonz

- Cluster Pays、7×7及 Features 已確認，但缺少 RTP、統一波動度、Max Win、winCount 及 Bonus Buy boolean。
- 這種頁面應呈現已有結構，不得因多個核心數據缺值而看起來像全部為 0。

## 5. 比較安全分級

分級描述的是「如何呈現」，不是建立資料品質分數。

| 欄位 | 分級 | 理由與可能誤解 | 建議顯示 | 缺值文字 | 來源／日期 |
| --- | --- | --- | --- | --- | --- |
| Provider | C 身份或描述 | 可辨識開發商，不能代表數學品質 | 名稱並連到 Provider | `尚未核實`，但目前 30/30 有值 | 不必逐格列來源；保留 Game來源入口 |
| Series | C | 正式系列可辨識關係，不代表玩法或品質相同 | 有值才顯示名稱與代數 | `未建立正式系列資料`，不寫「無系列」 | 建議連 Game detail |
| Release date | A 可直接比較 | 日期單位一致；只能比較時間先後 | ISO 日期或在地化日期 | `尚未核實` | 顯示最後核對日期即可 |
| Game ID | C | Provider 格式不同，不是可排序品質 | 原廠 ID 原文 | `尚未核實` | 需要來源入口 |
| RTP | B 可比但須說明 | 長期理論比例，不是 Session 或下一次結果；版本可能不同 | 主要值＋版本狀態＋短警告 | `尚未核實` | 必須能到來源與核對日期 |
| RTP variants | B | 值可並列，但市場、版本與目前可用性未必相同 | 展示完整列表，明示「版本值」而非範圍 | `未取得多版本資料`，不代表只有一版 | 必須顯示來源／日期入口 |
| Volatility 原始值 | D 不正規化 | 文字、1～5、數字與品牌詞彙不是共同尺度 | 原文保留，不提供跨廠商排序 | `尚未取得原廠標示` | 必須與來源同頁可追溯 |
| Volatility 統一值 | B | 可作低／中／高編輯層，但不是產業共同標準 | 與原廠值上下並列，標示「Slot Hub 統一顯示」 | `尚未建立統一值` | 顯示核對日期；需有方法說明入口 |
| Max Win 統一倍數 | B；部分個案為 D | 需確認投注基準、整局／局部範圍及條件；數字高不代表較常出現 | 統一值＋原標籤＋可比性文字 | `尚未核實統一最高倍數` | 必須顯示來源／日期入口 |
| Max Win 原始標籤 | C／D | 用來理解基準與語境，不可直接排名 | 原文小字保留 | `未取得原廠標籤` | 必須可追溯 |
| Win Mechanism | A；類別比較 | taxonomy 值可安全比較是否相同，但沒有高低關係 | 中文名稱；`other` 顯示「其他／待保留原文」 | `尚未核實`，目前 30/30 有值 | 建議連 Mechanism Guide |
| winCount | B | 必須依 Mechanism 解讀條、路或動態上限 | 與 Mechanism 同區並用單位顯示 | `未以單一固定數量表示` 只在原始資料支持時使用，否則 `尚未核實` | 建議來源入口 |
| paylines 原文 | D 不正規化 | 自由文字含固定線、Ways、動態及特殊規則 | 作補充原文，不建立數字排名 | `尚未取得原廠說明` | 需要來源 |
| reels／rows | B 或 D | 固定數字可並排；動態／不規則盤面只能讀原文 | 固定盤面格式化；描述型盤面保留原文 | `尚未核實` | 建議來源入口 |
| 固定／動態盤面 | D（目前） | 沒有獨立結構欄位，不能由字串全量猜分類 | 本輪不新增統一 badge | N/A | 未來資料決策前不顯示 |
| Features | B | 可比較已確認功能交集；數量不代表品質或勝率 | 顯示有來源的 tags，可突出共同項但不計分 | `尚未核實功能清單`，不寫「無功能」 | 建議來源入口 |
| Bonus Buy | A（三態）／B（規則） | true／false／undefined 可分；成本、入口與市場仍需另讀 | `已確認支援`／`已確認不支援`／`尚未核實` | 明確三態 | 支援與不支援都需要來源入口 |
| Jackpot Feature | C | 只說已確認有 Feature，不等於已知 Jackpot 類型 | 保留於 Features | 未標記不代表沒有 | 建議來源入口 |
| jackpotType | D | 0/30 有值，沒有比較基礎 | v2 不建立獨立列 | 不顯示 | N/A |
| Sources | C | 協助查證，不是來源數量競賽 | 每款顯示「查看來源」到 Game detail | 目前 30/30 有來源 | 必須保留 |
| lastVerifiedAt | A | 日期定義一致，可直接告知資料新鮮度 | 每款顯示最後核對日期 | `尚未記錄核對日期`，目前無此案例 | 必須保留 |

### 5.1 A 類不等於可以排名

Release date、Mechanism、明確 Bonus Buy 狀態與核對日期可以直接看差異，但不能被轉成總分。Provider、Series、Game ID 即使完整，也只負責辨識。

### 5.2 D 類可以保留原文，不等於刪除資料

「不應比較或不應正規化」的欄位仍可顯示原廠原文及來源。禁止的是把不同定義壓成同一精確尺度，而不是隱藏有用資訊。

## 6. 七個重點判讀問題

### 6.1 RTP

1. 顯示「理論 RTP；不代表單次或短期結果」的常駐短說明。
2. 有 `rtpVariants` 時顯示所有已核實值；主要值須標明「主要顯示值」，不能暗示唯一版本。
3. 不同市場／版本／設定若缺少相同條件，允許並排但不能給「較高＝較容易贏」結論。
4. 缺值顯示 `尚未核實`，不顯示 0%，不從 variants 或同系列補猜主要值。

### 6.2 波動度

1. 原廠值與 Slot Hub 統一值必須同時出現；任一層缺值都要各自說明。
2. `4/5`、`5/5`、`3.1`、`LOW-MED`、`Advanced`、`Very High` 只在各自原廠語境內理解。
3. 統一值只能顯示低／中／高等編輯層，不提供跨廠商精確分數或比例換算。
4. 高波動不代表容易中大獎，低波動不代表穩定回本。

### 6.3 最高倍數

1. 統一倍數必須與 `maxWinLabelOriginal` 一起顯示；沒有原標籤時標示比較限制。
2. `Winning ratio` 不自動視為 `x total bet`；`original bet`、`x bet` 及其他基準保留原文。
3. 單一符號、Bonus 或 Feature 上限不能進入整局 Max Win 比較。
4. 數字較高不代表較常出現、較容易取得或較值得玩。

### 6.4 賠付機制與 winCount

1. Mechanism 是類別，不是高低排名。
2. `10 條賠線`、`1,024 路`、`最多 117,649 Ways` 只在其機制內解讀。
3. Megaways 的最大 Ways 不能當成每次固定 Ways。
4. Cluster Pays、Pay Anywhere 或 `other` 缺少單一 `winCount` 時，不顯示 0。

### 6.5 Bonus Buy

1. `bonusBuy: true` 顯示「已確認支援」。
2. `bonusBuy: false` 顯示「已確認不支援」。
3. `undefined` 顯示「尚未核實」，不能根據 Free Spins、Bonus Feature 或同系列推論。
4. 是否支援不能替代成本、投注基準、入口及市場版本說明。

### 6.6 盤面

1. `5x3` 等固定盤面可格式化成 `5 × 3`。
2. Bonanza、Fortune Ox、Gates of Olympus、Mahjong Ways 2 等描述型盤面保留原文。
3. 不把描述型 reels 與獨立 rows 強制拼成虛假固定尺寸。
4. 目前不從字串建立「固定／動態」全量分類。

### 6.7 Features

1. 顯示已確認的功能清單或共同功能，不顯示功能數總分。
2. Wild／Scatter 可以幫助辨識符號角色，但在空間不足時優先級低於 Cascading、Bonus Buy、Hold & Spin 等辨識度較高 Feature。
3. Feature 多寡不代表較容易得獎或玩法品質較高。
4. 未列出的 Feature 不自動解讀為不存在。

## 7. 缺值語言契約

現行通用 `—` 不足以承擔資料語意。建議 v2 使用以下有限詞彙：

| 顯示文字 | 使用條件 | 不得用於 |
| --- | --- | --- |
| `尚未核實` | 欄位缺值，且目前資料無法分辨未公開、未取得或尚未安全統一 | 不得替換成 0、沒有或不支援 |
| `未取得原廠標示` | 原始 label／文字確實缺少 | 不代表沒有該數學特性 |
| `尚未建立統一值` | 有原廠資料，但 Slot Hub 未安全映射 | 不得讓使用者以為完全沒資料 |
| `已確認不支援` | 結構化 boolean 明確為 false，且資料紀錄有來源 | 不可由 Feature 缺席推導 |
| `不適用` | 欄位在該 Mechanism 或資料定義下確實不成立，且有明確規則 | 不可作一般缺值 fallback |
| `未公開` | 第一方來源明確表示未公開，或另有可追溯狀態資料 | 目前 Schema 沒有通用證據時不得自行使用 |

第 4-2 步不得只依 `undefined` 自動區分「未公開」與「尚未取得」。在沒有新 Schema 授權的前提下，安全預設是 `尚未核實`。

## 8. Compare v2 資訊架構候選

### 8.1 方案 A：保留單一矩陣，只擴充資料列

優點：施工最小、使用方式熟悉。缺點：加入原始值、variants、來源與說明後，手機表格會明顯變長，資料層次仍混在一起。

### 8.2 方案 B：分區矩陣＋常駐短說明（已核准）

保留橫向比較的優點，但將資料分成：

1. **遊戲身份**：圖片、名稱、Provider、Series、Release date；Game ID 不進入主要比較矩陣。
2. **核心數據**：RTP／variants、原廠與統一波動度、Max Win／原始標籤。
3. **玩法結構**：Mechanism、winCount／paylines 原文、reels／rows。
4. **功能與可信度**：Bonus Buy 三態、主要 Features、來源入口、最後核對日期。

每個高風險欄位在 row header 下放一行常駐短說明；較長方法內容連到既有 Guide。分區標題使用語意化 heading 或 row group，不能只是視覺分隔。桌機仍可橫向掃描；手機維持第一欄 sticky 與表格內水平捲動。

優點：最符合一般使用者「先辨認、再讀數據、再看玩法、最後查來源」的順序。缺點：需要重新整理資料列與語意結構，測試量高於方案 A。

### 8.3 方案 C：每款遊戲改成獨立直式資料卡

優點：手機單欄容易閱讀。缺點：失去逐欄橫向比較，三款資料需反覆上下尋找；不符合 Compare 核心任務。第一版不建議。

## 9. 推薦 v2 畫面契約

### 9.1 頁面摘要

頁首使用固定閱讀提醒，不計算「贏家」、完整度分數、資料總分或其他動態勝負摘要。提醒只說明：

- 最多三款。
- 比較表只呈現已核實資料。
- RTP、波動度與 Max Win 回答不同問題，不能合成勝率或優劣排名。

### 9.2 欄位說明

推薦「短說明常駐、完整說明連 Guide」：

- 欄名下最多一至兩行「怎麼看」。
- 不使用 hover-only tooltip；鍵盤、觸控及無 JavaScript 都必須能讀。
- 若手機高度需要收斂，可使用原生 `<details>`，但欄位的核心警告仍須常駐，不能全部藏起來。

### 9.3 原廠值與統一值

- 波動度使用「原廠標示」與「Slot Hub 統一顯示」兩層。
- Max Win 使用「統一值」與「原廠標籤／基準」兩層。
- RTP 使用「主要顯示值」與「其他已核實版本」兩層。
- 統一值不得取代或隱藏原文。

### 9.4 來源與核對日期

- 每款在「功能與可信度」區顯示最後核對日期，標籤固定為「這款資料最後核對日期」；不得暗示每個欄位都在該日由原廠重新發布。
- 提供「查看完整資料與來源」連到既有 Game detail；不得為精確 anchor 擴張修改 Game detail，也不把 1～5 個外部 URL 全塞入比較表。
- 不比較來源數量，也不把日期轉成品質分數。

### 9.5 現有資料列處理

| 現有列 | v2 決定建議 |
| --- | --- |
| 廠商 | 保留，移入「遊戲身份」 |
| 主要 RTP | 擴充為主要值＋variants＋短警告 |
| 統一波動度 | 擴充為原廠值＋統一值，不再只顯示單一層 |
| 最高倍數 | 擴充為統一值＋原始標籤／基準＋警告 |
| 賠付機制 | 保留，移入「玩法結構」 |
| 軸數 × 列數 | 調整為「盤面」；固定值格式化，描述型保留原文 |
| 賠線／Ways 數量 | 與 Mechanism 相鄰；保留條／路／原文差異 |
| Bonus Buy | 保留並改成明確三態 |
| 核心 Features | 保留現有核心清單；桌機與手機顯示相同資料，不擴充成全部 Features，也不建立功能分數 |

新增現有資料已支援的 Release date、完整 RTP variants、原廠波動度、Max Win 原始標籤、Game detail 來源入口及最後核對日期；Game ID 不進主要矩陣，也不新增 jackpotType 列。

## 10. 手機與無障礙盤點

### 10.1 實測 viewport

使用三款 `mahjong-ways,super-ace,big-bass-bonanza`：

| Viewport | 頁面 client／scroll width | Compare client／scroll width | 表格欄位 | 結果 |
| --- | --- | --- | --- | --- |
| 1440×900 | 1425／1425 | 1183／1183 | 150px＋3×344.4px | 無頁面級水平溢位；桌機三款不需水平捲動 |
| 390×844 | 375／375 | 358／599 | 104px＋3×165px | 頁面無溢位；水平捲動限制在 Compare 容器 |
| 320×844 | 305／305 | 288／599 | 104px＋3×165px | 頁面無溢位；水平捲動限制在 Compare 容器 |

現有手機策略可保留：104px sticky label、165px 遊戲欄、表格內水平／垂直捲動及 sticky identity bar。v2 增加說明後必須重新驗證長原文、RTP variants 及三款長標題，避免每格變成過度狹長段落。

### 10.2 鍵盤與 focus

- Compare scroll 容器有 `tabIndex=0` 及「可上下及左右捲動」的 aria-label，可由鍵盤取得焦點。
- 全站 `:focus-visible` 有 3px outline。
- select、Game detail links、移除及清除按鈕都可聚焦。
- 第 4-2 步需實測方向鍵／Shift+滾輪或平台等效水平操作，並確認 sticky 第一欄不遮住聚焦內容。

### 10.3 表格語意

目前矩陣使用 `div` grid，沒有 `<table>`、`th scope`、row／column header 關係；scroll 容器只有整體 aria-label。視覺上像表格，但螢幕閱讀器無法穩定把每個值與遊戲、欄位名稱關聯。

推薦第 4-2 步採真正 `<table>`、`caption`、`thead`、`tbody`、`th scope="col"`、`th scope="row"`；若技術限制必須維持 grid，需提供經實測的等效 ARIA table／row／cell semantics。sticky bar 是視覺副本，不應讓螢幕閱讀器重複讀取身份內容。

### 10.4 無 JavaScript

目前 `CompareWorkspace` 使用 `client:only="react"`。關閉 JavaScript 後只剩頁首說明；選擇器、表格、已選遊戲、來源與空狀態全部不存在，Header 數量回到 0。

由於網站是靜態輸出，無 JavaScript 時不能在建置階段解讀任意 `games=` query。第 4-2 步核准加入靜態可讀的 fallback，清楚告知工具需要 JavaScript，並提供前往 `/games/` 的一般連結；不建立第二套 Compare owner、伺服器渲染策略或任意 query 靜態解讀。

### 10.5 forced colors 與長文字

Compare 沒有專用 forced-colors 規則；目前依全站 focus outline 與系統顏色降級。第 4-2 步需檢查深藍表頭、sticky 邊界、Feature tags、狀態文字及 warning 不得只靠顏色區分。長中文、`Max Exposure (1 billion simulations)`、多 RTP 列表及 Game ID 必須允許換行，不得推寬頁面。

## 11. 建議第 4-2 步施工範圍

第 4-2 步已核准方案 B，最小候選檔案：

- `src/lib/game-catalog.ts`：只擴充既有 published Game projection，加入現有 Schema 已有的原始標籤及核對日期；來源只投影既有 Game detail URL，不將完整 sources 陣列送入 Compare。
- `src/components/CompareWorkspace.tsx`：分區、資料層次、缺值語言、來源入口及語意表格。
- `src/styles/global.css`：Compare-only 分區、警告、手機、sticky 及 accessibility 樣式。
- `src/pages/compare/index.astro`：只有靜態摘要或 no-JS fallback 確實需要時才修改。
- `scripts/test-core-flow.mjs`：既有 URL／history 契約回歸。
- 一支既有或新增的 Compare data interpretation 驗證程式。
- `package.json`：只有接入既有 `npm run verify` 必要時才修改。
- `docs/slot-hub-work-roadmap.md`：施工進度，不與產品程式混淆。

不預期修改：

- `src/content.config.ts`
- `src/content/games/*.md`
- taxonomy、relationship、Search、Explorer、Game detail、Provider、Guide
- URL schema、Compare 三款狀態契約
- Preview SEO、正式網域、Wix、DNS、301 或 migration

若施工需要新增資料狀態欄位、修改 Schema 或把 `undefined` 拆成「未公開／未知／不適用」，必須停止並取得獨立人工核准。

## 12. 驗收計畫

### 12.1 資料與判讀

- 30 款 published Games 全量 projection。
- Coverage 數量維持本規格基線，除非另有核准資料修正。
- RTP 17、RTP variants 10、原始波動度 20、統一波動度 17、Max Win 25、原始 Max Win label 16。
- Bonus Buy 12 true、1 false、17 undefined 三態正確。
- Sources 30/30、lastVerifiedAt 30/30。
- Super Ace 顯示 `LOW-MED` 原文及「尚未建立統一值」。
- Storm of Seth 2 保留 `Winning ratio`，不標成 `x total bet`。
- Mahjong Ways 2 同時保留 advertised/theoretical 與 Max Exposure 語境。
- Bonanza 動態盤面不被格式化成固定 rows。
- 缺值不顯示 0、不自動顯示「無／不支援／未公開」。
- 不建立總分、贏家、功能數排名、勝率或投注建議。

### 12.2 UI 與 accessibility

- 0／1／2／3 款狀態。
- 1440×900、390×844、320×844 無頁面級水平溢位。
- Compare 容器可獨立橫向捲動，sticky 欄與長文字不重疊。
- 鍵盤可到達 select、scroll region、遊戲連結、移除及清除操作。
- focus-visible、44px touch target、200% reflow、forced colors。
- 每個資料值能由螢幕閱讀器辨識對應遊戲與欄位。
- sticky identity 副本不造成重複朗讀。
- 無 JavaScript fallback 符合人工核准的降級層級。
- console、hydration、runtime errors 為 0。

### 12.3 回歸

- Compare URL／localStorage／Header／history 契約完全不變。
- 未知、重複、超過三款及空 query 正規化不變。
- Search、Explorer、Game detail、similar play、Guide relationship 無退化。
- 166 筆 Game → Guide relationship 不變。
- 30/30 data audit、Astro Check、Static Build、internal links 及 Preview safeguards 通過。
- HTML noindex、HTTP X-Robots-Tag、空 sitemap、無 canonical 維持。
- `git diff --check` 通過。

## 13. 已核准產品決定

1. 採用「四分區矩陣＋常駐短說明」方案 B。
2. 新增 Release date、完整 RTP variants、原廠波動度、Max Win 原始標籤、Game detail 來源入口及最後核對日期；Game ID 不進主要比較矩陣。
3. Features 保留現有核心清單，桌機與手機顯示相同資料，不擴充成全部 Features，也不以數量計分。
4. 核心警告常駐；版本清單與次要補充可使用原生 `<details>`。
5. 無 JavaScript 只提供清楚 fallback 與遊戲庫一般連結，不建立第二套 Compare owner。
6. div grid 改成真正的 semantic table。
7. `未公開` 禁止由 `undefined` 自動產生；沒有明確證據時使用 `尚未核實`。

三項施工小邊界：

- `lastVerifiedAt` 是「這款資料最後核對日期」，不代表每個欄位都在該日由原廠重新發布。
- 來源入口連到既有 Game detail，不為精確 anchor 修改 Game detail。
- 頁首只使用固定閱讀提醒，不建立「誰領先」或動態勝負摘要。

## 14. 明確不包含

- 修改 Compare 的三款上限、URL、localStorage、Header 或 history 契約。
- 新增總分、加權分、贏家、推薦、勝率或「最值得玩」。
- 補猜 RTP、波動度、Max Win、Bonus Buy、盤面或 Jackpot。
- 把不同 Provider 尺度轉成虛假精確數字。
- 修改 Schema、taxonomy、relationship 或 Game content。
- AI 推薦、個人化下注建議、投注策略、CPA 或立即遊玩 CTA。
- 修改 Search、Explorer、Game detail、Provider、Guide 或 Knowledge Map。
- Wix、migration、舊站、301、GSC、DNS 或正式索引設定。
- 超出本文件核准邊界的施工、Push 或部署。

## 15. 第 4-2 步驗證與檔案邊界

- 只允許核准的 Compare projection、元件、Compare-only 樣式、fallback、驗證腳本及 `npm run verify` 接線。
- Schema、Game data、taxonomy、relationship、Game detail、Search、Explorer、Provider、Guide 與 Knowledge Map 修改數必須為 0。
- 規格與 Implementation 必須使用獨立 Commit。
- 既有 untracked prototype、review 與 audit 文件保持未納入。
- 完整 Preview `npm run verify`、資料審計、Compare／core flow、Astro Check、Static Build、internal links、Preview safeguards、三種 viewport、無 JavaScript、鍵盤、200% reflow、forced colors 及 `git diff --check` 的結果記錄於完成回報。

## 16. 文件出口

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_ITEM: 第4項 Compare 資料判讀 v2`

`CURRENT_STEP: 第4-2步 本機施工`

`CURRENT_STATE: APPROVED_FOR_LOCAL_IMPLEMENTATION`

`WEBSITE_CHANGED: NOT_YET`

`GAME_COUNT: 30 published Games`

`DIRECT_COMPARE_FIELDS: Release date、Win Mechanism、明確 Bonus Buy 三態、lastVerifiedAt；只比較差異，不轉成優劣排名`

`CONTEXT_REQUIRED_FIELDS: RTP／variants、原廠與統一波動度、Max Win／原始標籤、winCount、盤面、Features`

`NON_RANKABLE_FIELDS: Provider、Series、Game ID、原廠波動度尺度、paylines 原文、Feature 數量、來源數量、Jackpot 類型`

`NEXT_ALLOWED_ACTION: 依核准規格完成第4-2步本機施工、驗證與獨立Implementation Commit`

`COMMIT_ALLOWED: YES；限規格Commit與Implementation Commit`

`PUSH_ALLOWED: NO`

`DEPLOY_ALLOWED: NO`

`HUMAN_APPROVAL_REQUIRED: YES；本機實作完成後人工審查`
