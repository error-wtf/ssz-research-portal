(() => {
  "use strict";
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[char]);
  let formulas = [];
  function render() {
    const query=document.getElementById("formula-catalog-search").value.trim().toLowerCase();
    const topic=document.getElementById("formula-topic").value;
    const shown=formulas.filter(item=>(!topic||item.topic===topic)&&(!query||Object.values(item).join(" ").toLowerCase().includes(query)));
    document.getElementById("formula-count").textContent=`${shown.length} of ${formulas.length} reviewed equations shown.`;
    document.getElementById("formula-catalog").innerHTML=shown.map(item=>`<article class="formula-entry" data-searchable>
      <div class="formula-entry-head"><div><span class="badge canonical">${esc(item.topic)}</span><h3>${esc(item.name)}</h3></div><button class="nav-button formula-copy" data-formula="${esc(item.latex)}">Copy source</button></div>
      <div class="formula rendered-math" aria-label="${esc(item.name)}">\\(${esc(item.latex)}\\)</div>
      <dl class="formula-meta"><dt>Units</dt><dd>${esc(item.units)}</dd><dt>Domain</dt><dd>${esc(item.domain)}</dd><dt>Guardrail</dt><dd>${esc(item.caution)}</dd></dl>
    </article>`).join("");
    window.MathJax?.typesetPromise?.([document.getElementById("formula-catalog")]);
    document.querySelectorAll(".formula-copy").forEach(button=>button.addEventListener("click",async()=>{
      await navigator.clipboard.writeText(button.dataset.formula);button.textContent="Copied";setTimeout(()=>button.textContent="Copy source",1000);
    }));
  }
  document.addEventListener("DOMContentLoaded",async()=>{
    try {
      const response=await fetch("data/formulas.json");const data=await response.json();formulas=data.formulas;
      [...new Set(formulas.map(item=>item.topic))].sort().forEach(value=>document.getElementById("formula-topic").insertAdjacentHTML("beforeend",`<option>${esc(value)}</option>`));
      ["formula-catalog-search","formula-topic"].forEach(id=>document.getElementById(id).addEventListener("input",render));render();
    } catch(error) { document.getElementById("formula-count").textContent=`Formula catalogue unavailable: ${error.message}`; }
  });
})();
