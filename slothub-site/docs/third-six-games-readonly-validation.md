# 第三批六款遊戲只讀驗證

> **READ-ONLY VALIDATION**
>
> 狀態：依 `APPROVED v1` 產品藍圖與 `APPROVED v1` 遊戲收錄閉環工作流完成的 `READONLY_VALIDATION` 報告。
>
> 本報告不是建立或發布 Game／Provider 的授權，也不構成修改 Schema、taxonomy、圖片或網站的授權。本輪只新增本報告；未建立 Provider、Game 或圖片，未 Build、Commit、Push 或部署。
>
> 資料核對日期：2026-08-29（Asia/Taipei）

## 1. 驗證方法與邊界

- 精確數值優先採廠商官方遊戲頁、規則／Paytable、Client／Operator 資料與正式發布稿。
- 官方中文市場名稱、台灣市場常見名稱與 Slot Hub 編輯譯名分開記錄；沒有官方名稱時不把編輯譯名冒充官方名稱。
- 第三方頁面只作台灣命名訊號或尋找官方來源的線索，不用來確認 RTP、波動度、最高倍數等精確事實。
- `winMechanism` 記錄一般中獎組合成立規則；Cascading、Avalanche、Free Spins、Multiplier 與品牌化 Bonus 屬 Feature。
- `winCount` 只保存賠線或 Ways 等可比較數量；最少群集符號數、最低相同符號門檻不寫入 `winCount`。
- 官方沒有提供的值保持空白；可判讀且已完整保存的非核心來源差異，不阻止同一階段繼續。

## 2. 重複檢查

已逐筆對照現有 24 款 published Game。六款均沒有相同正式身份或相同 slug；亦不是現有作品的語言、RTP 或平台別名。

| 候選 | 建議 slug | 與現有 24 款重複 |
|---|---|---|
| Jump High | `jump-high` | 否 |
| Super Ace | `super-ace` | 否；JILI 另有 Super Ace 2／Deluxe 等獨立作品 |
| Bonanza | `bonanza` | 否；不可與 Big Bass Bonanza 混淆 |
| Gonzo’s Quest | `gonzos-quest` | 否 |
| Legacy of Dead | `legacy-of-dead` | 否；與現有 Book of Dead 同屬官方 Dead Series，但不是同一作品 |
| Reactoonz | `reactoonz` | 否 |

## 3. Jump High／跳高高

### 3.1 身份、名稱與 Provider

| 項目 | 核對結果 |
|---|---|
| 正式英文名稱 | `Jump High` |
| 官方中文市場名稱 | `跳高高`；CQ9 Gaming 官方中文新聞直接使用《跳高高 Jump High》。字形可直接用於繁中顯示。 |
| 台灣常見名稱／aliases | `跳高高`、`Jump High`；無可靠量化搜尋量。 |
| 建議繁中顯示名稱 | `跳高高` |
| 實際開發商／Provider | CQ9 Gaming；官方目錄與品牌新聞均將作品列為 CQ9 自有遊戲。 |
| 建議 Provider slug | `cq9-gaming` |
| Game ID | 未從目前公開官方資料取得。 |

主要官方來源：

- [CQ9 Gaming 官方中文品牌新聞](https://www.cq9gaming.com/cn/news/detail/948)
- [CQ9 Gaming 官方英文品牌新聞](https://www.cq9gaming.com/news/detail/949)
- [CQ9 Gaming 官方遊戲目錄](https://site.cq9gaming.com/en/games)
- [CQ9 Gaming 官方 About](https://www.cq9gaming.com/about)

### 3.2 系列與版本

- 官方目錄另有 Jump Higher、Rave Jump 等不同作品，但本輪沒有找到 CQ9 把它們與 Jump High 定義為同一正式系列或數字代數的證據。
- `Jump High` 應先作獨立作品；`seriesId`、`installment`、`relatedGames` 留空。
- 名稱中的 Jump 不足以建立系列關係。

### 3.3 結構化資料

| 欄位 | 核對值 | 官方原始標籤／處理 |
|---|---|---|
| 主要 RTP／RTP variants | 未取得 | 官方公開目錄與新聞未提供。 |
| 原廠／統一波動度 | 未取得 | 不從「高倍率獎勵」文案推定波動度。 |
| 整局最高倍數 | 未取得 | 官方只描述 high-multiplier rewards，沒有可保存的精確整局倍數。 |
| 盤面 | 未取得 | 不從第三方畫面推測 reels／rows。 |
| Mechanism | `Ways to Win` | 官方原文 `243 Ways mechanic`／`243 Ways 全盤聯機機制`；可映射 `ways-to-win`。 |
| winCount | `243` | 官方明確數量。 |
| Features | Free Game、累積 Multiplier | 可映射既有 `free-spins`、`multiplier`；官方原文保存於 `bonusFeatures`。 |
| Bonus Buy | 未確認 | 留空。 |
| 發行日期 | 未取得 | 2026-06-26 是品牌新聞日期，不是遊戲發行日。 |
| Game ID | 未取得 | 留空。 |

### 3.4 官方圖片來源

- 官方目錄縮圖：`https://images.hfyali.com/cherry/icon/PCddPyrH.png`
- 來源頁：[CQ9 Gaming 官方遊戲目錄](https://site.cq9gaming.com/en/games)
- 本輪只確認該縮圖在官方目錄中緊鄰 Jump High 條目；尚未下載，也尚未進行尺寸、完整 Logo、裁切或卡片用途審查。

### 3.5 Schema／taxonomy 判斷

- 現有 Schema 可承接名稱、aliases、Provider、`ways-to-win`、243、Features、來源與圖片。
- RTP、波動度、最高倍數、盤面、日期與 Game ID 是資料缺值，不是架構缺口。
- 新 CQ9 Provider 可由現有 Provider Schema 建立；本輪不建立。

```text
STAGE_RESULT: PASS_TO_NEXT_STAGE
CURRENT_STATE: ELIGIBLE_FOR_DRAFT
NEXT_ALLOWED_ACTION: 經本報告內容審查後，建立 CQ9 Gaming Provider draft、Jump High Game draft，並準備已核對的官方圖片；所有狀態維持 draft。
FILES_ALLOWED_TO_CHANGE: src/content/providers/cq9-gaming.md；src/content/games/jump-high.md；public/assets/games/jump-high.*；必要的本批資料報告
COMMIT_ALLOWED: ONLY_WITH_EXPLICIT_APPROVAL
PUSH_ALLOWED: NO
DEPLOY_ALLOWED: NO
HUMAN_APPROVAL_REQUIRED: YES；先核准本報告內容及進入 Provider／Game draft 階段
```

## 4. Super Ace／超級王牌

### 4.1 身份、名稱與 Provider

| 項目 | 核對結果 |
|---|---|
| 正式英文名稱 | `Super Ace` |
| 官方中文市場名稱 | `超級王牌`；原作官方頁標題仍為英文，但 JILI 官方 Super Ace 2 頁在描述原作時直接使用「超級王牌」，可作官方中文市場用法。 |
| 台灣常見名稱／aliases | `超級王牌` 有一致定性訊號；建議 aliases：`Super Ace`、`超級王牌`、`超级王牌`。無可靠量化搜尋量。 |
| 建議繁中顯示名稱 | `超級王牌` |
| 實際開發商／Provider | JILI Games；官方產品頁及官方目錄確認。 |
| 建議 Provider slug | `jili-games` |
| Game ID | 官方產品頁 URL 的 `PlusIntro/49` 是頁面識別線索，官方未宣稱為跨平台 Game ID，不直接填入 `gameId`。 |

主要官方來源：

- [JILI 官方 Super Ace 遊戲頁](https://jiligames.com/PlusIntro/49?showGame=true)
- [JILI 官方遊戲目錄](https://jiligames.com/games/)
- [JILI 官方 Super Ace 2 頁（原作中文市場名稱與續作關係）](https://jiligames.com/PlusIntro/542?showGame=true)

### 4.2 系列與版本

- JILI 官方存在 Super Ace 2，且其描述明確說明保留「超級王牌」原作玩法並新增 Stacked Golden Joker，足以證明原作與 2 的直接作品關係。
- Super Ace Deluxe、Super Ace Scratch、3 Super Ace 等亦是官方目錄中的不同作品，不是原作語言或 RTP 別名。
- 依內容審查定案使用 `seriesId: super-ace`；原作 `installment` 留空，避免把編輯順序冒充官方代數。

### 4.3 結構化資料

| 欄位 | 核對值 | 官方原始標籤／處理 |
|---|---|---|
| 主要 RTP／RTP variants | 未取得 | 官方公開產品頁未列 RTP。 |
| 原廠波動度 | `LOW-MED` | 原文保存。現有 normalized enum 沒有 low-medium；先讓 `volatilityNormalized` 留空，不強塞 `medium`。 |
| 整局最高倍數 | `10,000×` | 官方原始標籤 `MAX WIN 10000x`；可作 Slot Hub 統一比較值。 |
| 盤面 | 未從原作頁確認 | 官方原作頁沒有明列 reels／rows；不套用續作或第三方盤面。 |
| Mechanism | `Ways to Win` | 官方區塊標題寫 `Paylines`，值卻是 `1024 ways`。標題與值都需保存；標準分類採 `ways-to-win`。 |
| winCount | `1024` | 官方 `1024 ways`。 |
| Features | Free Game、Free Spin、Multiplier、連續消除、Golden Card／Golden Joker | `free-spins`、`multiplier` 可直接承接；連續消除可映射 `cascading`，品牌原詞保留於 `bonusFeatures`。 |
| Bonus Buy | 未確認 | 留空。 |
| 發行日期 | `2020.08`（月精度） | 官方 `Publish Time 2020.08`；現有日期欄若必須有日，不可虛構 1 日，草稿先在來源／摘要保留原文。 |
| Game ID | 未確認 | 留空。 |

### 4.4 官方圖片來源

- 官方作品圖候選：`https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/7ycivbeSFZ2FzMIi4UfVi4vfmALw2iwP3gEaCsmO.png`
- 來源頁：[JILI 官方 Super Ace 遊戲頁](https://jiligames.com/PlusIntro/49?showGame=true)
- 本輪未下載；後續仍需核對完整 Logo、原始尺寸與卡片比例。

### 4.5 Schema／taxonomy 判斷

- 現有 Schema 可承接正式名稱、中文名、aliases、Provider、最高倍數、Ways、Features、來源及圖片；Golden Joker 的替代規則未由目前官方文字明確定義，因此只保留品牌原文，不先映射 Wild。
- `LOW-MED` 無精確 normalized 值、`2020.08` 無日精度，是資料正規化限制；保存原文並留空標準欄即可，不阻止 draft，也不構成本輪 taxonomy 修改理由。
- 官方 UI 的 `Paylines` 標題與 `1024 ways` 值有可判讀差異；值直接定義 Ways，完整保存後可在同一階段處理。
- 新 JILI Provider 可由現有 Provider Schema 建立；本輪不建立。

```text
STAGE_RESULT: PASS_TO_NEXT_STAGE
CURRENT_STATE: ELIGIBLE_FOR_DRAFT
NEXT_ALLOWED_ACTION: 經本報告內容審查後，建立 JILI Games Provider draft、Super Ace Game draft及官方圖片；保留 LOW-MED、2020.08 與 Paylines／1024 ways 原始語意。
FILES_ALLOWED_TO_CHANGE: src/content/providers/jili-games.md；src/content/games/super-ace.md；public/assets/games/super-ace.*；必要的本批資料報告
COMMIT_ALLOWED: ONLY_WITH_EXPLICIT_APPROVAL
PUSH_ALLOWED: NO
DEPLOY_ALLOWED: NO
HUMAN_APPROVAL_REQUIRED: YES；先核准本報告內容及進入 Provider／Game draft 階段
```

## 5. Bonanza

### 5.1 身份、名稱與 Provider

| 項目 | 核對結果 |
|---|---|
| 正式英文名稱 | `Bonanza` |
| 官方中文市場名稱 | 未找到 Big Time Gaming 官方中文標題；官方頁支援 `zh_TW` 語言不等於官方名稱已公開。 |
| 台灣常見名稱／aliases | 英文 `Bonanza` 與描述性 `Bonanza Megaways` 並存；沒有足夠一致的繁中名稱。依內容審查定案只顯示英文；`Bonanza Megaways` 可保存為英文搜尋 alias，不把它標成另一款作品。 |
| 實際開發商／Provider | Big Time Gaming（BTG）；官方遊戲頁與 About 明確確認。 |
| 建議 Provider slug | `big-time-gaming` |
| Game ID | 未從公開官方頁取得。 |

主要官方來源：

- [Big Time Gaming 官方 Bonanza 遊戲頁](https://www.bigtimegaming.com/games/bonanza)
- [Big Time Gaming 現行產品資料頁](https://beta.bigtimegaming.com/games/bonanza)
- [Big Time Gaming 官方 About](https://www.bigtimegaming.com/about)

### 5.2 系列與版本

- 官方把 Bonanza 描述為 2016 年推出、奠定 Megaways 代表性的原作。
- 官方另有 Christmas Bonanza 等衍生作品，但目前採用的官方資料不足以把所有同名作品直接定義為單一數字系列。
- `seriesId`、`installment` 暫留空；Bonanza 與 Big Bass Bonanza 沒有作品關係。

### 5.3 結構化資料

| 欄位 | 核對值 | 官方原始標籤／處理 |
|---|---|---|
| 主要 RTP | `96.11%` | BTG 現行產品頁 `RTP`。 |
| RTP variants | 未確認 | 目前官方頁只確認一個值。 |
| 原廠波動度 | 結構化欄位未提供 | 官方文案使用 `volatile`／`high-volatility thrill ride`，但不是產品 stat 值；可保存原文，`volatilityNormalized` 先留空。 |
| 整局最高倍數 | `26,000×` | 官方 `Max payout 26 000 x bet`；可作統一比較值。 |
| 盤面 | 6 軸，單軸 2–7 個符號，另有 reels 2–5 上方 carts | 官方 stat 顯示 `6x7`，機制說明則證明高度動態；不可當成固定 6×7。`reels` 保存完整原文，`rows` 留空。 |
| Mechanism | `Megaways` | 官方 patented Megaways；可映射 `megaways`。 |
| winCount | 留空 | 原文 `up to 117,649 ways to win` 是動態最大值而非固定每轉數量。草稿暫不填 `winCount: 117649`，避免現有純數字比較顯示讓使用者誤解為固定 Ways；改以現有自由文字欄位保存「最多 117,649 種動態贏法」及官方 `up to` 原文。 |
| Features | Dual Reactions™、Cascading、Free Spins、Scatter、Multiplier、Retrigger、Bonus Buy | Cascading／Free Spins／Scatter／Multiplier／Bonus Buy 可用既有結構；Dual Reactions™ 原文放 `bonusFeatures`。 |
| Bonus Buy | 有 | 官方 `Feature buy-in: Yes`；可用 90× stake 購買 12 Free Spins。 |
| 發行日期 | `2016-12-07` | 官方現行產品資料頁。 |
| 投注範圍 | €0.20／€20.00 | 官方 `Min/Max bet`；只保存在來源或原始說明，不填現有 `minBet`／`maxBet`，避免遺失 EUR 幣別語意。 |
| Game ID | 未取得 | 留空。 |

### 5.4 官方圖片來源

- 官方橫式作品圖：`https://images.squarespace-cdn.com/content/v1/60aedd95a74c4c4033f9d064/1624241048032-Y1JGMZ3I0U9BM5DBV981/Bonanza_Rectangular_1600x755.jpg`
- 官方頁另提供 Base Game、Free Spins、Game Stats 與 Marketing Pack 素材。
- 來源頁：[Big Time Gaming 官方 Bonanza 遊戲頁](https://www.bigtimegaming.com/games/bonanza)
- 本輪未下載或轉檔；後續需確認圖上完整 Logo 與卡片裁切。

### 5.5 Schema／taxonomy 判斷

- 現有 `megaways`、`reels` 字串、Features、Bonus Buy、RTP、最高倍數及日期足以建立安全 draft。
- 動態 2–7 symbols per reel 不能精確放入單一 `rows`，但 `reels` 原文＋`rows` 留空可完整保存，不需先改 Schema。
- `winCount` 暫時留空；「最多 117,649 種動態贏法」與 `up to 117,649 ways to win` 保存於現有自由文字欄位，避免純數字比較畫面把上限誤解成固定值。
- EUR 投注上下限只保存於來源或原始說明，不寫入缺少幣別語意的 `minBet`／`maxBet`。
- 新 Big Time Gaming Provider 可由現有 Provider Schema 建立；可保存 Evolution 2021 收購關係，但不可把 Evolution 當本作 Provider。

```text
STAGE_RESULT: PASS_TO_NEXT_STAGE
CURRENT_STATE: ELIGIBLE_FOR_DRAFT
NEXT_ALLOWED_ACTION: 經本報告內容審查後，建立 Big Time Gaming Provider draft、Bonanza Game draft及官方圖片；動態盤面與 117,649 上限必須保留原始語意。
FILES_ALLOWED_TO_CHANGE: src/content/providers/big-time-gaming.md；src/content/games/bonanza.md；public/assets/games/bonanza.*；必要的本批資料報告
COMMIT_ALLOWED: ONLY_WITH_EXPLICIT_APPROVAL
PUSH_ALLOWED: NO
DEPLOY_ALLOWED: NO
HUMAN_APPROVAL_REQUIRED: YES；先核准本報告內容及進入 Provider／Game draft 階段
```

## 6. Gonzo’s Quest

### 6.1 身份、名稱與 Provider

| 項目 | 核對結果 |
|---|---|
| 正式英文名稱 | `Gonzo’s Quest™`；官方頁標題 URL 顯示 `Gonzo's Quest`，商標文案使用彎引號。 |
| 官方中文市場名稱 | 未找到 NetEnt 官方繁中名稱。 |
| 台灣常見名稱／aliases | 台灣頁面可追溯到互相競爭的低信心譯名，但無可靠搜尋量或固定官方用法。依內容審查定案只顯示英文，不加入低信心 aliases `龔佐的探險`、`貢佐尋寶`。 |
| 實際開發商／Provider | NetEnt；現有 published Provider 可直接關聯。 |
| Game ID | 未從目前公開官方產品欄位取得。 |

主要官方來源：

- [NetEnt 現行 Gonzo’s Quest 官方遊戲頁](https://netent.com/games/gonzos-quest/)
- [NetEnt 官方 Gonzo 系列回顧](https://netent.com/posts/gonzo-the-quest-so-far)
- [NetEnt 官方 Gonzo’s Quest II 頁](https://netent.com/games/gonzo-s-quest-ii-return-to-el-dorado)
- [NetEnt 官方 Gonzo’s Gold 系列發布資料](https://old.netent.com/en/netent-unveils-gonzos-gold-the-latest-addition-in-its-gonzo-series/)

### 6.2 系列與版本

- NetEnt 官方明確使用 `Gonzo series`，並記錄 Gonzo’s Quest Megaways、Gonzo’s Gold 及 Gonzo’s Quest II: Return to El Dorado。
- 依內容審查定案使用 `seriesId: gonzos-quest`，不填 `installment`，也不需新增 Series Collection。
- 官方 `II` 證明續作關係，但原作本身沒有以 `1` 命名；`installment` 可留空。

### 6.3 結構化資料與 Avalanche 判斷

| 欄位 | 核對值 | 官方原始標籤／處理 |
|---|---|---|
| 主要 RTP | `95.97%` | 官方 `RTP`。 |
| RTP variants | 未確認 | 目前官方頁只確認一個值。 |
| 原廠／統一波動度 | 未取得 | 官方 stat 的 Volatility 欄為空；41.00% 是 Hit Frequency，不得誤填波動度。 |
| 整局最高倍數 | `2,200×` | 官方 `Max payout 2 200 x bet`。 |
| 盤面 | 5×3 | 官方 `Reels/Rows`。 |
| Mechanism | `Paylines` | 官方明確說明 winning combination forms `on a payline`，並列 `Play lines max 20`；可映射 `paylines`。 |
| winCount | `20` | 官方最大賠線數。 |
| Features | Avalanche™、Avalanche Win Multiplier、Wild、Scatter、Free Fall／Free Spins、Retrigger | Avalanche™ 是中獎後符號消失並由新符號向下補位的 Feature，可映射 `cascading`；它不取代 Paylines 作主要得獎判定。 |
| Bonus Buy | 未確認 | `Bonus mode: Yes` 不等於 Bonus Buy；頁面未提供可採用的 Feature buy 值。 |
| 投注範圍 | €0.20／€50.00 | 只保存在來源或原始說明，不填現有 `minBet`／`maxBet`，避免遺失 EUR 幣別語意。 |
| 發行日期 | `2010-03-15` | 官方頁。 |
| Game ID | 未取得 | 留空。 |

**Avalanche 結論：**基礎中獎機制是 20 Paylines；Avalanche™ 是每次中獎後的清除／補位連鎖 Feature，映射既有 `cascading`。不需要新 Mechanism，也不需要多 Mechanism Schema。

### 6.4 官方圖片來源

- 官方遊戲頁提供 `Assets & embeddings`、作品圖及 Free Fall Feature 圖：[NetEnt 官方 Gonzo’s Quest 頁](https://netent.com/games/gonzos-quest/)。
- 本輪未取得可穩定回讀的獨立作品圖 URL，因此後續圖片階段應從官方 Assets 介面重新解析，不使用搜尋圖片或第三方截圖。

### 6.5 Schema／taxonomy 判斷

- 現有 Schema 可承接 RTP、最高倍數、5×3、20 Paylines、Features、日期、來源與系列。
- Avalanche™ 可同時保存原廠名稱於 `bonusFeatures` 並映射既有 `cascading`；不是 taxonomy gap。
- EUR 投注上下限只保存於來源或原始說明，不寫入缺少幣別語意的 `minBet`／`maxBet`。
- 官方繁中名、波動度、Game ID 與穩定直連圖片是資料缺值，不阻止建立 draft。

```text
STAGE_RESULT: PASS_TO_NEXT_STAGE
CURRENT_STATE: ELIGIBLE_FOR_DRAFT
NEXT_ALLOWED_ACTION: 經本報告內容審查後，建立 Gonzo’s Quest Game draft並從 NetEnt 官方 Assets 介面準備圖片；Provider 使用既有 netent，Avalanche 映射 Cascading。
FILES_ALLOWED_TO_CHANGE: src/content/games/gonzos-quest.md；public/assets/games/gonzos-quest.*；必要的本批資料報告
COMMIT_ALLOWED: ONLY_WITH_EXPLICIT_APPROVAL
PUSH_ALLOWED: NO
DEPLOY_ALLOWED: NO
HUMAN_APPROVAL_REQUIRED: YES；先核准本報告內容、繁中主名處理與進入 Game draft 階段
```

## 7. Legacy of Dead

### 7.1 身份、名稱與 Provider

| 項目 | 核對結果 |
|---|---|
| 正式英文名稱 | `Legacy of Dead` |
| 官方中文市場名稱 | 未找到 Play’n GO 官方中文名稱。 |
| 台灣常見名稱／aliases | 未找到足以定案的固定繁中名稱。依內容審查定案只顯示英文，不加入低信心 aliases `亡者遺產`、`死亡傳承`。 |
| 實際開發商／Provider | Play’n GO；現有 published Provider 可直接關聯。 |
| Game ID | 官方公開產品頁未提供。 |

主要官方來源：

- [Play’n GO 官方 Legacy of Dead 遊戲頁](https://www.playngo.com/games/legacy-of-dead)
- [Play’n GO 官方 Dead Series 說明](https://www.playngo.com/posts/why-is-the-dead-series-so-popular)
- [Play’n GO 官方 Dead Series 作品整理](https://www.playngo.com/post/book-of-dead-slots)
- [Play’n GO 官方 Top Dead Series 說明](https://www.playngo.com/post/top-dead-series-slots-play-n-go)

### 7.2 Dead Series 關係

- Play’n GO 官方明確把 Legacy of Dead 列為 Dead Series 作品，並稱它是 Book of Dead 的 follow-up；這不是只靠埃及題材或相似名稱推論。
- 依內容審查定案使用現有 `seriesId: dead-series`、`seriesNameZhHant: Dead Series`，並以現有 `rich-wilde-and-the-book-of-dead` 作 `relatedGames`；不填 `installment`。
- 官方沒有把 Legacy of Dead 標成數字第幾代；`installment` 留空。
- Legacy of Dead 本作沒有 Rich Wilde 主角，不應把 Rich Wilde 角色宇宙當成本作主要系列。

### 7.3 結構化資料與來源差異

| 欄位 | 核對值 | 官方原始標籤／處理 |
|---|---|---|
| 主要 RTP／RTP variants | 未取得 | 官方公開產品與文章未提供可採用值。 |
| 原廠／統一波動度 | 未取得 | 留空。 |
| 整局最高倍數 | 暫不結構化 | 官方產品頁說 `up to 250000 coins`；官方文章另述 5,000×，並在所有 Expanding Symbols 同時作用時提到 25,000×。單位與條件不同，不能在沒有正式 Rules／Paytable 前選一個當 `maxWinMultiplier`。 |
| 盤面 | 5×3 | 官方 Top Dead Series 文章。 |
| Mechanism | `Paylines` | 官方說三個以上 matching symbols on a payline；可映射 `paylines`。 |
| winCount | `10` | 官方 `five reels and ten paylines`。 |
| Features | Tomb Scatter／Wild、Free Spins、Special Expanding Symbol、Retrigger | 可映射 `wild`、`scatter`、`free-spins`；Special Expanding Symbol 保留原文於 `bonusFeatures`。 |
| Bonus Buy | 未確認 | 留空。 |
| 發行日期 | `2020-01-02` | 官方遊戲頁。 |
| Game ID | 未取得 | 留空。 |

最高倍數屬尚待規則文件補證的核心數值差異，但可安全讓欄位留空，並不影響身份、Provider、系列、盤面、Paylines 或草稿可靠性；因此不阻止 draft，發布前需重新審查。

### 7.4 官方圖片來源

- 官方 Logo／作品圖：`https://static.wixstatic.com/media/47c2af_dc35f77081cd4ac9b42c360cf6662a62~mv2.png/v1/fill/w_980,h_194,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/legacyofdead_Logo.png`
- 官方 Hero：Play’n GO 遊戲頁的 `Top-BannersDesktop.jpg`。
- 來源頁：[Play’n GO 官方 Legacy of Dead 遊戲頁](https://www.playngo.com/games/legacy-of-dead)
- 本輪未下載或轉檔；後續應優先選擇同時包含完整遊戲 Logo 與主視覺的官方資產。

### 7.5 Schema／taxonomy 判斷

- 現有 Schema 可承接 Dead Series、5×3、10 Paylines、Features、日期、來源與圖片。
- 250,000 coins、5,000×、25,000× 的差異是需更高權重規則證據的資料問題；把 `maxWinMultiplier` 留空即可，不需要新 Schema。
- Special Expanding Symbol 可保存於 `bonusFeatures`，與現有第二批處理一致；本輪不新增 Feature enum。

```text
STAGE_RESULT: PASS_TO_NEXT_STAGE
CURRENT_STATE: ELIGIBLE_FOR_DRAFT
NEXT_ALLOWED_ACTION: 經本報告內容審查後，建立 Legacy of Dead Game draft及官方圖片；加入 dead-series 關係，但最高倍數維持空白並保留官方差異。
FILES_ALLOWED_TO_CHANGE: src/content/games/legacy-of-dead.md；public/assets/games/legacy-of-dead.*；必要的本批資料報告
COMMIT_ALLOWED: ONLY_WITH_EXPLICIT_APPROVAL
PUSH_ALLOWED: NO
DEPLOY_ALLOWED: NO
HUMAN_APPROVAL_REQUIRED: YES；先核准本報告內容、繁中主名處理與進入 Game draft 階段
```

## 8. Reactoonz

### 8.1 身份、名稱與 Provider

| 項目 | 核對結果 |
|---|---|
| 正式英文名稱 | `Reactoonz` |
| 官方中文市場名稱 | 未找到 Play’n GO 官方繁中名稱。 |
| 台灣常見名稱／aliases | 台灣及中文頁多直接使用 `Reactoonz`，少數翻譯互不一致，無可靠固定繁中名稱或量化搜尋量。依內容審查定案只顯示英文，不加入低信心中文 alias。 |
| 實際開發商／Provider | Play’n GO；現有 published Provider 可直接關聯。 |
| Game ID | 官方公開遊戲頁未提供。 |

主要官方來源：

- [Play’n GO 官方 Reactoonz 遊戲頁](https://www.playngo.com/games/reactoonz)
- [Play’n GO 官方 Reactoonz Series 頁](https://www.playngo.com/series/reactoonz)
- [Play’n GO 官方 Reactoonz 回顧](https://www.playngo.com/posts/reactoonz-review)
- [Play’n GO 官方系列整理](https://www.playngo.com/posts/top-series-slots-at-play-n-go)

### 8.2 系列與版本

- Play’n GO 有正式 `Reactoonz Series` 頁；官方資料說 Energoonz 是前身／prequel，Reactoonz 之後另有 Reactoonz 2、Dr Toonz、Gigantoonz、Reactoonz 100 等作品。
- 依內容審查定案使用 `seriesId: reactoonz`；`installment` 留空，因官方世界觀順序不等於單純數字代數。
- `relatedGames` 可先留空，直到其他系列作品通過收錄，不建立不存在的頁面連結。

### 8.3 結構化資料

| 欄位 | 核對值 | 官方原始標籤／處理 |
|---|---|---|
| 主要 RTP／RTP variants | 未取得 | 官方公開產品頁未提供。 |
| 原廠／統一波動度 | 未取得 | 留空。 |
| 整局最高倍數 | 未取得 | 不從單一 Feature 的 multiplier 敘述推算整局上限。 |
| 盤面 | 7×7 | 官方遊戲頁。`reels: 7x7`、`rows: 7` 可承接。 |
| Mechanism | `Cluster Pays` | 官方明確說 cluster of five or more matching aliens；可映射 `cluster-pays`。 |
| winCount | 留空 | 5 是最小群集符號數，不是賠線／Ways 數量。 |
| Features | Cascading、Wild、Multiplier、oversized aliens／giant symbols、Gargantoon、Quantum Leap、最多五個連鎖 Feature | `cascading`、`wild`、`multiplier`、`giant-symbols` 可承接；品牌詞保留 `bonusFeatures`。 |
| Bonus Buy | 未確認 | 留空。 |
| 發行日期 | `2017-10-23` | 官方遊戲頁。 |
| Game ID | 未取得 | 留空。 |

### 8.4 官方圖片來源

- 官方 Logo：`https://static.wixstatic.com/media/b3ef59_46442516d7194463ae624bbb155eea62~mv2.png/v1/fill/w_826,h_167,al_c,q_85,enc_avif,quality_auto/reactoonz_logo.png`
- 官方 Hero：Play’n GO 遊戲頁的 `Top-BannersDesktop.jpg`。
- 來源頁：[Play’n GO 官方 Reactoonz 遊戲頁](https://www.playngo.com/games/reactoonz)
- 本輪未下載、裁切或轉檔；後續圖片階段需從官方頁資產中選擇含完整 Logo 且適合卡片的作品圖。

### 8.5 Schema／taxonomy 判斷

- 現有 Schema 已有 `cluster-pays`、`cascading`、`wild`、`multiplier`、`giant-symbols`，可安全承接核心資料。
- 最少 5 個 matching symbols 不適合現有 `winCount`；可保留在 `paylines`／摘要／`bonusFeatures` 原文。這是規則細節承接限制，不阻止 draft，且不值得單一樣本立即改 Schema。
- Gargantoon、Quantum Leap、Flux Capacitors 是品牌化 Feature；不因一次出現新增共用 enum。

```text
STAGE_RESULT: PASS_TO_NEXT_STAGE
CURRENT_STATE: ELIGIBLE_FOR_DRAFT
NEXT_ALLOWED_ACTION: 經本報告內容審查後，建立 Reactoonz Game draft及官方圖片；使用 cluster-pays，五符號門檻不填 winCount，品牌化功能保留原文。
FILES_ALLOWED_TO_CHANGE: src/content/games/reactoonz.md；public/assets/games/reactoonz.*；必要的本批資料報告
COMMIT_ALLOWED: ONLY_WITH_EXPLICIT_APPROVAL
PUSH_ALLOWED: NO
DEPLOY_ALLOWED: NO
HUMAN_APPROVAL_REQUIRED: YES；先核准本報告內容及進入 Game draft 階段
```

## 9. 新 Provider 草稿規格（只讀，不建立 Collection）

### 9.1 CQ9 Gaming

| Provider 欄位 | 建議草稿值／處理 |
|---|---|
| slug | `cq9-gaming` |
| name／brandName | `CQ9 Gaming`／`CQ9` |
| aliases | `CQ9`、`CQ9Gaming` |
| roles | `developer`、`publisher`；官方 About 描述自有研發與製作，不標 aggregator。 |
| parentOrganization／subBrands | 留空；本輪未取得可直接結構化資料。 |
| originRegions／serviceMarkets／languages | 留空；不以聯絡地址、網站語言或行銷範圍代替正式資料。 |
| marketTags | 可候選 `asia`、`international`，建立前依現有資料語意審查；不是必填。 |
| gameTypes | `slots`；官方亦有其他遊戲類別，但本批只需 slots。 |
| officialUrl | `https://www.cq9gaming.com/` |
| status | `draft` |

結論：現有 Provider Schema 可直接建立，缺值是資料缺值，不是 Schema gap。

### 9.2 JILI Games

| Provider 欄位 | 建議草稿值／處理 |
|---|---|
| slug | `jili-games` |
| name／brandName | `JILI Games`／`JILI` |
| aliases | `JILI`、`JILI Games`、`吉利電子`（市場 alias，建立前保留來源語意） |
| roles | `developer`、`publisher`；官方遊戲目錄與自有產品頁支持，不標 aggregator。 |
| parentOrganization／subBrands | 留空。 |
| originRegions／serviceMarkets／languages | 留空；官方頁的語言旗標不直接轉成 Provider 支援語言。 |
| marketTags | 可候選 `asia`、`international`；不是必填。 |
| gameTypes | `slots`；其他官方類型可日後獨立核對。 |
| officialUrl | `https://jiligames.com/` |
| status | `draft` |

結論：現有 Provider Schema 可直接建立，沒有必須先改 Schema 的問題。

### 9.3 Big Time Gaming

| Provider 欄位 | 建議草稿值／處理 |
|---|---|
| slug | `big-time-gaming` |
| name／brandName | `Big Time Gaming`／`BTG` |
| aliases | `BTG`、`Big Time Gaming` |
| roles | `developer`、`publisher`；不標 aggregator。 |
| parentOrganization | `Evolution` 或 `Evolution Group`；官方 About 記錄 2021 年被 Evolution 收購，建立時需與現有 Provider 命名一致。 |
| originRegions／serviceMarkets／languages | 留空；不把聯絡地址或 Bonanza 的單款語言清單當 Provider 結構資料。 |
| marketTags | 可候選 `international`。 |
| gameTypes | `slots` |
| officialUrl | `https://www.bigtimegaming.com/` |
| status | `draft` |

結論：現有 Provider Schema 可直接建立；母公司文字可用既有 `parentOrganization`，不會把 Evolution 誤顯示成 Bonanza 的遊戲廠商。

## 10. 欄位取得率

分母均為 6；「取得」表示有符合本輪來源權重的可追溯資料，不表示已寫入 Collection。

| 欄位 | 取得數 | 取得率 | 備註 |
|---|---:|---:|---|
| 正式英文名稱 | 6/6 | 100% | 全部官方確認。 |
| 官方中文市場名稱 | 2/6 | 33.3% | Jump High、Super Ace；後者由官方續作頁回指原作用名。 |
| 台灣名稱／aliases 定性訊號 | 6/6 | 100% | Bonanza、Gonzo、Legacy、Reactoonz 無固定單一繁中主名。 |
| 實際 Provider | 6/6 | 100% | 全部官方確認。 |
| 與現有 24 款重複檢查 | 6/6 | 100% | 全部非重複。 |
| 官方系列／續作證據 | 4/6 | 66.7% | Super Ace、Gonzo、Legacy、Reactoonz；Jump High、Bonanza 不建立系列。 |
| 主要 RTP | 2/6 | 33.3% | Bonanza、Gonzo 取得；其餘四款缺值。 |
| RTP variants | 0/6 | 0% | 本批沒有官方確認的多 RTP 版本。 |
| 原廠波動度 | 1/6 | 16.7% | Super Ace `LOW-MED`；Bonanza 僅有行銷性 high-volatility 文案，不計結構化取得。 |
| 整局最高倍數 | 3/6 | 50% | Super Ace、Bonanza、Gonzo；Legacy 有不同單位／條件的官方描述，暫不算。 |
| 盤面 | 4/6 | 66.7% | Bonanza、Gonzo、Legacy、Reactoonz；Jump High、Super Ace 缺。 |
| 主要 Mechanism | 6/6 | 100% | Ways 2、Megaways 1、Paylines 2、Cluster Pays 1。 |
| Paylines／Ways 數量 | 5/6 | 83.3% | Reactoonz 的 5 是群集門檻，不是 winCount。 |
| Features | 6/6 | 100% | 全部有官方文字。 |
| Bonus Buy 明確值 | 1/6 | 16.7% | Bonanza 有；其餘未確認，Gonzo 的 Bonus mode 不等於 Bonus Buy。 |
| 精確發行日期 | 4/6 | 66.7% | Bonanza、Gonzo、Legacy、Reactoonz；Super Ace 只有年月，Jump High 缺。 |
| 官方 Game ID | 0/6 | 0% | URL／內容頁 ID 不冒充 canonical Game ID。 |
| 官方圖片候選 | 6/6 | 100% | 均有官方頁或官方 CDN 候選；未下載。 |

## 11. Mechanism、Feature 與系列總結

### 11.1 Mechanism

- Jump High：`ways-to-win`，243 Ways。
- Super Ace：官方 UI 標題為 Paylines、值為 1024 ways；按規則值映射 `ways-to-win`，完整保存原文差異。
- Bonanza：`megaways`，最多 117,649 動態 Ways；Dual Reactions／Cascading 是 Feature。
- Gonzo’s Quest：`paylines`，20；Avalanche 是 Cascading Feature。
- Legacy of Dead：`paylines`，10。
- Reactoonz：`cluster-pays`；五個相同符號是最低群集門檻，不是 `winCount`。

本批不需要新 Mechanism enum，也沒有把 `winMechanism` 改為陣列的證據。

### 11.2 Feature 詞彙

| 原廠詞彙 | 遊戲 | 建議承接 |
|---|---|---|
| Accumulating Multiplier in Free Game | Jump High | `free-spins`＋`multiplier`；原文留 `bonusFeatures` |
| Golden Card／Golden Joker、elimination | Super Ace | `cascading`＋`multiplier`；Golden Joker 先保留品牌原文，不推定 Wild |
| Dual Reactions™ | Bonanza | `cascading`；品牌原文保留，不新增 enum |
| Avalanche™ | Gonzo’s Quest | `cascading`；不是 Mechanism |
| Special Expanding Symbol | Legacy of Dead | `bonusFeatures` 原文；沿用既有處理，不新增 enum |
| Flux Capacitors、Gargantoon、Quantum Leap | Reactoonz | `wild`、`giant-symbols`、`multiplier`；品牌原文保留 |

### 11.3 系列

- Super Ace：官方 Super Ace 2 明確回指原作；可建 `super-ace` 關係，不強填原作代數。
- Gonzo’s Quest：官方 Gonzo series 與 Quest II 證據充分；可建系列，不強填原作代數。
- Legacy of Dead：官方明確屬 `dead-series`，可關聯現有 Book of Dead，不填代數。
- Reactoonz：官方有正式 Reactoonz Series 頁；可建 `reactoonz`，不建立系列頁。
- Jump High、Bonanza：本輪不建立正式系列。

## 12. Schema／taxonomy 缺口分級

### 12.1 可由現有 Schema 安全承接

- 六款正式身份、英文名、中文名／aliases、Provider、來源與圖片來源。
- Ways、Megaways、Paylines、Cluster Pays。
- Free Spins、Wild、Scatter、Multiplier、Cascading、Bonus Buy、Giant Symbols 等既有 Feature。
- 既有系列欄位可承接 Super Ace、Gonzo、Dead Series、Reactoonz；不需要系列頁。

### 12.2 資料缺值，不是架構缺口

- Jump High、Super Ace、Legacy of Dead、Reactoonz 的官方 RTP。
- 多數作品的原廠波動度、Bonus Buy、Game ID。
- Jump High／Super Ace 的盤面；Jump High 的發行日期；Super Ace 只有年月。
- Gonzo、Legacy、Reactoonz 的官方繁中名稱。
- Gonzo 官方資產的穩定直連 URL 尚待圖片階段解析。

### 12.3 需要保留原文，但暫不需修改 Schema／taxonomy

1. Super Ace `LOW-MED` 沒有一對一 normalized enum；先保留原文並讓統一值空白。
2. Bonanza 的動態 2–7 symbols per reel 不能用固定 `rows` 表示；`reels` 保存完整原文、`rows` 留空即可。
3. Reactoonz 的 minimum cluster size 不是 `winCount`；可在摘要／規則原文表達。
4. Legacy of Dead 的 250,000 coins、5,000×、25,000× 是不同官方描述與條件；在 Rules／Paytable 補證前不填 `maxWinMultiplier`。
5. 品牌化 Feature 先放 `bonusFeatures`，本批沒有跨多款且定義一致到足以新增 enum 的新詞。

### 12.4 真正阻擋下一步的問題

- 沒有。六款均通過藍圖的最低 draft 門檻：身份、正式英文名、Provider、穩定 slug、至少一個官方來源及重複檢查。
- Legacy of Dead 的最高倍數差異會阻止該欄位在 draft 中填值，但不阻止整筆 draft；發布前再依正式 Rules／Paytable 補證。
- 繁中與系列採內容審查定案：Jump High 顯示「跳高高」且無系列；Super Ace 顯示「超級王牌」、`seriesId: super-ace`；Bonanza 只顯示英文且無系列；Gonzo’s Quest 只顯示英文、`seriesId: gonzos-quest`；Legacy of Dead 只顯示英文、`seriesId: dead-series`；Reactoonz 只顯示英文、`seriesId: reactoonz`；六款均不填代數。

## 13. 整批結論與固定尾段

| 遊戲 | 階段結果 | 下一階段重點 |
|---|---|---|
| Jump High | `PASS_TO_NEXT_STAGE` → `ELIGIBLE_FOR_DRAFT` | 建 CQ9 Provider；RTP／波動度／盤面留空。 |
| Super Ace | `PASS_TO_NEXT_STAGE` → `ELIGIBLE_FOR_DRAFT` | 建 JILI Provider；保留 LOW-MED、2020.08 與 1024 ways 原文。 |
| Bonanza | `PASS_TO_NEXT_STAGE` → `ELIGIBLE_FOR_DRAFT` | 建 BTG Provider；動態盤面與 up to 117,649 不可固定化。 |
| Gonzo’s Quest | `PASS_TO_NEXT_STAGE` → `ELIGIBLE_FOR_DRAFT` | Avalanche 映射 Cascading；圖片由 NetEnt Assets 補取。 |
| Legacy of Dead | `PASS_TO_NEXT_STAGE` → `ELIGIBLE_FOR_DRAFT` | 加入 dead-series；最高倍數留空並保存來源差異。 |
| Reactoonz | `PASS_TO_NEXT_STAGE` → `ELIGIBLE_FOR_DRAFT` | Cluster Pays；五符號門檻不填 winCount。 |

```text
STAGE_RESULT: PASS_TO_NEXT_STAGE
CURRENT_STATE: ELIGIBLE_FOR_DRAFT
NEXT_ALLOWED_ACTION: 等待本報告內容審查；核准後可依本報告建立 CQ9 Gaming、JILI Games、Big Time Gaming Provider drafts，六款 Game drafts及官方圖片，全部維持 status: draft 並執行隔離驗證。
FILES_ALLOWED_TO_CHANGE: 本報告審查期間只允許 docs/third-six-games-readonly-validation.md；取得下一階段明確核准後，才擴及本報告逐款列出的 Provider／Game draft與官方圖片檔。
COMMIT_ALLOWED: ONLY_WITH_EXPLICIT_APPROVAL
PUSH_ALLOWED: NO
DEPLOY_ALLOWED: NO
HUMAN_APPROVAL_REQUIRED: YES；驗證報告需先通過內容審查，之後才可建立第三批 Provider／Game draft及圖片
```
