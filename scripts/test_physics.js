"use strict";
const assert = require("node:assert/strict");
const phi = (1 + Math.sqrt(5)) / 2;
const strong = x => 1 - Math.exp(-phi / x);
const strongPrime = x => -phi * Math.exp(-phi / x) / x ** 2;
const strongSecond = x => Math.exp(-phi / x) * (2 * phi / x ** 3 - phi ** 2 / x ** 4);
const weak = x => 1 / (2 * x);
const weakPrime = x => -1 / (2 * x ** 2);
const weakSecond = x => 1 / x ** 3;
function blend(t, y0, d0, dd0, y1, d1, dd1, h) {
  const a0=y0, a1=h*d0, a2=h*h*dd0/2;
  const A=y1-a0-a1-a2, B=h*d1-a1-2*a2, Q=h*h*dd1-2*a2;
  return a0+a1*t+a2*t*t+(10*A-4*B+Q/2)*t**3+(-15*A+7*B-Q)*t**4+(6*A-3*B+Q/2)*t**5;
}
const h=.4;
assert.ok(Math.abs(strong(1) - 0.8017118471377939) < 1e-14);
assert.equal(weak(10), .05);
assert.ok(Math.abs(1/(1+strong(1)) - 0.5550277096687818) < 1e-14);
assert.ok(Math.abs(blend(0,strong(1.8),strongPrime(1.8),strongSecond(1.8),weak(2.2),weakPrime(2.2),weakSecond(2.2),h)-strong(1.8)) < 1e-14);
assert.ok(Math.abs(blend(1,strong(1.8),strongPrime(1.8),strongSecond(1.8),weak(2.2),weakPrime(2.2),weakSecond(2.2),h)-weak(2.2)) < 1e-12);
console.log("OK: horizon, far-field and C2 blend endpoint physics checks passed");
