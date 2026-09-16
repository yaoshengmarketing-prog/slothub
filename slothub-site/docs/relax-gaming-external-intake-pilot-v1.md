# Relax Gaming 外部資料收集 Pilot v1

> 狀態：`PILOT IMPLEMENTED`
>
> 核對日期：2026-09-16

## 1. Pilot 範圍

第一家選用已收錄的 Relax Gaming。目錄只取官方 `Relax Own Games`，不把 Relax 聚合平台上的第三方遊戲誤認為 Relax 自製作品。

- 既有基線：14 家 Provider、58 款 published Game。
- 官方目錄：175 筆產品，其中 173 筆符合現行 Game 收錄範圍；2 筆是 Roulette／Blackjack 桌面遊戲，留在目錄但不進遊戲處理佇列。
- 去重結果：既有 `Temple Tumble`、`The Great Pigsby Megaways` 直接命中；Pilot 新增 `Money Train 2`、`Iron Bank` 後，目錄共對應 4 筆站內資料。
- 待逐款核對：169 筆。待處理只代表目錄候選，不代表都會發布。

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

## 4. 續跑與失敗處理

- `data/external-intake/relax-gaming-catalog.json` 保存每筆 `pending／verified／failed` 與 `not-imported／imported` 狀態。
- 每款完成後立即寫回，不需重抓已完成項目。
- 欄位找不到時保留缺值；版本分開保存；來源衝突寫入 notes 並保留既有值。
- 單款失敗不阻擋其他項目，下一輪只選尚未完成的 eligible entries。

## 5. 第一輪上限與排程依據

Pilot 以 2 款遊戲完成逐款來源核對、翻譯判讀、圖片保存及全站驗證。第一版每日上限因此設定為 2 款；後續只有在品質與執行時間穩定後才調整。

排程需避開現有 08:30、09:00 與 18:30 工作：

- 每日 02:10：最多處理 2 款 pending Game。
- 每週日 03:10：只更新 Provider 目錄與新增候選，不更新 Game `lastVerifiedAt`。
- 每月 1 日 04:10：最多回查 2 款已收錄 Game；只有逐欄位重新核對完成才更新 `lastVerifiedAt`。

## 6. Pilot 出口

- 新增：2 款。
- 更新：1 家 Provider 摘要與來源核對日期；既有兩款 Game 未因目錄掃描更新。
- 待處理：169 款 eligible Relax 目錄候選。
- 失敗：0 款。
- 網站總量：60 款 published Game、14 家 published Provider。
