---
title: RTP 是什麼？如何正確閱讀
description: 看懂 RTP 的投注與回報基準、長期理論意義、多版本差異，以及它和短期結果、波動度與 House Edge 的界線。
category: data
level: beginner
tags: [RTP, 機率]
relatedDataTopics: [rtp, rtp-variants]
status: published
publishedAt: 2026-08-28
updatedAt: 2026-08-30
---

RTP（Return to Player）用來描述遊戲在大量、長期結果下，投注總額有多少比例理論上會以獎金回到玩家整體。它不是單次旋轉、單次 Session 或個人帳戶的回收保證，也不能預測下一次結果。

## 1. RTP 先看一句話

如果一款遊戲標示理論 RTP 為 96%，可以把它理解成：在規則採用的投注與獎金基準下，經過非常大量的遊戲結果後，設計上預期約有 96% 的投注總額以獎金形式回到所有玩家。

這句話有三個重要限制：它談的是大量結果、理論模型與玩家整體，不是「每投 100 元就會拿回 96 元」。英國 Gambling Commission 也明確提醒，標示 85% RTP 的機器，不代表玩家在一次 Session 中每投注 1 英鎊就平均取回 85 便士。

## 2. 96% 的分子與分母是什麼

監管用語中的 **turnover** 是遊戲期間所有 stake 的總額，也包含把已得獎金再次投入的投注；**win** 則是遊戲發出的全部獎金。觀察一段期間的實際 RTP 時，基本公式是：

> 實際 RTP ＝獎金總額（win）÷ 投注總額（turnover）

因此 RTP 不是淨利率，也不是以首次入金額作固定分母。玩家投入 100 元、得到獎金後又繼續投注，後續投注仍會計入 turnover。讀取任何 RTP 數字前，都要先確認來源談的是整款遊戲的 Overall RTP，還是主遊戲、Free Spins 等個別部分的貢獻。

## 3. 理論 RTP 與實際 RTP 不一樣

| 名稱 | 它回答什麼 | 不能拿來做什麼 |
| --- | --- | --- |
| 理論 RTP | 遊戲依規則設計的長期回報比例 | 保證單一玩家的結果 |
| 實際／觀察 RTP | 某段期間的總獎金除以總投注額 | 直接取代遊戲的設計值 |
| 單次 Session 結果 | 某位玩家在有限遊戲中的實際起伏 | 推論長期 RTP 已改變 |

Gambling Commission 的監測示例顯示，有限遊戲量下，實際 RTP 可以離理論值較遠；樣本增加後，監測值才預期逐漸接近設計值。這是檢查遊戲整體表現的方法，不是承諾某位玩家只要持續遊戲，個人結果就一定會回到標示比例。

## 4. 為什麼短期結果可能差很多

RTP 只描述長期平均，沒有告訴你獎金如何分布。兩款遊戲即使同為 96% RTP，也可能一款較常出現小額獎金，另一款結果更集中在少數較大獎金。

這類起伏應另外閱讀[波動度教學](/guide/volatility-explained/)。波動度會影響有限樣本可能離平均值多遠，但它不是 RTP 的一部分，也不能用來把短期虧損直接判定為 RTP 異常。先前輸贏通常也不會讓下一次結果「補回」目標 RTP。

## 5. 同款遊戲為什麼有多個 RTP

廠商可能為同一款遊戲提供不同 RTP 配置。Hacksaw Gaming 的 Wanted Dead or a Wild 官方頁，就明確列出 96.38%、94.55%、92.33% 與 88.42%。Slotmill 官方遊戲目錄也以不同 Game ID 區分 Ragnarök Gold 與 Shadow of Dominion 的 96%／94% 配置。

這些資料能證明廠商提供多種版本，卻不能證明每個平台、國家或目前開啟的遊戲實例都同時提供全部版本。真正使用哪一個設定，仍應核對該版本的 Game Rules、Help 或 Paytable。多版本 RTP 也不表示最高倍數、波動度或其他規則必然一起改變；只有第一方文件明確說明時才能建立這種連動。

## 6. 不是每個百分比差異都是 RTP 版本

PG SOFT 的 Mahjong Ways 2019 Game Information 把 Overall RTP 96.92%、Main Game 68.89% 與 Free Spins Feature 28.03% 分開列出。後兩項是在說明整體 RTP 的組成，不是另外兩個可選版本。較新的官方 Game Information summary 則明確列出 94%、95%、96.92%、97%、98%、99% 與 100%，才是可保存的多版本清單。

來源時期不同也要分開處理。NetEnt 現行 Starburst 官方頁標示 96.08%，專案保存的歷史官方文章曾出現 96.09%。兩個時期的相近數字本身不足以證明它們是現在可選的兩個版本，因此 Slot Hub 只把現行 96.08% 作為主要 RTP，不把 96.09% 自動列成 variant。

## 7. RTP 與 House Edge 何時能對照

在同一款固定規則遊戲中，如果來源提供的是 theoretical RTP，而且 RTP 與 House Edge 採相同的投注總額與獎金基準，可以用 `100% − RTP` 理解理論上未以獎金回到玩家的比例。例如在這些前提下，96% RTP 對應 4%。

這不是無條件公式。若來源談的是實際 RTP、主遊戲或 Feature 的部分比例、需要特定策略的遊戲，或另含 commission、jackpot contribution、margin、over-round 等不同基準，就不能直接換算。不同遊戲類型或不同來源的數字，也要先確認定義相同才具有可比性。

## 8. RTP、波動度、最高倍數各看什麼

- **RTP**：大量結果下，投注總額有多少比例理論上以獎金回到玩家。
- **波動度**：結果可能較集中或較分散，短期起伏可能多大。
- **最高倍數**：在原廠標籤、投注基準與成立條件下，最高結果如何表達。
- **賠付機制**：盤面上的中獎組合如何成立。

這四項可以一起閱讀，但不能互相替代。高 RTP 不等於高命中率、低波動，也不代表較容易取得[最高倍數](/guide/slot-max-win-explained/)；盤面如何得獎則應另外參考[賠付機制教學](/guide/slot-payout-mechanisms-explained/)。

## 9. 在 Slot Hub 怎麼讀一筆 RTP

1. **先看主要 RTP**：確認百分比是否存在，不把缺值當成 0。
2. **再看所有 RTP 版本**：有清單時，確認它是官方明列的配置，而不是 Feature contribution 或歷史差異。
3. **打開來源**：優先查官方 Game Rules、Help、Paytable、產品頁或正式技術文件。
4. **看版本與核對日期**：同名遊戲可能因版本、Game ID、文件時期或市場而不同。
5. **確認正在使用的實例**：Slot Hub 的資料是來源核對結果，不代替目前平台遊戲內的規則畫面。

官方沒有公開，或來源無法確認版本時，留空比補上一個看似合理的數字更可靠。Slot Hub 不會借用同系列遊戲、一般資料庫或娛樂城頁面替缺值遊戲猜 RTP。

## 10. 四個常見誤解

- **「RTP 越高，下一次越容易贏。」** RTP 不預測下一次結果，也不等於命中率。
- **「短期輸得多，之後就會補回來。」** 長期理論比例不是個人帳戶的回收排程。
- **「同名遊戲的 RTP 一定相同。」** 廠商可能提供多種配置，實際版本需查規則。
- **「看到多個百分比，就是多 RTP 版本。」** Overall、主遊戲、Feature contribution 與歷史文件必須分開判讀。

## 官方資料來源

- [UK Gambling Commission：Return to player—how much gaming machines payout](https://www.gamblingcommission.gov.uk/public-and-players/guide/return-to-player-how-much-gaming-machines-payout)
- [UK Gambling Commission：Key terms for live RTP monitoring](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/key-terms-relating-to-live-return-to-player-performance-monitoring-of-games)
- [UK Gambling Commission：How to calculate RTP](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/how-to-calculate-return-to-player-rtp)
- [UK Gambling Commission：RTS 3 rules and likelihood information](https://www.gamblingcommission.gov.uk/guidance/regulatory-returns-guidance/rts-3-rules-game-descriptions-and-the-likelihood-of-winning)
- [PG SOFT：Mahjong Ways 2019 Game Information](https://www.pgsoft.com/uploads/GamesResource/ab4466ec-4093-4994-b68f-be7ce48f68fa.pdf)
- [PG SOFT：Mahjong Ways Game Information summary](https://www.pgsoft.com/uploads/Games/Pdf/MahjongWays_Gameinformation_EN.pdf)
- [Hacksaw Gaming：Wanted Dead or a Wild](https://www.hacksawgaming.com/games/wanted-dead-or-a-wild)
- [Slotmill：Official Game list](https://developer.slotmill.com/gamelist/)
- [NetEnt：Starburst current game page](https://netent.com/games/starburst)
- [NetEnt：Historical Starburst article](https://old.netent.com/sv/4-favorite-netent-games-played-in-japan/)
