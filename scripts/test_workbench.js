#!/usr/bin/env node
/** Static integrity checks for the scientific workbench and its catalogue. */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const page = read('workbench.html');
const js = read('assets/js/workbench.js');
const data = JSON.parse(read('data/test-independence.json'));
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
console.log(`workbench integrity OK: ${data.record_count} records, ${data.groups.length} provenance groups`);
