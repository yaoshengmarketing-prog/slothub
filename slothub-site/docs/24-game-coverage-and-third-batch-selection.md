# Slot Hub 24 款遊戲覆蓋盤點與第三批候選選擇

> **READ-ONLY COVERAGE AUDIT**
> 本報告只分析目前 Repository 內 `status: published` 的 24 筆 Game 與 8 筆 Provider。沒有查閱網路、修改網站／資料／Schema／taxonomy／藍圖，也不構成候選建立、圖片下載或發布授權。
> 統計基準 Commit：`b81381032e5e6b84d6ff5b8cc11f396f48c01fbe`
> 盤點日期：2026-08-29

## 1. 結論摘要

- 24 款全部屬於 `slots`；目前尚未用真實資料測試捕魚機或其他電子遊戲主類型。
- 廠商數量不算被單一品牌壟斷：最大 Pragmatic Play 為 5/24（20.8%），前三家合計 13/24（54.2%）。但 NetEnt、Play’n GO 各只有 1 款，廠商 Hub 深度不足。
- 玩法明顯集中：Paylines 13/24（54.2%）、Multiplier 20/24（83.3%）、Free Spins 18/24（75%）；Megaways 完全沒有樣本。
- Mechanism、Features、來源與核對日期均達 100%；最高倍數 91.7%，已足以支援比較或篩選。
- RTP 只有 62.5%、統一波動度 70.8%；可以使用，但必須保留「缺值不等於低值／沒有」的邏輯。
- Bonus Buy 已確認狀態只有 50%、系列 45.8%、發行日期 54.2%，目前不適合作為完整、強制性的公開篩選條件。
- 第三批不應再以 Paylines、高倍數、Free Spins、Multiplier 的相似組合為主；應優先補 Megaways、新亞洲廠商、NetEnt／Play’n GO 深度及現有正式系列。

## 2. 廠商分布

| Provider | 遊戲數 | 佔比 | 判讀 |
| --- | ---: | ---: | --- |
| Pragmatic Play | 5 | 20.8% | 目前最多；已有原作、1000 版與 Big Bass，短期不需以增加數量為目的。 |
| Hacksaw Gaming | 4 | 16.7% | 已有四款；玩法仍以高波動、Paylines／Bonus 類為主。 |
| PG SOFT | 4 | 16.7% | 亞洲與行動端代表性較完整；已有 Mahjong pair、Fortune Tiger／Ox。 |
| ATG Games | 3 | 12.5% | 有明確系列樣本及亞洲題材。 |
| Booming Games | 3 | 12.5% | 三款皆為 Paylines，需避免只擴增相似玩法。 |
| Slotmill | 3 | 12.5% | 已涵蓋 Cluster 與特殊盤面，結構補位價值較高。 |
| NetEnt | 1 | 4.2% | 只有 Starburst，Provider 頁與系列關聯都偏薄。 |
| Play’n GO | 1 | 4.2% | 只有死亡之書，Dead Series 尚未形成站內系列群。 |

八家已發布 Provider 都至少有一款遊戲，沒有「已建立但零遊戲」的 Provider。前三家 Pragmatic Play、Hacksaw Gaming、PG SOFT 合計 54.2%，屬中度集中；真正問題不是單一廠商壟斷，而是 NetEnt／Play’n GO 過薄，以及其他亞洲與機制代表廠商尚未進入資料庫。

## 3. 欄位取得率

| 欄位 | 取得數 | 取得率 | 判讀 |
| --- | ---: | ---: | --- |
| 主要 RTP | 15/24 | 62.5% | 可比較、可篩選，但 9 款缺值會被門檻篩選排除。 |
| RTP 多版本 | 10/24 | 41.7% | 代表已能保存多版本；不是每款都應有多版本。 |
| 原廠波動度 | 18/24 | 75.0% | 來源覆蓋尚可。 |
| Slot Hub 統一波動度 | 17/24 | 70.8% | 可用，但 `medium-high` 尚無樣本、`low` 只有一款。 |
| 最高倍數 | 22/24 | 91.7% | 已足以支援比較／篩選；仍須保留原廠標籤語意。 |
| 盤面 reels／描述 | 23/24 | 95.8% | 顯示用途完整；目前同時混有 `5x3` 與自然語言。 |
| 結構化 rows | 20/24 | 83.3% | 規則盤面多可使用；不規則盤面不應被強制簡化。 |
| Mechanism | 24/24 | 100% | 可正式作為探索條件。 |
| Ways／Paylines 實際數字 | 14/24 | 58.3% | 適合資料頁／比較表，不適合要求所有遊戲都有值。 |
| Features | 24/24 | 100% | 適合標籤與探索；需避免高頻標籤造成結果幾乎不變。 |
| Bonus Buy 已確認 | 12/24 | 50.0% | 11 款為有、1 款為無，其餘 12 款未確認。 |
| 系列 ID | 11/24 | 45.8% | 適合關聯遊戲，不適合全站強制篩選。 |
| 發行日期 | 13/24 | 54.2% | 暫不適合完整年份篩選或「最新」排序。 |
| `sources[]` | 24/24 | 100% | 已達發布資料追溯基線。 |
| 最後核對日期 | 24/24 | 100% | 可支援後續資料更新流程。 |
| 主圖 | 24/24 | 100% | 所有已發布遊戲都有圖。 |

盤面雖有高取得率，但 `reels` 現在是可容納自然語言的字串；因此它已足以顯示，不代表已足以建立「5×3／5×5」等精準結構化篩選。

## 4. Mechanism 覆蓋

| Mechanism | 遊戲數 | 佔比 | 覆蓋狀態 |
| --- | ---: | ---: | --- |
| Paylines | 13 | 54.2% | 充分，且已偏多。 |
| Ways to Win | 2 | 8.3% | 只有 Mahjong Ways 一、二代，廠商與玩法來源單一。 |
| Megaways | 0 | 0% | 完全缺口。 |
| Cluster Pays | 2 | 8.3% | 有基本樣本，但只有 Hacksaw／Slotmill 各一款。 |
| Pay Anywhere | 4 | 16.7% | Sweet／Gates 兩組原作與 1000 版；數量可用但系列高度集中。 |
| Other | 3 | 12.5% | 全部為 ATG；表示原廠機制仍有無法精確映射的案例。 |

`Scatter Pays` 目前不是正式 enum，也沒有任何遊戲被結構化為 Scatter Pays。Scatter symbol／Feature 的存在不能算作 Scatter Pays Mechanism 覆蓋。

## 5. Feature 覆蓋

| Feature | 遊戲數 | 佔比 | 判讀 |
| --- | ---: | ---: | --- |
| Multiplier | 20 | 83.3% | 過於常見，單獨篩選的區分度低。 |
| Free Spins | 18 | 75.0% | 過於常見，較適合搭配其他條件。 |
| Scatter | 13 | 54.2% | 有實用區分度；不等於 Scatter Pays。 |
| Wild | 12 | 50.0% | 有實用區分度。 |
| Cascading | 9 | 37.5% | 已有足夠跨廠商樣本，可作探索條件。 |
| Bonus Buy 標籤 | 11 | 45.8% | 可識別已確認為有的遊戲，但不能把未標示解讀為無。 |
| Respins | 5 | 20.8% | 可作輔助標籤，樣本仍小。 |
| Giant Symbols | 3 | 12.5% | 樣本偏少。 |
| Cash Collection | 2 | 8.3% | 樣本偏少。 |
| Hold & Spin | 1 | 4.2% | 幾乎沒有比較／篩選價值。 |
| Symbol Splitting | 1 | 4.2% | 單一樣本。 |
| Sticky Symbols | 1 | 4.2% | 單一樣本。 |
| Jackpot Feature | 1 | 4.2% | 單一樣本，且不代表已確認 Jackpot 類型。 |
| Other | 0 | 0% | 沒有使用；目前原廠專屬詞彙主要保存在 `bonusFeatures`。 |

## 6. 系列覆蓋

目前共有 7 個 `seriesId`、涵蓋 11 款：

- 已有兩款成員：Mahjong Ways、Sweet Bonanza、Gates of Olympus、Storm of Seth。
- 只有一款成員：Big Bass、Dead Series、Starburst。

因此系列關聯能力已被驗證，但只有四組能實際顯示同系列成員。Big Bass、Dead Series、Starburst 仍是「有系列證據、站內只有一款」；Legacy of Dead、Starburst 的其他正式作品或 Big Bass 系列作品，會比建立全新孤立系列更有內部連結價值。

## 7. 篩選條件可用性

### 已有足夠資料

- **Provider**：24/24 完整；適合正式篩選。但 NetEnt、Play’n GO 各只有一款，選項結果偏窄。
- **Mechanism**：24/24 完整；Paylines、Pay Anywhere、Cluster、Ways 可用。Megaways 尚不能顯示有效結果。
- **最高倍數**：22/24；可作比較或區間篩選，但必須說明倍數不是勝率或推薦依據。
- **主要 Features**：Free Spins、Wild、Scatter、Multiplier、Cascading 已有足夠樣本。Multiplier／Free Spins 太普遍，較適合複合篩選。
- **統一波動度**：17/24；可以使用，但要保留「未確認」並避免把缺值放進低波動。
- **RTP**：15/24；現有最低 RTP 門檻可使用，但結果只代表已取得 RTP 的遊戲，不能宣稱涵蓋全庫。

### 尚未具備足夠使用價值

- **主類型**：24 款全是 slots，篩選器不會產生分流；目前隱藏是合理的。
- **子類型**：23 款標為 video-slots；Cluster 2、Ways 3、Hold and Win 1，分布過斜且與 Mechanism／Feature 重疊。
- **Bonus Buy 三態**：只有 12/24 已確認；在補足「有／無／未確認」前，不宜做二元篩選。
- **系列**：只有 11/24 有 seriesId，且三組仍是單一成員；適合關聯，不適合全站主篩選。
- **發行日期**：13/24；不足以支援完整年份篩選、最新排行或時間趨勢。
- **盤面尺寸**：顯示完整度高，但資料同時含規則尺寸與自然語言／不規則盤面；目前不宜直接當精準 filter key。
- **Ways／Paylines 數量**：14/24；適合比較欄位，不適合作為主要篩選器。
- **稀有 Features**：Hold & Spin、Cash Collection、Giant Symbols、Sticky Symbols、Symbol Splitting、Jackpot 各僅 1–3 款，現階段篩選價值低。

## 8. 完全未覆蓋與明顯缺口

### Provider

- 在已建立的 8 家 Provider 內沒有零遊戲頁。
- 相對於專案先前記錄的全球／亞洲廠商方向，目前尚未有 CQ9 Gaming、JILI、Big Time Gaming、Nolimit City、Yggdrasil、ELK Studios、Thunderkick、SPRIBE、BGaming 等 Provider 資料。
- 目前也沒有 `aggregator` 角色的公開 Provider；這不是本輪應立即補的 Slot 遊戲缺口，但代表 Provider 多角色模型尚未由公開資料驗證。

### Mechanism

- Megaways：0。
- Scatter Pays：沒有正式分類樣本，且目前不是 enum。
- Ways to Win 與 Cluster Pays 雖非零，但都只有 2 款，尚不足以代表多家廠商的實作差異。
- 三款 `other` 全來自 ATG，代表 Mechanism 原廠文字與共用分類仍需更多跨廠商樣本。

### Features

- 現有 enum 中 `other` 為 0；這不是缺資料，而是專屬 Feature 目前保留於原始文字。
- Expanding Wild／Special Expanding Symbol 已跨 Starburst、死亡之書出現，但尚未成為共用 Feature。
- Megaways 動態 Ways、品牌化連鎖機制、非轉輪類遊戲流程尚未由已發布資料測試。

### 系列

- Dead Series、Big Bass、Starburst 各只有一款，無法形成真正站內系列探索。
- Chaos Crew 已有原作，但目前沒有正式 seriesId 或續作資料。
- Fortune Tiger／Ox 依既有決策不是已證明的正式系列，不應為了補系列數量強行相連。

## 9. 集中度判斷

### 廠商集中度

- 最大單一廠商為 20.8%，沒有嚴重單一品牌壟斷。
- 前三家合計 54.2%，中度集中。
- 兩家國際代表 Provider 各只有一款，長尾深度不足。

### 玩法集中度

- Paylines 54.2%，Multiplier 83.3%，Free Spins 75%，顯示玩法組合高度相似。
- 24 款全為 slots；目前沒有捕魚機、Crash 或其他電子遊戲用來驗證主類型擴充。
- Pay Anywhere 的 4 款其實只來自 Sweet／Gates 兩個 Pragmatic 系列；不是四個獨立玩法來源。
- Ways to Win 的 2 款都是 Mahjong Ways 系列；同樣缺少跨廠商對照。

**結論：廠商數量尚可，但玩法與系列來源比廠商分布更集中。第三批應以補機制與 Provider 深度為主，不宜再收六款相似的高波動 Paylines／Free Spins 遊戲。**

## 10. 三組第三批候選

以下只是下一輪只讀驗證候選。因本輪禁止查網，台灣搜尋判斷只能使用既有專案紀錄、繁中命名辨識度及專案負責人先前提供的亞洲市場方向，**沒有可靠搜尋量化資料**；正式優先順序仍須在下一輪補證。

### A. 台灣使用者較可能搜尋

| 候選 | 候選理由 | 主要風險／待驗證 |
| --- | --- | --- |
| Fortune Rabbit（PG SOFT） | Fortune 題材與 PG SOFT 已有繁中搜尋入口，可補生肖／財富題材需求。 | PG SOFT 已有 4 款，玩法可能與 Tiger／Ox 重疊；不得自動建立正式系列。 |
| Jump High／跳高高（CQ9 Gaming） | 中文名稱辨識度高，可引入台灣市場相關的新亞洲 Provider。 | 本輪未核對正式中文名稱、RTP、版本、圖片與 Mechanism。 |
| Super Ace（JILI） | 可測試 JILI 品牌與亞洲市場 aliases，避免資料庫只代表歐美與既有四家亞洲廠商。 | 台灣搜尋訊號與正式繁中名仍需補證。 |
| Legacy of Dead（Play’n GO） | 「Dead／死亡」題材與現有死亡之書可形成系列／相似搜尋入口。 | 必須核對是否正式屬 Dead Series，不能只憑名稱相似。 |

### B. 補足廠商與玩法廣度

| 候選 | 補位目的 |
| --- | --- |
| Bonanza（Big Time Gaming／Megaways） | 引入新 Provider，填補 Megaways 0 款的最大 Mechanism 缺口。 |
| Reactoonz（Play’n GO） | 增加 Play’n GO 深度，提供另一個 Cluster Pays／品牌化 Feature 樣本。 |
| Gonzo’s Quest（NetEnt） | 增加 NetEnt 深度，提供較早期 Avalanche／Cascading 類玩法樣本。 |
| Jump High（CQ9 Gaming） | 增加亞洲 Provider 廣度，避免第三批只補歐洲廠商。 |

### C. 驗證尚未充分測試的資料結構

| 候選 | 結構驗證目的 |
| --- | --- |
| Bonanza（Big Time Gaming） | 測試 Megaways、動態 Ways 數量與 `winCount` 表達。 |
| Legacy of Dead（Play’n GO） | 測試把新成員連到既有 Dead Series，以及角色品牌與正式系列的分離。 |
| Gonzo’s Quest（NetEnt） | 測試原廠品牌化機制詞與既有 `cascading` 共用 Feature 的並存。 |
| Reactoonz（Play’n GO） | 測試 Cluster Pays 搭配大量遊戲專屬 Feature，而不濫用 `other`。 |
| Fortune Rabbit（PG SOFT） | 測試名稱相近但系列證據不足時，如何維持獨立資料與 aliases。 |
| Aviator（SPRIBE） | 可測試非 Slot、無 reels／rows 的電子遊戲模型；但會擴大第一版 Slot 核心範圍，建議先保留候選、不列入本批六款。 |

## 11. 推薦第三批六款

| 順序 | 推薦遊戲 | 入選目的 |
| ---: | --- | --- |
| 1 | Fortune Rabbit（PG SOFT） | 補台灣／亞洲搜尋入口；同時驗證「題材與名稱相似不等於正式系列」。 |
| 2 | Jump High／跳高高（CQ9 Gaming） | 新增具繁中辨識度的亞洲 Provider，降低既有 Provider 集中。 |
| 3 | Bonanza（Big Time Gaming／Megaways） | 填補 Megaways 完全零覆蓋，測試動態 Ways 與新 Provider。 |
| 4 | Gonzo’s Quest（NetEnt） | 將 NetEnt 從 1 款提升為 2 款，補 Avalanche／Cascading 歷史玩法。 |
| 5 | Legacy of Dead（Play’n GO） | 讓 Dead Series 從單一成員變成可探索關聯，補 Play’n GO 深度。 |
| 6 | Reactoonz（Play’n GO） | 增加 Cluster Pays 與遊戲專屬 Feature 樣本，避免第三批仍以 Paylines 為主。 |

這六款不是因舊候選名單存在而自動沿用。選擇邏輯是：

1. 兩款亞洲搜尋／Provider 補位：Fortune Rabbit、Jump High。
2. 一款完整填補零 Mechanism：Bonanza／Megaways。
3. 兩家目前過薄 Provider 的深度補位：Gonzo’s Quest、Legacy of Dead、Reactoonz。
4. 一個現有單例系列補成可用關聯：Dead Series。
5. 至少兩種非主流結構樣本：Megaways、Cluster Pays／品牌化 Features。

### 本批刻意未優先

- **Chaos Crew 2**：Hacksaw 已有 4 款，且現有玩法已偏向高波動、Paylines、Bonus Buy；系列價值存在，但覆蓋補位效益較低。
- **Dead or Alive 2**：可增加 NetEnt，但仍偏 Paylines；相較 Gonzo’s Quest，Mechanism 補位較弱。
- **Sweet／Gates 其他版本**：Pragmatic Play 已是最大 Provider，且兩組系列已有原作與 1000 版。
- **Aviator**：結構測試價值高，但會把本批範圍擴到非 Slot；先留作下一次主類型擴充決策。

## 12. 下一步建議

若第三批獲准進入只讀驗證，應先查明六款正式身份、實際 Provider、繁中名稱、系列證據、Mechanism 原文、RTP variants、波動度、最高倍數、盤面、Features、Bonus Buy、發行日期與官方圖片。特別需要驗證：

- Bonanza 的正式名稱、Megaways／Ways 原廠定義及動態數量如何映射。
- Legacy of Dead 是否有足夠官方證據連到現有 `dead-series`。
- Gonzo’s Quest 的 Avalanche 是否只映射為 Cascading Feature，或涉及其他 Mechanism 語意。
- Reactoonz 的 Cluster Pays 與品牌化 Feature 是否能由現有欄位承接。
- Fortune Rabbit 與 Fortune Tiger／Ox 是否只有共同題材，不建立錯誤系列。
- Jump High 的正式繁中名、版本、Provider 身份與官方資料完整度。

本盤點沒有授權建立上述候選、Provider、圖片或任何頁面。
