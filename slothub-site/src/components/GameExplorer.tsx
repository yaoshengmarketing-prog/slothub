import { useEffect, useMemo, useState } from 'react';
import type { GameCatalogItem } from '../lib/game-catalog';
import {
  emptyExplorerState, explorerOptions, featureResultCount, filterAndSortGames, hasExplorerFilters,
  MAX_WIN_THRESHOLDS, parseExplorerState, RTP_THRESHOLDS, type ExplorerState,
} from '../lib/game-explorer-state.mjs';
import { gamesIndexUrl } from '../lib/urls';
import type { ExplorerGuideLink } from '../lib/guide-relationship-catalog';
import { featureLabels, primaryTypeLabels, subtypeLabels, volatilityLabels, winMechanismLabels } from '../lib/taxonomy';

export type Game = GameCatalogItem;

const KEY = 'slothub-compare';
const PRIMARY_FEATURES = ['free-spins', 'wild', 'scatter', 'multiplier', 'cascading', 'bonus-buy'];
const FEATURE_ENGLISH: Record<string, string> = {
  'free-spins': 'Free Spins', wild: 'Wild', scatter: 'Scatter', multiplier: 'Multiplier',
  cascading: 'Cascading', 'bonus-buy': 'Bonus Buy', respins: 'Respins',
  'giant-symbols': 'Giant Symbols', 'cash-collection': 'Cash Collection',
  'hold-and-spin': 'Hold & Spin', 'symbol-splitting': 'Symbol Splitting',
  'sticky-symbols': 'Sticky Symbols', jackpot: 'Jackpot', other: 'Other',
};

function load() {
  try { return (JSON.parse(localStorage.getItem(KEY) || '[]') as string[]).slice(0, 3); }
  catch { return []; }
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

function FeatureToggle({ feature, count, selected, onToggle }: { feature: string; count: number; selected: boolean; onToggle: () => void }) {
  return <button type="button" className={selected ? 'feature-filter active' : 'feature-filter'} aria-pressed={selected} onClick={onToggle} disabled={!selected && count === 0}>
    <span>{featureLabels[feature] ?? feature}<small>{FEATURE_ENGLISH[feature]}</small></span><b>{count}</b>
  </button>;
}

export default function GameExplorer({ games, initialLimit, urlState = false, relationshipLinks = [] }: { games: GameCatalogItem[]; initialLimit?: number; urlState?: boolean; relationshipLinks?: ExplorerGuideLink[] }) {
  const [state, setState] = useState<ExplorerState>(() => emptyExplorerState());
  const [urlReady, setUrlReady] = useState(!urlState);
  const ids = useMemo(() => games.map((game) => game.slug), [games]);
  const compare = useCompare(ids);
  const options = useMemo(() => explorerOptions(games), [games]);

  useEffect(() => {
    if (!urlState) return;
    const readUrl = () => setState(parseExplorerState(location.search, games));
    readUrl();
    setUrlReady(true);
    addEventListener('popstate', readUrl);
    return () => removeEventListener('popstate', readUrl);
  }, [urlState, games]);

  useEffect(() => {
    if (!urlState || !urlReady) return;
    const nextUrl = gamesIndexUrl(state);
    const currentUrl = `${location.pathname}${location.search}`;
    if (currentUrl !== nextUrl) history.replaceState(history.state, '', nextUrl);
  }, [state, urlReady, urlState]);

  const filtered = useMemo(() => filterAndSortGames(games, state), [games, state]);
  const providers = useMemo(() => [...new Map(games.map((game) => [game.provider, game.providerName])).entries()].sort((a, b) => a[1].localeCompare(b[1], 'zh-Hant-TW')), [games]);
  const primaryTypes = [...options.primaryTypes];
  const subtypes = [...options.subtypes].sort((a, b) => (subtypeLabels[a] ?? a).localeCompare(subtypeLabels[b] ?? b, 'zh-Hant-TW'));
  const mechanisms = [...options.mechanisms].sort((a, b) => (winMechanismLabels[a] ?? a).localeCompare(winMechanismLabels[b] ?? b, 'zh-Hant-TW'));
  const availableFeatures = Object.keys(featureLabels).filter((feature) => options.features.has(feature));
  const primaryFeatures = PRIMARY_FEATURES.filter((feature) => options.features.has(feature));
  const advancedFeatures = availableFeatures.filter((feature) => !PRIMARY_FEATURES.includes(feature));
  const hasFilters = hasExplorerFilters(state);
  const shown = initialLimit && !hasFilters ? filtered.slice(0, initialLimit) : filtered;
  const hasNumericFilter = state.rtpMin !== undefined || Boolean(state.volatility) || state.maxWinMin !== undefined;
  const advancedActive = Boolean(state.rtpMin !== undefined || state.volatility || state.maxWinMin !== undefined || state.subtype || advancedFeatures.some((feature) => state.features.includes(feature)));
  const activeGuideLinks = relationshipLinks.filter((link) =>
    (link.type === 'mechanism' && state.mechanism === link.value)
    || (link.type === 'feature' && state.features.includes(link.value)),
  );

  const update = (patch: Partial<ExplorerState>) => setState((current) => {
    const next = { ...current, ...patch };
    if (patch.q !== undefined) {
      if (!current.q && patch.q && current.sort === 'name-asc') next.sort = 'relevance';
      if (current.q && !patch.q && current.sort === 'relevance') next.sort = 'name-asc';
    }
    return next;
  });
  const toggleFeature = (feature: string) => update({ features: state.features.includes(feature) ? state.features.filter((item) => item !== feature) : [...state.features, feature] });
  const clear = () => setState(emptyExplorerState());

  return <div className={`explorer explorer-v2 ${urlState && !urlReady ? 'url-state-loading' : ''}`}>
    <div className="filter-console-v2">
      <div className="filter-search-v2"><label htmlFor="game-filter">搜尋遊戲</label><div><span aria-hidden="true">⌕</span><input id="game-filter" value={state.q} onChange={(event) => update({ q: event.target.value })} placeholder="遊戲、廠商、玩法或功能" autoComplete="off" /></div></div>
      <div className="primary-filters">
        <label>廠商<select value={state.provider} onChange={(event) => update({ provider: event.target.value })}><option value="">全部廠商</option>{providers.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
        {primaryTypes.length > 1 && <label>主類型<select value={state.primaryType} onChange={(event) => update({ primaryType: event.target.value })}><option value="">全部主類型</option>{primaryTypes.map((type) => <option key={type} value={type}>{primaryTypeLabels[type] ?? type}</option>)}</select></label>}
        <label>賠付機制<select value={state.mechanism} onChange={(event) => update({ mechanism: event.target.value })}><option value="">全部機制</option>{mechanisms.map((mechanism) => <option key={mechanism} value={mechanism}>{winMechanismLabels[mechanism] ?? mechanism}（{games.filter((game) => game.winMechanism === mechanism).length}）</option>)}</select></label>
        <label>排序<select value={state.sort} onChange={(event) => update({ sort: event.target.value as ExplorerState['sort'] })}>{state.q && <option value="relevance">搜尋相關度</option>}<option value="name-asc">名稱 A–Z</option><option value="rtp-desc">RTP 高到低</option><option value="rtp-asc">RTP 低到高</option><option value="max-win-desc">最高倍數 高到低</option><option value="max-win-asc">最高倍數 低到高</option></select></label>
      </div>
      <fieldset className="feature-filters"><legend>遊戲功能 <small>可複選，需符合全部條件</small></legend><div>{primaryFeatures.map((feature) => <FeatureToggle key={feature} feature={feature} selected={state.features.includes(feature)} count={featureResultCount(games, state, feature)} onToggle={() => toggleFeature(feature)} />)}</div></fieldset>
      <details className="advanced-filters" open={advancedActive || undefined}>
        <summary><span>進階篩選</span><small>RTP、波動度、最高倍數與子類型</small></summary>
        <div className="advanced-filter-grid">
          <label>最低 RTP<select value={state.rtpMin ?? ''} onChange={(event) => update({ rtpMin: event.target.value ? Number(event.target.value) : undefined })}><option value="">不限</option>{RTP_THRESHOLDS.map((value) => <option key={value} value={value}>{value}% 以上</option>)}</select></label>
          <label>統一波動度<select value={state.volatility} onChange={(event) => update({ volatility: event.target.value })}><option value="">不限</option>{Object.entries(volatilityLabels).filter(([value]) => options.volatilities.has(value)).map(([value, name]) => <option key={value} value={value}>{name}（{games.filter((game) => game.volatilityNormalized === value).length}）</option>)}</select></label>
          <label>最低最高倍數<select value={state.maxWinMin ?? ''} onChange={(event) => update({ maxWinMin: event.target.value ? Number(event.target.value) : undefined })}><option value="">不限</option>{MAX_WIN_THRESHOLDS.map((value) => <option key={value} value={value}>{formatMultiplier(value)} 以上</option>)}</select></label>
          <label>子類型<select value={state.subtype} onChange={(event) => update({ subtype: event.target.value })}><option value="">全部子類型</option>{subtypes.map((type) => <option key={type} value={type}>{subtypeLabels[type] ?? type}（{games.filter((game) => game.subtypes.includes(type)).length}）</option>)}</select></label>
        </div>
        {advancedFeatures.length > 0 && <div className="advanced-feature-list"><p>更多遊戲功能</p><div>{advancedFeatures.map((feature) => <FeatureToggle key={feature} feature={feature} selected={state.features.includes(feature)} count={featureResultCount(games, state, feature)} onToggle={() => toggleFeature(feature)} />)}</div></div>}
      </details>
    </div>

    <div className="result-heading explorer-result-heading"><div><strong>{filtered.length}</strong><span>款符合目前條件</span>{hasNumericFilter && <small>數值條件只包含已取得該欄位的遊戲</small>}</div>{hasFilters && <button type="button" className="clear-filters" onClick={clear}>清除全部條件</button>}</div>
    {activeGuideLinks.length > 0 && <aside className="explorer-guide-links" aria-label="目前條件的相關教學">
      <span>看懂目前條件</span>
      <div>{activeGuideLinks.map((link) => <a key={`${link.type}-${link.value}`} href={link.guideUrl}><b>{link.label}</b><small>{link.guideTitle}</small><i>閱讀 →</i></a>)}</div>
    </aside>}
    {state.primaryType && primaryTypes.length === 1 && <div className="active-context">目前類型：<b>{primaryTypeLabels[state.primaryType] ?? state.primaryType}</b></div>}
    {!urlState && hasFilters && <a className="explorer-share-link" href={gamesIndexUrl(state)}>在完整遊戲庫開啟這組條件 →</a>}
    <div className="game-grid">{shown.map((game) => {
      const metrics = [
        game.rtp !== undefined ? { label: 'RTP', value: `${game.rtp}%`, note: game.rtpVariants.length > 1 ? '多版本' : undefined } : undefined,
        game.volatilityNormalized ? { label: '波動度', value: volatilityLabels[game.volatilityNormalized] ?? game.volatilityNormalized } : undefined,
        game.maxWinMultiplier !== undefined ? { label: '最高倍數', value: formatMultiplier(game.maxWinMultiplier) } : undefined,
      ].filter(Boolean) as { label: string; value: string; note?: string }[];
      return <article className="game-card" key={game.slug}><a className="game-art" href={game.url} aria-label={`查看 ${game.name}`}>{game.image ? <img src={game.image.src} alt={game.image.alt} loading="lazy" /> : <b>{game.name.slice(0, 1)}</b>}<small>{game.providerName}</small></a><div className="game-card-body"><p>{game.providerName}</p><h3><a href={game.url}>{game.name}</a>{game.displayNameZhHant && <small>{game.originalName}</small>}</h3>{metrics.length > 0 && <dl className="game-metrics">{metrics.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}{metric.note && <small>{metric.note}</small>}</dd></div>)}</dl>}{game.mechanismLabel && <div className="game-mechanism"><span>賠付機制</span><b>{game.mechanismLabel}</b></div>}<button className={compare.selected.includes(game.slug) ? 'compare-add active' : 'compare-add'} onClick={() => compare.toggle(game.slug)} disabled={!compare.selected.includes(game.slug) && compare.selected.length >= 3}>{compare.selected.includes(game.slug) ? '✓ 已加入比較' : '＋ 加入比較'}</button></div></article>;
    })}</div>
    {!shown.length && <div className="empty-result"><strong>沒有符合這組條件的遊戲</strong><p>移除一個功能或降低數值門檻，再看看其他結果。</p><button onClick={clear}>清除篩選</button></div>}
    {compare.selected.length > 0 && <CompareTray games={games} selected={compare.selected} remove={compare.remove} clear={compare.clear} />}
  </div>;
}

function CompareTray({ games, selected, remove, clear }: { games: GameCatalogItem[]; selected: string[]; remove: (slug: string) => void; clear: () => void }) {
  const [open, setOpen] = useState(true);
  const picked = selected.map((slug) => games.find((game) => game.slug === slug)).filter(Boolean) as GameCatalogItem[];
  return <aside className={`compare-tray ${open ? 'open' : ''}`}><button className="tray-toggle" onClick={() => setOpen(!open)}>比較列 {selected.length}/3 <span>{open ? '收合' : '展開'}</span></button><div className="tray-body">{picked.map((game) => <div key={game.slug}><b>{game.name}</b><button onClick={() => remove(game.slug)} aria-label={`移除 ${game.name}`}>×</button></div>)}{[...Array(3 - picked.length)].map((_, index) => <div className="empty-slot" key={index}>選擇遊戲</div>)}<a className="button primary" href={`/compare/?games=${selected.join(',')}`}>開始比較</a><button className="text-button" onClick={clear}>清除</button></div></aside>;
}
