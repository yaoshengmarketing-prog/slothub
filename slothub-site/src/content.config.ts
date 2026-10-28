import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const source = z.object({ label: z.string(), url: z.string().url(), checkedAt: z.coerce.date() });
const media = z.object({ src: z.string(), alt: z.string(), sourceUrl: z.string().url(), retrievedAt: z.coerce.date() });
const gameDemo = z.object({
  status: z.enum(['available', 'login-required', 'access-restricted', 'not-verified']),
  url: z.string().url().optional(),
  accessType: z.enum(['direct-demo', 'official-game-page', 'platform-game-page']).optional(),
  platformName: z.string().optional(),
  presentation: z.literal('external').optional(),
  iframeStatus: z.enum(['verified', 'blocked', 'not-tested']).default('not-tested'),
  checkedAt: z.coerce.date(),
  note: z.string().optional(),
});
const normalizedVolatility = z.enum(['low','medium','medium-high','high','very-high']);
const winMechanism = z.enum(['paylines','ways-to-win','megaways','cluster-pays','pay-anywhere','other']);
const feature = z.enum([
  'free-spins','wild','scatter','multiplier','hold-and-spin','cascading','bonus-buy',
  'respins','cash-collection','giant-symbols','symbol-splitting','sticky-symbols','jackpot','other',
]);
const guideDataTopic = z.enum(['rtp', 'rtp-variants', 'volatility', 'max-win']);
const jackpotType = z.enum(['none','fixed','progressive','local','networked','multiple','other']);
const providers = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/providers' }), schema: z.object({
  name: z.string(), brandName: z.string().optional(), aliases: z.array(z.string()).default([]), roles: z.array(z.enum(['developer','publisher','aggregator','platform'])),
  parentOrganization: z.string().optional(), subBrands: z.array(z.string()).default([]), originRegions: z.array(z.string()).default([]), serviceMarkets: z.array(z.string()).default([]),
  marketTags: z.array(z.string()).default([]), languages: z.array(z.string()).default([]), gameTypes: z.array(z.string()).default([]), summary: z.string(),
  officialUrl: z.string().url(), logo: media.optional(), status: z.enum(['candidate','draft','published','inactive']).default('candidate'), source, updatedAt: z.coerce.date(),
}) });
const games = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/games' }), schema: z.object({
  name: z.string(), originalName: z.string().optional(), displayNameZhHant: z.string().optional(), aliases: z.array(z.string()).default([]),
  seriesId: z.string().optional(), seriesNameZhHant: z.string().optional(), installment: z.number().int().positive().optional(), relatedGames: z.array(z.string()).default([]),
  provider: z.string(), primaryType: z.enum(['slots','fishing-games','other']), subtypes: z.array(z.string()).default([]), summary: z.string(),
  // Compatibility fields remain available while v1 fields become the canonical structured layer.
  rtp: z.number().min(0).max(100).optional(), rtpVariants: z.array(z.number().min(0).max(100)).default([]), volatility: normalizedVolatility.optional(),
  volatilityOriginal: z.string().optional(), volatilityNormalized: normalizedVolatility.optional(), maxWinMultiplier: z.number().positive().optional(), maxWinLabelOriginal: z.string().optional(),
  reels: z.string().optional(), rows: z.number().int().positive().optional(),
  winMechanism: winMechanism.optional(), winCount: z.number().int().positive().optional(),
  paylines: z.string().optional(), features: z.array(feature).default([]), bonusFeatures: z.array(z.string()).default([]), bonusBuy: z.boolean().optional(),
  jackpotType: jackpotType.optional(), minBet: z.number().nonnegative().optional(), maxBet: z.number().positive().optional(), releaseDate: z.coerce.date().optional(), gameId: z.string().optional(),
  metricEvidenceIds: z.array(z.string().min(1)).default([]),
  sources: z.array(source).default([]), lastVerifiedAt: z.coerce.date().optional(), demo: gameDemo.optional(),
  image: media.optional(), editorialFeatured: z.boolean().default(false), status: z.enum(['draft','published']).default('draft'), source, updatedAt: z.coerce.date(),
}) });
const guides = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/guides' }), schema: z.object({
  title: z.string(), description: z.string(), category: z.enum(['beginner','mechanics','data','terms','fishing']).default('beginner'), level: z.enum(['beginner','intermediate','advanced']).default('beginner'), tags: z.array(z.string()).default([]),
  relatedMechanisms: z.array(winMechanism).optional(), relatedFeatures: z.array(feature).optional(), relatedDataTopics: z.array(guideDataTopic).optional(),
  status: z.enum(['draft','published']).default('draft'), publishedAt: z.coerce.date(), updatedAt: z.coerce.date(),
}) });
export const collections = { providers, games, guides };
