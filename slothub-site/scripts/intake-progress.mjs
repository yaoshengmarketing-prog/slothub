import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, '').split('=');
  return [key, rest.join('=') || true];
}));
const provider = String(args.provider || 'relax-gaming');
const manifestPath = path.join(root, 'data', 'external-intake', `${provider}-catalog.json`);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

if (args.list) {
  const limit = Number(args.limit || 2);
  const pending = manifest.entries
    .filter((entry) => entry.eligibleForGameIntake !== false && entry.detailStatus === 'pending')
    .slice(0, limit);
  console.log(JSON.stringify(pending, null, 2));
  process.exit(0);
}

if (!args.url) throw new Error('Use --list or provide --url=<official product URL>.');
const entry = manifest.entries.find((item) => item.officialUrl === args.url);
if (!entry) throw new Error(`Catalog entry not found: ${args.url}`);

if (args['detail-status']) entry.detailStatus = args['detail-status'];
if (args['verified-at']) entry.verifiedAt = args['verified-at'];
if (args['import-status']) entry.importStatus = args['import-status'];
if (args.slug) entry.existingSlug = args.slug;
if (args.note) entry.notes = [...new Set([...(entry.notes ?? []), args.note])];

manifest.existingMatchCount = manifest.entries.filter((item) => item.existingSlug).length;
manifest.pendingDetailCount = manifest.entries.filter((item) => item.eligibleForGameIntake !== false && item.detailStatus === 'pending').length;
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Updated ${entry.officialName}: ${entry.detailStatus} / ${entry.importStatus}.`);
