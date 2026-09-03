# Slot Hub 第十批 Game 只讀驗證

狀態：VALIDATED FOR INTAKE  
核對日期：2026-09-03

## 結論

第十批採 CQ9 Gaming 與 JILI Games 各兩款，把兩家原本各一款的 Provider 覆蓋補至三款，並補入 243 Ways、40 Paylines、32,400 Megaways 與 JILI 原廠特殊輪盤等既有資料差異。四款皆可由現有 Schema 與 taxonomy 誠實承接，不新增 Provider、公開功能或分類。

## 逐款結果

| Game | Provider | 主要證據 | 精確資料處理 | 圖片 | 判定 |
| --- | --- | --- | --- | --- | --- |
| Jump High 2 | CQ9 Gaming | 官方 Guide 與官方遊戲目錄 | 保存 243 Ways、96.07 RTP、High、官方 `maximum_win: 5000` 原始欄位、Free Game 與倍數選項；超過 150 倍是 Free Game 內累積倍數，不另寫成整局 Max Win | 官方遊戲目錄橫式背景 | PASS |
| All Wilds | CQ9 Gaming | 官方 Guide 與官方遊戲目錄 | 保存 40 Paylines、96.03 RTP、High、官方 `maximum_win: 3000` 原始欄位，以及 Free Game 內複製滿滾輪 Wild 的規則；不從遊戲名稱擴張其他 Feature | 官方遊戲目錄橫式背景 | PASS |
| Golden Empire | JILI Games | 官方 Game Info | 保存 `MAX WIN 2000x`、`LOW-MED`、`32400 megaways`、動態盤面描述、消除補位、Free Game、Wild 轉換及累積 Multiplier；只保留 2023.12 的月份精度，不虛構單一發行日 | 官方 Game Info 橫式作品背景 | PASS |
| Money Coming | JILI Games | 官方 Game Info | 保存 `MAX WIN 10000x`、`LOW-MED`、官方 Paylines 欄位的 `1 line` 及 Special Wheel／Lucky Wheel；官方同頁又說得獎不需連線，因此不把 `1 line` 強制分類成 Paylines mechanism | 官方 Game Info 橫式作品背景 | PASS |

## 邊界

- CQ9 `game_equity.maximum_win` 數字可以保留供辨識，但原始欄位沒有在同一處完整交代投注基準；文章摘要不把它宣稱為與 `x total bet` 完全同質。
- Jump High 2 的 `最高累積倍數超過 150 倍` 是 Free Game 內部倍數敘述，不拿來覆蓋官方結構化 `maximum_win` 欄位。
- JILI 的 `LOW-MED` 保留原文，不強制轉成 Slot Hub 的單一 normalized 值。
- Golden Empire 的 `32400 megaways` 依原廠顯示分類為既有 `megaways`；盤面列數沒有足夠固定值，因此不補 reels／rows。
- Money Coming 的 `Paylines: 1 line` 與原廠「不需連線」描述存在語意張力；本批保留原文並不設定主要 Mechanism，也不從 Wheel 名稱推測未明示的標準 Feature。
- 圖片皆來自官方產品頁或目錄；不下載第三方重製圖，不裁切或加上 Slot Hub 文案。
