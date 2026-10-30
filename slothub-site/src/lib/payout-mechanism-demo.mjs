const background = ['triangle', 'square', 'diamond', 'triangle', 'square', 'diamond', 'triangle', 'square', 'diamond', 'triangle', 'square', 'diamond', 'triangle', 'square', 'diamond'];
const makeBoard = (circles) => Object.freeze(background.map((shape, cell) => circles.includes(cell) ? 'circle' : shape));

export const PAYOUT_CASES = Object.freeze([
  Object.freeze({ id: 'aligned', label: '中間列對齊', board: makeBoard([5, 6, 7]) }),
  Object.freeze({ id: 'different-rows', label: '圓形分散在不同列', board: makeBoard([0, 6, 12]) }),
  Object.freeze({ id: 'reel-gap', label: '第二軸缺少圓形', board: makeBoard([0, 7, 13]) }),
]);
export const PAYOUT_RULES = Object.freeze([
  Object.freeze({ id: 'paylines', label: '賠線示例', rule: '只啟用中間一條水平賠線；從最左側起，前三軸在線上連續出現圓形才成立。' }),
  Object.freeze({ id: 'ways-to-win', label: 'Ways 示例', rule: '從最左側起，前三個相鄰轉輪各有至少一個圓形才成立；可以位於不同列，不必沿固定賠線。' }),
]);
const shapeNames = { circle: '圓形', square: '方形', triangle: '三角形', diamond: '菱形' };

export function getPayoutView(caseId = 'aligned', mechanism = 'paylines') {
  const example = PAYOUT_CASES.find((item) => item.id === caseId);
  const definition = PAYOUT_RULES.find((item) => item.id === mechanism);
  if (!example || !definition) throw new RangeError('Unknown fixed payout example');
  const readCells = mechanism === 'paylines' ? [5, 6, 7] : [0, 1, 2, 5, 6, 7, 10, 11, 12];
  const targets = readCells.filter((cell) => example.board[cell] === 'circle');
  const missingReels = [0, 1, 2].filter((reel) => !targets.some((cell) => cell % 5 === reel));
  const matches = missingReels.length === 0;
  const reason = matches
    ? mechanism === 'paylines'
      ? '前三軸的中間列都是圓形，符合本例指定的水平賠線與連續條件。'
      : '前三個相鄰轉輪各有圓形，符合本例左側起算與連續條件；不必在同一列。'
    : mechanism === 'paylines'
      ? `第 ${missingReels.map((reel) => reel + 1).join('、')} 軸的中間列不是圓形，指定賠線未能從最左側連續成立。`
      : '第 2 軸沒有圓形，連續條件在此中斷；第 3、4 軸的圓形不能補上這個缺口。';
  const description = [0, 1, 2].map((row) => `第 ${row + 1} 列：${example.board.slice(row * 5, row * 5 + 5).map((shape) => shapeNames[shape]).join('、')}`).join('；');
  return { ...example, caseLabel: example.label, mechanism, label: definition.label, rule: definition.rule, readCells, targets, missingReels, matches, reason, description, result: matches ? '符合本例條件' : '未符合本例條件' };
}
