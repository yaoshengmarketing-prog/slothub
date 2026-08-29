# Slot Hub 教學內容、賠付機制與遊戲資料關聯 v1 規格盤點

> **APPROVED v1 — READ-ONLY SPECIFICATION**
>
> 本文件依 `docs/slot-hub-master-blueprint-v1.md`、`docs/game-explorer-v2-readonly-spec.md`、Repository 內 30 款 `published` Game，以及 6 篇 `published` Guide 盤點。
>
> 本規格以只讀盤點建立；沒有修改 Schema、taxonomy、Guide、Game、元件、頁面、路由或索引規則。本文件的本地 Commit 不構成實作、Push 或部署授權。
>
> 盤點日期：2026-08-29

## 1. 結論摘要

現有資料已足以建立第一版「概念解釋 ↔ 遊戲探索」關聯，但不適合建立 Mechanism／Feature 永久集合頁。30 款 Game 的 `winMechanism` 與 `features` 都是 30/30；Guide 只有 6 篇，而且內容普遍短、正文沒有任何可點擊的內部連結。第一版應把現有永久 Guide 當概念入口，把 `/games/?…` 當可分享但不索引的工具狀態。

推薦採 **方案 A：由 Guide frontmatter 單向宣告結構化關聯**。Guide 是唯一人工權威來源；Game、Explorer 與搜尋端都反向查詢 Guide 宣告，不在 Game 端保存同一份關係。第一版只加入 optional `relatedMechanisms`、`relatedFeatures`、`relatedDataTopics`；`relatedGames`、`relatedProviders` 延後，不納入 v1 Schema。`relatedDataTopics` 第一版固定接受 `rtp`、`rtp-variants`、`volatility`、`max-win`。

工作分為兩個明確階段，且第一階段不依賴尚未發布的新文章：

1. **關聯底座 v1**：只接上目前內容足以承接的 4 篇既有 Guide，建立 Mechanism、Feature、Data Topic 與 Game 的可驗證反向查詢。
2. **新內容階段**：另行撰寫、審查與發布整合型「賠付機制怎麼看」及「最高倍數怎麼看」；發布前不建立對應教學 CTA。

第一版內容策略仍不是「每個 Feature 一篇文章」。Hold & Spin 等低樣本概念先維持篩選或單款頁資訊，不建立薄內容。

## 2. 現有 Guide 覆蓋盤點

### 2.1 Published Guide 清單

| Slug | 標題 | Category | Level | Tags | 正文實際涵蓋 | 正文現有內部連結 |
| --- | --- | --- | --- | --- | --- | --- |
| `slot-beginners-guide` | 老虎機新手入門：先看懂遊戲資料 | `beginner` | `beginner` | 老虎機、RTP、波動度 | Provider、遊戲類型、RTP、波動度、盤面與 Bonus features 的閱讀順序；RTP／波動度不能預測單次結果 | 0 |
| `rtp-explained` | RTP 是什麼？如何正確閱讀 | `data` | `beginner` | RTP、機率 | 長期理論回報、非單次保證、多版本 RTP 必須分開顯示 | 0 |
| `volatility-explained` | 波動度怎麼看？低、中、高代表什麼 | `data` | `beginner` | 波動度、老虎機 | 波動度是結果分布起伏；廠商標示不必然一致；Slot Hub 保留原文並提供統一分類 | 0 |
| `slot-symbols-and-features` | Wild、Scatter、Free Spins 與 Jackpot 怎麼看 | `mechanics` | `beginner` | Wild、Scatter、Free Spins、Jackpot | Wild 替代與變體、Scatter 觸發、Free Spins、Jackpot 類型及不可由名稱推定規則 | 0 |
| `slot-terms-glossary` | Slot 常用術語快速查詢 | `terms` | `beginner` | Reels、Paylines、Ways、Cascades、Bonus Buy | Reels／Rows、Paylines／Ways、Cascades／Tumbles／Avalanche、Bonus Buy | 0 |
| `fishing-games-basics` | 捕魚機入門：畫面、目標與基本玩法 | `fishing` | `beginner` | 捕魚機、基本玩法、遊戲類型 | 捕魚機即時操作、閱讀欄位、與轉輪老虎機差異、未來資料位置 | 0 |

### 2.2 現有內部連結事實

- 6 篇 Guide 正文均沒有 Markdown link；Guide 詳情模板也沒有相關遊戲、相關概念或返回 Explorer 區塊。
- `/guide/` 只負責依 category 列出文章。
- 首頁、`/slots/`、`/fishing-games/` 已有導向 Guide 的入口，屬「Hub → Guide」單向連結。
- `/slots/` 已人工維護 RTP、波動度、Wild、Scatter、Free Spins、Jackpot 的知識入口，但這份 mapping 寫在頁面內，不是可反向查詢的正式關聯。
- Game 詳情頁目前不能依 Mechanism／Feature 找到 Guide；Guide 也不能以結構化條件找到 Game。

## 3. 30 款 Game 結構覆蓋

### 3.1 數據欄位

| 欄位 | 取得數 | 取得率 | 關聯用途判讀 |
| --- | ---: | ---: | --- |
| `winMechanism` | 30/30 | 100% | 可直接作 Guide 關聯及 Explorer CTA 條件。 |
| `features` | 30/30 | 100% | 可直接作 Guide 關聯；Feature 多選仍維持 AND。 |
| `subtypes` | 30/30 | 100% | 可作探索入口，不自動等同 Mechanism／Feature。 |
| 主要 RTP | 17/30 | 56.7% | 可連 RTP Guide；門檻只包含已知值。 |
| 原廠波動度 | 20/30 | 66.7% | 作資料說明與來源追溯。 |
| 統一波動度 | 17/30 | 56.7% | 可連波動度 Guide及 Explorer。 |
| 多版本 RTP | 10/30 | 33.3% | 適合由 RTP Guide 解釋，不另作 v1 篩選。 |
| 最高倍數 | 25/30 | 83.3% | 資料已足以排序／篩選，也需要概念說明。 |

### 3.2 Mechanism 覆蓋與教學承接

| Mechanism | 遊戲數 | 代表遊戲 | 現有教學承接 | 足夠度 |
| --- | ---: | --- | --- | --- |
| Paylines | 15 | Big Bass Bonanza、Chaos Crew、Starburst、Gonzo’s Quest | `slot-terms-glossary` 有實際定義 | **局部**；只有一句定義，尚未說明固定線、線數及與盤面的關係。 |
| Ways to Win | 4 | Mahjong Ways、Mahjong Ways 2、Super Ace、Jump High | `slot-terms-glossary` 有實際定義 | **局部**；沒有處理動態 Ways、相鄰轉輪條件與 `winCount` 語意。 |
| Megaways | 1 | Bonanza | 無 | **缺口**；現有 Guide 未實際解釋，不能只因 1 款就建立集合頁。 |
| Cluster Pays | 3 | Hand of Anubis、Ragnarök Gold、Reactoonz | 無 | **缺口**；現有內容未解釋群集成立方式。 |
| Pay Anywhere | 4 | Sweet Bonanza 一／1000、Gates of Olympus 一／1000 | 無 | **缺口**；搜尋與篩選已有中英文詞，但沒有知識承接。 |
| Other | 3 | Storm of Seth 一／二、Shadow of Dominion | 無，且不應有通用薄教學 | **不宜泛化**；應保留原廠文字及單款規則，待 taxonomy 確認。 |

目前沒有 `scatter-pays` enum 或結構化遊戲。Scatter Feature 不能被 Guide 關聯程式推定為 Scatter Pays Mechanism。

### 3.3 Feature 覆蓋與教學承接

| Feature | 遊戲數 | 代表遊戲 | 現有教學承接 | 足夠度 |
| --- | ---: | --- | --- | --- |
| Free Spins | 23 | Big Bass Bonanza、Bonanza、Chaos Crew、Sweet Bonanza | `slot-symbols-and-features` 有獨立小節 | **可直接承接 v1**；日後可補 retrigger 與變體。 |
| Wild | 15 | Big Bass Bonanza、Cash Crew、Starburst、Legacy of Dead | `slot-symbols-and-features` 有獨立小節 | **可直接承接 v1**；已提醒替代規則與 Wild 變體。 |
| Scatter | 16 | Big Bass Bonanza、Bonanza、Sweet Bonanza、Gates of Olympus | `slot-symbols-and-features` 有獨立小節 | **可直接承接 v1**；必須補強「Scatter symbol ≠ Scatter Pays」。 |
| Multiplier | 25 | Bonanza、Cash Crew、Gates of Olympus、Wanted Dead or a Wild | 只在其他段落提到「倍數」 | **只有名稱提及**；沒有真正解釋倍數出現位置、累進或套用範圍。 |
| Cascading | 13 | Bonanza、Gonzo’s Quest、Sweet Bonanza、Gates of Olympus | `slot-terms-glossary` 有 Cascades 小節 | **可承接但偏薄**；已有 Tumble／Avalanche 同義詞說明。 |
| Bonus Buy | 12 | Bonanza、Chaos Crew、Wanted Dead or a Wild、Gates of Olympus 1000 | `slot-terms-glossary` 有獨立小節 | **可直接承接 v1**；文案已避免獲利暗示。 |
| Hold & Spin | 1 | Greedy for Gold: Hold and Win | 無 | **樣本不足**；保留進階篩選與單款頁，不新增文章。 |
| Jackpot | 1 | Storm of Seth 2 | `slot-symbols-and-features` 有 Jackpot 小節 | **局部**；教學解釋類型，但 Feature 標記不等於已確認 Jackpot type。 |
| Respins | 5 | Fortune Ox、Fortune Tiger、Fortune Paw、Shadow of Dominion | 無 | **尚非 v1 內容優先**。 |
| Giant Symbols | 4 | Greedy for Gold、Ragnarök Gold、Reactoonz、Shadow of Dominion | 無 | **尚非 v1 內容優先**。 |
| Cash Collection | 2 | Big Bass Bonanza、Cash Crew | 無 | **維持篩選／單款頁**。 |
| Symbol Splitting | 1 | Storm of Seth 2 | 無 | **遊戲專屬優先**。 |
| Sticky Symbols | 1 | Storm of Seth 2 | Wild 段落只提到黏著 Wild | **只有名稱提及**；現階段留單款頁。 |

### 3.4 Subtype 覆蓋

| Subtype | 遊戲數 | 代表遊戲 | Guide 狀況 |
| --- | ---: | --- | --- |
| `video-slots` | 29 | 幾乎全庫 | 新手文只提遊戲類型，沒有獨立解釋；不具分流內容價值。 |
| `cascading-reels` | 7 | Mahjong Ways、Sweet Bonanza、Gates of Olympus | 可由 Cascading 概念承接，但 subtype 不可與 Feature 自動互換。 |
| `cluster-pays` | 3 | Ragnarök Gold、Reactoonz、Shadow of Dominion | 無完整教學。 |
| `ways-to-win` | 3 | Mahjong Ways 一／二、Storm of Seth 2 | Glossary 有初步定義。 |
| `hold-and-win` | 1 | Greedy for Gold | 無；延後。 |
| `megaways` | 1 | Bonanza | 無；可放入整合型 Mechanism Guide。 |

## 4. 概念主要角色表

角色只描述 **v1 的主要產品角色**，不因遊戲數量自動核准永久頁。

| 概念 | 主要角色 | 理由 |
| --- | --- | --- |
| Paylines | `GUIDE_AND_FILTER` | 15 款、已有初步定義，也是主要 Mechanism filter。 |
| Ways to Win | `GUIDE_AND_FILTER` | 4 款；需要避免把動態 Ways 誤解成固定數字。 |
| Megaways | `GUIDE_AND_FILTER` | 已是 filter，但只有 1 款；只納入整合 Guide，不建立永久集合頁。 |
| Cluster Pays | `GUIDE_AND_FILTER` | 3 款且規則與線式賠付明顯不同，需要概念說明。 |
| Pay Anywhere | `GUIDE_AND_FILTER` | 4 款；目前工具已可搜尋／篩選，但完全沒有教學承接。 |
| Free Spins | `GUIDE_AND_FILTER` | 23 款、有現成小節及 Feature filter。 |
| Wild | `GUIDE_AND_FILTER` | 15 款、有現成小節及 Feature filter。 |
| Scatter | `GUIDE_AND_FILTER` | 16 款；需要同時解釋 Feature 與 Mechanism 的邊界。 |
| Multiplier | `GUIDE_AND_FILTER` | 25 款且已有 filter，但現有文章只有名稱提及。 |
| Hold & Spin | `FILTER_ONLY` | 只有 1 款；保留進階探索，不建立薄內容。 |
| Cascading | `GUIDE_AND_FILTER` | 13 款；Glossary 已有 Tumble／Avalanche 對照。 |
| Bonus Buy | `GUIDE_AND_FILTER` | 12 款；Glossary 已有基本風險中立說明。 |
| Jackpot | `GUIDE_AND_FILTER` | 有現成概念小節及進階 filter；必須區分 Jackpot Feature 與 Jackpot type。 |
| RTP | `GUIDE_AND_FILTER` | 17 款有數值，Guide 與最低 RTP filter 均已存在。 |
| 多版本 RTP | `GUIDE_TOPIC` | 10 款；應由 RTP Guide 解釋，不在 v1 新增獨立 filter。 |
| 波動度 | `GUIDE_AND_FILTER` | 17 款有統一值，Guide 與 filter 均已存在。 |
| 最高倍數 | `GUIDE_AND_FILTER` | 25 款、已有 filter／sort，但沒有概念 Guide。 |

補充：`other` Mechanism、原廠專屬 Bonus 名稱與無法穩定正規化的規則，主要屬 `GAME_DETAIL_ONLY`。Mechanism／Feature 永久集合頁全部維持 `DEFERRED_COLLECTION`，不因本表核准建立。

## 5. 第一版連接方式

### 5.1 單一資料流

```text
Guide frontmatter（唯一人工關聯來源）
        ↓ validation / relationship resolver
Mechanism → Guide index
Feature → Guide index
Data Topic → Guide index
        ├─ Game detail：依該 Game 的 Mechanism／Features 反查 Guide
        ├─ Game → Guide：合併 Mechanism、Feature 與 Data Topic 精確關係
        ├─ Guide → derived Games：依 Guide 宣告條件推導代表 Game
        ├─ Explorer：依目前選取概念顯示 Guide 入口
        ├─ Search：同時提供「了解概念」與「找符合遊戲」
        └─ /slots/：核心 Guide 與帶條件的 /games/ 入口
```

Game 不新增 `relatedGuides`；關聯不得在 Guide 與 Game 兩端重複手動保存。

### 5.2 Game 詳情頁 → Guide

- 在「核心數據」或「完整遊戲資料」之後加入精簡的「看懂這些資料」區塊。
- 依 `winMechanism`、`features` 與實際存在的 RTP／RTP variants／波動度／最高倍數資料精確反查 Guide；顯示排序由 v1 實作規格固定，不用 fallback 補滿。
- 最多顯示 2～3 篇，避免 25 個 Multiplier 遊戲都塞入大量重複入口。
- 每個入口說明關聯原因，例如「了解賠線」或「Free Spins 怎麼看」。
- `other` Mechanism 不使用 fallback 猜 Guide；沒有明確關係就不顯示。

### 5.3 Guide 詳情頁 → 代表遊戲與 Explorer

- 顯示 3～6 款由 published Game projection 推導的代表遊戲，不在 Guide 內複製遊戲名稱、RTP 或圖片資料。
- 代表遊戲必須符合 Guide 宣告的 concept；先依資料完整度與 `editorialFeatured` 作穩定排序，再以名稱 tie-break，不能隨機。
- Guide 宣告多個概念時，每個概念是獨立關係，不自動把它們合成 Feature AND。例如 Wild／Scatter／Free Spins 共用一篇文章，應提供三個個別探索入口，而不是要求遊戲同時具有三者。
- 每個 Mechanism 使用 `/games/?mechanism={slug}`；每個 Feature 使用 `/games/?features={slug}`。
- Guide 最後提供「查看符合條件的全部遊戲」，進入遊戲庫後可繼續開單款頁並加入比較。

### 5.4 Explorer → Guide

- 預設狀態不放滿教學連結。
- 選取一個 Mechanism 或 Feature 後，若 relationship index 有對應 Guide，在結果摘要附近顯示一個低干擾入口：「不了解任意位置賠付？閱讀說明」。
- 多個 Features 為 AND，但「了解概念」入口仍按每個已選 Feature 分開顯示；不自動假設有一篇文章解釋整個組合。
- 沒有 Guide 的合法條件不顯示空入口，也不阻止篩選，更不構成驗證失敗。
- Pay Anywhere、Cluster Pays、Megaways 繼續正常篩選；整合型賠付機制 Guide 發布前，不顯示不存在、不精確或暫時指向部分定義文章的教學入口。

### 5.5 `/slots/` → Guide 與 Explorer

- 保留 Knowledge Map，但資料來源改為共用 relationship index，不再在 `/slots/` 手寫第二份 concept → Guide mapping。
- 關聯底座 v1 的教學入口優先：RTP、波動度、Paylines／Ways、Wild／Scatter／Free Spins／Jackpot、Cascading／Bonus Buy；其餘賠付機制仍可連 Explorer，但不顯示教學 CTA。
- 同一概念並列兩個明確動作：「了解概念」與「探索相關遊戲」。
- 子類型卡片繼續使用 Game Explorer v2 query，不能由相似名稱改寫成 Mechanism／Feature query。

### 5.6 Search 的雙意圖

搜尋「Paylines／賠線」或「Free Spins／免費旋轉」等已有正式關聯的概念時，結果需明確分成：

1. **了解概念**：Guide 永久頁。
2. **找具有此條件的遊戲**：帶 Mechanism／Feature query 的 `/games/` 工具入口，附目前結果數。

遊戲名稱結果仍維持單款遊戲。搜尋不得只靠全文命中猜測正式關係；concept alias、Guide 關係與 Explorer query 都應使用共用 taxonomy／relationship projection。

若查詢命中合法但尚無對應 Guide 的概念，例如關聯底座 v1 階段的 Pay Anywhere、Cluster Pays、Megaways 或 `max-win`，搜尋只保留遊戲探索結果，不顯示「了解概念」入口，也不得使用相近 Guide 作 fallback。

## 6. 關聯資料模型評估

### 6.1 方案 A：Guide 新增結構化關聯欄位

建議 optional 欄位：

```yaml
relatedMechanisms: [paylines, ways-to-win]
relatedFeatures: [cascading, bonus-buy]
relatedDataTopics: [rtp, rtp-variants]
```

優點：

- 關聯與負責解釋它的內容放在一起，編輯者容易理解。
- Guide 是唯一人工權威來源；Game 不必增加反向欄位。
- 可由同一 resolver 產生 Game → Guide、Guide → Game、Explorer → Guide 與 Search intent。
- 現有只有 6 篇 Guide，維護成本最低。

限制與規則：

- `relatedMechanisms`、`relatedFeatures`、`relatedDataTopics` 是 v1 的全部人工關聯欄位。
- `relatedDataTopics` 第一版固定支援 `rtp`、`rtp-variants`、`volatility`、`max-win`，不得接受任意自由字串。
- `relatedGames`、`relatedProviders` 移至 `DEFERRED`，不納入 v1 Schema；代表遊戲由 published Game projection 衍生，不手抄清單。
- taxonomy／Data Topic 值與重複值必須由驗證程式檢查。
- 合法但尚無 Guide 的 Mechanism、Feature 或 Data Topic 是允許狀態，不得使驗證失敗。

### 6.2 方案 B：獨立 relationship registry

優點：關係集中、未來多實體與多種 relationship type 時較容易擴充，也能不改 Guide frontmatter。

缺點：目前只有 6 篇 Guide，會把內容責任拆到另一個檔案；新增、改名或刪除 Guide 時更容易忘記同步。若 registry 同時存顯示文字與 target 資料，會形成第二份內容來源。

判定：可作未來關係量大、關係帶權重／有效期／人工排序時的候選，不是 v1 最小方案。

### 6.3 方案 C：依 tags 或正文自動猜測

風險：

- 同義詞不穩定，例如 Cascading／Cascades／Tumble／Avalanche。
- Scatter 可能指符號、觸發條件或 Scatter Pays，全文命中無法分辨。
- 「Jackpot」可指 Feature、獎項類型或一般行銷文字。
- Guide 同時比較多個概念時，關鍵字出現不代表文章負責完整解釋。
- 改寫文案會靜默改變產品關係，難以 code review 與驗證。

判定：不得用於正式關係。全文與 tags 最多作 lint 提示，例如「正文談到 Cascading 但未宣告關係」，不能自動發布連結。

### 6.4 推薦

第一版採 **方案 A**。人工關係只寫在 Guide；程式以 published Game projection、taxonomy、固定 Data Topic 集合與 Guide declarations 反向推導所有畫面。resolver 必須同時輸出 Mechanism → Guide、Feature → Guide、Data Topic → Guide、Game → Guide、Guide → derived Games。若未來需要單款／廠商直連、關係權重、有效期或大量非 Guide 實體，再另案審查 `relatedGames`、`relatedProviders` 或是否升級方案 B。

## 7. 內容階段、缺口與優先級

### 7.1 關聯底座 v1

關聯底座 v1 只啟用已有內容能準確承接的關係：

| Guide | v1 正式關聯 |
| --- | --- |
| `rtp-explained` | Data Topic：`rtp`、`rtp-variants` |
| `volatility-explained` | Data Topic：`volatility` |
| `slot-symbols-and-features` | Feature：`free-spins`、`wild`、`scatter`、`jackpot` |
| `slot-terms-glossary` | Mechanism：`paylines`、`ways-to-win`；Feature：`cascading`、`bonus-buy` |

- Multiplier 在現有文章補強並通過內容審查前，不啟用正式關聯。
- Pay Anywhere、Cluster Pays、Megaways 在新整合型 Guide 發布前只有 Explorer 篩選，不顯示教學 CTA。
- `max-win` 是合法 Data Topic，但最高倍數 Guide 發布前沒有對應 Guide是正常狀態，不允許 fallback 猜測。

### 7.2 現有 Guide 可直接承接

- `rtp-explained`：RTP、多版本 RTP。
- `volatility-explained`：原廠波動度與 Slot Hub 統一波動度。
- `slot-symbols-and-features`：Wild、Scatter、Free Spins、Jackpot。
- `slot-terms-glossary`：Paylines、Ways to Win、Cascading、Bonus Buy。

`slot-beginners-guide` 適合作廣義新手路線，不應因提到 RTP／波動度就取代兩篇專題文章。`fishing-games-basics` 與目前30款 Slot Game 沒有直接結構化關係。

### 7.3 現有文章局部補強即可

| Guide | 建議補強 | 原因 |
| --- | --- | --- |
| `rtp-explained` | 主要 RTP 與 `rtpVariants`、不同版本來源、卡片「多版本」標記 | 10 款已有多版本；目前只有兩段文字。 |
| `volatility-explained` | 原廠文字與統一值的分工、缺值不等於低波動 | 只有 17 款有統一值。 |
| `slot-symbols-and-features` | Multiplier 小節；Scatter Feature ≠ Scatter Pays；Jackpot Feature ≠ 已確認 Jackpot type | Multiplier 25 款但目前只有名稱提及。 |
| `slot-terms-glossary` | 固定 Paylines、動態 Ways／Megaways、Cascading aliases、Bonus Buy 缺值語意 | 目前定義正確但過短。 |

### 7.4 新內容階段：另行撰寫與審查

#### P0：老虎機賠付機制怎麼看

- 使用者問題：為什麼有些遊戲寫賠線、有些寫 Ways、Megaways、Cluster Pays 或 Pay Anywhere？
- 對應：5 種已結構化 Mechanism，覆蓋 27 款；3 款 `other` 不強塞。
- 可連接：Paylines 15、Ways 4、Megaways 1、Cluster Pays 3、Pay Anywhere 4。
- 與既有文章差異：Glossary 只用一句比較 Paylines／Ways，沒有 Megaways、Cluster Pays、Pay Anywhere，也沒有清楚劃分 Mechanism 與 Feature。
- 重複風險：若為每種機制各寫一篇會形成薄內容；v1 應用一篇完整比較型 Guide 統一承接。
- 優先級：**P0**。
- 發布前狀態：Pay Anywhere、Cluster Pays、Megaways 保持 Explorer 可用，但沒有正式 Guide 關聯或教學 CTA。

#### P1：最高倍數怎麼看

- 使用者問題：`Max Win`、`Winning Ratio`、`Max Exposure`、單一 Money Symbol 2,000× 是否可直接互相比較？
- 對應：`maxWinMultiplier`、原廠 label 與資料頁來源。
- 可連接：25 款已取得統一比較值；5 款缺值。
- 與既有文章差異：現有 Guide 完全未解釋最高倍數，Explorer 已能篩選與排序。
- 重複風險：不應與 RTP、波動度混成「哪款更好」；需保持數據定義與非預測定位。
- 優先級：**P1**。
- 發布前狀態：`max-win` 保持合法 Data Topic，但 relationship index 對它回傳無 Guide；搜尋、Explorer、Game detail 正常省略 CTA。

### 7.5 現階段不值得建立內容

- Hold & Spin：1 款，先維持 filter／Game detail。
- Symbol Splitting、Sticky Symbols：各 1 款，先保留 Game detail。
- Cash Collection：2 款；尚不足以獨立成文。
- Giant Symbols：4 款；可日後併入進階 Feature 指南，不單獨建薄頁。
- Respins：5 款；先維持 filter，等待內容需求。
- `other` Mechanism：分類仍代表不同原廠規則，不建立含糊的「其他機制」文章。
- `video-slots`：29 款，條件過廣，沒有獨立內容分流價值。

## 8. SEO 與網址邊界

- Guide 繼續使用永久乾淨網址 `/guide/{slug}/`，並由 Guide 承擔概念解釋的主要搜尋意圖。
- `/games/?mechanism=...`、`/games/?features=...` 與任何複合條件都是工具狀態網址。
- 篩選網址不進 sitemap，不建立靜態 SEO 頁，不把每種組合轉成可索引頁。
- Guide 可連向帶 query 的遊戲庫；query URL 不反向取代 Guide canonical。
- 未來若評估 Mechanism 集合頁，必須另行審查搜尋意圖、遊戲數量、內容厚度、Guide 重複與 canonical 主從關係。
- Feature 永久頁、Mechanism 永久頁與大量 taxonomy SEO 頁本輪均未核准。
- 本輪不修改 Preview 或 production 的 robots、canonical、HTTP header 或其他索引規則。

## 9. v1 最小實作範圍

### 9.1 關聯資料模型

- Guide Schema 新增 optional `relatedMechanisms`、`relatedFeatures`、`relatedDataTopics`。
- `relatedDataTopics` 只接受 `rtp`、`rtp-variants`、`volatility`、`max-win`。
- `relatedGames`、`relatedProviders` 為 `DEFERRED`，不納入 v1 Schema。
- 只在 Guide 端人工維護；Game 不新增 `relatedGuides`。
- 建立中立 relationship resolver，輸入 published Guides、published Game projection、taxonomy 與固定 Data Topic 集合，輸出 Mechanism → Guide、Feature → Guide、Data Topic → Guide、Game → Guide、Guide → derived Games。
- Guide 宣告多個 concept 的語意是「文章分別承接這些概念」，不是自動組成 AND query。
- 合法但沒有 Guide 的概念回傳空關係；呼叫端不顯示 CTA，不能 fallback 猜測或視為驗證失敗。

### 9.2 第一批既有 Guide 與 concept

1. `rtp-explained` → Data Topic：`rtp`、`rtp-variants`。
2. `volatility-explained` → Data Topic：`volatility`。
3. `slot-symbols-and-features` → Feature：`free-spins`、`wild`、`scatter`、`jackpot`。
4. `slot-terms-glossary` → Mechanism：`paylines`、`ways-to-win`；Feature：`cascading`、`bonus-buy`。

關聯底座 v1 不啟用 Multiplier、Pay Anywhere、Cluster Pays、Megaways、Hold & Spin 或 `max-win` 的 Guide 關聯。前四者與 Hold & Spin 的 Explorer 篩選保持正常；`max-win` 保持合法 Data Topic。待對應內容完成獨立撰寫與審查後，才能新增正式關聯。

### 9.3 各入口最小變更

| 入口 | 最小變更 |
| --- | --- |
| Game detail | 顯示最多 2～3 個精確相關 Guide；沒有關係就整區隱藏。 |
| Guide detail | 顯示 3～6 款衍生代表遊戲，並按每個 concept 提供已套用條件的 `/games/` 入口。 |
| Explorer | 選中已有 Guide 的 Mechanism／Feature／Data Topic 時，顯示低干擾「了解概念」入口。 |
| `/slots/` | 使用 relationship index 建立 Knowledge Map；保留 Guide 與 Explorer 兩種動作。 |
| Search | 對 concept query 分開呈現「了解概念」與「找符合遊戲」。 |

### 9.4 完整性驗證

- Guide relation 只接受既有 Mechanism／Feature enum 與固定的 Data Topic 值。
- 拒絕重複值、空值與不存在的 taxonomy／Data Topic 值。
- 每個 Game → Guide 反向結果必須能由 Guide 宣告重建，禁止 Game 端第二份手寫 mapping。
- 合法但尚無 Guide 的概念必須產生空關係且通過驗證；不存在的 taxonomy／Data Topic 值才是驗證錯誤。
- 每個 Guide 的 Explorer URL 必須由既有 `gamesIndexUrl()` serializer 產生，不能手寫 query。
- 固定 fixture 驗證 Scatter Feature 不會被映射成 Scatter Pays Mechanism。
- 固定 fixture 驗證 Pay Anywhere、Cluster Pays、Megaways、Multiplier、`max-win` 在未啟用關聯時不出現 fallback CTA。
- Guide 代表遊戲數量、排序與 published isolation 必須穩定、可重複。
- Guide 刪除／slug 改名或 taxonomy／Data Topic 值變更造成既有映射失效時，`npm run verify` 必須失敗並指出來源 Guide。

### 9.5 桌機與手機測試

- 桌機與 390×844：Game detail 相關 Guide、Guide 代表遊戲、Explorer concept CTA 不破版、不造成整頁水平溢位。
- 長 Guide 標題、長遊戲中英文名稱、0／1／3／6 款代表遊戲。
- Guide 多個 concept 時，CTA 分開且 query 不被錯誤合成 AND。
- 從 Guide → filtered games → Game detail → compare 的完整路徑。
- 從 Game detail → Guide → filtered games 的返回路徑。
- 搜尋同時存在 Guide 意圖與 Game 結果時，標示清楚且鍵盤操作正常。
- Preview `noindex,nofollow`、空 sitemap 與無 production canonical 繼續回歸；不新增 production query-specific SEO 宣稱。

### 9.6 明確延後

- Series Collection、系列永久頁。
- Mechanism／Feature 永久頁及大量 taxonomy SEO 頁。
- 每個 Feature 一篇自動文章或薄內容。
- AI 全文／語意關聯、自動推薦。
- CMS、D1、R2、後台關聯編輯器。
- Guide 關係權重、個人化排序、點擊數熱門推薦。
- 第四批遊戲及任何 Game 資料修改。
- `relatedGames`、`relatedProviders` 與單款／廠商人工直連。
- production query-specific robots／canonical 與正式站索引切換。

## 10. 實作授權邊界

- 本規格推薦的 optional Guide 欄位屬 **Schema change**，必須經人工核准後才能實作；v1 僅限 `relatedMechanisms`、`relatedFeatures`、`relatedDataTopics`。
- 現有 Game Schema、Mechanism／Feature taxonomy 不需要因 v1 關聯而修改。
- 本輪沒有發現阻止規格成立的資料矛盾；主要缺口是內容深度與正式關聯尚未存在。
- 本規格已核准，但尚未核准實作。下一步只能是等待人工核准「關聯底座 v1」實作；新內容仍是另一個獨立階段。

## 11. 規格出口

- `STAGE_RESULT: PASS_TO_NEXT_STAGE`
- `CURRENT_STATE: SPEC_APPROVED_READY_FOR_IMPLEMENTATION`
- `RECOMMENDED_RELATIONSHIP_MODEL: 方案 A；Guide 以 Mechanism、Feature、Data Topic 單向宣告，resolver 建立五種正反向投影`
- `RELATIONSHIP_FIELDS: relatedMechanisms、relatedFeatures、relatedDataTopics；Data Topic 固定為 rtp、rtp-variants、volatility、max-win`
- `INITIAL_ACTIVE_RELATIONSHIPS: rtp-explained → rtp／rtp-variants；volatility-explained → volatility；slot-symbols-and-features → free-spins／wild／scatter／jackpot；slot-terms-glossary → paylines／ways-to-win／cascading／bonus-buy`
- `DEFERRED_CONTENT_RELATIONSHIPS: Pay Anywhere、Cluster Pays、Megaways、Multiplier、max-win；relatedGames、relatedProviders 亦不納入 v1 Schema`
- `EXISTING_GUIDE_COVERAGE: 6 篇 published Guide；4 篇可承接 Slot concept，但全部正文均為 0 個可點擊內部連結`
- `CONTENT_GAPS: 關聯底座 v1 不依賴新文章；新內容階段另行處理 P0 整合型賠付機制 Guide與 P1 最高倍數 Guide`
- `PROPOSED_V1_SCOPE: 只接上 4 篇既有 Guide及已核准的 Mechanism／Feature／Data Topic 關係；合法無 Guide 概念保持無 CTA`
- `SCHEMA_CHANGE_NEEDED: YES；僅建議新增 optional Guide 關聯欄位，本輪未修改`
- `BLOCKERS: NONE`
- `NEXT_ALLOWED_ACTION: 等待人工核准關聯底座 v1 實作`
- `FILES_CHANGED: docs/guide-game-relationship-v1-readonly-spec.md`
- `COMMIT_ALLOWED: NO`
- `PUSH_ALLOWED: NO`
- `DEPLOY_ALLOWED: NO`
- `HUMAN_APPROVAL_REQUIRED: YES`
