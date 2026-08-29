import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const load = (path) => readFile(new URL(path, root), 'utf8');
const maxWinGuideSource = await readFile(new URL('../src/content/guides/slot-max-win-explained.md', import.meta.url), 'utf8');
const maxWinGuidePublished = /^status: published$/m.test(maxWinGuideSource);
const cascadingGuideSource = await readFile(new URL('../src/content/guides/slot-cascading-tumble-avalanche-explained.md', import.meta.url), 'utf8');
const cascadingGuidePublished = /^status: published$/m.test(cascadingGuideSource);
const [rtp, glossary, symbols, payout, bigBass, bonanza, reactoonz, superAce, gamesIndex, search, slots, cascadingGuide] = await Promise.all([
  load('guide/rtp-explained/index.html'),
  load('guide/slot-terms-glossary/index.html'),
  load('guide/slot-symbols-and-features/index.html'),
  load('guide/slot-payout-mechanisms-explained/index.html'),
  load('games/big-bass-bonanza/index.html'),
  load('games/bonanza/index.html'),
  load('games/reactoonz/index.html'),
  load('games/super-ace/index.html'),
  load('games/index.html'),
  load('search/index.html'),
  load('slots/index.html'),
  cascadingGuidePublished ? load('guide/slot-cascading-tumble-avalanche-explained/index.html') : Promise.resolve(''),
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
assert.ok(!glossary.includes('features=cascading'), 'Glossary retained Cascading ownership');
assert.match(glossary, /href="\/games\/\?features=bonus-buy"/, 'Bonus Buy Explorer URL missing');
assert.ok(!glossary.includes('mechanism=paylines&amp;'), 'Guide concepts were incorrectly combined as AND');

if (cascadingGuidePublished) {
  assert.match(cascadingGuide, /guide-related-games/, 'Cascading Guide representative Game section missing');
  const cascadingGrid = cascadingGuide.match(/<div class="guide-game-grid">([\s\S]*?)<\/div>\s*<div class="guide-concept-links"/)?.[1] ?? '';
  const cascadingCards = cascadingGrid.match(/href="\/games\/[^?][^"]*\/"/g)?.length ?? 0;
  assert.ok(cascadingCards >= 3 && cascadingCards <= 6, `Cascading Guide: expected 3–6 representative Games, received ${cascadingCards}`);
  assert.match(cascadingGuide, /href="\/games\/\?features=cascading"/, 'Cascading Guide exact Explorer URL missing');
} else {
  assert.ok(!search.includes('slot-cascading-tumble-avalanche-explained'), 'Draft Cascading Guide entered Search');
  assert.ok(!slots.includes('/guide/slot-cascading-tumble-avalanche-explained/'), 'Draft Cascading Guide entered the Slots Knowledge Map');
}

assert.match(bigBass, /看懂這些資料/, 'Game detail Guide rail missing');
assert.ok(!bigBass.includes('Slot 常用術語快速查詢'), 'Big Bass inherited the glossary after Mechanism ownership transfer');
assert.match(bigBass, /老虎機賠付機制怎麼看/, 'Big Bass did not inherit the published payout Guide');
const bonanzaRail = bonanza.match(/<section class="game-guide-rail"[\s\S]*?<\/section>/)?.[0] ?? '';
assert.ok(bonanzaRail, 'Bonanza Guide rail missing');
assert.match(bonanzaRail, /老虎機賠付機制怎麼看/, 'Megaways did not resolve to the published payout Guide');
if (maxWinGuidePublished) assert.match(bonanzaRail, /老虎機最高倍數怎麼看/, 'Published Max Win Guide did not enter the Game detail rail');
else assert.ok(!bonanzaRail.includes('老虎機最高倍數怎麼看'), 'Draft Max Win Guide entered the Game detail rail');
const reactoonzRail = reactoonz.match(/<section class="game-guide-rail"[\s\S]*?<\/section>/)?.[0] ?? '';
if (cascadingGuidePublished) assert.match(reactoonzRail, /老虎機連鎖消除怎麼看/, 'Reactoonz did not show the Cascading Guide within its first three Guide matches');
else assert.ok(!reactoonzRail.includes('老虎機連鎖消除怎麼看'), 'Draft Cascading Guide entered the Reactoonz detail rail');
const superAceRail = superAce.match(/<section class="game-guide-rail"[\s\S]*?<\/section>/)?.[0] ?? '';
assert.ok(!superAceRail.includes('老虎機連鎖消除怎麼看'), 'Super Ace inherited a Cascading Guide relation without the cascading Feature');

assert.match(gamesIndex, /relationshipLinks/, 'Explorer did not receive relationship links');
assert.match(search, /了解概念/, 'Search learn intent missing');
assert.match(search, /探索遊戲/, 'Search explore intent missing');
for (const mechanism of ['paylines', 'ways-to-win', 'megaways', 'cluster-pays', 'pay-anywhere']) {
  assert.match(search, new RegExp(`learn-mechanism-${mechanism}-slot-payout-mechanisms-explained`), `${mechanism}: published payout Guide Search intent missing`);
}
if (cascadingGuidePublished) {
  assert.match(search, /learn-feature-cascading-slot-cascading-tumble-avalanche-explained/, 'Search Cascading learn intent did not transfer to the new Guide');
  assert.match(search, /explore-feature-cascading-slot-cascading-tumble-avalanche-explained/, 'Search Cascading explore intent did not transfer to the new Guide');
  assert.match(search, /\/games\/\?features=cascading/, 'Search Cascading Explorer URL must use the exact Feature filter');
  for (const term of ['Cascading', 'Avalanche', 'Tumble', '連鎖消除', '連鎖掉落']) assert.match(search, new RegExp(term), `Search Cascading alias missing: ${term}`);
} else {
  assert.ok(!search.includes('learn-feature-cascading-'), 'Cascading learn intent must stay isolated while the new Guide is draft');
  assert.ok(!search.includes('explore-feature-cascading-'), 'Cascading explore intent must stay isolated while the new Guide is draft');
}
assert.match(search, /learn-data-topic-rtp-rtp-explained/, 'Search RTP learn intent missing');
assert.match(search, /learn-data-topic-rtp-variants-rtp-explained/, 'Search RTP variants learn intent missing');
assert.match(search, /learn-data-topic-volatility-volatility-explained/, 'Search volatility learn intent missing');
for (const dataTopic of ['rtp', 'rtp-variants', 'volatility', 'max-win']) {
  assert.ok(!search.includes(`explore-data-topic-${dataTopic}-`), `${dataTopic}: Search rendered an imprecise Data Topic explore intent`);
}
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
if (cascadingGuidePublished) {
  const knowledgeGrid = slots.match(/<div class="relationship-knowledge-grid">([\s\S]*?)<\/div>\s*<\/section>/)?.[1] ?? slots;
  const cascadingPosition = knowledgeGrid.indexOf('/guide/slot-cascading-tumble-avalanche-explained/');
  const bonusBuyPosition = knowledgeGrid.indexOf('/guide/slot-terms-glossary/');
  assert.ok(cascadingPosition >= 0, 'Slots Knowledge Map Cascading card did not transfer to the new Guide');
  assert.ok(bonusBuyPosition > cascadingPosition, 'Slots Knowledge Map Cascading card position changed relative to Bonus Buy');
}

for (const [name, html] of [['game', bigBass], ['guide', rtp], ['explorer', gamesIndex], ['search', search], ['slots', slots]]) {
  assert.match(html, /content="noindex,nofollow"/, `${name}: Preview noindex missing`);
  assert.ok(!html.includes('rel="canonical"'), `${name}: Preview canonical must remain absent`);
}

console.log('Guide relationship UI, independent Explorer URLs, Search intents, Deferred gaps and Preview safeguards verified.');
