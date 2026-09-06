# Slot Hub Master Blueprint v3

文件狀態：`APPROVED v3`

正式核准日期：2026-09-06

適用範圍：Slot Hub 產品定位、資訊架構、頁面責任、使用者路線、介面方向、SEO 與本機施工順序

> 本文件整合 Master Blueprint v3 第 1～4 階段已通過人工核准的研究、資訊架構、低保真原型與高保真代表頁結果，並成為目前最高產品依據。
>
> `docs/slot-hub-master-blueprint-v1.md` 與 `docs/slot-hub-master-blueprint-v2.md` 保留為歷史決策文件，不刪除、不改寫。
>
> 本文件不改變既有永久 URL、Schema、taxonomy、資料 owner、Search／Explorer／Compare 狀態契約或 Preview 索引政策。正式網域、DNS、Wix、301、migration 與正式索引切換仍須另外取得明確授權。

## 0. 權威、基線與變更方式

### 0.1 產品基線

v3 以目前已驗證的底座為起點：

- 58 款 published Game。
- 14 家 published Provider。
- 12 篇 published Guide。
- 已有來源、最後核對日期、缺值與多版本保存規則。
- 已完成 Search、Explorer、Compare、Provider Hub、Game detail、Guide relationship、資料方法、引導式探索與 Preview safeguards。

### 0.2 v3 的變更幅度

採用：**保留資料底座並重做產品介面**。

保留：

- Astro Content Collections 與靜態建置。
- Game、Provider、Guide 內容與圖片來源。
- 現有 Schema、taxonomy 與 relationship resolver。
- Search、Explorer、Compare 的核心狀態與 URL 契約。
- 既有永久網址及普通連結能力。
- 現有驗證、Preview noindex 與缺值原則。

重做：

- 首頁的任務入口與內容優先順序。
- 全站主導覽與手機入口。
- `/games/` 引導模式和完整 Explorer 的交接。
- `/slots/` 作為玩法與資料 Hub 的頁面責任。
- Game detail 的資訊層級與模組順序。

不採用完整技術重建，因為現有資料與狀態底座已能支援主要使用者任務；重建會增加遷移、回歸與內容風險，卻不直接改善找遊戲與讀資料的體驗。

### 0.3 施工授權

- 本藍圖決定產品方向、頁面責任與施工順序。
- 每一批只修改與該批責任直接相關的檔案；實際檔案由執行者依現況判斷並在完成時回報。
- 永久 URL、資料結構、SEO 索引策略、內容大量刪除或重大產品選擇，必須另行人工決策。
- 本藍圖核准不等於 Push、部署或正式網域上線授權。

## 1. 產品定位與主要使用者

### 1.1 定位

> Slot Hub 是以可追溯資料為基礎，協助繁體中文使用者找到、理解、比較與繼續探索老虎機遊戲的資料與知識平台。

它結合遊戲資料庫、電子遊戲雜誌的閱讀節奏與容易理解的知識工具；不是娛樂城官網，也不以優惠、註冊、下注或導流為視覺核心。

### 1.2 主要使用者

主要使用者不是先學會 taxonomy 才進站的人，而是「手上有一段線索」的查找者：

1. 我知道遊戲名稱。
2. 我只記得遊戲廠商。
3. 我記得某個功能或玩法。
4. 我想找類似玩法。

次要使用者包括需要理解 RTP、波動度、最高倍數、玩法、Feature、版本、缺值與來源的人，以及已選出一至三款、準備並排判讀的人。

### 1.3 明確不承擔

Slot Hub 不提供：

- 保證獲利、回本或下一次結果預測。
- 宣稱能擊敗 RNG 的投注排列。
- 個人化下注金額、追損或致勝公式。
- 黑盒推薦、虛假熱門、勝率排行或「最值得玩」。
- 沒有資料依據的功能、數值、系列或玩法推論。

資料理解、純數學換算與風險教育可另案研究，但不得轉化為獲利承諾或個人下注建議。

## 2. 全站資訊架構與導覽

### 2.1 一級導覽

桌機與手機使用相同四個主要目的地：

| 導覽名稱 | 永久網址 | 使用者任務 |
| --- | --- | --- |
| 找遊戲 | `/games/` | 依條件探索完整遊戲資料庫 |
| 玩法與資料 | `/slots/` | 理解玩法、Feature 與核心資料 |
| 遊戲廠商 | `/providers/` | 只記得廠商時開始找遊戲 |
| 教學 | `/guide/` | 依問題閱讀 Guide |

Search 與 Compare 是持續可達的操作，不與四個內容目的地混成同一層。`/tools/` 保留，但只由次級入口或 Footer 承接，不列為一級主導覽。

### 2.2 手機 Header

320px 起必須同時保留：

- 可辨識且不換行的 Slot Hub 品牌。
- Search 入口。
- Compare 入口與目前數量。
- 可鍵盤操作、可關閉的選單。

選單展開後提供找遊戲、玩法與資料、遊戲廠商、教學與工具。所有主要互動的觸控高度以 44px 為最低基準；不得為容納導覽隱藏品牌名稱或比較功能。

### 2.3 Footer

Footer 承接：

- 第一次使用／新手 Guide。
- 遊戲資料庫、玩法與資料、Provider、Guide。
- Tools 次級入口。
- 資料方法與可信度入口。

Footer 不承擔另一套主要導覽邏輯。

## 3. 首頁：四種找遊戲意圖的選路入口

### 3.1 唯一責任

首頁回答兩件事：

1. Slot Hub 可以幫我做什麼？
2. 我現在應該從哪一條路開始？

首頁不是 Search、Explorer、Provider、Guide 的縮小完整版，也不堆疊完整遊戲列表、完整 Provider 名單或五段 Guide 課程。

### 3.2 頁面順序

1. 精簡產品標題與一句定位。
2. 常駐的名稱搜尋框。
3. 首屏早段完整顯示四種找法。
4. 動態資料規模與資料邊界。
5. 第一次使用入口，連到 `/guide/slot-beginners-guide/`。
6. 簡短可信度說明與 Footer。

### 3.3 四條路

| 使用者意圖 | 首頁入口 | 正式承接頁 |
| --- | --- | --- |
| 知道遊戲名稱 | 直接搜尋名稱、別名或原文名 | `/search/?q=...` |
| 只記得遊戲廠商 | 查看遊戲廠商 | `/providers/` |
| 記得功能或玩法 | 先理解概念，或帶條件探索 | `/slots/`，再到 `/games/?...` |
| 想找類似玩法 | 先在遊戲庫選一款參考遊戲 | `/games/` → Game detail 的「玩法相近」 |

這四條路必須使用可讀文字與普通連結存在；JavaScript 可改善互動，但不能成為理解或抵達目的地的唯一條件。

## 4. `/games/`：完整 Explorer 唯一 owner

### 4.1 責任

`/games/` 是所有結構化條件、排序、結果、清除、重新整理與分享狀態的唯一 owner。首頁與 `/slots/` 只負責選路或提供精確條件入口，不建立平行 Explorer。

### 4.2 頁面順序

1. 遊戲資料庫定位與動態收錄數。
2. 兩種入口：從玩法開始／直接調整完整條件。
3. Guided Explorer：主要玩法＋可選單一功能。
4. 已套用條件、真實結果數與清除入口。
5. 完整 Explorer 條件。
6. 遊戲結果。
7. 0 結果解釋與可逆復原操作。

### 4.3 Guided Explorer 確認狀態

Guided Explorer 不建立第二份結果或狀態：

1. 使用者選擇主要玩法與可選單一功能。
2. 畫面先顯示所選條件、真實結果數與即將使用的 Explorer 條件。
3. 0 款時不提供假結果入口。
4. 確認後用既有 serializer 建立 canonical `/games/?...` 狀態。
5. 同頁直接把焦點與捲動落在結果摘要，保留已套用條件。
6. 完整篩選器仍可回到上方調整；不得要求重選相同條件，也不得在結果前再插入第二套篩選器。

未選功能時不輸出空的 `features=`。空條件使用 `/games/`，不製造只有空參數的不同網址。

### 4.4 結果與缺值

- Explorer 只使用既有結構化欄位。
- Feature 多選與不同 facet 仍維持既有 AND 規則。
- 啟用數值篩選時，缺值排除但不視為 0。
- 無效、重複或過時 query 依既有安全正規化降級。
- 結果數與卡片資料由 published Game projection 產生，不硬寫。

## 5. `/slots/`：玩法與資料 Hub

### 5.1 獨立責任

`/slots/` 是老虎機玩法與資料的可讀 Hub，不是第二份遊戲資料庫。P0 只維持一個內容完整的 Hub；暫不建立 Mechanism／Feature 子頁。

### 5.2 頁面順序

1. 說明玩法、Feature 與資料三者的差異。
2. 主要賠付機制：Paylines、Ways to Win、Megaways、Cluster Pays、Pay Anywhere。
3. 已有可靠 taxonomy 的 Feature 概念與精確 Explorer 入口。
4. RTP、波動度、最高倍數等資料主題與 Guide。
5. 一組從概念前往精確 Explorer 的實例。
6. 第一次使用與 Guide 閱讀入口。

### 5.3 連結原則

- Mechanism／Feature 有精確條件時，可同時提供「了解概念」與「探索遊戲」。
- Data Topic 沒有可靠 filter 時，只連到 Guide，不提供假 CTA。
- 所有 Guide、Game、Provider 與 Explorer 入口使用普通連結。
- 頁面顯示項目、結果數與可用 CTA 由既有 taxonomy、Guide owner 與 published Games 產生，不硬寫第二份 mapping。

## 6. Game detail：單款遊戲答案頁

### 6.1 共用閱讀順序

1. 身份。
2. 快速看懂。
3. 怎麼運作。
4. 完整資料與版本。
5. 接著探索。
6. 相關 Guide。
7. 來源與可信度。

Compare 動作保留在身份區。

### 6.2 身份

包含官方圖片、繁中名稱、原文名稱、Provider、已確認系列、最後核對日期與簡短事實摘要。Provider 與系列入口只能在關係存在時顯示。

### 6.3 快速看懂

只投影四個最先需要判讀的入口：主要玩法、主要 RTP、統一波動度與最高倍數。它不建立第二份 Game DNA mapping，也不重複完整來源或全部 variants。

### 6.4 怎麼運作

先解釋主要 Mechanism，再列出已確認的 Features。Cascading 等盤面流程不自動冒充第二個主要 Mechanism；未知 Feature 不補猜。

### 6.5 完整資料與版本

保存原廠值、Slot Hub 統一值、所有已收錄 RTP 版本、盤面、winCount、日期、Game ID 與其他既有欄位。正式標題使用「Slot Hub 已收錄的 RTP 版本」，避免暗示是市場上的全部版本。

- 快速看懂回答「先注意什麼」。
- 完整資料回答「原廠怎麼寫、有哪些版本、哪些仍未知」。
- 同一資料不在兩區重複大段說明。
- 缺值統一使用「尚未核實」；不在同一資料責任混用「尚未建立」。
- 手機長資料使用緊湊資料列或原生 `<details>`，不把每個缺值做成大型卡片。

### 6.6 接著探索

入口明確區分：

- 同系列。
- 玩法相近。
- 精確 Mechanism／Feature Explorer。
- 同 Provider。

玩法相近沿用既有 build-time 規則與可解釋共同點，不建立分數、排名或個人化推薦。

### 6.7 Guide 與來源

- 相關 Guide 只依既有 relationship resolver 顯示。
- 資料來源與圖片來源可分開列出。
- 來源名稱、版本與最後核對日期需可讀。
- 頁內錨點使用 `scroll-margin-top` 或等效方式，不被 sticky Header 遮住。

## 7. 其他永久頁與工具責任

| 頁面 | 責任 | v3 邊界 |
| --- | --- | --- |
| `/search/` | 文字線索 owner | 搜尋名稱、別名、Provider、Guide 與概念；query 頁維持 noindex |
| `/providers/` | Provider 起點 | 中性排序、收錄樣本限制、連到 Provider detail |
| `/providers/{slug}/` | 單一 Provider Hub | 身份、來源、收錄樣本與精確 Explorer URL；不對全產品線下結論 |
| `/guide/` | Guide 閱讀 Hub | 依第一次使用、核心數據、玩法、功能、資料限制組織 |
| `/guide/{slug}/` | 永久知識頁 | 承接單一內容責任與結構化 owner；Diagram 仍是可選模組 |
| `/compare/` | 最多三款資料判讀 | URL 優先、缺值不補猜、不同尺度不排名；query 頁不索引 |
| `/tools/` | 次級工具總覽 | 保留網址，不列一級導覽，不複製 Search／Explorer／Compare owner |
| `/fishing-games/` | 捕魚機既有 Hub | 保留現況；資料與 Explorer 擴建等待成熟資料 |

## 8. SEO 與使用者體驗共用架構

### 8.1 可索引永久頁

在正式索引另案核准後，可承擔獨立搜尋意圖的頁面包括：

- 首頁。
- `/games/` 遊戲資料庫入口。
- Game detail。
- `/slots/` 玩法與資料 Hub。
- Provider index／detail。
- Guide index／detail。
- 內容足夠的 Fishing Hub。

### 8.2 不大量索引

- `/search/?q=...`。
- `/games/?...` 任意篩選組合。
- `/compare/?games=...`。
- Guided Explorer 的暫存或確認狀態。

它們是可分享的工具狀態，不是自動生成的 SEO landing pages。不得為每個組合建立薄頁或 sitemap URL。

### 8.3 四種意圖的普通連結關係

- 名稱意圖：首頁／Search → Game detail。
- 廠商意圖：首頁／Provider index → Provider detail → Game detail／精確 Explorer。
- 功能或玩法意圖：首頁／Slots Hub／Guide → 精確 Explorer → Game detail。
- 類似玩法意圖：首頁／Games → 參考 Game detail → 玩法相近／Mechanism Explorer。

同一永久頁同時服務使用者與搜尋引擎；不另建只有關鍵字而沒有產品責任的頁面。

## 9. 視覺與互動語言

### 9.1 視覺方向

- 延續深藍、淺底、螢光綠識別。
- 以清楚的資料層級、線條、留白與內容密度建立可信感。
- 首頁是選路入口，不是大型廣告 Hero。
- 官方遊戲圖片負責辨識實際作品；圖解只在能幫助理解時使用。
- 不使用娛樂城 Banner、金色豪華、紅黑賭場、彩金或獲利暗示。

### 9.2 響應式與可及性

- 以 1440、390、320 viewport 驗證。
- 互動觸控高度至少 44px。
- 不使用 `word-break: break-all`；保護重要繁中語意片段。
- 表格只在自己的容器內水平捲動，不能推寬整頁。
- 核心內容、普通入口、表格與 `<details>` 在無 JavaScript 時仍可閱讀與抵達；這不表示完整互動式 Explorer 必須在無 JavaScript 下運作。
- 鍵盤順序、focus-visible、螢幕閱讀器語意、forced colors 與 200% reflow 不退化。
- sticky Header 下的錨點標題不得被遮住。

### 9.3 前台語言

使用一般讀者能理解的「找遊戲、玩法與資料、已套用條件、前往遊戲資料庫、尚未核實」。正式前台不顯示 owner、handoff、URL 契約、普通連結、taxonomy、projection 或版型施工說明。

## 10. 現有模組處置

### 10.1 保留

- SearchHub 的 URL、Reload、Back／Forward 與 IME 安全契約。
- GameExplorer 的正式篩選、排序、缺值與 canonical query。
- Compare v2 的三款上限、URL／localStorage 同步、語意表格與判讀警告。
- Provider Hub v2 的樣本限制與 coverage。
- Game detail 的 Guide relationship、玩法相近、系列／Provider、來源與 Compare。
- Guide Reading Path、Guide Typography 與三個已核准 Diagram。
- 資料方法 Guide、資料審計與 Preview safeguards。

### 10.2 合併或移動

- `/tools/` 的 Guided Explorer 移入 `/games/` 找遊戲流程；Tools 保留簡短入口。
- Mahjong Ways DNA Pilot 的結構吸收到共用 Game detail，不保留單款特例。
- 首頁五段 Guide 路線縮成真正的新手 Guide 入口；完整閱讀路線留在 Guide Hub／Slots。
- 首頁嵌入式完整 Explorer 移至 `/games/`。
- 首頁完整 Provider 名單移至 `/providers/`。

### 10.3 替換或移除

- 以四種找遊戲路線替換首頁多個同等重量的大型功能區。
- 以 `/slots/` 的玩法、Feature、資料 Hub 替換完整遊戲列表與重複 Explorer。
- 移除假 CTA、無目的地控制、硬寫結果數與前台工程語言。
- 移除 Game detail 快速摘要和完整資料間沒有新增判讀價值的重複內容。

## 11. 功能優先級

### 11.1 P0：v3 正式介面必須完成

1. 共用 Header 與手機導覽。
2. 首頁四路入口與常駐名稱搜尋。
3. `/games/` Guided Explorer 交接、條件摘要、結果落點與 0 結果復原。
4. `/slots/` 單一玩法與資料 Hub。
5. Game detail 共用資訊層級，含完整與重要缺值案例。
6. Search 結果的身份／概念可讀分組與一致入口。
7. Tools 去重與次級化。
8. 全站普通連結、無 JavaScript、手機與 Preview 回歸。

### 11.2 P1：P0 穩定後逐項核准

- 少量內容足夠、意圖清楚的 Mechanism 深入頁。
- Paytable、Bonus Buy 成本與投注風險教育內容。
- 最近核對與資料新鮮度入口。
- 更完整的 0 結果解釋與可逆條件建議。
- 依實際使用證據調整 Search 結果分組。
- 有具名規則需要時，於文章中段選擇性使用 Game Context 圖片模組。

### 11.3 P2：需要更多資料或需求證據

- Series／Franchise Hub。
- 發行時間軸與新作入口。
- 圖像、角色或顏色找遊戲。
- 資料錯誤回報流程。
- 站內熱門、全市場觀察或可驗證的供應映射。
- R2／媒體儲存接口。

### 11.4 現在不要做

- D1、CMS、自建後台。
- 會員、登入、收藏、付費、閱讀進度。
- 黑盒 AI 推薦、AI 語意搜尋與個人化下注建議。
- 薄 Mechanism／Feature／Series 頁與所有篩選組合的 SEO 頁。
- 總分、勝率排行、Hot／Cold、下一次結果預測。
- 未成熟的 Fishing 專屬 Schema／Explorer 與 Crash／Aviator 擴張。
- Wix、migration、301、410、GSC、DNS、舊內容搬移與正式網域切換。

### 11.5 可並行的內容工作軌

Game／Provider 持續擴充是獨立且可與介面批次並行的內容工作軌。它沿用既有來源、圖片、缺值、多版本與人工審核規則，不因 v3 介面施工完成而停止，也不因列入並行工作軌而自動取得 Schema、taxonomy、永久 URL、Push 或部署權限。

## 12. 正式網站本機施工批次

### 批次 1：Header 與首頁選路

狀態：`CLOSED`

預計範圍：共用 Header、首頁、Guide 首頁摘要的既有測試預期與必要的 scoped CSS。

驗收：

- 四個主要內容入口、Search、Compare 與手機選單一致。
- Tools 不在一級桌機導覽，但手機次級選單與 Footer 可達。
- 首頁搜尋使用正式 Search URL。
- 四種找法在手機首屏早段出現。
- 新手入口連到既有 Beginners Guide。
- 首頁不再渲染完整 Explorer、完整 Provider 名單或五段 Guide 課程。
- 1440、390、320 無水平溢位；Enter、IME、鍵盤與無 JavaScript 基本入口正常。

### 批次 2：Games 找遊戲流程

狀態：`CLOSED`

整合 Guided Explorer、完整條件、結果摘要、結果落點與 0 結果復原；不修改 Explorer URL schema 或 filter 邏輯。

### 批次 3：Slots Hub

狀態：`CLOSED`

把 `/slots/` 重排為 Mechanism、Feature、Data Topic 與精確 Explorer／Guide 入口；移除重複完整 Explorer。

### 批次 4：Game detail 共用骨架

建立共用 presentation projection，依核准順序重排；以 Mahjong Ways 與 Big Bass Bonanza 驗證完整與缺值，之後全量回讀 58 款。

### 批次 5：Search、Tools 與跨頁清理

改善 Search 結果責任、簡化 Tools，統一前台詞彙、錨點與普通連結，不改核心搜尋排名。

### 批次 6：整站回歸與 Preview 審查

全量驗證 Search、Explorer、Compare、Provider、Guide、Game detail、來源、SEO safeguards、1440／390／320 與無 JavaScript。

## 13. 每批共同驗收

- `ASTRO_TELEMETRY_DISABLED=1`、`PUBLIC_SITE_ENV=preview`、`npm run verify` 完整通過。
- `git diff --check` 通過。
- 58／58 Game 與 14／14 Provider 資料審計不退化。
- Search、Explorer、Compare 的既有 URL／history／localStorage 契約不變。
- relationship、Guide owner、similar play 與 Provider 結果不變，除非該批明確核准。
- Desktop 1440×900、mobile 390×844 與 320×844 無頁面級水平溢位。
- Browser console、hydration、runtime errors 為 0。
- 無 JavaScript 時永久頁內容與普通連結仍可讀。
- Preview 維持 HTML `noindex,nofollow`、HTTP `X-Robots-Tag`、空 sitemap 與無 canonical。
- 原型、截圖、人工審查與 audit 目錄不納入 Commit。
- Push 與部署仍需使用者另行明確核准。

## 14. Decision Log

### 2026-09-06：v3 產品方向

- 核准保留資料底座並重做產品介面。
- 核准 `/games/` 維持完整 Explorer 唯一 owner。
- 核准 `/slots/` 維持獨立玩法與資料 Hub，P0 不建立子頁。
- 核准首頁常駐 Search 並完整顯示四種找遊戲路線。
- 核准 Tools 次級化，`/tools/` 網址保留。
- 核准 Game detail 共用閱讀順序與 Compare 身份區位置。
- 核准 Mahjong Ways DNA Pilot 吸收進共用資訊層。

### 2026-09-06：原型驗收

- 第 3 階段低保真原型通過，證明同一 Game detail 骨架可承接完整與重要缺值案例。
- 第 4 階段高保真方向通過；最小收尾完成主圖路徑、44px 觸控基準、320px Slots 標題、表單邊界、前台詞彙、缺值與 Guided Explorer 結果落點。
- Editorial／data-led 視覺方向正式採用，不建立另一輪大型原型。

### 2026-09-06：施工邊界與第一批結案

- 施工檔案以批次責任為邊界，由執行者依現況判斷並回報實際清單，不以事前列名作為唯一授權判準。
- 無 JavaScript 基線限定於核心內容與普通入口可讀；完整互動式 Explorer 仍可合理依賴 JavaScript。
- Game／Provider 擴充保留為可並行內容工作軌，繼續沿用既有來源、缺值與審核規則。
- Header 與首頁選路批次完成 1425px 中文語意片段修正與回歸驗證，狀態更新為 `CLOSED`；Games 找遊戲流程進入本機施工。

### 2026-09-06：Games 找遊戲流程結案

- Guided 與完整條件共用 `/games/` 的同一個 Explorer owner；精確 URL、結果摘要、結果落點、Reload 與 Back／Forward 均能恢復一致狀態。
- 0 結果不建立假入口，並保留重新選擇與清除條件的可逆操作；`#game-results` 維持可辨識且不被 sticky Header 遮住的品牌色焦點。
- `/tools/` 不再包含第二份 Guided form；Games 找遊戲流程狀態更新為 `CLOSED`，Slots Hub 進入本機施工。

### 2026-09-06：Slots 玩法與資料 Hub 本機完成

- `/slots/` 改以主要賠付方式、Feature、Data Topic 與 Guide 閱讀路線分工，不再重複完整 Explorer、遊戲精選或 Provider 清單。
- Mechanism 與 Feature 的遊戲入口皆沿用既有精確 `/games/?...` URL；Data Topic 只保留已有正式 owner 的 Guide 普通連結，不建立虛假篩選入口。
- 所有數量由 58 款 published Game 與既有 relationship index 建置時計算；本批尚未 Push 或部署。
- 主入口按鈕的白字／品牌橘對比為 2.82:1，低於一般文字基準；局部改用既有深藍文字後為 6.26:1。第三批經人工方向核准與此最小收尾後狀態更新為 `CLOSED`。

## 15. 固定出口

STAGE_RESULT: PASS_TO_NEXT_STAGE

CURRENT_ITEM: Slot Hub Master Blueprint v3

CURRENT_STEP: 第 5 階段 正式藍圖整合與施工批次定義

CURRENT_STATE: APPROVED_V3

PHASE_4_STATE: CLOSED

V3_IS_CURRENT_PRODUCT_AUTHORITY: YES

PRODUCT_DIRECTION: 保留資料底座並重做產品介面

PERMANENT_URL_CHANGED: NO

DATA_STRUCTURE_CHANGED: NO

SEO_INDEX_POLICY_CHANGED: NO

NEXT_ALLOWED_ACTION: 依第 12 章開始第一批正式網站本機施工

PUSH_ALLOWED: NO

DEPLOY_ALLOWED: NO

HUMAN_APPROVAL_REQUIRED: YES；Push、部署及任何重大產品邊界仍須另行核准
