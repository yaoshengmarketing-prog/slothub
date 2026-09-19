import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportPath = path.join(root, 'data', 'game-demo-coverage.json');
const gameDirectory = path.join(root, 'src', 'content', 'games');
const report = JSON.parse(await readFile(reportPath, 'utf8'));

function gameDemo(entry) {
  const output = {
    status: entry.status,
    checkedAt: entry.checkedAt,
    iframeStatus: entry.iframeStatus ?? 'not-tested',
  };
  if (entry.url) output.url = entry.url;
  if (entry.accessType) output.accessType = entry.accessType;
  if (entry.platformName) output.platformName = entry.platformName;
  if (entry.status === 'available') output.presentation = 'external';
  if (entry.note) output.note = entry.note;
  else if (entry.status === 'access-restricted') output.note = 'Saved source was access-restricted during the coverage audit.';
  return output;
}

let changed = 0;
for (const entry of report.entries) {
  const file = path.join(gameDirectory, `${entry.slug}.md`);
  const raw = await readFile(file, 'utf8');
  const line = `demo: ${JSON.stringify(gameDemo(entry))}`;
  const next = /^demo: .*$/m.test(raw)
    ? raw.replace(/^demo: .*$/m, line)
    : raw.replace(/^(lastVerifiedAt:|updatedAt:)/m, `${line}\n$1`);
  if (next === raw && /^demo: .*$/m.test(raw)) continue;
  if (next === raw) throw new Error(`${entry.slug}: no insertion point for Demo coverage`);
  await writeFile(file, next, 'utf8');
  changed += 1;
}

console.log(`Applied Demo coverage to ${changed} Game records.`);
