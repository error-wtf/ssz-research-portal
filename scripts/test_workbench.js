#!/usr/bin/env node
/** Static integrity checks for the scientific workbench and its catalogue. */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const page = read('workbench.html');
const js = read('assets/js/workbench.js');
const data = JSON.parse(read('data/test-independence.json'));
const observableAudit = JSON.parse(read('data/observable-test-audit.json'));
const formulas = JSON.parse(read('data/formulas.json'));
const requiredIds = ['blend-lab-canvas','geodesic-canvas','independence-canvas','interior-sandbox-canvas','dimension-formula'];
for (const id of requiredIds) if (!page.includes(`id="${id}"`)) throw new Error(`missing workbench element: ${id}`);
for (const marker of ['Blend sensitivity','Geodesic','Test dependence','Interior sandbox','dimension']) {
  if (!page.toLowerCase().includes(marker.toLowerCase()) && !js.toLowerCase().includes(marker.toLowerCase())) throw new Error(`missing workbench marker: ${marker}`);
}
if (!Number.isInteger(data.record_count) || data.record_count <= 0) throw new Error('invalid catalogue record_count');
if (!Array.isArray(data.groups) || data.groups.length === 0) throw new Error('missing provenance groups');
const grouped = data.groups.reduce((sum, g) => sum + Number(g.records || 0), 0);
if (grouped !== data.record_count) throw new Error(`grouped records ${grouped} != ${data.record_count}`);
if (!Array.isArray(data.guardrails) || data.guardrails.length < 3) throw new Error('missing independence guardrails');
if (observableAudit.records_examined !== 9300 || observableAudit.domains.length !== 23) throw new Error('observable audit is not the full 9,300-record / 23-domain snapshot');
if (!page.includes('assets/vendor/mathjax/tex-svg.js')) throw new Error('workbench formula rendering engine missing');
if (!js.includes('window.MathJax?.typesetPromise')) throw new Error('dynamic dimension formulas are not typeset after selection');
if (!js.includes('\\\\[${esc(f.latex)}\\\\]')) throw new Error('dimension formula is not wrapped in display-math delimiters');
if (formulas.formulas.length !== 98) throw new Error(`expected 98 selectable formulas, found ${formulas.formulas.length}`);
console.log(`workbench integrity OK: ${data.record_count} records, ${observableAudit.domains.length} domains, ${formulas.formulas.length} rendered formulas`);
