import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { parse } from 'yaml';
import { projectGameMedia, vimeoPlayerUrl } from '../src/lib/game-media.mjs';

const registry = JSON.parse(await readFile(new URL('../data/game-media.json', import.meta.url), 'utf8'));
const isProduction = process.env.PUBLIC_SITE_ENV === 'production';
const gameDir = new URL('../src/content/games/', import.meta.url);
const games = await Promise.all((await readdir(gameDir)).filter(f => f.endsWith('.md')).map(async file => ({
  slug: file.slice(0, -3), data: parse((await readFile(new URL(file, gameDir), 'utf8')).match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]),
})));
const allIds = registry.items.map(item => item.id);
assert.equal(new Set(allIds).size, allIds.length);
for (const item of registry.items) {
  assert.ok(['densho', 'razor-shark'].includes(item.gameSlug), 'This batch must remain limited to two Games');
  assert.ok(registry.sources.some(source => source.id === item.sourceId));
  assert.ok(registry.usageBases.some(basis => basis.id === item.usageBasisId));
  assert.ok(item.purpose && item.scopeNote && Object.hasOwn(item, 'mode') && Object.hasOwn(item, 'version'));
  assert.ok(item.checks.content && item.checks.sourcePlayback && item.checks.embed);
  if (item.kind === 'video') assert.equal(new URL(item.url).origin, 'https://vimeo.com');
}
for (const game of games) {
  const items = projectGameMedia(game.slug, game.data.mediaIds);
  assert.ok(items.filter(item => item.kind === 'video').length <= 2);
  if (!['densho', 'razor-shark'].includes(game.slug)) assert.deepEqual(items, []);
}
assert.deepEqual(projectGameMedia('densho', ['densho-board']), [], 'Unknown image use must stay private');
assert.equal(projectGameMedia('densho', ['densho-free-spins-video'])[0].presentation, 'external');
assert.equal(projectGameMedia('razor-shark', ['razor-reveal-video'])[0].playerUrl, vimeoPlayerUrl('494271522'));
assert.throws(() => projectGameMedia('densho', ['razor-reveal-video']));
assert.throws(() => projectGameMedia('densho', ['missing']));
assert.throws(() => projectGameMedia('densho', ['densho-board', 'densho-board']));
assert.throws(() => vimeoPlayerUrl('1?autoplay=1'));
assert.ok(vimeoPlayerUrl('12345').includes('/12345?'), 'Player ID must be data-driven, not one-game hard-coded');

const fixture = structuredClone(registry);
fixture.usageBases.find(item => item.id === 'hacksaw-image-pending').status = 'local-test';
assert.deepEqual(projectGameMedia('densho', ['densho-board'], fixture), [], 'Local test data must not pass public projection');
assert.equal(projectGameMedia('densho', ['densho-board'], fixture, { localTest: true }).length, 1);
fixture.items.find(item => item.id === 'densho-free-spins-video').enabled = false;
assert.equal(projectGameMedia('densho', ['densho-board', 'densho-free-spins-video'], fixture, { localTest: true }).length, 1, 'Image-only must work');
assert.deepEqual(projectGameMedia('densho', [], fixture), [], 'No material must not create a module');
fixture.items.find(item => item.id === 'densho-free-spins-video').enabled = true;
fixture.items.find(item => item.id === 'densho-free-spins-video').checks.content.status = 'not-tested';
assert.deepEqual(projectGameMedia('densho', ['densho-free-spins-video'], fixture), [], 'Unwatched content must stay private');
fixture.items.find(item => item.id === 'razor-reveal-video').checks.embed.status = 'restricted';
assert.deepEqual(projectGameMedia('razor-shark', ['razor-reveal-video'], fixture), []);
fixture.items.find(item => item.id === 'razor-reveal-video').presentation = 'external';
assert.equal(projectGameMedia('razor-shark', ['razor-reveal-video'], fixture)[0].presentation, 'external', 'Verified external fallback must remain possible');
assert.ok(!registry.usageBases.some(item => item.status === 'local-test'), 'Temporary browser fixtures were not restored');

if (process.argv.includes('--built')) {
  for (const { slug, data } of games.filter(game => game.data.status === 'published')) {
    const html = await readFile(new URL(`../dist/games/${slug}/index.html`, import.meta.url), 'utf8');
    const module = html.match(/<section[^>]*data-game-media[^>]*>[\s\S]*?<\/section>/)?.[0] ?? '';
    const expected = projectGameMedia(slug, data.mediaIds);
    assert.equal(Boolean(module), expected.length > 0, `${slug}: empty or missing media module`);
    assert.doesNotMatch(module, /<iframe\b/, `${slug}: must not create player before click`);
    assert.equal((module.match(/class="gm-image"/g) ?? []).length,
      expected.filter(item => item.kind === 'image').length, `${slug}: public image adoption mismatch`);
    for (const item of expected) {
      assert.ok(module.includes(item.title), `${slug}: approved media title missing`);
      assert.ok(module.includes(item.purpose), `${slug}: media purpose differs from adoption`);
      if (item.kind === 'video') assert.ok(module.includes(`href="${item.url}"`), `${slug}: external fallback missing`);
      if (item.playerUrl) assert.ok(module.includes(`data-player-url="${item.playerUrl.replaceAll('&', '&amp;')}"`), `${slug}: approved player URL mismatch`);
    }
    assert.equal((module.match(/class="gm-load"/g) ?? []).length,
      expected.filter(item => item.playerUrl).length, `${slug}: incorrect player controls`);
    if (module) {
      assert.ok(html.indexOf('game-quick-read') < html.indexOf('data-game-media'));
      assert.ok(html.indexOf('data-game-media') < html.indexOf('game-demo-access'));
      assert.match(html, /AddCompareButton/);
      if (isProduction) {
        assert.match(html, /name="robots" content="index,follow"/, `${slug}: production Game indexing changed`);
        assert.ok(html.includes(`rel="canonical" href="https://www.slothub.com.tw/games/${slug}/"`), `${slug}: production canonical missing`);
      } else {
        assert.match(html, /name="robots" content="noindex,nofollow"/, `${slug}: preview noindex missing`);
        assert.doesNotMatch(html, /rel="canonical"/, `${slug}: preview must omit canonical`);
      }
    }
  }
  // Check public artifacts, not only visible markup: local fixtures and withheld
  // image records must not leak via JS, JSON, CSS, or another generated page.
  async function verifyPublicFiles(directory) {
    for (const item of await readdir(directory, { withFileTypes: true })) {
      assert.notEqual(item.name, '__media-test', 'Local test image directory leaked');
      const url = new URL(item.name + (item.isDirectory() ? '/' : ''), directory);
      if (item.isDirectory()) await verifyPublicFiles(url);
      else if (/\.(html|js|mjs|json|css|txt|xml)$/.test(item.name)) {
        const text = await readFile(url, 'utf8');
        assert.doesNotMatch(text, /__media-test|game-media-fixture-original|LOCAL TEST ONLY|hacksaw-image-pending|push-image-pending|Razor-Reveal-min\.png/,
          `${url.pathname}: private media or fixture data leaked`);
      }
    }
  }
  await verifyPublicFiles(new URL('../dist/', import.meta.url));
}
console.log(`PASS: optional Game media ownership, usage isolation, independent checks, data-driven player, fallback and ${process.argv.includes('--built') ? (isProduction ? 'production' : 'preview') + ' built output' : 'projection'} verified.`);
