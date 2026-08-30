import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { buildGameDetailKnowledgePresentation } from '../src/lib/game-detail-knowledge-presentation.ts';

const root = new URL('../dist/', import.meta.url);
const load = (path) => readFile(new URL(path, root), 'utf8');
const maxWinGuideSource = await readFile(new URL('../src/content/guides/slot-max-win-explained.md', import.meta.url), 'utf8');
const globalCssSource = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const maxWinGuidePublished = /^status: published$/m.test(maxWinGuideSource);
const bonusBuyGuideSource = await readFile(new URL('../src/content/guides/slot-bonus-buy-explained.md', import.meta.url), 'utf8');
const bonusBuyGuidePublished = /^status: published$/m.test(bonusBuyGuideSource);
const bonusBuyOwnerSlug = bonusBuyGuidePublished ? 'slot-bonus-buy-explained' : 'slot-terms-glossary';
const cascadingGuideSource = await readFile(new URL('../src/content/guides/slot-cascading-tumble-avalanche-explained.md', import.meta.url), 'utf8');
const cascadingGuidePublished = /^status: published$/m.test(cascadingGuideSource);
const [rtp, glossary, symbols, payout, bigBass, bonanza, reactoonz, superAce, handOfAnubis, gamesIndex, search, slots, cascadingGuide, bonusBuyGuide] = await Promise.all([
  load('guide/rtp-explained/index.html'),
  load('guide/slot-terms-glossary/index.html'),
  load('guide/slot-symbols-and-features/index.html'),
  load('guide/slot-payout-mechanisms-explained/index.html'),
  load('games/big-bass-bonanza/index.html'),
  load('games/bonanza/index.html'),
  load('games/reactoonz/index.html'),
  load('games/super-ace/index.html'),
  load('games/hand-of-anubis/index.html'),
  load('games/index.html'),
  load('search/index.html'),
  load('slots/index.html'),
  cascadingGuidePublished ? load('guide/slot-cascading-tumble-avalanche-explained/index.html') : Promise.resolve(''),
  bonusBuyGuidePublished ? load('guide/slot-bonus-buy-explained/index.html') : Promise.resolve(''),
]);

const guidesWithDerivedGames = [['RTP', rtp], ['symbols', symbols], ['payout', payout], [bonusBuyGuidePublished ? 'Bonus Buy' : 'glossary', bonusBuyGuidePublished ? bonusBuyGuide : glossary]];
for (const [name, html] of guidesWithDerivedGames) {
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
if (bonusBuyGuidePublished) {
  assert.ok(!glossary.includes('features=bonus-buy'), 'Glossary retained the Bonus Buy Explorer CTA after ownership transfer');
  assert.match(bonusBuyGuide, /href="\/games\/\?features=bonus-buy"/, 'Bonus Buy Guide exact Explorer URL missing');
  assert.match(symbols, /href="\/guide\/slot-bonus-buy-explained\/"/, 'Symbols Guide did not point to the published Bonus Buy Guide');
  assert.ok(!symbols.includes('href="/guide/slot-terms-glossary/"'), 'Symbols Guide retained the old Bonus Buy manual link');
} else {
  assert.match(glossary, /href="\/games\/\?features=bonus-buy"/, 'Bonus Buy Explorer URL missing from the current glossary owner');
  assert.match(symbols, /href="\/guide\/slot-terms-glossary\/"/, 'Symbols Guide lost the current published Bonus Buy destination');
  assert.ok(!search.includes('slot-bonus-buy-explained'), 'Draft Bonus Buy Guide entered Search');
  assert.ok(!slots.includes('/guide/slot-bonus-buy-explained/'), 'Draft Bonus Buy Guide entered the Slots Knowledge Map');
}
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

assert.match(bigBass, /看懂遊戲功能/, 'Game detail Feature Guide rail missing');
assert.ok(!bigBass.includes('Slot 常用術語快速查詢'), 'Big Bass inherited the glossary after Mechanism ownership transfer');
assert.match(bigBass, /data-guide-slug="slot-payout-mechanisms-explained"/, 'Big Bass did not inherit the published payout Guide');
const bonanzaRail = bonanza.match(/<section class="game-guide-rail"[\s\S]*?<\/section>/)?.[0] ?? '';
assert.ok(bonanzaRail, 'Bonanza Guide rail missing');
assert.match(bonanza, /data-guide-slug="slot-payout-mechanisms-explained"/, 'Megaways did not resolve to the published payout Guide');
if (maxWinGuidePublished) assert.match(bonanza, /data-guide-slug="slot-max-win-explained"/, 'Published Max Win Guide did not enter the Game detail presentation');
else assert.ok(!bonanza.includes('data-guide-slug="slot-max-win-explained"'), 'Draft Max Win Guide entered the Game detail presentation');
const reactoonzRail = reactoonz.match(/<section class="game-guide-rail"[\s\S]*?<\/section>/)?.[0] ?? '';
if (cascadingGuidePublished) assert.match(reactoonzRail, /老虎機連鎖消除怎麼看/, 'Reactoonz did not show the Cascading Guide within its first three Guide matches');
else assert.ok(!reactoonzRail.includes('老虎機連鎖消除怎麼看'), 'Draft Cascading Guide entered the Reactoonz detail rail');
const superAceRail = superAce.match(/<section class="game-guide-rail"[\s\S]*?<\/section>/)?.[0] ?? '';
assert.ok(!superAceRail.includes('老虎機連鎖消除怎麼看'), 'Super Ace inherited a Cascading Guide relation without the cascading Feature');
const handOfAnubisRail = handOfAnubis.match(/<section class="game-guide-rail"[\s\S]*?<\/section>/)?.[0] ?? '';
assert.ok(!handOfAnubisRail.includes('slot-symbols-and-features'), 'Hand of Anubis retained an unsupported Symbols Guide relation');
assert.match(handOfAnubisRail, /slot-cascading-tumble-avalanche-explained/, 'Hand of Anubis lost its verified Cascading Guide relation');

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
assert.match(search, new RegExp(`learn-feature-bonus-buy-${bonusBuyOwnerSlug}`), 'Search Bonus Buy learn intent owner is incorrect');
assert.match(search, new RegExp(`explore-feature-bonus-buy-${bonusBuyOwnerSlug}`), 'Search Bonus Buy explore intent owner is incorrect');
assert.match(search, /\/games\/\?features=bonus-buy/, 'Search Bonus Buy Explorer URL must use the exact Feature filter');
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
  const bonusBuyPosition = knowledgeGrid.indexOf(`/guide/${bonusBuyOwnerSlug}/`);
  assert.ok(cascadingPosition >= 0, 'Slots Knowledge Map Cascading card did not transfer to the new Guide');
  assert.ok(bonusBuyPosition > cascadingPosition, 'Slots Knowledge Map Cascading card position changed relative to Bonus Buy');
}

for (const [name, html] of [['game', bigBass], ['guide', rtp], ['explorer', gamesIndex], ['search', search], ['slots', slots]]) {
  assert.match(html, /content="noindex,nofollow"/, `${name}: Preview noindex missing`);
  assert.ok(!html.includes('rel="canonical"'), `${name}: Preview canonical must remain absent`);
}

const gameDirectories = (await readdir(new URL('games/', root), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
assert.equal(gameDirectories.length, 30, 'Game detail knowledge presentation must cover all 30 published Games');

const renderedKnowledge = [];
for (const slug of gameDirectories) {
  const html = await load(`games/${slug}/index.html`);
  const items = [...html.matchAll(/<a[^>]*data-guide-slug="([^"]+)"[^>]*data-guide-placement="([^"]+)"/g)]
    .map((match) => ({ guideSlug: match[1], placement: match[2] }));
  assert.equal(new Set(items.map((item) => item.guideSlug)).size, items.length, `${slug}: a Guide was rendered more than once`);
  renderedKnowledge.push(...items.map((item) => ({ gameSlug: slug, ...item })));
}

const directItems = renderedKnowledge.filter((item) => item.placement !== 'feature-overflow');
const overflowItems = renderedKnowledge.filter((item) => item.placement === 'feature-overflow');
assert.equal(renderedKnowledge.length, 166, 'Expected all 166 unique Game → Guide relationships to remain visible');
assert.equal(directItems.length, 162, 'Expected 162 relationships without expansion');
assert.equal(overflowItems.length, 4, 'Expected four relationships in the overflow area');

const countPlacement = (placement) => renderedKnowledge.filter((item) => item.placement === placement).length;
const countGuide = (guideSlug) => renderedKnowledge.filter((item) => item.guideSlug === guideSlug).length;
assert.equal(countPlacement('core-mechanism'), 27, 'Mechanism contextual Guide count changed');
assert.equal(countPlacement('core-rtp'), 17, 'RTP contextual Guide count changed');
assert.equal(countPlacement('core-volatility') + countPlacement('full-volatility'), 20, 'Volatility contextual Guide count changed');
assert.equal(countPlacement('core-max-win'), 25, 'Max Win contextual Guide count changed');
assert.equal(countGuide('slot-multiplier-explained'), 25, 'Multiplier Feature Guide count changed');
assert.equal(countGuide('slot-cascading-tumble-avalanche-explained'), 12, 'Cascading Feature Guide count changed');
assert.equal(countGuide(bonusBuyOwnerSlug), 12, 'Bonus Buy Feature Guide count changed');
assert.equal(countGuide(bonusBuyGuidePublished ? 'slot-terms-glossary' : 'slot-bonus-buy-explained'), 0, 'Inactive Bonus Buy owner appeared in Game detail');
assert.equal(countGuide('slot-symbols-and-features'), 28, 'Symbols Feature Guide count changed');
assert.ok(!renderedKnowledge.some((item) => item.gameSlug === 'super-ace' && item.guideSlug === 'slot-cascading-tumble-avalanche-explained'), 'Super Ace regained an invalid Cascading relationship');

for (const slug of ['bonanza', 'gates-of-olympus-1000', 'storm-of-seth-2-awakening', 'sun-wu-kong']) {
  const pageItems = overflowItems.filter((item) => item.gameSlug === slug);
  assert.equal(pageItems.length, 1, `${slug}: expected one current overflow Guide`);
  const html = await load(`games/${slug}/index.html`);
  assert.match(html, /<details class="game-guide-overflow"><summary>查看更多相關教學（1）<\/summary>/, `${slug}: dynamic overflow summary missing`);
}
for (const slug of gameDirectories.filter((gameSlug) => !overflowItems.some((item) => item.gameSlug === gameSlug))) {
  const html = await load(`games/${slug}/index.html`);
  assert.ok(!html.includes('game-guide-overflow'), `${slug}: rendered an empty overflow disclosure`);
}

const fakeMatch = (number, type = 'feature', value = `feature-${number}`) => ({
  guide: { slug: `guide-${number}`, title: `Guide ${number}`, description: '', url: `/guide/guide-${number}/`, status: 'published' },
  priority: number,
  reasons: [{ type, value }],
});
const emptyFacts = { hasPrimaryRtp: false, hasRtpVariants: false, hasNormalizedVolatility: false, hasOriginalVolatility: false, hasMaxWin: false };
for (const count of [0, 1, 2, 3, 4, 6]) {
  const presentation = buildGameDetailKnowledgePresentation(Array.from({ length: count }, (_, index) => fakeMatch(index)), emptyFacts);
  assert.equal(presentation.featureGuides.direct.length, Math.min(count, 3), `${count}-Guide fixture direct count is not generic`);
  assert.equal(presentation.featureGuides.overflow.length, Math.max(0, count - 3), `${count}-Guide fixture overflow count is not generic`);
}
const rtpMatch = {
  guide: { slug: 'rtp-guide', title: 'RTP Guide', description: '', url: '/guide/rtp-guide/', status: 'published' },
  priority: 1,
  reasons: [{ type: 'data-topic', value: 'rtp' }, { type: 'data-topic', value: 'rtp-variants' }],
};
const primaryRtpPresentation = buildGameDetailKnowledgePresentation([rtpMatch], { ...emptyFacts, hasPrimaryRtp: true, hasRtpVariants: true });
assert.equal(primaryRtpPresentation.fieldGuides['core-rtp']?.length, 1, 'Primary RTP and variants did not share one canonical CTA');
assert.equal(primaryRtpPresentation.fieldGuides['full-rtp-variants'], undefined, 'RTP variants duplicated the primary RTP CTA');
const variantsOnlyPresentation = buildGameDetailKnowledgePresentation([rtpMatch], { ...emptyFacts, hasRtpVariants: true });
assert.equal(variantsOnlyPresentation.fieldGuides['full-rtp-variants']?.length, 1, 'RTP-variants-only fixture did not use the full-data placement');

const mergedFeatureMatch = {
  guide: { slug: 'feature-guide', title: 'Feature Guide', description: '', url: '/guide/feature-guide/', status: 'published' },
  priority: 1,
  reasons: [{ type: 'feature', value: 'wild' }, { type: 'feature', value: 'scatter' }],
};
const mergedFeaturePresentation = buildGameDetailKnowledgePresentation([mergedFeatureMatch, mergedFeatureMatch], emptyFacts);
assert.equal(mergedFeaturePresentation.allGuideSlugs.length, 1, 'Merged Feature reasons rendered the same Guide twice');
assert.deepEqual(mergedFeaturePresentation.featureGuides.direct[0].displayReasons, mergedFeatureMatch.reasons, 'Feature reasons were not preserved from the resolver match');
assert.match(globalCssSource, /\.game-field-guide-link\{[^}]*min-height:44px/, 'Contextual Guide links must keep a 44px touch target');
assert.match(globalCssSource, /\.game-guide-overflow summary\{[^}]*min-height:44px/, 'Overflow summary must keep a 44px touch target');
assert.match(globalCssSource, /game-guide-overflow summary:focus-visible/, 'Overflow summary focus style missing');

console.log('Guide relationship UI, 166-entry Game detail presentation, generic overflow, independent Explorer URLs, Search intents and Preview safeguards verified.');
