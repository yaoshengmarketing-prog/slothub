# Slot Hub「Wild、Scatter、Free Spins 與 Jackpot」既有 Guide 補強 Brief

> **APPROVED — READ-ONLY BRIEF**
>
> 本文件依 `docs/slot-hub-master-blueprint-v1.md`、`docs/guide-content-workflow-v1.md`、`docs/guide-game-relationship-v1-readonly-spec.md`、現有 30 款 `published` Game、10 篇 `published` Guide，以及目前 Guide relationship foundation 盤點。
>
> 本輪只稽核既有永久 Guide `slot-symbols-and-features` 的內容、來源與關聯承接能力；沒有修改該 Guide、Game、Schema、taxonomy、resolver、Search、Explorer、UI 或發布狀態。
>
> 核對日期：2026-08-30
>
> 2026-08-30 人工決策：維持既有永久頁與四個 `relatedFeatures`，不拆頁、不新增網址、不移交 relationship owner；核准依本 Brief 補強既有 published Guide，並先對 `Hand of Anubis` 的 Wild／Scatter 執行第一方定向補證。

## 1. 結論摘要

建議 **維持同一篇永久 Guide** 承接 `free-spins`、`wild`、`scatter`、`jackpot`，優先補強既有 `/guide/slot-symbols-and-features/`，目前不拆頁。

理由如下：

- Wild、Scatter 與 Free Spins 在使用者理解路徑上高度連續：先辨識符號，再理解觸發條件，最後閱讀 Bonus 回合規則。30 款遊戲中有 8 款同時標記三者，另有 7 款同時標記 Free Spins 與 Scatter。
- Jackpot 的搜尋意圖較獨立，但目前只有 1 款 Game 標記 `jackpot`，而且 30 款的 `jackpotType` 全部未填。現在拆成獨立 Guide，容易形成樣本不足的薄內容與第二個競爭入口。
- 既有 Guide 已是四個 Feature 的唯一 relationship owner；維持 owner 可避免 Search、Explorer、Game detail 與 `/slots/` Knowledge Map 發生所有權遷移。
- 文章可以用「常見符號與獎勵回合怎麼讀」作共同搜尋意圖，再讓 Jackpot 小節保持窄範圍，只教讀者分辨 `Jackpot Feature` 與已確認的 Jackpot 類型，不泛化少量樣本。

目前 29 款反向關聯是由結構化 Feature tag 正確推導；其中 28 款已有可追溯的第一方依據。`Hand of Anubis` 的 `wild`、`scatter` 標記尚缺能直接支撐這兩個標記的第一方原文，應另列資料核對，不應用文章敘述掩蓋。

## 2. 現有文章內容稽核

現有正文只有導言與四個短段落，方向正確，但尚不足以回答使用者實際查規則時遇到的差異。

| 概念 | 現有內容 | 已做對的事 | 主要不足 | 建議補強深度 |
| --- | --- | --- | --- | --- |
| Wild | 說明通常替代一般符號，可能排除 Scatter、Bonus、Jackpot；列舉擴展、黏著、倍數 Wild | 已避免把 Wild 寫成必然替代所有符號 | 沒有解釋替代範圍依 Paytable；沒有 stacked、walking、collecting、transforming 等常見類型；沒有說明 Wild 可只在特定轉輪或 Bonus 出現 | 主章，約 550～700 字 |
| Scatter | 說明常用來觸發免費遊戲，可能不依固定連線；提醒查看數量、位置與 retrigger | 已指出 Scatter 不一定依賠線 | 沒有明確區分 Scatter symbol、Scatter win、Scatter Pays／Pay Anywhere；沒有說明同一符號可兼具 Wild；沒有處理「名稱有 Scatter」不能推導規則 | 主章，約 500～650 字 |
| Free Spins | 說明是額外回合，可能加入倍數、特殊盤面或其他功能；不保證固定結果 | 風險語言正確 | 沒有觸發數量、初始回合、額外 Scatter、retrigger、上限與 Bonus 專屬規則的閱讀順序；沒有區分自然觸發與 Bonus Buy | 主章，約 600～750 字 |
| Jackpot | 說明可能是固定、遊戲內累積或跨遊戲累積，Slot Hub 只記錄可核對類型 | 已避免把所有大獎功能標成累積彩金 | 目前站內只有 1 個 `jackpot` 樣本且 `jackpotType` 皆空；不應用通用分類營造已有大量實證；需明確區分 Feature tag、獎項名稱與類型欄位 | 邊界章，約 250～350 字 |

正文目前沒有可點擊的站內 Guide 連結。未來改寫時可連至賠付機制、Multiplier、Cascading、Bonus Buy／術語表，但不能在本篇重寫那些文章的完整內容。

## 3. 30 款 published Game 覆蓋

### 3.1 數量

| Feature | 遊戲數 | 取得率 | 精確 Explorer URL |
| --- | ---: | ---: | --- |
| Free Spins | 23 | 76.7% | `/games/?features=free-spins` |
| Wild | 15 | 50.0% | `/games/?features=wild` |
| Scatter | 16 | 53.3% | `/games/?features=scatter` |
| Jackpot | 1 | 3.3% | `/games/?features=jackpot` |
| 四者聯集 | 29 | 96.7% | 由四個獨立條件構成，不合併成 AND |

唯一沒有命中四者的遊戲是 `fortune-ox`。

### 3.2 組合分布

| 組合 | 遊戲數 | 遊戲 |
| --- | ---: | --- |
| Free Spins + Wild + Scatter | 8 | Big Bass Bonanza、Cash Crew、Fish Tales、Gonzo’s Quest、Legacy of Dead、Mahjong Ways 一／二、Book of Dead |
| 只有 Free Spins | 7 | Chaos Crew、Greedy for Gold、Jump High、Ragnarök Gold、Shadow of Dominion、Sun Wu Kong、Super Ace |
| Free Spins + Scatter | 6 | Bonanza、Gates of Olympus 一／1000、Storm of Seth、Sweet Bonanza 一／1000 |
| 只有 Wild | 5 | Fortune Paw、Fortune Tiger、Reactoonz、Starburst、Wanted Dead or a Wild |
| Wild + Scatter | 1 | Hand of Anubis |
| Free Spins + Scatter + Jackpot | 1 | Storm of Seth 2: Awakening |
| Free Spins + Wild | 1 | Wildhalla |
| 無 | 1 | Fortune Ox |

### 3.3 逐款關聯與證據稽核

「可承接」代表本次找到第一方頁面、規則文件或目前資料已保存的第一方描述，足以支持至少一個命中的 Feature；不表示文章可以代替單款規則。

| Game | Free Spins | Wild | Scatter | Jackpot | 關聯證據判定 |
| --- | :---: | :---: | :---: | :---: | --- |
| Big Bass Bonanza | ✓ | ✓ | ✓ | — | 可承接；官方資料有 3／4／5 Scatter、10／15／20 Free Spins、Fisherman Wild、retrigger |
| Bonanza | ✓ | — | ✓ | — | 可承接；官方頁保存 GOLD Scatter、Free Spins、額外 Scatter 與 retrigger |
| Cash Crew | ✓ | ✓ | ✓ | — | 可承接；官方頁明載 Multiplier Wild、FS Scatter、6／9 Free Spins 與額外回合 |
| Chaos Crew | ✓ | — | — | — | 可承接；官方頁明載 free spins round |
| Fish Tales: Double Catch Max Scatter | ✓ | ✓ | ✓ | — | 可承接；官方發布稿明載 Max Scatter、Free Spins、Wild collection |
| Fortune Ox | — | — | — | — | 不建立本 Guide 反向關聯 |
| Fortune Paw | — | ✓ | — | — | 可承接；官方發布資訊明載 Wild collection |
| Fortune Tiger | — | ✓ | — | — | 可承接；官方 Game Information 明載 Wild substitutes for all symbols |
| Gates of Olympus | ✓ | — | ✓ | — | 可承接；官方頁與規則明載 Scatter symbols 與 Free Spins |
| Gates of Olympus 1000 | ✓ | — | ✓ | — | 可承接；官方頁明載 4+ Scatter、15 Free Spins 與 retrigger |
| Gonzo’s Quest | ✓ | ✓ | ✓ | — | 可承接；官方頁明載 Wild、Free Fall Scatter、10 Free Spins 與 retrigger |
| Greedy for Gold: Hold and Win | ✓ | — | — | — | 可承接；官方發布稿明載 3／4／5 Scatter 對應 10／15／20 Free Spins |
| Hand of Anubis | — | ✓ | ✓ | — | **資料問題**；目前第一方公開摘要只確認 Cluster／Cascading 與 Bonus，未找到直接支持 Wild／Scatter tag 的原文 |
| Jump High | ✓ | — | — | — | 可承接；CQ9 官方資料保存 Free Game |
| Legacy of Dead | ✓ | ✓ | ✓ | — | 可承接；官方頁明載 Tomb Scatter 同時作 Wild、Free Spins 與 retrigger |
| Mahjong Ways | ✓ | ✓ | ✓ | — | 可承接；官方 PDF 明載 Wild 不替代 Scatter、3 Scatter 觸發 12 Free Spins |
| Mahjong Ways 2 | ✓ | ✓ | ✓ | — | 可承接；官方 PDF／頁面保存 Wild transformation、Scatter、Free Spins |
| Ragnarök Gold | ✓ | — | — | — | 可承接；Slotmill 官方資料表保存 Free Spins Bonus |
| Reactoonz | — | ✓ | — | — | 可承接；官方頁明載 Flux Capacitors 作 Wild，Gargantoon 亦進入 Wild 狀態 |
| Rich Wilde and the Book of Dead | ✓ | ✓ | ✓ | — | 可承接；官方頁明載 Scatter 觸發 10 Free Spins；相關官方規則確認 Wild／Scatter 行為 |
| Shadow of Dominion | ✓ | — | — | — | 可承接；Slotmill 官方資料表保存 Free Spins／Super Free Spins |
| Starburst | — | ✓ | — | — | 可承接；NetEnt 官方頁保存 Expanding Wilds |
| Storm of Seth | ✓ | — | ✓ | — | 可承接；官方頁明載 4 Scarab 觸發 Free Game，並以 Scatter Pays 描述基礎計獎 |
| Storm of Seth 2: Awakening | ✓ | — | ✓ | ✓ | 可承接；官方頁明載 Scatter、Free Games、retrigger 與 Jackpot Mini-Game |
| Sun Wu Kong | ✓ | — | — | — | 可承接；ATG 官方頁保存 Free Games |
| Super Ace | ✓ | — | — | — | 可承接；JILI 官方頁保存 Free Game／Free Spin |
| Sweet Bonanza | ✓ | — | ✓ | — | 可承接；官方頁明載 4–6 Scatter 觸發 10 Free Spins |
| Sweet Bonanza 1000 | ✓ | — | ✓ | — | 可承接；官方頁明載 4+ Scatter、10 Free Spins 與 retrigger |
| Wanted Dead or a Wild | — | ✓ | — | — | 可承接；官方頁明載 expanded Wild reels、Sticky Wild 與收集 Wild |
| Wildhalla | ✓ | ✓ | — | — | 可承接；Slotmill 官方資料表保存 Walking／Multiplier Wilds、Free Spins |

### 3.4 29 款反向關聯結論

- **結構化關聯**：29/29 會依現有 `features` 正確反向連到 `slot-symbols-and-features`。
- **第一方證據可承接**：28/29。
- **需另行資料補證**：1/29，`hand-of-anubis`。需取得官方 Game Rules／Paytable 或足以直接描述 Wild／Scatter 的官方頁面，再決定保留或修正 Feature tag。
- 本 Brief 不授權修改 `Hand of Anubis` 資料，也不把它的缺口寫成讀者文章中的通用規則。

## 4. 搜尋意圖與是否拆頁

### 4.1 Wild、Scatter、Free Spins

三者適合由同一永久網址承接：

- 「Wild 是什麼」「Scatter 是什麼」「Free Spins 怎麼觸發」都屬新手理解遊戲符號與 Bonus 規則的同一任務。
- Scatter 常是 Free Spins 的觸發符號；Wild 又常在 Free Spins 內改變行為。分拆會造成互相大量重複定義與往返連結。
- 現有 relationship model 允許同一篇 Guide 分別承接多個概念，Explorer CTA 仍是四個獨立 Feature query，不會合成 AND。

### 4.2 Jackpot

Jackpot 有獨立搜尋意圖，但目前不建議拆頁：

- 站內只有 1 款標記 `jackpot`，沒有已填 `jackpotType` 的 Game。
- 現階段能負責的是「辨識資料標籤與避免錯判」，不是完整比較固定、累進、區域或聯網 Jackpot 的資料型文章。
- 拆頁會建立第二個內容入口，但沒有足夠站內案例、類型資料或來源支撐內容厚度。

未來只有在以下條件同時較成熟時，才值得另案評估 Jackpot Guide：

1. 多款遊戲具有第一方核對的 `jackpotType`。
2. 能用官方規則分辨 fixed／progressive／local／networked 等類型，而非依獎項名稱猜測。
3. 獨立搜尋意圖與內容厚度足以避免與本篇重複。
4. 人工核准 relationship owner 移交與永久網址策略。

## 5. 建議的新內容架構

建議全文約 2,800～3,600 個繁中文字；維持單篇實用型教學，不追求把所有原廠 Feature 名稱收進正文。

| 章節 | 目的 | 建議篇幅 |
| --- | --- | ---: |
| 開場：先分清符號、觸發條件與 Bonus 規則 | 建立閱讀順序，提醒每款規則不同 | 180～250 字 |
| 四個概念快速對照表 | 說明「主要用途」「需要查的欄位」「不可推論」 | 220～300 字 |
| Wild：能替代什麼、不能替代什麼 | 替代範圍、出現位置、特殊 Wild 類型 | 550～700 字 |
| Scatter：符號不等於賠付機制 | 觸發、位置、數量、Scatter win、Scatter Pays 邊界 | 500～650 字 |
| Free Spins：回合數怎麼讀 | 初始回合、額外 Scatter、retrigger、上限、Bonus 專屬規則 | 600～750 字 |
| Jackpot：先確認是 Feature 還是類型 | 說明 feature flag 與 `jackpotType` 的證據門檻 | 250～350 字 |
| 用三個步驟查單款遊戲 | 先看 Feature、再看原廠規則、最後比較資料 | 250～350 字 |
| 與其他概念的邊界與延伸閱讀 | 導向賠付機制、Multiplier、Cascading、Bonus Buy／術語表 | 220～300 字 |

### 5.1 建議標題與 description

- 標題維持：`Wild、Scatter、Free Spins 與 Jackpot 怎麼看`
- 建議 description：`看懂老虎機 Wild 的替代範圍、Scatter 與 Scatter Pays 的差別、Free Spins 觸發與重複觸發規則，以及 Jackpot 功能和實際彩金類型為何不能混為一談。`
- 永久 slug 維持：`slot-symbols-and-features`

不建議為了補強內容改 slug 或另建競爭頁。

## 6. Wild 內容規格

### 6.1 必須回答

- Wild 是否替代所有「一般付費符號」，還是只替代 Paytable 明列的符號。
- 是否排除 Scatter、Bonus、Jackpot、Collect、特殊 Expanding Symbol 或其他原廠指定符號。
- Wild 會在哪些轉輪、盤面位置、Base Game 或 Bonus Game 出現。
- Wild 是否只替代、同時帶倍數、擴展、黏著、移動、收集或轉換其他符號。

### 6.2 可使用的特殊類型

- **Expanding Wild**：Starburst 的 Wild 可擴展並帶來 respin；不能把所有 Expanding Symbol 都叫 Wild。
- **Sticky Wild**：Wanted Dead or a Wild 的 Bonus 中有 Sticky Wild；黏著多久、是否跨回合要依規則。
- **Walking Wild**：Wildhalla；移動方向與持續回合不能泛化。
- **Multiplier Wild**：Cash Crew、Wildhalla、Wanted；倍數套用範圍須導向 Multiplier Guide，不在本篇展開數學規則。
- **Collecting Wild**：Big Bass Bonanza 的 Fisherman Wild 收集 Money symbols；屬特定 Bonus 規則，不是所有 Wild 的共通功能。
- **Transforming Wild**：Mahjong Ways 的 Wild transformation；應保留原廠語意，不把「轉換」當成所有 Wild 的標準型別。
- **Cluster／Grid Wild**：Reactoonz 的 Flux Capacitors 與 Gargantoon；在群集遊戲中，Wild 的參與方式不必等同賠線遊戲。

### 6.3 不可寫成通用規則

- Wild 必然替代 Scatter、Bonus 或 Jackpot。
- Wild 必然出現在所有轉輪。
- Wild 必然提高中獎率。
- 標題或角色名稱含 `Wild` 就足以證明資料標記；必須看官方規則。Wanted 的標記可由官方 Feature 說明支持，不是由遊戲名推定。

## 7. Scatter 與 Scatter Pays 邊界

### 7.1 Scatter symbol

Scatter 是符號或觸發條件。應查：

- 需要幾個。
- 是否可出現在任意位置，或指定轉輪／位置。
- 是否直接給獎、只觸發 Feature，或兩者皆有。
- 在 Bonus 中是否能 retrigger。
- 是否有普通 Scatter、Super／Max／Awakening Scatter 等遊戲專屬版本。

### 7.2 Scatter Pays／Pay Anywhere

- `scatter` Feature 只代表遊戲具有可確認的 Scatter 符號或相關功能。
- `Scatter Pays`、`Pay Anywhere` 是整款遊戲基礎中獎方式的描述，屬 Mechanism 判斷問題。
- Sweet Bonanza 的 Scatter 觸發 Free Spins，不代表整款遊戲的基礎 Mechanism 應由 Feature tag 自動改成 Scatter Pays。
- Storm of Seth 官方頁同時使用 `Scatter Pays` 描述相同符號任意位置成立的基礎計獎；這應由賠付機制 Guide 與 `winMechanism` 承接，本文只說明為何不能把兩個概念混在一起。
- `Max Scatter`、`Super Scatter` 是品牌化 Feature 名稱，不能只因名稱相似推導所有規則或 taxonomy。

## 8. Free Spins 內容規格

### 8.1 觸發與初始回合

文章應教讀者逐項看：觸發符號、數量、位置、初始回合數與額外 Scatter 是否增加回合。

代表案例：

- Mahjong Ways：3 Scatter 觸發 12 Free Spins，每多一個 Scatter 再加 2 回合。
- Big Bass Bonanza：3／4／5 Scatter 對應 10／15／20 Free Spins。
- Sweet Bonanza：4–6 Scatter 觸發 10 Free Spins；不要由 Scatter 數量自行推定更多初始回合。
- Gonzo’s Quest：3 個 Free Fall Scatter 位於指定轉輪時觸發 10 Free Spins。

### 8.2 Retrigger

- retrigger 可能由 Scatter、Wild 收集進度、Stopwatch、特殊符號或其他條件觸發。
- Big Bass Bonanza 每四個 Wild 增加 10 回合；Sweet Bonanza 1000 以 3+ Scatter 增加 5 回合；Gonzo’s Quest 以 Free Fall Scatter retrigger。
- 有些遊戲有回合上限，例如 Storm of Seth 2 官方頁寫最多 100 回合；不能把單款上限寫成通用規則。

### 8.3 Bonus 專屬規則

- Free Spins 期間可能換盤面、選 Special Expanding Symbol、累積 multiplier、加入 Sticky Wild、提高特定符號出現條件或使用不同 Paytable。
- Free Spins 是回合／Feature，不代表它本身是第二個主要 Mechanism。
- `bonus-buy` 是進入 Feature 的另一條路徑；是否存在、價格與市場限制由 Bonus Buy／術語表承接。
- 不使用「免費旋轉更容易贏」「一定回本」或類似結果暗示。

## 9. Jackpot Feature 與 jackpotType

### 9.1 現有資料事實

- 30 款中只有 `storm-of-seth-2-awakening` 標記 `features: [jackpot]`。
- ATG 官方頁明載 `Jackpot Mini-Game`，並說明 Base Game 落下 2–5 個 JP symbols 會給對應 Jackpot prizes。
- 目前 30 款的 `jackpotType` 全部空白；官方現有文字不足以把 Storm of Seth 2 自動分類成 fixed、progressive、local、networked 或 multiple。

### 9.2 文章可說與不可說

可以說：

- `jackpot` Feature 表示存在可核對的 Jackpot 命名功能或獎項流程。
- `jackpotType` 需要能確認彩金如何形成、是否累積、範圍及連線層級的更高權重規則證據。
- 顯示 Mini／Major／Grand 等名稱不等於已知道其技術類型。

不可說：

- 所有 Jackpot 都是累進彩金。
- 有 Jackpot Feature 就一定有可跨遊戲或跨平台累積的獎池。
- 只有一個樣本就足以歸納各類 Jackpot 的一般機率或觸發方式。

## 10. 與既有內容的邊界

| 相鄰內容 | 本篇負責 | 交給既有 Guide |
| --- | --- | --- |
| 賠付機制 | Scatter symbol 與 Mechanism 不同 | Paylines、Ways、Megaways、Cluster Pays、Pay Anywhere 如何成立中獎組合 |
| Multiplier | 只說 Wild／Free Spins 可能帶倍數 | 一般倍數、Wild Multiplier、累積／Sticky／Locked Multiplier 的套用範圍 |
| Cascading | 只說 Bonus 可能同時有符號掉落 | Cascading／Tumble／Avalanche 是中獎後更新符號的 Feature |
| Bonus Buy／術語表 | 只說 Free Spins 可自然觸發或另有購買入口 | Bonus Buy 定義、缺值語意及其他術語 |
| Jackpot | Feature tag 與 type 證據門檻 | 暫無另一篇 Guide；不創建排行榜或集合頁 |

本篇不重寫 RTP、波動度或最高倍數，也不討論哪種 Feature「比較好」。

## 11. 第一方來源與代表案例

下列來源足以建立文章主線；精確敘述仍需在改寫階段逐句對照原文。

| 來源 | 可支撐內容 |
| --- | --- |
| [PG SOFT Mahjong Ways Game Information](https://www.pgsoft.com/uploads/GamesResource/ab4466ec-4093-4994-b68f-be7ce48f68fa.pdf) | Wild 不替代 Scatter；3 Scatter 觸發 Free Spins；額外 Scatter 增加回合 |
| [PG SOFT Fortune Tiger Game Information](https://www.pgsoft.com/uploads/Games/Pdf/Fortune_Tiger_Gameinformation_EN.pdf) | Wild substitutes for all symbols，顯示排除範圍不能跨遊戲套用 |
| [Pragmatic Play Big Bass Bonanza](https://www.pragmaticplay.com/en/games/big-bass-bonanza/) | Scatter 數量、Free Spins 回合、Fisherman Wild 收集與 retrigger |
| [Pragmatic Play Sweet Bonanza](https://www.pragmaticplay.com/en/games/sweet-bonanza-slot/) | Scatter 觸發 10 Free Spins；Scatter 與 Pay Anywhere 應分開描述 |
| [NetEnt Gonzo’s Quest](https://netent.com/games/gonzos-quest/) | Wild 替代、可協助 Free Fall Scatter、指定轉輪觸發與 retrigger |
| [Play’n GO Legacy of Dead](https://www.playngo.com/games/legacy-of-dead) | Tomb 同時作 Scatter 與 Wild；Free Spins、Special Expanding Symbol、retrigger |
| [Play’n GO Rich Wilde and the Book of Dead](https://www.playngo.com/games/rich-wilde-and-the-book-of-dead) | 3 Scatter、10 Free Spins、Special Expanding Symbol、retrigger |
| [Play’n GO Reactoonz](https://www.playngo.com/games/reactoonz) | Flux Capacitors 作 Wild；Grid／Cluster 遊戲的 Wild 不應套用賠線假設 |
| [Hacksaw Gaming Cash Crew](https://www.hacksawgaming.com/games/cash-crew) | Multiplier Wild、FS Scatter、6／9 Free Spins、Stopwatch 額外回合 |
| [Hacksaw Gaming Wanted Dead or a Wild](https://www.hacksawgaming.com/games/wanted-dead-or-a-wild) | expanded Wild reels、Sticky Wild、收集 Wild 與不同 Bonus 模式 |
| [Booming Games Greedy for Gold](https://booming-games.com/news/gmqdb07ay3dh9a8fzzy0u66s) | Scatter 數量對應初始 Free Spins、Jumbo Scatter 額外回合 |
| [Booming Games Fish Tales: Double Catch Max Scatter](https://booming-games.com/news/yahdelyjxgjdh26r9i2b3dcj) | Max Scatter、Free Spins、Wild collection 與品牌化 Feature 邊界 |
| [ATG Storm of Seth 2: Awakening](https://www.atg-games.com/en/games/slot/storm-of-seth-2-awakening) | Scatter、15 Free Spins、retrigger 上限、Jackpot Mini-Game |

不使用搜尋摘要、AI 回答、娛樂城內容或第三方資料庫支撐精確規則。

## 12. Relationship、Search 與入口影響

### 12.1 建議保持不變

- relationship owner 維持 `slot-symbols-and-features`。
- frontmatter 維持 `relatedFeatures: [free-spins, wild, scatter, jackpot]`。
- Search 仍對四個 Feature 分別產生「了解概念」與「探索遊戲」。
- Explorer URL 維持四個精確 Feature filter，不建立全文搜尋替代網址。
- Game detail 仍依 resolver reasons 反查；本次內容更新不改 29 款結構化結果。
- `/slots/` Knowledge Map 仍保留四個獨立概念卡，可共同連到同一 Guide，但各自探索不同 Feature query。
- Guide detail 的四個 Explorer CTA 必須保持獨立，不可合成 AND。

### 12.2 不需要的變更

- 不需修改 Guide Schema、Feature enum、relationship resolver、presentation helper 或 URL serializer。
- 不需建立新的 Search alias、第二份 mapping 或 Jackpot 永久頁。
- 不需變更 Game detail 每頁呈現上限；v2 已能按欄位／Feature rail 呈現並去重。

### 12.3 唯一資料追蹤項

`Hand of Anubis` 需另行 Game data revalidation。這是 Game Feature 證據問題，不是 Guide owner、文章內容或 resolver 問題；未取得資料修改授權前不得調整其 tags。

## 13. 內容改寫的 Search 與重複風險

### 13.1 主要搜尋意圖

「辨識老虎機常見特殊符號，讀懂觸發條件、替代範圍與 Bonus 回合規則」。

### 13.2 次要意圖

- Wild 可以代替哪些符號。
- Scatter 與 Scatter Pays 是否相同。
- Free Spins 怎麼觸發、能否 retrigger。
- Jackpot Feature 是否等於累進彩金。

### 13.3 重複風險與控制

- 若拆成 Wild、Scatter、Free Spins 三篇，會重複觸發與 Bonus 流程；目前維持整合文。
- 賠付機制只處理「中獎組合如何成立」；本文不重寫五種 Mechanism。
- Multiplier、Cascading 只作延伸閱讀；本文不重寫其變體與計算方式。
- Jackpot 不延伸成類型百科、排行或比較頁，避免用單一樣本製造內容厚度。

## 14. 建議內容改寫範圍

若 Brief 經人工核准，下一階段只應：

1. 改寫 `src/content/guides/slot-symbols-and-features.md` 正文與必要的 description／updatedAt。
2. 保留 slug、title、category、level、`relatedFeatures` 與 `status: published`，除非人工另行核准 metadata 變更。
3. 加入第一方來源連結與站內延伸 Guide 連結。
4. 不修改任何 Game 資料；`Hand of Anubis` 另案追蹤。

這是既有 published Guide 的內容修訂，不是新 Guide draft。實作時應在本地保留 `status: published` 進行完整驗證；未 Push 前不影響線上 Preview。內容修訂 Commit 與 Push／部署仍需依 Guide Content Workflow 的人工關卡另行核准。

## 15. 測試與 Preview 模擬範圍

### 15.1 來源與內容 QA

- 每個精確觸發數量、回合數、retrigger、替代排除條件都可回到第一方原文。
- 全文不得把 Scatter Feature 寫成 Scatter Pays Mechanism。
- 全文不得把 Jackpot Feature 寫成已確認的 `jackpotType`。
- 不把 Wild、Free Spins 或 Jackpot 描述成提高勝率、保證結果或投注技巧。
- 不由遊戲名稱推導規則。

### 15.2 Relationship

- 四個 Feature 都只有 `slot-symbols-and-features` 一個 owner。
- Guide → Game 聯集維持 29 款；Fortune Ox 不得誤連。
- Game → Guide reasons 只來自現有 Feature tags。
- `Hand of Anubis` 的現有投影不在本輪改動，但測試報告須保留資料待補證註記。
- Scatter Feature 不得映射成 Scatter Pays Mechanism。
- Guide detail 四個 Explorer CTA 分開，不形成 AND query。

### 15.3 Search、Explorer 與 Knowledge Map

- `Wild／百搭符號`、`Scatter／散佈符號`、`Free Spins／免費旋轉`、`Jackpot` 均顯示正確 Guide 與精確 Explore URL。
- Explorer 各條件結果維持 15、16、23、1 款。
- `/slots/` 四個 Knowledge Map 概念仍連同一 Guide、不同 query。
- 賠付機制、Multiplier、Cascading、Bonus Buy 的 owner 與 CTA 不變。

### 15.4 Game detail 與 Guide detail

- 代表頁：Mahjong Ways、Big Bass Bonanza、Gonzo’s Quest、Sweet Bonanza、Reactoonz、Storm of Seth 2、Fortune Ox、Hand of Anubis。
- 驗證 0／1／2／3 個本篇 Feature reasons 合併後只渲染一個 Guide。
- Game detail 全頁 Guide slug 唯一；欄位 CTA、Feature direct／overflow 與 v2 presentation 不退化。
- Guide detail 顯示 3～6 款代表遊戲，排序穩定，四個 CTA 獨立。

### 15.5 UI、建置與 Preview safeguards

- 桌機、390×844、320px；長標題、來源連結、表格與清單無整頁水平溢位。
- 鍵盤可到達正文連結、Guide CTA 與代表遊戲；focus-visible 清楚。
- 執行與 GitHub Actions 相同的 Preview 驗證命令：設定 `ASTRO_TELEMETRY_DISABLED=1`、`PUBLIC_SITE_ENV=preview` 後執行 `npm run verify`。
- HTML 與 Header 維持 `noindex,nofollow`、Preview sitemap 空白、無 canonical。

## 16. 是否具備進入改寫階段的條件

**有條件具備。** 現有永久網址、relationship owner、四個 Feature filter 與 28 款第一方證據足以支撐內容補強，不需要 Schema、taxonomy、resolver 或 URL 決策。

人工審查需確認兩點：

1. 接受維持四合一永久 Guide，Jackpot 只作窄範圍邊界章，不拆頁。
2. 接受 `Hand of Anubis` 作獨立資料補證項；本次文章改寫不處理或引用它。

## 17. 本階段限制

- 只新增本 Brief。
- 不修改 `slot-symbols-and-features.md`。
- 不修改任何 Game、Guide frontmatter、Schema、taxonomy、resolver、Search、Explorer、UI 或測試。
- 不 Build、不模擬發布、不 Commit、不 Push、不部署。
- 不修改正式網域、Wix、DNS、301、canonical 或索引政策。

## 18. 工作流出口

- `STAGE_RESULT: PASS_TO_NEXT_STAGE`
- `CURRENT_STATE: READONLY_BRIEF_COMPLETE`
- `GUIDE_SLUG: slot-symbols-and-features`
- `GUIDE_TITLE: Wild、Scatter、Free Spins 與 Jackpot 怎麼看`
- `RELATIONSHIP_TYPE: Feature → free-spins／wild／scatter／jackpot；維持既有單一 owner`
- `SOURCE_STATUS: 28/29 反向關聯已有第一方依據；Hand of Anubis 的 wild／scatter 標記需另行資料補證`
- `CONTENT_QA_RESULT: 現文方向正確但過薄；建議維持同一永久網址並依本 Brief 補強四個概念與邊界`
- `RELATIONSHIP_RESULT: 現有 owner、29 款投影、Search／Explorer／Game detail／Knowledge Map 均無需改變`
- `UI_RESULT: N/A；本輪未修改或模擬 UI，已定義後續桌機、390px、320px 驗收範圍`
- `TEST_RESULTS: 30 款 published Game 本地只讀統計完成；Markdown 標題結構、尾端空白與 git diff --check 通過`
- `PUBLISHED_SIMULATION_RESULT: N/A；本輪禁止修改 published Guide`
- `EXACT_CI_COMMAND_RETESTED: N/A；READONLY_BRIEF 階段不 Build、不執行完整 CI`
- `RELATIONSHIP_EXPECTATION_MIGRATIONS: NONE；不移交 owner，不改測試預期`
- `BLOCKERS: NONE；Hand of Anubis 是後續資料補證項，不阻止既有 Guide 的其他內容改寫`
- `FILES_CHANGED: docs/slot-symbols-and-features-guide-v1-readonly-brief.md`
- `COMMIT_SHA: N/A`
- `GIT_STATUS: 工作目錄只有本 Brief 一個未追蹤檔案；既有檔案無修改`
- `NEXT_ALLOWED_ACTION: 人工審查 Brief，決定是否核准補強既有 published Guide`
- `COMMIT_ALLOWED: NO`
- `PUSH_ALLOWED: NO`
- `DEPLOY_ALLOWED: NO`
- `HUMAN_APPROVAL_REQUIRED: YES`
