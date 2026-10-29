import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const directRunner = fileURLToPath(new URL('./run-package-script.mjs', import.meta.url));
const args = [directRunner, 'verify:all'];

function run(cwd, env) {
  return spawnSync(process.execPath, args, {
    cwd,
    env,
    stdio: 'inherit',
    shell: false,
  });
}

if (process.platform !== 'win32' || process.env.SLOTHUB_ASCII_WORKDIR === '1') {
  const result = run(process.cwd(), process.env);
  process.exit(result.status ?? 1);
}

const mappedDrives = String(spawnSync('subst', [], { encoding: 'utf8' }).stdout);
const drive = Array.from('STUVWXYZ').find((letter) => !mappedDrives.includes(`${letter}:`) && !existsSync(`${letter}:\\`));

if (!drive) {
  throw new Error('No free ASCII drive letter is available for verification.');
}

const mappedPath = `${drive}:`;
const mapping = spawnSync('subst', [mappedPath, process.cwd()], { encoding: 'utf8' });
if (mapping.status !== 0) {
  throw new Error(`Unable to create temporary verification mapping ${mappedPath}.`);
}

try {
  const result = run(`${mappedPath}\\`, { ...process.env, SLOTHUB_ASCII_WORKDIR: '1' });
  process.exitCode = result.status ?? 1;
} finally {
  spawnSync('subst', [mappedPath, '/D'], { stdio: 'ignore' });
}
