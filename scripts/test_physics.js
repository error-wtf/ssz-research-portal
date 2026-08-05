"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
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
const canonical = x => x < 1.8 ? strong(x) : x > 2.2 ? weak(x) :
  blend((x-1.8)/h,strong(1.8),strongPrime(1.8),strongSecond(1.8),weak(2.2),weakPrime(2.2),weakSecond(2.2),h);
const derivative = (f,x,step=1e-5) => (f(x+step)-f(x-step))/(2*step);
const second = (f,x,step=1e-4) => (f(x+step)-2*f(x)+f(x-step))/(step*step);
for (const boundary of [1.8,2.2]) {
  const branch = boundary === 1.8 ? strong : weak;
  assert.ok(Math.abs(canonical(boundary)-branch(boundary)) < 1e-12);
  assert.ok(Math.abs(derivative(canonical,boundary)-derivative(branch,boundary)) < 2e-6);
  assert.ok(Math.abs(second(canonical,boundary,1e-5)-second(branch,boundary,1e-5)) < 8e-4);
}
for (const x of [.1,.5,1,1.8,2,2.2,10,100]) {
  const value=canonical(x), d=1/(1+value);
  assert.ok(Number.isFinite(value) && value >= 0);
  assert.ok(d > 0 && d <= 1);
}
const alpha = b => 2/b;
assert.equal(alpha(10),.2);
const sagnac = (radius,omega,c=299792458) => 4*Math.PI*radius**2*omega/c**2;
assert.ok(Math.abs(sagnac(2,.5)/sagnac(1,.5)-4)<1e-12);
const phaseDifference = (inner,outer,duration) =>
  Math.abs(1/(1+canonical(outer))-1/(1+canonical(inner)))*duration;
assert.ok(phaseDifference(1,6,10)>0);
const weakFieldSandbox={window:{},document:{getElementById:()=>null},Math,Number};
weakFieldSandbox.window=weakFieldSandbox;
vm.createContext(weakFieldSandbox);
vm.runInContext(fs.readFileSync("assets/js/weak-field.js","utf8"),weakFieldSandbox);
const weakResidual=weakFieldSandbox.SSZWeakField.residual;
assert.ok(Math.abs(weakResidual(1e12)-2.49999999999875e-25)<1e-39);
assert.ok(weakResidual(1e12)>0,"far-field residual must not collapse to zero");
console.log("OK: horizon, far-field, C2 derivatives and visual-lab physics checks passed");
