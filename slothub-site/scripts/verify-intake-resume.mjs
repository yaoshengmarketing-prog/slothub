import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const detailScript = path.join(root, 'scripts', 'collect-provider-details.mjs');
const progressScript = path.join(root, 'scripts', 'intake-progress.mjs');
const catalogScript = path.join(root, 'scripts', 'collect-provider-catalog.mjs');
const temp = await mkdtemp(path.join(tmpdir(), 'slot-hub-intake-resume-'));
const manifestPath = path.join(temp, 'manifest.json');
const fixtureCatalogPath = path.join(temp, 'catalog.html');
const fixtureCatalogOutput = path.join(temp, 'catalog.json');
const interruptedPage = 'data:text/html,<!doctype html><div class="thin-text title">Interrupted Game</div><div class="game-info-title">Game type</div><div class="game-info-text">Video Slot</div><div class="body-text">Maximum win 100x. RTP 96%. High volatility.<div class="d-flex flex-column d-lg-none"></div>';
const retryPage = 'data:text/html,<!doctype html><div class="thin-text title">Retry Game</div><div class="game-info-title">Game type</div><div class="game-info-text">Video Slot</div><div class="body-text">Maximum win 100x. RTP 96%. High volatility.<div class="d-flex flex-column d-lg-none"></div>';
const pendingPage = 'data:text/html,<!doctype html><div class="thin-text title">Pending Game</div><div class="game-info-title">Game type</div><div class="game-info-text">Video Slot</div><div class="body-text">Maximum win 100x. RTP 96%. High volatility.<div class="d-flex flex-column d-lg-none"></div>';

function runNode(script, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve(stdout.trim()) : reject(new Error(`${script} exited ${code}: ${stderr}`)));
  });
}

try {
  await writeFile(fixtureCatalogPath, '<a href="/products/casino/missing-image-game"><div class="game-type">Relax Gaming</div><div class="game-type">Video Slot</div></a>');
  await runNode(catalogScript, [`--seen-at=2026-09-16`, `--catalog-file=${fixtureCatalogPath}`, `--output=${fixtureCatalogOutput}`]);
  const fixtureCatalog = JSON.parse(await readFile(fixtureCatalogOutput, 'utf8'));
  assert.equal(fixtureCatalog.entries.length, 1, 'catalog item without an image must not be skipped');
  assert.equal(fixtureCatalog.entries[0].officialUrl, 'https://www.relax-gaming.com/products/casino/missing-image-game');
  assert.equal(fixtureCatalog.entries[0].officialName, 'missing image game');
  assert.equal(fixtureCatalog.entries[0].imageUrl, null);
  assert.equal(fixtureCatalog.entries[0].catalogImageStatus, 'missing');

  const interrupted = {
    officialName: 'Interrupted Game', officialUrl: interruptedPage, productType: 'Slot', eligibleForGameIntake: true,
    detailStatus: 'pending', importStatus: 'not-imported', imageUrl: null,
  };
  await writeFile(manifestPath, `${JSON.stringify({ provider: 'relax-gaming', entries: [interrupted] }, null, 2)}\n`);
  const interruptArgs = [`--manifest=${manifestPath}`, '--provider=relax-gaming', '--captured-at=2026-09-16', '--limit=1', '--timeout-ms=10000', '--retries=0'];
  let interruptedManifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  interruptedManifest.entries[0].detailCapture = { status: 'in-progress', attempts: 1 };
  await writeFile(manifestPath, `${JSON.stringify(interruptedManifest, null, 2)}\n`);
  assert.equal(interruptedManifest.entries[0].detailCapture.status, 'in-progress', 'abrupt interruption must leave a resumable marker');
  const interruptedQueue = JSON.parse(await runNode(progressScript, [`--manifest=${manifestPath}`, '--list', '--limit=1']));
  assert.equal(interruptedQueue[0].officialUrl, interrupted.officialUrl, 'in-progress work must return to the front of the queue');
  await runNode(detailScript, interruptArgs);
  interruptedManifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(interruptedManifest.entries[0].detailCapture.status, 'captured', 'in-progress work must resume successfully after interruption');

  const retry = {
    officialName: 'Retry Game', officialUrl: retryPage, productType: 'Slot', eligibleForGameIntake: true,
    detailStatus: 'failed', detailCapture: { status: 'failed', attempts: 1 }, importStatus: 'not-imported', imageUrl: null,
  };
  const pending = {
    officialName: 'Pending Game', officialUrl: pendingPage, productType: 'Slot', eligibleForGameIntake: true,
    detailStatus: 'pending', importStatus: 'not-imported', imageUrl: null,
  };
  await writeFile(manifestPath, `${JSON.stringify({ provider: 'relax-gaming', entries: [retry] }, null, 2)}\n`);

  const args = [`--manifest=${manifestPath}`, '--provider=relax-gaming', '--captured-at=2026-09-16', '--limit=1', '--timeout-ms=300', '--retries=0'];
  let manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.entries[0].detailStatus, 'failed', 'temporary failure must remain retryable');

  manifest.entries.unshift(pending);
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  const firstQueue = JSON.parse(await runNode(progressScript, [`--manifest=${manifestPath}`, '--list', '--limit=2']));
  const secondQueue = JSON.parse(await runNode(progressScript, [`--manifest=${manifestPath}`, '--list', '--limit=2']));
  assert.deepEqual(firstQueue, secondQueue, 'queue listing must be deterministic across reruns');
  assert.equal(firstQueue[0].officialUrl, retry.officialUrl, 'failed item must return before pending work');

  await runNode(detailScript, args);
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.entries.find((entry) => entry.officialUrl === retry.officialUrl).detailCapture.status, 'captured', 'failed item must resume successfully');
  assert.equal(manifest.entries.find((entry) => entry.officialUrl === pending.officialUrl).detailStatus, 'pending', 'retry must be processed before new pending work');

  await runNode(detailScript, args);
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.entries.filter((entry) => entry.detailCapture?.status === 'captured').length, 2);
  const noOp = JSON.parse(await runNode(detailScript, args));
  assert.equal(noOp.processed, 0, 'a completed rerun must be a no-op');

  manifest.entries.push({ ...pending, officialName: 'Duplicate Pending Game', detailStatus: 'failed', detailCapture: { status: 'failed' } });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  const deduped = JSON.parse(await runNode(progressScript, [`--manifest=${manifestPath}`, '--list', '--limit=10']));
  assert.equal(new Set(deduped.map((entry) => entry.officialUrl)).size, deduped.length, 'queue must dedupe official URLs');

  await assert.rejects(
    runNode(progressScript, [`--manifest=${manifestPath}`, `--url=${retry.officialUrl}`, '--slug=retry-game', '--import-status=published']),
    /cannot mark published before the Game is on origin\/main/,
    'intake must reject a published marker for an unpushed Game',
  );
  assert.notEqual(JSON.parse(await readFile(manifestPath, 'utf8')).entries.find((entry) => entry.officialUrl === retry.officialUrl).importStatus, 'published');

  console.log('PASS: catalog entries survive missing images; intake resumes interrupted and failed work before pending items, writes progress per item, and completed reruns are deduplicated no-ops.');
} finally {
  await rm(temp, { recursive: true, force: true });
}
