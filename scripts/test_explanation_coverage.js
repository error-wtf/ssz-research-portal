"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const sandbox = {
  window: {},
  location: {pathname: "/index.html"},
  localStorage: {getItem: () => null, setItem: () => {}},
  document: {
    documentElement: {dataset: {}},
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  },
  history: {replaceState: () => {}},
  navigator: {}
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync("assets/js/site.js", "utf8"), sandbox);

const explainers = sandbox.SSZExplainers;
assert.equal(typeof explainers.ruleForFormula, "function");
assert.equal(typeof explainers.ruleForVisual, "function");
assert.equal(typeof explainers.verificationFor, "function");
const siteSource = fs.readFileSync("assets/js/site.js", "utf8");
const formulaRenderer = fs.readFileSync("assets/js/formulas.js", "utf8");
assert.match(siteSource, /A nearby prose sentence is context, not a complete explanation/);
assert.doesNotMatch(siteSource, /length\s*>=\s*120\)\s*return true/);
assert.match(formulaRenderer, /class="formula-explanation formula-explainer"/);
assert.match(formulaRenderer, /<h4>Purpose<\/h4>/);
assert.match(formulaRenderer, /<h4>Derivation and dependencies<\/h4>/);
assert.match(formulaRenderer, /<h4>Related formulas<\/h4>/);
assert.match(formulaRenderer, /verificationFor/);
const strongRule = explainers.ruleForFormula(
  "\\Xi_{strong}(r)=1-\\exp(-\\varphi r_s/r)", "Strong branch"
);
const weakRule = explainers.ruleForFormula(
  "\\Xi_{weak}(r)=r_s/(2r)", "Weak branch"
);
const bridgeRule = explainers.ruleForFormula(
  "\\Xi_{bridge}=H_5(t)", "C² blend"
);
assert.notEqual(strongRule.title, weakRule.title, "strong and weak branch explanations collapsed");
assert.notEqual(strongRule.title, bridgeRule.title, "strong and bridge explanations collapsed");
assert.notEqual(weakRule.title, bridgeRule.title, "weak and bridge explanations collapsed");
const semanticChecks = [
  ["\\Theta_{\\mathrm{PC}}=p_i dq^i-Hdt", "Poincare–Cartan one-form"],
  ["\\Delta t_{\\rm axle}=4\\mathcal A\\Omega/(c^2-\\Omega^2R^2), \\Delta\\tau_{\\rm det}=\\Delta t_{\\rm axle}/\\gamma, \\Delta\\phi=\\omega_{\\rm det}\\Delta\\tau_{\\rm det}", "proper-time phase"],
  ["\\Gamma^\\rho_{\\mu\\nu}=1/2 g^{\\rho\\sigma}\\partial g", "Derivatives of the metric build connection"]
];
for (const [formula, expected] of semanticChecks) {
  assert.match(explainers.ruleForFormula(formula, "").title, new RegExp(expected, "i"), `semantic explanation mismatch for ${formula}`);
}
const headingChecks = [
  ["Detector layer", "\\Delta t_{\\rm axle}...", "detector layer converts"],
  ["Connection", "\\Gamma^\\rho_{\\mu\\nu}...", "Christoffel symbols"],
  ["Curvature", "R^\\rho_{\\sigma\\mu\\nu}...", "Riemann tensor"],
  ["Sagnac difference", "q_0=2hT_0\\beta...", "odd-sector recurrence"],
  ["Two observational routes", "T_{kin}=2\\pi R_0/\\Theta_0...", "Kinematic and proper-motion"],
  ["Hamiltonian flow and area preservation", "p_{n+1}=p_n-h\\omega^2q_n...", "symplectic update"]
];
for (const [heading, formula, expected] of headingChecks) {
  assert.match(explainers.ruleForFormula(formula, heading).title, new RegExp(expected, "i"), `heading explanation mismatch for ${heading}`);
}

const pages = fs.readdirSync(".").filter(name => name.endsWith(".html"));
let formulaCount = 0;
let visualCount = 0;
let genericFormulaCount = 0;
const genericFormulas = [];
for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  const formulaPattern = /<(?:div|p)[^>]*class="[^"]*(?:math-box|display-formula|formula(?!-))[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p)>/g;
  for (const match of html.matchAll(formulaPattern)) {
    const text = match[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const rule = explainers.ruleForFormula(text, page);
    assert.ok(rule.purpose.length >= 100, `${page}: formula purpose is too short`);
    assert.ok(rule.reading.length >= 100, `${page}: formula reading guide is too short`);
    assert.ok(rule.meaning.length >= 60, `${page}: formula meaning is too short`);
    assert.ok(rule.limit.length >= 60, `${page}: formula limitation is too short`);
    const verification = explainers.verificationFor(text, page, page);
    assert.ok(verification.length >= 180, `${page}: formula verification context is too short`);
    if (rule.title.startsWith("Quantitative statement")) {
      genericFormulaCount += 1;
      genericFormulas.push(`${page}: ${text.slice(0, 120)}`);
    }
    formulaCount += 1;
  }
  for (const match of html.matchAll(/<canvas[^>]*id="([^"]+)"[^>]*>/g)) {
    const rule = explainers.ruleForVisual(match[1], "");
    assert.notEqual(rule.title, "Interactive scientific display", `${page}: canvas #${match[1]} needs a specific explanation`);
    assert.ok(rule.use.length >= 80, `${page}: canvas #${match[1]} usage explanation is too short`);
    assert.ok(rule.meaning.length >= 45, `${page}: canvas #${match[1]} meaning is too short`);
    assert.ok(rule.limit.length >= 45, `${page}: canvas #${match[1]} limitation is too short`);
    visualCount += 1;
  }
}

const catalog = JSON.parse(fs.readFileSync("data/formulas.json", "utf8")).formulas;
for (const item of catalog) {
  const rule = explainers.ruleForFormula(item.latex, item.name);
  if (rule.title.startsWith("Quantitative statement")) {
    genericFormulaCount += 1;
    genericFormulas.push(`data/formulas.json ${item.id}: ${item.name} — ${item.latex.slice(0, 100)}`);
  }
  const verification = explainers.verificationFor(item.latex, item.name, "formulas.html");
  assert.ok(verification.length >= 180, `${item.id}: catalogue verification context is too short`);
}

assert.ok(formulaCount >= 120, "formula inventory unexpectedly shrank");
assert.ok(visualCount >= 50, "visual inventory unexpectedly shrank");
if (genericFormulas.length) console.log(genericFormulas.join("\n"));
assert.equal(genericFormulaCount, 0, `${genericFormulaCount} formulas still use the generic explanation`);
console.log(`OK: ${formulaCount} static and ${catalog.length} catalogue formulas plus ${visualCount} canvases have specific substantive explanation and verification coverage`);
