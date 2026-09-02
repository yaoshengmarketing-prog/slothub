export const GUIDE_READING_PATHS = [
  {
    id: 'first-use',
    index: '01',
    eyebrow: 'START HERE',
    title: '第一次使用',
    description: '先確認遊戲身份、欄位順序與常見術語，再進入個別數據。',
    guideSlugs: ['slot-beginners-guide', 'slot-terms-glossary'],
  },
  {
    id: 'core-data',
    index: '02',
    eyebrow: 'CORE DATA',
    title: '核心數據',
    description: '分開閱讀 RTP、波動度與最高倍數，避免把不同問題混成一個結論。',
    guideSlugs: ['rtp-explained', 'volatility-explained', 'slot-max-win-explained'],
  },
  {
    id: 'mechanisms',
    index: '03',
    eyebrow: 'MECHANISMS',
    title: '玩法機制',
    description: '理解一般得獎組合依賠線、Ways、群集或其他主要規則成立。',
    guideSlugs: ['slot-payout-mechanisms-explained'],
  },
  {
    id: 'features',
    index: '04',
    eyebrow: 'FEATURES',
    title: '遊戲功能',
    description: '再看符號、倍數、連鎖消除與 Bonus Buy 如何改變遊戲流程。',
    guideSlugs: [
      'slot-symbols-and-features',
      'slot-multiplier-explained',
      'slot-cascading-tumble-avalanche-explained',
      'slot-bonus-buy-explained',
    ],
  },
  {
    id: 'data-limits',
    index: '05',
    eyebrow: 'DATA LIMITS',
    title: '資料限制',
    description: '最後確認原廠值、統一顯示、缺值、版本、來源與可比較範圍。',
    guideSlugs: ['slot-hub-data-methodology'],
  },
];

export const GUIDE_READING_EXTENSIONS = [
  {
    id: 'other-game-types',
    index: '06',
    eyebrow: 'OTHER GAME TYPES',
    title: '延伸類型',
    description: '捕魚機有不同的畫面、操作與資料閱讀方式，保留獨立入門內容。',
    guideSlugs: ['fishing-games-basics'],
  },
];

export function buildGuideReadingSections(guides, definitions = [...GUIDE_READING_PATHS, ...GUIDE_READING_EXTENSIONS]) {
  const published = new Map(
    guides.filter((guide) => guide.data.status === 'published').map((guide) => [guide.id, guide]),
  );

  return definitions.map((definition) => ({
    ...definition,
    href: `/guide/#route-${definition.id}`,
    guides: definition.guideSlugs.flatMap((slug) => {
      const guide = published.get(slug);
      return guide ? [guide] : [];
    }),
  }));
}
