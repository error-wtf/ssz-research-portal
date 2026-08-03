#!/usr/bin/env node
// Execute the exact browser metric engine in a minimal DOM shell.
// This catches drift between published interactions and the canonical equations.

import fs from "node:fs";
import vm from "node:vm";

const callbacks = new Map();
const sandbox = {
  console,
  Math,
  Number,
  document: {
    addEventListener(name, callback) { callbacks.set(name, callback); },
    getElementById() { return null; },
    documentElement: {dataset: {}},
  },
  window: {
    addEventListener() {},
    devicePixelRatio: 1,
  },
  getComputedStyle() {
    return {getPropertyValue() { return ""; }};
  },
};
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(new URL("../assets/js/physics.js", import.meta.url), "utf8"), sandbox);

const SSZ = sandbox.window.SSZ;
if (!SSZ) throw new Error("Published physics engine did not expose window.SSZ");

const close = (actual, expected, tolerance, label) => {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
};

close(SSZ.xi(1), 0.8017118471377938, 1e-14, "Xi(r_s)");
close(SSZ.dilation(1), 0.5550277096687818, 1e-14, "D(r_s)");
close(SSZ.xi(10), 0.05, 1e-14, "weak Xi");
close(SSZ.dilation(1) * (1 + SSZ.xi(1)), 1, 1e-14, "D*s identity");

for (const boundary of [1.8, 2.2]) {
  const epsilon = 1e-7;
  close(SSZ.xi(boundary - epsilon), SSZ.xi(boundary + epsilon), 2e-7, `Xi continuity ${boundary}`);
}

const orbits = SSZ.orbitDiagnostics(30);
if (!orbits.photon || !(orbits.photon.x > 1.8 && orbits.photon.x < 2.2)) {
  throw new Error("Expected bridge-localised stationary null-potential candidate");
}
if (!Number.isFinite(orbits.criticalImpact) || orbits.criticalImpact <= orbits.photon.x) {
  throw new Error("Critical-impact proxy is inconsistent");
}
if (!orbits.isco || orbits.isco.x <= orbits.photon.x) {
  throw new Error("Circular-timelike L² minimum is missing or unordered");
}

console.log(JSON.stringify({
  horizon: {xi: SSZ.xi(1), D: SSZ.dilation(1)},
  photon_candidate: orbits.photon.x,
  critical_impact_proxy: orbits.criticalImpact,
  timelike_L2_minimum: orbits.isco.x,
}));
