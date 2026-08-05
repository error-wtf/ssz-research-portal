(() => {
  const $ = id => document.getElementById(id);
  const betaEl = $("closure-beta");
  const sigmaEl = $("closure-sigma");
  const stepsEl = $("closure-steps");
  const canvas = $("closure-canvas");
  if (!betaEl || !canvas) return;
  let visible = 0;
  let playing = false;
  let frame = 0;
  const fmt = (x, digits = 6) => Number(x).toFixed(digits);
  function values() {
    const beta = Number(betaEl.value), sigma = Number(sigmaEl.value), max = Number(stepsEl.value);
    const signed = [], odd = [];
    let r = 1, t = 0, q = 2 * beta, d = 0;
    for (let n = 0; n <= max; n += 1) {
      signed.push({ n, r, t });
      if (n < max) { t += r; r *= sigma * beta; }
      if (n < max) { d += q; odd.push({ n: n + 1, d }); q *= beta * beta; }
    }
    return { beta, sigma, max, signed, odd, limit: 1 / (1 - sigma * beta), oddLimit: 2 * beta / (1 - beta * beta) };
  }
  function setup() {
    const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.max(360, rect.width || 760), h = Math.max(360, rect.height || 470);
    canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.height = `${h}px`;
    const c = canvas.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0); return { c, w, h };
  }
  function draw() {
    const { c, w, h } = setup(), v = values(), dark = document.documentElement.dataset.theme === "dark";
    const ink = dark ? "#e5e7eb" : "#1e293b", muted = dark ? "#94a3b8" : "#64748b", line = dark ? "#334155" : "#dbe3ec", gold = dark ? "#f2c14e" : "#b8860b", blue = dark ? "#67b7ff" : "#2563eb";
    c.clearRect(0, 0, w, h); c.font = "12px system-ui";
    const top = { l: 54, r: w - 20, t: 36, b: h * .47 }, bot = { l: 54, r: w - 20, t: h * .62, b: h - 42 };
    const x = n => top.l + (n / Math.max(1, v.max)) * (top.r - top.l);
    const topY = z => top.b - (z + 1) / 2 * (top.b - top.t);
    const botMax = Math.max(1, v.oddLimit * 1.08), botY = z => bot.b - z / botMax * (bot.b - bot.t);
    function axes(a, title) { c.strokeStyle = line; c.lineWidth = 1; c.beginPath(); c.moveTo(a.l, a.t); c.lineTo(a.l, a.b); c.lineTo(a.r, a.b); c.stroke(); c.fillStyle = muted; c.fillText(title, a.l, a.t - 10); }
    axes(top, `signed remaining rₙ / L · σ=${v.sigma}`); axes(bot, "odd partial Δtₙ / T₀");
    c.setLineDash([4, 4]); c.strokeStyle = gold; c.beginPath(); c.moveTo(top.l, topY(0)); c.lineTo(top.r, topY(0)); c.stroke(); c.setLineDash([]);
    const shown = Math.min(visible, v.max);
    c.strokeStyle = blue; c.lineWidth = 2.5; c.beginPath(); v.signed.slice(0, shown + 1).forEach((p, i) => { const px = x(p.n), py = topY(Math.max(-1, Math.min(1, p.r))); i ? c.lineTo(px, py) : c.moveTo(px, py); }); c.stroke();
    v.signed.slice(0, shown + 1).forEach(p => { c.fillStyle = blue; c.beginPath(); c.arc(x(p.n), topY(Math.max(-1, Math.min(1, p.r))), 4, 0, Math.PI * 2); c.fill(); });
    c.strokeStyle = gold; c.lineWidth = 2.5; c.beginPath(); v.odd.slice(0, shown).forEach((p, i) => { const px = x(p.n), py = botY(p.d); i ? c.lineTo(px, py) : c.moveTo(px, py); }); c.stroke();
    v.odd.slice(0, shown).forEach(p => { c.fillStyle = gold; c.beginPath(); c.arc(x(p.n), botY(p.d), 4, 0, Math.PI * 2); c.fill(); });
    c.fillStyle = muted; c.fillText(`finite: ${fmt(v.signed[shown]?.t || 0)} · exact: ${fmt(v.limit)}`, top.l, top.b + 25); c.fillText(`odd: ${fmt(v.odd[Math.max(0, shown - 1)]?.d || 0)} · exact: ${fmt(v.oddLimit)}`, bot.l, bot.b + 25);
    $("closure-beta-out").textContent = fmt(v.beta, 3); $("closure-steps-out").textContent = String(v.max); $("closure-time").textContent = fmt(v.signed[shown]?.t || 0); $("closure-limit").textContent = fmt(v.limit); $("closure-odd").textContent = fmt(v.odd[Math.max(0, shown - 1)]?.d || 0); $("closure-odd-limit").textContent = fmt(v.oddLimit); $("closure-status").textContent = playing ? `Animating: step ${shown} of ${v.max}.` : `Paused at step ${shown} of ${v.max}.`;
  }
  function restart() { visible = 0; playing = false; cancelAnimationFrame(frame); draw(); }
  function animate() { playing = true; visible = visible >= Number(stepsEl.value) ? 0 : visible; const tick = () => { visible += 1; if (visible >= Number(stepsEl.value)) playing = false; draw(); if (visible < Number(stepsEl.value) && playing) frame = requestAnimationFrame(() => setTimeout(tick, 160)); }; tick(); }
  [betaEl, sigmaEl, stepsEl].forEach(el => el.addEventListener("input", restart)); $("closure-step")?.addEventListener("click", () => { playing = false; visible = Math.min(Number(stepsEl.value), visible + 1); draw(); }); $("closure-play")?.addEventListener("click", animate); $("closure-reset")?.addEventListener("click", restart); window.addEventListener("resize", draw); window.addEventListener("ssz-theme-change", draw); draw();
})();
