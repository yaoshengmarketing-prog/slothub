# Slot Hub「最高倍數怎麼看」Guide v1 只讀 Brief

> **READ-ONLY BRIEF**
>
> 資料核對日期：2026-08-29
>
> 本文件只盤點現有資料、第一方來源、文章範圍與關聯可行性。它不是 Guide 草稿，也不構成修改 Game、Schema、taxonomy、relationship resolver、搜尋、Explorer 或 UI 的授權。

## 1. 任務目的

本篇預定教使用者判斷遊戲資料中的最高倍數究竟在說什麼，而不是製作最高倍數排行榜，也不是用最高倍數推薦遊戲。

核心問題是：同樣寫成 `10,000×`，其基準可能是總投注、原始投注、單線投注、coin value，甚至只是一個符號或 Bonus Feature 的上限。只有來源明確說明它是整款遊戲的最高贏分／最高派彩，且倍數基準可辨識時，Slot Hub 才適合把它納入統一比較值。

## 2. 盤點範圍與方法

本次盤點包括：

- 現有 30 款 `published` Game。
- Game 的 `maxWinMultiplier`、`maxWinLabelOriginal`、`sources`、`source` 與 `lastVerifiedAt`。
- 既有三批遊戲只讀驗證報告。
- 廠商官方遊戲頁、官方 Game Information PDF、官方 Client Hub 與官方產品文章。
- 現有 Guide Schema、relationship resolver、Search 與 Explorer 投影。

統計中的「有來源」只表示該 Game 保存了可追溯來源，不代表來源已明確寫出最高倍數的原始標籤、投注基準與成立條件。本文另外計算原始標籤保存率，避免把網址存在誤當成語意完整。

## 3. 30 款最高倍數資料覆蓋

### 3.1 整體統計

| 項目 | 數量 | 取得率 | 解讀 |
|---|---:|---:|---|
| Published Game | 30 | 100% | 本次母體 |
| 有 `maxWinMultiplier` | 25 | 83.3% | 可供目前卡片、資料頁、比較與 Explorer 使用 |
| 無 `maxWinMultiplier` | 5 | 16.7% | 不應以 0、Feature 上限或第三方數字補值 |
| 有 `maxWinLabelOriginal` | 16 | 53.3% | 有保存原廠標籤或具體原文 |
| 已有倍數且有原始標籤 | 16 / 25 | 64.0% | 仍有 9 款只有統一數值、欠缺原始術語 |
| 有來源與核對日期 | 30 | 100% | 可追溯網址完整，但不等於最高倍數語意均完整 |

沒有統一最高倍數的五款為：

- Big Bass Bonanza
- Gates of Olympus
- Jump High
- Legacy of Dead
- Reactoonz

有 `maxWinMultiplier`、但未保存 `maxWinLabelOriginal` 的九款為：

- Cash Crew
- Chaos Crew
- Fish Tales: Double Catch Max Scatter
- Fortune Paw
- Greedy for Gold: Hold and Win
- Hand of Anubis
- Ragnarok Gold
- Shadow of Dominion
- Wildhalla

這九款仍可沿用現有站內比較值，但在文章中若要精確解釋原廠語意，應先重新核對其第一方規則並補證；本 Brief 不修改 Game。

### 3.2 Provider 分布

| Provider | Published | 有統一最高倍數 | 有原始標籤 | 備註 |
|---|---:|---:|---:|---|
| Pragmatic Play | 5 | 3 | 3 | Big Bass 與 Gates 原作未填整局最高倍數 |
| PG SOFT | 4 | 4 | 4 | 官方 PDF 可區分理論值、廣告值與模擬 Max Exposure |
| Hacksaw Gaming | 4 | 4 | 1 | 三款欠缺原始標籤保存 |
| Booming Games | 3 | 3 | 0 | 有統一數值，但文章引用前需補原始標籤 |
| Slotmill | 3 | 3 | 0 | 有統一數值，但文章引用前需補原始標籤 |
| ATG Games | 3 | 3 | 3 | `Max Win` 與 `Winning ratio` 並存，語意不可自動視為相同 |
| Play’n GO | 3 | 1 | 1 | Legacy of Dead 有多組不同單位／條件描述；Reactoonz 未填 |
| NetEnt | 2 | 2 | 2 | 官方頁以 `Max payout … x bet` 呈現 |
| Big Time Gaming | 1 | 1 | 1 | Bonanza 為 `Max payout: 26 000 x bet` |
| CQ9 Gaming | 1 | 0 | 0 | Jump High 未填整局最高倍數 |
| JILI Games | 1 | 1 | 1 | Super Ace 保存 `MAX WIN: 10000x` |

### 3.3 現有 `maxWinLabelOriginal` 實際值

| Game | `maxWinMultiplier` | 已保存的原始標籤 |
|---|---:|---|
| Bonanza | 26,000× | `Max payout: 26 000 x bet` |
| Fortune Ox | 2,000× | `Theoretical Maximum Win / Max Exposure: 2,000x` |
| Fortune Tiger | 2,500× | `Max Exposure / Advertised Max Win: 2,500x` |
| Gates of Olympus 1000 | 15,000× | `Maximum Win: 15,000x` |
| Gonzo’s Quest | 2,200× | `Max payout: 2 200 x bet` |
| Mahjong Ways | 25,000× | `Theoretical Maximum Win / Max Win (Advertised Value): 25,000x` |
| Mahjong Ways 2 | 100,000× | `Theoretical Maximum Win / Advertised Max Win: 100,000x; Max Exposure (1 billion simulations): 1,708x` |
| Rich Wilde and the Book of Dead | 5,000× | `winCap: 5000` |
| Starburst | 800× | `Max Payout: 800 x bet` |
| Storm of Seth | 51,000× | `Max Win` |
| Storm of Seth 2 – Awakening | 81,000× | `Winning ratio` |
| Sun Wu Kong | 30,000× | `Winning ratio` |
| Super Ace | 10,000× | `MAX WIN: 10000x` |
| Sweet Bonanza | 21,175× | `21,175x original bet` |
| Sweet Bonanza 1000 | 25,000× | `Maximum Win: 25,000x` |
| Wanted Dead or a Wild | 12,500× | `Max Win: 12,500x` |

這 16 筆中，14 筆至少以 Max Win、Maximum Win、Max Payout、winCap 或明確投注倍數描述上限；兩筆只使用 `Winning ratio`，比較投影雖已有數值，文章仍需保留較低語意確定性。其餘九筆有統一數值但沒有原始標籤，五筆則沒有統一值。

## 4. 原廠術語與可比較性分類

### 4.1 `Max Win`／`Maximum Win`

通常是廠商對整款遊戲最高贏分的標示，但仍須確認：

- 是乘以總投注、原始投注、單線投注或其他基準。
- 是數學上的理論上限、產品設定上限，還是行銷頁呈現值。
- 是否限定特定 Bonus、RTP 設定或地區版本。

實例包括 Storm of Seth 的 `Max Win x51000`、Sweet Bonanza 1000 的 `Maximum Win: 25,000x`、Wanted Dead or a Wild 的 `Max Win: 12,500x`。

### 4.2 `Advertised Max Win`／`Theoretical Maximum Win`

這類數字描述產品宣告或數學模型允許的最高值，不代表它在某次模擬中曾經出現，也不代表發生機率較高。

PG SOFT 官方 Game Information PDF 會同時列出：

- `Theoretical Maximum Win`
- `Max Win (Advertised Value; Highest Win in (x) Spins)`
- `Max Exposure (Simulated in 1 Billion Spins)`

因此文章必須把理論／廣告最高值與模擬 Max Exposure 分開，而不能只寫「官方有兩個最高倍數」。

### 4.3 `Max Exposure`

在目前核對的 PG SOFT 文件中，`Max Exposure` 明確附有 `Simulated in 1 Billion Spins`。它是指定模擬條件下的暴露值，不等同於數學模型的理論最高值，也不能直接用來推導中獎機率。

例如 Mahjong Ways 2 的官方文件同時列出：

- `Theoretical Maximum Win: x100000`
- `Max Win (Advertised Value...): 100000x`
- `Max Exposure (Simulated in 1 Billion Spins): 1708x`

Slot Hub 現有統一比較值採 100,000×，並在原始標籤中保留 1,708× Max Exposure；兩者不能互相覆蓋。

### 4.4 `Winning Ratio`

ATG 官方頁對 Storm of Seth 2 – Awakening 使用 `Winning ratio x81000`，但 Storm of Seth 原作則使用 `Max Win x51000`。即使兩者頁面版型相似，也不能因此斷言 `Winning ratio` 與 `Max Win` 在所有 ATG 遊戲中完全同義。

現有站內可保留 81,000× 作比較投影，但文章引用時必須：

- 顯示原廠 `Winning ratio` 標籤。
- 保留官方頁來源。
- 說明投注基準與成立條件未在該公開頁完整展開。
- 不自行改寫成「保證最高可贏總投注 81,000 倍」。

### 4.5 `Max payout … x bet`／`… x original bet`

若第一方來源明確以 `x bet`、`original bet` 或 `total bet amount` 表示整局最大派彩，通常可安全映射為 Slot Hub 統一比較值，但原始基準仍應保存。

實例：

- Bonanza：`Max payout: 26 000 x bet`
- Starburst：`Max Payout: 800 x bet`
- Sweet Bonanza：`21,175x original bet`
- Fortune Ox／Tiger：官方 PDF 另以 `total bet amount` 說明最高贏分

### 4.6 `coins`、coin value 與其他單位

`250,000 coins` 不是天然等於 `250,000× total bet`。若來源沒有交代每個 coin 與投注額、線數、coin value 的關係，就不能自行換算成全站統一倍數。

Legacy of Dead 官方資料同時出現 `up to 250000 coins`、5,000× initial bet，以及特定 Expanding Symbol 條件下的 25,000× 描述。不同單位和成立條件未被同一份高權重規則完整統一，因此目前不填 `maxWinMultiplier` 是正確做法。

### 4.7 單一符號或單一 Feature 上限

單一 Money Symbol、Multiplier、Bonus Round 或某個 Feature 的數值上限，不等於整局最高倍數。

Big Bass Bonanza 的官方規則線索包含 `Money Symbol up to 2,000×`，但這只描述 Money Symbol 的可能值。現有資料正確地把它保存在 Bonus Feature 說明中，並讓 `maxWinMultiplier` 留空。

### 4.8 條件不明或來源互相衝突

遇到下列情況，應保留原廠文字與來源，不進行統一：

- 同一遊戲出現不同單位，如 coins 與 initial bet multiplier。
- 理論最高值與模擬 Max Exposure 不同。
- 原廠只寫 `Winning ratio`，沒有公開投注基準或規則條件。
- 數字只適用於單一符號、Bonus 或 Feature。
- 不同官方頁面描述不同，且無法由更高權重規則頁釐清。
- 只找到第三方資料庫或娛樂城轉述。

## 5. 文章必須回答的問題

### 5.1 `10,000×` 通常代表什麼？

它通常表示某個贏分數值是某個投注基準的 10,000 倍，但不能只看 `×` 就假定基準一定是總投注。文章須要求使用者同時找：原始標籤、投注基準、適用範圍和成立條件。

### 5.2 倍數基準可能有哪些？

- Total bet／total bet amount：整次旋轉的總投注。
- Original bet／initial bet：進入功能前或該局起始投注。
- Line bet：單線投注，需結合賠線數才可能理解總額關係。
- Coin／coin value：需知道幣值、下注級別和 paytable 定義。
- Feature-specific value：只適用於符號、收集值、Multiplier 或 Bonus。

缺少基準時，Slot Hub 不應自行換算。

### 5.3 Advertised／Theoretical Max Win 與 Max Exposure 有何差異？

- Advertised／Theoretical Max Win：產品宣告或數學模型容許的最高值。
- Max Exposure：特定模擬規模中觀察或估算到的暴露值；PG SOFT 樣本明確標為 10 億次模擬。

兩者回答的不是同一問題，不能以較低的 Max Exposure 覆蓋理論最高值，也不能把理論最高值描述成模擬常見結果。

### 5.4 為什麼同一款會有兩個不同數字？

可能原因包括：理論值與模擬值不同、不同投注基準、不同功能階段、不同遊戲設定，或官方頁面本身採用不同術語。每個數字都必須連同標籤、單位與條件閱讀。

### 5.5 單一符號 2,000× 為什麼不是整局最高倍數？

因為同一局可能還有其他符號、收集、Multiplier、Retrigger 或 Bonus 結算規則；反之，該符號值也可能只在特定階段出現。除非正式規則明確稱它為整款遊戲的最大總贏分，否則只能保存為 Feature 資料。

### 5.6 最高倍數是否代表比較容易中？

不是。最高倍數描述上限或可能值，不描述出現頻率。文章不得從最大值推導中獎機率、命中率、回本機率或推薦程度。

### 5.7 最高倍數、RTP、波動度各回答什麼？

- 最高倍數：在指定規則和基準下，最高贏分可到哪裡。
- RTP：長期理論投注回報比例，不代表單次結果。
- 波動度：結果分布與起伏的相對特徵，不等同最大值或 RTP。

文章應連至既有 RTP 與波動度 Guide，但不重複改寫兩篇文章的完整內容。

### 5.8 多 RTP 版本是否代表最高倍數一定不同？

不一定。RTP 設定可能改變獎項權重、命中分布或其他參數，最高倍數也可能保持相同。只有第一方規則明確區分設定時，才能為各版本保存不同上限。

### 5.9 Slot Hub 何時顯示統一最高倍數？

至少需要：

1. 可追溯的廠商第一方來源。
2. 來源把數字描述為整款遊戲的 Max Win、Maximum Win、Max Payout 或可確認的同義整局上限。
3. 倍數基準可辨識，或來源明確把它表示為投注倍數。
4. 不只是單一符號、Feature 或 Bonus 階段上限。
5. 若有多個官方數字，能分辨其標籤、單位與成立條件。

### 5.10 哪些情況只保留原廠說明？

- 基準不明。
- 只有 coins 或其他無法換算的單位。
- `Winning ratio` 等原廠術語尚無規則層定義。
- 官方來源互相衝突。
- 理論值與模擬值並列，需分開保存。
- 數字只屬單一符號／Feature。
- 精確數值只有第三方來源。

## 6. 代表案例與第一方來源

本篇建議使用下列 10 款作「語意案例」。選擇標準是覆蓋不同術語與證據情況，不是倍數高低。

### 6.1 Mahjong Ways

- 原廠標籤：`Theoretical Maximum Win: x25000`、`Max Win (Advertised Value...): 25000x`、`Max Exposure (Simulated in 1 Billion Spins): 2893x`。
- 數值與單位：25,000× 理論／廣告值；2,893× 模擬 Max Exposure。
- 成立條件：官方 PDF 將兩者分列；不是同一種量測。
- Slot Hub 統一比較值：25,000×。
- 資料注意：現有 `maxWinLabelOriginal` 保存理論／廣告 25,000×，但尚未保存官方 PDF 中的 2,893× Max Exposure。文章可引用 PDF，不能假稱 Game 資料已完整保存兩者。
- 第一方來源：[PG SOFT Game Information PDF](https://www.pgsoft.com/uploads/Games/Pdf/MahjongWays_Gameinformation_EN.pdf)、[PG SOFT 遊戲頁](https://www.pgsoft.com/en/games/65-mahjong-ways/)

### 6.2 Mahjong Ways 2

- 原廠標籤：`Theoretical Maximum Win: x100000`、`Max Win (Advertised Value...): 100000x`、`Max Exposure (Simulated in 1 Billion Spins): 1708x`。
- 數值與單位：100,000× 理論／廣告值；1,708× 模擬 Max Exposure。
- 成立條件：同一官方文件中明確分列。
- Slot Hub 統一比較值：100,000×；1,708× 只保留為 Max Exposure。
- 第一方來源：[PG SOFT Game Information PDF](https://www.pgsoft.com/uploads/Games/Pdf/Mahjong_Ways_2_Gameinformation_EN.pdf)、[PG SOFT 遊戲頁](https://www.pgsoft.com/en/games/74-mahjong-ways-2/)

### 6.3 Fortune Tiger

- 原廠標籤：`Theoretical Maximum Win`、`Max Exposure`、`Max Win (Advertised Value...)`。
- 數值與單位：三者均為 2,500×；規則另表述為總投注額的最高倍數。
- 成立條件：即使數字相同，也應保留三種標籤，不代表術語可合併。
- Slot Hub 統一比較值：2,500×。
- 第一方來源：[PG SOFT Game Information PDF](https://www.pgsoft.com/uploads/Games/Pdf/Fortune_Tiger_Gameinformation_EN.pdf)、[PG SOFT 遊戲頁](https://www.pgsoft.com/en/games/126-fortune-tiger/)

### 6.4 Fortune Ox

- 原廠標籤：`Theoretical Maximum Win`、`Max Exposure`、`Max Win (Advertised Value...)`。
- 數值與單位：三者均為 2,000×；官方規則寫明相對於 total bet amount。
- 成立條件：完整 Game Information PDF 支持整局上限與基準。
- Slot Hub 統一比較值：2,000×。
- 第一方來源：[PG SOFT Game Information PDF](https://www.pgsoft.com/uploads/Games/Pdf/Fortune_OxGameinformation_EN.pdf)、[PG SOFT 遊戲頁](https://www.pgsoft.com/en/games/98-fortune-ox/)

### 6.5 Storm of Seth

- 原廠標籤：`Max Win`。
- 數值與單位：`x51000`。
- 成立條件：官方產品頁公開此值，但頁面摘錄未完整解釋投注基準。
- Slot Hub 統一比較值：51,000×，同時必須保存 `Max Win` 原文及來源。
- 第一方來源：[ATG Games 官方遊戲頁](https://www.atg-games.com/en/games/slot/storm-of-seth)

### 6.6 Storm of Seth 2 – Awakening

- 原廠標籤：`Winning ratio`。
- 數值與單位：`x81000`。
- 成立條件：官方產品頁公開此值，但未在公開摘要中明確定義它與 `Max Win` 的關係及投注基準。
- Slot Hub 統一比較值：現有資料使用 81,000×；文章必須以低語意推論方式呈現，不能把標籤自行改成 Max Win。
- 第一方來源：[ATG Games 官方遊戲頁](https://www.atg-games.com/en/games/slot/storm-of-seth-2-awakening)

### 6.7 Bonanza

- 原廠標籤：`Max payout`。
- 數值與單位：`26 000 x bet`。
- 成立條件：官方產品頁直接以 bet multiple 表示整款遊戲最大派彩。
- Slot Hub 統一比較值：26,000×。
- 第一方來源：[Big Time Gaming 官方遊戲頁](https://beta.bigtimegaming.com/games/bonanza)

### 6.8 Big Bass Bonanza

- 原廠標籤：Money Symbol 的功能數值，不是已確認的整局 `Max Win`。
- 數值與單位：Money Symbol up to 2,000×。
- 成立條件：屬 Bonus Round／Money Collect 規則中的單一符號值。
- Slot Hub 統一比較值：不採用；`maxWinMultiplier` 應留空。
- 第一方來源：[Pragmatic Play 遊戲頁](https://www.pragmaticplay.com/en/games/big-bass-bonanza/?cur=tnd&gamelang=en)、[Pragmatic Play Client Hub 正式資料](https://clienthub.pragmaticplay.com/wp-json/wp/v2/posts/11983)

### 6.9 Legacy of Dead

- 原廠標籤／描述：官方產品頁寫 `up to 250000 coins`；另一官方系列文章保存 5,000× initial bet 與特定全盤 Expanding Symbol 條件下 25,000× 的描述。
- 數值與單位：coins、initial bet multiplier 與條件式 Feature 描述並存。
- 成立條件：不同單位和條件尚未由同一份高權重規則頁統一。
- Slot Hub 統一比較值：不採用；避免把 coins 或條件式 Feature 上限誤換算成整局倍數。
- 第一方來源：[Play’n GO 官方遊戲頁](https://www.playngo.com/games/legacy-of-dead)、[Play’n GO Dead Series 官方文章](https://www.playngo.com/post/top-dead-series-slots-play-n-go)

### 6.10 Starburst

- 原廠標籤：`Max payout`。
- 數值與單位：`800 x bet`。
- 成立條件：現行官方產品資料將最大派彩直接表示為 bet multiple。
- Slot Hub 統一比較值：800×。
- 第一方來源：[NetEnt 官方遊戲頁](https://netent.com/games/starburst)

## 7. 來源與語意衝突摘要

| 類型 | 實例 | 處理原則 |
|---|---|---|
| 理論／廣告值與模擬值不同 | Mahjong Ways、Mahjong Ways 2 | 統一值可採明確理論／廣告整局上限；Max Exposure 分開保存，不互相覆蓋 |
| 相同數字、不同標籤 | Fortune Tiger、Fortune Ox | 數值雖相同，原始術語仍須全部保留 |
| 原廠非標準術語 | Storm of Seth 2 的 `Winning ratio` | 保留原文與來源；不宣稱等同所有廠商的 Max Win |
| Feature／符號值誤當整局上限 | Big Bass Bonanza 2,000× Money Symbol | 只保存在 Feature 說明，統一最高倍數留空 |
| coins 與 bet multiplier 混合 | Legacy of Dead | 不自行換算；等待正式規則統一單位與條件 |
| 有統一數值但沒有原始標籤 | 現有 9 款 | 站內既有比較可維持；文章精確引用前需補第一方原文 |
| 第一方資料存在但保存不完整 | Mahjong Ways 的 2,893× Max Exposure | Brief 記錄缺口；本輪不修改 Game |

## 8. 文章搜尋意圖

### 8.1 主要搜尋意圖

- 「老虎機最高倍數是什麼」
- 「Max Win 意思」
- 「10000倍怎麼算」
- 「Max Exposure 是什麼」
- 「最高倍數和 RTP 差別」
- 「最高倍數和波動度差別」

使用者真正需要的是判讀方法，而不是一張從大到小排序的榜單。

### 8.2 建議標題

`老虎機最高倍數怎麼看？Max Win、Max Exposure 與 Winning Ratio 的差異`

### 8.3 建議 description

`看懂老虎機 10,000× 的投注基準，以及 Max Win、理論／廣告最高值、Max Exposure 與 Winning Ratio 的差異，分清整局上限和單一功能數值。`

### 8.4 建議章節

1. 先確認 `×` 是乘以什麼
2. Max Win、Maximum Win 與 Max Payout
3. Advertised／Theoretical Max Win 與 Max Exposure
4. 為何同一款遊戲會出現兩個最高倍數
5. Winning Ratio 與其他原廠術語怎麼保存
6. 單一符號、Bonus 與 Feature 上限不是整局 Max Win
7. coins、line bet、total bet 與 original bet 的單位差異
8. 最高倍數、RTP 與波動度各自回答什麼
9. Slot Hub 何時顯示統一最高倍數
10. 用官方資料核對遊戲時的快速檢查表

## 9. 關聯設計盤點

### 9.1 預定 frontmatter

未來若進入 Guide 草稿階段，這篇文章只應宣告：

```yaml
relatedDataTopics:
  - max-win
```

不應同時手抄 `relatedGames`、`relatedProviders`，也不需要重複宣告 RTP、波動度或 Mechanism。

### 9.2 現有底座承接情況

`max-win` 已存在於：

- Guide Schema 的 `relatedDataTopics` 合法值。
- relationship resolver 的 Data Topic catalog。
- Search 的概念詞彙（`Max Win`、`最高倍數`）。
- Game → Data Topic 判定：僅在 `maxWinMultiplier` 有值時加入 `max-win`。
- Guide → derived Games 的反向推導。

因此不需要 Schema 或 resolver 修改，就能建立：

- `max-win` → Guide
- Game → Guide（限 25 款有統一最高倍數的遊戲）
- Guide → 25 款 derived Games
- Search 的「了解概念」Guide 結果
- Guide detail 的代表遊戲與「探索相關遊戲」入口

五款沒有 `maxWinMultiplier` 的遊戲不會被自動關聯，符合「不能用 Feature 上限或缺值猜測」的原則。

### 9.3 Explorer 呈現限制

現有 Explorer 已支援最高倍數門檻篩選與排序，但目前低干擾「了解概念」入口的投影只處理 Mechanism 與 Feature，未處理 Data Topic。

因此只發布 `relatedDataTopics: [max-win]` 時：

- Search、Game detail、Guide detail 與 relationship index 可正常承接。
- Explorer 的最高倍數數值篩選仍正常。
- Explorer 不會因 Data Topic 關聯自動顯示「了解最高倍數」CTA。
- Guide 的 Data Topic 探索入口目前會使用既有 URL serializer 產生 `/games/?q=最高倍數&sort=relevance`，不是某個任意的最高倍數門檻。

這不是 Schema 缺口，也不阻止文章進入 draft；但在發布審查前，應決定 v1 是否接受 Search／Game／Guide 三處入口，或另行核准最小 UI 投影，使 Explorer 能在使用最高倍數篩選時顯示 Guide CTA。本 Brief 不授權修改。

### 9.4 最多三篇與排序影響

現有 Game detail 的 Guide 優先順序是：

1. Mechanism
2. Data Topic
3. Feature

同一優先級再依標題與 slug 穩定排序，最多顯示三篇。以預定標題暫時投影後：

- 25 款有 `maxWinMultiplier` 的遊戲都能在前三篇看到新 Guide。
- 但這 25 款的前三篇組合都會改變；常見情況是 RTP 或 Feature Guide 被第四順位擠出。
- 新 Guide 本身不會被擠掉，因為 Data Topic 優先於 Feature，且在現有 Data Topic 標題排序中位置靠前。

這不代表排序錯誤，但發布前必須在代表遊戲上做內容與視覺 Preview Review，確認「最高倍數」的出現不會讓更重要的 RTP／波動度入口普遍消失。若產品希望固定保留某些核心 Guide，需另行審查排序策略；本階段不修改 resolver。

### 9.5 與既有 Guide 的重複邊界

- RTP Guide：只解釋長期理論回報與多 RTP 版本，不承接最高倍數定義。
- 波動度 Guide：只解釋結果分布與起伏，不承接最高倍數。
- 賠付機制 Guide：解釋中獎組合如何成立，不解釋贏分上限。
- 最高倍數 Guide：只教讀懂數值、標籤、基準與證據。

頁面可交叉連結，但 frontmatter 不應為了交叉提及而把一篇文章宣告成另一個 Data Topic。

## 10. 內容風險與禁止敘述

文章不得：

- 把最高倍數寫成中獎機率、命中率或實際可得回報。
- 暗示倍數越高就越容易贏、越值得玩或更適合某類玩家。
- 把最高倍數、RTP 與波動度混成同一指標。
- 對缺少投注基準的數字自行換算。
- 把單一符號、Bonus、Multiplier 或 Feature 上限當成整局 Max Win。
- 把 Max Exposure 寫成理論最高值，或把理論最高值寫成模擬常見值。
- 因不同 RTP 版本存在，就推定最高倍數也不同。
- 把 `Winning ratio` 無條件翻成與 `Max Win` 完全相同。
- 使用第三方資料庫、娛樂城或搜尋摘要作精確倍數的主要證據。
- 建立最高倍數排行榜、SEO 集合頁或「哪款最好」結論。

推薦採用的固定提示語意：

> 最高倍數只描述特定規則與投注基準下的上限，不代表發生機率，也不代表單次遊戲結果。

## 11. 進入文章草稿階段的條件

### 11.1 已具備

- 30 款資料覆蓋與缺值名單已確認。
- 已有 10 款能覆蓋主要語意差異的代表案例。
- PG SOFT 的理論值、廣告值與 Max Exposure 有第一方 PDF 支持。
- ATG、BTG、Pragmatic Play、Play’n GO、NetEnt 皆有可追溯第一方頁面。
- `max-win` 已存在於 Guide Schema 與 relationship resolver。
- 文章目的、邊界、標題、description 與章節已可執行。

### 11.2 草稿時必須維持的限制

- 精確案例只引用本 Brief 已核對的第一方資料；未保存原始標籤的九款不作核心精確案例，除非先補證。
- Mahjong Ways 必須提及 2,893× Max Exposure 來自官方 PDF，並說明現有 Game 原始標籤尚未保存此值。
- Storm of Seth 2 必須保留 `Winning ratio`，不得自行提升為已完全定義的 Max Win。
- Legacy of Dead 與 Big Bass Bonanza 應作「不統一」反例。
- Guide 初稿只能使用 `relatedDataTopics: [max-win]`，狀態保持 `draft`。
- 發布前必須 Preview Review Game detail 最多三篇的排序影響。
- Explorer 是否新增 Data Topic Guide CTA 屬下一階段實作決定，不在本 Brief 內修改。

### 11.3 判定

目前具備進入文章草稿階段的條件，沒有阻止撰寫的資料 blocker。發布前仍有兩項需人工審查的產品／介面議題：

1. 接受或調整最高倍數 Guide 對 Game detail「最多三篇」組合的影響。
2. 決定 Explorer v1 是否需要補 Data Topic 的「了解概念」入口；若不補，Search、Game detail 與 Guide detail 仍可形成有效閉環。

## 12. 本階段限制與實際變更

- 只新增本 Brief。
- 未建立 Guide draft。
- 未修改 Game、Provider、Schema、relationship resolver、taxonomy、Search、Explorer 或 UI。
- 未 Build、未部署、未 Push、未 Commit。
- 未修改正式網域、Wix、DNS、301、robots、canonical 或 sitemap 政策。

## 13. 固定尾段

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_STATE: READONLY_BRIEF_COMPLETE`

`DATA_COVERAGE: 30 款 published Game；25/30（83.3%）有 maxWinMultiplier，16/30（53.3%）保存 maxWinLabelOriginal，30/30 有來源與核對日期；5 款未建立統一最高倍數。`

`TERMINOLOGY_FINDINGS: 已分離 Max Win／Maximum Win、Advertised／Theoretical Max Win、Max Exposure、Winning Ratio、x bet／original bet、coins 及單一符號／Feature 上限；不同標籤、單位與成立條件不得互相覆蓋。`

`REPRESENTATIVE_CASES: Mahjong Ways、Mahjong Ways 2、Fortune Tiger、Fortune Ox、Storm of Seth、Storm of Seth 2 – Awakening、Bonanza、Big Bass Bonanza、Legacy of Dead、Starburst。`

`RELATIONSHIP_READINESS: max-win 已存在於 Guide Schema、resolver 與 Search；可推導 25 款 Game 關聯。Explorer Data Topic 教學 CTA 尚未投影，且 Game detail 最多三篇的組合會改變，需在發布前審查。`

`CONTENT_GAPS: 九款已有統一倍數但未保存原始標籤；Mahjong Ways 尚未在 Game 原始標籤保存 2,893× Max Exposure；Winning Ratio 與 Legacy of Dead 多單位案例仍需保留原文，不可過度統一。`

`BLOCKERS: NONE_FOR_GUIDE_DRAFT；發布前需人工確認最多三篇排序影響與 Explorer Data Topic CTA 範圍。`

`FILES_CHANGED: docs/max-win-guide-v1-readonly-brief.md`

`NEXT_ALLOWED_ACTION: 人工審查本 Brief，核准後才可建立 status: draft、relatedDataTopics: [max-win] 的完整 Guide，並進行 relationship Preview Review。`

`COMMIT_ALLOWED: NO`

`PUSH_ALLOWED: NO`

`DEPLOY_ALLOWED: NO`

`HUMAN_APPROVAL_REQUIRED: YES`
