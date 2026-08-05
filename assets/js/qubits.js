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
  let lastFrameTime = 0;

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
    return Math.abs(-2 * earthSchwarzschildRadius * height /
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

  function arrow(c, cx, cy, radius, angle, color, width = 4) {
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    c.strokeStyle = color; c.fillStyle = color; c.lineWidth = width;
    c.beginPath(); c.moveTo(cx, cy); c.lineTo(x, y); c.stroke();
    c.beginPath(); c.arc(x, y, 6, 0, Math.PI * 2); c.fill();
  }

  function drawPhasor(c, x, y, w, h, phase, fg, muted, gold) {
    const cx = x + w / 2;
    const cy = y + Math.min(h * .48, 175);
    const radius = Math.max(52, Math.min(w * .3, h * .3, 120));
    c.fillStyle = fg; c.font = "700 14px Inter, sans-serif";
    c.fillText("Physical phase phasor", x + 12, y + 22);
    c.fillStyle = muted; c.font = "12px Inter, sans-serif";
    c.fillText("actual angle · no visual magnification", x + 12, y + 42);
    c.strokeStyle = `${muted}66`; c.lineWidth = 1.5;
    c.beginPath(); c.arc(cx, cy, radius, 0, Math.PI * 2); c.stroke();
    c.setLineDash([5, 5]); c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + radius, cy); c.stroke(); c.setLineDash([]);
    const actualAngle = phase % (2 * Math.PI);
    arrow(c, cx, cy, radius, actualAngle, gold);
    if (compensated) arrow(c, cx, cy, radius * .82, 0, "#3b82f6", 3);
    c.fillStyle = muted; c.font = "12px Inter, sans-serif";
    const overlap = Math.abs(actualAngle) < .01;
    c.fillText(overlap ? "At this scale the physical gold vector" : "Gold shows ΔΦ modulo one full 2π turn.", x + 12, y + h - 46);
    if (overlap) c.fillText("overlaps the zero reference.", x + 12, y + h - 30);
    c.fillStyle = gold; c.font = "700 12px Inter, sans-serif";
    c.fillText(`ΔΦ = ${format(phase, "rad")}`, x + 12, y + h - 10);
  }

  function drawTimeline(c, x, y, w, h, phaseRate, selectedTime, fg, muted, gold) {
    const left = x + 58, right = x + w - 18, top = y + 55, bottom = y + h - 48;
    const logMin = Number($("qb-time").min);
    const logMax = Number($("qb-time").max);
    const selectedLog = Math.log10(selectedTime);
    const logRate = Math.log10(Math.max(phaseRate, Number.MIN_VALUE));
    const phaseMin = logRate + logMin;
    const phaseMax = logRate + logMax;
    const yMin = Math.floor(phaseMin);
    const yMax = Math.max(Math.ceil(phaseMax), 1);
    const px = value => left + (value - logMin) / (logMax - logMin) * (right - left);
    const py = value => bottom - (value - yMin) / (yMax - yMin) * (bottom - top);
    c.fillStyle = fg; c.font = "700 14px Inter, sans-serif";
    c.fillText("Log-time phase map", x + 12, y + 22);
    c.fillStyle = muted; c.font = "12px Inter, sans-serif";
    c.fillText("position changes visibly; values remain physical", x + 12, y + 42);
    c.strokeStyle = `${muted}55`; c.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const ly = yMin + i * (yMax - yMin) / 4;
      const yy = py(ly);
      c.beginPath(); c.moveTo(left, yy); c.lineTo(right, yy); c.stroke();
      c.fillStyle = muted; c.fillText(`10^${Math.round(ly)}`, x + 8, yy + 4);
    }
    [-9, -6, -3, 0, 4, 8].filter(v => v >= logMin && v <= logMax).forEach(value => {
      const xx = px(value);
      c.beginPath(); c.moveTo(xx, top); c.lineTo(xx, bottom); c.stroke();
      c.fillStyle = muted; c.fillText(`10^${value}s`, xx - 17, bottom + 18);
    });
    c.strokeStyle = gold; c.lineWidth = 3;
    c.beginPath(); c.moveTo(px(logMin), py(phaseMin)); c.lineTo(px(logMax), py(phaseMax)); c.stroke();
    const markerX = px(selectedLog);
    const markerY = py(logRate + selectedLog);
    c.strokeStyle = playing ? "#7c3aed" : `${muted}aa`; c.lineWidth = playing ? 3 : 2;
    c.beginPath(); c.moveTo(markerX, top); c.lineTo(markerX, bottom); c.stroke();
    c.fillStyle = gold; c.beginPath(); c.arc(markerX, markerY, playing ? 8 : 6, 0, Math.PI * 2); c.fill();
    if (compensated) {
      c.strokeStyle = "#3b82f6"; c.lineWidth = 2; c.setLineDash([8, 6]);
      c.beginPath(); c.moveTo(left, bottom); c.lineTo(right, bottom); c.stroke(); c.setLineDash([]);
    }
    c.fillStyle = muted; c.fillText("log₁₀ elapsed time", (left + right) / 2 - 48, y + h - 8);
    c.save(); c.translate(x + 10, (top + bottom) / 2 + 45); c.rotate(-Math.PI / 2); c.fillText("log₁₀ |ΔΦ / rad|", 0, 0); c.restore();
    const progress = (selectedLog - logMin) / (logMax - logMin);
    c.fillStyle = `${muted}33`; c.fillRect(left, y + h - 32, right - left, 5);
    c.fillStyle = playing ? "#7c3aed" : gold; c.fillRect(left, y + h - 32, progress * (right - left), 5);
  }

  function draw(phase, selectedTime, phaseRate) {
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
    const mode = $("qb-view").value;
    if (mode === "phasor") drawPhasor(c, 24, 15, w - 48, h - 30, phase, fg, muted, gold);
    else if (mode === "timeline") drawTimeline(c, 16, 15, w - 32, h - 30, phaseRate, selectedTime, fg, muted, gold);
    else {
      const split = Math.max(260, Math.min(370, w * .38));
      drawPhasor(c, 12, 15, split - 18, h - 30, phase, fg, muted, gold);
      c.strokeStyle = `${muted}55`; c.beginPath(); c.moveTo(split, 25); c.lineTo(split, h - 25); c.stroke();
      drawTimeline(c, split + 8, 15, w - split - 20, h - 30, phaseRate, selectedTime, fg, muted, gold);
    }
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
    $("qb-animation-status").textContent = playing
      ? `Animation active · sweeping log time · ${timeLabel(time)} selected`
      : "Animation stopped. Drag elapsed time or press “Animate time” to sweep the logarithmic axis.";
    draw(rawPhase, time, omega * dd);
  }

  function animate(timestamp = 0) {
    if (!playing) return;
    const slider = $("qb-time");
    if (!lastFrameTime) lastFrameTime = timestamp;
    const elapsed = Math.min((timestamp - lastFrameTime) / 1000, .1);
    lastFrameTime = timestamp;
    let value = Number(slider.value) + elapsed * 1.65;
    if (value > Number(slider.max)) value = Number(slider.min);
    slider.value = String(value); update();
    frame = requestAnimationFrame(animate);
  }

  ["qb-height", "qb-frequency", "qb-time", "qb-view"].forEach(id => $(id).addEventListener("input", update));
  $("qb-compensate").addEventListener("click", () => { compensated = !compensated; update(); });
  $("qb-play").addEventListener("click", () => {
    playing = !playing;
    $("qb-play").textContent = playing ? "Pause animation" : "Animate time";
    $("qb-play").setAttribute("aria-pressed", String(playing));
    lastFrameTime = 0;
    if (playing) animate(); else cancelAnimationFrame(frame);
    update();
  });
  addEventListener("resize", update);
  update();
})();
