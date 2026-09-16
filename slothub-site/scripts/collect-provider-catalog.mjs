import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const providerSlug = 'relax-gaming';
const catalogUrl = 'https://www.relax-gaming.com/products/own-games';
const outputPath = path.join(root, 'data', 'external-intake', `${providerSlug}-catalog.json`);
const seenAt = process.argv.find((arg) => arg.startsWith('--seen-at='))?.split('=')[1];

if (!seenAt || !/^\d{4}-\d{2}-\d{2}$/.test(seenAt)) {
  throw new Error('Usage: node scripts/collect-provider-catalog.mjs --seen-at=YYYY-MM-DD');
}

function frontmatterOf(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? parse(match[1]) : null;
}

function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&nbsp;', ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function normalizeName(value) {
  return value
    .normalize('NFKD')
    .toLocaleLowerCase('en')
    .replace(/[’‘`´]/g, "'")
    .replace(/&/g, 'and')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

async function loadExistingGames() {
  const directory = path.join(root, 'src', 'content', 'games');
  const files = (await readdir(directory)).filter((file) => file.endsWith('.md'));
  const aliases = new Map();
  for (const file of files) {
    const data = frontmatterOf(await readFile(path.join(directory, file), 'utf8'));
    if (!data) continue;
    const slug = file.replace(/\.md$/, '');
    const names = [data.name, data.originalName, data.displayNameZhHant, ...(data.aliases ?? [])].filter(Boolean);
    for (const name of names) aliases.set(normalizeName(String(name)), slug);
  }
  return aliases;
}

function parseCatalog(html) {
  const entries = [];
  const anchorPattern = /<a\b[^>]*href="(\/products\/casino\/[^"?#]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(anchorPattern)) {
    const [, relativeUrl, content] = match;
    const imageMatch = content.match(/<img\b[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/i);
    const typeValues = [...content.matchAll(/<div\b[^>]*class="[^"]*game-type[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)]
      .map((item) => decodeHtml(item[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));
    if (!imageMatch) continue;
    const imageUrl = decodeHtml(imageMatch[1]);
    const officialName = decodeHtml(imageMatch[2]).replace(/\s+Thumbnail$/i, '').trim();
    if (!officialName) continue;
    entries.push({
      officialName,
      normalizedName: normalizeName(officialName),
      officialUrl: new URL(relativeUrl, catalogUrl).href,
      imageUrl,
      studioLabel: typeValues[0] || null,
      productType: typeValues[1] || null,
    });
  }
  return entries.filter((entry, index, list) => list.findIndex((other) => other.officialUrl === entry.officialUrl) === index);
}

async function loadPrevious() {
  try {
    return JSON.parse(await readFile(outputPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

const response = await fetch(catalogUrl, { headers: { 'user-agent': 'SlotHubCatalogAudit/1.0 (+readonly catalog inventory)' } });
if (!response.ok) throw new Error(`Catalog request failed: ${response.status} ${response.statusText}`);
const html = await response.text();
const catalogEntries = parseCatalog(html);
if (catalogEntries.length < 100) throw new Error(`Catalog parse returned only ${catalogEntries.length} entries`);

const existingGames = await loadExistingGames();
const previous = await loadPrevious();
const previousByUrl = new Map((previous?.entries ?? []).map((entry) => [entry.officialUrl, entry]));

const entries = catalogEntries.map((entry) => {
  const prior = previousByUrl.get(entry.officialUrl);
  const existingSlug = existingGames.get(entry.normalizedName) ?? null;
  const eligibleForGameIntake = !/^table\b/i.test(entry.productType ?? '');
  return {
    ...(prior ?? {}),
    ...entry,
    eligibleForGameIntake,
    existingSlug,
    catalogStatus: 'observed',
    detailStatus: prior?.detailStatus ?? (existingSlug ? 'existing-record-not-reverified' : 'pending'),
    verifiedAt: prior?.verifiedAt ?? null,
    importStatus: prior?.importStatus ?? (existingSlug ? 'existing' : 'not-imported'),
    notes: prior?.notes ?? [],
    collectionOutcome: prior?.collectionOutcome ?? (eligibleForGameIntake ? (existingSlug ? 'collected-existing' : 'pending') : 'excluded'),
    exclusionReason: eligibleForGameIntake ? null : (prior?.exclusionReason ?? `不屬於現行 Game 收錄範圍：${entry.productType ?? 'unknown product type'}`),
  };
});

const output = {
  provider: providerSlug,
  officialCatalogUrl: catalogUrl,
  catalogSeenAt: seenAt,
  catalogSeenAtMeaning: '目錄發現日期；不代表任何單款內容已重新核對，不得用於更新 Game lastVerifiedAt。',
  catalogEntryCount: entries.length,
  eligibleGameCount: entries.filter((entry) => entry.eligibleForGameIntake).length,
  existingMatchCount: entries.filter((entry) => entry.existingSlug).length,
  pendingDetailCount: entries.filter((entry) => entry.eligibleForGameIntake && entry.detailStatus === 'pending').length,
  retryableDetailCount: entries.filter((entry) => entry.eligibleForGameIntake && ['pending', 'failed'].includes(entry.detailStatus)).length,
  capturedNeedsReviewCount: entries.filter((entry) => entry.eligibleForGameIntake && entry.detailStatus === 'captured').length,
  excludedCount: entries.filter((entry) => !entry.eligibleForGameIntake).length,
  detailCollection: {
    ...(previous?.detailCollection ?? {}),
    lastCompletedFullPassAt: entries.filter((entry) => entry.eligibleForGameIntake).every((entry) => entry.detailCapture?.status === 'captured')
      ? seenAt
      : previous?.detailCollection?.lastCompletedFullPassAt ?? null,
    capturedCount: entries.filter((entry) => entry.detailCapture?.status === 'captured').length,
    failedCount: entries.filter((entry) => entry.detailCapture?.status === 'failed').length,
    imageAvailableCount: entries.filter((entry) => entry.detailCapture?.image?.status === 'available').length,
    imageMissingCount: entries.filter((entry) => entry.eligibleForGameIntake && entry.detailCapture?.image?.status === 'missing').length,
  },
  entries,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Saved ${entries.length} Relax Gaming catalog entries; ${output.existingMatchCount} match existing games.`);
console.log(`Catalog observation date ${seenAt} is stored separately and does not update Game lastVerifiedAt.`);
