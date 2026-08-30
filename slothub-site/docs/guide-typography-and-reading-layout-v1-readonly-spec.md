# Guide Typography and Reading Layout v1 只讀規格

> 文件狀態：`APPROVED v1`
> 任務性質：`READ-ONLY SPECIFICATION`
> 盤點日期：2026-08-30
> 程式基準：`d82c498002727146bd8589840793d0cd57980181`
> 線上量測：`https://30a28c0b.slothub-4cu.pages.dev/`

## 0. Approval Record

- 2026-08-30：人工核准方案 B 進入本機最小實作。
- 2026-08-30：完成 A／B／C 真實內容原型審查，人工核准混合方向：A Editorial Reading 作為全站 Guide 基礎，B Knowledge Diagram 作為有明確教學價值時的主要可選模組，C Game Context 僅在文章中段有具名案例時選擇性使用。
- 早期本文件的「方案 B」指 H1 字級、行高、最大寬度與節奏；視覺原型的「方案 B」指 Knowledge Diagram。最終決策以本節及第 7.4 節的混合方向為準。
- 本次最小實作核准共用 Guide 閱讀標題區、手機長標題收斂、語意片段保護與兩項已確認的水平溢位修正；不得修改文章標題文字、正文、Guide 總覽、Game detail 或其他頁面的字級。

## 1. 目標與範圍

本規格處理所有 Guide detail 共用的標題與閱讀版型，不針對 Bonus Buy 或任何單篇文章建立特例。

核心問題是：目前 Guide H1 使用接近首頁 Hero 的視覺尺度，長標題會占用過多首屏高度，與正文形成過大的比例落差。正文目前大致可讀，因此 v1 優先建立共用 Editorial Reading 標題區，調整 Guide H1 的字級、行高、寬度及上下節奏，不藉此重寫文章標題或正文。

視覺原型亦確認，知識圖解與官方遊戲圖片都可以增加理解力，但必須是由內容需求驅動的可選模組：圖解負責解釋抽象流程；官方圖片負責辨認具名遊戲案例。兩者都不是每篇 Guide 的固定首屏裝飾。

本輪只讀盤點，不修改：

- Guide、Game 或其他內容。
- 共用 Header、導覽與 Footer。
- Game detail、Guide index 或其他頁面的 typography。
- Schema、taxonomy、relationship、Search、Explorer 或 SEO 設定。

## 2. 現行共用版型

所有 published Guide detail 都由 `src/pages/guide/[slug].astro` 輸出，結構為：

```astro
<article class="article-shell">
  <h1>{entry.data.title}</h1>
  <Content />
  <!-- 衍生代表遊戲與概念入口 -->
</article>
```

目前沒有單篇 Guide 的 H1 class 或 CSS 特例。這是正確的共用基礎；本次可在同一共用 template 加入 category／level 微標、description lead、繁中閱讀起點及不改變原始文字的標題片段包裝，但不得加入 slug 專屬 H1 CSS。

### 2.1 現行主要 CSS

| 項目 | 現行值 | 觀察 |
| --- | --- | --- |
| Article shell | `width: min(880px, calc(100% - 40px))` | 文章、表格及關聯卡共用 880px 容器 |
| Article padding | `80px 0` | 桌機與手機皆為 80px，手機標題前留白偏多 |
| H1 | `clamp(3.2rem, 8vw, 6.5rem)` | 1440px 桌機命中上限 104px；390／320px 命中下限 51.2px |
| H1 line-height | `.95` | 1440px 為 98.8px；390／320px 為 48.64px |
| H1 font | Aptos Display／Noto Sans TC | 與 Guide 閱讀頁定位相比偏 Hero 化 |
| 正文 | `1.04rem / 1.85` | 實測 16.64px／30.784px，基本可讀 |
| 正文段落 | 瀏覽器預設 `1em` 上下 margin | 每段上下各 16.64px，長文節奏尚可 |
| Markdown H2 | 約 24.96px／46.176px | 未設 Guide 專用 scale，繼承 1.85 行高，偏鬆但不構成本輪主問題 |
| Markdown H3 | 約 19.47px／36.02px | 同樣繼承正文行高 |
| 關聯區 H2 | 約 40.8px／40.8px（桌機） | 已由 `.guide-relationship-heading h2` 單獨控制，不是 Markdown H2 不一致 |
| Markdown table | 瀏覽器原生 table | 無 Guide 專用 padding、border、overflow wrapper |

`.framework-shell h1, .article-shell h1` 現在共用同一宣告。實作時不應直接縮小這個合併選擇器，否則可能改到非 Guide 的 framework 頁；應在後方使用更精確的 Guide intro selector 共用覆寫。

## 3. Published Guide 標題盤點

線上共 11 篇 published Guide。下表使用 1440×900、880px article shell 的實測結果。

| Guide slug | 標題 | H1 行數 | H1 高度 |
| --- | --- | ---: | ---: |
| `fishing-games-basics` | 捕魚機入門：畫面、目標與基本玩法 | 3 | 296.4px |
| `rtp-explained` | RTP 是什麼？如何正確閱讀 | 2 | 197.6px |
| `slot-beginners-guide` | 老虎機新手入門：先看懂遊戲資料 | 2 | 197.6px |
| `slot-bonus-buy-explained` | 老虎機 Bonus Buy 怎麼看？功能購買、成本倍數與規則差異 | 4 | 395.2px |
| `slot-cascading-tumble-avalanche-explained` | 老虎機連鎖消除怎麼看？Cascading、Tumble 與 Avalanche 的差異 | 5 | 494px |
| `slot-max-win-explained` | 老虎機最高倍數怎麼看？Max Win、Max Exposure 與 Winning Ratio 的差異 | 5 | 494px |
| `slot-multiplier-explained` | 老虎機 Multiplier／倍數功能怎麼看？一般倍數、Wild Multiplier 與累積倍數的差異 | 5 | 494px |
| `slot-payout-mechanisms-explained` | 老虎機賠付機制怎麼看？賠線、Ways、Megaways、群集與任意位置賠付 | 5 | 494px |
| `slot-symbols-and-features` | Wild、Scatter、Free Spins 與 Jackpot 怎麼看 | 3 | 296.4px |
| `slot-terms-glossary` | Slot 常用術語快速查詢 | 2 | 197.6px |
| `volatility-explained` | 波動度怎麼看？低、中、高代表什麼 | 3 | 296.4px |

結果不是單一長標題偶發：4 篇 Guide 在桌機已有 5 行 H1，另 1 篇為 4 行。

## 4. 代表頁量測

代表選擇：

- 短標題：`rtp-explained`。
- 中標題：`slot-symbols-and-features`。
- 長標題：`slot-bonus-buy-explained`，亦是本次問題的實際觸發頁。

### 4.1 桌機 1440×900

| 指標 | 短：RTP | 中：Symbols | 長：Bonus Buy |
| --- | ---: | ---: | ---: |
| H1 字級／行高 | 104／98.8px | 104／98.8px | 104／98.8px |
| H1 行數 | 2 | 3 | 4 |
| H1 高度 | 197.6px | 296.4px | 395.2px |
| H1 本身占 viewport 高度 | 22.0% | 32.9% | 43.9% |
| 第一段正文起點 | 370.2px | 469.0px | 567.8px |
| 第一段開始前已用首屏 | 41.1% | 52.1% | 63.1% |

其他最長標題的第一段正文起點為 666.6px，等於首屏 74.1%；H1 本身占 54.9%。使用者在看到文章第一段前，先經過近三分之二至四分之三個 viewport，確實更像大型 Hero。

桌機 H1 與正文的字級比為 `104 / 16.64 = 6.25`。這個倍率比正文閱讀頁需要的層級差更大，是視覺失衡的主因。

### 4.2 390×844

| 指標 | 短：RTP | 中：Symbols | 長：Bonus Buy |
| --- | ---: | ---: | ---: |
| Article 實際寬度 | 335.2px | 335.2px | 335.2px |
| H1 字級／行高 | 51.2／48.64px | 51.2／48.64px | 51.2／48.64px |
| H1 行數 | 2 | 5 | 5 |
| H1 高度 | 97.3px | 243.2px | 243.2px |
| 第一段正文起點 | 259.9px | 405.8px | 405.8px |
| 第一段開始前已用首屏 | 30.8% | 48.1% | 48.1% |

Bonus Buy 實際換行最後留下兩字的「差異」短尾行；沒有觀察到單一中文字孤立，但中英混排片語被切得過碎，閱讀時仍會感到標題塊不穩定。

### 4.3 320×844

| 指標 | 短：RTP | 中：Symbols | 長：Bonus Buy |
| --- | ---: | ---: | ---: |
| Article 實際寬度 | 280px | 280px | 280px |
| H1 字級／行高 | 51.2／48.64px | 51.2／48.64px | 51.2／48.64px |
| H1 行數 | 3 | 5 | 6 |
| H1 高度 | 145.9px | 243.2px | 291.8px |
| 第一段正文起點 | 308.6px | 405.8px | 454.5px |
| 第一段開始前已用首屏 | 36.6% | 48.1% | 53.8% |

320px 下 H1／正文字級比仍為 `51.2 / 16.64 = 3.08`。Bonus Buy 需要 6 行，中文語意與英文產品詞在多處被拆開。

### 4.4 水平溢位與表格

- 重新以真實 320px 瀏覽器 viewport 量測後，先前「沒有整頁水平溢位」的結論不成立；截圖底部的水平捲軸是頁面原生 scrollbar，不是截圖工具介面。
- 共通根因是 `html { min-width: 320px; }`：垂直 scrollbar 出現時，`window.innerWidth` 為 320px、`document.documentElement.clientWidth` 約 305px，但 `documentElement.scrollWidth` 與 `body.scrollWidth` 仍被撐至 320px，因此所有頁面都會出現約 15px 的整頁橫向捲動。
- Cascading Guide 另有表格固有寬度超出 article 內容盒約 3px 的個別問題；同一頁實測 `documentElement.scrollWidth`／`body.scrollWidth` 約 323px。
- 本次核准移除全站 HTML 的 320px 最小寬限制，讓頁面寬度以可用 layout viewport 為準；同時只為 Guide Markdown table 建立容器內橫向捲動邊界，不縮小至難以閱讀，也不讓表格推寬整頁。
- 表格的完整視覺重設仍延後；本次只修正 overflow containment，保留既有內容與表格資訊。

## 5. 問題判定

### 5.1 主要問題

1. H1 在 1440px 直接命中 104px 上限，與 16.64px 正文相差 6.25 倍。
2. 同一最小字級 51.2px 被套用至 390 與 320px，320px 沒有再收斂。
3. 80px article top padding 在手機仍維持桌機值，增加正文延後出現的感受。
4. H1 沒有 Guide 專用最大閱讀寬度、balanced wrapping 或嚴格 CJK line break 控制。
5. 現行 H1 宣告與 `.framework-shell h1` 綁在一起；直接改舊規則會擴及非 Guide 頁。
6. 320px 下 `html` 最小寬與 scrollbar layout viewport 衝突；Cascading 表格另有約 3px 固有寬度溢位。

### 5.2 非本輪主要問題

- 正文字級與行高目前可讀，不需要為修正 H1 一併縮放。
- Markdown H2／H3 依賴預設比例且行高偏鬆，可在後續完整 typography scale 處理。
- Table 的完整視覺系統值得另開範圍；本輪只做已核准的橫向 containment 修正。
- Header、全站導航、Guide 文章內容與標題文字不需要修改。

## 6. 三種最小方案比較

| 方案 | 作法 | 優點 | 風險／不足 | 判定 |
| --- | --- | --- | --- | --- |
| A：只縮小 H1 | 僅降低 `.article-shell > h1` font-size | 最小 diff；可立即減少行數 | 不處理 `.95` 緊行高、80px 上距、短尾行與中英混排平衡 | 可行但不完整 |
| B：H1 字級、行高、最大寬度與節奏 | 建立 Guide-only H1 規則，加入 balanced wrap，微調 article top padding | 直接命中問題；不動正文、表格、其他頁；可共用所有 Guide | 必須驗證最長 4 篇標題與 CJK／英文混排 | **推薦** |
| C：完整 Guide typography scale | 同步規範 H1／H2／H3／正文／列表／表格／引用與閱讀欄寬 | 長期一致性最佳；可改善表格與章節節奏 | 影響面大，需更多內容回歸、表格方案與視覺決策；超過本次問題的最小解 | 延後 |

## 7. 推薦方案：B

### 7.1 建議共用 CSS

以下是下一階段的建議值，尚未套用：

```css
.article-shell {
  padding-top: 64px;
}

.article-shell > h1 {
  max-width: min(100%, 24ch);
  margin: 0 0 clamp(1.5rem, 3vw, 2.25rem);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1.08;
  letter-spacing: -0.045em;
  overflow-wrap: normal;
  line-break: strict;
  text-wrap: balance;
}

@media (max-width: 620px) {
  .article-shell {
    padding-top: 48px;
  }

  .article-shell > h1 {
    max-width: 100%;
    font-size: clamp(2.35rem, 10.5vw, 2.75rem);
    line-height: 1.1;
  }
}
```

### 7.2 預期影響

- 1440px H1 由 104px 降至 72px，H1／正文比例由 6.25 降至約 4.33。
- 390px H1 約 41px；320px H1 約 37.6px，比例約 2.26～2.46。
- Bonus Buy 預期由桌機 4 行降至約 3 行，390px 約 4 行，320px 約 4～5 行；實際行數必須在實作後回讀，不以推估取代驗收。
- `text-wrap: balance` 改善多行標題長短差距；不支援時仍以正常 CSS 換行退化，不依賴 JavaScript。
- `line-break: strict` 降低標點落在不自然行首的機率；不得以 `word-break: break-all` 粗暴拆開英文詞。
- Article 仍保留 880px，避免同時改變表格與代表遊戲區寬度。
- 正文、H2、H3、表格及 Guide relationship UI 在 v1 保持原值。

### 7.3 為何不是單篇特例

問題由所有 Guide 共用的 `.article-shell h1` 產生，而且 11 篇中有 5 篇達 4～5 行。正確修改點是 `.article-shell > h1`，不應使用 slug、頁面路徑、標題長度 class 或 Bonus Buy 專屬 selector。

### 7.4 原型審查後的最終混合方向

早期 typography 方案 B 的 H1 方向繼續作為技術基礎；視覺語言採以下混合方案：

1. **Editorial Reading 是所有 Guide 的固定骨架。** 共用標題區包含小型 category／level 微標、較自然的 H1、frontmatter description lead，以及「從這裡開始」閱讀分隔；正文隨後直接開始。不得使用 `START HERE`，也不得將標題區做成大型首頁 Hero。
2. **Knowledge Diagram 是主要但非必填的知識模組。** 只有當圖解能解釋流程、狀態、條件或差異時才使用；以語意化 HTML／CSS 或安全 SVG 表達，核心資訊不依賴 JavaScript。沒有明確教學價值時不顯示空模組，也不為了視覺一致性強迫每篇建立圖解。
3. **Game Context 是文章中段的可選案例模組。** 只能使用 repo 內已有來源紀錄的官方圖片，並直接對應鄰近的具名規則或案例；不得成為固定首屏遊戲帶、推薦清單、熱門排行或導流介面。
4. **模組與文章內容分離但必須有單一內容依據。** 本輪不在 template 內以 slug 硬編碼某篇圖解或案例，也不從標題／正文關鍵字自動猜測。第一個正式圖解或案例模組需在相應 Guide 內容任務中另行核准可追溯的結構化內容或 placement。
5. **語意片段保護。** 共用 template 可以在不改變實際 title 字串的前提下，將 `怎麼看？`／`怎麼看?` 包裝為不可拆的 inline phrase；不得使用 `word-break: break-all`，也不得為個別 slug 建立 CSS。
6. **手機長標題額外收斂。** 390px 保留原型審查通過的比例；只在 340px 以下小幅降低 Guide H1 字級與字距，優先改善 Cascading、Max Win 等中英混排長標題，不改桌機比例。

本次正式最小實作只啟用第 1、5、6 項及 overflow 修正。Knowledge Diagram 與 Game Context 的原型設計獲得方向核准，但因不得修改文章內容或新增第二份內容 mapping，本輪不把任何原型模組硬編碼進正式頁面。

## 8. 實作邊界

### 8.1 預計允許修改

必要檔案：

- `src/pages/guide/[slug].astro`：加入全站共用 Editorial Reading intro，輸出既有 category／level、description 與繁中閱讀起點；以 presentation-only helper 保護 `怎麼看？`，不得改變 title 字串。
- `src/styles/global.css`：新增 Guide-only intro／H1／lead／閱讀分隔與手機規則；移除 `html` 的 320px 最小寬限制；限制 Guide table 的 overflow 於文章容器內。

不新增單篇 Guide CSS、圖解內容 registry 或 Game Context mapping。原型目錄與原型截圖不進 Build 或 Commit。

### 8.2 不得修改

- 任一 `src/content/guides/*.md` 的 title 或正文。
- `src/pages/games/[slug].astro`、Game detail CSS 或 Compare。
- Guide index、Search、Explorer、Knowledge Map、relationship resolver。
- 共用 Header、全站導覽或非 Guide 頁 H1。
- Schema、taxonomy、URL、robots、canonical、sitemap、正式網域、Wix、DNS、301。
- `.prototype/guide-visual-direction-v1/**` 與任何原型截圖。

## 9. 實作驗收計畫

### 9.1 自動與靜態驗證

1. `git diff --check`。
2. Preview 環境完整 `npm run verify`。
3. Astro Check、Static Build、內部連結與 Preview safeguards。
4. 確認修改 selector 不命中 `.framework-shell h1`、`.page-hero h1`、`.detail-page h1` 或 Game H1。
5. 不新增 JavaScript；關閉 JavaScript 後版面相同。
6. 量測 `window.innerWidth`、`document.documentElement.clientWidth`、`document.documentElement.scrollWidth` 與 `document.body.scrollWidth`，不得只以截圖肉眼判斷 overflow。
7. 驗證 Cascading 表格在容器內可閱讀／可橫向捲動，但不再推寬 document。

### 9.2 視覺矩陣

至少回讀：

- 短：`rtp-explained`。
- 中：`slot-symbols-and-features`。
- 長：`slot-bonus-buy-explained`。
- 最長回歸：Cascading、Max Win、Multiplier、Payout Mechanisms 四篇。
- Viewport：1440×900、390×844、320×844。

每頁檢查：

- H1 實際字級、行高、行數與高度。
- 第一段正文的 viewport 起點。
- H1／正文比例與標題至第一段間距。
- 中英文詞不被逐字拆散；不得出現單一中文字孤行或只有標點的行。
- `怎麼看？` 作為完整語意片段，不在問號前拆行。
- 長標題無裁切、重疊或整頁水平溢位。
- Header 不遮住 H1，首段能在合理首屏位置出現。
- 既有 H2／H3、表格、代表遊戲與概念 CTA 沒有回歸。
- 320px 三欄表格即使仍屬既有樣式，也不得因 H1 修改新增 overflow。

### 9.3 建議量化門檻

- Bonus Buy：1440px H1 不超過 3 行；390px 不超過 4 行；320px 不超過 5 行。
- 最長四篇：1440px H1 以不超過 4 行為目標。
- Bonus Buy 第一段：1440px 應在首屏 60% 之前開始；390／320px 應在首屏 50% 左右或之前開始。
- `document.documentElement.scrollWidth <= window.innerWidth`。
- 所有文字保持可選取，無以圖片或 JavaScript 替代文字。

## 10. 已核准但仍屬可選內容模組

### 10.1 Knowledge Diagram

- 用於解釋抽象流程、狀態、條件或差異，必須提供正文難以快速掃讀的理解價值。
- 不得只是品牌色容器、圖示列或裝飾性流程線。
- 文字在 320px／390px 必須可讀，且不把正文推到比既有版型更晚的不合理位置。
- 不依賴 JavaScript才能理解；SVG 需有文字替代或可讀的 HTML 結構。
- 不要求每篇 Guide 建立，沒有資料時完全不渲染。

### 10.2 Game Context

- 僅在文章中段與具名規則或案例直接相鄰時使用。
- 只能使用 repo 內既有、來源可追溯的官方遊戲圖片；不得下載新圖、使用第三方圖或 AI 仿製圖。
- 顯示名稱與 Provider，但不加入推薦、熱門、勝率、獲利或購買暗示。
- 不固定出現在首屏，也不取代 Guide → derived Games 的既有關聯區。

## 11. 後續但不納入 v1

若 H1 v1 上線後仍需提升閱讀品質，可另行審查：

1. Guide Markdown H2／H3 的專用 typography scale 與章節間距。
2. 正文閱讀欄寬與全寬表格／關聯卡的分離方式。
3. Markdown table 的共用 border、padding、sticky first column 或局部橫向捲動策略。
4. Blockquote、code、列表與來源區的共用閱讀樣式。

這些不應偷渡進本次 H1 最小實作。

## 12. 固定尾段

`STAGE_RESULT: PASS_TO_NEXT_STAGE`
`CURRENT_STATE: APPROVED_FOR_LOCAL_IMPLEMENTATION`
`REPRESENTATIVE_GUIDES: rtp-explained（短）、slot-symbols-and-features（中）、slot-bonus-buy-explained（長）；另以四篇五行標題作最長回歸`
`DESKTOP_FINDINGS: H1 為 104px／98.8px，與正文比例 6.25；長標題 4～5 行，第一段最晚至首屏 74.1% 才出現`
`MOBILE_FINDINGS: 390px Bonus Buy比例可接受；320px Cascading與Max Win仍偏重；html min-width與Cascading table會造成真實整頁overflow`
`RECOMMENDED_OPTION: 混合方向；Editorial Reading作固定骨架、Knowledge Diagram作主要可選知識模組、Game Context只在中段具名案例使用`
`FILES_EXPECTED_TO_CHANGE: src/pages/guide/[slug].astro、src/styles/global.css；原型與截圖不得提交`
`TEST_PLAN: 11篇Guide於1440×900、390×844、320×844回讀；語意片段、表格containment、document寬度、無JS及完整npm run verify`
`BLOCKERS: NONE`
`FILES_CHANGED: docs/guide-typography-and-reading-layout-v1-readonly-spec.md`
`COMMIT_SHA: 由本次amend後回報`
`GIT_STATUS: 規格與實作各維持一個未Push本地Commit；prototype保持未追蹤`
`NEXT_ALLOWED_ACTION: 完成本機最小實作、視覺截圖與完整CI後交人工審查`
`COMMIT_ALLOWED: YES；僅限amend既有規格與實作Commit`
`PUSH_ALLOWED: NO`
`DEPLOY_ALLOWED: NO`
`HUMAN_APPROVAL_REQUIRED: YES`
