import { useEffect, useMemo, useState } from 'react';
export type Game = { slug:string; name:string; provider:string; providerName:string; primaryType:string; subtypes:string[]; summary:string; rtp?:number; volatility?:string; reels?:string; paylines?:string; bonusFeatures:string[]; editorialFeatured:boolean; url:string };
const KEY='slothub-compare';
const vol:Record<string,string>={low:'低',medium:'中', 'medium-high':'中高',high:'高','very-high':'極高'};
function load(){try{return (JSON.parse(localStorage.getItem(KEY)||'[]') as string[]).slice(0,3)}catch{return []}}
export function useCompare(valid:string[]){
 const [selected,setSelected]=useState<string[]>([]);
 useEffect(()=>{setSelected(load().filter(x=>valid.includes(x))); const sync=()=>setSelected(load().filter(x=>valid.includes(x))); addEventListener('storage',sync);addEventListener('slothub:compare',sync);return()=>{removeEventListener('storage',sync);removeEventListener('slothub:compare',sync)}},[valid.join('|')]);
 const save=(next:string[])=>{localStorage.setItem(KEY,JSON.stringify(next));setSelected(next);dispatchEvent(new Event('slothub:compare'))};
 return {selected,toggle:(slug:string)=>save(selected.includes(slug)?selected.filter(x=>x!==slug):selected.length<3?[...selected,slug]:selected),remove:(slug:string)=>save(selected.filter(x=>x!==slug)),clear:()=>save([])};
}
export default function GameExplorer({games,initialLimit}:{games:Game[];initialLimit?:number}){
 const [q,setQ]=useState(''),[provider,setProvider]=useState(''),[type,setType]=useState(''),[rtp,setRtp]=useState(''),[volatility,setVolatility]=useState('');
 const ids=useMemo(()=>games.map(g=>g.slug),[games]); const compare=useCompare(ids);
 const filtered=useMemo(()=>games.filter(g=>!q||`${g.name} ${g.providerName} ${g.summary}`.toLowerCase().includes(q.toLowerCase())).filter(g=>!provider||g.provider===provider).filter(g=>!type||g.subtypes.includes(type)).filter(g=>!rtp||(g.rtp!==undefined&&g.rtp>=Number(rtp))).filter(g=>!volatility||g.volatility===volatility),[games,q,provider,type,rtp,volatility]);
 const providers=[...new Map(games.map(g=>[g.provider,g.providerName])).entries()]; const types=[...new Set(games.flatMap(g=>g.subtypes))];
 const shown=initialLimit && !q&&!provider&&!type&&!rtp&&!volatility?filtered.slice(0,initialLimit):filtered;
 return <div className="explorer">
  <div className="filter-console"><div className="filter-search"><label htmlFor="game-filter">找遊戲</label><input id="game-filter" value={q} onChange={e=>setQ(e.target.value)} placeholder="輸入遊戲或廠商名稱"/></div>
   <label>廠商<select value={provider} onChange={e=>setProvider(e.target.value)}><option value="">全部廠商</option>{providers.map(([id,n])=><option key={id} value={id}>{n}</option>)}</select></label>
   <label>子類型<select value={type} onChange={e=>setType(e.target.value)}><option value="">全部類型</option>{types.map(t=><option key={t}>{t}</option>)}</select></label>
   <label>最低 RTP<select value={rtp} onChange={e=>setRtp(e.target.value)}><option value="">不限</option><option value="96">96% 以上</option><option value="96.2">96.2% 以上</option></select></label>
   <label>波動度<select value={volatility} onChange={e=>setVolatility(e.target.value)}><option value="">不限</option>{Object.entries(vol).map(([v,n])=><option key={v} value={v}>{n}</option>)}</select></label>
  </div>
  <div className="result-heading"><strong>{filtered.length}</strong><span>款符合目前條件</span></div>
  <div className="game-grid">{shown.map((g,i)=><article className="game-card" key={g.slug}>
    <a className="game-art" href={g.url} aria-label={`查看 ${g.name}`}><span>{String(i+1).padStart(2,'0')}</span><b>{g.name.slice(0,1)}</b><small>{g.providerName}</small></a>
    <div className="game-card-body"><p>{g.providerName}</p><h3><a href={g.url}>{g.name}</a></h3><div className="data-row"><span>RTP <b>{g.rtp?`${g.rtp}%`:'待補'}</b></span><span>波動 <b>{g.volatility?vol[g.volatility]:'待補'}</b></span></div>
    <button className={compare.selected.includes(g.slug)?'compare-add active':'compare-add'} onClick={()=>compare.toggle(g.slug)} disabled={!compare.selected.includes(g.slug)&&compare.selected.length>=3}>{compare.selected.includes(g.slug)?'✓ 已加入比較':'＋ 加入比較'}</button></div>
   </article>)}</div>
  {!shown.length&&<div className="empty-result"><strong>沒有符合條件的遊戲</strong><button onClick={()=>{setQ('');setProvider('');setType('');setRtp('');setVolatility('')}}>清除篩選</button></div>}
  {compare.selected.length>0&&<CompareTray games={games} selected={compare.selected} remove={compare.remove} clear={compare.clear}/>} 
 </div>
}
function CompareTray({games,selected,remove,clear}:{games:Game[];selected:string[];remove:(s:string)=>void;clear:()=>void}){const [open,setOpen]=useState(true);const picked=selected.map(s=>games.find(g=>g.slug===s)).filter(Boolean) as Game[];return <aside className={`compare-tray ${open?'open':''}`}><button className="tray-toggle" onClick={()=>setOpen(!open)}>比較列 {selected.length}/3 <span>{open?'收合':'展開'}</span></button><div className="tray-body">{picked.map(g=><div key={g.slug}><b>{g.name}</b><button onClick={()=>remove(g.slug)} aria-label={`移除 ${g.name}`}>×</button></div>)}{[...Array(3-picked.length)].map((_,i)=><div className="empty-slot" key={i}>選擇遊戲</div>)}<a className="button primary" href={`/compare/?games=${selected.join(',')}`}>開始比較</a><button className="text-button" onClick={clear}>清除</button></div></aside>}
