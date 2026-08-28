import { useEffect, useMemo, useRef, useState } from 'react';
import type { Game } from './GameExplorer';
import { volatilityLabels } from '../lib/taxonomy';

function initialSelection(valid: string[]) {
  const query = new URLSearchParams(location.search).get('games')?.split(',') ?? [];
  let stored: string[] = [];
  try { stored = JSON.parse(localStorage.getItem('slothub-compare') || '[]'); } catch { stored = []; }
  return [...new Set(query.length ? query : stored)].filter((slug) => valid.includes(slug)).slice(0, 3);
}

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

  return <div className="compare-workspace">
    <div className="compare-picker"><label htmlFor="compare-select">加入比較（最多三款）</label><select id="compare-select" value="" onChange={(event) => event.target.value && sync([...selected, event.target.value])} disabled={selected.length >= 3}><option value="">選擇遊戲</option>{games.filter((game) => !selected.includes(game.slug)).map((game) => <option key={game.slug} value={game.slug}>{game.name}{game.displayNameZhHant ? ` / ${game.originalName}` : ''} — {game.providerName}</option>)}</select></div>
    {picked.length ? <><div ref={scrollRef} className={`compare-scroll ${tableScrolled ? 'is-scrolled' : ''}`} tabIndex={0} aria-label="遊戲比較表，可上下及左右捲動" onWheel={(event) => event.deltaY > 0 && setTableScrolled(true)} onTouchMove={() => setTableScrolled(true)} onKeyDown={(event) => ['ArrowDown','PageDown','End'].includes(event.key) && setTableScrolled(true)}><div className="compare-table" data-cols={picked.length} style={{ '--cols': picked.length } as React.CSSProperties}><div className="compare-label compare-corner">遊戲名稱</div>{picked.map((game) => <div className="compare-head" key={game.slug}>{game.image && <div className="compare-image"><img src={game.image.src} alt={game.image.alt} /></div>}<div className="compare-identity"><a href={game.url}>{game.name}</a>{game.displayNameZhHant&&<small>{game.originalName}</small>}{(game.seriesNameZhHant||game.installment)&&<span className="compare-series">{game.seriesNameZhHant&&<span className="series-name">{game.seriesNameZhHant}</span>}{game.installment&&<span className="compare-installment">第 {game.installment} 代</span>}</span>}</div><button aria-label={`從比較中移除 ${game.name}`} onClick={() => sync(selected.filter((slug) => slug !== game.slug))}>移除</button></div>)}{[
      ['廠商', (game: Game) => game.providerName],
      ['RTP', (game: Game) => game.rtp ? `${game.rtp}%` : '尚無資料'],
      ['波動度', (game: Game) => game.volatility ? volatilityLabels[game.volatility] : '尚無資料'],
      ['盤面', (game: Game) => game.reels || '尚無資料'],
      ['Paylines / Ways', (game: Game) => game.paylines || '尚無資料'],
      ['Bonus features', (game: Game) => game.bonusFeatures.join('、') || '尚無資料'],
    ].flatMap(([label, get]) => [<div className="compare-label" key={`${label}-label`}>{label as string}</div>, ...picked.map((game) => <div className="compare-value" key={`${label}-${game.slug}`}>{(get as (game: Game) => string)(game)}</div>)])}</div></div><button className="text-button compare-clear" onClick={() => sync([])}>清除全部</button></> : <div className="empty-result"><strong>先選擇兩至三款遊戲</strong><p>比較表只呈現資料庫中已有的欄位，不會為了填滿表格補造資料。</p></div>}
  </div>;
}
