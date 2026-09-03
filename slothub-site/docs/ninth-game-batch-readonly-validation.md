# Slot Hub 第九批 Game 只讀驗證

狀態：VALIDATED FOR INTAKE  
核對日期：2026-09-03

## 結論

第九批採 NetEnt 與 Booming Games 各兩款，優先把兩家現有三款的 Provider 補至五款，並補入 Megaways、傳統 Paylines、Hold & Win、Respins 與 Jackpot 等既有玩法。四款皆可由現有 Schema 與 taxonomy 誠實承接，不新增 Provider 或公開功能。

## 逐款結果

| Game | Provider | 主要證據 | 精確資料處理 | 圖片 | 判定 |
| --- | --- | --- | --- | --- | --- |
| Divine Fortune | NetEnt | 官方現行遊戲頁 | 保存 96.59% RTP、Medium、1,000× bet、5×3、20 paylines、發行日與功能；Bonus mode 不推定為 Bonus Buy | 官方遊戲頁素材庫作品圖 | PASS |
| Divine Fortune Megaways | NetEnt | 官方現行遊戲頁 | 保存 96.09% RTP、4,500× bet、6×(2–7)、117,649 Megaways、發行日與功能；未提供可引用波動度標籤，維持缺值 | 官方遊戲頁素材庫作品圖 | PASS |
| Gold Gold Gold Hold and Win | Booming Games | 官方發布稿 | 保存 5×3、25 paylines、2,000× a bet、Hold and Win、Respins、Free Spins 與發行日；未提供 RTP／波動度，維持尚未核實 | 官方發布稿主圖 | PASS |
| Ultra Buffalo Hold and Win | Booming Games | 官方發布稿 | 保存 5×3 基本盤面、20 fixed paylines、5,000×、Wild Buffalo Herd、Ultra Hold and Win 與動態擴展至 5×8；未提供 RTP／波動度，維持尚未核實 | 官方發布稿主圖 | PASS |

## 邊界

- NetEnt 頁面的 `Bonus mode` 不能單獨證明存在直接購買入口，因此不標記 `bonus-buy`。
- Divine Fortune Megaways 的動態列數以原廠 `6x(2-7)` 原文保存，不強制填入固定 `rows`。
- Booming Games 發布稿沒有提供 RTP 或波動度；缺值保留為尚未核實，不寫成原廠未公開。
- Feature 標記只採官方頁或發布稿明示的遊戲功能；不從主題、系列或圖片推測。
