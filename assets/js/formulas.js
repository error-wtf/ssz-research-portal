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
    const special = {
      rs: {
        purpose: "The Schwarzschild length rₛ=2GM/c² is the dimensional reference scale used to normalize every radial branch. It converts a mass parameter into a length; it does not, by itself, assert that the effective SSZ metric is the Schwarzschild solution.",
        reading: "Insert M in the chosen unit system, use the declared constants G and c, and check that the result has units of length. All subsequent branch statements use x=r/rₛ, so changing M rescales the physical radius without changing a dimensionless profile.",
        dependency: "This definition precedes x, the strong/bridge/weak routing, and every D-, metric-, curvature- or observable formula that uses rₛ.",
        meaning: "A larger central mass produces a proportionally larger normalization length. The equation is a scale convention and a dimensional consistency check, not a horizon theorem.",
        limits: "It applies for M>0 and in the declared static normalization. Negative, time-dependent or extended mass distributions require a different scale definition."
      },
      x: {
        purpose: "The normalized radius x=r/rₛ removes the mass scale from the branch-selection problem. It is the coordinate on which the P0 thresholds x<1.8, 1.8≤x≤2.2 and x>2.2 are stated.",
        reading: "Compute rₛ first, divide the areal radius r by it, and retain the resulting dimensionless value. Do not substitute the physical radius directly into a branch formula written in x.",
        dependency: "x depends on rₛ and is consumed by the strong exponential, the blend coordinate t, and the weak inverse-radius branch.",
        meaning: "Equal x means equal position on the dimensionless profile even for different masses. Physical distances still differ because r=xrₛ.",
        limits: "The normalization assumes rₛ>0 and an areal radius. It does not remove coordinate, curvature or model-domain limitations."
      },
      "xi-strong": {
        purpose: "The strong branch defines the canonical inner SSZ field Xi_s(x)=1−exp(−φ/x) on the explicitly declared interval 0<x<1.8. Its value is then fed into D=(1+Xi)⁻¹ and the radial reciprocal scale.",
        reading: "Evaluate φ, form φ/x, apply the negative exponential, and subtract from one. Check the r=rₛ checkpoint and the formal x→0⁺ limit separately; do not use this expression in the bridge or weak interval.",
        dependency: "It depends on the normalized radius x and declared golden-ratio parameter φ; it supplies endpoint data to the quintic bridge and feeds the metric factors.",
        meaning: "The branch rises toward its declared inner saturation as x decreases and is finite at x=1. A finite field value is a property of this definition, not a proof that all curvature invariants remain finite.",
        limits: "The formula is only the inner branch. It does not establish a horizon, source action, global solution or centre regularity."
      },
      "xi-weak": {
        purpose: "The weak branch Xi_w(x)=1/(2x)=rₛ/(2r)=GM/(rc²) supplies the canonical outer asymptotic profile for x>2.2. The equality to GM/(rc²) follows algebraically from rₛ=2GM/c².",
        reading: "Compute x and divide one by 2x, or use the equivalent dimensional form. Check that Xi→0 as x→∞ and retain only the declared leading order when comparing with weak-field observables.",
        dependency: "It depends on x and rₛ, supplies the outer endpoint data for the C² bridge, and determines D and the asymptotic metric coefficients.",
        meaning: "The field decays inversely with radius, so D approaches one and the static geometry approaches its declared asymptotic normalization.",
        limits: "This is a leading outer branch, not a complete post-Newtonian expansion, global field equation or empirical fit by itself."
      },
      "blend-t": {
        purpose: "The blend coordinate t=(x−1.8)/0.4 maps the physical transition interval [1.8,2.2] exactly to the unit interval [0,1]. It is a bookkeeping change of variable, not an additional physical field.",
        reading: "Subtract the lower join, divide by the interval width h=0.4, and verify t=0 at x=1.8 and t=1 at x=2.2. Use the same coordinate when differentiating the bridge and converting endpoint slopes.",
        dependency: "It depends on the two declared join locations and is consumed by every quintic Hermite basis function.",
        meaning: "The map makes the six endpoint constraints numerically well-defined and allows the bridge polynomial to be evaluated on a fixed compact interval.",
        limits: "Changing the join locations changes the model. The coordinate map itself does not prove that the chosen interval is physically selected."
      },
      blend: {
        purpose: "The quintic Hermite bridge is the unique degree-five polynomial carrying six supplied endpoint data: value, first derivative and second derivative at both joins. It connects the canonical strong and weak branches without inserting a copied cubic smoothstep.",
        reading: "Evaluate the six coefficients or Hermite basis functions at t∈[0,1], then convert derivatives consistently between t and x. Inspect the interior as well as all six endpoint equalities.",
        dependency: "It consumes strong/weak values, slopes, curvatures and the blend coordinate; it supplies the piecewise Xi field used by D and the metric.",
        meaning: "C² matching removes jumps through second order at both joins. It does not make the interior behaviour independent of the chosen endpoint data or interval.",
        limits: "The bridge is an operational matching prescription. Higher derivatives and bridge-sensitive observables remain model-dependent unless separately constrained."
      },
      "blend-conditions": {
        purpose: "These six conditions explicitly state what C² means for the bridge: equality of Xi, Xi′ and Xi″ with the adjacent branch at x=1.8 and x=2.2.",
        reading: "Use k=0 for values, k=1 for first derivatives and k=2 for second derivatives, all with respect to the same normalized coordinate x. Check both endpoints independently.",
        dependency: "The conditions determine the six coefficients of the quintic and are tested against the analytic strong and weak derivatives.",
        meaning: "The piecewise field and its first two derivatives join continuously, preventing artificial kinks in downstream metric derivatives.",
        limits: "C² continuity is not C³ continuity and is not a derivation from a fundamental action. It also does not guarantee finite curvature at every other boundary."
      },
      d: {
        purpose: "D(r)=1/[1+Xi(r)] is the canonical dimensionless clock factor derived from the selected segment field. It is inserted into the static line element and into specified observer timing relations.",
        reading: "Evaluate the correctly routed Xi first, add one, and invert. Check positivity, the rₛ checkpoint and the weak limit D→1 before interpreting a clock ratio.",
        dependency: "D depends on the piecewise field and feeds A=D², B=D⁻², static proper time and radial null-coordinate calculations.",
        meaning: "For the declared positive Xi range, D<1 means a static clock accumulates less proper time per unit of the chosen coordinate time.",
        limits: "D is a model coefficient, not an absolute time field. Motion, rotation, propagation and detector calibration require additional terms."
      },
      s: {
        purpose: "s=1+Xi is the reciprocal radial scale locked to D by s=D⁻¹. It supplies the radial coefficient in the diagonal metric rather than acting as an independently fitted function.",
        reading: "Compute Xi and add one, or invert D; both routes must agree numerically. Keep s dimensionless and apply it only in the declared static chart.",
        dependency: "It is algebraically tied to D and determines the radial metric factor B=s²=D⁻² and proper radial-length integrals.",
        meaning: "A larger Xi increases the radial proper-distance scale relative to the coordinate increment in the selected chart.",
        limits: "Reciprocity is an internal model constraint, not a measurement result or a global regularity theorem."
      }
    }[item.id];
    const formulaLabel = item.name + " (" + item.latex + ")";
    return {
      purpose: special?.purpose || (rule.purpose || "This " + formulaLabel + " defines or derives a named quantity within the canonical " + item.topic + " model layer. It must be read together with its domain and guardrail, not as a free-standing conclusion."),
      reading: special?.reading || (rule.reading || "Read " + formulaLabel + " symbol by symbol, evaluate declared inputs first, preserve the displayed normalization, and check the units before substituting numerical values."),
      meaning: special?.meaning || (rule.meaning || "Within " + item.domain + ", this relation makes the " + item.topic + " claim quantitatively inspectable and connects it to the neighbouring definitions."),
      limit: special?.limits || (rule.limit || "The statement is limited to " + item.domain + " and the approximation, observer convention or dataset explicitly named by the catalogue."),
      dependency: special?.dependency || family[1] + " The catalogue guardrail is: " + item.caution,
      limits: family[2],
      misreading: family[3],
      related: family[4]
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
