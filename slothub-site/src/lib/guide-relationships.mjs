export const GUIDE_DATA_TOPICS = ['rtp', 'rtp-variants', 'volatility', 'max-win'];

const relationFields = [
  ['mechanism', 'relatedMechanisms'],
  ['data-topic', 'relatedDataTopics'],
  ['feature', 'relatedFeatures'],
];

const published = (entry) => entry.status === undefined || entry.status === 'published';
const stableText = (left, right) => left.localeCompare(right, 'zh-Hant-TW');

export function dataTopicsForGame(game) {
  return [
    game.rtp !== undefined ? 'rtp' : undefined,
    game.rtpVariants?.length ? 'rtp-variants' : undefined,
    game.volatilityOriginal || game.volatilityNormalized ? 'volatility' : undefined,
    game.maxWinMultiplier !== undefined ? 'max-win' : undefined,
  ].filter(Boolean);
}

function completeness(game) {
  return [
    game.image, game.rtp !== undefined, game.rtpVariants?.length,
    game.volatilityOriginal || game.volatilityNormalized,
    game.maxWinMultiplier !== undefined, game.winMechanism,
    game.features?.length, game.summary,
  ].filter(Boolean).length;
}

function stableGameOrder(left, right) {
  return Number(Boolean(right.editorialFeatured)) - Number(Boolean(left.editorialFeatured))
    || completeness(right) - completeness(left)
    || stableText(left.name, right.name)
    || left.slug.localeCompare(right.slug, 'en');
}

function valuesFor(guide, field) {
  return Array.isArray(guide[field]) ? guide[field] : [];
}

function gameConcepts(game) {
  return {
    mechanism: game.winMechanism ? [game.winMechanism] : [],
    feature: game.features ?? [],
    'data-topic': dataTopicsForGame(game),
  };
}

function emptyLookup(values) {
  return Object.fromEntries(values.map((value) => [value, []]));
}

export function validateGuideDeclarations(guides, options) {
  const allowed = {
    mechanism: new Set(options.mechanisms ?? []),
    feature: new Set(options.features ?? []),
    'data-topic': new Set(options.dataTopics ?? GUIDE_DATA_TOPICS),
  };
  const errors = [];

  for (const guide of guides) {
    for (const [type, field] of relationFields) {
      const raw = guide[field];
      if (raw === undefined) continue;
      if (!Array.isArray(raw)) {
        errors.push(`${guide.slug}: ${field} must be an array`);
        continue;
      }
      if (raw.some((value) => typeof value !== 'string' || !value.trim())) {
        errors.push(`${guide.slug}: ${field} contains an empty value`);
      }
      if (new Set(raw).size !== raw.length) errors.push(`${guide.slug}: ${field} contains duplicates`);
      for (const value of raw) {
        if (!allowed[type].has(value)) errors.push(`${guide.slug}: unknown ${type} ${value}`);
      }
    }
  }

  if (errors.length) throw new Error(errors.join('\n'));
  return true;
}

export function buildGuideRelationshipIndex(guides, games, options) {
  validateGuideDeclarations(guides, options);
  const publishedGuides = guides.filter(published).sort((left, right) => stableText(left.title, right.title) || left.slug.localeCompare(right.slug, 'en'));
  const publishedGames = games.filter(published);
  const mechanismToGuides = emptyLookup(options.mechanisms ?? []);
  const featureToGuides = emptyLookup(options.features ?? []);
  const dataTopicToGuides = emptyLookup(options.dataTopics ?? GUIDE_DATA_TOPICS);
  const lookupByType = { mechanism: mechanismToGuides, feature: featureToGuides, 'data-topic': dataTopicToGuides };

  for (const guide of publishedGuides) {
    for (const [type, field] of relationFields) {
      for (const value of valuesFor(guide, field)) lookupByType[type][value].push(guide);
    }
  }

  const gameToGuides = {};
  for (const game of publishedGames) {
    const matches = new Map();
    const concepts = gameConcepts(game);
    for (const [priority, [type]] of relationFields.entries()) {
      for (const value of concepts[type]) {
        for (const guide of lookupByType[type][value] ?? []) {
          const current = matches.get(guide.slug) ?? { guide, priority, reasons: [] };
          current.priority = Math.min(current.priority, priority);
          current.reasons.push({ type, value });
          matches.set(guide.slug, current);
        }
      }
    }
    gameToGuides[game.slug] = [...matches.values()]
      .sort((left, right) => left.priority - right.priority || stableText(left.guide.title, right.guide.title) || left.guide.slug.localeCompare(right.guide.slug, 'en'));
  }

  const guideToGames = {};
  for (const guide of publishedGuides) {
    const declared = Object.fromEntries(relationFields.map(([type, field]) => [type, new Set(valuesFor(guide, field))]));
    guideToGames[guide.slug] = publishedGames
      .filter((game) => {
        const concepts = gameConcepts(game);
        return relationFields.some(([type]) => concepts[type].some((value) => declared[type].has(value)));
      })
      .sort(stableGameOrder);
  }

  return { guides: publishedGuides, mechanismToGuides, featureToGuides, dataTopicToGuides, gameToGuides, guideToGames };
}
