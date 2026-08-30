# Volatility Guide v1 只讀補強 Brief

> **READ-ONLY CONTENT BRIEF**
>
> 核對日期：2026-08-31
>
> 目標 Guide：`src/content/guides/volatility-explained.md`
>
> 永久 slug：`volatility-explained`
>
> 本文件只定義既有 Guide 的內容補強方向；不授權修改 Guide、Game、Schema、taxonomy、relationship、Search、Explorer、UI、測試、網址或索引政策。

## 1. 結論摘要

`volatility-explained` 應維持同一篇永久 Guide、原 slug、`published` 狀態及既有 `relatedDataTopics: [volatility]` owner。現有兩段文字的方向正確：波動度描述結果分布的起伏，原廠標籤不是跨廠商共同尺度；但正文只有約 97 個非空白字符、沒有 H2、案例或來源，尚不能回答使用者從 Game detail 的波動度欄位進入後會遇到的核心問題。

建議補強成約 1,700～2,500 個非空白繁中文字的 beginner Guide。文章應先解釋波動度是結果分布的描述，而不是「會不會贏」的預測；再說明獎金大小與出現頻率可能形成不同分布、有限遊戲期間為何可能有明顯起伏，以及 Low／Medium／High、數字分級、`LOW-MED`、`Advanced` 等原廠詞彙不能直接視為同一數學尺度。

現有 30 款 published Game 中，20 款有 `volatilityOriginal`，17 款另有 `volatilityNormalized`，10 款兩者皆缺。文章可使用多組第一方案例呈現「原廠標籤」與「Slot Hub 統一顯示值」的分工，但不能藉文章替缺值遊戲補猜分類，也不能把既有 editorial normalization 寫成廠商共同標準。

本階段不建議加入 Knowledge Diagram。波動度確實可能適合未來的分布／尺度對照圖，但目前跨廠商沒有共同數學尺度；若以假造曲線或幾次旋轉示意，容易讓讀者誤認為它是可預測的通用機率模型。正文、對照表與具名案例已足以完成 v1 補強。

## 2. 現有 Guide 有多薄

| 項目 | 現況 |
| --- | --- |
| 標題 | `波動度怎麼看？低、中、高代表什麼` |
| description | `解釋老虎機波動度標籤，以及如何避免把高波動誤解為高勝率。` |
| relationship | `relatedDataTopics: [volatility]` |
| status | `published` |
| 正文 | 兩段；約 97 個非空白字符 |
| H2／H3 | 0／0 |
| 來源連結 | 0 |
| 具名案例 | 0 |

### 2.1 建議保留

- 波動度描述結果分布的起伏，不等同勝率。
- Low／Medium／High 是相對分類，廠商標籤未必一致。
- Slot Hub 應同時保存原廠文字與統一顯示值。
- 文章不能用波動度預測下一次結果或保證某段遊戲時間的體感。

### 2.2 目前真正缺少

1. 沒有解釋「結果分布」到底包含什麼。
2. 沒有說明獎金大小、出現頻率及有限樣本起伏之間的關係。
3. 沒有區分技術語境中的 variance／standard deviation 與產品頁的 Low／High 標籤。
4. 沒有說明不同廠商量表、文字分級與門檻不可直接橫向換算。
5. 沒有交代 `volatilityOriginal` 與 `volatilityNormalized` 的不同責任。
6. 沒有說明原廠標籤存在但無法安全正規化時，為什麼仍應保留原文。
7. 沒有區分波動度、RTP、Hit Frequency、Max Win、Mechanism 與 Feature。
8. 沒有處理高／低波動度最常見的勝率、回本與短期推論。
9. 沒有說明缺值時不可從畫面、主題、最高倍數、RTP 或短期試玩反推。
10. 沒有任何具名案例、來源、核對日期或閱讀 Game detail 的實作方法。

## 3. 使用者從 Game detail 進入後最需要的答案

1. 「高」是原廠寫的，還是 Slot Hub 的統一分類？
2. 高波動度是否代表更容易中大獎、比較常中獎，或 RTP 較低？答案都不能直接成立。
3. 低波動度是否代表每段遊戲時間都平穩，或比較不會虧損？答案是否定的。
4. 原廠寫 `4/5`、`5/5`、`LOW-MED`、`Advanced` 或 `10` 時，這些值能否互相比較？
5. 為什麼同一個 Game detail 可能同時顯示「原廠波動度」和「Slot Hub 統一波動度」？
6. 只有原廠詞彙、沒有統一值時，應如何閱讀？
7. 沒有波動度欄位時，是否等於低波動或沒有起伏？答案是否定的；只表示目前沒有足夠資料。
8. 波動度與 RTP、Hit Frequency、最高倍數及 Feature 各回答什麼問題？
9. 來源、版本和核對日期為何重要；舊文件或行銷文案能否代表當前結構化產品欄位？
10. 這個標籤能否用來預測下一次或下一段 Session？不能。

## 4. 波動度應如何定義

### 4.1 技術層：結果相對平均的分散程度

英國 Gambling Commission 的 RTP 監測用語指出，遊戲波動度最常以標準差表示；標準差是 variance 的平方根，而 variance 與遊戲週期及獎項出現頻率有關。這是監管／測試語境中的技術定義，不代表每個廠商對消費者顯示的 Low／High 都公開了相同標準差或門檻。

文章應以一般語言轉述：波動度描述結果相對於平均值分散得多不多，以及有限樣本中可能出現多大起伏。它不是單一獎金表，也不是下一次結果的預測器。

### 4.2 使用者層：獎金大小與出現頻率的可能組合

權威資料以保守語氣說明：較高波動的遊戲「可能」由較大但較少見的獎項構成；較低波動的遊戲則「可能」較常出現較小獎項。文章必須保留「可能」：

- 同為高波動，不代表兩款遊戲有相同獎金頻率、Feature 結構或最大獎項。
- 同為低波動，不代表每次結果都接近平均，也不代表沒有長時間負向結果。
- 標籤只描述整體分布特徵，不能取代該款 Game Rules、Paytable 或數學文件。

### 4.3 有限遊戲期間的起伏

Gambling Commission 的監測說明指出，有限遊戲量下實際 RTP 容許偏離理論 RTP 的範圍較寬，遊戲量增加後才預期逐步接近理論值；波動度會影響這個容許範圍。文章可用來解釋「短期起伏為何存在」，但不得把監管監測模型改寫成個人 Session 的回本時間表。

### 4.4 Volatility、Variance、Risk Level 不能直接互換

- 在數學語境中，variance 與 standard deviation 有明確關係。
- 在產品頁中，`Volatility`、`Session Volatility`、`Volatility Rating`、`Risk Level` 或品牌化文字可能只是廠商自有呈現。
- 沒有公開計算方式、門檻及適用版本時，不能把不同廠商的 `High`、`4/5`、`Advanced` 或 `10` 排成一條精確共同尺度。
- Slot Hub 可以建立有限的編輯統一值協助篩選，但必須保留原廠標籤與來源，並坦白說明跨廠商可比性有限。

## 5. 30 款 published Game 資料覆蓋

### 5.1 總覽

| 結構化狀態 | 遊戲數 | 取得率 | 用途 |
| --- | ---: | ---: | --- |
| 有 `volatilityOriginal` | 20 | 66.7% | 保存原廠文字、數字量表或行銷語境 |
| 有 `volatilityNormalized` | 17 | 56.7% | Slot Hub 統一顯示與 Explorer 篩選 |
| 只有原廠值、沒有統一值 | 3 | 10.0% | 保留原文；不強行進入統一篩選 |
| 原廠值與統一值皆缺 | 10 | 33.3% | 維持缺值，不顯示波動度 CTA |

統一值分布：`low` 1 款、`medium` 4 款、`high` 9 款、`very-high` 3 款、`medium-high` 0 款、缺值 13 款。這個分布可用來交代現有樣本限制，不應做成「高低排行榜」。

17 款統一值遊戲也保留相同內容的 legacy compatibility 欄位 `volatility`；它不是另一筆原廠證據，也不應在讀者文章中作為第三種波動度概念。v1 內容仍以 `volatilityOriginal` 與 `volatilityNormalized` 的分工為準。

### 5.2 逐款盤點

| Game | Provider | 原廠欄位／原文 | Slot Hub 統一值 | 來源與判定 |
| --- | --- | --- | --- | --- |
| Big Bass Bonanza | Pragmatic Play | 缺 | 缺 | 現有官方來源未確認波動度；不推定 |
| Bonanza | Big Time Gaming | 行銷文案 `volatile`／`high-volatility thrill ride`；非結構化 stat | 缺 | 官方產品文案可保存，但不足以直接進統一尺度 |
| Cash Crew | Hacksaw Gaming | `4 / 5` | `high` | 官方遊戲頁的廠商五分量表；保存原數字 |
| Chaos Crew | Hacksaw Gaming | `5 / 5` | `very-high` | 官方 Game Data；可作同廠商量表案例，不代表跨廠商門檻 |
| Fish Tales: Double Catch Max Scatter | Booming Games | 缺 | 缺 | 官方發布資料未提供；不推定 |
| Fortune Ox | PG SOFT | `Session Volatility: Medium` | `medium` | 官方 Game Information／遊戲頁直接標示 |
| Fortune Paw | Booming Games | 缺 | 缺 | 官方發布資料未提供；不推定 |
| Fortune Tiger | PG SOFT | `Session Volatility: Medium` | `medium` | 官方 Game Information／遊戲頁直接標示 |
| Gates of Olympus 1000 | Pragmatic Play | 缺 | 缺 | 現有官方頁未取得可引用欄位；不由原作推定 |
| Gates of Olympus | Pragmatic Play | `highly volatile` | 缺 | 原廠文字存在，但統一映射未定；保留原文 |
| Gonzo’s Quest | NetEnt | 缺 | 缺 | 現有官方頁未取得可引用欄位；不由 Avalanche 玩法推定 |
| Greedy for Gold: Hold and Win | Booming Games | 缺 | 缺 | 官方發布資料未提供；不由 Hold & Win 推定 |
| Hand of Anubis | Hacksaw Gaming | `High volatility` | `high` | 官方發行摘要／遊戲庫直接描述 |
| Jump High | CQ9 Gaming | 缺 | 缺 | 現有第一方資料未提供；不由名稱或短期試玩推定 |
| Legacy of Dead | Play’n GO | 缺 | 缺 | 官方公開頁未取得可引用波動度欄位；不由 Dead Series 推定 |
| Mahjong Ways 2 | PG SOFT | `Session Volatility: Medium` | `medium` | 官方 Game Information／遊戲頁直接標示 |
| Mahjong Ways | PG SOFT | `Session Volatility: Medium` | `medium` | 官方 Game Information／遊戲頁直接標示 |
| Ragnarök Gold | Slotmill | `Very high` | `very-high` | 官方 Game list 結構化欄位直接標示 |
| Reactoonz | Play’n GO | 缺 | 缺 | 官方公開頁未取得可引用欄位；不由 Cluster Pays 推定 |
| Rich Wilde and the Book of Dead | Play’n GO | `volatilityRating: HIGH / volatility: 10` | `high` | 第一方結構資料保存雙欄位；不自行解釋 `10` 的跨遊戲門檻 |
| Shadow of Dominion | Slotmill | `High` | `high` | 官方 Game list 結構化欄位直接標示 |
| Starburst | NetEnt | 現行結構值 `3.1`；歷史第一方描述 `low-volatility` | `low` | 原始值與歷史文字皆需保留；歷史來源可達性及時期差異限制其文章用途 |
| Storm of Seth 2: Awakening | ATG Games | `Advanced` | `high` | 官方頁直接標示 `Advanced`；`high` 是 Slot Hub 編輯映射，不是官方同義宣告 |
| Storm of Seth | ATG Games | `Advanced` | `high` | 同上 |
| Sun Wu Kong | ATG Games | `Advanced` | `high` | 同上 |
| Super Ace | JILI Games | `LOW-MED` | 缺 | 官方頁直接標示；現有 enum 無一對一值，保留原文最安全 |
| Sweet Bonanza 1000 | Pragmatic Play | 缺 | 缺 | 現有官方頁未取得；不由原作推定 |
| Sweet Bonanza | Pragmatic Play | `high-volatility` | `high` | 第一方行銷／產品描述；文章需保留原文語境，不宣稱公開數學門檻 |
| Wanted Dead or a Wild | Hacksaw Gaming | `4/5` | `high` | 官方遊戲頁的廠商五分量表；保存原數字 |
| Wildhalla | Slotmill | `Very High` | `very-high` | 官方 Game list 結構化欄位直接標示 |

### 5.3 三種原廠值但無統一值的遊戲

- **Bonanza**：只有行銷式 `volatile`／`high-volatility thrill ride`，沒有結構化 volatility stat。
- **Gates of Olympus**：官方文字為 `highly volatile`，但現行資料未核准對應哪個統一 enum。
- **Super Ace**：官方 `LOW-MED` 介於現有離散值語意之間，不能強塞為 `low` 或 `medium`。

這三款仍會因 `volatilityOriginal` 取得 Game → Guide 關聯，但 Explorer 的統一波動度篩選不應納入它們。

### 5.4 十款完整缺值

Big Bass Bonanza、Fish Tales: Double Catch Max Scatter、Fortune Paw、Gates of Olympus 1000、Gonzo’s Quest、Greedy for Gold: Hold and Win、Jump High、Legacy of Dead、Reactoonz、Sweet Bonanza 1000。

「缺值」只代表目前沒有足夠的第一方證據，不等於低波動、沒有波動或資料錯誤。

## 6. 具名案例與第一方來源

文章建議使用 5～7 個主要案例，不需把 20 款全部寫成資料清單。

### 6.1 技術定義：UK Gambling Commission

可支撐：

- volatility 最常以 standard deviation 表示；variance 與 standard deviation 的數學關係。
- 高、低波動可對應不同的獎項大小／頻率分布，但只應以可能性描述。
- 有限樣本下實際 RTP 的容許偏離會受波動度影響，不能據此預測個人 Session。

來源：

- [UK Gambling Commission：Key terms for live RTP performance monitoring](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/key-terms-relating-to-live-return-to-player-performance-monitoring-of-games)
- [UK Gambling Commission：How to calculate RTP](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/how-to-calculate-return-to-player-rtp)
- [UK Gambling Commission：Gaming machine categories](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/gaming-machine-categories)

### 6.2 PG SOFT：`Session Volatility: Medium`

Mahjong Ways、Mahjong Ways 2、Fortune Ox、Fortune Tiger 的官方資料均保存 `Session Volatility: Medium`。這可解釋「原廠欄位名稱＋原廠值」如何保留，以及同一廠商在 Game Information 中使用 Low／Medium／High 的產品呈現；不能用來證明其他廠商的 Medium 有相同數學門檻。

- [PG SOFT Mahjong Ways Game Information](https://www.pgsoft.com/uploads/Games/Pdf/MahjongWays_Gameinformation_EN.pdf)
- [PG SOFT Fortune Ox Game Information](https://www.pgsoft.com/uploads/Games/Pdf/Fortune_OxGameinformation_EN.pdf)

### 6.3 Hacksaw Gaming：同廠商五分量表

Chaos Crew 官方 Game Data 列出 `Volatility: 5 / 5`；Cash Crew 與 Wanted Dead or a Wild 的既有第一方紀錄列出 `4 / 5`。這組案例適合說明數字是廠商量表，不等於公開的 standard deviation，也不應直接和 `High`、`Advanced` 或 `10` 算術換算。

- [Hacksaw Gaming Chaos Crew](https://www.hacksawgaming.com/games/chaos-crew)
- [Hacksaw Gaming Cash Crew](https://www.hacksawgaming.com/games/cash-crew)
- [Hacksaw Gaming Wanted Dead or a Wild](https://www.hacksawgaming.com/games/wanted-dead-or-a-wild)

### 6.4 Slotmill：文字分級與同名版本

Slotmill 官方 Game list 直接提供 `Volatility` 欄；Ragnarök Gold／Wildhalla 為 `Very high`，Shadow of Dominion 為 `High`。同一目錄亦可同時列出不同 RTP／Game ID 版本，但波動度文字相同；這只能證明該目錄的產品標籤，不能反推所有版本其他數學參數必然一致。

- [Slotmill official Game list](https://developer.slotmill.com/gamelist/)

### 6.5 JILI：`LOW-MED` 應保留原文

Super Ace 官方頁直接列出 `VOLATILITY: LOW-MED`。現有 Slot Hub enum 沒有 `low-medium`，因此原文存在、統一值留空是正確案例；文章不應替它選擇 `low` 或 `medium`。

- [JILI Games Super Ace](https://jiligames.com/PlusIntro/49?showGame=true)

### 6.6 ATG：`Advanced` 不是官方的 `High`

Storm of Seth、Storm of Seth 2: Awakening 與 Sun Wu Kong 官方頁均使用 `Volatility: Advanced`。Slot Hub 現行將其 normalized 為 `high`，但文章必須明確標示這是編輯映射；官方頁並未宣告 `Advanced = High`，更未公開跨廠商門檻。

- [ATG Games Storm of Seth](https://www.atg-games.com/en/games/slot/storm-of-seth)
- [ATG Games Storm of Seth 2: Awakening](https://www.atg-games.com/en/games/slot/storm-of-seth-2-awakening)

### 6.7 Play’n GO：雙欄位原文不等於通用尺度

Rich Wilde and the Book of Dead 的專案第一方紀錄保存 `volatilityRating: HIGH / volatility: 10`。適合作為「同一原廠資料也可能同時有文字與數字」的例子；除非正式技術文件公開 `10` 的完整量表與算法，文章只能保留原始標籤，不能把它與 Hacksaw `5/5` 作比例換算。

- [Play’n GO Rich Wilde and the Book of Dead](https://www.playngo.com/games/rich-wilde-and-the-book-of-dead)

### 6.8 不建議作正文主要案例

- **Bonanza、Gates of Olympus、Sweet Bonanza**：可保存第一方 `volatile`／`highly volatile`／`high-volatility` 文案，但沒有公開共同門檻；最多用於說明行銷文字與結構化 stat 的證據權重差異。
- **Starburst**：現行 `3.1` 與歷史 `low-volatility` 的時期、來源可達性與量表定義限制較多；不是本篇核心定義所需案例，不必為了湊 Low 樣本而使用。

## 7. 原廠語意與 Slot Hub 統一值的分工

### 7.1 `volatilityOriginal`

負責保存：

- 原廠欄位名與大小寫。
- 原廠數字量表或文字標籤。
- 行銷文案與結構化 stat 的差異語境。
- 第一方來源與核對日期。

它不保證能直接用於跨廠商篩選。

### 7.2 `volatilityNormalized`

現有合法值為 `low`、`medium`、`medium-high`、`high`、`very-high`，目的是提供一致顯示與 Explorer 篩選。它是 Slot Hub 編輯層，不應被文章描述為廠商共同採用的標準。

只有原廠語意能安全承接時才填；遇到 `LOW-MED`、未定義 `Advanced`、行銷式 `volatile` 或無法辨識門檻的數字時，優先保留原文並允許 normalized 留空。

### 7.3 建議讀取順序

1. 先看原廠欄位與原始標籤。
2. 再看 Slot Hub 是否提供統一顯示值。
3. 核對來源類型：Game Rules／Game Data／正式產品頁優先於行銷文案。
4. 核對遊戲版本、頁面日期與 `lastVerifiedAt`。
5. 若只有原文，接受「可辨識但不可安全統一」。
6. 若兩者皆缺，維持未知，不從其他欄位推導。

## 8. 與其他概念及 Guide 的內容邊界

| 概念 | 回答的問題 | Volatility Guide 的處理邊界 |
| --- | --- | --- |
| RTP | 大量結果下，投注總額有多少比例理論上回到玩家 | 只說明短期偏離會受分布影響；完整定義連至 `rtp-explained` |
| Hit Frequency | 某一來源定義下，得獎事件出現的頻率 | 說明它只計事件頻率，未同時描述獎金大小；不可由波動度反推 |
| Max Win | 原廠條件下的整局或特定範圍上限 | 說明上限不是分布；完整單位與範圍連至 `slot-max-win-explained` |
| 賠付機制 | 中獎組合如何成立 | 不用 Mechanism 推定波動度；連至 `slot-payout-mechanisms-explained` |
| Bonus Feature | 特定功能如何觸發與運作 | Feature 可能影響數學分布，但單看 Feature 名稱不能得出 Low／High |
| Beginner Guide | 先看哪些資料、各欄位用途 | 保留入門導覽；本篇承擔完整波動度解釋，不重寫整體閱讀順序 |

Hit Frequency 的實際定義可能因來源對「得獎事件」的計法而不同。文章只建立概念邊界，不在沒有核准第一方資料時加入跨廠商數值比較。

## 9. 必須回答的風險語言

### 9.1 高波動度不代表什麼

- 不等於比較容易獲得大獎。
- 不等於下一次更可能得獎。
- 不等於 Hit Frequency 必然較低。
- 不等於 RTP 較低。
- 不等於最高倍數較高。
- 不等於某個 Bonus Feature 更容易觸發。

它只表示原廠或 Slot Hub 對整體結果分布特徵的描述；要知道具體頻率、獎金範圍與 Feature 規則，仍須看個別來源。

### 9.2 低波動度不代表什麼

- 不保證穩定獲利、回本或每段 Session 都平順。
- 不排除連續未得獎、短期虧損或單次明顯起伏。
- 不表示 RTP 較高，也不表示遊戲「比較安全」。
- 不表示每次獎金都小或沒有高額結果。

### 9.3 絕對禁止的敘述

- 「高波動度比較容易中大獎」。
- 「低波動度適合穩定回本」。
- 「4/5 等於所有廠商的高，5/5 等於所有廠商的極高」。
- 「Advanced 是官方 High 的另一個名稱」。
- 「由 RTP、Max Win、Hit Frequency 或 Bonus Buy 可以算出波動度」。
- 「試玩幾十次即可判定一款遊戲的波動度」。
- 「沒有欄位就是低波動／沒有波動」。
- 依遊戲題材、視覺、名稱、盤面或同系列作品補猜分類。
- 以波動度提供投注、資金管理、回本或獲利策略。

## 10. 建議文章架構

1. **波動度先看一句話**：描述結果分布與起伏，不預測下一次結果。
2. **結果分布是什麼**：獎金大小、出現頻率與相對平均的分散程度。
3. **有限 Session 為何可能很不一樣**：樣本量、短期起伏與不可用個人經驗驗證分類。
4. **Low／Medium／High 應怎麼讀**：相對標籤，不是跨廠商共同門檻。
5. **數字量表與品牌詞彙**：`4/5`、`5/5`、`LOW-MED`、`Advanced`、`10` 的證據邊界。
6. **原廠值與 Slot Hub 統一值**：兩個欄位的責任、來源優先級與留空原則。
7. **RTP、Hit Frequency、Max Win 各自回答什麼**：簡潔對照表及站內 Guide 連結。
8. **高不代表容易中大獎，低不代表穩定獲利**：集中處理風險語言。
9. **在 Game detail 如何閱讀**：原文、統一值、來源、版本、核對日期及缺值。
10. **具名案例**：PG SOFT、Hacksaw、Slotmill、JILI、ATG；Play’n GO 作雙欄位補充。
11. **官方資料來源**：監管定義與第一方遊戲資料。

建議正文約 1,700～2,500 個非空白繁中文字。可合併相鄰小節，但不應刪除「不同尺度」「缺值」「指標邊界」與「非預測」四個核心責任。表格以 2～3 個為上限，避免變成廠商評級對照表或遊戲排行榜。

## 11. 建議保留、改寫與新增內容

### 11.1 保留

- 現有兩段的四個核心判斷：分布起伏、相對分類、原廠差異、非預測。

### 11.2 改寫

- 第一段擴充為技術定義與一般讀法，避免只用「起伏」循環解釋「波動」。
- 第二段拆成「原廠原文」「統一顯示」「來源／缺值」三層，避免讓 normalized 看起來像產業共同標準。
- 將「不同廠商可能不同」改成具體可操作的閱讀順序。

### 11.3 新增

- standard deviation／variance 的有限技術語境。
- 獎金大小與出現頻率的可能組合。
- 有限樣本、實際 RTP 容許範圍與個人 Session 的邊界。
- 原廠尺度案例與不能換算的原因。
- RTP、Hit Frequency、Max Win、Mechanism、Feature 對照。
- 高／低標籤的風險語言。
- Game detail 欄位、來源與核對日期閱讀方式。
- 十款缺值與三款原文-only 的資料原則。

## 12. Knowledge Diagram 評估

### 結論：本篇補強 v1 不加入

波動度可以成為未來 Knowledge Diagram 候選，但不是目前的必要條件：

- 若畫成兩條「平穩／劇烈」曲線，容易讓合成示意看起來像真實或跨廠商通用的機率模型。
- 若使用少量旋轉結果，會讓有限樣本冒充波動度證據。
- 若用 Low／Medium／High 三張卡片，只有重新排版標籤，沒有新增判讀結構。
- 現有共用 Diagram 已驗證直線、循環與判讀分支，但波動度更接近尺度／分布對照，不能硬套。

純文字、指標邊界表及原廠量表案例足以完成本篇。未來若正文發布後仍有明確理解障礙，可另做只讀 Diagram spec；前提是圖中清楚標示合成示意、沒有真實機率數字、不能推算個人結果，並通過人工內容與視覺審查。

## 13. Relationship 與 UI 現況

### 13.1 Owner 與反向關聯

- 唯一 owner：`volatility-explained`。
- 宣告維持：`relatedDataTopics: [volatility]`。
- resolver 以 `volatilityOriginal || volatilityNormalized` 判定 Game 的 `volatility` Data Topic。
- 20 款 Game 建立反向關聯；10 款兩欄皆缺時不建立。
- 17 款有 normalized 值，CTA canonical placement 為核心數據 `core-volatility`。
- Bonanza、Gates of Olympus、Super Ace 只有原廠值，CTA placement 為完整資料 `full-volatility`。
- 同一款即使同時有原廠與統一值，也只渲染一個 `volatility-explained` CTA；現行重複數為 0。

### 13.2 Search／Explorer／Knowledge Map

- Search 繼續提供 `volatility` 的「了解概念」Guide intent。
- Data Topic 沒有精確 Explorer URL，因此不得產生假的 `/games/?q=波動度`「探索遊戲」CTA。
- Explorer 的獨立結構化篩選仍為 `/games/?volatility={normalized-value}`，只使用 17 款 `volatilityNormalized`；原文-only 與缺值遊戲不進入任何類別。
- Game detail、Guide detail、Knowledge Map 與 representative games 均由既有 relationship projection 維持；本次正文補強不改動呈現邏輯。

### 13.3 Relationship 預期遷移

`NONE`。同 slug、同 published status、同 frontmatter owner 的正文補強不改變任何關聯事實、數量、排序、CTA placement 或 Search ownership。

## 14. 內容 QA 計畫

### 14.1 來源 QA

- 技術定義回到 UK Gambling Commission，不以一般 SEO 文章解釋 variance／standard deviation。
- 每個具名原廠標籤回到官方 Game page、Game Data、Game Information 或正式目錄。
- 每個案例只承擔來源直接支持的結論；不自行補公開門檻或算法。
- `Advanced → high`、歷史標籤與行銷文案必須明示為編輯映射／較低可比性，不冒充官方同義詞。
- 不以第三方分類補十款缺值，也不為 `LOW-MED` 強選 normalized 值。
- 不因同系列、相同 Provider 或相似玩法傳遞波動度。

### 14.2 內容 QA

- 清楚區分技術 volatility、產品標籤與 Slot Hub normalized 值。
- 全文檢查「可能」與「保證」語氣，避免把分布特徵寫成必然結果。
- 高／低各有一段明確禁止推論，且不提供投注策略。
- RTP、Hit Frequency、Max Win、Mechanism、Feature 各只處理邊界，不重寫既有 Guide。
- 缺值明確表示未知，不顯示為 0、低或無波動。
- 具名案例數控制在 5～7 組，不做排行榜或逐款介紹。
- 所有內外部連結逐一檢查；不可達或缺乏完整語境的來源從正文案例刪除或降為資料限制。

## 15. 未來實作的回歸計畫

文章仍為 published，未來核准補強時應在最終實際狀態執行：

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
$env:PUBLIC_SITE_ENV='preview'
npm run verify
```

其他 shell 使用等效環境變數語法；兩個變數與 `npm run verify` 不得省略。

另外驗證：

1. 資料審計仍為 30/30。
2. `volatility-explained` 仍是唯一 owner。
3. 20 款反向關聯、10 款缺值不誤連。
4. `core-volatility` 17、`full-volatility` 3、同頁重複 0。
5. Search 的「了解概念」正常，沒有假的 Data Topic Explorer CTA。
6. Explorer normalized 分布仍為低 1、中 4、高 9、極高 3；`medium-high` 0、缺值 13。
7. Game detail 核心數據與完整資料不重複 CTA。
8. Knowledge Map、Guide detail、RTP／Max Win／Mechanism／Beginner Guide 關聯無退化。
9. Astro Check 0 errors、0 warnings，Static Build、內部連結與 Preview safeguards 通過。
10. 1440×900、390×844、320×844：長標題、表格、來源清單無頁面級水平溢位。
11. Browser console errors 為 0；無 JavaScript 時正文、表格與連結完整可讀。
12. 不改現有 Typography、三篇 Knowledge Diagram 或沒有 Diagram 的 Guide 間距。

## 16. 預計未來實作檔案範圍

若 Brief 通過，最小實作原則上只允許：

- `src/content/guides/volatility-explained.md`

預期不需要修改測試。若既有測試對文章長度或精確舊文案有斷言，必須先回報並只做最小必要更新；不得順便修改 Game data、CSS、Schema、template、component、relationship resolver、Search、Explorer、Knowledge Map 或 Diagram。

## 17. 仍存在的限制與 blocker 判定

- 10／30 款完全缺少波動度資料；文章不能解決 Game data 缺值。
- 3 款只有原廠語意，無安全 normalized 值；這是資料可比性限制，不是 Schema blocker。
- 各廠商未公開共同門檻，不能建立精確跨廠商排名或換算表。
- 部分值來自行銷文字、歷史結構資料或編輯映射，證據權重不相同；文章必須分層表達。
- 本輪只重新開啟權威定義與代表性第一方頁面；沒有逐一重新擷取 30 款 Game Rules 的全部數學資料。
- Hit Frequency 在不同文件中的事件定義可能不同；沒有第一方定義時只作概念邊界。

上述限制不阻止補強正文，因文章的核心任務正是教讀者辨識標籤、尺度與缺值，而不是建立共同數學排行。

## 18. 工作流固定尾段

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_STATE: READONLY_BRIEF_COMPLETE`

`GUIDE_SLUG: volatility-explained`

`GUIDE_TITLE: 波動度怎麼看？低、中、高代表什麼`

`RELATIONSHIP_TYPE: Data Topic → volatility`

`SOURCE_STATUS: PASS_WITH_LIMITS；權威定義與代表性第一方案例足以支撐補強，未重新稽核全部 30 款的完整數學文件`

`CONTENT_GAPS: 現文僅約 97 個非空白字符；缺少結果分布、有限樣本、跨廠商尺度、指標邊界、缺值原則、案例與來源`

`DATA_COVERAGE: 原廠值 20/30、統一值 17/30、原文-only 3/30、兩者皆缺 10/30`

`PROPOSED_STRUCTURE: 11 節；核心定義 → 有限樣本 → 原廠尺度 → Slot Hub 欄位 → 指標邊界 → 風險語言 → 具名案例與來源`

`DIAGRAM_RECOMMENDATION: NOT_IN_V1；純文字與對照表足夠，避免用合成曲線冒充跨廠商通用模型`

`CONTENT_QA_RESULT: BRIEF_COMPLETE；正式 Guide 尚未修改`

`RELATIONSHIP_RESULT: KEEP_EXISTING_OWNER；20 款反向關聯、10 款缺值、重複 CTA 0`

`UI_RESULT: NOT_RUN`

`TEST_RESULTS: 只讀內容、30 款資料覆蓋、relationship resolver、UI placement 與測試預期盤點完成；未 Build`

`PUBLISHED_SIMULATION_RESULT: NOT_RUN`

`EXACT_CI_COMMAND_RETESTED: NO`

`RELATIONSHIP_EXPECTATION_MIGRATIONS: NONE`

`BLOCKERS: NONE`

`FILES_CHANGED: docs/volatility-guide-v1-readonly-brief.md`

`COMMIT_SHA: N/A`

`GIT_STATUS: Brief 未提交；既有人工審查／原型目錄維持未追蹤且不在本輪範圍`

`NEXT_ALLOWED_ACTION: 人工審查 Volatility Guide 補強 Brief，並決定是否核准修改既有 published Guide`

`COMMIT_ALLOWED: NO`

`PUSH_ALLOWED: NO`

`DEPLOY_ALLOWED: NO`
`HUMAN_APPROVAL_REQUIRED: YES`
