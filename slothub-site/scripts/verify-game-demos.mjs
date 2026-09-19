import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gameDirectory = path.join(root, 'src', 'content', 'games');
const providerDirectory = path.join(root, 'src', 'content', 'providers');
const detailTemplate = await readFile(path.join(root, 'src', 'pages', 'games', '[slug].astro'), 'utf8');
const report = JSON.parse(await readFile(path.join(root, 'data', 'game-demo-coverage.json'), 'utf8'));

function frontmatter(raw, file) {
  const match = raw.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`${file}: missing frontmatter`);
  return parse(match[1]);
}

const files = (await readdir(gameDirectory)).filter((file) => file.endsWith('.md')).sort();
const providerFiles = (await readdir(providerDirectory)).filter((file) => file.endsWith('.md')).sort();
const publishedProviders = new Map();
for (const file of providerFiles) {
  const data = frontmatter(await readFile(path.join(providerDirectory, file), 'utf8'), file);
  if (data.status === 'published') publishedProviders.set(file.slice(0, -3), data);
}
const published = [];
for (const file of files) {
  const data = frontmatter(await readFile(path.join(gameDirectory, file), 'utf8'), file);
  if (data.status !== 'published') continue;
  published.push({ slug: file.slice(0, -3), data });
}

const allowedStatuses = new Set(['available', 'login-required', 'access-restricted', 'not-verified']);
const allowedAccessTypes = new Set(['direct-demo', 'official-game-page', 'platform-game-page']);
for (const game of published) {
  const provider = publishedProviders.get(game.data.provider);
  if (!provider) throw new Error(`${game.slug}: published Game requires a matching published Provider record`);
  if (!provider.officialUrl?.trim()) throw new Error(`${game.slug}: Provider ${game.data.provider} requires an officialUrl`);
  const demo = game.data.demo;
  if (!demo) throw new Error(`${game.slug}: missing Demo coverage state`);
  if (!allowedStatuses.has(demo.status)) throw new Error(`${game.slug}: invalid Demo status ${demo.status}`);
  if (!demo.checkedAt) throw new Error(`${game.slug}: missing Demo checkedAt`);
  if (demo.status === 'available' && (!demo.url || !allowedAccessTypes.has(demo.accessType))) {
    throw new Error(`${game.slug}: available Demo requires an exact URL and access type`);
  }
  if (demo.status === 'available' && demo.accessType === 'platform-game-page' && !demo.platformName?.trim()) {
    throw new Error(`${game.slug}: platform game page requires a platformName`);
  }
  if (demo.accessType !== 'platform-game-page' && demo.platformName) {
    throw new Error(`${game.slug}: platformName is only valid for platform-game-page`);
  }
  if (demo.status === 'available' && demo.presentation !== 'external') {
    throw new Error(`${game.slug}: available Demo must use the link-only external presentation`);
  }
  if (demo.status === 'not-verified' && demo.url) throw new Error(`${game.slug}: unverified Demo must not expose a URL`);
}

if (report.gameCount !== published.length || report.entries.length !== published.length) {
  throw new Error(`Coverage report ${report.entries.length} does not match ${published.length} published Games`);
}
const reportSlugs = new Set(report.entries.map((entry) => entry.slug));
for (const game of published) if (!reportSlugs.has(game.slug)) throw new Error(`${game.slug}: absent from coverage report`);
const reportBySlug = new Map(report.entries.map((entry) => [entry.slug, entry]));
const dateOnly = (value) => value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? '').slice(0, 10);
for (const game of published) {
  const demo = game.data.demo;
  const entry = reportBySlug.get(game.slug);
  if (demo.accessType === 'platform-game-page' && !entry.sameGameEvidence?.trim()) {
    throw new Error(`${game.slug}: platform game page is missing saved same-game evidence`);
  }
  for (const key of ['status', 'url', 'accessType', 'presentation', 'platformName']) {
    if ((demo[key] ?? undefined) !== (entry[key] ?? undefined)) {
      throw new Error(`${game.slug}: report/frontmatter mismatch for ${key}`);
    }
  }
  if (dateOnly(demo.checkedAt) !== dateOnly(entry.checkedAt)) {
    throw new Error(`${game.slug}: report/frontmatter mismatch for checkedAt`);
  }
}

for (const expected of [
  '試玩／遊戲入口',
  '官方 Demo',
  '前往官方 Demo 頁 ↗',
  '提供的官方',
  '尚未核實精確入口',
  '同款遊戲平台頁',
  '外部平台同款遊戲頁',
  '前往平台遊戲頁 ↗',
  '此頁不是',
  '廠商資料：',
  '廠商官網 ↗',
  'provider.data.officialUrl',
  'target="_blank"',
  'rel="nofollow noopener noreferrer"',
  '官方 Demo／測試頁 ↗',
]) {
  if (!detailTemplate.includes(expected)) throw new Error(`Game detail missing Demo contract: ${expected}`);
}
if (/<iframe\b/i.test(detailTemplate)) throw new Error('Game detail must not embed third-party Demo content');

const counts = Object.fromEntries([...allowedStatuses].map((status) => [status, published.filter((game) => game.data.demo.status === status).length]));
const iframePublished = published.filter((game) => game.data.demo.presentation === 'iframe').length;
const directDemo = published.filter((game) => game.data.demo.accessType === 'direct-demo' && game.data.demo.status === 'available').length;
const officialGamePage = published.filter((game) => game.data.demo.accessType === 'official-game-page' && game.data.demo.status === 'available').length;
const platformGamePage = published.filter((game) => game.data.demo.accessType === 'platform-game-page' && game.data.demo.status === 'available').length;
if (iframePublished !== 0) throw new Error(`Link-only policy violated by ${iframePublished} iframe Demo records`);
console.log(JSON.stringify({ games: published.length, counts, directDemo, officialGamePage, platformGamePage, iframePublished }, null, 2));
console.log('Game Demo coverage verification passed.');
