(() => {
  "use strict";

  const byId = id => document.getElementById(id);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const colours = {
    gold: "#b8860b", blue: "#2563eb", violet: "#7c3aed",
    green: "#087f5b", red: "#b42318", muted: "#64748b"
  };
  const theme = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const format = (value, digits = 5) => Number.isFinite(value)
    ? value.toLocaleString("en-US", {maximumFractionDigits: digits})
    : "—";
  const scientific = value => Number.isFinite(value) ? value.toExponential(5) : "—";
  const text = (id, value) => byId(id)?.replaceChildren(document.createTextNode(value));

  function canvasSetup(canvas, minimumHeight = 470) {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, rect.width || 760);
    const height = Math.max(360, rect.height || minimumHeight);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const context = canvas.getContext("2d");
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    return {context, width, height};
  }

  const phaseState = {playing: false, start: 0, baseTime: 1, animationTime: 0};

  function phaseValues() {
    const logRadius = Number(byId("jif-radius")?.value || 0);
    const logFrequency = Number(byId("jif-frequency")?.value || 3);
    const duration = Number(byId("jif-time")?.value || 1);
    const radius = 10 ** logRadius;
    const frequency = 10 ** logFrequency;
    const xi = window.SSZ.xi(radius);
    const d = window.SSZ.dilation(radius);
    const count = frequency * duration * d;
    return {logRadius, logFrequency, duration, radius, frequency, xi, d, count,
      reference: frequency * duration, lag: frequency * duration * (1 - d)};
  }

  function drawPhasor(context, centreX, centreY, radius, angle, colour, label) {
    context.save();
    context.strokeStyle = theme("--line") || "#e2e8f0";
    context.lineWidth = 1;
    context.beginPath();
    context.arc(centreX, centreY, radius, 0, Math.PI * 2);
    context.stroke();
    for (let tick = 0; tick < 12; tick += 1) {
      const a = tick / 12 * Math.PI * 2;
      context.beginPath();
      context.moveTo(centreX + Math.cos(a) * (radius - 5), centreY + Math.sin(a) * (radius - 5));
      context.lineTo(centreX + Math.cos(a) * radius, centreY + Math.sin(a) * radius);
      context.stroke();
    }
    context.strokeStyle = colour;
    context.fillStyle = colour;
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(centreX, centreY);
    context.lineTo(centreX + Math.cos(angle) * radius * .82, centreY + Math.sin(angle) * radius * .82);
    context.stroke();
    context.beginPath();
    context.arc(centreX + Math.cos(angle) * radius * .82, centreY + Math.sin(angle) * radius * .82, 6, 0, Math.PI * 2);
    context.fill();
    context.font = "700 13px Inter, system-ui, sans-serif";
    context.textAlign = "center";
    context.fillText(label, centreX, centreY + radius + 27);
    context.restore();
  }

  function drawPhase() {
    const canvas = byId("jif-phase-canvas");
    if (!canvas || !window.SSZ) return;
    const values = phaseValues();
    const {context, width, height} = canvasSetup(canvas);
    const surface = theme("--surface") || "#fff";
    const line = theme("--line") || "#e2e8f0";
    const muted = theme("--muted") || colours.muted;
    const textColour = theme("--text") || "#1e293b";
    context.clearRect(0, 0, width, height);
    context.fillStyle = surface;
    context.fillRect(0, 0, width, height);

    const top = Math.min(190, height * .39);
    const phasorRadius = Math.min(84, width * .115);
    const leftX = width * .3;
    const rightX = width * .7;
    const localAngle = -Math.PI / 2 + (values.count % 1) * Math.PI * 2;
    const referenceAngle = -Math.PI / 2 + (values.reference % 1) * Math.PI * 2;
    drawPhasor(context, leftX, top, phasorRadius, localAngle, colours.gold, "local J = f₀D·t");
    drawPhasor(context, rightX, top, phasorRadius, referenceAngle, colours.blue, "reference J = f₀·t");

    const chart = {left: 54, right: width - 26, top: top + phasorRadius + 72, bottom: height - 48};
    context.strokeStyle = line;
    context.fillStyle = muted;
    context.lineWidth = 1;
    context.font = "12px Inter, system-ui, sans-serif";
    for (let row = 0; row <= 4; row += 1) {
      const y = chart.top + (chart.bottom - chart.top) * row / 4;
      context.beginPath(); context.moveTo(chart.left, y); context.lineTo(chart.right, y); context.stroke();
    }
    context.fillText("phase history (wrapped)", chart.left, chart.top - 13);
    const samples = 300;
    const drawWave = (rate, colour, offset) => {
      context.strokeStyle = colour;
      context.lineWidth = 2.5;
      context.beginPath();
      for (let index = 0; index < samples; index += 1) {
        const fraction = index / (samples - 1);
        const x = chart.left + fraction * (chart.right - chart.left);
        const cycles = Math.min(9, Math.max(1.2, Math.log10(values.frequency + 10) * .7));
        const y = (chart.top + chart.bottom) / 2 + offset
          - Math.sin(fraction * cycles * Math.PI * 2 * rate + values.duration * rate) * 34;
        if (!index) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.stroke();
    };
    drawWave(values.d, colours.gold, -24);
    drawWave(1, colours.blue, 24);
    context.fillStyle = textColour;
    context.textAlign = "right";
    context.fillText(`ΔJ lag ${scientific(values.lag)} cycles`, chart.right, height - 16);

    text("jif-radius-out", `${values.logRadius.toFixed(3)}  →  ${format(values.radius, 3)} rₛ`);
    text("jif-frequency-out", `${values.logFrequency.toFixed(2)}  →  ${scientific(values.frequency)} Hz`);
    text("jif-time-out", `${values.duration.toFixed(3)} s`);
    text("jif-branch", window.SSZ.branch(values.radius));
    text("jif-xi", format(values.xi, 9));
    text("jif-d", format(values.d, 9));
    text("jif-rate", `${scientific(values.frequency * values.d)} s⁻¹`);
    text("jif-count", `${scientific(values.count)} cycles`);
    text("jif-lag", `${scientific(values.lag)} cycles`);
  }

  function animatePhase(timestamp) {
    if (!phaseState.playing) return;
    if (!phaseState.start) phaseState.start = timestamp;
    const elapsed = (timestamp - phaseState.start) / 1000;
    byId("jif-time").value = String((phaseState.baseTime + elapsed * .45) % 5);
    drawPhase();
    requestAnimationFrame(animatePhase);
  }

  const ledgerIds = ["jif-emission", "jif-transfer", "jif-node", "jif-detector"];
  const ledgerColours = [colours.gold, colours.blue, colours.violet, colours.green];
  const ledgerLabels = ["Emission", "Transfer", "Node", "Detector / LO"];

  function ledgerValues() {
    const values = ledgerIds.map(id => Number(byId(id)?.value || 0));
    const total = values.reduce((sum, value) => sum + value, 0);
    const wrapped = ((total + .5) % 1 + 1) % 1 - .5;
    return {values, total, wrapped, phase: wrapped * 2 * Math.PI};
  }

  function drawLedger() {
    const canvas = byId("jif-ledger-canvas");
    if (!canvas) return;
    const {values, total, wrapped, phase} = ledgerValues();
    const {context, width, height} = canvasSetup(canvas);
    const surface = theme("--surface") || "#fff";
    const line = theme("--line") || "#e2e8f0";
    const textColour = theme("--text") || "#1e293b";
    const muted = theme("--muted") || colours.muted;
    context.clearRect(0, 0, width, height);
    context.fillStyle = surface;
    context.fillRect(0, 0, width, height);

    const left = 38, right = width - 38;
    const rowHeight = Math.min(66, (height - 165) / 4);
    values.forEach((value, index) => {
      const y = 42 + rowHeight * index;
      context.fillStyle = textColour;
      context.font = "700 13px Inter, system-ui, sans-serif";
      context.textAlign = "left";
      context.fillText(ledgerLabels[index], left, y);
      context.fillStyle = line;
      context.fillRect(left, y + 12, right - left, 10);
      const zero = (left + right) / 2;
      context.fillStyle = ledgerColours[index];
      const length = value / 2 * (right - left) / 2;
      context.fillRect(Math.min(zero, zero + length), y + 10, Math.abs(length), 14);
      context.fillStyle = muted;
      context.textAlign = "right";
      context.fillText(`${value >= 0 ? "+" : ""}${value.toFixed(2)} cycles`, right, y);
    });

    const centreX = width * .5, centreY = height - 92;
    const radius = Math.min(62, width * .1);
    drawPhasor(context, centreX, centreY, radius, -Math.PI / 2 + phase, colours.red, `wrapped sum ${wrapped.toFixed(3)} cycles`);
    context.strokeStyle = line;
    context.setLineDash([5, 5]);
    context.beginPath();
    context.moveTo(left, centreY);
    context.lineTo(centreX - radius - 28, centreY);
    context.moveTo(centreX + radius + 28, centreY);
    context.lineTo(right, centreY);
    context.stroke();
    context.setLineDash([]);

    ledgerIds.forEach((id, index) => text(`${id}-out`, `${values[index] < 0 ? "−" : ""}${Math.abs(values[index]).toFixed(2)}`));
    text("jif-ledger-total", `${total.toFixed(3)} cycles`);
    text("jif-ledger-wrapped", `${wrapped.toFixed(3)} cycles`);
    text("jif-ledger-phase", `${phase.toFixed(3)} rad`);
  }

  function initialise() {
    if (!window.SSZ) return;
    ["jif-radius", "jif-frequency", "jif-time"].forEach(id => byId(id)?.addEventListener("input", drawPhase));
    ledgerIds.forEach(id => byId(id)?.addEventListener("input", drawLedger));
    byId("jif-play")?.addEventListener("click", () => {
      phaseState.playing = !phaseState.playing;
      phaseState.start = 0;
      phaseState.baseTime = Number(byId("jif-time").value || 0);
      const button = byId("jif-play");
      button.textContent = phaseState.playing ? "Pause animation" : "Animate duration";
      button.setAttribute("aria-pressed", String(phaseState.playing));
      if (phaseState.playing) requestAnimationFrame(animatePhase);
    });
    byId("jif-reset")?.addEventListener("click", () => {
      phaseState.playing = false;
      phaseState.start = 0;
      byId("jif-radius").value = "0";
      byId("jif-frequency").value = "3";
      byId("jif-time").value = "1";
      byId("jif-play").textContent = "Animate duration";
      byId("jif-play").setAttribute("aria-pressed", "false");
      drawPhase();
    });
    if (!reducedMotion.matches) {
      phaseState.playing = true;
      phaseState.baseTime = Number(byId("jif-time").value || 1);
      byId("jif-play").textContent = "Pause animation";
      byId("jif-play").setAttribute("aria-pressed", "true");
      requestAnimationFrame(animatePhase);
    }
    drawPhase();
    drawLedger();
  }

  document.addEventListener("DOMContentLoaded", initialise);
  window.addEventListener("resize", () => { drawPhase(); drawLedger(); });
  window.addEventListener("ssz-theme-change", () => { drawPhase(); drawLedger(); });
})();
