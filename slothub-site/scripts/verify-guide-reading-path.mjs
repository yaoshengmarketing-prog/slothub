import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import {
  buildGuideReadingSections,
  GUIDE_READING_EXTENSIONS,
  GUIDE_READING_PATHS,
} from '../src/lib/guide-reading-path.mjs';

const guideDirectory = new URL('../src/content/guides/', import.meta.url);
const files = (await readdir(guideDirectory)).filter((file) => file.endsWith('.md'));
const guides = await Promise.all(files.map(async (file) => {
  const source = await readFile(new URL(file, guideDirectory), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  assert.ok(frontmatter, `${file} frontmatter missing`);
  return { id: file.replace(/\.md$/, ''), data: parse(frontmatter) };
}));
const published = guides.filter((guide) => guide.data.status === 'published');
const definitions = [...GUIDE_READING_PATHS, ...GUIDE_READING_EXTENSIONS];
const sections = buildGuideReadingSections(published);
const assigned = definitions.flatMap((section) => section.guideSlugs);

assert.equal(GUIDE_READING_PATHS.length, 5, 'v1 must keep five primary reading paths');
assert.equal(new Set(assigned).size, assigned.length, 'a Guide may only appear once in the reading library');
assert.deepEqual([...assigned].sort(), published.map((guide) => guide.id).sort(), 'every published Guide must have one reading-path placement');
for (const section of sections) {
  assert.equal(section.guides.length, section.guideSlugs.length, `${section.id} contains a missing or draft Guide`);
  assert.equal(section.href, `/guide/#route-${section.id}`);
}

const [home, guideIndex, slots] = await Promise.all([
  readFile(new URL('../dist/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/guide/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/slots/index.html', import.meta.url), 'utf8'),
]);

assert.match(home, /data-guide-reading-summary="home"/);
assert.match(slots, /data-guide-reading-summary="slots"/);
for (const route of GUIDE_READING_PATHS) {
  const marker = `data-guide-reading-route="${route.id}"`;
  assert.equal(home.split(marker).length - 1, 1, `home must show ${route.id} once`);
  assert.equal(slots.split(marker).length - 1, 1, `slots must show ${route.id} once`);
  assert.ok(home.includes(`/guide/#route-${route.id}`));
  assert.ok(slots.includes(`/guide/#route-${route.id}`));
}
for (const section of definitions) {
  assert.match(guideIndex, new RegExp(`data-guide-reading-section="${section.id}"`));
  assert.match(guideIndex, new RegExp(`id="route-${section.id}"`));
}
for (const slug of assigned) {
  assert.equal(guideIndex.split(`data-guide-reading-slug="${slug}"`).length - 1, 1, `${slug} must render once in Guide index`);
  assert.ok(guideIndex.includes(`/guide/${slug}/`), `${slug} URL missing from Guide index`);
}
assert.equal((home.match(/data-guide-reading-route=/g) ?? []).length, 5);
assert.equal((slots.match(/data-guide-reading-route=/g) ?? []).length, 5);
assert.equal((guideIndex.match(/data-guide-reading-slug=/g) ?? []).length, published.length);
const readingAnchors = [
  ...(home.match(/<a\b[^>]*data-guide-reading-route="[^"]+"[^>]*>/g) ?? []),
  ...(slots.match(/<a\b[^>]*data-guide-reading-route="[^"]+"[^>]*>/g) ?? []),
  ...(guideIndex.match(/<a\b[^>]*data-guide-reading-slug="[^"]+"[^>]*>/g) ?? []),
];
assert.equal(readingAnchors.length, 10 + published.length);
for (const anchor of readingAnchors) assert.match(anchor, /\shref="[^"]+"/, 'reading-path anchors require real href destinations');
assert.match(slots, /relationship-knowledge-grid/);

console.log(`PASS: ${published.length} published Guides projected once across five reading paths and one extension; home, Guide index and Slots share exact anchors.`);
