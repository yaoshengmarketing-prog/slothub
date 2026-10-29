import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CASCADING_FRAMES as frames, createCascadingController, describeBoard } from '../src/lib/cascading-demo.mjs';

// Independently check the teaching rule stated next to the board.
function completeRows(frame) {
  return [0, 1, 2].filter((row) => {
    const shapes = [0, 1, 2].map((col) => frame.tokens.find((item) => item.cell === row * 3 + col)?.shape);
    return shapes[0] && shapes.every((shape) => shape === shapes[0]);
  });
}
for (const frame of frames) {
  assert.equal(new Set(frame.tokens.map((item) => item.id)).size, frame.tokens.length, 'A token cannot be duplicated');
  assert.equal(new Set(frame.tokens.map((item) => item.cell)).size, frame.tokens.length, 'Cells cannot overlap');
  assert.ok(frame.tokens.every((item) => item.cell >= 0 && item.cell < 9), 'Token outside board');
  assert.ok(frame.marked.every((id) => frame.tokens.some((item) => item.id === id)), 'Marked token missing');
  assert.ok(frame.added.every((id) => frame.tokens.some((item) => item.id === id)), 'Added token missing');
}
assert.deepEqual(completeRows(frames[0]), [2]);
assert.equal(frames[1].tokens.length, 6, 'First removal must leave three real holes');
for (const item of frames[1].tokens) {
  assert.equal(frames[2].tokens.find((entry) => entry.id === item.id)?.cell, item.cell + 3, 'Survivor must move down one row');
}
assert.deepEqual(completeRows(frames[3]), [0], 'Continuation must have an actual new combination');
assert.equal(frames[3].outcome, 'continue');
assert.equal(frames[4].tokens.length, 6, 'Second removal must leave three real holes');
assert.deepEqual(completeRows(frames.at(-1)), [], 'Final board must have no valid row');
assert.equal(frames.at(-1).outcome, 'stop');
assert.match(describeBoard(frames[1]), /空位、空位、空位/);

let state;
let nextTimer = 0;
const pending = new Map();
const controller = createCascadingController({
  onChange: (value) => { state = value; },
  schedule: (callback) => { const id = ++nextTimer; pending.set(id, callback); return id; },
  cancel: (id) => pending.delete(id),
});
const tick = () => {
  assert.equal(pending.size, 1, 'Exactly one scheduled transition expected');
  const [id, callback] = pending.entries().next().value;
  pending.delete(id);
  callback();
};
assert.equal(pending.size, 0, 'No automatic playback on creation');
controller.start(); controller.start(); controller.start();
assert.equal(pending.size, 1, 'Repeated starts cannot create parallel timers');
assert.equal(state.index, 0);
tick(); assert.equal(state.index, 1);
controller.pause(); assert.equal(pending.size, 0); assert.equal(state.playing, false);
controller.start(); tick(); assert.equal(state.index, 2, 'Resume must not skip or restart');
controller.next(); assert.equal(state.index, 3); assert.equal(pending.size, 0, 'Manual step pauses playback');
controller.reset(); assert.equal(state.index, 0); assert.equal(state.playing, false); assert.equal(pending.size, 0);
controller.start();
for (let index = 1; index < frames.length; index++) { tick(); assert.equal(state.index, index); }
assert.equal(state.playing, false); assert.equal(pending.size, 0, 'One play must end without restarting');
controller.next(); controller.next(); assert.equal(state.index, frames.length - 1);
controller.start(); assert.equal(state.index, 0); assert.equal(pending.size, 1, 'Replay is explicit');
controller.reset(); assert.equal(pending.size, 0, 'Reset cancels pending transitions');

if (process.argv.includes('--built')) {
  const html = await readFile(new URL('../dist/slots/index.html', import.meta.url), 'utf8');
  assert.match(html, /<link[^>]*rel="stylesheet"/, 'Complete site stylesheet links must be present');
  assert.match(html, /<script[^>]*type="module"[^>]*src=/, 'Interactive module must be included in the complete page');
  assert.equal((html.match(/data-cascading-demo/g) ?? []).length, 1, 'Exactly one demo on /slots/');
  const demo = html.match(/<section[^>]*id="cascading-demo"[\s\S]*?<\/section>/)?.[0];
  assert.ok(demo, 'Demo must be server rendered');
  assert.match(demo, /非特定遊戲實際畫面/);
  assert.match(demo, /本例採向下補位/);
  assert.equal((demo.match(/data-token=/g) ?? []).length, 9, 'Static first board must be visible without JS');
  assert.match(demo, /cascade-controls[^>]*hidden/, 'Uninitialised controls must stay hidden without JS');
  assert.match(demo, /<noscript>/);
  assert.match(demo, /新盤面仍有有效組合就回到第 2 步繼續/);
  assert.match(demo, /沒有新組合便停止/);
  assert.match(html, /href="\/guide\/slot-cascading-tumble-avalanche-explained\/"/);
  assert.match(html, /href="\/games\/\?features=cascading"/);
  assert.ok(!/<iframe|<audio|<video|<img/.test(demo), 'Demo uses only own geometry');
}
console.log(`PASS: fixed cascade boards, real removal/downward refill, continue/stop and single-timer controls${process.argv.includes('--built') ? ', server-rendered fallback and original links' : ''}.`);
