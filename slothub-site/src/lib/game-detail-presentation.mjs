const unique = (values = []) => [...new Set(values.filter((value) => value !== undefined && value !== null && value !== ''))];

export const GAME_DETAIL_QUICK_KEYS = ['mechanism', 'rtp', 'volatility', 'max-win'];

export function buildGameDetailPresentation(game) {
  const normalizedVolatility = game.volatilityNormalized ?? game.volatility;
  const rtpValues = unique([
    ...(game.rtp !== undefined ? [game.rtp] : []),
    ...(game.rtpVariants ?? []),
  ]);
  const sources = game.sources?.length ? game.sources : game.source ? [game.source] : [];
  const mechanismKnown = Boolean(game.winMechanism && game.winMechanism !== 'other');

  return {
    quick: {
      mechanism: {
        known: mechanismKnown,
        value: mechanismKnown ? game.winMechanism : undefined,
        winCount: mechanismKnown ? game.winCount : undefined,
        reels: mechanismKnown ? game.reels : undefined,
      },
      rtp: {
        known: game.rtp !== undefined,
        value: game.rtp,
        variantCount: rtpValues.length,
        additionalVariantCount: game.rtp === undefined ? rtpValues.length : Math.max(0, rtpValues.length - 1),
      },
      volatility: {
        known: Boolean(normalizedVolatility),
        value: normalizedVolatility,
        original: game.volatilityOriginal,
      },
      maxWin: {
        known: game.maxWinMultiplier !== undefined,
        value: game.maxWinMultiplier,
        original: game.maxWinLabelOriginal,
      },
    },
    operation: {
      mechanism: mechanismKnown ? game.winMechanism : undefined,
      winCount: mechanismKnown ? game.winCount : undefined,
      reels: game.reels,
      rows: game.rows,
      originalWinDescription: game.paylines,
      features: unique(game.features),
      ruleNotes: unique(game.bonusFeatures),
    },
    full: {
      rtpValues,
      volatilityOriginal: game.volatilityOriginal,
      volatilityNormalized: normalizedVolatility,
      reels: game.reels,
      rows: game.rows,
      winMechanism: mechanismKnown ? game.winMechanism : undefined,
      winCount: mechanismKnown ? game.winCount : undefined,
      originalWinDescription: game.paylines,
      maxWinMultiplier: game.maxWinMultiplier,
      maxWinOriginal: game.maxWinLabelOriginal,
      bonusBuy: game.bonusBuy,
      jackpotType: game.jackpotType,
      minBet: game.minBet,
      maxBet: game.maxBet,
      releaseDate: game.releaseDate,
      gameId: game.gameId,
    },
    trust: {
      sourceCount: sources.length,
      lastVerifiedAt: game.lastVerifiedAt,
      hasImageSource: Boolean(game.image?.sourceUrl),
    },
  };
}
