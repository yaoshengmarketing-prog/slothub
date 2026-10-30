import record from '../../data/densho-multiplier-storyboard.json' with { type: 'json' };
import evidence from '../../data/game-metric-evidence.json' with { type: 'json' };

/** One preview-only rule, referencing the existing source document without changing older evidence. */
export function projectDenshoMultiplierStoryboard(gameSlug, game, environment, data = record, documents = evidence.sourceDocuments) {
  if (environment !== 'preview' || gameSlug !== 'densho' || data.gameSlug !== gameSlug
    || data.adoption !== 'preview-only' || game?.status !== 'published' || game.primaryType !== 'slots') return null;
  const source = documents.find((item) => item.id === data.sourceDocumentId);
  if (!source) throw new Error(`${data.id}: missing source document`);
  return { ...data, source };
}
