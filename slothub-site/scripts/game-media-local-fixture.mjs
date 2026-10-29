// Temporary local browser fixtures on the real Game route. Never part of a public build.
import { readFile, writeFile, mkdir, rm, rmdir, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const registryPath = new URL('../data/game-media.json', import.meta.url);
const backup = new URL('../.astro/game-media-fixture-original.json', import.meta.url);
const temporaryImage = new URL('../public/__media-test/razor-feature.png', import.meta.url);
const mode = process.argv[2];
if (!['both', 'image-only', 'video-only', 'none', 'disabled', 'external', 'restore'].includes(mode)) throw Error('Choose both, image-only, video-only, none, disabled, external or restore');
let saved;
try { saved = await readFile(backup, 'utf8'); } catch {
  if (mode === 'restore') throw Error('No local fixture backup; nothing to restore');
  saved = await readFile(registryPath, 'utf8');
  await mkdir(new URL('../.astro/', import.meta.url), { recursive: true });
  await writeFile(backup, saved, { flag: 'wx' });
}
if (mode === 'restore') {
  await writeFile(registryPath, saved);
  await rm(temporaryImage, { force: true });
  await rmdir(new URL('../public/__media-test/', import.meta.url));
  await rm(backup);
  console.log('Restored original registry and removed temporary local image');
} else {
  const data = JSON.parse(saved);
  for (const basis of data.usageBases.filter(item => item.status === 'unknown')) {
    basis.status = 'local-test'; basis.note = 'LOCAL TEST ONLY; does not assert public permission';
  }
  for (const item of data.items) {
    if (item.kind === 'image') {
      item.src = item.gameSlug === 'densho' ? '/assets/games/densho.png' : '/__media-test/razor-feature.png';
      item.enabled = ['both', 'image-only', 'disabled', 'external'].includes(mode);
    } else {
      item.enabled = ['both', 'video-only', 'external'].includes(mode);
      if (mode === 'external') item.presentation = 'external';
    }
  }
  await mkdir(new URL('../public/__media-test/', import.meta.url), { recursive: true });
  try { await access(temporaryImage); } catch {
    const image = execFileSync('git', ['show', '1e314894559fc1eaf266a5d2dab2fe850bbfd4c4:reviews/game-media-pilot-20261029/assets/razor-feature.png']);
    await writeFile(temporaryImage, image, { flag: 'wx' });
  }
  await writeFile(registryPath, JSON.stringify(data, null, 2) + '\n');
  console.log(`LOCAL TEST ONLY: ${mode}; requires dev server SLOTHUB_MEDIA_LOCAL_TEST=1. Run restore before verify/build/commit.`);
}
