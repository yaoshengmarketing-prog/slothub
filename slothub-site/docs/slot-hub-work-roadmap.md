# Slot Hub 工作路線表

文件狀態：`APPROVED`

最近更新：2026-09-01

目前依據：`docs/slot-hub-master-blueprint-v2.md` 是目前最高產品與施工順序依據；`docs/slot-hub-master-blueprint-v1.md` 保留為歷史決策文件。

> 這份表用白話記錄 Slot Hub 先做什麼、做到哪裡、下一步可以做什麼。
>
> 它不是工程規格，也不會自動授權修改網站、Commit、Push 或部署。
>
> 任何時候只允許一個主要項目處於進行狀態。

## 1. 產品目標

Slot Hub 要成為一個以可追溯資料為基礎，協助中文使用者：

- 找到老虎機遊戲。
- 看懂 RTP、波動度、最高倍數、玩法與功能。
- 比較現有資料，不補猜缺值。
- 從單款遊戲探索相同玩法、同系列或同 Provider。
- 查看來源、版本與最後核對日期。

Slot Hub 不以預測輸贏、保證獲利或不透明推薦為核心。

## 2. 固定狀態

工作表只使用以下狀態：

- `尚未開始`
- `設計討論`
- `只讀檢查`
- `本機製作`
- `等待人工審查`
- `已完成`
- `暫停／封存`

## 3. 已完成的大階段

| 大階段 | 已完成內容 | 狀態 |
| --- | --- | --- |
| 產品底座 v1 | 主藍圖 v1、核心頁型、資料來源與缺值原則 | `已完成` |
| Game／Provider 內容底座 | 30 款 published Game、11 家 published Provider、官方圖片與來源 | `已完成` |
| Explorer／Search／Compare 基礎 | Explorer v2、概念搜尋、最多三款比較、分享 URL 基礎 | `已完成` |
| Guide relationship | 11 篇 published Guide、166 筆 Game → Guide 關聯、正反向入口 | `已完成` |
| Game detail knowledge v2 | 欄位情境入口、Feature direct／overflow、0 遺失與全頁去重 | `已完成` |
| Guide 閱讀與核心內容 | Guide typography、三個 Knowledge Diagram、RTP／Volatility／Beginners 補強 | `已完成` |
| Preview 保護 | noindex、X-Robots-Tag、空 sitemap、無 production canonical | `已完成` |

## 4. 第 1～8 項完成與第 9 項本機製作

### 第 1 項：第二輪產品設計

**白話目的：** 把已核准的第二版方向整理成一份新藍圖與一張可追蹤的施工表，讓後續不再靠零散訊息決定順序。

**目前進度：**

- 競品研究完成。
- 第二版產品核心完成。
- 功能地圖完成。
- 人工核准完成。
- `slot-hub-master-blueprint-v2.md` 與本工作路線表已正式定稿並保存。

**狀態：** `已完成`

### 第 2 項：核心動線一致性

**目前進度：**

- 第 2-1 步「只讀盤點核心動線與建立產品互動規格」已完成。
- 規格文件：`docs/slot-hub-core-flow-consistency-v1-readonly-spec.md`。
- 第 2-2 步已依核准規格完成本機施工與驗證。
- 第 2-3 步 Push、Cloudflare Preview 部署與線上回讀已完成。
- 最終 deployed Commit：`e7a30fd85e726edab0680136ade0d80014ace8d0`。

**狀態：** `已完成`

### 第 3 項：Game detail 相同玩法探索

**目前進度：**

- 第 3-1 步「只讀盤點 Game detail 相同玩法探索」已完成。
- 只讀規格：`docs/slot-hub-game-detail-similar-play-v1-readonly-spec.md`。
- 第 3-1 步九項產品決定與排序修正已人工核准。
- 第 3-2 步「Game detail 玩法相近本機施工」已完成本機實作、完整驗證與獨立 Commit。
- 第 3-3 步 Push、Cloudflare Preview 部署與線上回讀已完成。
- 最終 deployed Commit：`87966e63048bab13ddbce6a632e437782d942607`。

**狀態：** `已完成`

### 第 4 項：Compare 資料判讀 v2

**目前進度：**

- 第 4-1 步「只讀產品與資料盤點」已完成。
- 只讀規格：`docs/slot-hub-compare-data-interpretation-v2-readonly-spec.md`。
- 第 4-1 步七項產品決定與三項施工小邊界已人工核准。
- 第 4-2 步「Compare 資料判讀 v2 本機施工」已完成本機實作與人工審查。
- 第 4-3 步 Push、Cloudflare Preview 部署與線上回讀已完成。
- 最終 deployed Commit：`1259ce406eb5e8a4b73b02cfa26ef03964eb60cc`。

**狀態：** `已完成`

### 第 5 項：Provider Hub v2

**目前進度：**

- 第 5-1 步「只讀產品、資料與使用者動線盤點」已完成。
- 只讀規格：`docs/slot-hub-provider-hub-v2-readonly-spec.md`。
- 第 5-1 步規格、方案 B、十五項決定與八項邊界修正已人工核准。
- 第 5-2 步「同步核准規格並進行本機施工」已完成本機實作與人工審查。
- 第 5-3 步 Push、Cloudflare Preview 部署與線上回讀已完成。
- 最終 deployed Commit：`e02d3692f9c4e4356a96306c85c164922bfafac3`。

**狀態：** `已完成`

### 第 6 項：資料方法與可信度入口

**目前進度：**

- 第 6-1 步「只讀盤點資料方法與可信度入口」已完成。
- 核准規格：`docs/slot-hub-data-methodology-trust-entry-v1-readonly-spec.md`。
- 一般 Guide 頁型、slug `slot-hub-data-methodology`、category `data`、無 relationship owner，以及 Footer／Game detail／Compare 三個最小入口已人工核准。
- 第 6-2 步「同步核准規格並進行本機施工」已完成。
- 第 6-3 步 Push、Cloudflare Preview 部署與線上回讀已完成。
- 最終 deployed Commit：`1ee124a3dcdd37c67b0054de3bc640f2efbdcff9`。

**狀態：** `已完成`

### 第 7 項：Guide 閱讀路線 v1

**目前進度：**

- 第 7-1 步依 V2 藍圖完成內容排序與入口規格。
- 核准規格：`docs/slot-hub-guide-reading-path-v1-readonly-spec.md`。
- 閱讀路線固定為「第一次使用、核心數據、玩法機制、遊戲功能、資料限制」。
- 第一版只調整首頁、Guide index 與 `/slots/` 的內容組織；不新增學習帳號、閱讀進度、永久路線頁或 relationship。
- 第 7-2 步本機施工、完整驗證、Push、Cloudflare Preview 部署與線上回讀已完成。
- 最終 deployed Commit：`a205733737a950c3e1ef65ac41a5e34fc4626a28`。

**狀態：** `已完成`

### 第 8 項：引導式遊戲探索 Pilot

**目前進度：**

- 已核准在 `/tools/` 使用「主要玩法＋可選單一功能」的單一 Pilot。
- 核准規格：`docs/slot-hub-guided-game-exploration-pilot-v1-readonly-spec.md`。
- Pilot 先顯示條件、真實結果數與精確 Explorer URL，再由使用者確認進入遊戲庫。
- 0 款不提供結果 CTA；不建立推薦引擎、AI 推薦或投注建議。
- 第 8 項本機施工、完整驗證、Push、Cloudflare Preview 部署與線上回讀已完成。
- 最終 deployed Commit：`3d035e531019f073ed96c3b2119f4edb844f3b25`。

**狀態：** `已完成`

### 目前項目：第 9 項 遊戲 DNA 單款 Pilot

**目前進度：**

- 人工選定 `mahjong-ways` 作為唯一 Pilot。
- 核准規格：`docs/slot-hub-game-dna-mahjong-ways-pilot-v1-readonly-spec.md`。
- DNA 由現有 Game record build-time 產生，只整理玩法、版本、原廠／統一值、來源與下一步入口。
- 不新增 Game 欄位、第二份資料 mapping、分數、排名或推薦。
- 第 9 項進入本機施工、完整驗證、Commit、Push、Preview 部署與線上回讀。

**狀態：** `本機製作`

**下一個允許動作：** 完成 Mahjong Ways 單款 Pilot 並線上回讀；不得開始第 10 項。

## 5. 第 2～10 項施工順序

| 順序 | 項目 | 白話目的 | 狀態 | 下一個允許動作 |
| ---: | --- | --- | --- | --- |
| 2 | 核心動線一致性 | 讓首頁搜尋、完整搜尋、Explorer 與 Compare 的網址、重新整理及上一頁／下一頁行為一致；修正假 CTA 與過時文案。 | `已完成` | 已結案。 |
| 3 | Game detail 相同玩法探索 | 讓使用者從單款遊戲直接探索相同 Mechanism 或 Feature，並清楚區分系列、Provider 與玩法條件。 | `已完成` | 已結案。 |
| 4 | Compare 資料判讀 v2 | 不只並排數字，也說明哪些能比較、哪些要保留警告、哪些不能統一。 | `已完成` | 已結案。 |
| 5 | Provider Hub v2 | 把 Provider 頁從基本名單提升成有來源、有限定母體的資料入口，並連到 filtered Explorer。 | `已完成` | 已結案。 |
| 6 | 資料方法與可信度入口 | 用一般使用者看得懂的方式說明原廠值、統一值、缺值、版本、來源與可比較限制。 | `已完成` | 已結案。 |
| 7 | Guide 閱讀路線 v1 | 讓首頁、Guide index、Slots 依「第一次使用、核心數據、玩法、功能、限制」組織內容。 | `已完成` | 已結案。 |
| 8 | 引導式遊戲探索 Pilot | 用幾個容易理解的選擇，轉成看得見、可修改、可分享的 Explorer 條件。 | `已完成` | 已結案。 |
| 9 | 遊戲 DNA 單款 Pilot | 用一個精簡區塊整理單款遊戲的數據狀態、玩法、版本與可信度，不建立分數。 | `本機製作` | 完成 Mahjong Ways 單款 Pilot、完整驗證、Preview 部署及線上回讀。 |
| 10 | Game／Provider 擴充 | 持續增加可靠、可搜尋的 Game 與 Provider，不以數量取代來源品質。 | `尚未開始` | 依每次獨立人工核准啟動批次；第四批名單與數量尚未核准。 |

第 10 項是長期持續工作，可在一個主要產品項目完成後，以獨立核准範圍交錯進行；不得在其他主要項目施工中自行插隊。

## 6. 每項目前不包含的內容

| 項目 | 本階段明確不包含 |
| --- | --- |
| 第 2 項 | 全面重做首頁、新搜尋演算法、新 Schema、CPA |
| 第 3 項 | 黑盒相似度、「猜你喜歡」、推薦或虛構系列 |
| 第 4 項 | 總分、加權排名、「比較容易贏」或補猜缺值 |
| 第 5 項 | 對 Provider 全產品線下結論、無來源公司／市場資料 |
| 第 6 項 | 工程規格書、重寫全部 RTP／Volatility／Max Win Guide |
| 第 7 項 | 會員、學習帳號、閱讀進度、大量路線薄頁 |
| 第 8 項 | AI 推薦、個人下注建議、「適合你玩」 |
| 第 9 項 | 分數、排名、一次套用全部 Game detail |
| 第 10 項 | 未核准第四批、未驗證來源、未追溯圖片 |

## 7. 保留能力與研究方向

### CPA／合作平台

- **定位：** 保留能力。
- **狀態：** `尚未開始`。
- **目前不排入第 2～10 項順序。**
- 未來只有在單款 Game 與平台供應關係可驗證、CTA 目的地一致、合作揭露清楚且失效檢查獲核准後才可啟用。
- Slot Hub 不直接啟動遊戲，也不保證免費 Demo；不得把 Provider 合作推定為全部遊戲都可取得。

### 高資料門檻功能

- **定位：** Research Directions／條件成熟區。
- **狀態：** `尚未開始`。
- 可先研究 Slot Hub 站內熱門、可見條件式探索、內容夠厚的 Feature 頁與 Slot Hub 收錄樣本的 Provider 統計。
- 全市場熱門、Hit Frequency、Hot／Cold、實際 Spins／Bets／Wins、娛樂城單款供應映射，需要新資料源。
- 「勝率最高」「最容易贏」「保證獲利」「下一次結果預測」不得以目前名稱直接實作。

### 投注資料與風險教育

- **定位：** Research Directions；資料理解與風險教育，不是投注策略或獲利建議。
- **狀態：** `尚未開始`。
- **目前不排入第 2～10 項順序。**
- 可研究如何閱讀 Paytable、Bonus Buy 成本及投注基準換算、固定預算與 Spin 次數的純數學換算、追損與 RNG 機率、投注額與 RTP 的關係，以及風險、機率與常見投注迷思。
- 每一項內容提案仍需人工核准；不得轉化為保證獲利、下一次結果預測、擊敗 RNG 的投注排列、個人化下注金額建議、追損或致勝公式。

## 8. 暫停／封存項目

| 項目 | 狀態 | 說明 |
| --- | --- | --- |
| Wix／migration／301／410／GSC／DNS／舊內容搬移 | `暫停／封存` | `OUT_OF_SCOPE FOR NEW-SITE ROADMAP`；不屬第 1～10 項施工順序，不在第 10 項完成後自動恢復，不得要求資料或自行盤點、施工；只有使用者明確開啟新的獨立範圍時才可重新討論。 |
| D1／CMS／自建後台 | `暫停／封存` | 維持 `DO_NOT_BUILD_YET`，近期維持靜態內容與既有驗證流程。 |
| R2／媒體儲存 | `暫停／封存` | 目前不導入，現有圖片及媒體沿用已核准方式；保留未來接口可能性，只有資料量、圖片管理、授權或媒體需求成熟後才能另案評估，預留接口不代表施工授權。 |
| 會員／登入／收藏／付費 | `暫停／封存` | 目前沒有必要的使用者價值與資料需求。 |
| Series／Franchise 永久頁 | `暫停／封存` | 等待數量、搜尋需求及內容厚度成熟。 |
| Fishing 專屬模型與 Explorer | `暫停／封存` | 等待成熟 published fishing data。 |
| 大量薄 Feature／taxonomy 頁 | `暫停／封存` | 不因標籤存在自動建頁。 |
| 排行、預測、無資料推薦 | `暫停／封存` | 只能依 v2 Research Directions 重新定義並取得人工核准。 |

## 9. 簡短協作規則

1. 每次工程回報先提供白話進度，再提供技術結果。
2. 明確指出是否修改網站。
3. 明確指出是否 Commit、Push、部署。
4. 發現旁支問題時先記錄，不得自行插隊。
5. 必須插入阻擋修正時，以原項目的子編號處理；完成後回到原項目。
6. 任何時候只有一個主要項目可處於 `設計討論`、`只讀檢查`、`本機製作` 或 `等待人工審查`。
7. 遠端新 Commit、非預期檔案、Schema／taxonomy 決策、重大來源衝突或範圍擴張必須停止。

## 10. 目前出口

`STAGE_RESULT: PASS_TO_NEXT_STAGE`

`CURRENT_STATE: LOCAL_IMPLEMENTATION_IN_PROGRESS`

`CURRENT_ITEM: 第8項 引導式遊戲探索 Pilot`

`CURRENT_STATUS: 本機製作`

`CURRENT_STEP: 第8-2步 同步核准規格並進行本機施工`

`ROADMAP_STATUS: APPROVED`

`NEXT_ITEM: 第8項 引導式遊戲探索 Pilot`

`NEXT_ITEM_STATUS: 第8-2步本機製作`

`WEBSITE_CHANGED: YES；僅本機`

`COMMIT_ALLOWED: YES；僅核准規格、實作與發布 Commit`

`PUSH_ALLOWED: YES；完整本機驗證通過後`

`DEPLOY_ALLOWED: YES；僅 Cloudflare Pages Preview`

`HUMAN_APPROVAL_REQUIRED: NO；本輪已核准自動續行至線上回讀，遇到新產品決策或重大風險時停止`

`NEXT_ALLOWED_ACTION: 完成單一 Pilot、Commit、Push、CI、Preview 部署與線上回讀；不得開始第9項`
