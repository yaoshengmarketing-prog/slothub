// A fixed teaching sequence, not a game engine or probability model.
/** @typedef {{id:string, shape:'circle'|'square'|'triangle'|'diamond', cell:number}} Token */
/** @typedef {{step:number, round:number, tokens:Token[], marked:string[], added:string[], outcome:string, text:string}} Frame */
export const CASCADING_STEPS = ['標示有效組合', '符號移除', '空位補入', '再次判定'];
export const SYMBOL_NAMES = { circle: '圓形', square: '方形', triangle: '三角形', diamond: '菱形' };
/** @param {string} id @param {Token['shape']} shape @param {number} cell @returns {Token} */
const token = (id, shape, cell) => ({ id, shape, cell });
const initial = [
  token('a', 'triangle', 0), token('b', 'square', 1), token('c', 'diamond', 2),
  token('d', 'diamond', 3), token('e', 'circle', 4), token('f', 'triangle', 5),
  token('g', 'circle', 6), token('h', 'circle', 7), token('i', 'circle', 8),
];
const survivors = initial.slice(0, 6);
const fallen = survivors.map((item) => ({ ...item, cell: item.cell + 3 }));
const firstFill = [token('j', 'square', 0), token('k', 'square', 1), token('l', 'square', 2), ...fallen];
const finalFill = [token('m', 'triangle', 0), token('n', 'circle', 1), token('o', 'diamond', 2), ...fallen];
/** @type {Frame[]} */
export const CASCADING_FRAMES = [
  { step: 0, round: 1, tokens: initial, marked: ['g', 'h', 'i'], added: [], outcome: '', text: '底列三個圓形是本例的有效組合，先把它們標示出來。' },
  { step: 1, round: 1, tokens: survivors, marked: [], added: [], outcome: '', text: '移除這三個圓形；底列留下三個空位，其他符號先保留。' },
  { step: 2, round: 1, tokens: firstFill, marked: [], added: ['j', 'k', 'l'], outcome: '', text: '原有符號向下補位一格，上方再補入三個預設方形。' },
  { step: 3, round: 1, tokens: firstFill, marked: ['j', 'k', 'l'], added: [], outcome: 'continue', text: '頂列三個方形形成新的有效組合：繼續消除，回到第 2 步。' },
  { step: 1, round: 2, tokens: fallen, marked: [], added: [], outcome: '', text: '移除新組合中的三個方形；這次空位出現在頂列。' },
  { step: 2, round: 2, tokens: finalFill, marked: [], added: ['m', 'n', 'o'], outcome: '', text: '頂列補入三個預設符號；下方已在原位的符號保持不動。' },
  { step: 3, round: 2, tokens: finalFill, marked: [], added: [], outcome: 'stop', text: '沒有新的有效組合，本次連鎖停止；不會自行開始下一次。' },
];

/** @param {Frame} frame */
export function describeBoard(frame) {
  return Array.from({ length: 3 }, (_, row) => `第 ${row + 1} 列：${Array.from({ length: 3 }, (_, col) => {
    const item = frame.tokens.find((entry) => entry.cell === row * 3 + col);
    return item ? SYMBOL_NAMES[item.shape] : '空位';
  }).join('、')}`).join('；');
}

// Own exactly one timer. Stepping, pausing and resetting cancel it first.
/** @param {{onChange:(state:{index:number,playing:boolean,frame:Frame})=>void, schedule?:typeof setTimeout, cancel?:typeof clearTimeout, delay?:number}} options */
export function createCascadingController({ onChange, schedule = setTimeout, cancel = clearTimeout, delay = 1800 }) {
  let index = 0;
  let playing = false;
  let timer = null;
  const stopTimer = () => { if (timer !== null) cancel(timer); timer = null; };
  const emit = () => onChange({ index, playing, frame: CASCADING_FRAMES[index] });
  const queue = () => {
    stopTimer();
    if (!playing) return;
    timer = schedule(() => {
      timer = null;
      index = Math.min(index + 1, CASCADING_FRAMES.length - 1);
      if (index === CASCADING_FRAMES.length - 1) playing = false;
      emit();
      queue();
    }, delay);
  };
  return {
    start() { if (playing) return; if (index === CASCADING_FRAMES.length - 1) index = 0; playing = true; emit(); queue(); },
    pause() { stopTimer(); playing = false; emit(); },
    next() { stopTimer(); playing = false; index = Math.min(index + 1, CASCADING_FRAMES.length - 1); emit(); },
    reset() { stopTimer(); playing = false; index = 0; emit(); },
  };
}
