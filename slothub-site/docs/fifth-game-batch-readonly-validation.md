# 第五批四款遊戲與兩家 Provider 只讀驗證

> **READ-ONLY VALIDATION COMPLETE**
>
> 本文件依 `docs/slot-hub-master-blueprint-v2.md`、`docs/game-intake-workflow-v1.md` 與既有資料模型，核對第五批候選：Extra Chilli、Jammin’ Jars、Razor Shark、Vikings Go Berzerk，以及新增 Push Gaming、Yggdrasil Gaming。未加入其他遊戲、Fishing、Crash／Aviator 或遊戲 DNA 擴張。
>
> 資料核對日期：2026-09-03（Asia/Taipei）

## 1. 結論摘要

四款遊戲與兩家 Provider 的身份均可由第一方頁面確認，現有 Schema、taxonomy、Explorer、Game detail、Compare、Provider Hub 與驗證流程足以承接。第五批不需要新增產品功能，也沒有必須由人工選邊的資料衝突。

| 項目 | 驗證結果 | 現有模型處理 |
| --- | --- | --- |
| Extra Chilli | `PASS_TO_DRAFT` | 保存 Megaways、Free Spins、Multiplier、16,877× stake，以及兩組官方 RTP 範圍原文 |
| Jammin’ Jars | `PASS_TO_DRAFT` | 保存 8×8 Cluster Pays、Cascading、Free Spins、Wild／Scatter／Multiplier、Bonus Buy 與兩個 RTP 值 |
| Razor Shark | `PASS_TO_DRAFT` | 保存 5×4、20 paylines、Free Spins、Scatter、Multiplier 與兩個 RTP 值 |
| Vikings Go Berzerk | `PASS_TO_DRAFT` | 保存 5×4、25 paylines、96.1% RTP、Medium - High、Free Spins、Wild／Sticky Wild |
| Push Gaming | `PASS_TO_DRAFT` | 以現有 developer／publisher roles 建立 Provider |
| Yggdrasil Gaming | `PASS_TO_DRAFT` | 以現有 developer／publisher／platform roles 建立 Provider |

第五批完成後的預定公開母體為 38 款 Game、14 家 Provider。批次維持四款遊戲；兩家新 Provider 是這四款遊戲的必要身份資料，不另帶入其餘產品。

## 2. 選擇理由與範圍

- Extra Chilli 把目前只有 Bonanza 的 Big Time Gaming 增加為兩款，補強 Megaways 搜尋缺口。
- Jammin’ Jars 與 Razor Shark讓新 Provider Push Gaming 同時具備 Cluster Pays 與 Paylines 代表作，不以單一遊戲概括 Provider。
- Vikings Go Berzerk 增加 Yggdrasil Gaming，也補入具有明確 RTP、波動度、盤面、賠線與功能資料的既有作品。
- 四款涵蓋 Megaways、Cluster Pays、Paylines、Cascading、Free Spins、Multiplier、Bonus Buy 與 Sticky Symbols；所有項目均沿用既有 taxonomy。
- 選擇基準是第一方資料完整度、玩法覆蓋與現有 Provider 稀疏度，不是熱門度、獲利可能或推薦排名。

## 3. 資料原則

- 只採官方遊戲頁、官方發布稿、官方目錄與其直接載入的圖片。
- 官方只提供範圍時保留範圍，不拆成虛假的 `rtpVariants`。
- `Highest Observed Win` 不是理論整局上限，不寫入 `maxWinMultiplier`。
- 歐元 Max Win 不是投注倍數，不換算或正規化。
- Feature 只有在官方原文直接支持時才映射；Feature Drop、Mystery Stacks 等品牌詞保留於說明，不依名稱推導 taxonomy。
- 動態 `up to 117,649 ways` 不寫成固定 `winCount`。
- Provider Logo 與 Game image 都使用官方網站實際載入的資產，不以搜尋圖片、娛樂城或資料庫替代。

## 4. Extra Chilli

| 欄位 | 第一方結果 | 保存決定 |
| --- | --- | --- |
| 正式名稱／Provider | `Extra Chilli`／Big Time Gaming | 使用 `extra-chilli` 與既有 `big-time-gaming` |
| RTP | `96.15–96.41%`；with Feature Drop `96.26–96.82%` | 只保存完整原文，不建立主要 RTP 或 variants |
| Max Win | `16,877x Stake` | `maxWinMultiplier: 16877`，同步保留原始標籤與 stake 基準 |
| Mechanism | Megaways；117,649 ways | `megaways`；動態上限不填固定 `winCount` |
| Features | Free Spins、unlimited multiplier | 映射 `free-spins`、`multiplier` |
| 其他原廠功能 | Dual Reactions、Feature Drop、Free Spin Gamble | 保留原名；不將 Feature Drop 自動映射 Bonus Buy |
| 發行日期／盤面／波動度 | 官方現行頁未提供完整可核對值 | 維持缺值 |

第一方來源：

- [Big Time Gaming Extra Chilli 官方遊戲頁](https://www.bigtimegaming.com/games/extra-chilli)
- 官方作品圖與三張 Game Stats 圖均由同一官方頁直接載入。

## 5. Jammin’ Jars

| 欄位 | 第一方結果 | 保存決定 |
| --- | --- | --- |
| 正式名稱／Provider | `Jammin’ Jars`／Push Gaming | 使用 `jammin-jars` 與新 Provider `push-gaming` |
| 盤面／Mechanism | 8×8；cascading cluster pays；5 個以上相同符號 | `reels: 8x8`、`rows: 8`、`cluster-pays` |
| RTP | 96.83%、94.25%；官方說明可能依 casino 不同 | 不選主要值；保存 `rtpVariants: [94.25, 96.83]` |
| 波動度 | `High` | 保存原文並使用既有 normalized `high` |
| 最高值 | `Highest Observed Win 19,998.5x` | 只保存原標籤，不建立統一 Max Win |
| Features | Cascading、Free Games、Wild、Scatter、Multiplier、Bonus Buy | 映射現有六個 Feature；`bonusBuy: true` |
| 發行日期 | 官方發布稿 2018-09-18 | 可保存 |

第一方來源：

- [Push Gaming Jammin’ Jars 官方遊戲頁](https://www.pushgaming.com/games/jammin-jars.html)
- [Push Gaming Jammin’ Jars 官方發布稿](https://www.pushgaming.com/blog/push-gaming-get-groove-new-game-jammin-jars.html)
- 官方圖片採遊戲目錄直接載入的 `Jammin-Jars_preview2020.jpg`。

## 6. Razor Shark

| 欄位 | 第一方結果 | 保存決定 |
| --- | --- | --- |
| 正式名稱／Provider | `Razor Shark`／Push Gaming | 使用 `razor-shark` 與新 Provider `push-gaming` |
| 盤面／Mechanism | 5×4、20 paylines | `reels: 5x4`、`rows: 4`、`paylines`、`winCount: 20` |
| RTP | 96.70%、94.06% | 不選主要值；保存 `rtpVariants: [94.06, 96.7]` |
| 波動度 | `High` | 保存原文並使用既有 normalized `high` |
| Features | Free Spins、Scatter、Increasing Multipliers | 映射 `free-spins`、`scatter`、`multiplier` |
| 局部倍率 | Razor Reveal 可出現最高 2,500× original stake | 只保存於功能原文；不當成整局 Max Win |
| 發行日期 | 官方發布稿 2019-09-03 | 可保存 |
| Bonus Buy | 官方頁未列為 Available | 維持缺值，不推論為不支援 |

第一方來源：

- [Push Gaming Razor Shark 官方遊戲頁](https://www.pushgaming.com/games/razor-shark.html)
- [Push Gaming Razor Shark 官方發布稿](https://www.pushgaming.com/blog/push-gaming-release-deep-sea-themed-slot-razor-shark.html)
- 官方圖片採遊戲目錄直接載入的 `razor-shark_preview1.jpg`。

## 7. Vikings Go Berzerk

| 欄位 | 第一方結果 | 保存決定 |
| --- | --- | --- |
| 正式名稱／Provider | `Vikings Go Berzerk`／Yggdrasil Gaming | 使用 `vikings-go-berzerk` 與新 Provider `yggdrasil-gaming` |
| 盤面／Mechanism | 5 reels、4 rows、25 paylines | `reels: 5x4`、`rows: 4`、`paylines`、`winCount: 25` |
| RTP | 96.1% | 可作主要 RTP |
| 波動度 | `Medium - High` | 保存原文並使用既有 normalized `medium-high` |
| Max Win | `€93,910` | 只保存原始貨幣標籤，不建立倍數 |
| Features | Free Spins、Wild、sticky wild | 映射 `free-spins`、`wild`、`sticky-symbols` |
| 發行日期 | 2016-11-23 | 可保存 |
| 系列 | 官方稱為 sequel，後續官方資料稱 Vikings 系列 | 保存系列名稱，不建立永久系列頁 |

第一方來源：

- [Yggdrasil Gaming Vikings Go Berzerk 官方遊戲頁](https://yggdrasilgaming.com/games/vikings-go-berzerk)
- 官方遊戲 Logo 使用該頁直接載入的 750×540 PNG。

## 8. Provider 身份

### Push Gaming

- 官方 About 與遊戲發布稿可確認其為遊戲開發與發行品牌。
- 現有 roles 使用 `developer`、`publisher`；不新增 supplier 類型。
- 第五批只收錄 Jammin’ Jars、Razor Shark，共 2 款。
- 官方來源：[Push Gaming About](https://www.pushgaming.com/about/)。
- Logo 使用官方網站的深色 Logo PNG。

### Yggdrasil Gaming

- 官方 About 可確認其開發遊戲並提供內容、技術與平台工具。
- 現有 roles 使用 `developer`、`publisher`、`platform`。
- 第五批只收錄 Vikings Go Berzerk，共 1 款；Provider Hub 不顯示 N=1 統計。
- 官方來源：[Yggdrasil Gaming About Us](https://yggdrasilgaming.com/about-us)。
- Logo 使用官網 Header 直接載入的 SVG；官方 About 亦明示提供官方 Logo pack。

## 9. 圖片核對

| 項目 | 官方資產 | 實體結果 |
| --- | --- | --- |
| Extra Chilli | BTG 官方作品頁橫式圖 | WebP 回應，1500×707 頁面輸出，遊戲 Logo 清楚 |
| Jammin’ Jars | Push Gaming 官方目錄縮圖 | 1266×563 JPEG，遊戲角色可辨識 |
| Razor Shark | Push Gaming 官方目錄縮圖 | 1266×451 JPEG，遊戲角色可辨識 |
| Vikings Go Berzerk | Yggdrasil 官方遊戲 Logo | 750×540 PNG，透明背景完整 Logo |
| Push Gaming | 官網深色 Logo | 官方 PNG，適合現有淺色 Provider 介面 |
| Yggdrasil Gaming | 官網 Header Logo | 官方 SVG |

所有圖片均由第一方頁面直接取得；不下載或使用第三方替代圖。

## 10. 預定關聯與搜尋影響

- 公開 Game：34 → 38；Provider：12 → 14。
- Big Time Gaming：1 → 2；Push Gaming：0 → 2；Yggdrasil Gaming：0 → 1。
- Extra Chilli 進入 Megaways、Free Spins、Multiplier 與 Max Win 既有入口。
- Jammin’ Jars 進入 Cluster Pays、Cascading、Free Spins、Wild、Scatter、Multiplier、Bonus Buy、RTP variants、Volatility 入口。
- Razor Shark 進入 Paylines、Free Spins、Scatter、Multiplier、RTP variants、Volatility 入口。
- Vikings Go Berzerk 進入 Paylines、Free Spins、Wild、Sticky Symbols、RTP、Volatility 入口。
- 關聯由既有 Game records 與 resolver build-time 推導，不新增 owner、relatedGames 或永久集合頁。
- 所有測試數量在 published 狀態由實際 records 重算；不得只為綠燈改硬編碼。

## 11. 阻擋條件

| 停止條件 | 結果 |
| --- | --- |
| 需要新增 Schema／taxonomy | 否 |
| 需要替換候選或擴張批次 | 否 |
| Game／Provider 身份無法確認 | 否 |
| 圖片來源存在實質疑慮 | 否；所有採用資產由官方頁直接載入 |
| 官方資料只能靠推測填入 | 否；不足部分維持缺值或原文 |

因此可在本次既有授權內繼續建立 draft、驗證、發布、Push、CI、Cloudflare Pages Preview 與線上回讀。

## 12. 固定尾段

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_ITEM: 第10項 Game／Provider 擴充（第五批）`

`CURRENT_STEP: 正式只讀驗證`

`CURRENT_STATE: READONLY_VALIDATION_COMPLETE`

`GAME_BATCH: Extra Chilli；Jammin’ Jars；Razor Shark；Vikings Go Berzerk`

`PROVIDER_BATCH: Push Gaming；Yggdrasil Gaming`

`SOURCE_STATUS: PASS；四款身份與採用資料均有第一方來源，範圍、觀察值與貨幣上限均未錯誤正規化`

`IMAGE_STATUS: PASS；四張遊戲圖與兩個 Provider Logo 均由官方頁直接取得`

`SCHEMA_CHANGE_REQUIRED: NO`

`TAXONOMY_CHANGE_REQUIRED: NO`

`BLOCKERS: NONE`

`NEXT_ALLOWED_ACTION: 依現有授權建立 draft、驗證、發布並部署 Cloudflare Pages Preview`
