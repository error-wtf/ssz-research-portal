"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");

const formulas = JSON.parse(fs.readFileSync("data/formulas.json", "utf8")).formulas;
const evaluations = JSON.parse(fs.readFileSync("data/evaluations.json", "utf8"));
assert.equal(evaluations.current_snapshot.passed, 1296);
assert.equal(evaluations.current_snapshot.repositories, 12);
assert.equal(evaluations.artifact_catalogue.count, 9300);
assert.equal(evaluations.artifact_catalogue.unit, "catalogued test/result artefact");
assert.equal(evaluations.audit_snapshot.executed, 1175);
const publishable = ["tests.html", "reproducibility.html", "index.html", "evidence.html", "falsification.html", "workbench.html", "glossary.html", "TEST_CATALOG.md"]
  .map(file => fs.readFileSync(file, "utf8")).join("\n").toLowerCase();
for (const pattern of [/9300 executed/, /9,300 executed/, /9300 passed/, /9,300 passed/, /all 9300 tests/, /all 9,300 tests/, /complete executed[^.]{0,80}9300/, /complete executed[^.]{0,80}9,300/]) {
  assert.doesNotMatch(publishable, pattern, `forbidden catalogue/execution conflation: ${pattern}`);
}
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
const roleCatalog = JSON.parse(fs.readFileSync("data/repository-scientific-roles.json", "utf8"));
assert.equal(roleCatalog.roles.length, 36);
for (const role of roleCatalog.roles) {
  for (const field of ["role", "status", "inputs", "outputs", "upstream", "downstream", "test_classes", "evidence_class", "does_not_prove"]) {
    assert.ok(role[field] && (Array.isArray(role[field]) ? role[field].length : String(role[field]).length), `${role.name}: missing ${field}`);
  }
}
for (const page of fs.readdirSync(".").filter(name => name.endsWith(".html"))) {
  const source = fs.readFileSync(page, "utf8");
  assert.match(source, /id="reading-compass"/, `${page}: static reading compass missing`);
  assert.match(source, /id="foundational-synthesis"/, `${page}: static foundation missing`);
}
const siteSource = fs.readFileSync("assets/js/site.js", "utf8");
assert.match(siteSource, /let section = document\.getElementById\("reading-compass"\)/);
assert.match(siteSource, /let section = document\.getElementById\("foundational-synthesis"\)/);
assert.doesNotMatch(siteSource, /entries\.some\(\[href\]\s*=>\s*href===here\)\s*\?\s*" open"/, "active page must not force a nav group open");
assert.match(siteSource, /groups\.filter\(other => other !== group\)/, "navigation must behave as an accordion");
assert.match(siteSource, /group\.querySelectorAll\("a"\).*group\.removeAttribute\("open"\)/s, "submenu links must close their group");
for (const page of fs.readdirSync(".").filter(name => name.endsWith(".html"))) {
  const source = fs.readFileSync(page, "utf8");
  assert.doesNotMatch(source, /<details\s+class="nav-group"[^>]*\sopen(?:\s|>)/, `${page}: static nav group must start collapsed`);
}
console.log("OK: P0 branch, central asymptotics, JIF guardrails and explanation-registry checks passed");
