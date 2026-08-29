import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const load = (path) => readFile(new URL(path, root), 'utf8');
const [rtp, glossary, symbols, bigBass, bonanza, gamesIndex, search, slots] = await Promise.all([
  load('guide/rtp-explained/index.html'),
  load('guide/slot-terms-glossary/index.html'),
  load('guide/slot-symbols-and-features/index.html'),
  load('games/big-bass-bonanza/index.html'),
  load('games/bonanza/index.html'),
  load('games/index.html'),
  load('search/index.html'),
  load('slots/index.html'),
]);

for (const [name, html] of [['RTP', rtp], ['glossary', glossary], ['symbols', symbols]]) {
  assert.match(html, /guide-related-games/, `${name}: related Game section missing`);
  const grid = html.match(/<div class="guide-game-grid">([\s\S]*?)<\/div>\s*<div class="guide-concept-links"/)?.[1] ?? '';
  const cards = grid.match(/href="\/games\/[^?][^"]*\/"/g)?.length ?? 0;
  assert.ok(cards >= 3 && cards <= 6, `${name}: expected 3–6 representative Games, received ${cards}`);
}
assert.match(rtp, /href="\/games\/\?q=RTP"/, 'RTP Explorer URL must use the existing serializer');
assert.match(rtp, /href="\/games\/\?q=%E5%A4%9A%E7%89%88%E6%9C%AC\+RTP"/, 'RTP variants Explorer URL must be independently serialized');
assert.match(glossary, /href="\/games\/\?mechanism=paylines"/, 'Paylines Explorer URL missing');
assert.match(glossary, /href="\/games\/\?mechanism=ways-to-win"/, 'Ways Explorer URL missing');
assert.match(glossary, /href="\/games\/\?features=cascading"/, 'Cascading Explorer URL missing');
assert.match(glossary, /href="\/games\/\?features=bonus-buy"/, 'Bonus Buy Explorer URL missing');
assert.ok(!glossary.includes('mechanism=paylines&amp;'), 'Guide concepts were incorrectly combined as AND');

assert.match(bigBass, /看懂這些資料/, 'Game detail Guide rail missing');
assert.match(bigBass, /Slot 常用術語快速查詢/, 'Mechanism Guide must have highest priority on Game detail');
const bonanzaRail = bonanza.match(/<section class="game-guide-rail"[\s\S]*?<\/section>/)?.[0] ?? '';
assert.ok(bonanzaRail, 'Bonanza Guide rail missing');
assert.ok(!bonanzaRail.includes('Megaways'), 'Deferred Megaways concept received a fallback Guide');
assert.ok(!bonanzaRail.includes('最高倍數'), 'Deferred max-win topic received a fallback Guide');

assert.match(gamesIndex, /relationshipLinks/, 'Explorer did not receive relationship links');
assert.match(search, /了解概念/, 'Search learn intent missing');
assert.match(search, /探索遊戲/, 'Search explore intent missing');
assert.match(search, /learn-mechanism-paylines/, 'Search Paylines learn intent missing');
assert.ok(!search.includes('learn-mechanism-pay-anywhere'), 'Deferred Pay Anywhere received a Search Guide intent');
assert.ok(!search.includes('learn-feature-multiplier'), 'Deferred Multiplier received a Search Guide intent');
assert.ok(!search.includes('learn-data-topic-max-win'), 'Deferred max-win received a Search Guide intent');

assert.match(slots, /relationship-knowledge-grid/, 'Slots Knowledge Map did not use the relationship presentation');
assert.match(slots, /了解概念 →/, 'Slots Guide action missing');
assert.match(slots, /探索遊戲 →/, 'Slots Explorer action missing');

for (const [name, html] of [['game', bigBass], ['guide', rtp], ['explorer', gamesIndex], ['search', search], ['slots', slots]]) {
  assert.match(html, /content="noindex,nofollow"/, `${name}: Preview noindex missing`);
  assert.ok(!html.includes('rel="canonical"'), `${name}: Preview canonical must remain absent`);
}

console.log('Guide relationship UI, independent Explorer URLs, Search intents, Deferred gaps and Preview safeguards verified.');
