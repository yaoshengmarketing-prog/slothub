import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const guidesDirectory = new URL('../src/content/guides/', import.meta.url);
const bonusBuySource = await readFile(new URL('slot-bonus-buy-explained.md', guidesDirectory), 'utf8');
const globalCssSource = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const bonusBuyHtml = await readFile(new URL('../dist/guide/slot-bonus-buy-explained/index.html', import.meta.url), 'utf8');

const validateDiagram = (markup, expectedSteps) => {
  const diagram = markup.match(/<figure class="guide-knowledge-diagram guide-knowledge-diagram--sequence"[^>]*>[\s\S]*?<\/figure>/)?.[0] ?? '';
  assert.ok(diagram, 'Knowledge Diagram figure missing');
  assert.equal((diagram.match(/<figcaption\b/g) ?? []).length, 1, 'Knowledge Diagram must have one figcaption');
  assert.equal((diagram.match(/<ol class="guide-knowledge-diagram__steps">/g) ?? []).length, 1, 'Knowledge Diagram must use one ordered list');
  assert.equal((diagram.match(/<li>/g) ?? []).length, expectedSteps, `Knowledge Diagram expected ${expectedSteps} steps`);
  assert.ok(!/<li>\s*<\/li>/.test(diagram), 'Knowledge Diagram contains an empty step');
  const steps = [...diagram.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((match) => match[1]);
  for (const step of steps) {
    assert.match(step, /class="guide-knowledge-diagram__term"[^>]*>[^<]+<\//, 'Diagram step needs a visible term owned by Guide Markdown');
    assert.match(step, /<strong>[^<]+<\/strong>/, 'Diagram step needs a visible heading owned by Guide Markdown');
    assert.match(step, /<p>[^<]+<\/p>/, 'Diagram step needs visible explanatory copy owned by Guide Markdown');
  }
};

const bodySource = bonusBuySource.slice(bonusBuySource.indexOf('\n---', 3) + 4).trimStart();
const diagramIndex = bodySource.indexOf('<figure class="guide-knowledge-diagram');
const proseBeforeDiagram = bodySource.slice(0, diagramIndex).trim().split(/\n\s*\n/).filter(Boolean);
assert.equal(proseBeforeDiagram.length, 1, 'Knowledge Diagram must follow exactly the first article paragraph');
assert.ok(!proseBeforeDiagram[0].startsWith('<'), 'The first article block before the diagram must be prose');
assert.ok(diagramIndex < bodySource.search(/^## /m), 'Knowledge Diagram must precede the first H2');
validateDiagram(bonusBuySource, 3);

assert.equal((bonusBuySource.match(/class="guide-knowledge-diagram__term"/g) ?? []).length, 3, 'Each Pilot step needs one visible term in Guide Markdown');
assert.ok(!/content:\s*["'][^"']+["']/.test(globalCssSource.match(/\/\* Guide Knowledge Diagram v1 \*\/[\s\S]*$/)?.[0] ?? ''), 'Diagram CSS must not own visible copy');

const guideFiles = (await readdir(guidesDirectory)).filter((name) => name.endsWith('.md'));
const diagramOwners = [];
for (const file of guideFiles) {
  const source = await readFile(new URL(file, guidesDirectory), 'utf8');
  if (source.includes('guide-knowledge-diagram')) diagramOwners.push(file);
}
assert.deepEqual(diagramOwners, ['slot-bonus-buy-explained.md'], 'Knowledge Diagram leaked into another Guide');

assert.ok(!globalCssSource.includes('slot-bonus-buy-explained'), 'Shared diagram CSS contains a Guide slug');
assert.match(globalCssSource, /grid-template-columns:repeat\(auto-fit,minmax\(/, 'Diagram layout must support a variable number of steps');
assert.match(globalCssSource, /@media\(max-width:620px\)[^{]*\{[\s\S]*?guide-knowledge-diagram__steps\{grid-template-columns:minmax\(0,1fr\)/, 'Mobile diagram must use a single column');
assert.match(globalCssSource, /@media\(forced-colors:active\)/, 'Forced-colors treatment missing');
assert.match(globalCssSource, /@media print/, 'Print treatment missing');
assert.ok(!/guide-knowledge-diagram[^\n]*nth-(?:child|of-type)\(3\)/.test(globalCssSource), 'Diagram CSS is hard-coded to the third step');

const syntheticFiveStepFixture = `<figure class="guide-knowledge-diagram guide-knowledge-diagram--sequence"><figcaption>Five steps</figcaption><ol class="guide-knowledge-diagram__steps">${Array.from({ length: 5 }, (_, index) => `<li><span class="guide-knowledge-diagram__term">TERM ${index + 1}</span><strong>Step ${index + 1}</strong><p>Explanation ${index + 1}</p></li>`).join('')}</ol></figure>`;
validateDiagram(syntheticFiveStepFixture, 5);

validateDiagram(bonusBuyHtml, 3);
assert.match(bonusBuyHtml, /aria-labelledby="bonus-buy-diagram-title"/, 'Built diagram accessible name reference missing');
assert.match(bonusBuyHtml, /<figcaption id="bonus-buy-diagram-title">/, 'Built diagram figcaption id missing');
assert.ok(!bonusBuyHtml.includes('<script') || bonusBuyHtml.indexOf('guide-knowledge-diagram') < bonusBuyHtml.lastIndexOf('</html>'), 'Diagram must exist in static HTML');

console.log('PASS: Bonus Buy semantic Knowledge Diagram, variable-step fixture, static HTML, mobile, print and forced-colors contracts verified.');
