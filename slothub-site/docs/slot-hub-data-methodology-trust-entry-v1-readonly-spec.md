# Slot Hub 資料方法與可信度入口 v1 規格

文件狀態：`APPROVED FOR LOCAL IMPLEMENTATION`

建立日期：2026-09-02

適用範圍：第 6 項「資料方法與可信度入口」的最小內容與入口施工

## 1. 白話摘要

Slot Hub 已在 Game detail、Compare、Provider Hub 與專門 Guide 中保存來源、原廠標籤、統一顯示、缺值及核對日期，但使用者目前必須自己從不同頁面拼湊這套方法。搜尋「資料方法」「缺值」「統一值」或「資料來源」也沒有一個專門入口。

v1 以一篇一般使用者可閱讀的永久 Guide 集中說明方法，並從 Footer、Game detail 的「資料資訊」及 Compare 的資料提醒區提供入口。這不是新的證據資料庫、評分系統或 relationship owner。

## 2. 核准產品決定

1. 使用既有 Guide 頁型，不建立獨立 `/methodology/` 頁型。
2. Guide slug 使用 `slot-hub-data-methodology`；名稱穩定、帶有 Slot Hub 品牌語境，且不與既有概念 Guide 競爭。
3. Guide category 使用既有 `data`；本文解釋資料判讀方法，不屬 Mechanism、Feature、術語或新手工具教學。
4. Guide 不宣告 `relatedMechanisms`、`relatedFeatures` 或 `relatedDataTopics`，不建立 Game 正反向關聯，也不移交既有 owner。
5. 最小入口為 Footer、Game detail「資料資訊」及 Compare 資料提醒區；不改首頁、Header、Guide 閱讀路線或 `/slots/` Knowledge Map。
6. Guide index 與 Search 沿用 published Guide 的既有自動投影，不建立第二份 catalog 或關鍵字特例。
7. 不在 v1 強制 Game detail 顯示所有缺值欄位；缺值的逐欄狀態維持既有資料呈現。
8. 第三方來源只有在實際使用時才需於資料頁清楚標示來源角色；本輪不預先新增 source tier Schema。

## 3. Guide 內容責任

文章必須讓一般使用者理解：

- 原廠資料與 Slot Hub 編輯統一值是兩個不同層次。
- 缺值代表目前未知、未公開、未取得或無法安全統一，不等於 0、沒有或不支援。
- 不同版本、市場、規則文件或不同時期資料不能自動合併。
- 來源核對日期代表 Slot Hub 查閱該來源的時間，不等於原廠在當日重新發布所有資料。
- RTP、波動度、Max Win 等數據有不同的可比較程度；並排顯示不等於可以排序優劣。
- Provider Hub 的比例只描述 Slot Hub 目前收錄樣本，不代表 Provider 全產品線。

文章不得建立信心分數、來源徽章排名、勝率或品質排名，也不得承諾資料永遠完整或即時。

## 4. 來源與內容邊界

- 來源層級沿用已核准藍圖：優先官方規則、Paytable、Help、正式技術文件與官方遊戲頁；授權合作方只能補缺並標示角色；產業媒體只作線索或交叉核對。
- 本篇解釋 Slot Hub 自己的資料整理方法，不需要為每一條編輯政策新增外部來源。
- 精確遊戲規則、RTP、波動度、Max Win 與 Feature 的完整定義仍由現有專門 Guide 與各 Game sources 承接。
- 不修改任何 Game、Provider 或 Guide 的既有資料與來源。

## 5. 入口與顯示契約

### 5.1 Guide 自身

- 永久路由：`/guide/slot-hub-data-methodology/`
- title：`Slot Hub 如何整理遊戲資料？來源、缺值與可比較限制`
- category：`data`
- level：`beginner`
- Search tags 至少涵蓋「資料方法」「資料來源」「缺值」「原廠資料」「統一值」「資料可信度」。

### 5.2 Footer

- 提供一般文字連結「資料方法與可信度」。
- 不改 Header 或首頁資訊架構。

### 5.3 Game detail

- 在既有「資料資訊」區提供「了解 Slot Hub 如何整理資料」入口。
- 入口不取代原始來源清單與最後核對日期。
- 不因入口存在而補顯示缺值欄位。

### 5.4 Compare

- 在既有核心警告／判讀提醒附近提供「閱讀資料方法與可信度」入口。
- 不改 Compare URL、localStorage、history、欄位分級或最多三款契約。

### 5.5 發布隔離

- Guide 為 draft 時，公開路由、Guide index、Search 與上述三個入口都不得出現。
- 三個入口只可從 published Guide collection 取得目標，不能手寫指向尚未發布的 draft 路由。
- published 後，入口與 Search 才一起生效。

## 6. 最小工程範圍

預期可修改：

- `src/content/guides/slot-hub-data-methodology.md`
- `src/components/SiteFooter.astro`
- `src/pages/games/[slug].astro`
- `src/pages/compare/index.astro` 或既有 Compare 提醒的最小承接檔案
- 一支最小驗證程式；必要時接入 `npm run verify`
- `docs/slot-hub-work-roadmap.md`

不修改：

- Guide Schema、Game Schema、taxonomy、relationship resolver
- Game／Provider／其他 Guide 內容
- Search 排名或 Explorer URL schema
- Header、首頁、Guide 閱讀路線、Knowledge Map
- Compare 狀態契約與資料欄位
- Wix、migration、301、DNS、canonical 或正式索引政策

## 7. 驗收條件

- slug 與 category 通過既有 Guide Schema，且無重複路由。
- Guide 不宣告 relationship，既有 166 筆 Game → Guide 關聯不變。
- published 模擬時，Guide 路由、Guide index、Search 與三個入口全部存在。
- 搜尋「資料方法」「缺值」「統一值」「資料來源」可找到該 Guide。
- draft 狀態時，公開路由、Search 與三個入口全部隔離。
- Footer、30 款 Game detail 與 Compare 不出現無 `href` 的假入口。
- 1440、390、320 viewport 無頁面級水平溢位；連結具明確 focus-visible 與可讀文字。
- 無 JavaScript 時 Guide、Footer 與 Game detail 入口仍可讀；Compare 的既有 no-JavaScript fallback 不退化。
- 完整 Preview `npm run verify`、內部連結、Preview safeguards 與 `git diff --check` 通過。

## 8. 人工關卡

- 本規格與本機施工已於 2026-09-02 取得人工核准。
- 本輪亦已核准 Commit、一般 Push、GitHub Actions、Cloudflare Pages Preview 部署與線上回讀。
- 遇到 Schema、taxonomy、relationship owner、URL schema、資料不足或產品範圍擴張時必須停止。
- 第 7 項不得自動開始。

## 9. 規格出口

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_ITEM: 第6項 資料方法與可信度入口`

`CURRENT_STEP: 第6-2步 同步核准規格並進行本機施工`

`CURRENT_STATE: APPROVED_FOR_LOCAL_IMPLEMENTATION`

`GUIDE_SLUG: slot-hub-data-methodology`

`GUIDE_CATEGORY: data`

`RELATIONSHIP_TYPE: NONE`

`SCHEMA_CHANGE_ALLOWED: NO`

`PUSH_ALLOWED: YES；僅在完整本機驗證通過後`

`DEPLOY_ALLOWED: YES；僅 Cloudflare Pages Preview`

`NEXT_ALLOWED_ACTION: 完成本機施工、published 模擬、Commit、Push、CI、Preview 部署與線上回讀`
