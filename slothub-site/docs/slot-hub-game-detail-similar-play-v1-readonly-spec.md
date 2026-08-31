# Slot Hub Game detail 相同玩法探索 v1 只讀規格

文件狀態：`APPROVED FOR LOCAL IMPLEMENTATION`

盤點日期：2026-08-31

目前產品依據：`docs/slot-hub-master-blueprint-v2.md`

目前工作項目：第 3 項「Game detail 相同玩法探索」第 3-1 步。

> 本文件只盤點現況、資料覆蓋與產品選項，不授權修改網站、Schema、Game data、relationship、元件、樣式或測試。

## 1. 白話摘要

Slot Hub 現在能在單款遊戲頁顯示同系列及同 Provider 遊戲，但這兩種關係不代表玩法相近。現有 30 款 published Game 已有足以做第一版探索的核心資料：30 款都有主要 `winMechanism` 與結構化 `features`。然而盤面欄位仍有缺值，`other` 也只是混合型暫存分類，因此不能把所有欄位都當成可靠的硬性配對條件。

本規格建議第一版使用「玩法相近」而不是「相同玩法」：

1. 只把主要 Mechanism 完全相同、且 Mechanism 不是 `other` 的 published Games 納入候選。
2. 排除自己、重複結果與缺少可解釋資格的遊戲。
3. 共享 Feature 與已知且相同的 `winCount` 只用來固定排序與解釋相同點，不作缺值排除或補猜；reels／rows 在 v1 完全不參與資格、排序或 reasons。
4. 最多顯示 4 張卡；不足 4 張就顯示實際數量，0 張時隱藏整區，不使用 Provider、RTP、主題或 Feature-only 結果湊數。
5. 「探索更多」使用既有精確 Mechanism URL；不建立永久集合頁，也不修改 Explorer URL schema。

這套規則下，26 款遊戲有結果，4 款沒有結果；23 款有至少 3 個結果，3 款只有 1～2 個結果。零結果是資料與 taxonomy 的真實邊界，不應被視為需要補滿的 UI 錯誤。

## 2. 使用者問題與現況

### 2.1 使用者問題

使用者讀完單款 Game detail 後，目前可往下走的路徑主要是：

- 從資料欄位或 Feature 區前往 Guide，理解概念。
- 從「關聯遊戲」前往同系列或同 Provider 遊戲。
- 加入 Compare。

缺少的路徑是：使用者已經理解這款遊戲的主要賠付方式，希望查看「核心玩法接近、但不一定同廠商或同系列」的其他遊戲。若只提供同 Provider 或同系列，容易讓人誤以為品牌／命名等於玩法；若只用 Feature，則會把不同主要賠付機制的遊戲大量混在一起。

### 2.2 現有 Game detail 結構

目前 `src/pages/games/[slug].astro` 的主要順序為：

1. 返回入口。
2. 遊戲圖片、名稱、Provider、系列、摘要及 Compare 操作。
3. 頁首核心數據與欄位情境式 Guide 入口。
4. 完整遊戲資料、Feature 標籤及缺值顯示。
5. 「看懂遊戲功能」Guide rail，含 direct／overflow。
6. 「關聯遊戲」：同系列、同 Provider。
7. 官方資料來源與最後核對資訊。

現有 Game → Guide relationship 由 published Guide frontmatter 與 resolver 推導，負責知識入口，不應被相同玩法功能改寫或取代。

### 2.3 建議插入位置

建議新增獨立的「玩法相近」區塊，放在「看懂遊戲功能」之後、「關聯遊戲」之前：

- 使用者先看完本款資料與概念說明，再進入遊戲探索。
- 玩法相近的證據強於同系列／同 Provider，因此先顯示較合理。
- 不打斷頁首身份、核心資料與 Guide 教學的既有閱讀順序。
- 不需要重新組織或改名現有「關聯遊戲」。

### 2.4 桌機與手機限制

現有 related card 桌機為兩欄、手機為單欄。第一版若沿用其圖片、名稱、Provider 與短標籤骨架，新增 4 張卡的高度可控；但必須避免在 320px 卡片上放入過多 Feature chips。建議每張卡最多顯示：

- 主要 Mechanism 1 個；
- 最多 2 個共享 Feature 或 1 個盤面相同點；
- Provider 只作身份資訊，不列為配對理由。

## 3. 30 款 published Game 資料覆蓋

### 3.1 欄位覆蓋

| 訊號 | 有值 | 缺值 | 覆蓋率 | v1 用途 |
| --- | ---: | ---: | ---: | --- |
| `winMechanism` | 30 | 0 | 100% | 主要資格門檻，但 `other` 不可用 |
| `features` | 30 | 0 | 100% | 排序與理由；不可單獨決定相似 |
| `subtypes` | 30 | 0 | 100% | 導覽分類；粒度混合，不作 v1 主條件 |
| `reels` | 27 | 3 | 90% | v1 不使用；等待未來資料正規化 |
| `rows` | 23 | 7 | 76.7% | v1 不使用；等待未來資料正規化 |
| `winCount` | 18 | 12 | 60% | 已知且語意一致時作排序／理由輔助 |
| `paylines` | 24 | 6 | 80% | 保存原文語意；格式不一，不直接字串配對 |
| `bonusBuy` | 13 | 17 | 43.3% | 不作相似主條件；Feature 已有正式 filter |
| `rtp` | 17 | 13 | 56.7% | 不代表玩法，不使用 |
| `volatilityNormalized` | 17 | 13 | 56.7% | 不代表玩法，不使用 |
| `maxWinMultiplier` | 25 | 5 | 83.3% | 不代表玩法，不使用 |

### 3.2 Mechanism 分布

| Mechanism | 遊戲數 | v1 判定 |
| --- | ---: | --- |
| Paylines | 15 | 可用，但候選很多，必須排序並限制卡片數 |
| Ways to Win | 4 | 可用 |
| Pay Anywhere | 4 | 可用 |
| Cluster Pays | 3 | 可用 |
| Megaways | 1 | 合法但沒有其他候選 |
| Other | 3 | 不可用；目前混合不同原廠語意 |

`other` 的三筆資料不能互相當作同玩法：`storm-of-seth` 與 `shadow-of-dominion` 保存 Scatter Pays 原文，`storm-of-seth-2-awakening` 則保存 Ways to Win；共同落在 `other` 只代表 taxonomy 尚未提供更精確主類別。

### 3.3 Feature 分布

| Feature | 遊戲數 | 判讀限制 |
| --- | ---: | --- |
| Multiplier | 25 | 太普遍，單獨配對會失去辨識力 |
| Free Spins | 23 | 太普遍，單獨配對會跨 Mechanism |
| Scatter | 15 | 符號／Feature，不得冒充 Scatter Pays Mechanism |
| Wild | 14 | 符號角色，不得冒充主要 Mechanism |
| Cascading | 12 | 可作相同點，但不必然是主要 Mechanism |
| Bonus Buy | 12 | 可作相同點，不代表自然觸發與購買規則相同 |
| Respins | 5 | 可作相同點，細節仍須回到單款頁 |
| Giant Symbols | 4 | 可作相同點 |
| Cash Collection | 2 | 可作相同點 |
| Hold & Spin | 1 | 沒有同 Feature 候選，不補湊 |
| Sticky Symbols | 1 | 沒有同 Feature 候選，不補湊 |
| Symbol Splitting | 1 | 沒有同 Feature 候選，不補湊 |
| Jackpot | 1 | 樣本不足，不推導類型 |

## 4. 可用與不可用的相似訊號

### 4.1 可直接用作資格

- published 狀態。
- 完全相同且不是 `other` 的 `winMechanism`。
- 当前遊戲與候選不是同一 slug。

### 4.2 只適合排序與說明

- 共享結構化 Feature；Wild 與 Scatter 不參與排序或 reasons。
- 雙方都有值時完全相同的 `winCount`。
- Free Spins 與 Multiplier 可計入一般共享 Feature，但不能超越辨識度較高的 Feature。
- v1 的辨識度較高 Feature 固定為 Cascading、Bonus Buy、Hold & Spin、Respins、Cash Collection、Giant Symbols、Sticky Symbols、Symbol Splitting、Jackpot。

這些訊號不能把候選提升成「相同規則」。例如兩款都有 Cascading 與 Multiplier，仍可能有不同觸發、累積、重置或 Bonus 規則。

### 4.3 不可用訊號

- Provider、系列、名稱、角色、主題與美術。
- RTP、波動度、最高倍數與發行日期。
- `bonusFeatures` 自由文字的關鍵字比對。
- `paylines` 原文字串直接相等或模糊字串比對。
- 缺值彼此相等。
- `other` 類別。
- AI embedding、全文猜測、編輯者主觀推薦。

### 4.4 資料粒度風險

- `reels` 同時存在 `5x3` 與完整敘述句，未先正規化前不能作硬性 filter；v1 完全不參與資格、排序或 reasons。
- `rows` 雖為數值，仍不足以代表玩法接近；v1 完全不參與資格、排序或 reasons。
- `paylines` 混合固定線數、Ways、Cluster 條件及原廠完整標籤。
- `winCount` 只有 18 款有值，且數字的語意依 Mechanism 不同。
- Feature 只表示功能存在，不描述其全部規則。
- `subtypes` 同時包含頁型與玩法類別，不能假設相同 subtype 就是相同玩法。

## 5. 三種候選規則比較

本次以 30 款 published Games 雙向模擬。統計中的「結果」已排除自己，但尚未套用畫面最多 4 張卡的上限。

### 5.1 規則 A：主要 Mechanism 完全相同

定義：`candidate.winMechanism === current.winMechanism`。

| 指標 | 結果 |
| --- | ---: |
| 有結果的遊戲 | 29 |
| 完全無結果 | 1 |
| 只有 1～2 個結果 | 6 |
| 有 3 個以上結果 | 23 |
| 全部有向候選關係 | 246 |

優點：簡單、穩定、容易說明，且能交接既有精確 Mechanism URL。

缺點：Paylines 每款都有 14 個候選；`other` 三款會被錯當成同玩法。規則必須排除 `other`，並用其他結構化證據排序。

### 5.2 規則 B：相同 Mechanism，且共享至少一項關鍵 Feature

本次關鍵 Feature 使用既有結構化值：Free Spins、Multiplier、Cascading、Bonus Buy、Hold & Spin、Respins、Cash Collection、Giant／Split／Sticky Symbols、Jackpot；Wild 與 Scatter 不列入門檻，避免把常見符號角色誤當玩法證據。

| 指標 | 結果 |
| --- | ---: |
| 有結果的遊戲 | 29 |
| 完全無結果 | 1 |
| 只有 1～2 個結果 | 6 |
| 有 3 個以上結果 | 23 |
| 全部有向候選關係 | 200 |

優點：比規則 A 少 46 筆弱關係，可清楚列出共享 Feature。

缺點：Free Spins 與 Multiplier 分別覆蓋 23、25 款，仍會讓多數群組很大；若移除這兩個常見 Feature，零結果與資料稀疏會顯著增加。Feature-only 也不能證明觸發與規則相同。

### 5.3 規則 C：相同 Mechanism，且至少一個盤面結構欄位完全相同

本次以雙方都有值的 `winCount`、`reels` 或 `rows` 任一完全相同作門檻。

| 指標 | 結果 |
| --- | ---: |
| 有結果的遊戲 | 20 |
| 完全無結果 | 10 |
| 只有 1～2 個結果 | 8 |
| 有 3 個以上結果 | 12 |
| 全部有向候選關係 | 120 |

優點：候選更集中，已知盤面相同點也容易呈現。

缺點：結構欄位只有 60%～90% 覆蓋；缺值會造成大量假陰性。相同 rows 本身也不足以證明玩法相近，敘述式 reels 更不能安全作字串硬條件。

### 5.4 Feature-only 負面對照

若不要求相同 Mechanism，只要求至少共享兩項關鍵 Feature，會產生 456 筆有向候選關係，26 款都有 3 個以上結果。這會把 Ways、Paylines、Pay Anywhere 等不同主要賠付方式混合，明確不適合 v1。

### 5.5 逐款模擬摘要

| Game | Mechanism | A | B | C | 建議 v1 候選池 |
| --- | --- | ---: | ---: | ---: | ---: |
| big-bass-bonanza | paylines | 14 | 13 | 10 | 14 |
| bonanza | megaways | 0 | 0 | 0 | 0 |
| cash-crew | paylines | 14 | 13 | 2 | 14 |
| chaos-crew | paylines | 14 | 13 | 2 | 14 |
| fish-tales-double-catch-max-scatter | paylines | 14 | 13 | 10 | 14 |
| fortune-ox | paylines | 14 | 11 | 5 | 14 |
| fortune-paw | paylines | 14 | 11 | 9 | 14 |
| fortune-tiger | paylines | 14 | 11 | 9 | 14 |
| gates-of-olympus | pay-anywhere | 3 | 3 | 0 | 3 |
| gates-of-olympus-1000 | pay-anywhere | 3 | 3 | 2 | 3 |
| gonzos-quest | paylines | 14 | 13 | 10 | 14 |
| greedy-for-gold-hold-and-win | paylines | 14 | 10 | 10 | 14 |
| hand-of-anubis | cluster-pays | 2 | 1 | 0 | 2 |
| jump-high | ways-to-win | 3 | 3 | 0 | 3 |
| legacy-of-dead | paylines | 14 | 9 | 10 | 14 |
| mahjong-ways | ways-to-win | 3 | 3 | 1 | 3 |
| mahjong-ways-2 | ways-to-win | 3 | 3 | 0 | 3 |
| ragnarok-gold | cluster-pays | 2 | 1 | 0 | 2 |
| reactoonz | cluster-pays | 2 | 2 | 0 | 2 |
| rich-wilde-and-the-book-of-dead | paylines | 14 | 9 | 10 | 14 |
| shadow-of-dominion | other | 2 | 2 | 0 | 0 |
| starburst | paylines | 14 | 3 | 10 | 14 |
| storm-of-seth | other | 2 | 2 | 0 | 0 |
| storm-of-seth-2-awakening | other | 2 | 2 | 0 | 0 |
| sun-wu-kong | paylines | 14 | 13 | 10 | 14 |
| super-ace | ways-to-win | 3 | 3 | 1 | 3 |
| sweet-bonanza | pay-anywhere | 3 | 3 | 2 | 3 |
| sweet-bonanza-1000 | pay-anywhere | 3 | 3 | 2 | 3 |
| wanted-dead-or-a-wild | paylines | 14 | 11 | 2 | 14 |
| wildhalla | paylines | 14 | 13 | 3 | 14 |

## 6. 代表案例與錯配案例

### 6.1 Mahjong Ways

- 規則 A／B：Mahjong Ways 2、Jump High、Super Ace。
- 共享理由可包括 Ways to Win；與 Mahjong Ways 2 另共享 Cascading、Free Spins、Multiplier 等 Feature。
- 規則 C 只留下 Super Ace，因其已知 `winCount` 同為 1024；Jump High 與 Mahjong Ways 2 被缺值／不同 Ways 數排除。
- 判讀：Mechanism 是穩定門檻，Ways 數適合作排序或標籤，不應硬性要求一致。

### 6.2 Reactoonz

- 規則 A：Hand of Anubis、Ragnarok Gold。
- Reactoonz 與 Hand of Anubis 共享 Cascading；與 Ragnarok Gold 共享 Multiplier、Giant Symbols。
- 規則 C 為 0，因三款盤面結構不相同或資料不足。
- 判讀：Cluster Pays 是可解釋的共同核心，卡片必須說「玩法相近」，不能說規則相同。

### 6.3 Sweet Bonanza

- 規則 A／B：Gates of Olympus、Gates of Olympus 1000、Sweet Bonanza 1000。
- 四款都屬 Pay Anywhere，並共享 Cascading、Free Spins、Multiplier 等結構化 Feature。
- 規則 C 會排除 Gates of Olympus，因其 reels 保存為敘述式原文而非同格式值。
- 判讀：盤面字串不一致不應抹除已確認的相同主要 Mechanism。

### 6.4 Big Bass Bonanza

- 規則 A 有 14 個 Paylines 候選，顯示 Mechanism-only 候選池過大。
- 排序輔助可把盤面與 Feature 相同較多的 Fish Tales、Legacy of Dead、Book of Dead 等放前面。
- 明顯風險：Starburst 盤面與線數相同，但 Feature 與 Bonus 結構差異大；只能顯示已知共同點，不能暗示整體體驗相同。

### 6.5 Super Ace

- 規則 A／B：Jump High、Mahjong Ways、Mahjong Ways 2。
- 只有 Mahjong Ways 已知 `winCount` 同為 1024。
- Super Ace 沒有 Cascading 標記；卡片 reasons 不得從其他遊戲或 Guide 推回 Cascading。
- 判讀：共享 reasons 只能取兩款 Game records 的交集。

### 6.6 Bonanza（真實零結果）

- Bonanza 是目前唯一 Megaways Game。
- 三種規則都沒有其他候選。
- 不得使用 Cascading、Multiplier、Provider 或主題補滿；整區應隱藏。

### 6.7 `other` 三款（不可比較案例）

- Shadow of Dominion、Storm of Seth、Storm of Seth 2 會在單純規則 A 中互相配對。
- 其原廠主要賠付描述並不一致，因此推薦 v1 將三款都視為零結果。
- 未來若 taxonomy 另案核准並正規化，才可重新計算；本項不能藉此修改 taxonomy。

### 6.8 Hand of Anubis（Feature 稀疏案例）

- 與 Reactoonz 同為 Cluster Pays 且共享 Cascading。
- 與 Ragnarok Gold 同為 Cluster Pays，但目前沒有共享 Feature。
- v1 可保留兩者，卡片分別只顯示實際證據；不得替 Ragnarok Gold 補一個不存在的共享 Feature。

## 7. 建議的最小 v1 規則

### 7.1 模組用語

推薦名稱：`玩法相近`。

不推薦 `相同玩法`，因為相同 Mechanism 不代表盤面、觸發條件、Feature 細節與 Bonus 規則完全一致。也不使用「推薦遊戲」「猜你喜歡」「熱門同類」。

固定說明文字：`依主要賠付機制整理，功能與規則可能不同。`

### 7.2 候選資格

候選 Game 必須同時符合：

1. `status: published`。
2. slug 不等於目前 Game。
3. `winMechanism` 有值、完全相同，且不等於 `other`。

不建立次級補位條件。結果不足時顯示較少，0 筆時隱藏整區。

### 7.3 固定排序

建議使用 build-time 可重現排序，不建立分數、不顯示排名：

1. 共享辨識度較高 Feature 數量由多至少。固定集合為 Cascading、Bonus Buy、Hold & Spin、Respins、Cash Collection、Giant Symbols、Sticky Symbols、Symbol Splitting、Jackpot。
2. 全部可用共享 Feature 數量由多至少；Wild 與 Scatter 排除，Free Spins 與 Multiplier 可計入本層。
3. 雙方都有值且 `winCount` 完全相同者優先。
4. 顯示名稱依固定繁中排序。
5. slug 作最後 tie-break。

缺值不加分也不扣分；不得把兩個缺值視為相同。排序只是選出最多 4 張卡，不宣稱第一張比第四張更值得玩。

reels 與 rows 第一版完全不參與資格、排序或 reasons；等待未來資料正規化後另案評估。

### 7.4 相同點 reasons

每張卡顯示：

- 共同主要 Mechanism（必顯示）。
- 最多 2 個雙方確實共享的共同點，依序選取：辨識度較高的共享 Feature、雙方已知且相同的 `winCount`、Free Spins／Multiplier 等一般共享 Feature。
- 遊戲名稱、Provider 與官方圖片仍作身份辨認。

reasons 只能由兩款 published Game records 的結構化交集計算，不從摘要、標題、`bonusFeatures` 自由文字或 Guide taxonomy 推測。

Wild 與 Scatter 不得成為排序訊號或 reason；沒有其他可靠共同點時只顯示 Mechanism，不補字。

### 7.5 卡片數與空狀態

- 最多 4 張。
- 1～3 張：照實顯示，不出現空 placeholder。
- 0 張：整區隱藏。
- 不使用同 Provider、同系列或 Feature-only 結果補位。
- 現有同系列／同 Provider 區仍保持自己的角色。

推薦規則的 30 款結果：

| 指標 | 結果 |
| --- | ---: |
| 有至少一個候選 | 26 |
| 零候選 | 4 |
| 只有 1～2 個候選 | 3 |
| 有 3 個以上候選 | 23 |
| 零候選遊戲 | Bonanza、Shadow of Dominion、Storm of Seth、Storm of Seth 2 |

### 7.6 探索更多入口

有候選時可顯示 `探索更多同類遊戲`，目的地使用現有 serializer 產生：

```text
/games/?mechanism={current.winMechanism}
```

這是精確結構化 URL，不使用 `?q=` 冒充篩選。Explorer 結果會包含目前 Game，屬於完整 mechanism collection 的正常行為。零候選或 `other` 不顯示入口。

第一版不把共享 Features 加入 CTA，避免卡片候選由排序規則產生、但 CTA 卻被額外 AND 條件縮成另一組結果。

## 8. Build-time 計算與人工 relationship 的取捨

### 8.1 推薦：build-time 純函式

優點：

- 關係完全由既有 published Game structured data 推導。
- Game 更新、發布、下架後會自動重算。
- 可從單一函式輸出候選、排序與 reasons，避免 page component 各自猜測。
- 可以用 fixtures 驗證對稱資格、固定排序、缺值及零結果。

### 8.2 不推薦：人工 relationship owner

缺點：

- 會在 Game 兩端重複保存同一關係。
- 容易在資料更新後過期。
- 需要人工補足每個方向，且會把可推導事實變成主觀清單。
- 與既有 Guide relationship owner 解決的是不同問題，容易混淆。

結論：不新增 relationship 欄位，不修改 Guide resolver；新增一個專責 presentation/query helper 即可。

## 9. 產品互動契約建議

1. 模組只陳述可驗證的共同點，不提供喜好或品質判斷。
2. 卡片整體連至候選 Game detail。
3. `探索更多同類遊戲` 連至既有 `/games/?mechanism=...`。
4. Provider 可顯示但不是 reason；點擊行為是否保留現有卡片整體連結，不另加巢狀連結。
5. 手機 reasons 最多兩個，避免卡片高度與 touch target 失控。
6. 沒有對應資料就不顯示無連結文字或 disabled CTA。
7. 模組不建立自己的 client-side state，不依賴 JavaScript。

## 10. 未來施工的最小檔案範圍

第 3-2 步若人工核准，預計只需：

- 新增 `src/lib/similar-play.ts`：published Game 候選、固定排序、reasons 與 Explorer URL 的純函式。
- 修改 `src/pages/games/[slug].astro`：取得並渲染最多 4 筆結果。
- 修改 `src/styles/global.css`：Game-detail-only 卡片、手機與 focus-visible 樣式。
- 新增 `scripts/verify-similar-play.mjs`：30 款 fixtures、邊界與穩定性驗證。
- 必要時修改 `package.json`：把上述驗證接入 `npm run verify`。

原則上不需要修改：

- `src/content.config.ts`
- `src/content/games/*.md`
- `src/lib/guide-relationships.mjs`
- `src/lib/guide-relationship-catalog.ts`
- `src/lib/game-explorer-state.mjs`
- Search、Compare、Guide、Provider、Slots 頁面
- Schema、taxonomy、Explorer URL schema

若第 3-2 步發現必須修改上述不需要修改的項目，應停止並回報範圍擴張。

## 11. 測試與驗收計畫

### 11.1 資料與純函式

- 30/30 published Game 全量計算。
- 只使用 published Games。
- 排除自己、draft、重複 slug。
- `other` 與 singleton Megaways 為零結果。
- 缺值不視為相同，不產生 `undefined` reason。
- 每款最多 4 張、排序固定且重建一致。
- reasons 必須是雙方資料交集，不包含對方獨有 Feature。
- Super Ace 不得出現 Cascading reason。
- Feature-only 不得跨 Mechanism 建立資格。
- 同 Provider、同系列不影響結果資格或排序。

### 11.2 代表 fixtures

至少驗證：

- Mahjong Ways：Ways 結果與已知結構排序。
- Sweet Bonanza：Pay Anywhere 結果。
- Reactoonz、Hand of Anubis：Cluster Pays、少量結果與不同 reasons。
- Big Bass Bonanza：Paylines 大候選池仍只顯示 4 張。
- Super Ace：無 Cascading 誤標。
- Bonanza：零結果、整區隱藏。
- Storm of Seth 2：`other` 不產生錯配。
- Jump High：盤面缺值不會被當相同，但不抹除 Mechanism 資格。

### 11.3 URL 與回歸

- Explore CTA 使用既有 serializer，query canonical 且可由 `/games/` 恢復。
- 沒有 `?q=` 假探索入口。
- Search、Explorer、Compare、Game → Guide relationship 數量不變。
- 現有 series/provider 關聯仍顯示，且標題不冒充玩法。
- 內部連結與 Preview safeguards 通過。

### 11.4 UI／可及性

- 1440px、390px、320px 無頁面級水平溢位。
- 1／2／3／4 張與 0 張隱藏狀態。
- 長中英文標題、長 Provider 名稱與最多 reasons。
- 卡片與 CTA 至少 44px touch target。
- focus-visible 清楚；DOM 讀序符合標題、說明、卡片、Explore CTA。
- 無 JavaScript 時卡片與連結完整可讀。
- Browser console／hydration／runtime errors 為 0。
- 完整 Preview `npm run verify` 通過。

## 12. 過度設計與錯配風險

- 建立加權總分或百分比會暗示精確度，資料量不足且難向使用者解釋。
- 以 Feature-only 補滿會把不同主要 Mechanism 混在一起。
- 把 reels 原文全部正規化會擴張成 Schema／data cleanup 工作，不屬 v1。
- 建立人工 relatedGames 會產生雙向維護與主觀推薦。
- 顯示太多 reasons 會讓手機卡片成為第二個 Game detail。
- 使用 `other` 會把 taxonomy 缺口變成錯誤產品承諾。
- 以 Provider、系列或主題作 fallback 會重複現有區塊並混淆模組責任。

## 13. 已核准產品決定

1. 模組名稱採「玩法相近」，固定說明為「依主要賠付機制整理，功能與規則可能不同。」
2. v1 資格採相同且非 `other` 的主要 Mechanism。
3. 0 結果隱藏、1～3 筆照實顯示，不使用任何 fallback。
4. 卡片上限為 4。
5. 固定排序採「辨識度較高共享 Feature 數 → 全部可用共享 Feature 數 → 相同 `winCount` → 名稱 → slug」。
6. reels／rows 完全不參與 v1 資格、排序或 reasons。
7. 每張卡必顯示 Mechanism，另顯示最多 2 個真實共同點；Wild／Scatter 排除。
8. Explore CTA 只使用 mechanism filter，不加入 Feature AND。
9. 模組放在 Feature Guide rail 與現有「關聯遊戲」之間。
10. 使用 build-time 純函式自動計算，不新增 relationship、Schema 或人工 relatedGames。

## 14. 明確不包含

本輪及建議 v1 均不包含：

- 修改 Game data、Schema、taxonomy 或發布狀態。
- 修改 Game → Guide relationship 或新增 owner。
- 人工 relatedGames 欄位。
- AI、個人化、熱門度、排名或推薦分數。
- CPA、娛樂城或立即遊玩 CTA。
- 永久 Mechanism／Feature 集合頁。
- Search／Explorer 新演算法或 URL schema。
- Wix、migration、舊站、301、DNS 或正式索引設定。

## 15. 本輪驗證與檔案邊界

- 本輪網站檔案修改數：0。
- 本輪 Schema／Game data／元件／樣式修改數：0。
- 本輪測試檔修改數：0。
- 既有未追蹤 prototype、review 與 audit 文件保持未納入。
- 執行資料 audit、relationship audit、完整 Preview `npm run verify` 與 `git diff --check` 的結果應記錄於完成回報。

## 16. 文件出口

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_ITEM: 第3項 Game detail 相同玩法探索`

`CURRENT_STEP: 第3-1步 只讀產品與資料盤點`

`CURRENT_STATE: APPROVED_FOR_LOCAL_IMPLEMENTATION`

`WEBSITE_CHANGED: NO`

`GAME_COUNT: 30 published Games`

`DATA_COVERAGE_RESULT: winMechanism 30/30；features 30/30；reels 27/30；rows 23/30；winCount 18/30`

`RECOMMENDED_V1_RULE: 相同且非 other 的主要 Mechanism 作資格；辨識度較高 Feature、全部可用共享 Feature、相同 winCount、名稱與 slug 作固定排序`

`ZERO_RESULT_COUNT: 4`

`RELATIONSHIP_OWNER_RECOMMENDATION: NONE；build-time 純函式推導`

`NEXT_ALLOWED_ACTION: 依核准規格進行第3-2步本機施工；不得 Push 或部署`

`COMMIT_ALLOWED: NO`

`PUSH_ALLOWED: NO`

`DEPLOY_ALLOWED: NO`

`HUMAN_APPROVAL_REQUIRED: YES`
