/** Select only from confirmed structured Game fields; never infer from copy or numbers. */
export function getGameDiagramLinks(game) {
  if (!game || game.status !== 'published' || game.primaryType !== 'slots') return [];
  const links = [];
  if (game.winMechanism === 'paylines' || game.winMechanism === 'ways-to-win') {
    links.push({ anchor: 'payout-mechanism-demo', label: '圖解：賠線與 Ways 的判定差異' });
  }
  if (Array.isArray(game.features) && game.features.includes('cascading')) {
    links.push({ anchor: 'cascading-demo', label: '圖解：符號如何消除與補位' });
  }
  return links;
}
