import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
const scripts = packageJson.scripts ?? {};
const requestedScript = process.argv[2];

if (!requestedScript) {
  throw new Error('Usage: node scripts/run-package-script.mjs <script-name>');
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function runScript(name, stack = []) {
  if (stack.includes(name)) {
    throw new Error(`Recursive package script: ${[...stack, name].join(' -> ')}`);
  }

  const source = scripts[name];
  if (!source) throw new Error(`Unknown package script: ${name}`);

  for (const command of source.split(' && ')) {
    const npmRun = command.match(/^npm run ([^\s]+)$/);
    if (npmRun) {
      runScript(npmRun[1], [...stack, name]);
      continue;
    }

    const [executable, ...args] = command.split(/\s+/);
    if (executable === 'node') {
      run(process.execPath, args);
      continue;
    }

    if (executable === 'astro') {
      run(process.execPath, [resolve('node_modules/astro/bin/astro.mjs'), ...args]);
      continue;
    }

    throw new Error(`Unsupported package command in ${name}: ${command}`);
  }
}

runScript(requestedScript);
