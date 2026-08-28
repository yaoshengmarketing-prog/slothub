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

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join('\n'));
  process.exit(1);
}

console.log('PASS: 4 game detail fixtures, bilingual identity, multi-RTP, sparse data, relations, Schema and Preview safeguards verified.');
