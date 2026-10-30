import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import record from '../data/densho-multiplier-storyboard.json' with { type: 'json' };
import evidence from '../data/game-metric-evidence.json' with { type: 'json' };
import { projectDenshoMultiplierStoryboard as project } from '../src/lib/densho-multiplier-storyboard.mjs';

const game = { status: 'published', primaryType: 'slots' };
const original = structuredClone(evidence);
assert.equal(record.id, 'densho-winning-combination-sum-20261030');
assert.ok(!evidence.metricEvidence.some((item) => item.id === record.id), 'New rule must not reuse paid-feature evidence');
assert.equal(record.checkedAt, '2026-10-30');
assert.equal(record.sourceLocation, 'FEATURES → Wild Multiplier Reels，最後一段（同一得獎組合的倍數加總）');
assert.equal(record.excerpt, 'same winning combination, their respective values are summed before a payout calculation.');
assert.equal(project('densho', game, 'preview').source.url, 'https://www.hacksawgaming.com/games/densho');
for (const [slug, data, environment] of [
  ['razor-shark', game, 'preview'], ['jump-high', game, 'preview'],
  ['densho', { ...game, status: 'draft' }, 'preview'],
  ['densho', { ...game, primaryType: 'table-games' }, 'preview'],
  ['densho', {}, 'preview'], ['densho', game, 'production'], ['densho', game, undefined],
]) assert.equal(project(slug, data, environment), null, `${slug}/${data.status}/${environment}: isolated preview`);
assert.equal(project('densho', game, 'preview', { ...record, gameSlug: 'razor-shark' }), null);
assert.equal(project('densho', game, 'preview', { ...record, adoption: 'unknown' }), null);
assert.throws(() => project('densho', game, 'preview', record, []), /missing source document/);
assert.deepEqual(evidence, original, 'Shared source and older evidence must not mutate');
const site = fileURLToPath(new URL('../', import.meta.url));
const component = await readFile(join(site, 'src/components/DenshoMultiplierStoryboard.astro'), 'utf8');
assert.ok(!/<(?:script|img|image|iframe|text)\b/.test(component), 'No scripts, copied art or SVG text labels');
assert.ok(!/\sclient:|\son\w+\s*=|(?:^|[;{])\s*(?:animation|transition)\s*:/i.test(component), 'Understanding must not depend on interaction or motion');

if (process.argv.includes('--built')) {
  const environment = process.env.PUBLIC_SITE_ENV ?? 'preview';
  const walk = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async (entry) => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
  const files = (await walk(join(site, 'dist'))).filter((file) => file.endsWith('.html'));
  let outputs = 0;
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const blocks = [...html.matchAll(/<section\b[^>]*\bdata-densho-storyboard\b[^>]*>([\s\S]*?)<\/section>/g)];
    const expected = environment === 'preview' && file === join(site, 'dist/games/densho/index.html');
    assert.equal(blocks.length, expected ? 1 : 0, `${file}: only Densho preview may output this rule`);
    assert.equal((html.match(/class="densho-storyboard"/g) ?? []).length, expected ? 1 : 0, `${file}: no empty block`);
    if (!expected) continue;
    outputs++;
    const block = blocks[0][0];
    assert.ok(blocks[0].index > html.indexOf('class="game-operation-band"'));
    assert.ok(blocks[0].index < html.indexOf('data-game-diagram-links'), 'Storyboard must precede generic diagram navigation');
    assert.deepEqual([...block.matchAll(/data-story-panel="([^"]+)"/g)].map((match) => match[1]), ['group', 'mapping', 'sum']);
    const group = block.match(/<div[^>]*data-combination-frame[^>]*>([\s\S]*?)<\/li>/)?.[1];
    assert.ok(group?.includes('同一得獎組合中的相關符號'));
    assert.deepEqual([...group.matchAll(/data-symbol-code="([^"]+)"/g)].map((match) => match[1]), ['A', 'B']);
    for (const code of ['A', 'B']) {
      const strand = block.match(new RegExp(`data-mapping="${code}"[^>]*>([\\s\\S]*?)data-multiplier-code="${code}"`))?.[1];
      assert.ok(strand?.includes(`data-symbol-code="${code}"`) && strand.includes('<svg'), `${code}: dedicated arrow to its own multiplier`);
    }
    assert.deepEqual([...block.matchAll(/data-sum-input="([^"]+)"/g)].map((match) => match[1]), ['A', 'B']);
    assert.match(block, /data-sum-operator[^>]*>＋<\/span>/);
    assert.ok(block.includes('data-merge-arrows') && block.includes('M66 1V22L150 50M234 1V22L150 50M150 50V75'));
    assert.match(block, /data-sum-result[\s\S]*合併結果[\s\S]*這兩個倍數的加總[\s\S]*data-calculation-target[^>]*>該組合的派彩計算/);
    for (const required of ['兩個方塊本身不是成立得獎的示範', '並非遊戲動畫時序', '不是原廠正式符號名稱或種類', record.rule, record.sourceLocation, record.excerpt, record.checkedAt]) assert.ok(block.includes(required), `Missing boundary/source: ${required}`);
    const notice = '本站規則示意，非實際遊玩截圖；圖以兩個相關符號為例，代號與排列僅用來說明關係。';
    assert.equal(block.split(notice).length - 1, 1);
    assert.equal(block.split('href="https://www.hacksawgaming.com/games/densho"').length - 1, 1, 'One original-source link in storyboard');
    assert.ok(!/<(?:script|img|image|iframe|text)\b/.test(block));
    assert.ok(!/\d+(?:\.\d+)?\s*[×%]|(?:NT\$|\$|€)/.test(block), 'No concrete multipliers, probability or payout amounts');
    assert.ok(html.includes('BonusHunt FeatureSpins') && html.includes('另一項付費功能說明'));
    assert.ok(html.includes('evidence-densho-bonushunt-20261015') && html.includes('evidence-densho-symbol-guarantee-20261015'));
    assert.ok(html.includes('data-game-diagram-links') && html.includes('vimeo.com/860852013') && html.includes('官方 Demo'));
  }
  assert.equal(outputs, environment === 'preview' ? 1 : 0);
  console.log(`PASS: ${environment} built isolation across ${files.length} HTML pages; storyboard outputs=${outputs}; relationships, source and original Densho content intact.`);
}
console.log('PASS: Densho rule provenance, ownership/status/environment boundaries and static accessible content.');
