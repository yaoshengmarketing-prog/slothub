import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const detailScript = path.join(root, 'scripts', 'collect-provider-details.mjs');
const progressScript = path.join(root, 'scripts', 'intake-progress.mjs');
const temp = await mkdtemp(path.join(tmpdir(), 'slot-hub-intake-resume-'));
const manifestPath = path.join(temp, 'manifest.json');
let retryAvailable = false;

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

const server = createServer((request, response) => {
  if (request.url === '/retry' && !retryAvailable) {
    response.writeHead(503, { 'content-type': 'text/plain' });
    response.end('temporary failure');
    return;
  }
  if (request.url === '/image.png') {
    response.writeHead(200, { 'content-type': 'image/png', 'content-length': '8' });
    if (request.method !== 'HEAD') response.end('png-data'); else response.end();
    return;
  }
  const name = request.url === '/retry' ? 'Retry Game' : 'Pending Game';
  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  response.end(`<!doctype html><div class="thin-text title">${name}</div><div class="game-info-title">Game type</div><div class="game-info-text">Video Slot</div><div class="body-text">Maximum win 100x. RTP 96%. High volatility.<div class="d-flex flex-column d-lg-none"></div><img src="http://127.0.0.1:${server.address().port}/image.png" alt="Test Thumbnail">`);
});

try {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const retry = {
    officialName: 'Retry Game', officialUrl: `${base}/retry`, productType: 'Slot', eligibleForGameIntake: true,
    detailStatus: 'pending', importStatus: 'not-imported', imageUrl: `${base}/image.png`,
  };
  const pending = {
    officialName: 'Pending Game', officialUrl: `${base}/pending`, productType: 'Slot', eligibleForGameIntake: true,
    detailStatus: 'pending', importStatus: 'not-imported', imageUrl: `${base}/image.png`,
  };
  await writeFile(manifestPath, `${JSON.stringify({ provider: 'relax-gaming', entries: [retry] }, null, 2)}\n`);

  const args = [`--manifest=${manifestPath}`, '--provider=relax-gaming', '--captured-at=2026-09-16', '--limit=1', '--timeout-ms=300', '--retries=0'];
  await runNode(detailScript, args);
  let manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.entries[0].detailStatus, 'failed', 'temporary failure must remain retryable');

  manifest.entries.unshift(pending);
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  const firstQueue = JSON.parse(await runNode(progressScript, [`--manifest=${manifestPath}`, '--list', '--limit=2']));
  const secondQueue = JSON.parse(await runNode(progressScript, [`--manifest=${manifestPath}`, '--list', '--limit=2']));
  assert.deepEqual(firstQueue, secondQueue, 'queue listing must be deterministic across reruns');
  assert.equal(firstQueue[0].officialUrl, retry.officialUrl, 'failed item must return before pending work');

  retryAvailable = true;
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

  console.log('PASS: intake resumes failed work before pending items, writes progress per item, and completed reruns are deduplicated no-ops.');
} finally {
  server.close();
  await rm(temp, { recursive: true, force: true });
}
