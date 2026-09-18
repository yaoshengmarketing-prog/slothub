import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { buildGameDetailPresentation, GAME_DETAIL_QUICK_KEYS } from '../src/lib/game-detail-presentation.mjs';

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

assert.equal(published.length, 217, 'expected 217 published Games');
assert.deepEqual(GAME_DETAIL_QUICK_KEYS, ['mechanism', 'rtp', 'volatility', 'max-win']);

for (const { slug, data } of published) {
  const presentation = buildGameDetailPresentation(data);
  assert.ok(presentation, `${slug}: shared presentation missing`);
  assert.deepEqual(presentation.operation.features, [...new Set(data.features ?? [])], `${slug}: features must derive from the Game record`);
  assert.deepEqual(presentation.operation.ruleNotes, [...new Set(data.bonusFeatures ?? [])], `${slug}: rule notes must derive from the Game record`);
  assert.equal(presentation.quick.mechanism.known, Boolean(data.winMechanism && data.winMechanism !== 'other'), `${slug}: mechanism state mismatch`);
  assert.equal(presentation.quick.rtp.known, data.rtp !== undefined, `${slug}: RTP state mismatch`);
  assert.equal(presentation.quick.volatility.known, Boolean(data.volatilityNormalized ?? data.volatility), `${slug}: volatility state mismatch`);
  assert.equal(presentation.quick.maxWin.known, data.maxWinMultiplier !== undefined, `${slug}: Max Win state mismatch`);
  assert.equal(presentation.trust.sourceCount, data.sources?.length || (data.source ? 1 : 0), `${slug}: source count mismatch`);

  const html = await readFile(join(distGamesDirectory, slug, 'index.html'), 'utf8');
  const positions = [
    html.indexOf('class="game-file-hero"'),
    html.indexOf('class="game-quick-read"'),
    html.indexOf('class="game-operation"'),
    html.indexOf('class="game-data-section"'),
    html.indexOf('class="game-next-explore"'),
    html.indexOf('class="game-guide-rail"'),
    html.indexOf('class="game-sources"'),
  ].filter((position) => position >= 0);
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b), `${slug}: shared reading order changed`);
  assert.equal((html.match(/class="game-quick-read"/g) ?? []).length, 1, `${slug}: quick read must render once`);
  assert.equal((html.match(/<dt>(主要玩法|主要 RTP|統一波動度|最高倍數)<\/dt>/g) ?? []).length, 4, `${slug}: quick read must expose four fields`);
  assert.equal((html.match(/class="game-operation"/g) ?? []).length, 1, `${slug}: operation section must render once`);
  assert.equal((html.match(/class="game-data-section"/g) ?? []).length, 1, `${slug}: full data section must render once`);
  assert.ok(!html.includes('game-dna-pilot') && !html.includes('遊戲 DNA'), `${slug}: single-game DNA Pilot leaked`);
}

const mahjong = published.find((record) => record.slug === 'mahjong-ways');
const bigBass = published.find((record) => record.slug === 'big-bass-bonanza');
assert.ok(mahjong && bigBass, 'representative Games missing');
const mahjongPresentation = buildGameDetailPresentation(mahjong.data);
const bigBassPresentation = buildGameDetailPresentation(bigBass.data);
assert.equal(mahjongPresentation.full.rtpValues.length, 7, 'Mahjong Ways must retain seven collected RTP values');
assert.equal(mahjongPresentation.quick.rtp.additionalVariantCount, 6, 'Mahjong Ways quick read must count only additional RTP values');
assert.equal(bigBassPresentation.quick.volatility.known, false, 'Big Bass volatility must remain unknown');
assert.equal(bigBassPresentation.quick.maxWin.known, false, 'Big Bass Max Win must remain unknown');
assert.equal(bigBassPresentation.full.bonusBuy, undefined, 'Big Bass Bonus Buy must remain unknown');

const mahjongHtml = await readFile(join(distGamesDirectory, 'mahjong-ways', 'index.html'), 'utf8');
const bigBassHtml = await readFile(join(distGamesDirectory, 'big-bass-bonanza', 'index.html'), 'utf8');
for (const text of ['快速看懂', '這款怎麼運作', '完整資料與版本', 'Slot Hub 已收錄的 RTP 版本', '查看 7 個已收錄數值', '接著探索', '資料來源與可信度']) {
  assert.ok(mahjongHtml.includes(text), `Mahjong Ways: missing ${text}`);
}
assert.ok(mahjongHtml.includes('另有 6 個已收錄數值'), 'Mahjong Ways: quick RTP count mismatch');
for (const text of ['統一波動度</dt><dd class="is-unknown">尚未核實', '最高倍數</dt><dd class="is-unknown">尚未核實', 'Bonus Buy</dt><dd class="is-unknown">尚未核實']) {
  assert.ok(bigBassHtml.includes(text), `Big Bass Bonanza: missing honest unknown state ${text}`);
}
assert.doesNotMatch(mahjongHtml + bigBassHtml, /DNA 分數|完整度百分比|推薦指數|最值得玩|容易贏/);

const pageSource = await readFile(new URL('../src/pages/games/[slug].astro', import.meta.url), 'utf8');
assert.match(pageSource, /buildGameDetailPresentation\(entry\.data\)/, 'shared presentation must project from the current Game record');
assert.doesNotMatch(pageSource, /GAME_DNA_PILOT_SLUG|buildGameDnaPilot|data-game-dna-pilot/, 'single-game Pilot code must be removed');

const styles = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
assert.match(styles, /\.game-quick-read>dl\{[^}]*grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/, 'desktop quick read must expose four readable fields');
assert.match(styles, /@media\(max-width:620px\)[^{]*\{\.game-quick-read[^}]*[\s\S]*?\.game-data-ledger>div\{[^}]*grid-template-columns:/, 'mobile shared presentation must reflow safely');
assert.match(styles, /@media\(forced-colors:active\)\{\.game-quick-read/, 'forced-colors support missing');
assert.match(styles, /@media print\{\.game-quick-read/, 'print support missing');

console.log('PASS: shared Game detail presentation renders for 217 Games; Mahjong Ways complete data and Big Bass Bonanza honest missing states verified.');
