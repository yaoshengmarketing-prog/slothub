export const SITE = {
  name: 'Slot Hub',
  origin: 'https://www.slothub.com.tw',
  lang: 'zh-Hant-TW',
  locale: 'zh_TW',
  description: 'Slot Hub 老虎機電子遊戲資料庫，整理遊戲廠商、玩法、RTP、波動度與資料來源。',
  environment: import.meta.env.PUBLIC_SITE_ENV ?? 'preview',
} as const;

export const RESERVED_ROOT_SLUGS = [
  'guide',
  'games',
  'providers',
  'tools',
  'slots',
  'fishing-games',
  'roulette',
  'rankings',
  'search',
  'compare',
] as const;

export const isReservedRootSlug = (slug: string) =>
  (RESERVED_ROOT_SLUGS as readonly string[]).includes(slug);

// Preview sitemap intentionally contains only the temporary homepage.
// Add approved, substantive pages here only when they are ready for production indexing.
export const SITEMAP_PATHS = ['/'] as const;
