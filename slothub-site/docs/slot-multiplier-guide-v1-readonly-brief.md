# Slot Hub「老虎機 Multiplier／倍數功能怎麼看」Guide v1 只讀 Brief

> 文件性質：READ-ONLY BRIEF
>
> 工作流狀態：`READONLY_BRIEF_COMPLETE`
>
> 關聯類型：`Feature -> multiplier`
>
> 資料核對日期：2026-08-29
>
> 本文件不是 Guide 建立、關聯啟用、程式修改、Commit、Push 或部署授權。

## 1. 治理依據與任務邊界

本 Brief 依下列已核准文件與現況建立：

- `docs/slot-hub-master-blueprint-v1.md`
- `docs/guide-content-workflow-v1.md`
- `docs/guide-game-relationship-v1-readonly-spec.md`
- 現有 30 款 `published` Game、8 篇 `published` Guide、Guide Schema、relationship resolver、Search 與 Explorer 投影

本題已由產品負責人核准，目標是教使用者判讀 Multiplier 作為遊戲功能時的規則與限制。它不是最高倍數排行榜，也不回答哪款遊戲比較容易中獎。

本階段只建立 Brief。不得建立 Guide draft、修改既有 Guide、Schema、taxonomy、resolver、Search、Explorer、UI 或 Game 資料。

## 2. 搜尋意圖與使用者問題

### 2.1 主要搜尋意圖

使用者看到 `Multiplier`、倍數符號或「倍數累積」時，想知道該倍數：

1. 乘在哪一個數值上；
2. 只影響一條賠線、單次得獎、當前 Tumble，還是整個 Bonus；
3. 多個倍數是相加、相乘、取最高值，還是依遊戲公式處理；
4. 何時開始、何時重設、是否會黏著或鎖定；
5. 是否能跨旋轉、跨 Cascade／Tumble 或只在特定 Bonus 中生效；
6. 與整局最高倍數 `maxWinMultiplier` 有何不同。

### 2.2 文章必須回答

- 一般 Multiplier 如何套用到一次得獎或當前旋轉。
- Wild Multiplier 為何同時具有 Wild 與倍數功能，且替代規則與倍數規則要分開看。
- 累積／遞增 Multiplier 如何增加，以及何時歸零。
- Sticky／Locked Multiplier 的「位置保留」「數值保留」與「跨幾個回合」不能視為同一件事。
- 特定 Bonus Multiplier 為何可能只在 Free Spins、Bonus Round 或特定進程生效。
- 多個倍數符號的運算方式不能依名稱猜測，必須閱讀正式公式或規則。
- Multiplier 不代表提高觸發機率、勝率、RTP 或保證結果。
- 單一 Multiplier 的上限不等於整款遊戲的最高倍數。

## 3. 現有 30 款遊戲覆蓋

### 3.1 統計

- 公開遊戲：30 款。
- `features` 含 `multiplier`：25 款，覆蓋率 83.3%。
- 未標記 `multiplier`：5 款，分別是 Greedy for Gold: Hold and Win、Hand of Anubis、Legacy of Dead、Rich Wilde and the Book of Dead、Starburst。

依 Provider 分布：

| Provider | 含 Multiplier 遊戲數 |
| --- | ---: |
| Pragmatic Play | 5 |
| PG SOFT | 4 |
| ATG Games | 3 |
| Hacksaw Gaming | 3 |
| Slotmill | 3 |
| Booming Games | 2 |
| Big Time Gaming | 1 |
| CQ9 Gaming | 1 |
| JILI Games | 1 |
| NetEnt | 1 |
| Play’n GO | 1 |

這個樣本足以說明 Multiplier 不是單一固定機制，但 `features: multiplier` 只表示遊戲具有倍數功能，不代表 25 款都使用相同公式。文章不得從共用標籤反推精確規則。

### 3.2 25 款站內結果

按 Provider 分組如下：

- Pragmatic Play：Big Bass Bonanza、Gates of Olympus、Gates of Olympus 1000、Sweet Bonanza、Sweet Bonanza 1000。
- PG SOFT：Fortune Ox、Fortune Tiger、Mahjong Ways、Mahjong Ways 2。
- ATG Games：Storm of Seth、Storm of Seth 2: Awakening、Sun Wu Kong。
- Hacksaw Gaming：Cash Crew、Chaos Crew、Wanted Dead or a Wild。
- Slotmill：Ragnarök: Gold、Shadow of Dominion、Wildhalla。
- Booming Games：Fish Tales: Double Catch Max Scatter、Fortune Paw。
- Big Time Gaming：Bonanza。
- CQ9 Gaming：Jump High。
- JILI Games：Super Ace。
- NetEnt：Gonzo’s Quest。
- Play’n GO：Reactoonz。

## 4. 原廠術語與語意分類

下表是文章應使用的教學分類，不是新 taxonomy。正式文章仍只宣告共用 Feature `multiplier`。

| 教學分類 | 要解釋的規則 | 已取得第一方案例 | 不可自行推論 |
| --- | --- | --- | --- |
| 一般倍數 | 對當次得獎、旋轉總贏分或規則指定基數套用倍數 | Storm of Seth 2 的 standard multiplier；Mahjong Ways 的 reel bar multiplier | 不得假設所有倍數都乘 total bet |
| Wild Multiplier | 符號具有 Wild／替代功能，同時按規則放大得獎 | Cash Crew 的 multiplier symbols | 不得假設多個 Multiplier Wild 一律相加或相乘 |
| 累積／遞增倍數 | 連續得獎、Tumble、Avalanche 或 Bonus 進程使倍數逐步提高 | Bonanza、Gonzo’s Quest、Mahjong Ways、Gates of Olympus 1000、Jump High、Super Ace | 不得省略重設時機或把最高階段當成每次固定值 |
| Sticky／Locked Multiplier | 倍數符號、位置或數值在規則限定期間保留 | Storm of Seth 2 的 Multiplier Lock & Accumulation；Cash Crew Vault 的 multiplier positions | Sticky 與 Locked 不是全產業完全同義，也不代表永久保留 |
| 特定 Bonus 倍數 | 倍數只在 Free Spins、Bonus Round、進程或特殊模式生效 | Big Bass Bonanza、Bonanza、Gonzo’s Quest、Gates of Olympus 1000 | Bonus 內倍數不能自動代表基礎遊戲規則或整局最高倍數 |

### 4.1 運算方式必須保留原廠定義

第一方資料已證明不同遊戲的運算不一致：

- Cash Crew 表示同一得獎賠線上若有多個 multiplier，倍數彼此相乘。
- Storm of Seth 2 公開公式為 `Current Win x (Current Spin Multiplier + Global Multiplier)`，其中當前與全域倍數先相加。
- Gates of Olympus 1000 會在 Tumble 序列結束後結合出現的 multiplier values，再依規則套用；正式文章若要描述更精確的結合算法，必須引用正式規則原文，不能只依介面名稱補寫。

因此文章應教讀者找公式、基準、持續期間與重設條件，不提供一套假裝適用全部遊戲的計算法。

## 5. 第一方來源與代表案例

### 5.1 建議主要案例（7 款）

| 遊戲 | 教學用途 | 已核對的官方原文／規則重點 | 第一方來源 |
| --- | --- | --- | --- |
| Cash Crew | Wild Multiplier、多倍數運算、Bonus 位置保留 | `Multiplier symbols` 為 Wild；同一賠線多個倍數彼此相乘；Vault 可啟用 multiplier positions | [Hacksaw Gaming 官方遊戲頁](https://www.hacksawgaming.com/games/cash-crew) |
| Storm of Seth 2: Awakening | 一般、累積、Sticky／Locked 與明確公式 | `Sticky Multipliers`、`Multiplier Lock & Accumulation`；standard multiplier、rare accumulating multiplier、Global Multiplier 與官方公式 | [ATG Games 官方遊戲頁](https://www.atg-games.com/en/games/slot/storm-of-seth-2-awakening) |
| Mahjong Ways | 連續得獎後遞增的倍數列 | 官方 Game Information 的 `MULTIPLIER`：由 x1 開始，得獎後依序進入 x2、x3、x5 | [PG SOFT 官方 Game Information PDF](https://www.pgsoft.com/uploads/Games/Pdf/MahjongWays_Gameinformation_EN.pdf) |
| Gates of Olympus 1000 | 一般 multiplier symbol 與 Bonus 累積倍數 | multiplier symbols 可在 spins／tumbles 出現，值為 2x–1,000x；Bonus 會把值加入 round total multiplier | [Pragmatic Play 官方遊戲頁](https://www.pragmaticplay.com/en/games/gates-of-olympus-1000/) |
| Bonanza | Free Spins 中無上限遞增倍數 | 官方標示 `Unlimited Win Multiplier`；Free Spins 中每次得獎 reaction 令倍數增加 1 | [Big Time Gaming 官方遊戲頁](https://beta.bigtimegaming.com/games/bonanza) |
| Gonzo’s Quest | Avalanche 累積、重設與模式差異 | 每次 Avalanche 令倍數加 1，未得獎旋轉重設；基礎遊戲最高 5x，Free Fall 最高 15x | [NetEnt 官方遊戲頁](https://netent.com/games/gonzos-quest/) |
| Big Bass Bonanza | 特定 Bonus 進程倍數，不等於整局 Max Win | Free Spins 中 Fisherman 進程會增加 spins 與 multipliers，該回合最高可到 10x | [Pragmatic Play 官方發布資料](https://www.pragmaticplay.com/en/news/pragmatic-play-turns-fishing-to-spins-in-big-bass-bonanza/) |

### 5.2 可作簡短對照的亞洲市場案例

| 遊戲 | 可支持的敘述 | 第一方來源與限制 |
| --- | --- | --- |
| Jump High | Free Game 具有 accumulating multiplier | [CQ9 Gaming 官方新聞](https://www.cq9gaming.com/news/detail/949)；適合證明功能存在，不宜單靠此頁補寫完整計算公式 |
| Super Ace | 連續消除可累積倍率，Free Game 倍率規則與主遊戲不同 | [JILI Games 官方遊戲頁](https://jiligames.com/PlusIntro/49?showGame=true)；正式草稿須保留官方用語，不自行推導機率或完整數值表 |

### 5.3 來源等級與草稿要求

- A 級規則來源：官方 Game Rules、Paytable、遊戲內規則、正式技術文件。
- A 級產品來源：官方遊戲頁、正式發布稿、Client Hub。
- B 級來源只能補充官方缺值並清楚標示。
- 產業媒體、第三方資料庫只能作線索。
- 搜尋摘要、AI 回答、娛樂城轉述與無來源文章不得支撐精確規則。

上表來源足以建立文章主線。正式草稿若要加入未列出的精確倍數、重設條件或公式，仍必須回到相應第一方完整語境核對。

## 6. 與最高倍數及其他概念的邊界

### 6.1 Multiplier 不等於整局最高倍數

- Multiplier 是規則中的放大功能；`maxWinMultiplier` 是整款遊戲在明確條件下的上限比較值。
- 單一 multiplier symbol 的最大值、Bonus 進程的 10x、某次 Avalanche 的 15x，都不能只靠該數字填成整局最高倍數。
- 本文應連到既有「最高倍數怎麼看」Guide，避免重寫 Max Win、Max Exposure、Winning Ratio 與投注基準的完整內容。

### 6.2 Multiplier 不回答 RTP、波動度或勝率

- RTP 描述長期理論回報，不是某個倍數功能的觸發率。
- 波動度描述結果分布與起伏，不等於倍數大小。
- 倍數功能存在不代表更常得獎，也不保證 Bonus、累積倍數或高倍數會出現。
- 多 RTP 版本不代表 Multiplier 規則一定不同；只有第一方規則明確區分時才能如此描述。

### 6.3 與既有內容的差異

- `slot-symbols-and-features` 只簡短提到帶倍數的 Wild，以及 Free Spins 可能加入倍數，沒有解釋倍數基準、運算、累積、鎖定與重設。
- `slot-max-win-explained` 的職責是辨識整局上限與不同單位，並明確指出單一 Multiplier 不等於 Max Win；它不承接 Multiplier Feature 的完整教學。
- `slot-payout-mechanisms-explained` 解釋中獎組合如何成立；Multiplier 通常是在有效得獎成立後依規則調整結果，不應被寫成第二個主要 Mechanism。
- 目前沒有 published Guide 在 frontmatter 宣告 `relatedFeatures: [multiplier]`，因此不存在需移交的既有關聯所有權。

新文章屬補足內容缺口，不應修改上述文章正文或移除其既有關聯。

## 7. 建議 Guide 規格

### 7.1 建議識別

- 建議 slug：`slot-multiplier-explained`
- 建議標題：`老虎機 Multiplier／倍數功能怎麼看？一般倍數、Wild Multiplier 與累積倍數的差異`
- 建議 description：`看懂老虎機 Multiplier 乘在哪裡、何時累積與重設，分清一般倍數、Wild Multiplier、Sticky／Locked Multiplier、Bonus 倍數與整局最高倍數。`
- category：`mechanics`
- level：`beginner`
- 初始 status：`draft`

建議 frontmatter 關聯只能是：

```yaml
relatedFeatures:
  - multiplier
```

不得加入 `relatedMechanisms`、`relatedDataTopics`、`relatedGames` 或 `relatedProviders`。

### 7.2 建議章節

1. Multiplier 到底乘在哪裡？先找基準、範圍與時機。
2. 一般倍數：當次得獎與當前旋轉。
3. Wild Multiplier：替代符號與放大規則要分開讀。
4. 累積倍數：連續得獎、Tumble／Avalanche 與重設。
5. Sticky／Locked Multiplier：保留的是位置、數值還是回合。
6. 特定 Bonus 倍數：只在 Free Spins 或進程中生效。
7. 多個倍數如何合併：相加、相乘或依官方公式。
8. Multiplier 與最高倍數、RTP、波動度的差異。
9. 讀規則時的檢查清單。

文章以 5–7 款主要案例帶出差異，其餘案例只作短對照，不寫成遊戲清單或排行榜。

## 8. 關聯所有權與產品投影

### 8.1 現況與預期

- Guide Schema 已允許 `relatedFeatures: [multiplier]`。
- taxonomy 已有 Feature `multiplier`，繁中顯示名稱為「倍數」。
- 共用搜尋 aliases 已有 `Multiplier`、`倍數`。
- Explorer 可產生語意精確的 `/games/?features=multiplier`，因此本題可同時顯示「了解概念」與「探索相關遊戲」。
- 現有 relationship index 對 `multiplier` 回傳空 Guide，發布前屬合法 deferred 狀態。
- 新 Guide 若日後 published，`Feature -> Guide` 會唯一指向新文章，`Guide -> Games` 會推導 25 款，25 款也會建立 `Game -> Guide` 關係。
- 不需修改任何既有 published Guide frontmatter，因此沒有關聯所有權移交人工關卡。

### 8.2 Search、Explorer 與 Guide detail

模擬發布時應驗證：

- 搜尋 `Multiplier`、`倍數` 能清楚分成「了解概念」Guide 與 `/games/?features=multiplier` 的「探索相關遊戲」。
- Explorer 選取 Multiplier 時顯示低干擾 Guide CTA，不改變既有 query、排序或篩選結果。
- Guide detail 由同一 relationship index 顯示 3–6 款代表遊戲，不在 frontmatter 手抄清單。
- 代表遊戲按 `editorialFeatured`、資料完整度、名稱穩定排序。以目前資料模擬，前六款為 Chaos Crew、Ragnarök: Gold、Shadow of Dominion、Storm of Seth 2: Awakening、Fish Tales: Double Catch Max Scatter、Fortune Ox。這是 resolver 的資料排序結果，不是推薦排行。

### 8.3 單款頁最多三篇的排序影響

模擬加入 published Multiplier Guide 後：

- 25 款都會存在反向 relationship index 關係。
- 8 款會在目前單款頁前三篇直接顯示新 Guide：Big Bass Bonanza、Fish Tales: Double Catch Max Scatter、Fortune Paw、Gates of Olympus、Gates of Olympus 1000、Jump High、Reactoonz、Sweet Bonanza 1000。
- 其餘 17 款雖有關聯，但因 Mechanism、Data Topic 優先及最多三篇規則，不會在單款頁前三篇出現。
- 部分第三順位既有 Feature Guide 會被新 Guide 取代，例如 Big Bass Bonanza 的 `slot-symbols-and-features`、Gates of Olympus 1000 的 `slot-terms-glossary`；這是現行相同 Feature 優先層內按標題穩定排序的結果。

此現況不阻止進入文章草稿階段，但在 `RELATIONSHIP_PREVIEW_REVIEW` 必須逐項核對。若產品要求 25 款全部在單款頁直接露出 Multiplier Guide，將涉及 resolver／UI 排序決策，必須另行進入人工關卡，本 Brief 不授權修改。

### 8.4 `/slots/` Knowledge Map

目前 `/slots/` Knowledge Map 使用共用 relationship index 取得連結，但顯示哪些概念仍由頁面中的精選清單控制，該清單尚未包含 `multiplier`。新 Guide 發布後不會自動新增一張 Multiplier Knowledge Map 卡片。

這不是關聯錯誤，也不阻止草稿；v1 可維持 Knowledge Map 不新增入口。若日後要新增，需在 Guide 實作核准範圍中明確列出 UI 變更，不能藉本 Brief 自動擴張。

## 9. 內容風險與禁止敘述

正式文章不得：

- 暗示 Multiplier 提高勝率、RTP、獲利機會或保證結果。
- 把 UI 顯示的最大 Multiplier 當成發生機率或整局 Max Win。
- 把一般、Wild、累積、Sticky／Locked 與 Bonus Multiplier 寫成互斥且全產業一致的官方分類。
- 假設多個倍數必然相乘、相加或取最高值。
- 省略倍數的投注基準、套用範圍、持續期間與重設條件。
- 把 Tumble、Avalanche、Cascade 當成 Multiplier 本身；它們可能是讓倍數遞增的流程 Feature。
- 把 Marketing 名稱直接轉成未經規則支持的結構化事實。
- 建立 Multiplier 排行榜、推薦下注金額、SEO 集合頁或「高倍數比較容易贏」的結論。
- 將內部欄位缺值、Agent 判定或製作流程寫進讀者文章。

## 10. 文章草稿階段的驗收建議

若人工核准本 Brief 進入草稿，下一階段至少應：

1. 建立單一 Guide draft，且只宣告 `relatedFeatures: [multiplier]`。
2. 以本 Brief 已核對的第一方來源建立 5–7 款主要案例；新增精確敘述須回到第一方完整語境。
3. 連結既有最高倍數、RTP、波動度與賠付機制 Guide，但不重寫其內容。
4. 暫時模擬 published，檢查 `Feature -> Guide` 唯一所有權、25 款雙向關聯與 3–6 款代表遊戲。
5. 核對上述 8 款前三篇變化與 17 款未露出的實際畫面；不自行修改 resolver。
6. 驗證 Search 的雙意圖、精確 `/games/?features=multiplier`、Explorer 狀態與返回路徑。
7. 確認未標記 Multiplier 的 5 款不會被正文關鍵字或 Bonus 文字誤連。
8. 驗證 Multiplier 不被當成 Mechanism 或 Data Topic；最高倍數 Guide 的所有權不變。
9. 檢查桌機與 390×844 手機、長標題、0／1／2／3 Guide 狀態及整頁水平溢位。
10. 完成 Relationship、Search、Explorer、Game detail fixtures、Astro Check、Build、內部連結、Draft 隔離與 Preview safeguards，最後恢復 `status: draft`。

## 11. 是否具備進入文章草稿階段的條件

結論：具備。

理由：

- 主題、搜尋意圖與 Feature 關聯已明確。
- 30 款中有 25 款可建立結構化關聯，樣本足以支持完整教學。
- 已取得涵蓋一般、Wild、累積、Sticky／Locked 與 Bonus 倍數的多家第一方來源。
- 現有 Guide 只局部提及倍數，沒有文章完整承接此概念。
- Schema、taxonomy、精確 Explorer URL 與雙向 resolver 均能直接承接。
- 無需移交既有 published Guide frontmatter 所有權。

非阻擋提醒：單款頁最多三篇造成 17 款不會直接露出新 Guide，以及 `/slots/` Knowledge Map 不自動新增 Multiplier 卡片。兩者都應在後續模擬發布時如實審查；未獲新授權前不得修改 resolver 或 UI。

## 12. 工作流固定尾段

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_STATE: READONLY_BRIEF_COMPLETE`

`GUIDE_SLUG: slot-multiplier-explained`

`GUIDE_TITLE: 老虎機 Multiplier／倍數功能怎麼看？一般倍數、Wild Multiplier 與累積倍數的差異`

`RELATIONSHIP_TYPE: Feature -> multiplier`

`SOURCE_STATUS: PASS；已取得多家第一方規則、產品頁與正式發布資料，新增精確敘述仍須逐項核對完整語境`

`CONTENT_QA_RESULT: PASS；搜尋意圖、文章邊界、案例主線與禁止敘述已定義`

`RELATIONSHIP_RESULT: PASS_WITH_REVIEW_NOTE；25 款可雙向推導，8 款進入目前前三篇，17 款受最多三篇規則限制`

`UI_RESULT: NOT_RUN；本階段不實作或模擬發布，/slots/ Knowledge Map 不會自動新增 Multiplier 卡片`

`TEST_RESULTS: 只讀資料與 relationship 模擬、Markdown 格式及 git diff --check 通過`

`BLOCKERS: NONE`

`FILES_CHANGED: docs/slot-multiplier-guide-v1-readonly-brief.md`

`COMMIT_SHA: N/A`

`GIT_STATUS: 本 Brief 為唯一未提交變更`

`NEXT_ALLOWED_ACTION: 人工審查 Brief；核准後才可建立 Guide draft`

`COMMIT_ALLOWED: NO`

`PUSH_ALLOWED: NO`

`DEPLOY_ALLOWED: NO`

`HUMAN_APPROVAL_REQUIRED: YES`
