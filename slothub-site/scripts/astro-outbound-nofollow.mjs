import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { qualifyOutboundLinks } from './outbound-links.mjs';

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : (entry.isFile() && path.endsWith('.html') ? [path] : []);
  }));
  return paths.flat();
}

export default function outboundNofollow() {
  return {
    name: 'slot-hub-outbound-nofollow',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const files = await htmlFiles(fileURLToPath(dir));
        let changed = 0;
        for (const path of files) {
          const html = await readFile(path, 'utf8');
          const qualified = qualifyOutboundLinks(html);
          if (qualified === html) continue;
          await writeFile(path, qualified);
          changed++;
        }
        logger.info(`Qualified outbound links in ${changed} of ${files.length} HTML files.`);
      },
    },
  };
}
