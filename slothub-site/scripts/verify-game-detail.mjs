import { readFile } from 'node:fs/promises';

const root = new URL('../dist/games/', import.meta.url);
const failures = [];
const load = (slug) => readFile(new URL(`${slug}/index.html`, root), 'utf8');
const requireText = (html, expected, page) => {
  for (const text of expected) if (!html.includes(text)) failures.push(`${page}: missing ${text}`);
};

const [seth, seth2, chaos, sparse] = await Promise.all([
  load('storm-of-seth'), load('storm-of-seth-2-awakening'), load('chaos-crew'), load('fortune-paw'),
]);
const representativeSlugs = [
  'mahjong-ways', 'reactoonz', 'sweet-bonanza', 'big-bass-bonanza', 'super-ace',
  'bonanza', 'gates-of-olympus-1000', 'storm-of-seth-2-awakening', 'sun-wu-kong', 'legacy-of-dead',
];
const representativePages = Object.fromEntries(await Promise.all(representativeSlugs.map(async (slug) => [slug, await load(slug)])));

requireText(seth, ['戰神賽特', 'Storm of Seth', '第 1 代', '51,000×', '原廠標示：Max Win'], 'Storm of Seth');
requireText(seth2, ['戰神賽特2－覺醒之力', 'Storm of Seth 2: Awakening', '第 2 代', '81,000×', '原廠標示：Winning ratio', 'href="/games/storm-of-seth/"', '多路贏法'], 'Storm of Seth 2');
requireText(chaos, ['主要 RTP', '多版本', '96.3%、92.4%、88.4%'], 'Chaos Crew');
requireText(sparse, ['Fortune Paw', '最高倍數', '盤面', '發行日期'], 'Fortune Paw');
if (seth2.includes('賠線／Ways 數量')) failures.push('Storm of Seth 2: mechanism text must not render as win count');

for (const [page, html] of [['Storm of Seth', seth], ['Storm of Seth 2', seth2], ['Chaos Crew', chaos], ['Fortune Paw', sparse]]) {
  requireText(html, ['"@type":"VideoGame"', 'content="noindex,nofollow"', '加入比較'], page);
  if (html.includes('rel="canonical"')) failures.push(`${page}: Preview must omit canonical`);
  if (html.includes('>待補<') || html.includes('>尚無資料<')) failures.push(`${page}: placeholder value was rendered`);
}

for (const [slug, html] of Object.entries(representativePages)) {
  const guideSlugs = [...html.matchAll(/data-guide-slug="([^"]+)"/g)].map((match) => match[1]);
  if (new Set(guideSlugs).size !== guideSlugs.length) failures.push(`${slug}: duplicate Guide rendered on one page`);
}
requireText(representativePages['mahjong-ways'], ['data-guide-placement="core-mechanism"', 'data-guide-placement="core-rtp"', 'data-guide-placement="core-volatility"', 'data-guide-placement="core-max-win"'], 'Mahjong Ways knowledge fields');
if ((representativePages['mahjong-ways'].match(/data-guide-slug="rtp-explained"/g) ?? []).length !== 1) failures.push('Mahjong Ways: RTP Guide must appear once despite RTP variants');
requireText(representativePages.reactoonz, ['data-guide-slug="slot-payout-mechanisms-explained"', 'data-guide-slug="slot-cascading-tumble-avalanche-explained"'], 'Reactoonz knowledge links');
requireText(representativePages['sweet-bonanza'], ['data-guide-placement="core-mechanism"', 'data-guide-slug="slot-multiplier-explained"'], 'Sweet Bonanza knowledge links');
for (const placement of ['core-volatility', 'core-max-win']) if (representativePages['big-bass-bonanza'].includes(`data-guide-placement="${placement}"`)) failures.push(`Big Bass Bonanza: missing field rendered ${placement} Guide CTA`);
if (representativePages['super-ace'].includes('data-guide-slug="slot-cascading-tumble-avalanche-explained"')) failures.push('Super Ace: invalid Cascading Guide relation rendered');
for (const slug of ['bonanza', 'gates-of-olympus-1000', 'storm-of-seth-2-awakening', 'sun-wu-kong']) requireText(representativePages[slug], ['<details class="game-guide-overflow">', '查看更多相關教學（1）'], `${slug} overflow`);
if (representativePages['legacy-of-dead'].includes('data-guide-placement="core-max-win"')) failures.push('Legacy of Dead: missing Max Win rendered a Guide CTA');

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join('\n'));
  process.exit(1);
}

console.log('PASS: 14 game detail fixtures, contextual knowledge placement, overflow, bilingual identity, sparse data, Schema and Preview safeguards verified.');
