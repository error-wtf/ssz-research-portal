"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const values = {
  "phi-lambda": ".4812", "phi-levels": "9", "radial-probe": "1",
  impact: "8", "potential-max": "8",
  "rotation-rate": ".2", "loop-radius": "1", "curvature-min": "-5",
  "continuity-join": "1.8", "continuity-window": ".03", "component-radius": "1",
  "clock-inner": "1", "clock-outer": "8", "spectrum-line": "656.28",
  "spectrum-emitter": "1", "spectrum-observer": "20", "null-start": "1", "null-end": "8"
};
const methods = ["setTransform","clearRect","save","restore","beginPath","arc","stroke","fill",
  "moveTo","lineTo","closePath","fillRect","strokeRect","setLineDash","translate","rotate",
  "quadraticCurveTo","fillText"];
const context = Object.fromEntries(methods.map(name => [name, () => {}]));
context.measureText = text => ({width: String(text).length * 7});
context.createLinearGradient = () => ({addColorStop: () => {}});
const elements = new Map();
function element(id) {
  if (elements.has(id)) return elements.get(id);
  const canvas = id.endsWith("-canvas");
  const item = {
    id, value: values[id] ?? "", checked: id === "starmap-transform",
    textContent: "", width: 0, height: 0,
    getBoundingClientRect: () => ({width: 760, height: 430, left: 0, top: 0}),
    getContext: () => context, addEventListener: () => {}, append: () => {},
    replaceChildren(node) { this.textContent = node.textContent; }
  };
  if (!canvas) delete item.getContext;
  elements.set(id, item); return item;
}
let ready;
const sandbox = {
  console, Math, Number, performance: {now: () => 0},
  devicePixelRatio: 1, document: {
    hidden: false, getElementById: element,
    querySelectorAll: () => Object.keys(values).map(element),
    createElement: tag => ({tagName: tag, value: "", textContent: ""}),
    createTextNode: text => ({textContent: String(text)}),
    addEventListener: (name, callback) => { if (name === "DOMContentLoaded") ready = callback; }
  },
  getComputedStyle: () => ({getPropertyValue: name => ({
    "--text":"#1e293b","--muted":"#64748b","--line":"#e2e8f0","--gold":"#b8860b","--surface":"#fff"
  })[name] || ""}),
  matchMedia: () => ({matches: true, addEventListener: () => {}}),
  requestAnimationFrame: callback => { sandbox.frame = callback; return 1; },
  fetch: async () => ({json: async () => ({objects: [{target:"test",ra_deg:266,dec_deg:-29,facility:"JAO"}]})}),
  addEventListener: () => {}, CustomEvent: function(){},
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync("assets/js/visual-lab.js", "utf8"), sandbox);
assert.equal(typeof ready, "function");
ready();
assert.equal(typeof sandbox.frame, "function");
sandbox.frame(16);
for (const id of ["radial-xi","radial-d","alpha-out","potential-peak","sagnac-out"]) {
  assert.notEqual(element(id).textContent, "", `${id} was not updated`);
}
vm.runInContext(fs.readFileSync("assets/js/advanced-visuals.js", "utf8"), sandbox);
ready();
sandbox.frame(32);
for (const id of ["continuity-d0","component-a","clock-ratio","spectrum-observed","null-time"]) {
  assert.notEqual(element(id).textContent, "", `${id} was not updated`);
}
assert.ok(sandbox.SSZVisual.xi(1) > 0.8 && sandbox.SSZVisual.D(1) > 0.55);
console.log("OK: eleven public visual modules initialise and update outputs in a mocked browser DOM");
