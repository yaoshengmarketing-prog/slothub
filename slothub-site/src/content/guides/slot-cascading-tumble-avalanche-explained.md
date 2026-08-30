---
title: 老虎機連鎖消除怎麼看？Cascading、Tumble 與 Avalanche 的差異
description: 看懂得獎符號如何消除、補入並再次判定，分清 Cascading、Tumble、Avalanche、Reaction、累積倍數與 Bonus 專屬規則。
category: mechanics
level: beginner
tags: [Cascading, Tumble, Avalanche, 連鎖消除, 老虎機功能]
relatedFeatures:
  - cascading
status: published
publishedAt: 2026-08-29
updatedAt: 2026-08-29
---

老虎機規則出現 `Cascading`、`Tumble` 或 `Avalanche` 時，通常是在描述一次得獎之後，盤面如何清除符號、補入新符號，再判定有沒有下一次得獎。這類流程可統稱為連鎖消除，但不同廠商的補位方向、停止條件、倍數與 Bonus 規則不一定相同。

<figure class="guide-knowledge-diagram guide-knowledge-diagram--cycle" aria-labelledby="cascading-cycle-diagram-title">
  <figcaption id="cascading-cycle-diagram-title">
    <span class="guide-knowledge-diagram__eyebrow">循環判定</span>
    <strong>一次得獎之後，盤面如何繼續運作</strong>
    <span>用來理解共通循環；補位、停止與特殊規則仍須逐款核對。</span>
  </figcaption>
  <ol class="guide-knowledge-diagram__steps">
    <li>
      <span class="guide-knowledge-diagram__number" aria-hidden="true">01</span>
      <div>
        <span class="guide-knowledge-diagram__term">開始</span>
        <strong>得獎成立</strong>
        <p>先依主要賠付機制確認有效組合。</p>
      </div>
    </li>
    <li>
      <span class="guide-knowledge-diagram__number" aria-hidden="true">02</span>
      <div>
        <span class="guide-knowledge-diagram__term">更新</span>
        <strong>清除得獎符號</strong>
        <p>哪些符號移除或保留，必須按個別規則核對。</p>
      </div>
    </li>
    <li>
      <span class="guide-knowledge-diagram__number" aria-hidden="true">03</span>
      <div>
        <span class="guide-knowledge-diagram__term">補位</span>
        <strong>補入新符號</strong>
        <p>補位方向與排列方式依遊戲而異，不一定只由上往下。</p>
      </div>
    </li>
    <li>
      <span class="guide-knowledge-diagram__number" aria-hidden="true">04</span>
      <div>
        <span class="guide-knowledge-diagram__term">判定</span>
        <strong>再次檢查得獎</strong>
        <p>新盤面仍在原付費 spin／round 中再次判定。</p>
      </div>
    </li>
  </ol>
  <div class="guide-knowledge-diagram__decision">
    <strong>再次判定後，流程分成兩條路</strong>
    <ul class="guide-knowledge-diagram__branches">
      <li class="guide-knowledge-diagram__branch guide-knowledge-diagram__branch--continue">
        <span class="guide-knowledge-diagram__term">繼續循環</span>
        <strong>再次得獎：回到第 2 步</strong>
        <p>清除新得獎符號、補位，再次判定。</p>
      </li>
      <li class="guide-knowledge-diagram__branch guide-knowledge-diagram__branch--stop">
        <span class="guide-knowledge-diagram__term">停止</span>
        <strong>沒有得獎或符合停止條件</strong>
        <p>本次連鎖結束；停止條件仍以個別規則為準。</p>
      </li>
    </ul>
  </div>
</figure>

連鎖消除是一種 **Feature**，通常不負責決定第一個得獎組合怎麼成立。第一個組合仍可能由 Paylines、Ways to Win、Megaways、Cluster Pays 或 Pay Anywhere 判定。Feature 存在也不表示更容易中獎，更不能用來預測下一次結果。

## 先看四個步驟：得獎、清除、補入、再判定

完整的連鎖消除流程通常包含四個可分開核對的步驟：

1. **得獎成立**：先依遊戲的主要賠付機制找出有效組合。
2. **符號清除**：得獎符號依規則移除、爆開、傳送走或消失。
3. **符號補入**：空位由新符號補上；方向可能向下、由側邊進入，或採遊戲自己的排列方式。
4. **再次判定**：新盤面在同一次付費 spin／round 中重新檢查得獎；符合條件便繼續，直到沒有新的有效組合或規則指定終止。

只看到 `elimination`、`explode` 或符號移動，仍不足以確認完整 Cascading。規則還要交代補入或替換，以及新盤面會再次判定。相反地，單純的 Respin 或下一次付費旋轉也不能只因畫面再次變動，就當成連鎖消除。

## Cascading、Tumble、Avalanche 可以一起理解，但不是同一公式

| 原廠名稱 | 共同流程 | 必須另外確認 |
| --- | --- | --- |
| Cascading／Cascades／Cascading Wins | 得獎後更新盤面並可能繼續判定 | 清除範圍、補位方向、特殊符號與停止條件 |
| Tumble／Tumbling Wins | 得獎組合移除、新圖示補入並進入後續判定 | 一段 tumble sequence 如何結束，Multiplier 何時計算 |
| Avalanche™ | NetEnt 對 Gonzo’s Quest 連鎖流程的品牌名稱 | Avalanche Win Multiplier 與 Free Fall 模式的不同上限 |
| Dual Reactions™／DUELREACTION™ | Big Time Gaming 對 Bonanza 雙方向 cascading reel system 的歷史用語 | 新符號由上方與右側補入，不能簡化成一般單向下落 |

這些名稱可以放在同一篇教學中比較，但不能宣稱所有 Tumble、Avalanche 或 Cascading 都採相同方向、倍數或終止公式。Bonanza 的 `Dual Reactions™` 與 `DUELREACTION™` 都有官方歷史用法，也不應把其中一種直接當成錯字。

## 主要賠付機制先決定第一個得獎

連鎖消除要從一次已成立的得獎開始。第一個組合如何成立，仍由主要賠付機制回答：

- [Bonanza](/games/bonanza/) 先以 Megaways 判定組合，再執行 Dual Reactions。
- [Gonzo’s Quest](/games/gonzos-quest/) 先按 Paylines 判定，再觸發 Avalanche™。
- [Mahjong Ways](/games/mahjong-ways/) 先用 Ways to Win 判定，再讓得獎符號爆開並補入。
- [Reactoonz](/games/reactoonz/) 先找出 Cluster Pays 得獎群集，再移除群集並更新盤面。
- [Gates of Olympus 1000](/games/gates-of-olympus-1000/) 先按相同符號總數判定 Pay Anywhere 得獎，再進入 Tumble。

因此 Cascading 不能取代 Megaways、Paylines、Ways、Cluster Pays 或 Pay Anywhere。若要先理解這些組合如何成立，可閱讀[老虎機賠付機制怎麼看](/guide/slot-payout-mechanisms-explained/)。

## 補位不一定都是「從上方掉落」

「連鎖掉落」是常見中文說法，但不是所有遊戲都只有同一個方向。

### 向下補入

[Mahjong Ways](/games/mahjong-ways/) 的 [PG SOFT 官方 Game Information](https://www.pgsoft.com/uploads/Games/Pdf/MahjongWays_Gameinformation_EN.pdf)說明，得獎符號爆開後，上方符號會 `cascade down`；盤面再進入新的判定，直到沒有新的得獎組合。[Mahjong Ways 2](/games/mahjong-ways-2/) 也公開相近的爆開、補入與再次計算流程。

[Gonzo’s Quest](/games/gonzos-quest/) 的 [NetEnt 官方頁](https://netent.com/games/gonzos-quest/)則使用 Avalanche™：得獎圖示爆開，空位再由新圖示補上。

### 雙方向補入

[Bonanza](/games/bonanza/) 的 [Big Time Gaming 官方資料](https://beta.bigtimegaming.com/games/bonanza)把 Dual Reactions 描述為雙方向 cascading reel system。得獎符號消失後，新符號可由上方及右側進入，因此不能把它改寫成所有符號都只會垂直下落。

### 傳送或其他清除方式

[Reactoonz](/games/reactoonz/) 的 [Play’n GO 官方頁](https://www.playngo.com/games/reactoonz)描述得獎外星符號被傳送移除，新符號再由上方補入。這裡的 Cluster Pays 負責找出得獎群集，傳送與補入則屬後續 Cascading 流程。

文章或資料頁只能依第一方規則寫出已確認的方向。若官方只說符號消除，沒有公開補位方式，就不應自行補成「由上方掉落」。

## 同一次 spin 的連續判定，不是免費增加付費旋轉

連鎖中的下一次盤面判定通常仍屬原本那次付費 spin／round。它可能在畫面上看起來像再轉一次，但不代表玩家又下了一次新投注，也不等同 Free Spin 或 Respin。

PG SOFT 的 Mahjong Ways 文件會使用 `new round` 描述連鎖中的下一次計算。這裡要配合完整流程理解：符號爆開、補入並重新計獎，直到沒有新的得獎。不能只把 `new round` 抽出來，改寫成額外贈送一次付費 spin。

停止條件也不是全產業共用公式。常見情況是新盤面沒有得獎便結束，但個別遊戲可能另有特殊符號、保留位置、階段上限或 Bonus 專屬條件。正式規則沒有說明時，不應替遊戲補上一個通用終止算法。

## Multiplier 可能隨連鎖變化，但不是 Cascading 本身

有些遊戲會把連續判定與 Multiplier 綁在一起，但「清除與補入」和「倍數如何計算」仍是兩層規則。

[Gonzo’s Quest](/games/gonzos-quest/) 的 Avalanche Win Multiplier 會隨連續 Avalanche 增加，遇到未得獎旋轉後重設；基礎遊戲與 Free Fall 的上限不同。

[Gates of Olympus 1000](/games/gates-of-olympus-1000/) 的 [Pragmatic Play 官方頁](https://www.pragmaticplay.com/en/games/gates-of-olympus-1000/)說明 Multiplier symbols 可在 spins 或 tumbles 中出現，Bonus 期間另有 total multiplier 的累積與套用方式。

[Sweet Bonanza](/games/sweet-bonanza/) 的 [Pragmatic Play 官方頁](https://www.pragmaticplay.com/en/games/sweet-bonanza-slot/)則保留 `tumbling reels` 與 `tumbling sequence` 語境；Bonus 中的 multiplier 要依該序列規則結算。

這些案例不能推成「每次 Cascade 都一定加倍」。沒有 Multiplier 的連鎖遊戲仍可具有 Cascading；具有 Multiplier 的遊戲也不一定靠連鎖累積。倍數的基準、保存時間、算法與重設方式可另參考[老虎機 Multiplier／倍數功能怎麼看](/guide/slot-multiplier-explained/)。

## Bonus 專屬規則不能套回基礎遊戲

同一款遊戲可能只在 Free Spins 或特定 Bonus 中開啟連鎖，或在 Bonus 中使用不同倍數。

[Sun Wu Kong](/games/sun-wu-kong/) 的 [ATG Games 官方頁](https://www.atg-games.com/games/slot/son-go-ku)明確把 `multi-round cascades` 放在 Free Games 語境；因此可以確認 Bonus 模式具有連鎖，但不能反推基礎遊戲也採完全相同流程。

[Storm of Seth 2: Awakening](/games/storm-of-seth-2-awakening/) 的 [ATG Games 官方頁](https://www.atg-games.com/en/games/slot/storm-of-seth-2-awakening)同時描述 Cascading／Tumbling、Multiplier Lock／Accumulation 與 Awakening 專屬 cascade-phase。閱讀時要分開一般判定、連鎖階段、Sticky／rare multipliers、Global Multiplier 與 Bonus 專屬條件。

只要模式不同，就要分別保留觸發條件、倍數與終止規則，不能用 Bonus 中最醒目的效果代表整款遊戲。

## Reaction、chain reaction 與 elimination 何時不能直接當同義詞

`Reaction` 在 Bonanza 的品牌名稱中有明確語境，但一般英文 reaction 也可能只表示某事件發生後的反應。`chain reaction` 可能描述多次得獎，也可能像 Reactoonz 的 Gargantoon 一樣，用來描述多個 Feature 被連續觸發。兩者都不適合自動升格為全產業的 Cascading 同義詞。

`elimination`、`explode` 或 `teleported away` 只證明符號被清除。若要建立 Cascading 結構化關聯，還要確認：

- 空位是否由新符號補入或替換；
- 新盤面是否在同一付費回合重新判定；
- 規則適用於基礎遊戲、Bonus，還是兩者；
- 是否有不同的停止或 Multiplier 條件。

若第一方資料只公開消除與累積倍數，Slot Hub 會保留原廠文字與來源，但不會自行補造缺少的流程。

## 看官方規則時的快速檢查清單

看到 Cascading、Tumble、Avalanche 或相似名稱時，依序確認：

1. 第一個得獎由哪種主要賠付機制成立。
2. 哪些符號會被清除，特殊符號是否保留。
3. 空位如何補入，方向是否有第一方證據。
4. 新盤面是否仍在同一次付費 spin／round 重新判定。
5. 連鎖何時終止。
6. Multiplier 是否存在，如何累積、結算與重設。
7. 規則是否只屬 Free Spins／Bonus。
8. 原廠名稱是共用術語、品牌名稱，還是只描述單一事件。

連鎖消除能說明一次得獎後盤面如何繼續運作，但不能告訴你下一次是否得獎。先把主要賠付機制、符號流程、連續判定、Multiplier 與 Bonus 規則分開，再回到個別遊戲的 Game Rules／Paytable，才能避免把相似動畫誤讀成同一套公式。

## 官方資料來源

- [Big Time Gaming：Bonanza](https://beta.bigtimegaming.com/games/bonanza)
- [NetEnt：Gonzo’s Quest](https://netent.com/games/gonzos-quest/)
- [PG SOFT：Mahjong Ways Game Information](https://www.pgsoft.com/uploads/Games/Pdf/MahjongWays_Gameinformation_EN.pdf)
- [PG SOFT：Mahjong Ways 2 Game Information](https://www.pgsoft.com/uploads/Games/Pdf/Mahjong_Ways_2_Gameinformation_EN.pdf)
- [Play’n GO：Reactoonz](https://www.playngo.com/games/reactoonz)
- [Pragmatic Play：Gates of Olympus 1000](https://www.pragmaticplay.com/en/games/gates-of-olympus-1000/)
- [Pragmatic Play：Sweet Bonanza](https://www.pragmaticplay.com/en/games/sweet-bonanza-slot/)
- [ATG Games：Storm of Seth 2: Awakening](https://www.atg-games.com/en/games/slot/storm-of-seth-2-awakening)
- [ATG Games：Sun Wu Kong](https://www.atg-games.com/games/slot/son-go-ku)
