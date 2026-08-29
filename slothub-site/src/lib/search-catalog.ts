import type { CollectionEntry } from 'astro:content';
import { guideUrl, providerUrl } from './urls';
import { toGameSearchItem, type CatalogProvider, type GameCatalogItem } from './game-catalog';
import type { SearchItem } from './search.js';

export function buildPublishedSearchCatalog(
  games: GameCatalogItem[],
  providers: CatalogProvider[],
  guides: CollectionEntry<'guides'>[],
): SearchItem[] {
  return [
    ...games.map(toGameSearchItem),
    ...providers.map((provider) => ({
      slug: provider.id,
      title: provider.data.name,
      description: provider.data.summary,
      kind: '廠商' as const,
      url: providerUrl(provider.id),
      aliases: provider.data.aliases,
      searchText: [provider.data.brandName ?? '', provider.data.summary],
    })),
    ...guides
      .filter((guide) => guide.data.status === 'published')
      .map((guide) => ({
        slug: guide.id,
        title: guide.data.title,
        description: guide.data.description,
        kind: '教學' as const,
        url: guideUrl(guide.id),
        aliases: guide.data.tags,
        searchText: [guide.data.description],
      })),
  ];
}
