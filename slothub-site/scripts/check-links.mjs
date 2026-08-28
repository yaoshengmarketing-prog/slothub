import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function targetFor(href) {
  const pathname = decodeURIComponent(href.split(/[?#]/, 1)[0]);
  if (pathname === '/') return join(distDir, 'index.html');

  const clean = pathname.replace(/^\//, '');
  if (extname(clean)) return join(distDir, clean);
  return join(distDir, clean, 'index.html');
}

const failures = [];
const htmlFiles = walk(distDir).filter((path) => path.endsWith('.html'));

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const hrefs = [...html.matchAll(/\bhref=["']([^"']+)["']/g)].map((match) => match[1]);

  for (const href of hrefs) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    if (!existsSync(targetFor(href))) {
      failures.push(`${relative(distDir, file)} -> ${href}`);
    }
  }
}

if (failures.length > 0) {
  console.error(`Internal link check failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Internal link check: PASS (${htmlFiles.length} HTML files)`);
