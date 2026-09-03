export const GAME_DNA_PILOT_SLUG = 'mahjong-ways';

const unique = (values = []) => [...new Set(values.filter(Boolean))];

export function buildGameDnaPilot(slug, game) {
  if (slug !== GAME_DNA_PILOT_SLUG || game?.status !== 'published') return undefined;

  const sources = game.sources?.length ? game.sources : game.source ? [game.source] : [];

  return {
    slug,
    gameplay: {
      mechanism: game.winMechanism,
      winCount: game.winCount,
      reels: game.reels,
      rows: game.rows,
      features: unique(game.features),
    },
    rtp: {
      primary: game.rtp,
      values: unique(game.rtpVariants),
    },
    labels: {
      volatilityOriginal: game.volatilityOriginal,
      volatilityNormalized: game.volatilityNormalized ?? game.volatility,
      maxWinMultiplier: game.maxWinMultiplier,
      maxWinOriginal: game.maxWinLabelOriginal,
    },
    trust: {
      sourceCount: sources.length,
      lastVerifiedAt: game.lastVerifiedAt,
    },
  };
}
