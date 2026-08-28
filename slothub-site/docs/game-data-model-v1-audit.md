# 遊戲資料模型 v1 與 Seed Data 盤點

盤點日期：2026-08-28  
範圍：目前 12 款已發布 Seed Data  
原則：優先採遊戲廠商官方頁面或官方開發者資料；查不到即留空，不用第三方資料補猜。

## 相容策略

- 保留 `rtp`、`volatility`、`paylines`、`bonusFeatures`、`source`、`updatedAt`，現有搜尋、篩選、比較及網址繼續使用原欄位。
- `rtpVariants` 儲存完整可選 RTP 清單，包含目前作為主要顯示值的 `rtp`，不再只保存替代版本。
- `volatilityOriginal` 保存原廠文字；`volatilityNormalized` 使用 Slot Hub 的 `low`、`medium`、`medium-high`、`high`、`very-high`。
- `reels` 暫時保留既有盤面字串（例如 `5x3`）以維持前台相容，`rows` 另以數字保存。未來卡片或資料頁改版時，再將前台顯示改讀結構化欄位。
- `winCount` 只保存 Paylines／Ways 的數量；「8 個以上符號得獎」是觸發門檻，不會錯填為 8 條線。
- `features` 是可驗證與篩選的結構化標籤；`bonusFeatures` 保留原廠較具體的功能名稱。
- `sources` 支援多來源；單一 `source` 暫時保留給現有資料頁使用。

## 12 款資料取得率

| 欄位 | 有資料 | 取得率 |
| --- | ---: | ---: |
| `rtpVariants` | 4 / 12 | 33% |
| `volatilityOriginal` | 9 / 12 | 75% |
| `volatilityNormalized` | 9 / 12 | 75% |
| `maxWinMultiplier` | 12 / 12 | 100% |
| `reels` | 11 / 12 | 92% |
| `rows` | 11 / 12 | 92% |
| `winMechanism` | 12 / 12 | 100% |
| `winCount` | 6 / 12 | 50% |
| `features` | 12 / 12 | 100% |
| `bonusBuy` | 9 / 12 | 75% |
| `jackpotType` | 0 / 12 | 0% |
| `minBet` | 3 / 12 | 25% |
| `maxBet` | 3 / 12 | 25% |
| `releaseDate` | 6 / 12 | 50% |
| `gameId` | 3 / 12 | 25% |
| `sources` | 12 / 12 | 100% |
| `lastVerifiedAt` | 12 / 12 | 100% |

`rtpVariants` 的 33% 不是 8 款資料失敗：目前只在官方明確公布多個 RTP 版本時填入。單一 RTP 仍沿用 `rtp`；沒有多版本證據時不製造只有一項的 variants 清單。

## 經常找不到的欄位

- `jackpotType`：官方即使寫到 Jackpot，也常未說明是固定、累進、區域或聯網類型，因此全部留空。
- `minBet`、`maxBet`、`gameId`：Slotmill 開發者資料表最完整；其他三家公開產品頁多未提供。
- `releaseDate`：新聞型產品頁通常有日期，純遊戲頁未必提供。
- `winCount`：Cluster Pays、Scatter Pays 等機制沒有可直接對應的固定線數或 Ways 數。
- `rtpVariants`：只有廠商明確列出多個配置版本時才填入。

## 容易混淆的定義

- RTP 主值與版本：`rtp` 是目前前台主要顯示值，`rtpVariants` 是官方公布的完整版本集合，不能把最高值當成唯一 RTP。
- 波動度：Hacksaw 使用 5 分量表、Slotmill 使用 High／Very High、ATG 使用 Advanced。`Advanced` 暫映射為 Slot Hub `high`，同時保留原字，日後可調整映射而不丟失來源語意。
- `maxWinMultiplier`：部分 ATG 頁面寫作 Winning ratio，而非 Max Win；目前保存數值並保留官方來源，前台正式說明時要避免改寫成保證回報。
- `winMechanism`：Scatter Pays／Pay Anywhere 不等於傳統 Ways to Win，因此歸入 `other`；文字說明仍由 `paylines` 與 `bonusFeatures` 保留。
- `winCount`：是線數或明確 Ways 數，不是 Cluster／Scatter 的最少符號數。
- `bonusBuy`：只有官方明確提及購買 Bonus／Feature 時才填 `true`；沒提到保持空白，不等於 `false`。
- `jackpotType`：出現 Jackpot 獎項不代表可判定為 progressive 或 networked。
- 投注範圍：`minBet`／`maxBet` 未附貨幣時只代表官方列出的投注單位，前台不可自行加上特定幣別。

## 卡片與資料頁建議

卡片正面建議維持少量決策資訊：

- 廠商與遊戲名稱
- 主要 `rtp`；存在多版本時加「多 RTP 版本」提示，不在卡片塞完整清單
- `volatilityNormalized`
- `winMechanism`
- `maxWinMultiplier`（只有官方已核對時顯示）

只放遊戲資料頁或展開區：

- 完整 `rtpVariants`
- `volatilityOriginal` 與正規化說明
- `reels`、`rows`、`winCount`、完整 `features`
- `bonusBuy`、`jackpotType`
- `minBet`、`maxBet`、`releaseDate`、`gameId`
- `sources` 與 `lastVerifiedAt`

本階段未依上述建議修改卡片或新增快速查看；建議只作下一輪資訊設計依據。

## 官方來源範圍

- Hacksaw Gaming 官方遊戲頁與官方遊戲庫
- Slotmill 官方開發者 Game List
- Booming Games 官方發行新聞與 Games 分類
- ATG Games 官方遊戲資料頁

資料驗證可執行 `npm run verify:data`；完整驗證流程 `npm run verify` 也會先執行資料檢查。
