# Slot Hub Guide 閱讀路線 v1 規格

文件狀態：`APPROVED FOR IMPLEMENTATION`

建立日期：2026-09-02

適用範圍：首頁、Guide index 與 `/slots/` 的 Guide 內容組織

## 1. 白話目標

目前 12 篇 published Guide 已有固定網址、內容與 relationship owner，但首頁直接列出全部文章，Guide index 只按內容 category 分組，`/slots/` 又以 collection 順序截取前五篇。三個入口沒有共同回答「第一次來應先讀什麼、接著去哪裡」。

第一版建立一套共用、固定且可解釋的閱讀路線，讓使用者依任務前進，不新增文章、永久頁、閱讀帳號或進度功能。

## 2. 核准產品邊界

- 閱讀路線固定為：第一次使用、核心數據、玩法機制、遊戲功能、資料限制。
- 路線是內容導覽，不是課程進度、排名或必讀門檻。
- 使用者可以直接開啟任何文章，不必照順序完成。
- 首頁、Guide index 與 `/slots/` 使用同一份 build-time catalog，不在三個頁面各自維護排序。
- Guide frontmatter 的 `category`、`level`、tags 與 relationship owner 均不修改；閱讀路線是 presentation 層，不建立第二份 taxonomy。
- 捕魚機 Guide 保留為獨立延伸類型，不強塞進老虎機五段閱讀路線。
- 不新增永久路線頁、URL schema、Search intent、Explorer filter、Game relationship 或新內容。

## 3. v1 路線與文章歸屬

| 路線 | 使用者問題 | published Guide |
| --- | --- | --- |
| 第一次使用 | 我第一次進站，先怎麼閱讀欄位與術語？ | `slot-beginners-guide`、`slot-terms-glossary` |
| 核心數據 | RTP、波動度與最高倍數各回答什麼？ | `rtp-explained`、`volatility-explained`、`slot-max-win-explained` |
| 玩法機制 | 一般得獎組合依什麼規則成立？ | `slot-payout-mechanisms-explained` |
| 遊戲功能 | 符號與功能如何觸發、改變或延續流程？ | `slot-symbols-and-features`、`slot-multiplier-explained`、`slot-cascading-tumble-avalanche-explained`、`slot-bonus-buy-explained` |
| 資料限制 | 原廠值、統一值、缺值、版本與來源怎麼讀？ | `slot-hub-data-methodology` |
| 延伸類型 | 捕魚機與老虎機的基本差異 | `fishing-games-basics` |

每篇 published Guide 在 Guide index 只出現一次。未來新增 Guide 時必須先經既有 Guide Content Workflow，再由人工決定是否加入既有路線；catalog 不因 category 或 taxonomy 自動猜測歸屬。

## 4. 三個頁面的角色

### 4.1 首頁

- 保留 Hero 的「新手開始了解」直接連到 Beginners Guide。
- 原本一次列出全部 Guide 的區塊改為五張閱讀路線摘要卡。
- 每張卡顯示路線名稱、簡短目的、篇數與前往 Guide index 精確 anchor 的連結。
- 首頁仍是方向選擇，不複製完整文章清單。

### 4.2 Guide index

- 成為完整閱讀路線 owner。
- 頂部導覽顯示五段閱讀路線及獨立延伸類型。
- 依 catalog 的固定順序列出 12 篇 published Guide，保留文章標題與 description。
- anchor 使用穩定的 presentation id，不改變任何 Guide URL。

### 4.3 `/slots/`

- Knowledge Map 繼續依 relationship owner 顯示概念，不由閱讀路線取代。
- 原本依 collection 順序截取五篇的「新手閱讀路線」改為同一份五段路線摘要。
- 卡片導向 Guide index 對應 anchor；不冒充 Explorer filter。

## 5. 共用資料模型

共用 catalog 每一段只保存：

- 穩定 id；
- 顯示序號；
- 中文標題；
- 簡短說明；
- 已核准 Guide slug 順序。

頁面依 published Guide collection 投影標題、description 與 URL。catalog 不保存文章正文、relationship taxonomy、Game mapping 或搜尋 aliases。

若 catalog slug 缺少 published Guide，驗證必須失敗，不能顯示空卡或靜默改用其他文章。未列入 catalog 的 published Guide 也必須由驗證指出，避免新增內容永久失去入口。

## 6. UI 與可及性契約

- 路線摘要採真正 `<a href>`；不得使用無目的地的假 CTA。
- Guide index 使用具可讀標題的 `<nav>` 與 `<section>`；anchor 可由鍵盤及分享網址直接抵達。
- 卡片至少 44px 觸控高度，`focus-visible` 清楚。
- 1440px 可多欄、390px 與 320px 採安全單欄或既有 breakpoint，不產生頁面級水平溢位。
- 長中文與中英混排可自然換行，不使用 `word-break: break-all`。
- 核心內容是 build-time HTML；無 JavaScript 時路線、文章與連結仍完整。

## 7. 不修改事項

- Guide Markdown、frontmatter、slug、category、level、relationship owner 與正文。
- Guide detail、Game detail、Search、Explorer、Compare、Provider、Knowledge Map 資料來源。
- Schema、taxonomy、resolver、URL serializer、SEO 與 Preview safeguards。
- 會員、登入、閱讀進度、收藏、推薦、CPA、Wix／migration／DNS／301。

## 8. 預計施工檔案

- 新增一個最小 Guide reading path catalog／projection helper。
- 修改 `src/pages/index.astro`。
- 修改 `src/pages/guide/index.astro`。
- 修改 `src/pages/slots/index.astro`。
- 最小共用 CSS。
- 新增一支 reading path verifier，並接入既有 `npm run verify`。
- 同步 `docs/slot-hub-work-roadmap.md`。

若施工需要修改 Guide frontmatter、Schema、relationship、Search、Explorer、Guide detail 或建立新頁，視為超出範圍並停止。

## 9. 驗收條件

- 12 篇 published Guide 全部且各只投影一次：五段路線 11 篇、延伸類型 1 篇。
- 三個頁面讀取同一 catalog；不各自硬編第二份順序。
- 首頁與 `/slots/` 各顯示五段摘要，不重複列出完整 Guide library。
- Guide index 依五段路線與延伸類型完整呈現。
- 所有 anchor、Guide URL、首頁新手 CTA 與 Knowledge Map 既有入口正常。
- 既有 relationship owner、166 筆 Game → Guide、Search／Explorer 投影不變。
- 1440×900、390×844、320×844 無頁面級水平溢位。
- 無 JavaScript、鍵盤、focus-visible 與 44px touch target 通過。
- 完整 Preview `npm run verify`、內部連結、Preview safeguards 與 `git diff --check` 通過。

## 10. 核准與施工狀態

使用者已於 2026-09-02 核准依 V2 藍圖連續完成盤點、規格同步、本機施工、驗證、Commit、Push、CI、Cloudflare Pages Preview 與線上回讀。一般工程細節可依既有架構處理；若需要新產品決策、資料、Schema、taxonomy、relationship 或重大範圍擴張，必須停止。

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_ITEM: 第7項 Guide 閱讀路線 v1`

`CURRENT_STEP: 第7-1／7-2步 規格同步與本機施工`

`CURRENT_STATE: APPROVED_FOR_IMPLEMENTATION`

`WEBSITE_CHANGED: NO`

`NEXT_ALLOWED_ACTION: 依本規格完成本機施工、完整驗證、Commit、Push、Preview 部署與線上回讀`
