import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const prefix = 'reviews/game-media-pilot-20261029/';
const checks = [];
const check = (name, condition) => { assert.ok(condition, name); checks.push(name); };
const nonMedia = html => html
  .replace(/<section class="gm"[\s\S]*?<\/section>/, '')
  .replace(/<script>const gm=document\.querySelector\('\.gm'\);[\s\S]*?<\/script>/, '')
  .replace('<script src="media.js" defer></script>', '').replace(/\r\n/g, '\n');

for (const slug of ['densho', 'razor-shark']) {
  const html = readFileSync(root + slug + '.html', 'utf8');
  const previous = execFileSync('git', ['show', 'f25b4674f9006948c6818f5b0dd0bc0900d5d043:' + prefix + slug + '.html'], { encoding: 'utf8' });
  check(slug + ': non-media snapshot unchanged', nonMedia(html) === nonMedia(previous));
  check(slug + ': shared media script exactly once', html.split('src="media.js"').length === 2);
  check(slug + ': no initial player iframe', !/<iframe\b/i.test(html));
  check(slug + ': independent external Demo retained', /class="game-demo-access"[\s\S]*?target="_blank"/.test(html));
  check(slug + ': review noindex retained', html.includes('content="noindex,nofollow"'));
}
const densho = readFileSync(root + 'densho.html', 'utf8');
const razor = readFileSync(root + 'razor-shark.html', 'utf8');
check('Densho: no embed load control', !densho.includes('class="gm-load"'));
check('Razor: verified click-load control and fallback', razor.includes('data-video="494271522"') && razor.includes('https://vimeo.com/494271522'));
const source = readFileSync(root + 'media.js', 'utf8');
check('shared script does not fetch or preload player', !/\bfetch\s*\(|\bXMLHttpRequest\b|\bpreload\b/.test(source));
console.log(JSON.stringify({ type: 'static scope and safety checks; not a browser test', checks, passed: checks.length }, null, 2));
