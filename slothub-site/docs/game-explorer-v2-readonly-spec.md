# Slot Hub Game Explorer v2 功能規格盤點

> **READ-ONLY SPEC**
>
> 本文件只分析目前 Repository 內 `status: published` 的 30 筆 Game、11 筆有公開遊戲的 Provider，以及既有 `GameExplorer`、搜尋、URL helper 與 `/slots/` 程式。
>
> 本輪沒有查網、修改 Explorer／搜尋／Schema／taxonomy／路由／索引規則，也不構成實作、Commit、Push 或部署授權。
> 盤點日期：2026-08-29

## 1. 結論摘要

Game Explorer v2 的最小目標應是：讓既有 `winMechanism` 與 `features` 成為可搜尋、可篩選、可分享的正式條件，並將所有條件狀態集中到 `/games/` 的 query string。30 款資料已足以支持這個範圍：Mechanism、Features、來源與最後核對日期都是 30/30。

目前不適合把所有資料欄位同時攤在第一層。主要 RTP 與統一波動度都只有 17/30，發行日期也是 17/30；這些條件可以使用，但應放在「進階篩選」，而且啟用門檻或排序時，缺值遊戲必須排除或排到最後，不能視為 0、低波動或最舊。

推薦 v2 最小範圍：

1. Explorer 文字搜尋加入 Mechanism 與 Feature 的繁中／英文詞彙。
2. 主要篩選加入 Provider、Mechanism、Features。
3. 進階篩選保留／加入 RTP、統一波動度、最高倍數與子類型。
4. Features 採多選 **AND**；不同 facet 之間也採 AND。
5. `/games/` 讀寫、清除並回復 query 狀態，支援分享與瀏覽器上一頁／下一頁。
6. 加入名稱、RTP、最高倍數排序；發行日期排序延後。
7. `/slots/` 子類型卡片直接連到已套用條件的 `/games/`。
8. 抽出一份 published Game 的中立投影與純函式 filter／sort／URL state，供首頁、遊戲庫、Slot Hub 與搜尋共用。

## 2. 現況程式盤點

### 2.1 現有能力

`src/components/GameExplorer.tsx` 目前支援：

- 遊戲名稱、英文名、aliases、廠商與摘要的混合搜尋。
- 單一 Provider、主類型、子類型、最低 RTP、單一波動度篩選。
- 首頁與 `/slots/` 可用 `initialLimit` 只顯示首批卡片。
- 加入最多三款比較及本機儲存。
- 卡片可顯示主要 RTP、統一顯示用波動度、最高倍數與 Mechanism。

### 2.2 v2 前的實際缺口

- Explorer 沒有 Mechanism／Features 控制，也沒有排序。
- Explorer 不讀寫 URL；重新整理、分享、上一頁／下一頁都不能保留條件。
- `Game` 型別雖已有 `features`、`bonusBuy` 等欄位，但首頁、`/games/`、`/slots/` 的三份手寫 projection 沒有傳入 `features`、`volatilityNormalized`、`releaseDate` 等 v2 所需欄位。
- Explorer 現在讀取相容欄位 `volatility`，而不是明確以 `volatilityNormalized` 作篩選來源。
- Mechanism 的 legacy fallback 分散在 Explorer、比較表與遊戲資料頁；若再為搜尋建立一份 mapping，會形成第四套規則。
- 首頁與 `/search/` 各自建立一份搜尋 item；Mechanism 與 Feature 的代碼／繁中名稱目前都沒有進入 `searchText`。
- `/slots/` 的子類型卡片全部連到裸 `/games/`，沒有帶入所選子類型。
- `gamesIndexUrl()` 目前只能回傳 `/games/`，尚不能集中產生合法、穩定排序的 query。

## 3. 30 款 Mechanism 統計

| 代碼 | 繁中顯示 | 遊戲數 | 佔比 | v2 判讀 |
| --- | --- | ---: | ---: | --- |
| `paylines` | 賠線 | 15 | 50.0% | 充分，適合主要篩選。 |
| `ways-to-win` | 多路贏法 | 4 | 13.3% | 有實際分流價值。 |
| `megaways` | Megaways | 1 | 3.3% | 樣本少，但為明確機制，保留選項並顯示數量。 |
| `cluster-pays` | 群集賠付 | 3 | 10.0% | 有實際分流價值。 |
| `pay-anywhere` | 任意位置賠付 | 4 | 13.3% | 有實際分流價值。 |
| `other` | 其他 | 3 | 10.0% | 不應隱藏；代表已有證據但尚不能安全映射的案例。 |

Mechanism 為 30/30（100%）。本輪沒有 `scatter-pays` enum，也沒有任何遊戲被結構化成 Scatter Pays；具有 Scatter Feature 不等於 Scatter Pays Mechanism。

## 4. 30 款 Feature 統計

| 代碼 | 繁中顯示 | 遊戲數 | 佔比 | v2 分層 |
| --- | --- | ---: | ---: | --- |
| `multiplier` | 倍數 | 25 | 83.3% | 主要；單獨區分度低，適合與其他條件組合。 |
| `free-spins` | 免費旋轉 | 23 | 76.7% | 主要；單獨區分度低，適合複合篩選。 |
| `scatter` | 散佈符號 | 16 | 53.3% | 主要。 |
| `wild` | 百搭符號 | 15 | 50.0% | 主要。 |
| `cascading` | 連鎖消除 | 13 | 43.3% | 主要。 |
| `bonus-buy` | Bonus Buy | 12 | 40.0% | 主要；只代表已確認有此 Feature。 |
| `respins` | 重轉 | 5 | 16.7% | 進階。 |
| `giant-symbols` | 巨型符號 | 4 | 13.3% | 進階。 |
| `cash-collection` | 獎金收集 | 2 | 6.7% | 進階。 |
| `hold-and-spin` | Hold & Spin | 1 | 3.3% | 進階，保留但不突出。 |
| `symbol-splitting` | 符號分裂 | 1 | 3.3% | 進階，保留但不突出。 |
| `sticky-symbols` | 黏著符號 | 1 | 3.3% | 進階，保留但不突出。 |
| `jackpot` | Jackpot 功能 | 1 | 3.3% | 進階；不得解讀為已確認 Jackpot 類型。 |
| `other` | 其他功能 | 0 | 0% | 不顯示零結果選項。 |

Features 為 30/30（100%）。常見 AND 組合仍有可用結果，例如 Free Spins＋Wild 9 款、Wild＋Scatter 9 款、Multiplier＋Cascading 12 款、Free Spins＋Wild＋Scatter 8 款，因此 AND 在目前樣本下不會普遍造成零結果。

## 5. 其他欄位覆蓋與 Provider 分布

### 5.1 欄位取得率

| 欄位 | 取得數 | 取得率 | 篩選／排序判讀 |
| --- | ---: | ---: | --- |
| Provider | 30/30 | 100% | 主要篩選。 |
| 主要 RTP | 17/30 | 56.7% | 可用，但放進階；缺值不得納入門檻結果。 |
| 原廠波動度 | 20/30 | 66.7% | 顯示／追溯資料，不直接作統一篩選值。 |
| 統一波動度 | 17/30 | 56.7% | 可用，但放進階；缺值不得等同低波動。 |
| 最高倍數 | 25/30 | 83.3% | 可用，放進階，並維持非推薦／非勝率語意。 |
| Mechanism | 30/30 | 100% | 主要篩選。 |
| Features | 30/30 | 100% | 主要篩選。 |
| Bonus Buy 三態 | 13/30 | 43.3% | 不做獨立 v2 篩選；`features` 中已確認有的 12 款可被找到。 |
| 系列 | 15/30 | 50.0% | 保留關聯用途，不做 v2 主篩選。 |
| 發行日期 | 17/30 | 56.7% | 暫緩排序／篩選。 |

波動度分布為：高 9、中 4、極高 3、低 1、缺值 13；目前沒有 `medium-high` 樣本。RTP 門檻若設為 96%、96.2%、96.5%，分別會得到 16、11、8 款已知值結果。最高倍數門檻若設為 5,000×、10,000×、25,000×，分別會得到 18、17、7 款已知值結果。

### 5.2 Provider 分布

| Provider | 遊戲數 |
| --- | ---: |
| Pragmatic Play | 5 |
| Hacksaw Gaming | 4 |
| PG SOFT | 4 |
| ATG Games | 3 |
| Booming Games | 3 |
| Play’n GO | 3 |
| Slotmill | 3 |
| NetEnt | 2 |
| Big Time Gaming | 1 |
| CQ9 Gaming | 1 |
| JILI Games | 1 |

Provider 已有 11 個有效選項，且所有 published Game 都有 Provider，可作第一個主要 facet。

## 6. 主要與進階篩選

### 6.1 主要篩選

建議視覺順序：

1. **遊戲搜尋**：獨立佔滿一列；搜尋名稱、英文原名、aliases、Provider、Mechanism 與 Features。
2. **Provider**：單選，30/30 完整。
3. **Mechanism**：單選，30/30 完整；六個類別易理解。
4. **Features**：多選 AND；第一層優先顯示 Free Spins、Wild、Scatter、Multiplier、Cascading、Bonus Buy。

Mechanism v2 最小版維持單選，避免同時加入另一種 OR 控制語意。未來若有明確使用需求，可升級為同 facet 多選 OR；跨 facet 一律維持 AND。

### 6.2 進階篩選

建議展開順序：

1. **最低 RTP**：使用主要 `rtp`，不以最高 `rtpVariants` 代替。
2. **統一波動度**：只使用 `volatilityNormalized`。
3. **最低最高倍數**：使用 `maxWinMultiplier`，文案避免暗示倍數越高越好。
4. **子類型**：保留既有能力，但不突出；`video-slots` 為 29/30，且其他子類型多與 Mechanism／Feature 重疊。
5. **較少見 Features**：Respins、Giant Symbols、Cash Collection、Hold & Spin、Symbol Splitting、Sticky Symbols、Jackpot。

主類型目前 30 款全為 `slots`，繼續依資料種類數量自動隱藏。Bonus Buy 三態、系列、盤面、Ways／Paylines 數量與發行年份不進 v2 篩選。

## 7. Feature 選擇語意

v2 採 **多選 AND**：選取 `free-spins` 與 `wild` 時，只顯示同時具有兩者的遊戲。介面文案應寫「符合全部已選功能」，避免使用者誤以為是任一條件。

完整布林規則：

- 同一個 Feature 集合：AND。
- Provider、Mechanism、RTP、波動度、最高倍數、子類型等不同 facet 之間：AND。
- 文字搜尋結果再與所有 facet 做 AND。
- 未選 Feature 時不限制結果。
- 每個 Feature 選項旁顯示「加入此條件後」的動態結果數；結果為 0 時可以停用，但不能移除已選條件。

多選 OR／AND 切換會增加介面、query 與測試複雜度，延後到有使用數據後再決定。v2 不加入 `featureMode`。

## 8. 缺值處理

### 8.1 篩選

- 沒有啟用該欄位條件時，缺值遊戲正常保留。
- 啟用最低 RTP 時，`rtp` 缺值的 13 款排除；不得用 `rtpVariants` 的最高值補上。
- 啟用波動度時，`volatilityNormalized` 缺值的 13 款排除；不得視為低、中或原廠文字的自動映射。
- 啟用最高倍數門檻時，`maxWinMultiplier` 缺值的 5 款排除；不得視為 0。
- 結果摘要需顯示「門檻篩選只包含已取得此欄位的遊戲」，並可附排除缺值數量。
- v2 不增加「包含未知」切換；若未來新增，必須是明確 opt-in。

### 8.2 排序

- 數值／日期缺值一律置底，升冪與降冪都相同。
- 缺值之間以繁中顯示名稱、英文原名、slug 作穩定 tie-breaker。
- 不把 `undefined` 轉成 0、空字串或 epoch 日期。

## 9. 排序規格

### v2 應加入

- `name-asc`：30/30；沒有搜尋字時的穩定預設。
- `rtp-desc`、`rtp-asc`：17/30；使用主要 RTP，已知值優先、缺值置底。
- `max-win-desc`、`max-win-asc`：25/30；已知值優先、缺值置底。
- `relevance`：只有 `q` 非空時作預設，沿用現有分級混合搜尋排名。

### 暫緩

- `release-desc`／`release-asc`：只有 17/30（56.7%），13 款缺值；目前「最新」結果會有明顯偏差。
- 波動度排序：波動度是分類，不是客觀的好壞順序，適合篩選、不適合排序。
- Provider 排序、Feature 數量排序與「熱門」排序：沒有明確使用價值或可信熱門數據。

當使用者有 `q` 時，預設為 relevance；若手動選擇數值／名稱排序，搜尋只負責決定命中集合，之後再按所選排序。

## 10. URL 狀態與 query schema

只有完整遊戲庫 `/games/` 擁有可分享 URL 狀態。首頁與 `/slots/` 的嵌入式 Explorer 可以在本頁互動，但「查看全部結果」應導向 `/games/?…`，避免 `/`、`/slots/`、`/games/` 同時形成三套 faceted URL。

### 10.1 建議 schema

| Query | 格式 | 範例 | 規則 |
| --- | --- | --- | --- |
| `q` | UTF-8 字串 | `q=賽特` | trim；空字串移除。 |
| `provider` | 單一 slug | `provider=atg-games` | 只接受目前 published Provider。 |
| `type` | 單一代碼 | `type=slots` | 為未來主類型保留；目前 UI 隱藏。 |
| `subtype` | 單一代碼 | `subtype=cluster-pays` | 只接受 taxonomy 既有值。 |
| `mechanism` | 單一代碼 | `mechanism=pay-anywhere` | 只接受既有 enum。 |
| `features` | 逗號分隔 slug | `features=free-spins,wild` | 去重、按 taxonomy 固定順序輸出；語意固定為 AND。 |
| `rtp-min` | 數字 | `rtp-min=96.2` | 限制允許門檻或合法範圍；不接受 NaN。 |
| `volatility` | 單一代碼 | `volatility=high` | 使用 normalized enum。 |
| `max-win-min` | 正整數 | `max-win-min=10000` | 不接受 0、負數或非數字。 |
| `sort` | enum | `sort=max-win-desc` | 預設值不寫入 URL。 |

完整示例：

```text
/games/?q=賽特&provider=atg-games&mechanism=paylines&features=free-spins,wild&rtp-min=96&volatility=high&max-win-min=10000&sort=max-win-desc
```

### 10.2 狀態同步規則

- 初次 hydration 前先解析 URL，避免先顯示全庫再跳到篩選結果。
- 每次互動使用 `history.replaceState` 更新目前 URL；不讓每個 checkbox 都塞滿瀏覽器歷史。
- 明確的「套用」動作若保留，可使用 `pushState`；v2 最小版不需要多一個套用步驟。
- 監聽 `popstate`，上一頁／下一頁必須回復控制項與結果。
- 清除全部後回到 `/games/`，移除所有預設值與空 query。
- 未知 key 保留給其他系統的情況尚不存在；v2 應忽略並在下一次狀態輸出時移除不支援的 Explorer key/value。
- query key 依上表固定順序輸出，multi-value 去重，確保同一狀態只有一種分享網址。

## 11. `/slots/` 子類型卡片

目前卡片只連到 `/games/`。v2 應由集中 URL helper 產生：

```text
/games/?type=slots&subtype=video-slots
/games/?type=slots&subtype=cluster-pays
/games/?type=slots&subtype=ways-to-win
/games/?type=slots&subtype=cascading-reels
/games/?type=slots&subtype=hold-and-win
/games/?type=slots&subtype=megaways
```

卡片顯示的 count 與遊戲庫實際 filter 必須使用同一個純函式或同一份 normalized projection，不能在 `/slots/` 另寫一套計數條件。若某個子類型為 0，不產生卡片。

子類型與 Mechanism／Feature 即使名稱相近也不能互相代換。例如 `subtype=cluster-pays` 必須讀 `subtypes`；`mechanism=cluster-pays` 才讀 `winMechanism`。

## 12. 分享網址與永久集合頁

### 12.1 只供分享、保持 noindex

- 所有帶 Explorer query 的 `/games/?…` 組合。
- 任何 Provider＋Mechanism＋Feature＋數值門檻的複合結果。
- 任意搜尋詞 `q` 的結果。
- 排序參數形成的變體。

這些 URL 不進 sitemap，不輸出為永久集合 canonical，也不建立靜態頁。Production 的 canonical 仍指向乾淨 `/games/`；Preview 則繼續不輸出 production canonical 並全站 `noindex,nofollow`。

需注意：目前 Astro SSG 對 `/games/` 與 `/games/?…` 回傳同一份靜態 HTML，HTML meta 無法在 server/build 階段依 query 改變。Preview 已由全站 safeguard 防索引；正式切換前若要求 query URL 嚴格回傳 `noindex,follow`，應以 Cloudflare Pages Function／edge header 等可讀 query 的方式處理，不能只依賴 client-side 改 meta。這是上線索引任務，不是 Explorer v2 最小實作的一部分。

### 12.2 未來可能成為永久集合頁

- 已存在：`/slots/`、`/fishing-games/`、`/providers/{slug}/`。
- 未來候選：有足夠遊戲、獨立搜尋意圖、穩定 taxonomy、編輯導言與內部連結的 subtype／Mechanism／Feature Hub。
- 永久集合頁必須使用乾淨路由與獨立內容，不直接把 query URL 改成可索引頁。
- 是否建立 `/slots/megaways/`、`/features/free-spins/` 等路由，須另經產品、內容與 SEO 審查；目前單一或少量樣本不應自動產生薄頁。

## 13. 共用資料 mapping 與修改範圍

### 13.1 建議的單一資料流

```text
Astro Content Collections
        ↓ published-only catalog projection
Normalized Explorer Game
        ├─ GameExplorer cards / filters / sort
        ├─ homepage and /slots/ embedded Explorer
        ├─ /slots/ subtype counts and links
        └─ SearchItem projection (names + provider + mechanism + features)
```

不建立第二份遊戲卡資料。建議抽出：

- `src/lib/game-catalog.ts`（名稱可調整）：讀取 published Game／Provider 後產生中立 projection。至少包含 `volatilityNormalized`、`winMechanism`、`features`、主要 RTP、最高倍數、發行日期與顯示名稱。
- `src/lib/game-explorer-state.ts`：純函式實作 query parse／serialize、filter、sort、facet count；不依賴 React、route 或 browser global。
- `src/lib/taxonomy.ts`：繼續作代碼到繁中名稱的唯一 mapping；不在元件內重複 Feature／Mechanism label。
- `src/lib/urls.ts`：讓 `gamesIndexUrl(filters?)` 使用同一 serializer，不手寫 query。

### 13.2 預計需要修改的既有入口

- `src/components/GameExplorer.tsx`：新增 UI、URL hydration／同步、排序與共用純函式呼叫。
- `src/pages/games/index.astro`：改用中立 projection；啟用 URL state owner 模式。
- `src/pages/index.astro`：改用相同 projection 與 SearchItem mapper；嵌入式 Explorer 不建立首頁 faceted URL。
- `src/pages/slots/index.astro`：改用相同 projection／facet count；子類型卡片用集中 URL helper。
- `src/pages/search/index.astro`：改用共用 SearchItem mapper，讓 Mechanism／Feature 繁中與英文詞彙可搜尋。
- `src/lib/search.js`／`search.d.ts`：排名演算法本身未必需要改；SearchItem 的 supporting terms 應由共用 mapper 提供。
- `src/styles/global.css`：主要／進階 filter、Feature chips、active states、mobile layout；不得把 query 邏輯放進 CSS 或 page。

比較表與遊戲資料頁可以繼續使用同一 taxonomy label，但 v2 不需改變比較邏輯或資料頁版面。現有 legacy Mechanism fallback 應集中為一個顯示 helper；不可讓 Explorer 搜尋、卡片、比較與資料頁各自判斷一次。

## 14. 測試規格

### 14.1 純資料與篩選測試

- 只載入 published Game；draft 永遠不進 Explorer、搜尋或 facet count。
- 30 款基準下的 Mechanism／Feature count 與本報告一致。
- Mechanism 單選精確命中；Feature 多選為 AND；不同 facet 為 AND。
- Scatter Feature 不會自動成為 Scatter Pays／其他 Mechanism。
- RTP、波動度、最高倍數缺值在條件啟用時排除，未啟用時保留。
- 數值排序與發行日期未來排序都必須把缺值置底。
- SearchItem 可用「任意位置賠付」「Pay Anywhere」「免費旋轉」「Free Spins」「連鎖消除」「Cascading」找到對應遊戲。

### 14.2 URL 測試

- parse → serialize → parse 冪等。
- query key 與 multi-value 順序固定、去重，空值／預設值省略。
- 不合法 Provider、taxonomy、數字與 sort 值會被忽略。
- 繁中 `q` 正確 encode／decode。
- 清除全部得到 `/games/`。
- `popstate` 回復 UI 與結果；重新整理後狀態不跳回預設。
- `/slots/` 每張 subtype 卡的 URL 與實際結果數一致。

### 14.3 UI 與整合測試

- 桌機與 390×844：主要 filters、進階展開、Feature chips、result count、空結果與清除按鈕。
- 30 款與未來數百款資料下，不以 React render 順序作隱性排序。
- 首頁與 `/slots/` 的 `initialLimit`：無條件時維持首批；有條件時顯示全部符合結果。
- 搜尋後排序、加入比較、移除比較不互相重設。
- Build、Astro Check、資料審計、搜尋測試、內部連結、sitemap 與 Preview safeguards 全部回歸。

測試應優先覆蓋抽出的純函式並接入既有 `npm run verify`，不需要為 v2 建立第二套大型測試工具鏈。瀏覽器層再補一組最小互動驗收，專門驗證 hydration、URL、上一頁／下一頁與 390×844 響應式。

## 15. v2 最小範圍與延後項目

### 15.1 推薦最小範圍

- 中立 published Game projection。
- 共用 Mechanism／Feature 搜尋詞與繁中 mapping。
- Provider、Mechanism、Feature AND 主篩選。
- RTP、統一波動度、最高倍數、子類型進階篩選。
- 名稱、RTP、最高倍數排序。
- `/games/` query parse／serialize／replaceState／popstate。
- `/slots/` 子類型卡片帶條件進遊戲庫。
- 缺值語意、draft 隔離與 query noindex 政策測試。
- 不改 Schema、taxonomy、遊戲內容、比較邏輯或正式索引設定。

### 15.2 延後

- Feature OR／AND 模式切換、Mechanism 多選。
- Bonus Buy 三態、系列、發行年份、盤面、Ways／Paylines 數量篩選。
- 發行日期排序與「最新」文案。
- 使用者儲存篩選、收藏、個人化推薦、D1／CMS。
- 自動產生 Mechanism／Feature／subtype SEO 集合頁。
- 正式環境 query-specific edge `noindex` 實作；留到正式索引與網域切換前完成。

## 16. 規格出口

- `STAGE_RESULT: PASS_TO_NEXT_STAGE`
- `CURRENT_STATE: READONLY_SPEC_COMPLETE`
- `NEXT_ALLOWED_ACTION: 人工確認 v2 最小範圍後，建立中立資料投影、Explorer state 純函式、UI 與測試`
- `FILES_ALLOWED_TO_CHANGE: 本輪僅 docs/game-explorer-v2-readonly-spec.md`
- `COMMIT_ALLOWED: NO`
- `PUSH_ALLOWED: NO`
- `DEPLOY_ALLOWED: NO`
- `HUMAN_APPROVAL_REQUIRED: YES；開始 Explorer v2 實作前需確認本規格`
