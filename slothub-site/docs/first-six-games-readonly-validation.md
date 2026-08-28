# 第一批六款遊戲只讀驗證

> **READ-ONLY VALIDATION**
>
> 本文件是只讀驗證報告草稿，不是遊戲建立、匯入、發布或上線授權；也不構成 Schema、taxonomy、enum、Provider 或任何程式修改授權。

- 資料核對日期：2026-08-29（Asia/Taipei）
- 產品藍圖：`docs/slot-hub-master-blueprint-v1.md`
- 藍圖 Commit：`9099e72eeda4ce9d0fa0fa1082cabd4c1dfdc590`
- 驗證範圍：Mahjong Ways、Mahjong Ways 2、Fortune Tiger、Sweet Bonanza、Gates of Olympus、Big Bass Bonanza
- 既有資料比對範圍：目前 12 款 `src/content/games/*.md`、4 家 `src/content/providers/*.md`、`src/content.config.ts`、`src/lib/taxonomy.ts`
- 驗證過程未修改網站、Schema、taxonomy、內容資料或圖片；未 Build、未部署。
- 本報告本身已建立本地 Commit。
- 未 Push、未部署。

## 1. 驗證方法與判讀規則

1. 身份、精確數據與遊戲機制以廠商官方遊戲頁、官方規則 PDF、官方新聞稿及官方 CDN 為主。
2. 官方未公開的精確數據保持空白；搜尋摘要、一般娛樂城與聯盟頁面不作正式事實來源。
3. 廠商提供的簡體中文名稱記為「廠商中文市場名稱」，不冒充「官方繁中名稱」。繁體轉寫另列為 Slot Hub 編輯建議。
4. 台灣命名只記錄可追溯的定性訊號。六款皆無可靠量化搜尋量資料；搜尋結果數不作搜尋量。
5. `Scatter symbol` 只代表符號／Feature，不等於 `Scatter Pays`。中獎機制先保留官方原文，再討論映射。
6. PG SOFT 頁面公開的 `gid`、`pgid` 是官方頁面資料物件中的識別碼，但官方未說明哪一個才是跨平台 canonical Game ID，因此本輪不直接填 `gameId`。
7. PG SOFT 官方頁面的 `ct` 是頁面資料物件時間戳；因欄位語意未公開，本輪不把它直接當 `releaseDate`。

## 2. 現況與重複檢查

- 現有 12 款遊戲中沒有六款候選的同名、同 slug 或明顯別名紀錄。
- 六款不是現有遊戲的不同語言、不同 RTP 或平台別名。
- 目前 Provider Collection 沒有 `pg-soft`、`pragmatic-play` 或 `reel-kingdom`。未來若建立遊戲草稿，需另經授權先建立／核對 Provider 資料；本輪不建立。
- 建議 slug 均採穩定英文原名：`mahjong-ways`、`mahjong-ways-2`、`fortune-tiger`、`sweet-bonanza`、`gates-of-olympus`、`big-bass-bonanza`。

## 3. 官方來源索引

### PG SOFT

- Mahjong Ways：[官方遊戲頁](https://www.pgsoft.com/en/games/50/)、[英文規則 PDF](https://www.pgsoft.com/uploads/Games/Pdf/MahjongWays_Gameinformation_EN.pdf)、[中文規則 PDF](https://www.pgsoft.com/uploads/Games/Pdf/MahjongWays_Gameinformation_ZH.pdf)、[官方發布介紹](https://www.pgsoft.com/en/news/81/)
- Mahjong Ways 2：[官方遊戲頁](https://www.pgsoft.com/en/games/60/)、[英文規則 PDF](https://www.pgsoft.com/uploads/Games/Pdf/Mahjong_Ways_2_Gameinformation_EN.pdf)、[中文規則 PDF](https://www.pgsoft.com/uploads/Games/Pdf/Mahjong_Ways_2_Gameinformation_ZH.pdf)、[官方續作介紹](https://www.pgsoft.com/en/news/93/)
- Fortune Tiger：[官方遊戲頁](https://www.pgsoft.com/en/games/110/)、[英文規則 PDF](https://www.pgsoft.com/uploads/Games/Pdf/Fortune_Tiger_Gameinformation_EN.pdf)、[中文規則 PDF](https://www.pgsoft.com/uploads/Games/Pdf/Fortune_Tiger_Gameinformation_ZH.pdf)、[官方發布介紹](https://www.pgsoft.com/news/88/)

### Pragmatic Play

- Sweet Bonanza：[官方遊戲頁](https://www.pragmaticplay.com/en/games/sweet-bonanza-slot/?cur=eur&gamelang=en)、[官方中文市場頁](https://www.pragmaticplay.com/zh/%E6%B8%B8%E6%88%8F/%E7%94%9C%E5%85%A5%E5%BF%83%E6%89%89/)、[2019-06-25 官方發布稿](https://www.pragmaticplay.com/en/news/pragmatic-play-launches-sweet-bonanza/)、[官方續作／系列證據](https://www.pragmaticplay.com/en/news/pragmatic-play-sweetens-up-candyland-in-sweet-bonanza-1000/)
- Gates of Olympus：[官方遊戲頁](https://www.pragmaticplay.com/en/games/gates-of-olympus/?cur=USD&gamelang=en)、[官方中文市場頁](https://www.pragmaticplay.com/zh/%E6%B8%B8%E6%88%8F/gates-of-olympus/)、[2021-02-24 官方發布稿](https://www.pragmaticplay.com/en/news/pragmatic-play-aims-for-the-heavens-in-gates-of-olympus/)、[官方系列證據](https://www.pragmaticplay.com/en/news/pragmatic-play-amps-up-win-potential-with-gates-of-olympus-super-scatter/)
- Big Bass Bonanza：[官方遊戲頁](https://www.pragmaticplay.com/en/games/big-bass-bonanza/?cur=tnd&gamelang=en)、[官方中文市場頁](https://www.pragmaticplay.com/zh/%E6%B8%B8%E6%88%8F/big-bass-bonanza-zh/)、[2020-12-14 官方發布稿](https://www.pragmaticplay.com/en/news/pragmatic-play-turns-fishing-to-spins-in-big-bass-bonanza/)

## 4. 單款驗證

### 4.1 Mahjong Ways

**主要結果：`ELIGIBLE_FOR_PUBLISH_REVIEW`**

身份與命名：

- 正式英文名稱：`Mahjong Ways`
- 廠商／實際開發商：Pocket Games Soft（PG SOFT）；官方規則表同時列為 Owner、Developer。
- 官方識別：遊戲頁 URL／`gid=50`；頁面另公開 `pgid=65`，語意未文件化，暫不填 `gameId`。
- 建議 slug：`mahjong-ways`
- 與現有 12 款重複：否。
- 版本／平台別名：未發現；多 RTP 是同一遊戲的數學版本，不應拆成不同遊戲。
- 官方繁中名稱：未找到官方繁體中文頁或繁中規則。
- 廠商中文市場名稱：`麻将胡了`（官方簡中規則 PDF）。
- 台灣平台常見名稱：`麻將胡了` 的固定訊號明顯；仍無可靠量化搜尋量。
- Slot Hub 建議編輯譯名：`麻將胡了`；搜尋別名可保留 `Mahjong Ways`、`麻将胡了`。

系列與版本：

- 官方明確把 Mahjong Ways 2 稱為續作／第二款，並回指本作。
- 可填 `seriesId: mahjong-ways`、`seriesNameZhHant: 麻將胡了`、`installment: 1`。
- `relatedGames` 可在第二作建立後指向 `mahjong-ways-2`。

結構化資料：

| 欄位 | 已核對值／狀態 |
|---|---|
| 主要 RTP | 96.92% |
| RTP 版本 | 94%、95%、96.92%、97%、98%、99%、100% |
| 原廠波動度 | `Session Volatility: Medium` |
| 統一波動度 | 可直接映射 `medium` |
| 最高倍數 | 25,000×；原廠標籤 `Theoretical Maximum Win`／`Max Win (Advertised Value...)` |
| 軸 × 列 | 5 × 4 |
| 官方中獎機制原文 | `1024 ways (base bet 20)` |
| Ways／Paylines 數量 | 1,024 ways；`base bet 20` 不應誤填為 20 paylines |
| Bonus Buy | 官方公開資料未確認，保持空白 |
| 發行日期 | 官方頁 `ct=2020-01-15T03:20:41` 僅作頁面資料時間戳；`releaseDate` 暫空 |
| 投注範圍 | 官方規則的預設 EUR €0.20–€50；應連同幣別／`default` 語意保存，現有純數字欄位會失真 |
| Game ID | 未確認 canonical ID；保留 `gid=50`、`pgid=65` 於報告 |

Mechanism 與 Features：

- Mechanism 原文 `1024 ways` 可映射現有 `ways-to-win`。
- 官方原始 Feature 詞彙：`Wild symbol transformation`、`Free Spins Feature`、`increasing multiplier`、`Scatter symbol`、`gold plated symbols`、`cascaded down`。
- 現有共用 Feature：Wild、Free Spins、Multiplier、Scatter、Cascading。
- 遊戲專屬功能名稱：Gold Plated Symbols／金色麻將牌轉 Wild；先留原文，不升格共用 enum。
- 沒有把 Scatter symbol 判定為 Scatter Pays。

圖片：

- 官方主圖：[games_cover.png](https://www.pgsoft.com/uploads/Games/Images/0664c7e3-d8d8-47f1-9150-bfd2e5cb6546.png)
- 官方橫幅：[games_banner_bg_static.png](https://www.pgsoft.com/uploads/Games/Images/50c6fa4a-4661-4ac6-8c41-938c8eea873f.png)
- 官方行銷圖：[games_details_marketing.png](https://www.pgsoft.com/uploads/Games/Images/839e1c4f-9e7e-488d-aeb0-c4f4820b3131.png)
- 來源明確為官方 CDN；官方頁可辨識遊戲 Logo。未來卡片版型可能需由 cover 轉檔／裁出一致比例，本輪未下載或處理。

Schema／taxonomy 對照：

- 可直接承接：名稱、別名、系列、provider、RTP、RTP variants、波動度、最高倍數、reels、rows、`ways-to-win`、winCount、features、sources、圖片、核對日期。
- 可留空：Bonus Buy、releaseDate、gameId、jackpotType。
- 需保留原廠文字：最高倍數標籤、Gold Plated Symbols、預設投注幣別與範圍。
- Schema gap：`minBet/maxBet` 沒有幣別與「預設值」語意；`gameId` 無 namespace／ID 類型。
- Taxonomy gap：`cascaded down` 是否等同共用 Cascading 可沿現有映射，不需因單款立刻改 enum。

### 4.2 Mahjong Ways 2

**主要結果：`ELIGIBLE_FOR_PUBLISH_REVIEW`**

身份與命名：

- 正式英文名稱：`Mahjong Ways 2`
- 廠商／實際開發商：Pocket Games Soft（PG SOFT）；官方規則表列 Owner、Developer。
- 官方識別：遊戲頁 URL／`gid=60`；另有 `pgid=74`，暫不填 `gameId`。
- 建議 slug：`mahjong-ways-2`
- 與現有 12 款重複：否；不是 Mahjong Ways 的語言或 RTP 版本，而是獨立續作。
- 官方繁中名稱：未找到。
- 廠商中文市場名稱：`麻将胡了2`（官方簡中規則 PDF）。
- 台灣平台常見名稱：`麻將胡了2`／`麻將胡了 2` 訊號一致；無可靠量化搜尋量。
- Slot Hub 建議編輯譯名：`麻將胡了2`。

系列與版本：

- 官方介紹明確稱為第二款、續作，並稱第一作為 popular game。
- 可填 `seriesId: mahjong-ways`、`seriesNameZhHant: 麻將胡了`、`installment: 2`。
- `relatedGames` 可指向 `mahjong-ways`。

結構化資料：

| 欄位 | 已核對值／狀態 |
|---|---|
| 主要 RTP | 96.95% |
| RTP 版本 | 94%、95%、96.95%、97%、98%、99%、100% |
| 原廠波動度 | `Session Volatility: Medium` |
| 統一波動度 | 可直接映射 `medium` |
| 最高倍數 | 100,000×；原廠另列 10 億次模擬的 `Max Exposure: 1708x`，兩者不得混用 |
| 軸 × 列 | 5 × 4，但第 2、3、4 軸各有額外一列 |
| 官方中獎機制原文 | `2000 ways (base bet 20)` |
| Ways／Paylines 數量 | 2,000 ways；20 是 base bet，不是 paylines |
| Bonus Buy | 官方公開資料未確認，保持空白 |
| 發行日期 | 官方頁 `ct=2020-04-14T08:23:17` 只作資料時間戳；`releaseDate` 暫空 |
| 投注範圍 | 官方預設 EUR €0.20–€50；需保留幣別與 default 語意 |
| Game ID | 未確認 canonical ID；保留 `gid=60`、`pgid=74` 於報告 |

Mechanism 與 Features：

- `2000 ways` 可映射 `ways-to-win`。
- 官方原始詞彙：`Wild symbol transformation`、`Free Spins Feature`、`increasing multiplier`、`golden Mahjong symbols`、`Scatter symbol`。
- 現有共用 Feature：Wild、Free Spins、Multiplier、Scatter。
- 遊戲專屬功能：第 3 軸 Golden Mahjong Symbols／獲勝後轉 Wild；不需立即新增 enum。
- 額外列是盤面結構差異，不應硬改成固定 `rows: 5`。

圖片：

- 官方主圖：[games_cover.jpg](https://www.pgsoft.com/uploads/Games/Images/5f5eb999-bdb9-49a7-82d6-0829797bc6f7.jpg)
- 官方橫幅：[games_banner_bg_static.png](https://www.pgsoft.com/uploads/Games/Images/5ccb820b-44a0-4d93-96ad-6ca241b13127.png)
- 官方行銷圖：[games_details_marketing.png](https://www.pgsoft.com/uploads/Games/Images/90f52885-192a-4865-91ce-ed28c521558c.png)
- 官方來源明確且可辨識完整 Logo；未來可能需轉檔與統一卡片比例，本輪未下載。

Schema／taxonomy 對照：

- 可直接承接：大多數現有結構化欄位與系列欄位。
- 可留空：Bonus Buy、releaseDate、gameId、jackpotType。
- 需保留原廠文字：不規則列結構、Max Exposure 與 Advertised Max Win 的差異、base bet 20。
- Schema gap：單一 `rows` 無法精確表達部分軸多一列；最高倍數只有一組數字＋標籤時，也不適合再塞 Max Exposure。
- 建議：先在 `bonusFeatures`／來源備註保存原文；是否新增 `layoutDescription` 或結構化 max-win variants，等更多樣本再審查。

### 4.3 Fortune Tiger

**主要結果：`ELIGIBLE_FOR_PUBLISH_REVIEW`**

身份與命名：

- 正式英文名稱：`Fortune Tiger`
- 廠商／實際開發商：Pocket Games Soft（PG SOFT）。
- 官方識別：遊戲頁 URL／`gid=110`；另有 `pgid=126`，暫不填 `gameId`。
- 建議 slug：`fortune-tiger`
- 與現有 12 款重複：否；與現有 Booming Games 的 `Fortune Paw` 名稱相近但不是同一遊戲。
- 官方繁中名稱：未找到。
- 廠商中文市場名稱：`虎虎生财`（官方簡中規則 PDF）。
- 台灣常見名稱：可見 `虎虎生財` 與直接使用 Fortune Tiger；固定性弱於 Mahjong Ways，無可靠量化搜尋量。
- Slot Hub 建議編輯譯名：`虎虎生財`；英文名保留副標，別名保留 `Fortune Tiger`。

系列與版本：

- 官方資料未證明它是正式編號系列或某款續作。
- 題材同為 Fortune 動物遊戲，不足以建立 `seriesId`；`seriesId`、`installment` 留空。

結構化資料：

| 欄位 | 已核對值／狀態 |
|---|---|
| 主要 RTP | 96.81% |
| RTP 版本 | 94%、95%、96.81%、97%、98%、99%、100% |
| 原廠波動度 | `Session Volatility: Medium` |
| 統一波動度 | 可直接映射 `medium` |
| 最高倍數 | 2,500×；原廠 Max Exposure 與 Advertised Max Win 皆為 2,500× |
| 軸 × 列 | 3 × 3 |
| 官方中獎機制原文 | `3 Reels, 5 Lines`／Standard Spinning Reels |
| Ways／Paylines 數量 | 5 paylines |
| Bonus Buy | 官方公開資料未確認，保持空白 |
| 發行日期 | 官方頁 `ct=2022-01-17T16:10:42` 只作資料時間戳；`releaseDate` 暫空 |
| 投注範圍 | 官方預設 EUR €0.25–€250 |
| Game ID | 未確認 canonical ID；保留 `gid=110`、`pgid=126` 於報告 |

Mechanism 與 Features：

- `5 Lines` 可映射 `paylines`，`winCount: 5`。
- 官方原始詞彙：`respins`、`x10 multiplier`、`Fortune Tiger Feature`、`Wild symbol`、`full reels win`。
- 現有共用 Feature：Respins、Multiplier、Wild。
- 遊戲專屬功能：Fortune Tiger Feature；不需因單款新增共用 Feature。
- 沒有官方 Scatter Pays 證據。

圖片：

- 官方主圖：[games_cover.jpg](https://www.pgsoft.com/uploads/Games/Images/70aab544-e9aa-4451-9d5c-e2d6dcc85a1c.jpg)
- 官方橫幅：[games_banner_bg_static.png](https://www.pgsoft.com/uploads/Games/Images/573dd356-c258-4f7d-b6a3-94c4ab44a780.png)
- 官方行銷圖：[games_details_marketing.png](https://www.pgsoft.com/uploads/Games/Images/2d303a5e-102d-4a3d-8639-1ab4bdb09af7.png)
- 官方來源明確並包含遊戲識別；未來可能需轉檔／裁切，本輪未下載。

Schema／taxonomy 對照：

- 可直接承接：除 ID／日期語意外，大多數欄位可直接映射。
- 可留空：系列、Bonus Buy、releaseDate、gameId、jackpotType。
- 需保留原廠文字：Fortune Tiger Feature、Max Exposure／Advertised Max Win 標籤、預設投注幣別。
- Schema gap：與前兩款相同，投注幣別／default 語意與 ID namespace 尚缺；不是本款專屬問題。

### 4.4 Sweet Bonanza

**主要結果：`ELIGIBLE_FOR_DRAFT`**

身份與命名：

- 正式英文名稱：`Sweet Bonanza®`
- 廠商／實際開發商：Pragmatic Play；官方發布稿稱為其新遊戲並收於自有 Slots portfolio。
- 官方 Game ID：官方公開頁未提供可確認的 canonical ID。
- 建議 slug：`sweet-bonanza`
- 與現有 12 款重複：否；Sweet Bonanza 1000、Super Scatter、CandyLand 是其他作品／版本，不是本作別名。
- 官方繁中名稱：未找到官方繁中頁。
- 廠商中文市場名稱：`甜入心扉`（官方中國簡中頁）。
- 台灣常見名稱：`甜蜜糖果`、`甜入心扉`、`甜蜜糖果樂園` 等名稱競爭，沒有單一壓倒性證據；無可靠量化搜尋量。
- Slot Hub 建議編輯譯名：優先 `甜入心扉`（可直接承接廠商中文市場名稱），把 `甜蜜糖果`、`甜蜜糖果樂園` 放搜尋別名。

系列與版本：

- 官方將 Sweet Bonanza 1000 稱為 original Sweet Bonanza 的 supercharged sequel，品牌／系列證據成立。
- 可考慮 `seriesId: sweet-bonanza`；本作不宜只因是原作就自動填 `installment: 1`，因官方沒有編號一代。

結構化資料：

| 欄位 | 已核對值／狀態 |
|---|---|
| 主要 RTP | 官方公開頁／發布稿未提供，保持空白 |
| RTP 版本 | 未找到官方公開版本表，保持空白 |
| 原廠波動度 | 官方發布稿 `high-volatility` |
| 統一波動度 | 可映射 `high` |
| 最高倍數 | 21,175× original bet（官方 2019 發布稿） |
| 軸 × 列 | 6 × 5 |
| 官方中獎機制原文 | `matching symbols anywhere`；官方續作稿回稱原作為 `six-reel, pays-anywhere Slot` |
| Ways／Paylines 數量 | 不適用／未提供；8–12+ 是同符號門檻，不是 ways/paylines 數量 |
| Bonus Buy | 官方公開本作頁未確認，保持空白 |
| 發行日期 | 2019-06-25（官方發布稿日期） |
| 投注範圍 | 官方公開來源未提供，保持空白 |
| Game ID | 未提供，保持空白 |

Mechanism 與 Features：

- 官方原文為 `pays-anywhere`／`matching symbols anywhere`，不等於單純有 Scatter symbol。
- 現有 `winMechanism` 沒有 `pay-anywhere` 或 `scatter-pays`；不得先塞 `other` 掩蓋差異。
- 官方原始 Feature：`tumbling`、`scatter symbols`、`Free Spins Feature`、`multiplier symbols`。
- 現有共用 Feature：Cascading（若確認將 tumbling 統一映射）、Scatter、Free Spins、Multiplier。
- 新共用詞候選：`tumbling` 可作官方原文別名；`Pay Anywhere` 是 Mechanism 候選，不是 Feature。

圖片：

- 官方縮圖：[Sweet-Bonanza Thumb 339×180](https://www.pragmaticplay.com/wp-content/uploads/2019/03/Sweet-Bonanza%E2%84%A2_Thumb_339x180-3.png)
- 來源為 Pragmatic Play 官方 WordPress CDN；339×180 橫式遊戲縮圖，包含完整遊戲 Logo，適合卡片主圖但未來可能需轉 WebP，不建議再裁切 Logo。

Schema／taxonomy 對照：

- 可直接承接：雙語名稱、別名、provider、波動度、最高倍數、6×5、features、releaseDate、sources、圖片。
- 可留空：RTP、RTP variants、winCount、Bonus Buy、投注範圍、gameId、jackpotType。
- 需保留原廠文字：Pay Anywhere、Tumbling、8–12+ symbol threshold。
- Taxonomy gap：`Pay Anywhere`／`Scatter Pays` 不在現有 enum；這個缺口同時也出現在 Gates of Olympus，值得進架構審查。
- Schema gap：可能需要保存「同符號最低數量門檻」，但目前只有兩個樣本，先保留原文即可。

### 4.5 Gates of Olympus

**主要結果：`TAXONOMY_DECISION_NEEDED`**

身份與命名：

- 正式英文名稱：`Gates of Olympus™`
- 廠商／實際開發商：Pragmatic Play。
- 官方 Game ID：官方遊戲頁未提供；監管名錄可找到平台識別碼線索，但不等於廠商 canonical ID，本輪不採填。
- 建議 slug：`gates-of-olympus`
- 與現有 12 款重複：否；Gates of Olympus 1000、Super Scatter、Roulette 等是不同作品，不是語言／RTP 版本。
- 官方繁中名稱：未找到。
- 廠商中文市場名稱：`奥林匹斯之门`（官方中國簡中頁）。
- 台灣常見名稱：`奧林匹斯之門` 訊號穩定，也可見英文直用；無可靠量化搜尋量。
- Slot Hub 建議編輯譯名：`奧林匹斯之門`，英文名為副標。

系列與版本：

- 官方明確稱 Gates of Olympus Super Scatter 為 Gates of Olympus 系列新作，也稱 1000 為原作續作。
- 可考慮 `seriesId: gates-of-olympus`；本作 `installment` 留空，不以原作身分自動填 1。

結構化資料：

| 欄位 | 已核對值／狀態 |
|---|---|
| 主要 RTP | 官方公開頁／發布稿未提供，保持空白 |
| RTP 版本 | 未找到官方公開版本表，保持空白 |
| 原廠波動度 | `highly volatile` |
| 統一波動度 | 可映射 `very-high`；若團隊慣例把 highly volatile 映射 high，需統一決策 |
| 最高倍數 | 官方現行頁只列組合最高 50×、Multiplier symbol 最高 500×，都不是整局 max win；保持空白 |
| 軸 × 列 | 現行頁明確 `six tumbling reels`；發布稿寫 `5×6 slot`，方向未明示。業界常見解讀是 6×5，但本輪不代替官方消除歧義 |
| 官方中獎機制原文 | `Pay Anywhere`、`pays out on clusters of eight or more`；同一發布稿亦寫 `20 paylines` |
| Ways／Paylines 數量 | 官方稿出現 20 paylines，但與 Pay Anywhere 並存；在機制定義前不直接填 `winCount` |
| Bonus Buy | 官方公開原作頁未確認，保持空白 |
| 發行日期 | 2021-02-24 |
| 投注範圍 | 官方公開來源未提供，保持空白 |
| Game ID | 未提供 canonical ID，保持空白 |

Mechanism 與 Features：

- Pragmatic Play 官方發布稿在同一段文字中同時提到 `20 paylines`、`Pay Anywhere` 與 `clusters of eight or more`，證明這份發布稿存在混合或彼此矛盾的描述。
- 現階段不能因此斷言本作具有三個並列的主要 Mechanism，也不能僅憑發布稿自行選一個值塞入現有 enum。
- 必須再取得正式規則頁、遊戲內 Paytable 或其他更高權重證據後，才能判定主要中獎機制；在此之前維持 `TAXONOMY_DECISION_NEEDED`。
- 正式草稿可以等待上述高權重規則證據，無須先設計多 Mechanism Schema。
- `clusters of eight or more` 是官方行銷文字，不足以直接映射 `cluster-pays`，因現行頁明說 symbols pay anywhere。
- 官方原始 Feature：`tumbling wins`、`multiplier feature`、`Scatter symbols`、`Free Spins`、`progressive global multiplier`。
- 現有共用 Feature：Cascading/Tumbling、Multiplier、Scatter、Free Spins。
- 遊戲專屬／原文保留：progressive global multiplier（不是 progressive jackpot）。

圖片：

- 官方縮圖：[GOOL EN 339×180](https://www.pragmaticplay.com/wp-content/uploads/2021/02/GOOL_EN_339x180.png)
- 官方 CDN、339×180 橫式縮圖，含完整 Logo；可作卡片主圖，未來可能只需格式轉換。

Schema／taxonomy 對照：

- 可直接承接：名稱、別名、provider、波動度、features、releaseDate、sources、圖片。
- 可留空：RTP、最高倍數、投注、Bonus Buy、gameId、jackpotType。
- 需保留原廠文字：Pay Anywhere、clusters of eight or more、20 paylines、5×6／six reels。
- Taxonomy gap：目前只能確認官方發布稿描述混合，尚不能確認本作是否真的具有多個並列主要 Mechanism；enum 仍缺 `pay-anywhere`／`scatter-pays` 候選值。
- 本案例目前不構成將 `winMechanism` 改為陣列的授權；應先補正式規則頁或遊戲內 Paytable，再決定是否需要 Schema 變更。
- Schema gap：`reels: string` 加 `rows: number` 的混合型別仍不足以表達來源方向歧義；可能需要 raw layout text。這是核心分類決策，故本款不能直接升為發布審查。

### 4.6 Big Bass Bonanza

**主要結果：`ELIGIBLE_FOR_DRAFT`**

身份與命名：

- 正式英文名稱：`Big Bass Bonanza™`
- 廠商／參與方：官方確認 Pragmatic Play 與 Reel Kingdom 存在合作關係。現階段主要 Provider 可暫判為 Pragmatic Play；Reel Kingdom 僅保存為合作品牌／合作方線索。官方公開稿未精確拆分 developer／publisher 權責，因此不自動把 Reel Kingdom 建立為第二 Provider 或共同開發商。
- 官方 Game ID：未提供 canonical ID。
- 建議 slug：`big-bass-bonanza`
- 與現有 12 款重複：否；不能與 Big Bass Bonanza 1000、Bigger Bass Bonanza、Reel Action、Hold & Spinner 等混成同一款。
- 官方繁中名稱：未找到。
- 廠商中文市場名稱：`疯狂大鲈鱼`（官方中國簡中頁）。
- 台灣／繁中常見名稱：`瘋狂大鱸魚`、`大鱸魚` 並存；還有不同續作共用「大鱸魚」簡稱的混淆風險。無可靠量化搜尋量。
- Slot Hub 建議編輯譯名：`瘋狂大鱸魚`；`大鱸魚` 可作搜尋別名，但結果必須顯示英文原名及版本。

系列與版本：

- 官方後續作品反覆稱為 Big Bass 系列／franchise，系列證據成立。
- 可考慮 `seriesId: big-bass`；原作 `installment` 留空，因系列並非單純數字順序。

結構化資料：

| 欄位 | 已核對值／狀態 |
|---|---|
| 主要 RTP | 官方公開頁／發布稿未提供，保持空白 |
| RTP 版本 | 未找到官方公開版本表，保持空白 |
| 原廠波動度 | 官方公開頁／發布稿未提供，保持空白 |
| 統一波動度 | 保持空白 |
| 最高倍數 | 官方頁只說 Bonus Game 的 Money symbol value 可到 2,000×；不是已確認整局 max win，故 `maxWinMultiplier` 留空 |
| 軸 × 列 | 5 × 3 |
| 官方中獎機制原文 | 公開遊戲頁／發布稿未明載 paylines、ways 或 pays-anywhere，保持空白 |
| Ways／Paylines 數量 | 官方一級來源未確認，保持空白 |
| Bonus Buy | 官方公開原作頁未確認，保持空白 |
| 發行日期 | 2020-12-14 |
| 投注範圍 | 官方公開來源未提供，保持空白 |
| Game ID | 未提供，保持空白 |

Mechanism 與 Features：

- 不用後續 Big Bass 作品的 10/12 paylines 回填原作。
- 官方原始 Feature：`Bass Scatter symbols`、`Bonus Round`、`Fisherman acts as a wild`、`money symbols`、`money collect feature`、`dynamite`、`Free Spins`、`retrigger`、`multipliers`。
- 現有共用 Feature：Scatter、Free Spins、Wild、Cash Collection、Multiplier。
- 可能的新共用 Feature：Retrigger（目前 enum 沒有）；但先保留原文，等更多樣本。
- 遊戲專屬功能：Fisherman level-up／Dynamite symbol replacement；不需新增 enum。

圖片：

- 官方縮圖：[Big Bass Bonanza EN 339×180](https://www.pragmaticplay.com/wp-content/uploads/2020/11/Big-Bass-Bonanza%E2%84%A2_EN_339x180_04.png)
- 官方 CDN、339×180 橫式縮圖，含完整遊戲 Logo；可作卡片主圖，注意不可誤用其他 Big Bass 續作圖片。

Schema／taxonomy 對照：

- 可直接承接：雙語名稱、別名、系列、5×3、features、releaseDate、sources、圖片。
- 可留空：RTP、波動度、最高倍數、win mechanism、winCount、Bonus Buy、投注、gameId、jackpotType。
- 需保留原廠文字：Pragmatic Play × Reel Kingdom partnership、Money symbol value up to 2,000×、Dynamite、Fisherman progression。
- Provider 判讀：現階段可由現有單值 `provider` 指向 Pragmatic Play，Reel Kingdom 的合作關係保留在來源與原廠文字中。
- 這項合作關係暫時不構成修改 `provider` 欄位的必要 Schema gap；沒有更明確的開發權責證據前，也不建立第二 Provider 或共同開發商關係。
- Provider 關係本身不應阻止 Big Bass Bonanza 進入草稿審查；Mechanism、RTP、波動度等缺值應依各自證據分開判斷。

## 5. 欄位取得率

「取得」只計官方／可靠來源已能支持的值；部分取得另列，不把推測算入。

| 欄位 | 完整取得 | 取得率 | 備註 |
|---|---:|---:|---|
| 正式英文名稱 | 6/6 | 100% | 全部有官方遊戲頁 |
| 開發／供應身份 | 5/6 | 83% | Big Bass 參與方明確，但 developer/publisher 細分未明 |
| 官方來源 | 6/6 | 100% | 每款至少一個官方遊戲頁或規則／發布稿 |
| 官方 canonical Game ID | 0/6 | 0% | PG 有 gid/pgid，但 namespace 語意未文件化 |
| 建議 slug | 6/6 | 100% | 編輯層穩定 slug，不是官方欄位 |
| 與現有 12 款重複檢查 | 6/6 | 100% | 均不重複 |
| 官方繁中名稱 | 0/6 | 0% | 找到的是官方簡中市場名稱，不冒充繁中 |
| 廠商中文市場名稱 | 6/6 | 100% | PG 簡中規則 3；Pragmatic 中國站 3 |
| 可提出繁中編輯名稱 | 6/6 | 100% | 皆需保留英文原名；部分有競爭譯名 |
| 正式系列／品牌家族證據 | 5/6 | 83% | 除 Fortune Tiger 外；只有 Mahjong pair 可安全填代數 |
| 主要 RTP | 3/6 | 50% | PG 3；Pragmatic 官方公開頁未列 |
| 完整 RTP 版本表 | 3/6 | 50% | 三款 PG 均為多版本 RTP |
| 原廠波動度 | 5/6 | 83% | Big Bass 缺 |
| 可映射統一波動度 | 5/6 | 83% | Gates 的 highly volatile 映射規則需團隊一致 |
| 已確認整局最高倍數 | 4/6 | 67% | PG 3＋Sweet；Gates/Big Bass 公開值不是整局 max win |
| 盤面結構 | 5/6 | 83% | Gates 有 5×6／six reels 方向語意歧義 |
| 可確認主要中獎機制 | 4/6 | 67% | PG 3＋Sweet；Gates 多描述衝突、Big Bass 一級來源未明載 |
| 可安全填 winCount | 3/6 | 50% | 1,024 ways、2,000 ways、5 lines |
| Bonus Buy 狀態 | 0/6 | 0% | 未提及不等於「無」 |
| 官方發行日期 | 3/6 | 50% | Pragmatic 3；PG `ct` 不當 release date |
| 預設投注範圍 | 3/6 | 50% | PG 3，且均帶 EUR/default 語意 |
| 官方原始 Feature 詞彙 | 6/6 | 100% | 皆有可追溯官方描述 |
| 官方主圖／作品圖 URL | 6/6 | 100% | PG 官方 assets＋Pragmatic 官方 339×180 縮圖 |
| 資料來源與核對日期 | 6/6 | 100% | 本報告已保存 |

補充統計：

- 官方繁中名稱取得率：0/6（0%）。
- 廠商中文市場名稱取得率：6/6（100%），但全是簡中市場來源。
- 官方圖片取得率：6/6（100%）。
- 多版本 RTP 出現數：3 款，皆為 PG SOFT。
- 系列／品牌家族證據取得率：5/6（83%）；可安全填 `installment` 的只有 Mahjong Ways 兩款（2/6，33%）。
- 無可靠量化台灣搜尋量：6/6。

## 6. 新 Mechanism／Feature 詞彙

### Mechanism 候選

- `Pay Anywhere`：Sweet Bonanza 有明確系列回溯證據；Gates of Olympus 的官方發布稿也出現此詞，但與另外兩種描述混在一起，不能把兩款視為同等明確的分類證據。
- `Scatter Pays`：本批官方來源未直接用來描述這六款；不可因有 Scatter symbol 自動套用。
- `Tumbling`：本批作為 Feature／盤面連鎖行為，與現有 `cascading` 是否同義映射需寫明規則。
- `Ways to Win`：Mahjong Ways 兩款可直接映射現有 `ways-to-win`。
- Gates 的 `20 paylines`＋`Pay Anywhere`＋`clusters of eight or more`：目前只證明官方發布稿描述混合或矛盾，尚不足以證明多個主要 Mechanism 並存；需用正式規則／Paytable 補證。

### Feature 候選

- 跨多款重複、值得審查：`retrigger`（Mahjong free spins、Big Bass bonus/free spins 都有再觸發語意，但現 enum 尚無專屬值）。
- 可映射既有：Tumbling/Cascading、Free Spins、Wild、Scatter、Multiplier、Respins、Cash Collection。
- 單款／遊戲專屬，暫不升格：Gold Plated Symbols、Golden Mahjong Symbols、Fortune Tiger Feature、progressive global multiplier、Fisherman level-up、Dynamite symbol replacement。
- 行銷／數值用語，不應作 Feature：Theoretical Maximum Win、Max Exposure、Advertised Max Win、highly volatile。

## 7. Schema 與 taxonomy 缺口總結

### 跨多款重複，值得進架構審查

1. **Mechanism enum 缺 Pay Anywhere／Scatter Pays**：Sweet 有明確 Pay Anywhere 訊號；Gates 的發布稿則有混合描述，需取得更高權重證據後才能判斷。此批不授權把 `winMechanism` 改為陣列。
2. **原廠機制文字沒有專屬欄位**：藍圖要求先保留官方原文，但現有 schema 只能用 `bonusFeatures` 或來源說明間接保存。
3. **投注缺幣別與語意**：PG 三款都是「Default EUR min/max」；現有 `minBet/maxBet` 純數字會失去幣別、default 與市場版本資訊。
4. **Game ID 缺 namespace**：PG 同時有 `gid`、`pgid`；其他廠商／監管平台也可能有不同 ID。單一 `gameId` 無法說明來源系統。
5. **系列不一定等於數字代數**：Sweet、Gates、Big Bass 都有正式系列，但原作不一定應填 installment 1；現有欄位可留空，暫不必修改。

### 目前只出現一次，不值得立即修改

1. Mahjong Ways 2 的部分軸額外一列；可先保存原廠 layout 描述，不急著新增複雜 reel schema。
2. Mahjong Ways 2 同時有 Max Exposure 與 Advertised Max Win；先保留原標籤，不急著建立倍數版本陣列。
3. Gates 的 5×6／six reels 方向歧義；先保留 raw layout text，等更多來源／樣本。
4. Big Bass 的 Pragmatic Play × Reel Kingdom 關係目前可用 Pragmatic Play 作主要 Provider、Reel Kingdom 作合作方線索，不構成立即修改 provider schema 的理由。
5. 同符號中獎門檻（8–12+／8–30）目前只在兩款 Pay Anywhere 遊戲出現，可先保留原文，暫不新增欄位。

### 不需要因本批立即修改

- 現有名稱、繁中顯示名、別名、系列 ID、系列名稱、代數與相關遊戲欄位可承接本批命名需求。
- `rtpVariants` 可承接 PG 多 RTP。
- `volatilityOriginal`＋`volatilityNormalized` 可承接原廠與統一值。
- 現有 Features 已覆蓋大部分共用能力；不應用 `other` 掩蓋遊戲專屬差異。

## 8. 六款最終判定

| 遊戲 | 主要結果 | 核心理由 |
|---|---|---|
| Mahjong Ways | `ELIGIBLE_FOR_PUBLISH_REVIEW` | 身份、官方規則、中文市場名稱、系列、RTP variants、圖片均完整；正式建立前仍需 Provider 授權與繁中編輯確認 |
| Mahjong Ways 2 | `ELIGIBLE_FOR_PUBLISH_REVIEW` | 官方續作關係與代數清楚，結構化資料及圖片完整；不規則列與雙 max-win 標籤需原文保存 |
| Fortune Tiger | `ELIGIBLE_FOR_PUBLISH_REVIEW` | 身份、規則、RTP variants、圖片完整；沒有系列證據，發行日與 canonical Game ID 留空 |
| Sweet Bonanza | `ELIGIBLE_FOR_DRAFT` | 身份、官方中文市場名、系列、玩法、日期與圖片足夠；官方公開 RTP／投注資料缺，Pay Anywhere taxonomy 尚待審查 |
| Gates of Olympus | `TAXONOMY_DECISION_NEEDED` | 官方發布稿同時出現 Pay Anywhere、clusters、20 paylines 的混合／矛盾描述；需正式規則或 Paytable 才能分類，本輪不據此改陣列 |
| Big Bass Bonanza | `ELIGIBLE_FOR_DRAFT` | 主要 Provider 可暫判 Pragmatic Play，Reel Kingdom 保留合作方線索；缺值可留空，Provider 關係本身不阻止草稿審查 |

## 9. 是否阻礙下一步

- **不阻礙繼續做資料驗證或準備草稿規格**：六款身份都成立，沒有重複、冒名或應直接替換的候選。
- **阻礙直接分類 Gates of Olympus Mechanism**：需先取得正式規則頁、遊戲內 Paytable 或更高權重證據；現有混合文案不足以證明三個並列 Mechanism，也不構成把欄位改為陣列的授權。
- **Big Bass Bonanza 的 Provider 關係不構成阻礙**：草稿可暫以 Pragmatic Play 為主要 Provider，Reel Kingdom 保存為合作方線索；Mechanism、RTP、波動度等缺值各自判斷，未來若取得明確權責證據再重新審查。
- PG SOFT 與 Pragmatic Play Provider 尚未存在；建立任何 Game Collection 檔前需另行授權建立並核對 Provider，但這不是本輪修改事項。
- 其餘缺值可依藍圖留空，不構成停止後續工作的理由。

## 10. 本輪變更邊界

本輪預期 Git diff 僅新增本報告：

`slothub-site/docs/first-six-games-readonly-validation.md`

沒有修改藍圖、Schema、taxonomy、enum、程式、Provider、Game Collection、圖片、頁面或部署設定。
