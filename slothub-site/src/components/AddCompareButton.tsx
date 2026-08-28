import { useCompare, type Game } from './GameExplorer';
export default function AddCompareButton({game,allSlugs}:{game:Game;allSlugs:string[]}){const c=useCompare(allSlugs);const active=c.selected.includes(game.slug);return <button className={active?'button primary':'button secondary'} onClick={()=>c.toggle(game.slug)} disabled={!active&&c.selected.length>=3}>{active?'已加入比較':'加入比較'}</button>}
