"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

let ready;
const sandbox = {
  window: {},
  location: {pathname: "/ssz-research-portal/index.html", href: "http://local/index.html"},
  localStorage: {getItem: () => null, setItem: () => {}},
  document: {
    documentElement: {dataset: {}},
    addEventListener: (name, callback) => { if (name === "DOMContentLoaded") ready = callback; },
    querySelector: () => null,
    querySelectorAll: () => []
  },
  history: {replaceState: () => {}},
  navigator: {}
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync("assets/js/site.js", "utf8"), sandbox);

const pages = fs.readdirSync(".").filter(name => name.endsWith(".html")).sort();
const guides = sandbox.SSZPageGuides;
assert.deepEqual(Object.keys(guides).sort(), pages, "every HTML page needs exactly one reading guide");
for (const [page, guide] of Object.entries(guides)) {
  for (const field of ["question", "path", "meaning", "limit"]) {
    assert.ok(guide[field].length >= 80, `${page} needs a substantive ${field}`);
  }
  assert.ok(Array.isArray(guide.next) && guide.next.length === 2, `${page} needs one explicit next step`);
  assert.ok(fs.existsSync(guide.next[0].split("#")[0]), `${page} next-step target must exist`);
}
assert.equal(typeof ready, "function");
console.log(`OK: ${pages.length} page-specific reading guides cover question, path, meaning, limit and next step`);
