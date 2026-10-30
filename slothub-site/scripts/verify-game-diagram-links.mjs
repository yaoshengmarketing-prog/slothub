import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { getGameDiagramLinks } from '../src/lib/game-diagram-links.mjs';

const payout = 'payout-mechanism-demo';
const cascade = 'cascading-demo';
const base = { status: 'published', primaryType: 'slots', features: [] };
const fixtures = [
  ['paylines', { winMechanism: 'paylines' }, [payout]],
  ['ways', { winMechanism: 'ways-to-win' }, [payout]],
  ['both', { winMechanism: 'paylines', features: ['cascading'] }, [payout, cascade]],
  ['ways and cascading', { winMechanism: 'ways-to-win', features: ['cascading'] }, [payout, cascade]],
  ['unknown', {}, []],
  ['non-slots', { primaryType: 'table-games', winMechanism: 'paylines', features: ['cascading'] }, []],
  ['draft', { status: 'draft', winMechanism: 'paylines', features: ['cascading'] }, []],
  ['missing status', { status: undefined, winMechanism: 'paylines' }, []],
  ['missing primary type', { primaryType: undefined, winMechanism: 'paylines' }, []],
  ['Megaways with cascading', { winMechanism: 'megaways', features: ['cascading'] }, [cascade]],
  ['Cluster Pays with cascading', { winMechanism: 'cluster-pays', features: ['cascading'] }, [cascade]],
  ['Pay Anywhere with cascading', { winMechanism: 'pay-anywhere', features: ['cascading'] }, [cascade]],
  ['unsupported mechanism', { winMechanism: 'megaways' }, []],
  ['Cluster Pays without cascading', { winMechanism: 'cluster-pays' }, []],
  ['Pay Anywhere without cascading', { winMechanism: 'pay-anywhere' }, []],
  ['similar name is not a match', { winMechanism: 'ways', features: ['Cascading', 'cascading-bonus'] }, []],
  ['free text, numbers and grid are not evidence', { name: '243 Ways Cascading', winCount: 243, reels: '5x3', bonusFeatures: ['Cascading', 'Ways to win'] }, []],
  ['feature must be structured', { features: 'cascading' }, []],
  ['duplicate features', { features: ['cascading', 'cascading'] }, [cascade]],
];
for (const [name, changes, expected] of fixtures) {
  assert.deepEqual(getGameDiagramLinks({ ...base, ...changes }).map((link) => link.anchor), expected, name);
}
assert.deepEqual(getGameDiagramLinks(undefined), []);
assert.deepEqual(getGameDiagramLinks(null), []);

const site = fileURLToPath(new URL('../', import.meta.url));
const gamesDirectory = join(site, 'src/content/games');
const records = await Promise.all((await readdir(gamesDirectory)).filter((file) => file.endsWith('.md')).sort().map(async (file) => {
  const raw = await readFile(join(gamesDirectory, file), 'utf8');
  const yaml = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(yaml, `${file}: missing frontmatter`);
  return { slug: basename(file, '.md'), data: parse(yaml) };
}));
const published = records.filter(({ data }) => data.status === 'published');
assert.ok(published.length > 0);
const groups = { payoutOnly: 0, cascadingOnly: 0, both: 0, unaffected: 0 };
const affectedByMechanism = {};
const disclaimer = '通用概念示意，非本款實際畫面；細部條件請看本款規則。';
const checkedScripts = new Set();
for (const { slug, data } of published) {
  const links = getGameDiagramLinks(data);
  const anchors = links.map((link) => link.anchor);
  const group = anchors.length === 2 ? 'both' : anchors[0] === payout ? 'payoutOnly' : anchors[0] === cascade ? 'cascadingOnly' : 'unaffected';
  groups[group]++;
  if (links.length) affectedByMechanism[data.winMechanism ?? 'unknown'] = (affectedByMechanism[data.winMechanism ?? 'unknown'] ?? 0) + 1;
  if (!process.argv.includes('--built')) continue;

  const html = await readFile(join(site, 'dist/games', slug, 'index.html'), 'utf8');
  const sections = [...html.matchAll(/<nav\b[^>]*\bdata-game-diagram-links\b[^>]*>([\s\S]*?)<\/nav>/g)];
  assert.equal(sections.length, links.length ? 1 : 0, `${slug}: eligible group only, with no empty group`);
  assert.equal(html.split(disclaimer).length - 1, links.length ? 1 : 0, `${slug}: disclaimer exactly once when applicable`);
  assert.equal((html.match(/\bhref="\/slots\/#(?:payout-mechanism-demo|cascading-demo)"/g) ?? []).length, links.length, `${slug}: no misplaced or duplicate diagram links`);
  assert.ok(!/\bdata-(?:payout|cascading)-demo\b/.test(html), `${slug}: diagram markup must not be embedded`);
  for (const match of html.matchAll(/<script\b[^>]*\bsrc="(\/_astro\/[^"?]+\.js)"/g)) {
    if (checkedScripts.has(match[1])) continue;
    const script = await readFile(join(site, 'dist', match[1].slice(1)), 'utf8');
    assert.ok(!/data-(?:payout|cascading)-demo/.test(script), `${slug}: must not load diagram initialization scripts`);
    checkedScripts.add(match[1]);
  }
  if (!links.length) continue;

  const section = sections[0];
  const operation = html.indexOf('class="game-operation"');
  const specifications = html.indexOf('class="game-data-section"');
  assert.ok(operation >= 0 && section.index > operation && section.index < specifications, `${slug}: links belong to the existing operation section`);
  assert.ok(!/<(?:script|iframe|svg)\b/.test(section[0]), `${slug}: navigation must stay lightweight and static`);
  const rendered = [...section[1].matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
  assert.deepEqual(rendered.map((match) => match[1].match(/\bhref="([^"]+)"/)?.[1]), links.map((link) => `/slots/#${link.anchor}`), `${slug}: exact existing anchors, no parameters`);
  assert.deepEqual(rendered.map((match) => match[2].replace(/<[^>]*>/g, '')), links.map((link) => link.label), `${slug}: distinguish diagram from full teaching`);
  for (const match of rendered) assert.ok(!/\b(?:target|download)\s*=/.test(match[1]), `${slug}: ordinary same-tab links`);

  if (slug === 'jump-high' && !data.reels && data.rows === undefined) {
    const operationHtml = html.slice(operation, specifications);
    assert.ok(/<dt>盤面<\/dt>\s*<dd>尚未核實<\/dd>/.test(operationHtml), 'Jump High: missing grid must remain unknown');
  }
}
if (process.argv.includes('--built')) {
  const slotsHtml = await readFile(join(site, 'dist/slots/index.html'), 'utf8');
  for (const id of [payout, cascade]) assert.equal((slotsHtml.match(new RegExp(`id="${id}"`, 'g')) ?? []).length, 1, `${id}: existing target must be unique`);
}
const examples = ['densho', 'jump-high', 'gonzos-quest'].map((slug) => {
  const record = published.find((game) => game.slug === slug);
  assert.ok(record, `${slug}: representative published Game missing`);
  return { slug, mechanism: record.data.winMechanism ?? 'unknown', features: record.data.features ?? [], diagrams: getGameDiagramLinks(record.data).map((link) => link.anchor) };
});
console.log(`Game diagram links: ${fixtures.length + 2} positive/negative cases PASS${process.argv.includes('--built') ? '; all published detail outputs and existing targets PASS' : ''}`);
console.log(JSON.stringify({ publishedGames: published.length, publishedSlots: published.filter(({ data }) => data.primaryType === 'slots').length, affectedPages: published.length - groups.unaffected, groups, affectedByMechanism, examples }, null, 2));
