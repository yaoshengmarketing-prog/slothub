import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gitPrefix = execFileSync('git', ['rev-parse', '--show-prefix'], { cwd: root, encoding: 'utf8' }).trim();

const readFrontmatter = async (url) => {
  const source = await readFile(url, 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${url}: frontmatter missing`);
  return { source, data: parse(frontmatter) };
};

const manifest = JSON.parse(await readFile(new URL('../data/external-intake/relax-gaming-catalog.json', import.meta.url), 'utf8'));
assert.equal(manifest.provider, 'relax-gaming');
assert.equal(manifest.catalogSeenAt, '2026-09-27');
assert.match(manifest.catalogSeenAtMeaning, /不代表任何單款內容已重新核對/);
assert.equal(manifest.catalogEntryCount, 175);
assert.equal(manifest.eligibleGameCount, 173);
assert.equal(manifest.existingMatchCount, 26);
assert.equal(manifest.pendingDetailCount, 0);
assert.equal(manifest.retryableDetailCount, 0);
assert.equal(manifest.capturedNeedsReviewCount, 147);
assert.equal(manifest.excludedCount, 2);
assert.equal(manifest.detailCollection.capturedCount, 173);
assert.equal(manifest.detailCollection.failedCount, 0);
assert.equal(manifest.detailCollection.imageAvailableCount, 173);
assert.equal(manifest.detailCollection.imageMissingCount, 0);
assert.equal(new Set(manifest.entries.map((entry) => entry.officialUrl)).size, manifest.entries.length, 'duplicate official catalog URL');

for (const entry of manifest.entries.filter((item) => item.importStatus === 'published')) {
  assert.equal(entry.collectionOutcome, 'published', `${entry.officialName}: published outcome mismatch`);
  assert.match(entry.existingSlug ?? '', /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${entry.officialName}: published Game slug missing`);
  let committedGame;
  try {
    committedGame = execFileSync('git', ['show', `HEAD:${gitPrefix}src/content/games/${entry.existingSlug}.md`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    assert.fail(`${entry.officialName}: manifest says published before Game was committed`);
  }
  assert.match(committedGame, /^status: published\r?$/m, `${entry.officialName}: committed Game is not published`);
}

for (const entry of manifest.entries.filter((item) => item.eligibleForGameIntake !== false)) {
  assert.equal(entry.detailCapture?.status, 'captured', `${entry.officialName}: detail page not captured`);
  assert.equal(entry.detailCapture?.image?.status, 'available', `${entry.officialName}: real image candidate unavailable`);
  assert.equal(entry.detailSnapshot?.sourceUrl, entry.officialUrl, `${entry.officialName}: detail source mismatch`);
  assert.match(entry.detailSnapshot?.sourceSha256 ?? '', /^[a-f0-9]{64}$/, `${entry.officialName}: source snapshot hash missing`);
}

for (const entry of manifest.entries.filter((item) => item.eligibleForGameIntake === false)) {
  assert.equal(entry.collectionOutcome, 'excluded');
  assert.ok(entry.exclusionReason, `${entry.officialName}: exclusion reason missing`);
}

for (const [name, slug] of [['Money Train 2', 'money-train-2'], ['Iron Bank', 'iron-bank']]) {
  const entry = manifest.entries.find((item) => item.officialName === name);
  assert.ok(entry, `${name}: catalog entry missing`);
  assert.equal(entry.existingSlug, slug);
  assert.equal(entry.detailStatus, 'verified');
  assert.equal(entry.verifiedAt, '2026-09-16');
  assert.equal(entry.importStatus, 'imported');
}

for (const [name, slug] of [['AgroCulture', 'agroculture'], ['Ancient Tumble', 'ancient-tumble']]) {
  const entry = manifest.entries.find((item) => item.officialName === name);
  assert.ok(entry, `${name}: catalog entry missing`);
  assert.equal(entry.existingSlug, slug);
  assert.equal(entry.detailStatus, 'verified');
  assert.equal(entry.verifiedAt, '2026-09-16');
  assert.equal(entry.importStatus, 'imported');
  assert.equal(entry.collectionOutcome, 'imported');
}

for (const [name, slug] of [['Temple Tumble', 'temple-tumble'], ['The Great Pigsby Megaways', 'the-great-pigsby-megaways']]) {
  const entry = manifest.entries.find((item) => item.officialName === name);
  assert.equal(entry?.existingSlug, slug, `${name}: existing-record dedupe failed`);
  assert.equal(entry?.detailStatus, 'existing-record-not-reverified');
  const game = await readFrontmatter(new URL(`../src/content/games/${slug}.md`, import.meta.url));
  assert.equal(String(game.data.lastVerifiedAt).slice(0, 10), '2026-09-03', `${slug}: catalog observation must not update lastVerifiedAt`);
}

const money = await readFrontmatter(new URL('../src/content/games/money-train-2.md', import.meta.url));
assert.equal(money.data.provider, 'relax-gaming');
assert.deepEqual(money.data.rtpVariants, [90]);
assert.equal(money.data.rtp, undefined, 'German RTP must not become a universal primary RTP');
assert.equal(money.data.winMechanism, 'paylines');
assert.equal(money.data.winCount, 40);
assert.equal(money.data.maxWinMultiplier, 50000);
assert.equal(money.data.bonusBuy, true);
assert.ok(money.data.features.includes('respins'));

const iron = await readFrontmatter(new URL('../src/content/games/iron-bank.md', import.meta.url));
assert.equal(iron.data.provider, 'relax-gaming');
assert.deepEqual(iron.data.rtpVariants, [90]);
assert.equal(iron.data.rtp, undefined, 'German RTP must not become a universal primary RTP');
assert.equal(iron.data.volatilityNormalized, 'high');
assert.equal(iron.data.winMechanism, 'ways-to-win');
assert.equal(iron.data.winCount, 4096);
assert.equal(iron.data.maxWinMultiplier, 49998.9);
assert.ok(!iron.data.features.includes('scatter'), 'Bonus symbols must not be inferred as Scatter');

const agro = await readFrontmatter(new URL('../src/content/games/agroculture.md', import.meta.url));
assert.equal(agro.data.provider, 'relax-gaming');
assert.deepEqual(agro.data.rtpVariants, [96.1]);
assert.equal(agro.data.rtp, undefined, 'secondary RTP evidence must not become a universal primary RTP');
assert.match(agro.data.volatilityOriginal, /conflict/i);
assert.equal(agro.data.volatilityNormalized, undefined, 'conflicting secondary volatility labels must not be normalized');
assert.equal(agro.data.winMechanism, 'ways-to-win');
assert.equal(agro.data.winCount, 1024);
assert.equal(agro.data.maxWinMultiplier, 10000);
assert.equal(agro.data.bonusBuy, true);
assert.ok(agro.data.features.includes('cash-collection'));

const ancient = await readFrontmatter(new URL('../src/content/games/ancient-tumble.md', import.meta.url));
assert.equal(ancient.data.provider, 'relax-gaming');
assert.deepEqual(ancient.data.rtpVariants, [96.1, 94]);
assert.equal(ancient.data.rtp, undefined, 'multiple RTP versions must not create an inferred primary RTP');
assert.match(ancient.data.volatilityOriginal, /conflict/i);
assert.equal(ancient.data.volatilityNormalized, undefined, 'conflicting secondary volatility labels must not be normalized');
assert.equal(ancient.data.winMechanism, 'ways-to-win');
assert.equal(ancient.data.winCount, 46656);
assert.equal(ancient.data.maxWinMultiplier, 10000);
assert.ok(ancient.data.features.includes('cascading'));
assert.ok(ancient.data.features.includes('giant-symbols'));

for (const game of [money, iron]) {
  assert.equal(game.data.status, 'published');
  assert.equal(String(game.data.lastVerifiedAt).slice(0, 10), '2026-09-16');
  assert.ok(game.data.sources.length >= 4);
  assert.ok(game.data.sources.every((source) => /relax-gaming\.com/.test(source.url)), 'Pilot sources must remain first-party');
  const image = await stat(new URL(`../public${game.data.image.src}`, import.meta.url));
  assert.ok(image.size > 100_000, `${game.data.name}: official image asset is unexpectedly small`);
}

for (const [slug, game] of [['agroculture', agro], ['ancient-tumble', ancient]]) {
  assert.equal(game.data.status, 'published');
  assert.equal(String(game.data.lastVerifiedAt).slice(0, 10), '2026-09-16');
  assert.ok(game.data.sources.some((source) => /二級來源/.test(source.label)), `${slug}: supplemental source labels missing`);
  assert.ok(game.data.sources.some((source) => /relax-gaming\.com/.test(source.url)), `${slug}: first-party source missing`);
  const image = await stat(new URL(`../public${game.data.image.src}`, import.meta.url));
  assert.ok(image.size > 100_000, `${game.data.name}: official image asset is unexpectedly small`);
}

const [moneyHtml, ironHtml, agroHtml, ancientHtml, providerHtml, gamesHtml, searchHtml, compareHtml] = await Promise.all([
  readFile(new URL('../dist/games/money-train-2/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/games/iron-bank/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/games/agroculture/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/games/ancient-tumble/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/providers/relax-gaming/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/games/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/search/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/compare/index.html', import.meta.url), 'utf8'),
]);
for (const [slug, html] of [['money-train-2', moneyHtml], ['iron-bank', ironHtml], ['agroculture', agroHtml], ['ancient-tumble', ancientHtml]]) {
  assert.match(html, /content="noindex,nofollow"/);
  assert.ok(!html.includes('rel="canonical"'));
  assert.match(html, /Relax Gaming/);
  assert.match(providerHtml, new RegExp(`/games/${slug}/`), `${slug}: missing from Provider Hub`);
}
for (const [name, slug] of [['Money Train 2', 'money-train-2'], ['Iron Bank', 'iron-bank'], ['AgroCulture', 'agroculture'], ['Ancient Tumble', 'ancient-tumble']]) {
  assert.match(gamesHtml, new RegExp(slug), `${name}: missing from Explorer catalog`);
  assert.match(searchHtml, new RegExp(slug), `${name}: missing from Search catalog`);
  assert.match(compareHtml, new RegExp(slug), `${name}: missing from Compare catalog`);
}

console.log('PASS: Relax Gaming full-pass intake captures 173 eligible detail pages and real images, preserves catalog-vs-verification dates, resumes missing-image/interrupted work, and keeps four verified imported Games published across Search, Explorer, Compare, Provider and Game detail.');
