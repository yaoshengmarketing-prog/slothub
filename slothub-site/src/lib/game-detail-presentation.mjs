const unique = (values = []) => [...new Set(values.filter((value) => value !== undefined && value !== null && value !== ''))];

const isRtpNumber = (value) => typeof value === 'number' && Number.isFinite(value);

export const RTP_USAGE_NOTE = '實際使用值請以遊戲內資訊為準。';
export const RTP_PRIMARY_NOTE = '本站記錄的主要值用於 RTP 篩選／排序，不代表原廠預設設定。';
export const RTP_FILTER_NOTE = 'RTP 篩選與排序依本站記錄的主要值；未指定主要值的遊戲不納入最低 RTP 條件，依 RTP 排序時置後。';
export const RTP_MISSING = '尚未收錄 RTP 數值';

export function buildRecordedRtpPresentation(game) {
  const hasPrimary = isRtpNumber(game?.rtp);
  const primary = hasPrimary ? game.rtp : undefined;
  const variants = Array.isArray(game?.rtpVariants) ? game.rtpVariants : [];
  const values = [...new Set([...(hasPrimary ? [primary] : []), ...variants].filter(isRtpNumber))];
  return { hasPrimary, primary, hasRecordedValues: values.length > 0, values, valueCount: values.length };
}

export function formatRecordedRtp(value) {
  if (!isRtpNumber(value)) return undefined;
  const [coefficient, exponent] = String(value).toLowerCase().split('e');
  let decimal = coefficient;
  if (exponent !== undefined) {
    const sign = coefficient.startsWith('-') ? '-' : '';
    const [whole, fraction = ''] = coefficient.replace(/^-/, '').split('.');
    const digits = whole + fraction;
    const point = whole.length + Number(exponent);
    decimal = sign + (point <= 0
      ? `0.${'0'.repeat(-point)}${digits}`
      : point >= digits.length ? digits + '0'.repeat(point - digits.length)
      : `${digits.slice(0, point)}.${digits.slice(point)}`);
  }
  const [whole, fraction = ''] = decimal.split('.');
  return `${whole}.${fraction.padEnd(2, '0')}%`;
}

export const GAME_DETAIL_QUICK_KEYS = ['mechanism', 'rtp', 'volatility', 'max-win'];

export function buildGameDetailPresentation(game) {
  const normalizedVolatility = game.volatilityNormalized ?? game.volatility;
  const rtp = buildRecordedRtpPresentation(game);
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
      rtp,
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
      rtpValues: rtp.values,
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
