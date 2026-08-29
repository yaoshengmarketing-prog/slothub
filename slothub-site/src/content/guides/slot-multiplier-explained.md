---
title: 老虎機 Multiplier／倍數功能怎麼看？一般倍數、Wild Multiplier 與累積倍數的差異
description: 看懂老虎機 Multiplier 乘在哪裡、何時累積與重設，分清一般倍數、Wild Multiplier、Sticky／Locked Multiplier、Bonus 倍數與整局最高倍數。
category: mechanics
level: beginner
tags: [Multiplier, 倍數, Wild Multiplier, 累積倍數, 老虎機功能]
relatedFeatures:
  - multiplier
status: draft
publishedAt: 2026-08-29
updatedAt: 2026-08-29
---

老虎機規則寫著 `2×`、`10×` 或 `1,000× Multiplier` 時，先不要把它直接理解成「整局可以贏到投注的多少倍」。Multiplier 是一種**依遊戲規則放大指定贏分的功能**；真正重要的是它乘在哪個數值、何時生效、能否累積，以及何時重設。

同樣叫 Multiplier，不同遊戲可能採用完全不同的算法。有些只放大當次得獎，有些附在 Wild 上，有些隨連續得獎增加，也有些只在 Free Spins 或 Bonus Round 中有效。倍數功能存在，不代表遊戲更容易中獎，也不保證高倍數一定會出現。

## 先找四件事：基準、範圍、持續時間與算法

閱讀 Multiplier 規則時，可以依序問四個問題：

1. **乘數基準是什麼？** 是當次得獎、單一賠線、當前 Tumble 的合計，還是 Bonus 回合累積的贏分？
2. **影響範圍到哪裡？** 只影響一個符號、一條賠線、當前旋轉，還是整段 Bonus？
3. **會保留多久？** 當次結算後消失、連續得獎期間保留，還是鎖定數個回合？
4. **多個倍數怎麼合併？** 相加、相乘、逐次遞增，或使用遊戲自己的公式？

只看到 `10×` 而沒有這四項資訊，仍不足以判斷它對實際結算的作用。

## 一般倍數：先確認乘的是哪一段贏分

最直觀的 Multiplier，是把規則指定的贏分乘上一個數值。例如原始贏分為 20，若該規則確認套用 `3×`，結果才是 60。但「原始贏分」究竟指哪個範圍，仍要看每款遊戲的正式公式。

[Storm of Seth 2: Awakening](/games/storm-of-seth-2-awakening/) 的[官方遊戲頁](https://www.atg-games.com/en/games/slot/storm-of-seth-2-awakening)同時區分當前旋轉與全域累積倍數，並公開公式：`Current Win × (Current Spin Multiplier + Global Multiplier)`。這代表兩組倍數先相加，再套用到當前贏分；不能因畫面上同時出現兩個倍數，就假設它們彼此相乘。

因此，看到一般倍數時至少要確認：

- 官方把哪個贏分稱為 `Current Win`、`Total Win` 或其他基準；
- 倍數是在每次得獎時計算，還是在整段連鎖結束後計算；
- 是否包含其他 Wild、符號倍數或 Bonus 倍數；
- 結算後是否歸零。

## Wild Multiplier：替代功能與倍數功能要分開讀

Wild Multiplier 通常同時具有兩層規則：它可能先作為 Wild 替代一般符號組成得獎，再依規則放大那次得獎。哪些符號可以替代，以及倍數如何套用，是兩個不同問題。

[Cash Crew](/games/cash-crew/) 的 [Hacksaw Gaming 官方遊戲頁](https://www.hacksawgaming.com/games/cash-crew)說明，Multiplier symbols 是 Wild，並會套用在包含該符號的得獎賠線上。同一條得獎賠線若有多個 multiplier，該遊戲規則是讓倍數彼此相乘。

這是 Cash Crew 的明確規則，不是所有 Multiplier Wild 的共通算法。其他遊戲可能採相加、取單一數值或只對特定符號生效。閱讀時要分別確認：

- Wild 能替代哪些符號；
- 只有參與得獎組合的 Wild 才計算，還是畫面上所有倍數都會計入；
- 多個 Wild Multiplier 的合併公式；
- Scatter、Bonus 或 Jackpot 等特殊符號是否被排除。

## 累積倍數：提高的是倍率，不是中獎保證

累積或遞增 Multiplier，通常會在符合特定事件後提高，例如連續得獎、Cascade、Tumble、Avalanche，或 Bonus 進程達到指定條件。關鍵不只是「最高可到幾倍」，而是**增加條件與重設時機**。

### 連續得獎後遞增

[Mahjong Ways](/games/mahjong-ways/) 的 [PG SOFT 官方 Game Information](https://www.pgsoft.com/uploads/Games/Pdf/MahjongWays_Gameinformation_EN.pdf)將倍數列在 `MULTIPLIER` 規則中：初始為 `x1`，得獎後的後續回合依序進入 `x2`、`x3`、`x5`。這種寫法描述的是連續過程中的倍率階段，不代表每次旋轉都從最高倍率開始。

[Gonzo’s Quest](/games/gonzos-quest/) 的 [NetEnt 官方遊戲頁](https://netent.com/games/gonzos-quest/)則以 Avalanche Win Multiplier 說明：每次 Avalanche 會讓倍數增加 1；遇到未得獎旋轉後重設。基礎遊戲與 Free Fall Bonus 的上限也不同，不能只留下其中一個數字代表全部模式。

### Bonus 中持續累積

[Bonanza](/games/bonanza/) 的 [Big Time Gaming 官方遊戲頁](https://beta.bigtimegaming.com/games/bonanza)把 Free Spins 內的功能稱為 `Unlimited Win Multiplier`：每次得獎引發 reaction 後，倍數增加 1。這項累積屬於 Free Spins 規則，不應改寫成基礎遊戲每次旋轉都會持續增加。

[Gates of Olympus 1000](/games/gates-of-olympus-1000/) 的 [Pragmatic Play 官方遊戲頁](https://www.pragmaticplay.com/en/games/gates-of-olympus-1000/)則說明，Multiplier symbols 可在 spins 或 tumbles 中出現；Bonus 期間出現的數值會加入該回合的 total multiplier，再依規則套用到得獎。

這些遊戲都可稱為具有累積倍數，但觸發事件、保存期間與算法不相同。文章或資料頁不應只用「累積倍數」四個字取代正式規則。

## Sticky／Locked Multiplier：要看保留的是什麼

`Sticky` 或 `Locked` 常讓人聯想到「倍數會一直留著」，但實際可能保留的是：

- 倍數符號所在的位置；
- 倍數數值；
- 一個全域累積值；
- 指定回合內的效果；
- 某段 Cascade 或 Bonus 期間的狀態。

Storm of Seth 2 的官方資料使用 `Sticky Multipliers` 與 `Multiplier Lock & Accumulation`。其中 Lock 可讓 multiplier orbs 固定一段有限回合，並在 cascades 中維持；rare multiplier 則會隨旋轉累積，最後再依官方公式套用。這同時包含「鎖定位置」與「累積數值」，不能只寫成永久 Sticky Multiplier。

Cash Crew 的 Vault 也會啟用特定 multiplier positions，讓其在剩餘 spins 中持續作用。它證明位置型保留是可能的，但不代表所有帶 Sticky 名稱的遊戲都採用相同持續時間或結算方式。

所以遇到 Sticky／Locked Multiplier，要回到規則確認：保留對象、起訖條件、回合上限，以及重新觸發是否延長或重設。

## 特定 Bonus 倍數：不要套回基礎遊戲

有些倍數只屬於特定 Free Spins 或 Bonus 進程。

[Big Bass Bonanza](/games/big-bass-bonanza/) 的 [Pragmatic Play 官方發布資料](https://www.pragmaticplay.com/en/news/pragmatic-play-turns-fishing-to-spins-in-big-bass-bonanza/)說明，Free Spins 中收集 Fisherman symbols 會推進 Bonus Feature，加入額外 spins 與 multipliers，該 Bonus Round 的進程倍率最高可達 10×。這個 10× 是 Bonus 進程的一部分，不是整款遊戲的最高倍數，也不能用來表示一般旋轉的固定倍率。

[Jump High](/games/jump-high/) 的 [CQ9 Gaming 官方資料](https://www.cq9gaming.com/news/detail/949)提到 Free Game 中的 accumulating multiplier；[Super Ace](/games/super-ace/) 的 [JILI Games 官方遊戲頁](https://jiligames.com/PlusIntro/49?showGame=true)則把 Multiplier 列為特殊功能，並描述連續消除與 Free Game 中的倍數差異。這些資料能確認倍數功能與所屬階段，但若官方公開頁沒有完整公式，就不應自行補上運算細節。

## 多個倍數到底相加還是相乘？

沒有一個適用所有老虎機的答案。

- Cash Crew 的官方規則明確指出，同一得獎賠線上的多個 multiplier 彼此相乘。
- Storm of Seth 2 的公開公式把 Current Spin Multiplier 與 Global Multiplier 相加後，再乘上 Current Win。
- 其他遊戲可能先累積一個 total multiplier，或在特定 Tumble／Bonus 結束後才結算。

因此，不應看到 `2×` 與 `3×` 就直接寫成 `6×` 或 `5×`。只有規則明確交代組合方式時，才能計算結果。

## Multiplier 與最高倍數、RTP、波動度的差異

| 資料 | 回答的問題 | 不能代表什麼 |
| --- | --- | --- |
| Multiplier | 某個符合規則的贏分如何被放大 | 不代表整局上限或觸發機率 |
| [最高倍數](/guide/slot-max-win-explained/) | 特定規則與投注基準下，整款遊戲上限可到哪裡 | 不代表容易達成或勝率較高 |
| [RTP](/guide/rtp-explained/) | 長期理論回報比例 | 不預測單次旋轉或倍數何時出現 |
| [波動度](/guide/volatility-explained/) | 結果分布與起伏的相對特徵 | 不等於 Multiplier 數值或最高倍數 |

一個 Bonus 的單次 Multiplier 可能很高，但仍不等於整局 Max Win。反過來，一款遊戲具有較高整局上限，也不表示 Multiplier 更常觸發。這些欄位應分開閱讀。

多 RTP 版本也不代表倍數規則一定不同。若官方只調整數學設定，Multiplier 的顯示與流程可能不變；若不同版本連規則也不同，必須有第一方資料明確證明，不能只憑 RTP 數字推測。

## 看規則時的快速檢查清單

看到 Multiplier 時，依序確認：

1. 原廠使用的完整名稱與原文。
2. 倍數乘的是哪個贏分基準。
3. 它屬於一般旋轉、Wild、連鎖過程，還是特定 Bonus。
4. 觸發與增加條件。
5. 多個倍數的合併公式。
6. 保留多久、何時重設。
7. 不同模式是否有不同上限。
8. 該數字是 Feature 上限，還是第一方資料已確認的整局最高倍數。

Multiplier 可以讓遊戲結算方式更有變化，但它只描述規則的一部分。先看懂基準、範圍、持續時間與算法，再搭配 RTP、波動度、最高倍數及完整資料來源，才不會把一個醒目的 `×` 誤讀成勝率或結果保證。
