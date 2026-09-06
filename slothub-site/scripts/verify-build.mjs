import { readFile, stat } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const expectedPages = [
  'index.html',
  '404.html',
  'guide/index.html',
  'games/index.html',
  'providers/index.html',
  'tools/index.html',
  'slots/index.html',
  'fishing-games/index.html',
  'search/index.html',
  'compare/index.html',
  'sitemap.xml',
  'robots.txt',
  '_headers',
];
const expectedMedia = [
  'assets/games/cash-crew.jpg', 'assets/games/chaos-crew.jpg', 'assets/games/hand-of-anubis.jpg',
  'assets/games/fish-tales-double-catch-max-scatter.png', 'assets/games/fortune-paw.png', 'assets/games/greedy-for-gold-hold-and-win.png',
  'assets/games/ragnarok-gold.jpg', 'assets/games/shadow-of-dominion.jpg', 'assets/games/wildhalla.jpg',
  'assets/games/storm-of-seth-2-awakening.webp', 'assets/games/storm-of-seth.webp', 'assets/games/sun-wu-kong.webp',
  'assets/games/fortune-rabbit.png', 'assets/games/dead-or-alive-2.jpg', 'assets/games/temple-tumble.png', 'assets/games/the-great-pigsby-megaways.png',
  'assets/providers/atg-games.png', 'assets/providers/booming-games.svg', 'assets/providers/hacksaw-gaming.png', 'assets/providers/slotmill.png',
  'assets/providers/relax-gaming.svg',
];

const failures = [];

for (const path of expectedPages) {
  try {
    await stat(new URL(path, root));
  } catch {
    failures.push(`Missing build output: ${path}`);
  }
}
for (const path of expectedMedia) {
  try {
    await stat(new URL(path, root));
  } catch {
    failures.push(`Missing media output: ${path}`);
  }
}

const home = await readFile(new URL('index.html', root), 'utf8');
const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
const robots = await readFile(new URL('robots.txt', root), 'utf8');
const headers = await readFile(new URL('_headers', root), 'utf8');
const slots = await readFile(new URL('slots/index.html', root), 'utf8');
const fishing = await readFile(new URL('fishing-games/index.html', root), 'utf8');
const tools = await readFile(new URL('tools/index.html', root), 'utf8');
const guides = await readFile(new URL('guide/index.html', root), 'utf8');
const compare = await readFile(new URL('compare/index.html', root), 'utf8');
const gameLibrary = await readFile(new URL('games/index.html', root), 'utf8');

const checks = [
  [home.includes('content="noindex,nofollow"'), 'Homepage meta robots is not noindex,nofollow'],
  [!home.includes('rel="canonical"'), 'Preview must omit canonical'],
  [home.includes('property="og:title"'), 'Open Graph title is missing'],
  [home.includes('application/ld+json'), 'Structured data is missing'],
  [(home.match(/data-home-intent-route=/g) ?? []).length === 4, 'Homepage must expose all four find-game intents'],
  [home.includes('<span class="keep">遊戲。</span>'), 'Homepage must keep the final semantic phrase together'],
  [home.includes('data-home-beginner-guide') && home.includes('/guide/slot-beginners-guide/'), 'Homepage beginner entry is missing'],
  [!home.includes('data-guide-reading-summary="home"') && !home.includes('filter-console-v2'), 'Homepage must not duplicate the Guide library or full Explorer'],
  [!sitemap.includes('<url><loc>'), 'Preview sitemap must not publish formal URLs'],
  [robots.includes('Allow: /') && !robots.includes('Disallow: /'), 'robots.txt must allow crawling for noindex discovery'],
  [headers.includes('X-Robots-Tag: noindex, nofollow'), 'Cloudflare X-Robots-Tag safeguard is missing'],
  [slots.includes('探索老虎機') && slots.includes('Wild') && slots.includes('Jackpot'), 'Slot Hub content is incomplete'],
  [fishing.includes('和老虎機有什麼不同') && fishing.includes('捕魚機入門'), 'Fishing Hub content is incomplete'],
  [tools.includes('全站搜尋') && tools.includes('遊戲探索器') && tools.includes('三款遊戲比較'), 'Tool index is incomplete'],
  [guides.includes('新手入門') && guides.includes('遊戲機制') && guides.includes('捕魚機教學'), 'Guide topics are incomplete'],
  [!compare.includes('先選擇兩至三款遊戲'), 'Compare page must not server-render the transient empty state'],
  [compare.includes('比較工具需要 JavaScript') && compare.includes('href="/games/"'), 'Compare no-JavaScript fallback is missing'],
  [gameLibrary.includes('data-guided-explorer-pilot') && gameLibrary.includes('id="full-explorer"'), 'Games must expose guided and full Explorer modes on one owner page'],
  [gameLibrary.includes('id="game-results"'), 'Games result landing is missing'],
  [(gameLibrary.match(/href="\/games\/\?mechanism=/g) ?? []).length >= 5, 'Games no-JavaScript mechanism links are missing'],
];

for (const [passed, message] of checks) {
  if (!passed) failures.push(message);
}

if (failures.length) {
  console.error(failures.map((item) => `FAIL: ${item}`).join('\n'));
  process.exit(1);
}

console.log(`PASS: ${expectedPages.length} outputs, ${expectedMedia.length} media files and ${checks.length} safeguards verified.`);
