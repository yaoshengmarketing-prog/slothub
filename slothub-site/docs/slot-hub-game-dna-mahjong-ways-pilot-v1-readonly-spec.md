# Slot Hub 遊戲 DNA：Mahjong Ways 單款 Pilot v1

文件狀態：`APPROVED FOR LOCAL IMPLEMENTATION`

建立日期：2026-09-03

適用範圍：`/games/mahjong-ways/` 的單款資料判讀模組

> 本規格承接 `docs/slot-hub-master-blueprint-v2.md` 第 9 項。使用者已選定 Mahjong Ways 作為唯一 Pilot，並核准連續完成本機施工、驗證、Commit、Push、Cloudflare Pages Preview 與線上回讀。

## 1. 白話目的

Game detail 已經列出 RTP、波動度、最高倍數、賠付機制、Features 與來源，但第一次閱讀的人仍需自行判斷這些欄位彼此的關係。遊戲 DNA 不再建立一份資料，而是把同一筆 Game record 中最需要一起閱讀的訊息整理成一個精簡判讀層。

它回答：

- 這款遊戲以什麼主要玩法運作？
- 哪些版本或原廠標籤不能只看統一數字？
- 目前資料能確認到哪裡、最後何時核對？
- 接下來可往完整資料、玩法相近或資料方法的哪個入口繼續？

它不回答「這款遊戲有多好」、不計算完整度、相似度、勝率或推薦分數。

## 2. Pilot 選擇

唯一 Pilot：`mahjong-ways`

選擇理由：

- 同時具備主要 RTP 與 7 個 RTP values，可測試「主要顯示值不等於只有一個版本」。
- 同時保存原廠波動度 `Session Volatility: Medium` 與 Slot Hub 統一值 `medium`。
- 最高倍數同時保存數字與原廠標籤，可示範數字不能脫離標籤與基準閱讀。
- 具備 Ways、盤面、winCount 與多項 Feature，可形成清楚玩法骨架。
- 有四筆第一方來源、最後核對日期、玩法相近與精確 Explorer 入口。

其他 29 款本輪不得輸出空模組、佔位、隱藏 markup 或額外間距。

## 3. 位置與頁面責任

模組放在：

1. Game hero
2. 核心數據
3. **遊戲 DNA Pilot**
4. 完整遊戲資料
5. 既有 Guide、玩法相近、關聯遊戲與來源

放在核心數據後，是因為使用者需先看到原始核心值，再由 DNA 告訴他如何把它們一起讀；放在完整資料前，則可作為進入詳細欄位的判讀橋樑。

## 4. 資料來源與單一事實來源

DNA 只讀取目前 published Mahjong Ways Game record，包含：

- `winMechanism`、`winCount`、`reels`、`rows`、`features`
- `rtp`、`rtpVariants`
- `volatilityOriginal`、`volatilityNormalized`
- `maxWinMultiplier`、`maxWinLabelOriginal`
- `sources`、`lastVerifiedAt`

不得：

- 在 Game frontmatter 新增 DNA 欄位。
- 建立第二份遊戲資料 mapping。
- 從摘要或名稱推導結構化事實。
- 補猜投注基準、版本、市場或缺值。
- 改變現有 Game → Guide relationship、玩法相近或 Explorer 結果。

可使用一個單款 Pilot slug 常數控制輸出範圍；該常數只代表功能 rollout，不保存第二份內容資料。

## 5. 核准內容範圍

### 5.1 玩法骨架

- 顯示共同 taxonomy 中的主要賠付機制：多路贏法。
- 顯示已知的 1,024 路與 5 × 4 盤面。
- 顯示 Game record 目前保存的 Feature；不得主觀替 Features 排名或改名。

### 5.2 版本與標籤

- RTP 同時顯示主要值 `96.92%` 與「已收錄 7 個值」。
- 不把 7 個 values 說成所有市場都可自由選擇的版本。
- 波動度並列原廠標籤與 Slot Hub 統一顯示，清楚標明兩者責任不同。
- 最高倍數顯示 `25,000×` 與完整原廠標籤；不得補寫未被來源確認的投注基準。
- 最高倍數旁保留「數字不代表容易取得」的判讀提醒。

### 5.3 資料可信度

- 顯示第一方來源筆數與最後核對日期。
- 不使用百分比、星等、完成度分數或「高可信」排名。
- 資料筆數只描述目前 record，不代表原廠全部版本均已涵蓋。

### 5.4 下一步入口

- `查看完整遊戲資料`：頁內 anchor。
- `查看玩法相近`：只有既有玩法相近模組存在時才顯示頁內 anchor。
- `了解資料整理方式`：沿用現有 published 資料方法 Guide URL。
- 不新增「立即遊玩」、CPA、推薦或新的永久頁。

## 6. 命名與風險語言

模組名稱：`遊戲 DNA`

固定說明：`把同一筆遊戲資料中的玩法、版本與來源放在一起讀；這不是評分或推薦。`

禁止敘述：

- 完整度百分比、DNA 分數、推薦指數或排名。
- RTP 較高所以較容易贏。
- 波動度可預測下一次結果。
- 25,000× 一定能取得或代表取得機率。
- 七個 RTP values 在所有市場均可選。
- Features 數量越多越好。

## 7. 視覺方向

採單一連續資料指紋帶，不使用四張同質卡片：

```text
┌──────────────────────────────────────────────────────────┐
│ 遊戲 DNA     說明文字                                     │
├────────────┬────────────┬────────────┬───────────────────┤
│ 玩法骨架    │ RTP 版本    │ 原廠／統一值 │ 來源與下一步       │
└────────────┴────────────┴────────────┴───────────────────┘
```

- 桌機：四個資料群組在同一水平帶內，依欄線形成掃讀節奏。
- 390px／320px：依 DOM 順序轉成單欄，不以水平捲動承接。
- 沿用 Slot Hub 深藍、淺底、螢光綠與既有 Game detail typography。
- 視覺記憶點只放在連續的資料帶與左側識別線，不增加裝飾圖、雷達圖或進度環。
- 所有連結保持至少 44px touch target 與可見 `focus-visible`。

## 8. 語意與無 JavaScript

- 使用有標題的 `<section>`。
- 資料群組使用 `<dl>`、`<dt>`、`<dd>`；Feature 使用語意化 list。
- 核心內容由 Astro build-time 靜態輸出，不建立 client state。
- JavaScript 關閉時，全部文字與連結仍存在。
- 螢幕閱讀器依「模組說明 → 玩法 → 版本與標籤 → 來源 → 下一步」閱讀。
- 200% reflow、forced colors 與 print 不得依賴背景色才能辨識結構。

## 9. 預計施工檔案

允許的最小範圍：

- `src/lib/game-dna-pilot.mjs`：單款 gating 與純資料 projection。
- `src/pages/games/[slug].astro`：插入語意化模組。
- `src/styles/global.css`：Game-detail-only DNA 樣式。
- `scripts/verify-game-dna-pilot.mjs`：單款、來源、語意、隔離與 build 驗證。
- `package.json`：將既有驗證腳本接入 `npm run verify`。
- `docs/slot-hub-work-roadmap.md`：記錄第 9 項施工狀態。

若必須修改 Schema、Game data、taxonomy、Guide relationship、Explorer URL、Compare、Search 或其他頁面，必須停止。

## 10. 驗收條件

- 30 款 published Games 仍通過資料審計。
- 只有 `/games/mahjong-ways/` 輸出 DNA；其他 29 款為 0。
- 所有值可回溯至 Mahjong Ways Game record。
- 沒有分數、排名、推薦、完成度百分比或補猜值。
- RTP 主要值與 7 個 values 的責任清楚。
- 原廠／統一波動度清楚分開。
- 最高倍數保留原廠標籤及風險提醒。
- 來源數與最後核對日期正確。
- 完整資料、玩法相近及資料方法入口正確。
- 既有 166 筆 Game → Guide、Similar Play、Search、Explorer、Compare 不變。
- 1440×900、390×844、320×844 無頁面級水平溢位。
- 其他 29 款無空模組或額外間距。
- 無 JavaScript、鍵盤、200% reflow、forced colors 與 print 可讀。
- console／hydration／runtime errors 為 0。
- 完整 Preview `npm run verify` 與 `git diff --check` 通過。

## 11. 本輪邊界

- 單款 Pilot，不擴張至全部 Game detail。
- 不修改 Game data、Schema、taxonomy、relationship 或 URL。
- 不建立評分、排名、推薦、AI 或個人化。
- 不處理第 10 項 Game／Provider 擴充。
- 不處理 Wix、migration、DNS、301 或正式索引。

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_ITEM: 第9項 遊戲 DNA 單款 Pilot`

`CURRENT_STATE: APPROVED_FOR_LOCAL_IMPLEMENTATION`

`PILOT_GAME: mahjong-ways`

`SCHEMA_CHANGE_ALLOWED: NO`

`GAME_DATA_CHANGE_ALLOWED: NO`

`PUSH_ALLOWED: YES；僅在完整本機驗證與 Commit 邊界通過後`

`DEPLOY_ALLOWED: YES；僅 Cloudflare Pages Preview`

`NEXT_ALLOWED_ACTION: 完成單款 Pilot、完整驗證、Commit、Push、CI、Preview 部署與線上回讀`
