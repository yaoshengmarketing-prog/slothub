# 第二批六款遊戲只讀驗證

> **READ-ONLY VALIDATION**
>
> 狀態：依 `APPROVED v1` 產品藍圖與第一批六款驗證標準完成的資料核對報告。
>
> 本報告不是建立或發布 Game／Provider 的授權，也不構成修改 Schema、taxonomy 或網站的授權。本輪未修改內容資料、圖片、程式或網站，未 Build、Commit、Push 或部署。
>
> 資料核對日期：2026-08-29（Asia/Taipei）

## 1. 驗證方法與判定原則

- 精確數值以廠商官方遊戲頁、規則／Paytable、產品資料與官方發布稿為主。
- 官方中文市場名稱、台灣常見繁中名稱與 Slot Hub 編輯名稱分開記錄；沒有官方繁中名稱時不冒充官方名稱。
- 搜尋摘要與第三方頁面只用於發現來源或觀察台灣命名，不用來確認 RTP、最高倍數等精確事實。
- `winCount` 只承接賠線或 Ways 等可比較數量；Pay Anywhere 所需的最少相同符號數不寫入 `winCount`。
- Bonus 模式、Tumble、DuelReels 等屬 Feature，不因一款遊戲具有多個 Bonus 模式就判定為多重主要中獎機制。
- 「可進發布審查」只表示資料條件足以進入下一個人工／Preview 審查階段，不代表本輪建立或發布內容。

## 2. 重複檢查

已對照現有 18 款 Game Collection。六款均不是現有資料的同語言、不同 RTP 或平台別名，亦沒有相同 slug：

| 候選 | 建議 slug | 與現有 18 款重複 |
|---|---|---|
| Fortune Ox | `fortune-ox` | 否 |
| Sweet Bonanza 1000 | `sweet-bonanza-1000` | 否；是現有 Sweet Bonanza 的官方續作 |
| Gates of Olympus 1000 | `gates-of-olympus-1000` | 否；是現有 Gates of Olympus 的官方續作 |
| Starburst | `starburst` | 否 |
| Rich Wilde and the Book of Dead | `rich-wilde-and-the-book-of-dead` | 否 |
| Wanted Dead or a Wild | `wanted-dead-or-a-wild` | 否 |

## 3. Fortune Ox

### A. 身份與名稱

| 項目 | 核對結果 |
|---|---|
| 正式英文名稱 | `Fortune Ox` |
| 官方中文市場名稱 | `十倍金牛`；PG SOFT 官方中文規則文件使用此名。這是簡體中文市場文件中的正式名稱，字形本身亦可直接用於繁中顯示。 |
| 台灣常見繁中名稱 | `十倍金牛` 有一致訊號；無可靠搜尋量。 |
| 建議繁中顯示名稱 | `十倍金牛` |
| 建議 aliases | `Fortune Ox`、`十倍金牛` |
| 實際開發商 | PG SOFT／Pocket Games Soft |
| 官方識別碼 | 官方頁面可追溯 `gid: 83` 與 `pgid: 98`，但官方未說明何者是跨平台 canonical Game ID；建立資料時應保存原標籤，不宜直接去除命名空間。 |

主要官方來源：

- [PG SOFT 官方遊戲頁](https://www.pgsoft.com/en/games/83/)
- [官方英文 Game Information PDF](https://www.pgsoft.com/uploads/Games/Pdf/Fortune_OxGameinformation_EN.pdf)
- [官方中文 Game Information PDF](https://www.pgsoft.com/uploads/Games/Pdf/Fortune_OxGameinformation_ZH.pdf)
- [PG SOFT 官方發布資料](https://www.pgsoft.com/news/106/)

### B. 作品與系列關係

- 官方資料可確認 Fortune Ox 是獨立作品。
- 本輪沒有找到 PG SOFT 將 Fortune Ox 與 Fortune Tiger 定義為數字續作或正式同一系列代數的證據。
- 兩者可視為共同使用 Fortune 品牌語彙與生肖／吉祥動物題材，但不可只依名稱相似就填相同 `seriesId` 或 `installment`。
- 若未來需要整理品牌宇宙，可另以非代數的編輯標籤表達；本輪不修改資料模型。

### C. 結構化資料

| 欄位 | 核對值 | 官方原始標籤／備註 |
|---|---|---|
| 主要 RTP | `96.75%` | 官方 Game Information |
| RTP 版本 | `94%`、`95%`、`96.75%`、`97%`、`98%`、`99%`、`100%` | 必須分開保存，不可只取最高值。 |
| 原廠波動度 | `Medium` | `Session Volatility: Medium`；可映射 Slot Hub `medium`。 |
| 整局最高倍數 | `2,000×` | 英文文件：`Theoretical Maximum Win: Bet Amount of Winning Spin x2000`；中文文件亦保存模拟最高赢分／Max Exposure 的 2,000× 說明。可作統一比較值，但原始標籤不可丟失。 |
| 盤面 | 3 軸，不規則 3／4／3 列 | 中軸 4 列、左右軸各 3 列；不可簡化成固定 3×3 或 3×4。 |
| 主要中獎機制 | `Paylines` | 可映射 `paylines`。 |
| 數量 | 10 | `10 lines`。 |
| Bonus Buy | 未確認 | 官方公開資料未提供可採用的明確值。 |
| 發行日期 | 2021 年可確認；精確日期未確認 | 官方頁資料時間不自動等同公開發行日。 |
| Game ID | 暫不填通用 `gameId` | 保留 `gid 83`、`pgid 98` 的原始標籤與來源。 |

### D. Features

官方原始詞彙與建議分類：

- `Fortune Ox Feature`：遊戲專屬功能名稱，保留原文，不新增共用 enum。
- `Respin`／連續重轉直到未中獎：可作共用 Feature 候選。
- 全軸符號形成得獎時的 `x10` 倍數：可映射既有 `Multiplier`。
- 以上均是 Feature，不改變主要 `Paylines` 機制。

### E. 官方圖片

| 用途 | 官方 URL | 核對 |
|---|---|---|
| 橫幅／作品圖 | `https://www.pgsoft.com/uploads/Games/Images/c22ec329-3bad-4b36-94e0-3ba1997e2a2d.png` | PG SOFT 官方資產；本輪未下載。 |
| 遊戲封面 | `https://www.pgsoft.com/uploads/Games/Images/2fad9820-8301-4f6c-8f81-e3163cd1022e.jpg` | PG SOFT 官方資產；未確認最終卡片裁切。 |
| 宣傳圖 | `https://www.pgsoft.com/uploads/Games/Images/38d9f7a0-f9b6-40e1-aa6d-c9bf5f2b12d8.png` | PG SOFT 官方資產；本輪未下載。 |

後續圖片準備時需逐張確認完整 Logo、實際尺寸與卡片比例，不在本輪轉檔或裁切。

### F. Schema／taxonomy 對照與判定

- 現有 Schema 可承接名稱、aliases、Provider、RTP variants、波動度、最高倍數、Paylines、Features、來源與日期。
- 現有單一 `rows` 不能準確表達 3／4／3 不規則盤面；這是重複出現的 layout gap，但不阻止建立草稿。
- `gid`／`pgid` 的命名空間無法在單一 `gameId` 中完整表達；先留於來源／摘要即可。

**主要判定：`ELIGIBLE_FOR_PUBLISH_REVIEW`**

理由：身份、官方中文名、RTP 版本、波動度、最高倍數、機制、圖片與來源均有官方資料；精確發行日與通用 Game ID 缺值不構成薄頁或身份衝突。正式系列不得與 Fortune Tiger 強行建立。

## 4. Sweet Bonanza 1000

### A. 身份與名稱

| 項目 | 核對結果 |
|---|---|
| 正式英文名稱 | `Sweet Bonanza 1000` |
| 官方中文市場名稱 | `甜入心扉 1000`；Pragmatic Play 官方中文頁使用此名。來源頁為簡體中文市場頁，不冒充「官方繁中」。 |
| 台灣常見繁中名稱 | `甜入心扉 1000` 可作主要編輯名稱；亦存在以英文直接搜尋的訊號，無可靠搜尋量。 |
| 建議繁中顯示名稱 | `甜入心扉 1000` |
| 建議 aliases | `Sweet Bonanza 1000`、`甜入心扉 1000`、`甜入心扉1000` |
| 實際開發商 | Pragmatic Play |
| 官方識別碼 | 官方 Demo 端點可追溯 `gameSymbol: vs20fruitswx`；其標籤應保留，不自動宣稱為全平台 canonical ID。 |

主要官方來源：

- [Pragmatic Play 官方遊戲頁](https://www.pragmaticplay.com/en/games/sweet-bonanza-1000/)
- [Pragmatic Play 官方中文遊戲頁](https://www.pragmaticplay.com/zh/%E6%B8%B8%E6%88%8F/sweet-bonanza-1000/)
- [Pragmatic Play 官方發布稿](https://www.pragmaticplay.com/en/news/pragmatic-play-sweetens-up-candyland-in-sweet-bonanza-1000/)

### B. 作品與系列關係

- 官方發布稿明確稱本作為 Sweet Bonanza 原作的 `supercharged sequel`，因此不是原作的 RTP 版本或平台別名。
- 可使用 `seriesId: sweet-bonanza` 並關聯現有原作。
- `1000` 是正式作品名稱與 Pragmatic Play 1000 系列品牌，不應直接把 `installment` 填成 1000。
- 若 Slot Hub 使用順序代數，可在編輯規則確認後填第二作；官方「續作」證據足夠，但數字 1000 本身不是代數。

### C. 結構化資料

| 欄位 | 核對值 | 官方原始標籤／備註 |
|---|---|---|
| 主要 RTP | 未確認 | 官方公開遊戲頁與發布稿未提供可核對精確值。 |
| RTP 版本 | 未確認 | 第三方數值不可轉為正式版本資料。 |
| 原廠波動度 | 未確認 | 官方公開來源未提供。 |
| 整局最高倍數 | `25,000×` | 官方發布稿 `maximum win of 25,000x`；Candy Bomb 最高 1,000× 是 Feature 倍數，不是整局最高倍數。 |
| 盤面 | 6×5 | 官方英文產品頁與發布稿一致。官方中文頁出現 5×5，屬官方本地化頁面的混合／矛盾文字；現階段以兩個一致的英文官方來源採 6×5，並保留衝突記錄。 |
| 主要中獎機制 | `Pay Anywhere` | 8 個以上相同符號出現在任意位置得獎；可映射既有 `pay-anywhere`。 |
| 數量 | `winCount` 留空 | `8+` 是最低相同符號門檻，不是賠線／Ways 數量。 |
| Bonus Buy | 未確認 | 目前採用的官方公開產品與發布文字未提供足夠明確值。 |
| 發行日期 | `2024-06-03` | 官方發布稿日期。 |
| Game ID | 暫不填通用 `gameId` | 保存 `gameSymbol: vs20fruitswx` 原始標籤。 |

### D. Features

- `Tumble`：映射既有 `Cascading`，不是第二 Mechanism。
- `Candy Bomb`／`Multiplier Bombs`：遊戲專屬名稱，功能可映射既有 `Multiplier`。
- 4 個以上 Scatter 觸發 10 Free Spins；3 個以上 Scatter 於 Free Spins 中增加 5 次：映射 `Scatter`、`Free Spins`、`Retrigger`。
- 官方中文頁另有與英文頁不一致的 Super Free Spins 文字；在未取得正式 Game Rules 前不結構化此差異。

### E. 官方圖片

- 官方作品圖：`https://www.pragmaticplay.com/wp-content/uploads/2024/05/Sweet-Bonanza-1000_339x180.png`
- 官方頁宣告尺寸 339×180，橫式卡片用途合理；本輪未下載、裁切或轉檔。

### F. Schema／taxonomy 對照與判定

- 現有 `pay-anywhere`、RTP 空值、最高倍數、盤面、Features、系列與來源可直接承接。
- Pay Anywhere 的 `8+ symbols` 沒有專屬結構欄位；不應錯填 `winCount`。這是可候選的規則細節 gap，不阻止草稿或發布審查。
- 中文頁 5×5 與英文頁 6×5 的衝突已由較一致的官方英文產品與發布資料處理，不需要新增 Schema。

**主要判定：`ELIGIBLE_FOR_PUBLISH_REVIEW`**

理由：官方身份、續作關係、6×5、Pay Anywhere、最高倍數、Feature、發行日與官方圖片完整。RTP、波動度與 Bonus Buy 留空，但頁面仍有足夠獨立資料；發布前需在資料註記中保留本地化頁面的盤面衝突。

## 5. Gates of Olympus 1000

### A. 身份與名稱

| 項目 | 核對結果 |
|---|---|
| 正式英文名稱 | `Gates of Olympus 1000` |
| 官方中文市場名稱 | `奥林匹斯之门 1000`；官方中文頁為簡體市場名稱。 |
| 台灣常見繁中名稱 | `奧林匹斯之門 1000`；英文名稱亦常直接使用，無可靠搜尋量。 |
| 建議繁中顯示名稱 | `奧林匹斯之門 1000` |
| 建議 aliases | `Gates of Olympus 1000`、`奧林匹斯之門 1000`、`奧林匹斯之門1000`、`奥林匹斯之门 1000` |
| 實際開發商 | Pragmatic Play |
| 官方識別碼 | 官方 Demo 端點可追溯 `gameSymbol: vs20olympx`；保存原標籤，不直接視為無命名空間的 canonical ID。 |

主要官方來源：

- [Pragmatic Play 官方遊戲頁](https://www.pragmaticplay.com/en/games/gates-of-olympus-1000/)
- [Pragmatic Play 官方中文遊戲頁](https://www.pragmaticplay.com/zh/%E6%B8%B8%E6%88%8F/gates-of-olympus-1000/)
- [Pragmatic Play 官方發布稿](https://www.pragmaticplay.com/en/news/zeus-strikes-mighty-multipliers-in-pragmatic-plays-latest-release-gates-of-olympus-1000/)

### B. 作品與系列關係

- 官方發布稿稱本作為原版 Gates of Olympus 的 `striking sequel`，不是不同 RTP 或語言版本。
- 官方後續系列發布亦將原作、1000 版置於 Gates 系列脈絡。
- 可使用 `seriesId: gates-of-olympus` 並關聯現有原作。
- `1000` 是正式名稱／升級品牌，不代表第一千代；若使用順序代數，應是續作的第二作，而非 1000。

### C. 結構化資料

| 欄位 | 核對值 | 官方原始標籤／備註 |
|---|---|---|
| 主要 RTP | 未確認 | 官方公開產品頁／發布稿未提供精確值。 |
| RTP 版本 | 未確認 | 不採第三方數值。 |
| 原廠波動度 | 未確認 | 官方公開來源未提供。 |
| 整局最高倍數 | `15,000×` | 官方頁 `maximum win of 15,000x`。Multiplier symbols 最高 1,000× 是功能倍數，不是整局最高倍數。 |
| 盤面 | 6×5 | 官方產品頁。 |
| 主要中獎機制 | `Pay Anywhere` | 至少 8 個相同符號在任意位置；可映射 `pay-anywhere`。 |
| 數量 | `winCount` 留空 | 8 是最低匹配符號門檻，不是 Paylines／Ways 數量。 |
| Bonus Buy | 有 | 官方遊戲頁說明可支付 100× 觸發 Bonus。 |
| 發行日期 | `2023-12-14` | 官方發布稿日期。 |
| Game ID | 暫不填通用 `gameId` | 保存 `gameSymbol: vs20olympx`。 |

### D. Features

- `Tumble`：映射既有 `Cascading`，不當作第二 Mechanism。
- `Multiplier symbols`：2× 至 1,000×，映射 `Multiplier`。
- 4 個以上 Scatter 觸發 15 Free Spins；3 個以上 Scatter 在 Free Spins 增加 5 次：映射 `Scatter`、`Free Spins`、`Retrigger`。
- Free Spins 中倍數累積：Feature 規則，不改變 Pay Anywhere 主機制。
- `Bonus Buy`：既有欄位可直接承接。

### E. 官方圖片

- 官方作品圖：`https://www.pragmaticplay.com/wp-content/uploads/2023/12/Gates-of-Olympus_1000_339x180.png`
- 官方頁宣告尺寸 339×180；本輪未下載、裁切或轉檔。

### F. Schema／taxonomy 對照與判定

- 本作可直接使用已存在的 `pay-anywhere`；不需要新增 `scatter-pays`，也沒有多 Mechanism Schema 的證據。
- 與 Sweet Bonanza 1000 相同，8+ 符號門檻不適合現有 `winCount`。可先保留官方原文，等待更多 Pay Anywhere 樣本再審查欄位。
- 現有系列欄位可以承接直接續作關係；`installment` 不應使用 1000。

**主要判定：`ELIGIBLE_FOR_PUBLISH_REVIEW`**

理由：官方身份、續作、Mechanism、盤面、最高倍數、Bonus Buy、Features、日期與官方圖片均足夠。RTP／波動度缺值不影響身份，也不會使資料頁只剩制式內容。

## 6. Starburst

### A. 身份與名稱

| 項目 | 核對結果 |
|---|---|
| 正式英文名稱 | `Starburst`（官方頁亦顯示 `Starburst™`） |
| 官方中文市場名稱 | 未找到 NetEnt 官方中文名稱。 |
| 台灣常見繁中名稱 | `星爆` 有固定定性訊號；無可靠搜尋量。 |
| 建議繁中顯示名稱 | `星爆`，標示為 Slot Hub／市場常用名稱，不標成官方中文。 |
| 建議 aliases | `Starburst`、`Starburst™`、`星爆`、`星爆老虎機` |
| 實際開發商 | NetEnt；現行官方網站屬 Evolution 集團品牌體系。 |
| 官方識別碼 | 官方頁結構資料含 CMS `id: 248` 與 `tableId: starburstr000000`；兩者用途不同，應保存原始標籤。 |

主要官方來源：

- [NetEnt 現行官方 Starburst 頁](https://netent.com/games/starburst)
- [NetEnt 官方歷史市場文章](https://old.netent.com/sv/4-favorite-netent-games-played-in-japan/)
- [NetEnt 官方 Starburst XXXtreme 發布稿](https://old.netent.com/en/netent-ready-for-lift-off-as-it-launches-starburst-xxxtreme/)
- [NetEnt 官方 Starburst Galaxy 頁](https://netent.com/games/starburst-galaxy)

### B. 作品、版本與系列關係

- Starburst 是原作，官方另有 Starburst XXXtreme 與 Starburst Galaxy。
- 官方將 XXXtreme 稱為 follow-up／sequel，Galaxy 亦稱 cosmic sequel，因此可建立 `seriesId: starburst`。
- 後續作品不是單純語言或 RTP 版本；但它們不是數字命名，原作不必強填 `installment`。
- 本輪候選只核對原版 Starburst，不把任何後續版本資料混入原作。

### C. 結構化資料

| 欄位 | 核對值 | 官方原始標籤／備註 |
|---|---|---|
| 主要 RTP | `96.08%` | 現行官方頁結構資料。 |
| RTP 版本 | 暫不建立 variants | 舊官方文章記載 96.09%，與現行 96.08% 有小幅差異；在沒有數學版本／規則檔證據前，視為歷史來源差異或四捨五入，不冒充可選 RTP 版本。 |
| 原廠波動度 | 現行結構資料 `3.1`；舊官方文章稱 `low-volatility` | 可保留兩個原廠表示；統一值可依官方文字映射 `low`，但需註明數字量表未公開。 |
| 整局最高倍數 | `800×` | 現行官方頁 `Max Payout: 800 x bet`。 |
| 盤面 | 5×3 | 現行官方頁。 |
| 主要中獎機制 | `Paylines` | 官方 `Win Type: Lines`；舊官方資料亦說明雙向得獎。 |
| 數量 | 10 | `Max Paylines: 10`。 |
| Bonus Buy | 無 | 官方結構資料 `hasBonusBuy: false`。 |
| 發行日期 | `2012-01-23` | 現行官方頁。 |
| Game ID | 建議先保存 `tableId: starburstr000000` | CMS id 248 不應與 tableId 混成同一種識別碼。 |

### D. Features

- `Expanding Wilds`：官方核心 Feature；現有 `giant-symbols` 不等義，不可強塞。
- `Respins`：官方核心 Feature，可作共用 Feature 候選。
- `Win Both Ways`：中獎方向規則；仍以 10 Paylines 為主要機制，不是第二 Mechanism。
- Wild substitution：可映射既有 `Wild`。

### E. 官方圖片

- 官方作品縮圖：`https://fan-cdn.nolimitcity.com/Starburst_fansitethumb_512x512_04_09_2025_79a329f5be.png`
- 該 512×512 圖由 NetEnt 現行官方遊戲頁載入；本輪只記錄 URL。官方頁通用 OG 圖不具遊戲辨識度，圖片準備時應優先核對此遊戲專屬圖是否完整含 Logo。

### F. Schema／taxonomy 對照與判定

- 現有 Schema 可承接 RTP、波動度原文／統一值、最高倍數、5×3、Paylines、Bonus Buy 與日期。
- `expanding-wild`／`expanding-symbol` 尚無準確共用 enum，且同批 Book of Dead 再次出現，值得進 taxonomy 審查；本輪可先保存於 `bonusFeatures` 原文。
- 多種官方 ID 的命名空間是資料追溯 gap，但不阻止發布審查。
- 96.08／96.09 是來源版本差異，不是現階段已證明的多 RTP 選項。

**主要判定：`ELIGIBLE_FOR_PUBLISH_REVIEW`**

理由：現行官方頁提供身份、RTP、波動度、最高倍數、盤面、賠線、Bonus Buy、日期及圖片；歷史 RTP 差異已隔離，不需為此建立錯誤 variant。

## 7. Rich Wilde and the Book of Dead

### A. 身份與名稱

| 項目 | 核對結果 |
|---|---|
| 正式英文名稱 | `Rich Wilde and the Book of Dead` |
| 官方中文市場名稱 | 未找到 Play’n GO 官方中文名稱。 |
| 台灣常見繁中名稱 | `死亡之書` 與 `死者之書` 皆有使用訊號，沒有可靠搜尋量可判定唯一勝出。 |
| 建議繁中顯示名稱 | 發布前由編輯選定；可暫採 `死亡之書`，並明確標示為編輯名稱而非官方名稱。 |
| 建議 aliases | `Rich Wilde and the Book of Dead`、`Book of Dead`、`死亡之書`、`死者之書`、`Rich Wilde Book of Dead` |
| 實際開發商 | Play’n GO |
| 官方 Game ID | `1044`；官方產品頁結構資料以 `gameId` 標示。 |

主要官方來源：

- [Play’n GO 官方遊戲頁](https://www.playngo.com/games/rich-wilde-and-the-book-of-dead)
- [Play’n GO 官方玩法指南](https://www.playngo.com/posts/a-complete-guide-on-how-to-play-book-of-dead)
- [Play’n GO 官方 walkthrough](https://www.playngo.com/post/book-of-dead-walkthrough)
- [Play’n GO 官方 Dead Series 說明](https://www.playngo.com/post/book-of-dead-slots)
- [Play’n GO 官方 Rich Wilde 角色頁](https://www.playngo.com/posts/rich-wilde)

### B. 角色品牌與系列關係

- Play’n GO 官方把 Rich Wilde 描述為多款作品中的主角／角色品牌。
- 官方另有 `Dead Series`，Book of Dead 明確屬於該系列。
- 因此本作同時位於 Rich Wilde 角色宇宙與 Dead Series；兩者不是數字代數，也不可把「Rich Wilde」直接當作 `installment`。
- 若現有 Schema 只能選一個正式系列，建議以 `dead-series` 作 `seriesId`，Rich Wilde 關係留在 aliases／摘要／來源；`installment` 留空。

### C. 結構化資料

| 欄位 | 核對值 | 官方原始標籤／備註 |
|---|---|---|
| 主要 RTP | `96.21%` | 官方 `defaultRtp`。 |
| RTP 版本 | `84.24%`、`87.24%`、`91.25%`、`94.24%`、`96.21%` | 官方產品頁結構資料；分開保存。 |
| 原廠波動度 | `HIGH`，原始數值 `10` | 官方 `volatilityRating: HIGH`、`volatility: 10`；可映射 Slot Hub `high`。 |
| 整局最高倍數 | `5,000×` | 官方 `winCap: 5000`；官方指南亦描述滿軸 Rich Wilde 約 5,000×。不可因官方文案使用 jackpot 字樣就推定 `jackpotType`。 |
| 盤面 | 5×3 | 官方資料。 |
| 主要中獎機制 | `Paylines` | 可調整賠線。 |
| 數量 | 10 | 官方 `numberOfPaylines: 10`。 |
| Bonus Buy | 未確認 | 本輪採用的官方資料沒有足夠明確的布林值。 |
| 發行日期 | `2016-01-14` | 官方產品頁。 |
| Game ID | `1044` | 官方欄位 `gameId`。 |

### D. Features

- Tomb 符號同時作 Wild／Scatter：映射既有 `Wild`、`Scatter`。
- 3 個 Scatter 觸發 10 Free Spins：映射 `Free Spins`。
- Free Spins 可再觸發 10 次：映射 `Retrigger`。
- `Special Expanding Symbol`：官方核心 Feature，與 Starburst 的 Expanding Wild 類似但不完全相同；現有 enum 無精確對應。
- Active paylines：規則條件，不是新 Mechanism。

### E. 官方圖片

- 官方產品圖（500×350 WebP）：`https://static.wixstatic.com/media/b24144_002e6f4aa59d4b41a4ae4bb88dd251c4~mv2.webp/v1/fill/w_500,h_350,al_c/b24144_002e6f4aa59d4b41a4ae4bb88dd251c4~mv2.webp`
- 官方 Hero 原圖來源：`https://static.wixstatic.com/media/b24144_71242df8f09141fdae4ca4bfc17decce~mv2.jpg`
- Hero 來源資料標示原始約 1920×686；後續應確認完整 Logo 與卡片裁切，本輪未下載或轉檔。

### F. Schema／taxonomy 對照與判定

- 現有 Schema 可承接多 RTP、波動度、win cap、盤面、Paylines、Features、日期與 Game ID。
- 單一 series 欄位無法同時結構化「Dead Series」與「Rich Wilde 角色宇宙」。這是關係模型限制，但目前可用正式系列＋摘要保留角色關係，不阻止建立資料。
- `Special Expanding Symbol` 與 `Expanding Wild` 跨兩款重複，值得共用 Feature taxonomy 審查。
- 兩種台灣中文譯名競爭屬編輯命名問題，不是身份或 Schema 問題。

**主要判定：`ELIGIBLE_FOR_PUBLISH_REVIEW`**

理由：官方資料涵蓋身份、多 RTP、波動度、最高倍數、盤面、賠線、Features、日期、Game ID 與圖片。中文主名稱需編輯選擇，但英文正式名稱與 aliases 可避免搜尋遺漏，不阻止進入發布審查。

## 8. Wanted Dead or a Wild

### A. 身份與名稱

| 項目 | 核對結果 |
|---|---|
| 正式英文名稱 | `Wanted Dead or a Wild`；官方標題大小寫亦見 `Wanted Dead Or a Wild`。 |
| 官方中文市場名稱 | 未找到 Hacksaw Gaming 官方中文名稱。 |
| 台灣常見繁中名稱 | `亡命之徒`、`亡命狂野` 皆有使用訊號，沒有可靠搜尋量可證明唯一固定名稱。 |
| 建議繁中顯示名稱 | 發布前編輯選定；可先以英文為主，或採 `亡命狂野` 並將另一譯名列為 alias，均不得標成官方中文。 |
| 建議 aliases | `Wanted Dead or a Wild`、`Wanted Dead Or a Wild`、`亡命之徒`、`亡命狂野` |
| 實際開發商 | Hacksaw Gaming |
| 官方 Game ID | `1067`；官方頁資產／頁面資料使用此 game id。 |

主要官方來源：

- [Hacksaw Gaming 官方遊戲頁](https://www.hacksawgaming.com/games/wanted-dead-or-a-wild)
- [Hacksaw Gaming 官方 2021 發布／公司新聞](https://www.hacksawgaming.com/news)

### B. 作品與系列關係

- 官方資料將其作為獨立遊戲呈現；本輪沒有找到數字續作或需建立正式 seriesId 的證據。
- `DuelReels™` 是玩法／功能品牌，不應因其他作品可能採用相同功能就建立作品代數或系列。
- 三個 Bonus Game 是同一遊戲內的模式，不是三款作品或三個主要 Mechanism。

### C. 結構化資料

| 欄位 | 核對值 | 官方原始標籤／備註 |
|---|---|---|
| 主要 RTP | `96.38%` | 官方頁列出的最高／主要配置。 |
| RTP 版本 | `96.38%`、`94.55%`、`92.33%`、`88.42%` | 官方頁；分開保存。 |
| 原廠波動度 | `4/5` | 官方頁；可映射 Slot Hub `high`，並保留 4/5 原文。 |
| 整局最高倍數 | `12,500×` | 官方頁 `Max Win 12,500x`。 |
| 盤面 | 5×5 | 官方頁。 |
| 主要中獎機制 | `Paylines` | 官方 `Wintype: 15 Paylines`。 |
| 數量 | 15 | 15 Paylines。 |
| Bonus Buy | 有 | 官方頁列為 Feature。 |
| 發行日期 | 2021 年可確認；精確日期未確認 | 官方 2021 新聞稱其為當時近期發布，後續官方文章亦指向 2021；未找到高權重精確日期。 |
| Game ID | `1067` | 官方頁面／資產識別。 |

### D. Features 與 Mechanism 判斷

- `DuelReels™`：官方遊戲專屬／品牌化 Feature；擴展 Wild reels 與 multiplier 值可累加。
- `The Great Train Robbery Bonus Game`：Sticky Wilds 等 Bonus 規則。
- `Duel at Dawn Bonus Game`：較高倍數的 DuelReels 模式。
- `Dead Man’s Hand Bonus Game`：收集 Wild／multipliers 後進入 Showdown 階段。
- `Bonus Buy`：既有欄位可承接。
- 上述多個 Bonus 模式全部是 Features；基礎得獎仍為 15 Paylines，不需要多 Mechanism Schema。

### E. 官方圖片

| 用途 | 官方 URL | 核對 |
|---|---|---|
| Hero 背景 | `https://www-live.hacksawgaming.com/casino_thumbnails/1067_hero_MG_Background.png` | 官方資產；本輪未下載。 |
| 遊戲 Logo | `https://www-live.hacksawgaming.com/casino_thumbnails/1067_logo_Logo.png` | 官方獨立 Logo；未來可與背景合成顯示，但不可 AI 重製。 |
| 桌機作品圖 | `https://www-live.hacksawgaming.com/casino_thumbnails/1067_hero_DESKTOP.png` | 官方完整作品圖候選；後續確認尺寸與裁切。 |

### F. Schema／taxonomy 對照與判定

- 現有 Schema 可承接多 RTP、4/5 原廠波動度、最高倍數、5×5、15 Paylines、Bonus Buy、Features、Game ID 與來源。
- 三個 Bonus 模式可保存於 `bonusFeatures`，不構成多 Mechanism gap。
- `DuelReels™` 是遊戲專屬詞，不值得因單一樣本立即新增共用 enum。
- 中文名稱競爭與精確發行日缺值是資料／編輯問題，不是架構阻擋。

**主要判定：`ELIGIBLE_FOR_PUBLISH_REVIEW`**

理由：官方產品頁提供足夠的 RTP versions、波動度、最高倍數、盤面、賠線、Bonus Buy、功能與官方圖片。精確日期及正式中文名稱缺值不會造成薄頁。

## 9. 新 Provider 草稿規格（只讀，不建立 Collection）

### 9.1 NetEnt

官方來源：[NetEnt About](https://netent.com/about/)、[NetEnt Games／Starburst](https://netent.com/games/starburst)。

| 現有 Provider 欄位 | 建議草稿值／處理 |
|---|---|
| slug | `netent` |
| name／brandName | `NetEnt` |
| aliases | `NetEnt™`；歷史全名若未取得官方明確來源，不先加入。 |
| roles | `developer`、`publisher`；是否標 `platform` 可等建立前再依官方產品範圍核對。不標 `aggregator`。 |
| parentOrganization | `Evolution Group`；現行官方頁與官方歷史發布資料支持集團關係。 |
| subBrands | 留空 |
| originRegions | 留空；不把公司地址或歷史印象直接當品牌起源代碼。 |
| serviceMarkets | 留空；`global` 等描述不轉成國家代碼。 |
| marketTags | 可候選 `international`，建立前依現有 taxonomy 命名。 |
| languages | 留空；網站語言不等於遊戲支援語言。 |
| gameTypes | `slots`；其他類型需另核對。 |
| officialUrl | `https://netent.com/` |
| summary | 可依官方 About 撰寫「提供線上娛樂遊戲與技術的品牌，現屬 Evolution 集團」，避免加入未核對市場數字。 |
| logo | 本輪不下載；建立圖片時從官方頁首品牌資產核對精確 URL。 |
| status | `draft` |

**Schema 判斷：現有 Provider Schema 可直接建立 NetEnt 草稿。** 單一 `source` 對多項公司事實的追溯力有限，但可先用官方 About 主來源，不是本批阻擋。

### 9.2 Play’n GO

官方來源：[Play’n GO About Us](https://www.playngo.com/about-us)、[Play’n GO Games](https://www.playngo.com/games)。

| 現有 Provider 欄位 | 建議草稿值／處理 |
|---|---|
| slug | `play-n-go` |
| name／brandName | `Play’n GO`（保留官方彎引號） |
| aliases | `Play'n GO`、`Play N GO`、`Playn GO`、`Playngo` |
| roles | `developer`、`publisher`；不標 `aggregator`。 |
| parentOrganization | 留空 |
| subBrands | 留空 |
| originRegions | 留空；不把公司註冊／聯絡地址等同品牌起源。 |
| serviceMarkets | 留空；官方「35+ regulated jurisdictions」不轉成未知市場代碼。 |
| marketTags | 可候選 `international`、`regulated-markets`，須符合現有 taxonomy。 |
| languages | 留空；無足夠結構化的遊戲語言清單。 |
| gameTypes | `slots`；官方目錄亦有其他遊戲形式，但本批候選只需 slots。 |
| officialUrl | `https://www.playngo.com/` |
| summary | 可依官方 About 撰寫「面向受監管營運商提供線上娛樂遊戲的供應商，擁有逾二十年產品經驗」，不把 35+ 轉成市場清單。 |
| logo | 本輪不下載；建立圖片時從官方頁首資產核對。 |
| status | `draft` |

**Schema 判斷：現有 Provider Schema 可直接建立 Play’n GO 草稿。** 缺少 originRegions、serviceMarkets、languages 是資料缺值，不是 Schema 缺口。

## 10. 整批欄位取得率

分母均為 6；「取得」表示已有符合本輪來源權重的可追溯資料，不表示本輪已寫入 Collection。

| 欄位 | 取得數 | 取得率 | 備註 |
|---|---:|---:|---|
| 正式英文名稱 | 6/6 | 100% | 全部官方確認。 |
| 官方中文市場名稱 | 3/6 | 50% | Fortune Ox、Sweet Bonanza 1000、Gates of Olympus 1000；均需區分簡體市場頁與官方繁中。 |
| 台灣常見名稱／aliases 定性訊號 | 6/6 | 100% | Book of Dead、Wanted 有競爭譯名；全部無可靠量化搜尋量。 |
| 實際開發商 | 6/6 | 100% | 官方確認。 |
| 與現有 18 款重複檢查 | 6/6 | 100% | 均非重複。 |
| 原作／續作／獨立關係 | 6/6 | 100% | Sweet 1000、Gates 1000 為官方續作；其餘關係已分類。 |
| 官方系列／宇宙證據 | 4/6 | 66.7% | Sweet、Gates、Starburst、Book of Dead；Fortune Ox 不建立正式系列，Wanted 為獨立作。 |
| 主要 RTP | 4/6 | 66.7% | Sweet 1000、Gates 1000 的官方公開精確值未取得。 |
| 已確認多 RTP 版本 | 3/6 | 50% | Fortune Ox、Book of Dead、Wanted。Starburst 96.08／96.09 是來源差異，暫不算 variants。 |
| 原廠波動度 | 4/6 | 66.7% | Sweet 1000、Gates 1000 缺值。 |
| 整局最高倍數 | 6/6 | 100% | 所有值均與單一 Feature 倍數分開。 |
| 盤面 | 6/6 | 100% | Fortune Ox 為不規則 3／4／3。 |
| 主要 Mechanism | 6/6 | 100% | 4 款 Paylines、2 款 Pay Anywhere。 |
| Paylines／Ways 數量 | 4/6 | 66.7% | 兩款 Pay Anywhere 的 8+ 為匹配門檻，不是 winCount。 |
| Features | 6/6 | 100% | 均有官方資料。 |
| Bonus Buy 明確值 | 3/6 | 50% | Gates 1000 有、Starburst 無、Wanted 有；其餘未確認。 |
| 精確發行日期 | 4/6 | 66.7% | Fortune Ox、Wanted 只確認年份。 |
| 官方可追溯識別碼 | 6/6 | 100% | 但只有 Book `gameId`、Wanted `gameid` 可直接視為同名欄位；其餘需保存 gid／pgid／gameSymbol／tableId 命名空間。 |
| 官方圖片候選 | 6/6 | 100% | 只記錄來源，未下載或檢查最終裁切。 |

## 11. Mechanism、Feature 與系列結論

### 11.1 Mechanism

- 本批沒有新 Mechanism enum 的必要。
- Sweet Bonanza 1000、Gates of Olympus 1000 使用已存在的 `pay-anywhere`。
- Fortune Ox、Starburst、Book of Dead、Wanted 使用 `paylines`。
- Scatter 符號不等於 Scatter Pays；本批未出現足以新增 `scatter-pays` 的證據。
- Wanted 的三個 Bonus 模式不是三個主要 Mechanism。
- Starburst 的 Win Both Ways 是賠線方向規則，不是第二 Mechanism。

### 11.2 新／待審 Feature 詞彙

| 詞彙 | 出現 | 建議 |
|---|---|---|
| `Expanding Wilds`／`Special Expanding Symbol` | Starburst、Book of Dead | 跨兩款重複，值得審查共用 `expanding-wild`／`expanding-symbol` taxonomy；兩詞仍有語意差異，不應先合併。 |
| `Respin` | Fortune Ox、Starburst | 可候選共用 Feature。 |
| `Win Both Ways` | Starburst | 規則屬性，單次出現；先保留原文。 |
| `DuelReels™` | Wanted | 品牌化遊戲 Feature；不新增共用 enum。 |
| `Candy Bomb` | Sweet 1000 | 遊戲專屬名稱，可同時映射既有 Multiplier。 |
| `Fortune Ox Feature` | Fortune Ox | 遊戲專屬名稱；保留原文。 |

### 11.3 系列關係

- `Sweet Bonanza 1000`：官方直接續作；可歸 `sweet-bonanza` 系列，1000 不作代數。
- `Gates of Olympus 1000`：官方直接續作；可歸 `gates-of-olympus` 系列，1000 不作代數。
- `Starburst`：有官方非數字續作；可建 Starburst 系列但不強填 installment。
- `Book of Dead`：正式 Dead Series 與 Rich Wilde 角色宇宙重疊；先以正式系列為主要關係，角色關係保留文字。
- `Fortune Ox`：不因 Fortune Ox／Tiger 名稱相似而建立正式系列或代數。
- `Wanted`：多 Bonus 模式不構成作品系列。

## 12. Schema／taxonomy 缺口總結

### 12.1 真正值得進架構審查的重複缺口

1. **不規則盤面表示**：Fortune Ox 的 3／4／3 與前批 Mahjong Ways 2 類似，單一 `rows` 不能精確承接。建議日後評估 `reelHeights` 或 `layoutDescription`；本輪不修改。
2. **Provider 識別碼命名空間**：`gid`、`pgid`、`gameSymbol`、`tableId`、`gameId` 用途不同。單一 `gameId` 會丟失原始標籤；跨多家重複，值得後續審查 namespaced identifiers，但不阻止資料草稿。
3. **Expanding 類 Feature**：Starburst 與 Book of Dead 跨兩款重複，現有 enum 無準確表達；值得 taxonomy 審查，但可先以官方原文保存。
4. **重疊作品關係**：Book of Dead 同時屬正式系列與角色宇宙，單一系列欄只能承接其一。可先用正式系列＋摘要，等更多樣本再決定是否需要關係陣列。

### 12.2 資料缺值或編輯問題，不是 Schema 缺口

- Sweet 1000、Gates 1000 的官方 RTP／波動度未公開取得。
- Fortune Ox、Wanted 的精確發行日未取得。
- NetEnt／Play’n GO 的 originRegions、serviceMarkets、languages 無法從本輪官方來源安全轉成既有代碼。
- Book of Dead、Wanted 的繁中主名稱有競爭譯名。
- Starburst 的 96.08／96.09 是官方來源時期差異，未證明是可選 RTP variants。
- Sweet 1000 中文頁的 5×5 與英文官方資料的 6×5 是來源文字衝突，已透過一致的高權重官方英文來源處理。
- Pay Anywhere 的 8+ 符號門檻缺少專屬欄位；目前可保存原文，不應錯用 `winCount`。兩款同時出現，值得觀察但不阻止下一步。

### 12.3 不值得立即修改的單次缺口

- `DuelReels™`、`Fortune Ox Feature`、`Candy Bomb` 等品牌化名稱。
- Starburst 的 Win Both Ways 規則。
- 單一作品的行銷用語或官方頁面文案差異。

## 13. 最終判定與下一步

| 遊戲 | 主要判定 | 下一步前置條件 |
|---|---|---|
| Fortune Ox | `ELIGIBLE_FOR_PUBLISH_REVIEW` | 建草稿時保留不規則盤面與 gid／pgid 原標籤；不可與 Fortune Tiger 強建代數。 |
| Sweet Bonanza 1000 | `ELIGIBLE_FOR_PUBLISH_REVIEW` | 記錄中文頁盤面衝突；RTP／波動度留空；先建立／發布所需 Provider 關聯。 |
| Gates of Olympus 1000 | `ELIGIBLE_FOR_PUBLISH_REVIEW` | 使用 `pay-anywhere`；8+ 不填 winCount；RTP／波動度留空。 |
| Starburst | `ELIGIBLE_FOR_PUBLISH_REVIEW` | 先建立 NetEnt draft；96.09 不自動加入 RTP variants；保存 tableId 原標籤。 |
| Rich Wilde and the Book of Dead | `ELIGIBLE_FOR_PUBLISH_REVIEW` | 先建立 Play’n GO draft；選定編輯繁中主名；以 Dead Series 為主要系列、Rich Wilde 為角色關係。 |
| Wanted Dead or a Wild | `ELIGIBLE_FOR_PUBLISH_REVIEW` | 選定編輯繁中主名；三種 Bonus 模式只作 Features；精確日期留空。 |

本批沒有需要先修改 Mechanism enum 或把 `winMechanism` 改成陣列的阻擋。後續若獲授權，可先建立 NetEnt、Play’n GO Provider drafts，再依本報告建立六款 Game drafts；圖片下載、轉檔、狀態發布與 Preview 仍需各自執行驗證。
