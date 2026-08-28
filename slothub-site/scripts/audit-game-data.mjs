import { readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const gamesDirectory = fileURLToPath(new URL('../src/content/games/', import.meta.url));
const files = readdirSync(gamesDirectory).filter((file) => file.endsWith('.md')).sort();
const records = files.map((file) => {
  const raw = readFileSync(join(gamesDirectory, file), 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`${file}: missing YAML frontmatter`);
  return { slug: basename(file, '.md'), file, data: parse(match[1]) };
});

const fields = [
  'rtpVariants', 'volatilityOriginal', 'volatilityNormalized', 'maxWinMultiplier',
  'reels', 'rows', 'winMechanism', 'winCount', 'features', 'bonusBuy',
  'jackpotType', 'minBet', 'maxBet', 'releaseDate', 'gameId', 'sources', 'lastVerifiedAt',
];
const normalizedVolatilities = new Set(['low', 'medium', 'medium-high', 'high', 'very-high']);
const winMechanisms = new Set(['paylines', 'ways-to-win', 'megaways', 'cluster-pays', 'other']);
const features = new Set([
  'free-spins', 'wild', 'scatter', 'multiplier', 'hold-and-spin', 'cascading', 'bonus-buy',
  'respins', 'cash-collection', 'giant-symbols', 'symbol-splitting', 'sticky-symbols', 'jackpot', 'other',
]);
const jackpotTypes = new Set(['none', 'fixed', 'progressive', 'local', 'networked', 'multiple', 'other']);
const errors = [];

const present = (value) => value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0);
const fail = (record, message) => errors.push(`${record.file}: ${message}`);

for (const record of records) {
  const game = record.data;
  if (present(game.rtpVariants) && !Array.isArray(game.rtpVariants)) fail(record, 'rtpVariants must be an array');
  else if (Array.isArray(game.rtpVariants)) {
    if (new Set(game.rtpVariants).size !== game.rtpVariants.length) fail(record, 'rtpVariants contains duplicates');
    if (game.rtpVariants.some((value) => typeof value !== 'number' || value < 0 || value > 100)) fail(record, 'rtpVariants must contain percentages from 0 to 100');
    if (present(game.rtp) && game.rtpVariants.length > 1 && !game.rtpVariants.includes(game.rtp)) fail(record, 'multi-version rtpVariants must include the primary rtp');
  }
  if (present(game.volatilityNormalized) && !normalizedVolatilities.has(game.volatilityNormalized)) fail(record, 'invalid volatilityNormalized');
  if (present(game.volatility) && present(game.volatilityNormalized) && game.volatility !== game.volatilityNormalized) fail(record, 'legacy volatility and volatilityNormalized disagree');
  if (present(game.winMechanism) && !winMechanisms.has(game.winMechanism)) fail(record, 'invalid winMechanism');
  if (present(game.jackpotType) && !jackpotTypes.has(game.jackpotType)) fail(record, 'invalid jackpotType');
  if (present(game.features) && !Array.isArray(game.features)) fail(record, 'features must be an array');
  else if (Array.isArray(game.features)) for (const feature of game.features) if (!features.has(feature)) fail(record, `unsupported feature tag: ${feature}`);
  for (const field of ['maxWinMultiplier', 'rows', 'winCount', 'minBet', 'maxBet']) {
    if (present(game[field]) && (typeof game[field] !== 'number' || game[field] < 0)) fail(record, `${field} must be a non-negative number`);
  }
  if (present(game.minBet) && present(game.maxBet) && game.minBet > game.maxBet) fail(record, 'minBet cannot exceed maxBet');
  if (game.bonusBuy !== undefined && typeof game.bonusBuy !== 'boolean') fail(record, 'bonusBuy must be boolean when known');
  if (present(game.sources) && !Array.isArray(game.sources)) fail(record, 'sources must be an array');
  else if (Array.isArray(game.sources)) for (const source of game.sources) {
    if (!source?.label || !source?.url || !source?.checkedAt) fail(record, 'each source needs label, url and checkedAt');
    else {
      try { new URL(source.url); } catch { fail(record, `invalid source URL: ${source.url}`); }
    }
  }
}

const coverage = Object.fromEntries(fields.map((field) => {
  const count = records.filter((record) => present(record.data[field])).length;
  return [field, { count, total: records.length, percentage: Math.round((count / records.length) * 100) }];
}));

console.log(`Audited ${records.length} game records.`);
console.table(coverage);
if (records.length !== 12) errors.push(`expected 12 game records, found ${records.length}`);
if (errors.length) {
  console.error(`\n${errors.length} data validation error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('Game data model v1 validation passed.');
}
