/**
 * Version-controlled decisions for the public Wix article URLs known at migration time.
 * Redirects are exact path matches. Unmapped public paths intentionally fall through to
 * the normal 404 instead of being sent to an unrelated page or the homepage.
 */
export const LEGACY_WIX_REDIRECTS = Object.freeze({
  '/post/slots-beginners-how-to-start': '/guide/slot-screen-beginners-guide/',
  '/post/rng-random-number-generator-explained': '/guide/slot-rng-explained/',
  '/post/slot-near-miss-explained': '/guide/slot-near-miss-explained/',
  '/post/hold-and-win-explained': '/guide/slot-hold-and-win-explained/',
  '/post/how-to-trace-winning-lines-on-screen': '/guide/slot-paytable-and-betting-risk-explained/',
  '/post/jackpot-explained': '/guide/slot-jackpot-explained/',
  '/post/chasing-losses-urge-how-to-handle': '/guide/slot-chasing-losses/',
  '/post/electronic-game-overuse-signs': '/guide/slot-gambling-harm-signs/',
  '/post/slot-reels-and-rows-explained': '/guide/slot-terms-glossary/',
  '/post/slot-bet-settings-total-vs-line': '/guide/slot-paytable-and-betting-risk-explained/',
  '/post/paytable-how-to-read': '/guide/slot-paytable-and-betting-risk-explained/',
  '/post/volatility-explained': '/guide/volatility-explained/',
  '/post/wild-symbol-explained': '/guide/slot-symbols-and-features/',
  '/post/scatter-symbol-explained': '/guide/slot-symbols-and-features/',
  '/post/free-spins-explained': '/guide/slot-symbols-and-features/',
  '/post/multiplier-explained': '/guide/slot-multiplier-explained/',
  '/post/slots-cascading-reels-explained': '/guide/slot-cascading-tumble-avalanche-explained/',
  '/post/megaways-explained': '/guide/slot-ways-to-win-explained/',
  '/post/rtp-explained': '/guide/rtp-explained/',
  '/post/slot-bonus-types-summary': '/guide/slot-symbols-and-features/',
  '/post/slots-high-vs-low-volatility': '/guide/volatility-explained/',
  '/post/popular-slots-types': '/slots/',
  '/post/how-to-read-slot-pace': '/guide/slot-screen-beginners-guide/',
  '/post/beginners-glossary-rtp-volatility': '/guide/slot-beginners-guide/',
});

export const LEGACY_WIX_UNMAPPED_PUBLIC_PATHS = Object.freeze([
  '/post/player-observation-clean-slots',
  '/post/electronic-games-risks-overview',
  '/post/roulette-hot-cold-numbers-explained',
  '/post/roulette-racetrack-neighbour-bets',
  '/post/electronic-vs-live-roulette',
  '/post/french-roulette-explained',
  '/post/baccarat-odds-and-commission',
  '/post/card-games-glossary',
  '/post/casual-games-types-overview',
  '/post/slots-fishing-beginner-myths',
  '/post/fishing-cannon-multiplier-how-to-choose',
  '/post/video-poker-vs-texas-holdem',
  '/post/fishing-game-scams-and-safety',
  '/post/electronic-mahjong-how-to-play',
  '/post/texas-holdem-beginners-guide',
  '/post/roulette-bets-explained',
  '/post/commission-free-baccarat-explained',
  '/post/coin-pusher-how-to-play',
  '/post/baccarat-road-explained',
  '/post/popular-fishing-game-styles',
  '/post/casual-games-for-beginners',
  '/post/fishing-weapon-types',
  '/post/casual-electronic-games-explained',
  '/post/european-vs-american-roulette',
  '/post/card-games-learning-curve',
  '/post/electronic-vs-live-baccarat',
  '/post/fishing-game-lock-on-explained',
  '/post/card-games-types-overview',
  '/post/electronic-baccarat-rules',
  '/post/fishing-game-how-to-play',
  '/post/connection-security-electronic-games',
  '/post/what-are-game-mechanics',
  '/post/electronic-game-types-for-beginners',
  '/post/electronic-games-ui-for-beginners',
  '/post/card-games-beginners-how-to-choose',
  '/post/roulette-beginners-how-to-play',
  '/post/electronic-baccarat-beginners',
  '/post/electronic-games-beginners-guide',
  '/post/fishing-beginners-guide',
  '/post/what-is-electronic-games-definition-guide',
]);

export const LEGACY_WIX_UNPUBLISHED_DRAFT_IDS = Object.freeze([
  '3a041838-1b8a-4713-a114-a07e84635425',
  '74fc668e-60d8-424f-bfc3-945a1f527144',
  '48ce9b46-abbf-4db6-9885-2481d85cf134',
  '09c97a30-7b41-416b-b126-af7c9fde9a67',
  '4b785597-eb03-421c-a415-cfc7cb0ad1cc',
  '65b8c887-5d7c-4712-a8fb-352e5d3fab8f',
  '41220dc9-11ed-411d-a89a-c6ff9b412cfb',
  'b9ae7aa8-583a-47d6-9464-40b58403ad46',
  'ccc05c62-7af5-499f-9f92-5d936b415b38',
  '83f77673-937f-476b-8b29-50ffd53d1420',
  'd5e3b5b5-3fdc-42fa-9a14-a14e6051a7a4',
]);

export function normalizeLegacyPath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

export function legacyRedirectTarget(pathname) {
  return LEGACY_WIX_REDIRECTS[normalizeLegacyPath(pathname)] ?? null;
}
