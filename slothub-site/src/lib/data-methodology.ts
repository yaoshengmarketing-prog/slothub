import { getCollection } from 'astro:content';
import { guideUrl } from './urls';

export const DATA_METHODOLOGY_GUIDE_SLUG = 'slot-hub-data-methodology';

export async function loadPublishedDataMethodologyEntry() {
  const guide = (await getCollection('guides')).find(
    (entry) => entry.id === DATA_METHODOLOGY_GUIDE_SLUG && entry.data.status === 'published',
  );

  return guide
    ? { slug: guide.id, title: guide.data.title, url: guideUrl(guide.id) }
    : undefined;
}
