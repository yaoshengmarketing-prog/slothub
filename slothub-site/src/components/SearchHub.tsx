import { useMemo, useState } from 'react';
import { rankSearch } from '../lib/search.js';
import type { SearchItem as Item } from '../lib/search.js';
export default function SearchHub({items, compact=false}:{items:Item[];compact?:boolean}) {
  const [q,setQ]=useState('');
  const results=useMemo(()=>rankSearch(items,q,8),[q,items]);
  return <div className={`search-hub ${compact?'compact':''}`}>
    <label htmlFor="site-search">搜尋遊戲、廠商或教學</label>
    <div className="search-field"><span aria-hidden="true">⌕</span><input id="site-search" value={q} onChange={e=>setQ(e.target.value)} placeholder="例如：Chaos Crew、Slotmill、RTP" autoComplete="off"/></div>
    {q && <div className="search-results" role="listbox" aria-label="搜尋結果">
      {results.length ? results.map(i=><a href={i.url} key={`${i.kind}-${i.slug}`}><small>{i.kind}</small><strong>{i.title}</strong>{i.secondaryTitle&&<em>{i.secondaryTitle}</em>}<span>{i.providerName ? `${i.providerName}${i.seriesName ? ` · ${i.seriesName}` : ''}${i.installment ? ` · 第 ${i.installment} 代` : ''}` : i.description}</span></a>) : <p>找不到符合「{q}」的資料，試試較短的名稱。</p>}
    </div>}
  </div>
}
