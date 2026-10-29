import registry from '../../data/game-media.json' with { type: 'json' };

export function vimeoPlayerUrl(videoId) {
  if (!/^\d+$/.test(String(videoId))) throw new Error('Invalid Vimeo video identifier');
  return `https://player.vimeo.com/video/${videoId}?autoplay=0&dnt=1`;
}

/** Only project game-owned, enabled content with a basis for its exact public use. */
export function projectGameMedia(gameSlug, ids = [], data = registry, { localTest = false } = {}) {
  if (new Set(ids).size !== ids.length) throw new Error(`${gameSlug}: duplicate media reference`);
  return ids.flatMap(id => {
    const item = data.items.find(record => record.id === id);
    if (!item || item.gameSlug !== gameSlug) throw new Error(`${gameSlug}: invalid media reference ${id}`);
    const basis = data.usageBases.find(record => record.id === item.usageBasisId);
    const source = data.sources.find(record => record.id === item.sourceId);
    if (!basis || !source) throw new Error(`${id}: missing source or usage basis`);
    if (!item.enabled || item.checks.content.status !== 'verified') return [];
    const publicUse = basis.status === 'confirmed' && basis.allowedUses.includes(item.presentation);
    const testUse = localTest && basis.status === 'local-test';
    if (!publicUse && !testUse) return [];
    if (item.kind === 'video' && item.checks.sourcePlayback.status !== 'verified') return [];
    if (item.presentation === 'click-to-load' && (!item.official || item.checks.embed.status !== 'verified')) return [];
    return [{ id: item.id, kind: item.kind, imageType: item.imageType, title: item.title,
      purpose: item.purpose, scopeNote: item.scopeNote, alt: item.alt,
      src: item.kind === 'image' ? item.src : undefined,
      source: { publisher: source.publisher, url: source.url },
      url: item.kind === 'video' ? item.url : undefined,
      playerUrl: item.presentation === 'click-to-load' ? vimeoPlayerUrl(item.videoId) : undefined,
      presentation: item.presentation, official: item.official,
      checkedAt: item.checks.content.checkedAt,
    }];
  });
}
