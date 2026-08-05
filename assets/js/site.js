(() => {
  const root = document.documentElement;
  const pageGuides = {
    "index.html": {
      question: "What is SSZ, what does its present metric calculate, and which parts remain research questions?",
      path: "Start with the classification, then vary mass and normalized radius. Read the evidence and conflict sections only after the symbols Ξ, D and rₛ are clear.",
      meaning: "The calculator demonstrates consequences of the declared static model. A reproducible number is a model result until it is connected to an independently measured observable.",
      limit: "Finite coefficients at r=rₛ do not prove a regular centre, a complete field theory or empirical superiority over general relativity.",
      next: ["theory.html", "Continue with the theory from first principles"]
    },
    "theory.html": {
      question: "How does SSZ move from a physical idea to a defined geometry, equations of motion and testable observables?",
      path: "Read in layers: intuition → assumptions and coordinates → Ξ and D → metric → worldlines and observables → evidence status and failure conditions.",
      meaning: "Equations derived from the locked metric are mathematical consequences of that ansatz. They become physical predictions only after a complete measurement model is specified.",
      limit: "The current static exterior and its operational bridge are defined; a fundamental action, globally regular interior and rotating completion are not yet derived.",
      next: ["metric.html", "Inspect the metric components interactively"]
    },
    "formulas.html": {
      question: "Which equations are canonical, which symbols enter them, and where is each expression valid?",
      path: "Begin with the six defining equations. For every later formula check its inputs, units, radial branch and epistemic role before substituting numbers.",
      meaning: "A formula card is a compact contract: definition, domain and limitations belong to the equation and must travel with any quoted result.",
      limit: "Sharing symbols does not make two formulas interchangeable; a clock relation cannot silently become a lensing, orbital or waveform law.",
      next: ["glossary.html", "Look up every symbol and technical term"]
    },
    "regimes.html": {
      question: "Why does SSZ use strong, transition and weak radial descriptions, and what is continuous at their joins?",
      path: "Move the probe across 1.8 and 2.2 rₛ. Compare Ξ, D and the first two derivatives, then separate analytic branch, physical environment and observable validity.",
      meaning: "C² matching prevents jumps in value, slope and curvature of Ξ at the selected boundaries; it is a smooth construction rule.",
      limit: "Smooth matching does not derive the boundary locations from a field equation or prove that every observable is insensitive to the bridge.",
      next: ["weak-field.html", "Follow the model into the weak-field limit"]
    },
    "weak-field.html": {
      question: "Does the SSZ metric recover the small-potential behavior required by clocks, light propagation and Solar-System tests?",
      path: "Define U=GM/(rc²), compare exact D with its first-order series, then follow each observable from formula to stored comparison and evidence label.",
      meaning: "Agreement at leading weak-field order is a necessary compatibility result. The microscope shows the much smaller higher-order remainder rather than rounding it to zero.",
      limit: "Compatibility with reference tests is not model selection; discrimination needs measurement uncertainties and an observable on which the models differ.",
      next: ["strong-field.html", "See where strong-field differences can arise"]
    },
    "strong-field.html": {
      question: "What does the locked static metric imply near rₛ, and which compact-object claims remain bridge- or completion-dependent?",
      path: "Separate local horizon behavior, geodesic candidates, numerical certificates, effective source terms and global-completion requirements.",
      meaning: "A stationary radius or finite coefficient is a result inside the declared metric. Sensitivity tables show how much it moves when admissible bridge details change.",
      limit: "Photon, ISCO, shadow and ringdown language must not be promoted to an observation without rotation, plasma, emission and detector forward models.",
      next: ["interior-global-structure.html", "Examine the unresolved interior and global geometry"]
    },
    "interior-global-structure.html": {
      question: "Can the current exterior expression be continued to the areal centre, and what would a defensible global completion require?",
      path: "Keep r=rₛ, the bridge and r=0 distinct. Then inspect curvature, geodesics, trapping, junction conditions and candidate completion strategies in that order.",
      meaning: "The displayed divergence diagnoses the present diagonal continuation. It is evidence that an inner completion is needed, not a proof that every possible SSZ completion fails.",
      limit: "Regular metric coefficients alone are insufficient; curvature, signature, matter source, junctions, causal extension and stability must all be checked.",
      next: ["workbench.html#interior-sandbox", "Experiment with constrained interior candidates"]
    },
    "metric.html": {
      question: "How do Ξ and D determine the metric coefficients, local clock rates, radial scales and velocity identities?",
      path: "Choose a normalized radius, identify the active branch, then read Ξ → D → A and B before interpreting derived velocities or limits.",
      meaning: "A and B are not independently fitted functions: A=D² and B=D⁻², so A·B=1 is an internal identity of the ansatz.",
      limit: "Coordinates describe the model; an observable additionally requires an emitter, path, observer and measurement protocol.",
      next: ["dynamics-energy.html", "Derive motion and energy from the metric"]
    },
    "dynamics-energy.html": {
      question: "How are trajectories, conserved quantities, effective potentials and energy tests constructed from the SSZ geometry?",
      path: "Start from the action, derive constants of motion, inspect radial and non-radial dynamics, and only then compare lensing or energy-condition outputs.",
      meaning: "Conservation and numerical closure test the encoded dynamics. Data-facing success additionally depends on initial conditions, nuisance parameters and uncertainties.",
      limit: "A static spherical calculation does not automatically supply rotation, radiation reaction, plasma propagation or a complete stress-energy theory.",
      next: ["workbench.html#geodesics", "Run the interactive geodesic solver"]
    },
    "mathematics.html": {
      question: "Which mathematical and numerical ideas support the wider research programme, and which are merely related explorations?",
      path: "Treat each laboratory separately: read its definition, vary one control, observe the invariant or error, and note whether it enters the SSZ metric.",
      meaning: "The labs explain transformations, integration behavior, convergence, graph geometry and scaling with executable examples.",
      limit: "A shared appearance of φ, eigenmodes or numerical structure is not by itself a physical derivation or evidence for SSZ.",
      next: ["reproducibility.html", "See how numerical claims are reproduced"]
    },
    "qubits.html": {
      question: "How would a radius-dependent clock factor accumulate phase in a qubit, and what would an experiment actually need to measure?",
      path: "Set height, frequency and duration; follow ΔD → angular frequency → phase → fidelity/CHSH proxy → compensation operation.",
      meaning: "The laboratory computes a controlled phase model and shows its scaling. Compensation illustrates an operational response to the predicted phase.",
      limit: "It is not evidence for quantum gravity, entanglement generation by gravity or hardware feasibility without noise, calibration and experimental likelihoods.",
      next: ["falsification.html", "Translate the phase idea into a test protocol"]
    },
    "jif.html": {
      question: "How does JIF turn accumulated phase into an auditable integer or fractional count without hiding phase contributions?",
      path: "Distinguish the massive-system clock route from the detector-ledger route, then trace source phase, transfer, interaction and local-oscillator terms.",
      meaning: "The ledger is valuable because signs, units and ownership of every phase contribution remain visible before comparison with a target.",
      limit: "A transparent count is a forward-model structure, not confirmation; preregistration, calibration, uncertainties and target-blind analysis remain essential.",
      next: ["evidence.html", "Inspect how claims are tied to evidence"]
    },
    "schrodinger.html": {
      question: "What does the archived one-dimensional eigenproblem demonstrate, and why is it intentionally labelled a scientific toy?",
      path: "Read the Hamiltonian and boundary assumptions first, vary mode and scale, then compare the output with the explicit limitations.",
      meaning: "The animation illustrates finite-box eigenmodes and an effective potential in dimensionless units.",
      limit: "It is not a three-dimensional relativistic atom, a measured spectrum or a derivation of quantum gravity; the humour never changes that status.",
      next: ["mathematics.html", "Explore the serious numerical-method laboratories"]
    },
    "visual-lab.html": {
      question: "How do the portal’s equations, asymptotics and repository calculations behave when their parameters are changed?",
      path: "Use the badges: canonical modules implement locked formulas; reference modules compare known limits; conceptual modules teach geometry; open modules explore hypotheses.",
      meaning: "A visual output is reproducible because it is calculated from the displayed controls. Its badge tells you what kind of statement it supports.",
      limit: "Animation scale, projection and normalized units may aid perception; they are not additional physics or independent evidence.",
      next: ["formulas.html", "Cross-check every visual against its formula"]
    },
    "workbench.html": {
      question: "Which assumptions control the strongest SSZ conclusions, and how can a reviewer perturb, audit or reject them?",
      path: "Test bridge sensitivity, integrate geodesics, inspect test dependence and conflicts, then use the dimensional and interior sandboxes.",
      meaning: "The workbench exposes dependency rather than hiding it: robust outputs survive declared variations; sensitive outputs are labelled accordingly.",
      limit: "Passing a local sandbox check does not establish a global solution, independent experiment or unique physical interpretation.",
      next: ["falsification.html", "Turn audit findings into rejection criteria"]
    },
    "tests.html": {
      question: "What was actually executed, what passed, and how much independent scientific support do those records provide?",
      path: "Separate runner snapshots, unique test definitions, paired evaluations, extracted artefacts and historical outputs before reading any total count.",
      meaning: "A passing test establishes that its encoded assertion held in its recorded environment. Independence depends on data, code path, author and reference source.",
      limit: "Large green counts cannot be added as independent confirmations, and stored output is not the same as a fresh execution.",
      next: ["evidence.html", "Follow tests into the claim–evidence ledger"]
    },
    "evidence.html": {
      question: "For each public claim, can a reader trace the definition, source, implementation, test, result and limitation?",
      path: "Search for a claim, inspect its dependency locks, compare evidence classes, then verify the source hash and linked artefacts yourself.",
      meaning: "The ledger makes support auditable and exposes missing links; it does not upgrade the strength of the underlying evidence.",
      limit: "Internal derivation, software consistency, dataset-conditioned comparison and independent experiment are different classes and must remain separate.",
      next: ["falsification.html", "Ask what observation would make a claim fail"]
    },
    "falsification.html": {
      question: "Which mathematical, numerical or observational outcomes would force SSZ to be revised or rejected?",
      path: "Begin with internal consistency failures, then require a complete forward model before applying observational exclusion thresholds.",
      meaning: "A useful falsifier names an observable, dataset, uncertainty model, nuisance treatment, threshold and decision rule in advance.",
      limit: "A residual, failed proxy or disagreement with an incomplete pipeline is a diagnostic; it is not automatically a theory-level falsification.",
      next: ["reproducibility.html", "Build a reproducible falsification workflow"]
    },
    "observations.html": {
      question: "Which repositories connect SSZ-related calculations to astronomical, clock, waveform or environmental data?",
      path: "For each application identify inputs, forward model, stored output, controls and uncertainty treatment before comparing pass counts.",
      meaning: "Repository checks show that declared pipelines run and satisfy encoded criteria; some entries also reproduce known measured scales.",
      limit: "The applications have different maturity and are not one combined experiment. Internal checks, exploratory fits and independent validation must not be merged.",
      next: ["tests.html", "Inspect the exact tests behind each application"]
    },
    "papers.html": {
      question: "What does each paper claim, which model layer does it address, and how mature is its evidence?",
      path: "Filter by topic and status, read the evidence label before the title, then follow the paper into formulas, code, data and limitations.",
      meaning: "Publication status records dissemination and review state; the portal’s evidence labels record what kind of support is actually available.",
      limit: "Authorship, quantity of papers or an advanced draft does not replace reproducibility, uncertainty analysis or independent review.",
      next: ["research.html", "Place the papers in their development history"]
    },
    "research.html": {
      question: "How did the programme evolve, and which documents are canonical, exploratory, historical or superseded?",
      path: "Follow the chronology, classify each document, inspect representative figures, then apply the paper-reading checklist.",
      meaning: "Historical material explains how ideas developed and why locks changed; canonical status determines what the current portal implements.",
      limit: "Archive completeness does not imply that all archived statements remain accepted or mutually consistent.",
      next: ["repositories.html", "Map documents to their source repositories"]
    },
    "repositories.html": {
      question: "Where do theory, implementations, datasets, tests and reports live across the public repository landscape?",
      path: "Filter by domain and hosting state, identify a repository’s scientific role, then follow its links instead of treating repository count as evidence.",
      meaning: "The catalogue is a provenance map showing ownership and relationships between research artefacts.",
      limit: "A repository can be complete as software yet scientifically exploratory; active, archived and validated are different properties.",
      next: ["atlas.html", "Inspect the full repository-to-topic atlas"]
    },
    "atlas.html": {
      question: "Which public repository covers a given formula, dataset, test domain or visualization, and how large is its recorded footprint?",
      path: "Search by concept, filter by domain, sort by files or tests, then open a card to inspect its role and provenance.",
      meaning: "Counts describe indexed artefacts and help locate work; the constellation visualizes relationships between research areas.",
      limit: "File, image and test counts measure inventory—not correctness, novelty, independence or empirical confirmation.",
      next: ["evidence.html", "Move from inventory counts to claim-level evidence"]
    },
    "reproducibility.html": {
      question: "Can another researcher reconstruct the declared result from versioned inputs, code, environment and decision rules?",
      path: "Fix the canonical lock and release, regenerate data, run validators, inspect tolerances and hashes, then compare outputs without changing assumptions.",
      meaning: "Reproduction establishes that the published computational chain can be repeated and audited.",
      limit: "Reproducibility is necessary but does not prove physical truth; independent data and methodological challenge remain separate requirements.",
      next: ["tests.html", "Review the recorded executions and test semantics"]
    },
    "glossary.html": {
      question: "What does each symbol or technical phrase mean inside this portal, and which common alternative meanings must be avoided?",
      path: "Search the symbol index first, then read the glossary definition and FAQ context before returning to an equation or result.",
      meaning: "Definitions fix units, coordinates and epistemic usage so the same notation is interpreted consistently across pages.",
      limit: "A concise definition is not a derivation; follow its links to the theory, formula and evidence pages for the full argument.",
      next: ["theory.html", "Return to the derivation with the vocabulary fixed"]
    }
  };
  window.SSZPageGuides = pageGuides;
  const savedTheme = localStorage.getItem("ssz-theme");
  if (savedTheme) root.dataset.theme = savedTheme;
  if (localStorage.getItem("ssz-reviewer") === "true") root.dataset.reviewer = "true";

  document.addEventListener("DOMContentLoaded", () => {
    const here = location.pathname.split("/").pop() || "index.html";
    const menu = document.querySelector(".nav-links");
    if (menu) {
      const link = (href,label) => `<a href="${href}"${here===href?' aria-current="page"':''}>${label}</a>`;
      // Keep all groups collapsed by default. The current page remains marked
      // with aria-current, but opening a group is an explicit user action.
      const group = (label, entries) => `<details class="nav-group"${entries.some(([href])=>href===here)?" open":""}><summary>${label}</summary><div class="nav-submenu">${entries.map(([href,text])=>link(href,text)).join("")}</div></details>`;
      menu.innerHTML = [
        link("index.html","Overview"),
        group("Learn", [["theory.html","Theory"],["formulas.html","Formulas"],["regimes.html","Regimes"],["weak-field.html","Weak field"],["strong-field.html","Strong field"],["interior-global-structure.html","Interior"],["glossary.html","Glossary"]]),
        group("Models", [["metric.html","Metric"],["dynamics-energy.html","Dynamics & Energy"],["mathematics.html","Mathematics"],["qubits.html","Qubits"]]),
        link("jif.html","JIF"),
        link("schrodinger.html","QM wink"),
        link("visual-lab.html","Visual lab"),
        group("Evidence", [["workbench.html","Workbench"],["tests.html","Tests"],["evidence.html","Evidence"],["falsification.html","Falsification"]]),
        group("Research", [["observations.html","Observables"],["papers.html","Papers"],["research.html","Research archive"],["repositories.html","Repositories"],["atlas.html","Atlas"]]),
        link("reproducibility.html","Reproduce"),
        `<button class="nav-button reviewer-toggle" data-reviewer-toggle aria-pressed="${root.dataset.reviewer==="true"}">${root.dataset.reviewer==="true"?"Reviewer: ON":"Reviewer: OFF"}</button><button class="nav-button" data-theme-toggle>◐ Theme</button>`
      ].join("");
    }
    const guide = pageGuides[here];
    const hero = document.querySelector("main .hero");
    if (guide && hero && !document.getElementById("reading-compass")) {
      const section = document.createElement("section");
      section.id = "reading-compass";
      section.className = "section reading-compass";
      section.setAttribute("aria-labelledby", "reading-compass-title");
      section.innerHTML = `<div class="section-head"><span class="section-kicker">Reading compass</span><h2 id="reading-compass-title">How to understand this page</h2><p class="lead">${guide.question}</p></div><div class="reading-compass-grid"><article><span>1 · Reading path</span><p>${guide.path}</p></article><article><span>2 · What a result means</span><p>${guide.meaning}</p></article><article><span>3 · What it does not mean</span><p>${guide.limit}</p></article></div><p class="reading-compass-next"><a href="${guide.next[0]}">${guide.next[1]} →</a></p>`;
      const toc = hero.nextElementSibling?.matches(".toc") ? hero.nextElementSibling : null;
      (toc || hero).insertAdjacentElement(toc ? "afterend" : "afterend", section);
    }
    const toggle = document.querySelector(".menu-toggle");
    toggle?.addEventListener("click", () => {
      const open = menu?.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(Boolean(open)));
    });

    document.querySelectorAll("[data-theme-toggle]").forEach(button => {
      button.addEventListener("click", () => {
        root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem("ssz-theme", root.dataset.theme);
        window.dispatchEvent(new CustomEvent("ssz-theme-change"));
      });
    });
    document.querySelectorAll("[data-reviewer-toggle]").forEach(button=>button.addEventListener("click",()=>{
      const enabled=root.dataset.reviewer!=="true";root.dataset.reviewer=String(enabled);
      localStorage.setItem("ssz-reviewer",String(enabled));localStorage.setItem("ssz-reviewer-toggles",String(Number(localStorage.getItem("ssz-reviewer-toggles")||0)+1));button.textContent=enabled?"Reviewer: ON":"Reviewer: OFF";button.setAttribute("aria-pressed",String(enabled));renderReviewerPanel();
    }));
    function renderReviewerPanel(){let panel=document.getElementById("reviewer-panel");if(root.dataset.reviewer!=="true"){panel?.remove();return;}if(!panel){panel=document.createElement("aside");panel.id="reviewer-panel";panel.className="reviewer-panel";panel.setAttribute("aria-live","polite");document.body.append(panel);}const views=Number(localStorage.getItem("ssz-reviewer-views")||0)+1;localStorage.setItem("ssz-reviewer-views",String(views));panel.innerHTML=`<strong>Reviewer mode active</strong><span>Report scientific, code or provenance issues:</span><a href="mailto:mail@error.wtf?subject=SSZ%20Research%20Portal%20review">mail@error.wtf</a><small>Local browser statistics: ${views} reviewer-mode page activations · ${Number(localStorage.getItem("ssz-reviewer-toggles")||0)} toggles. No data is transmitted.</small>`;}
    renderReviewerPanel();

    // Full-resolution research-archive images stay on the page and close via
    // Escape, the close button or a click on the dark backdrop.
    document.querySelectorAll('.plot-gallery a[href$=".png"], .plot-gallery a[href$=".jpg"], .plot-gallery a[href$=".jpeg"], .plot-gallery a[href$=".webp"]').forEach(anchor => {
      anchor.addEventListener('click', event => {
        event.preventDefault();
        const overlay = document.createElement('div');
        overlay.className = 'image-lightbox';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        const image = document.createElement('img');
        image.src = anchor.href;
        image.alt = anchor.querySelector('img')?.alt || 'Full-resolution research figure';
        const close = document.createElement('button');
        close.type = 'button';
        close.textContent = '× Close (Esc)';
        const caption = anchor.closest('figure')?.querySelector('figcaption')?.textContent.trim();
        overlay.append(close, image);
        if (caption) { const text = document.createElement('figcaption'); text.textContent = caption; overlay.append(text); }
        const remove = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
        const onKey = event => { if (event.key === 'Escape') remove(); };
        close.addEventListener('click', remove);
        overlay.addEventListener('click', event => { if (event.target === overlay) remove(); });
        document.addEventListener('keydown', onKey);
        document.body.append(overlay);
        close.focus();
      });
    });

    document.querySelectorAll("[data-copy]").forEach(button => {
      button.addEventListener("click", async () => {
        const selector = button.getAttribute("data-copy");
        const source = document.querySelector(selector);
        if (!source) return;
        await navigator.clipboard.writeText(source.textContent.trim());
        const old = button.textContent;
        button.textContent = "Copied";
        setTimeout(() => { button.textContent = old; }, 1300);
      });
    });

    document.querySelectorAll("h2[id], h3[id]").forEach(heading => {
      heading.title = "Copy permalink";
      heading.addEventListener("click", async event => {
        if (event.target.closest("a,button")) return;
        history.replaceState(null, "", `#${heading.id}`);
        await navigator.clipboard?.writeText(location.href);
      });
    });

    const search = document.querySelector("[data-page-search]");
    if (search) {
      const items = [...document.querySelectorAll("[data-searchable]")];
      search.addEventListener("input", () => {
        const query = search.value.trim().toLowerCase();
        items.forEach(item => {
          item.hidden = Boolean(query) && !item.textContent.toLowerCase().includes(query);
        });
      });
    }
  });
})();
