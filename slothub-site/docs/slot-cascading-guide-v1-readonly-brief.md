# Slot Hub「老虎機連鎖消除怎麼看」Guide v1 只讀 Brief

> 文件性質：READ-ONLY BRIEF
>
> 工作流狀態：`READONLY_BRIEF_COMPLETE`
>
> 人工核准主題：`Cascading／Tumble／Avalanche 連鎖消除`
>
> 關聯類型：`Feature -> cascading`
>
> 資料核對日期：2026-08-29
>
> 本文件不是 Guide draft、既有 Guide 所有權移交、測試修改、程式修改、Commit、Push 或部署授權。

## 1. 治理依據與本輪邊界

本 Brief 依下列已核准文件與現行程式事實建立：

- `docs/slot-hub-master-blueprint-v1.md`
- `docs/guide-content-workflow-v1.md`
- `docs/guide-game-relationship-v1-readonly-spec.md`
- 現有 30 款 `published` Game、9 篇 `published` Guide、Guide Schema、relationship resolver、Search／Explorer 投影、Game detail 與 `/slots/` Knowledge Map

本題已由人工正式核准，並由 `TOPIC_SELECTED` 自動進入 `READONLY_BRIEF_IN_PROGRESS`。本輪只建立這一份 Brief；沒有建立 Guide draft，也沒有修改 `slot-terms-glossary`、Game、Schema、taxonomy、resolver、Search、Explorer、UI 或測試。

產品角色是 Feature Guide，不是 Mechanism 集合頁。文章要解釋得獎符號消除、補入與再次判定的流程，以及不同廠商如何把此流程命名為 Cascading、Tumble、Avalanche 或品牌專名。文章不回答哪種玩法比較容易贏，也不把連鎖流程升級為第二個主要賠付機制。

## 2. 建議 Guide 識別與搜尋意圖

### 2.1 建議識別

- 建議 slug：`slot-cascading-tumble-avalanche-explained`
- 暫定標題：`老虎機連鎖消除怎麼看？Cascading、Tumble 與 Avalanche 的差異`
- 建議 description：`看懂得獎符號如何消除、補入並再次判定，分清 Cascading、Tumble、Avalanche、Reaction、累積倍數與 Bonus 專屬規則。`
- category：`mechanics`
- level：`beginner`
- 未來初始 status：`draft`

預定 frontmatter 關聯只能是：

```yaml
relatedFeatures:
  - cascading
```

不得加入 `relatedMechanisms`、`relatedDataTopics`、`relatedGames` 或 `relatedProviders`。

### 2.2 主要搜尋意圖

使用者看到 Cascading、Cascades、Tumble、Tumbling、Avalanche、Reaction 或「連鎖消除」時，主要想知道：

1. 得獎符號是否會被移除、爆開、傳送走或以其他方式清除；
2. 空位由上方、側邊或重新排列的符號如何補入；
3. 新盤面是否在同一付費 spin／round 內再次判定；
4. 何時停止連鎖，何時開始下一次付費 spin；
5. 主要中獎組合仍由 Paylines、Ways、Megaways、Cluster Pays 或 Pay Anywhere 中哪一種規則成立；
6. Multiplier 是否隨每次連鎖累積，以及在未得獎或序列結束時如何重設；
7. 此流程是否只存在於 Free Spins／Bonus，或基礎遊戲也適用。

### 2.3 文章必須回答的五個分層問題

| 分層 | 文章要回答 | 不可混淆 |
| --- | --- | --- |
| 主要賠付機制 | 第一個得獎組合依 Paylines、Ways、Megaways、Cluster Pays、Pay Anywhere 或原廠特殊規則如何成立 | Cascading 本身通常不決定第一個組合如何成立 |
| 符號消除／補入流程 | 哪些得獎符號被移除，空位由哪裡補入，特殊符號是否保留 | 不能假設所有遊戲都是「由上往下」或移除全部得獎符號 |
| 連續判定 | 新盤面是否再次計獎、何時終止，以及是否仍屬同一次 spin／round | 連鎖不是額外付費 spin，也不等於 Free Spin 或 Respin |
| Multiplier 累積 | 每次 Cascade／Tumble／Avalanche 是否增加、收集或套用倍數，何時結算與重設 | 連鎖存在不代表一定有 Multiplier；Multiplier 也不是 Cascading 本身 |
| Bonus 專屬規則 | 基礎遊戲、Free Spins、Awakening FreeGame 或其他 Bonus 是否使用不同規則 | Bonus 內規則不能改寫成整款遊戲所有模式都適用 |

## 3. 原廠術語與可否視為同義

### 3.1 可放在同一教學傘下，但必須保留原名

| 原廠術語 | 可支持的共同語意 | 必須保留的差異 |
| --- | --- | --- |
| `Cascading`／`Cascades`／`Cascading Wins`／`Cascading Reels` | 得獎後清除部分符號、補入新符號並可能再次判定 | 清除範圍、補入方向、特殊符號保留與終止條件依個別規則 |
| `Tumble`／`Tumbling`／`Tumbling Wins` | Pragmatic Play 等來源用來描述得獎組合移除、由新圖示補位及序列再次判定 | Multiplier 常在 tumble sequence 結束後處理，但不是所有 Tumble 遊戲都採同一算法 |
| `Avalanche™` | NetEnt 對 Gonzo’s Quest 得獎圖示爆開、空位補入新符號的品牌用語 | 是品牌化 Feature；該遊戲另有 Avalanche Win Multiplier 與 Free Fall 模式上限 |
| `Dual Reactions™`／`DUELREACTION™` | Big Time Gaming 對 Bonanza 雙方向 cascading reel system 的品牌用語 | 新符號可從上方與右側補入，不可簡化成一般單向下落 |

上述詞彙可以在教學層歸入 `cascading` Feature，但文章應寫成「相近流程的不同原廠名稱」，不能宣稱它們在全部遊戲中具有完全相同的公式。

Bonanza 的 `DUELREACTION™` 與 `Dual Reactions™` 均有官方歷史用法；Brief 保留兩種原文，不把其中一種視為錯字修正。

### 3.2 只能視語境判斷，不能建立全域同義

| 詞彙 | 判定 | 原因 |
| --- | --- | --- |
| `Reaction` | 不作全域同義詞 | Bonanza 的 `Dual Reactions™` 是明確品牌機制，但一般 `reaction` 也可能只表示某事件觸發後的反應 |
| `chain reaction` | 不作全域同義詞 | Reactoonz 可用它描述連續得獎，也可描述 Gargantoon 觸發多個 Feature 的連鎖；兩者語意不同 |
| `elimination`／`explode`／`teleported away` | 只描述符號如何被清除 | 必須再確認是否補入新符號及再次判定，不能只因出現「消除」就自動標記 cascading |
| `drop`／`fall`／`cascade down` | 只描述補入或移動方向 | 單純符號掉落不必然代表得獎後會重複計獎 |
| `new round` | 依原廠規則解讀 | PG SOFT 用它描述同一連鎖中的下一次判定；不可自行改寫為新的付費 spin |
| `consecutive winning` | 只表示連續得獎結果 | 需搭配 elimination／replacement 規則才能完整描述 Cascading 流程 |

### 3.3 明確不是同義詞

- `Paylines`、`Ways to Win`、`Megaways`、`Cluster Pays`、`Pay Anywhere`：主要賠付機制，回答第一個得獎組合如何成立。
- `Free Spins`：額外回合；可以包含 Cascading，但不是 Cascading。
- `Respin`：重新轉動或重轉 Feature；不應因畫面再次變動就等同連鎖消除。
- `Multiplier`：放大規則指定贏分的 Feature；可能由連鎖累積，但不是消除／補入流程。
- `Bonus Buy`：進入 Bonus 的方式；不是 Cascading。
- `Cluster Pays`：群集如何成立得獎；Reactoonz 與 Hand of Anubis 可同時具有 Cluster Pays 與 Cascading，但兩者負責不同階段。

## 4. 現有 13 款關聯遊戲核對

### 4.1 統計與資料模型事實

- 30 款公開 Game 中，`features` 含 `cascading` 者為 13 款。
- 只有 7 款同時具有 subtype `cascading-reels`：Gates of Olympus、Gates of Olympus 1000、Mahjong Ways、Mahjong Ways 2、Storm of Seth 2: Awakening、Sweet Bonanza、Sweet Bonanza 1000。
- Guide 關聯以 `features: cascading` 為唯一結構依據，不以 subtype、正文關鍵字或 `bonusFeatures` 推測。
- 目前資料標記的 13 款涵蓋 8 家 Provider；其中 12 款有足夠第一方證據確認 `cascading`，Super Ace 仍待補強。另有 17 款目前未標記 `cascading`；若以「證據尚未確認為 cascading」計算，則為 18 款（17 款未標記加 Super Ace 1 款 unresolved）。

### 4.2 逐款核對結論

| 遊戲 | 主要賠付機制 | 第一方原名與規則語境 | Multiplier／Bonus 邊界 | `cascading` 判定 |
| --- | --- | --- | --- | --- |
| Bonanza | Megaways | `Dual Reactions™`／cascading reel system；得獎符號消失後，新符號從上方與右側補入 | Free Spins 每次得獎 reaction 會令 win multiplier 增加；不能套到所有基礎回合 | **保留**；明確且是雙方向特殊案例 |
| Gates of Olympus | Pay Anywhere | 官方使用 `Tumble`／tumbling wins；相同符號總數先成立得獎，再進入 Tumble | multiplier symbols 與 Free Spins 另有累積規則 | **保留**；Tumble 是 Feature，不是 Pay Anywhere 本身 |
| Gates of Olympus 1000 | Pay Anywhere | 得獎組合移除，由新圖示從盤面上方補入 | multiplier 可在 spins／tumbles 出現；tumble sequence 與 Bonus total multiplier 必須分開 | **保留**；流程與終止序列明確 |
| Gonzo’s Quest | Paylines | `Avalanche™`；Payline 得獎圖示爆開，空位由新符號補入 | 每次 Avalanche 增加倍數，未得獎 spin 重設；Free Fall 上限不同 | **保留**；品牌化同類 Feature 的主要案例 |
| Hand of Anubis | Cluster Pays | 官方明列 `5x6 cascading cluster-based slot` | 官方公開摘要沒有足夠細節支持額外算法 | **保留**；標籤直接，但文章只作 Cluster Pays／Cascading 邊界案例 |
| Mahjong Ways | Ways to Win | 得獎符號爆開，上方符號 `cascade down`，新 round 反覆計算至無新得獎 | 金色符號轉 Wild、倍率列另屬附加規則 | **保留**；A1 規則完整 |
| Mahjong Ways 2 | Ways to Win | 與一代同樣明列得獎符號爆開、上方符號補入並重複計獎 | Gold Plated 轉 Wild 與 increasing multiplier 需獨立解釋 | **保留**；A1 規則完整 |
| Reactoonz | Cluster Pays | 得獎 cluster 被傳送移除，新外星符號由上方補入，可在同一 round 形成多次得獎 | Gargantoon 的 `chain reaction of up to five features` 不是 Cascading 的同義定義 | **保留**；適合說明 Cluster Pays 與 Cascading 分工 |
| Storm of Seth 2: Awakening | Pay Anywhere／站內 `other` | 官方明列 6×5 `Cascading/Tumbling mechanic`；8 個以上同符號先成立得獎 | Sticky／rare multipliers、Global Multiplier 及 Awakening cascade-phase 規則需分層 | **保留**；資料適合，但不得用 Feature 修正未定案 Mechanism taxonomy |
| Sun Wu Kong | Paylines | 官方只明確說 Free Games 具有 `multi-round cascades` | Cascading 與高倍數規則屬 Free Games 語境 | **保留但標示 Bonus-only**；不得寫成基礎遊戲也具有相同循環 |
| Super Ace | Ways to Win | 官方公開頁使用 `elimination of consecutive winning`；官方影片說明只提 combos 與 higher multiplier。兩者均未確認消除後補入／替換符號及同一付費回合內再次判定 | Free Game 倍率與主遊戲不同；未取得可引用的補位流程、補位方向或同回合重判規則 | **UNRESOLVED_RELATIONSHIP_EVIDENCE**；不得以現有來源支持 `cascading` 結構化關聯 |
| Sweet Bonanza | Pay Anywhere | 官方寫 `tumbling reels`、`tumbling sequence`；8–12+ 同符號先成立獎項 | Bonus 中 multiplier 在 tumble sequence 結束後合併 | **保留**；需分開 Pay Anywhere、Tumble 與 Bonus multiplier |
| Sweet Bonanza 1000 | Pay Anywhere | 同符號落下後 `sets off tumbles`；官方保留 tumble sequence 語境 | Bonus candy bomb multipliers 在 tumbles 中留存並於序列後結算 | **保留**；與原作相近但精確倍數規則不同 |

### 4.3 13 款是否全部適合的結論

結論：**不能再宣稱 13/13 全部通過；證據確認覆蓋為 12 款，Super Ace 為 `UNRESOLVED_RELATIONSHIP_EVIDENCE`。**

- 11 款有第一方明確的 Cascading、Tumble、Avalanche、Dual Reactions、移除／補入或 cascading cluster 描述，可直接支持 Feature 關聯。
- Sun Wu Kong 的 Cascading 明確限於 Free Games；關聯可成立，但 Guide 與 Game 反向關聯文案不能暗示基礎遊戲也相同。因此證據確認總數為 12 款。
- JILI 官方產品頁原文為 `Accumulated multipliers via elimination of consecutive winning` 與 `Free Game is no exception and double multipliers than the main game`；其嵌入的 JILI GAMES 官方影片說明只提 `Getting more combos ... higher multiplier`。這些原文可支持 elimination、連續得獎、倍率累積與 Free Game 倍率差異，仍不足以證明消除後補入／替換符號及同一付費回合內重新判定。官方 Demo 入口本輪可開啟，但停在載入錯誤，未取得可引用的 Game Rules 或 Paytable；因此也不補造任何補位方向。

本 Brief 不修改 Super Ace Game、Schema、taxonomy 或 relationship resolver。正式移交 `cascading` 所有權前，必須另行核准遊戲資料修正，或取得能完整證明補入／替換與同回合重判的更強 JILI 第一方證據。若後續要求關聯 CTA 顯示每款遊戲的模式限定理由，現行 resolver 只有 concept 層級 reasons，仍屬資料模型或 UI 新決策。

## 5. 第一方來源與原文語境

### 5.1 主要來源

| 廠商／遊戲 | 可支持的敘述 | 第一方來源 |
| --- | --- | --- |
| Big Time Gaming／Bonanza | `Dual Reactions™` 是雙方向 cascading reel system；新符號可由上方與右側補入；Free Spins 的 reaction 會推進 multiplier | [BTG 官方 Bonanza 頁](https://www.bigtimegaming.com/games/bonanza)、[BTG 現行產品頁](https://beta.bigtimegaming.com/games/bonanza) |
| Pragmatic Play／Gates of Olympus 1000 | 得獎組合移除並由上方新圖示補入；multiplier 可在 spins 與 tumbles 出現，序列與 Bonus 累積規則分開 | [官方遊戲頁](https://www.pragmaticplay.com/en/games/gates-of-olympus-1000/) |
| Pragmatic Play／Gates of Olympus | Pay Anywhere、tumbling wins 與 multiplier／Free Spins 是不同規則層 | [官方遊戲頁](https://www.pragmaticplay.com/en/games/gates-of-olympus/?cur=USD&gamelang=en)、[官方發布稿](https://www.pragmaticplay.com/en/news/pragmatic-play-aims-for-the-heavens-in-gates-of-olympus/) |
| NetEnt／Gonzo’s Quest | Payline 得獎觸發 `Avalanche™`，圖示爆開並補入；每次 Avalanche 推進 multiplier，未得獎 spin 重設 | [NetEnt 官方遊戲頁](https://netent.com/games/gonzos-quest/) |
| Hacksaw Gaming／Hand of Anubis | 官方直接描述為 5×6 cascading cluster-based slot | [Hacksaw Gaming 官方發布摘要](https://www.hacksawgaming.com/news/new-game-release-april-summary) |
| PG SOFT／Mahjong Ways | 得獎符號爆開，上方符號 cascade down；重複計獎直到沒有新得獎 | [PG SOFT 官方英文 Game Information](https://www.pgsoft.com/uploads/Games/Pdf/MahjongWays_Gameinformation_EN.pdf) |
| PG SOFT／Mahjong Ways 2 | 得獎符號爆開、上方符號補入新 round，並持續計算至無新組合 | [PG SOFT 官方英文 Game Information](https://www.pgsoft.com/uploads/Games/Pdf/Mahjong_Ways_2_Gameinformation_EN.pdf) |
| Play’n GO／Reactoonz | 得獎 cluster 移除，新符號由上方補入，在同一 round 產生多次得獎；另有不同語意的 Feature chain reaction | [Play’n GO 官方 Reactoonz 頁](https://www.playngo.com/games/reactoonz)、[官方回顧](https://www.playngo.com/posts/reactoonz-review) |
| ATG Games／Storm of Seth 2 | 6×5 Cascading／Tumbling、Pay Anywhere、Multiplier Lock／Accumulation 與 Awakening 專屬 cascade-phase 規則 | [ATG Games 官方遊戲頁](https://www.atg-games.com/en/games/slot/storm-of-seth-2-awakening) |
| ATG Games／Sun Wu Kong | Free Games 具有 multi-round cascades；公開頁未宣稱基礎遊戲相同 | [ATG Games 官方遊戲頁](https://www.atg-games.com/games/slot/son-go-ku) |
| JILI Games／Super Ace | 原文只支持 `elimination of consecutive winning`、累積 multiplier 與 Free Game double multipliers；官方影片說明只支持 more combos／higher multiplier。均未證明補入／替換符號及同一付費回合內重新判定，故為 `UNRESOLVED_RELATIONSHIP_EVIDENCE` | [JILI Games 官方遊戲頁](https://jiligames.com/PlusIntro/49?showGame=false)、[官網嵌入的 JILI GAMES 官方影片](https://www.youtube.com/watch?v=nFuNcPce02Q)、[JILI 官方 Demo 入口](https://jiligames.com/PlusTrial/49/en-us) |
| Pragmatic Play／Sweet Bonanza | tumbling reels 與 tumble sequence；Bonus multiplier 於序列結束後處理 | [官方遊戲頁](https://www.pragmaticplay.com/en/games/sweet-bonanza-slot/?cur=eur&gamelang=en) |
| Pragmatic Play／Sweet Bonanza 1000 | 同符號得獎觸發 tumbles；Bonus multiplier 在 tumbles 中留存並於序列後合併 | [官方遊戲頁](https://www.pragmaticplay.com/en/games/sweet-bonanza-1000/)、[官方發布稿](https://www.pragmaticplay.com/en/news/pragmatic-play-sweetens-up-candyland-in-sweet-bonanza-1000/) |

### 5.2 來源使用限制

- PG SOFT PDF 與具完整遊戲規則的官方頁優先作 A1 規則證據。
- 官方產品頁或發布摘要可證明原廠名稱與功能存在，但若沒有完整清除、補入、終止或倍率公式，不得自行補寫。
- Gates of Olympus 的官方行銷頁曾混用 paylines、clusters 與 Pay Anywhere 字樣；本文只用可核對的組合判定與 Tumble 語境，不以行銷文字修改既有 Mechanism taxonomy。
- JILI 與 ATG 的行銷語言含有主觀或結果導向措辭；正式文章只抽取功能規則，不引用「更容易」「巨大回報」等宣傳結論。
- 本 Brief 不使用搜尋摘要、娛樂城、聯盟網站、AI 回答或無來源文章作正式證據。

## 6. 與現有 Guide 的重複與內容邊界

### 6.1 `slot-terms-glossary`

現況：

```yaml
relatedFeatures: [cascading, bonus-buy]
```

正文的 Cascades 小節只有簡短定義：得獎符號移除、新符號補入，並指出 Tumbles／Avalanche 等名稱。這段文字仍然正確，適合作為術語表的快速查詢，不需要因所有權移交而刪除或重寫。

若新 Guide 後續取得所有權移交核准，術語表應只修改 frontmatter 為：

```yaml
relatedFeatures:
  - bonus-buy
```

舊正文可以保留簡短定義，未來可增加一條指向新 Guide 的一般內部連結，但不能繼續宣告 `cascading` 正式所有權。正文連結不是本 Brief 的必要實作，也未在本輪獲准。

### 6.2 `slot-payout-mechanisms-explained`

現有文章已正確區分 Cascading／Tumble／Avalanche 通常是 Feature，而 Paylines、Ways、Megaways、Cluster Pays、Pay Anywhere 負責一般中獎組合。新 Guide 應延續此邊界，不能重寫五種 Mechanism 的完整教學。

### 6.3 `slot-multiplier-explained`

現有文章已使用 Bonanza、Gonzo’s Quest、Gates of Olympus 1000、Storm of Seth 2 等案例說明連鎖如何影響 Multiplier。新 Guide 應把重點放在消除、補入、連續判定與停止條件，只用 Multiplier 作一個分層章節，並連回既有 Multiplier Guide，不重複其一般、Wild、Sticky／Locked、Bonus 與運算公式完整內容。

### 6.4 搜尋意圖所有權

- 新 Guide：承接 Cascading／Tumble／Avalanche「連鎖消除流程」的主要搜尋意圖。
- 術語表：保留快速定義，不再是 `cascading` 的正式關聯入口。
- 賠付機制 Guide：承接「第一個中獎組合如何成立」，只簡短說明 Cascading 不是第二個 Mechanism。
- Multiplier Guide：承接「倍數乘在哪裡、如何累積與重設」，只在需要時引用連鎖流程。

同一概念不得同時由新 Guide 與術語表持有 published frontmatter 所有權。resolver 不會自行挑主要文章，因此所有權移交是後續固定人工關卡。

## 7. 結構化關聯與產品投影

### 7.1 正反向關聯

若新 Guide 日後 published 且術語表完成所有權移交：

- `Feature -> Guide`：`cascading` 唯一指向 `slot-cascading-tumble-avalanche-explained`。
- 證據確認的 `Guide -> Game`／`Game -> Guide` 集合為 12 款；不在 Guide frontmatter 手抄遊戲清單，且 Super Ace 在取得更強證據或另行核准資料修正前不得算入確認集合。
- 現行 Game 資料仍有 13 款標記 `features: cascading`，因此 resolver 若不修改會機械推導 13 款並包含 Super Ace。這是待人工處理的資料／證據落差，不代表 13 款均已通過來源審查。
- 非 `cascading` 遊戲不得因正文提到 Tumble、Reaction、Multiplier 或 Bonus 而產生關聯。
- `cascading-reels` subtype 不建立第二份關聯，也不取代 `features: cascading`。

### 7.2 精確 Explorer URL

預期 URL：

```text
/games/?features=cascading
```

此 URL 已由現行 `gamesIndexUrl()` serializer 與 `conceptExplorerUrl('feature', 'cascading')` 精確支援，不需要 URL schema、resolver 或 Explorer 修改。不得用 `?q=Cascading`、`?q=Tumble` 或其他文字搜尋網址冒充結構化條件。

在 Super Ace 資料未另行修正前，此 URL 依現況仍會回傳 13 款；證據確認集合則是 12 款。正式移交所有權前必須先消除這個落差。

### 7.3 Search 雙意圖

新 Guide published 時，現行共用投影應產生：

1. 「了解概念」→ 新 Guide 永久頁。
2. 「探索遊戲」→ `/games/?features=cascading`。

現有 taxonomy 已包含 `Cascading`、`Avalanche`、`Tumble`、`連鎖消除`、`連鎖掉落` aliases。`Reaction` 不應在本題自動加入 taxonomy，因它不是跨遊戲穩定同義詞；若未來要新增品牌專名或更多 Search aliases，屬 taxonomy／Search 決策，需另行核准。

### 7.4 Guide detail 代表遊戲

依現行 resolver 的 `editorialFeatured`、資料完整度與名稱穩定排序，若以目前資料模擬 published，前六款代表遊戲為：

1. Storm of Seth 2: Awakening
2. Mahjong Ways
3. Mahjong Ways 2
4. Bonanza
5. Sun Wu Kong
6. Sweet Bonanza

這只是穩定資料投影，不是熱門排行或編輯推薦。文章正文不需要依此順序手抄案例；正式內容應依教學差異選擇 Bonanza、Gonzo’s Quest、Mahjong Ways、Reactoonz、Gates of Olympus 1000 等代表案例。

## 8. Game detail 最多三篇的實際排序影響

本 Brief 以暫定標題、新 slug、`status: published` 的只讀假設，以及術語表移除 `cascading` 所有權進行 resolver 模擬。結果如下：

- 以來源證據可確認的反向 relationship 為 12 款；現行未修改 resolver 仍會機械推導 13 款，額外一款為 unresolved 的 Super Ace。
- 只有 **Reactoonz** 會在目前 Game detail 前三篇直接顯示新 Guide。
- Reactoonz 目前前三篇為：賠付機制 Guide → Multiplier Guide → 術語表；移交後第三篇改為新 Cascading Guide。
- 其餘 11 款已確認遊戲的前三篇目前已由 Mechanism 與 Data Topic／其他較前排序的 Feature Guide 佔滿，因此關係成立但不會直接露出。
- Super Ace 目前機械投影的前三篇仍為賠付機制、最高倍數、波動度，新 Guide 本來就不會露出；將它排除於證據確認集合不改變任何已確認遊戲的前三篇結果。
- 由於新舊所有者都屬 Feature 優先層，已確認的 12 款中主要可見變化仍只有 Reactoonz 第三篇的目標與文案替換。

逐款前三篇模擬：

| 遊戲 | 移交後目前前三篇 | 新 Guide 是否可見 |
| --- | --- | --- |
| Bonanza | 賠付機制、最高倍數、波動度 | 否 |
| Gates of Olympus 1000 | 賠付機制、最高倍數、Multiplier | 否 |
| Gates of Olympus | 賠付機制、波動度、Multiplier | 否 |
| Gonzo’s Quest | 賠付機制、最高倍數、RTP | 否 |
| Hand of Anubis | 賠付機制、最高倍數、波動度 | 否 |
| Mahjong Ways 2 | 賠付機制、最高倍數、波動度 | 否 |
| Mahjong Ways | 賠付機制、最高倍數、波動度 | 否 |
| Reactoonz | 賠付機制、Multiplier、新 Cascading Guide | **是** |
| Storm of Seth 2: Awakening | 最高倍數、波動度、RTP | 否 |
| Sun Wu Kong | 賠付機制、最高倍數、波動度 | 否 |
| Super Ace | 賠付機制、最高倍數、波動度 | 否；`UNRESOLVED_RELATIONSHIP_EVIDENCE`，不計入 12 款確認集合 |
| Sweet Bonanza 1000 | 賠付機制、最高倍數、Multiplier | 否 |
| Sweet Bonanza | 賠付機制、最高倍數、波動度 | 否 |

證據確認集合的結果為 12 款有關聯、1 款目前可見、11 款在顯示上限之外；目前資料的機械投影則仍是 13 款有關聯、1 款可見、12 款在上限之外。正式所有權移交前，必須先取得更強證據或另行核准 Super Ace 遊戲資料修正；本 Brief 不授權修改 resolver／UI 排序。

## 9. `/slots/` Knowledge Map

`/slots/` 的 `knowledgeConcepts` 已明列 `{ type: 'feature', value: 'cascading' }`，實際 Guide、description 與連結由共用 relationship index 取得。

因此所有權移交後應：

- 保留 Cascading Knowledge Map 卡片與現有位置，不增加或刪除概念。
- 「了解概念」自動改指向新 Guide。
- 「探索遊戲」維持 `/games/?features=cascading`。
- 卡片摘要自動改用新 Guide description。
- 不修改 `/slots/` 精選清單、版面或排序。

結論：**Knowledge Map 應維持現況，只驗證共用投影已切換所有者；不需要 UI 程式修改。**

## 10. Relationship、UI、Search 與 Explorer 預期遷移

以下是後續若人工核准 Guide draft 與既有 published Guide 所有權移交時，必須同步調整的測試預期；本輪沒有修改測試。

### 10.1 `scripts/verify-guide-relationships.mjs`

- `slot-terms-glossary.relatedFeatures` 預期由 `['cascading', 'bonus-buy']` 改為 `['bonus-buy']`。
- 新 Guide 必須只宣告 `relatedFeatures: ['cascading']`。
- 在新 Guide 模擬 `published` 時，`featureToGuides.cascading` 必須恰好是新 slug，且不能同時包含術語表。
- 正式遷移前先處理 Super Ace 證據／資料落差：若取得更強證據，預期為 13 款；若另行核准移除其 `cascading` 資料，預期為 12 款。不得在現行資料仍推導 13 款時把測試硬改成 12 款來掩蓋落差。
- 17 款目前未標記 `cascading` 的 Game 不得被正文、subtype 或 bonusFeatures 誤連；Super Ace 另列 unresolved，不直接改判為非 cascading。
- 最多三篇的證據確認預期為 12 款有關聯、1 款目前可見、11 款在顯示上限之外；現況機械投影則為 13／1／12。正式採用哪組預期取決於上述證據或資料處理結果。
- 既有 Bonus Buy 所有權與其他仍 deferred Feature 的空關係斷言必須保留。
- 新 Guide 回復 `draft` 後不得進入 published relationship index；若術語表所有權已在同一未 Push draft Commit 移除，`cascading` 暫時沒有 published owner 是合法的本機 draft 狀態。

### 10.2 `scripts/verify-guide-relationship-ui.mjs`

- 載入並檢查新 Guide 模擬 published 頁：3–6 款代表遊戲與 `/games/?features=cascading` CTA。
- 術語表不再輸出 Cascading Explorer CTA，但仍保留 Bonus Buy CTA。
- Search DOM id 的 owner slug 由 `slot-terms-glossary` 改為新 slug：`learn-feature-cascading-...` 與 `explore-feature-cascading-...`。
- Search 仍需命中 `Cascading`、`Avalanche`、`Tumble`、`連鎖消除`、`連鎖掉落`；不得因所有權移交丟失既有 aliases。
- Reactoonz Game detail 第三篇由術語表換成新 Guide；其他 11 款已確認遊戲不應出現非預期前三篇變動。Super Ace 的機械投影前三篇仍不含 Cascading Guide，但不能因此視為關聯證據已通過。
- `/slots/` Knowledge Map 的 Cascading 卡片應保留，Guide href 與摘要改由新 Guide 投影，Explorer href 不變。

### 10.3 `scripts/test-search.mjs`

- 現有檔案主要測遊戲名稱排序，沒有 Cascading owner 硬編碼，預期不需修改。
- 正式關聯 Search 所有權仍由 relationship UI 驗證涵蓋；若新增獨立 relationship search 單元測試，必須使用共用投影，不寫第二份 mapping。

### 10.4 `scripts/test-game-explorer.mjs`

- `features=cascading` 的篩選、跨 facet AND 與文字搜尋 fixture 不因 Guide owner 變更而改變，預期不需修改。
- 既有 PG SOFT + Ways + Wild + Cascading + RTP 的 AND fixture 應繼續回傳 2 款。
- `連鎖消除`／`Cascading` 的探索搜尋入口與精確 URL 應維持。現況資料集合為 13 款；若後續另行核准 Super Ace 資料修正，Explorer／Search 集合及相關精確數量預期才同步改為 12 款。

### 10.5 其他完整驗證

- `verify-build.mjs`、`verify-game-detail.mjs`、`check-links.mjs` 原則上不需因 owner 變更修改，但完整 `npm run verify` 仍必須在新 Guide 模擬 `published` 時執行。
- 必須保留 0／1／2／3 篇 Game detail fixture、draft 隔離、Preview safeguards、長標題與 390×844 手機檢查。
- 暫時 `published` 狀態不得 Commit；只有完整 CI 命令成功後才恢復 `draft`。

## 11. 建議內容架構

1. Cascading 是什麼：先拆成得獎、清除、補入、再判定四步。
2. Cascading、Tumble、Avalanche 為何可以一起理解、又不能當成完全相同。
3. 主要賠付機制先決定第一個得獎：Paylines、Ways、Megaways、Cluster Pays、Pay Anywhere。
4. 不同清除與補入方式：向下、雙方向、爆開、傳送、消除。
5. 同一次 spin 的連續判定與停止條件。
6. 連鎖與 Multiplier：累積、序列結算、未得獎重設。
7. Bonus-only 與模式差異：Sun Wu Kong、Gonzo’s Quest、Storm of Seth 2 等案例。
8. Reaction、chain reaction、elimination 何時不能直接當同義詞。
9. 讀官方規則的檢查清單。

建議主要案例：Bonanza、Gonzo’s Quest、Mahjong Ways、Gates of Olympus 1000、Reactoonz。Storm of Seth 2 可作複合規則案例；Sun Wu Kong 可作模式限定案例。Super Ace 在證據補強前不得作 Cascading 案例。文章不必逐一介紹全部關聯遊戲，也不建立排行榜。

## 12. 內容風險與禁止敘述

正式文章不得：

- 暗示 Cascading、Tumble 或 Avalanche 提高 RTP、勝率、獲利機會或保證連續得獎。
- 把連鎖中的「新 round」寫成免費增加一次付費 spin。
- 把 Cascading 當成每款遊戲的主要 Mechanism，或取代 Paylines／Ways／Megaways／Cluster Pays／Pay Anywhere。
- 宣稱 Tumble、Avalanche、Dual Reactions™、Reaction、chain reaction 與 elimination 在全產業完全同義。
- 假設所有得獎符號都會移除、所有新符號都從上方補入，或所有序列都持續到沒有新得獎。
- 假設每次連鎖都增加 Multiplier，或多個 Multiplier 必然相加／相乘。
- 把 Bonus 專屬 Cascading 規則寫成基礎遊戲也適用。
- 把 Reactoonz 的 Cluster Pays 或 Bonanza 的 Megaways 誤寫成 Cascading 的另一名稱。
- 依行銷文字修改 Game taxonomy、Mechanism 或 Feature。
- 建立熱門排行、最佳玩法、投注建議或結果預測。
- 把內部欄位、Agent 判定、測試狀態或工作流文字寫進讀者文章。

## 13. 是否需要新產品或工程決策

### 13.1 不需要的變更

- Schema：現有 Guide Schema 已允許 `relatedFeatures: [cascading]`。
- taxonomy：現有 Feature enum 已包含 `cascading`。
- resolver：現況可直接推導 13 款，但其中 Super Ace 與來源審查不一致；本 Brief 不修改 resolver。
- URL：現有 serializer 已精確產生 `/games/?features=cascading`。
- Search／Explorer／UI：共用投影可直接切換 owner；只需遷移硬編碼測試預期。
- `/slots/`：Knowledge Map 已包含 Cascading，應保持現況。

### 13.2 後續固定人工關卡

建立 Guide draft 前，人工必須另行核准：

1. 本 Brief 進入 `CONTENT_DRAFT_IN_PROGRESS`。
2. `slot-terms-glossary` 從 `relatedFeatures` 移除 `cascading` 的 published Guide 所有權移交。
3. 新 Guide 的最終 slug、標題與 frontmatter。
4. 所有權移交所需的 relationship／UI 測試預期遷移範圍。

本 Brief 沒有發現需要 Schema、taxonomy、resolver、URL 或 Knowledge Map UI 新設計的 blocker；但正式所有權移交前，Super Ace 必須取得更強證據，或另行核准既有遊戲資料修正。

## 14. 是否具備進入 Guide draft 的條件

結論：**本 Brief 可返回人工審查，但在 Super Ace 證據／資料落差解除前，不具備正式移交 `cascading` 所有權的條件。**

理由：

- 主題、搜尋意圖與 Feature 邊界已明確。
- 12 款可由第一方來源確認結構化關聯；Sun Wu Kong 已標示 Bonus-only，Super Ace 為 `UNRESOLVED_RELATIONSHIP_EVIDENCE`。
- 已取得涵蓋 Cascading、Tumble、Avalanche™、`DUELREACTION™`／`Dual Reactions™`、cluster cascade 與模式差異的多家第一方來源；Super Ace 的 elimination 原文不足以單獨證明完整流程。
- 新文章與賠付機制、Multiplier、術語表的主要搜尋意圖可清楚分工。
- Schema、taxonomy 與精確 Explorer URL 已能承接；resolver 現況仍會包含 unresolved 的 Super Ace，必須在移交前另行處理。
- Game detail 前三篇已分別計算證據確認集合與現況機械投影；兩者都只有 Reactoonz 可見。

已確認的 12 款中有 11 款因最多三篇規則不會在單款頁直接顯示新 Guide。這不應在本題中自行修改 resolver 或 UI。

## 15. 工作流固定尾段

`STAGE_RESULT: RETURN_FOR_SOURCE_FIX_COMPLETE；返回人工審查，不進入 Guide draft`

`CURRENT_STATE: READONLY_BRIEF_COMPLETE`

`GUIDE_SLUG: slot-cascading-tumble-avalanche-explained`

`GUIDE_TITLE: 老虎機連鎖消除怎麼看？Cascading、Tumble 與 Avalanche 的差異`

`RELATIONSHIP_TYPE: Feature -> cascading`

`SOURCE_STATUS: PASS_WITH_UNRESOLVED_RELATIONSHIP；12 款由第一方來源確認，Sun Wu Kong 限 Free Games 語境；Super Ace 為 UNRESOLVED_RELATIONSHIP_EVIDENCE，JILI 現有公開頁與官方影片不足以證明補入／替換及同回合重判，官方 Demo 本輪未能提供可引用規則`

`CONTENT_QA_RESULT: PASS；搜尋意圖、五層規則邊界、同義詞限制、案例主線與禁止敘述已定義`

`RELATIONSHIP_RESULT: HOLD_FOR_SUPER_ACE_RESOLUTION；證據確認 12 款，現況 resolver 仍機械推導 13 款；正式移交前須取得更強證據或另行核准 Super Ace 遊戲資料修正。Game detail 兩種口徑都僅 Reactoonz 可見`

`UI_RESULT: NOT_RUN；本階段不建立 Guide 或模擬 published；/slots/ Knowledge Map 應維持現況並在後續驗證 owner 投影`

`TEST_RESULTS: 只讀重算 30 款 Game：12 款證據確認、1 款 Super Ace unresolved、17 款目前未標記 cascading；已重算 resolver、Relationship／UI／Search／Explorer 與 Game detail 前三篇預期，未執行網站測試`

`PUBLISHED_SIMULATION_RESULT: NOT_RUN；本輪禁止建立 Guide draft或修改 published Guide 所有權`

`EXACT_CI_COMMAND_RETESTED: NO；READONLY_BRIEF_COMPLETE 階段不執行 npm run verify`

`RELATIONSHIP_EXPECTATION_MIGRATIONS: 已改列條件式預期：補強 Super Ace 證據則維持 13；另行核准資料修正則改為 12。不得先把測試改成 12 掩蓋現況 13；Reactoonz 前三篇與 /slots/ Knowledge Map 位置不變。本輪未修改任何測試`

`BLOCKERS: Super Ace 為 UNRESOLVED_RELATIONSHIP_EVIDENCE；阻擋正式 cascading 所有權移交，但不阻擋本修正版 Brief 返回人工審查`

`FILES_CHANGED: docs/slot-cascading-guide-v1-readonly-brief.md`

`COMMIT_SHA: N/A`

`GIT_STATUS: ?? docs/slot-cascading-guide-v1-readonly-brief.md；無其他工作目錄變更`

`NEXT_ALLOWED_ACTION: 修正 Super Ace 證據判定後返回人工審查；正式移交前另行核准遊戲資料修正或取得更強 JILI 第一方證據`

`COMMIT_ALLOWED: NO`

`PUSH_ALLOWED: NO`

`DEPLOY_ALLOWED: NO`

`HUMAN_APPROVAL_REQUIRED: YES`
