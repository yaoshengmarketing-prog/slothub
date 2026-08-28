import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const source = z.object({ label: z.string(), url: z.string().url(), checkedAt: z.coerce.date() });
const providers = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/providers' }), schema: z.object({
  name: z.string(), aliases: z.array(z.string()).default([]), organizationType: z.enum(['developer','aggregator','platform']), summary: z.string(),
  officialUrl: z.string().url(), status: z.enum(['draft','published']).default('draft'), source, updatedAt: z.coerce.date(),
}) });
const games = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/games' }), schema: z.object({
  name: z.string(), provider: z.string(), primaryType: z.enum(['slots','fishing-games','other']), subtypes: z.array(z.string()).default([]), summary: z.string(),
  rtp: z.number().min(0).max(100).optional(), rtpVariants: z.array(z.number()).default([]), volatility: z.enum(['low','medium','medium-high','high','very-high']).optional(),
  reels: z.string().optional(), paylines: z.string().optional(), jackpotType: z.string().optional(), bonusFeatures: z.array(z.string()).default([]), releaseDate: z.coerce.date().optional(),
  editorialFeatured: z.boolean().default(false), status: z.enum(['draft','published']).default('draft'), source, updatedAt: z.coerce.date(),
}) });
const guides = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/guides' }), schema: z.object({
  title: z.string(), description: z.string(), level: z.enum(['beginner','intermediate','advanced']).default('beginner'), tags: z.array(z.string()).default([]),
  status: z.enum(['draft','published']).default('draft'), publishedAt: z.coerce.date(), updatedAt: z.coerce.date(),
}) });
export const collections = { providers, games, guides };
