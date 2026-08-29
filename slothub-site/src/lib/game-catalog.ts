import { getCollection, type CollectionEntry } from 'astro:content';
import { gameUrl } from './urls';
import { featureLabels, winMechanismLabels } from './taxonomy';
import type { SearchItem } from './search.js';

export type CatalogProvider = CollectionEntry<'providers'>;

export type GameCatalogItem = {
  slug: string;
  name: string;
  originalName: string;
  displayNameZhHant?: string;
  aliases: string[];
  seriesId?: string;
  seriesNameZhHant?: string;
  installment?: number;
  relatedGames: string[];
  provider: string;
  providerName: string;
  primaryType: string;
  subtypes: string[];
  summary: string;
  image?: { src: string; alt: string };
  rtp?: number;
  rtpVariants: number[];
  volatilityNormalized?: string;
  maxWinMultiplier?: number;
  reels?: string;
  rows?: number;
  winMechanism?: string;
  mechanismLabel?: string;
  winCount?: number;
  paylines?: string;
  features: string[];
  bonusFeatures: string[];
  bonusBuy?: boolean;
  releaseDate?: string;
  editorialFeatured: boolean;
  searchTerms: string[];
  url: string;
};

const mechanismEnglishLabels: Record<string, string[]> = {
  paylines: ['Paylines', 'Payline'],
  'ways-to-win': ['Ways to Win', 'Ways'],
  megaways: ['Megaways'],
  'cluster-pays': ['Cluster Pays'],
  'pay-anywhere': ['Pay Anywhere'],
  other: ['Other mechanism'],
};

const featureEnglishLabels: Record<string, string[]> = {
  'free-spins': ['Free Spins'],
  wild: ['Wild'],
  scatter: ['Scatter'],
  multiplier: ['Multiplier'],
  'hold-and-spin': ['Hold and Spin', 'Hold & Spin'],
  cascading: ['Cascading', 'Avalanche', 'Tumble'],
  'bonus-buy': ['Bonus Buy'],
  respins: ['Respins', 'Respin'],
  'cash-collection': ['Cash Collection', 'Money Collect'],
  'giant-symbols': ['Giant Symbols'],
  'symbol-splitting': ['Symbol Splitting'],
  'sticky-symbols': ['Sticky Symbols'],
  jackpot: ['Jackpot'],
  other: ['Other feature'],
};

function mechanismLabel(game: CollectionEntry<'games'>['data']) {
  if (game.winMechanism && game.winMechanism !== 'other') {
    return winMechanismLabels[game.winMechanism] ?? game.winMechanism;
  }
  const detail = game.paylines?.toLowerCase() ?? '';
  if (detail.includes('pay anywhere')) return winMechanismLabels['pay-anywhere'];
  if (detail.includes('scatter')) return '散佈賠付';
  if (detail.includes('ways')) return winMechanismLabels['ways-to-win'];
  return game.winMechanism ? winMechanismLabels[game.winMechanism] ?? game.winMechanism : undefined;
}

function uniqueTerms(values: Array<string | undefined>) {
  return [...new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])];
}

export function projectPublishedGames(
  gameEntries: CollectionEntry<'games'>[],
  providerEntries: CatalogProvider[],
): GameCatalogItem[] {
  const publishedProviders = providerEntries.filter((provider) => provider.data.status === 'published');
  const providerNames = new Map(publishedProviders.map((provider) => [provider.id, provider.data.name]));

  return gameEntries
    .filter((game) => game.data.status === 'published')
    .map((game) => {
      const name = game.data.displayNameZhHant ?? game.data.originalName ?? game.data.name;
      const originalName = game.data.originalName ?? game.data.name;
      const normalizedVolatility = game.data.volatilityNormalized ?? game.data.volatility;
      const normalizedMechanismLabel = mechanismLabel(game.data);
      const featureTerms = game.data.features.flatMap((feature) => [
        featureLabels[feature] ?? feature,
        feature,
        ...(featureEnglishLabels[feature] ?? []),
      ]);
      const mechanismTerms = game.data.winMechanism ? [
        normalizedMechanismLabel,
        game.data.winMechanism,
        ...(mechanismEnglishLabels[game.data.winMechanism] ?? []),
      ] : [];

      return {
        slug: game.id,
        name,
        originalName,
        displayNameZhHant: game.data.displayNameZhHant,
        aliases: game.data.aliases,
        seriesId: game.data.seriesId,
        seriesNameZhHant: game.data.seriesNameZhHant,
        installment: game.data.installment,
        relatedGames: game.data.relatedGames,
        provider: game.data.provider,
        providerName: providerNames.get(game.data.provider) ?? game.data.provider,
        primaryType: game.data.primaryType,
        subtypes: game.data.subtypes,
        summary: game.data.summary,
        image: game.data.image ? { src: game.data.image.src, alt: game.data.image.alt } : undefined,
        rtp: game.data.rtp,
        rtpVariants: game.data.rtpVariants,
        volatilityNormalized: normalizedVolatility,
        maxWinMultiplier: game.data.maxWinMultiplier,
        reels: game.data.reels,
        rows: game.data.rows,
        winMechanism: game.data.winMechanism,
        mechanismLabel: normalizedMechanismLabel,
        winCount: game.data.winCount,
        paylines: game.data.paylines,
        features: game.data.features,
        bonusFeatures: game.data.bonusFeatures,
        bonusBuy: game.data.bonusBuy,
        releaseDate: game.data.releaseDate?.toISOString().slice(0, 10),
        editorialFeatured: game.data.editorialFeatured,
        searchTerms: uniqueTerms([
          providerNames.get(game.data.provider) ?? game.data.provider,
          game.data.summary,
          ...mechanismTerms,
          ...featureTerms,
        ]),
        url: gameUrl(game.id),
      } satisfies GameCatalogItem;
    });
}

export async function loadPublishedGameCatalog() {
  const [gameEntries, providerEntries] = await Promise.all([
    getCollection('games'),
    getCollection('providers'),
  ]);
  const providers = providerEntries.filter((provider) => provider.data.status === 'published');
  return { games: projectPublishedGames(gameEntries, providers), providers };
}

export function toGameSearchItem(game: GameCatalogItem): SearchItem {
  return {
    slug: game.slug,
    title: game.name,
    secondaryTitle: game.displayNameZhHant ? game.originalName : undefined,
    description: game.summary,
    kind: '遊戲',
    url: game.url,
    aliases: game.aliases,
    providerName: game.providerName,
    seriesName: game.seriesNameZhHant,
    installment: game.installment,
    searchText: game.searchTerms,
  };
}
