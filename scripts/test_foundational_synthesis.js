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

const chapters = sandbox.SSZFoundationChapters;
const lessons = sandbox.SSZTestLessons;
const expected = [
  "formulas.html", "regimes.html", "weak-field.html", "metric.html",
  "dynamics-energy.html", "mathematics.html", "qubits.html", "jif.html",
  "visual-lab.html", "workbench.html", "evidence.html", "falsification.html",
  "observations.html", "papers.html", "research.html", "repositories.html", "atlas.html"
];
assert.deepEqual(Object.keys(chapters).sort(), expected.sort(), "foundational chapters must cover every selected thin or connective tab");
for (const [page, chapter] of Object.entries(chapters)) {
  assert.ok(fs.existsSync(page), `${page} must exist`);
  assert.ok(chapter.title.length >= 40, `${page} needs a substantive synthesis title`);
  assert.ok(chapter.lede.length >= 120, `${page} needs a substantive synthesis introduction`);
  assert.ok(chapter.blocks.length >= 4, `${page} needs at least four foundational layers`);
  for (const [heading, text] of chapter.blocks) {
    assert.ok(heading.length >= 15, `${page} has a weak foundational heading`);
    assert.ok(text.length >= 230, `${page} foundational block ${heading} is too short`);
  }
}
for (const page of ["formulas.html","regimes.html","weak-field.html","metric.html","dynamics-energy.html","mathematics.html","qubits.html","jif.html","visual-lab.html","workbench.html","evidence.html","observations.html","falsification.html"]) {
  assert.ok(lessons[page]?.length >= 220, `${page} needs a substantive lesson from the 9,300-record audit`);
}
console.log(`OK: ${expected.length} holistic chapters and ${Object.keys(lessons).length} test-informed evidence notes preserve achieved results and open boundaries`);
