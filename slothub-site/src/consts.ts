export const SITE = {
  name: 'Slot Hub',
  origin: 'https://www.slothub.com.tw',
  lang: 'zh-Hant-TW',
  locale: 'zh_TW',
  description: 'Slot Hub 新站技術預覽環境，目前仍在建置中。',
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
