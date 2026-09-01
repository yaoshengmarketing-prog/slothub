export const COMPARE_MISSING = '尚未核實';
export const COMPARE_ORIGINAL_MISSING = '未取得原廠標示';
export const COMPARE_NORMALIZED_MISSING = '尚未建立統一值';

export function bonusBuyLabel(value) {
  if (value === true) return '已確認支援';
  if (value === false) return '已確認不支援';
  return COMPARE_MISSING;
}

export function formatCompareDate(value) {
  if (!value) return COMPARE_MISSING;
  const [year, month, day] = value.split('-');
  return year && month && day ? `${year}/${month}/${day}` : value;
}

export function compareGridLabel(reels, rows) {
  if (reels && /^\d+\s*[x×]\s*\d+$/i.test(reels)) {
    return reels.replace(/\s*[x×]\s*/i, ' × ');
  }
  if (reels && /^\d+$/.test(reels.trim()) && rows !== undefined) return `${reels.trim()} × ${rows}`;
  if (reels) return reels;
  if (rows !== undefined) return `${rows} 列`;
  return COMPARE_MISSING;
}

export function compareWinCountLabel(winMechanism, winCount) {
  if (winCount === undefined) return COMPARE_MISSING;
  const count = winCount.toLocaleString('en-US');
  if (winMechanism === 'paylines') return `${count} 條`;
  if (winMechanism === 'ways-to-win' || winMechanism === 'megaways') return `${count} 路`;
  return count;
}
