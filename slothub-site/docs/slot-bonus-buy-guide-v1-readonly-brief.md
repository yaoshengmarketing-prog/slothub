# Slot Hub「老虎機 Bonus Buy 怎麼看」Guide v1 只讀 Brief

> 文件性質：READ-ONLY BRIEF
>
> 工作流狀態：`READONLY_BRIEF_COMPLETE`
>
> 關聯類型：`Feature -> bonus-buy`
>
> 資料核對日期：2026-08-30
>
> 本文件不是 Guide 建立、既有 Guide 所有權移交、Game 資料修正、程式修改、Commit、Push 或部署授權。

## 1. 治理依據與本輪邊界

本 Brief 依下列已核准文件與目前 Repository 實際狀態建立：

- `docs/slot-hub-master-blueprint-v1.md`
- `docs/guide-content-workflow-v1.md`
- `docs/guide-game-relationship-v1-readonly-spec.md`
- 現有 30 款 `published` Game、10 篇 `published` Guide、Guide Schema、relationship resolver、Search、Explorer 與 Game detail presentation

產品負責人已核准本題進入 `TOPIC_SELECTED`。本輪只盤點資料、來源、搜尋意圖、內容邊界與關聯影響，並建立本 Brief；不建立 Guide Markdown，不修改任何既有內容或程式。

## 2. 結論摘要

### 2.1 主題是否具備獨立內容厚度

具備。現有 30 款公開遊戲中有 12 款標記 `bonus-buy`，涵蓋至少五種需要向讀者分清的情況：

1. 以固定投注倍數直接購買 Free Spins。
2. 同一遊戲提供不同價格、進入不同或不同等級 Bonus 的選項。
3. 購買後由規則決定進入哪一種 Bonus，而不是保證某一種結果。
4. `Fast Track` 等廠商品牌名稱實際扮演直接進入 Bonus 的入口。
5. Bonus Buy 與 Ante Bet、Boost／Enhanced Bet 同時存在，但兩者不是同一功能。

現有 `slot-terms-glossary` 只有一段簡短定義，無法充分解釋投注基準、不同購買方案、進入功能、版本差異與不保證結果等問題。新 Guide 因此不是術語表的重複擴寫，而是可獨立承接搜尋意圖的完整教學。

### 2.2 第一方證據結論

- 12 款現有 `bonus-buy` 標記都有第一方資料支持直接購買／直接進入 Bonus 的功能事實。
- 5 款公開到可辨識的價格與投注基準：Bonanza、Fish Tales: Double Catch Max Scatter、Gates of Olympus 1000、Greedy for Gold: Hold and Win、Storm of Seth 2: Awakening。
- 7 款只公開到功能存在或原廠名稱，未公開足以引用的價格、投注基準或完整選項規則。
- 沒有任何一款可因本次盤點直接宣稱 Bonus Buy 在所有市場、所有營運版本或所有 RTP 版本都可用。
- 沒有發現需立即移除標記的遊戲；但多款仍有「功能成立、細節缺值」的資料完整度問題。

### 2.3 關聯所有權建議

若人工核准進入 Guide draft，建議新 Guide `slot-bonus-buy-explained` 接管 `bonus-buy` 的唯一結構化 owner；`slot-terms-glossary` 保留正文中的簡短術語定義，但移除 `relatedFeatures: [bonus-buy]`。這屬於修改既有 published Guide frontmatter 的所有權移交，必須另經人工核准，不能由本 Brief 自動執行。

## 3. 搜尋意圖

### 3.1 主要使用者問題

使用者搜尋「Bonus Buy」「功能購買」「買免費旋轉」「Buy Feature」「Bonus Buy 100 倍」時，主要想知道：

- 這個按鈕買到的是什麼功能，而不是買到哪個結果。
- `100×` 是乘 total bet、base bet、original bet、stake，還是原廠另有定義。
- 不同價格是否進入不同 Bonus、不同 Free Spins 或不同等級模式。
- Bonus Buy 與自然落出 Scatter 觸發 Free Spins 有何差異。
- Ante Bet、Boost+、Enhanced Bet 是否等於直接購買 Bonus。
- 同名遊戲在不同市場、版本或 RTP 模式是否可能沒有同一入口。
- 購買成本是否代表回報、勝率或單次結果較好。

### 3.2 文章不得承接的意圖

文章不得回答或暗示：

- 哪一種 Bonus Buy 最划算或最容易回本。
- 哪款遊戲的購買功能最容易獲利。
- 價格越高就保證進入更高獎金結果。
- Bonus Buy 會提高單次勝率、RTP 或保證觸發後有獲利。
- 可用購買成本推導投注策略、勝率或推薦下注金額。

## 4. 現有文章與重複風險

### 4.1 `slot-terms-glossary`

現任結構化 owner：

```yaml
relatedFeatures:
  - bonus-buy
```

正文目前只用一段話說明 Bonus Buy 是以指定投注倍數直接進入獎勵功能，並提醒不應描述成提高獲利的方法。這段適合保留為快速查詢定義，但不足以承接成本基準、不同購買方案、Ante Bet 邊界、版本可用性與逐款證據。

若新 Guide 發布，術語表正文可保留簡短定義及未來指向完整 Guide 的一般內鏈；不得再保留結構化 `bonus-buy` owner，否則 Search、Explorer、Game detail 與 Knowledge Map 會同時出現兩篇「了解概念」。

### 4.2 其他既有 Guide

- `slot-symbols-and-features` 只把 Bonus Buy 說明為進入部分獎勵功能的另一種入口，目前手動連到術語表。若所有權移交，這個正文連結是否改指新 Guide，需在後續內容實作核准中明確列出；本 Brief 不修改。
- `slot-payout-mechanisms-explained` 解釋中獎組合如何成立。Bonus Buy 是進入 Feature 的方式，不是主要賠付 Mechanism。
- `slot-multiplier-explained` 解釋倍數如何套用。購買價格的 `100× bet` 是成本表達，不等於遊戲中的 Multiplier Feature。
- `slot-cascading-tumble-avalanche-explained` 解釋中獎後符號更新。Bonus Buy 可能進入含 Cascading 的 Bonus，但兩者不是同一功能。
- `slot-symbols-and-features` 承接 Free Spins；新文只說明「自然觸發」與「購買入口」的差異，不重寫 Free Spins、Scatter 或 Wild 的完整規則。

重複風險可控，前提是新 Guide 聚焦「入口、價格基準、進入功能、版本差異與證據判讀」，術語表維持短定義，且結構化 owner 保持唯一。

## 5. 30 款 published Game 資料覆蓋

### 5.1 數量與欄位一致性

- 公開遊戲：30 款。
- `features` 含 `bonus-buy`：12 款，占 40.0%。
- `bonusBuy: true`：12 款，與 Feature 標記完全一致。
- `bonusBuy: false`：1 款（Starburst），且未標記 `bonus-buy`。
- `bonusBuy` 未填：17 款，且均未標記 `bonus-buy`。
- 沒有 `features: bonus-buy` 與 `bonusBuy: false` 的直接衝突。

`bonusBuy` 未填只能解讀為「目前沒有結構化結論」，不能自動改寫成「官方確認沒有 Bonus Buy」。

### 5.2 已標記的 12 款

| Provider | 遊戲 |
| --- | --- |
| ATG Games | Storm of Seth、Storm of Seth 2: Awakening、Sun Wu Kong |
| Big Time Gaming | Bonanza |
| Booming Games | Fish Tales: Double Catch Max Scatter、Greedy for Gold: Hold and Win |
| Hacksaw Gaming | Chaos Crew、Wanted Dead or a Wild |
| Pragmatic Play | Gates of Olympus 1000 |
| Slotmill | Ragnarök Gold、Shadow of Dominion、Wildhalla |

### 5.3 未標記的 18 款

Big Bass Bonanza、Cash Crew、Fortune Ox、Fortune Paw、Fortune Tiger、Gates of Olympus、Gonzo’s Quest、Hand of Anubis、Jump High、Legacy of Dead、Mahjong Ways、Mahjong Ways 2、Reactoonz、Rich Wilde and the Book of Dead、Starburst、Super Ace、Sweet Bonanza、Sweet Bonanza 1000。

本 Brief 不查證或改判這 18 款是否在其他市場版本具有購買功能；缺少標記也不得由 Free Spins、Bonus Game 或相似作品名稱反推。

## 6. Bonus Buy 遊戲逐款第一方證據

判定用語：

- `CONFIRMED`：第一方來源可確認直接購買入口、價格基準及主要進入功能。
- `CONFIRMED_PARTIAL`：第一方來源足以支持標記，但價格、選項、進入功能或版本條件仍有缺值。
- `DATA_FIX_REQUIRED`：現有標記缺少可引用第一方證據或與第一方資料衝突。此次沒有遊戲落入此類。

| Game／Provider | 現有標記 | 官方原始名稱 | 直接購買入口 | 價格／投注基準 | 購買後進入的功能 | 版本／市場限制 | 第一方來源 | 證據判定 | 是否需資料修正 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bonanza／Big Time Gaming | `bonus-buy`、`bonusBuy: true` | `Bonus Buy`、`Feature buy-in` | 是 | `90x your stake` | 12 Free Spins | 官方頁未交代逐市場限制 | [BTG 官方現行產品頁](https://beta.bigtimegaming.com/games/bonanza) | `CONFIRMED` | 不需改標記；現有資料已保存 90× stake 與 12 Free Spins |
| Chaos Crew／Hacksaw Gaming | 同上 | `Bonus Buy` | 是 | 官方公開頁未提供 | 直接進入 `bonus game` | 未公開 | [Hacksaw Gaming 官方遊戲頁](https://www.hacksawgaming.com/games/chaos-crew) | `CONFIRMED_PARTIAL` | 不需移除；價格與投注基準保持空白 |
| Fish Tales: Double Catch Max Scatter／Booming Games | 同上 | `Bonus Buy`、`Gold Bonus Buy`、`Mystery Bonus` | 是 | 75×、150×、250× `bet amount` | 官方發布稿只統稱各選項會觸發 Bonus feature，未完整交代三者各自模式 | 未公開；Boost+ 另提高功能觸發機會 | [Booming Games 官方發布稿](https://booming-games.com/news/yahdelyjxgjdh26r9i2b3dcj?t=Booming+Games+releases+Fish+Tales%3A+Double+Catch+Max+Scatter) | `CONFIRMED_PARTIAL` | 標記可保留；未來可補三個價格與原始名稱，不補猜每個選項的完整內容 |
| Gates of Olympus 1000／Pragmatic Play | 同上 | `bonus buy` | 是 | 100× `player’s bet` | 15 Free Games 的 Free Spins bonus round | 官方本頁未交代市場差異 | [Pragmatic Play 官方遊戲頁](https://www.pragmaticplay.com/en/games/gates-of-olympus-1000/) | `CONFIRMED` | 標記可保留；現有 `bonusFeatures` 尚未保存 100× 與進入內容，可列後續資料補強而非發布阻擋 |
| Greedy for Gold: Hold and Win／Booming Games | 同上 | `Mystery Bonus`、`Super Bonus`、`Boost+` | 前兩者是；Boost+ 不是直接購買 Bonus | 75×、100× `bet amount`；Boost+ 使 bet amount 增加 25% | 兩個購買選項進入各自命名的 Bonus；公開稿未完整列出選項內全部條件 | 未公開 | [Booming Games 官方發布稿](https://booming-games.com/news/gmqdb07ay3dh9a8fzzy0u66s?t=Booming+Games+releases+Greedy+for+Gold%3A+Hold+and+Win) | `CONFIRMED_PARTIAL` | 標記可保留；未來資料應把直接購買與 Boost+ side bet 分開保存 |
| Ragnarök Gold／Slotmill | 同上 | `Fast Track`（官方表格的 `Bonus buy` 欄） | 是；官方對 Fast Track 的通用定義為直接進入 Bonus features | 逐款價格與基準未公開 | 逐款進入選項未公開 | 官方表列 94%／96% 兩列都為 Fast Track；上市後認證市場列為 Sweden、Malta，但未證明所有營運版本一定開放 | [Slotmill 官方遊戲資料表](https://developer.slotmill.com/gamelist/)、[Slotmill 官方 Fast Track 說明](https://slotmill.com/games/sands-of-eternity) | `CONFIRMED_PARTIAL` | 不需移除；只可寫 Fast Track 存在，不可補猜價格或 Bonus 方案 |
| Shadow of Dominion／Slotmill | 同上 | `Fast Track` | 是 | 未公開 | 未公開 | 官方表列 94%／96% 兩列都為 Fast Track；其他限制同上 | [Slotmill 官方遊戲資料表](https://developer.slotmill.com/gamelist/)、[Slotmill 官方 Fast Track 說明](https://slotmill.com/games/sands-of-eternity) | `CONFIRMED_PARTIAL` | 不需移除；價格、基準與進入內容保持空白 |
| Storm of Seth 2: Awakening／ATG Games | 同上 | `Buy Free Games`、`Feature Buy` | 是 | 100× `your bet` | 隨機進入 Free Games 或 Awakening FreeGame | 官方頁未交代市場／版本限制 | [ATG Games 官方產品頁](https://www.atg-games.com/en/games/slot/storm-of-seth-2-awakening) | `CONFIRMED` | 標記可保留；未來可補原始名稱、100× 與隨機入口說明 |
| Storm of Seth／ATG Games | 同上 | `Buy Free Games` | 是 | 官方公開頁未提供 | Free Games | 未公開 | [ATG Games 官方產品頁](https://www.atg-games.com/en/games/slot/storm-of-seth) | `CONFIRMED_PARTIAL` | 不需移除；不得沿用續作 100× 價格 |
| Sun Wu Kong／ATG Games | 同上 | `Free Games Buy Feature` | 是 | 官方公開頁未提供 | Free Games | 未公開；`Full-Screen Reward` 是調整投注的另一模式，不得當成同一購買入口 | [ATG Games 官方產品頁](https://www.atg-games.com/games/slot/son-go-ku) | `CONFIRMED_PARTIAL` | 不需移除；後續資料應把 Buy Feature 與調整 bet 的模式分開描述 |
| Wanted Dead or a Wild／Hacksaw Gaming | 同上 | `Bonus Buy` | 是 | 官方公開頁未提供 | 官方只說直接前往其中一個 Bonus Game；未證明選項、價格或選擇方式 | 未公開 | [Hacksaw Gaming 官方遊戲頁](https://www.hacksawgaming.com/games/wanted-dead-or-a-wild) | `CONFIRMED_PARTIAL` | 不需移除；不得自行填入第三方常見價格或宣稱玩家可自由選定某一模式 |
| Wildhalla／Slotmill | 同上 | `Fast Track` | 是 | 未公開 | 未公開 | 官方表列 94%／96% 兩列都為 Fast Track；其他限制同 Ragnarök Gold | [Slotmill 官方遊戲資料表](https://developer.slotmill.com/gamelist/)、[Slotmill 官方 Fast Track 說明](https://slotmill.com/games/sands-of-eternity) | `CONFIRMED_PARTIAL` | 不需移除；價格、基準與進入內容保持空白 |

### 6.1 證據取得率

| 欄位 | 已確認 | 取得率 | 備註 |
| --- | ---: | ---: | --- |
| 第一方資料支持直接購買／直達功能 | 12／12 | 100% | Slotmill 三款由逐款 `Bonus buy: Fast Track` 加官方 Fast Track 定義共同支持 |
| 官方原始名稱 | 12／12 | 100% | 包含 Bonus Buy、Feature Buy、Buy Free Games、Fast Track 等 |
| 可引用價格及投注基準 | 5／12 | 41.7% | 不得將其他遊戲或同系列價格套用到缺值遊戲 |
| 購買後進入功能可完整辨識 | 5／12 | 41.7% | 其餘僅能確認 generic bonus、Free Games 或 Fast Track |
| 明確多價格方案 | 2／12 | 16.7% | Fish Tales 與 Greedy for Gold |
| 第一方逐款市場可用性說明 | 0／12 | 0% | Slotmill 有認證市場資料，但不等於每個營運版本都開啟 Fast Track |
| 官方明示不可用／關閉 | 0／12 | 0% | 沒有證據不能寫成「一定可用」或「一定不可用」 |

## 7. 原廠術語與價格基準差異

### 7.1 不同原廠名稱不能直接抹平

| 原廠名稱 | 本批案例 | 可確定的共同點 | 仍須保留的差異 |
| --- | --- | --- | --- |
| Bonus Buy | Bonanza、Chaos Crew、Fish Tales、Gates 1000、Wanted | 直接進入規則指定的 Bonus／Free Spins | 價格、是否多方案、是否可選模式各不相同 |
| Feature Buy | Storm of Seth 2、Sun Wu Kong | 直接進入指定 Feature | Storm 2 是隨機進入兩種 Free Game；Sun Wu Kong 公開頁只寫 Free Games Buy Feature |
| Buy Free Games | Storm of Seth、Storm of Seth 2 | 直接進入 Free Games 類功能 | 續作的 100× 與隨機 Awakening 規則不可套回原作 |
| Fast Track | Ragnarök Gold、Shadow of Dominion、Wildhalla | Slotmill 官方定義為直接進入 Bonus features | 每款價格與可選功能未公開，不能把 Fast Track 當成固定 100× |
| Mystery／Gold／Super Bonus | Fish Tales、Greedy for Gold | 多個不同價格購買入口 | 名稱不自動代表統一內容或較高價格保證較高結果 |

### 7.2 投注基準必須逐字保留

本批第一方資料至少使用：

- `stake`：Bonanza。
- `bet amount`：Fish Tales、Greedy for Gold。
- `player’s bet`／`your bet`：Gates of Olympus 1000、Storm of Seth 2。

文章可以用「投注倍數」作上位說明，但案例必須同步保留原廠基準。不得把 `stake`、`bet amount`、`base bet`、`original bet` 或 `total bet` 視為天然同義；若規則沒有定義，就不能自行換算。

## 8. Bonus Buy、Ante Bet、Enhanced Bet 與 Free Spins 的邊界

### 8.1 直接購買 Bonus／Free Spins

直接購買的核心是「支付規則指定成本，直接進入某個 Feature」。這只描述入口，不保證 Bonus 內會出現哪個獎項、是否回本或達到任何倍數。

### 8.2 Ante Bet／Boost+／Enhanced Bet

- Greedy for Gold 的 Boost+ 會增加 bet amount 25% 並提高觸發 Bonus features 的機會；它與 75×／100× 的直接購買選項並列，不能視為同一件事。
- Fish Tales 的 BOOST+ 會提高功能觸發機會，但官方發布稿未列出加價幅度；不能把其他 Booming Games 作品的 25% 套用過來。
- Sun Wu Kong 的 Full-Screen Reward 由調整投注進入，是另一投注模式；官方同頁另外列出 `Free Games Buy Feature`。

因此文章需用操作結果區分：直接跳入 Feature 才是本 Guide 的核心；增加投注、提高自然觸發機率或改變基礎模式，應保留原廠名稱並另行說明。

### 8.3 自然觸發 Free Spins

遊戲可同時允許 Scatter 自然觸發 Free Spins 與 Bonus Buy 直接進入 Free Spins。兩者進入的 Feature 可能相同，也可能有不同起始條件，但不能因遊戲有 Free Spins 就反推 Bonus Buy，也不能因有 Bonus Buy 就假設自然觸發規則消失。

### 8.4 有 Bonus 不等於可以購買

30 款中有多款具有 Free Spins、Hold and Spin 或其他 Bonus，卻未標記 `bonus-buy`。本 Brief 不以 Bonus 名稱、遊戲畫面或同系列慣例補上購買功能。

## 9. 建議 Guide 規格與文章架構

### 9.1 建議識別

- slug：`slot-bonus-buy-explained`
- 建議標題：`老虎機 Bonus Buy 怎麼看？功能購買、成本倍數與規則差異`
- 建議 description：`看懂老虎機 Bonus Buy、Feature Buy 與 Fast Track 的差異，分清購買成本的投注基準、進入功能、Ante Bet 及不同版本可用性。`
- category：`mechanics`
- level：`beginner`
- 初始 status：`draft`

若人工核准所有權移交，新 Guide 只宣告：

```yaml
relatedFeatures:
  - bonus-buy
```

不得加入 `relatedMechanisms`、`relatedDataTopics`、`relatedGames` 或 `relatedProviders`。

### 9.2 建議章節

1. Bonus Buy 是什麼：買的是進入 Feature 的入口，不是保證結果。
2. 先讀成本基準：stake、bet amount、player’s bet 與未定義基準。
3. 一個價格與多個價格：不同方案可能進入不同 Bonus。
4. Bonus Buy、Feature Buy、Buy Free Games 與 Fast Track 的名稱差異。
5. Bonus Buy 與自然觸發 Free Spins 的差異。
6. Ante Bet、Boost+、Enhanced Bet 為何不一定是 Bonus Buy。
7. 不同 RTP、版本與市場：沒有逐款證據時保持未知。
8. 用 Bonanza、Fish Tales、Gates 1000、Greedy for Gold、Storm of Seth 2 與 Slotmill Fast Track 作 5–7 個主案例。
9. 讀 Game Rules／Paytable 時的檢查清單。
10. 為何購買價格不代表勝率、回本或獲利。

文章不寫成 12 款遊戲逐一介紹，也不建立價格排行榜。

## 10. Relationship 所有權移交影響

### 10.1 現任與建議 owner

- Current owner：`slot-terms-glossary`
- Proposed owner：`slot-bonus-buy-explained`
- 建議關係：唯一 owner 移交，不並存。

正式移交需在後續人工核准範圍中同時完成：

1. 新 Guide frontmatter 加入 `relatedFeatures: [bonus-buy]`。
2. `slot-terms-glossary` 移除整個 `relatedFeatures` 欄位；正文保留短定義。
3. 不修改 Feature taxonomy、resolver 或 URL serializer。
4. 檢查 `slot-symbols-and-features` 目前手動連到術語表的 Bonus Buy 句子，另由人工決定是否改指完整 Guide；這不影響結構化 owner，但會影響讀者路徑一致性。

### 10.2 關聯數量模擬

以 proposed title、現行 30 款 Game、10 篇 published Guide、既有 resolver 及 Game detail presentation 只讀模擬：

- `Feature -> Guide`：`bonus-buy` 唯一指向新 Guide。
- `Guide -> Game`：12 款。
- `Game -> Guide`：12 款都有新 Guide 反向關聯。
- 新 Bonus Buy Guide 在 12 款頁面都位於 Feature direct 區，0 款進 overflow。
- 全站唯一 Game → Guide 關聯總數保持 166；owner slug 替換，不增加或刪除關聯事實。
- direct／overflow 總數保持 162／4；Bonanza、Gates of Olympus 1000、Storm of Seth 2、Sun Wu Kong 仍各有一篇 Symbols Guide 位於 overflow。
- 每頁新 Bonus Buy Guide 只渲染一次；沒有與術語表重複的結構化 CTA。

上述顯示位置依目前同優先級內的穩定標題排序計算。正式草稿的標題若變更，必須在 `RELATIONSHIP_PREVIEW_REVIEW` 重新跑完整 published 模擬，不可把本次模擬當成永久快照。

## 11. Search、Explorer、Game detail 與 Knowledge Map 預期

### 11.1 Search

- `Bonus Buy` 及既有 Feature aliases 應產生「了解概念」至新 Guide。
- 「探索遊戲」必須使用精確網址 `/games/?features=bonus-buy`。
- 不得使用 `/games/?q=Bonus Buy` 冒充結構化篩選。
- 術語表正文仍可由一般全文搜尋找到，但不得再產生 `bonus-buy` 的結構化「了解概念」項目。

如需新增「功能購買」「Buy Feature」「Feature Buy」「Fast Track」等 Search aliases，必須先核對共用 taxonomy alias 的影響並取得明確範圍授權；本 Brief 不修改 aliases，也不建議在 Search UI 硬編碼文章特例。

### 11.2 Explorer

- 選取 Bonus Buy 時仍篩出目前 12 款。
- Guide CTA owner 由術語表切換至新 Guide。
- query、AND 行為、重新整理、分享網址與返回狀態不變。

### 11.3 Game detail

- 12 款反向連到新 Guide。
- owner 移交前後同一遊戲的關聯原因仍是 `feature: bonus-buy`。
- 不因正文提到 Bonus、Free Spins、Ante Bet 或 Boost+ 自動建立關聯。
- 其餘 18 款不因相似文字誤連。
- 依只讀模擬，新 Guide 在 12 款均直接顯示；仍需在正式 published 模擬驗證長標題、390×844、320px、鍵盤與 details。

### 11.4 `/slots/` Knowledge Map

Knowledge Map 已將 `bonus-buy` 列為精選 Feature，並從共用 relationship index 取得 owner。移交後同一張卡應自動改連新 Guide，探索網址仍為 `/games/?features=bonus-buy`；不新增第二張卡，也不修改手寫 concept 清單。

## 12. 資料問題與阻擋事項

### 12.1 非阻擋資料缺口

- Chaos Crew、Wanted、Storm of Seth、Sun Wu Kong 與三款 Slotmill 遊戲缺少可公開引用的購買價格或投注基準。
- Fish Tales 與 Greedy for Gold 有多價格方案，但公開稿沒有完整說明每個選項內的全部規則。
- Gates 1000、Greedy、Fish Tales、Storm 2 等精確購買資料尚未完整保存到現有 Game 的 `bonusFeatures`；這是後續 Game data enrichment，不影響目前標記真偽。
- 12 款皆缺少足以斷言「所有市場／版本都可用」的逐款證據。
- Slotmill 表格顯示 94% 與 96% 版本都有 Fast Track，但不能因此推論其他廠商多 RTP 版本的購買功能也相同。

### 12.2 需要人工核准的下一階段事項

- 是否核准新 Guide 取代術語表成為 `bonus-buy` 唯一 owner。
- 是否允許在同一 Guide draft Commit 修改 `slot-terms-glossary` frontmatter。
- 是否允許把 `slot-symbols-and-features` 正文中的 Bonus Buy 手動連結改指新 Guide。
- 是否要在後續獨立 Game data correction／enrichment 任務補入已核對的價格與原廠名稱；不得混入本 Guide Commit。

### 12.3 阻擋判定

沒有阻擋文章草稿的來源缺口。12 款標記均有第一方支持，已有 5 款足以建立精確成本案例，其餘可作「官方確認功能存在、公開細節不足」的對照。

關聯所有權移交是明確人工關卡；未核准前不得建立新 Guide 並同時修改 published 術語表 frontmatter。

## 13. 第一方來源清單

- [Big Time Gaming：Bonanza 現行產品頁](https://beta.bigtimegaming.com/games/bonanza)
- [Hacksaw Gaming：Chaos Crew](https://www.hacksawgaming.com/games/chaos-crew)
- [Hacksaw Gaming：Wanted Dead or a Wild](https://www.hacksawgaming.com/games/wanted-dead-or-a-wild)
- [Pragmatic Play：Gates of Olympus 1000](https://www.pragmaticplay.com/en/games/gates-of-olympus-1000/)
- [Booming Games：Fish Tales: Double Catch Max Scatter 發布稿](https://booming-games.com/news/yahdelyjxgjdh26r9i2b3dcj?t=Booming+Games+releases+Fish+Tales%3A+Double+Catch+Max+Scatter)
- [Booming Games：Greedy for Gold: Hold and Win 發布稿](https://booming-games.com/news/gmqdb07ay3dh9a8fzzy0u66s?t=Booming+Games+releases+Greedy+for+Gold%3A+Hold+and+Win)
- [Slotmill 官方遊戲資料表](https://developer.slotmill.com/gamelist/)
- [Slotmill 官方 Fast Track 說明](https://slotmill.com/games/sands-of-eternity)
- [ATG Games：Storm of Seth](https://www.atg-games.com/en/games/slot/storm-of-seth)
- [ATG Games：Storm of Seth 2: Awakening](https://www.atg-games.com/en/games/slot/storm-of-seth-2-awakening)
- [ATG Games：Sun Wu Kong](https://www.atg-games.com/games/slot/son-go-ku)

來源只支持各列記錄的語意。搜尋摘要、娛樂城、聯盟網站、一般資料庫及 AI 回答未被用作精確價格、RTP、觸發方式或版本差異的正式證據。

## 14. 實作前測試與預期遷移清單

若人工核准進入 Guide draft，後續 `RELATIONSHIP_PREVIEW_REVIEW` 至少必須在新 Guide 保持模擬 `published` 的狀態下執行與 GitHub Actions 相同的完整命令，並驗證：

1. `slot-terms-glossary` 不再宣告 `bonus-buy`；新 Guide 是唯一 owner。
2. `featureToGuides['bonus-buy']` 精確等於 `slot-bonus-buy-explained`。
3. Guide → Game 為 12 款；12 款 Game → Guide 反向原因均為 `feature: bonus-buy`。
4. 其餘 18 款不得因 Free Spins、Bonus Game 或正文關鍵字誤連。
5. 新 Guide 12 款全部直接顯示；若正式標題造成排序改變，須如實回報 direct／overflow 新結果。
6. 全站唯一 Game → Guide 關聯維持 166、direct 162、overflow 4、遺失 0、同頁重複 0。
7. Relationship tests 將 current owner expectation 從 `slot-terms-glossary` 移至新 Guide；其他 Deferred 或既有 owner 斷言不變。
8. Relationship UI tests 將 glossary Explorer URL、Game detail count 12、Knowledge Map owner URL 等預期移至新 Guide。
9. Search 同時顯示「了解概念」與精確 `/games/?features=bonus-buy`「探索遊戲」，不產生第二個結構化 owner。
10. Explorer 篩出 12 款，query、分享、重整、上一頁／下一頁與其他 Feature AND 行為不變。
11. Knowledge Map 同一概念卡改連新 Guide；不新增卡片，不改概念排序。
12. `slot-symbols-and-features` 的手動正文連結依人工決策驗證，不得由 resolver 猜測。
13. 桌機、390×844、320px、長中文標題、鍵盤、focus-visible、原生 details 與無整頁水平溢位。
14. Draft 隔離：恢復 `status: draft` 後，新 Guide 不得出現在公開路由、Search、Explorer CTA、Game detail 或 relationship index。
15. 完整資料審計、Relationship、Relationship UI、Search、Explorer、Game detail fixtures、Astro Check、Build、內部連結與 Preview safeguards。

本 Brief 階段不執行 Build、published 模擬或完整 CI；只完成只讀資料解析、第一方來源核對、relationship presentation 模擬與文件格式檢查。

## 15. 工作流固定尾段

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_STATE: READONLY_BRIEF_COMPLETE`

`GUIDE_SLUG: slot-bonus-buy-explained`

`GUIDE_TITLE: 老虎機 Bonus Buy 怎麼看？功能購買、成本倍數與規則差異`

`RELATIONSHIP_TYPE: Feature -> bonus-buy`

`SOURCE_STATUS: PASS_WITH_LIMITATIONS；12／12 現有標記有第一方功能證據，5／12 有可引用價格與投注基準，其餘精確細節保持未知`

`CONTENT_QA_RESULT: PASS；搜尋意圖、內容邊界、案例範圍、禁止敘述與來源限制已定義`

`RELATIONSHIP_RESULT: PASS_PENDING_OWNER_APPROVAL；新 Guide 可承接 12 款，須由人工核准從 slot-terms-glossary 移交唯一 owner`

`CURRENT_OWNER: slot-terms-glossary`

`PROPOSED_OWNER: slot-bonus-buy-explained`

`GAME_COVERAGE: 12／30（40.0%）；只讀模擬為 12 direct、0 overflow，總關聯 166 不變`

`DATA_ISSUES: 7 款缺可引用價格／投注基準；多款缺完整購買選項、進入功能或市場／版本可用性；沒有需立即移除的 bonus-buy 標記`

`UI_RESULT: NOT_RUN`

`TEST_RESULTS: 30 款 frontmatter 只讀核對、12 款第一方來源核對、owner 移交 relationship presentation 只讀模擬、Markdown 結構與 git diff --check 通過`

`PUBLISHED_SIMULATION_RESULT: NOT_RUN`

`EXACT_CI_COMMAND_RETESTED: NO`

`RELATIONSHIP_EXPECTATION_MIGRATIONS: 後續需將 bonus-buy owner、12 款 Guide count、Search／Explorer 與 Knowledge Map 預期由 slot-terms-glossary 遷移至 slot-bonus-buy-explained；本輪未修改測試`

`BLOCKERS: NONE；進入 Guide draft 前仍需人工核准 Brief 與既有 published Guide frontmatter 所有權移交`

`FILES_CHANGED: docs/slot-bonus-buy-guide-v1-readonly-brief.md`

`COMMIT_SHA: N/A`

`GIT_STATUS: 本 Brief 為唯一未提交檔案`

`NEXT_ALLOWED_ACTION: 人工審查 Brief`

`COMMIT_ALLOWED: NO`

`PUSH_ALLOWED: NO`

`DEPLOY_ALLOWED: NO`

`HUMAN_APPROVAL_REQUIRED: YES`
