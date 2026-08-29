export const primaryTypeLabels: Record<string, string> = {
  slots: '老虎機',
  'fishing-games': '捕魚機',
  other: '其他電子遊戲',
};

export const subtypeLabels: Record<string, string> = {
  'video-slots': '影片老虎機',
  'classic-slots': '傳統老虎機',
  'jackpot-slots': 'Jackpot 老虎機',
  'cluster-pays': '群集得獎',
  'ways-to-win': '多路得獎',
  'cascading-reels': '連鎖消除',
  'hold-and-win': 'Hold and Win',
};

export const volatilityLabels: Record<string, string> = {
  low: '低',
  medium: '中',
  'medium-high': '中高',
  high: '高',
  'very-high': '極高',
};

export const winMechanismLabels: Record<string, string> = {
  paylines: '賠線',
  'ways-to-win': '多路贏法',
  megaways: 'Megaways',
  'cluster-pays': '群集賠付',
  'pay-anywhere': '任意位置賠付',
  other: '其他',
};

export const winMechanismSearchTerms: Record<string, string[]> = {
  paylines: ['Paylines', 'Payline', '賠線'],
  'ways-to-win': ['Ways to Win', 'Ways', '多路贏法'],
  megaways: ['Megaways'],
  'cluster-pays': ['Cluster Pays', '群集賠付'],
  'pay-anywhere': ['Pay Anywhere', '任意位置賠付'],
  other: ['Other mechanism', '其他機制'],
};

export const featureLabels: Record<string, string> = {
  'free-spins': '免費旋轉', wild: '百搭符號', scatter: '散佈符號', multiplier: '倍數',
  'hold-and-spin': 'Hold & Spin', cascading: '連鎖消除', 'bonus-buy': 'Bonus Buy', respins: '重轉',
  'cash-collection': '獎金收集', 'giant-symbols': '巨型符號', 'symbol-splitting': '符號分裂',
  'sticky-symbols': '黏著符號', jackpot: 'Jackpot 功能', other: '其他功能',
};

export const featureSearchTerms: Record<string, string[]> = {
  'free-spins': ['Free Spins', '免費旋轉'], wild: ['Wild', '百搭符號'], scatter: ['Scatter', '散佈符號'], multiplier: ['Multiplier', '倍數'],
  'hold-and-spin': ['Hold and Spin', 'Hold & Spin'], cascading: ['Cascading', 'Avalanche', 'Tumble', '連鎖消除'], 'bonus-buy': ['Bonus Buy'],
  respins: ['Respins', 'Respin', '重轉'], 'cash-collection': ['Cash Collection', 'Money Collect', '獎金收集'],
  'giant-symbols': ['Giant Symbols', '巨型符號'], 'symbol-splitting': ['Symbol Splitting', '符號分裂'],
  'sticky-symbols': ['Sticky Symbols', '黏著符號'], jackpot: ['Jackpot', 'Jackpot 功能'], other: ['Other feature', '其他功能'],
};

export const dataTopicLabels: Record<string, string> = {
  rtp: 'RTP',
  'rtp-variants': '多版本 RTP',
  volatility: '波動度',
  'max-win': '最高倍數',
};

export const dataTopicSearchTerms: Record<string, string[]> = {
  rtp: ['RTP', '理論回報率'],
  'rtp-variants': ['RTP variants', '多版本 RTP', 'RTP 版本'],
  volatility: ['Volatility', '波動度'],
  'max-win': ['Max Win', '最高倍數'],
};

export const jackpotTypeLabels: Record<string, string> = {
  none: '無', fixed: '固定彩金', progressive: '累進彩金', local: '區域彩金',
  networked: '聯網彩金', multiple: '多種彩金', other: '其他',
};

export const providerRoleLabels: Record<string, string> = {
  developer: '遊戲開發商',
  publisher: '發行商',
  aggregator: '聚合平台',
  platform: '技術平台',
};

export const guideCategoryLabels: Record<string, string> = {
  beginner: '新手入門',
  mechanics: '遊戲機制',
  data: '數據概念',
  terms: 'Slot 術語',
  fishing: '捕魚機教學',
};
