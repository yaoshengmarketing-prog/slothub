import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import registry from '../data/game-metric-evidence.json' with { type: 'json' };
import { projectGameEvidence } from '../src/lib/game-metric-evidence.mjs';

assert.equal(registry.sourceDocuments.length, 1);
assert.equal(registry.metricEvidence.length, 2);
assert.deepEqual(registry.metricEvidence.map((item) => item.id), ['densho-bonushunt-20261015', 'densho-symbol-guarantee-20261015']);
assert.equal(registry.adoption.length, 2);
for (const [items, key] of [[registry.sourceDocuments, 'id'], [registry.metricEvidence, 'id'], [registry.adoption, 'evidenceId']]) {
  assert.equal(new Set(items.map((item) => item[key])).size, items.length, `duplicate ${key}`);
}
for (const source of registry.sourceDocuments) {
  assert.equal(source.publisherRole, 'provider');
  assert.equal(source.documentVersion, null);
  assert.equal(source.documentDate, null);
  assert.match(source.url, /^https:\/\//);
}
for (const evidence of registry.metricEvidence) {
  assert.equal(evidence.checkedAt, '2026-10-15');
  assert.equal(evidence.generationMethod, 'unspecified');
  assert.equal(evidence.configurationId, null);
  assert.equal(evidence.market, null);
  assert.ok(evidence.unknownFields.length > 0);
  assert.ok(registry.sourceDocuments.some((source) => source.id === evidence.sourceDocumentId));
}
const gameData = async (slug) => {
  const raw = await readFile(new URL(`../src/content/games/${slug}.md`, import.meta.url), 'utf8');
  return parse(raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
};
const densho = await gameData('densho');
assert.equal(densho.lastVerifiedAt, '2026-09-03');
assert.equal(densho.demo.checkedAt, '2026-09-19');
assert.equal(densho.updatedAt, '2026-09-03');
const statements = projectGameEvidence('densho', densho.metricEvidenceIds);
assert.equal(statements.length, 2);
assert.equal(new Set(statements.map((item) => item.groupId)).size, 2);
assert.match(statements[0].value, /stake 的 3 倍.*5 倍/);
assert.match(statements[0].limitation, /是否包含原投注/);
assert.match(statements[1].value, /bet 的 50 倍.*基本遊戲.*至少兩個/);
assert.equal(registry.metricEvidence[1].originalLabel, null);
assert.equal(registry.metricEvidence[1].definition.context, 'base game');
assert.equal(registry.metricEvidence[0].definition.comparisonBaseline, null);
assert.deepEqual(projectGameEvidence('densho', densho.metricEvidenceIds, 'side-by-side-with-limitation'), []);
const guideUse = 'guide:slot-bonus-buy-explained';
const guideSource = await readFile(new URL('../src/content/guides/slot-bonus-buy-explained.md', import.meta.url), 'utf8');
const guideEvidence = projectGameEvidence('densho', densho.metricEvidenceIds, guideUse);
assert.equal(guideEvidence.length, 2);
for (const evidence of guideEvidence) {
  const block = guideSource.match(new RegExp(`<section data-evidence-id="${evidence.id}"[^>]*>[\\s\\S]*?<\\/section>`))?.[0];
  assert.ok(block, `Guide missing linked evidence ${evidence.id}`);
  assert.ok(block.includes(evidence.value), `Guide value drift: ${evidence.id}`);
  assert.ok(block.includes(evidence.limitation), `Guide limitation drift: ${evidence.id}`);
  assert.ok(block.includes(`href="${evidence.sourceHref}"`));
  assert.ok(block.includes(`href="${evidence.source.url}"`));
  assert.deepEqual(registry.adoption.find((item) => item.evidenceId === evidence.id).allowedUses,
    ['detail-with-limitation', guideUse]);
}
for (const use of ['guide', 'guide:rtp-explained', 'ranking', 'conversion', 'numeric-filter', 'search', 'card', 'structured-data']) {
  assert.deepEqual(projectGameEvidence('densho', densho.metricEvidenceIds, use), []);
}
assert.throws(() => projectGameEvidence('book-of-8-riches', densho.metricEvidenceIds), /cross-game/);
assert.throws(() => projectGameEvidence('densho', ['unknown']), /invalid/);
assert.throws(() => projectGameEvidence('densho', [...densho.metricEvidenceIds, ...densho.metricEvidenceIds]), /duplicate/);
const withheld = structuredClone(registry);
withheld.adoption[0].contentChecked = false;
assert.deepEqual(projectGameEvidence('densho', [densho.metricEvidenceIds[0]], 'detail-with-limitation', withheld), []);
withheld.adoption[0].contentChecked = true;
withheld.adoption[0].displayUse = 'research-only';
assert.deepEqual(projectGameEvidence('densho', [densho.metricEvidenceIds[0]], 'detail-with-limitation', withheld), []);
const files = await readdir(new URL('../src/content/games/', import.meta.url));
assert.ok(!files.some((file) => /duck-hunters/i.test(file)));
const owners = [];
for (const file of files.filter((file) => file.endsWith('.md'))) {
  const game = await gameData(file.slice(0, -3));
  if (game.metricEvidenceIds?.length) {
    owners.push(file.slice(0, -3));
    projectGameEvidence(file.slice(0, -3), game.metricEvidenceIds);
  }
}
assert.deepEqual(owners.sort(), ['densho']);

if (process.argv.includes('--built')) {
  const dist = new URL('../dist/', import.meta.url);
  async function scan(directory) {
    for (const file of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, file.name);
      if (file.isDirectory()) await scan(path);
      else {
        const text = (await readFile(path)).toString('utf8');
        for (const token of ['research-duck-hunters-free-spins-20261015', 'nolimit-duck-hunters-product-20261015', 'Duck Hunters', 'duck-hunters', '1 in 203']) {
          assert.ok(!text.includes(token), `${path}: leaked research ${token}`);
        }
      }
    }
  }
  await scan(fileURLToPath(dist));
  const detail = await readFile(new URL('games/the-game-show/index.html', dist), 'utf8');
  const denshoHtml = await readFile(new URL('games/densho/index.html', dist), 'utf8');
  const guideHtml = await readFile(new URL('guide/slot-bonus-buy-explained/index.html', dist), 'utf8');
  for (const evidence of guideEvidence) {
    assert.ok(guideHtml.includes(`data-evidence-id="${evidence.id}"`));
    assert.ok(guideHtml.includes(evidence.value));
    assert.ok(guideHtml.includes(evidence.limitation));
    assert.ok(denshoHtml.includes(`id="evidence-${evidence.id}"`), 'Guide target must exist in the same build');
    assert.equal(denshoHtml.split(`id="evidence-${evidence.id}"`).length - 1, 1, 'Each source anchor must be unique');
    assert.ok(denshoHtml.includes(`data-feature-group="${evidence.groupId}"`));
    assert.ok(denshoHtml.includes(evidence.value));
    assert.ok(denshoHtml.includes(evidence.limitation));
  }
  assert.equal((guideHtml.match(/class="bonus-buy-reading-effects__label"/g) ?? []).length, 6);
  assert.ok(guideHtml.includes('/compare/?games=gates-of-olympus-1000,densho'));
  assert.ok(guideHtml.includes('/games/?features=bonus-buy'));
  assert.doesNotMatch(detail, /26\.04%|data-has-hit-evidence|evidence-the-game-show-hit-rate-20261015/);
  const compare = await readFile(new URL('compare/index.html', dist), 'utf8');
  assert.doesNotMatch(compare, /the-game-show-hit-rate-20261015|densho-bonushunt-20261015|densho-symbol-guarantee-20261015/);
  assert.match(denshoHtml, /基本遊戲中出現至少兩個/);
  for (const html of [detail, denshoHtml]) {
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1]).join('');
    assert.doesNotMatch(schemas, /26\.04|metricEvidence|densho-bonushunt/);
  }
  const book = await readFile(new URL('games/book-of-8-riches/index.html', dist), 'utf8');
  assert.doesNotMatch(book, /23\.86|data-evidence-id/);
  const home = await readFile(new URL('index.html', dist), 'utf8');
  assert.doesNotMatch(home, /26\.04|the-game-show-hit-rate-20261015|densho-bonushunt-20261015/);
  console.log('PASS: build-wide research isolation, public evidence anchors, Book exclusion, homepage and JSON-LD isolation.');
}
console.log('PASS: two Densho evidence records, grouped costs/effects, per-field dates, permissions and research-only isolation.');
