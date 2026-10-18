# Project agent routing

- Slot Hub Guide 的選題、Brief、內容草稿、來源核對、結構化關聯、模擬發布、人工審查或 Preview 發布工作，使用 `$slot-hub-guide-content`。
- Slot Hub 的 Game／Provider 收錄、既有遊戲回查或 Demo 補查，必須先讀取 `slothub-site/docs/game-intake-workflow-v1.md` 與 `slothub-site/docs/game-demo-coverage-and-presentation-v1.md`。固定責任是：每款 published Game 必須有站內 Provider 頁、每個 published Provider 的 `officialUrl` 必須是可追溯的官方頁：優先使用工作室自有並經核實的官方網站；只在 Stake 發行的 Stake Engine 工作室，若找不到自有網站，可使用 Stake 工作室目錄頁（`https://stake.com/casino/group/<studio>`）；其他娛樂城／營運商頁面與聯盟行銷、推廣碼網站一律不得作為 `officialUrl`（規則 2026-10-18，由 `npm run verify:provider-official-urls` 檢查）；Demo／單款遊戲入口是獨立的可選資料，有精確入口才加入，不得以 Provider 首頁冒充。
