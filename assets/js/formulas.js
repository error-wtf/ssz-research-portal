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
      <div class="math-box rendered-math" data-label="${esc(item.id)}" aria-label="${esc(item.name)}">\\[${esc(item.latex)}\\]</div>
      <dl class="formula-meta"><dt>Units</dt><dd>${esc(item.units)}</dd><dt>Domain</dt><dd>${esc(item.domain)}</dd><dt>Guardrail</dt><dd>${esc(item.caution)}</dd></dl>
      <details class="formula-explanation formula-explainer" data-explanation-owner="formula">
        <summary><span>Explain this formula</span><strong>${esc(item.name)}</strong></summary>
        <div class="explainer-body">
          <section><h4>Purpose</h4><p>This reviewed catalogue entry defines or records <strong>${esc(item.name)}</strong> in the ${esc(item.topic)} branch. It is the quantitative object named by the surrounding section, not an unsupported conclusion.</p></section>
          <section><h4>How to read it</h4><p>Read the equality from left to right: evaluate the declared inputs first, preserve the displayed normalization, and check that every term uses the stated units. The source form is available through <em>Copy source</em>.</p></section>
          <section><h4>Domain and meaning</h4><p>The declared domain is <strong>${esc(item.domain)}</strong>. Units are <strong>${esc(item.units)}</strong>. Within that domain the relation provides the named geometric, kinematic, observational or validation quantity; outside it no extension is implied.</p></section>
          <section><h4>Guardrail and verification</h4><p>${esc(item.caution)} The entry is reviewed for notation, dimensions, limits and regression consistency. Those checks establish the stated relation under its assumptions; they do not turn a model formula into an independent empirical law.</p></section>
        </div>
      </details>
    </article>`).join("");
    window.MathJax?.typesetPromise?.([document.getElementById("formula-catalog")]);
    document.querySelectorAll(".formula-copy").forEach(button=>button.addEventListener("click",async()=>{
      try {
        await navigator.clipboard.writeText(button.dataset.formula);
      } catch {
        const area=document.createElement("textarea");area.value=button.dataset.formula;document.body.append(area);area.select();document.execCommand("copy");area.remove();
      }
      button.textContent="Copied";setTimeout(()=>button.textContent="Copy source",1000);
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
