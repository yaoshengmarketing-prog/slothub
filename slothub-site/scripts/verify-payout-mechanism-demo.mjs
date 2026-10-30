import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PAYOUT_CASES, getPayoutView } from '../src/lib/payout-mechanism-demo.mjs';

// Independent expectations for the six taught outcomes and exact positions.
const expectations = [
  ['aligned', 'paylines', true, [5, 6, 7], []],
  ['aligned', 'ways-to-win', true, [5, 6, 7], []],
  ['different-rows', 'paylines', false, [6], [0, 2]],
  ['different-rows', 'ways-to-win', true, [0, 6, 12], []],
  ['reel-gap', 'paylines', false, [7], [0, 1]],
  ['reel-gap', 'ways-to-win', false, [0, 7], [1]],
];
const expectedCircles = [[5, 6, 7], [0, 6, 12], [0, 7, 13]];
const original = JSON.stringify(PAYOUT_CASES);
for (const [index, example] of PAYOUT_CASES.entries()) {
  assert.equal(example.board.length, 15, 'Fixed 5 by 3 board');
  assert.deepEqual(example.board.flatMap((shape, cell) => shape === 'circle' ? [cell] : []), expectedCircles[index]);
  assert.ok(example.board.every((shape) => ['circle', 'triangle', 'diamond', 'square'].includes(shape)));
}
for (const [caseId, mechanism, matches, targets, missing] of expectations) {
  const view = getPayoutView(caseId, mechanism);
  assert.equal(view.matches, matches, `${caseId}/${mechanism}: verdict`);
  assert.equal(view.result, matches ? '符合本例條件' : '未符合本例條件');
  assert.deepEqual(view.targets, targets, `${caseId}/${mechanism}: marked circles`);
  assert.deepEqual(view.missingReels, missing, `${caseId}/${mechanism}: missing positions`);
  assert.deepEqual(view.readCells, mechanism === 'paylines' ? [5, 6, 7] : [0, 1, 2, 5, 6, 7, 10, 11, 12]);
  assert.equal(view.description.split('；').length, 3, 'Accessible board has all rows');
  assert.deepEqual(getPayoutView(caseId, 'paylines').board, getPayoutView(caseId, 'ways-to-win').board, 'Mechanism switch cannot move symbols');
}
assert.ok(!getPayoutView('reel-gap', 'ways-to-win').targets.includes(13), 'Fourth reel cannot repair the missing second reel');
assert.match(getPayoutView('reel-gap', 'ways-to-win').reason, /第 2 軸沒有圓形/);
for (let repeat = 0; repeat < 12; repeat++) {
  for (const [caseId, mechanism, matches, targets] of [...expectations].reverse()) {
    const view = getPayoutView(caseId, mechanism);
    assert.equal(view.matches, matches);
    assert.deepEqual(view.targets, targets, 'No stale marks after repeated switching');
  }
}
assert.equal(JSON.stringify(PAYOUT_CASES), original, 'Switching cannot mutate source examples');
assert.throws(() => getPayoutView('unknown', 'paylines'), RangeError);
assert.throws(() => getPayoutView('aligned', 'unknown'), RangeError);

if (process.argv.includes('--built')) {
  const html = await readFile(new URL('../dist/slots/index.html', import.meta.url), 'utf8');
  const start = html.indexOf('id="payout-mechanism-demo"');
  const end = html.indexOf('id="features"', start);
  assert.ok(start >= 0 && end > start, 'Demo belongs in the existing Mechanisms section');
  const demo = html.slice(start, end);
  assert.equal((html.match(/<section\b[^>]*\bdata-payout-demo(?:\s|>)/g) ?? []).length, 1, 'Exactly one actual demo section, excluding inline module selectors');
  assert.match(html, /<link[^>]*rel="stylesheet"/);
  assert.match(html, /<script[^>]*type="module"[^>]*src=/);
  assert.equal((demo.match(/data-cell="\d+"/g) ?? []).length, 15, 'Complete static board without JS');
  assert.equal((demo.match(/data-shape="circle"/g) ?? []).length, 3);
  assert.match(demo, /payout-case-control[^>]*hidden/);
  assert.match(demo, /payout-mode-control[^>]*hidden/);
  assert.match(demo, /<noscript>/);
  assert.match(demo, /兩套示例規則/);
  assert.match(demo, /其他幾何符號僅作背景/);
  assert.match(demo, /非特定遊戲實際畫面/);
  assert.match(demo, /第 1 軸/);
  assert.match(demo, /第 5 軸/);
  assert.ok(!/<iframe|<audio|<video|<img/.test(demo), 'Only own geometry; no media service');
  for (const mechanism of ['paylines', 'ways-to-win']) {
    assert.ok(html.includes(`href="/games/?mechanism=${mechanism}"`), 'Existing Mechanism URL must remain');
    assert.ok(!html.includes(`href="/games/?features=${mechanism}"`), 'Mechanism must not become a Feature filter');
  }
  for (const guide of ['slot-payout-mechanisms-explained', 'slot-ways-to-win-explained', 'slot-cascading-tumble-avalanche-explained']) {
    assert.ok(html.includes(`href="/guide/${guide}/"`), 'Existing Guide entry must remain');
  }
  assert.equal((html.match(/data-cascading-demo/g) ?? []).length, 1, 'Existing Cascading demo stays intact');
  assert.ok(html.indexOf('id="cascading-demo"') > end);
}
console.log(`PASS: six payout verdicts and exact markers, fixed 5x3 boards, mechanism invariance and repeated switching${process.argv.includes('--built') ? ', SSR fallback and original Mechanism/Guide/Cascading entries' : ''}.`);
