export interface CatalogEntry {
  slug: string;
  title: string;
  description: string;
}

// Empty by design. Do not infer games, providers, tools, or platform facts.
export const games: readonly CatalogEntry[] = [];
export const providers: readonly CatalogEntry[] = [];
export const tools: readonly CatalogEntry[] = [];

