# Hand of Anubis Wild／Scatter 定向只讀補證

> **TARGETED READ-ONLY VALIDATION**
>
> 本文件只核對 `Hand of Anubis` 的 `wild` 與 `scatter` Feature 是否有可引用的第一方證據。它不授權修改 Game、Schema、taxonomy、Guide relationship owner 或網站。
>
> 核對日期：2026-08-30

## 1. 核對範圍與來源層級

本次只接受：Hacksaw Gaming 官方遊戲庫、官方遊戲頁／Demo Help、正式規則或 Paytable、官方發布資料與官方影片。搜尋摘要、一般娛樂城、第三方遊戲資料庫與非官方影片只用來定位線索，不作判定來源。

實際核對：

1. [Hacksaw Gaming 官方 Games 目錄](https://www.hacksawgaming.com/games)：確認 `Hand Of Anubis`、官方 game id `1164`、官方縮圖與五格波動度標示；目錄卡片沒有公開規則文字。
2. [Hacksaw Gaming 官方 Slots 目錄](https://www.hacksawgaming.com/games/slots)：同樣收錄 `Hand Of Anubis`，但沒有獨立 `Read more` 遊戲頁或可引用的 Feature 說明。
3. [Hacksaw Gaming 官方 2022 年 4 月發行摘要](https://www.hacksawgaming.com/news/new-game-release-april-summary)：確認遊戲為 5×6、high volatility、cascading、cluster-based，另提到 Bonus Feature、Soul Orbs 與 multiplier 累積；全文沒有直接出現 Wild 或 Scatter 規則。
4. 從官方 Games 目錄啟動 game id `1164` 的 `Try it`。本次瀏覽器可辨識官方啟動容器，但沒有取得能穩定公開引用的 Game Rules／Paytable／Help 文字。
5. 對 Hacksaw Gaming 官方網域及可辨識的官方影片線索做定向查找；沒有找到直接描述 `Hand of Anubis` Wild 或 Scatter 的第一方公開文字或影片說明。

## 2. Wild 證據

- **已取得的第一方原文**：無直接 Wild 原文。
- **官方發布稿可確認的相鄰內容**：5×6、cascading、cluster-based、Bonus Feature、Soul Orbs、multipliers。
- **不能採用的推論**：不能因 Anubis 角色、盤面圖示、一般老虎機慣例、第三方規則整理或畫面外觀，推定某個符號是 Wild。
- **判定**：`WILD_NOT_VERIFIED_BY_CITABLE_FIRST_PARTY_SOURCE`。

## 3. Scatter 證據

- **已取得的第一方原文**：無直接 Scatter 原文。
- **官方發布稿可確認的相鄰內容**：只確認 Bonus Feature 存在，沒有說明觸發符號或將任何符號稱為 Scatter。
- **不能採用的推論**：不能因遊戲具有 Bonus、Cluster Pays，或第三方頁面描述三個符號觸發 Bonus，就自動建立 Scatter Feature。
- **判定**：`SCATTER_NOT_VERIFIED_BY_CITABLE_FIRST_PARTY_SOURCE`。

## 4. 與現有資料的差異

現有 `src/content/games/hand-of-anubis.md` 使用：

```yaml
features: [wild, scatter, cascading]
```

其中 `cascading` 可由官方發行摘要直接支持；`wild` 與 `scatter` 在本次允許的第一方公開來源中都沒有取得可引用證據。這是 Game data evidence gap，不是 Guide 內容或 relationship resolver 的錯誤。

補證完成當時，relationship index 會因這兩個既有 tags，讓 `Hand of Anubis` 反向連到 `slot-symbols-and-features`。因此當時提出人工資料決策，並依該階段的只讀邊界沒有直接修改資料或關聯結果。

## 5. 補證階段提出的資料建議

- `cascading`：保留；官方發行摘要有直接證據。
- `wild`：建議在人工核准後移除，除非先取得正式 Game Rules／Paytable／官方 Demo Help 的直接原文。
- `scatter`：建議在人工核准後移除，除非先取得正式 Game Rules／Paytable／官方 Demo Help 的直接原文。
- 若核准修正，應建立獨立 Game data correction Commit，不得混入 Guide 內容 Commit。

## 6. 人工決策與修正結果

- 2026-08-30，人工核准移除缺乏第一方直接證據的 `wild` 與 `scatter`。
- `Hand of Anubis` 現行資料已修正為：

  ```yaml
  features: [cascading]
  ```

- `slot-symbols-and-features`（Symbols Guide）的反向關聯已移除。
- `slot-cascading-explained`（Cascading Guide）的關聯維持。
- Game data correction Commit：`5a324d14f417f7f7513ed28d0d23d2b0cb5687ef`（補證紀錄 amend／rebase 前的歷史 SHA；重寫後的最終 SHA 以 Git 歷史與結案回報為準）。

## 7. 最終工作流狀態

- `SOURCE_STATUS: PARTIAL`：Wild／Scatter 未取得第一方直接證據，Cascading 已確認。
- `HUMAN_DECISION: APPROVED_REMOVE_UNVERIFIED_FEATURES`
- `GAME_DATA_RESULT: features 已由 [wild, scatter, cascading] 修正為 [cascading]`
- `RELATIONSHIP_RESULT: Symbols Guide 關聯移除；Cascading Guide 關聯保留`
- `GUIDE_CONTENT_IMPACT: NONE`：Guide 使用其他已核對案例，不引用 Hand of Anubis 作 Wild／Scatter 案例。
- `GAME_DATA_DECISION_REQUIRED: NO`
- `CURRENT_STATE: CLOSED`
