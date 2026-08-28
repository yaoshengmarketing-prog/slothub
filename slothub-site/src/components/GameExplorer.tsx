import { useEffect, useMemo, useState } from 'react';
import { primaryTypeLabels, subtypeLabels, volatilityLabels, winMechanismLabels } from '../lib/taxonomy';
import { rankSearch } from '../lib/search.js';

export type Game = {
  slug: string; name: string; originalName: string; displayNameZhHant?: string; aliases: string[]; seriesId?: string; seriesNameZhHant?: string; installment?: number; relatedGames: string[]; provider: string; providerName: string; primaryType: string; subtypes: string[];
  summary: string; image?: { src: string; alt: string }; rtp?: number; rtpVariants?: number[]; volatility?: string; reels?: string;
  maxWinMultiplier?: number; winMechanism?: string;
  paylines?: string; bonusFeatures: string[]; editorialFeatured: boolean; url: string;
};

const KEY = 'slothub-compare';
function load() { try { return (JSON.parse(localStorage.getItem(KEY) || '[]') as string[]).slice(0, 3); } catch { return []; } }

function mechanismLabel(game: Game) {
  if (game.winMechanism !== 'other') return game.winMechanism ? winMechanismLabels[game.winMechanism] ?? game.winMechanism : undefined;
  const legacyDescription = game.paylines?.toLowerCase() ?? '';
  if (legacyDescription.includes('scatter') || legacyDescription.includes('pay anywhere')) return '散佈賠付';
  if (legacyDescription.includes('ways')) return '多路贏法';
  return winMechanismLabels.other;
}

function formatMultiplier(value: number) { return `${value.toLocaleString('en-US')}×`; }

export function useCompare(valid: string[]) {
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    setSelected(load().filter((slug) => valid.includes(slug)));
    const sync = () => setSelected(load().filter((slug) => valid.includes(slug)));
    addEventListener('storage', sync); addEventListener('slothub:compare', sync);
    return () => { removeEventListener('storage', sync); removeEventListener('slothub:compare', sync); };
  }, [valid.join('|')]);
  const save = (next: string[]) => { localStorage.setItem(KEY, JSON.stringify(next)); setSelected(next); dispatchEvent(new Event('slothub:compare')); };
  return { selected, toggle: (slug: string) => save(selected.includes(slug) ? selected.filter((item) => item !== slug) : selected.length < 3 ? [...selected, slug] : selected), remove: (slug: string) => save(selected.filter((item) => item !== slug)), clear: () => save([]) };
}

export default function GameExplorer({ games, initialLimit }: { games: Game[]; initialLimit?: number }) {
  const [q, setQ] = useState(''), [provider, setProvider] = useState(''), [primaryType, setPrimaryType] = useState(''), [subtype, setSubtype] = useState(''), [rtp, setRtp] = useState(''), [volatility, setVolatility] = useState('');
  const ids = useMemo(() => games.map((game) => game.slug), [games]); const compare = useCompare(ids);
  const filtered = useMemo(() => {
    const searched = q ? rankSearch(games.map((game) => ({ ...game, title: game.name, secondaryTitle: game.displayNameZhHant ? game.originalName : undefined, description: game.summary, kind: '遊戲' as const, aliases: game.aliases, seriesName: game.seriesNameZhHant, searchText: [game.providerName, game.summary] })), q, games.length).map((result) => games.find((game) => game.slug === result.slug)!) : games;
    return searched.filter((game) => !provider || game.provider === provider).filter((game) => !primaryType || game.primaryType === primaryType).filter((game) => !subtype || game.subtypes.includes(subtype)).filter((game) => !rtp || (game.rtp !== undefined && game.rtp >= Number(rtp))).filter((game) => !volatility || game.volatility === volatility);
  }, [games, q, provider, primaryType, subtype, rtp, volatility]);
  const providers = [...new Map(games.map((game) => [game.provider, game.providerName])).entries()], primaryTypes = [...new Set(games.map((game) => game.primaryType))], subtypes = [...new Set(games.flatMap((game) => game.subtypes))];
  const hasFilters = q || provider || primaryType || subtype || rtp || volatility;
  const shown = initialLimit && !hasFilters ? filtered.slice(0, initialLimit) : filtered;
  const clear = () => { setQ(''); setProvider(''); setPrimaryType(''); setSubtype(''); setRtp(''); setVolatility(''); };
  return <div className="explorer">
    <div className="filter-console"><div className="filter-search"><label htmlFor="game-filter">找遊戲</label><input id="game-filter" value={q} onChange={(event) => setQ(event.target.value)} placeholder="輸入遊戲或廠商名稱" /></div>
      <label>廠商<select value={provider} onChange={(event) => setProvider(event.target.value)}><option value="">全部廠商</option>{providers.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
      {primaryTypes.length > 1 && <label>主類型<select value={primaryType} onChange={(event) => setPrimaryType(event.target.value)}><option value="">全部主類型</option>{primaryTypes.map((type) => <option key={type} value={type}>{primaryTypeLabels[type] ?? type}</option>)}</select></label>}
      <label>子類型<select value={subtype} onChange={(event) => setSubtype(event.target.value)}><option value="">全部子類型</option>{subtypes.map((type) => <option key={type} value={type}>{subtypeLabels[type] ?? type}</option>)}</select></label>
      <label>最低 RTP<select value={rtp} onChange={(event) => setRtp(event.target.value)}><option value="">不限</option><option value="96">96% 以上</option><option value="96.2">96.2% 以上</option></select></label>
      <label>波動度<select value={volatility} onChange={(event) => setVolatility(event.target.value)}><option value="">不限</option>{Object.entries(volatilityLabels).map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select></label>
    </div>
    <div className="result-heading"><strong>{filtered.length}</strong><span>款符合目前條件</span></div>
    <div className="game-grid">{shown.map((game) => {
      const metrics = [
        game.rtp !== undefined ? { label: 'RTP', value: `${game.rtp}%`, note: (game.rtpVariants?.length ?? 0) > 1 ? '多版本' : undefined } : undefined,
        game.volatility ? { label: '波動度', value: volatilityLabels[game.volatility] ?? game.volatility } : undefined,
        game.maxWinMultiplier !== undefined ? { label: '最高倍數', value: formatMultiplier(game.maxWinMultiplier) } : undefined,
      ].filter(Boolean) as { label: string; value: string; note?: string }[];
      const mechanism = mechanismLabel(game);
      return <article className="game-card" key={game.slug}><a className="game-art" href={game.url} aria-label={`查看 ${game.name}`}>{game.image ? <img src={game.image.src} alt={game.image.alt} loading="lazy" /> : <b>{game.name.slice(0, 1)}</b>}<small>{game.providerName}</small></a><div className="game-card-body"><p>{game.providerName}</p><h3><a href={game.url}>{game.name}</a>{game.displayNameZhHant&&<small>{game.originalName}</small>}</h3>{metrics.length > 0 && <dl className="game-metrics">{metrics.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}{metric.note && <small>{metric.note}</small>}</dd></div>)}</dl>}{mechanism && <div className="game-mechanism"><span>賠付機制</span><b>{mechanism}</b></div>}<button className={compare.selected.includes(game.slug) ? 'compare-add active' : 'compare-add'} onClick={() => compare.toggle(game.slug)} disabled={!compare.selected.includes(game.slug) && compare.selected.length >= 3}>{compare.selected.includes(game.slug) ? '✓ 已加入比較' : '＋ 加入比較'}</button></div></article>;
    })}</div>
    {!shown.length && <div className="empty-result"><strong>沒有符合條件的遊戲</strong><button onClick={clear}>清除篩選</button></div>}
    {compare.selected.length > 0 && <CompareTray games={games} selected={compare.selected} remove={compare.remove} clear={compare.clear} />}
  </div>;
}

function CompareTray({ games, selected, remove, clear }: { games: Game[]; selected: string[]; remove: (slug: string) => void; clear: () => void }) {
  const [open, setOpen] = useState(true); const picked = selected.map((slug) => games.find((game) => game.slug === slug)).filter(Boolean) as Game[];
  return <aside className={`compare-tray ${open ? 'open' : ''}`}><button className="tray-toggle" onClick={() => setOpen(!open)}>比較列 {selected.length}/3 <span>{open ? '收合' : '展開'}</span></button><div className="tray-body">{picked.map((game) => <div key={game.slug}><b>{game.name}</b><button onClick={() => remove(game.slug)} aria-label={`移除 ${game.name}`}>×</button></div>)}{[...Array(3 - picked.length)].map((_, index) => <div className="empty-slot" key={index}>選擇遊戲</div>)}<a className="button primary" href={`/compare/?games=${selected.join(',')}`}>開始比較</a><button className="text-button" onClick={clear}>清除</button></div></aside>;
}
