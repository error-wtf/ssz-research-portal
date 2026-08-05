(() => {
  const $ = id => document.getElementById(id);
  const betaEl = $("closure-beta"), heightEl = $("closure-height"), sigmaEl = $("closure-sigma"), stepsEl = $("closure-steps"), compareEl = $("closure-compare"), canvas = $("closure-canvas");
  if (!betaEl || !canvas) return;
  let position = 0;
  let playing = false;
  let frame = 0;
  let segmentStart = 0;
  let segmentFrom = 0;
  let model = null;
  const segmentDuration = 680;
  const fmt = (x, digits = 6) => Number(x).toFixed(digits);
  function stableGeometricLimit(ratio) {
    // Evaluate 1/(1-ratio) without first subtracting two nearly equal
    // logarithmic factors; this remains well behaved for either direction.
    return 1 / (1 + Math.expm1(Math.log1p(-ratio)));
  }
  function signedSeries(beta, sigma, max, initialHeight) {
    const signed = []; let r = initialHeight, t = 0, tComp = 0;
    for (let n = 0; n <= max; n += 1) {
      signed.push({ n, r, t });
      if (n < max) { const term = r - tComp, next = t + term; tComp = (next - t) - term; t = next; r *= sigma * beta; }
    }
    return signed;
  }
  function buildModel() {
    const beta = Number(betaEl.value), sigma = Number(sigmaEl.value), max = Number(stepsEl.value), initialHeight = Number(heightEl?.value || 1);
    const signed = signedSeries(beta, sigma, max, initialHeight), comparison = signedSeries(beta, -sigma, max, initialHeight), odd = [];
    for (let n = 0; n <= max; n += 1) odd.push({ n, d: signed[n].t - comparison[n].t });
    return { beta, sigma, max, initialHeight, signed, comparison, odd, limit: initialHeight * stableGeometricLimit(sigma * beta), oddLimit: 2 * initialHeight * beta / ((1 - beta) * (1 + beta)) };
  }
  function setup() {
    const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2), w = Math.max(360, rect.width || 760), h = Math.max(360, rect.height || 470);
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.height = `${h}px`; }
    const c = canvas.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0); return { c, w, h };
  }
  function draw() {
    const { c, w, h } = setup(), v = model || (model = buildModel()), dark = document.documentElement.dataset.theme === "dark";
    const muted = dark ? "#94a3b8" : "#64748b", line = dark ? "#334155" : "#dbe3ec", gold = dark ? "#f2c14e" : "#b8860b", blue = dark ? "#67b7ff" : "#2563eb";
    c.clearRect(0, 0, w, h); c.font = "12px system-ui";
    const top = { l: 54, r: w - 20, t: 36, b: h * .47 }, bot = { l: 54, r: w - 20, t: h * .62, b: h - 42 };
    const x = n => top.l + (n / Math.max(1, v.max)) * (top.r - top.l), topRange = Math.max(0.2, v.initialHeight * 1.12), topY = z => top.b - (z + topRange) / (2 * topRange) * (top.b - top.t), botMax = Math.max(1, v.oddLimit * 1.08), botY = z => bot.b - z / botMax * (bot.b - bot.t);
    function axes(a, title) { c.strokeStyle = line; c.lineWidth = 1; c.beginPath(); c.moveTo(a.l, a.t); c.lineTo(a.l, a.b); c.lineTo(a.r, a.b); c.stroke(); c.fillStyle = muted; c.fillText(title, a.l, a.t - 10); }
    axes(top, `signed remaining ℓₙ/L · ℓ₀/L=${fmt(v.initialHeight, 2)} · σ=${v.sigma}`); axes(bot, "odd partial Δtₙ/T₀");
    c.setLineDash([4, 4]); c.strokeStyle = gold; c.beginPath(); c.moveTo(top.l, topY(0)); c.lineTo(top.r, topY(0)); c.stroke(); c.setLineDash([]);
    const whole = Math.min(v.max, Math.floor(position)), alpha = Math.max(0, Math.min(1, position - whole));
    const drawSeries = (points, y, color, valueKey) => { const value = point => point[valueKey]; c.strokeStyle = color; c.lineWidth = 2.5; c.beginPath(); points.slice(0, whole + 1).forEach((p, i) => { const px = x(p.n), py = y(value(p)); i ? c.lineTo(px, py) : c.moveTo(px, py); }); if (whole < points.length - 1) { const a = points[whole], b = points[whole + 1]; c.lineTo(x(a.n + alpha), y(value(a) + (value(b) - value(a)) * alpha)); } c.stroke(); points.slice(0, whole + 1).forEach(p => { c.fillStyle = color; c.beginPath(); c.arc(x(p.n), y(value(p)), 4, 0, Math.PI * 2); c.fill(); }); if (whole < points.length - 1 && alpha > 0) { const a = points[whole], b = points[whole + 1], val = value(a) + (value(b) - value(a)) * alpha; c.shadowBlur = 18; c.shadowColor = color; c.fillStyle = color; c.beginPath(); c.arc(x(a.n + alpha), y(val), 7, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0; } };
    drawSeries(v.signed, z => topY(Math.max(-topRange, Math.min(topRange, z))), blue, "r");
    if (compareEl?.checked) { c.save(); c.globalAlpha = .28; drawSeries(v.comparison, z => topY(Math.max(-topRange, Math.min(topRange, z))), gold, "r"); c.restore(); }
    drawSeries(v.odd, botY, gold, "d");
    // A shared moving cursor makes the continuous interpolation unmistakable
    // even when successive geometric points are numerically close.
    const cursorX = x(Math.min(v.max, position));
    c.strokeStyle = dark ? "#f8fafc88" : "#0f172a66"; c.lineWidth = 1.5; c.setLineDash([3, 5]); c.beginPath(); c.moveTo(cursorX, top.t); c.lineTo(cursorX, bot.b); c.stroke(); c.setLineDash([]);
    const currentSigned = v.signed[Math.min(whole, v.max)], nextSigned = v.signed[Math.min(whole + 1, v.max)], currentOdd = v.odd[Math.min(whole, v.max)], nextOdd = v.odd[Math.min(whole + 1, v.max)];
    const currentTime = currentSigned ? currentSigned.t + ((nextSigned?.t ?? currentSigned.t) - currentSigned.t) * alpha : 0;
    const currentOddValue = currentOdd ? currentOdd.d + ((nextOdd?.d ?? currentOdd.d) - currentOdd.d) * alpha : 0;
    c.fillStyle = muted; c.fillText(`finite: ${fmt(currentTime)} · exact: ${fmt(v.limit)}`, top.l, top.b + 25); c.fillText(`odd: ${fmt(currentOddValue)} · exact: ${fmt(v.oddLimit)}`, bot.l, bot.b + 25);
    $("closure-beta-out").textContent = fmt(v.beta, 3); $("closure-height-out").textContent = fmt(v.initialHeight, 2); $("closure-steps-out").textContent = String(v.max); $("closure-time").textContent = fmt(currentTime); $("closure-limit").textContent = fmt(v.limit); $("closure-odd").textContent = fmt(currentOddValue); $("closure-odd-limit").textContent = fmt(v.oddLimit);
    const step = Math.min(v.max, Math.floor(position));
    $("closure-status").textContent = playing ? `Correction ${step} → ${Math.min(v.max, step + 1)}: add the current remainder to t, then apply rₙ₊₁=σβrₙ. The gold trace accumulates the odd directional contribution.` : step === 0 ? "Ready: r₀ is loaded; no correction has been added yet." : `Paused after ${step} correction${step === 1 ? "" : "s"}: t now includes the first ${step} remainder contribution${step === 1 ? "" : "s"}.`;
    document.querySelectorAll("[data-closure-story]").forEach(card => card.classList.toggle("active", Number(card.dataset.closureStory) === (step === 0 ? 0 : step >= v.max ? 2 : 1)));
  }
  function restart() { position = 0; playing = false; cancelAnimationFrame(frame); model = buildModel(); draw(); }
  function animate(now = performance.now()) { if (!playing) { playing = true; segmentFrom = Math.min(position, Number(stepsEl.value)); segmentStart = now; } const max = Number(stepsEl.value), elapsed = Math.min(1, (now - segmentStart) / segmentDuration), eased = elapsed * elapsed * (3 - 2 * elapsed); position = segmentFrom + eased; draw(); if (elapsed >= 1) { if (segmentFrom >= max) { playing = false; position = max; draw(); return; } segmentFrom += 1; segmentStart = now; } frame = requestAnimationFrame(animate); }
  [betaEl, heightEl, sigmaEl, stepsEl].filter(Boolean).forEach(el => el.addEventListener("input", restart)); compareEl?.addEventListener("change", draw); $("closure-step")?.addEventListener("click", () => { playing = false; position = Math.min(model.max, Math.floor(position) + 1); draw(); }); $("closure-play")?.addEventListener("click", () => { if (playing) { playing = false; cancelAnimationFrame(frame); draw(); } else animate(); }); $("closure-reset")?.addEventListener("click", restart); window.addEventListener("resize", draw); window.addEventListener("ssz-theme-change", draw); model = buildModel(); draw();
})();
