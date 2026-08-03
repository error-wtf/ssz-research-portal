(() => {
  "use strict";
  const $=id=>document.getElementById(id), esc=v=>String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  let payload;
  function points(){return payload.sensitivity.variants.filter(v=>v.photon_candidate).map(v=>({x0:+v.x0,x1:+v.x1,e:+v.epsilon,x:+v.photon_candidate.x,b:+v.photon_candidate.critical_impact_proxy}));}
  function draw(){
    const canvas=$("certificate-chart"), rect=canvas.getBoundingClientRect(), d=Math.min(devicePixelRatio||1,2), w=Math.max(rect.width,320),h=420;
    canvas.width=w*d;canvas.height=h*d;const c=canvas.getContext("2d");c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);
    const rows=points(), key=$("certificate-metric").value==="impact"?"b":"x", values=rows.map(r=>r[key]), lo=Math.min(...values),hi=Math.max(...values),pad=(hi-lo||1)*.12;
    const css=getComputedStyle(document.documentElement), text=css.getPropertyValue("--text"),muted=css.getPropertyValue("--muted"),line=css.getPropertyValue("--line"),gold=css.getPropertyValue("--gold");
    c.strokeStyle=line;c.beginPath();c.moveTo(55,25);c.lineTo(55,h-50);c.lineTo(w-20,h-50);c.stroke();c.font="12px system-ui";c.fillStyle=muted;c.fillText(key==="b"?"critical-impact proxy / r_s":"stationary radius r/r_s",60,18);
    rows.forEach((r,i)=>{const x=65+i*(w-100)/Math.max(rows.length-1,1),y=25+(hi+pad-r[key])*(h-85)/(hi-lo+2*pad);c.fillStyle=r.e<0?"#2563eb":r.e>0?"#b42318":gold;c.beginPath();c.arc(x,y,5,0,Math.PI*2);c.fill();});
    c.fillStyle=text;c.textAlign="center";c.fillText("27 structured C² bridge variants (blue ε<0 · gold ε=0 · red ε>0)",w/2,h-18);
    $("certificate-description").textContent=payload.sensitivity.interpretation+` Displayed range: ${lo.toPrecision(10)}–${hi.toPrecision(10)}.`;
  }
  function csv(){const rows=points(),lines=["x0,x1,epsilon,stationary_radius,critical_impact_proxy",...rows.map(r=>[r.x0,r.x1,r.e,r.x,r.b].join(","))];const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/csv"}));a.download="ssz-blend-sensitivity.csv";a.click();URL.revokeObjectURL(a.href);}
  document.addEventListener("DOMContentLoaded",async()=>{
    const response=await fetch("data/strong-field-certificates.json");if(!response.ok)return;payload=await response.json();const canonical=payload.canonical.photon_candidate;
    $("certificate-x").textContent=(+canonical.x).toFixed(9);$("certificate-b").textContent=(+canonical.critical_impact_proxy).toFixed(9);$("certificate-residual").textContent=canonical.derivative_residual;
    $("certificate-table").innerHTML=points().map(r=>`<tr><td>${r.x0}</td><td>${r.x1}</td><td>${r.e}</td><td>${r.x.toPrecision(12)}</td><td>${r.b.toPrecision(12)}</td></tr>`).join("");
    $("certificate-method").innerHTML=`<p><strong>Metric:</strong> ${esc(payload.metric)}</p><p><strong>Bridge:</strong> ${esc(payload.canonical_bridge)} · <strong>precision:</strong> ${payload.precision_decimal_digits} decimal digits.</p><p><strong>Methods:</strong> ${canonical.methods.map(esc).join("; ")}.</p><p><strong>Code:</strong> <code>${esc(payload.provenance.code_path)}</code> · <strong>commit:</strong> <code>${esc(payload.provenance.commit_sha)}</code></p><ul>${payload.limitations.map(v=>`<li>${esc(v)}</li>`).join("")}</ul>`;
    $("certificate-metric").addEventListener("change",draw);$("certificate-csv").addEventListener("click",csv);addEventListener("resize",draw);addEventListener("ssz-theme-change",draw);draw();
  });
})();
