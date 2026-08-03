(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
  const fmt = (value, digits = 4) => Number(value).toLocaleString("en-US", {maximumFractionDigits: digits});
  let payload;

  function repositoryTable() {
    $("run-repositories").innerHTML = payload.repositories.map(row => {
      const rate = row.expected ? 100 * row.passed / row.expected : 0;
      return `<tr><td><a href="https://github.com/error-wtf/${encodeURIComponent(row.repository)}" target="_blank" rel="noopener"><strong>${escapeHtml(row.repository)}</strong></a></td>
        <td>${row.passed.toLocaleString("en-US")}</td><td>${row.failed}</td><td>${row.expected.toLocaleString("en-US")}</td>
        <td><div class="progress-track" aria-label="${fmt(rate, 1)} percent"><span style="width:${Math.min(rate, 100)}%"></span></div><small>${fmt(rate, 1)}%</small></td>
        <td>${escapeHtml(row.evidence_class)}<br><small>${escapeHtml(row.does_not_prove)}</small></td></tr>`;
    }).join("");
  }

  function historicalTable() {
    $("historical-runs").innerHTML = payload.historical_snapshot.repositories.map(row =>
      `<tr><td>${escapeHtml(row.repository)}</td><td>${row.passed}</td><td>${row.failed}</td><td>${row.expected}</td><td>${escapeHtml(row.rate_label)}</td><td>${escapeHtml(row.interpretation)}</td></tr>`
    ).join("");
  }

  function executionTable() {
    $("execution-categories").innerHTML = payload.unified_execution.categories.map(row =>
      `<tr><td>${escapeHtml(row.category.replaceAll("_", " "))}</td><td>${row.passed}</td><td>${row.failed}</td><td>${row.skipped}</td><td>${fmt(row.duration_seconds, 2)} s</td><td>${escapeHtml(row.unit)}</td></tr>`
    ).join("");
  }

  function massResults() {
    const result = payload.mass_projection_evaluation;
    $("paired-summary").textContent = `${result.segment_better} of ${result.sample_pairs}`;
    $("paired-share").textContent = `${fmt(result.share_segment_better * 100, 2)}%`;
    $("paired-p").textContent = Number(result.binomial_two_sided_p).toExponential(3);
    $("model-medians").innerHTML = Object.entries(result.median).map(([model, value]) =>
      `<div><small>${escapeHtml(model.toUpperCase())}</small><strong>${fmt(value, 8)}</strong></div>`
    ).join("");
    $("mass-bins").innerHTML = result.mass_bins.map(row => `<tr><td>${row.bin}</td><td>${fmt(row.lo_log10M, 3)}–${fmt(row.hi_log10M, 3)}</td><td>${row.N}</td><td>${row.med_seg == null ? "—" : fmt(row.med_seg, 7)}</td><td>${row.med_gr == null ? "—" : fmt(row.med_gr, 7)}</td><td>${row.med_grsr == null ? "—" : fmt(row.med_grsr, 7)}</td></tr>`).join("");
  }

  function draw() {
    const canvas = $("evaluation-chart");
    if (!canvas || !payload) return;
    const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.max(rect.width, 320), h = Math.max(rect.height, 420);
    const targetW = Math.round(w * dpr), targetH = Math.round(h * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) { canvas.width = targetW; canvas.height = targetH; }
    const c = canvas.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
    const style = getComputedStyle(document.documentElement);
    const text = style.getPropertyValue("--text").trim(), muted = style.getPropertyValue("--muted").trim();
    const surface = style.getPropertyValue("--surface-2").trim(), gold = style.getPropertyValue("--gold").trim();
    const values = payload.mass_projection_evaluation.median;
    const rows = [["Segmented", values.seg, gold], ["GR", values.gr, "#2563eb"], ["SR", values.sr, "#7c3aed"], ["GR+SR", values.grsr, "#b42318"]];
    const max = Math.max(...rows.map(row => row[1])), left = 130, right = w - 42, top = 55, gap = 78;
    c.font = "700 14px Inter"; c.fillStyle = text; c.textAlign = "left"; c.fillText("Median residual (smaller is better within this pipeline)", 24, 25);
    rows.forEach(([label, value, colour], index) => {
      const y = top + index * gap, width = (right - left) * value / max;
      c.fillStyle = surface; c.fillRect(left, y, right - left, 30);
      c.fillStyle = colour; c.fillRect(left, y, Math.max(width, 2), 30);
      c.fillStyle = text; c.textAlign = "right"; c.fillText(label, left - 14, y + 21);
      c.textAlign = "left"; c.fillText(fmt(value, 8), Math.min(left + width + 9, right - 80), y + 21);
    });
    c.fillStyle = muted; c.font = "12px Inter"; c.fillText("Conditional on the supplied 67-pair sample and residual definition.", 24, h - 25);
  }

  function canvasSurface(id) {
    const canvas = $(id); if (!canvas) return null;
    const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    const w = Math.max(rect.width, 320), h = Math.max(rect.height, 420);
    const targetW = Math.round(w * dpr), targetH = Math.round(h * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) { canvas.width = targetW; canvas.height = targetH; }
    const c = canvas.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
    const style = getComputedStyle(document.documentElement);
    return {c,w,h,text:style.getPropertyValue("--text").trim(),muted:style.getPropertyValue("--muted").trim(),
      line:style.getPropertyValue("--line").trim(),gold:style.getPropertyValue("--gold").trim()};
  }

  function drawConfidenceIntervals() {
    const surface = canvasSurface("evaluation-ci-chart"); if (!surface || !payload) return;
    const {c,w,h,text,muted,line,gold}=surface, med=payload.mass_projection_evaluation.median;
    const ci=payload.mass_projection_evaluation.confidence_intervals;
    const rows=[["SEG",med.seg,ci.seg,gold],["GR",med.gr,ci.gr,"#2563eb"],["SR",med.sr,ci.sr,"#7c3aed"],["GR+SR",med.grsr,ci.grsr,"#b42318"]];
    const values=rows.flatMap(row=>[row[1],...row[2]]).filter(value=>value>0),lo=Math.log10(Math.min(...values))-.2,hi=Math.log10(Math.max(...values))+.2;
    const left=76,right=w-34,top=65,gap=72,x=value=>left+(Math.log10(value)-lo)/(hi-lo)*(right-left);
    c.font="12px Inter";c.textAlign="center";c.fillStyle=muted;
    for(let exponent=Math.ceil(lo);exponent<=Math.floor(hi);exponent++){const px=x(10**exponent);c.strokeStyle=line;c.beginPath();c.moveTo(px,38);c.lineTo(px,h-44);c.stroke();c.fillText(`10^${exponent}`,px,h-20);}
    rows.forEach(([name,value,interval,colour],index)=>{const y=top+index*gap;c.fillStyle=text;c.textAlign="right";c.fillText(name,left-14,y+4);
      c.strokeStyle=colour;c.lineWidth=5;c.beginPath();c.moveTo(x(interval[0]),y);c.lineTo(x(interval[1]),y);c.stroke();
      c.fillStyle=colour;c.beginPath();c.arc(x(value),y,7,0,Math.PI*2);c.fill();});
  }

  function drawMassBins() {
    const surface=canvasSurface("evaluation-bin-chart");if(!surface||!payload)return;
    const {c,w,h,text,muted,line,gold}=surface,bins=payload.mass_projection_evaluation.mass_bins;
    const left=58,right=w-24,top=42,bottom=h-64,slot=(right-left)/bins.length,maxN=Math.max(...bins.map(bin=>bin.N),1);
    const residuals=bins.flatMap(bin=>[bin.med_seg,bin.med_gr]).filter(Number.isFinite),maxResidual=Math.max(...residuals,1);
    bins.forEach((bin,index)=>{const x=left+index*slot+slot*.12,width=slot*.76,height=(bottom-top)*bin.N/maxN;
      c.fillStyle=bin.N<5?"#b42318":gold;c.globalAlpha=.25;c.fillRect(x,bottom-height,width,height);c.globalAlpha=1;
      c.fillStyle=text;c.textAlign="center";c.fillText(`N=${bin.N}`,x+width/2,bottom-height-7);c.fillStyle=muted;c.fillText(String(bin.bin),x+width/2,bottom+20);
      if(Number.isFinite(bin.med_seg)){const y=bottom-(bottom-top)*bin.med_seg/maxResidual;c.fillStyle=gold;c.beginPath();c.arc(x+width*.35,y,5,0,Math.PI*2);c.fill();}
      if(Number.isFinite(bin.med_gr)){const y=bottom-(bottom-top)*bin.med_gr/maxResidual;c.fillStyle="#2563eb";c.beginPath();c.arc(x+width*.65,y,5,0,Math.PI*2);c.fill();}});
    c.strokeStyle=line;c.beginPath();c.moveTo(left,bottom);c.lineTo(right,bottom);c.stroke();c.fillStyle=muted;c.textAlign="center";c.fillText("mass-bin index · bars show N · points show segmented (gold) and GR (blue) median",w/2,h-18);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("data/evaluations.json");
    if (!response.ok) throw new Error(`evaluations.json: ${response.status}`);
    payload = await response.json();
    $("current-passed").textContent = payload.current_snapshot.passed.toLocaleString("en-US");
    $("current-repos").textContent = payload.current_snapshot.repositories;
    $("current-failed").textContent = payload.current_snapshot.failed;
    repositoryTable(); historicalTable(); executionTable(); massResults(); draw(); drawConfidenceIntervals(); drawMassBins();
    const redraw=()=>{draw();drawConfidenceIntervals();drawMassBins();};
    addEventListener("resize", redraw); addEventListener("ssz-theme-change", redraw);
  });
})();
