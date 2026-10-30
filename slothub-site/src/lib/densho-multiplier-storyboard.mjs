import record from '../../data/densho-multiplier-storyboard.json' with { type: 'json' };
import evidence from '../../data/game-metric-evidence.json' with { type: 'json' };

/** One Densho rule with explicit adoption, referencing the unchanged source document. */
export function projectDenshoMultiplierStoryboard(gameSlug, game, environment, data = record, documents = evidence.sourceDocuments) {
  if (!['preview', 'production'].includes(environment) || gameSlug !== 'densho' || data?.gameSlug !== gameSlug
    || game?.status !== 'published' || game.primaryType !== 'slots') return null;
  if (data.adoption !== 'densho-game-page-approved'
    && !(data.adoption === 'preview-only' && environment === 'preview')) return null;
  const source = documents.find((item) => item.id === data.sourceDocumentId);
  if (!source) throw new Error(`${data.id}: missing source document`);
  return { ...data, source };
}
