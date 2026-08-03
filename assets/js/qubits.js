(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const canvas = $("qubit-canvas");
  if (!canvas) return;

  const earthRadius = 6_371_000;
  const earthSchwarzschildRadius = 8.87e-3;
  let compensated = false;
  let playing = false;
  let frame = 0;

  function inputs() {
    return {
      height: 10 ** Number($("qb-height").value),
      frequency: Number($("qb-frequency").value) * 1e9,
      time: 10 ** Number($("qb-time").value)
    };
  }

  function stableDeltaD(height) {
    const r1 = earthRadius;
    const r2 = earthRadius + height;
    return Math.abs(2 * earthSchwarzschildRadius * (r1 - r2) /
      ((2 * r1 + earthSchwarzschildRadius) * (2 * r2 + earthSchwarzschildRadius)));
  }

  function format(value, unit = "") {
    if (!Number.isFinite(value)) return "—";
    const body = Math.abs(value) && (Math.abs(value) < 1e-3 || Math.abs(value) >= 1e5)
      ? value.toExponential(5) : value.toPrecision(7);
    return `${body}${unit ? ` ${unit}` : ""}`;
  }

  function timeLabel(seconds) {
    if (seconds < 1e-6) return `${(seconds * 1e9).toPrecision(4)} ns`;
    if (seconds < 1e-3) return `${(seconds * 1e6).toPrecision(4)} µs`;
    if (seconds < 1) return `${(seconds * 1e3).toPrecision(4)} ms`;
    if (seconds < 31_557_600) return `${seconds.toPrecision(4)} s`;
    return `${(seconds / 31_557_600).toPrecision(4)} yr`;
  }

  function draw(phase, selectedTime) {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(640, rect.width || 900);
    const h = 430;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const c = canvas.getContext("2d"); c.scale(dpr, dpr);
    const css = getComputedStyle(document.documentElement);
    const fg = css.getPropertyValue("--text").trim() || "#172033";
    const muted = css.getPropertyValue("--muted").trim() || "#667085";
    const gold = css.getPropertyValue("--gold").trim() || "#bb8b2f";
    c.clearRect(0, 0, w, h);
    c.strokeStyle = `${muted}55`; c.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = 35 + i * 65;
      c.beginPath(); c.moveTo(72, y); c.lineTo(w - 25, y); c.stroke();
    }
    c.fillStyle = fg; c.font = "600 14px Inter, sans-serif";
    c.fillText("Relative phase accumulation (normalized to the selected interval)", 72, 22);
    c.fillStyle = muted; c.font = "12px Inter, sans-serif";
    c.fillText("elapsed time / selected time", w / 2 - 55, h - 12);
    c.save(); c.translate(17, h / 2 + 55); c.rotate(-Math.PI / 2); c.fillText("relative phase", 0, 0); c.restore();
    const max = Math.max(Math.abs(phase), 1e-30);
    const x0 = 72, x1 = w - 25, y0 = h - 55, y1 = 45;
    c.strokeStyle = gold; c.lineWidth = 3; c.beginPath();
    for (let i = 0; i <= 240; i++) {
      const q = i / 240;
      const x = x0 + q * (x1 - x0);
      const y = y0 - (q * phase / max) * (y0 - y1) * .82;
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.stroke();
    if (compensated) {
      c.strokeStyle = "#3b82f6"; c.lineWidth = 3; c.setLineDash([8, 6]);
      c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y0); c.stroke(); c.setLineDash([]);
    }
    c.fillStyle = gold; c.beginPath(); c.arc(x1, y0 - (phase / max) * (y0 - y1) * .82, 6, 0, Math.PI * 2); c.fill();
    c.fillStyle = muted;
    c.fillText(`selected time: ${timeLabel(selectedTime)}`, 78, h - 32);
    c.fillText(`phase scale: ${format(max, "rad")}`, w - 245, 63);
    c.fillStyle = "#3b82f6"; c.fillText(compensated ? "Rz compensation shown" : "compensation off", w - 245, 83);
  }

  function update() {
    const {height, frequency, time} = inputs();
    const dd = stableDeltaD(height);
    const omega = 2 * Math.PI * frequency;
    const rawPhase = omega * dd * time;
    const phase = compensated ? 0 : rawPhase;
    const fidelity = Math.cos(phase / 2) ** 2;
    const chsh = 2 * Math.sqrt(2) * Math.cos(phase);
    const tSsz = Math.PI / (omega * dd);
    $("qb-height-out").textContent = height < .01 ? `${(height * 1e3).toPrecision(4)} mm` : `${height.toPrecision(4)} m`;
    $("qb-frequency-out").textContent = `${(frequency / 1e9).toFixed(2)} GHz`;
    $("qb-time-out").textContent = timeLabel(time);
    $("qb-dd").textContent = format(dd);
    $("qb-phase").textContent = format(rawPhase, "rad");
    $("qb-fidelity").textContent = format(fidelity);
    $("qb-chsh").textContent = format(chsh);
    $("qb-tssz").textContent = timeLabel(tSsz);
    $("qb-comp-status").textContent = compensated ? `on · Rz(${format(-rawPhase, "rad")})` : "off";
    draw(rawPhase, time);
  }

  function animate() {
    if (!playing) return;
    const slider = $("qb-time");
    let value = Number(slider.value) + .018;
    if (value > Number(slider.max)) value = Number(slider.min);
    slider.value = String(value); update();
    frame = requestAnimationFrame(animate);
  }

  ["qb-height", "qb-frequency", "qb-time"].forEach(id => $(id).addEventListener("input", update));
  $("qb-compensate").addEventListener("click", () => { compensated = !compensated; update(); });
  $("qb-play").addEventListener("click", () => {
    playing = !playing;
    $("qb-play").textContent = playing ? "Pause animation" : "Animate time";
    if (playing) animate(); else cancelAnimationFrame(frame);
  });
  addEventListener("resize", update);
  update();
})();
