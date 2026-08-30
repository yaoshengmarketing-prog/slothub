# Slot Hub Knowledge Diagram v1 只讀規格

> 文件狀態：`APPROVED v1`
> 任務性質：`READ-ONLY PRODUCT AND INTERFACE SPECIFICATION`
> 盤點日期：2026-08-30
> 程式基準：`786313a5cf72a58cb1fcd06889e8d652a1ac719d`
> 內容基準：11 篇 published Guide

## 0. 規格目的與權限邊界

本規格把已核准的 Guide 視覺方向落成可審查的內容模組原則：

- **Editorial Reading** 是所有 Guide 的固定閱讀骨架。
- **Knowledge Diagram** 是有明確教學價值時才出現的主要可選模組。
- **Game Context** 是文章中段、與具名案例直接相鄰的可選模組，不是固定首屏。

本輪只判斷哪些內容適合模組、內容資料應放在哪裡，以及未來最小實作和測試邊界。不得修改現有 Guide、Schema、template、CSS、圖片、relationship、Search、Explorer 或 SEO 輸出。

本規格不改動已通過的 Guide H1、description lead、「從這裡開始」、正文與關聯區版型；Knowledge Diagram 也不得重新把 Guide 首屏做成 Hero。

## 1. 判斷原則

### 1.1 Knowledge Diagram 的准入條件

只有至少符合一項，且圖解能比短段落更快說清關係時才適合：

1. 有三個以上依序發生的步驟。
2. 同一數值要經過「標籤、基準、範圍、判定」等多層檢查。
3. 兩個容易混淆的概念需要並列對照。
4. 一個狀態會分支成不同結果，且分支對正確理解重要。
5. 讀者若只掃標題或數字，容易得到與正文相反的結論。

不符合上述條件時，Editorial Reading、清楚的小標、列表或表格通常更適合。圖解不能只是品牌色卡片、裝飾圖示或正文摘句的重複排列。

### 1.2 Game Context 的准入條件

Game Context 只有在下列條件同時成立時才適合：

- 鄰近段落正在解釋 2～3 款具名遊戲的實際差異。
- repo 已有對應且來源可追溯的官方圖片。
- 圖片的工作是協助辨認案例，不是證明規則，也不是營造娛樂城遊戲大廳。
- 名稱、Provider、圖片與遊戲連結可由 published Game projection 推導，不手抄第二份資料。
- 不使用「推薦、熱門、最值得、較容易贏」等暗示。

若圖片只會重複遊戲名稱，或無法幫助讀者理解鄰近案例，應維持純文字。

## 2. 現有 11 篇 Guide 盤點與分類

分類中的「主要處理」是 v1 的產品判定；「可選次要模組」不是實作授權。

| Guide | 現況 | 主要處理 | 可選次要模組 | 判定理由 |
| --- | --- | --- | --- | --- |
| `fishing-games-basics` | 289 字元、2 個 H2；目前無 published 捕魚機資料可承接 | Editorial Reading | 無 | 內容仍是概覽，沒有足夠步驟或真實案例資料；先補內容與遊戲資料，比加入空泛圖解重要。 |
| `rtp-explained` | 107 字元；只說明長期理論比例與多版本 | Knowledge Diagram，但延後內容補強後實作 | 無 | 「大量長期結果」與「單次結果」的差異高度適合視覺對照；現有正文太短，不能讓圖解成為比文章本身更完整的第二篇內容。 |
| `slot-beginners-guide` | 121 字元；提供 RTP、波動度、盤面與 Feature 的入門順序 | Editorial Reading | 無 | 可畫成閱讀路線，但目前會與既有專題 Guide／Knowledge Map 重複；沒有必要再做一張功能導航圖。 |
| `slot-bonus-buy-explained` | 完整長文、9 個 H2、具明確入口／結果邊界 | **Knowledge Diagram 第一個完整案例** | Game Context 可在多價格案例段落另案評估 | `Cost → Entry → Outcome` 是真實順序，能直接阻止「買 Bonus 等於買結果」的誤讀；資料與來源厚度足以支撐。 |
| `slot-cascading-tumble-avalanche-explained` | 完整長文、10 個 H2、4 步驟已有正文依據 | Knowledge Diagram | Game Context 可在補位方向案例段落另案評估 | `得獎 → 清除 → 補入 → 再判定` 是明確流程；圖解能表達循環，但必須保留停止條件與不同廠商差異。 |
| `slot-max-win-explained` | 完整長文、11 個 H2、標籤與單位差異多 | Knowledge Diagram | 無 | 適合「原廠標籤 → 投注基準 → 整局／局部範圍 → 能否統一」判讀流程；遊戲封面不能協助理解單位，Game Context 價值低。 |
| `slot-multiplier-explained` | 完整長文、9 個 H2；一般、Wild、累積、Sticky／Locked、Bonus 分層 | Knowledge Diagram 候選，非首批 | Game Context 不建議 | 可用「基準／範圍／持續時間／算法」四問圖解，但與 Max Win、Cascading 的視覺語言容易重複；應先驗證第一批模組再決定。 |
| `slot-payout-mechanisms-explained` | 完整長文、5 種 Mechanism 比較 | Knowledge Diagram 候選，非首批 | Game Context 可在單一比較段落選擇性使用 | 五種機制適合空間關係示意，但不是單一路徑；若硬畫成五步會誤導。需另設「比較型」而非沿用 Bonus Buy 三步模板。 |
| `slot-symbols-and-features` | 完整長文；Wild、Scatter、Free Spins、Jackpot 四類 | Knowledge Diagram 候選，非首批 | Game Context 可在特殊 Wild／Free Spins 案例段落另案評估 | 四個概念適合角色對照，但不能畫成先後流程；官方封面只負責辨認案例，不能替代 symbol／Paytable 證據。 |
| `slot-terms-glossary` | 285 字元、4 個快速定義 | Editorial Reading | 無 | 使用者意圖是快速查詞；圖解會增加掃讀成本，也會和各專題 Guide 競爭內容責任。 |
| `volatility-explained` | 102 字元；只有相對分類與非預測提醒 | Knowledge Diagram 候選，但延後內容補強 | 無 | 結果分布與起伏可視覺化，但現有文章與可核對定義不足；不能用幾條裝飾曲線假裝成通用機率模型。 |

### 2.1 分類統計

- 第一批具備直接實作條件：1 篇（Bonus Buy）。
- 流程清楚、可在第一批驗證後優先接續：1 篇（Cascading）。
- 適合圖解但需另一種圖型或先補內容：6 篇（RTP、Max Win、Multiplier、Payout Mechanisms、Symbols／Features、Volatility）。
- 目前只需 Editorial Reading：3 篇（Fishing Basics、Beginners Guide、Terms Glossary）。
- Game Context 只具文章中段候選價值：Bonus Buy、Cascading、Payout Mechanisms、Symbols／Features；本規格不核准任何一篇實作。

> 上述 6 篇「適合但延後」包含不同問題類型，不能因數量相同就套用同一三步模板。

## 3. 第一個完整案例：Bonus Buy

### 3.1 教學任務

圖解只回答一件事：**Bonus Buy 買的是進入 Feature 的入口，不是固定獎項或獲利結果。**

建議三個依序步驟：

| 步驟 | 顯示標籤 | 必須表達 | 不得暗示 |
| --- | --- | --- | --- |
| 1 | `COST／成本` | 依個別規則支付指定成本；需核對 `stake`、`bet amount`、`player's bet`、`your bet` 等原廠基準 | 所有價格都以同一投注基準計算 |
| 2 | `ENTRY／入口` | 直接進入規則指定的 Feature／Bonus；實際進入內容與市場可用性逐款核對 | 所有遊戲都進入相同 Free Spins，或所有版本都有入口 |
| 3 | `OUTCOME／結果` | 結果仍由該 Feature 的正式規則決定 | 保證回收、獲利、指定獎項或較高勝率 |

### 3.2 位置

- 放在文章首段已先說明「買入口，不是買結果」之後、第一個 H2 之前。
- 不放在 H1／description lead 與「從這裡開始」之間，避免把正文推遲並把圖解誤作 Hero。
- 圖解前後不再新增一段重複正文；它是同一內容來源中的掃讀摘要。

### 3.3 內容邊界

- 不在圖解列出遊戲價格排行榜。
- 不放 Bonanza、Gates 等遊戲封面；案例圖片屬另一個可選模組。
- 不新增文章沒有核對過的數值、版本或市場結論。
- `Cost → Entry → Outcome` 只屬 Bonus Buy 的內容結構，不升格成所有 Guide 的固定視覺模板。

## 4. 其他三個核心案例評估

### 4.1 Cascading：循環流程型

建議語意：

```text
得獎成立 → 清除得獎符號 → 補入新符號 → 再次判定
                                              ├─ 再次得獎：回到清除
                                              └─ 未得獎／符合停止條件：結束
```

規則：

- 使用 `<ol>` 表達四個順序步驟，另用可讀文字表達「繼續／停止」分支。
- 箭頭與循環線只能是裝飾；沒有 CSS 時，清單仍須表達完整順序。
- 不把 Tumble、Avalanche、Reaction 描述成完全相同公式。
- 不把 Multiplier 放進必然流程，也不把「再次判定」寫成免費增加一次付費旋轉。

適合成為第二個實作案例，但應在 Bonus Buy 模組完成手機、無 JavaScript 與螢幕閱讀器驗證後另行核准。

### 4.2 Max Win：判讀流程型

建議語意：

```text
原廠原始標籤
      ↓
投注／數值基準是否清楚？
      ↓
描述整局上限，還是單一符號／Feature／Bonus 局部上限？
      ↓
可作統一比較值／只保留原始標籤與來源
```

- 這不是遊戲結果流程，而是資料判讀流程；視覺上不得使用與 Bonus Buy 完全相同的「三張步驟卡」。
- 結果狀態至少要分成「可比性較高」與「僅保留原始說明」，不能把未知顯示成錯誤或 0。
- `Winning Ratio`、`Max Exposure`、coins、單一 Money Symbol 等差異必須保留正文語境，圖解不能把它們合併成同義詞。
- Game Context 不建議；封面只能辨認遊戲，無法證明數值單位。

### 4.3 RTP：尺度對照型

建議語意：

```text
大量、長期結果 ──用於理解──> 理論回報比例
單次遊戲結果   ──不能推導──> 必須接近 RTP
```

- 圖解應對照「資料尺度」，不是以大量金幣、上升圖或贏分動畫暗示回報。
- 不用幾個假造 spin 結果演算 RTP，也不顯示未經來源核對的樣本數。
- 多版本 RTP 可作第二層註記：「同款可能有多個官方設定，需分開保存」。
- 現有正文只有兩段；應先在獨立內容任務補足來源、版本與誤讀邊界，再建立圖解，避免圖解變成第二份較完整正文。

## 5. Knowledge Diagram 資料保存方案比較

### 5.1 方案 A：Markdown 內直接撰寫語意化 HTML

示意 contract：

```html
<figure class="guide-knowledge-diagram guide-knowledge-diagram--sequence" aria-labelledby="bonus-buy-diagram-title">
  <figcaption id="bonus-buy-diagram-title">
    <strong>Bonus Buy 買的是入口，不是結果</strong>
    <span>依規則閱讀成本、入口與結果</span>
  </figcaption>
  <ol class="guide-knowledge-diagram__steps">
    <li><span lang="en">COST</span><strong>依規則支付指定成本</strong><p>核對原廠使用的投注基準。</p></li>
    <li><span lang="en">ENTRY</span><strong>進入指定 Feature</strong><p>入口與起始條件依個別規則。</p></li>
    <li><span lang="en">OUTCOME</span><strong>結果由功能規則決定</strong><p>不保證回收、獲利或指定獎項。</p></li>
  </ol>
</figure>
```

優點：

- 圖解文字與文章放在同一 Markdown，沒有第二份正文或 slug mapping。
- 能放在正確段落位置，不需要 template 依 slug 插入。
- 靜態 HTML 天然支援無 JavaScript、列印與純文字讀序。
- 不修改 Guide Schema。

限制：

- 作者需遵守固定 HTML contract；Markdown 原始碼較長。
- 應以小型驗證程式檢查必要的 `figure`、`figcaption`、唯一 id、合法清單結構與空內容，避免只靠人工。
- v1 只定義語意骨架，不允許在每篇自行創造互不相容的 class。

### 5.2 方案 B：Guide frontmatter 結構化資料

可能欄位包含 `title`、`kind`、`steps`、`note` 與 placement。

優點：結構可驗證，generic component 容易重用。

缺點：

- 需要 Schema change。
- 現行 `.md` 由 `<Content />` 一次輸出；frontmatter 無法自然插入首段與第一個 H2 之間，除非擴大 content pipeline 或限制所有圖解固定位置。
- placement anchor 容易與 H2 改名耦合；把圖解文字放在 frontmatter 也會使文章閱讀與編輯上下文分離。

### 5.3 方案 C：獨立 diagram catalog

優點：可集中管理視覺類型與資料。

缺點：

- 形成 Guide slug → diagram 的第二份 mapping。
- 圖解文字與正文分離，改文時容易失去同步。
- 刪除／改名 Guide 需要額外 registry 治理。
- 目前只有一個正式 pilot，治理成本顯著高於內容量。

判定：不採用 v1。

### 5.4 方案 D：文章內簡短 directive／自訂元件語法

例如 Markdown directive 或 MDX component，內容仍靠近正文，呈現由共用 component 負責。

優點：作者體驗可能優於 raw HTML，也可做結構驗證。

缺點：目前使用 `.md` 而非 MDX，導入 directive parser／remark plugin 會擴大內容工具鏈；第一個案例沒有足夠理由承擔這項複雜度。

判定：可在多種圖型、至少數篇正式案例後重新評估，不是 v1 最小方案。

### 5.5 推薦資料模型

第一版採 **方案 A：Guide Markdown 內的語意化 HTML＋共用 Guide-only CSS**。

這不是在每篇複製視覺元件：

- 文章只擁有自身圖解文字與順序。
- class contract 與呈現樣式只有一份。
- template 不按 slug 硬編內容。
- taxonomy、relationship 與 Game 資料不參與推測圖解。
- 沒有 `<figure>` 就完全不渲染，無需空狀態或 fallback。

## 6. Schema 評估

### 6.1 Knowledge Diagram v1

`SCHEMA_CHANGE_NEEDED: NO`。

Bonus Buy pilot 使用文章內語意化 HTML 即可完成。第一個案例不足以證明需要新增通用 `knowledgeDiagram` Schema，也不能先假設所有未來圖解都是 steps array。

若未來出現下列情況，再另案評估 optional Schema／directive：

- 至少三種穩定圖型與多篇正式內容都使用相同欄位。
- 需要非技術作者在後台編輯。
- 圖解需在 Guide 以外的入口重用。
- raw HTML 驗證與維護成本已高於結構化欄位。

### 6.2 Game Context

Game Context 不應手抄名稱、Provider 與圖片。未來較安全的模型是 Guide 只宣告一組 game slugs 與該案例帶的內容目的，顯示資料由 published Game projection 推導。

建議資料形狀（僅供未來審查，不是本輪 Schema 提案）：

```yaml
gameContexts:
  - id: multiple-bonus-buy-options
    afterHeading: 一個價格與多個價格方案
    gameSlugs: [fish-tales-double-catch-max-scatter, greedy-for-gold-hold-and-win]
    purpose: 辨認文章正在比較的兩個具名案例
```

風險：`afterHeading` 會與文章標題改名耦合，且目前 template 無插入點。因此 Game Context 應保持 deferred；正式實作前需另行審查 Schema、placement 與完整性驗證，不得以手寫 HTML 複製 Game card 資料作捷徑。

## 7. 呈現與響應式規格

### 7.1 視覺角色

- 延續 Slot Hub 深藍、淺底與螢光綠，但色彩只用來區分層級與流程，不表示「較好、較高機率、成功」。
- 圖解應像資料雜誌的註解板，而不是娛樂城 Banner、Bonus 購買按鈕或遊戲促銷卡。
- 一個模組只保留一個主要視覺記憶點，例如清楚的流程連接；其餘邊框、陰影與圖示應克制。
- 不使用金幣爆炸、彩金、煙火、上升箭頭或綠色成功狀態暗示結果。

### 7.2 桌機

- 模組留在 880px article shell 內，不突破正文與 Guide 關聯區邊界。
- 三步 sequence 可使用 3 欄；四步流程可使用 4 欄或 2×2，但 DOM 讀序必須仍是 1→4。
- 標題與說明在圖解中只出現一次；卡片內文字以 2～3 行短句為目標。
- 不以固定高度對齊造成大量空白。

### 7.3 390px 與 320px

- sequence 改為單欄垂直讀序；不得將三張卡壓縮成難讀的小字橫排。
- 320px 內所有模組元素必須 `min-width: 0`，長英文使用自然換行，不得 `word-break: break-all`。
- 連接線與箭頭不得增加 document width；`scrollWidth` 必須等於 `clientWidth`。
- 內距、間距與標籤可縮小，但主要文字不低於現行正文可讀尺度。
- 圖解加入後，首段仍先出現；模組不能把第一段推到比 Editorial Reading 現況更晚。

### 7.4 長中文與中英混排

- `Bonus Buy`、`Max Exposure`、`Winning Ratio` 等原廠詞彙可換行但不逐字拆開。
- 中文採 strict line breaking，避免只有標點或單一中文字的尾行。
- 英文 utility label 以 `lang="en"` 標示；不得把英文縮到只剩裝飾效果。
- label、heading、body 各自只有一個語意角色，避免同一句在卡片內重複三次。

## 8. 無 JavaScript、可及性、Print 與純文字

### 8.1 無 JavaScript

- 核心圖解必須是 build-time 靜態 HTML。
- 不使用 canvas、由 JavaScript 產生的 SVG、carousel、tooltip 或必須點擊才顯示的內容。
- 若未來加入非必要動畫，必須尊重 `prefers-reduced-motion`；v1 不需要動畫。

### 8.2 鍵盤

- Knowledge Diagram 本身不是互動控制，不應加入 `tabindex`。
- 若內容包含連結，使用原生 `<a>` 並維持清楚 `focus-visible`；整張卡不得偽裝成按鈕。
- 不以 hover 才顯示必要說明。

### 8.3 螢幕閱讀器

- 外層使用 `<figure>`；`figcaption` 是可理解且唯一的名稱來源。
- 流程使用 `<ol>`，比較使用 `<dl>` 或有正確表頭的 `<table>`；不得用一排 `<div>` 假裝順序。
- 裝飾線、箭頭與序號背景不應成為重複朗讀內容。
- `aria-label` 不得複製完整可見標題，避免同一句讀兩次。

### 8.4 Print 與純文字降級

- Print 移除背景與非必要陰影，保留邊框、標題、步驟順序與所有文字。
- 優先 `break-inside: avoid`，但內容過長時允許正常分頁，不能截斷。
- 直接複製頁面純文字時，應得到「圖解標題 → 步驟 1／2／3 → 說明」的合理順序。
- CSS 未載入時，figure、figcaption 與 ordered list 仍能閱讀。

## 9. Game Context 資料與位置規格

本章只定義未來邊界，不核准實作或圖片變更。

- 位置：文章中段，緊接具名案例段落或比較小節；不得位於 H1、lead、第一段之前。
- 數量：每組 2～3 款，避免變成遊戲庫縮影。
- 資料：只存 game slug 與該組案例的內容目的；名稱、繁中名稱、Provider、圖片與 URL 均由 published Game projection 取得。
- 圖片：只使用現有 Game `image` 與來源紀錄；不下載、裁切或改圖。
- 語意：使用 `<aside>` 或 `<figure>` 並有清楚 heading／caption；圖片 alt 依鄰近文字目的決定，不能重複念完整卡片文字。
- 顯示：名稱、Provider、連向 Game detail；不顯示排行、評分、RTP 高低色彩或「立即遊玩」。
- 去重：它不取代 Guide 頁底的 derived related games；同一頁若兩者同時存在，需在視覺與文字上分清「本文案例」與「依關聯衍生的遊戲」。
- 缺圖／draft／不存在 slug：完整性驗證應失敗或省略該卡，不能以第三方圖片或字母 placeholder 偽裝正式案例模組。

## 10. 可納入 Guide Content Skill 的判斷規則

以下可在未來經人工核准後加入 Skill，作為 Brief／Draft 的固定檢查，不代表本輪修改 Skill：

1. Brief 必須回答「這張圖比一段短文多解決什麼理解問題？」答不出即不建立。
2. 先判斷語意類型：順序、循環、比較、分支或資料尺度；不得預設三步驟。
3. 圖解只能重述已核對內容，不得新增無來源精確數值或跨廠商通用公式。
4. 圖解文字與正文共用同一 Guide 內容責任，不建立 slug registry 或 component 內文。
5. 每篇 Guide 可沒有圖解；沒有圖解是正常狀態，不得作驗證失敗。
6. Game Context 只有在具名案例、現有官方圖片與推導資料都成立時才可提出。
7. Published 模擬需在 1440×900、390×844、320×844、無 JavaScript與 Print 預覽中驗證。

以下仍必須人工內容／視覺審查，不能自動化：

- 流程壓縮是否改變原始規則或製造錯誤因果。
- 顏色、箭頭、位置是否暗示成功、獲利或推薦。
- 中文與中英混排在真實畫面是否自然。
- 圖解是否真的比正文更快理解，而非重複或裝飾。
- Game Context 圖片是否與鄰近案例真正相關，且不呈現遊戲大廳感。
- 320px 的文字密度、首屏節奏與 Print 分頁是否可接受。

## 11. 第一個最小實作範圍

### 11.1 建議 Pilot

第一個實作只包含 **`slot-bonus-buy-explained` 一篇 Knowledge Diagram**：

- 在首段後加入 `Cost → Entry → Outcome` 語意化 figure。
- 新增一組共用 Guide-only diagram CSS；class 名稱不得含 Bonus Buy slug。
- 新增小型驗證，檢查 figure／figcaption／ordered list、唯一 id、無空步驟與 Preview 輸出。
- 以 synthetic fixture 驗證 step 數量不是寫死 3，避免下一篇 Cascading 必須重寫元件邏輯。
- 不加入 Game Context。
- 不修改 template、Schema、relationship、H1、Guide index 或其他 10 篇文章。

Pilot 通過人工視覺與可及性審查後，下一個獨立候選才是 Cascading 四步循環。Max Win、RTP、Multiplier、Payout Mechanisms、Symbols／Features 與 Volatility 均需各自的內容或圖型決策，不能隨 Pilot 一次套用。

### 11.2 預計可修改檔案（未授權）

未來若人工核准 Bonus Buy Pilot，最小範圍預計為：

- `src/content/guides/slot-bonus-buy-explained.md`
- `src/styles/global.css`
- 一支既有或新增的最小 Guide diagram 驗證程式
- `package.json` 僅在需要把驗證接入現有 `npm run verify` 時修改

預計不需要修改 `src/pages/guide/[slug].astro` 或 `src/content.config.ts`。若實作發現必須修改 template、Schema、Markdown pipeline 或引入 plugin，應停止並回到產品／架構審查。

## 12. 測試計畫

### 12.1 結構與內容

- Bonus Buy 圖解只有一個 figcaption、三個依序步驟，所有可見文字均存在於 Guide Markdown。
- 圖解核心語意與正文一致，不新增價格、RTP、勝率或市場結論。
- 沒有圖解的其他 10 篇 Guide 不產生空容器、fallback 或額外間距。
- relationship owner、Game → Guide、Search、Explorer、Knowledge Map 與 Guide related games 完全不變。

### 12.2 視覺矩陣

- Bonus Buy：1440×900、390×844、320×844，截取 H1、lead、首段、完整圖解與下一個 H2。
- Cascading、Max Win、RTP：確認未套用圖解且版型完全不變。
- 11 篇 published Guide：無新增整頁水平溢位。
- 320px：三個步驟垂直排列、英文標籤完整、沒有孤字／標點行、touch／scroll 不受影響。
- 不改變已核准 H1 computed style、Header、正文、表格與關聯 CTA。

### 12.3 可及性與降級

- 關閉 JavaScript 後內容、順序與樣式仍可讀。
- Accessibility tree 呈現 figure 名稱與 3-item ordered list，沒有重複標題。
- Tab 順序不因非互動圖解增加焦點。
- 200% zoom、320px、Windows High Contrast／forced colors 不遺失必要文字。
- Print preview／PDF 保留標題、順序與內容，不出現深色大面積背景或裁切。
- CSS 停用／純文字複製仍保留正確讀序。

### 12.4 技術回歸

- `git diff --check`。
- Preview 環境完整 `npm run verify`。
- Astro Check、Static Build、內部連結與 Preview safeguards。
- `document.documentElement.scrollWidth <= clientWidth`，圖解任何子元素不得成為 overflow source。
- HTML `noindex,nofollow`、HTTP `X-Robots-Tag`、空 sitemap 與無 canonical 維持原政策。

## 13. 重複內容與過度設計風險

| 風險 | 控制方式 |
| --- | --- |
| 圖解逐字重複正文 | 只做掃讀摘要；正文保存完整條件與來源，圖解不再新增同義段落。 |
| 每篇硬套三步 | 先判斷 sequence／cycle／comparison／decision／scale；不適合就不顯示。 |
| component 內硬編文案 | 所有可見內容留在 Guide Markdown；CSS／template 只負責呈現。 |
| 建立 diagram catalog | v1 禁止；避免第二份 slug mapping 與內容責任。 |
| 圖解比文章更完整 | 內容不足的 RTP／Volatility 先補文，不能由圖解偷渡新結論。 |
| 視覺暗示成功或獲利 | 顏色不代表好壞；禁止金幣、彩金、向上成長與成功狀態語彙。 |
| 手機資訊密度過高 | 320／390 改單欄；每步短句；完整細節留正文。 |
| Raw HTML 維護困難 | 固定一份 class／semantic contract並接入小型驗證；樣本增加後才評估 directive。 |
| Game Context 變遊戲大廳 | 中段、2～3 款、資料推導、無排行／CTA；本輪保持 deferred。 |
| 模組侵入既有排版 | Guide-only CSS；不得改 H1、正文 scale、Game detail 或其他頁面。 |

## 14. 本輪檔案與停止點

- `FILES_ALLOWED_TO_CHANGE: docs/guide-knowledge-diagram-v1-readonly-spec.md`
- `FILES_CHANGED: docs/guide-knowledge-diagram-v1-readonly-spec.md`
- `COMMIT_SHA: N/A`
- `.prototype/` 與 `guide-typography-review/` 維持既有未追蹤狀態，不納入本規格或後續 Commit。

### 14.1 Decision Log

- 2026-08-30：人工核准 Knowledge Diagram v1 採用 Guide Markdown 內語意化 HTML＋單一共用 Guide-only CSS。
- 2026-08-30：第一批只核准 `slot-bonus-buy-explained`，圖解語意為 `Cost → Entry → Outcome`；不實作 Game Context，不套用其餘 10 篇 Guide。
- 2026-08-30：Pilot 必須以四步以上 synthetic fixture 證明樣式與驗證沒有寫死三步，並完成桌機、390px、320px、200% zoom、無 JavaScript、無 CSS／純文字、Print 與 forced-colors 審查。

## 15. 固定尾段

- `STAGE_RESULT: PASS_TO_NEXT_STAGE`
- `CURRENT_STATE: KNOWLEDGE_DIAGRAM_SPEC_APPROVED`
- `REPRESENTATIVE_CASE: Bonus Buy；Cost → Entry → Outcome，買入口而非買結果`
- `GUIDE_CLASSIFICATION: 1 篇可直接 pilot；1 篇次順位；6 篇適合但需另一圖型或先補內容；3 篇維持 Editorial Reading`
- `RECOMMENDED_DATA_MODEL: Guide Markdown 內語意化 HTML＋單一共用 Guide-only CSS contract`
- `FIRST_IMPLEMENTATION_SCOPE: 只實作 Bonus Buy Knowledge Diagram；不含 Game Context，不套用其餘 10 篇`
- `SCHEMA_CHANGE_NEEDED: NO；Game Context 與更高階結構化 authoring 另案審查`
- `CONTENT_DUPLICATION_RISK: MEDIUM；以同一 Markdown 內容責任、禁止 catalog／component 文案及摘要不新增事實控制`
- `OVERDESIGN_RISK: MEDIUM；以准入條件、可省略、非三步模板與單篇 pilot 控制`
- `BLOCKERS: NONE`
- `GIT_STATUS: tracked tree clean；既有 .prototype/ 與 guide-typography-review/ 仍未追蹤，本輪另新增此規格檔`
- `NEXT_ALLOWED_ACTION: 建立獨立規格 Commit，接著實作 Bonus Buy 單篇 Pilot`
- `COMMIT_ALLOWED: YES；限規格 Commit 與核准的 Bonus Buy Pilot Commit`
- `PUSH_ALLOWED: NO`
- `DEPLOY_ALLOWED: NO`
- `HUMAN_APPROVAL_REQUIRED: YES`
