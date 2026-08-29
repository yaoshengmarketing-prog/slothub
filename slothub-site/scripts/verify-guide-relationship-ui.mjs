import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const load = (path) => readFile(new URL(path, root), 'utf8');
const maxWinGuideSource = await readFile(new URL('../src/content/guides/slot-max-win-explained.md', import.meta.url), 'utf8');
const maxWinGuidePublished = /^status: published$/m.test(maxWinGuideSource);
const [rtp, glossary, symbols, payout, bigBass, bonanza, gamesIndex, search, slots] = await Promise.all([
  load('guide/rtp-explained/index.html'),
  load('guide/slot-terms-glossary/index.html'),
  load('guide/slot-symbols-and-features/index.html'),
  load('guide/slot-payout-mechanisms-explained/index.html'),
  load('games/big-bass-bonanza/index.html'),
  load('games/bonanza/index.html'),
  load('games/index.html'),
  load('search/index.html'),
  load('slots/index.html'),
]);

for (const [name, html] of [['RTP', rtp], ['glossary', glossary], ['symbols', symbols], ['payout', payout]]) {
  assert.match(html, /guide-related-games/, `${name}: related Game section missing`);
  const grid = html.match(/<div class="guide-game-grid">([\s\S]*?)<\/div>\s*<div class="guide-concept-links"/)?.[1] ?? '';
  const cards = grid.match(/href="\/games\/[^?][^"]*\/"/g)?.length ?? 0;
  assert.ok(cards >= 3 && cards <= 6, `${name}: expected 3–6 representative Games, received ${cards}`);
}
assert.ok(!rtp.includes('/games/?q=RTP'), 'RTP received an imprecise text-search Explorer URL');
assert.ok(!rtp.includes('/games/?q=%E5%A4%9A%E7%89%88%E6%9C%AC'), 'RTP variants received an imprecise text-search Explorer URL');
assert.match(rtp, /<div class="guide-concept-links"[^>]*><\/div>/, 'Data Topic Guide concept container must stay empty without a precise Explorer URL');
assert.ok(!glossary.includes('mechanism=paylines'), 'Glossary retained Paylines ownership');
assert.ok(!glossary.includes('mechanism=ways-to-win'), 'Glossary retained Ways ownership');
assert.match(glossary, /href="\/games\/\?features=cascading"/, 'Cascading Explorer URL missing');
assert.match(glossary, /href="\/games\/\?features=bonus-buy"/, 'Bonus Buy Explorer URL missing');
assert.ok(!glossary.includes('mechanism=paylines&amp;'), 'Guide concepts were incorrectly combined as AND');

assert.match(bigBass, /看懂這些資料/, 'Game detail Guide rail missing');
assert.ok(!bigBass.includes('Slot 常用術語快速查詢'), 'Big Bass inherited the glossary after Mechanism ownership transfer');
assert.match(bigBass, /老虎機賠付機制怎麼看/, 'Big Bass did not inherit the published payout Guide');
const bonanzaRail = bonanza.match(/<section class="game-guide-rail"[\s\S]*?<\/section>/)?.[0] ?? '';
assert.ok(bonanzaRail, 'Bonanza Guide rail missing');
assert.match(bonanzaRail, /老虎機賠付機制怎麼看/, 'Megaways did not resolve to the published payout Guide');
if (maxWinGuidePublished) assert.match(bonanzaRail, /老虎機最高倍數怎麼看/, 'Published Max Win Guide did not enter the Game detail rail');
else assert.ok(!bonanzaRail.includes('老虎機最高倍數怎麼看'), 'Draft Max Win Guide entered the Game detail rail');

assert.match(gamesIndex, /relationshipLinks/, 'Explorer did not receive relationship links');
assert.match(search, /了解概念/, 'Search learn intent missing');
assert.match(search, /探索遊戲/, 'Search explore intent missing');
for (const mechanism of ['paylines', 'ways-to-win', 'megaways', 'cluster-pays', 'pay-anywhere']) {
  assert.match(search, new RegExp(`learn-mechanism-${mechanism}-slot-payout-mechanisms-explained`), `${mechanism}: published payout Guide Search intent missing`);
}
assert.match(search, /learn-feature-cascading-slot-terms-glossary/, 'Search Cascading learn intent missing');
assert.match(search, /explore-feature-cascading-slot-terms-glossary/, 'Search Cascading explore intent missing');
assert.match(search, /learn-data-topic-rtp-rtp-explained/, 'Search RTP learn intent missing');
assert.match(search, /learn-data-topic-rtp-variants-rtp-explained/, 'Search RTP variants learn intent missing');
assert.match(search, /learn-data-topic-volatility-volatility-explained/, 'Search volatility learn intent missing');
for (const dataTopic of ['rtp', 'rtp-variants', 'volatility', 'max-win']) {
  assert.ok(!search.includes(`explore-data-topic-${dataTopic}-`), `${dataTopic}: Search rendered an imprecise Data Topic explore intent`);
}
assert.match(search, /連鎖掉落/, 'Search Cascading Chinese alias missing');
assert.match(search, /learn-feature-multiplier-slot-multiplier-explained/, 'Search Multiplier learn intent missing');
assert.match(search, /explore-feature-multiplier-slot-multiplier-explained/, 'Search Multiplier explore intent missing');
assert.match(search, /\/games\/\?features=multiplier/, 'Search Multiplier Explorer URL must use the exact Feature filter');
if (maxWinGuidePublished) {
  assert.match(search, /learn-data-topic-max-win-slot-max-win-explained/, 'Published Max Win Guide Search learn intent missing');
  assert.ok(!search.includes('explore-data-topic-max-win-'), 'Max Win rendered an imprecise Search explore intent');
  const maxWinGuide = await load('guide/slot-max-win-explained/index.html');
  assert.match(maxWinGuide, /guide-related-games/, 'Max Win Guide representative Game section missing');
  assert.match(maxWinGuide, /<div class="guide-concept-links"[^>]*><\/div>/, 'Max Win Guide rendered a false Explorer CTA');
  assert.ok(!maxWinGuide.includes('/games/?q='), 'Max Win Guide contains a text-search Explorer URL');
} else assert.ok(!search.includes('learn-data-topic-max-win'), 'Draft max-win Guide entered Search');

assert.match(slots, /relationship-knowledge-grid/, 'Slots Knowledge Map did not use the relationship presentation');
assert.match(slots, /了解概念 →/, 'Slots Guide action missing');
assert.match(slots, /探索遊戲 →/, 'Slots Explorer action missing');

for (const [name, html] of [['game', bigBass], ['guide', rtp], ['explorer', gamesIndex], ['search', search], ['slots', slots]]) {
  assert.match(html, /content="noindex,nofollow"/, `${name}: Preview noindex missing`);
  assert.ok(!html.includes('rel="canonical"'), `${name}: Preview canonical must remain absent`);
}

console.log('Guide relationship UI, independent Explorer URLs, Search intents, Deferred gaps and Preview safeguards verified.');
