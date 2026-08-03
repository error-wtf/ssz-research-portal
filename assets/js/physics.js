(() => {
  "use strict";
  const PHI = (1 + Math.sqrt(5)) / 2;
  const G = 6.67430e-11;
  const C = 299792458;
  const SOLAR_MASS = 1.98847e30;
  let chart;

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
  const grDilation = x => x > 1 ? Math.sqrt(1 - 1 / x) : null;
  const fmt = (number, digits = 8) => Number.isFinite(number)
    ? number.toLocaleString("en-US", { maximumFractionDigits: digits })
    : "—";

  function updatePlot() {
    const canvas = document.getElementById("metric-chart");
    if (!canvas || !window.Chart) return;
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
    const gr = xs.map(x => quantity === "xi" ? (x >= 1 ? 1 / Math.sqrt(1 - 1/x) - 1 : null) : grDilation(x));
    const dark = document.documentElement.dataset.theme === "dark";
    const grid = dark ? "#334155" : "#e2e8f0";
    const text = dark ? "#cbd5e1" : "#475569";
    chart?.destroy();
    chart = new Chart(canvas, {
      type: "line",
      data: {
        labels: xs,
        datasets: [
          {label: quantity === "xi" ? "SSZ Ξ(x)" : "SSZ D(x)", data: ssz, borderColor: "#b8860b", borderWidth: 3, pointRadius: 0},
          {label: quantity === "xi" ? "GR equivalent redshift proxy" : "Schwarzschild D", data: gr, borderColor: "#2563eb", borderDash: [8,5], borderWidth: 2, pointRadius: 0}
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, parsing: false,
        interaction: {mode: "index", intersect: false},
        plugins: {
          legend: {labels: {color: text}},
          annotation: undefined,
          tooltip: {callbacks: {
            title: items => `r/r_s = ${fmt(xs[items[0].dataIndex], 5)}`,
            label: item => `${item.dataset.label}: ${item.raw === null ? "outside domain" : fmt(item.raw, 9)}`
          }}
        },
        scales: {
          x: {type: log ? "logarithmic" : "linear", min, max, grid: {color: grid}, ticks: {color: text}, title: {display: true, text: "Normalized areal radius x = r/r_s", color: text}},
          y: {grid: {color: grid}, ticks: {color: text}, title: {display: true, text: quantity === "xi" ? "Segment density Ξ" : "Time-dilation factor D", color: text}}
        }
      },
      plugins: [{
        id: "sszLimits",
        afterDraw(instance) {
          if (!showLimits) return;
          const {ctx, chartArea, scales} = instance;
          [1, 1.8, 2.2].forEach((x, index) => {
            const px = scales.x.getPixelForValue(x);
            if (px < chartArea.left || px > chartArea.right) return;
            ctx.save(); ctx.strokeStyle = ["#b42318", "#7c3aed", "#7c3aed"][index];
            ctx.setLineDash([4,4]); ctx.beginPath(); ctx.moveTo(px, chartArea.top); ctx.lineTo(px, chartArea.bottom); ctx.stroke();
            ctx.fillStyle = text; ctx.font = "11px Inter"; ctx.fillText(["r_s","1.8 r_s","2.2 r_s"][index], px+4, chartArea.top+14); ctx.restore();
          });
        }
      }]
    });
    const x = Number(document.getElementById("probe-radius")?.value || 1);
    document.getElementById("radius-value")?.replaceChildren(document.createTextNode(fmt(x, 3)));
    document.getElementById("xi-value")?.replaceChildren(document.createTextNode(fmt(xi(x), 9)));
    document.getElementById("d-value")?.replaceChildren(document.createTextNode(fmt(dilation(x), 9)));
    document.getElementById("z-value")?.replaceChildren(document.createTextNode(fmt(xi(x), 9)));
  }

  function calculators() {
    const massInput = document.getElementById("mass-input");
    const massUnit = document.getElementById("mass-unit");
    const radiusInput = document.getElementById("calc-radius");
    const frequency = document.getElementById("jif-frequency");
    const duration = document.getElementById("jif-duration");
    const update = () => {
      const mass = Number(massInput?.value || 1) * (massUnit?.value === "solar" ? SOLAR_MASS : 1);
      const rs = 2 * G * mass / C ** 2;
      const x = Math.max(.0001, Number(radiusInput?.value || 1));
      const d = dilation(x);
      const f = Number(frequency?.value || 1e9);
      const t = Number(duration?.value || 1);
      const set = (id, value) => document.getElementById(id)?.replaceChildren(document.createTextNode(value));
      set("rs-output", `${fmt(rs, 6)} m`);
      set("calc-xi", fmt(xi(x), 10));
      set("calc-d", fmt(d, 10));
      set("calc-z", fmt(1 / d - 1, 10));
      set("jif-output", `${fmt(f * d * t, 4)} cycles`);
      set("photon-output", `${fmt(1.594811, 6)} r_s (declared decay/global comparison)`);
      set("isco-output", "Repository-derived value: verify metric branch and provenance");
      set("shadow-output", "Model-dependent: do not infer from horizon D alone");
    };
    [massInput, massUnit, radiusInput, frequency, duration].forEach(input => input?.addEventListener("input", update));
    update();
  }

  document.addEventListener("DOMContentLoaded", () => {
    ["radius-max","probe-radius","log-axis","show-limits","plot-quantity"].forEach(id => document.getElementById(id)?.addEventListener("input", updatePlot));
    updatePlot();
    calculators();
  });
  window.addEventListener("ssz-theme-change", updatePlot);
  window.SSZ = {PHI, strong, weak, xi, dilation, quinticHermite};
})();
