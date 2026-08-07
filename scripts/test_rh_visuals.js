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
assert.ok(fs.existsSync("assets/docs/RH_PROOF_CANDIDATE_REVIEW_GUIDE.md"), "review guide missing");
assert.ok(fs.existsSync("assets/docs/RH_TRACE_CLOSURE_EXPLANATION.md"), "trace clarification missing");
for (const asset of [
  "assets/media/dirichlet_partial_sums.gif",
  "assets/media/prime_frequency_spectrum.gif",
  "assets/media/prime_phase_torus.gif",
  "assets/media/zeta_complex_plane.gif",
  "assets/data/zeta_term_map.json",
]) assert.ok(fs.existsSync(asset), `${asset} missing`);
for (const marker of [
  "rh-zeta-canvas",
  "rh-frequency-canvas", "rh-zeta-play", "animateDirichlet", "drawFrequency",
  "rh-phase-canvas", "drawPhase",
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
assert.match(page, /id="reviewer-call"/);
assert.match(page, /full two-sided Volterra identity/);
assert.match(page, /negative-control audit/);
for (const id of ["rh-plane-canvas", "rh-zeta-canvas", "rh-frequency-canvas", "rh-phase-canvas"]) {
  const canvas = new RegExp(`<canvas id="${id}"[\\s\\S]*?</canvas>[\\s\\S]*?class="visual-explanation"`);
  assert.match(page, canvas, `${id} must retain an authored explanation box`);
}
assert.match(script, /function animateLabs/);
assert.match(script, /if\(!reduceMotion\)startZeta/);
assert.match(script, /prefers-reduced-motion/);
assert.match(script, /Manual value selected/);
assert.match(siteScript, /Prime-log phase recurrence/);
assert.equal(page.includes("prime_phase_torus.gif"), false, "non-theme-aware phase GIF remains embedded");
assert.equal(page.includes("prime_frequency_spectrum.gif"), false, "non-theme-aware frequency GIF remains embedded");
const manuscriptHash = crypto.createHash("sha256").update(manuscript).digest("hex");
assert.equal(manuscriptHash, "e53d60fc0b82aae7bb87f69428e1e42a5c404134b1287b1802d5257e26d300b7");
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
assert.equal(/\.rh-canvas\s*\{[^}]*filter:/s.test(styles), false, "canvas still relies on CSS filtering");
assert.match(script, /const nativePalettes = \{/);
assert.match(script, /function semanticCanvasColor/);
assert.match(script, /function themedContext/);
assert.match(script, /function paintCanvas/);
assert.match(script, /drawPhase\(false\);drawFrequency\(false\)/, "phase/frequency canvases must repaint on theme changes");
assert.match(script, /'#e7a1b4':'prime'/, "all Dirichlet palette colors must be theme-mapped");
assert.match(script, /'#8de0d0':'composite'/, "all frequency palette colors must be theme-mapped");
assert.match(script, /rh-frequency-canvas/);
assert.match(script, /amplitude\s+n⁻ˢ/);
assert.match(script, /frequency\s+ωₙ\s*=\s*log\(n\)/);
assert.match(script, /maxLog=Math\.log\(N\)/);
assert.match(script, /phaseStep=\.11,frameCount=96/);
assert.match(script, /Math\.abs\(phase\.x-previous\.x\)>Math\.PI/);
assert.match(script, /jumped\)x\.moveTo\(qx,qy\)/);
assert.match(script, /torus wrap jump/);
assert.match(styles, /\.rh-visual-grid > \.visual-explainer \{ grid-column: 1 \/ -1; width: 100%; \}/);
assert.match(siteScript, /postMessage\(\{type: "ssz-theme"/);
assert.match(gridEmbed, /event\.data\.type !== "ssz-theme"/);
assert.match(gridEmbed, /const themePalettes = \{/);
assert.match(gridEmbed, /activeTheme = light \? "light" : "dark"/);
assert.match(gridEmbed, /width: 1\.62em/);
assert.match(gridEmbed, /height: 2\.02em/);
assert.match(gridEmbed, /sum-limits \.top/);
assert.match(gridEmbed, /top: -0\.18em/);
assert.match(gridEmbed, /bottom: -0\.18em/);
assert.match(gridEmbed, /targetContext\.fillStyle = palette\.background/);
assert.equal(/html\[data-theme="light"\] canvas\s*\{[^}]*filter:/s.test(gridEmbed), false, "embedded zeta canvas still relies on CSS filtering");
console.log("OK: RH canvas, GIF, animation, navigation-safe MathJax and pole guard are present");
