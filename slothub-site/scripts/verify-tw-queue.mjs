import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const queueDirectory = new URL('../data/tw-casino-queue/', import.meta.url);
const gamesDirectory = new URL('../src/content/games/', import.meta.url);
const providerDataDirectory = new URL('provider-data/', queueDirectory);
const header = 'queue_id,master_id,zh_name,provider,type,provider_tier,provider_casino_count,game_casino_count,lobby_clicks_sum,work_type,slothub_slug,queue_state,blocker,pr,updated_at,note'.split(',');
const stateCounts = new Map(['todo', 'in_progress', 'pr_open', 'done', 'blocked', 'skipped'].map((state) => [state, 0]));
const workTypes = new Set(['existing-check', 'existing-enrich', 'new-page', 'msi-draft', 'rg-candidate']);
const providerTiers = new Set(['A', 'B', 'C', 'D']);
const blockerPattern = /^(no-official-page|no-official-image|demo-unavailable|name-uncertain|provider-unconfirmed|duplicate-ambiguous|source-geo-blocked|other): \S/;
const blockerCounts = new Map();
const providersByQueueId = new Map();
// Built from pieces so this file itself never contains the banned strings.
const forbiddenText = new RegExp(['slot-demo\\.tw', 'rg' + 'slot', 'rg' + 'go', 'Join\\?ag='].join('|'), 'i');
const urlPattern = /https?:\/\/|www\.|[a-z0-9]\.(?:com|net|bet|tw|org|io|co|info|biz|me|dev|app|xyz|casino|games|cc|uk|jp|kr)(?![a-z0-9_-])/i;
const errors = [];

function* parseCsv(csv) {
  // Match one field and its delimiter, starting at the previous match's end.
  const fieldPattern = /(?:"((?:[^"]|"")*)"|([^",\r\n]*))(,|\r\n|\r|\n|$)/y;
  let fields = [];
  let line = 1;
  let rowLine = 1;
  let hasMoreFields = false;
  while (fieldPattern.lastIndex < csv.length || hasMoreFields) {
    const match = fieldPattern.exec(csv);
    if (!match) {
      throw new Error(`line ${line}: malformed CSV field`);
    }

    const [raw, quoted, unquoted, delimiter] = match;
    fields.push(quoted === undefined ? unquoted : quoted.replaceAll('""', '"'));
    line += (raw.match(/\r\n|\r|\n/g) ?? []).length;

    hasMoreFields = delimiter === ',';
    if (!hasMoreFields) {
      yield { fields, line: rowLine };
      fields = [];
      rowLine = line;
    }
  }
}

function checkText(filename, content, checkForbiddenText) {
  for (const [index, line] of content.split(/\r\n|\r|\n/).entries()) {
    const location = `${filename}:${index + 1}`;
    if (checkForbiddenText && forbiddenText.test(line)) {
      errors.push(`${location}: forbidden text`);
    }
    if (urlPattern.test(line)) {
      errors.push(`${location}: URL or domain is not allowed`);
    }
  }
}

function verifyQueue(csv) {
  const rows = parseCsv(csv);
  const firstRow = rows.next().value;
  if (firstRow?.fields.length !== header.length ||
      !header.every((name, index) => firstRow.fields[index] === name)) {
    errors.push('queue.csv:1: header does not match the expected columns');
    return 0;
  }

  const doneSlugs = new Set();
  const gameFiles = new Set(readdirSync(gamesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile()).map((entry) => entry.name));
  let rowCount = 0;

  for (const { fields, line } of rows) {
    rowCount += 1;
    const location = `queue.csv:${line}`;
    if (fields.length !== header.length) {
      errors.push(`${location}: expected ${header.length} fields, got ${fields.length}`);
      continue;
    }

    const [id, , , provider, , tier, , , , workType, slug, state, blocker, pr, , note] = fields;
    if (!/^Q\d{5}$/.test(id)) errors.push(`${location}: invalid queue_id`);
    if (providersByQueueId.has(id)) errors.push(`${location}: duplicate queue_id`);
    providersByQueueId.set(id, provider);
    if (!workTypes.has(workType)) errors.push(`${location}: invalid work_type`);
    if (!providerTiers.has(tier)) errors.push(`${location}: invalid provider_tier`);

    if (stateCounts.has(state)) {
      stateCounts.set(state, stateCounts.get(state) + 1);
    } else {
      errors.push(`${location}: invalid queue_state`);
    }

    if (state === 'blocked') {
      const match = blockerPattern.exec(blocker);
      if (match) {
        const category = match[1];
        blockerCounts.set(category, (blockerCounts.get(category) ?? 0) + 1);
      } else {
        errors.push(`${location}: blocked requires blocker in "<category>: <detail>" format`);
      }
    }
    if (state === 'skipped' && !note.trim()) errors.push(`${location}: skipped requires note`);
    if ((state === 'pr_open' || state === 'done') && !pr.trim()) {
      errors.push(`${location}: ${state} requires pr`);
    }

    if (state === 'done') {
      if (!slug.trim() || !(gameFiles.has(`${slug}.md`) || gameFiles.has(`${slug}.mdx`))) {
        errors.push(`${location}: done requires an existing game file for slothub_slug`);
      }
      if (slug && doneSlugs.has(slug)) errors.push(`${location}: duplicate done slothub_slug`);
      doneSlugs.add(slug);
    }
  }

  return rowCount;
}

function readQueueFile(filename) {
  try {
    return readFileSync(new URL(filename, queueDirectory), 'utf8');
  } catch (error) {
    errors.push(`${filename}: ${error.message}`);
    return null;
  }
}

function checkHttpsUrl(value, location) {
  if (value !== null &&
      (typeof value !== 'string' || !/^https:\/\//i.test(value) || !URL.canParse(value))) {
    errors.push(`${location}: expected null or an HTTPS URL`);
  }
}

function containsCasinoUrl(content, casinoHostHashes) {
  for (const [, candidate] of content.matchAll(/(?=(https?:\/\/[^\s"'<>]+))/gi)) {
    const url = URL.parse(candidate.replace(/[),.;\]}，。]+$/u, ''));
    const hostname = url?.hostname.toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
    if (!hostname) continue;

    const labels = hostname.split('.');
    for (const [index] of labels.entries()) {
      const domain = labels.slice(index).join('.');
      const hash = createHash('sha256').update(domain).digest('hex');
      if (casinoHostHashes.has(hash)) return true;
    }
  }
  return false;
}

function verifyProviderData() {
  let entries;
  try {
    entries = readdirSync(providerDataDirectory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
  const filenames = entries.filter((entry) => entry.name.endsWith('.json')).map((entry) => entry.name).sort();
  if (!filenames.length) return;

  const hashFile = readQueueFile('casino-host-hashes.json');
  if (hashFile === null) return;
  const hashes = JSON.parse(hashFile);
  if (!Array.isArray(hashes) || !hashes.every((hash) => typeof hash === 'string' && /^[a-f0-9]{64}$/.test(hash))) {
    throw new Error('casino-host-hashes.json: expected an array of SHA-256 hex digests');
  }
  const casinoHostHashes = new Set(hashes);
  const queueIdLocations = new Map();

  for (const filename of filenames) {
    const location = `provider-data/${filename}`;
    const content = readQueueFile(location);
    if (content === null) continue;
    const texts = [content];
    if (forbiddenText.test(content)) errors.push(`${location}: forbidden text`);
    let data;
    try {
      data = JSON.parse(content, (key, value) => {
        texts.push(key);
        if (typeof value === 'string') texts.push(value);
        return value;
      });
    } catch {
      errors.push(`${location}: invalid JSON`);
      continue;
    }

    // Scan both the source and decoded strings so JSON escapes cannot hide URLs or banned text.
    if (!forbiddenText.test(content) && texts.some((value) => forbiddenText.test(value))) {
      errors.push(`${location}: forbidden text`);
    }
    if (texts.some((value) => containsCasinoUrl(value, casinoHostHashes))) {
      errors.push(`${location}: casino domain not allowed`);
    }

    if (typeof data?.provider !== 'string' || typeof data.harvestedAt !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data.harvestedAt) ||
        !Array.isArray(data.catalogSources) || !Array.isArray(data.games)) {
      errors.push(`${location}: expected provider, harvestedAt (YYYY-MM-DD), catalogSources and games`);
      continue;
    }

    for (const [index, source] of data.catalogSources.entries()) {
      checkHttpsUrl(source, `${location}: catalogSources[${index}]`);
    }
    for (const [index, game] of data.games.entries()) {
      const gameLocation = `${location}: games[${index}]`;
      if (!Array.isArray(game?.queueIds) || !game.queueIds.length ||
          typeof game.officialName !== 'string' || !game.officialName.trim() ||
          !['high', 'medium', 'low'].includes(game.matchConfidence)) {
        errors.push(`${gameLocation}: expected non-empty queueIds, officialName and valid matchConfidence`);
        continue;
      }
      for (const field of ['officialPageUrl', 'officialImageUrl', 'demoUrl']) {
        checkHttpsUrl(game[field], `${gameLocation}.${field}`);
      }
      for (const id of game.queueIds) {
        if (!providersByQueueId.has(id)) {
          errors.push(`${gameLocation}: unknown queue_id`);
          continue;
        }
        if (providersByQueueId.get(id) !== data.provider) {
          errors.push(`${gameLocation}: ${id} belongs to a different provider`);
        }
        if (queueIdLocations.has(id)) {
          errors.push(`${gameLocation}: duplicate queue_id ${id}, first seen at ${queueIdLocations.get(id)}`);
        } else {
          queueIdLocations.set(id, gameLocation);
        }
      }
    }
  }
}

const csv = readQueueFile('queue.csv');
const readme = readQueueFile('README.md');
let rowCount = 0;
if (readme !== null) checkText('README.md', readme, false);
if (csv !== null) {
  checkText('queue.csv', csv, true);
  try {
    rowCount = verifyQueue(csv);
  } catch (error) {
    errors.push(`queue.csv: ${error.message}`);
  }
}

try {
  verifyProviderData();
} catch (error) {
  errors.push(`provider-data: ${error.message}`);
}

// Include committed branch changes and local edits. Provider JSON files are also
// scanned independently above, including files that Git does not yet track.
if (process.argv.includes('--diff')) {
  for (const range of ['origin/main...HEAD', 'HEAD']) {
    const diff = execFileSync('git', ['diff', range, '--', ':/'], { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 });
    for (const line of diff.split('\n')) {
      if (line.startsWith('+') && !line.startsWith('+++ ') && forbiddenText.test(line)) {
        errors.push(`diff: banned string in added line: ${line.slice(0, 120)}`);
      }
    }
  }
  if (!errors.length) console.log('Branch diff banned-string check passed: 0 matches.');
}

if (errors.length) {
  for (const error of errors.slice(0, 20)) console.error(error);
  console.error(`TW queue verification failed: ${errors.length} error(s) total.`);
  process.exitCode = 1;
} else {
  const counts = Array.from(stateCounts, ([state, count]) => `${state}=${count}`).join(', ');
  console.log(`TW queue verification passed: ${rowCount} rows (${counts}).`);
  const blocked = Array.from(blockerCounts).sort(([left], [right]) => left.localeCompare(right));
  console.log(`Blocked by category: ${blocked.map(([category, count]) => `${category}=${count}`).join(', ') || 'none'}.`);
}
