import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, '').split('=');
  return [key, rest.join('=') || true];
}));
const provider = String(args.provider || 'relax-gaming');
const manifestPath = args.manifest
  ? path.resolve(String(args.manifest))
  : path.join(root, 'data', 'external-intake', `${provider}-catalog.json`);
const capturedAt = String(args['captured-at'] || new Date().toISOString().slice(0, 10));
const limit = args.limit === 'all' || args.limit === undefined ? Number.POSITIVE_INFINITY : Number(args.limit);
const includeComplete = args['include-complete'] === true || args['include-complete'] === 'true';
const timeoutMs = Number(args['timeout-ms'] || 15_000);
const retries = Number(args.retries || 2);

if (provider !== 'relax-gaming') throw new Error('This first detail adapter currently supports relax-gaming only.');
if (!/^\d{4}-\d{2}-\d{2}$/.test(capturedAt)) throw new Error('--captured-at must use YYYY-MM-DD.');

function decodeHtml(value = '') {
  return value
    .replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'").replaceAll('&nbsp;', ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function textOf(value = '') {
  return decodeHtml(value.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function captureMatches(text, pattern) {
  return [...text.matchAll(pattern)].map((match) => match[0].trim()).filter(Boolean);
}

function parsePage(html, entry) {
  const info = {};
  for (const match of html.matchAll(/<div[^>]*class="[^"]*game-info-title[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*game-info-text[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)) {
    info[textOf(match[1])] = textOf(match[2]);
  }
  const titleMatch = html.match(/<div[^>]*class="[^"]*thin-text title[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  const descriptionMatch = html.match(/<div[^>]*class="[^"]*body-text[^"]*"[^>]*>([\s\S]*?)<div[^>]*class="[^"]*d-flex flex-column d-lg-none/i);
  const description = textOf(descriptionMatch?.[1] ?? '');
  const detailImage = decodeHtml(html.match(/<img[^>]*src="([^"]+)"[^>]*alt="[^"]*Thumbnail"/i)?.[1] ?? '');
  const evidence = {
    rtp: captureMatches(description, /(?:RTP|return to player)[^.!?\n]{0,100}/gi),
    volatility: captureMatches(description, /(?:volatility|variance|risk level)[^.!?\n]{0,100}/gi),
    maxWin: captureMatches(description, /(?:up to|maximum (?:win|payout)|max(?:imum)? win|win potential)[^.!?\n]{0,160}/gi)
      .filter((value) => /\d[\d,.]*\s*[x×]/i.test(value)),
    grid: captureMatches(description, /\b\d+\s*[x×]\s*\d+\s*(?:grid|reels?)?\b/gi),
    winCount: captureMatches(description, /\b[\d,]+\s*(?:paylines?|ways(?: to win)?)\b/gi),
    gameIds: captureMatches(description, /(?:Alternative(?: UK)?|German)?\s*GameID:\s*[A-Za-z0-9_-]+/gi),
  };
  const missingImportantFields = ['rtp', 'volatility', 'maxWin'].filter((field) => evidence[field].length === 0);
  return {
    capturedAt,
    sourceUrl: entry.officialUrl,
    sourceSha256: createHash('sha256').update(html).digest('hex'),
    pageName: textOf(titleMatch?.[1] ?? entry.officialName),
    gameInfo: info,
    description,
    evidence,
    missingImportantFields,
    supplementalResearchStatus: missingImportantFields.length ? 'required' : 'not-required',
    imageCandidates: [...new Set([entry.imageUrl, detailImage].filter(Boolean))],
  };
}

async function request(url, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        redirect: 'follow',
        signal: AbortSignal.timeout(timeoutMs),
        headers: { 'user-agent': 'SlotHubDataIntake/1.0 (+provider catalog verification)', ...(options.headers ?? {}) },
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return { response, attempt };
    } catch (error) {
      lastError = error;
      if (attempt <= retries) await new Promise((resolve) => setTimeout(resolve, attempt * 300));
    }
  }
  throw lastError;
}

async function inspectImage(url) {
  try {
    const { response } = await request(url, { method: 'HEAD' });
    return { url, status: 'available', httpStatus: response.status, contentType: response.headers.get('content-type'), contentLength: Number(response.headers.get('content-length')) || null };
  } catch (headError) {
    try {
      const { response } = await request(url, { headers: { range: 'bytes=0-1023' } });
      await response.arrayBuffer();
      return { url, status: 'available', httpStatus: response.status, contentType: response.headers.get('content-type'), contentLength: Number(response.headers.get('content-length')) || null, headFallback: true };
    } catch (error) {
      return { url, status: 'unavailable', error: error.message, headError: headError.message };
    }
  }
}

async function save(manifest) {
  manifest.pendingDetailCount = manifest.entries.filter((item) => item.eligibleForGameIntake !== false && item.detailStatus === 'pending').length;
  manifest.retryableDetailCount = manifest.entries.filter((item) => item.eligibleForGameIntake !== false && ['pending', 'failed'].includes(item.detailStatus)).length;
  manifest.capturedNeedsReviewCount = manifest.entries.filter((item) => item.eligibleForGameIntake !== false && item.detailStatus === 'captured').length;
  manifest.excludedCount = manifest.entries.filter((item) => item.eligibleForGameIntake === false).length;
  manifest.detailCollection = {
    ...(manifest.detailCollection ?? {}),
    lastRunAt: capturedAt,
    capturedCount: manifest.entries.filter((item) => item.detailCapture?.status === 'captured').length,
    failedCount: manifest.entries.filter((item) => item.detailCapture?.status === 'failed').length,
    imageAvailableCount: manifest.entries.filter((item) => item.detailCapture?.image?.status === 'available').length,
    imageMissingCount: manifest.entries.filter((item) => item.eligibleForGameIntake !== false && item.detailCapture?.image?.status === 'missing').length,
  };
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const eligible = manifest.entries.filter((entry) => entry.eligibleForGameIntake !== false);
const queuedUrls = new Set();
const queue = eligible
  .filter((entry) => includeComplete || !entry.detailCapture || entry.detailCapture.status === 'failed')
  .sort((left, right) => {
    const leftPriority = left.detailCapture?.status === 'failed' || left.detailStatus === 'failed' ? 0 : 1;
    const rightPriority = right.detailCapture?.status === 'failed' || right.detailStatus === 'failed' ? 0 : 1;
    return leftPriority - rightPriority;
  })
  .filter((entry) => {
    if (queuedUrls.has(entry.officialUrl)) return false;
    queuedUrls.add(entry.officialUrl);
    return true;
  })
  .slice(0, limit);
const started = Date.now();
let succeeded = 0;
let failed = 0;

for (const entry of manifest.entries.filter((item) => item.eligibleForGameIntake === false)) {
  entry.collectionOutcome = 'excluded';
  entry.exclusionReason ??= `不屬於現行 Game 收錄範圍：${entry.productType ?? 'unknown product type'}`;
}

for (const entry of queue) {
  entry.detailCapture = { status: 'in-progress', lastAttemptAt: new Date().toISOString(), attempts: (entry.detailCapture?.attempts ?? 0) + 1 };
  await save(manifest);
  try {
    const { response, attempt } = await request(entry.officialUrl);
    const html = await response.text();
    const snapshot = parsePage(html, entry);
    const images = [];
    for (const url of snapshot.imageCandidates) images.push(await inspectImage(url));
    const selectedImage = images.find((image) => image.status === 'available') ?? null;
    entry.detailSnapshot = snapshot;
    entry.detailCapture = {
      status: 'captured',
      capturedAt,
      lastAttemptAt: new Date().toISOString(),
      attempts: entry.detailCapture.attempts,
      requestAttempt: attempt,
      image: selectedImage ? { status: 'available', selectedUrl: selectedImage.url, candidates: images } : { status: 'missing', candidates: images, nextAction: '尋找可授權真實圖片；仍無法取得時才建立並明確標示示意封面。' },
    };
    if (['verified', 'existing-record-not-reverified'].includes(entry.detailStatus) || entry.existingSlug) {
      entry.collectionOutcome = 'collected-existing';
    } else {
      entry.detailStatus = 'captured';
      entry.collectionOutcome = 'pending-supplement';
    }
    entry.lastAttemptResult = 'captured';
    succeeded += 1;
  } catch (error) {
    entry.detailStatus = 'failed';
    entry.collectionOutcome = 'retry';
    entry.detailCapture = { status: 'failed', lastAttemptAt: new Date().toISOString(), attempts: entry.detailCapture.attempts, error: error.message };
    entry.lastAttemptResult = 'failed';
    entry.notes = [...new Set([...(entry.notes ?? []), `Detail capture failed: ${error.message}`])];
    failed += 1;
  }
  await save(manifest);
}

manifest.detailCollection = {
  ...manifest.detailCollection,
  lastRunAt: capturedAt,
  lastRunProcessed: queue.length,
  lastRunSucceeded: succeeded,
  lastRunFailed: failed,
  lastRunDurationMs: Date.now() - started,
  averageMsPerProcessedItem: queue.length ? Math.round((Date.now() - started) / queue.length) : 0,
};
await save(manifest);
console.log(JSON.stringify({ provider, processed: queue.length, succeeded, failed, durationMs: Date.now() - started, averageMs: queue.length ? Math.round((Date.now() - started) / queue.length) : 0, manifestPath }, null, 2));
