import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json' };
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1:4347');
    const path = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/materials.html' : url.pathname));
    if (!path.startsWith(root.endsWith(sep) ? root : root + sep) || !types[extname(path)] || !(await stat(path)).isFile()) throw Error('not allowed');
    let body = await readFile(path);
    const mode = url.searchParams.get('media');
    if (extname(path) === '.html' && ['image-only', 'none'].includes(mode)) {
      // Only change the pilot media section; retain Demo and the rest of the snapshot.
      body = Buffer.from(body.toString().replace(/<section class="gm"[\s\S]*?<\/section>/, section => {
        let fixture = section.replace(/<div class="gm-video"[\s\S]*?<\/small><\/div><\/div>/, '</div>');
        if (mode === 'none') fixture = fixture.replace(/<figure>[\s\S]*?<\/figure>/, '').replace(/<dialog[\s\S]*?<\/dialog>/, '');
        return fixture;
      }));
    }
    if (extname(path) === '.html' && url.searchParams.get('media') === 'absent') {
      body = Buffer.from(body.toString().replace(/<section class="gm"[\s\S]*?<\/section>/, ''));
    }
    res.writeHead(200, { 'Content-Type': types[extname(path)], 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' });
    res.end(body);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4347, '127.0.0.1', () => console.log('Scoped review server: http://127.0.0.1:4347; loopback only; no repository root exposure'));
