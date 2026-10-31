import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  buildRecordedRtpPresentation, buildGameDetailPresentation, formatRecordedRtp,
  RTP_MISSING, RTP_PRIMARY_NOTE, RTP_USAGE_NOTE,
} from '../src/lib/game-detail-presentation.mjs';
import { emptyExplorerState, filterAndSortGames } from '../src/lib/game-explorer-state.mjs';

const fixtures = [
  ['primary only', { rtp: 96.4 }, true, [96.4]],
  ['single variant only', { rtpVariants: [96.4] }, false, [96.4]],
  ['multiple variants only', { rtpVariants: [94.06, 96.7] }, false, [94.06, 96.7]],
  ['primary and variants', { rtp: 96.4, rtpVariants: [94.38, 96.4, 92.33] }, true, [96.4, 94.38, 92.33]],
  ['display duplicates', { rtp: 96.4, rtpVariants: [96.4, 94.38, 94.38] }, true, [96.4, 94.38]],
  ['distinct primary and one variant', { rtp: 95, rtpVariants: [99] }, true, [95, 99]],
  ['missing', {}, false, []],
  ['empty variants', { rtpVariants: [] }, false, []],
  ['zero primary', { rtp: 0, rtpVariants: [96.1234, 0] }, true, [0, 96.1234]],
  ['zero variant', { rtpVariants: [0] }, false, [0]],
  ['no numeric coercion', { rtp: null, rtpVariants: [null, undefined, '', '96.7', NaN, Infinity, -Infinity] }, false, []],
  ['empty primary', { rtp: '', rtpVariants: [96.7] }, false, [96.7]],
  ['no rounding before deduplication', { rtpVariants: [96.12341, 96.12342] }, false, [96.12341, 96.12342]],
];

for (const [name, input, hasPrimary, values] of fixtures) {
  const original = structuredClone(input);
  if (Array.isArray(input.rtpVariants)) Object.freeze(input.rtpVariants);
  Object.freeze(input);
  const rtp = buildRecordedRtpPresentation(input);
  assert.equal(rtp.hasPrimary, hasPrimary, name);
  assert.equal(rtp.primary, hasPrimary ? input.rtp : undefined, name);
  assert.equal(rtp.hasRecordedValues, values.length > 0, name);
  assert.equal(rtp.valueCount, values.length, name);
  assert.deepEqual(rtp.values, values, name);
  assert.deepEqual(buildGameDetailPresentation(input).quick.rtp, rtp, `${name}: detail must use the shared projection`);
  assert.deepEqual(buildGameDetailPresentation(input).full.rtpValues, values, `${name}: full list must agree`);
  rtp.values.push(1);
  assert.deepEqual(input, original, `${name}: projection and result mutation must not change input`);
}

for (const [input, expected] of [
  [96.7, '96.70%'], [96, '96.00%'], [0, '0.00%'], [96.1234, '96.1234%'],
  [96.12341, '96.12341%'], [1e-7, '0.0000001%'], [1e-21, '0.000000000000000000001%'],
  [null, undefined], [undefined, undefined], ['', undefined], ['0', undefined], [NaN, undefined], [Infinity, undefined],
]) assert.equal(formatRecordedRtp(input), expected, `format ${String(input)}`);

const games = [
  { slug: 'variants-only', name: 'A', rtpVariants: [99] },
  { slug: 'low-primary-high-variant', name: 'B', rtp: 95, rtpVariants: [99] },
  { slug: 'high-primary', name: 'C', rtp: 97, rtpVariants: [90] },
  { slug: 'zero-primary', name: 'D', rtp: 0, rtpVariants: [] },
].map((game) => ({ ...game, features: [], subtypes: [], aliases: [], searchTerms: [] }));
const beforeFilters = structuredClone(games);
const slugs = (state) => filterAndSortGames(games, { ...emptyExplorerState(), ...state }).map((game) => game.slug);
assert.deepEqual(slugs({ rtpMin: 96.5 }), ['high-primary'], 'threshold must use primary, never any variant');
assert.deepEqual(slugs({ sort: 'rtp-asc' }), ['zero-primary', 'low-primary-high-variant', 'high-primary', 'variants-only']);
assert.deepEqual(slugs({ sort: 'rtp-desc' }), ['high-primary', 'low-primary-high-variant', 'zero-primary', 'variants-only']);
assert.deepEqual(slugs({ rtpMin: 96.5, sort: 'rtp-desc' }), ['high-primary']);
assert.equal(slugs({}).length, games.length, 'removing the threshold must restore variants-only Games');
games.forEach(buildRecordedRtpPresentation);
assert.deepEqual(games, beforeFilters, 'display projection and filtering must not rewrite primary values or order');

if (process.argv.includes('--built')) {
  const { parse } = await import('yaml');
  for (const slug of ['razor-shark', 'densho']) {
    const raw = await readFile(new URL(`../src/content/games/${slug}.md`, import.meta.url), 'utf8');
    const data = parse(raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1]);
    const rtp = buildRecordedRtpPresentation(data);
    const html = await readFile(new URL(`../dist/games/${slug}/index.html`, import.meta.url), 'utf8');
    const quick = html.match(/<section class="game-quick-read"[\s\S]*?<\/section>/)?.[0];
    const quickRtp = quick?.match(/<dt>已收錄 RTP<\/dt>[\s\S]*?<\/div>/)?.[0];
    const full = html.match(/<dt>已收錄 RTP 數值<\/dt>[\s\S]*?<\/dd>/)?.[0];
    assert.ok(quickRtp && full, `${slug}: scoped RTP markup missing`);
    assert.ok(!quickRtp.includes('is-unknown') && !quickRtp.includes('尚未核實'), `${slug}: recorded RTP must not look unknown`);
    assert.ok(quickRtp.includes(RTP_USAGE_NOTE), `${slug}: nearby usage reminder missing`);
    for (const value of rtp.values) assert.ok(full.includes(formatRecordedRtp(value)), `${slug}: full list missing a recorded value`);
    if (rtp.valueCount <= 2) {
      for (const value of rtp.values) assert.ok(quickRtp.includes(formatRecordedRtp(value)), `${slug}: quick read must expose both values`);
    } else {
      assert.ok(quickRtp.includes(`${rtp.valueCount} 個已收錄數值`), `${slug}: summary must count distinct values`);
      assert.ok(quickRtp.includes('href="#full-data-title"'), `${slug}: long summary must link to the full list`);
    }
    assert.ok(!/\d+ 個已核實版本/.test(quickRtp + full), `${slug}: value count must not claim a version count`);
    if (slug === 'razor-shark') assert.equal(rtp.hasPrimary, false, 'Razor remains variants-only');
    if (slug === 'densho') {
      assert.equal(rtp.hasPrimary, true, 'Densho retains its existing primary');
      assert.ok(rtp.valueCount > 1);
      assert.ok(full.includes('本站記錄的主要值') && full.includes(RTP_PRIMARY_NOTE), 'Densho primary identity and purpose missing');
    }
    assert.ok(!quickRtp.includes(RTP_MISSING));
  }
}

console.log(`PASS: recorded RTP projection, precision, ${fixtures.length} isolated states, non-mutation and unchanged primary-only thresholds/sorting${process.argv.includes('--built') ? '; Razor/Densho built presentation' : ''}.`);
