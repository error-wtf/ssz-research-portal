(() => {
  const $ = id => document.getElementById(id);
  const betaEl = $("closure-beta"), sigmaEl = $("closure-sigma"), stepsEl = $("closure-steps"), canvas = $("closure-canvas");
  if (!betaEl || !canvas) return;
  let position = 0;
  let playing = false;
  let frame = 0;
  let segmentStart = 0;
  let segmentFrom = 0;
  const segmentDuration = 680;
  const fmt = (x, digits = 6) => Number(x).toFixed(digits);
  function values() {
    const beta = Number(betaEl.value), sigma = Number(sigmaEl.value), max = Number(stepsEl.value);
    const signed = [], odd = [];
    let r = 1, t = 0, q = 2 * beta, d = 0;
    for (let n = 0; n <= max; n += 1) {
      signed.push({ n, r, t });
      if (n < max) { t += r; r *= sigma * beta; d += q; odd.push({ n: n + 1, d }); q *= beta * beta; }
    }
    return { beta, sigma, max, signed, odd, limit: 1 / (1 - sigma * beta), oddLimit: 2 * beta / (1 - beta * beta) };
  }
  function setup() {
    const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2), w = Math.max(360, rect.width || 760), h = Math.max(360, rect.height || 470);
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.height = `${h}px`; }
    const c = canvas.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0); return { c, w, h };
  }
  function draw() {
    const { c, w, h } = setup(), v = values(), dark = document.documentElement.dataset.theme === "dark";
    const muted = dark ? "#94a3b8" : "#64748b", line = dark ? "#334155" : "#dbe3ec", gold = dark ? "#f2c14e" : "#b8860b", blue = dark ? "#67b7ff" : "#2563eb";
    c.clearRect(0, 0, w, h); c.font = "12px system-ui";
    const top = { l: 54, r: w - 20, t: 36, b: h * .47 }, bot = { l: 54, r: w - 20, t: h * .62, b: h - 42 };
    const x = n => top.l + (n / Math.max(1, v.max)) * (top.r - top.l), topY = z => top.b - (z + 1) / 2 * (top.b - top.t), botMax = Math.max(1, v.oddLimit * 1.08), botY = z => bot.b - z / botMax * (bot.b - bot.t);
    function axes(a, title) { c.strokeStyle = line; c.lineWidth = 1; c.beginPath(); c.moveTo(a.l, a.t); c.lineTo(a.l, a.b); c.lineTo(a.r, a.b); c.stroke(); c.fillStyle = muted; c.fillText(title, a.l, a.t - 10); }
    axes(top, `signed remaining rₙ / L · σ=${v.sigma}`); axes(bot, "odd partial Δtₙ / T₀");
    c.setLineDash([4, 4]); c.strokeStyle = gold; c.beginPath(); c.moveTo(top.l, topY(0)); c.lineTo(top.r, topY(0)); c.stroke(); c.setLineDash([]);
    const whole = Math.min(v.max, Math.floor(position)), alpha = Math.max(0, Math.min(1, position - whole));
    const drawSeries = (points, y, color, limit) => { c.strokeStyle = color; c.lineWidth = 2.5; c.beginPath(); points.slice(0, whole + 1).forEach((p, i) => { const px = x(p.n), py = y(p[limit ? "d" : "r"]); i ? c.lineTo(px, py) : c.moveTo(px, py); }); if (whole < limit.length - 1) { const a = points[whole], b = points[whole + 1]; c.lineTo(x(a.n + alpha), y(a[limit ? "d" : "r"] + (b[limit ? "d" : "r"] - a[limit ? "d" : "r"]) * alpha)); } c.stroke(); points.slice(0, whole + 1).forEach(p => { c.fillStyle = color; c.beginPath(); c.arc(x(p.n), y(p[limit ? "d" : "r"]), 4, 0, Math.PI * 2); c.fill(); }); if (whole < limit.length - 1 && alpha > 0) { const a = points[whole], b = points[whole + 1], val = a[limit ? "d" : "r"] + (b[limit ? "d" : "r"] - a[limit ? "d" : "r"]) * alpha; c.shadowBlur = 18; c.shadowColor = color; c.fillStyle = color; c.beginPath(); c.arc(x(a.n + alpha), y(val), 7, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0; } };
    drawSeries(v.signed, z => topY(Math.max(-1, Math.min(1, z))), blue, v.signed);
    drawSeries(v.odd, botY, gold, v.odd);
    const currentSigned = v.signed[Math.min(whole, v.max)], currentOdd = v.odd[Math.max(0, Math.min(v.odd.length - 1, whole - 1))];
    c.fillStyle = muted; c.fillText(`finite: ${fmt(currentSigned?.t || 0)} · exact: ${fmt(v.limit)}`, top.l, top.b + 25); c.fillText(`odd: ${fmt(currentOdd?.d || 0)} · exact: ${fmt(v.oddLimit)}`, bot.l, bot.b + 25);
    $("closure-beta-out").textContent = fmt(v.beta, 3); $("closure-steps-out").textContent = String(v.max); $("closure-time").textContent = fmt(currentSigned?.t || 0); $("closure-limit").textContent = fmt(v.limit); $("closure-odd").textContent = fmt(currentOdd?.d || 0); $("closure-odd-limit").textContent = fmt(v.oddLimit); $("closure-status").textContent = playing ? `Animating continuously: step ${Math.min(v.max, Math.floor(position))} → ${Math.min(v.max, Math.floor(position) + 1)}.` : `Paused at step ${Math.floor(position)} of ${v.max}.`;
  }
  function restart() { position = 0; playing = false; cancelAnimationFrame(frame); draw(); }
  function animate(now = performance.now()) { if (!playing) { playing = true; segmentFrom = Math.min(position, Number(stepsEl.value)); segmentStart = now; } const max = Number(stepsEl.value), elapsed = Math.min(1, (now - segmentStart) / segmentDuration), eased = elapsed * elapsed * (3 - 2 * elapsed); position = segmentFrom + eased; draw(); if (elapsed >= 1) { if (segmentFrom >= max) { playing = false; position = max; draw(); return; } segmentFrom += 1; segmentStart = now; } frame = requestAnimationFrame(animate); }
  [betaEl, sigmaEl, stepsEl].forEach(el => el.addEventListener("input", restart)); $("closure-step")?.addEventListener("click", () => { playing = false; position = Math.min(Number(stepsEl.value), Math.floor(position) + 1); draw(); }); $("closure-play")?.addEventListener("click", () => { if (playing) { playing = false; cancelAnimationFrame(frame); draw(); } else animate(); }); $("closure-reset")?.addEventListener("click", restart); window.addEventListener("resize", draw); window.addEventListener("ssz-theme-change", draw); draw();
})();
