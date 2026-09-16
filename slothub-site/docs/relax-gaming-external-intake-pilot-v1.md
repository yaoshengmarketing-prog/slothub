# Relax Gaming 外部資料收集 Pilot v1

> 狀態：`FULL CATALOG CAPTURE COMPLETE; EDITORIAL INTAKE ACTIVE`
>
> 核對日期：2026-09-16

## 1. Pilot 範圍

第一家選用已收錄的 Relax Gaming。目錄只取官方 `Relax Own Games`，不把 Relax 聚合平台上的第三方遊戲誤認為 Relax 自製作品。

- 既有基線：14 家 Provider、58 款 published Game。
- 官方目錄：175 筆產品，其中 173 筆符合現行 Game 收錄範圍；2 筆是 Roulette／Blackjack 桌面遊戲，留在目錄但不進遊戲處理佇列。
- 去重結果：既有 `Temple Tumble`、`The Great Pigsby Megaways` 直接命中；先後新增 `Money Train 2`、`Iron Bank`、`AgroCulture`、`Ancient Tumble` 後，目錄共對應 6 筆站內資料。
- 全目錄第一輪：173 筆 eligible 產品頁與真實圖片候選均已擷取；167 筆尚待重要欄位補查與逐款編輯核對。待補不代表都會發布。

## 2. 收集責任分工

- 程式直接取得：官方名稱、產品網址、產品類型、官方縮圖網址、目錄出現狀態。
- 程式直接完成：現有名稱／原名／別名正規化、重複比對、待處理佇列、逐款進度保存。
- 只在需要時使用 AI：繁體中文摘要、Mechanism／Feature 對應、原廠用詞差異、版本與衝突判讀。
- 不會把整個廠商網站反覆送交 AI；週檢只重新解析官方目錄。

`catalogSeenAt` 只表示目錄看見日期。它與 Game 的 `lastVerifiedAt` 分開保存；看到遊戲仍在目錄裡，不會更新最近核對日期。

## 3. Pilot 新增遊戲

### Money Train 2

- 官方身份、發行日、5 軸／40 Paylines、Money Cart Bonus Round、Respins、Multiplier、Buy Feature 與 50,000× stake 均完成第一方核對。
- 官方產品頁只列 `German RTP: 90%`，因此保存為 `rtpVariants: [90]`，不建立主要 RTP。
- 未取得可直接使用的正式波動度標籤，保持缺值。

### Iron Bank

- 官方身份、發行日、6×4、4,096 Ways、高波動度、三種 Free Spins 選擇、Buy Feature 與 49,998.9× bet 均完成第一方核對。
- 官方產品頁只列 `German RTP: 90%`，因此保存為 `rtpVariants: [90]`，不建立主要 RTP。
- 原廠寫的是 `Bonus symbols`，沒有把它推論成 Scatter taxonomy。

### AgroCulture

- 官方產品頁、發布稿、Demo config 與 Client Area 圖片完成核對；保存 2-4-4-4-4-2、1,024 Ways、五級入口成本、10,000×、Bonus 路徑與最高 32 次 Free Spins。
- 多個二級資料來源一致報告 RTP 96.1%，故只保存為一個已知版本值，不建立主要 RTP；官方頁所列 `_94／_90／_86／_92` 只保存為 Game ID，不由尾碼補猜 RTP。
- 波動度來源有 `Medium-High` 與 `High` 差異，保留原文衝突，不建立 Slot Hub 統一值。

### Ancient Tumble

- 官方產品頁、發布稿、Bonus Reels 發布稿與 Client Area 圖片完成核對；保存五種 Free Spins、Cascading、50×／400× Buy Feature、後續 10× Bonus Reels 與 10,000×。
- 二級來源交叉支持 6×6、最高 46,656 Ways 與 RTP 96.1%／94% 兩個版本；兩值分開保存，不指定主要 RTP。
- 波動度來源有 `High` 與 `Medium to High` 差異，保留原文衝突，不建立 Slot Hub 統一值。

## 4. 續跑與失敗處理

- `data/external-intake/relax-gaming-catalog.json` 保存每筆 `pending／captured／verified／failed`、`not-imported／imported` 與 `collectionOutcome` 狀態。
- 每款完成後立即寫回，不需重抓已完成項目。
- 每日佇列依 `in-progress → failed → pending → captured` 排序；突然中斷的項目與失敗項會優先接回，已完成項目重跑時為 no-op，官方 URL 在同一佇列中只會出現一次。
- 欄位找不到時保留缺值；版本分開保存；來源衝突寫入 notes 並保留既有值。
- 單款失敗不阻擋其他項目，下一輪只選失敗或尚未完成的 eligible entries。

重要欄位的補查順序為：官方產品頁、Rules／Paytable／Help、正式 PDF／Client Hub、官方新聞稿、可追溯的官方授權合作方，最後才是清楚標示的非官方資料站。後兩者不得無來源覆寫既有值；衝突保留差異，不平均、不補猜。

圖片先驗證官方目錄及產品頁提供的真實素材。只有所有安全真實來源都不可用時，才建立並明確標示示意封面；缺圖本身不會把遊戲從目錄移除。

## 5. 第一輪上限與排程依據

Pilot 以 2 款遊戲完成逐款來源核對、翻譯判讀、圖片保存及全站驗證。完整機械擷取實跑 173 款共 423,804 ms，平均每款 2,464 ms；但正式發布的主要成本仍是補查、語意判讀與整站驗證，因此每日發布上限暫維持 2 款，不因下載速度快而放寬品質門檻。

排程需避開現有 08:30、09:00 與 18:30 工作：

- 每日 02:10：最多處理 2 款，依 in-progress → failed → pending → captured 待補順序接續。
- 每週日 03:10：只更新 Provider 目錄與新增候選，不更新 Game `lastVerifiedAt`。
- 每月 1 日 04:10：最多回查 2 款已收錄 Game；只有逐欄位重新核對完成才更新 `lastVerifiedAt`。

三個排程都執行於目前 Codex `Local` 主機，工作目錄是 `C:\Users\User\Documents\Claude\Projects\老虎機 Slot`，排程時區為 `Asia/Taipei`。因為不是雲端 runner，排程時間需要該 Windows 主機保持開機、清醒、可連網，且本機 Codex 排程服務可用。

## 6. Pilot 出口

- 新增：4 款（本次排程實跑新增 AgroCulture、Ancient Tumble 兩款）。
- 更新：1 家 Provider 摘要與來源核對日期；既有兩款 Game 未因目錄掃描更新。
- 全目錄擷取：173／173 款成功，真實圖片可用 173／173。
- 待補查：167 款；原始全目錄缺值統計仍作佇列優先線索，本次兩款已完成逐欄位補查，未把二級來源不足的欄位猜成原廠值。
- 排除：2 款桌上遊戲（Roulette Nouveau、Blackjack Neo），均保存原因。
- 失敗：0 款；retryable queue 為 0。
- 網站總量：62 款 published Game、14 家 published Provider。
