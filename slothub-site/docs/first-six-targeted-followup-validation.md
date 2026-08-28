# 第一批六款定向補證：Gates Mechanism 與 Provider 草稿規格

> **READ-ONLY VALIDATION — NOT AN IMPLEMENTATION AUTHORIZATION**
>
> 本文件只補證 Gates of Olympus 的基礎中獎機制，並準備 PG SOFT 與 Pragmatic Play 的 Provider 資料草稿規格。它不是 Schema、taxonomy、enum、Provider、Game、圖片或網站修改授權，也不是建立或發布內容的授權。

- 資料核對日期：2026-08-29（Asia/Taipei）
- 依據藍圖：`docs/slot-hub-master-blueprint-v1.md`（`APPROVED v1`）
- 藍圖 Commit：`9099e72eeda4ce9d0fa0fa1082cabd4c1dfdc590`
- 前次報告：`docs/first-six-games-readonly-validation.md`
- 本輪未執行：Schema/taxonomy/enum 修改、Provider 或 Game Collection 建立、圖片下載、網站修改、Build、部署、Push、Commit

## 1. 結論摘要

| 問題 | 本輪結論 |
|---|---|
| Gates 是否已有足夠證據完成 Mechanism 分類？ | **是。主要 Mechanism 可判定為 `Pay Anywhere`。** |
| Gates 是 Paylines 嗎？ | **否。**正式 Game Rules 以同符號總數判定，不依固定賠線。 |
| Gates 是 Cluster Pays 嗎？ | **否。**規則不要求符號相鄰或形成 cluster；官方發布稿的 `clusters of eight or more` 不足以推翻正式規則。 |
| Tumble 是第二個主要 Mechanism 嗎？ | **否。**官方 Game Rules 將它獨立命名為 `TUMBLE FEATURE`。 |
| Scatter Pays 是 Gates 的主要 Mechanism 嗎？ | **否。**規則中的 `SCATTER pays on any position` 只描述 Scatter 符號自己的賠付位置。 |
| 是否需要新增 `pay-anywhere` enum？ | **值得進入 Schema/taxonomy 審查。** Gates 與 Sweet Bonanza 已形成跨兩款的官方用語證據；但本輪不修改 enum。 |
| 是否需要新增 `scatter-pays` enum？ | **本輪證據不足。**不能由 Scatter 符號可在任意位置賠付，推導整款遊戲的主要 Mechanism 是 Scatter Pays。 |
| 是否需要多 Mechanism Schema？ | **不需要。**本例是一個主要 Mechanism 加上 Tumble Feature 與 Scatter symbol 規則。 |
| 兩家 Provider 能否用現有 Schema 建立？ | **可以建立 draft。**必要欄位可承接；Logo 可先省略，待另行授權下載後再填完整 media object。 |
| 真正阻礙下一步的問題 | 沒有阻礙建立 Provider／Game 草稿的問題；精確所在地語意、多來源追溯及語言完整清單屬非阻擋缺口。 |

## 2. Gates of Olympus 定向補證

### 2.1 高權重來源

1. [Pragmatic Play 官方 Gates of Olympus 遊戲頁](https://www.pragmaticplay.com/en/games/gates-of-olympus/?cur=USD&gamelang=en)
   - 現行頁明確說明 8–30 個相同符號可在轉軸任何位置形成得獎。
   - `What to expect` 明寫 symbols pay anywhere across six tumbling reels。
2. [官方頁嵌入的 Pragmatic Play Demo／原作遊戲端點](https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&lobby_url=https%3A%2F%2Fwww.pragmaticplay.com%2Fen%2F&lang=en&cur=USD)
   - 官方遊戲頁 HTML 直接以 `data-game-src` 嵌入此端點。
   - 原作識別：`gameSymbol=vs20olympgate`。
   - Game Rules 第 1/7 頁的核心原文是短句：`Symbols pay anywhere on the screen.`
   - 同頁接著說明：一個 spin 結束時，畫面上相同符號的總數決定得獎值。
   - Game Rules 第 2/7 頁另以 `TUMBLE FEATURE` 為標題，說明得獎符號消失、其餘符號下落並補入新符號。
3. [2021-02-24 官方發布稿](https://www.pragmaticplay.com/en/news/pragmatic-play-aims-for-the-heavens-in-gates-of-olympus/)
   - 同時出現 `20 paylines`、`Pay Anywhere` 與 `clusters of eight or more`，保留為來源文字衝突紀錄。
   - 因證據權重低於現行正式 Game Rules，不再直接用來分類 Mechanism。

### 2.2 正式規則的判讀

| 候選分類 | 判定 | 理由 |
|---|---|---|
| Pay Anywhere | **確認** | 正式 Game Rules 與現行官方產品頁一致；得獎依畫面上同符號總數，不依位置連線。 |
| Paylines | **排除為主要 Mechanism** | Game Rules 的賠付表按 8–9、10–11、12–30 個符號分級，沒有固定線路判定。發布稿的 20 paylines 視為混合／錯置文字。 |
| Cluster Pays | **排除** | 正式規則沒有相鄰、水平／垂直接觸或 cluster 形狀要求。`clusters of eight or more` 只是衝突發布稿中的用語。 |
| Scatter Pays | **不作主要分類** | Game Rules 的 `SCATTER pays on any position` 是 Scatter 符號規則；一般付費符號仍由 Pay Anywhere 總數規則處理。 |
| Tumble | Feature | 官方規則自行稱為 `TUMBLE FEATURE`；它改變連續得獎流程，不是判定第一個得獎組合的規則。 |

### 2.3 Mechanism 最終結論

- 本輪已取得足夠的高權重公開證據完成分類。
- 建議官方原文保存為：`Symbols pay anywhere on the screen.`
- Slot Hub 機制名稱：`Pay Anywhere`。
- 不映射成 `paylines`、`cluster-pays` 或 `ways-to-win`。
- `Scatter` 保留為 Feature／特殊符號；`Tumble` 可沿用既有 `cascading` Feature 類別並另存官方原詞。
- 前次 `TAXONOMY_DECISION_NEEDED` 的「證據不足」原因已解除；在不建立資料的前提下，本作可提升為 **`ELIGIBLE_FOR_DRAFT`**。
- 這個結論只更新本補證報告，不回寫前次報告，也不建立 Game Collection 檔案。

### 2.4 Enum 與 Schema 判斷

#### `pay-anywhere`

- 現有 enum 是 `paylines`、`ways-to-win`、`megaways`、`cluster-pays`、`other`，無法精確保存官方 `Pay Anywhere`。
- Gates 的正式規則已確認此詞；Sweet Bonanza 的官方系列回溯資料也稱原作為 pays-anywhere slot。
- 因為已跨兩款、具搜尋與解釋價值，**新增 `pay-anywhere` 值是合理的後續架構候選**。
- 本輪只提出審查建議，不構成 enum 修改授權。

#### `scatter-pays`

- 本輪沒有找到 Pragmatic Play 將 Gates 的整體基礎中獎機制定義成 `Scatter Pays` 的高權重資料。
- Scatter 符號在任意位置賠付，不等於一般符號採 Scatter Pays。
- **目前不建議只為 Gates 新增 `scatter-pays` enum。**應等待其他遊戲的官方規則直接使用該詞，再決定是獨立值、搜尋別名或 `pay-anywhere` 的同義映射。

#### 多 Mechanism Schema

- Gates 目前沒有三個並列主要 Mechanism 的證據。
- 可用一個主要 Mechanism `Pay Anywhere`，搭配 `Tumble` Feature 與 `Scatter` Feature 表達。
- **不需要把 `winMechanism` 改成陣列。**
- Game draft 若在 enum 審查前建立，可暫時省略選填的 `winMechanism`，並在摘要／原廠文字中保存 Pay Anywhere；不應暫塞 `other`、`paylines` 或 `cluster-pays`。

## 3. PG SOFT Provider 草稿規格

### 3.1 官方來源

- [PG SOFT 官方 Company 頁](https://www.pgsoft.com/en/company/)
- [PG SOFT 官方遊戲目錄](https://www.pgsoft.com/en/games/all/)
- [PG SOFT 官方首頁](https://www.pgsoft.com/en/)
- [PG SOFT 官方 Privacy 頁／聯絡地址](https://www.pgsoft.com/privacypolicy/)
- 官方黑色完整品牌 Logo：[nav_common_logo_black@2x.png](https://www.pgsoft.com/_nuxt/img/nav_common_logo_black@2x.b4708a2.png)

### 3.2 欄位草稿

| Provider 欄位 | 建議草稿值 | 證據／注意事項 |
|---|---|---|
| 建議檔案 slug | `pg-soft` | 穩定英文品牌 slug；本輪不建檔。 |
| `name` | `PG SOFT` | 官方主要品牌寫法；® 不放資料主名稱。 |
| `brandName` | `PG SOFT` | 官方 Company 頁明稱它是品牌。若避免與 `name` 重複，此欄也可省略。 |
| `aliases` | `Pocket Games Soft`、`PG Soft`、`PGSOFT` | 官方明寫 also known as Pocket Games Soft；其餘是大小寫／空格搜尋正規化。 |
| `roles` | `developer`、`publisher` | 官方自稱 creator and publisher；遊戲規則亦列 Owner、Developer。 |
| `parentOrganization` | 留空 | 官方公開頁未確認母公司，不猜測。 |
| `subBrands` | `[]` | 本輪未確認可獨立建模的子品牌。 |
| 所在地／來源地 | 官方聯絡地址為 Valletta, Malta；品牌稱全球設有辦公室 | 官方沒有在同頁明確把 Malta 定義為品牌起源／註冊地，因此不直接把聯絡地址冒充 origin。 |
| `originRegions` | 暫留空 | 若團隊把此欄定義為「總部／主要所在地」，可另行決策後填 Malta；本輪不混用語意。 |
| `serviceMarkets` | 全球合法可提供市場；排除官方列出的不服務地區 | 官方列出目前不服務：United States、Australia、Israel、Iran、Singapore、Malaysia、Taiwan、Hong Kong、Macau、UAE、North Korea。陣列不宜一次灌入推測國家清單。 |
| `marketTags` | `mobile-first`、`international`（候選） | 官方品牌定位與全球辦公室支持；標籤命名尚未標準化，可先留空。 |
| `languages` | 暫留空 | 官方現行頁稱支援 44 種語言／Company 頁稱 40+，但未公開可逐項核對的完整清單；不要把 `44 languages` 當語言名稱寫入陣列。 |
| `gameTypes` | `slots`、`table-games` | 官方目錄以 video slots 為主，另有 Table Games 類別與 Baccarat Deluxe。 |
| `officialUrl` | `https://www.pgsoft.com/` | 官方首頁。 |
| `summary` | `PG SOFT（亦稱 Pocket Games Soft）是成立於 2015 年、以行動端老虎機與數位遊戲為核心的開發及發行品牌，官方目錄亦包含桌上遊戲。` | 只使用官方 Company／Games 頁可支持的敘述。 |
| Logo 來源 | `https://www.pgsoft.com/_nuxt/img/nav_common_logo_black@2x.b4708a2.png` | 官方導覽列完整黑色品牌 Logo；本輪不下載。 |
| `status` | `draft` | 只表示未來草稿規格；本輪不建檔。 |
| `source` | PG SOFT Company 頁，checkedAt `2026-08-29` | 單一主來源可用 Company 頁；Logo 自有 `sourceUrl`。 |

### 3.3 Schema 承接判斷

- `name`、`brandName`、`aliases`、`roles`、`gameTypes`、`officialUrl`、`summary`、`status`、`source` 可直接承接。
- `logo` 是 optional；未下載本機資產時可以不填，不阻止 draft。
- `languages` 可合法留空；缺的是官方逐項清單，不是 Schema 不能承接。
- `originRegions` 可留空；真正問題是「品牌起源」與「目前聯絡／總部所在地」語意不同。
- 結論：**現有 Provider Schema 可直接建立 PG SOFT draft，不需先修改 Schema。**

## 4. Pragmatic Play Provider 草稿規格

### 4.1 官方來源

- [Pragmatic Play 官方 About Us](https://www.pragmaticplay.com/en/about-us/)
- [Pragmatic Play 官方首頁](https://www.pragmaticplay.com/en/)
- [Pragmatic Play 官方 Client Hub 入口](https://www.pragmaticplay.com/en/client-hub/)
- [Pragmatic Play 官方 Terms of Use](https://www.pragmaticplay.com/en/terms-of-use/)
- [Pragmatic Play 官方 Privacy Policy](https://www.pragmaticplay.com/en/privacy-policy/)
- 官方白色 SVG Logo：[PP-white-logo.svg](https://www.pragmaticplay.com/wp-content/themes/gp-theme-basic/libs/dist/images/PP-white-logo.svg)

### 4.2 欄位草稿

| Provider 欄位 | 建議草稿值 | 證據／注意事項 |
|---|---|---|
| 建議檔案 slug | `pragmatic-play` | 穩定官方英文品牌 slug；本輪不建檔。 |
| `name` | `Pragmatic Play` | 官方公開 provider 名稱。 |
| `brandName` | `Pragmatic Play` | 與主名稱相同，可省略避免重複。 |
| `aliases` | `PP 王者電子`、`PP王者電子`、`PP王者电子` | 官方中國站以「PP王者电子」呈現；繁中形式供搜尋。單獨 `PP` 過於寬泛，不建議收錄。 |
| `roles` | `developer`、`publisher` | 官方持續自行開發、發布與供應遊戲；不因 single API 自動標成 aggregator 或 platform。 |
| `parentOrganization` | 留空 | 官方只說由 Veridian (Gibraltar) Limited 領導的私人投資者群持有；這不等於已確認的直接母公司關係。 |
| `subBrands` | `[]` | 本輪不把遊戲系列或合作工作室當子品牌。 |
| 所在地／來源地 | 官方 About Us 明確寫 headquarters in Gibraltar；Terms 的通知地址在 Malta | 兩者語意不同：總部與法律通知地址不應合併成 origin。 |
| `originRegions` | 暫留空 | 官方本輪來源未明確陳述品牌起源；若未來欄位改為 headquarters，可填 Gibraltar。 |
| `serviceMarkets` | `major regulated markets worldwide` | 官方 About Us 的公開描述；不自行列出未核對的完整國家清單。 |
| `marketTags` | `b2b`、`regulated-markets`、`international`（候選） | 官方明稱 B2B digital casino games provider、服務主要受監管市場；標籤標準化前可先留空。 |
| `languages` | 暫留空 | 官方 About Us 稱 33 languages；沒有在同一正式來源提供完整逐項產品語言表。網站 UI 或個別工具語言不應冒充全產品清單。 |
| `gameTypes` | `slots`、`live-casino`、`bingo`、`virtual-sports`、`sportsbook`、`crash-games`、`arcade`、`other-rng` | 官方現行網站產品導覽與公司介紹。若 Slot Hub 只顯示相關類型，可前台篩選，不應刪除 Provider 原始能力。 |
| `officialUrl` | `https://www.pragmaticplay.com/` | 官方首頁。 |
| `summary` | `Pragmatic Play 是總部位於 Gibraltar、面向受監管市場的 B2B 多產品遊戲供應品牌，產品包含老虎機、真人娛樂、Bingo、Virtual Sports 等，透過單一 API 提供給營運商。` | 由官方 About Us 與產品導覽支持。 |
| Logo 來源 | `https://www.pragmaticplay.com/wp-content/themes/gp-theme-basic/libs/dist/images/PP-white-logo.svg` | 官方網站導覽列 Logo；白色版本未來可能需深色底或另找官方深色版，本輪不下載／轉檔。 |
| `status` | `draft` | 只表示未來草稿規格；本輪不建檔。 |
| `source` | Pragmatic Play About Us，checkedAt `2026-08-29` | 單一主來源可用 About Us；Logo 自有 `sourceUrl`。 |

### 4.3 Schema 承接判斷

- 必要欄位均可用現有 Schema 表達。
- `roles` 可用 developer／publisher，不需要新增 supplier 角色才可建立 draft。
- single API 是供應／整合方式，不足以把 Pragmatic Play 歸為 aggregator 或 platform。
- `parentOrganization` 應留空，避免把投資者群領導者誤寫成直接母公司。
- `logo` 可先省略；官方白色 SVG 的 `sourceUrl` 已可追溯。
- 結論：**現有 Provider Schema 可直接建立 Pragmatic Play draft，不需先修改 Schema。**

## 5. 資料缺值與真正架構缺口

### 5.1 資料缺值，不是架構阻擋

- PG SOFT 的法律實體全名與註冊地未由本輪官方公開頁清楚揭露。
- 兩家都只公開語言總數或概括支援，缺可逐項核對的全產品語言清單。
- PG SOFT 公開不服務地區，但沒有完整列出所有實際服務國家。
- Pragmatic Play 以「major regulated markets」概括服務市場，沒有單一完整國家清單。
- Logo 尚未下載為本機資產；`logo` 本來就是 optional。
- 以上欄位均可留空或保存概括官方文字，不阻止 draft。

### 5.2 真正但非阻擋的 Schema 語意缺口

1. **所在地語意不足**：`originRegions` 無法區分品牌起源、註冊地、總部、辦公室或法律通知地址。兩家都出現這個問題。
2. **Provider 只有單一 `source`**：公司資料會同時使用 About、產品目錄、法律頁及 Logo 資產；目前只能指定一個主來源，其他來源需放在文件或摘要，追溯力弱於 Game 的 `sources[]`。
3. **語言只接受名稱陣列**：無法結構化保存「33 languages／44 languages，但完整清單未公開」的官方覆蓋數字。

這三項值得放入後續架構審查，但都**不需要在建立兩家 Provider draft 前修改**。可先留空或使用主來源，等更多 Provider 樣本確認是否重複。

### 5.3 Gates 相關 taxonomy 缺口

- 已確認的唯一結構化缺口，是現有 `winMechanism` enum 沒有 `pay-anywhere`。
- 這是精確結構化與未來篩選的缺口，不是建立 Game draft 的阻擋，因欄位選填。
- `scatter-pays` 尚未獲本輪高權重證據支持。
- 多 Mechanism array 並非本例所需。

## 6. 下一步可建立的草稿

以下只是「下一步具備建立條件」的清單，不是本輪建立授權：

### Provider drafts

1. `pg-soft`
2. `pragmatic-play`

兩者都可先不填 `logo`、`languages`、`originRegions`，使用現有 Schema 建立 draft；圖片另行授權處理。

### Game drafts

在兩家 Provider 記錄存在後，第一批六款皆已達藍圖的草稿門檻：

1. Mahjong Ways
2. Mahjong Ways 2
3. Fortune Tiger
4. Sweet Bonanza
5. Gates of Olympus
6. Big Bass Bonanza

Gates of Olympus 的草稿可記錄：

- 原廠 Mechanism：Pay Anywhere
- `winMechanism`：在 enum 尚未核准前留空
- Feature：Tumble/Cascading、Scatter、Free Spins、Multiplier
- 不填：Paylines、Cluster Pays、Scatter Pays

Sweet Bonanza 同樣有 Pay Anywhere 結構化需求；若下一輪要讓兩款都可被 Mechanism 篩選，建議另開明確授權審查並新增單值 `pay-anywhere`，不必把欄位改為陣列。

## 7. 本輪變更邊界

本輪預期 Git diff 只新增：

`slothub-site/docs/first-six-targeted-followup-validation.md`

未修改 `APPROVED v1` 藍圖、前次六款報告、Schema、taxonomy、enum、Provider、Game、圖片、頁面或部署設定；未 Build、未部署、未 Push、未 Commit。
