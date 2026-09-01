# Slot Hub Provider Hub v2 只讀產品、資料與使用者動線規格

文件狀態：`APPROVED FOR LOCAL IMPLEMENTATION`

日期：2026-09-02

目前項目：第 5 項 Provider Hub v2

目前步驟：第 5-1 步 只讀產品、資料與使用者動線盤點

## 1. 白話摘要

目前 Provider Hub 已經能讓使用者找到 11 家 Provider、辨識其名稱與角色，並由 Provider detail 前往 Slot Hub 收錄的遊戲。Search、Game detail 與 Header 也都能回到相同 Provider 頁；30 款 published Game 全部連到有效的 published Provider，沒有孤兒或重複歸屬。

真正的缺口不是「沒有 Provider 頁」，而是頁面仍停在基本名單：使用者看不到 Provider 資料的來源與核對日期、無法分辨 Provider 身份資料與 Slot Hub 小樣本統計，也沒有精確的「在遊戲庫篩選此廠商」入口。現有 `/games/?provider={slug}` 已能準確恢復篩選，因此 v2 不需要新 URL schema 或第二套狀態 owner。

11 家、30 款的資料足以支持：中性 Provider index、Provider 身份、目前收錄遊戲、限定母體的 Mechanism／Feature 原始計數、部分資料覆蓋 x/N，以及精確 filtered Explorer CTA。它不足以支持 Provider 排名、平均 RTP／Max Win／波動度、完整產品線結論、地區／市場推論或「代表作」。

## 2. 權威依據、範圍與基線

本規格依據：

- `docs/slot-hub-master-blueprint-v2.md`（目前最高產品與施工順序依據）
- `docs/slot-hub-work-roadmap.md`
- `docs/game-intake-workflow-v1.md`
- 現行 Provider／Game Content Collection、頁面、URL serializer、Search、Explorer 與驗證程式

盤點基線：

- HEAD 與 `origin/main`：`1259ce406eb5e8a4b73b02cfa26ef03964eb60cc`
- ahead／behind：`0/0`
- tracked working tree：乾淨
- published Provider：11 家
- published Game：30 款
- 本輪只新增本規格，並同步 Roadmap 進度；網站、資料、Schema、taxonomy、樣式與測試修改數均為 0。

## 3. 現有資料責任與頁面角色

### 3.1 唯一關係 owner

Game 的 canonical `provider` 欄位是 Slot Hub 站內 Game → Provider 分組與統計的唯一正式關係 owner。它不必然代表唯一開發商、發行商、母公司或合作關係；父公司、子品牌、Aggregator 與合作廠商不自動合併樣本。Provider detail 的遊戲清單與數量應由 published Game projection 即時計算，不在 Provider frontmatter 手抄第二份。

同樣應由 published Game 計算，而不是寫入 Provider 資料：

- 收錄遊戲數與遊戲清單
- Mechanism／Feature 計數
- RTP、波動度、Max Win、Release date、Bonus Buy 等資料覆蓋數
- lastVerifiedAt 覆蓋

### 3.2 現有頁面角色

| 入口 | 現況 | 已正確之處 | 主要缺口 |
| --- | --- | --- | --- |
| Header／首頁 | 進入 `/providers/` 或個別 Provider detail | 路由清楚，不以搜尋文字冒充 Provider | 未提供 Provider Hub v2 的資料判讀能力 |
| `/providers/` | 11 張 Provider 卡，顯示身份、角色、摘要、收錄數 | 名稱順序中性；收錄數由 Game 推導；卡片皆為真實連結 | 未說明數量只代表 Slot Hub 樣本；缺少來源／核對語意；不宜在此塞入統計圖表 |
| `/providers/{slug}/` | 身份、摘要、官方網站、已收錄遊戲 | Provider → Game detail 為普通 href；N 與清單一致 | 沒有來源與核對日期、樣本聲明、資料覆蓋、Mechanism／Feature 計數及精確 Explorer CTA |
| Search | Provider 名稱、aliases、brandName、摘要可搜尋 | `Pragmatic Play` 同時找到 Provider 與旗下 5 款遊戲 | 不需另建 Provider 搜尋系統 |
| Game detail | Provider 身份連到 Provider detail | canonical Provider 關係清楚 | 不屬本項改造範圍 |
| `/games/` Explorer | `provider` 是既有結構化 filter | `/games/?provider=pragmatic-play` 可 Reload／hydration 並恢復 5 款 | Provider detail 尚未提供此精確入口 |

## 4. Provider Schema、資料、來源與公開呈現的四層差異

以下四件事不可合併判斷：

1. Schema 有欄位。
2. Provider record 實際有值。
3. 現有來源足以支持該值。
4. 公開 Provider 頁目前有呈現。

Provider Schema 可保存 `brandName`、`aliases`、`roles`、母組織、子品牌、region、market、語言、game types、官方網址、Logo、來源與 updatedAt；但公開 detail 目前只呈現名稱、角色、摘要、官方網站，以及有 Logo 時的 Logo 來源與取得日期。欄位存在不構成公開事實，也不授權由地址、語言、合作公告或名稱自行補值。Search aliases 不等於可公開的正式別名；在沒有逐 alias 來源契約時，v2 第一版不公開 aliases／brandName、不建立硬編 allowlist。

現有 Schema 與 workflow 沒有把 Provider `updatedAt` 明確定義為逐欄核對事件，因此公開標籤固定使用「Provider 資料更新」，不得稱為官方發布日、全部欄位最後核對日或 Game 核對日。Game `lastVerifiedAt` 仍留在 Game 層。

### 4.1 11 家 Provider 身份矩陣

「—」表示目前 record 無值；不等於沒有、不支援或未公開。

| Provider（slug） | aliases／brand | 角色 | 母組織／子品牌 | region／market | 官方與來源 | Logo | 核對日 | 已收錄 N | 公開頁現況與風險 |
| --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| ATG Games (`atg-games`) | Agile Titan Games、ATG；brand ATG Games | developer | —／— | Asia／Asia | `atg-games.com`；官方 games 目錄 | 有；官方來源 | 2026-08-28 | 3 | 顯示身份、角色、摘要、網站、Logo 來源、遊戲；Asia 為 record 值，但仍不可擴寫成完整市場覆蓋 |
| Big Time Gaming (`big-time-gaming`) | BTG、Big Time Gaming；brand BTG | developer、publisher | Evolution Group／— | —／— | `bigtimegaming.com`；官方 about | 無 | 2026-08-29 | 1 | 母組織有來源語境；不得與 NetEnt 或 Evolution 其他品牌合併樣本 |
| Booming Games (`booming-games`) | — | developer | —／— | —／— | `booming-games.com`；官方 games | 有；官方來源 | 2026-08-28 | 3 | 身份資料精簡；缺值不補猜 |
| CQ9 Gaming (`cq9-gaming`) | CQ9、CQ9Gaming；brand CQ9 | developer、publisher | —／— | —／— | `cq9gaming.com`；官方 about | 無 | 2026-08-29 | 1 | 摘要仍含「可追溯廠商草稿」字樣，與 published 狀態語意不一致；本輪只記錄 |
| Hacksaw Gaming (`hacksaw-gaming`) | Hacksaw | developer | —／— | —／— | `hacksawgaming.com`；官方 games | 有；官方來源 | 2026-08-28 | 4 | 可呈現來源與樣本，不可推論完整產品線 |
| JILI Games (`jili-games`) | JILI、JILI Games、吉利電子；brand JILI | developer、publisher | —／— | —／— | `jiligames.com`；官方 games | 無 | 2026-08-29 | 1 | 摘要含「可追溯廠商草稿」字樣；marketTags 不等於已證實市場覆蓋 |
| NetEnt (`netent`) | NetEnt™；brand NetEnt | developer、publisher | Evolution Group／— | —／— | `netent.com`；官方 about | 無 | 2026-08-29 | 2 | 摘要含「可追溯廠商草稿」字樣；不得與 BTG 合併樣本 |
| PG SOFT (`pg-soft`) | Pocket Games Soft、PG Soft、PGSOFT | developer、publisher | —／— | —／— | `pgsoft.com`；官方 company | 無 | 2026-08-29 | 4 | 可顯示別名；不得由多語內容或地址推論 market |
| Play’n GO (`play-n-go`) | Play'n GO、Play N GO、Playn GO、Playngo；brand Play’n GO | developer、publisher | —／— | —／— | `playngo.com`；官方 about | 無 | 2026-08-29 | 3 | marketTags 只可視為內部 record，不應自動成為公開市場聲明 |
| Pragmatic Play (`pragmatic-play`) | PP 王者電子等 | developer、publisher | —／— | —／— | `pragmaticplay.com`；官方 about | 無 | 2026-08-29 | 5 | 目前樣本最多；仍不可稱為代表作或全產品分布 |
| Slotmill (`slotmill`) | — | developer | —／— | —／— | `slotmill.com`；官方 developer game list | 有；官方來源 | 2026-08-28 | 3 | 開發者目錄可支持遊戲資料，但 Provider 身份與遊戲樣本仍須分區 |

### 4.2 Provider metadata coverage

| 欄位 | 有值／11 | 可安全用途 | 限制 |
| --- | ---: | --- | --- |
| 正式名稱、roles、officialUrl、source、updatedAt | 11 | 身份、角色、官方入口、來源與核對日期 | 來源仍須逐欄支持，不能只因 source 存在就公開所有 optional 欄位 |
| gameTypes | 11 | 有來源時描述官方產品類型 | 不等於 Slot Hub 已收錄所有類型 |
| aliases | 9 | Search 與身份辨識 | 不作母子品牌合併依據 |
| brandName | 6 | 有值時輔助辨識 | 缺值隱藏，不從名稱製造 brandName |
| marketTags | 6 | 目前屬 record 層 | 不足以作公開市場覆蓋；需逐項來源語境 |
| languages | 4 | 有值且來源支持時可呈現 | 不由語言推論市場 |
| Logo | 4 | Provider 身份辨識 | 其餘 7 家使用文字 initials；不因此降低排序或品質評價 |
| parentOrganization | 2 | 有來源時呈現法人／品牌關係 | 永不合併 Game 樣本 |
| originRegions、serviceMarkets | 各 1 | 僅呈現現有、可支持的值 | 目前不足以作跨 Provider 比較 |
| subBrands | 0 | 不顯示 | 不由 aliases 或合作關係推論 |

## 5. Provider → Game 關係與樣本分布

### 5.1 關係完整性

- 30/30 published Games 都連到有效 published Provider。
- 孤兒：0。
- draft 洩漏：0。
- 重複 Game slug：0。
- 每款 Game 只有一個 canonical Provider；父子品牌不合併。
- Provider index 與 detail 的 N 均由 published Games 投影得出。

### 5.2 每家目前收錄數

| N | Provider |
| ---: | --- |
| 5 | Pragmatic Play |
| 4 | Hacksaw Gaming、PG SOFT |
| 3 | ATG Games、Booming Games、Play’n GO、Slotmill |
| 2 | NetEnt |
| 1 | Big Time Gaming、CQ9 Gaming、JILI Games |
| 0 | 無 |

門檻覆蓋：

- `N ≥ 2`：8/11 家可顯示 x/N 樣本計數；3 家維持單款文字。
- `N ≥ 3`：7/11 家可顯示 x/N；NetEnt（N=2）與 3 家 N=1 不顯示統計。
- `N ≥ 4`：3/11 家可顯示 x/N；會讓 8 家失去樣本摘要。

推薦預設為 `N ≥ 2` 才顯示 Mechanism／Feature x/N；N=1 只列出「目前收錄的一款遊戲」。此建議仍需人工核准。

### 5.3 逐 Provider 樣本資料覆蓋

格式為 `有值/N`。Bonus Buy 只計算欄位已明確保存的值；undefined 不視為 false。

| Provider | RTP | variants | 原廠波動度 | 統一波動度 | Max Win | 發布日 | Bonus Buy 已知 | sources | lastVerifiedAt |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| ATG Games（N=3） | 3/3 | 0/3 | 3/3 | 3/3 | 3/3 | 0/3 | 3/3 | 3/3 | 3/3 |
| Big Time Gaming（N=1） | 1/1 | 0/1 | 1/1 | 0/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 |
| Booming Games（N=3） | 0/3 | 0/3 | 0/3 | 0/3 | 3/3 | 3/3 | 2/3 | 3/3 | 3/3 |
| CQ9 Gaming（N=1） | 0/1 | 0/1 | 0/1 | 0/1 | 0/1 | 0/1 | 0/1 | 1/1 | 1/1 |
| Hacksaw Gaming（N=4） | 2/4 | 2/4 | 4/4 | 4/4 | 4/4 | 0/4 | 2/4 | 4/4 | 4/4 |
| JILI Games（N=1） | 0/1 | 0/1 | 1/1 | 0/1 | 1/1 | 0/1 | 0/1 | 1/1 | 1/1 |
| NetEnt（N=2） | 2/2 | 0/2 | 1/2 | 1/2 | 2/2 | 2/2 | 1/2 | 2/2 | 2/2 |
| PG SOFT（N=4） | 4/4 | 4/4 | 4/4 | 4/4 | 4/4 | 0/4 | 0/4 | 4/4 | 4/4 |
| Play’n GO（N=3） | 1/3 | 1/3 | 1/3 | 1/3 | 1/3 | 3/3 | 0/3 | 3/3 | 3/3 |
| Pragmatic Play（N=5） | 1/5 | 0/5 | 2/5 | 1/5 | 3/5 | 5/5 | 1/5 | 5/5 | 5/5 |
| Slotmill（N=3） | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 |

全站 coverage：RTP 17/30、RTP variants 10/30、原廠波動度 20/30、統一波動度 17/30、Max Win 25/30、release date 17/30、Bonus Buy 欄位已知 13/30、sources 30/30、lastVerifiedAt 30/30。

### 5.4 Mechanism 與 Feature 樣本

可安全呈現的是「在 Slot Hub 目前收錄的 N 款遊戲中」的原始計數，不是 Provider 產品策略。

| Provider | Mechanism 計數 | Feature 計數摘要 |
| --- | --- | --- |
| ATG Games | other 2、paylines 1 | Multiplier 3、Free Spins 3、Cascading 2、Bonus Buy 3 等 |
| Big Time Gaming | Megaways 1 | Cascading、Free Spins、Multiplier、Bonus Buy 各 1 |
| Booming Games | paylines 3 | Free Spins 2、Wild 2、Multiplier 2、Bonus Buy 2，其他各 1 |
| CQ9 Gaming | ways-to-win 1 | Free Spins 1、Multiplier 1 |
| Hacksaw Gaming | paylines 3、cluster-pays 1 | Multiplier 3、Free Spins 2、Wild 2、Bonus Buy 2 等 |
| JILI Games | ways-to-win 1 | Free Spins 1、Multiplier 1 |
| NetEnt | paylines 2 | Wild 2；Cascading、Scatter、Multiplier、Free Spins、Respins 各 1 |
| PG SOFT | paylines 2、ways-to-win 2 | Multiplier 4、Wild 3、Free Spins 2、Cascading 2 等 |
| Play’n GO | paylines 2、cluster-pays 1 | Wild 3、Free Spins 2、Scatter 2，其他各 1 |
| Pragmatic Play | pay-anywhere 4、paylines 1 | Free Spins 5、Scatter 5、Multiplier 5、Cascading 4，其他各 1 |
| Slotmill | cluster-pays 1、other 1、paylines 1 | Free Spins 3、Multiplier 3、Bonus Buy 3、Giant Symbols 2 等 |

`other` 不進入共同 Mechanism chips，不可把不同 `other` 遊戲視為共同 Mechanism，也不可用來推論 Provider 風格。N≥2 且存在 `other` 時，只在資料狀態顯示「主要機制尚未細分：x/N 款」。

## 6. 樣本統計安全契約

每個樣本區固定使用母體聲明：

> 以下只整理 Slot Hub 目前收錄的 N 款遊戲，不代表該 Provider 的完整產品線。

顯示契約：

- N=0：保留 Provider 身份，顯示「Slot Hub 目前尚未收錄此廠商的 published 遊戲」；隱藏遊戲清單、Mechanism、Feature、coverage 與 filtered Explorer CTA。
- N=1：顯示固定樣本聲明與單款遊戲，不稱為分布、趨勢、風格或偏好；不顯示任何 Mechanism、Feature 或 coverage x/N；可顯示精確 filtered Explorer CTA。
- N≥2：才顯示 Mechanism、Feature 與資料覆蓋的 x/N；不使用百分比。
- 所有 N：不得計算平均 RTP、平均 Max Win、平均波動度、分數、星等、紅綠燈、排名或品質評價。
- coverage 的 x 固定表示「具有明確已記錄值的 published Game 數量」，不代表支援數、品質、新鮮度、Provider 完整度或全產品線覆蓋。
- undefined／null 表示未知；false 表示已明確記錄為不支援；N/A 只能來自明確資料值。Bonus Buy「狀態已核實 x/N」為明確 true 加明確 false，本版不另做支援排行。
- Feature 使用「已記錄包含 x/N」，多選計數可重疊，不會合計為 N；未列出的 Feature 不得反向解讀為不存在。

## 7. Filtered Explorer 與跨頁動線

### 7.1 精確 URL 契約

Provider filtered Explorer 使用既有 serializer：

`/games/?provider={canonical-provider-slug}`

不得使用 `?q=Provider名稱`、裸 `/games/` 或無 href CTA。Provider detail 的建議文案：

> 查看 Slot Hub 收錄的 N 款遊戲

或較短的：

> 在遊戲庫篩選此廠商

CTA 必須明示 Slot Hub 收錄範圍，不可暗示 Provider 完整目錄。

### 7.2 只讀實測結果

- `/games/?provider=pragmatic-play`：Provider select 正確恢復 Pragmatic Play，結果為 5 款；Reload 後維持。第 5-1 步結論限定為 `PASS_FOR_TESTED_SLUG；Pragmatic Play`。
- Provider filter 使用結構化 `provider`，不是文字搜尋。
- `parseExplorerState` 對未知 Provider 安全降級，不建立第二套 state owner。
- Search `Pragmatic Play`：Provider 結果與 5 款旗下遊戲均可到達。
- Provider detail → Game detail：一般 href，無 JavaScript 仍成立。
- 現有 Provider detail filtered Explorer CTA：0；這是 v2 的明確功能缺口。
- Back／Forward 契約沿用已完成的核心動線一致性；第 5-2 步仍須加 Provider CTA 的實際瀏覽器 fixture。

## 8. Provider Hub v2 資訊架構候選

### 8.1 方案比較

| 方案 | 內容 | 優點 | 風險 |
| --- | --- | --- | --- |
| A：只補 detail CTA | 保留現況，只加精確 Provider filter | 成本最低 | 無法解決來源、樣本限制與資料可信度問題 |
| B：detail 完整補強、index 維持中性入口 | index 保留身份／角色／N；detail 分成身份、樣本、遊戲、計數、coverage、來源與 CTA | 最符合現有資料量；避免 index 變排行榜 | 需要清楚的小樣本文案與缺值 helper |
| C：index 與 detail 都加入統計 | index 直接顯示 Mechanism／coverage | 一眼可掃描 | 11 家樣本差距大，容易形成隱性排名與卡片過載 |

推薦方案 B。第 5-2 步可同時碰 index 與 detail，但 index 只做必要的樣本語意與中性排序確認；統計與來源集中在 detail。

### 8.2 推薦 Provider index

- 保留正式名稱／Logo 或 initials、角色、摘要、Slot Hub 收錄 N。
- 固定按顯示名稱排序，不按 N、coverage、RTP 或任何品質訊號排序。
- 卡片主入口仍是 Provider detail；不建議每張卡再放第二個 Explorer CTA。
- index 首段明示 N 是 Slot Hub 收錄量，不是 Provider 完整作品數。
- 不顯示 Mechanism／Feature 統計圖表。

### 8.3 推薦 Provider detail

1. **Provider 身份**：名稱、角色、摘要、官方網站；母組織有直接資料時獨立呈現，缺值隱藏。aliases／brandName 只有同時具備直接相符來源、適合公開且完成去重時才可顯示；目前沒有逐 alias 契約，第一版維持不公開。
2. **Slot Hub 收錄樣本聲明**：固定放在衍生統計前，明示 N 與非完整產品線。
3. **目前收錄遊戲**：由 published Games 投影，保留直達 Game detail。
4. **玩法與功能樣本**：N≥2 才顯示 x/N chips／列表；Mechanism 與 Feature 分組；`other` 不進 Mechanism chips。
5. **資料覆蓋**：RTP、原廠波動度、統一波動度、Max Win、release date、Bonus Buy、sources、lastVerifiedAt 的 x/N；不做總分。
6. **精確 Explorer CTA**：`gamesIndexUrl({ provider: slug })`。
7. **Provider 資料來源與資料更新日**：官方網站、Provider 身份資料來源、Logo 來源（有 Logo 才顯示）分開呈現；Provider `updatedAt` 標示為「Provider 資料更新」。遊戲資料的 sources／lastVerifiedAt 仍留在各 Game detail，不混成單一 Provider 保證。

身份資料與 Game 衍生樣本必須以 heading／section 分開，避免使用者把 30 款站內樣本當作 Provider 全產品線。

## 9. 缺值、來源與資料語意

- Provider optional 欄位缺值：整列隱藏，不顯示「沒有母公司／沒有市場／沒有子品牌」。
- Game 統計中的缺值：顯示 x/N coverage 或「目前尚未核實」，不轉為 false。
- Bonus Buy：只有明確 boolean 才可計入「已知」；undefined 不計入支援或不支援。
- marketTags、languages、originRegions、serviceMarkets：未逐欄確認來源語境前，不列為 v2 預設公開欄位。
- Provider source 與 Game source 分層；Provider 官方來源不能替代個別遊戲規則證據。
- 本輪已回讀 26 筆既有 URL 欄位，包含 11 個 officialUrl、11 個 Provider source 欄位與 4 個 Logo source 欄位，均成功取得 HTTP 200。HTTP 200 只代表網址可達，不代表頁面支持所有 Provider 欄位；重複 URL 欄位也不是獨立來源。Provider 欄位證據狀態為 `FIELD_LEVEL_EVIDENCE_PARTIAL`。
- CQ9、JILI、NetEnt 摘要中的「草稿」字樣已獲人工核准於第 5-2 步做最小文案清理；只移除製作流程痕跡，不新增公司事實。

## 10. SEO、無 JavaScript與可存取性

### 10.1 SEO 只讀結果

- 11 個 Provider detail 均有唯一 title、description 與 H1。
- 每頁皆可由 Provider index、Search 或 Game detail 到達，沒有孤兒頁。
- 目前沒有 Provider breadcrumb structured data；只提供「返回遊戲廠商」連結。是否補 breadcrumb 應列入第 5-2 步人工範圍，不在本輪決定。
- 3 家 N=1 頁面最薄；應靠來源、身份與誠實的單款樣本補足語意，而非製造統計或行銷文字。
- 不加入 rating、ranking、Product／Organization 暗示官方代表的 schema。
- Provider query 仍是 Explorer 狀態，不建立 SEO 永久頁、不加入 sitemap。
- Preview 實測 11 頁皆為 `noindex,nofollow`、無 canonical；完整 safeguards 另由 `npm run verify` 驗證。

### 10.2 響應式、無 JavaScript與可存取性

本機 1440×900、390×844、320×844 實測：

- Provider index 與 Pragmatic Play detail 均為 `scrollWidth = clientWidth`，無頁面級水平溢位。
- `/providers/` 有 11 張真實卡片連結；`a:not([href]) = 0`。
- Provider detail 的官方網站與 Game detail 入口均為普通 href；核心身份與遊戲清單是 server-rendered HTML，不依賴 JavaScript。
- 現有 headings、navigation、卡片連結可由鍵盤到達；第 5-2 步新增 CTA／chips 後仍須確認 44px touch target 與 `focus-visible`。
- 無 JavaScript最低內容：Provider 身份、樣本聲明、遊戲清單、x/N 文字、官方來源、核對日期與 filtered Explorer 普通 href 全部存在。
- 不能只靠顏色表示 coverage；chips 必須保留完整文字與數字。
- 本次頁面操作未觀察到 console、hydration 或 runtime error；完整回歸以 verify 為準。

## 11. 第 5-2 步候選施工範圍

以下只是候選，不構成授權：

- `src/pages/providers/index.astro`：中性排序、樣本範圍文案（若人工核准）
- `src/pages/providers/[slug].astro`：v2 分區、來源、核對日、coverage 與精確 Explorer CTA
- 一個專責 Provider sample projection 純函式：只由 published Games 計算，不複製 Game → Provider owner
- `src/styles/global.css`：僅 Provider 頁 scoped 樣式
- 既有 Provider／Explorer／internal-links／preview safeguards 測試，或一支最小 Provider Hub 驗證腳本
- `package.json`：只有在把新驗證接入 `npm run verify` 必要時修改

不得修改 Provider／Game schema、frontmatter、taxonomy、Search ranking、Explorer URL schema、Game detail、Compare、Guide relationships 或正式 SEO 設定。

## 12. 第 5-2 步驗收草案

- 11 家、30 款全量投影；0 孤兒、0 draft、0 重複。
- 每頁 N、遊戲清單、filtered Explorer 結果一致。
- 父子品牌不合併。
- N=0、N=1、N≥2 fixture 都有明確輸出；N=0／1 必須用 synthetic fixture，不因目前沒有 N=0 Provider 而省略。
- Mechanism／Feature／coverage 全部由 Game 結構化欄位計算。
- undefined 不視為 false；Bonus Buy 已知為 true＋false；Feature 可重疊；`other` 不進共同 Mechanism chips。
- 11 家 Provider slug、detail N、CTA URL、Explorer hydration Provider、Explorer 結果數及 Reload 狀態全部一致。
- 不出現平均值、百分比、評分、排名或「代表／熱門」措辭。
- `/games/?provider={slug}` 由既有 serializer 產生，可 Reload、Back／Forward 與分享。
- index 保持名稱中性排序。
- 11 個 detail title／description／H1 唯一。
- 無 JavaScript核心內容完整；`a:not([href]) = 0`。
- 1440、390、320 無頁面級水平溢位；touch target、focus-visible、長名稱與來源 URL 可讀。
- Search、Explorer、core flow、Compare v2、Similar Play、relationship、data audit、Astro Check、Build、internal links、Preview safeguards 全部回歸通過。

## 13. 必須由人工核准的 15 項決策

| # | 決策 | 單一建議預設 |
| ---: | --- | --- |
| 1 | 第 5-2 步修改 detail、index 或兩者 | 兩者；detail 實質補強，index 只補樣本語意與確認中性排序 |
| 2 | 樣本聲明位置與文案 | 放在 detail 身份後、所有衍生統計前；「以下只整理 Slot Hub 目前收錄的 N 款遊戲，不代表該 Provider 的完整產品線。」 |
| 3 | 統計格式 | 只用 x/N，不用百分比 |
| 4 | N=0／1／≥2 | N=0 顯示身份與空狀態、隱藏清單／統計／CTA；N=1 顯示聲明、單款與 CTA、不顯示統計；N≥2 顯示 x/N |
| 5 | Provider 身份欄位 | 名稱、角色、摘要、官方網站；母組織有直接資料才顯示。aliases／brandName 第一版不公開，其餘缺值隱藏 |
| 6 | coverage 欄位 | RTP、原廠／統一波動度、Max Win、release date、Bonus Buy 已知、sources、lastVerifiedAt；variants 留在遊戲層或只計 coverage |
| 7 | Mechanism／Feature 規則 | N≥2 分組顯示非零 x/N；不顯示百分比或排行 |
| 8 | `other` Mechanism | 不進共同 Mechanism chips；N≥2 時僅顯示「主要機制尚未細分：x/N 款」 |
| 9 | 母公司／子品牌樣本 | 絕不合併；每款 Game 只依 canonical Provider 計數 |
| 10 | relationship owner | 維持 Game canonical `provider` |
| 11 | filtered Explorer CTA | detail 顯示「查看 Slot Hub 收錄的 N 款遊戲」；N≥1 顯示、N=0 隱藏 |
| 12 | 來源與日期粒度 | 官方網站、Provider source、Logo source 分開；updatedAt 標示「Provider 資料更新」；Game source／lastVerifiedAt 留在 Game detail |
| 13 | index 排序 | 依顯示名稱固定排序；不依 N 或 coverage |
| 14 | 圖表 | 不使用；採文字、列表與 chips |
| 15 | 無 JavaScript最低內容 | 身份、樣本聲明、遊戲、x/N、來源、日期與精確 CTA 全部是 server-rendered HTML |

## 14. 明確不包含與已知限制

本規格不授權：Provider／Game 資料修正、Schema／taxonomy、排名或平均值、Provider 完整產品線推論、競品研究、新來源補錄、Provider×Feature／Mechanism 永久頁、CPA／試玩、CMS／D1／R2、Wix／migration／DNS／301／410、正式索引政策或第 5-2 步施工。

已知限制：

- 3 家只有 1 款樣本，不能顯示分布。
- 7/11 無 Logo，必須保留 initials fallback。
- region／market 資料僅 1/11 有值，不適合作為 v2 主要欄位。
- 3 份 summary 有「草稿」字樣，需另案內容決策。
- Provider source 不能替代 Game Rules；coverage 完整不等於資料品質排名。

## 15. 本輪驗證與變更邊界

- 完整 Preview `npm run verify`：PASS；30/30 data audit、Search、Explorer、core flow、Compare v2、Guide relationships、Astro Check（0 errors、0 warnings）、Static Build（62 pages）、Game detail、Similar Play、Relationship UI、Diagrams、internal links 與 Preview safeguards 全部通過。
- 瀏覽器：11 個 detail 身份／SEO、Provider Search、Pragmatic Play filtered Explorer、1440／390／320、`a:not([href])` 與水平溢位已實測。
- 既有 26 筆 URL 欄位：HTTP 200；只代表 URL 可達，欄位級證據狀態為 `FIELD_LEVEL_EVIDENCE_PARTIAL`。
- 本輪網站、程式、資料、樣式與測試變更：0。
- 本輪只允許本規格與 Roadmap 進度差異；不 stage、不 Commit、不 Push、不部署。

## 16. 固定出口

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_ITEM: 第5項 Provider Hub v2`

`CURRENT_STEP: 第5-1步 只讀產品、資料與使用者動線盤點`

`CURRENT_STATE: APPROVED_FOR_LOCAL_IMPLEMENTATION`

`WEBSITE_CHANGED: NO`

`NEXT_ALLOWED_ACTION: 依核准規格進行第5-2步本機施工；完成後返回人工審查`

`COMMIT_ALLOWED: NO`

`PUSH_ALLOWED: NO`

`DEPLOY_ALLOWED: NO`

`HUMAN_APPROVAL_REQUIRED: YES`
