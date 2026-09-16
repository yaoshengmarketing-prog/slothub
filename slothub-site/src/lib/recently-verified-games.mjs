export function selectRecentlyVerifiedGames(games, limit = 6) {
  if (!Number.isInteger(limit) || limit < 0) {
    throw new TypeError('limit must be a non-negative integer');
  }

  return [...games]
    .filter((game) => typeof game.lastVerifiedAt === 'string' && game.lastVerifiedAt.length > 0)
    .sort((left, right) => {
      const byDate = right.lastVerifiedAt.localeCompare(left.lastVerifiedAt);
      if (byDate !== 0) return byDate;

      return left.slug < right.slug ? -1 : left.slug > right.slug ? 1 : 0;
    })
    .slice(0, limit);
}
