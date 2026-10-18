import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

// Owner rule (2026-10-18): officialUrl must be the studio's own verified site.
// Stake-only (Stake Engine) studios without their own site may use the Stake studio group page
// https://stake.com/casino/group/<studio>. Other casino/operator pages and affiliate or
// promo-code sites are never allowed as a Provider officialUrl.
const stakeHosts = new Set(['stake.com', 'stake.us']);
const stakeGroupPath = /^\/casino\/group\/[a-z0-9-]+\/?$/;
const blockedHosts = [
  // Casino / operator platforms.
  'roobet.com', 'bc.game', 'rollbit.com', 'shuffle.com', 'duelbits.com', 'gamdom.com', 'bitstarz.com',
  'bet365.com', 'betway.com', '888casino.com', 'unibet.com', 'leovegas.com',
  // Affiliate / promo-code sites found while verifying Stake Engine studios (2026-10-18).
  'colorful-play.com', 'daedalusprovider.com', 'terminalgames-stake.com', 'incredible-gaming.com',
];

const directory = path.resolve('src/content/providers');
const failures = [];
let checked = 0;
let stakeGroup = 0;
for (const file of (await readdir(directory)).filter((name) => name.endsWith('.md'))) {
  const text = await readFile(path.join(directory, file), 'utf8');
  const match = text.match(/^officialUrl:\s*["']?([^"'\s]+)["']?\s*$/m);
  if (!match) continue;
  checked += 1;
  let url;
  try { url = new URL(match[1]); } catch { failures.push(`${file}: invalid officialUrl ${match[1]}`); continue; }
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  if (stakeHosts.has(host)) {
    if (stakeGroupPath.test(url.pathname) && !url.search) { stakeGroup += 1; continue; }
    failures.push(`${file}: Stake officialUrl must be a studio group page (https://stake.com/casino/group/<studio>), got ${match[1]}`);
    continue;
  }
  if (blockedHosts.some((blocked) => host === blocked || host.endsWith(`.${blocked}`))) {
    failures.push(`${file}: officialUrl host ${host} is a casino/operator/affiliate site and is not allowed`);
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`PASS: ${checked} Provider officialUrl values checked; ${stakeGroup} use the allowed Stake studio group page; none use casino/operator/affiliate sites.`);
