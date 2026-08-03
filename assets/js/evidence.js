(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  const escape=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  let ledger,formulae=new Map(),filtered=[],nodes=[];
  const badge=status=>status==="corrected"?"corrected":status==="open"||status==="conditional"?"open":status==="canonical"?"canonical":"tested";
  const list=items=>items?.length?`<ul>${items.map(item=>`<li>${escape(typeof item==="string"?item:JSON.stringify(item))}</li>`).join("")}</ul>`:"<p>None declared.</p>";
  const formulaAliases={"SSZ-FORM-XI-STRONG":"xi-strong","SSZ-FORM-BLEND-H5":"blend","SSZ-FORM-XI-WEAK":"xi-weak","SSZ-FORM-D":"d","SSZ-FORM-METRIC":"metric","SSZ-FORM-CENTRE-A":"centre-a","SSZ-FORM-CENTRE-R":"ricci","SSZ-FORM-CENTRE-K":"kretschmann","SSZ-FORM-NULL-POTENTIAL":"null-potential","SSZ-FORM-L2":"angular-momentum"};
  const formulaCards=item=>item.formula_ids.length?item.formula_ids.map(id=>{const f=formulae.get(formulaAliases[id]||id);return f?`<div class="math-box rendered-math" data-label="${escape(id)}" aria-label="${escape(f.name)}">\\[${escape(f.latex)}\\]</div><p><small>${escape(f.name)} · ${escape(f.units)} · ${escape(f.domain)}</small></p>`:`<p><code>${escape(id)}</code> — formula record not resolved.</p>`}).join(""):"<p>No formula is required for this scope or catalogue claim.</p>";
  function render(){
    const query=$("claim-search").value.toLowerCase(),status=$("claim-status").value,kind=$("claim-class").value;
    filtered=ledger.claims.filter(item=>(!status||item.status===status)&&(!kind||item.evidence_class===kind)&&(!query||JSON.stringify(item).toLowerCase().includes(query)));
    $("claim-count").textContent=filtered.length;
    $("claim-list").innerHTML=filtered.map(item=>`<article class="claim-card" id="${escape(item.id)}"><header><div><span class="badge ${badge(item.status)}">${escape(item.status)}</span><small>${escape(item.evidence_class)}</small><h3><a href="#${escape(item.id)}">${escape(item.title)}</a></h3><code>${escape(item.id)}</code></div><strong>${escape(item.canonical_version)}</strong></header><p class="claim-statement">${escape(item.statement)}</p><details><summary>Evidence chain and audit record</summary><div class="claim-detail-grid"><section><h4>Scope and assumptions</h4><p><strong>Domain:</strong> ${escape(item.domain)}</p><p><strong>Observer/coordinates:</strong> ${escape(item.observer_coordinate_scope)}</p>${list(item.mathematical_assumptions)}</section><section><h4>Formula and implementation</h4>${formulaCards(item)}<p><strong>Formula IDs:</strong> ${escape(item.formula_ids.join(", ")||"None")}</p><p><strong>Repository:</strong> ${escape(item.repository)}</p><p><strong>Path/symbol:</strong> <code>${escape(item.repository_path)}${item.code_symbol?`::${escape(item.code_symbol)}`:""}</code></p><p><strong>Commit:</strong> <code>${escape(item.commit_sha)}</code></p></section><section><h4>Source provenance</h4><p>${escape(item.source_document)} · ${escape(item.source_section)}</p><p><strong>Source-ID:</strong> ${escape(item.source_id)}</p><p><strong>SHA-256:</strong> <code class="hash">${escape(item.source_sha256)}</code></p><p><strong>Reviewed:</strong> ${escape(item.last_reviewed)}</p></section><section><h4>Test and result</h4><p><strong>Test-ID:</strong> ${escape(item.test_id)}</p><pre>${escape(item.reproduction_command)}</pre><p><strong>Result:</strong> ${escape(item.numerical_result)}</p><p><strong>Uncertainty:</strong> ${escape(item.uncertainty)}</p></section><section><h4>Does not prove</h4>${list(item.does_not_prove)}<h4>Known conflicts</h4>${list(item.conflicts)}</section><section><h4>Falsification condition</h4><p>${escape(item.falsification_criterion)}</p><h4>Dependencies</h4>${list(item.dependencies)}</section></div></details></article>`).join("")||"<p>No claims match these filters.</p>";
    window.MathJax?.typesetPromise?.([$("claim-list")]);
    drawGraph();
  }
  function surface(canvas){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),w=Math.max(r.width,320),h=Math.max(r.height,520);canvas.width=w*d;canvas.height=h*d;const c=canvas.getContext("2d");c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);const s=getComputedStyle(document.documentElement);return{c,w,h,text:s.getPropertyValue("--text").trim(),muted:s.getPropertyValue("--muted").trim(),line:s.getPropertyValue("--line").trim(),gold:s.getPropertyValue("--gold").trim()};}
  function drawGraph(){
    const canvas=$("claim-graph");if(!canvas||!ledger)return;const {c,w,h,text,muted,line,gold}=surface(canvas),claims=ledger.claims;
    const cx=w/2,cy=h/2,r=Math.min(w,h)*.37;nodes=claims.map((item,index)=>({...item,x:cx+r*Math.cos(2*Math.PI*index/claims.length-Math.PI/2),y:cy+r*Math.sin(2*Math.PI*index/claims.length-Math.PI/2)}));
    const byId=Object.fromEntries(nodes.map(node=>[node.id,node]));c.strokeStyle=line;c.lineWidth=1.5;
    nodes.forEach(node=>node.dependencies.forEach(id=>{const target=byId[id];if(!target)return;c.beginPath();c.moveTo(node.x,node.y);c.lineTo(target.x,target.y);c.stroke();}));
    nodes.forEach(node=>{c.fillStyle=node.status==="corrected"?"#b42318":node.status==="open"?"#7c3aed":node.status==="conditional"?"#2563eb":gold;c.beginPath();c.arc(node.x,node.y,13,0,Math.PI*2);c.fill();c.fillStyle=text;c.font="700 10px Inter, sans-serif";c.textAlign="center";c.fillText(node.id.replace("SSZ-CLAIM-","").replace("-001",""),node.x,node.y+28);});
    c.fillStyle=muted;c.font="12px Inter, sans-serif";c.fillText("Select a node · lines point to prerequisites",cx,h-16);
  }
  document.addEventListener("DOMContentLoaded",async()=>{
    const [response,formulaResponse]=await Promise.all([fetch("data/evidence-ledger.json"),fetch("data/formulas.json")]);if(!response.ok)throw new Error(`ledger ${response.status}`);if(!formulaResponse.ok)throw new Error(`formulas ${formulaResponse.status}`);ledger=await response.json();const formulaData=await formulaResponse.json();formulae=new Map(formulaData.formulas.map(item=>[item.id,item]));
    [...new Set(ledger.claims.map(item=>item.status))].sort().forEach(value=>$("claim-status").insertAdjacentHTML("beforeend",`<option>${escape(value)}</option>`));
    ledger.evidence_classes.forEach(value=>$("claim-class").insertAdjacentHTML("beforeend",`<option>${escape(value)}</option>`));
    $("evidence-classes").innerHTML=ledger.evidence_classes.map(value=>`<article class="card"><h3>${escape(value)}</h3><p>Use this label only when the claim record contains the corresponding derivation, execution or data provenance.</p></article>`).join("");
    ["claim-search","claim-status","claim-class"].forEach(id=>$(id).addEventListener(id==="claim-search"?"input":"change",render));
    $("claim-graph").addEventListener("click",event=>{const rect=event.currentTarget.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top,node=nodes.find(item=>Math.hypot(item.x-x,item.y-y)<20);if(node){location.hash=node.id;$("graph-description").textContent=`${node.id}: ${node.statement}`;}});
    addEventListener("resize",drawGraph);addEventListener("ssz-theme-change",drawGraph);render();
  });
})();
