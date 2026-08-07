(() => {
  "use strict";
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[char]);
  function explanationFor(item) {
    const text = (item.name + " " + item.latex + " " + item.topic).toLowerCase();
    const rule = window.SSZExplainers?.ruleForFormula?.(item.latex, item.name) || {};
    const family = [
      [/strong|inner|horizon segment/, "The normalized radius and P0 strong-branch lock determine this expression before the bridge.", "Check r=rₛ and the formal r→0 limit; apply it only on x<1.8.", "A finite horizon coefficient is not a centre-regularity or collapse theorem.", "Read with Xi, D, the Schwarzschild scale and the C² bridge."],
      [/weak|asymptotic|potential|ppn/, "This relation follows from the declared outer branch and its weak-potential expansion.", "Check x>2.2 and the U→0 or r→∞ limit, including the first neglected order.", "Weak-field agreement is compatibility, not discrimination or proof.", "Read with D, A, B and the weak-field observable ledger."],
      [/bridge|hermite|blend|endpoint/, "The bridge depends on strong/weak endpoint values, slopes and curvatures with t=(x−1.8)/0.4.", "Verify value, first derivative and second derivative at both endpoints; inspect the interior separately.", "A generic smoothstep is not equivalent to the P0 quintic.", "Read with both analytic branches and derivative-matching tests."],
      [/curvature|ricci|kretschmann|invariant/, "The quantity is derived from the metric, connection and stated contraction convention.", "State r→0, r→rₛ or r→∞ and distinguish invariant contractions from coordinate coefficients.", "Finite metric coefficients do not imply finite curvature; a current divergence does not exclude every future completion.", "Read with Christoffel, Riemann/Ricci definitions and the P0 interior note."],
      [/jif|phase|frequency|cycle/, "The phase ledger uses dJ=dPhi/(2π) and assigns terms to the massive proper-time or detector route.", "Check zero height, zero frequency difference and the weak-field limit while retaining the reference.", "JIF is not absolute time, a force, photon proper time or proof of SSZ.", "Read with proper time, detector phase, Sagnac and Poincare–Cartan bookkeeping."],
      [/sagnac|rotation|counter|odd/, "Directed paths, orientation, loop area and detector proper-time conversion determine the displayed difference.", "Check Ω→0, reversed orientation and the declared small-rotation approximation.", "A timing recurrence is not a rotating SSZ solution or experiment.", "Read with the detector phase ledger and recursive closure."],
      [/residual|chi|likelihood|uncertainty|statistic|binomial|sign test/, "The statistic depends on the sample, uncertainty/covariance model and forward-model residual.", "Check the denominator, zero-residual limit, sample-size effect and row dependence.", "A small residual or passing test is not an independent observation.", "Read with evidence class, provenance and reproducibility."],
      [/geodesic|orbit|energy|potential|stability|impact|photon|angular momentum/, "The metric Lagrangian, symmetry constants and initial conditions produce this trajectory or potential relation.", "Check null/timelike choice, circular derivative conditions and numerical convergence.", "A proxy orbit is not automatically an astrophysical observation or stability theorem.", "Read with the line element, constants and residual checks."],
      [/metric|clock|redshift|proper time|radial|tetrad|frame/, "The relation inserts the D-derived coefficients into the static line element for a specified observer family.", "State the branch, static assumption and weak-field or horizon limit; add motion separately.", "Coordinate coefficients and static ratios are not universal observables without a measurement protocol.", "Read with Xi, D, A, B and the observer definition."]
    ].find(([pattern]) => pattern.test(text)) || [/.*/, "This relation belongs to the declared " + item.topic + " family and depends on the canonical definitions surrounding it.", "Use the stated units and domain, evaluate inputs first, and test at least one declared limit.", "The conclusion is limited to the encoded assumptions and does not become an empirical claim by computation alone.", "Follow the neighbouring definitions and evidence ledger."];
    return {
      purpose: rule.purpose || "This " + item.topic + " relation defines or derives the named quantity within the current canonical model.",
      reading: rule.reading || "Read every symbol with the units and domain shown in this card, evaluate declared inputs first, and preserve the normalization.",
      meaning: rule.meaning || "The equation makes the " + item.topic + " statement quantitatively inspectable.",
      limit: rule.limit || "The conclusion is limited to the displayed branch, approximation and observer or data convention.",
      dependency: family[1], limits: family[2], misreading: family[3], related: family[4]
    };
  }
  let formulas = [];
  function render() {
    const query=document.getElementById("formula-catalog-search").value.trim().toLowerCase();
    const topic=document.getElementById("formula-topic").value;
    const shown=formulas.filter(item=>(!topic||item.topic===topic)&&(!query||Object.values(item).join(" ").toLowerCase().includes(query)));
    document.getElementById("formula-count").textContent=`${shown.length} of ${formulas.length} reviewed equations shown.`;
    document.getElementById("formula-catalog").innerHTML=shown.map(item=>{ const ex=explanationFor(item); const verification=window.SSZExplainers?.verificationFor?.(item.latex,item.name,"formulas.html") || "Verification is reported by repository tests and the evidence ledger; it is not automatically an independent experiment."; return `<article class="formula-entry" data-searchable>
      <div class="formula-entry-head"><div><span class="badge canonical">${esc(item.topic)}</span><h3>${esc(item.name)}</h3></div><button class="nav-button formula-copy" data-formula="${esc(item.latex)}">Copy source</button></div>
      <div class="math-box rendered-math" data-label="${esc(item.id)}" aria-label="${esc(item.name)}">\\[${esc(item.latex)}\\]</div>
      <dl class="formula-meta"><dt>Units</dt><dd>${esc(item.units)}</dd><dt>Domain</dt><dd>${esc(item.domain)}</dd><dt>Guardrail</dt><dd>${esc(item.caution)}</dd></dl>
      <details class="formula-explanation formula-explainer" data-explanation-owner="formula">
        <summary><span>Explain this formula</span><strong>${esc(item.name)}</strong></summary>
        <div class="explainer-body">
          <section><h4>Purpose</h4><p>${esc(ex.purpose)}</p></section>
          <section><h4>How to read it</h4><p>${esc(ex.reading)} The source form is available through <em>Copy source</em>.</p></section>
          <section><h4>Derivation and dependencies</h4><p>${esc(ex.dependency)}</p></section>
          <section><h4>Meaning and domain</h4><p>${esc(ex.meaning)} Domain: <strong>${esc(item.domain)}</strong>; units: <strong>${esc(item.units)}</strong>.</p></section>
          <section><h4>Limits and scope</h4><p>${esc(ex.limits)} ${esc(ex.limit)}</p></section>
          <section><h4>Verification and guardrail</h4><p>${esc(verification)} ${esc(item.caution)} ${esc(ex.misreading)}</p></section>
          <section><h4>Related formulas</h4><p>${esc(ex.related)}</p></section>
        </div>
      </details>
    </article>`; }).join("");
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
