# Slot Hub Game detail 知識關聯呈現 v2 只讀規格

> **READ-ONLY SPECIFICATION — DRAFT FOR REVIEW**
>
> 本文件只盤點現行產品與介面，並提出可供人工選擇的 v2 呈現規格。本輪沒有修改 Game、Guide、Schema、taxonomy、relationship owner、resolver、Search、Explorer、Knowledge Map、比較表或任何網站頁面。
>
> 盤點基準：30 款 `published` Game、10 篇 `published` Guide，以及目前 `gameToGuides` 的完整排序結果。
>
> 盤點日期：2026-08-29

## 1. 問題與目標

現行 Game detail 直接取得 `relationshipIndex.gameToGuides[slug]`，再以 `.slice(0, 3)` 顯示「看懂這些資料」。完整關聯排序為：

1. Mechanism
2. Data Topic
3. Feature

這個順序能穩定保留賠付機制與核心數據，但當一款遊戲同時具有 RTP、波動度、最高倍數及多個 Feature 時，Feature Guide 幾乎都被前三篇上限截掉。問題不是關聯資料缺失，而是同一個頁尾區塊同時承擔「解釋欄位」及「解釋功能」兩種不同情境。

v2 的核心目標是：

- 保留三篇上限所提供的節制，不把全部 Guide 平鋪成長清單。
- 讓 RTP、波動度、最高倍數與賠付機制在使用者看到數值時就能找到解釋。
- 讓 Feature Guide 不再因 Mechanism／Data Topic 固定優先而大量消失。
- 不改變任何關聯事實、所有權、taxonomy 或 Explorer URL。
- 同一篇 Guide 在同一遊戲頁只出現一次。
- 缺值及合法但沒有 Guide 的概念繼續保持無 CTA。

## 2. 現行實作事實

### 2.1 資料流

```text
published Guide frontmatter
        +
published Game projection
        ↓
buildGuideRelationshipIndex()
        ↓
gameToGuides[gameSlug]：完整、有序、已去重的關聯
        ↓
Game detail：slice(0, 3)
        ↓
單一頁尾「看懂這些資料」區塊
```

- Resolver 已保存每個 match 的 `reasons`，包含關聯類型與 taxonomy／Data Topic 值。
- 同一 Guide 命中多個原因時，現行 index 已以 Guide slug 去重並合併 reasons。
- `dataTopicsForGame()` 只在資料存在時建立 Data Topic：
  - 有主要 RTP 才有 `rtp`。
  - 有 `rtpVariants` 才有 `rtp-variants`。
  - 有原廠或統一波動度才有 `volatility`。
  - 有 `maxWinMultiplier` 才有 `max-win`。
- Game detail 現在沒有將完整 match 依頁面欄位或關聯類型分區。
- 現行 CSS 已有響應式 `game-guide-rail`，但只支援單一清單，沒有展開狀態或頁面級去重投影。

### 2.2 Guide 簡稱

後續表格使用以下簡稱：

| 簡稱 | Guide |
| --- | --- |
| `PAYOUT` | `slot-payout-mechanisms-explained` |
| `RTP` | `rtp-explained` |
| `VOL` | `volatility-explained` |
| `MAX` | `slot-max-win-explained` |
| `MULTI` | `slot-multiplier-explained` |
| `CASCADE` | `slot-cascading-tumble-avalanche-explained` |
| `SYMBOLS` | `slot-symbols-and-features` |
| `BONUS` | `slot-terms-glossary`，目前只承接 `bonus-buy` |

## 3. 30 款遊戲逐筆盤點

「現行可見」是目前前三篇；「現行隱藏」是有效但被 `.slice(0, 3)` 截掉的 Guide。括號中的 `M`、`D`、`F` 分別代表 Mechanism、Data Topic、Feature。

| Game | 完整關聯數 | 現行可見前三篇 | 現行隱藏 |
| --- | ---: | --- | --- |
| Fortune Ox／十倍金牛 | 5 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `RTP(D)`、`MULTI(F)` |
| Wanted Dead or a Wild／亡命狂野 | 7 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `RTP(D)`、`MULTI(F)`、`BONUS(F)`、`SYMBOLS(F)` |
| Rich Wilde and the Book of Dead／死亡之書 | 5 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `RTP(D)`、`SYMBOLS(F)` |
| Fortune Tiger／虎虎生財 | 6 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `RTP(D)`、`MULTI(F)`、`SYMBOLS(F)` |
| Starburst／星爆 | 5 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `RTP(D)`、`SYMBOLS(F)` |
| Sweet Bonanza／甜入心扉 | 6 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `MULTI(F)`、`CASCADE(F)`、`SYMBOLS(F)` |
| Sweet Bonanza 1000／甜入心扉 1000 | 5 | `PAYOUT(M)`、`MAX(D)`、`MULTI(F)` | `CASCADE(F)`、`SYMBOLS(F)` |
| Mahjong Ways／麻將胡了 | 7 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `RTP(D)`、`MULTI(F)`、`CASCADE(F)`、`SYMBOLS(F)` |
| Mahjong Ways 2／麻將胡了2 | 7 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `RTP(D)`、`MULTI(F)`、`CASCADE(F)`、`SYMBOLS(F)` |
| Super Ace／超級王牌 | 5 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `MULTI(F)`、`SYMBOLS(F)` |
| Gates of Olympus／奧林匹斯之門 | 5 | `PAYOUT(M)`、`VOL(D)`、`MULTI(F)` | `CASCADE(F)`、`SYMBOLS(F)` |
| Gates of Olympus 1000／奧林匹斯之門 1000 | 6 | `PAYOUT(M)`、`MAX(D)`、`MULTI(F)` | `CASCADE(F)`、`BONUS(F)`、`SYMBOLS(F)` |
| Jump High／跳高高 | 3 | `PAYOUT(M)`、`MULTI(F)`、`SYMBOLS(F)` | 無 |
| Big Bass Bonanza／瘋狂大鱸魚 | 4 | `PAYOUT(M)`、`RTP(D)`、`MULTI(F)` | `SYMBOLS(F)` |
| Storm of Seth／戰神賽特 | 6 | `MAX(D)`、`VOL(D)`、`RTP(D)` | `MULTI(F)`、`BONUS(F)`、`SYMBOLS(F)` |
| Storm of Seth 2: Awakening／戰神賽特2－覺醒之力 | 7 | `MAX(D)`、`VOL(D)`、`RTP(D)` | `MULTI(F)`、`CASCADE(F)`、`BONUS(F)`、`SYMBOLS(F)` |
| Bonanza | 8 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `RTP(D)`、`MULTI(F)`、`CASCADE(F)`、`BONUS(F)`、`SYMBOLS(F)` |
| Cash Crew | 5 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `MULTI(F)`、`SYMBOLS(F)` |
| Chaos Crew | 7 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `RTP(D)`、`MULTI(F)`、`BONUS(F)`、`SYMBOLS(F)` |
| Fish Tales: Double Catch Max Scatter | 5 | `PAYOUT(M)`、`MAX(D)`、`MULTI(F)` | `BONUS(F)`、`SYMBOLS(F)` |
| Fortune Paw | 4 | `PAYOUT(M)`、`MAX(D)`、`MULTI(F)` | `SYMBOLS(F)` |
| Gonzo’s Quest | 6 | `PAYOUT(M)`、`MAX(D)`、`RTP(D)` | `MULTI(F)`、`CASCADE(F)`、`SYMBOLS(F)` |
| Greedy for Gold: Hold and Win | 4 | `PAYOUT(M)`、`MAX(D)`、`BONUS(F)` | `SYMBOLS(F)` |
| Hand of Anubis | 5 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `CASCADE(F)`、`SYMBOLS(F)` |
| Legacy of Dead | 2 | `PAYOUT(M)`、`SYMBOLS(F)` | 無 |
| Ragnarök Gold | 7 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `RTP(D)`、`MULTI(F)`、`BONUS(F)`、`SYMBOLS(F)` |
| Reactoonz | 4 | `PAYOUT(M)`、`MULTI(F)`、`CASCADE(F)` | `SYMBOLS(F)` |
| Shadow of Dominion | 6 | `MAX(D)`、`VOL(D)`、`RTP(D)` | `MULTI(F)`、`BONUS(F)`、`SYMBOLS(F)` |
| Sun Wu Kong | 8 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `RTP(D)`、`MULTI(F)`、`CASCADE(F)`、`BONUS(F)`、`SYMBOLS(F)` |
| Wildhalla | 7 | `PAYOUT(M)`、`MAX(D)`、`VOL(D)` | `RTP(D)`、`MULTI(F)`、`BONUS(F)`、`SYMBOLS(F)` |

### 3.1 整體可見性

| 指標 | 現況 |
| --- | ---: |
| 完整 Game → Guide 關聯 | 167 |
| 目前顯示 | 89（53.3%） |
| 因三篇上限被隱藏 | 78（46.7%） |
| 有隱藏關聯的遊戲 | 28/30 |
| 完全沒有被截斷的遊戲 | 2/30：Jump High、Legacy of Dead |
| 單款最高完整關聯數 | 8：Bonanza、Sun Wu Kong |
| 單款最多隱藏數 | 5：Bonanza、Sun Wu Kong |

### 3.2 隱藏關聯類型

以下以「被隱藏的唯一 Guide 關聯」計算，而不是把同一 Guide 的多個 reasons 重複計數。

| 類型 | 隱藏數 | 說明 |
| --- | ---: | --- |
| Mechanism | 0 | 有對應 Guide 的 27 款全部優先顯示；3 款 `other` 本來就沒有 Guide。 |
| Data Topic | 12 | 全部是 `RTP`；`MAX` 與 `VOL` 目前未被截斷。 |
| Feature | 66 | `SYMBOLS` 27、`MULTI` 17、`CASCADE` 11、`BONUS` 11。 |

現況不是 Feature 關聯不完整，而是型別優先順序加上單一全頁上限，使 Feature 幾乎固定排在 Data Topic 後面。

### 3.3 受影響最嚴重的遊戲

- 隱藏 5 篇：Bonanza、Sun Wu Kong。
- 隱藏 4 篇：Chaos Crew、Mahjong Ways、Mahjong Ways 2、Ragnarök Gold、Storm of Seth 2、Wanted Dead or a Wild、Wildhalla。
- 隱藏 3 篇：Fortune Tiger、Gates of Olympus 1000、Gonzo’s Quest、Shadow of Dominion、Storm of Seth、Sweet Bonanza。
- 其餘 13 款隱藏 1～2 篇；只有 Jump High 與 Legacy of Dead 沒有隱藏。

## 4. 呈現位置與去重原則

### 4.1 同一 Guide 可否同時適合欄位與頁尾

概念上可以。例如未來一篇 Guide 可能同時宣告 Data Topic 與 Feature；同一篇 Guide 也可能因 `rtp`、`rtp-variants` 兩個原因同時命中同一遊戲。但同一頁重複顯示不會增加資訊價值。

v2 應建立「頁面呈現投影」，而不是修改 resolver：

1. 先取得完整、已去重的 `gameToGuides`。
2. 每篇 Guide 選定一個呈現位置。
3. 同一 Guide 的所有 reasons 保留供標籤或可及名稱使用。
4. 一篇 Guide 在整頁只渲染一次。

若同一 Guide 橫跨多種類型，呈現位置仍沿用既有優先順序：Mechanism → Data Topic → Feature。這個順序只決定同一 Guide 放在哪裡，不再決定其他 Guide 是否永遠不可見。

### 4.2 缺值規則

- 沒有主要 RTP 且沒有 RTP variants：不顯示 RTP Guide。
- 只有 RTP variants：入口放在「所有 RTP 版本」旁，不製造不存在的主要 RTP 欄。
- 有主要 RTP：RTP 與 RTP variants 共用同一 Guide，只在主要 RTP 旁顯示一次；可及名稱可說明同時涵蓋多版本。
- 沒有原廠及統一波動度：不顯示波動度 Guide。
- 沒有 `maxWinMultiplier`：不顯示最高倍數 Guide；不能因 `bonusFeatures` 出現倍數文字而補連。
- `winMechanism: other` 且沒有精確 Guide owner：不顯示 Mechanism CTA。
- 沒有對應 Guide 的合法 Feature：保留 Feature 標籤，不顯示無連結的「了解」占位文字。
- Feature Guide 必須由 `relatedFeatures` 精確命中，不能冒充 Mechanism Guide。

## 5. 四種方案比較

| 方案 | 呈現方式 | 優點 | 主要問題 | 手機／無 JS |
| --- | --- | --- | --- | --- |
| A：前三篇＋查看更多 | 維持現有三篇，剩餘 78 筆放入展開區 | 修改最小；完整關聯皆可找到；不動欄位結構 | 初始仍只有 89/167；RTP 與 Feature 仍缺乏情境；使用者需先知道要展開 | 可用原生 `<details>`；但 28 款都出現「更多」，手機展開後可能很長 |
| B：依關聯類型分組 | 分成賠付方式、核心數據、遊戲功能，每組設定上限 | 資訊架構清楚；不會由 Mechanism 壓掉全部 Feature | 同一區可能同時顯示 3～8 篇；每組上限仍屬任意；與真正資料欄位有距離 | 手機會形成三段長清單；可不用 JS，但首屏高度增加 |
| C：全部採欄位旁情境入口 | RTP、波動度、最高倍數、Mechanism、Feature 標籤旁各自放 CTA | 使用者在疑問發生處得到答案；Data Topic 不再被排序截掉 | Feature 多時容易每個標籤塞連結；同一 `SYMBOLS` Guide 可能因 Wild、Scatter、Free Spins 重複；版面最容易碎裂 | 無 JS 可讀，但鍵盤焦點與手機觸控項目過多 |
| D：混合方案 | 核心欄位旁放精確入口；Feature 依「唯一 Guide」集中於原頁尾 rail，最多三篇直接顯示，其餘原生展開 | 同時解決情境與長清單；保留 Feature 區三篇節制；全頁去重；不需改關聯事實 | 需要一層共用 presentation helper 及較完整 fixtures；使用者需理解兩個入口區域 | 只有 4 款需要展開第 4 篇；原生 `<details>` 支援鍵盤及無 JS |

## 6. 推薦方案：D 混合方案

### 6.1 核心資料採欄位旁文字入口

在既有值附近使用低干擾文字連結，不使用只有問號或資訊圖示的 icon-only 控制：

- 賠付機制：`了解賠付方式 →`
- 主要 RTP／所有 RTP 版本：`了解 RTP →`
- 原廠／統一波動度：`了解波動度 →`
- 最高倍數：`了解最高倍數 →`

連結應符合：

- 可見文字直接表達目的，不依賴 hover tooltip。
- 可點擊區至少包含整段文字，而不是只有細小圖示。
- `aria-label` 可補入完整 Guide 標題及目前欄位，例如「了解本遊戲的主要 RTP：RTP 是什麼？如何正確閱讀」。
- 長標題不直接完整塞進數據格；顯示短動作文字，完整標題可放可及名稱。
- 欄位不存在時，欄位及入口一起省略。
- 同一 RTP Guide 同時命中 `rtp` 與 `rtp-variants` 時只顯示一次。

#### 重複資料欄位的唯一入口位置

頁首「核心數據」與下方「完整遊戲資料」可能重複呈現同一個資料概念。Guide CTA 的 canonical placement 必須由共用 presentation helper 一次決定，不得讓兩個渲染區各自判斷：

- 欄位已存在於頁首核心數據時，Guide CTA 優先放在該核心數據項目。
- 只有下方完整資料才出現的值，才在完整資料欄位旁放 CTA。
- `rtpVariants` 存在但主要 RTP 不存在時，RTP Guide 入口放在「所有 RTP 版本」欄位。
- 同時有主要 RTP 與 `rtpVariants` 時，只顯示一個 RTP Guide CTA，canonical placement 是頁首主要 RTP。
- 波動度或最高倍數同時出現在兩區時，同樣只保留頁首核心數據入口。
- presentation helper 必須輸出已決定的位置；Astro 模板不得在核心數據與完整資料兩邊各自重新推導。

如果實際 390×844 或 320px 版面顯示頁首核心數據無法安全容納 CTA，實作必須停止並回報，不得自行改成上下兩處都顯示。

### 6.2 Feature 不逐標籤塞 CTA

Feature 標籤保持目前純資料顯示。其下或現有 `game-guide-rail` 位置改為「看懂遊戲功能」：

- 以唯一 Guide 為單位，不以 Feature 標籤為單位。
- 每張 Guide 項目列出本遊戲實際命中的 Feature reasons，例如「Wild、Scatter、Free Spins」。reasons 只能使用 relationship resolver 已合併在 match 上的結果。
- 最多三篇 Feature Guide 不需展開即可看見。
- 第四篇以後的所有剩餘項目放入原生 `<details>`／`<summary>`；目前沒有遊戲超過四篇 Feature Guide，但程式不得依賴此資料現況。
- presentation helper 固定輸出前 3 篇 `direct` 與其餘全部 `overflow`，不得寫死單一第四篇。
- `<summary>` 動態顯示 `查看更多相關教學（N）`，其中 N 是完整 `overflow.length`。
- `overflow` 為 0 時不渲染 `<details>`。
- 未來新增 Guide 後，元件不需要修改拆分邏輯或上限程式。
- 不使用 React state，不將展開狀態寫入 URL，也不需要 localStorage。
- `<details>` 在無 JavaScript 時仍可展開，鍵盤可聚焦 `summary` 並以 Enter／Space 操作。
- 若沒有 Feature Guide，整個功能教學區隱藏；不顯示「目前沒有教學」。

Feature reasons 不得從 Guide 標題、Game 摘要、`bonusFeatures` 或另一份 Feature mapping 推測，也不得把 Guide frontmatter 中不屬於該遊戲的全部 taxonomy 顯示出來。

### 6.3 「最多三篇」的新角色

不再把三篇當成整個 Game detail 的全域關聯上限。它改為：

- **Feature 教學區的不需展開顯示上限**。
- 核心欄位入口不計入這三篇，因為它們附著於已存在的資料欄，而不是新增一個長清單。
- 全部關聯仍由 resolver 判定；v2 只決定呈現位置與是否需展開。

這不是直接取消上限，也不是平鋪全部 Guide；它把原本混合兩種用途的單一上限，改成與版面情境相符的控制。

### 6.4 無 Guide 時的處理

完全隱藏教學 CTA，不保留灰色文字、停用按鈕或「即將推出」。資料本身照常顯示，避免使用者把沒有連結的文字誤認為可操作項目。

## 7. 推薦方案的 30 款可見性改善

### 7.1 整體結果

推薦方案不改變 167 筆關聯，只改變呈現：

| 指標 | 現行 | 推薦方案 D |
| --- | ---: | ---: |
| 有效關聯總數 | 167 | 167 |
| 不需展開即可看見 | 89（53.3%） | 163（97.6%） |
| 可透過原生展開找到 | 0 | 4（2.4%） |
| 完全無入口的有效關聯 | 78 | 0 |
| 有有效關聯被完全截掉的遊戲 | 28/30 | 0/30 |
| 所有關聯都不需展開的遊戲 | 2/30 | 26/30 |
| 需要展開一篇的遊戲 | 0 | 4/30 |

163 筆不需展開的組成：

- 89 筆核心欄位關聯：Mechanism 27、RTP 17、波動度 20、最高倍數 25。
- 74 筆 Feature Guide 關聯：每款最多三篇直接顯示。
- 其餘 4 筆都是第四篇 Feature Guide，分別出現在 Bonanza、Gates of Olympus 1000、Storm of Seth 2、Sun Wu Kong 的展開區。

### 7.2 各 Guide 的改善

| Guide | 完整關聯 | 現行可見 | 推薦方案不需展開 | 推薦方案可展開 |
| --- | ---: | ---: | ---: | ---: |
| `PAYOUT` | 27 | 27 | 27 | 0 |
| `RTP` | 17 | 5 | 17 | 0 |
| `VOL` | 20 | 20 | 20 | 0 |
| `MAX` | 25 | 25 | 25 | 0 |
| `MULTI` | 25 | 8 | 25 | 0 |
| `CASCADE` | 12 | 1 | 12 | 0 |
| `BONUS` | 12 | 1 | 12 | 0 |
| `SYMBOLS` | 29 | 2 | 25 | 4 |

### 7.3 代表案例前後差異

#### Mahjong Ways

- 現行：顯示 `PAYOUT`、`MAX`、`VOL`；隱藏 `RTP`、`MULTI`、`CASCADE`、`SYMBOLS`。
- v2：賠付機制、RTP、波動度、最高倍數各在對應欄位顯示；功能區直接顯示 `MULTI`、`CASCADE`、`SYMBOLS`。
- 結果：7/7 均不需展開，且不重複。

#### Reactoonz

- 現行：顯示 `PAYOUT`、`MULTI`、`CASCADE`；隱藏 `SYMBOLS`。
- v2：`PAYOUT` 放在 Cluster Pays 欄位；功能區顯示 `MULTI`、`CASCADE`、`SYMBOLS`。
- 結果：4/4 均不需展開。

#### Sweet Bonanza

- 現行：顯示 `PAYOUT`、`MAX`、`VOL`；隱藏 `MULTI`、`CASCADE`、`SYMBOLS`。
- v2：Pay Anywhere、最高倍數、波動度在欄位旁；功能區顯示三篇 Feature Guide。
- 結果：6/6 均不需展開。

#### Big Bass Bonanza

- 現行：顯示 `PAYOUT`、`RTP`、`MULTI`；隱藏 `SYMBOLS`。
- v2：賠付機制與 RTP 在欄位旁；功能區顯示 `MULTI`、`SYMBOLS`。
- 缺少波動度與 `maxWinMultiplier`，因此仍不顯示 `VOL` 或 `MAX` CTA。
- 結果：4/4 均不需展開，沒有用 Money Symbol 文字推測最高倍數關聯。

#### Super Ace

- 現行：顯示 `PAYOUT`、`MAX`、`VOL`；隱藏 `MULTI`、`SYMBOLS`。
- v2：Ways to Win、最高倍數、波動度在欄位旁；功能區顯示 `MULTI`、`SYMBOLS`。
- 沒有主要 RTP 或 RTP variants，因此不顯示 RTP CTA。
- 結果：5/5 均不需展開。

## 8. 需要與不需要改變的技術邊界

### 8.1 預計允許修改的最小檔案範圍

後續若人工核准實作，預計只需：

- `src/pages/games/[slug].astro`
  - 不再直接 `.slice(0, 3)`。
  - 將完整 match 交給共用呈現投影。
  - 在現有核心數據／完整資料欄位旁渲染精確文字入口。
  - 將原 `game-guide-rail` 收斂為去重後的 Feature Guide 區。
- `src/lib/guide-relationship-catalog.ts`
  - 新增純函式 presentation helper，將既有 match 分成欄位入口、Feature 直接顯示及 Feature 展開項目。
  - 不修改 `createGuideRelationshipIndex()`、owner 或 `conceptExplorerUrl()`。
- `src/styles/global.css`
  - 增加欄位旁文字入口、Feature Guide 區及原生 `<details>` 的桌機／手機樣式。
- `scripts/verify-guide-relationship-ui.mjs`
  - 驗證完整關聯不再被全域前三篇截掉、全頁去重、精確位置及四款展開案例。
- `scripts/verify-game-detail.mjs`
  - 增加有值／缺值欄位 CTA、長名稱及稀疏資料 fixtures。

若實作時發現無法在上述檔案內完成，應停止並回報，不得自行擴張到 resolver 或 Schema。

### 8.2 不得修改

- `src/lib/guide-relationships.mjs` 的關聯事實、owner、排序或去重規則。
- Guide Schema 與 Game Schema。
- Guide frontmatter、Guide 正文及發布狀態。
- Game、Provider 或 taxonomy 資料。
- Search、Explorer、Slots Knowledge Map、Guide detail、比較表。
- Explorer URL schema。
- robots、canonical、sitemap、正式網域、Wix、DNS 或 301。
- 新 SEO 頁、Mechanism／Feature 集合頁或大量索引頁。

## 9. 最小實作階段拆分

### 階段 1：純呈現投影與 fixtures

- 以現行 `gameToGuides` 完整 matches 為唯一輸入。
- 建立欄位位置、Feature 區、前三篇及展開清單的純函式。
- 驗證 30 款投影：167 筆關聯沒有遺失、每頁 Guide slug 唯一、缺值不建立入口。
- 不改畫面。

### 階段 2：Game detail 桌機介面

- 核心欄位加入低干擾文字入口。
- 原 rail 改為 Feature Guide 區。
- Feature 直接顯示最多三篇，第四篇使用原生 `<details>`。
- 保留現有資料、關聯遊戲與來源區塊順序。

### 階段 3：手機、無 JS 與可及性

- 驗證 390×844、320px 極窄寬度及桌機。
- 檢查 `<summary>` 鍵盤操作、焦點可見、長中文標題換行及 touch target。
- 關閉 JavaScript 後，欄位連結與 `<details>` 仍可操作。

### 階段 4：完整回歸與 Preview Review

- 執行既有完整 `npm run verify`。
- 以 30 款全量投影核對 167 筆關聯。
- 本機瀏覽代表案例，人工確認資料頁沒有變成教學目錄。
- 通過後停在 Push／部署人工關卡。

## 10. 回歸測試與人工視覺驗收

### 10.1 資料與關聯

- 30/30 published Game 都能建立 v2 presentation projection。
- 167 筆有效關聯全部可在頁面找到；不能增加不存在的關聯。
- 同一頁 Guide slug 唯一。
- 同一 Guide 多個 reasons 完整保留，但只渲染一次。
- Mechanism、Data Topic、Feature 的 owner 與 resolver 結果不變。
- `other` Mechanism 不 fallback。
- Scatter Feature 不映射 Scatter Pays。
- 沒有對應 Guide 的 Feature 不顯示 CTA。

### 10.2 缺值

- Big Bass Bonanza：無波動度、無最高倍數 CTA。
- Super Ace：無 RTP CTA。
- Legacy of Dead：無 RTP、波動度、最高倍數 CTA。
- Reactoonz：無 RTP、波動度、最高倍數 CTA。
- 有 RTP variants 的遊戲只顯示一個 RTP Guide 入口。
- Feature 文字或 `bonusFeatures` 不得反推出 Data Topic CTA。

### 10.3 代表遊戲

- Mahjong Ways：7/7，無展開。
- Reactoonz：4/4，無展開。
- Sweet Bonanza：6/6，無展開。
- Big Bass Bonanza：4/4，缺值入口正確省略。
- Super Ace：5/5，缺 RTP 入口正確省略。
- Bonanza、Gates of Olympus 1000、Storm of Seth 2、Sun Wu Kong：三篇 Feature Guide 直接顯示，第四篇可由 `<details>` 找到。

### 10.4 響應式與可及性

- 桌機與 390×844 沒有頁面級水平溢位。
- 長中文／英文 Guide 標題可換行，不截斷到無法辨識。
- 欄位旁連結不擠壓數值、badge 或原廠標籤。
- 鍵盤可依合理 DOM 順序到達欄位連結、`summary` 及展開後連結。
- 焦點樣式可見。
- `<summary>` 有明確文字及隱藏數量，不使用只有圖示的控制。
- 無 JavaScript 時基本內容、連結與展開功能可用。
- 0、1、2、3、4 篇 Feature Guide 狀態均不留空殼。

### 10.5 技術回歸

- Relationship tests。
- Relationship UI tests。
- Game detail fixtures。
- 30/30 Game data audit。
- Search、Explorer、Guide detail、Slots Knowledge Map 不因共用資料變更而退化。
- Astro Check、Static Build、內部連結。
- Preview Meta／Header `noindex,nofollow`、空白 sitemap、無 canonical。

## 11. 過度設計風險

- 不為四筆展開項目引入 React state、動畫套件或持久化狀態。
- 不新增使用者偏好、閱讀紀錄或 Guide 推薦分數。
- 不建立新的關聯權重、人工 priority 或第二份 registry。
- 不修改 resolver 來配合畫面；presentation helper 只消費既有結果。
- 不把每個 Feature tag 變成按鈕，避免 10 個以上焦點與重複 Guide。
- 不在欄位旁放完整文章卡片；只使用短文字入口。
- 不把三篇限制機械地改成六篇或八篇，否則只會延後相同問題。
- 不將展開區內容索引成新的 URL 或 SEO 頁面。
- 不讓欄位入口取代資料值、來源或原廠標籤。

## 12. 產品問題結論

| 問題 | v2 建議 |
| --- | --- |
| 「最多三篇」保留在哪裡？ | 保留為 Feature 區「不需展開」上限；不再是全頁關聯上限。 |
| 欄位旁入口形式？ | 短文字連結加箭頭；不用 icon-only、tooltip 或按鈕彈窗。 |
| Feature 很多如何避免 CTA 爆量？ | 先依 Guide 去重，不逐 Feature 建 CTA；最多三篇直接顯示，第四篇原生展開。 |
| 同 Guide 命中多個原因？ | 全頁只出現一次；Mechanism → Data Topic → Feature 決定位置，reasons 合併顯示。 |
| 原優先順序是否保留？ | 保留作「同一 Guide 的位置決策」，不再作「整頁截斷順序」。 |
| 沒有 Guide 時？ | 完全隱藏 CTA；不留停用文字或未發布占位。 |
| 是否需要全部相關教學展開區？ | 需要，但只在 Feature Guide 超過三篇時出現；目前僅 4 款、各 1 篇。 |
| 最小工程影響？ | 新增 presentation helper，調整單款頁與 CSS，更新 relationship UI／game detail fixtures；resolver 與其他入口不變。 |

## 13. 規格出口

```text
STAGE_RESULT: PASS_TO_NEXT_STAGE
CURRENT_STATE: READONLY_SPEC_READY_FOR_REVIEW
SCOPE: Game detail 知識關聯呈現 v2
DATA_COVERAGE: 30 款 published Game、10 篇 published Guide、167 筆有效 Game → Guide 關聯
RECOMMENDED_OPTION: 方案 D；核心資料欄位情境入口＋去重後 Feature Guide 區＋最多三篇直接顯示＋原生展開
VISIBILITY_RESULT: 現行 89/167 可見；推薦方案 163/167 不需展開、4/167 可展開、0 筆完全遺失
RELATIONSHIP_RESULT: 不新增、不刪除、不改 owner；完整 gameToGuides 作唯一事實來源
UI_RESULT: 僅完成只讀規格，尚未實作或視覺驗收
TEST_RESULTS: 已完成 30 款逐筆資料投影與方案數量模擬；未執行 Build 或網站測試
BLOCKERS: NONE
FILES_CHANGED: docs/game-detail-knowledge-relationships-v2-readonly-spec.md
COMMIT_SHA: N/A
GIT_STATUS: 僅新增本規格文件，尚未 Commit
NEXT_ALLOWED_ACTION: 人工審查規格並決定是否核准方案 D 的最小實作
COMMIT_ALLOWED: NO
PUSH_ALLOWED: NO
DEPLOY_ALLOWED: NO
HUMAN_APPROVAL_REQUIRED: YES
```
