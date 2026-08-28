import { getCollection } from 'astro:content';
import { SITE } from '../consts';
import { absoluteUrl, gameUrl, providerUrl, guideUrl } from '../lib/urls';

export async function GET() {
  const paths = SITE.environment === 'production' ? [
    '/', '/games/', '/providers/', '/guide/', '/tools/', '/slots/', '/fishing-games/',
    ...(await getCollection('games')).filter(x=>x.data.status==='published').map(x=>gameUrl(x.id)),
    ...(await getCollection('providers')).filter(x=>x.data.status==='published').map(x=>providerUrl(x.id)),
    ...(await getCollection('guides')).filter(x=>x.data.status==='published').map(x=>guideUrl(x.id)),
  ] : [];
  const urls = paths.map((path) => `  <url><loc>${absoluteUrl(path)}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Robots-Tag': SITE.environment === 'production' ? 'index, follow' : 'noindex, nofollow',
    },
  });
}
