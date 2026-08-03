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

  function drawRankedBars(id, rows, title) {
    const surface=canvasSurface(id);if(!surface||!payload)return;
    const {c,w,h,text,muted,line,gold}=surface,shown=rows.slice(0,9),max=Math.max(...shown.map(row=>row.count),1);
    const left=Math.min(205,w*.42),right=w-32,top=46,gap=Math.min(39,(h-76)/shown.length);
    c.fillStyle=text;c.font="700 13px Inter";c.textAlign="left";c.fillText(title,20,22);
    shown.forEach((row,index)=>{const y=top+index*gap,width=(right-left)*row.count/max;
      c.fillStyle=line;c.fillRect(left,y-12,right-left,20);c.fillStyle=index===0?gold:"#2563eb";c.fillRect(left,y-12,width,20);
      c.fillStyle=text;c.textAlign="right";c.fillText(row.name.length>27?`${row.name.slice(0,25)}…`:row.name,left-10,y+3);
      c.textAlign="left";c.fillText(row.count.toLocaleString("en-US"),Math.min(left+width+7,right-42),y+3);});
    c.fillStyle=muted;c.font="11px Inter";c.textAlign="left";c.fillText("Catalogue rows · discovery coverage, not pass outcomes",20,h-18);
  }

  function artifactCoverage() {
    const data=payload.artifact_catalogue,total=data.count;
    $("artifact-repositories").innerHTML=data.repositories.slice(0,20).map(row=>`<tr><td><a href="https://github.com/error-wtf/${encodeURIComponent(row.name)}" target="_blank" rel="noopener">${escapeHtml(row.name)}</a></td><td>${row.count.toLocaleString("en-US")}</td><td>${fmt(100*row.count/total,2)}%</td></tr>`).join("");
    drawRankedBars("artifact-category-chart",data.categories,"Test-category classification");
    drawRankedBars("artifact-quantity-chart",data.quantities,"Scientific-quantity classification");
  }

  function auditTrail() {
    const audit=payload.audit_snapshot;
    $("audit-detected").textContent=audit.detected.toLocaleString("en-US");
    $("audit-mapped").textContent=audit.mapped.toLocaleString("en-US");
    $("audit-executed").textContent=audit.executed.toLocaleString("en-US");
    $("audit-minimum").textContent=audit.expected_minimum.toLocaleString("en-US");
    $("audit-failures").innerHTML=audit.failures.map(row=>{const file=row.test.split("::")[0];return `<div><span class="badge corrected">${escapeHtml(row.repository)}</span><p><a href="https://github.com/error-wtf/${encodeURIComponent(row.repository)}/blob/main/${file.split("/").map(encodeURIComponent).join("/")}" target="_blank" rel="noopener"><code>${escapeHtml(row.test)}</code></a><br><small>${escapeHtml(row.classification)} · ${escapeHtml(row.status)}</small></p></div>`;}).join("");
    $("audit-timeouts").innerHTML=audit.timeouts.map(row=>`<div><span class="badge open">${escapeHtml(row.repository)}</span><p><strong>${fmt(row.duration_seconds,2)} s</strong> · exit ${row.exit_code}<br><small>${escapeHtml(row.interpretation)}</small></p></div>`).join("")||"<p>No recorded timeout.</p>";
  }

  function drawSnapshots() {
    const surface=canvasSurface("snapshot-chart");if(!surface||!payload)return;
    const {c,w,h,text,muted,line,gold}=surface;
    const historical=payload.historical_snapshot.repositories.reduce((sum,row)=>({passed:sum.passed+row.passed,failed:sum.failed+row.failed}),{passed:0,failed:0});
    const rows=[
      {label:"28 Apr conflict",passed:historical.passed,failed:historical.failed,colour:"#b42318",unit:"legacy counters"},
      {label:"29 Apr audit",passed:payload.audit_snapshot.executed-payload.audit_snapshot.failures.length,failed:payload.audit_snapshot.failures.length,colour:"#7c3aed",unit:"executed outcomes"},
      {label:"4–5 May capture",passed:payload.current_snapshot.passed,failed:payload.current_snapshot.failed,colour:gold,unit:"repository outcomes"}
    ],max=Math.max(...rows.map(row=>row.passed+row.failed),1),left=64,right=w-24,top=46,bottom=h-72,slot=(right-left)/rows.length,chartHeight=bottom-top;
    c.strokeStyle=line;c.beginPath();c.moveTo(left,bottom);c.lineTo(right,bottom);c.stroke();
    rows.forEach((row,index)=>{const x=left+index*slot+slot*.22,width=slot*.56,passHeight=chartHeight*row.passed/max,failHeight=chartHeight*row.failed/max;
      c.fillStyle=row.colour;c.globalAlpha=.8;c.fillRect(x,bottom-passHeight,width,passHeight);c.globalAlpha=1;
      if(failHeight){c.fillStyle="#b42318";c.fillRect(x,bottom-passHeight-failHeight,width,Math.max(failHeight,3));}
      c.fillStyle=text;c.font="700 12px Inter";c.textAlign="center";c.fillText(row.passed.toLocaleString("en-US"),x+width/2,bottom-passHeight-10);
      c.fillStyle=muted;c.font="11px Inter";c.fillText(row.label,x+width/2,bottom+20);c.fillText(row.unit,x+width/2,bottom+37);});
    c.fillStyle=muted;c.textAlign="left";c.fillText("Heights aid chronology only; unlike counting units must not be summed.",18,h-16);
  }

  function numericDiagnostics() {
    $("numeric-diagnostics").innerHTML=payload.numeric_diagnostics.map(row=>{const sourceUrl=`https://github.com/error-wtf/${encodeURIComponent(row.repository)}/blob/main/${row.source.split("/").map(encodeURIComponent).join("/")}`;return `<tr><td><strong>${escapeHtml(row.name)}</strong></td><td>${escapeHtml(row.value_label)}</td><td>${escapeHtml(row.tolerance_label)}</td><td><a href="https://github.com/error-wtf/${encodeURIComponent(row.repository)}" target="_blank" rel="noopener">${escapeHtml(row.repository)}</a><br><a href="${sourceUrl}" target="_blank" rel="noopener"><code>${escapeHtml(row.source)}</code></a></td><td>${escapeHtml(row.meaning)}</td><td>${escapeHtml(row.boundary)}</td></tr>`;}).join("");
  }

  function drawDiagnostics() {
    const surface=canvasSurface("diagnostic-chart");if(!surface||!payload)return;
    const {c,w,h,text,muted,line,gold}=surface,rows=payload.numeric_diagnostics,left=Math.min(230,w*.5),right=w-30,top=55,gap=Math.min(68,(h-88)/rows.length);
    c.fillStyle=text;c.font="700 13px Inter";c.textAlign="left";c.fillText("Observed value ÷ encoded tolerance",20,24);
    rows.forEach((row,index)=>{const ratio=row.value/row.tolerance,y=top+index*gap,width=(right-left)*Math.min(ratio,1);
      c.fillStyle=line;c.fillRect(left,y-13,right-left,24);c.fillStyle=ratio>.8?"#b42318":ratio>.4?"#7c3aed":gold;c.fillRect(left,y-13,Math.max(width,2),24);
      c.fillStyle=text;c.textAlign="right";c.fillText(row.name.length>30?`${row.name.slice(0,28)}…`:row.name,left-10,y+4);c.textAlign="left";c.fillText(`${fmt(ratio*100,4)}%`,Math.min(left+width+8,right-58),y+4);});
    c.fillStyle=muted;c.font="11px Inter";c.textAlign="left";c.fillText("100% is the encoded acceptance boundary.",20,h-18);
  }

  function claimMatrix() {
    const rows=payload.claim_evidence_matrix,counts=rows.reduce((result,row)=>{result[row.status]=(result[row.status]||0)+1;return result;},{});
    $("claims-tested").textContent=counts.tested||0;$("claims-conditional").textContent=counts.conditional||0;
    $("claims-corrected").textContent=counts.corrected||0;$("claims-open").textContent=counts.open||0;
    const badge={tested:"tested",conditional:"open",corrected:"corrected",open:"open"};
    $("claim-matrix").innerHTML=rows.map(row=>`<tr><td><strong>${escapeHtml(row.claim)}</strong></td><td>${escapeHtml(row.class)}</td><td><span class="badge ${badge[row.status]||"open"}">${escapeHtml(row.status)}</span></td><td>${escapeHtml(row.support)}</td><td>${escapeHtml(row.does_not_establish)}</td></tr>`).join("");
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("data/evaluations.json");
    if (!response.ok) throw new Error(`evaluations.json: ${response.status}`);
    payload = await response.json();
    $("current-passed").textContent = payload.current_snapshot.passed.toLocaleString("en-US");
    $("current-repos").textContent = payload.current_snapshot.repositories;
    $("current-failed").textContent = payload.current_snapshot.failed;
    repositoryTable(); historicalTable(); executionTable(); massResults(); artifactCoverage(); auditTrail(); numericDiagnostics(); claimMatrix();
    draw(); drawConfidenceIntervals(); drawMassBins(); drawSnapshots(); drawDiagnostics();
    const redraw=()=>{draw();drawConfidenceIntervals();drawMassBins();artifactCoverage();drawSnapshots();drawDiagnostics();};
    addEventListener("resize", redraw); addEventListener("ssz-theme-change", redraw);
  });
})();
