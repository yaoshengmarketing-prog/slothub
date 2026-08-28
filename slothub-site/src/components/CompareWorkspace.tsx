import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { Game } from './GameExplorer';
import { featureLabels, volatilityLabels, winMechanismLabels } from '../lib/taxonomy';

const EMPTY = '—';
const CORE_FEATURES = [
  'free-spins', 'wild', 'scatter', 'multiplier', 'hold-and-spin', 'cascading',
  'respins', 'cash-collection', 'jackpot',
];

function initialSelection(valid: string[]) {
  const query = new URLSearchParams(location.search).get('games')?.split(',') ?? [];
  let stored: string[] = [];
  try { stored = JSON.parse(localStorage.getItem('slothub-compare') || '[]'); } catch { stored = []; }
  return [...new Set(query.length ? query : stored)].filter((slug) => valid.includes(slug)).slice(0, 3);
}

function mechanismLabel(game: Game) {
  if (game.winMechanism && game.winMechanism !== 'other') return winMechanismLabels[game.winMechanism] ?? game.winMechanism;
  const legacy = game.paylines?.toLowerCase() ?? '';
  if (legacy.includes('pay anywhere')) return winMechanismLabels['pay-anywhere'];
  if (legacy.includes('scatter')) return '散佈賠付';
  if (legacy.includes('ways')) return '多路贏法';
  return game.winMechanism === 'other' ? '其他' : EMPTY;
}

function gridLabel(game: Game) {
  if (game.reels && /[x×]/i.test(game.reels)) return game.reels.replace(/\s*[x×]\s*/i, ' × ');
  if (game.reels && game.rows !== undefined) return `${game.reels} × ${game.rows}`;
  if (game.reels) return game.reels;
  if (game.rows !== undefined) return `${game.rows} 列`;
  return EMPTY;
}

function winCountLabel(game: Game) {
  if (game.winCount === undefined) return EMPTY;
  const count = game.winCount.toLocaleString('en-US');
  if (game.winMechanism === 'paylines') return `${count} 條`;
  if (game.winMechanism === 'ways-to-win' || game.winMechanism === 'megaways') return `${count} 路`;
  return count;
}

function coreFeatures(game: Game) {
  const present = new Set(game.features ?? []);
  return CORE_FEATURES.filter((feature) => present.has(feature)).slice(0, 6);
}

type CompareRow = { label: string; render: (game: Game) => ReactNode };

export default function CompareWorkspace({ games }: { games: Game[] }) {
  const valid = useMemo(() => games.map((game) => game.slug), [games]);
  const [selected, setSelected] = useState<string[]>(() => initialSelection(valid));
  const [tableScrolled, setTableScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sync = (next: string[]) => {
    const clean = [...new Set(next)].filter((slug) => valid.includes(slug)).slice(0, 3);
    setSelected(clean);
    localStorage.setItem('slothub-compare', JSON.stringify(clean));
    history.replaceState(null, '', clean.length ? `/compare/?games=${clean.join(',')}` : '/compare/');
    dispatchEvent(new Event('slothub:compare'));
  };
  useEffect(() => { sync(selected); }, []);
  const picked = selected.map((slug) => games.find((game) => game.slug === slug)).filter(Boolean) as Game[];
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const updateStickyState = () => setTableScrolled(element.scrollTop > 16);
    element.addEventListener('scroll', updateStickyState, { passive: true });
    updateStickyState();
    return () => element.removeEventListener('scroll', updateStickyState);
  }, [picked.length]);

  const rows: CompareRow[] = [
    { label: '廠商', render: (game) => game.providerName || EMPTY },
    { label: '主要 RTP', render: (game) => <div className="compare-rtp"><span>{game.rtp !== undefined ? `${game.rtp}%` : EMPTY}</span>{(game.rtpVariants?.length ?? 0) > 1 && <small>多版本</small>}</div> },
    { label: '統一波動度', render: (game) => game.volatility ? volatilityLabels[game.volatility] ?? game.volatility : EMPTY },
    { label: '最高倍數', render: (game) => game.maxWinMultiplier !== undefined ? `${game.maxWinMultiplier.toLocaleString('en-US')}×` : EMPTY },
    { label: '賠付機制', render: mechanismLabel },
    { label: '軸數 × 列數', render: gridLabel },
    { label: '賠線／Ways 數量', render: winCountLabel },
    { label: 'Bonus Buy', render: (game) => game.bonusBuy === true ? '有' : game.bonusBuy === false ? '無' : '未確認' },
    { label: '核心 Features', render: (game) => {
      const features = coreFeatures(game);
      return features.length ? <ul className="compare-feature-tags">{features.map((feature) => <li key={feature}>{featureLabels[feature] ?? feature}</li>)}</ul> : EMPTY;
    } },
  ];

  return <div className="compare-workspace">
    <div className="compare-picker"><label htmlFor="compare-select">加入比較（最多三款）</label><select id="compare-select" value="" onChange={(event) => event.target.value && sync([...selected, event.target.value])} disabled={selected.length >= 3}><option value="">選擇遊戲</option>{games.filter((game) => !selected.includes(game.slug)).map((game) => <option key={game.slug} value={game.slug}>{game.name}{game.displayNameZhHant ? ` / ${game.originalName}` : ''} — {game.providerName}</option>)}</select></div>
    {picked.length ? <><div ref={scrollRef} className={`compare-scroll ${tableScrolled ? 'is-scrolled' : ''}`} tabIndex={0} aria-label="遊戲比較表，可上下及左右捲動" onWheel={(event) => event.deltaY > 0 && setTableScrolled(true)} onTouchMove={() => setTableScrolled(true)} onKeyDown={(event) => ['ArrowDown', 'PageDown', 'End'].includes(event.key) && setTableScrolled(true)}><div className="compare-table" data-cols={picked.length} style={{ '--cols': picked.length } as CSSProperties}><div className="compare-label compare-corner">遊戲名稱</div>{picked.map((game) => <div className="compare-head" key={game.slug}>{game.image && <div className="compare-image"><img src={game.image.src} alt={game.image.alt} /></div>}<div className="compare-identity"><a href={game.url}>{game.name}</a>{game.displayNameZhHant && <small>{game.originalName}</small>}{(game.seriesNameZhHant || game.installment) && <span className="compare-series">{game.seriesNameZhHant && <span className="series-name">{game.seriesNameZhHant}</span>}{game.installment && <span className="compare-installment">第 {game.installment} 代</span>}</span>}</div><button aria-label={`從比較中移除 ${game.name}`} onClick={() => sync(selected.filter((slug) => slug !== game.slug))}>移除</button></div>)}{rows.flatMap((row) => [<div className="compare-label" key={`${row.label}-label`}>{row.label}</div>, ...picked.map((game) => <div className="compare-value" key={`${row.label}-${game.slug}`}>{row.render(game)}</div>)])}</div></div><button className="text-button compare-clear" onClick={() => sync([])}>清除全部</button></> : <div className="empty-result"><strong>先選擇兩至三款遊戲</strong><p>比較表只呈現資料庫中已有的欄位，不會為了填滿表格補造資料。</p></div>}
  </div>;
}
