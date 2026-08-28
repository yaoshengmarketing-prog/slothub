import { useEffect, useMemo, useState } from 'react';
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
  const sync = (next: string[]) => {
    const clean = [...new Set(next)].filter((slug) => valid.includes(slug)).slice(0, 3);
    setSelected(clean);
    localStorage.setItem('slothub-compare', JSON.stringify(clean));
    history.replaceState(null, '', clean.length ? `/compare/?games=${clean.join(',')}` : '/compare/');
    dispatchEvent(new Event('slothub:compare'));
  };
  useEffect(() => { sync(selected); }, []);
  const picked = selected.map((slug) => games.find((game) => game.slug === slug)).filter(Boolean) as Game[];

  return <div className="compare-workspace">
    <div className="compare-picker"><label htmlFor="compare-select">加入比較（最多三款）</label><select id="compare-select" value="" onChange={(event) => event.target.value && sync([...selected, event.target.value])} disabled={selected.length >= 3}><option value="">選擇遊戲</option>{games.filter((game) => !selected.includes(game.slug)).map((game) => <option key={game.slug} value={game.slug}>{game.name} — {game.providerName}</option>)}</select></div>
    {picked.length ? <><div className="compare-table" style={{ '--cols': picked.length } as React.CSSProperties}><div className="compare-label">遊戲</div>{picked.map((game) => <div className="compare-head" key={game.slug}>{game.image && <img src={game.image.src} alt="" />}<a href={game.url}>{game.name}</a><button onClick={() => sync(selected.filter((slug) => slug !== game.slug))}>移除</button></div>)}{[
      ['廠商', (game: Game) => game.providerName],
      ['RTP', (game: Game) => game.rtp ? `${game.rtp}%` : '尚無資料'],
      ['波動度', (game: Game) => game.volatility ? volatilityLabels[game.volatility] : '尚無資料'],
      ['盤面', (game: Game) => game.reels || '尚無資料'],
      ['Paylines / Ways', (game: Game) => game.paylines || '尚無資料'],
      ['Bonus features', (game: Game) => game.bonusFeatures.join('、') || '尚無資料'],
    ].flatMap(([label, get]) => [<div className="compare-label" key={`${label}-label`}>{label as string}</div>, ...picked.map((game) => <div key={`${label}-${game.slug}`}>{(get as (game: Game) => string)(game)}</div>)])}</div><button className="text-button" onClick={() => sync([])}>清除全部</button></> : <div className="empty-result"><strong>先選擇兩至三款遊戲</strong><p>比較表只呈現資料庫中已有的欄位，不會為了填滿表格補造資料。</p></div>}
  </div>;
}
