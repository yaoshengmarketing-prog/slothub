import registry from '../../data/game-metric-evidence.json' with { type: 'json' };

/** Resolve only explicitly referenced, game-owned, approved public evidence. Research is never imported. */
export function projectGameEvidence(gameSlug, evidenceIds = [], use = 'detail-with-limitation', data = registry) {
  if (new Set(evidenceIds).size !== evidenceIds.length) throw new Error(`${gameSlug}: duplicate evidence reference`);
  return evidenceIds.flatMap((id) => {
    const evidence = data.metricEvidence.find((item) => item.id === id);
    const adoption = data.adoption.find((item) => item.evidenceId === id);
    const source = data.sourceDocuments.find((item) => item.id === evidence?.sourceDocumentId);
    if (!evidence || !adoption || !source || evidence.gameSlug !== gameSlug) {
      throw new Error(`${gameSlug}: invalid or cross-game evidence reference ${id}`);
    }
    if (!adoption.contentChecked || adoption.displayUse === 'research-only' || !adoption.allowedUses.includes(use)) return [];
    return [{
      id, metricKey: evidence.metricKey, label: evidence.displayLabel, value: evidence.displayValue,
      originalLabel: evidence.originalLabel, originalValue: evidence.originalValue,
      limitation: evidence.limitation, scopeNote: evidence.scopeNote ?? '',
      groupId: evidence.groupId ?? null, checkedAt: evidence.checkedAt,
      generationMethod: evidence.generationMethod, unknownFields: evidence.unknownFields,
      source: { publisher: source.publisher, publisherRole: source.publisherRole, title: source.title,
        url: source.url, location: evidence.sourceLocation, documentVersion: source.documentVersion },
      sourceHref: `/games/${gameSlug}/#evidence-${id}`,
    }];
  });
}
