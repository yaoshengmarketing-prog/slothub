import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const queueDirectory = new URL('../data/tw-casino-queue/', import.meta.url);
const gamesDirectory = new URL('../src/content/games/', import.meta.url);
const header = 'queue_id,master_id,zh_name,provider,type,provider_tier,provider_casino_count,game_casino_count,lobby_clicks_sum,work_type,slothub_slug,queue_state,blocker,pr,updated_at,note'.split(',');
const stateCounts = new Map(['todo', 'in_progress', 'pr_open', 'done', 'blocked', 'skipped'].map((state) => [state, 0]));
const workTypes = new Set(['existing-check', 'existing-enrich', 'new-page', 'msi-draft', 'rg-candidate']);
const providerTiers = new Set(['A', 'B', 'C', 'D']);
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

  const ids = new Set();
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

    const [id, , , , , tier, , , , workType, slug, state, blocker, pr, , note] = fields;
    if (!/^Q\d{5}$/.test(id)) errors.push(`${location}: invalid queue_id`);
    if (ids.has(id)) errors.push(`${location}: duplicate queue_id`);
    ids.add(id);
    if (!workTypes.has(workType)) errors.push(`${location}: invalid work_type`);
    if (!providerTiers.has(tier)) errors.push(`${location}: invalid provider_tier`);

    if (stateCounts.has(state)) {
      stateCounts.set(state, stateCounts.get(state) + 1);
    } else {
      errors.push(`${location}: invalid queue_state`);
    }

    if (state === 'blocked' && !blocker.trim()) errors.push(`${location}: blocked requires blocker`);
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

// --diff: banned strings must not appear in lines this branch adds (git diff origin/main...HEAD).
if (process.argv.includes('--diff')) {
  const diff = execFileSync('git', ['diff', 'origin/main...HEAD'], { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 });
  for (const line of diff.split('\n')) {
    if (line.startsWith('+') && !line.startsWith('+++') && forbiddenText.test(line)) {
      errors.push(`diff: banned string in added line: ${line.slice(0, 120)}`);
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
}
