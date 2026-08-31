# Slot Hub 產品總藍圖 v2

文件狀態：`APPROVED v2`

建立日期：2026-08-31

適用範圍：Slot Hub 產品定位、使用者動線、內容與資料架構、可信度、未來功能、施工順序及研究方向

> 本文件已通過人工核准，並成為 Slot Hub 目前最高產品與施工順序依據。
>
> `docs/slot-hub-master-blueprint-v1.md` 保留為歷史決策文件，不刪除、不改寫。
>
> 本文件的核准不等於授權修改網站、Schema、taxonomy、內容、資料、索引政策、Commit、Push 或部署；各施工範圍仍須另行取得人工核准。

## 0. 文件承接與治理邊界

### 0.1 v2 與 v1 的關係

v2 不是重新從零設計，而是：

1. 完整承接 v1 仍有效的產品定位、使用者需求、內容實體、資料來源、缺值、SEO、收錄與發布原則。
2. 將已被目前實作超越的歷史數量及 `CURRENT` 狀態更新為 2026-08-31 的事實。
3. 記錄第二輪產品設計已人工核准的施工順序、保留能力及研究方向。
4. 保留 v1 作為不可覆蓋的歷史決策文件；v2 已核准為目前權威，並以 Decision Log 明確指出哪些 v1 現況敘述已被取代。

### 0.2 文件權限

- `docs/slot-hub-master-blueprint-v2.md` 是目前最高產品與施工順序依據。
- `docs/slot-hub-master-blueprint-v1.md` 只保留為歷史決策文件，不再作為目前施工排序依據。
- 產品藍圖決定「為何做、先做什麼、不能做什麼」。
- 技術規格決定「在已核准範圍內如何承接」。
- `docs/game-intake-workflow-v1.md` 管理 Game／Provider 從候選到發布的操作閉環。
- `docs/guide-content-workflow-v1.md` 管理 Guide 從選題、Brief、草稿到 Preview 發布的操作閉環。
- 已核准的 Explorer、Guide relationship、Game detail knowledge presentation、Guide typography 與 Knowledge Diagram 規格繼續有效，但不得反向擴張本藍圖範圍。
- 程式、Schema、taxonomy、資料、內容、Push、部署及正式索引變更仍需各自明確授權。
- 既有程式或文件若與本藍圖衝突，先停止並回報，不得自行重構或改寫產品方向。
- Wix／migration／301／410／GSC／DNS／舊內容搬移的狀態固定為 `OUT_OF_SCOPE FOR NEW-SITE ROADMAP`；詳細邊界見第 15 章。

### 0.3 產品狀態詞

| 狀態 | 定義 |
| --- | --- |
| `CURRENT` | 目前已在網站或資料底座實際存在並通過驗證。 |
| `DECIDED` | 產品方向已定案，但仍需另案核准規格與施工。 |
| `PROPOSED` | 已有提議，尚未取得產品核准。 |
| `CANDIDATE` | 可替換、延後或淘汰的候選。 |
| `DEFERRED` | 等待資料量、使用需求或前置條件成熟。 |
| `DO_NOT_BUILD_YET` | 近期不得自行實作。 |
| `SUPERSEDED` | 已被後續明確決策取代；歷史紀錄仍保留。 |

`DECIDED`、研究方向或施工排序都不等於自動施工授權。

## 1. 正式產品定位

### 1.1 `DECIDED` 核心定位

> Slot Hub 是一個以可追溯資料為基礎，協助使用者搜尋、理解、比較與探索老虎機遊戲的中文資料平台。

### 1.2 `DECIDED` 四個產品支柱

1. **遊戲資料庫**：以 Game 為核心，保存身份、Provider、系列、數據、玩法、功能、圖片、來源及核對日期。
2. **資料解讀系統**：用 Guide、情境式 CTA、比較警告與方法說明，協助使用者理解數字及原廠術語。
3. **玩法探索系統**：讓使用者以 Search、Explorer、Game detail、Compare 及可解釋條件找到遊戲。
4. **資料可信度**：保留原廠值、統一值、缺值、版本、來源、樣本範圍與最後核對日期。

四支柱承接 v1 的五個組成部分；Search、Explorer 與 Compare 歸入玩法探索，Guide 歸入資料解讀，來源與核對資訊歸入資料可信度。

### 1.3 `DECIDED` 長期方向

- 長期定位仍是「廣泛而可靠的遊戲資料庫」。
- 遊戲依搜尋需求、資料可靠度及結構補位價值分批擴充。
- Slot Hub 不是只收少量精選遊戲的名單，也不是未驗證就大量匯入作品的目錄。
- 台灣搜尋需求是收錄優先順序依據之一，不是發布硬門檻。
- 未知、未核對或有來源差異的資料保留缺值、原文或差異，不為提高完整率自行補造。
- Slot Hub 不以預測輸贏、保證獲利或不透明推薦為核心；資料理解與風險教育不等於投注建議，邊界見第 3 章與第 14 章。

### 1.4 `DECIDED` 可保留的未來能力

本定位不排除未來另案加入具有清楚資料來源、方法、限制、揭露及人工核准的：

- CPA 合作平台連結。
- Slot Hub 站內熱門。
- 明確條件式遊戲配對。
- Provider 收錄樣本統計。
- 有資料支持的排行或市場觀察。

上述能力目前不因被記錄而取得施工授權；其中高資料門檻項目必須先通過第 17 章的研究條件。

## 2. 核心使用者需求

Slot Hub 應持續服務以下需求：

1. 已知道遊戲名稱，直接搜尋正式名稱、繁中名稱、aliases 或 Provider。
2. 不知道遊戲名稱，依可核對的條件探索。
3. 選出一至三款遊戲，並排查看資料差異及限制。
4. 看過一款遊戲後，找到同系列、同 Provider 或具有相同玩法條件的遊戲。
5. 看懂 RTP、多版本 RTP、波動度、最高倍數、Mechanism、Feature 及原廠術語。
6. 了解 Provider、系列、玩法與資料方法。
7. 確認資料來源、版本、樣本邊界、最後核對日期及可比較程度。

## 3. 網站範圍與近期限制

### 3.1 `DECIDED` 核心範圍

- 老虎機仍是網站核心。
- Slot Hub 不直接提供遊戲或下注服務。
- Slot Hub 不把最高倍數、RTP、波動度、Feature 或排名解讀成下一次結果。

Slot Hub 不提供：

- 保證獲利方法。
- 下一次結果預測。
- 宣稱能擊敗 RNG 的投注排列。
- 個人化下注金額建議。
- 追損或致勝公式。

以下教育性內容可以保留研究及內容提案資格，但每次仍需人工核准：

- 如何閱讀 Paytable。
- Bonus Buy 成本及投注基準換算。
- 固定預算與 Spin 次數的純數學換算。
- 為什麼追損不能改變遊戲機率。
- 為什麼提高投注額不代表提高 RTP。
- 風險、機率及常見投注迷思說明。

這些內容必須定位為資料理解與風險教育，不得轉化為獲利承諾或個人下注建議。

### 3.2 `CURRENT` 捕魚機

- `/fishing-games/` 與基礎 Guide 保留。
- 目前仍沒有成熟的 published fishing Game 資料或專屬資料模型。

### 3.3 `DEFERRED` 捕魚機擴建與輪盤

- Fishing 專屬資料模型、Explorer 與大量內容，等待成熟 published data。
- 輪盤仍只是保留方向，不代表已核准入口、內容或資料模型。

### 3.4 近期不採用的基礎設施與帳號能力

近期不使用或不建立：

- D1、CMS 或自建後台。
- 會員、登入、收藏、閱讀進度或付費功能。
- 黑盒 AI 推薦或 AI 語意搜尋。

目前以 Astro Content Collections、靜態建置、可追溯 Markdown 與既有驗證流程為主。

#### R2／媒體儲存邊界

- 目前不導入 R2；現有圖片及媒體仍使用目前已核准方式。
- 架構可保留未來 R2／媒體儲存接口的可能性。
- 只有資料量、圖片管理、授權或媒體需求成熟後，才能另案評估。
- 預留接口不代表取得施工授權。

## 4. `CURRENT` 產品基線

### 4.1 內容與關聯

| 項目 | 目前數量／狀態 |
| --- | ---: |
| Published Game | 30 |
| Published Provider | 11 |
| Published Guide | 11 |
| Game → Guide 唯一關聯 | 166 |
| Game detail 關聯呈現 | 162 直接顯示／4 overflow／0 遺失 |
| Sources 與最後核對日期 | 30／30 Game |

### 4.2 已完成底座

- Game detail、圖片、Provider、系列／相關遊戲、來源與缺值呈現。
- Game Explorer v2：Provider、Mechanism、Feature AND、RTP、統一波動度、最高倍數、Subtype、排序與分享 query。
- Search：Game、Provider、Guide、Mechanism／Feature 概念及「了解概念／探索遊戲」意圖。
- Compare：最多三款、URL、localStorage、缺值、固定欄及手機內部捲動。
- Guide relationship：Mechanism、Feature、Data Topic、Game、Guide 的正反向投影。
- Game detail knowledge presentation：欄位情境入口、Feature direct／overflow、全頁去重。
- Guide detail：代表遊戲、精確 Mechanism／Feature Explorer CTA、Data Topic 無假篩選入口。
- Guide typography、閱讀版型及三個已核准 Knowledge Diagram。
- Draft／published 隔離、資料審計、Search、Explorer、relationship、Build、內部連結及 Preview safeguards。

### 4.3 仍屬基礎版

- Search query 尚不能完整分享、重新整理恢復或與首頁狀態交接。
- Explorer／Compare browser history 行為未完全一致。
- Game detail 尚無清楚的「相同玩法條件」探索入口。
- Compare 尚未完整表達原廠尺度、RTP variants、最高倍數原始標籤與比較限制。
- Provider 頁偏薄，且仍有過時的「首批／四家 Seed Data」文案。
- Guide 閱讀路線尚未在首頁、Guide index 與 Slots 形成一致內容組織。
- `/slots/` 的 Data Topic 仍可能顯示沒有精確 `href` 的假探索 CTA。

## 5. 既有頁面與功能角色

### 5.1 `CURRENT` 公開頁型

- 首頁 `/`
- 遊戲庫 `/games/`
- Game detail `/games/{slug}/`
- Slots Hub `/slots/`
- Fishing Hub `/fishing-games/`
- Provider index `/providers/`
- Provider detail `/providers/{slug}/`
- Guide index `/guide/`
- Guide detail `/guide/{slug}/`
- Tool index `/tools/`
- Search `/search/`
- Compare `/compare/`
- RSS、sitemap 與 404

程式內 URL helper、reserved slug、空 catalog 或動態模板不等於已完成產品頁。

### 5.2 首頁

- 提供產品定位、快速 Search、新手入口、嵌入式 Explorer、精選遊戲、Guide 與 Provider 入口。
- 首頁應是入口與方向選擇，不取代完整 Search、Games、Slots 或 Guide index。

### 5.3 Search

- 用於使用者已知道或記得文字時，搜尋正式名稱、原文名稱、繁中名稱、aliases、Provider、Guide 及已建立正式關聯的概念。
- Search 不是結構化篩選的替代品。
- Search 結果頁屬工具用途，維持 noindex 原則。

### 5.4 Explorer／Games

- `/games/` 是完整篩選、排序與分享狀態的唯一 owner。
- 首頁及 `/slots/` 可嵌入相同 Explorer，但必須把條件交接到 `/games/?...`，不能形成三套 faceted URL。
- 缺值在未啟用相關篩選時保留；啟用數值條件時排除，不視為 0。
- Feature 多選維持 AND；不同 facet 之間維持 AND。

### 5.5 Game detail

- 是單款 Game 的永久資料頁及來源查核核心。
- 顯示身份、名稱、Provider、系列、核心數據、完整資料、Mechanism、Features、圖片、來源及核對日期。
- 提供加入 Compare、同系列、同 Provider、Guide 及未來核准的相同玩法入口。
- 同系列、同 Provider、相同玩法條件必須清楚分開，不能互相冒充。

### 5.6 Compare

- 最多三款，只並排已有資料。
- 不替使用者判定「哪款比較容易贏」。
- 缺值不補 0，不將不同原廠尺度強制換算。
- Compare query 是分享工具狀態，不建立大量 SEO 頁。

### 5.7 Guide

- Guide 負責解釋概念與資料限制，不替代 Game facts。
- 一個概念只有一個正式 relationship owner。
- Guide 可顯示衍生代表遊戲，並以精確 Mechanism／Feature query 連到 Explorer。
- Data Topic 沒有精確結構化 filter 時，只顯示「了解概念」、代表遊戲及 Game 反向關聯；不得用 `?q=概念名稱` 冒充篩選。
- Guide relationship 由 Guide frontmatter 單向宣告，Game 不手抄第二份 Guide 關係。

### 5.8 Provider

- Provider 是獨立實體及永久 Hub／頁面。
- 可承載正式名稱、aliases、角色、品牌、母組織、子品牌、region／market、官方來源及目前收錄 Game。
- 只有已有來源的內容才能對外呈現；schema 中存在欄位不等於可以補猜。

### 5.9 Tool

- Tool 服務使用者任務，不因有動態模板就自動建立永久頁。
- 目前正式工具是 Search、Explorer 與 Compare。
- 新 Tool 必須先有可說明的使用者問題、資料輸入、輸出限制與人工核准。

## 6. 核心內容實體與資料關係

### 6.1 Game

- Game 是核心實體。
- Search、Explorer、Compare、Provider 關聯、Guide 關聯及遊戲卡使用同一 published Game projection。
- 未核對欄位留空；自由文字不能在多個入口各自推導不同結構化事實。

### 6.2 Provider

- Provider 與 Game 分開管理。
- Game 必須連到正確 published Provider。
- Provider 合作或平台供應不能自動推論該 Provider 所有遊戲都在某平台可取得。

### 6.3 Series、品牌／角色宇宙與相同玩法

- **正式系列**：只有官方或可靠來源確認的系列、續作或代數關係。
- **品牌／角色宇宙**：共享角色、品牌、IP 或世界觀，不必然是續作。
- **相同玩法條件**：由已存在的 Mechanism 或 Feature 提供可解釋探索，不是系列，也不是推薦。
- 共同名稱、角色、題材或 Feature 不得自行宣稱正式系列。
- 獨立 Series entity、Series Collection、Franchise 頁與永久系列頁維持 `DEFERRED`。

### 6.4 Mechanism

Mechanism 指一般中獎組合如何成立。現有結構化值維持：

- Paylines
- Ways to Win
- Megaways
- Cluster Pays
- Pay Anywhere
- Other

Scatter symbol 是 Feature，不等於 Scatter Pays。特殊原廠名稱無法可靠正規化時保留原文，不擴充 enum。

### 6.5 Feature

Feature 指可觸發、改變玩法或影響回合的功能。既有 taxonomy 與「先保留原文、重複且定義穩定後再提案」原則維持不變。

- Feature 可以作 Explorer filter 及 Guide relationship。
- Feature 不自動取得永久 SEO 頁。
- Feature 與 Mechanism 不得因名稱相似而混同。
- 新 enum／taxonomy 仍需獨立人工決策。

### 6.6 Guide relationship

目前 Guide 可使用：

- `relatedMechanisms`
- `relatedFeatures`
- `relatedDataTopics`

Data Topic 固定為 `rtp`、`rtp-variants`、`volatility`、`max-win`。`relatedGames`、`relatedProviders` 不納入目前 Guide Schema。resolver 由 published Guide 宣告與 published Game facts 推導正反向關係。

### 6.7 遊戲 DNA

遊戲 DNA 是第 9 項單款 Pilot 的呈現概念，不是新的關係或分數。第一版不得建立獨立 Game 端第二份資料 mapping。

## 7. 資料、缺值與可比較原則

### 7.1 原廠值與 Slot Hub 統一值

- 原廠值保存原始標籤、單位、版本、條件及來源。
- Slot Hub 統一值只在定義與基準足以承接時建立。
- 統一值是編輯層，不得宣稱為全產業共同標準。
- 原廠標籤仍須保留，不能因有統一值就刪除語境。

### 7.2 缺值

- 缺值代表目前未知、未公開、未取得或無法安全統一。
- 缺值不等於 0、不等於沒有、不等於不支援。
- 不從同系列、Provider、外觀、玩法、RTP、最高倍數或短期試玩補猜其他欄位。
- 資料不足時可以發布有獨立價值的 Game，但不得只剩名稱與大量空欄。

### 7.3 多版本與來源差異

- 同款 Game 的不同 RTP、規則、市場或版本需保留來源及差異。
- 歷史文件差異不自動等同當前可選版本。
- 不同原廠的 Low／Medium／High、數字量表、Max Win label 或投注基準不能直接按比例換算。

### 7.4 可比較程度

資料可在產品中標示為：

1. 可直接比較。
2. 必須保留警告。
3. 不能統一比較。

判斷依據包括原始標籤、投注基準、整局／局部範圍、版本條件、原廠尺度及來源完整度。

## 8. 來源與圖片原則

### 8.1 文字資料來源層級

1. 官方 Game Rules、Paytable、遊戲內 Help、正式技術文件、官方遊戲頁及官方 Client Hub。
2. 官方新聞稿與正式合作發行資料。
3. 官方授權合作方或聚合平台；只補官方缺值，且必須清楚標示。
4. 有編輯責任的產業資料庫或媒體；只作交叉線索。
5. 一般娛樂城、聯盟、轉載、搜尋摘要、AI 回答、無來源文章與社群轉述；不得作正式精確事實來源。

RTP、波動度、最高倍數、投注條件、Feature 規則與版本差異優先要求第一層來源。來源衝突可判讀且不影響核心可靠性時完整保存；重大且未解決、會影響身份、核心數值、Provider、系列或發布可靠性時停止。

### 8.2 圖片來源

優先使用：

- 官方遊戲頁、Media／Press Kit、官方 CDN、官方規則或正式新聞稿素材。
- 權利與來源清楚的官方授權合作方素材。

不使用搜尋圖片結果、來源不明下載、其他網站浮水印圖片或 AI 仿製官方 Logo／作品圖。圖片至少保存來源 URL、取得日期、官方性質、尺寸及裁切／轉檔說明。

### 8.3 樣本統計

所有 Provider、Mechanism、Feature、熱門或市場觀察統計都必須說明母體。Provider Hub v2 的文字固定限定為：

> 在 Slot Hub 目前收錄的遊戲中……

樣本不足時不得對整個 Provider 或全市場下普遍結論。

## 9. Game／Provider 收錄與發布

### 9.1 選擇原則

- 台灣搜尋需求。
- 官方資料完整度。
- Provider、Mechanism、Feature、Series 或資料結構補位價值。
- 系列與內部連結價值。
- Provider 代表性。

不得使用虛構搜尋量、推測流量或娛樂城大廳排序認定熱門。

### 9.2 候選、草稿與發布

- `CANDIDATE` 只保存候選名稱與目的，不建立 Game。
- 通過只讀驗證後才能建立 draft、Provider draft 及官方圖片。
- draft 必須通過公開路由、Search、Compare、Provider、sitemap 與內部連結隔離。
- 只有完成 Preview Review 並取得人工核准，才能由 draft 改為 published。
- Push、部署及正式索引變更各自需要明確人工核准。

完整操作狀態與固定出口沿用 `docs/game-intake-workflow-v1.md`，本藍圖不複製整套工作流。

## 10. Guide 內容與呈現原則

- Guide 選題、Brief、來源、草稿、模擬 published、關聯所有權、人工審查與 Preview 發布沿用 `docs/guide-content-workflow-v1.md`。
- Guide 應教使用者理解資料，不提供保證獲利、下一次結果預測、RNG 破解排列、個人化下注金額建議、追損或致勝公式；教育性的投注資料與風險內容須依第 14 章另案取得人工核准。
- 精確規則及數值須回到第一方來源；找不到語境時刪除或降低敘述。
- Knowledge Diagram 是可選資訊模組，不要求每篇 Guide 套用，也不建立第二份內容 mapping。
- Guide Typography、手機可讀性、無 JavaScript、列印、forced colors 與水平溢位規則繼續適用。
- 首頁、Guide index 與 Slots 的閱讀路線可以調整內容組織，但不自動建立新永久頁。

## 11. 永久頁、工具狀態與 SEO

### 11.1 永久頁

- Game detail、Provider、Guide、Slots Hub、Fishing Hub 及經人工核准的內容入口可作永久頁。
- Series、Franchise、Mechanism 或 Feature 永久頁需另行審查搜尋意圖、資料量、內容厚度、重複風險及主入口。

### 11.2 工具狀態

- `/games/?...`、Search query、Compare query 及任意複合篩選是分享工具狀態。
- 工具狀態不自動進 sitemap，不批量建立靜態 SEO 頁。
- 同一搜尋意圖不能同時建立互相競爭的 Guide、集合頁及篩選頁。

### 11.3 `CURRENT` Preview safeguards

- Preview HTML：`noindex,nofollow`。
- Preview HTTP Header：`X-Robots-Tag: noindex, nofollow`。
- Preview sitemap：空 URL 集合。
- Preview 不輸出 production canonical。
- 每次 Build、Preview 部署及線上回讀都必須驗證以上條件。

正式索引、canonical、sitemap 與網域切換仍需獨立人工核准；本藍圖不授權修改。

## 12. 正式施工順序

以下第 1～10 項是已核准的產品順序；每一項仍需依範圍先完成規格、人工審查及獨立施工授權。任何時候只進行一個主要項目，旁支問題不得自行插隊。

### 第 1 項：第二輪產品設計

目前狀態：

- `已完成`。
- 競品研究完成。
- 第二版產品核心完成。
- 功能地圖完成。
- 人工核准完成。
- v2 藍圖及工作路線表已正式定稿並保存。

本項結束條件已達成。第 2 項仍為 `尚未開始`；開始前須重新核准範圍，第一個允許動作只有建立只讀產品與互動規格，不得直接進入本機製作或網站施工。

### 第 2 項：核心動線一致性

第一個網站施工項目。範圍：

- Search query 可分享及重新整理恢復。
- 首頁 Search 與完整 Search 狀態交接。
- 修正 `/slots/` 無 `href` 的 Data Topic 假 CTA。
- Explorer／Compare browser history 行為一致。
- 移除「首批資料」「第一版四家」等過時文案。
- 明確區分首頁、Slots、Games 的用途。

不包含全面重做首頁、新搜尋演算法、新 Schema 或 CPA。

### 第 3 項：Game detail 相同玩法探索

範圍：

- 相同 Mechanism 入口。
- 相同 Feature 入口。
- 從 Game detail 開啟精確 Explorer 條件。
- 清楚區分同系列、同 Provider 及相同玩法條件。
- 使用「探索相同玩法」等可解釋用語。

不得使用不透明相似度分數、「猜你喜歡」、「推薦你玩」、虛構系列或推薦關係。第一版優先使用單一可解釋條件，不強迫多條件 AND。

### 第 4 項：Compare 資料判讀 v2

候選資料：

- RTP 與 RTP variants。
- 原廠波動度與 Slot Hub 統一波動度。
- 最高倍數與最高倍數原始標籤。
- Mechanism、核心 Feature 及缺值狀態。

比較解讀可標示：可直接比較、必須保留警告、不能統一比較、原廠尺度不同、局部 Feature 上限及對應 Guide。

不得建立「比較容易贏」結論、總分、加權排名或補猜缺值。

### 第 5 項：Provider Hub v2

範圍：

- Provider → filtered Explorer。
- Slot Hub 收錄 Game 數與資料覆蓋狀態。
- 有來源的母公司、子品牌、aliases、region／market。
- 目前收錄樣本中的 Mechanism／Feature 分布。
- 官方來源及核對日期。

所有統計必須明確限定 Slot Hub 收錄樣本，樣本不足時不對整個 Provider 下普遍結論。

### 第 6 項：資料方法與可信度入口

使用者名稱建議：**Slot Hub 如何整理遊戲資料**。

內容：原廠值、Slot Hub 統一值、缺值、多版本、來源優先順序、最後核對日期、可比較與不宜比較、第三方資料標示及樣本統計限定方式。

這是使用者可閱讀的方法入口，不是工程規格書，也不重寫 RTP、Volatility、Max Win 專門 Guide。

### 第 7 項：Guide 閱讀路線 v1

閱讀路線：

- 第一次使用。
- 核心數據。
- 玩法機制。
- 遊戲功能。
- 資料限制。

第一版只調整首頁、Guide index 及 Slots 的內容組織；不新增學習帳號、閱讀進度、會員或大量路線薄頁。

### 第 8 項：引導式遊戲探索

只核准 Pilot。

- 是現有 Explorer 的友善入口，不是推薦引擎。
- 將使用者選擇轉成可見、可編輯、可分享的 Explorer 條件。
- 不建立黑盒 AI 推薦。
- 不使用「適合你玩」「比較容易贏」或個人下注建議。

Pilot 完成人工內容、互動及視覺審查後，才決定是否擴大。

### 第 9 項：遊戲 DNA

只核准單款 Pilot。候選內容：

- 核心數據狀態。
- Mechanism 與主要 Feature。
- RTP versions。
- 波動度標示。
- 最高倍數基準。
- 資料完整狀態。
- 相同玩法入口。

遊戲 DNA 不是分數、排名或推薦。Pilot 通過人工內容與視覺審查後，才決定是否套用全部 Game detail。

### 第 10 項：Game／Provider 擴充

長期持續工作，不視為單次功能：

- 沿用既有 intake workflow。
- 使用第一方來源與可追溯圖片。
- 保留缺值及來源差異。
- 維持 Guide relationship 規則。
- 不以數量取代資料可靠性。
- 可在每個產品項目結束後，以獨立人工核准範圍交錯進行。

第四批數量與候選名單尚未核准。

## 13. CPA／合作平台保留能力

CPA 不排入第 2～10 項施工順序，目前只記錄能力與啟用條件。

### 13.1 使用者與產品邊界

- 未來使用者可從單款 Game detail 前往經驗證、提供該遊戲的合作娛樂城。
- Slot Hub 本身不能直接啟動遊戲。
- 目前不保證免費 Demo。
- 到達娛樂城後，使用者仍可能需要註冊、登入或自行搜尋遊戲。

### 13.2 啟用條件

- 單款 Game 與平台供應關係可驗證。
- 連結目的地與 CTA 文案一致。
- 沒有供應資料時不顯示。
- 合作／推廣關係清楚揭露。
- CPA 啟用、追蹤、失效檢查及合規另案人工核准。

不得把 Provider 合作推定為該 Provider 全部 Game 都能在平台取得，也不得以一般 Provider 頁取代單款供應證據。

## 14. Research Directions／條件成熟區

本區不是永久禁止清單，也不是施工 backlog。每個方向在提案前必須回答：

1. 對使用者宣稱什麼。
2. 需要什麼資料支持。
3. 資料屬於原廠、Slot Hub 或第三方。
4. 是否容易被誤解成預測或保證。
5. 更新頻率及失效處理。
6. 資料不足時能否縮小名稱、母體及適用範圍。

### 14.1 可用現有方式研究

- **Slot Hub 站內熱門**：只使用可驗證的站內行為資料，名稱清楚限定為 Slot Hub，不代表全市場熱門。
- **明確條件式個人化探索**：使用者自己選條件，輸出可見 Explorer filters，不建立黑盒個人推薦。
- **有足夠內容厚度的 Feature 永久頁**：先審查搜尋意圖、內容重複及 owner，不因 taxonomy 存在自動建頁。
- **Provider 收錄樣本統計**：只說明 Slot Hub 已收錄母體，不代表 Provider 全產品線。

### 14.2 投注資料與風險教育

- **定位：** 資料理解與風險教育的研究方向，不是投注策略或獲利建議。
- **狀態：** 研究方向；不排入第 2～10 項施工順序。
- 可研究如何閱讀 Paytable、Bonus Buy 成本及投注基準、固定預算與 Spin 次數的純數學換算、追損與 RNG 機率、投注額與 RTP 的關係，以及常見投注迷思。
- 每一項內容提案仍需人工核准，且不得轉化為獲利承諾、下一次結果預測、擊敗 RNG 的排列、個人下注建議或追損公式。

### 14.3 需要新資料源

- 全市場熱門。
- 大型 Hit Frequency 比較。
- 即時 Hot／Cold。
- 實際 Spins／Bets／Wins 分析。
- 娛樂城單款 Game 供應映射。

這些方向必須先取得合法、可追溯、可更新且能支持宣稱的新資料源。

### 14.4 不以目前名稱直接實作

- 勝率最高。
- 最容易贏。
- 保證獲利策略。
- 下一次結果預測。

若未來重新提案，必須先改寫成可驗證、不造成保證或預測誤解的宣稱；無法誠實改寫就不建立。

## 15. 維持延後或禁止的項目

| 項目 | v2 近期狀態 |
| --- | --- |
| D1、CMS、自建後台 | `DO_NOT_BUILD_YET` |
| R2／媒體儲存 | 目前不導入；保留未來接口可能性，只有資料量、圖片管理、授權或媒體需求成熟後才能另案評估，預留接口不代表施工授權 |
| 會員、登入、收藏、閱讀進度、付費 | `DO_NOT_BUILD_YET` |
| 無資料支持的推薦 | `DO_NOT_BUILD_YET` |
| 排行／預測型產品 | `DO_NOT_BUILD_YET`；只有第 14 章的研究資格，不得直接施工 |
| 大量薄 Feature 頁 | `DO_NOT_BUILD_YET` |
| 每個標籤自動建立永久頁 | `DO_NOT_BUILD_YET` |
| Series／Franchise 頁 | `DEFERRED`；等待數量、需求及內容厚度 |
| Fishing 專屬資料模型與 Explorer | `DEFERRED`；等待成熟 published fishing data |
| AI semantic search／黑盒推薦 | `DO_NOT_BUILD_YET` |
| 任意 filter query 大量索引 | `DO_NOT_BUILD_YET` |
| Wix／migration／301／410／GSC／DNS／舊內容搬移 | `OUT_OF_SCOPE FOR NEW-SITE ROADMAP` |

Wix／migration／301／410／GSC／DNS／舊內容搬移不屬第 1～10 項施工順序，也不會在第 10 項完成後自動恢復。不得要求相關資料，不得自行開始盤點或施工；只有使用者未來明確開啟新的獨立範圍時，才可重新討論。

## 16. 施工與協作原則

- 任何時候只能有一個主要項目處於進行狀態。
- 每一項先做只讀規格，再由人工核准本機實作、Commit、Push 與部署。
- 工程回報先說明使用者可理解的進度，再提供技術驗證。
- 每次明確回報是否修改網站、是否 Commit、是否 Push、是否部署。
- 旁支問題先記錄，不得自行插隊。
- 必須插入的 blocker 修正使用原項目的子編號，完成後回到原項目。
- 發現非預期檔案、範圍擴張、Schema／taxonomy 決策、遠端新 Commit 或重大來源衝突時停止。
- 已核准的 workflow 固定尾段及人工關卡繼續適用。

## 17. v1 與 v2 待人工確認的差異

以下不是本文件自行解決的衝突；只有人工核准 v2 並明確升級後才能成為新決策：

1. **產品組成方式**：v1 使用五個互連部分；v2 重組為四個正式產品支柱。功能沒有被刪除，但分類與表述改變。
2. **現況基線**：v1 的 12 Game／4 Provider／6 Guide 與「Guide relationship 尚未實作」已被現況超越；v2 更新為 30／11／11、166 筆關聯及已完成底座。
3. **Explorer 現況**：v1 記錄無排序、無 Mechanism／Feature／最高倍數篩選；v2 記錄 Explorer v2 已完成。
4. **分享狀態**：v1 將 Explorer URL 格式及 Guide 雙向關聯列為 `DEFERRED`；v2 將已落地能力列為 `CURRENT`，但 Search URL 與完整 browser history 仍列第 2 項。
5. **熱門／排行邊界**：v1 將熱門排行列為 `DO_NOT_BUILD_YET`；v2 仍禁止近期施工，但允許「Slot Hub 站內熱門」及有資料支持的排行／市場觀察進入 Research Directions。這是研究資格，不是實作授權。
6. **Feature 永久頁**：v1 近期禁止；v2 仍禁止自動或大量薄頁，只允許內容厚度、搜尋意圖與 owner 都成熟後重新提案。
7. **CPA**：v1 未定義 CPA；v2 新增保留能力與嚴格啟用條件，但不排入施工順序。
8. **舊種子候選與第一批流程**：v1 的 18 款候選及第一批六款是歷史啟動方案；目前已有 30 款 published Game。v2 保留 intake 原則，不再把舊名單當成目前施工順序。

## 18. Decision Log

| 日期 | 狀態 | 決策 |
| --- | --- | --- |
| 2026-08-28 | `DECIDED` | Slot Hub 定位為廣泛且可靠的遊戲資料庫，採分批優先擴充。 |
| 2026-08-28 | `DECIDED` | 台灣搜尋需求作為優先排序，不作發布硬門檻。 |
| 2026-08-28 | `DECIDED` | 老虎機為核心；捕魚機保留但暫不擴大。 |
| 2026-08-28 | `DECIDED` | Feature 初期作標籤與篩選，不自動建立永久頁。 |
| 2026-08-28 | `DECIDED` | 同一概念搜尋意圖只設一個主要入口。 |
| 2026-08-28 | `DECIDED` | 正式系列、品牌／角色宇宙與相同玩法分開判斷。 |
| 2026-08-29 | `DECIDED` | v1 通過人工審查，成為 `APPROVED v1`。 |
| 2026-08-29 至 2026-08-31 | `CURRENT` | Game Explorer v2、Guide relationship foundation、Game detail knowledge presentation、Guide typography、三個 Knowledge Diagram 與三篇核心 Guide 補強已完成。 |
| 2026-08-31 | `CURRENT` | 產品基線更新為 30 Published Games、11 Published Providers、11 Published Guides 與 166 筆 Game → Guide 關聯。 |
| 2026-08-31 | `DECIDED` | 第二輪產品設計的四支柱與第 1～10 項施工順序已人工核准，先建立 v2 草稿與 roadmap。 |
| 2026-08-31 | `DECIDED` | CPA 只列保留能力；高資料門檻功能進入 Research Directions，不取得近期施工權。 |
| 2026-08-31 | `APPROVED v2` | v2 藍圖與工作路線表通過人工核准；v2 成為目前最高產品與施工順序依據，v1 保留為歷史決策文件，第 1 項正式完成。 |

## 19. 文件出口

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_STATE: CLOSED`

`CURRENT_ITEM: 第1項 Slot Hub第二輪產品設計`

`CURRENT_STEP: 第1-6步 正式定稿並保存V2藍圖`

`BLUEPRINT_STATUS: APPROVED_V2`

`V2_IS_CURRENT_PRODUCT_AUTHORITY: YES`

`V1_RETAINED_AS_HISTORICAL_RECORD: YES`

`WEBSITE_CHANGED: NO`

`COMMIT_ALLOWED: NO`

`PUSH_ALLOWED: NO`

`DEPLOY_ALLOWED: NO`

`HUMAN_APPROVAL_REQUIRED: YES；開始第2項前重新核准範圍`

`NEXT_ALLOWED_ACTION: 開始第2項核心動線一致性的只讀產品與互動規格`
