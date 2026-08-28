import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';
import { guideUrl } from '../lib/urls';
export async function GET(){const guides=(await getCollection('guides')).filter(x=>x.data.status==='published');return rss({title:'Slot Hub 教學',description:'Slot Hub 老虎機與電子遊戲知識更新',site:SITE.origin,items:guides.map(g=>({title:g.data.title,description:g.data.description,pubDate:g.data.publishedAt,link:guideUrl(g.id)}))})}
