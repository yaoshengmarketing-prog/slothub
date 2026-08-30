# RTP Guide v1 只讀補強 Brief

> **READ-ONLY CONTENT BRIEF**  
> 核對日期：2026-08-30  
> 目標 Guide：`src/content/guides/rtp-explained.md`  
> 永久 slug：`rtp-explained`  
> 本文件只定義既有 Guide 的內容補強方向；不授權修改 Guide、Game、Schema、taxonomy、relationship、Search、Explorer、UI、網址或索引政策。

## 1. 結論摘要

`rtp-explained` 應維持同一篇永久 Guide 與原 slug，不需要拆頁或移交 relationship owner。現有文章的兩段核心判斷是正確的：RTP 是大量、長期結果下的理論回報比例；同款遊戲可能存在不同 RTP 設定。但目前只有約 99 個非空白正文字符、沒有小節與來源，尚不足以回答使用者從 Game detail 的 RTP 欄位進入後最直接的問題。

建議補強成一篇約 1,600～2,300 個繁中文字的 beginner Guide，優先回答：百分比的投注與獎金基準、理論 RTP 與短期實際結果、同款多版本、RTP 與波動度的分工、RTP 與 house edge 的有限互補關係，以及如何連同來源、版本與核對日期閱讀 Slot Hub 的數字。

本輪不建議加入 Knowledge Diagram。純文字、簡短公式、對照表與具名案例已足以處理主要理解障礙；若未來實際文章測試證明「理論值／短期實際值／樣本量」仍難以理解，再另行提出獨立 Diagram Pilot，不應因現有圖解系統可用而自動加入。

## 2. 現況與資料覆蓋

### 2.1 現有文章

| 項目 | 現況 |
| --- | --- |
| 標題 | `RTP 是什麼？如何正確閱讀` |
| description | `說明老虎機標示 RTP 的意義、限制與多版本差異。` |
| relationship | `relatedDataTopics: [rtp, rtp-variants]` |
| status | `published` |
| 正文 | 兩段；約 99 個非空白字符 |
| H2／H3 | 0／0 |
| 來源連結 | 0 |
| 具名案例 | 0 |

### 2.2 30 款 published Game

| 結構化狀態 | 遊戲數 | 取得率 |
| --- | ---: | ---: |
| 有主要 `rtp` | 17 | 56.7% |
| 有 `rtpVariants` | 10 | 33.3% |
| 缺少主要 `rtp` | 13 | 43.3% |

有多版本 RTP 的十款為：Chaos Crew、Wanted Dead or a Wild、Fortune Ox、Fortune Tiger、Mahjong Ways、Mahjong Ways 2、Rich Wilde and the Book of Dead、Ragnarök Gold、Shadow of Dominion、Wildhalla。

缺少主要 RTP 的十三款必須維持缺值；文章不得借用同系列、其他市場、第三方資料庫或搜尋摘要補猜數字。

## 3. 使用者從 Game detail 進入後需要的答案

1. `96% RTP` 的分母與分子是什麼，是否代表每次投注會拿回 96%。
2. 為什麼自己的短期紀錄可能遠離標示 RTP。
3. RTP 是遊戲設計的理論值，還是某平台近期實際跑出的結果。
4. 同一款遊戲為什麼可能列出多個 RTP，現在看到的是哪一個版本。
5. 多個百分比是可選版本、整體與 Feature 的貢獻，還是不同時期文件；三者不能混為一談。
6. 高 RTP 是否代表短期比較容易贏；答案必須明確為否。
7. RTP、波動度與最高倍數各回答什麼，不應互相替代。
8. Slot Hub 的數字是否有第一方來源、核對日期與版本語境。
9. 資料缺失時，為什麼留空比填入未核對數字更可靠。

## 4. 核心定義與必須保留的語意

### 4.1 理論 RTP

英國 Gambling Commission 將 theoretical RTP 定義為遊戲被設計的回報百分比，也是應顯示於玩家規則中的 advertised RTP。文章可用一般語言解釋為：在規則採用的投注與獎金基準下，遊戲經過大量結果後，設計上預期以獎金回到玩家的比例。

對一般固定規則的老虎機，`96%` 可用簡化例子解釋為：若把非常大量投注的總額視為 100 個單位，理論上約 96 個單位以獎金形式回到玩家整體，約 4 個單位不回到玩家。但這是群體、長期與理論層級的比例，不是任何單一玩家、單次旋轉或一段遊戲時間的承諾。

### 4.2 投注與回報基準

監管用語中的 turnover 是遊戲所有 stake 的總額，也包含將已得獎金再次投入的投注；win 是遊戲發出的全部獎金。實際 RTP 的基本計算為 `win ÷ turnover`。讀者文章需說清楚，這裡的「回報」是獎金總額相對投注總額的比例，不是淨利率，也不是把入金額當成固定分母。

若原廠文件另以 Overall、Main Game、Free Spins Feature 等欄位拆分 RTP，文章必須保存原廠欄位語意。Feature contribution 不能因為也是百分比，就自動當成另一個可選 RTP 版本。

### 4.3 長期理論值不等於單次結果

監管資料明確指出，RTP 是大量遊戲後的平均，不是每一次遊戲都會達到的結果。文章需避免「玩得夠久一定拿回 X%」這種個人層級承諾；理論值描述數學模型與大量結果，不保證單一玩家最終接近該值，也不代表先前輸贏會使下一次結果補償回目標值。

### 4.4 理論 RTP 與實際 RTP

| 概念 | 應如何說明 | 不應如何說明 |
| --- | --- | --- |
| 理論 RTP | 遊戲設計／規則中的目標回報比例 | 某玩家實際可取回的保證比例 |
| 實際 RTP | 某段期間的總獎金 ÷ 總投注額 | 遊戲永久、固定的新 RTP |
| 樣本量 | 樣本較少時，實際值可離理論值較遠 | 短期偏離即證明遊戲規則錯誤 |
| 波動度 | 影響結果分散程度與監測容許區間 | RTP 的另一個名稱 |

Gambling Commission 的監測示例亦指出，有限遊戲量下容許範圍較寬；遊戲量增加後，實際 RTP 才預期更接近理論 RTP。文章可解釋方向，不需搬入監管頁的完整統計表或假裝為個人遊戲建議。

## 5. 多版本 RTP 應如何閱讀

同一款遊戲存在多個官方 RTP 值，可能表示廠商提供不同配置，但文章不得進一步假設每個平台、國家或當前遊戲實例都能選到所有配置。使用者仍應核對正在使用版本的 Game Rules／Help／Paytable。

閱讀順序建議：

1. 先確認官方文件是否明確把數字列為 RTP 配置或版本。
2. 確認主要顯示值是 Slot Hub 的編輯選定值，還是當前平台實例的即時設定；兩者不能互相冒充。
3. 檢查文件更新日期、遊戲版本與市場語境。
4. 將 Overall RTP、Main Game contribution、Feature contribution、歷史文件數字分開。
5. 若來源只支持一個值，就只顯示一個值；缺值保持空白。

多 RTP 版本不代表最高倍數、波動度或其他規則一定同步改變。除非第一方文件明確列出版本連動，本篇不得推導。

## 6. RTP、波動度、最高倍數與賠付機制的邊界

| 資料 | 回答的問題 | 本篇處理深度 |
| --- | --- | --- |
| RTP | 大量結果下，投注總額有多少比例理論上以獎金回到玩家 | 完整說明 |
| 波動度 | 結果分布相對集中或分散、起伏可能多大 | 只說明與短期偏離的關係，細節連至 Volatility Guide |
| 最高倍數 | 在原廠定義與條件下，最高結果的倍數語意 | 只區分指標；細節連至 Max Win Guide |
| 賠付機制 | 中獎組合如何成立 | 不在本篇重述，連至 Mechanism Guide |
| Hit Frequency／命中率 | 某類得獎事件發生頻率 | 不可由 RTP 推算；無核准資料時不展開 |

高 RTP 不等於高命中率、低波動、較容易短期得獎或更可能取得最高倍數。

## 7. RTP 與 House Edge

在同一個固定規則遊戲、相同 turnover／win 基準、且來源確實提供 theoretical RTP 的簡化情況下，`100% - RTP` 可描述為理論上未以獎金回到玩家的比例；例如 96% 對應 4%。

但文章不能把所有來源的 house edge 都機械換算為 `100% - RTP`。以下情況需要保留原詞或停止換算：

- 來源提供的是 actual RTP，而不是 theoretical RTP。
- 百分比只是 Main Game 或 Feature contribution，不是 Overall RTP。
- 遊戲有策略因素，而 RTP 依特定策略計算。
- 來源使用 margin、over-round、commission、jackpot contribution 或其他不同基準。
- 遊戲屬 peer-to-peer、累積獎池或其他不能以同一簡化模型解釋的形式。
- 多版本中未確認實際配置。

本篇可介紹有限互補關係，但不應把 house edge 延伸成跨遊戲類型的通用換算教學。

## 8. 具名案例與第一方來源

### 8.1 Mahjong Ways：Overall 與 Feature contribution 不等於多版本

PG SOFT 2019 年 Game Information 文件把 `Overall 96.92%`、`Main Game 68.89%`、`Free Spins Feature 28.03%` 分列，並稱 96.92% 為 long term theoretical game payout。這可用來解釋：Main Game 與 Feature 數值是整體 RTP 的組成語境，不是三個供平台選擇的 RTP 版本。

PG SOFT 後續官方 Game Information summary 則列出 `94% | 95% | 96.92% | 97% | 98% | 99% | 100%`。這可用來解釋：版本清單必須由明確的官方版本文件支持；舊文件與更新文件的日期、格式及用途應一併保存。

- [PG SOFT Mahjong Ways 2019 Game Information](https://www.pgsoft.com/uploads/GamesResource/ab4466ec-4093-4994-b68f-be7ce48f68fa.pdf)
- [PG SOFT Mahjong Ways Game Information summary](https://www.pgsoft.com/uploads/Games/Pdf/MahjongWays_Gameinformation_EN.pdf)

### 8.2 Wanted Dead or a Wild：明確列出的多配置

Hacksaw Gaming 官方遊戲頁在 Game Data 中列出 `96.38%; 94.55%; 92.33%; 88.42%`。這是適合示範多版本清單的案例；文章仍須提醒，官方產品頁列出配置，不等於證明每個市場與平台都同時提供全部配置。

- [Hacksaw Gaming Wanted Dead or a Wild](https://www.hacksawgaming.com/games/wanted-dead-or-a-wild)

### 8.3 Ragnarök Gold／Shadow of Dominion：同一官方目錄的不同 Game ID 配置

Slotmill 官方 Game list 分別列出 96% 與 94% 版本，且用不同 numerical Game ID 表示。這可用來解釋：同名遊戲可能以不同配置識別；核對時不能只看顯示名稱，也要保存 Game ID、來源日期與版本標示。

- [Slotmill official Game list](https://developer.slotmill.com/gamelist/)

### 8.4 Starburst：來源時期差異不等於當前 RTP variant

NetEnt 現行官方遊戲頁列出 `96.08% RTP`；專案保存的歷史官方文章曾出現 96.09%。兩個不同時期官方頁面的相近數字，不足以單獨證明它們是當前可選配置，因此 Slot Hub 現行只將 96.08% 結構化為主要 RTP，沒有把 96.09% 列成 variant。

- [NetEnt Starburst current game page](https://netent.com/games/starburst)
- [NetEnt historical article saved by the project](https://old.netent.com/sv/4-favorite-netent-games-played-in-japan/)

### 8.5 監管定義與計算

- [UK Gambling Commission：Return to player—how much gaming machines payout](https://www.gamblingcommission.gov.uk/public-and-players/guide/return-to-player-how-much-gaming-machines-payout)
- [UK Gambling Commission：Key terms for live RTP monitoring](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/key-terms-relating-to-live-return-to-player-performance-monitoring-of-games)
- [UK Gambling Commission：How to calculate RTP](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/how-to-calculate-return-to-player-rtp)
- [UK Gambling Commission：RTS 3 rules and likelihood information](https://www.gamblingcommission.gov.uk/guidance/regulatory-returns-guidance/rts-3-rules-game-descriptions-and-the-likelihood-of-winning)
- [UK Gambling Commission：How online games are tested and monitored](https://www.gamblingcommission.gov.uk/public-and-players/guide/page/how-we-ensure-online-gambling-games-are-fair)

## 9. 建議保留、改寫與擴充

### 9.1 保留

- RTP 是大量、長期結果下的理論回報比例。
- RTP 不是保證值，也不表示單次遊戲接近該比例。
- 同款遊戲可能有不同 RTP 設定。
- Slot Hub 只在取得官方版本證據時分開列出。

### 9.2 改寫

- 將現有第一段擴充為 theoretical RTP、投注總額、獎金總額與長期平均的完整定義。
- 將現有第二段改為「多版本、功能 contribution、歷史來源差異」三者的辨識流程。
- 避免籠統使用「長期一定回到 RTP」；改成大量結果下模型與實際值的關係。

### 9.3 擴充

- theoretical RTP 與 actual RTP。
- turnover／win 的分子分母。
- 波動度與有限樣本的差異。
- house edge 的有限換算條件。
- Game detail 閱讀順序：主要值、variants、第一方來源、last verified／updated date。
- 具名案例與來源。
- 缺值維持空白的資料原則。

## 10. 建議文章架構

1. **RTP 先看一句話**：RTP 是大量結果下的理論回報比例，不是單次承諾。
2. **96% 到底代表什麼**：turnover、win、理論百分比與簡化例子。
3. **為什麼短期結果不會貼著 RTP**：actual RTP、樣本量與波動度。
4. **同款遊戲為什麼有多個 RTP**：配置、版本、市場／平台不確定性。
5. **不是每個百分比都是 RTP variant**：Overall、Main Game、Feature contribution、歷史文件。
6. **RTP 與 house edge 怎麼對照**：可換算的窄條件與不能換算的情況。
7. **RTP、波動度、最高倍數各看什麼**：三欄對照並連至既有 Guide。
8. **在 Slot Hub 怎麼讀一筆 RTP**：數字、variants、來源、核對日期、缺值。
9. **四個常見誤解**：高 RTP 不保證短期贏、不是命中率、不是最高倍數、版本不一定全市場可用。
10. **官方資料來源**：監管定義與具名遊戲來源。

建議正文約 1,600～2,300 個繁中文字；表格控制在 2～3 個，避免把內容做成數值排行榜或重複 Game database。

## 11. 風險語言與禁止敘述

不得出現：

- 「96% RTP 表示每投 100 元會拿回 96 元」。
- 「高 RTP 的遊戲短期比較容易贏」。
- 「輸得越多，遊戲之後越會補回 RTP」。
- 「玩得夠久，個人一定能達到標示 RTP」。
- 「RTP variant 越多，玩家就一定能自行選擇」。
- 「多 RTP 版本代表最高倍數或波動度同步改變」。
- 將 Main Game／Feature contribution 當成可選版本。
- 將歷史數字差異自動升格為 variant。
- 用第三方資料替十三款缺值遊戲補猜 RTP。
- 提供哪款更值得玩、如何下注或提高獲利的建議。

## 12. 關聯系統與產品影響

### 12.1 Owner 與反向關聯

- 現有 owner：`rtp-explained`。
- 宣告維持：`relatedDataTopics: [rtp, rtp-variants]`。
- Game → Guide 仍完全由 published Game 的 `rtp`／`rtpVariants` 與既有 resolver 推導。
- 有主要 RTP 且有 variants 時，Game detail 只顯示一次 RTP Guide CTA。
- 只有 variants、沒有主要 RTP 時，CTA 應位於「所有 RTP 版本」欄位。
- 缺少兩者時不顯示 CTA。

### 12.2 Search／Explorer／Knowledge Map

- Search 繼續提供「了解 RTP」的 Guide 意圖。
- Data Topic 尚無精確結構化 Explorer URL，因此不得新增假的 `/games/?q=RTP`「探索遊戲」CTA。
- 不修改 Explorer URL schema、Knowledge Map 或 Game detail presentation。

### 12.3 測試預期遷移

`NONE`。本次只補強同 slug、同 status、同 relationship frontmatter 的正文；relationship owner、反向關聯數、Search intent 與 UI placement 均不應改變。未來草稿實作只需做回歸驗證，不需要遷移預期。

## 13. Knowledge Diagram 評估

### 結論：本階段不建議

RTP 的主要理解問題可由一句核心定義、簡短公式、理論／實際對照表與具名案例處理。現有正文不是因流程難以視覺化而不足，而是缺少分母分子、樣本量、多版本與來源邊界。

如果未來人工審查發現純文字仍無法清楚區分 theoretical RTP、actual RTP 與 single-session result，可另做只讀 Diagram spec，可能採「尺度／樣本量對照」，但不得把隨機短期路徑畫成必然收斂，也不得暗示個人會得到固定回報。本次 Guide 補強不應與 Diagram 綁定。

## 14. 內容 QA 與回歸測試計畫

### 14.1 內容與來源 QA

- 每個精確百分比、公式與具名案例回到上列第一方或監管來源。
- 確認 `Overall`、`Main Game`、`Free Spins Feature` 的標籤未被改寫成 variant。
- 確認 Starburst 96.09% 只作來源時期差異，不列為可選版本。
- 確認 house edge 的換算附帶相同基準與 theoretical RTP 條件。
- 確認未替十三款缺值遊戲補猜數字。
- 連結 RTP、Volatility、Max Win 與 payout mechanism 既有 Guide，避免重寫其正文。
- 不提供勝率、投注或獲利暗示。

### 14.2 Relationship 與 UI 回歸

- `rtp`、`rtp-variants` 仍唯一由 `rtp-explained` 承接。
- 17 款主要 RTP 與 10 款 variants 的反向關聯依既有 resolver 維持。
- 主要 RTP 與 variants 同時存在時，CTA 只顯示一次。
- 缺值遊戲不顯示 RTP CTA。
- Search 仍只有精確「了解概念」，不產生假的 Data Topic Explorer CTA。
- Game detail 0／1／2／3 Guide 狀態、Guide detail 代表遊戲與內部連結無退化。
- 桌機、390×844、320×844：長標題、表格、來源清單無水平溢位。
- Preview `noindex,nofollow`、空 sitemap、無 production canonical 維持。

### 14.3 未來草稿階段完整命令

在文章仍為 published 的最終本機內容狀態執行與 CI 相同的完整驗證：

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
$env:PUBLIC_SITE_ENV='preview'
npm run verify
```

其他 shell 使用等效環境變數語法；兩個變數與 `npm run verify` 不得省略。

## 15. 仍存在的資料限制

- 13／30 款沒有主要 RTP；本篇不能解決 Game data 缺值。
- 官方產品頁列出多個配置，不一定公開每個市場／平台實際採用值。
- 不同日期的第一方文件可能出現數字差異；需要保存版本與核對日期，不能自動視為 variant。
- 部分官方文件只列 Overall RTP，部分另列 Feature contribution；跨廠商標籤不完全一致。
- 監管資料提供一般定義與監測方法，不代表每款遊戲都採完全相同的報表欄位。
- 本輪沒有重新稽核全部 30 款的每一個 RTP 來源；具名案例已逐項核對，其餘仍以現有已驗證 Game source metadata 為基礎。

上述限制不阻止文章補強，但必須在內容中維持保守語意。

## 16. 工作流固定尾段

`STAGE_RESULT: PASS_TO_NEXT_STAGE`  
`CURRENT_STATE: READONLY_BRIEF_COMPLETE`  
`GUIDE_SLUG: rtp-explained`  
`GUIDE_TITLE: RTP 是什麼？如何正確閱讀`  
`RELATIONSHIP_TYPE: Data Topic → rtp、rtp-variants`  
`SOURCE_STATUS: PASS_WITH_LIMITS；監管定義與四組第一方案例足以支撐補強，未重新稽核全部 30 款來源`  
`CONTENT_QA_RESULT: BRIEF_COMPLETE；正式 Guide 尚未修改`  
`RELATIONSHIP_RESULT: KEEP_EXISTING_OWNER；不修改 owner、frontmatter 或 resolver`  
`UI_RESULT: NOT_RUN`  
`TEST_RESULTS: 只讀內容、資料覆蓋與程式關聯盤點完成；未 Build`  
`BLOCKERS: NONE`  
`FILES_CHANGED: docs/rtp-guide-v1-readonly-brief.md`  
`COMMIT_SHA: N/A`  
`GIT_STATUS: Brief 未提交；既有人工審查／原型目錄維持未追蹤且不在本輪範圍`  
`NEXT_ALLOWED_ACTION: 人工審查 RTP Guide 補強 Brief，並決定是否核准修改既有 published Guide`  
`COMMIT_ALLOWED: NO`  
`PUSH_ALLOWED: NO`  
`DEPLOY_ALLOWED: NO`  
`HUMAN_APPROVAL_REQUIRED: YES`
