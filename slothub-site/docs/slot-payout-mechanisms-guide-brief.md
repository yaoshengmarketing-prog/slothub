# 「老虎機賠付機制怎麼看」內容 Brief

文件狀態：`CONTENT BRIEF — DRAFT GUIDE SUPPORT`

建立日期：2026-08-29
對應 Guide slug：`slot-payout-mechanisms-explained`

## 1. 內容任務

以一篇整合型繁體中文 Guide，回答使用者在遊戲資料中看到 Paylines、Ways to Win、Megaways、Cluster Pays 與 Pay Anywhere 時，應如何判斷「一般中獎組合是依什麼規則成立」。文章不比較哪種機制比較容易贏，也不把機制、RTP、波動度或最高倍數混為同一件事。

## 2. 使用者問題

- 賠線、Ways、Megaways、Cluster Pays、Pay Anywhere 差在哪裡？
- Ways 或 Megaways 後面的數字是固定值、上限，還是當次盤面狀態？
- Scatter 出現在畫面上，是否代表遊戲採 Scatter Pays？
- Cascading、Tumble、Avalanche 是否是另一種中獎機制？
- Bonus 階段改變規則時，是否代表一款遊戲有多個並列主要 Mechanism？

## 3. 內容邊界

必須：

- 先定義 Mechanism，再分別解釋五種已結構化機制。
- 保存原廠的固定數字、最低門檻與 `up to` 上限語意。
- 明確區分 Scatter symbol、Cascading 類 Feature 與主要 Mechanism。
- 使用站內遊戲作短例證，但不寫成遊戲推薦或六款遊戲介紹。
- 所有精確規則以廠商官方遊戲頁、規則或正式產品資料為準。

不得：

- 宣稱某種機制比較容易中獎、比較好或比較適合投注。
- 把 Megaways 最大 Ways 當成每次固定 Ways。
- 把 Cluster Pays 的最低符號門檻放進 `winCount`。
- 把 Scatter Feature 推定成 Scatter Pays。
- 把 Cascading／Tumble／Avalanche 當成第二個主要 Mechanism。
- 把 Bonus 階段特殊規則直接升級成多 Mechanism Schema 的證據。

## 4. 站內覆蓋與案例

| Mechanism | Published Game 數 | 文章主要案例 | 核對重點 |
| --- | ---: | --- | --- |
| Paylines | 15 | Starburst、Big Bass Bonanza、Gonzo’s Quest | 明確線路、方向與線數仍以各遊戲規則為準。 |
| Ways to Win | 4 | Mahjong Ways、Jump High、Super Ace | 相鄰轉輪條件與 Ways 數字的語意。 |
| Megaways | 1 | Bonanza | 動態盤面；官方寫 `up to 117,649 ways to win`。 |
| Cluster Pays | 3 | Reactoonz、Hand of Anubis | 相鄰符號形成群集；最低五個符號是門檻，不是固定組合數。 |
| Pay Anywhere | 4 | Sweet Bonanza、Gates of Olympus | 指定數量同符號可在畫面不同位置計獎；不等於 Scatter Pays。 |

## 5. 第一方證據

- [NetEnt Starburst 官方遊戲頁](https://netent.com/games/starburst/)：5×3、最多 10 條賠線；Wild 協助形成 paylines。
- [PG SOFT Mahjong Ways 官方英文規則](https://www.pgsoft.com/uploads/Games/Pdf/MahjongWays_Gameinformation_EN.pdf)：5 軸、4 列、1,024 Ways。
- [CQ9 Gaming Jump High 官方遊戲說明](https://site.cq9gaming.com/guides/52)：官方繁中名稱「跳高高」，並明列 243 路及由左至右的相鄰轉輪條件。
- [JILI Games Super Ace 官方遊戲頁](https://jiligames.com/PlusIntro/49?showGame=true)：官方欄位標題為 Paylines，數值明列 `1024 ways`。
- [Big Time Gaming Bonanza 官方遊戲頁](https://www.bigtimegaming.com/games/bonanza)：Megaways 與 `up to 117,649 ways to win`；另將 cascading reel system 描述為搭配功能。
- [Play’n GO Reactoonz 官方遊戲頁](https://www.playngo.com/games/reactoonz)：7×7 grid；五個以上相同外星人形成 cluster，得獎符號移除後由新符號補入。
- [Hacksaw Gaming Hand of Anubis 官方發布資料](https://www.hacksawgaming.com/news/new-game-release-april-summary)：官方描述為 5×6 cascading cluster-based slot。
- [Pragmatic Play Sweet Bonanza 官方遊戲頁](https://www.pragmaticplay.com/en/games/sweet-bonanza-slot/)：8～12 個以上相同符號在 tumbling reels 的任意位置成立獎項；4～6 個 Scatter 觸發 Bonus。
- [Pragmatic Play Gates of Olympus 官方遊戲頁與內嵌規則](https://www.pragmaticplay.com/en/games/gates-of-olympus/)：相同符號總數判定得獎；Tumble 另列為 Feature。官方發布稿存在混合術語，因此文章不以發布稿中的 paylines／clusters 字樣額外推導第二或第三 Mechanism。
- [Pragmatic Play Big Bass Bonanza 官方遊戲頁](https://www.pragmaticplay.com/en/games/big-bass-bonanza/)：5×3、10 條賠線，另有 Scatter 觸發的 Bonus Round，適合說明 Scatter Feature 不等於 Scatter Pays。

## 6. 建議結構

1. 先找 Mechanism，不先看最高倍數。
2. 五種 Mechanism 快速對照表。
3. Paylines。
4. Ways to Win。
5. Megaways。
6. Cluster Pays。
7. Pay Anywhere。
8. 三個常見誤判：Scatter、Cascading 類 Feature、Bonus 特殊規則。
9. 實際閱讀遊戲資料的四步驟。
10. 官方來源。

## 7. 關聯宣告

```yaml
relatedMechanisms:
  - paylines
  - ways-to-win
  - megaways
  - cluster-pays
  - pay-anywhere
status: draft
```

不宣告 `relatedFeatures`、`relatedDataTopics`、`relatedGames` 或 `relatedProviders`。Guide 發布後，五個 Mechanism 各自形成獨立 Explorer CTA；不合成 AND query。

## 8. 驗收標準

- 五種 Mechanism 都有清楚、互斥且不過度延伸的解釋。
- 所有精確數字都保留固定值、最低門檻或上限的原始語意。
- 文中不出現勝率、容易贏、推薦投注或主觀最佳機制結論。
- 模擬 published 時，五種 Mechanism 的 Explorer、Game detail、Guide detail 與 Search 雙意圖關聯成立。
- 恢復 draft 後，公開 relationship index、搜尋、路由、sitemap 與靜態輸出均不含新 Guide。
