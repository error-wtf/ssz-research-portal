"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");

const formulas = JSON.parse(fs.readFileSync("data/formulas.json", "utf8")).formulas;
const byId = Object.fromEntries(formulas.map(item => [item.id, item]));
assert.match(byId["xi-strong"].latex, /1-\\exp\(-\\varphi\/x\)/);
assert.match(byId["xi-weak"].latex, /1\/\(2x\)/);
assert.equal(byId["blend"].domain, "0 ≤ t ≤ 1");
assert.match(byId["blend-conditions"].latex, /k=0,1,2/);
assert.match(byId.d.latex, /1\/\[1\+\\Xi/);
assert.match(byId["centre-a"].latex, /1\/4/);
assert.match(byId.ricci.latex, /3\/\(2r\^2\)/);
assert.match(byId.kretschmann.latex, /9\/\(4r\^4\)/);

const renderer = fs.readFileSync("assets/js/formulas.js", "utf8");
for (const id of ["rs", "x", "xi-strong", "xi-weak", "blend-t", "blend", "blend-conditions", "d", "s"]) {
  assert.match(renderer, new RegExp(id.replace("-", "\\-")), `missing detailed explanation for ${id}`);
}
assert.doesNotMatch(renderer, /This reviewed catalogue entry defines or records/);

const jif = fs.readFileSync("jif.html", "utf8");
for (const phrase of [
  "absolute new time",
  "JIF is a force",
  "LIGO confirms SSZ"
]) assert.doesNotMatch(jif.toLowerCase(), new RegExp(phrase.toLowerCase()), `forbidden JIF promotion: ${phrase}`);
assert.match(jif, /photons? (?:are not|is not|not assigned) /i);

const status = fs.readFileSync("CANONICAL_STATUS.md", "utf8");
assert.match(status, /must not state a regular centre/i);
assert.match(status, /singularity freedom/i);
const report = fs.readFileSync("reports/EXPLANATION_COMPLETENESS_AUDIT.md", "utf8");
assert.match(report, /Trace clarification/);
assert.match(report, /single explanation owner/);
console.log("OK: P0 branch, central asymptotics, JIF guardrails and explanation-registry checks passed");
