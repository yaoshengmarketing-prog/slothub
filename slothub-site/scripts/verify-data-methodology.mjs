import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';

const slug = 'slot-hub-data-methodology';
const source = await readFile(new URL(`../src/content/guides/${slug}.md`, import.meta.url), 'utf8');
const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
assert.ok(frontmatter, 'data methodology Guide frontmatter missing');
const data = parse(frontmatter);

assert.equal(data.category, 'data');
assert.equal(data.level, 'beginner');
for (const field of ['relatedMechanisms', 'relatedFeatures', 'relatedDataTopics']) {
  assert.equal(data[field], undefined, `${field} must remain absent`);
}
for (const term of ['原廠資料', 'Slot Hub 統一顯示', '缺值不是否定答案', '核對日期不等於原廠發布日期', '並排顯示不等於所有數字都能排名']) {
  assert.match(source, new RegExp(term));
}

const readDist = (path) => readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8');
const routeUrl = new URL(`../dist/guide/${slug}/index.html`, import.meta.url);
const routeExists = existsSync(routeUrl);
const [home, guideIndex, search, compare, game] = await Promise.all([
  readDist('index.html'), readDist('guide/index.html'), readDist('search/index.html'),
  readDist('compare/index.html'), readDist('games/mahjong-ways/index.html'),
]);
const publicPages = [home, guideIndex, search, compare, game];

if (data.status === 'published') {
  assert.equal(routeExists, true, 'published methodology Guide route missing');
  const guide = await readDist(`guide/${slug}/index.html`);
  for (const text of ['來源有優先順序', '缺值不是否定答案', '核對日期不等於原廠發布日期', 'Provider 統計只代表目前收錄樣本']) {
    assert.ok(guide.includes(text), `published Guide missing: ${text}`);
  }
  assert.match(guideIndex, new RegExp(`/guide/${slug}/`));
  assert.match(search, new RegExp(slug));
  assert.match(home, /data-methodology-entry="footer"/);
  assert.match(game, /data-methodology-entry="game-detail"/);
  assert.match(compare, /data-methodology-entry="compare"/);
} else {
  assert.equal(data.status, 'draft');
  assert.equal(routeExists, false, 'draft methodology Guide route must not exist');
  for (const html of publicPages) assert.doesNotMatch(html, new RegExp(slug));
}

console.log(`PASS: data methodology Guide ${data.status} isolation, metadata, content and entry contracts verified.`);
