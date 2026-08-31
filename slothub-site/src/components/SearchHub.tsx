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
  const results=useMemo(()=>rankSearch(items,q,8),[q,items]);
  return <div className={`search-hub ${compact?'compact':''}`}>
    <label htmlFor="site-search">搜尋遊戲、廠商或教學</label>
    <form className="search-field" action="/search/" method="get" onSubmit={submit}><span aria-hidden="true">⌕</span><input id="site-search" name="q" value={q} onChange={e=>updateQuery(e.target.value)} placeholder="例如：Chaos Crew、Slotmill、RTP" autoComplete="off"/><button className="button primary" type="submit">搜尋</button></form>
    {q && <div className="search-results" role="listbox" aria-label="搜尋結果">
      {results.length ? results.map(i=><a href={i.url} key={`${i.kind}-${i.slug}`} onClick={flushPendingQuery}><small>{i.kind}</small><strong>{i.title}</strong>{i.secondaryTitle&&<em>{i.secondaryTitle}</em>}<span>{i.providerName ? `${i.providerName}${i.seriesName ? ` · ${i.seriesName}` : ''}${i.installment ? ` · 第 ${i.installment} 代` : ''}` : i.description}</span></a>) : <p>找不到符合「{q}」的資料，試試較短的名稱。</p>}
    </div>}
  </div>
}
