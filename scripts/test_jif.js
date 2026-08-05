"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const html = fs.readFileSync("jif.html", "utf8");
for (const marker of [
  "PUBLIC RESEARCH TIMESTAMP NOTICE",
  "expected to follow by the end of 2026",
  "reserve all rights not expressly granted under the license",
  'id="jif-phase-canvas"',
  'id="jif-ledger-canvas"',
  "Anticapitalist License, Version 1.4",
]) {
  assert.ok(html.toLowerCase().includes(marker.toLowerCase()), `missing JIF marker: ${marker}`);
}

const initial = {
  "jif-radius": "0", "jif-frequency": "3", "jif-time": "1",
  "jif-emission": ".6", "jif-transfer": ".25", "jif-node": "-.1", "jif-detector": "-.2",
};
const drawingMethods = [
  "setTransform", "clearRect", "fillRect", "save", "restore", "beginPath", "arc",
  "stroke", "fill", "moveTo", "lineTo", "setLineDash", "fillText",
];
const drawingContext = Object.fromEntries(drawingMethods.map(name => [name, () => {}]));
const elements = new Map();
function element(id) {
  if (elements.has(id)) return elements.get(id);
  const item = {
    id,
    value: initial[id] || "",
    textContent: "",
    width: 0,
    height: 0,
    addEventListener() {},
    setAttribute() {},
    getBoundingClientRect: () => ({width: 760, height: 470}),
    getContext: () => drawingContext,
    replaceChildren(node) { this.textContent = node.textContent; },
  };
  elements.set(id, item);
  return item;
}

let ready;
const sandbox = {
  console, Math, Number, Intl,
  devicePixelRatio: 1,
  performance: {now: () => 0},
  document: {
    documentElement: {},
    getElementById: element,
    createTextNode: text => ({textContent: String(text)}),
    addEventListener: (event, callback) => { if (event === "DOMContentLoaded") ready = callback; },
  },
  getComputedStyle: () => ({getPropertyValue: name => ({
    "--surface": "#fff", "--line": "#e2e8f0", "--muted": "#64748b", "--text": "#1e293b",
  })[name] || ""}),
  matchMedia: () => ({matches: true, addEventListener() {}}),
  requestAnimationFrame: () => 1,
  addEventListener() {},
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync("assets/js/physics.js", "utf8"), sandbox);
vm.runInContext(fs.readFileSync("assets/js/jif.js", "utf8"), sandbox);
assert.equal(typeof ready, "function", "JIF module must register DOM initialisation");
ready();

for (const id of [
  "jif-branch", "jif-xi", "jif-d", "jif-rate", "jif-count", "jif-lag",
  "jif-ledger-total", "jif-ledger-wrapped", "jif-ledger-phase",
]) {
  assert.notEqual(element(id).textContent, "", `${id} was not updated`);
}
assert.equal(element("jif-ledger-total").textContent, "0.550 cycles");
assert.ok(sandbox.SSZ.dilation(1) > .55 && sandbox.SSZ.dilation(1) < .56);
console.log("OK: JIF publication boundary and both interactive phase laboratories initialise");
