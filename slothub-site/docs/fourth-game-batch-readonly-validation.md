# 第四批四款遊戲與 Relax Gaming 只讀驗證

> **READ-ONLY VALIDATION COMPLETE**
>
> 本文件依 `docs/slot-hub-master-blueprint-v2.md` 與 `docs/game-intake-workflow-v1.md` 核對第四批人工核准名單。驗證範圍固定為 Fortune Rabbit、Dead or Alive 2、Temple Tumble、The Great Pigsby Megaways 與 Relax Gaming；未加入 Money Train 4、Fishing、Crash／Aviator 或其他作品。
>
> 資料核對日期：2026-09-03（Asia/Taipei）

## 1. 結論摘要

四款遊戲與一個新 Provider 的身份均可由第一方來源確認，現有 Schema、taxonomy、頁面與驗證架構足以承接。沒有需要新增 Schema、taxonomy 或替換候選的 blocker；官方資料之間的差異可依既有缺值與原文保存原則誠實呈現。

| 項目 | 驗證結果 | 現有模型處理 |
| --- | --- | --- |
| Fortune Rabbit | `PASS_TO_DRAFT` | 保存 3 軸／10 線、RTP variants、Medium、5,000× 與 Wild |
| Dead or Alive 2 | `PASS_TO_DRAFT_WITH_CONFLICT` | 保存 1,600×／100,000× 官方衝突，不建立統一最高倍數 |
| Temple Tumble | `PASS_TO_DRAFT` | 保存 Megaways、46,656 ways、Cascading、Free Spins、Multiplier 與單一已確認 RTP |
| The Great Pigsby Megaways | `PASS_TO_DRAFT_WITH_CONFLICT` | 保存 6×7／5×3、Medium／High 官方衝突；不建立統一波動度或固定盤面 |
| Relax Gaming | `PASS_TO_DRAFT` | 使用現有 Provider roles 建立 developer／aggregator／platform 身份 |

第四批完成後的預定公開母體為 34 款 Game、12 家 Provider。這是已核准批次的數量結果，不是擴張批次。

## 2. 驗證方法與資料原則

- 身份與精確資料優先採官方遊戲頁、正式 Game Information、官方發布稿與官方媒體資產。
- 同一廠商或同一作品的官方頁若互相衝突，完整保存原標籤、數字與語境；不自行選一個數字當作統一值。
- `winMechanism` 只描述一般中獎成立方式；Cascading、Free Spins、Multiplier 等保存為 Feature。
- `winCount` 只在官方數字可作清楚、穩定的賠線或 Ways 數量時填入。標示 `up to` 的動態 Ways 不寫成固定值。
- 缺少公開證據的 RTP、波動度、最高倍數、Bonus Buy、日期、Game ID 或盤面欄位維持缺值。
- 投注上下限若只有特定幣別語境，保留於原廠說明，不寫入缺少幣別語意的通用數值欄位。
- 圖片只採官方頁直接提供的媒體、官方 Client Area 或官方 Game Information PDF 內嵌原圖，不另找第三方替代圖。

## 3. 重複與範圍檢查

四款候選都不是現有 30 款 published Game 的別名、語言版本或重複 slug。

| 候選 | slug | Provider | 重複判定 |
| --- | --- | --- | --- |
| Fortune Rabbit | `fortune-rabbit` | `pg-soft` | 無；與 Fortune Tiger、Fortune Ox、Fortune Paw 為不同作品 |
| Dead or Alive 2 | `dead-or-alive-2` | `netent` | 無；官方明確為 Dead or Alive 續作 |
| Temple Tumble | `temple-tumble` | `relax-gaming` | 無 |
| The Great Pigsby Megaways | `the-great-pigsby-megaways` | `relax-gaming` | 無 |

Relax Gaming 尚不存在於目前 Provider collection；官方 About、產品目錄與發布資料足以確認為獨立 Provider。本批未納入 Money Train 4，也未藉 Relax Gaming 的其他目錄項目擴張名單。

## 4. Fortune Rabbit／金錢兔

### 4.1 身份與命名

| 項目 | 核對結果 |
| --- | --- |
| 正式英文名稱 | `Fortune Rabbit` |
| 官方中文名稱 | 簡中官方規則使用 `金钱兔`；Slot Hub 繁中顯示為 `金錢兔`，並保留 `金钱兔` alias |
| Provider | PG SOFT；沿用既有 `pg-soft` Provider |
| 系列 | 官方資料可辨識為 Fortune 系列，但本批不建立新的系列頁或關聯規則 |

### 4.2 可保存資料

| 欄位 | 核對值 | 處理 |
| --- | --- | --- |
| RTP | `96.75%` | 可作主要顯示值 |
| RTP variants | `94／95／96.75／97／98／99／100%` | 依官方 Game Information 保存 |
| 波動度 | `Session Volatility: Medium` | 原文與 normalized `medium` 都可保存 |
| 最高倍數 | `5,000×` | 官方同時列 `Max Exposure`、`Advertised Max Win` 與最高贏得投注額 5,000 倍；可保存統一值及原標籤 |
| 盤面 | `3 reels；3／4／3 rows` | `reels` 保存完整可變列數原文；`rows` 不壓成單一數字 |
| Mechanism | `paylines` | 官方明列 10 Lines 與 Winning Bet Lines |
| winCount | `10` | 可作固定賠線數 |
| Features | `wild` | Wild 取代除 Prize Symbol 外所有符號；Fortune Spins 保留品牌原詞，不自行映射成 Free Spins |
| Bonus Buy／Game ID／發行日 | 未公開確認 | 保持缺值 |

### 4.3 官方來源與圖片

- [PG SOFT Fortune Rabbit 遊戲頁](https://www.pgsoft.com/en/games/129/)
- [PG SOFT Fortune Rabbit 英文 Game Information](https://www.pgsoft.com/uploads/Games/Pdf/Fortune_Rabbit_Gameinformation_EN.pdf)
- [PG SOFT Fortune Rabbit 中文 Game Information](https://www.pgsoft.com/uploads/Games/Pdf/Fortune_Rabbit_Gameinformation_ZH.pdf)
- [PG SOFT Fortune Rabbit 官方介紹](https://www.pgsoft.com/news/153/)
- 圖片取自官方中文 Game Information 第一頁內嵌的 1686×1192 PNG；保存原圖，不裁切、不加字。

### 4.4 判定

現有 Schema 可完整承接。Fortune Spins 的命名不足以直接映射 `free-spins`，因此只保留於原廠功能說明；這是保守資料判定，不是 taxonomy 缺口。

## 5. Dead or Alive 2

### 5.1 身份與命名

| 項目 | 核對結果 |
| --- | --- |
| 正式名稱 | `Dead or Alive 2` |
| Provider | NetEnt；沿用既有 `netent` Provider |
| 發行日期 | `2019-04-23` |
| 系列 | 官方頁與產品文案可確認為 Dead or Alive 續作；可保存 series 身份，不建立永久系列頁 |

### 5.2 可保存資料與衝突

| 欄位 | 核對值 | 處理 |
| --- | --- | --- |
| RTP | `96.80%` | 可保存主要值 |
| 波動度 | 官方正文描述 high／extreme volatility | 保存原文；不把行銷描述轉成跨廠商 normalized 值 |
| 最高倍數 | 頁面 stat／標題為 `1,600 x bet`；Train Heist 說明為 `up to 100,000x of the original bet` | 兩者範圍與標籤衝突；`maxWinMultiplier` 留空，`maxWinLabelOriginal` 完整保存兩項 |
| 盤面 | `5×3` | reels、rows 可保存 |
| Mechanism | `paylines` | 官方明列 9 paylines |
| winCount | `9` | 可保存 |
| Features | Free Spins、Wild、Scatter、Multiplier、Sticky Wild、Feature Buy | 映射既有 `free-spins`、`wild`、`scatter`、`multiplier`、`sticky-symbols`、`bonus-buy` |
| Bonus Buy | `Feature buy-in: Yes` | `bonusBuy: true` |

`1,600×` 與 `100,000×` 不被簡化成單一高低比較值。前者是頁面整體 stat，後者出現在特定 Train Heist Free Spins 說明；在官方未說明兩者所有權關係前，Slot Hub 只保留衝突。

### 5.3 官方來源與圖片

- [NetEnt Dead or Alive 2 官方遊戲頁](https://netent.com/games/dead-or-alive-2)
- 圖片使用該官方頁 `splashHeader.splashPoster` 指向的 2560×820 JPEG：`https://fan-cdn.nolimitcity.com/dead_or_alive_2_ne_fansite_splashpost_2560x820px_870a5e759f.jpg`。
- 圖片 URL 雖位於 NetEnt 頁面使用的媒體 CDN，資產關係由官方頁 HTML 直接確認；不是第三方搜尋圖片。

### 5.4 判定

身份、RTP、盤面、賠線、Feature Buy 與功能有直接第一方證據。最高倍數衝突能由現有 `maxWinLabelOriginal` 與缺值規則處理，不需改 Schema。

## 6. Temple Tumble

### 6.1 身份與命名

| 項目 | 核對結果 |
| --- | --- |
| 正式名稱 | `Temple Tumble` |
| Provider | Relax Gaming；本批新增 `relax-gaming` Provider |
| 發行日期 | `2019-01-29`；採官方發布稿日期 |

### 6.2 可保存資料

| 欄位 | 核對值 | 處理 |
| --- | --- | --- |
| RTP | 官方產品頁只明列 `German RTP: 90%` | 不設主要 RTP；`rtpVariants: [90]`，並在原文說明保留市場標籤 |
| Game ID | `German GameID: templetumble_90`；`Alternative UK GameID: templetumble_92` | 不選其中一個當通用 Game ID；保存於原廠說明 |
| 波動度 | 官方發布稿描述 `highly volatile` | 保存原文，不建立 normalized 值 |
| 最高倍數 | 未確認 | 保持缺值 |
| 盤面 | `6×6` | reels、rows 可保存 |
| Mechanism | `megaways` | 官方發布稿明確稱為 Megaways，產品頁明列 46,656 ways |
| winCount | `46656` | 官方產品頁以固定 `46,656 ways mechanic` 描述 |
| Features | Cascading、Free Spins、Multiplier | 皆由官方發布稿直接支持 |
| Bonus Buy | 未確認 | 保持缺值 |

### 6.3 官方來源與圖片

- [Relax Gaming Temple Tumble 官方產品頁](https://www.relax-gaming.com/products/casino/templetumble)
- [Relax Gaming Temple Tumble 官方發布稿](https://www.relax-gaming.com/news/2019/01/relax-gaming-unveils-temple-tumble)
- 圖片使用官方產品頁載入的 Client Area 600×600 PNG：`https://clientarea.relax-gaming.com/gameassets/templetumble/thumbnail2x/WH6ZbZZczeFSfeb75huV/thumbnail_Temple_Tumble_600x600.png`。

### 6.4 判定

官方發布稿已明確確認 Megaways、Cascading、Free Spins 與 Multiplier，現有 taxonomy 足以承接。`templetumble_92` 名稱不足以證明 92% RTP，故只保存 Game ID 原文，不補出第二個 RTP 數字。

## 7. The Great Pigsby Megaways

### 7.1 身份與命名

| 項目 | 核對結果 |
| --- | --- |
| 正式名稱 | `The Great Pigsby Megaways` |
| Provider | Relax Gaming；本批新增 `relax-gaming` Provider |
| 發行日期 | `2022-10-19`；採官方發布稿日期 |
| 系列 | 官方資料確認為 The Great Pigsby 系列作品；只保存 series 身份，不建立系列頁 |

### 7.2 可保存資料與衝突

| 欄位 | 核對值 | 處理 |
| --- | --- | --- |
| RTP variants | `German RTP: 90%`、`Alternative RTP: 94%` | 不選主要 RTP；保存 `[90, 94]` 與市場／Alternative 原標籤 |
| 波動度 | 現行產品頁 `medium volatility`；發布稿 `high-volatility` | 保存雙來源衝突；不建立 normalized 值 |
| 最高倍數 | 發布稿 `maximum win potential of 20,000x`，未說明投注基準 | 只保存 `maxWinLabelOriginal`；不填統一倍數 |
| 盤面 | 產品頁 `6x7`；發布稿 `5x3` | `reels` 保存兩份官方原文，`rows` 留空，不選邊或製造固定盤面 |
| Mechanism | `megaways` | 產品頁明列 `Megaways (up to 117649 ways)` |
| winCount | 留空 | `up to` 是動態上限，不寫成固定 Ways |
| Features | Free Spins、Wild、Respins | 由官方頁與發布稿直接支持 |
| Bonus Buy／Game ID | 未公開確認 | 保持缺值 |

### 7.3 官方來源與圖片

- [Relax Gaming The Great Pigsby Megaways 官方產品頁](https://www.relax-gaming.com/products/casino/greatpigsbymegaways)
- [Relax Gaming The Great Pigsby Megaways 官方發布稿](https://www.relax-gaming.com/news/2022/10/experience-the-roaring-20s-as-pigsby-returns-in-the-great-pigsby-megawaystm)
- [Relax Gaming The Great Pigsby 系列官方文章](https://www.relax-gaming.com/news/2024/12/relax-gaming-adds-dream-drop-excitement-to-the-great-pigsby)
- 圖片使用官方產品頁載入的 Client Area 600×600 PNG：`https://clientarea.relax-gaming.com/gameassets/greatpigsbymegaways/thumbnail2x/5AMFvNnWB88Nd5QCfN8E/Thumbnail_The_Great_Pigsby_Megaways_600x600.png`。

### 7.4 判定

盤面與波動度的官方差異是真實內容狀態，不是 Schema blocker。現有自由文字原文欄位、缺值與來源陣列可保留差異；不得將 Medium 或 High 任一項升格為統一值。

## 8. Relax Gaming Provider

| 項目 | 核對結果 |
| --- | --- |
| 正式品牌 | `Relax Gaming` |
| 建議 slug | `relax-gaming` |
| roles | `developer`、`aggregator`、`platform` |
| gameTypes | `slots`、`poker`、`bingo` |
| 本批 published Games | Temple Tumble、The Great Pigsby Megaways，共 2 款 |
| 樣本限制 | Provider Hub 的統計只描述 Slot Hub 目前收錄樣本，不推廣到 Relax Gaming 全產品線 |

官方 About 記錄 in-house casino development，以及 slots、bingo、poker 產品歷程；產品導覽與官方新聞亦確認內容聚合與發行平台角色。現有 Provider schema 可直接承接，不需新增 role。

官方來源：

- [Relax Gaming About](https://www.relax-gaming.com/about/)
- [Relax Gaming Own Games](https://www.relax-gaming.com/products/own-games)
- 官方 Logo：`https://www.relax-gaming.com/static/img/logo.svg`；原始 SVG 直接保存，不重繪。

## 9. 預定資料結果與關聯影響

### 9.1 公開母體

- Game：30 → 34。
- Provider：11 → 12。
- PG SOFT：4 → 5 款。
- NetEnt：2 → 3 款。
- Relax Gaming：0 → 2 款。

### 9.2 既有結構化入口

- Fortune Rabbit 可進入 `paylines`、Wild、RTP、波動度與最高倍數既有入口。
- Dead or Alive 2 可進入 `paylines`、Free Spins、Wild、Scatter、Multiplier、Bonus Buy 與 RTP 入口；不進入統一 Max Win／Volatility 入口。
- Temple Tumble 可進入 `megaways`、Cascading、Free Spins、Multiplier 與 RTP variants 入口；不進入統一 Volatility／Max Win。
- The Great Pigsby Megaways 可進入 `megaways`、Free Spins、Wild、Respins 與 RTP variants 入口；不進入統一 Volatility／Max Win。
- 所有關聯由現有 Game 資料與 resolver build-time 推導，不新增 relationship owner 或手工 relatedGames。

### 9.3 預期測試遷移

發布時必須依實際 published 資料重新計算並更新既有硬編碼母體與 coverage 斷言，包括：

- published Game／Provider 數。
- Provider Hub 樣本數。
- Explorer 的 Provider、Mechanism、Feature 結果數。
- Guide relationship 與 Game detail direct／overflow 分布。
- Similar Play 的有結果／零結果分布與固定排序。
- Compare coverage、Guided Explorer、Game DNA 單款隔離與 Build 路由數。

測試預期必須由實際 records 推導或精確驗證，不能只改數字以取得綠燈。

## 10. 圖片驗證結果

| 圖片 | 第一方來源 | 實體檢查 | 判定 |
| --- | --- | --- | --- |
| Fortune Rabbit | PG SOFT 官方 PDF 內嵌圖 | 1686×1192 PNG，完整遊戲 Logo | 通過 |
| Dead or Alive 2 | NetEnt 官方頁 splash poster | 2560×820 JPEG，完整遊戲 Logo | 通過 |
| Temple Tumble | Relax Gaming 官方 Client Area | 600×600 PNG，完整遊戲 Logo | 通過 |
| The Great Pigsby Megaways | Relax Gaming 官方 Client Area | 600×600 PNG，完整遊戲 Logo | 通過 |
| Relax Gaming Logo | Relax Gaming 官方網站 | 直接下載 SVG | 通過 |

圖片都能追溯至第一方頁面或第一方文件，未使用娛樂城、聯盟網站、搜尋摘要或一般資料庫替代。

## 11. 阻擋條件檢查

| 停止條件 | 結果 |
| --- | --- |
| 需要新增 Schema／taxonomy | 否 |
| 需要替換候選或擴張批次 | 否 |
| Game／Provider 身份無法確認 | 否 |
| 圖片來源有實質疑慮 | 否 |
| 官方資料衝突無法誠實保存 | 否；Dead or Alive 2 與 Pigsby 均可保留衝突並維持統一欄位缺值 |

因此依本批既有人工授權，可繼續建立 draft、完整驗證、獨立 Commit、發布、Push、CI、Cloudflare Pages Preview 與線上回讀。

## 12. 固定尾段

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_ITEM: 第10項 Game／Provider 擴充（第四批）`

`CURRENT_STEP: 正式只讀驗證`

`CURRENT_STATE: READONLY_VALIDATION_COMPLETE`

`GAME_BATCH: Fortune Rabbit；Dead or Alive 2；Temple Tumble；The Great Pigsby Megaways`

`PROVIDER_BATCH: Relax Gaming`

`SOURCE_STATUS: PASS；四款身份與所有採用資料均有第一方來源，兩組官方衝突將保留原文與缺值`

`IMAGE_STATUS: PASS；四張遊戲圖與一個 Provider Logo 均可追溯至官方頁或官方文件`

`SCHEMA_CHANGE_REQUIRED: NO`

`TAXONOMY_CHANGE_REQUIRED: NO`

`BLOCKERS: NONE`

`NEXT_ALLOWED_ACTION: 依本批人工授權建立合法 draft、驗證、發布並部署 Cloudflare Pages Preview`
