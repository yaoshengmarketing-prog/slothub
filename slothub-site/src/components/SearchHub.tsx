import { useEffect, useMemo, useRef, useState } from 'react';
import { rankSearch } from '../lib/search.js';
import type { SearchItem as Item } from '../lib/search.js';
import { readSearchQuery, searchStateUrl, writeCanonicalHistory } from '../lib/core-flow-state.mjs';
export default function SearchHub({items, compact=false, urlState=false}:{items:Item[];compact?:boolean;urlState?:boolean}) {
  const [q,setQ]=useState('');
  const replaceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!urlState) return;
    const restore = () => {
      if (replaceTimer.current) clearTimeout(replaceTimer.current);
      const next = readSearchQuery(location.search);
      setQ(next);
      writeCanonicalHistory(window, searchStateUrl(next), 'replace');
    };
    restore();
    addEventListener('popstate', restore);
    return () => {
      if (replaceTimer.current) clearTimeout(replaceTimer.current);
      removeEventListener('popstate', restore);
    };
  }, [urlState]);
  const updateQuery = (value:string) => {
    setQ(value);
    if (!urlState) return;
    if (replaceTimer.current) clearTimeout(replaceTimer.current);
    replaceTimer.current = setTimeout(() => writeCanonicalHistory(window, searchStateUrl(value), 'replace'), 250);
  };
  const flushPendingQuery = () => {
    if (replaceTimer.current) {
      clearTimeout(replaceTimer.current);
      replaceTimer.current = null;
    }
    if (urlState) writeCanonicalHistory(window, searchStateUrl(q), 'replace');
  };
  const submit = (event:{ preventDefault: () => void }) => {
    event.preventDefault();
    if (replaceTimer.current) {
      clearTimeout(replaceTimer.current);
      replaceTimer.current = null;
    }
    const nextUrl = searchStateUrl(q);
    if (urlState) {
      setQ(readSearchQuery(new URL(nextUrl, location.origin).search));
      writeCanonicalHistory(window, nextUrl, 'push');
    } else {
      location.assign(nextUrl);
    }
  };
  const submitFromInput = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };
  const results=useMemo(()=>rankSearch(items,q,8),[q,items]);
  const hasQuery = q.trim().length > 0;
  const resultGroups = useMemo(() => [
    { id: 'games', title: '遊戲', items: results.filter((item) => item.kind === '遊戲') },
    { id: 'providers', title: '遊戲廠商', items: results.filter((item) => item.kind === '廠商') },
    { id: 'knowledge', title: '教學與概念', items: results.filter((item) => !['遊戲', '廠商'].includes(item.kind)) },
  ].filter((group) => group.items.length), [results]);
  const actionLabel = (kind: Item['kind']) => ({
    '遊戲': '查看遊戲資料',
    '廠商': '查看廠商資料',
    '教學': '閱讀教學',
    '了解概念': '了解概念',
    '探索遊戲': '查看相關遊戲',
  }[kind]);
  return <div className={`search-hub ${compact?'compact':''}`}>
    <label htmlFor="site-search">搜尋遊戲、廠商或教學</label>
    <form className="search-field" action="/search/" method="get" onSubmit={submit}><span aria-hidden="true">⌕</span><input id="site-search" name="q" value={q} onChange={e=>updateQuery(e.target.value)} onKeyDown={submitFromInput} placeholder="例如：Chaos Crew、Slotmill、RTP" autoComplete="off"/><button className="button primary" type="submit">搜尋</button></form>
    {!hasQuery && !compact && <div className="search-start-guide"><p>可以輸入繁中名稱、原文名稱、別名、遊戲廠商或想了解的概念。</p><nav aria-label="其他找遊戲入口"><a href="/games/">依條件找遊戲</a><a href="/providers/">從遊戲廠商開始</a><a href="/slots/">從玩法與資料開始</a><a href="/guide/">瀏覽全部教學</a></nav></div>}
    {hasQuery && <div className="search-results" aria-label="搜尋結果" aria-live="polite">
      {results.length ? <>
        <p className="search-result-summary">找到 {results.length} 筆與「{q.trim()}」相關的結果</p>
        {resultGroups.map((group) => <section className="search-result-group" aria-labelledby={`search-group-${group.id}`} key={group.id}>
          <h2 id={`search-group-${group.id}`}>{group.title}<small>{group.items.length}</small></h2>
          <div>{group.items.map((item) => <a href={item.url} key={`${item.kind}-${item.slug}`} onClick={flushPendingQuery}><small>{item.kind}</small><strong>{item.title}</strong>{item.secondaryTitle&&<em>{item.secondaryTitle}</em>}<span>{item.providerName ? `${item.providerName}${item.seriesName ? ` · ${item.seriesName}` : ''}${item.installment ? ` · 第 ${item.installment} 代` : ''}` : item.description}</span><b>{actionLabel(item.kind)} →</b></a>)}</div>
        </section>)}
      </> : <div className="search-empty-state" role="status"><strong>找不到符合「{q.trim()}」的資料</strong><p>試試較短的名稱，或改從遊戲廠商、玩法與完整條件開始。</p><div><a href="/games/">依條件找遊戲</a><a href="/providers/">查看遊戲廠商</a><a href="/slots/">看懂玩法與資料</a></div></div>}
    </div>}
  </div>
}
