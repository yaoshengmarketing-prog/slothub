# Project agent routing

- Slot Hub Guide 的選題、Brief、內容草稿、來源核對、結構化關聯、模擬發布、人工審查或 Preview 發布工作，使用 `$slot-hub-guide-content`。
- Slot Hub 的 Game／Provider 收錄、既有遊戲回查或 Demo 補查，必須先讀取 `slothub-site/docs/game-intake-workflow-v1.md` 與 `slothub-site/docs/game-demo-coverage-and-presentation-v1.md`。固定責任是：每款 published Game 必須有站內 Provider 頁、每個 published Provider 的 `officialUrl` 必須是可追溯的官方頁：優先使用工作室自有並經核實的官方網站；只在 Stake 發行的 Stake Engine 工作室，若找不到自有網站，可使用 Stake 工作室目錄頁（`https://stake.com/casino/group/<studio>`）；其他娛樂城／營運商頁面與聯盟行銷、推廣碼網站一律不得作為 `officialUrl`（規則 2026-10-18，由 `npm run verify:provider-official-urls` 檢查）；Demo／單款遊戲入口是獨立的可選資料，有精確入口才加入，不得以 Provider 首頁冒充。
- 開工讀完上述兩份文件後，接著讀 `slothub-site/docs/geo-restricted-source-access.md`。官方產品目錄、單款頁或圖片出現 403／地區限制時，不得因此判定來源品質差或候選不存在；先保存 HTTP 與畫面證據，按美國付費瀏覽器自動切換、日本桌面 IP 手動切換、韓國 IP 的順序重試。只有實際切換成功才記錄該地區，詳細步驟與回退規則見該文件。
