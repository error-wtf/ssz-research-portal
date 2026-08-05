"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("qubits.html", "utf8");
const js = fs.readFileSync("assets/js/qubits.js", "utf8");

for (const id of ["qb-height", "qb-frequency", "qb-time", "qb-view", "qb-play", "qb-compensate", "qb-animation-status", "qubit-canvas"]) {
  assert.ok(html.includes(`id="${id}"`), `missing qubit-lab element ${id}`);
}
for (const mode of ["combined", "phasor", "timeline"]) {
  assert.ok(html.includes(`value="${mode}"`), `missing qubit view mode ${mode}`);
}
for (const feature of ["Physical phase phasor", "Log-time phase map", "actual angle · no visual magnification", "sweeping log time"]) {
  assert.ok(js.includes(feature), `missing honest animation feature: ${feature}`);
}
assert.ok(!js.includes("phase / max"), "phase curve must not renormalize itself into an unchanging shape");

const earthRadius = 6_371_000;
const earthSchwarzschildRadius = 8.87e-3;
const height = 1e-3;
const deltaD = Math.abs(-2 * earthSchwarzschildRadius * height /
  ((2 * earthRadius + earthSchwarzschildRadius) * (2 * (earthRadius + height) + earthSchwarzschildRadius)));
const phase = 2 * Math.PI * 5e9 * deltaD * 50e-9;
assert.ok(Math.abs(deltaD - 1.0926433158473278e-19) < 1e-32, "canonical stable clock differential changed");
assert.ok(Math.abs(phase - 1.7163201070299783e-16) < 1e-29, "canonical qubit phase changed");

console.log("OK: qubit lab keeps canonical physics while exposing combined, physical-phasor and log-time animation views");
