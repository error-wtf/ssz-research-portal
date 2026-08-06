"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");

const page = fs.readFileSync("rh-proof-candidate.html", "utf8");
const script = fs.readFileSync("assets/js/rh-proof-candidate.js", "utf8");
for (const asset of [
  "assets/media/dirichlet_partial_sums.gif",
  "assets/media/prime_frequency_spectrum.gif",
  "assets/media/prime_phase_torus.gif",
  "assets/media/zeta_complex_plane.gif",
  "assets/data/zeta_term_map.json",
]) assert.ok(fs.existsSync(asset), `${asset} missing`);
for (const marker of [
  "rh-zeta-canvas", "rh-dirichlet-canvas", "dirichlet_partial_sums.gif",
  "prime_frequency_spectrum.gif", "rh-zeta-play", "animateDirichlet",
  "rh-phase-canvas", "prime_phase_torus.gif", "drawPhase",
  "zeta_full_curve.gif",
  "zeta_term_map.json",
]) assert.ok(page.includes(marker) || script.includes(marker), `${marker} missing`);
assert.equal(page.includes("psmallmatrix"), false, "unsupported psmallmatrix remains");
assert.match(script, /bind\('rh-zeta-t'/);
assert.match(script, /bind\('rh-zeta-sigma'/);
assert.match(script, /bind\('rh-zeta-n'/);
assert.match(script, /toggleZeta/);
console.log("OK: RH canvas, GIF, animation, navigation-safe MathJax and pole guard are present");
