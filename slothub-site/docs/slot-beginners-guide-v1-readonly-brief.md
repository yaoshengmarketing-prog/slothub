# Slot Beginners Guide v1 只讀內容 Brief

> 文件狀態：`DRAFT FOR REVIEW`
> 工作流狀態：`READONLY_BRIEF_COMPLETE`
> 盤點日期：2026-08-31
> 程式基準：`262575d9587730d989882b86724501f0497075c4`
> 目標 Guide：`slot-beginners-guide`

## 1. 結論摘要

`slot-beginners-guide` 應維持同一個永久網址與「老虎機新手入門：先看懂遊戲資料」定位，但正文需要由薄頁補強為 **Slot Hub 的閱讀入口與判讀順序指南**。

它不應成為第二篇 RTP、波動度、最高倍數或賠付機制教學。最有價值的責任是：帶第一次進站的使用者由「確認是哪款遊戲」開始，依序閱讀核心數據、完整資料、功能、來源與核對日期，再知道何時前往專門 Guide、Explorer 或 Compare。

本次盤點支持以下產品決策：

- 保留原 slug、title、category、level、published 狀態與首頁新手 CTA。
- 不新增 `relatedMechanisms`、`relatedFeatures` 或 `relatedDataTopics`。
- 不讓這篇 broad onboarding Guide 取代任何專門 Guide owner，也不建立 Game → Beginners Guide 反向關聯。
- 以文字、編號閱讀順序、最多兩個小型對照表與站內連結完成；不加入 Knowledge Diagram。
- 內容補強後不需要修改首頁、Search、Game detail、Knowledge Map、resolver 或測試邏輯。

## 2. 現況與薄頁程度

現行 Guide 只有 frontmatter、兩個短段落，約 85 個非空白中文字；沒有 H2、表格、條列、站內連結、具名案例或來源說明。

目前已正確說明兩件事：

1. 第一次看資料可先看 Provider、遊戲類型、RTP、波動度、盤面與 Bonus features。
2. RTP 不代表單次結果，波動度也不能預測下一次結果。

但它尚未完成首頁 CTA 所承諾的「新手開始了解」。真正影響首次使用者理解的缺口包括：

- 不知道先確認遊戲名稱、繁中名稱、原文名稱、Provider 與系列，容易把名稱相似的遊戲當成同一款。
- 不知道「核心數據」與「完整遊戲資料」各自負責什麼。
- 沒有說明 RTP 多版本、原廠波動度與 Slot Hub 統一波動度的不同責任。
- 沒有分清最高倍數、主要賠付機制、Feature 與 Bonus Buy。
- 沒有說明缺值是「目前未取得足夠資料」，不是 0、沒有或不支援。
- 沒有教使用者讀來源、版本、原始標籤、最後核對日期與圖片來源。
- 沒有交代 Search、Explorer、Game detail 與 Compare 的實際使用順序。
- 沒有把讀者導向十篇已存在的專門 Guide，導致現有知識體系沒有形成入口。

因此，這不是單純增加字數的任務，而是補上產品導覽層。若維持現況，使用者會從首頁進入一篇只重述兩個名詞的薄頁，之後仍不知道如何使用 Slot Hub。

## 3. 使用者任務與 Guide 的唯一責任

### 3.1 使用者從首頁進來時要完成的任務

讀完本篇後，使用者應能：

1. 確認自己查看的是正確遊戲與 Provider。
2. 依固定順序閱讀 RTP、波動度、最高倍數與主要賠付機制。
3. 把 Symbols、Features、Bonus Buy 與主要賠付機制分開。
4. 理解原廠原文、Slot Hub 編輯統一值與可比較數字不是同一層資料。
5. 遇到缺值時保持未知，不自行補猜。
6. 查看來源、版本與最後核對日期，再決定數字能否比較。
7. 使用 Search 找名稱、Explorer 套條件、Game detail 查證、Compare 並排比較。
8. 在需要深入定義時前往對應的專門 Guide。

### 3.2 唯一責任

本篇是「**如何閱讀 Slot Hub 的入口指南**」，不是「完整老虎機百科」。它負責建立順序、資料層次與下一步，而非重寫每個概念的完整規則。

這個定位也符合首頁文案「找到遊戲，再看懂它」：新手 Guide 應解釋如何由找到一款遊戲，走到看懂資料與比較差異。

## 4. 現有產品入口與引用狀態

| 入口 | 現況 | Brief 判定 |
| --- | --- | --- |
| 首頁 Hero | 直接連至 `/guide/slot-beginners-guide/`，錨文字為「新手開始了解 →」 | 應繼續由本篇承接；補強正文即可兌現 CTA，不需修改首頁。 |
| 首頁 Guide 清單 | 與所有 published Guide 一起列出 | 維持；不建立額外置頂或特殊 mapping。 |
| Guide 總覽 | 以 `beginner` category 顯示 | 維持原 category、slug 與 published 狀態。 |
| 全站 Search | 由 title、description、tags 形成一般「教學」結果 | 維持一般搜尋意圖；不新增結構化概念 owner。未來可在同一 Guide 修改中評估 description／tags 是否需更精確，但不需改 Search 程式。 |
| `/slots/` 新手閱讀路線 | 透過 category 篩選進入前五篇，不是手寫 relationship mapping | 可繼續作輔助入口；本輪不修改排序或 UI。 |
| `/slots/` Knowledge Map | 只顯示有正式 owner 的 Mechanism、Feature、Data Topic | 本篇不應加入；它是跨概念導覽，不是單一 taxonomy owner。 |
| Game detail | 欄位旁與功能區只顯示精確結構化 Guide 關聯 | 不應反向加入 Beginners Guide；精確 CTA 繼續由專門 Guide 承接。 |

目前沒有任何元件硬編這篇 Guide 的關聯。唯一明確產品所有權是首頁新手 CTA；這個入口與本篇定位一致。

## 5. 30 款 Game 資料覆蓋與首次閱讀負擔

現行資料審計為 30/30 published Game。首次閱讀 Game detail 時，使用者可能看到下列資料層次：

| 欄位／區塊 | 覆蓋 | 新手需要理解的重點 |
| --- | ---: | --- |
| Provider、名稱、摘要、來源 | 30/30 | 先確認遊戲身份；Provider 或主題不等於數學品質。 |
| 主要賠付機制 | 30/30 | 回答一般得獎組合如何成立，不是勝率。 |
| Features | 30/30 | 表示已核對的功能標籤；Feature 不自動成為主要 Mechanism。 |
| 主要 RTP | 17/30 | 有值才顯示；缺值不是 0。 |
| RTP variants | 10/30 | 多個數字要連同版本與來源閱讀；不代表使用者一定可選全部版本。 |
| 原廠波動度 | 20/30 | 保留原廠用詞或量表。 |
| 統一波動度 | 17/30 | Slot Hub 編輯比較層，不是產業共同標準。 |
| 最高倍數 | 25/30 | 必須確認原始標籤、基準與整局／局部範圍。 |
| Reels | 27/30 | 盤面資料可能為自由文字或動態結構。 |
| Rows | 23/30 | 缺列數或不規則盤面時不能硬補固定矩陣。 |
| 賠線／Ways 數量 | 18/30 | 數字意義依 Mechanism 而異；動態上限不能冒充固定值。 |
| Bonus Buy | 13/30 | 欄位存在時才顯示支援／不支援；沒欄位不等於不支援。 |
| Jackpot type | 0/30 | 現階段沒有足夠結構化類型資料，不應猜測。 |
| 發行日期 | 17/30 | 缺值維持空白，月份精度也不能虛構成某一天。 |
| Game ID | 9/30 | 原廠 namespace 與版本語境可能不同。 |
| 正式來源、最後核對日期 | 30/30 | 是判斷數字、原文與版本可信度的必要資訊。 |

這些覆蓋率說明新手 Guide 必須把「欄位不一定同時齊全」寫成核心原則，而不是以一張看似完整的理想資料表代表所有遊戲。

## 6. 建議閱讀順序

建議文章建立以下固定讀法，但每一站只做足夠的入口解釋：

### 第一步：確認遊戲身份

- 看繁中顯示名稱、原文名稱、aliases、Provider 與系列。
- 名稱相似、同一角色或同一品牌，不足以自動證明是續作或同系列。
- Provider 是身份資料，不代表 RTP、波動度或遊戲品質。

### 第二步：讀四個核心欄位

1. **RTP**：大量、長期條件下的理論回報比例；不預測單次 Session。
2. **波動度**：結果分布與起伏的相對描述；不是下一次輸贏預測。
3. **最高倍數**：特定標籤、投注基準與條件下的上限；不是容易取得程度。
4. **主要賠付機制**：一般得獎組合如何成立；不是 Feature 清單。

每項用一至兩句建立角色，隨即連到專門 Guide，不在本篇重複公式、廠商差異或大量案例。

### 第三步：打開完整資料

- 核對多版本 RTP、原廠波動度、統一波動度、盤面、賠線／Ways、Bonus Buy、發行日期與 Game ID。
- 盤面可能固定、不規則或動態；數字要和 Mechanism 一起讀。
- 原廠標籤與 Slot Hub 統一值應並列閱讀，不應只保留較好比較的一欄。

### 第四步：把 Symbols、Features 與 Bonus 分開

- Wild、Scatter、Free Spins、Multiplier、Cascading、Bonus Buy 各自描述功能或流程。
- Scatter symbol 不自動代表 Scatter Pays；Cascading 不自動成為第二個 Mechanism；Bonus Buy 不是購買特定結果。
- 僅提供角色概覽與專門 Guide 連結。

### 第五步：讀來源、版本與日期

- 精確數字須回到 Game Rules、Paytable、官方遊戲頁或其他第一方資料。
- 來源標籤、適用版本、原始單位與核對日期會影響可比性。
- 圖片來源證明素材可追溯，不等於圖片能證明數學規則。

### 第六步：使用工具完成任務

建議在文中明列：

```text
Search 找到名稱
→ Explorer 用已知欄位縮小結果
→ Game detail 核對原文、缺值與來源
→ Compare 並排查看最多三款
→ 專門 Guide 解釋不熟悉的欄位
```

這是產品操作順序，不是遊戲推薦漏斗。Compare 只並排現有資料，缺值仍保持缺值。

## 7. 缺值與資料層次原則

### 7.1 缺值怎麼讀

文章必須明確說明：

- 缺值不等於 0。
- 缺值不等於該功能不存在。
- 未填 `bonusBuy` 與明確填入 `false` 的語意不同。
- 沒有統一波動度，不表示原廠沒有任何描述，也不表示低波動。
- 沒有最高倍數，不應拿單一符號或 Bonus 上限補入。
- 不從同系列、相似名稱、畫面、Provider、RTP 或短期試玩補猜。

### 7.2 四層資料怎麼分

| 資料層 | 使用者應如何理解 |
| --- | --- |
| 原廠資料 | 保留正式標籤、單位、條件與版本語境。 |
| Slot Hub 編輯統一值 | 為目前資料庫建立的比較層，例如 normalized volatility；不是原廠宣告或產業共同標準。 |
| 可比較資料 | 基準、範圍與來源足夠清楚時，才可與其他遊戲並排理解。 |
| 只能保留原文的資料 | 標籤、單位或條件不足時，仍可供辨認，但不能宣稱與其他數值完全同質。 |

本文應教這四層的判斷責任，但不建立新的 Schema 或正式資料等級 taxonomy。

## 8. 與十篇其他 Guide 的內容邊界

| 現有 Guide | 已承擔的責任 | 本篇只保留什麼 |
| --- | --- | --- |
| `rtp-explained` | 理論／實際 RTP、turnover 基準、多版本、House Edge 與來源閱讀 | 一句定義、非單次結果警告、前往專文連結。 |
| `volatility-explained` | 分布與起伏、廠商尺度差異、原廠值／統一值、缺值 | 一句角色說明、不可預測警告、前往專文連結。 |
| `slot-max-win-explained` | 原始標籤、投注基準、整局／局部上限與可比性 | 說明它是上限而非容易取得程度，連到專文。 |
| `slot-payout-mechanisms-explained` | Paylines、Ways、Megaways、Cluster Pays、Pay Anywhere | 說明 Mechanism 回答「組合怎麼成立」，不重列五種完整規則。 |
| `slot-symbols-and-features` | Wild、Scatter、Free Spins、Jackpot 的角色與證據邊界 | 用作 Feature 層入口，不重寫替代規則與觸發條件。 |
| `slot-multiplier-explained` | 倍數基準、範圍、持續時間、算法 | 提醒 Multiplier 不等於 Max Win，連到專文。 |
| `slot-cascading-tumble-avalanche-explained` | 得獎後更新盤面、再次判定、停止條件與廠商差異 | 說明通常是 Feature，不是第二個主要 Mechanism。 |
| `slot-bonus-buy-explained` | 購買入口、價格基準、進入功能、Ante Bet 與市場差異 | 說明買的是 Feature 入口，不是結果或獲利保證。 |
| `slot-terms-glossary` | Reels、Rows、Paylines、Ways 等快速查詞 | 作為欄位名快速查詢，不與本篇的閱讀流程重複。 |
| `fishing-games-basics` | 捕魚機與轉輪老虎機的基本類型差異 | 只在「先確認遊戲類型」時指出不同資料類型應分開閱讀。 |

本篇可以連到上述專文，但不需要每篇都在正文重複一次完整摘要。建議正文提供 8～10 個具語意的站內連結，並在結尾整理「下一步閱讀」；同一連結避免無必要重複。

## 9. 具名案例建議

本篇需要少量案例，因為首次使用者需要看到原則如何落在真實 Game detail；但案例不應變成「新手推薦遊戲」或逐款介紹。

建議使用 3 款，每款只承擔單一責任：

| Game | 教學責任 | 使用限制 |
| --- | --- | --- |
| Mahjong Ways | 示範從名稱、Provider 進入核心數據，再查看主要 RTP、RTP variants、原廠／統一波動度、Mechanism 與來源日期 | 不重寫 1,024 Ways、Multiplier 或 RTP 文件的完整規則。 |
| Super Ace | 示範原廠 `LOW-MED` 可保留，但沒有足夠依據時不強制填統一波動度 | 不把 `LOW-MED` 翻成某個 normalized 等級，也不推論短期結果。 |
| Big Bass Bonanza | 示範有 RTP 與 Mechanism，但波動度和整局最高倍數仍可能缺值；單一 Money Symbol 上限不能補成 Max Win | 不把遊戲寫成推薦，也不展開 Bonus Round 全部規則。 |

若正式寫作發現三個案例使文章過長，可保留 Super Ace 與 Big Bass Bonanza 兩個對照，再以一般欄位截面說明完整資料。任何精確數值或規則都應沿用現有 Game data 的第一方來源，不另由記憶補寫。

## 10. 來源需求

本篇的大部分內容是 Slot Hub 自身的資料閱讀規則與 UI 使用方式，可由以下既有權威來源承接：

- 現行 Game Schema、published Game data 與來源欄位。
- 已核准並 published 的 RTP、Volatility、Max Win、Mechanism、Feature、Multiplier、Cascading 與 Bonus Buy Guide。
- 現行 Search、Explorer、Game detail、Compare 與 relationship 行為。

因此不需要為每一個一句話定義重新複製一組外部來源清單。若正文保留具名遊戲的精確數值、標籤或規則，則必須：

1. 使用該 published Game 已保存的第一方來源；
2. 保留原始標籤、單位、版本與核對日期語境；
3. 不以專門 Guide 的摘要取代已失效的第一方證據；
4. 不新增娛樂城、聯盟、搜尋摘要或一般 SEO 來源。

本 Brief 階段未新增外部精確事實，也未查找新來源。正式內容階段應在交付前回讀所有保留的具名案例連結。

## 11. Knowledge Diagram 評估

**建議不加入 Knowledge Diagram。**

理由：

- 本篇核心是站內導覽、欄位層次與閱讀順序，不是單一因果流程。
- 現有使用規則已將 `slot-beginners-guide` 列為應維持 Editorial Reading 的 Guide。
- 把 Search → Explorer → Game detail → Compare 畫成圖解，容易把可自由往返的工具誤畫成唯一漏斗。
- 把八個資料概念排成流程卡，會重複 Knowledge Map 與專門 Guide 關聯。
- 編號清單與最多兩個表格即可完成理解，無需新增視覺模組。

未來若實際內容證明某一小段需要圖解，必須另行審查；本次內容補強不應因已有 Diagram CSS 而使用它。

## 12. 建議文章結構與篇幅

建議約 1,700～2,400 個非空白繁中文字，8～10 個 H2，最多 2 個表格。可依寫作節奏合併相鄰小節，但不能遺漏缺值、來源層次與工具路徑。

建議結構：

1. **先說結論：這篇教你讀資料，不替你選遊戲**
2. **先確認是哪款遊戲與哪家 Provider**
3. **核心數據先看 RTP、波動度、最高倍數與賠付機制**
4. **完整資料再看版本、盤面、數量與原廠標籤**
5. **Symbols、Features 與 Bonus 不要混成一層**
6. **缺值就是未知，不是 0 或沒有**
7. **原廠原文、統一值與可比較資料怎麼分**
8. **來源、版本與最後核對日期怎麼讀**
9. **Search、Explorer、Game detail、Compare 怎麼配合**
10. **下一步：遇到哪個問題就讀哪篇專門 Guide**

可使用的呈現：

- 一個「四個核心欄位各回答什麼」對照表。
- 一個「原廠資料／統一值／缺值」對照表。
- 一段編號工具路徑。
- 2～3 個具名短案例。

不應加入：完整廠商換算表、遊戲排行榜、投注策略、模擬結果或概念圖解。

## 13. 內容 QA 與禁止敘述

正式補強時至少檢查：

- 每一節都服務「如何讀 Slot Hub」，沒有重寫專門 Guide。
- RTP 不被寫成單次回報或下一次結果預測。
- 波動度不被寫成輸贏、勝率或資金安全預測。
- Max Win 不被寫成容易取得程度。
- Provider、主題、美術或系列不被當成數學品質證據。
- 缺值不被寫成 0、無、不支援或低。
- 原廠標籤與 normalized 值的來源責任清楚。
- 具名案例不超出其第一方來源能支持的範圍。
- 不提供投注額、資金管理、回本、獲利或「新手最適合遊戲」建議。
- 首頁 CTA 的承諾在文章前段即可得到回答。
- 所有站內連結使用現有永久 Guide URL，且文字能說明目的。

## 14. Relationship、Search 與 UI 判定

### 14.1 現況

- 11 篇 published Guide、30 款 published Game。
- `slot-beginners-guide` 沒有結構化 relationship 宣告。
- Guide → derived Games：0。
- Game detail 反向關聯：0。
- Search 只把它視為一般 Guide 結果。
- Knowledge Map 不顯示它。
- 現行 Game → Guide 總量與各 specialist owner 不因本篇內容改寫而變動。

### 14.2 建議

- `RELATIONSHIP_EXPECTATION_MIGRATIONS: NONE`
- 不新增 broad `beginner` Data Topic 或其他 taxonomy。
- 不把本篇綁到所有 30 款 Game，避免每頁出現同一個泛用 CTA。
- 不移交 RTP、volatility、max-win、Mechanism 或 Feature owner。
- 不新增 Search 特例；title、description、tags 的一般索引已足夠。
- 不修改 Knowledge Map；它應維持精確概念入口。

內容補強後，Game detail 仍由專門 Guide 解釋精確欄位；本篇則由首頁、Guide index、一般 Search 與 `/slots/` 新手路線承接。

## 15. 未來最小實作範圍

原則上只允許修改：

- `src/content/guides/slot-beginners-guide.md`

可在同一 Guide frontmatter 評估更新 `description`、`tags` 與 `updatedAt`，但應維持 slug、title、category、level、status，且不得新增結構化 relationship 欄位。

預期不得修改：

- 首頁、Guide index、Search、Explorer、Compare、Game detail 或 `/slots/`。
- Guide template、global CSS 或 Diagram 樣式。
- Game data、Schema、taxonomy、resolver、relationship owner 或 URL serializer。
- Preview robots、canonical、sitemap、正式網域、Wix、DNS 或 301。

若既有測試因精確舊文案或內容長度斷言而失敗，應先回報；目前搜尋只發現一般 Guide topic 檢查，沒有需要遷移的 Beginner Guide relationship 預期。

## 16. 未來內容與 UI 回歸計畫

內容補強階段應執行 Preview 環境完整 `npm run verify`，並額外驗證：

1. 30/30 資料審計維持通過。
2. 11 篇 published Guide 與所有 specialist owner 不變。
3. Beginners Guide 的 Guide → Game 與 Game → Guide 仍為 0。
4. 首頁「新手開始了解」仍連到原 slug。
5. Guide 總覽與一般 Search 可找到更新後文章。
6. `/slots/` 新手閱讀路線無退化；Knowledge Map 不新增 broad beginner owner。
7. Game detail 的欄位 CTA、去重、direct／overflow 數量不變。
8. 文內 8～10 個站內連結全部可達。
9. 若保留具名案例，逐一回讀其 Game page 與第一方來源。
10. 1440×900、390×844、320×844 無頁面級水平溢位。
11. 表格由既有 Guide 容器安全承接；320px 不推寬 document。
12. 無 JavaScript 時正文、表格與連結完整可讀。
13. Browser console errors 為 0。
14. Bonus Buy、Cascading、Max Win Diagram 與其他 Guide 無退化。
15. Preview `noindex,nofollow`、HTTP Header、空白 sitemap 與無 canonical 維持不變。

本 Brief 階段只需執行資料審計、relationship 驗證與 `git diff --check`；不需要 Build 或視覺模擬。

## 17. 已知限制與 blockers

- 本篇不能取代各專門 Guide 的第一方來源與完整定義。
- `/slots/` 新手閱讀路線目前由 category 與集合順序產生，並非明確的 editorial sequence；這是既有產品行為，但不阻擋本篇內容補強，本輪也不修改 UI。
- Game detail 的可見欄位因資料完整度而異，文章必須避免假設所有遊戲都有相同欄位。
- 捕魚機 Guide 與資料仍較薄；本篇只應把它視為不同遊戲類型，不延伸捕魚機規則。
- 沒有需要 Schema、taxonomy、resolver、URL 或產品決策的 blocker。

## 18. 工作流固定尾段

`STAGE_RESULT: PASS_TO_NEXT_STAGE`
`CURRENT_STATE: READONLY_BRIEF_COMPLETE`
`GUIDE_SLUG: slot-beginners-guide`
`GUIDE_TITLE: 老虎機新手入門：先看懂遊戲資料`
`RELATIONSHIP_TYPE: NONE；全站閱讀入口，不擁有 Mechanism、Feature 或 Data Topic`
`SOURCE_STATUS: SUFFICIENT_FOR_BRIEF；內容以現行產品、30款已驗證Game與10篇專門Guide為基礎，正式具名案例仍須回讀既有第一方來源`
`CONTENT_QA_RESULT: PASS；定位為導覽與判讀順序，不重寫專門Guide或提供投注建議`
`CONTENT_GAPS: 現文約85個中文字、無章節、站內連結、缺值原則、資料層次、來源讀法或工具路徑`
`DATA_COVERAGE: 30/30 published Game；主要RTP 17、RTP variants 10、原廠波動度20、統一波動度17、最高倍數25、Mechanism 30、Features 30、來源與核對日期30`
`PROPOSED_STRUCTURE: 10節Editorial Reading；身份→核心數據→完整資料→Features→缺值→資料層次→來源→工具→專門Guide`
`DIAGRAM_RECOMMENDATION: NONE；編號閱讀順序與最多兩個表格比Knowledge Diagram更符合導覽任務`
`RELATIONSHIP_RESULT: 現行Guide→Game 0、Game→Guide 0；首頁與一般Search承接，精確Game detail CTA仍由專門Guide承接`
`UI_RESULT: NOT_RUN；本輪未修改網站或正式Guide`
`TEST_RESULTS: verify:data PASS（30/30）；verify:relationships PASS（11 Guides／30 Games）；git diff --check於文件完成後執行`
`PUBLISHED_SIMULATION_RESULT: NOT_RUN`
`EXACT_CI_COMMAND_RETESTED: NO；只讀Brief階段不需完整Build`
`RELATIONSHIP_EXPECTATION_MIGRATIONS: NONE`
`BLOCKERS: NONE`
`FILES_CHANGED: docs/slot-beginners-guide-v1-readonly-brief.md`
`COMMIT_SHA: N/A`
`GIT_STATUS: Brief為唯一新增檔案；既有未追蹤原型與審查目錄維持未追蹤且未觸碰`
`NEXT_ALLOWED_ACTION: 人工審查 Slot Beginners Guide Brief`
`COMMIT_ALLOWED: NO`
`PUSH_ALLOWED: NO`
`DEPLOY_ALLOWED: NO`
`HUMAN_APPROVAL_REQUIRED: YES`
