"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");

const page = fs.readFileSync("rh-proof-candidate.html", "utf8");
const script = fs.readFileSync("assets/js/rh-proof-candidate.js", "utf8");
const siteScript = fs.readFileSync("assets/js/site.js", "utf8");
const styles = fs.readFileSync("assets/css/rh-proof-candidate.css", "utf8");
const gridEmbed = fs.readFileSync("assets/media/zeta_grid_map_animated.html", "utf8");
const crypto = require("node:crypto");
const manuscript = fs.readFileSync("assets/docs/RH_PROOF_CANDIDATE_COMPLETE.md");
for (const asset of [
  "assets/media/dirichlet_partial_sums.gif",
  "assets/media/prime_frequency_spectrum.gif",
  "assets/media/prime_phase_torus.gif",
  "assets/media/zeta_complex_plane.gif",
  "assets/data/zeta_term_map.json",
]) assert.ok(fs.existsSync(asset), `${asset} missing`);
for (const marker of [
  "rh-zeta-canvas",
  "prime_frequency_spectrum.gif", "rh-zeta-play", "animateDirichlet",
  "rh-phase-canvas", "prime_phase_torus.gif", "drawPhase",
  "zeta_grid_map_animated.html",
  "zeta_grid_map",
]) assert.ok(page.includes(marker) || script.includes(marker), `${marker} missing`);
assert.equal(page.includes("psmallmatrix"), false, "unsupported psmallmatrix remains");
assert.match(script, /bind\('rh-zeta-t'/);
assert.match(script, /bind\('rh-zeta-sigma'/);
assert.match(script, /bind\('rh-zeta-n'/);
assert.match(script, /toggleZeta/);
assert.match(script, /ssz-theme-change/);
assert.match(page, /id="rh-labs-play"/);
assert.match(script, /function animateLabs/);
assert.match(script, /if\(!reduceMotion\)startZeta/);
assert.match(script, /prefers-reduced-motion/);
assert.match(script, /Manual value selected/);
assert.match(siteScript, /Prime-log phase recurrence/);
assert.match(page, /prime_phase_torus\.gif"[^>]+loading="eager"/);
const manuscriptHash = crypto.createHash("sha256").update(manuscript).digest("hex");
assert.equal(manuscriptHash, "e6cf8ae93bee70ccb5492879538e480a017d2608fc341d4c27b92601415cb576");
assert.match(page, new RegExp(`id="canonical-manuscript"[\\s\\S]+data-source-sha256="${manuscriptHash}"`));
for (const heading of [
  "1. Definitions",
  "2. Xi transform and Volterra states",
  "3. First-order system",
  "4. Right and reflected-left residuals",
  "5. Endpoint and global Green limits",
  "6. Strictness, matching, and contradiction",
  "7. RH symmetry bridge",
  "Appendices",
]) assert.ok(page.includes(heading), `canonical manuscript heading missing: ${heading}`);
assert.match(styles, /\[data-theme="light"\] \.rh-canvas/);
assert.match(styles, /\[data-theme="light"\] \.rh-gif-figure img/);
assert.match(styles, /\.rh-visual-grid > \.visual-explainer \{ grid-column: 1 \/ -1; width: 100%; \}/);
assert.match(siteScript, /postMessage\(\{type: "ssz-theme"/);
assert.match(gridEmbed, /event\.data\.type !== "ssz-theme"/);
assert.match(gridEmbed, /html\[data-theme="light"\] canvas/);
console.log("OK: RH canvas, GIF, animation, navigation-safe MathJax and pole guard are present");
