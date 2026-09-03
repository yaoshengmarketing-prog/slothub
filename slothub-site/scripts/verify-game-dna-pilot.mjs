import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { buildGameDnaPilot, GAME_DNA_PILOT_SLUG } from '../src/lib/game-dna-pilot.mjs';

const gamesDirectory = fileURLToPath(new URL('../src/content/games/', import.meta.url));
const distGamesDirectory = fileURLToPath(new URL('../dist/games/', import.meta.url));
const files = (await readdir(gamesDirectory)).filter((file) => file.endsWith('.md')).sort();
const records = await Promise.all(files.map(async (file) => {
  const raw = await readFile(join(gamesDirectory, file), 'utf8');
  const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${file}: missing frontmatter`);
  return { slug: basename(file, '.md'), data: parse(frontmatter) };
}));

const published = records.filter((record) => record.data.status === 'published');
assert.equal(published.length, 34, 'expected 34 published Games');
assert.equal(GAME_DNA_PILOT_SLUG, 'mahjong-ways');

const presentations = published.map((record) => ({
  slug: record.slug,
  presentation: buildGameDnaPilot(record.slug, record.data),
}));
const rendered = presentations.filter(({ presentation }) => presentation);
assert.deepEqual(rendered.map(({ slug }) => slug), ['mahjong-ways'], 'DNA Pilot must render for Mahjong Ways only');

const mahjong = published.find((record) => record.slug === GAME_DNA_PILOT_SLUG);
assert.ok(mahjong, 'Mahjong Ways record missing');
const dna = buildGameDnaPilot(mahjong.slug, mahjong.data);
assert.equal(dna.gameplay.mechanism, mahjong.data.winMechanism);
assert.equal(dna.gameplay.winCount, mahjong.data.winCount);
assert.equal(dna.gameplay.reels, mahjong.data.reels);
assert.deepEqual(dna.gameplay.features, mahjong.data.features);
assert.equal(dna.rtp.primary, mahjong.data.rtp);
assert.deepEqual(dna.rtp.values, mahjong.data.rtpVariants);
assert.equal(dna.rtp.values.length, 7);
assert.equal(dna.labels.volatilityOriginal, mahjong.data.volatilityOriginal);
assert.equal(dna.labels.volatilityNormalized, mahjong.data.volatilityNormalized);
assert.equal(dna.labels.maxWinMultiplier, mahjong.data.maxWinMultiplier);
assert.equal(dna.labels.maxWinOriginal, mahjong.data.maxWinLabelOriginal);
assert.equal(dna.trust.sourceCount, mahjong.data.sources.length);
assert.equal(String(dna.trust.lastVerifiedAt).slice(0, 10), String(mahjong.data.lastVerifiedAt).slice(0, 10));
assert.equal(buildGameDnaPilot(GAME_DNA_PILOT_SLUG, { ...mahjong.data, status: 'draft' }), undefined, 'draft Pilot record must not render');

let builtModuleCount = 0;
for (const game of published) {
  const html = await readFile(join(distGamesDirectory, game.slug, 'index.html'), 'utf8');
  const hasModule = html.includes('data-game-dna-pilot=');
  if (hasModule) builtModuleCount += 1;
  assert.equal(hasModule, game.slug === GAME_DNA_PILOT_SLUG, `${game.slug}: DNA visibility mismatch`);
  if (game.slug !== GAME_DNA_PILOT_SLUG) {
    assert.ok(!html.includes('id="game-dna-title"'), `${game.slug}: empty DNA structure rendered`);
  }
}
assert.equal(builtModuleCount, 1);

const html = await readFile(join(distGamesDirectory, GAME_DNA_PILOT_SLUG, 'index.html'), 'utf8');
assert.ok(html.indexOf('class="game-core-stats"') < html.indexOf('class="game-dna-pilot"'), 'DNA must follow core stats');
assert.ok(html.indexOf('class="game-dna-pilot"') < html.indexOf('class="game-data-section"'), 'DNA must precede full data');
assert.match(html, /把同一筆遊戲資料中的玩法、版本與來源放在一起讀；這不是評分或推薦。/);
assert.match(html, /主要顯示值/);
assert.match(html, /已收錄數值<\/dt><dd>7 個/);
assert.match(html, /Session Volatility: Medium/);
assert.match(html, /Theoretical Maximum Win \/ Max Win \(Advertised Value\): 25,000x/);
assert.match(html, /數字較大不代表較容易取得/);
assert.match(html, /第一方來源<\/dt><dd>4 筆/);
assert.match(html, /最後核對<\/dt><dd>2026-08-29/);
assert.match(html, /href="#full-data-title"/);
assert.match(html, /href="#similar-play-title"/);
assert.match(html, /href="\/guide\/slot-hub-data-methodology\/"/);
assert.doesNotMatch(html, /DNA 分數|完整度百分比|推薦指數|最值得玩|容易贏/);

const pageSource = await readFile(new URL('../src/pages/games/[slug].astro', import.meta.url), 'utf8');
assert.match(pageSource, /buildGameDnaPilot\(entry\.id, entry\.data\)/, 'DNA must project from the current Game record');
assert.doesNotMatch(pageSource, /gameDna[^\n]*(score|rating|percent)/i, 'DNA must not calculate scores');

const styles = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
assert.match(styles, /\.game-dna-band\{[^}]*grid-template-columns:1fr \.82fr 1\.28fr \.9fr/, 'desktop DNA band must use four readable groups');
assert.match(styles, /@media\(max-width:620px\)[^{]*\{\.game-dna-pilot[^}]*[\s\S]*?\.game-dna-band\{[^}]*grid-template-columns:minmax\(0,1fr\)/, 'mobile DNA must reflow to one column');
assert.match(styles, /\.game-dna-trust a\{[^}]*min-height:44px/, 'DNA links must preserve 44px touch targets');
assert.match(styles, /@media\(forced-colors:active\)[^{]*\{\.game-dna-band/, 'forced-colors support missing');
assert.match(styles, /@media print\{\.game-dna-pilot/, 'print support missing');

console.log('PASS: Mahjong Ways is the only Game DNA Pilot; all values derive from its published record, with semantic, responsive and no-score safeguards.');
