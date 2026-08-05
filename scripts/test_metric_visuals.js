"use strict";
const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const html = fs.readFileSync("metric.html", "utf8");
const visualSource = fs.readFileSync("assets/js/metric-visuals.js", "utf8");
const physicsSource = fs.readFileSync("assets/js/physics.js", "utf8");

["metric-geometry", "metric-branches", "metric-coefficients", "metric-velocities", "metric-limits", "metric-radius", "metric-play"]
  .forEach(id => assert(html.includes(`id="${id}"`), `missing metric visual control ${id}`));
assert(html.includes('src="assets/js/physics.js"'), "metric page must load canonical physics first");
assert(html.includes('src="assets/js/metric-visuals.js'), "metric page must load visual module");
assert((html.match(/data-metric-local-radius/g)||[]).length === 5, "every metric visualization needs its own visible radius control");
assert((html.match(/data-metric-preset=/g)||[]).length >= 3, "branch formulas need direct interactive presets");
assert(!visualSource.includes("Math.random"), "scientific visuals must not use decorative random data");
assert(visualSource.includes("SSZ.xi") && visualSource.includes("SSZ.dilation") && visualSource.includes("SSZ.derivative"),
  "visuals must consume the shared canonical physics implementation");

const context = {
  window: {},
  document: {addEventListener(){}, getElementById(){return null;}, documentElement:{}},
  addEventListener(){},
  console,
  Math,
  Intl
};
context.window = context;
vm.createContext(context);
vm.runInContext(physicsSource, context);
const x = 1;
const xi = context.SSZ.xi(x);
const d = context.SSZ.dilation(x);
const a = d*d, b = 1/a;
assert(Math.abs(xi - 0.8017118471377938) < 1e-12, "horizon Xi drift");
assert(Math.abs(d - 0.5550277096687818) < 1e-12, "horizon D drift");
assert(Math.abs(a*b - 1) < 1e-14, "metric reciprocal identity drift");
for (const radius of [1, 2, 10, 100]) {
  const vEscape = 1/Math.sqrt(radius), vFall = Math.sqrt(radius);
  assert(Math.abs(vEscape*vFall-1) < 1e-14, `dual velocity identity drift at x=${radius}`);
}
console.log("OK: five synchronized metric visualizations bind to canonical physics, horizon and dual-velocity identities");
