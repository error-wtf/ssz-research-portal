(() => {
  "use strict";
  const PHI = (1 + Math.sqrt(5)) / 2;
  const G = 6.67430e-11;
  const C = 299792458;
  const SOLAR_MASS = 1.98847e30;
  let plotState = null;

  const strong = x => 1 - Math.exp(-PHI / x);
  const strongPrime = x => -PHI * Math.exp(-PHI / x) / (x * x);
  const strongSecond = x => Math.exp(-PHI / x) * (2 * PHI / x ** 3 - PHI ** 2 / x ** 4);
  const weak = x => 1 / (2 * x);
  const weakPrime = x => -1 / (2 * x * x);
  const weakSecond = x => 1 / x ** 3;

  function quinticHermite(t, y0, d0, dd0, y1, d1, dd1, width) {
    const a0 = y0;
    const a1 = width * d0;
    const a2 = width * width * dd0 / 2;
    const A = y1 - a0 - a1 - a2;
    const B = width * d1 - a1 - 2 * a2;
    const Q = width * width * dd1 - 2 * a2;
    const a3 = 10 * A - 4 * B + Q / 2;
    const a4 = -15 * A + 7 * B - Q;
    const a5 = 6 * A - 3 * B + Q / 2;
    return a0 + a1*t + a2*t*t + a3*t**3 + a4*t**4 + a5*t**5;
  }

  function xi(x) {
    if (x < 1.8) return strong(x);
    if (x > 2.2) return weak(x);
    const width = .4;
    return quinticHermite(
      (x - 1.8) / width,
      strong(1.8), strongPrime(1.8), strongSecond(1.8),
      weak(2.2), weakPrime(2.2), weakSecond(2.2), width
    );
  }
  const dilation = x => 1 / (1 + xi(x));
  const branch = x => x < 1.8 ? "strong" : x > 2.2 ? "weak" : "C² bridge";
  const grDilation = x => x > 1 ? Math.sqrt(1 - 1 / x) : null;
  const metricA = x => dilation(x) ** 2;
  const derivative = (fn, x, relativeStep = 2e-5) => {
    const h = Math.max(1e-7, Math.abs(x) * relativeStep);
    return (fn(x + h) - fn(x - h)) / (2 * h);
  };
  const nullPotential = x => metricA(x) / x ** 2;
  const angularMomentumSquared = x => {
    const a = metricA(x), ap = derivative(metricA, x);
    const denominator = 2 * a - x * ap;
    return denominator > 0 ? x ** 3 * ap / denominator : null;
  };
  function stationaryMinimum(fn, lo, hi, samples = 24000) {
    const step = (hi - lo) / samples;
    let previous = fn(lo), centre = fn(lo + step), best = null;
    for (let index = 2; index <= samples; index += 1) {
      const x = lo + index * step, right = fn(x);
      if (Number.isFinite(previous) && Number.isFinite(centre) && Number.isFinite(right)
          && centre < previous && centre < right) best = {x: x - step, value: centre};
      previous = centre; centre = right;
    }
    return best;
  }
  function stationaryMaximum(fn, lo, hi, samples = 24000) {
    const step = (hi - lo) / samples;
    let previous = fn(lo), centre = fn(lo + step), best = null;
    for (let index = 2; index <= samples; index += 1) {
      const x = lo + index * step, right = fn(x);
      if (Number.isFinite(previous) && Number.isFinite(centre) && Number.isFinite(right)
          && centre > previous && centre > right
          && (!best || centre > best.value)) best = {x: x - step, value: centre};
      previous = centre; centre = right;
    }
    return best;
  }
  function orbitDiagnostics(maximumRadius = 30) {
    const photon = stationaryMaximum(nullPotential, 1.8, Math.max(3, maximumRadius));
    const isco = stationaryMinimum(angularMomentumSquared, photon ? photon.x * 1.001 : 1.8, Math.max(8, maximumRadius));
    return {
      photon,
      criticalImpact: photon ? photon.x / Math.sqrt(metricA(photon.x)) : null,
      isco,
      caution: "Stationary radii belong to the declared static diagonal continuation. A bridge-localised extremum may depend on the matching prescription and is not an empirical measurement."
    };
  }
  const fmt = (number, digits = 8) => Number.isFinite(number)
    ? number.toLocaleString("en-US", { maximumFractionDigits: digits })
    : "—";

  function updatePlot() {
    const canvas = document.getElementById("metric-chart");
    if (!canvas) return;
    const max = Number(document.getElementById("radius-max")?.value || 12);
    const log = document.getElementById("log-axis")?.checked;
    const showLimits = document.getElementById("show-limits")?.checked;
    const quantity = document.getElementById("plot-quantity")?.value || "xi";
    const points = 260;
    const min = log ? .08 : .12;
    const xs = Array.from({length: points}, (_, index) => {
      const t = index / (points - 1);
      return log ? min * (max / min) ** t : min + (max - min) * t;
    });
    const ssz = xs.map(x => quantity === "xi" ? xi(x) : dilation(x));
    const gr = xs.map(x => quantity === "xi" ? (x > 1 ? 1 / Math.sqrt(1 - 1/x) - 1 : null) : grDilation(x));
    const dark = document.documentElement.dataset.theme === "dark";
    const grid = dark ? "#334155" : "#e2e8f0";
    const text = dark ? "#cbd5e1" : "#475569";
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, rect.width || 760);
    const height = Math.max(340, rect.height || 470);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pad = {left: 66, right: 24, top: 48, bottom: 58};
    const area = {left: pad.left, top: pad.top, right: width-pad.right, bottom: height-pad.bottom};
    const finite = [...ssz, ...gr].filter(Number.isFinite);
    const yMin = quantity === "d" ? 0 : 0;
    const rawMax = Math.max(...finite, 1);
    const yMax = quantity === "xi" ? Math.min(Math.ceil(rawMax * 4) / 4, 4) : 1.05;
    const xPos = value => area.left + (log
      ? Math.log(value/min) / Math.log(max/min)
      : (value-min)/(max-min)) * (area.right-area.left);
    const yPos = value => area.bottom - (value-yMin)/(yMax-yMin) * (area.bottom-area.top);
    ctx.clearRect(0, 0, width, height);
    ctx.font = "12px Inter, sans-serif";
    ctx.fillStyle = text;
    ctx.strokeStyle = grid;
    ctx.lineWidth = 1;
    for (let i=0; i<=5; i++) {
      const value = yMin + (yMax-yMin)*i/5;
      const py = yPos(value);
      ctx.beginPath(); ctx.moveTo(area.left, py); ctx.lineTo(area.right, py); ctx.stroke();
      ctx.textAlign = "right"; ctx.fillText(fmt(value, 2), area.left-9, py+4);
    }
    const xTicks = log
      ? [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100].filter(value => value >= min && value <= max)
      : Array.from({length: 6}, (_, i) => min+(max-min)*i/5);
    xTicks.forEach(value => {
      const px = xPos(value);
      ctx.beginPath(); ctx.moveTo(px, area.top); ctx.lineTo(px, area.bottom); ctx.stroke();
      ctx.textAlign = "center"; ctx.fillText(fmt(value, value < 1 ? 2 : 1), px, area.bottom+20);
    });
    const line = (values, colour, dashed=false) => {
      ctx.save(); ctx.strokeStyle = colour; ctx.lineWidth = dashed ? 2 : 3;
      ctx.setLineDash(dashed ? [8,5] : []); ctx.beginPath();
      let active = false;
      values.forEach((value, index) => {
        if (!Number.isFinite(value) || value > yMax) { active = false; return; }
        const px=xPos(xs[index]), py=yPos(value);
        if (!active) ctx.moveTo(px,py); else ctx.lineTo(px,py);
        active = true;
      });
      ctx.stroke(); ctx.restore();
    };
    line(gr, "#2563eb", true);
    line(ssz, dark ? "#e0b84a" : "#b8860b");
    if (showLimits) [1,1.8,2.2].forEach((value,index) => {
      if (value < min || value > max) return;
      const px=xPos(value);
      ctx.save(); ctx.strokeStyle=index ? "#7c3aed" : "#b42318"; ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.moveTo(px,area.top); ctx.lineTo(px,area.bottom); ctx.stroke();
      ctx.fillStyle=text; ctx.textAlign="left"; ctx.fillText(["rₛ","1.8 rₛ","2.2 rₛ"][index],px+4,area.top+14); ctx.restore();
    });
    ctx.fillStyle = dark ? "#e0b84a" : "#b8860b"; ctx.fillRect(area.left, 14, 24, 3);
    ctx.fillStyle=text; ctx.textAlign="left"; ctx.fillText(quantity==="xi" ? "SSZ Ξ(x)" : "SSZ D(x)",area.left+32,20);
    ctx.strokeStyle="#2563eb"; ctx.setLineDash([8,5]); ctx.beginPath(); ctx.moveTo(area.left+150,16);ctx.lineTo(area.left+174,16);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=text; ctx.fillText(quantity==="xi" ? "Schwarzschild redshift proxy" : "Schwarzschild D",area.left+182,20);
    ctx.textAlign="center"; ctx.fillText("Normalized areal radius  x = r/rₛ", (area.left+area.right)/2, height-12);
    ctx.save();ctx.translate(16,(area.top+area.bottom)/2);ctx.rotate(-Math.PI/2);
    ctx.fillText(quantity==="xi" ? "Segment density Ξ" : "Time-dilation factor D",0,0);ctx.restore();
    plotState={canvas,ctx,xs,ssz,gr,xPos,yPos,area,text,quantity};
    const x = Number(document.getElementById("probe-radius")?.value || 1);
    document.getElementById("radius-max-value")?.replaceChildren(document.createTextNode(fmt(max, 0)));
    document.getElementById("radius-value")?.replaceChildren(document.createTextNode(fmt(x, 3)));
    document.getElementById("xi-value")?.replaceChildren(document.createTextNode(fmt(xi(x), 9)));
    document.getElementById("d-value")?.replaceChildren(document.createTextNode(fmt(dilation(x), 9)));
    document.getElementById("z-value")?.replaceChildren(document.createTextNode(fmt(xi(x), 9)));
    document.getElementById("branch-value")?.replaceChildren(document.createTextNode(branch(x)));
  }

  function inspectPlot(event) {
    if (!plotState) return;
    const {canvas, xs, ssz, gr, xPos, yPos, area, text, quantity} = plotState;
    const rect=canvas.getBoundingClientRect();
    const px=event.clientX-rect.left;
    if (px < area.left || px > area.right) return;
    let index=0, distance=Infinity;
    xs.forEach((value,i)=>{const next=Math.abs(xPos(value)-px);if(next<distance){distance=next;index=i;}});
    updatePlot();
    const state=plotState, x=xs[index], py=yPos(ssz[index]);
    state.ctx.save();state.ctx.strokeStyle=text;state.ctx.setLineDash([3,3]);
    state.ctx.beginPath();state.ctx.moveTo(xPos(x),area.top);state.ctx.lineTo(xPos(x),area.bottom);state.ctx.stroke();
    state.ctx.fillStyle=quantity==="xi" ? "#b8860b" : "#b8860b";
    state.ctx.beginPath();state.ctx.arc(xPos(x),py,5,0,Math.PI*2);state.ctx.fill();
    const reference=Number.isFinite(gr[index]) ? fmt(gr[index],6) : "outside domain";
    const label=`x=${fmt(x,4)}  SSZ=${fmt(ssz[index],6)}  reference=${reference}`;
    state.ctx.font="12px Inter, sans-serif";
    const boxWidth=Math.min(340,state.ctx.measureText(label).width+20);
    const boxX=Math.min(Math.max(area.left,xPos(x)-boxWidth/2),area.right-boxWidth);
    state.ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue("--surface").trim() || "#fff";
    state.ctx.strokeStyle=text;state.ctx.setLineDash([]);state.ctx.fillRect(boxX,area.top+24,boxWidth,28);
    state.ctx.strokeRect(boxX,area.top+24,boxWidth,28);state.ctx.fillStyle=text;state.ctx.textAlign="center";
    state.ctx.fillText(label,boxX+boxWidth/2,area.top+43);state.ctx.restore();
  }

  function calculators() {
    const massInput = document.getElementById("mass-input");
    const massUnit = document.getElementById("mass-unit");
    const radiusInput = document.getElementById("calc-radius");
    const update = () => {
      const mass = Number(massInput?.value || 1) * (massUnit?.value === "solar" ? SOLAR_MASS : 1);
      const rs = 2 * G * mass / C ** 2;
      const x = Math.max(.0001, Number(radiusInput?.value || 1));
      const d = dilation(x);
      const set = (id, value) => document.getElementById(id)?.replaceChildren(document.createTextNode(value));
      set("rs-output", `${fmt(rs, 6)} m`);
      set("calc-xi", fmt(xi(x), 10));
      set("calc-d", fmt(d, 10));
      set("calc-z", fmt(1 / d - 1, 10));
      const orbits = orbitDiagnostics(30);
      set("photon-output", orbits.photon
        ? `${fmt(orbits.photon.x, 6)} r_s (stationary null-potential candidate)`
        : "No interior stationary maximum in the inspected interval");
      set("isco-output", orbits.isco
        ? `${fmt(orbits.isco.x, 6)} r_s (minimum of circular-orbit L²; bridge-sensitive)`
        : "No stationary L² minimum in the inspected interval");
      set("shadow-output", Number.isFinite(orbits.criticalImpact)
        ? `${fmt(orbits.criticalImpact, 6)} r_s (static critical-impact proxy)`
        : "Unavailable without a stationary null candidate");
    };
    [massInput, massUnit, radiusInput].forEach(input => input?.addEventListener("input", update));
    update();
  }

  document.addEventListener("DOMContentLoaded", () => {
    ["radius-max","probe-radius","log-axis","show-limits","plot-quantity"].forEach(id => document.getElementById(id)?.addEventListener("input", updatePlot));
    document.getElementById("metric-chart")?.addEventListener("pointermove", inspectPlot);
    document.getElementById("metric-export")?.addEventListener("click", () => {
      const canvas = document.getElementById("metric-chart");
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "ssz-metric-explorer.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
    window.addEventListener("resize", updatePlot);
    updatePlot();
    calculators();
  });
  window.addEventListener("ssz-theme-change", updatePlot);
  window.SSZ = {
    PHI, strong, weak, xi, dilation, branch, quinticHermite,
    metricA, derivative, nullPotential, angularMomentumSquared, orbitDiagnostics
  };
})();
