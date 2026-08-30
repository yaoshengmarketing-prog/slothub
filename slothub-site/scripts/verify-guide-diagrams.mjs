import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const guidesDirectory = new URL('../src/content/guides/', import.meta.url);
const bonusBuySource = await readFile(new URL('slot-bonus-buy-explained.md', guidesDirectory), 'utf8');
const cascadingSource = await readFile(new URL('slot-cascading-tumble-avalanche-explained.md', guidesDirectory), 'utf8');
const maxWinSource = await readFile(new URL('slot-max-win-explained.md', guidesDirectory), 'utf8');
const globalCssSource = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const bonusBuyHtml = await readFile(new URL('../dist/guide/slot-bonus-buy-explained/index.html', import.meta.url), 'utf8');
const cascadingHtml = await readFile(new URL('../dist/guide/slot-cascading-tumble-avalanche-explained/index.html', import.meta.url), 'utf8');
const maxWinHtml = await readFile(new URL('../dist/guide/slot-max-win-explained/index.html', import.meta.url), 'utf8');

const extractDiagram = (markup, modifier) => markup.match(new RegExp(`<figure class="guide-knowledge-diagram guide-knowledge-diagram--${modifier}"[^>]*>[\\s\\S]*?<\\/figure>`))?.[0] ?? '';

const extractStepList = (diagram) => diagram.match(/<ol class="guide-knowledge-diagram__steps">([\s\S]*?)<\/ol>/)?.[1] ?? '';

const validateDiagram = (markup, expectedSteps, modifier) => {
  const diagram = extractDiagram(markup, modifier);
  assert.ok(diagram, 'Knowledge Diagram figure missing');
  assert.equal((diagram.match(/<figcaption\b/g) ?? []).length, 1, 'Knowledge Diagram must have one figcaption');
  assert.equal((diagram.match(/<ol class="guide-knowledge-diagram__steps">/g) ?? []).length, 1, 'Knowledge Diagram must use one ordered list');
  const stepList = extractStepList(diagram);
  assert.ok(stepList, 'Knowledge Diagram ordered step list missing');
  assert.equal((stepList.match(/<li>/g) ?? []).length, expectedSteps, `Knowledge Diagram expected ${expectedSteps} steps`);
  assert.ok(!/<li>\s*<\/li>/.test(stepList), 'Knowledge Diagram contains an empty step');
  const steps = [...stepList.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((match) => match[1]);
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
validateDiagram(bonusBuySource, 3, 'sequence');

assert.equal((bonusBuySource.match(/class="guide-knowledge-diagram__term"/g) ?? []).length, 3, 'Each Pilot step needs one visible term in Guide Markdown');
assert.ok(!/content:\s*["'][^"']+["']/.test(globalCssSource.match(/\/\* Guide Knowledge Diagram v1 \*\/[\s\S]*$/)?.[0] ?? ''), 'Diagram CSS must not own visible copy');

const guideFiles = (await readdir(guidesDirectory)).filter((name) => name.endsWith('.md'));
const diagramOwners = [];
for (const file of guideFiles) {
  const source = await readFile(new URL(file, guidesDirectory), 'utf8');
  if (source.includes('guide-knowledge-diagram')) diagramOwners.push(file);
}
assert.deepEqual(diagramOwners, ['slot-bonus-buy-explained.md', 'slot-cascading-tumble-avalanche-explained.md', 'slot-max-win-explained.md'], 'Knowledge Diagram owner list changed unexpectedly');

assert.ok(!globalCssSource.includes('slot-bonus-buy-explained'), 'Shared diagram CSS contains a Guide slug');
assert.match(globalCssSource, /grid-template-columns:repeat\(auto-fit,minmax\(/, 'Diagram layout must support a variable number of steps');
assert.match(globalCssSource, /@media\(max-width:620px\)[^{]*\{[\s\S]*?guide-knowledge-diagram__steps\{grid-template-columns:minmax\(0,1fr\)/, 'Mobile diagram must use a single column');
assert.match(globalCssSource, /@media\(forced-colors:active\)/, 'Forced-colors treatment missing');
assert.match(globalCssSource, /@media print/, 'Print treatment missing');
assert.ok(!/guide-knowledge-diagram[^\n]*nth-(?:child|of-type)\(3\)/.test(globalCssSource), 'Diagram CSS is hard-coded to the third step');

const syntheticFiveStepFixture = `<figure class="guide-knowledge-diagram guide-knowledge-diagram--sequence"><figcaption>Five steps</figcaption><ol class="guide-knowledge-diagram__steps">${Array.from({ length: 5 }, (_, index) => `<li><span class="guide-knowledge-diagram__term">TERM ${index + 1}</span><strong>Step ${index + 1}</strong><p>Explanation ${index + 1}</p></li>`).join('')}</ol></figure>`;
validateDiagram(syntheticFiveStepFixture, 5, 'sequence');

validateDiagram(bonusBuyHtml, 3, 'sequence');
assert.match(bonusBuyHtml, /aria-labelledby="bonus-buy-diagram-title"/, 'Built diagram accessible name reference missing');
assert.match(bonusBuyHtml, /<figcaption id="bonus-buy-diagram-title">/, 'Built diagram figcaption id missing');
assert.ok(!bonusBuyHtml.includes('<script') || bonusBuyHtml.indexOf('guide-knowledge-diagram') < bonusBuyHtml.lastIndexOf('</html>'), 'Diagram must exist in static HTML');

const cascadingBody = cascadingSource.slice(cascadingSource.indexOf('\n---', 3) + 4).trimStart();
const cascadingDiagramIndex = cascadingBody.indexOf('<figure class="guide-knowledge-diagram');
const cascadingProseBeforeDiagram = cascadingBody.slice(0, cascadingDiagramIndex).trim().split(/\n\s*\n/).filter(Boolean);
assert.equal(cascadingProseBeforeDiagram.length, 1, 'Cascading diagram must follow exactly the first article paragraph');
assert.ok(cascadingDiagramIndex < cascadingBody.search(/^## /m), 'Cascading diagram must precede the first H2');
validateDiagram(cascadingSource, 4, 'cycle');
assert.equal((cascadingSource.match(/class="guide-knowledge-diagram__branch /g) ?? []).length, 2, 'Cycle diagram needs continue and stop branches');
assert.match(cascadingSource, /再次得獎：回到第 2 步/, 'Cycle continuation must name its return step in visible Markdown');
assert.match(cascadingSource, /沒有得獎或符合停止條件/, 'Cycle stop condition must be visible in Markdown');
assert.ok(!/每次[^\n]*Multiplier|Multiplier[^\n]*必然/.test(cascadingSource.slice(cascadingDiagramIndex, cascadingBody.indexOf('</figure>') + 9)), 'Cycle diagram must not make Multiplier mandatory');
assert.match(globalCssSource, /guide-knowledge-diagram__branches\{display:grid;grid-template-columns:repeat\(auto-fit,minmax\(/, 'Cycle branch layout must support a variable number of outcomes');
assert.match(globalCssSource, /guide-knowledge-diagram__branches\{grid-template-columns:minmax\(0,1fr\)/, 'Cycle branches must stack on mobile');

validateDiagram(cascadingHtml, 4, 'cycle');
assert.match(cascadingHtml, /aria-labelledby="cascading-cycle-diagram-title"/, 'Built cycle diagram accessible name reference missing');
assert.match(cascadingHtml, /<figcaption id="cascading-cycle-diagram-title">/, 'Built cycle diagram figcaption id missing');
assert.ok(!cascadingHtml.includes('<script') || cascadingHtml.indexOf('guide-knowledge-diagram') < cascadingHtml.lastIndexOf('</html>'), 'Cycle diagram must exist in static HTML');

const maxWinBody = maxWinSource.slice(maxWinSource.indexOf('\n---', 3) + 4).trimStart();
const maxWinDiagramIndex = maxWinBody.indexOf('<figure class="guide-knowledge-diagram');
const maxWinProseBeforeDiagram = maxWinBody.slice(0, maxWinDiagramIndex).trim().split(/\n\s*\n/).filter(Boolean);
assert.equal(maxWinProseBeforeDiagram.length, 3, 'Max Win diagram must follow its three-paragraph introduction');
assert.ok(maxWinDiagramIndex < maxWinBody.search(/^## /m), 'Max Win diagram must precede the first H2');
validateDiagram(maxWinSource, 4, 'decision');
const maxWinDiagram = extractDiagram(maxWinSource, 'decision');
assert.equal((maxWinDiagram.match(/class="guide-knowledge-diagram__branch"/g) ?? []).length, 3, 'Max Win decision diagram needs three evidence outcomes');
assert.ok(!/中獎機率[^。]*提高|保證[^。]*(?:取得|獲利)|Winning Ratio[^。]*(?<!不)等同[^。]*x total bet/.test(maxWinDiagram), 'Max Win diagram contains a prohibited certainty or equivalence claim');

const syntheticDecisionFixture = `<figure class="guide-knowledge-diagram guide-knowledge-diagram--decision"><figcaption>Decision</figcaption><ol class="guide-knowledge-diagram__steps">${Array.from({ length: 5 }, (_, index) => `<li><span class="guide-knowledge-diagram__term">CHECK ${index + 1}</span><strong>Question ${index + 1}</strong><p>Evidence ${index + 1}</p></li>`).join('')}</ol><div class="guide-knowledge-diagram__decision"><strong>Outcomes</strong><ul class="guide-knowledge-diagram__branches">${Array.from({ length: 4 }, (_, index) => `<li class="guide-knowledge-diagram__branch"><strong>Outcome ${index + 1}</strong><p>Explanation ${index + 1}</p></li>`).join('')}</ul></div></figure>`;
validateDiagram(syntheticDecisionFixture, 5, 'decision');
assert.equal((extractDiagram(syntheticDecisionFixture, 'decision').match(/class="guide-knowledge-diagram__branch"/g) ?? []).length, 4, 'Decision diagram fixture must accept a variable outcome count');

validateDiagram(maxWinHtml, 4, 'decision');
assert.match(maxWinHtml, /aria-labelledby="max-win-decision-diagram-title"/, 'Built decision diagram accessible name reference missing');
assert.match(maxWinHtml, /<figcaption id="max-win-decision-diagram-title">/, 'Built decision diagram figcaption id missing');
assert.ok(!maxWinHtml.includes('<script') || maxWinHtml.indexOf('guide-knowledge-diagram') < maxWinHtml.lastIndexOf('</html>'), 'Decision diagram must exist in static HTML');

console.log('PASS: Bonus Buy sequence, Cascading cycle and Max Win decision diagrams, variable-step/outcome fixtures, static HTML, mobile, print and forced-colors contracts verified.');
