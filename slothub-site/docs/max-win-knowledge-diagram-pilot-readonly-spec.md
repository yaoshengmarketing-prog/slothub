# Max Win Knowledge Diagram Pilot 只讀規格

> 文件狀態：`DRAFT FOR REVIEW`
>
> 規格日期：2026-08-30
>
> 實作狀態：尚未實作
>
> 適用文章：`slot-max-win-explained`

## 1. 規格目的與結論

本 Pilot 要協助讀者在看到 `10,000×`、`Max Win`、`Max Exposure`、`Winning Ratio` 或其他最高值描述時，先判斷數字的投注基準、適用範圍與成立條件，再決定它是否能與另一款遊戲直接比較。

這不是「最高倍數排行榜」，也不是遊戲結果預測。圖解不得把最高倍數解釋成中獎機率、一般可期待結果或玩家一定能取得的數值。

結論：**建議進入單篇本機 Pilot。** 現有正文與第一方來源已足以支持一個「判讀流程＋結果分支」圖解；未解決的來源差異本身正是圖解要教讀者辨識的情況，不構成實作阻礙。

## 2. 與既有規則的關係

本規格沿用 `guide-knowledge-diagram-usage-rules-v1.md`，不修改其結論：

- 圖解只在能降低理解成本時使用。
- 可見文案只放在 Guide Markdown，不在 CSS 或驗證程式保存第二份內容。
- 使用語意化 `figure`、`figcaption`、有序步驟與可讀的結果分支。
- 不依賴 JavaScript；CSS 停用時仍保留正確讀序。
- 沿用共用 Guide Knowledge Diagram 樣式，不建立 Max Win 專屬元件或 slug mapping。

Max Win 不適合 Bonus Buy 的單向三步流程，也不是 Cascading 的循環流程。它屬於**判讀流程後分流**：依序核對證據，再落入不同可比性結果。

## 3. 圖解要解決的核心問題

讀者看到一個很大的倍數時，常直接把它理解為「這款遊戲比較容易贏」或「兩款遊戲的數字可以直接比較」。現有文章已說明這兩種理解都不可靠，但資訊分散於投注基準、原廠標籤、整局與局部數值、多版本條件及案例之中。

圖解應讓讀者先完成四項核對：

1. 倍數以什麼為基準。
2. 數字描述整款遊戲上限，還是單一符號、Bonus 或 Feature 的局部上限。
3. 是否附帶版本、投注額度、市場或其他條件。
4. 原始標籤、單位、條件與第一方來源是否能一起確認。

完成核對後，圖解再呈現三種保守結果，而不是把所有數字硬分成「可用／不可用」兩類。

## 4. 建議圖解結構與文案草案

### 4.1 圖解標題與摘要

- 標題：`先判斷這個最高倍數能不能直接比較`
- 摘要：`依序核對投注基準、適用範圍與限制。數字較大，不代表較容易取得。`

### 4.2 有序判讀步驟

| 步驟 | 短標 | 建議可見文案 | 判讀目的 |
| --- | --- | --- | --- |
| 1 | 基準 | `這個 × 是乘以 total bet、original bet、line bet，還是其他單位？` | 防止把不同投注基準直接互換 |
| 2 | 範圍 | `它是整款遊戲的上限，還是單一符號、Bonus 或 Feature 的局部數值？` | 防止把局部上限當成整局 Max Win |
| 3 | 條件 | `是否限定特定版本、投注額度、市場或其他規則條件？` | 保留原廠明示條件，不自行補足缺值 |
| 4 | 證據 | `原始標籤、單位、條件與第一方來源能否一起確認？` | 判斷可比性，而非只看數字大小 |

步驟文案刻意不列遊戲名稱與精確倍數。案例、數值及來源由正文負責，避免圖解變成另一份文章摘要。

### 4.3 結果分支

圖解建議使用三個並列、語氣中立的結果：

1. **可作較高可比性的統一值**

   第一方來源確認它是整款遊戲上限，且投注基準與必要條件清楚。仍只能比較數值口徑，不能推論中獎機率或保證結果。

2. **可辨識，但比較時必須保留警告**

   原廠提供可辨識倍數，但標籤或投注基準未完整定義，例如 `Winning Ratio`。保留原始標籤與來源，不宣稱它和 `x total bet` 完全同質。

3. **不能進入統一比較**

   數字只屬於單一符號或 Feature、單位無法換算、條件互相衝突，或整局範圍無法確認。只保留原廠說明，不自行換算。

三個結果不得使用綠色成功、紅色失敗、獎盃、上升箭頭或其他價值暗示。它們描述的是證據與可比性層級，不是遊戲好壞。

## 5. 預計放置位置

建議放在文章開頭三段導言之後、第一個 H2「先回答最核心的問題：10,000× 到底乘以什麼？」之前。

理由：

- 第一段提出 `10,000×` 的投注基準問題。
- 第二段點出 `Max Win`、`Max Exposure`、`Winning Ratio` 不必然同義。
- 第三段先排除「最高倍數等於中獎機率」的誤解。
- 圖解接著提供全文的判讀框架，再由後續章節逐項解釋。

這是針對現有導言結構的內容位置判斷，不改寫導言，也不把「放在第一段後」寫成所有 Guide 的固定模板。

## 6. 圖解與正文的分工

### 圖解負責

- 提供四項依序核對的問題。
- 顯示三種可比性結果。
- 提醒數字大小不等於取得機率。
- 讓讀者回看個別資料時有一致的判讀順序。

### 正文繼續負責

- 解釋 total bet、original bet、line bet、coins 等單位差異。
- 解釋 Max Win、Theoretical／Advertised Max Win、Max Exposure 與 Winning Ratio 的語境。
- 呈現 Mahjong Ways、Storm of Seth 2、Bonanza、Starburst、Big Bass Bonanza、Legacy of Dead 等實際案例。
- 保存精確數值、成立條件、原廠標籤與第一方來源。
- 說明最高倍數、RTP 與波動度各自回答的問題。

### 避免重複的方法

- 圖解不列案例清單、來源 URL、精確倍數或長篇定義。
- 正文不需因圖解存在而刪減必要證據與例子。
- 圖解每一步只保留一個判讀問題；細節由緊接的正文展開。
- 驗證程式只檢查結構與可讀性，不保存文案副本。

## 7. 第一方來源與資料狀態

### 7.1 足以支撐圖解的第一方證據

| 語意 | 代表第一方來源 | 可支撐的判讀 |
| --- | --- | --- |
| Theoretical／Advertised Max Win 與 Max Exposure 分開 | PG SOFT Mahjong Ways、Mahjong Ways 2、Fortune Ox、Fortune Tiger Game Information PDF | 同一遊戲可能有不同標籤與數字；Max Exposure 的模擬語境不可泛化至所有廠商 |
| `x bet` 整局數值 | Big Time Gaming Bonanza 官方頁、NetEnt Starburst 官方頁 | 投注基準清楚時，可比性較高 |
| 原始標籤未完整定義 | ATG Storm of Seth 2 官方頁的 `Winning ratio x81000` | 可保留數字與標籤，但不能假設與 `x total bet` 同質 |
| 單一符號／Feature 數值 | Pragmatic Play Big Bass Bonanza 官方頁與 Client Hub | Money Symbol `up to 2,000×` 不能當整局最高倍數 |
| 單位與描述不一致 | Play’n GO Legacy of Dead 官方遊戲頁與 Dead Series 官方文章 | `coins` 與 `initial bet multiplier` 在缺少換算規則時不能直接統一 |

完整 URL 與逐款語境已保存在現有 `max-win-guide-v1-readonly-brief.md` 與 Guide 文末來源；Pilot 不需要新增精確遊戲規則。

### 7.2 已知資料缺口

- 30 款 published Game 中，25 款有 `maxWinMultiplier`，5 款留空：Big Bass Bonanza、Gates of Olympus、Jump High、Legacy of Dead、Reactoonz。
- 25 款有統一值的遊戲中，部分尚未保存 `maxWinLabelOriginal`；這些資料不能被圖解暗示為同等完整。
- Storm of Seth 2 的 `Winning Ratio` 投注基準未被官方頁完整定義。
- Legacy of Dead 的 `coins` 與 `initial bet multiplier` 缺少可確認換算關係。
- Big Bass Bonanza 的 `2,000×` 是 Money Symbol 上限，不是整局 Max Win。

這些缺口不阻擋圖解，因為「降低可比性」與「不能進入統一比較」正是圖解的正式結果。若實作時企圖替缺值補上條件，必須停止。

## 8. 版面預期

### 1440 × 900

- 四個判讀步驟可使用四欄或不超出內容寬度的緊湊網格。
- 三個結果分支置於判讀區下方，保持等權重，不以色彩暗示推薦。
- 圖解應完整落在文章閱讀欄內，不擴張 `.article-shell` 寬度。
- 正文第一個 H2 應緊接圖解後出現，避免圖解成為大型 Hero。

### 390 × 844

- 判讀步驟改為單欄，維持 1 → 4 的 DOM 與視覺順序。
- 三個結果依序堆疊，不縮成難以閱讀的多欄卡片。
- 中英文術語允許自然換行，不使用 `word-break: break-all`。
- 圖解容器不得造成頁面級水平溢位。

### 320 × 844

- 延續單欄，不縮小正文尺度來塞入內容。
- `Winning Ratio`、`original bet` 等英文片段不得被粗暴拆字。
- 長結果標題可換行，但不能裁切、重疊或產生只有標點的孤行。
- `document.documentElement.scrollWidth` 不得大於 viewport 寬度；若結果分支造成溢位，應在共用圖解排版內修正，而不是隱藏內容。

## 9. 無障礙與降級要求

### 無 JavaScript

- 所有圖解內容直接存在 Markdown 產生的 HTML 中。
- 不使用 JS 控制步驟、分支或可見性。

### CSS 停用與純文字

- 讀序必須是：圖解標題 → 摘要 → 步驟 1 至 4 → 三個結果。
- 流程關係由文字與清單結構表達，不依賴箭頭或背景色。
- 複製純文字後仍能辨識每個判讀步驟與結果。

### 螢幕閱讀器

- 使用 `figure` 與 `figcaption` 描述圖解目的。
- 判讀流程使用單一 `ol`。
- 結果分支使用有標題的清單，不以視覺位置代替語意。
- 裝飾性步驟數字或連接線若由 CSS 產生，不應形成重複朗讀。

### 列印

- 白底與黑白輸出仍能分辨步驟及結果。
- 不裁切分支文字；必要時允許整個圖解自然跨頁。
- 不依賴陰影或背景色維持結構。

### Forced Colors

- 邊界、焦點與分組在系統色下仍清楚。
- 三種結果不以顏色作唯一差異。
- 不使用會隱藏文字或清單標記的強制色覆寫。

## 10. 共用 CSS 沿用評估

現有共用樣式已有：

- `.guide-knowledge-diagram`
- `.guide-knowledge-diagram__steps`
- `.guide-knowledge-diagram__decision`
- `.guide-knowledge-diagram__branches`
- 手機單欄、Print 與 Forced Colors 規則

因此不需要新元件、Schema、Markdown plugin 或 content pipeline。實作時應優先沿用既有 steps、decision 與 branches 結構。

若視覺上需要區分「判讀流程」和既有直線／循環流程，可在 `global.css` 新增一個不含 Guide slug 的通用 modifier，例如 `guide-knowledge-diagram--decision`。只有在現有 CSS 無法同時滿足四步與三分支時才新增；不得建立 Max Win 專屬 class。

驗證程式需從目前的 sequence／cycle 擴充到 decision 類型，並以至少四步、三分支及額外 synthetic fixture 證明沒有寫死本篇數量或文案。

## 11. 預計實作檔案範圍

若人工核准進入 Pilot，預計只需：

- `src/content/guides/slot-max-win-explained.md`
- `scripts/verify-guide-diagrams.mjs`
- `src/styles/global.css`（只有既有共用樣式不足時才修改）

不應修改：

- Guide Schema、template、Markdown pipeline 或元件
- relationship resolver、Search、Explorer、Knowledge Map
- Game／Guide frontmatter 關聯
- 其他 Guide 正文或圖解
- SEO、robots、canonical、sitemap 或正式站設定

若實作需要超出上述範圍，應停止並回報。

## 12. Pilot 驗證計畫

### 結構與內容

- `figure`、`figcaption`、單一有序判讀清單與結果清單存在。
- 四個步驟和三個結果按正確 DOM 順序輸出。
- 圖解沒有遊戲清單、精確倍數或來源副本。
- 不出現中獎機率、保證取得、推薦或排行榜語意。
- `Winning Ratio`、局部 Feature 上限及資料不足各能落入適當結果。
- synthetic fixture 驗證不同步驟與分支數量，不寫死四步或三分支。

### 視覺與可及性

- 1440 × 900、390 × 844、320 × 844。
- 200% zoom 與頁面級水平溢位檢查。
- 無 JavaScript、CSS 停用、純文字讀序。
- 螢幕閱讀器語意抽查。
- Print preview 與 Windows Forced Colors 或等效驗證。
- 圖解後第一個 H2 與正文節奏正常。

### 回歸

- Bonus Buy 三步直線圖解不變。
- Cascading 四步循環與兩分支圖解不變。
- 其餘八篇沒有圖解的 Guide 不出現空容器或額外間距。
- `ASTRO_TELEMETRY_DISABLED=1`、`PUBLIC_SITE_ENV=preview` 下執行完整 `npm run verify`。
- Preview safeguards、內部連結與 Build 通過。

## 13. 過度設計與內容風險

- 把四個判讀問題擴張成案例資料表，會重複正文。
- 用綠／黃／紅表示三種結果，容易被解讀為遊戲好壞或推薦層級。
- 把 Max Exposure 固定定義成所有廠商通用術語，會超出 PG SOFT 文件語境。
- 把 `Winning Ratio` 自動等同 Max Win，會掩蓋原始標籤與投注基準缺口。
- 把 Feature 局部上限放入整局比較，會重現文章正在修正的誤讀。
- 為本篇建立專屬元件或第二份資料 mapping，會破壞現有共用圖解原則。

## 14. 最終建議

Max Win 值得作為第三個 Knowledge Diagram Pilot。它能驗證共用系統是否不只支援「流程如何發生」，也能支援「資料應如何判讀」；同時，現有第一方案例足以支撐圖解的保守分支。

建議下一步是人工審查本規格後，核准單篇本機 Pilot。Pilot 應維持文章內容的證據層級，不因圖解追求簡潔而消除原廠標籤、單位或條件差異。

## 15. 固定尾段

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_STATE: READONLY_SPEC_COMPLETE`

`DIAGRAM_TYPE: Decision flow with three evidence/comparability outcomes`

`SOURCE_STATUS: SUFFICIENT_FOR_PILOT；第一方證據足以支撐判讀框架，已知缺口由保守結果承接`

`CONTENT_BLOCKERS: NONE`

`DATA_BLOCKERS: NONE；不得為五款缺值或九款原始標籤缺口補猜測資料`

`FILES_CHANGED: docs/max-win-knowledge-diagram-pilot-readonly-spec.md`

`COMMIT_SHA: N/A；本規格依本輪限制暫不 Commit`

`NEXT_ALLOWED_ACTION: 人工審查 Max Win Knowledge Diagram Pilot 規格並決定是否核准本機實作`

`COMMIT_ALLOWED: NO`

`PUSH_ALLOWED: NO`

`DEPLOY_ALLOWED: NO`

`HUMAN_APPROVAL_REQUIRED: YES`
