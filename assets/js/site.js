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
    "rh-proof-candidate.html": {
      title: "How to audit the Weyl–Volterra RH proof candidate as one dependency-closed argument",
      lede: "The candidate combines a classical Xi transform, actual Volterra states, exact Hermitian matrix identities, computer-certified profile inequalities, endpoint estimates, an oriented Green balance and the completed-zeta symmetry bridge. Each layer must be checked with its own method and none may be replaced by a status label or a visual sample.",
      blocks: [
        ["Fix definitions and quantifiers first", "Write α=η+iβ with 0<β<1/2 and keep η separate from the completed function ξ(s). Verify the exact theta profile, Fourier normalization and parameter map s=1/2+iα before inspecting positivity. Constants may depend on each fixed finite α; the endpoint argument does not assert a uniform estimate in η and deliberately does not use β=0."],
        ["Connect certified scalars to the actual system", "Recompute A₊, the reflected A₋, both flux matrices and J′+A*J+JA entry by entry. On the left, confirm that the directly calculated Schur complement is exactly the certified Gβ expression, including k′, the factor 2β and division by Φ′′. A positive surrogate formula would not prove positivity for the Volterra state used later."],
        ["Audit limits, orientation and strictness", "Check local absolute continuity before applying the product rule, then derive both finite Green identities with the declared outward-normal convention. The endpoint theorem must apply to the actual states for every fixed admissible α. Finally verify that θ>0 makes u₊ nontrivial on an open interval, so positive definiteness produces a strictly positive integral rather than only nonnegativity."],
        ["Keep the candidate status and evidence classes distinct", "The repository-internal contradiction and the classical symmetry translation form a candidate proof chain, while Arb and Sturm files certify specific inequalities and browser animations only explain formulas. The public status remains pending independent review. A reviewer should reproduce hashes and tests, then independently challenge normalization, reflection, conjugation, domains and the treatment of trivial zeros."]
      ],
      next: ["reproducibility.html", "Reproduce the certificates and audit the frozen candidate"]
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
    "recursive-closure.html": {
      question: "How does a finite rest-distance correction close into the Sagnac difference, reduced action bookkeeping and a phase readout?",
      path: "Start with one direction, inspect the signed recurrence, then switch to the odd sector and compare the finite partial sum with its exact limit.",
      meaning: "The animation evaluates a declared geometric closure map and its odd directional projection. It makes convergence and sign structure visible without adding new physical assumptions.",
      limit: "The projected map is not a complete rotating spacetime or symplectic phase-space flow; the reduced action relation still requires a stationary fixed-frequency optical convention and an experimental forward model.",
      next: ["jif.html", "Compare the phase readout with the JIF detector ledger"]
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
      path: "Begin with the captured 1,296-pass, zero-failure execution, then distinguish it from the 9,300-record inventory, its 5,294 unique repository/test definitions, paired evaluations, extracted artefacts and historical outputs.",
      meaning: "This is unusually broad verification: symbolic identities, dimensional and limit checks, high-precision numerics, regression and sensitivity tests, negative controls, real/reference-data comparisons and pipeline contracts all occur in the corpus.",
      limit: "The breadth is stronger than a simple unit-test count, but correlated implementations and shared data cannot be added as independent experiments; stored output also remains distinct from a fresh external execution.",
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
    },
    "index.html": {
      title: "The complete SSZ reading route in one view",
      lede: "The portal is easiest to understand as a chain of definitions, consequences, calculations, tests and observations. Each link has a different evidential role, and none should be skipped when moving from an attractive number to a physical claim.",
      blocks: [
        ["Start with the declared object", "SSZ is presented here as a locked static spherical construction: a central mass supplies rₛ, the normalized radius x selects a branch for Ξ, and Ξ generates D and the metric coefficients. This is the object being analyzed. It is not yet a universal action, a rotating completion or a complete matter theory."],
        ["Follow dependencies, not slogans", "Every later result inherits earlier choices. A clock ratio inherits D and the observer convention; a geodesic inherits the metric and initial data; a lensing result inherits a null path and source model; a catalogue comparison inherits its dataset and uncertainty model. The dependency graph is the portal’s central scientific navigation aid."],
        ["Separate result classes", "Definitions and algebraic consequences can be exact inside the model. Numerical tests establish implementation behavior. Reference-limit recovery establishes compatibility. Data comparisons add a forward model and measurements. Independent empirical confirmation requires still more. The portal shows all these classes because a single green badge cannot carry their different meanings."],
        ["Use the interface as an audit trail", "Change one input, read the units and branch, inspect the formula explanation, then follow the linked test and evidence record. A visual is most valuable when it leads to a quantitative question that another person can reproduce. If a conclusion changes under a declared admissible perturbation, that sensitivity is part of the result."],
        ["What the current corpus has established", "The 9,300-record catalogue, 28 test-bearing repositories and captured 1,296-pass runner show broad mathematical, numerical, pipeline and data-facing work. That breadth is real positive evidence about the public computational programme. It does not collapse shared provenance into independent experiments, and it does not remove the remaining observational completion tasks."],
        ["Where to go next", "Theory explains the construction, Metric exposes its coefficients, Regimes and Weak Field test its limits, Strong Field and Interior expose completion issues, Models derive dynamics or phase, and Evidence, Tests, Observations and Reproducibility establish what was actually checked. The tabs are a connected route, not competing summaries." ]
      ]
    },
    "recursive-closure.html": {
      title: "How recursive closure reconstructs the directional return-time difference",
      lede: "This supplement turns the geometric correction series into an executable recurrence and then keeps the odd directional sector, reduced action bookkeeping and phase readout visibly separate.",
      blocks: [
        ["One signed recurrence", "With T₀=L/c, β=v/c, σ=±1, a chosen normalized starting remainder ℓ₀/L and t₀=0, the signed remainder obeys ℓₙ₊₁=σβℓₙ while each step adds (ℓₙ/L)T₀. The sign records direction; |β|<1 is the contraction condition. Scaling ℓ₀/L changes the amplitude and time scale, not convergence."],
        ["The odd sector is the Sagnac difference", "Subtracting the two direction-reversed limits removes the even powers and leaves 2T₀(β+β³+β⁵+…). With q₀=2T₀β and qₖ₊₁=β²qₖ, the q-recurrence computes those odd time contributions directly; it is an accelerated projection, not a second route."],
        ["From return time to reduced action", "At fixed energy in a stationary optical/Hamilton–Jacobi reduction, the odd-sector bookkeeping is ΔIodd=EΔt up to the declared orientation convention. This is a reduced relation, not a claim that the projected two-dimensional map is symplectic."],
        ["What the Poincaré–Cartan theorem does and does not say", "Hamiltonian transport preserves the Poincaré–Cartan integral of a transported closed extended-phase-space contour. It does not make arbitrary spatial deformations of a ring invariant; changing the oriented rotation flux can change the integral."],
        ["Phase is the readout layer", "With E=ℏω, the reduced odd action gives Δφ=ωΔt in the selected convention. A detector prediction must still use the detector’s eigenfrequency and proper time, calibration, noise, nuisance parameters and a preregistered comparison rule."]
      ]
    },
    "theory.html": {
      title: "The whole theory as one dependency chain",
      lede: "This page already contains the portal’s longest derivation. The following map is a compact orientation layer so a reader can place every detailed section inside one coherent argument.",
      blocks: [
        ["Physical starting point", "Choose the central mass and areal radius, define rₛ and x, and state the observer and coordinate conventions. These choices determine what the symbols mean before any interpretation begins."],
        ["Primary field and bridge", "Ξ is the primary radial field. Strong, bridge and weak formulas are routed by x; the quintic bridge matches value, slope and curvature at both selected joins. This is a reproducible construction rule whose physical derivation remains a separate question."],
        ["Metric and consequences", "D maps the field to static clock rate, A and B define the diagonal metric, and the line element supplies intervals. Connections, curvature, geodesics, redshift and travel times are derived from this locked object rather than fitted independently."],
        ["Measurement and evidence", "A derived quantity becomes an observable only after specifying a worldline, path, source, detector and uncertainty model. The broad test corpus checks many internal and computational layers; data-facing and independent layers must be read claim by claim."],
        ["Completion boundary", "The current theory is strongest as a defined static exterior and tested computational framework. A globally regular interior, rotating sector, universal covariant action and independent experimental discrimination are explicit development layers, not hidden assumptions."]
      ]
    },
    "strong-field.html": {
      title: "How to read strong-field results without conflating local and global claims",
      lede: "Near rₛ, small changes in the metric can produce large changes in derivatives, paths and observables. Strong-field interpretation therefore requires a strict separation between local calculation, source model and global completion.",
      blocks: [
        ["Local clock and frame results", "Finite D at a selected radius, proper distance and a static orthonormal frame are local statements for the declared observer. They do not by themselves establish that a static observer can exist everywhere or that the centre is regular."],
        ["Geodesic candidates", "Photon spheres, circular timelike orbits and ISCO conditions are roots and stability conditions of the selected static metric. They are not automatically observed shadows, accretion structures or ringdowns, which require rotation, emission, plasma and detector forward models."],
        ["Curvature and effective source", "Ricci and Kretschmann behavior tests invariant geometry. An effective Einstein tensor diagnoses the density and pressures that would support the ansatz within general-relativistic bookkeeping. Neither calculation silently supplies a fundamental matter theory."],
        ["What the test corpus changes", "Strong-field branch values, derivatives, limits, geodesic residuals and sensitivity are extensively exercised. The remaining question is not whether the displayed equations can be evaluated, but whether a complete source, rotating solution and independent observation select this construction."]
      ]
    },
    "interior-global-structure.html": {
      title: "Why an interior is a separate geometry problem",
      lede: "The exterior expression, transition bridge and areal centre are three different loci. A defensible interior must satisfy more than a finite coefficient at one coordinate value.",
      blocks: [
        ["The centre is invariantly demanding", "As r approaches zero, curvature scalars, signature and the relation between areal radius and local geometry must be examined. A coordinate transformation cannot remove a genuine invariant divergence."],
        ["Matching is a boundary problem", "A candidate interior must match the exterior data required by the chosen field equations and junction formalism. Value continuity alone is not enough when derivatives, extrinsic curvature, matter flux or causal structure enter the problem."],
        ["Local sandbox results have a defined scope", "Polynomial matching, energy-condition samples and finite geodesic integrations are useful constraints on candidate constructions. They do not prove global hyperbolicity, stability, maximal extension or a unique matter completion."],
        ["What has already been tested", "The catalogue contains strong-field, curvature, junction, energy and geodesic calculations. A meaningful next test must therefore target a specific unresolved global property or independently derive a source and stability analysis, rather than repeat local continuity checks."]
      ]
    },
    "tests.html": {
      title: "How to read 9,300 tests as a structured body of evidence",
      lede: "The total is an inventory, not a single experiment. Its value becomes visible when records are separated by assertion type, provenance, execution status and scientific layer.",
      blocks: [
        ["What is genuinely broad", "The catalogue includes 8,192 unit/integration records, 638 data comparisons, 202 limit tests, 96 dimensional checks, 86 numerical tests, 81 symbolic tests and five regression records across 28 repositories. This is substantially broader than a superficial unit-test suite."],
        ["What the captured execution adds", "The dated runner snapshot records 1,296 passes and zero failures in its executed subset. That is direct evidence about one recorded environment. The complete inventory is wider but includes definitions, artefacts and parameterized records that should not be added as independent runs."],
        ["How to interpret application clusters", "Lensing, gravitational waves, electromagnetic extensions and qubit phase work have large data-facing clusters. The stage audit also identifies forward-model, uncertainty and model-comparison mappings unevenly across domains. These mappings locate real work while preserving the distinction between catalogue classification and methodological independence."],
        ["The right challenge after a pass", "A pass narrows the space of implementation failures. The next useful question is whether the result survives an alternative code path, stricter tolerance, controlled data perturbation, independent calibration or a discriminating observable. This is how the suite becomes a platform for stronger tests rather than a substitute for them."]
      ]
    },
    "reproducibility.html": {
      title: "Reproducibility as a complete scientific object",
      lede: "Reproducing a number requires more than rerunning a script. It requires reconstructing the definitions, versions, inputs, environment, tolerances and decisions that made the number meaningful.",
      blocks: [
        ["Freeze the scientific lock", "Record the canonical equations, branch boundaries, constants, data snapshot and decision rules before execution. A later workstation result is not comparable if it silently changes any of these inputs."],
        ["Freeze the computational route", "Source hashes, dependency versions, numerical precision, random seeds, integration tolerances and hardware-sensitive behavior belong to the route. A stored output without this context is an artefact, not a fully reproducible result."],
        ["Compare outputs at the right level", "Exact identities need exact or tolerance-aware comparisons; simulations need convergence and uncertainty summaries; data analyses need likelihood and nuisance conventions. A bitwise match is not always the correct scientific criterion, and a close visual plot is not always sufficient."],
        ["Reproduction and independence", "The 9,300-record corpus demonstrates extensive repeated checking, including independent-reproduction labels in the audit. Those labels expose potentially separate routes but do not prove independence by catalogue matching alone. External data, code and analysis choices determine the stronger claim."]
      ]
    },
    "glossary.html": {
      title: "A glossary is a map of meanings, not a substitute for derivation",
      lede: "Symbols such as D, rₛ, Ξ, phase and redshift can be familiar while carrying a precise local convention here. Fixing that convention is what makes cross-page reading reliable.",
      blocks: [
        ["Notation has ownership", "A symbol should be read with its page, equation and observer convention. D is a static clock factor in the canonical metric; a detector’s Doppler factor or a different paper’s distance variable must not be silently substituted."],
        ["Units are part of definitions", "A glossary entry should tell whether a quantity is dimensionless, measured in metres, a frequency, a phase or a normalized residual. Unit annotations make hidden conversions and cancellation errors visible before they reach a plot or claim."],
        ["Epistemic words are technical terms", "Canonical, tested, reproduced, reference, exploratory, proxy and independent describe evidence status as well as content. The portal uses them deliberately so a mathematically correct expression is not mistaken for an empirically confirmed law."],
        ["Follow the links outward", "Use the glossary to decode a formula, then follow that formula to its derivation, implementation, test, visualization and evidence record. Definitions are the beginning of a chain; they are not the chain’s final conclusion."]
      ]
    },
    "schrodinger.html": {
      title: "How the quantum wink fits into the research architecture",
      lede: "The one-dimensional Schrödinger laboratory is intentionally a teaching model. Its value is to explain an eigenproblem and its numerical assumptions while marking the boundary to real quantum systems.",
      blocks: [
        ["What the toy solves", "A Hamiltonian, potential and boundary condition define a finite eigenproblem. Mode number, scale and normalization determine the displayed wave-like functions and energy ordering."],
        ["What the toy teaches", "The laboratory makes nodes, boundary sensitivity, normalization and numerical parameter dependence visible. These are transferable mathematical ideas, even when the chosen potential is not a complete physical atom."],
        ["Where the qubit model differs", "The qubit page studies a relative phase accumulated by a controlled two-system clock difference. It does not inherit the toy’s potential or claim that the animation is a microscopic derivation of quantum gravity."],
        ["How tests constrain the boundary", "The mathematical and numerical corpus supports the displayed algorithm and limiting behavior. It does not turn a finite-box eigenproblem into a measured spectrum or a Willow-device reproduction; those would require a separate Hamiltonian, hardware model and data protocol."]
      ]
    }
  };
  const researchEcosystemBlocks = [
    ["One programme, several artefact types", "A paper explains an argument, a repository makes part of that argument executable, a dataset supplies inputs, a test checks a declared assertion, and a report records an output. These objects support one another but are not interchangeable. A repository count therefore measures the size of the public work surface; it does not count theories, discoveries or independent confirmations."],
    ["Canonical, exploratory, historical and superseded", "Canonical material defines the equations and conventions implemented by the current portal. Exploratory material investigates consequences or possible extensions. Historical material documents how the programme developed, including routes that were later corrected. Superseded material remains useful for provenance, but it must not silently override the current lock. Dates, hashes and explicit status labels are what keep these layers from being blended."],
    ["How to follow a claim across the archive", "Begin with the exact claim rather than a repository title. Locate its formula or definition, identify the implementation that evaluates it, inspect the tests that constrain that implementation, and then find any data-facing analysis. Finally read the stated limitation. If one of those links is missing, the chain is incomplete even when neighboring repositories contain impressive amounts of code."],
    ["Why independence is a separate question", "Two artefacts can agree because they share a formula, author, source file, dataset or calibration. Such agreement is useful reproducibility evidence, but it is correlated. Stronger independence requires genuinely separate code paths, methodological choices, data provenance and preferably external investigators. The portal therefore uses relationships to reveal dependence rather than treating every green record as another experiment."]
  ];
  const foundationChapters = {
    "formulas.html": {
      title: "How to reason with a formula instead of merely substituting numbers",
      lede: "An equation is a compact scientific contract. Its symbols, units, assumptions, domain and evidence status determine what may legitimately be concluded from the calculated value.",
      blocks: [
        ["Definitions come before calculation", "First identify whether the displayed relation is a definition, an algebraic consequence, an approximation, an estimator or an empirical fit. A definition such as x=r/rₛ fixes notation; it is not itself a prediction. A metric coefficient derived from Ξ is a model consequence. A residual or information criterion belongs to a data-analysis protocol. Treating all equal signs as the same kind of scientific statement is a common source of overclaiming."],
        ["Units are an immediate error detector", "Every additive term must carry the same dimensions, while arguments of exponentials, logarithms and trigonometric functions must be dimensionless. Normalized variables such as x allow universal curves, but physical metres return only through r=xrₛ. When a formula produces a tiny difference between nearby large quantities, its algebraic form must also be examined for numerical cancellation; mathematical equivalence does not guarantee equal floating-point stability."],
        ["Domain travels with the equation", "A strong branch, bridge polynomial and weak approximation may use the same symbol while applying on different radial intervals. Likewise, a static clock relation assumes a specified observer family, and an equatorial geodesic formula assumes the declared metric and symmetry. Quoting a formula without its branch, approximation order or observer convention removes part of the statement that makes it true."],
        ["From formula to evidence", "After calculation, ask which tests constrain the result: exact identities, dimensional checks, boundary derivatives, precision comparisons, regression cases, real/reference-data pipelines or negative controls. The portal’s suite contains all of these forms. They make the computational chain unusually well tested, but an experimentally discriminating claim still needs calibrated data, uncertainties, nuisance treatment and an independent comparison protocol."]
      ]
    },
    "regimes.html": {
      title: "Why a segmented description must still behave as one geometry",
      lede: "Segmentation is not permission to splice unrelated curves. The branches must share variables, units and boundary rules so downstream clocks, connections and curvature do not acquire artificial jumps.",
      blocks: [
        ["Three different meanings of regime", "An analytic regime says which mathematical expression is evaluated. A physical regime describes an environment such as weak or strong gravity. An observational regime says which approximation is adequate for a measurement. These boundaries need not coincide. The 1.8–2.2 interval is an analytic routing decision; it is not automatically a material shell, phase transition or detector threshold."],
        ["Why C² is the selected matching level", "The metric depends on D, which depends on Ξ. Connection coefficients contain first metric derivatives and curvature contains first and second derivatives. Matching Ξ only in value could therefore leave derivative jumps. The quintic Hermite bridge supplies six degrees of freedom to match value, slope and curvature at both endpoints, making the declared static construction smooth through second order."],
        ["What the bridge determines—and what it does not", "Once endpoint values and derivatives are fixed, the chosen quintic is reproducible and testable. It determines bridge-sensitive outputs such as candidate extrema inside the transition interval. But mathematical smoothness does not derive the boundary positions from an action, prove uniqueness among all admissible interpolants or show that nature implements a literal segmentation."],
        ["How to audit a regime result", "Record x, the active branch, the distance to each join and the relevant derivative order. Repeat the calculation just below, at and just above both boundaries. Then perturb bridge assumptions within a declared admissible family. A result that remains stable has stronger model robustness than one whose value is controlled by the interpolation details."]
      ]
    },
    "weak-field.html": {
      title: "Why the weak-field limit is both a success condition and a discrimination problem",
      lede: "Any viable gravitational model must recover the accurately tested small-potential behavior. Passing that requirement is substantial positive evidence, but it also means leading-order observations may be unable to distinguish the models.",
      blocks: [
        ["The small parameter", "Far from the central scale, U=GM/(rc²)=rₛ/(2r) is much smaller than one. Exact expressions can then be organized by powers of U. The constant term describes flat spacetime, the first correction controls familiar gravitational clock and trajectory effects, and higher powers contain smaller model-specific structure. A comparison is meaningful only when both models use the same coordinates and observable convention."],
        ["Different observables sample different metric information", "Static clock ratios depend directly on the temporal factor at two endpoints. Light deflection and delay depend on both temporal and spatial geometry along a path. Orbital precession depends on derivatives and accumulated dynamics. Agreement in one observable therefore cannot be copied into another without deriving the appropriate worldline or propagation equation."],
        ["Compatibility is not preference", "Recovering the reference first-order clock shift, PPN coefficients or Solar-System scale shows that the implementation passes a necessary benchmark. If the predicted difference lies far below measurement uncertainty, the observation supports compatibility but cannot select SSZ over its reference. A preference claim needs an observable where the predictions separate, together with a complete noise and nuisance model."],
        ["Why stable residuals matter", "At large radius, subtracting nearly equal floating-point values can erase the very higher-order remainder being studied. Algebraically stable expressions, high-precision reference calculations and limit tests protect that signal from numerical artefacts. This is one reason the broader suite’s precision, regression and negative-control tests carry more information than a simple count of passing unit functions."]
      ]
    },
    "metric.html": {
      title: "What a spacetime metric means operationally",
      lede: "A metric is not a picture of a stretched surface. It is the rule that converts coordinate differences into clock readings, ruler lengths, light cones and invariant geometric quantities.",
      blocks: [
        ["Coordinates are labels; intervals are calculated", "The symbols t, r, θ and φ label events. In the static spherical ansatz, r is an areal radius because a symmetry sphere has area 4πr². Coordinate differences alone are not detector readings. The metric coefficients specify how those differences combine into ds², while an observer’s worldline determines the proper time or spatial projection actually measured."],
        ["One field controls reciprocal scales", "The declared chain Ξ→D→A=D² and B=D⁻² means the temporal and radial coefficients are not independent fit functions. A·B=1 is therefore an exact identity of this ansatz. Visual clock compression and radial stretching are two representations of that dependency, not two separately measured phenomena."],
        ["Local frames prevent coordinate confusion", "An orthonormal tetrad rescales coordinate basis vectors so a specified local observer measures the Minkowski signature at one event. This is where locally measured energy, pressure, velocity and light speed are defined. Coordinate slopes such as dr/dt may vary with the chart, while every admissible local observer still measures a null ray at c."],
        ["Geometry becomes physics through a protocol", "To predict a redshift, orbit or travel delay, specify emitter, path, observer and comparison clock. To compare with data, add motion, media, instrument response and uncertainty. Curvature invariants answer a different question: they diagnose the geometry independently of a coordinate relabelling, which is why a finite coefficient alone cannot prove a regular centre."]
      ]
    },
    "dynamics-energy.html": {
      title: "From interval geometry to motion, conserved quantities and effective sources",
      lede: "The metric becomes dynamical when a path is placed in it. Actions and geodesic equations organize that motion; effective tensors diagnose what source would support the selected geometry.",
      blocks: [
        ["The action is the organizing principle", "Inserting the metric into a path Lagrangian makes the assumptions explicit and allows the Euler–Lagrange equations to generate motion. Cyclic coordinates produce conserved energy and angular momentum parameters. These invariants reduce the calculation, expose forbidden domains and give numerical integrators quantities whose drift can be monitored."],
        ["Effective potentials are compressed dynamics", "A radial first integral can be rearranged into kinetic and effective-potential terms. Extrema locate circular-orbit candidates, but existence, accessibility and stability are separate tests. A plotted minimum or maximum is therefore a diagnostic inside the declared static model, not automatically an observed orbit, photon ring or accretion feature."],
        ["Energy accounting has two distinct roles", "A segmented sum records how declared components contribute to a total and helps detect double counting or conservation failures. Separately, the Einstein tensor of an assumed geometry can be interpreted as an effective stress tensor. That diagnostic tells us what density and pressures would be required in general relativity; it does not by itself derive a fundamental SSZ matter action."],
        ["From trajectory code to astronomical evidence", "Numerical convergence, conserved quantities, turning-point detection and cross-method agreement strongly validate the encoded dynamics. A data-facing trajectory additionally requires astrophysical initial conditions, rotation where relevant, finite-size or plasma effects, measurement selection and uncertainties. The portal keeps those additional layers visible rather than allowing an attractive orbit plot to stand in for them."]
      ]
    },
    "mathematics.html": {
      title: "The mathematical toolkit: structure, algorithms and honest scope",
      lede: "These laboratories collect methods used across the programme and related explorations. Their value lies in making invariants, convergence and failure modes visible—not in turning every mathematical resemblance into new physics.",
      blocks: [
        ["Transforms reveal structure", "A logarithmic radial coordinate converts multiplicative changes in radius into additive steps and can make wide dynamic ranges numerically manageable. Mode functions on that grid illustrate nodes and boundary sensitivity. The transform is exact bookkeeping; the chosen boundary conditions and operator still determine the actual eigenproblem."],
        ["Structure-preserving integration", "Symplectic methods are designed to preserve phase-space geometry and typically keep long-time energy error bounded, whereas a simple explicit method may drift secularly. This distinction matters whenever orbit or Hamiltonian conclusions depend on long integrations. Step-size convergence remains necessary even when a trajectory looks closed."],
        ["Convergence needs a criterion", "Chudnovsky terms, Hardy-Z brackets and parallel-scaling curves answer different numerical questions. One concerns truncation error, another sign-change localization, and another resource efficiency. Each requires its own certificate: precision bounds, interval or sampling guarantees, and measured overhead respectively. A smooth graph is not a universal convergence proof."],
        ["Mathematical connection is not physical derivation", "Golden-ratio approximants, chord closures and unit-distance graphs can illuminate symmetry and discrete structure. They enter SSZ physics only when a declared derivation or implementation dependency connects them to the metric or an observable. The portal therefore presents exact mathematical results positively while labeling speculative physical bridges separately."]
      ]
    },
    "qubits.html": {
      title: "From gravitational clock differences to a measurable quantum phase",
      lede: "The qubit proposal begins with an ordinary principle of phase accumulation: two coherent systems with slightly different proper-time rates acquire a relative phase. Every later quantity depends on preserving that distinction operationally.",
      blocks: [
        ["Absolute phase is not the observable", "A single state’s overall phase cannot be measured. What matters is the relative phase between components, paths, qubits or a local oscillator. The model therefore starts with the stable difference ΔD between two radii and multiplies it by angular frequency and elapsed time. Height, frequency and duration change the result linearly in the weak nearby-radius regime."],
        ["Coherence and entanglement are not synonyms", "A deterministic relative phase can rotate a coherent state without destroying coherence. Entanglement observables such as Bell-state fidelity or a CHSH-style proxy respond to that phase under the assumed state preparation and readout. This does not mean gravity created the entanglement, nor does it model stochastic decoherence, leakage or logical errors in hardware."],
        ["Why compensation is scientifically useful", "If the phase is deterministic and calibrated, an opposite Rz rotation can cancel the ideal model contribution. Comparing uncompensated and compensated protocols creates a controlled intervention rather than relying on a residual alone. A serious experiment would preregister the sign, timing, geometry and control sequence, then propagate calibration uncertainty through the predicted compensation."],
        ["What the laboratory visualizes", "The physical phasor uses the actual angle, so tiny phases correctly overlap the zero reference. The logarithmic map makes changes across many time decades visible without enlarging the calculated phase. Hardware relevance additionally requires coherence time, oscillator stability, environmental gradients, pulse errors, syndrome extraction and an explicit likelihood for raw measurement outcomes."]
      ]
    },
    "jif.html": {
      title: "Why a phase ledger turns an interference idea into an auditable prediction",
      lede: "A detector does not observe an anonymous phase. It compares phase contributions owned by sources, paths, interactions and reference oscillators, each with a sign and convention.",
      blocks: [
        ["Cycles, radians and clocks", "Angular phase is measured in radians; division by 2π converts it into a cycle count. A proper frequency integrated over proper time supplies one route. An interferometric detector ledger supplies another by summing and subtracting explicitly assigned phase terms. The two routes may share physical inputs but must not silently exchange conventions."],
        ["Ownership prevents sign errors", "Source phase, propagation phase, interaction phase and local-oscillator phase belong to different parts of the apparatus. Writing them in one ledger makes cancellations and reference choices visible. Without that ownership, an apparently precise total can hide a reversed endpoint ratio, double-counted transfer term or a phase that is not experimentally accessible."],
        ["Prediction must precede target access", "The scientifically strongest workflow fixes geometry, calibration, nuisance treatment, phase convention and decision threshold before examining the target comparison. Blinding or target-independent calibration reduces the freedom to tune a phase decomposition after seeing the desired answer."],
        ["What successful tests establish", "Ledger identities, unit checks, stable clock differences, sign tests and synthetic recovery validate the computational protocol. They are strong prerequisites for an experiment. Confirmation additionally requires detector data, uncertainty propagation, null controls and an analysis whose independence from the model-building path is documented."]
      ]
    },
    "visual-lab.html": {
      title: "How to use a scientific visualization without letting the picture overclaim",
      lede: "A visualization is an interface to equations or data. Its axes, normalization, projection and animation rules are part of the scientific statement and must be read before interpreting shape.",
      blocks: [
        ["Begin with the badge and source", "Canonical modules evaluate locked portal equations. Reference modules reproduce known limits. Conceptual modules teach geometry, and open modules explore hypotheses. This classification determines what kind of conclusion the image can support before any control is moved."],
        ["Change one variable at a time", "Hold other inputs fixed, predict the direction of change, then move one control and compare the numerical outputs with the visual response. Crossing a branch boundary or scale threshold deserves special attention. Resetting and repeating the same path is a simple reproducibility check."],
        ["Display transformations are not new physics", "Logarithmic axes reveal small or wide-ranging quantities; normalized axes allow comparison; vertical exaggeration makes small motion visible; projections turn three dimensions into two. These transformations can be scientifically useful when labeled. Pixel distance, animation speed and apparent curvature are never additional observables."],
        ["Move from visual insight to a claim", "Use the display to formulate a quantitative question, then open the associated formula explanation, record the value and units, identify the implementation and inspect its tests. If the claim concerns nature, continue to the evidence ledger and data-facing forward model. The visualization is the beginning of that chain, not its final link."]
      ]
    },
    "workbench.html": {
      title: "A workbench is for trying to break the result",
      lede: "Interactive audit tools are most valuable when used adversarially: perturb assumptions, change resolution, inspect conserved quantities and search for domains where a conclusion fails.",
      blocks: [
        ["Sensitivity is part of the result", "A single best-value calculation hides dependence on bridge coefficients, initial conditions, tolerances or catalogue choices. Sweeps expose whether an output is stable, slowly varying or controlled by a narrow assumption. Report the interval and perturbation rule alongside the nominal number."],
        ["Numerical success has several layers", "Finite values are not enough. Check convergence with step size or precision, constraint and conservation residuals, agreement with analytic limits, and behavior at domain boundaries. Negative controls should fail when an intended dependency is removed. Together these tests are much stronger than confirming that a button returns a number."],
        ["Catalogue counts need dependence analysis", "Thousands of records can share implementations, fixtures and reference data. The independence explorer therefore groups common provenance instead of adding every pass as a separate confirmation. Large coverage demonstrates engineering and mathematical breadth; independent empirical support is assessed through a different chain."],
        ["Sandboxes delimit rather than complete theories", "An interior polynomial can satisfy local matching and still fail matter consistency, stability or global causality. A geodesic can conserve its first integral over a finite domain without proving maximal completeness. Each workbench verdict is deliberately scoped to the conditions it actually checks."]
      ]
    },
    "evidence.html": {
      title: "What scientific evidence means in a computational research programme",
      lede: "Evidence is layered. A derivation, a passing implementation, a reproduced dataset comparison and an independent experiment answer different questions and should reinforce one another without being collapsed into one score.",
      blocks: [
        ["Internal mathematical evidence", "Exact identities, dimensional consistency, smooth boundary conditions and limiting behavior establish that the declared construction is coherent. Symbolic and high-precision tests can make this layer very strong. They cannot determine whether the construction describes nature, because the assumptions being tested are supplied by the model itself."],
        ["Computational and reproducibility evidence", "Unit, integration, regression, sensitivity, pipeline and negative-control tests establish that implementations behave as declared across a wide domain. The portal corpus is unusually broad in these categories. A fresh rerun with fixed versions strengthens reproducibility; a stored historical output alone is weaker because its environment and execution path may not be reconstructible."],
        ["Data-conditioned evidence", "A real- or reference-data pipeline connects calculations to measured quantities. Its strength depends on calibration, uncertainty, selection effects, nuisance parameters, comparison baselines and whether the target influenced model choices. Better residuals within supplied pairs are meaningful dataset-conditioned results, but correlated code and data remain correlated evidence."],
        ["Independent empirical evidence", "The strongest layer uses independently collected or controlled data, a preregistered forward model, blinded or target-independent choices where possible, and an explicit decision rule. Replication by external investigators further reduces shared assumptions. The ledger records missing links rather than upgrading a lower layer by rhetoric."]
      ]
    },
    "observations.html": {
      title: "From geometry to measured data: the complete observable chain",
      lede: "A physical model becomes observational only after its geometry is translated into what an instrument would record. Every arrow in that translation introduces assumptions that must be testable and documented.",
      blocks: [
        ["1 · Define the theoretical observable", "Begin with the metric quantity relevant to the experiment: a proper-time ratio, null travel time, deflection angle, orbital phase, waveform component or environmental frequency shift. Specify the emitter or source, path, observer and coordinate-to-local-frame conversion. A value of Ξ or D at one radius is usually an input to this step, not the final observable."],
        ["2 · Build the forward model", "Add source motion, extended mass, rotation, plasma or material propagation, atmosphere, instrument response, sampling and selection effects as required by the application. Predict data in the same units, cadence and representation as the measurement. A proxy may be useful for exploration, but it must remain labeled until these layers are supplied."],
        ["3 · Carry uncertainties and nuisance parameters", "Measured inputs and calibrations have distributions, not only central values. Correlations require a covariance matrix or an equivalent likelihood. Nuisance parameters should be fitted, marginalized or bounded according to a declared protocol. Residuals without uncertainties cannot quantify tension, and a smaller residual can reflect additional flexibility rather than better physics."],
        ["4 · Compare against meaningful controls", "Use established reference models, synthetic recovery, injected signals, null datasets and deliberately inadequate countermodels for different purposes. A point-mass Galaxy can demonstrate why extended mass is necessary without being a serious competitor. Negative controls help show that a pipeline reacts to the intended structure instead of always producing a preferred outcome."],
        ["5 · Fix the decision rule", "Before interpreting the target, state the statistic, threshold, parameter penalty, exclusion criterion and treatment of multiple comparisons. AIC, BIC, likelihood ratios or posterior comparisons have different assumptions. Report both compatibility and discrimination: a model may pass known measurements while remaining observationally indistinguishable at current precision."],
        ["6 · Classify the resulting evidence", "A pipeline that runs on real data with calibrated uncertainties is stronger than a formula-only example, and the portal records such data-facing work where present. Independence still depends on who supplied code, data and analysis choices. The final claim should name exactly which dataset and protocol support it rather than pooling heterogeneous applications into one confirmation count."]
      ]
    },
    "papers.html": {title:"How to read the paper collection as a connected research programme",lede:"The papers are entry points into arguments, not prestige tokens. Read each one together with its current status, implementation, tests, data and later corrections.",blocks:researchEcosystemBlocks},
    "research.html": {title:"How to reconstruct the development of the programme",lede:"A research archive preserves both current foundations and the path by which they were reached. Chronology becomes scientifically useful when every document is routed to its present status.",blocks:researchEcosystemBlocks},
    "repositories.html": {title:"How code, data, tests and reports form a reproducible research graph",lede:"Repositories divide a large programme into auditable units. Their scientific meaning comes from the relationships between artefacts, not from activity or file counts alone.",blocks:researchEcosystemBlocks},
    "atlas.html": {title:"How to navigate the research atlas without confusing inventory with evidence",lede:"The atlas answers where work lives and how topics connect. It is a map for beginning an audit, not a scoreboard of truth.",blocks:researchEcosystemBlocks},
    "falsification.html": {
      title: "What the test corpus has already challenged—and what a decisive falsification still requires",
      lede: "Falsification begins with what has genuinely survived. The 9,300-record catalogue shows broad, structured attempts to break implementations, limits and data pipelines; remaining open tests should be defined from that achieved baseline rather than from an assumption that little has been checked.",
      blocks: [
        ["Naive implementation objections have substantial answers", "The catalogue contains 8,192 unit/integration records, 202 limit tests, 96 dimensional checks, 86 numerical tests, 81 symbolic tests, 638 data comparisons and five explicitly classified regression tests across 28 test-bearing repositories. The captured twelve-repository runner adds a concrete 1,296-pass, zero-failure execution. This does not make every assertion independent, but it does rule out describing the programme as an untested collection of formulas."],
        ["Several mathematical failure modes are actively constrained", "Reciprocal metric identities, branch values, derivative matching, limiting behavior, high-precision residuals, geodesic constraints and conservation checks appear across the corpus. A proposed falsifier that merely asks whether these relations were coded or whether simple limits were considered is therefore behind the existing evidence. A useful new challenge must target an uncovered assumption, a stricter tolerance, an alternative implementation or a genuinely discriminating observable."],
        ["Data-facing work is real but uneven by stage", "The catalogue includes 638 data-comparison records and substantial domain clusters: lensing alone maps to 1,517 records, gravitational waves to 629, electromagnetic extensions to 412, and qubit phase/compensation to 1,089. The stage audit also exposes unevenness: some domains have forward-model, uncertainty and model-comparison definitions, while others have few or none. Because this is vocabulary-based catalogue mapping, it locates relevant work but does not by itself certify methodological independence."],
        ["A failure ladder prevents overreaction", "An algebraic identity failure rejects the encoded formulation immediately. A precision or regression failure rejects the affected implementation or numerical claim. A failed forward-model recovery challenges the application pipeline. A preregistered, uncertainty-aware observational exclusion challenges the physical model in that domain. These are progressively broader conclusions; one must not promote a local software defect—or demote a decisive observational contradiction—by using the wrong rung."],
        ["The strongest next tests are differential and independent", "The weak-field suite already supports leading compatibility, so a decisive experiment should target a quantity where SSZ and a reference model separate above combined uncertainty. Strong-field tests should include rotation, source physics and detector response where the observation requires them. Qubit and phase tests should use controlled geometry changes, null orientations and active compensation. Independent code, calibration and analysis choices would add a kind of evidence the catalogue’s shared-provenance records cannot manufacture by repetition."]
      ]
    }
  };
  const testLessons = {
    "formulas.html": "The catalogue’s metric-and-geometry group contains 989 records across 13 repositories and 208 source files, including 68 symbolic and 48 limit records. This is broad formula-level verification, not merely interface testing. The remaining question for a physical formula is usually not whether it can be evaluated, but whether its domain and observable mapping match the experiment being claimed.",
    "regimes.html": "Boundary and limit behavior is repeatedly exercised across the metric/geometry and validation groups. The existing suite therefore gives positive support to implemented continuity and routing rules. What remains open is the physical derivation and uniqueness of the selected bridge—not the basic question of whether its declared endpoint identities were tested.",
    "weak-field.html": "The weak-field catalogue group contains 78 records across eight repositories, while the PPN domain audit maps 82 records and 51 unique definitions. These results substantially support required weak-limit compatibility. The open empirical task is differential: identify higher-order or otherwise discriminating observables with uncertainties small enough to separate models that agree at leading order.",
    "metric.html": "The 989-record metric-and-geometry group spans symbolic, limit, dimensional, numerical and data-comparison categories. Together with the captured green runner, that strongly constrains algebraic identities and implemented limits. It does not remove the need for an observational protocol, but it means a critique should engage the tested metric rather than assume the dependency chain is unchecked.",
    "dynamics-energy.html": "The observable audit maps 78 timelike-orbit records with 53 unique definitions across 11 repositories and 14 null-geodesic records with seven unique definitions across three repositories. Conservation, integration and turning-point work is therefore substantive. The thinner layers are complete source/instrument forward models and uncertainty treatments for particular astronomical claims.",
    "mathematics.html": "Across the full catalogue, 202 records are classified as limit tests, 96 as dimensional checks, 86 as numerical tests and 81 as symbolic tests. These categories show that exact structure and numerical behavior are both being examined. Method-specific certificates still matter because a global count cannot substitute for the particular convergence or error bound of one algorithm.",
    "qubits.html": "The qubit phase/compensation domain maps to 1,089 catalogue records, including definitions associated with forward models, uncertainty language, model comparisons and falsification. The dedicated repository was also rerun locally at 184/184 passing. This is strong computational preparation; the unresolved step is controlled hardware data with independent calibration and a preregistered likelihood.",
    "jif.html": "Phase-ledger, stable-difference and compensation logic appears in the extensive quantum/qubit test clusters, not only in the page animation. The existing tests materially reduce risks of sign, unit, limiting and implementation errors. A detector-level claim must add real calibration ownership, noise propagation and target-independent decision rules rather than repeat those already-passed algebraic checks.",
    "recursive-closure.html": "The dedicated supplement passes seven focused tests, including synchronized odd-step and exact-tail checks: finite recurrence versus direct sum, directional reversal, fixed-point residual, odd-sector and axle identities, reduced action bookkeeping, and rejection of |β|≥1. These are exact implementation checks for the declared recurrence, not independent evidence for a rotating gravitational theory or detector result.",
    "visual-lab.html": "The visual modules sit on tested shared physics helpers and are additionally exercised by browser-interaction and numerical regression tests. Their value is therefore more than decorative. Their limitation is representational: display scaling and animation can communicate a tested quantity but cannot create a new evidence class.",
    "workbench.html": "The workbench reads all 9,300 catalogue records and preserves 5,294 unique repository/test definitions rather than flattening them into one count. Its independence and conflict views are consequences of what the audit learned: coverage is broad, but many records share provenance. Sensitivity and negative-control work should build on that breadth, not dismiss it.",
    "evidence.html": "The corpus contains 638 data-comparison records in addition to thousands of implementation checks, and the observable audit maps forward-model and uncertainty-related definitions in several mature domains. Evidence is therefore not confined to algebra. The exact independence of catalogue matches remains a separate provenance question, which is why the ledger records both positive support and dependence.",
    "observations.html": "The test inventory contains 638 data-comparison records, with large application clusters in lensing, gravitational waves, electromagnetic extensions and qubit phase work. Some domains also contain uncertainty- and model-comparison mappings. This supports describing the programme as genuinely data-facing; conclusions must still be stated per dataset and pipeline because the 9,300 records are not 9,300 independent observations.",
    "falsification.html": "The suite has already survived broad algebraic, limit, precision, regression, pipeline and data-comparison challenges. New falsifiers should therefore be sharper than generic calls for testing: they should name an uncovered dependency, independent implementation, discriminating observable, uncertainty budget and rejection threshold."
  };
  const formulaRules = [
    {
      match: /Theta.*PC|Θ.*PC|I.*PC|Poincare.?Cartan|Poincaré.?Cartan/i,
      title: "The Poincare–Cartan one-form closes the reduced action contour",
      purpose: "The Poincare–Cartan one-form combines canonical momentum transport with the Hamiltonian time term. Integrating it around the declared closed extended-phase-space contour gives the action bookkeeping used for the two directed paths.",
      reading: "Keep the contour orientation fixed, identify pᵢ, qⁱ, H and t on each segment, and include the detector-worldline closing segment before comparing the two paths. The stationary fixed-energy reduction is applied only after the contour has been defined.",
      meaning: "The odd directed contribution can be related to EΔt in the declared stationary optical reduction, so the recurrence’s return-time difference becomes an action difference before phase readout.",
      limit: "This is a reduced Hamiltonian bookkeeping relation, not a complete SSZ action or a proof that the projected recurrence is symplectic. Invariance applies to Hamiltonian transport of a closed contour, not arbitrary spatial deformations."
    },
    {
      match: /Delta.*t.*axle|Δt.*axle|Delta.*tau.*det|Δτ.*det|omega.*det|ω.*det|Phase readout|Detector layer/i,
      title: "The detector layer converts return time into proper-time phase",
      purpose: "This relation keeps three distinct quantities in order: the axle-frame return-time difference, the detector’s proper-time difference, and the detector-referenced phase readout.",
      reading: "First evaluate the rotating-loop time difference using the declared area and angular speed. Divide by γ for the co-rotating detector proper time, then multiply by the detector angular frequency; do not mix axle coordinate time with detector frequency without this conversion.",
      meaning: "The result is an operational phase prediction conditional on the specified detector reference, frequency calibration and loop geometry. It is downstream of the kinematic closure, not its cause.",
      limit: "The equation does not by itself provide a rotating SSZ spacetime, detector noise model, calibration uncertainty, or an experimental confirmation. The area 𝒜 is the loop area and is distinct from the SSZ metric coefficient A(r)=D²(r)."
    },
    {
      match: /r[_ₛs\\]*\s*=.*2GM|2GM.*c\^?2|Schwarzschild scale/i,
      title: "Mass sets the natural length scale",
      purpose: "This relation converts a central mass into the Schwarzschild length rₛ. Dividing the areal radius r by that length gives x=r/rₛ, so objects with very different masses can be compared on the same dimensionless radial axis.",
      reading: "Start with M in kilograms, multiply by twice the gravitational constant G, and divide by c². The result is a length in metres. The second relation does not introduce new physics; it only measures the chosen radius in units of rₛ.",
      meaning: "Mass changes the physical size represented by one unit of x. It does not change the shape of a universal curve written purely as a function of x.",
      limit: "rₛ is a scale and coordinate location. Naming it does not by itself establish an event horizon, a material surface or a regular interior."
    },
    {
      match: /Xi|\\Xi|Ξ/,
      title: "The segment field selects the local SSZ scaling",
      purpose: "Ξ is the dimensionless field from which the portal derives the clock factor D and the radial scale. Strong, bridge and weak expressions describe different intervals of the same normalized radius x.",
      reading: "Evaluate x=r/rₛ first, choose the branch allowed at that x, and then calculate Ξ. Exponential strong-field terms saturate toward the centre, the quintic bridge matches endpoint data, and the weak branch decreases like 1/(2x).",
      meaning: "A larger Ξ produces a smaller D=1/(1+Ξ) and a larger reciprocal radial scale s=1+Ξ. The field is a model definition; measured consequences require an observable built from it.",
      limit: "The C² bridge is an operational matching prescription. Smoothness through two derivatives does not derive the bridge from a fundamental action or make bridge-sensitive observables unique."
    },
    {
      match: /D\s*=|D\\?frac|D\(|A=D|B=D|AB=1|Ds=1|s=1|g_\{tt\}=-D|gtt/i,
      title: "One field generates reciprocal clock and radial factors",
      purpose: "These identities map Ξ to D, then to the temporal coefficient A=D² and radial coefficient B=D⁻². The reciprocal relation is deliberately locked into the static diagonal ansatz.",
      reading: "Calculate Ξ first. Add one and invert to obtain D; square D for A and invert that square for B. Multiplying A and B must return one, which is a useful implementation check.",
      meaning: "D compares proper time with the chosen static coordinate time, while B controls proper radial distance in the diagonal chart. Neither A nor B is independently adjusted after Ξ is fixed.",
      limit: "An algebraic identity tests internal consistency, not empirical truth. Coordinate coefficients become observables only after a worldline, path and measurement protocol are specified."
    },
    {
      match: /ds\^?2|ds²|g_\{\\?mu\\?nu\}|g_\{μν\}|operatorname\{diag\}|det g|sqrt\{-g\}|vartheta|coframe|flow form|beta\^2|β²/i,
      title: "The line element tells clocks and rulers how to measure intervals",
      purpose: "This metric expression packages the temporal, radial and angular scales of the declared static spherical geometry. Tensor, inverse, determinant, coframe and flow forms are alternative descriptions of the same local interval structure.",
      reading: "Each squared coordinate differential is multiplied by its metric coefficient. The negative temporal term fixes Lorentzian signature; the radial term contains the SSZ scaling; r²dΩ² makes r an areal radius.",
      meaning: "Once the metric is fixed, connections, curvature and geodesics can be derived rather than guessed. Equivalent coordinate forms must reproduce the same invariant predictions within their shared domain.",
      limit: "The displayed ansatz is static and spherical. It does not contain a non-perturbative rotating solution, matter dynamics, radiation reaction or a globally completed interior."
    },
    {
      match: /Gamma|Γ|R\^?\{?\\?rho|Riemann|connection/i,
      title: "Derivatives of the metric build connection and curvature",
      purpose: "The Christoffel connection combines first derivatives of the metric, and the Riemann tensor combines connection derivatives and products. Together they quantify how vectors and trajectories change in curved geometry.",
      reading: "Choose metric components and their inverse, differentiate with respect to coordinates, and contract repeated indices. The Riemann tensor then antisymmetrizes derivative and quadratic connection terms.",
      meaning: "Geodesic acceleration in coordinates depends on Γ, while tidal and invariant curvature information comes from contractions of the Riemann tensor.",
      limit: "Individual connection components are coordinate-dependent. Claims about physical singularities require invariant contractions and a stated domain, not a large Christoffel symbol."
    },
    {
      match: /G_\{\\?mu\\?nu\}|G_\{μν\}|T.*eff|Einstein tensor|8\\pi G|8πG/i,
      title: "Curvature is being read as an effective source diagnostic",
      purpose: "The Einstein tensor contracts curvature into a divergence-free tensor. Dividing it by 8πG defines the effective stress-energy that would source the same metric if the Einstein equation were used diagnostically.",
      reading: "Compute the Ricci tensor and scalar from the metric, form Gμν=Rμν−½Rgμν, and only then convert its components into density and pressures in an orthonormal frame.",
      meaning: "This is a powerful consistency test for energy conditions and source behavior of the chosen geometry.",
      limit: "Without a derived SSZ action and field equations, T_eff is a reconstructed diagnostic. It is not automatically the fundamental matter content of SSZ."
    },
    {
      match: /H_5|H₅|h_\{?0|h00|h10|h20|x_0|x₀|endpoint|k=0,1,2/i,
      title: "A quintic Hermite bridge matches six endpoint conditions",
      purpose: "The bridge polynomial is chosen so its value, first derivative and second derivative agree with the strong branch at one end and the weak branch at the other.",
      reading: "Map the physical interval to t∈[0,1]. Endpoint values, slopes and curvatures multiply six basis functions; their sum yields the unique quintic for those six supplied conditions.",
      meaning: "Matching through k=0,1,2 gives C² continuity and avoids artificial jumps in the field and its first two derivatives.",
      limit: "The polynomial is determined once its boundaries and endpoint data are chosen, but those choices remain model structure. Higher-order behavior inside the bridge can affect strong-field proxies."
    },
    {
      match: /d\\?tau|dτ|nu_o|nu_e|ν_o|ν_e|1\+z|redshift|clock/i,
      title: "Clock rates turn the metric factor into an observable ratio",
      purpose: "These relations compare proper time or frequency at specified radii with the shared static coordinate time. A redshift is a ratio between an emitter and an observer, not a property of one point alone.",
      reading: "Evaluate D at every endpoint. A static clock accumulates dτ=Ddt; frequency ratios follow from comparing those accumulated proper-time rates under the stated convention.",
      meaning: "If the emitter sits deeper where D is smaller, its clock advances more slowly relative to the chosen distant static reference and its received frequency is shifted.",
      limit: "Motion, rotation, propagation medium, cosmological expansion and detector calibration are separate contributions unless explicitly included."
    },
    {
      match: /dr\/dt|\\frac\{dr\}\{dt\}|Delta t|Δt|int.*dr.*D|integrated radial null/i,
      title: "A null path converts the metric into coordinate travel time",
      purpose: "Setting ds²=0 for radial light relates dr to dt. Integrating the reciprocal coordinate speed gives the travel time between two declared radii.",
      reading: "Choose inward or outward sign, evaluate D along the path, and integrate dr/[cD²]. Smaller D reduces the coordinate slope |dr/dt| and increases the coordinate travel time.",
      meaning: "The result is a path-dependent coordinate duration that can enter a complete signal model when endpoints and clocks are specified.",
      limit: "Coordinate speed is not a locally measured violation of c. Non-radial paths, rotation, lens motion and media require their own propagation equations."
    },
    {
      match: /ell\(|ℓ\(|proper radial|int.*dr.*D\(?r?\)?/i,
      title: "Proper radial length accumulates the local radial scale",
      purpose: "This integral converts a coordinate-radius interval into the length measured by a chain of local static radial rulers.",
      reading: "At each radius divide dr by D, equivalently multiply by s=1/D, then integrate between the two endpoints.",
      meaning: "When D<1, the proper radial distance exceeds the coordinate difference r₂−r₁ in this static diagonal chart.",
      limit: "The construction assumes a static spatial slice and the declared radial coordinate. It is not automatically the distance measured along an arbitrary moving trajectory."
    },
    {
      match: /alpha|α|Delta\\theta|Δθ|Shapiro|impact|b\^2|b_\{\\rm crit\}|bcrit/i,
      title: "Impact geometry links a light path to a deflection or critical orbit",
      purpose: "These relations use the impact parameter b to encode how closely a null path approaches the central mass. Weak-field deflection and strong-field critical impact are different approximations of that path problem.",
      reading: "Specify the mass, path endpoints and closest-approach or turning radius. Evaluate the appropriate metric coefficient and keep every factor of c and rₛ consistent.",
      meaning: "A stationary null potential identifies a candidate circular light orbit in the static metric; its radius determines a critical impact proxy.",
      limit: "An observed shadow additionally depends on rotation, inclination, plasma, emission and radiative transfer. A proxy radius is not an image prediction."
    },
    {
      match: /rho_i|ρ_i|chi\^2|χ²|C\^\{-1\}|residual|sigma_i|σ_i/i,
      title: "Residuals compare a forward model with data on an uncertainty scale",
      purpose: "A normalized residual measures model-minus-data mismatch in units of the stated uncertainty. The covariance form combines correlated residuals into a global comparison statistic.",
      reading: "Predict f(x;θ) without looking at the target residual, subtract it from y, and divide by σ for independent points or contract with C⁻¹ for correlated data.",
      meaning: "Values near zero indicate agreement relative to the adopted error model; comparisons between models are meaningful only when data selection and nuisance treatment are shared.",
      limit: "A small residual is not proof of mechanism. Flexible fitting, underestimated covariance, target leakage and multiple testing can all make agreement look stronger."
    },
    {
      match: /v_\{\\rm esc\}|v_\{\\rm fall\}|v₍|v.*esc|v.*fall|c\^2.*v|c²/i,
      title: "Escape and reciprocal fall scales form a kinematic identity",
      purpose: "The escape scale decreases as 1/√x while the complementary fall scale increases as √x. Their product is fixed to c² by construction.",
      reading: "Compute x=r/rₛ. Divide c by √x for escape and multiply c by √x for the reciprocal scale; multiplying cancels x exactly.",
      meaning: "The closure is useful for checking implementations and comparing inward/outward energy scales.",
      limit: "v_fall is not asserted to be a locally measured material speed when it exceeds c. It is a reciprocal kinematic scale inside the model vocabulary."
    },
    {
      match: /Delta\\omega|Δω|Delta\\varpi|Δϖ|perihelion|6\\pi GM|6πGM/i,
      title: "Perihelion advance is a weak-field orbit benchmark",
      purpose: "This first post-Newtonian expression predicts the accumulated rotation of an orbital ellipse per revolution from mass, semimajor axis and eccentricity.",
      reading: "Insert M, a and e in consistent units. Greater mass increases the advance; a larger orbit reduces it; high eccentricity enhances it through 1−e².",
      meaning: "Recovering this leading expression is a necessary Solar-System consistency check for the weak-field metric expansion.",
      limit: "A precision ephemeris also contains multiple bodies, solar multipoles, frame effects and fitted initial conditions. The compact formula is not the full data pipeline."
    },
    {
      match: /mathcal L|ℒ|dot r|ṙ|geodesic|d\^2x|d²x|Gamma.*dx|E=-g|L=g_|V.*eff|L\^2=.*A|E\^2=.*A|Omega\^2|Ω²/i,
      title: "Geodesic dynamics follow from the metric and conserved symmetries",
      purpose: "The Lagrangian or geodesic equation determines free trajectories. Time-translation and rotational symmetries provide conserved E and L, which reduce radial motion to an effective-potential problem.",
      reading: "Insert the metric coefficients, differentiate with respect to the path parameter, and use constants of motion to isolate ṙ². Circular candidates satisfy a first-derivative condition; marginal stability adds a second-derivative condition.",
      meaning: "The resulting photon and timelike orbit radii are mathematical properties of the declared static metric and its bridge.",
      limit: "They are not automatically astrophysical orbit measurements. Rotation, finite-size matter, radiation and bridge sensitivity must be assessed separately."
    },
    {
      match: /\[h_\{ab\}\]|\[K_\{ab\}\]|S_\{ab\}|thin shell|junction/i,
      title: "Junction conditions decide whether a boundary carries a surface layer",
      purpose: "Matching two geometries requires continuity of the induced metric. Continuity of extrinsic curvature removes a distributional thin shell; a jump instead determines a surface stress tensor.",
      reading: "Evaluate each quantity on both sides of the proposed boundary and subtract. Square brackets mean outer value minus inner value at the same matching surface.",
      meaning: "These conditions turn a visually smooth join into a geometric and source-level test.",
      limit: "Proportionality alone is not a completed shell model. Sign conventions, normal orientation, coefficients, equation of state and energy conditions must be supplied."
    },
    {
      match: /K\(r\)|K.*R_|Kretschmann|R\(r\)|Ricci scalar|r\^2.*0|r²|A.*1\/4|A\(r\).*frac14/i,
      title: "Invariant asymptotics test the areal centre",
      purpose: "These limits describe how the present diagonal continuation behaves as the areal radius approaches zero. R and K are curvature invariants, so their divergence cannot be removed by a coordinate relabelling.",
      reading: "Track the leading power of r. A finite A only controls one metric coefficient; R∝r⁻² and K∝r⁻⁴ grow without bound as r→0⁺.",
      meaning: "The result diagnoses a curvature-singular centre for this continuation and motivates a separately derived interior or boundary completion.",
      limit: "It does not prove that every conceivable SSZ completion is singular. Any alternative must publish its own invariants, junctions, source and causal structure."
    },
    {
      match: /dJ|Delta J|ΔJ|Phi_D|Φ_D|2\\pi|2π/,
      title: "Phase is being counted in complete cycles",
      purpose: "J divides an accumulated phase by 2π so angular phase becomes a cycle count. The massive-system route integrates proper frequency, while the detector route subtracts explicitly defined detector phases.",
      reading: "Keep phase signs and reference ownership explicit. One full 2π rotation contributes one count; frequency times proper time gives the number of emitted cycles.",
      meaning: "Expressing the result as a count makes independent phase contributions auditable in a ledger.",
      limit: "A count is only as physical as its forward model, phase convention, calibration and preregistered comparison rule."
    },
    {
      match: /Delta D|ΔD|cos\^2|cos²|2\\sqrt2|2√2|sigma_z|σ_z|hbar|ℏ/,
      title: "A differential clock factor becomes a qubit phase model",
      purpose: "The stable ΔD expression avoids subtracting nearly equal clock factors. Multiplying it by angular frequency and duration yields a relative phase that can be mapped to fidelity or CHSH-style proxies.",
      reading: "Specify both radii, calculate ΔD with the factored expression, form ΔΦ=ωΔDt, and then evaluate the trigonometric observables. The Hamiltonian form identifies the corresponding local Z-phase term.",
      meaning: "The equations predict a deterministic coherent bias within the model and show how an ideal compensation rotation would be chosen.",
      limit: "They do not model hardware noise, decoder behavior or establish quantum gravity. Experimental feasibility requires a full device likelihood and calibration budget."
    },
    {
      match: /H\\psi|Hψ|psi\(r,t\)|ψ\(r,t\)|d\^2\/dr\^2|e\^\{-iE|V\(r\)=-/,
      title: "The toy Hamiltonian defines a finite-box eigenmode problem",
      purpose: "The kinetic second derivative and illustrative effective potential form a one-dimensional Hamiltonian. Diagonalizing its discretized matrix produces mode energies and shapes.",
      reading: "Choose a positive radial grid, evaluate V on it, approximate the second derivative by finite differences, and solve Hψ=Eψ. The exponential phase evolves a stationary eigenmode in time.",
      meaning: "This demonstrates numerical eigenmodes and phase evolution in a controlled toy system.",
      limit: "Dimensionless parameters, a finite box and omitted angular/spin terms prevent interpreting the result as a complete atom, quantum field theory or measured spectrum."
    },
    {
      match: /r = r₀e|d\/dr =|u\(r\)=e/,
      title: "A logarithmic radius redistributes numerical resolution",
      purpose: "The substitution r=r₀eˣ converts multiplicative radial scales into equal steps in x. The derivative and wavefunction rescaling show how the differential problem transforms.",
      reading: "Uniform increments in x multiply r by a constant factor. Apply the chain rule d/dr=(1/r)d/dx before rescaling the dependent variable.",
      meaning: "The method resolves many orders of magnitude without an enormous uniform-r grid.",
      limit: "The coordinate transform improves numerics but does not change the underlying physics or guarantee convergence by itself."
    },
    {
      match: /pₙ|qₙ|det\(∂|symplectic|omega²|ω²/,
      title: "The symplectic update preserves phase-space area",
      purpose: "Momentum is updated before position, producing a map whose Jacobian determinant is one. That geometric property controls long-term Hamiltonian behavior better than explicit Euler.",
      reading: "Advance p using the old q, then advance q using the new p. Compute the derivative of the map to verify unit determinant.",
      meaning: "Area preservation usually keeps oscillatory energy error bounded rather than producing systematic drift.",
      limit: "Symplectic does not mean exact. Step size, force smoothness and integration order still control accuracy."
    },
    {
      match: /C\(t;p,k,R\)|Fₙ|F_n|lcm|gcd|operatorname\{lcm\}/,
      title: "Integer frequencies generate a closed parametric chord pattern",
      purpose: "The two trigonometric coordinates oscillate at integer rates p and k. Their ratio controls the trace, while gcd/lcm determine repetition and closure counts.",
      reading: "Advance t and evaluate both coordinates. When p and k are coprime the curve completes its full combined pattern before repeating; Fibonacci ratios approach φ.",
      meaning: "The display is a precise mathematical relationship between integer modes, closure and golden-ratio convergence.",
      limit: "Geometric resemblance or φ convergence is not a derivation of a gravitational law."
    },
    {
      match: /Z\(t\)|zeta|ζ|Riemann|sign change/,
      title: "A sign change brackets a zero of the Hardy Z function",
      purpose: "The phase-rotated zeta function Z(t) is real on the critical line. Opposite signs at two endpoints imply at least one zero between them by continuity.",
      reading: "Evaluate Z over an interval and locate adjacent samples with opposite signs. Refine each bracket with a root method and rigorous error control when certification is required.",
      meaning: "The sign test is a reliable local bracketing principle for zeros on the critical line.",
      limit: "A finite scan cannot prove that all zeros lie on the critical line or that no even-multiplicity zero was missed."
    },
    {
      match: /1\/π|1\/\\pi|13591409|Chudnovsky|640320/,
      title: "The Chudnovsky series converges rapidly to 1/π",
      purpose: "Factorial growth and the large 640320 denominator make successive terms extremely small, yielding roughly fourteen additional decimal digits per term.",
      reading: "Sum terms from k=0 upward with arbitrary precision, multiply by twelve, and invert the result to recover π.",
      meaning: "The formula explains why high-precision π computation scales efficiently with a modest number of terms.",
      limit: "Displayed JavaScript precision and the asymptotic digit estimate are not substitutes for a certified arbitrary-precision error bound."
    },
    {
      match: /S\(N\)|eta\(N\)|η\(N\)|Amdahl|1−s/,
      title: "Amdahl’s law separates serial and parallel runtime",
      purpose: "The serial fraction s limits the maximum speedup no matter how many workers N are added. Efficiency divides speedup by worker count.",
      reading: "Keep s fixed, increase N, and watch the parallel term shrink while the serial term remains. The speedup approaches 1/s.",
      meaning: "The curve quantifies diminishing returns and helps distinguish algorithmic scaling from raw worker count.",
      limit: "Communication, memory bandwidth, load imbalance and startup costs are absent unless measured separately."
    },
    {
      match: /E\(P\)|E₂|E₃|unit-distance|pᵢ−pⱼ|m²|m³/,
      title: "Exact Euclidean distance defines the graph edges",
      purpose: "Two lattice points are connected only when their Euclidean separation is exactly one. Closed formulas count those unit edges in square and cubic grids.",
      reading: "Generate the m² or m³ points, test each coordinate-neighbor pair, and count one edge per unit separation without double counting.",
      meaning: "The result is invariant under the rigid camera rotation used by the visualization.",
      limit: "Perspective can change apparent screen length, but it cannot change the underlying Euclidean distance or graph count."
    },
    {
      match: /Sagnac|mathcal A|𝒜|4.*Omega|4.*Ω|oint|∮|g_\{0i\}/,
      title: "Counter-propagating paths reveal rotation through a time difference",
      purpose: "The Sagnac expression relates loop area and angular velocity to the return-time difference of opposite propagation directions. The metric integral is its general stationary-spacetime form.",
      reading: "Specify orientation, loop path and rotation. Reverse the propagation direction to obtain the sign change, then compare arrival times at the same detector.",
      meaning: "The effect measures non-time-orthogonality or rotation relative to the chosen loop and observer.",
      limit: "A rotating platform demonstration is not a derived rotating SSZ solution. The full g₀i field and observer congruence must be supplied."
    },
    {
      match: /Delta.*I|Delta.*phi|mathcal.*I|ΔI|Δφ|hbar|ℏ/,
      title: "Reduced action becomes a phase readout",
      purpose: "At fixed energy, the declared reduced stationary bookkeeping maps an odd return-time difference into an action difference and then into a dimensionless phase.",
      reading: "Keep the orientation convention fixed, multiply the time difference by E, and divide the action by ℏ. If using a detector clock, replace coordinate time with the detector proper-time protocol.",
      meaning: "This is the bridge from the kinematic closure recurrence to an interferometric quantity while keeping the detector layer explicit.",
      limit: "The reduced relation is not a complete optical Hamiltonian, a proof of symplecticity for the projected map, or an empirical detector prediction without calibration and uncertainty treatment."
    },
    {
      match: /r_\{?n|rₙ|sigma.*beta|σ.*β|t_\{?n\+1/,
      title: "The signed closure map contracts the remaining distance",
      purpose: "Each correction multiplies the signed remaining distance by σβ and adds its current light-travel contribution to the accumulated time.",
      reading: "Initialize the selected normalized remainder ℓ₀/L and t₀=0, choose σ and β, then iterate one step at a time. Changing ℓ₀/L scales every remainder and time; it does not change the convergence factor |β|. The finite value is compared with the geometric limit only after the same number of declared steps.",
      meaning: "The recurrence exposes both direction sign and convergence rate, making the closure auditable rather than hiding it in a closed formula.",
      limit: "This projected bookkeeping map is not a complete rotating spacetime, a symplectic phase-space flow or an empirical timing model."
    },
    {
      match: /nabla_\{?\\?mu|∇|F\^\{\\?mu|k_\{\\?mu\}k|Maxwell|geometric optics/i,
      title: "Electromagnetic fields and rays propagate on the declared geometry",
      purpose: "Covariant Maxwell equations govern fields, while the null condition is the leading geometric-optics limit for wave vectors.",
      reading: "Use the metric-compatible derivative ∇, specify the current J, solve the field equations, and derive rays only when the wavelength is short compared with curvature scales.",
      meaning: "Geometry enters propagation through derivatives, contractions and null cones rather than by inserting a clock factor into an unrelated flat-space formula.",
      limit: "Plasma dispersion, polarization transport, sources and detector response require additional equations."
    },
    {
      match: /T_\{\\rm kin\}|T_\{kin\}|T_μ|Theta_0|Θ₀|M\(<R|T_\{\\rm BH\}|R_0|R₀/,
      title: "Galactic periods separate measured kinematics from dynamical countermodels",
      purpose: "The kinematic and proper-motion periods use observed speed or angular motion. The enclosed-mass relation tests dynamical consistency, while the Sgr A* point-mass period is a deliberately inadequate countermodel at the Solar radius.",
      reading: "Keep R₀, Θ₀ and μₗ tied to their measurement provenance. Compare periods only after converting units and declaring whether mass is extended or concentrated.",
      meaning: "Agreement between kinematic routes supports the adopted Galactic motion scale; the clock layer is calculated separately from that orbit geometry.",
      limit: "The point-mass countermodel is not a competing best fit, and the SSZ clock correction does not replace the Galaxy’s extended gravitational potential."
    },
    {
      match: /ℒ|mathcal\{L\}|Lagrangian/i,
      title: "The metric Lagrangian generates geodesic motion",
      purpose: "This quadratic Lagrangian inserts the static metric coefficients into the action for an equatorial path. Its three terms represent temporal, radial and angular motion; applying the Euler–Lagrange equations yields the corresponding geodesic equations.",
      reading: "Dots denote derivatives with respect to an affine parameter or proper time, according to the selected trajectory. The minus sign belongs to the temporal part, D⁻² weights radial motion, and r² weights angular motion in the equatorial plane.",
      meaning: "Because t and φ are cyclic coordinates, their conjugate momenta are conserved. Those constants reduce the second-order equations to effective radial dynamics and provide strong numerical conservation checks.",
      limit: "The expression assumes the declared static diagonal metric and equatorial symmetry. It is not a unique fundamental action for matter, a rotating solution or a proof that every inner completion has the same dynamics."
    },
    {
      match: /A.*(?:to|→).*1.?4.*R.*(?:sim|~).*r.*2.*K.*(?:sim|~).*r.*4/i,
      title: "Central asymptotics diagnose the present diagonal continuation",
      purpose: "These three limits state how the temporal coefficient and two curvature invariants behave as the areal radius approaches zero in the currently declared continuation.",
      reading: "A tends to the finite value 1/4, but R grows like r⁻² and the Kretschmann invariant K grows like r⁻⁴. The divergent invariant is decisive because it cannot be removed merely by changing coordinates.",
      meaning: "A finite metric coefficient is not sufficient for a regular centre. Curvature invariants test the geometry itself and expose the solid-angle or areal-radius mismatch hidden by coefficient-only inspection.",
      limit: "The result applies to this diagonal extrapolation. It constrains that construction but does not exclude a separately derived interior, boundary geometry or altered matter sector."
    },
    {
      match: /e_\{?\\hat|ê|partial_t.*partial_r|∂t.*∂r/i,
      title: "The orthonormal frame converts coordinates into local measurements",
      purpose: "These basis vectors remove the metric scale factors so a static observer can report locally Minkowskian time, radial and angular components.",
      reading: "Divide the coordinate-time basis by Dc, multiply the radial basis by D, and normalize angular directions by r and r sinθ. Contracting these vectors with the metric returns the local signature −1,+1,+1,+1.",
      meaning: "Hatted components are physical components measured in this specified local frame, which prevents coordinate speeds or coordinate tensor entries from being mistaken for detector readings.",
      limit: "The frame requires an admissible static observer and is singular where that observer or the spherical coordinates cease to be well defined. Other observers require a Lorentz transformation."
    },
    {
      match: /WEC|DEC|rho.*p_i|ρ.*p/i,
      title: "Energy conditions compare density with principal pressures",
      purpose: "The weak and dominant energy conditions turn an effective stress tensor into explicit inequalities in an orthonormal principal frame.",
      reading: "First project the tensor into the local frame, identify energy density ρ and every principal pressure pᵢ, then test all listed inequalities at every relevant radius rather than at selected samples only.",
      meaning: "WEC asks whether timelike observers measure non-negative local energy in the stated sense; DEC additionally restricts energy flux so pressure magnitudes do not exceed the density scale.",
      limit: "Sampled success is not a proof over a continuum, and an effective tensor inferred from geometry is not automatically a fundamental material source with established dynamics or stability."
    },
    {
      match: /r.?n.*=.*r.?0.*e.*lambda|r.?n.*=.*r₀.*e.*λ/i,
      title: "Exponential spacing creates logarithmic radial segments",
      purpose: "This sequence places successive radii at equal intervals in logarithmic space. Each integer step multiplies the previous radius by the constant factor e^λ.",
      reading: "Choose a reference radius r₀, a dimensionless logarithmic step λ and an integer level n. Positive n moves outward geometrically; negative n moves inward by reciprocal factors.",
      meaning: "Setting λ=lnφ makes neighboring levels differ by the golden ratio, while nearby λ values provide a direct control showing which visual features depend on that choice.",
      limit: "A convenient or visually structured segmentation is not a derivation of the metric, a quantization law or empirical evidence that physical radii must follow this sequence."
    },
    {
      match: /Normalized radius|Golden ratio|Blend coordinate/i,
      title: "Dimensionless coordinates expose the universal profile",
      purpose: "These definitions remove the object-specific length scale or normalize the finite bridge interval. The golden ratio is the fixed dimensionless constant used in the declared strong-branch exponent.",
      reading: "For x, divide the areal radius by rₛ. For the bridge coordinate t, subtract the left boundary 1.8 and divide by the width 0.4, mapping the interval to 0≤t≤1. Evaluate φ=(1+√5)/2 once as a pure number.",
      meaning: "Normalized variables let one curve describe systems with different masses and make polynomial endpoint conditions simple and reproducible.",
      limit: "Normalization changes coordinates and bookkeeping, not physical content. The appearance of φ is a model choice here and does not by itself demonstrate a unique fundamental origin."
    },
    {
      match: /Hermite.*basis|h_\{?(?:10|20|11|21)\}?/i,
      title: "Hermite basis polynomials control endpoint derivatives",
      purpose: "Each quintic basis function carries one endpoint value, slope or curvature contribution while vanishing with the required derivatives at the opposite endpoint.",
      reading: "Evaluate the polynomial and its first two derivatives at t=0 and t=1. The slope bases multiply interval-scaled first derivatives; curvature bases multiply squared-interval-scaled second derivatives.",
      meaning: "Combining all six basis functions produces the unique degree-five interpolant satisfying the six declared C² endpoint conditions.",
      limit: "The basis guarantees the requested smooth match but does not choose the endpoint branches, derive the transition physics or ensure that every bridge-dependent observable is insensitive."
    },
    {
      match: /Null circular-orbit diagnostic|V_\{\\rm null\}|Flow-form radial null slopes|beta.*pm|β.*±/i,
      title: "Null-path formulas distinguish local light cones from orbital structure",
      purpose: "The null potential tests circular light-path candidates in the static diagonal form, while the flow-form slopes display the two radial coordinate directions of the same null cone in a shifted chart.",
      reading: "For the potential, locate extrema of D²/r² and then test accessibility and second derivative. For the flow form, add the inward shift −β to the local outward or inward slopes ±1.",
      meaning: "Both relations describe coordinate representations of null propagation; invariant observables follow only after specifying emitter, observer and complete path.",
      limit: "Neither relation alone is a synthetic image, lensing likelihood or rotating compact-object prediction. Coordinate slopes must never be interpreted as locally measured superluminal speeds."
    },
    {
      match: /Curvature dimensional check|\[R\].*L.*2|\[K\].*L.*4|Raw branch intersection|x_\\times/i,
      title: "Dimensional and intersection equations provide structural checkpoints",
      purpose: "The dimensional identities verify the powers of length carried by curvature scalars; the branch-intersection equation locates where the unblended strong and weak formulas happen to agree in value.",
      reading: "Track one inverse-length power per derivative when checking R and K. For the intersection, solve both sides for the same positive x and report the numerical root and tolerance.",
      meaning: "These checks catch unit errors and clarify branch geometry before a bridge is imposed. They are exact constraints on the declared formulas.",
      limit: "A raw value intersection does not match first or second derivatives and therefore does not replace the C² bridge. Correct dimensions alone do not establish a correct physical model."
    },
    {
      match: /Radial coefficient derivative|B'.*D|Static-observer radial acceleration|a\^\{\\hat r\}/i,
      title: "Radial derivatives connect metric scaling to local acceleration",
      purpose: "Differentiating B=D⁻² exposes how the radial coefficient changes, while the orthonormal static-observer acceleration converts the derivative of D into a locally framed acceleration scale.",
      reading: "Apply the chain rule to B to obtain −2D⁻³D′. For the local acceleration, differentiate D with respect to physical radius, multiply by c², and retain the sign convention of the outward radial basis.",
      meaning: "These relations connect smoothness of the primary clock factor to connection coefficients, static support acceleration and curvature calculations.",
      limit: "Static-observer acceleration is not the acceleration felt by a freely falling observer, and it is defined only where the selected static frame is physically admissible."
    },
    {
      match: /Combined schematic frequency map|nu_\{\\rm obs\}|ν.*obs.*ν.*emit/i,
      title: "Observed frequency combines gravity, motion and transfer",
      purpose: "This schematic factorization keeps the gravitational endpoint ratio, Doppler factor and propagation or instrument transfer separate instead of assigning every shift to D.",
      reading: "Start with the emitted frequency, apply Dₑ/Dₒ under the page’s convention, then multiply by the kinematic factor δ and the transfer factor 𝒯. Each factor needs its own uncertainty and provenance.",
      meaning: "The equation is a forward-model checklist: a real spectral comparison is credible only when all material effects and reference frames are accounted for.",
      limit: "The product is schematic until δ and 𝒯 are physically specified. It cannot support an SSZ detection by fitting an unexplained residual with a clock factor alone."
    },
    {
      match: /PPN temporal metric expansion|g_\{tt\}.*U|beta U\^2|β.*U²/i,
      title: "The PPN expansion compares weak-field coefficients order by order",
      purpose: "This expansion writes the temporal metric in powers of the small Newtonian potential U/c² so the first- and second-order coefficients can be compared with post-Newtonian reference theory.",
      reading: "The constant −1 is flat spacetime, 2U/c² is the leading gravitational correction, and β controls the quadratic term. Terms denoted O(c⁻⁶) are deliberately omitted at this order.",
      meaning: "Matching a PPN coefficient is a meaningful weak-field compatibility test shared by clocks, orbital dynamics and other precision observables.",
      limit: "Leading-order agreement does not make two full theories identical. Higher orders, spatial coefficients, preferred-frame terms and the complete measurement model may still distinguish them."
    },
    {
      match: /Bayesian information criterion|Akaike information criterion|mathrm\{BIC\}|mathrm\{AIC\}/i,
      title: "Information criteria balance fit against model flexibility",
      purpose: "AIC and BIC penalize the best-fit likelihood by the number of fitted parameters so a more flexible model is not rewarded solely for reducing residuals.",
      reading: "Use the maximized likelihood L̂ and the same data likelihood for every candidate. AIC adds 2k; BIC adds k ln n, so BIC’s complexity penalty grows with sample size.",
      meaning: "Only differences between criteria computed on the same dataset and likelihood are interpreted; smaller values indicate the preferred predictive tradeoff under that criterion.",
      limit: "Neither score is a posterior probability or proof of physical truth. Correlated data, effective parameter counts, priors, misspecified noise and data reuse can invalidate a naive comparison."
    },
    {
      match: /f_n|sqrt\{n\(n\+1\)\}|Schumann|Delta f|Δf|delta_\{\\rm seg\}/,
      title: "Mode frequencies and a common fractional shift are separate hypotheses",
      purpose: "The baseline expression gives idealized spherical-cavity mode frequencies. A common fractional shift would move every mode by approximately the same relative amount.",
      reading: "Choose radius, propagation factor η and integer n for the baseline. Apply the same small fractional δ_seg to each mode only when testing the common-shift hypothesis.",
      meaning: "Comparing absolute frequencies and relative shifts helps distinguish a shared clock-like effect from mode-dependent environmental changes.",
      limit: "Real Schumann spectra depend strongly on ionosphere, conductivity, weather and station response; those nuisance variables must be modeled."
    },
    {
      match: /E.*total|Σ|\\sum/,
      title: "A total is being decomposed into declared contributions",
      purpose: "The sum states bookkeeping: total energy or another aggregate equals the contributions assigned to indexed components or segments.",
      reading: "Define every Eᵢ with units, sign and boundary convention before adding. Verify that no cross term or shared contribution is counted twice.",
      meaning: "A transparent decomposition makes conservation and attribution tests possible.",
      limit: "The summation sign does not derive the component energies or prove that the chosen decomposition is unique."
    }
  ];
  const symbolLexicon = [
    [/Ξ|\\Xi/, "Ξ — dimensionless SSZ segment field"],
    [/(^|[^A-Za-z])D([^A-Za-z]|$)|D\(/, "D — dimensionless static clock factor"],
    [/r_s|rₛ|r_\{s\}/, "rₛ — Schwarzschild length 2GM/c², measured in metres"],
    [/(^|[^A-Za-z])x([^A-Za-z]|$)|x=/, "x — normalized areal radius r/rₛ"],
    [/(^|[^A-Za-z])G([^A-Za-z]|$)|8πG/, "G — Newtonian gravitational constant"],
    [/(^|[^A-Za-z])M([^A-Za-z]|$)|GM/, "M — central or enclosed mass, normally in kilograms"],
    [/(^|[^A-Za-z])c([^A-Za-z]|$)|c\^|c²/, "c — vacuum speed of light"],
    [/φ|\\varphi|\\phi/, "φ — golden ratio (1+√5)/2 where used by the strong branch"],
    [/(^|[^A-Za-z])A([^A-Za-z]|$)|A\(/, "A — temporal metric magnitude D²"],
    [/(^|[^A-Za-z])B([^A-Za-z]|$)|B\(/, "B — radial metric coefficient D⁻²"],
    [/τ|\\tau/, "τ — proper time carried by a specified clock"],
    [/ν|\\nu|f_0|f₀/, "ν or f₀ — frequency with the stated emitter/reference convention"],
    [/(^|[^A-Za-z])z([^A-Za-z]|$)|1\+z/, "z — redshift under the displayed convention"],
    [/(^|[^A-Za-z])E([^A-Za-z]|$)|E\^|E²/, "E — energy or conserved energy parameter, as defined locally"],
    [/(^|[^A-Za-z])L([^A-Za-z]|$)|L\^|L²/, "L — angular momentum or conserved angular-momentum parameter"],
    [/λ|\\lambda/, "λ — affine/path parameter, wavelength or model parameter as defined in context"],
    [/Γ|\\Gamma/, "Γ — Christoffel connection coefficient"],
    [/R_\{|R\(|Ricci/, "R — Ricci scalar or radius only as identified by the local label"],
    [/K\(|Kretschmann/, "K — Kretschmann curvature invariant"],
    [/ρ|\\rho/, "ρ — density or normalized residual, determined by local context"],
    [/θ|\\theta/, "θ — polar angle or model parameter, determined by context"],
    [/Φ|\\Phi/, "Φ — accumulated phase in radians"],
    [/ω|\\omega|Ω|\\Omega/, "ω or Ω — angular frequency or rotation rate"],
    [/ℏ|\\hbar/, "ℏ — reduced Planck constant"],
    [/ψ|\\psi/, "ψ — wavefunction or numerical eigenmode"],
    [/(^|[^A-Za-z])b([^A-Za-z]|$)|b_\{/, "b — impact parameter"],
    [/a\(|(^|[^A-Za-z])a([^A-Za-z]|$)/, "a — semimajor axis or polynomial coefficient, determined by context"],
    [/(^|[^A-Za-z])e([^A-Za-z]|$)|e\^/, "e — eccentricity or exponential base, determined by context"],
    [/(^|[^A-Za-z])N([^A-Za-z]|$)|N\)/, "N — worker, sample or mode count, as defined locally"]
  ];
  const visualRules = [
    [/rh-zeta-canvas/, "Live finite zeta approximation", "Move t, sigma and the truncation length N. Compare the real and imaginary traces and read the current complex magnitude at the marker.", "The plot turns a finite alternating Dirichlet approximation into a moving complex-valued trace, making oscillation and near-zero samples visible.", "Finite N, browser floating point and the denominator factor are illustrative only. A plotted near-zero point is not a rigorous zero certificate."],
    [/rh-plane-canvas/, "Alpha-strip and critical-line map", "Move the real and imaginary parts of α. Read the mapped real part of s and the status badge; β=0 is shown as the critical line, not as a forbidden region.", "The plane makes the parameter map s=1/2+iα=1/2−β+iξ visible and separates the tested open half-strip from its reflected partner.", "This is a schematic parameter map. It does not locate numerical zeros or replace the Xi transform, Green identity or independent review."],
    [/rh-theta-canvas/, "Positive theta source and weighting", "Move β and compare the positive rapidly decaying source with the weighted reference line. The control is a parameter probe, not a replacement for the repository's certified infinite series.", "The canvas communicates why Gaussian tails make the Volterra integrals absolutely convergent and why the allowed strip matters.", "It is a schematic profile display; rigorous convergence and Xi normalisation are established by the source theorem and certificate, not by pixels."],
    [/rh-decay-canvas/, "Endpoint flux decay", "Vary β and a fixed finite |α|. Watch the bound shrink toward zero as R increases, while the displayed Cα,β remains finite for every admissible parameter.", "The curve visualises the analytic factor Cα,β exp(−2βR) used to remove the two endpoint terms from the Green identity.", "The browser uses rounded illustrative constants and does not certify the published Arb bounds or the β=0 case."],
    [/rh-matrix-canvas/, "Lyapunov residual Schur margin", "Vary β and the illustrative correction parameter k. Read the matrix cells and the Gβ output together; green means the displayed toy margin is positive.", "The four cells explain the positive top-left entry, off-diagonal correction and Schur complement that the exact symbolic residue theorem identifies.", "The canvas is explanatory only. Exact positivity comes from the repository's compact, far-field and Sturm certificates; an illustrative k is not the certified correction function."],
    [/rh-frequency-canvas/, "Prime and composite logarithmic frequencies", "Read each bar at index n as the Dirichlet frequency log n with displayed amplitude n to the power minus sigma. Prime indices use the prime color; composites use the composite color and appear as the animation reveals larger n.", "Unique factorisation gives log n as a non-negative integer combination of prime logarithms, so the highlighted prime bars are generators of the finite frequency spectrum rather than a claim of one common period.", "This native canvas is explanatory follow-up research. Its animated finite spectrum is not a proof dependency and does not numerically certify zeta zeros."],
    [/rh-phase-canvas/, "Prime-log phase recurrence", "Follow the moving point and its accumulated trail in the wrapped (t log 2, t log 3) phase square. Read the return score, which also tests log 5, and compare close approaches with the exact origin.", "The torus projection makes simultaneous approximate recurrence of finitely many rationally independent prime-log frequencies visible without pretending that they possess a common finite period.", "This is finite exploratory geometry. A small displayed return score is neither an exact period, a zero of zeta, nor evidence used by the RH proof candidate."],
    [/atlas-map/, "Repository topology", "Select a node and compare its size and colour with the legend. Use the linked filters to move from a relationship overview to the underlying repository cards.", "Node size encodes indexed file count on a logarithmic scale; colour encodes research domain. Connections describe catalogue relationships.", "Dense or large nodes are not stronger evidence. The graph measures project organization, not scientific validity."],
    [/claim-graph/, "Claim dependencies", "Select a claim or lock and follow every incoming and outgoing edge. Cross-check the selected node against the textual ledger and source hash.", "Edges represent declared logical or provenance dependence: a downstream statement may fail if an upstream definition, implementation or evidence item changes.", "The network is not a causal graph of nature and edge count is not evidential weight."],
    [/metric-chart|metric-branches|regime-canvas|continuity-canvas|weak-field-canvas/, "Radial branches and limits", "Move the radius control slowly across marked boundaries and compare values before comparing derivatives or residuals. Toggle logarithmic axes when available.", "Coincident curves show agreement at the displayed resolution; derivative and residual panels reveal differences hidden by an ordinary linear plot.", "Screen overlap is not exact equality. Read numerical outputs and branch labels, and do not extrapolate a branch outside its declared domain."],
    [/metric-geometry|radial-canvas|components-canvas|metric-coefficients/, "Metric scaling", "Change the normalized radius and watch Ξ, D, temporal scale and radial scale update together. Compare reciprocal quantities rather than treating them as independent controls.", "The geometry is a visual encoding of A=D² and B=D⁻². Stretching and clock symbols communicate coefficient changes; the displayed sizes are not literal objects.", "Projection and animation are explanatory. Invariant physical conclusions require equations, not apparent pixel distances."],
    [/dynamics-potential|potential-canvas|certificate-chart|blend-lab-canvas/, "Effective-potential and bridge sensitivity", "Vary radius, angular momentum or bridge parameters and watch stationary points move. Compare the candidate value with its residual and sensitivity interval.", "Extrema identify circular-orbit candidates of the declared static metric. Movement under bridge variation quantifies model dependence.", "A stationary point is not an observed photon ring or ISCO. Rotation, plasma, stability and emission physics remain separate."],
    [/emergence-canvas|phi-canvas/, "Conceptual pattern geometry", "Change symmetry, wavelength or logarithmic spacing and observe how the pattern reorganizes. Compare the golden-ratio setting with nearby deliberate alternatives.", "The animation demonstrates interference or nested geometric structure and makes parameter dependence visible.", "This module is conceptual. Visual resemblance does not derive the canonical metric or provide experimental evidence."],
    [/jif-phase/, "Counted phase comparison", "Change radius, proper frequency and duration. Watch the SSZ phasor lag or advance relative to the infinity reference and compare the count ledger.", "Angular separation represents accumulated phase difference; the numeric lag converts that angle into cycles.", "Animation speed is scaled for perception. A detector prediction needs calibration, noise and a preregistered phase convention."],
    [/jif-ledger/, "Detector phase ledger", "Adjust emission, transfer, interaction-node and detector contributions one at a time. Check both the unwrapped total and wrapped phase.", "Vector addition preserves the sign and ownership of each contribution, making cancellation and degeneracy visible.", "A wrapped endpoint alone cannot identify which physical contribution caused it; the full ledger must be retained."],
    [/closure-canvas/, "Recursive closure and odd Sagnac convergence", "Change β, the normalized starting remainder ℓ₀/L and σ, then use Next step or Animate. Read the signed remaining-distance trace above and the odd-sector partial sum below; compare both finite values with their exact limits.", "The upper trace evaluates ℓₙ₊₁=σβℓₙ and the lower trace evaluates the synchronized odd projection. Changing ℓ₀/L scales amplitudes and normalized times but leaves the convergence factor |β| unchanged; the adaptive upper axis keeps both direction modes visible.", "The plot is a declared kinematic recurrence and reduced bookkeeping visualization. It is not a rotating-spacetime solution, a symplecticity proof or a detector measurement."],
    [/math-radial/, "Log-radial eigenmodes", "Vary mode number and log-grid extent. Count nodes and watch how equal screen spacing in x corresponds to multiplicative spacing in r.", "The displayed family explains the coordinate transform and mode structure used by a numerical radial solver.", "It is a normalized teaching reconstruction, not an eigenvalue certificate for every boundary condition."],
    [/math-symplectic/, "Integrator phase-space behavior", "Increase the step size and compare the closed symplectic orbit with explicit Euler. Read the maximum relative energy drift for both.", "Bounded oscillatory error and preserved phase-space area distinguish the symplectic update from secular Euler drift.", "A visually closed curve does not prove adequate accuracy; convergence must still be checked against smaller steps."],
    [/math-chord|chord-canvas/, "Integer-mode chord curve", "Change p and k, especially between coprime and non-coprime pairs. Compare k/p with φ and observe how closure and repetition change.", "The curve is determined exactly by two integer frequencies; gcd and lcm explain its repetition structure.", "The animation demonstrates mathematics, not a unique physical mechanism behind SSZ."],
    [/math-zeta/, "Hardy-Z zero bracketing", "Move the scan centre and width, then count sign-change brackets. Pause near a crossing to distinguish a bracket from a plotted sample point.", "A sign change certifies at least one odd-multiplicity zero inside the interval under continuity.", "Finite sampling can miss narrow or even-multiplicity behavior; rigorous interval arithmetic belongs in the source solver."],
    [/math-pi/, "Series convergence", "Increase the number of terms and compare the estimated correct digits with the expected roughly fourteen digits per term.", "The steep curve visualizes the rapid decrease of Chudnovsky-series truncation error.", "Browser floating-point display saturates; arbitrary-precision output and an error bound are needed for certification."],
    [/math-hpc/, "Parallel scaling", "Increase workers at several serial fractions. Watch speedup flatten while efficiency falls, then compare the plateau with 1/s.", "The graph isolates Amdahl’s theoretical serial bottleneck.", "It omits measured communication, memory and scheduling overhead unless those are added as data."],
    [/math-grid/, "Exact unit-distance graph", "Switch between 2D and 3D, vary m, and rotate the camera. Verify that point and edge counts do not change with view angle.", "Camera motion changes projection only; exact Euclidean unit edges and combinatorial counts remain invariant.", "Apparent screen length is not the distance test. Use the underlying coordinates and formula."],
    [/metric-velocities/, "Dual velocity scales", "Drag across x=1 and compare escape, reciprocal fall and their product. Notice which quantity falls and which rises.", "The product remains c² because the normalized-radius factors cancel exactly.", "The reciprocal fall scale is not a locally measured superluminal matter velocity."],
    [/metric-limits|curvature-canvas|interior-canvas/, "Centre asymptotics", "Move logarithmically toward r=0 and compare the finite metric coefficient with the growing curvature invariants.", "Different slopes on the log plot encode r⁻² and r⁻⁴ divergence, showing why one finite coefficient cannot establish regularity.", "The result diagnoses the displayed continuation. It does not prejudge a separately derived and fully matched interior."],
    [/qubit-canvas/, "Qubit phase accumulation", "Vary height, frequency and elapsed time separately. Apply compensation and compare the raw phase, fidelity proxy and compensated trace.", "The slope shows deterministic accumulation proportional to ωΔD; compensation removes the ideal coherent phase in the model.", "Hardware noise, syndrome extraction and logical error are not simulated."],
    [/qm-canvas/, "Finite-box wave toy", "Change mode number and potential scale, then pause phase animation to compare spatial nodes with the rescaled potential.", "Gold is a schematic eigenmode-like shape and blue is the effective potential on a shared display window.", "The two vertical scales are rescaled for communication and are not measured data or a full quantum solution."],
    [/snapshot-chart/, "Test snapshot chronology", "Read the snapshots in date order and compare execution context before comparing green totals.", "The chart separates historical, audit and current captures so superseded interpretations remain visible.", "A later or larger total is not automatically more independent or scientifically stronger."],
    [/diagnostic-chart/, "Tolerance consumption", "For each diagnostic compare the displayed value with its encoded tolerance and inspect the underlying assertion.", "A shorter fraction means more numerical margin inside that specific test threshold.", "Threshold margin is not measurement significance and tolerances from different tests are not commensurate evidence."],
    [/artifact-category|artifact-quantity/, "Catalogue composition", "Compare bar lengths, then open the searchable records to see which repositories and source files create each count.", "The chart reveals where the test corpus is concentrated by technical category or scientific quantity.", "Artefact frequency measures documentation and implementation activity, not independent confirmation."],
    [/evaluation-chart|evaluation-ci|evaluation-bin/, "Paired model evaluation", "Compare models on the same paired cases, then inspect bootstrap intervals and the number of samples supporting each mass bin.", "Median residuals summarize the supplied sample; intervals show resampling uncertainty and bin bars expose sparse support.", "Dataset selection, model flexibility and external replication remain outside the plotted paired comparison."],
    [/clocks-canvas|spectrum-canvas/, "Clock and spectral comparison", "Move emitter and observer radii independently. Watch D at both endpoints before reading the clock ratio or shifted wavelength.", "The visualization turns a local rate ratio into accumulated clock separation or a received spectral shift.", "Static gravitational terms are isolated; motion, medium and instrumental calibration are not silently included."],
    [/null-canvas/, "Integrated radial light path", "Change start and end radii and compare the curved-metric travel time with the flat reference over the same coordinate interval.", "The separation accumulates because the coordinate null slope depends on D² along the entire path.", "This is radial propagation in the static metric, not a general lensing or rotating-spacetime ray trace."],
    [/lensing-canvas/, "Weak-field deflection geometry", "Increase the impact parameter and observe the bend decrease. Compare the numeric α output rather than estimating the drawn angle by eye.", "The teaching path visualizes the leading inverse-impact scaling.", "The curve is display-scaled and is not a strong-field geodesic integration or telescope image."],
    [/starmap-canvas/, "Catalogue projection", "Filter distance, magnitude and colour field; drag, zoom and select stars. Compare coordinate projections while keeping the selected source fixed.", "Every point comes from the displayed catalogue subset; colour and position encode chosen data fields and projection.", "Projection density and colour do not establish an SSZ effect. Catalogue selection and astrometric uncertainty remain explicit."],
    [/galactic-/, "Solar Galactic orbit layers", "Switch among measurements, dynamics and clock modes; rotate the 3D view and compare top, side and clock panels at the same time value.", "The synchronized panels separate adopted kinematics, vertical display scaling, point-mass countermodel and the small SSZ clock diagnostic.", "The vertical exaggeration is labelled, the Sgr A* model is intentionally inadequate at R₀, and the clock layer does not alter the orbit."],
    [/schumann-canvas/, "Schumann baseline and common shift", "Vary cavity radius, propagation factor, mode count and common fractional shift. Compare absolute and relative displacement across modes.", "A truly common shift moves every mode by the same fraction, unlike many environmental changes.", "The explorer is a hypothesis diagnostic; real ionospheric and station effects require data and nuisance models."],
    [/sagnac-canvas/, "Counter-propagating loop timing", "Change loop radius and rotation rate. Follow both pulses to the same moving detector and compare the calculated return-time difference.", "The difference grows linearly with angular speed and quadratically with loop radius in the displayed approximation.", "Animation speed and pulse positions are scaled; this is a Sagnac reference, not a rotating SSZ solution."],
    [/geodesic-canvas/, "Static-metric geodesic integration", "Choose null or timelike motion, set E, L, initial radius and step size, then rerun while monitoring turning points and constraint residual.", "The trajectory panel and potential panel are two views of the same first-integral dynamics.", "A finite numerical path with small residual does not prove maximal geodesic completeness or astrophysical stability."],
    [/independence-canvas/, "Evidence dependence clusters", "Select or compare clusters and trace shared repository, file, formula and data provenance in the accompanying table.", "Clustering exposes why many catalogue records may rely on the same underlying implementation or reference.", "Distance between drawn nodes is organizational, and the graph cannot infer an exact number of independent experiments."],
    [/interior-sandbox/, "Hypothetical interior matching", "Vary A(0), A″(0) and matching radius. Check signature, three continuity residuals and curvature behavior together.", "The polynomial is constrained by centre conditions and exterior matching; failed checks reject that candidate immediately.", "Passing local conditions is not a derived field-equation solution and does not establish matter consistency, stability or global causality."]
  ];
  const figureRules = {
    "g1_g2_boundary_physics.png": ["Branch-boundary comparison", "Read the horizontal location relative to the declared G1/G2 or branch convention before comparing curves. Identify which interpolation generated every segment.", "The figure documents how a boundary prescription changes a model output.", "Historic boundary conventions may be superseded; compare with the current 1.8–2.2 C² lock."],
    "reports_figures_metric_and_dilation.png": ["Metric and dilation relationship", "Match every plotted curve to Ξ, D or a metric coefficient and check whether the radius is physical or normalized.", "The plot illustrates how one field propagates into clock and radial coefficients.", "A plotted coefficient is not itself an observed clock or a proof of central regularity."],
    "model_comparison_trajectories.png": ["Trajectory model comparison", "Check that initial conditions, coordinates and integration intervals are identical before comparing path separation.", "Differences show consequences of the compared forward models under the plotted setup.", "A trajectory plot without data uncertainties is not a model-selection result."],
    "model_comparison_potential.png": ["Potential model comparison", "Compare normalization, radial domain and zero point before interpreting wells or extrema.", "Potential differences help locate where models may generate distinct dynamics.", "Potential shape is coordinate/model dependent and does not alone predict an observable."],
    "model_comparison_phase.png": ["Phase model comparison", "Identify the phase reference, oscillator/path and whether the plot is wrapped or unwrapped.", "The separation shows accumulated timing differences under the plotted assumptions.", "Phase is only observable relative to a calibrated reference with noise and cycle ambiguity controlled."],
    "observational_predictions.png": ["Historic prediction overview", "Treat each item as a proposed observable chain and check its current evidence label elsewhere in the portal.", "The figure records the programme’s intended empirical touchpoints.", "The word prediction in a historic plot may include proxies or hypotheses; it does not guarantee a completed likelihood."],
    "energy_release_profile.png": ["Energy-release forward model", "Read the radial/time coordinate, component definitions and normalization before locating peaks or integrated totals.", "The profile shows where the encoded decomposition assigns energy release.", "Its amplitude and shape inherit the source model, segmentation and boundary assumptions."],
    "qnm_frequency.png": ["Quasinormal-mode proxy", "Identify whether axes show absolute frequency, normalized frequency or deviation from a reference, and which compact-object parameters were adopted.", "The figure explores how a proxy frequency changes across models.", "Without a perturbation-derived rotating waveform and detector response it is not a complete ringdown prediction."]
  };

  function headingFor(element) {
    const article = element.closest("article");
    const articleHeading = article?.querySelector("h3,h2");
    if (articleHeading) return articleHeading.textContent.trim();
    const section = element.closest("section");
    if (section) {
      const preceding = [...section.querySelectorAll("h2,h3")]
        .filter(heading => heading.compareDocumentPosition(element) & 4)
        .pop();
      if (preceding) return preceding.textContent.trim();
    }
    return element.previousElementSibling?.textContent.trim() || document.title;
  }
  function ruleForFormula(text, heading = "") {
    const source = `${heading} ${text}`;
    const h = heading.toLowerCase();
    const scoped = (title, purpose, reading, meaning, limit) => ({title, purpose, reading, meaning, limit});
    if (/A_\{?p|log.?p.*sqrt|Phi_\{?p|Φ.*log.?p/i.test(text)) return scoped(
      "Prime-indexed recurrences reproduce the known explicit-formula structure",
      "For each prime p, repeated-orbit amplitudes scale by p⁻¹ᐟ² and phases advance by E log p. Summing these indexed cycles reproduces the prime-power terms already present in the zeta explicit formula.",
      "Keep p as the primitive-cycle label and r as its repetition count: Aₚ,ᵣ₊₁=Aₚ,ᵣ/√p and Φₚ,ᵣ₊₁=Φₚ,ᵣ+E log p. Compare the direct sum with the recursive implementation under identical truncation and smoothing.",
      "The agreement tests a mathematically known trace decomposition and supports the organizational analogy between prime powers and repeated cycles.",
      "This is not an independently derived Hamiltonian, a proof of self-adjointness or a proof that the zero spectrum is generated by those cycles. Correlation with the explicit formula is not an independent confirmation of RH."
    );
    if (/^at .*r.*r.?s/.test(h)) return formulaRules.find(rule => /horizon-radius values/.test(rule.title));
    if (/required calculation/.test(h)) return formulaRules.find(rule => /Geodesic dynamics/.test(rule.title));
    if (/static diagonal ansatz/.test(h) && /D|Xi|A=|AB=/.test(text)) return formulaRules.find(rule => /One field generates/.test(rule.title));
    if (/c² bridge|c2 bridge/.test(h)) return formulaRules.find(rule => /quintic Hermite/.test(rule.title));
    if (/horizon result/.test(h) && /A.*(?:→|to|1.?4)|R.*(?:sim|~)/i.test(text)) return formulaRules.find(rule => /Invariant asymptotics/.test(rule.title));
    if (/waveform inference|classical structure|counter-propagating signals/.test(h)) return formulaRules.find(rule => /Counter-propagating/.test(rule.title));
    if (/^mathematical$/.test(h) || /test identities and limits/.test(h)) return formulaRules.find(rule => /One field generates/.test(rule.title));
    if (/spectral bridge|hilbert.?p[oó]lya|zeta action/.test(h) && /I.*E|quant|mu|μ/.test(text)) return scoped(
      "The spectral bridge is a quantization hypothesis, not an identity",
      "This relation asks whether a closed-orbit action could quantize a self-adjoint spectrum whose values are compared with the ordinates γₙ of the zeta zeros. It does not place zeros geometrically on a Poincaré–Cartan one-form.",
      "Define the Hamiltonian, its domain, boundary conditions and contour family first. Only then evaluate the action, Maslov index and units before comparing Eₙ with independently computed γₙ.",
      "A successful construction would connect classical actions, quantization and a spectral counting law; the portal currently records this as an open research bridge.",
      "The Poincaré–Cartan form alone exists for many Hamilton systems and supplies no zeta spectrum. Self-adjointness, exact eigenvalue matching, trace formula and completeness remain unproved."
    );
    if (/spectral bridge|prime cycles|primitive cycles|zeta action/.test(h) && /p\^|log p|prim|osc|A_|Phi|Φ/.test(text)) return scoped(
      "Prime-indexed recurrences reproduce the known explicit-formula structure",
      "For each prime p, repeated-orbit amplitudes scale by p⁻¹ᐟ² and phases advance by E log p. Summing these indexed cycles reproduces the prime-power terms already present in the zeta explicit formula.",
      "Keep p as the primitive-cycle label and r as its repetition count: Aₚ,ᵣ₊₁=Aₚ,ᵣ/√p and Φₚ,ᵣ₊₁=Φₚ,ᵣ+E log p. Compare the direct sum with the recursive implementation under identical truncation and smoothing.",
      "The agreement tests a mathematically known trace decomposition and supports the organizational analogy between prime powers and repeated cycles.",
      "This is not an independently derived Hamiltonian, a proof of self-adjointness or a proof that the zero spectrum is generated by those cycles. Correlation with the explicit formula is not an independent confirmation of RH."
    );
    if (/null paths/.test(h) && /alpha|γ|impact|b/.test(text)) return formulaRules.find(rule => /Impact geometry/.test(rule.title));
    if (/canonical weak branch/.test(h) && /D\(/.test(text)) return formulaRules.find(rule => /One field generates/.test(rule.title));
    // Headings are a semantic namespace. They take precedence over broad
    // symbol matches so a shared symbol such as D, A, Γ or Δt cannot borrow
    // an explanation from a neighbouring formula family.
    if (/^connection$|christoffel/.test(h)) return scoped(
      "Christoffel symbols encode the metric connection",
      "The Christoffel connection is built from the first coordinate derivatives of the metric and its inverse. It is the coefficient-level object used to express parallel transport and geodesic acceleration in the selected coordinates.",
      "Insert the metric and inverse metric, differentiate with respect to the coordinates, and sum the repeated indices. Keep the index order and sign convention fixed before using the result in the geodesic equation.",
      "A connection coefficient describes how the coordinate basis changes; it is not itself a curvature invariant or a directly measured force.",
      "Individual Christoffel symbols change under coordinate transformations. Physical singularity claims require invariant contractions, a stated domain and an admissible observer or path."
    );
    if (/curvature/.test(h) && !/invariant|centre|center/.test(h)) return scoped(
      "The Riemann tensor measures curvature of the connection",
      "The Riemann tensor combines derivatives of the Christoffel connection with quadratic connection products and antisymmetrizes the derivative pair. It is the next geometric layer after the metric and connection.",
      "Differentiate the connection in the two indicated coordinate directions, subtract in the stated order, and add the two quadratic contractions. Then contract only when a Ricci or scalar invariant is required.",
      "Riemann components describe tidal deviation and curvature transport; Ricci and Kretschmann contractions provide coordinate-independent diagnostics when their indices are fully contracted.",
      "Component values depend on coordinates and conventions. A physical conclusion requires the invariant, sign convention, domain and observer scope to be stated explicitly."
    );
    if (/effective source/.test(h)) return scoped(
      "The effective source is reconstructed from curvature",
      "The Einstein tensor combines the Ricci tensor and scalar curvature. Dividing it by 8πG defines the effective stress tensor that would reproduce the declared metric in an Einstein-equation diagnostic.",
      "Compute curvature from the metric first, form Gμν=Rμν−½Rgμν, and project to the stated orthonormal frame before identifying density or principal pressures.",
      "This layer translates geometry into source-like diagnostics and permits explicit energy-condition checks without claiming that the reconstructed tensor is fundamental matter.",
      "Without a derived SSZ action and field equations, T_eff is diagnostic rather than a unique physical source. Energy-condition results remain domain- and frame-dependent."
    );
    if (/lagrange|geodesic dynamics/.test(h)) return scoped(
      "The metric Lagrangian generates geodesic dynamics",
      "The quadratic Lagrangian inserts the declared temporal, radial and angular metric factors into the action of an equatorial path. Euler–Lagrange variation yields the corresponding geodesic equations and conserved quantities.",
      "Treat dots as derivatives with respect to the declared affine parameter or proper time. Differentiate with respect to each coordinate and use cyclic coordinates only after the metric and symmetry assumptions are fixed.",
      "The resulting constants and effective potential make trajectory integration and conservation residuals auditable consequences of the metric ansatz.",
      "This is not a complete matter action, rotating solution or global interior theory. Initial conditions, parameterization and numerical tolerances remain part of any trajectory claim."
    );
    if (/hamiltonian flow|symplectic/.test(h)) return scoped(
      "The symplectic update preserves phase-space area",
      "The split update advances momentum and then position in an order whose Jacobian has unit determinant. It is a numerical integration map for the declared oscillator, not a new physical law.",
      "Use the old position for the momentum kick, the updated momentum for the position drift, and evaluate the Jacobian with respect to the original phase-space coordinates.",
      "Area preservation helps control long-term Hamiltonian drift and makes the numerical method’s geometric property directly testable.",
      "Symplectic does not mean exact: step size, smoothness, order and finite precision still determine the approximation error."
    );
    if (/count phase cycles|proper-time accumulation|detector-defined difference/.test(h)) return formulaRules.find(rule => /Phase is being counted/.test(rule.title));
    if (/static clock comparison|static redshift|static clocks|static clock/.test(h)) return formulaRules.find(rule => /Clock rates/.test(rule.title));
    if (/radial null travel|null paths/.test(h)) return formulaRules.find(rule => /null path/.test(rule.title));
    if (/proper radial/.test(h)) return formulaRules.find(rule => /Proper radial/.test(rule.title));
    if (/impact-parameter|light-deflection/.test(h)) return formulaRules.find(rule => /Impact geometry/.test(rule.title));
    if (/sagnac difference/.test(h)) return scoped(
      "The odd-sector recurrence isolates directional time",
      "Subtracting the two directed geometric series cancels their even powers and retains the terms that change sign under β→−β. The q-recurrence stores those successive odd contributions.",
      "Initialize q₀=2hT₀β and Δt₀=0, multiply q by β² at each odd step, and add the current q to the accumulated difference. K counts odd contributions, not directed corrections.",
      "This is the direction-odd projection of the two routes, so it is a compact representation of their difference rather than a third physical propagation path.",
      "The recurrence assumes constant inputs and |β|<1. It does not replace a full rotating metric, detector model or independent Sagnac measurement."
    );
    if (/continuous loop/.test(h)) return formulaRules.find(rule => /Counter-propagating/.test(rule.title));
    if (/odd-sector tail|directed tail|closure map/.test(h)) return scoped(
      "The closure recurrence exposes its exact geometric tail",
      "The recurrence multiplies the normalized remaining distance by σβ at each declared correction and accumulates its contribution to the return time. The tail formula is the exact remainder after N directed or K odd-sector terms.",
      "Count N as directed corrections or K as included odd contributions, retain h=ℓ₀/L, and evaluate the signed numerator before taking its absolute magnitude for a convergence diagnostic.",
      "The finite sequence and its tail make convergence rate, direction reversal and odd-sector isolation visible without hiding them in a closed expression.",
      "This is projected kinematic bookkeeping. It is not a complete rotating spacetime, a symplectic proof or an experimental timing result."
    );
    if (/detector layer|phase readout/.test(h)) return formulaRules.find(rule => /detector layer converts/.test(rule.title));
    if (/asymptotics|ricci scalar|kretschmann|metric coefficient|areal centre|areal center/.test(h)) return formulaRules.find(rule => /Invariant asymptotics/.test(rule.title));
    if (/piecewise segment|strong branch|weak branch|c² blend|blend zone|canonical weak|strong\/inner branch/.test(h)) return formulaRules.find(rule => /segment field/.test(rule.title));
    if (/clock and radial factors|from ξ to d/.test(h)) return formulaRules.find(rule => /One field generates/.test(rule.title));
    if (/diagonal tensor|exact inverse|determinant and volume|local orthonormal coframe|repository flow form|diagonal form/.test(h)) return formulaRules.find(rule => /line element/.test(rule.title));
    if (/dual velocity|escape scale|dual fall|exact closure/.test(h)) return formulaRules.find(rule => /Escape and reciprocal/.test(rule.title));
    if (/two observational routes/.test(h)) return scoped(
      "Kinematic and proper-motion periods are compared as separate routes",
      "The two period expressions use observed circular speed or observed angular motion to estimate the same Galactic rotation timescale, with each input retaining its own provenance.",
      "Use consistent radius and angular units, convert the proper motion to radians per time, and compare only after both periods refer to the same adopted Solar-circle radius.",
      "Agreement checks the internal kinematic scale and the conversion between tangential speed and angular motion; it is not a point-mass dynamical derivation.",
      "Distance, streaming motions, non-circular structure and measurement uncertainties must be propagated before treating the routes as an observational constraint."
    );
    if (/dynamical consistency/.test(h)) return scoped(
      "The enclosed-mass and point-mass periods test different dynamics",
      "The enclosed-mass relation uses the adopted circular speed to infer the mass required inside R₀, while the point-mass period is an explicitly inadequate Sgr A* countermodel at the Solar radius.",
      "Keep the extended enclosed mass and concentrated black-hole mass separate, use SI units, and compare the resulting periods only as a diagnostic of model assumptions.",
      "The comparison demonstrates why Galactic kinematics cannot be represented by a single central point mass at R₀.",
      "It is not a fitted alternative or a complete Galactic potential; baryons, dark matter, rotation curves and uncertainties require a full forward model."
    );
    if (/separate ssz clock layer/.test(h)) return formulaRules.find(rule => /Clock rates/.test(rule.title));
    if (/mode index/.test(h)) return scoped(
      "Integer mode indices determine repetition structure",
      "The least-common-multiple divided by the greatest-common-divisor gives the number of combined integer-frequency repetitions required before the parametric pattern returns.",
      "Reduce p and k to their gcd, compute their lcm, and retain the resulting dimensionless repetition count n as the mode index used by the frequency formula.",
      "The index describes exact arithmetic closure of the displayed modes and does not depend on camera projection or screen coordinates.",
      "A mode index is a mathematical bookkeeping quantity; it does not by itself identify a physical eigenmode or gravitational mechanism."
    );
    if (/baseline/.test(h)) return scoped(
      "The baseline frequency supplies the reference mode scale",
      "The baseline expression maps radius and spherical-harmonic index n to the reference frequency before any declared fractional segmentation shift is applied.",
      "Insert the radius in metres, the dimensionless mode index and the stated calibration factor η, then compare shifted and unshifted frequencies in the same units.",
      "Separating the baseline from the shift makes the proposed correction auditable and prevents a visual frequency offset from being mistaken for a new eigenfrequency derivation.",
      "The expression is a declared cavity-model baseline; medium structure, boundary conditions and independent spectral calibration remain outside it."
    );
    if (/ssz-inspired damping/.test(h)) return formulaRules.find(rule => /toy Hamiltonian/.test(rule.title));
    if (/solved.*numerically diagonalised/.test(h)) return formulaRules.find(rule => /toy Hamiltonian/.test(rule.title));
    if (/stable differential|surface-code connection/.test(h)) return formulaRules.find(rule => /differential clock factor/.test(rule.title));
    if (/rotating-space picture/.test(h)) return formulaRules.find(rule => /Electromagnetic fields/.test(rule.title));
    if (/residual and uncertainty/.test(h)) return formulaRules.find(rule => /Residuals compare/.test(rule.title));
    if (/null paths/.test(h)) return formulaRules.find(rule => /Impact geometry/.test(rule.title));
    if (/derivative-matched quintic|verify all six|c² constraint|what the c² constraint/.test(h)) return formulaRules.find(rule => /quintic Hermite/.test(rule.title));
    if (/marginal stability/.test(h)) return formulaRules.find(rule => /Geodesic dynamics/.test(rule.title));
    if (/finite horizon time dilation|horizon result/.test(h)) return scoped(
      "The horizon-radius values are local consequences of the locked branch",
      "Evaluating the strong branch at r=rₛ gives the declared dimensionless field value and its finite clock factor at that coordinate radius.",
      "Set x=1, evaluate Ξ=1−e^(−φ), and then calculate D=1/(1+Ξ) without interpreting the coordinate value as a global causal boundary.",
      "The finite coefficients show what this static ansatz predicts locally at rₛ and provide a reproducible numerical anchor for later diagnostics.",
      "Finite diagonal coefficients do not establish a regular centre, absence of trapped surfaces, a complete interior or a rotating compact-object solution."
    );
    return formulaRules.find(rule => rule.match.test(source)) || {
      title: `Quantitative statement for ${heading || "this section"}`,
      purpose: `This displayed relation is the quantitative step used by the surrounding ${heading || "discussion"}. It connects the symbols on the left to the assumptions or derived quantities on the right.`,
      reading: "Read equality signs from left to right, keep definitions fixed, and check that every additive term has the same units. Evaluate inputs before derived outputs and retain the stated coordinate or normalization convention.",
      meaning: "The equation makes the prose testable: changing a declared input must change the output according to this relationship.",
      limit: "Its conclusion is no broader than the assumptions and domain stated in the surrounding section. A correct calculation is not automatically an empirical validation."
    };
  }
  function symbolsFor(text) {
    return symbolLexicon.filter(([pattern]) => pattern.test(text)).map(([,description]) => description).slice(0, 9);
  }
  function verificationFor(text, heading = "", page = "") {
    const source = `${page} ${heading} ${text}`;
    if (/open|hypoth|interior|ansatz|toy|proposal|candidate/i.test(source)) {
      return "The repository tests still do substantial work here: they check encoded identities, units, limits, numerical stability and regression behavior, and may include sensitivity or negative controls. Because this item is explicitly exploratory, those successes validate the stated calculation—not the hypothesis as an observed law.";
    }
    if (/chi|residual|dataset|data|gaia|nicer|alma|clock|frequency|redshift|observation|likelihood/i.test(source)) {
      return "This part is covered by more than isolated unit tests: the corpus includes real- or reference-data comparisons, end-to-end pipeline contracts, regression checks, sensitivity tests and negative controls where the repository provides them. That supports reproducibility of the declared data chain; independence still depends on the provenance of code, data and analysis choices.";
    }
    if (/geodes|orbit|trajectory|integr|hamilton|schr|symplectic|velocity|perihel|potential/i.test(source)) {
      return "Verification combines analytic identities and limiting cases with numerical convergence, conservation or constraint residuals, precision checks and regression tests across the relevant implementations. Agreement across step sizes or methods is stronger than a single example run, while remaining a computational validation of the encoded model.";
    }
    if (/metric|tensor|curvature|ricci|einstein|christoffel|junction|hermite|bridge|Xi|Ξ|D\s*=|A\s*=|B\s*=/i.test(source)) {
      return "These canonical relations receive layered checks across the test-bearing repositories: symbolic/algebraic identities, derivative and boundary matching, dimensional consistency, strong- and weak-limit behavior, high-precision numerics and cross-implementation regression. The captured portal snapshot records 1,296 passing assertions with no failures; the broader inventory contains 5,294 unique repository/test definitions rather than 5,294 independent experiments.";
    }
    if (/sum|series|fibonacci|hardy|chudnovsky|graph|qubit|probability|amdahl|log|chord/i.test(source)) {
      return "The mathematical claim is checked with method-appropriate exact values, identities, convergence behavior, precision targets and regression cases. These are substantive correctness tests, not merely interface checks; their evidential scope is the theorem or algorithm stated here rather than a claim about nature.";
    }
    return "The wider suite is substantially stronger than a first glance at a pass count suggests: it includes symbolic, dimensional, limit, numerical-precision, regression, sensitivity, negative-control, data-comparison and pipeline checks. For this equation, the relevant tests establish the declared relation within its encoded assumptions; they do not all represent statistically independent empirical confirmations.";
  }
  function explainerDetails(kind, title, fields, symbols = []) {
    const details = document.createElement("details");
    details.className = `${kind}-explainer`;
    details.dataset.explanationKind = kind;
    details.innerHTML = `<summary><span>${kind === "formula" ? "Explain this formula" : kind === "visual" ? "Explain this visual" : "Explain this figure"}</span><strong>${title}</strong></summary><div class="explainer-body">${fields.map(([label,value]) => `<section><h4>${label}</h4><p>${value}</p></section>`).join("")}${symbols.length ? `<section class="explainer-symbols"><h4>Symbols and units</h4><ul>${symbols.map(symbol => `<li>${symbol}</li>`).join("")}</ul></section>` : ""}</div>`;
    return details;
  }
  function explanationContainer(element) {
    return element.closest(".rh-visual-grid, .visual-grid, figure, .card, article") || element.parentElement;
  }
  function hasManualExplanation(element, kind) {
    const container = explanationContainer(element);
    if (!container) return false;
    const selector = kind === "visual"
      ? ".visual-explanation, [data-explanation-owner='visual']"
      : ".formula-explanation, [data-explanation-owner='formula']";
    return Boolean(container.querySelector(selector));
  }
  function hasGeneratedExplanation(element, kind) {
    const next = element.nextElementSibling;
    return Boolean(next?.matches(`.${kind}-explainer`) && next.dataset.sourceElement === (element.id || ""));
  }
  function hasAuthoredFormulaContext(element) {
    // Most catalogue cards already contain a carefully written paragraph
    // immediately after the equation.  Adding a second paragraph that says
    // the same thing is not extra documentation; it is duplication.  Keep an
    // automatic explainer only when the formula has no substantive local
    // explanation of its own.
    const container = explanationContainer(element);
    if (!container) return false;
    if (container.matches("[data-explanation-owner='formula'], .formula-explanation")) return true;
    let node = element.nextElementSibling;
    while (node && node !== container) {
      if (node.matches(".formula-explainer, .math-box, .formula, .display-formula")) break;
      if (node.matches("p, .formula-note, .where") && node.textContent.replace(/\s+/g, " ").trim().length >= 120) return true;
      node = node.nextElementSibling;
    }
    return false;
  }
  function decorateFormula(element) {
    if (element.dataset.explained === "true" || element.closest(".formula-explainer") || hasManualExplanation(element, "formula") || hasGeneratedExplanation(element, "formula") || hasAuthoredFormulaContext(element)) return;
    element.dataset.explained = "true";
    const text = element.textContent.replace(/\s+/g, " ").trim();
    const heading = headingFor(element);
    const rule = ruleForFormula(text, heading);
    const page = location.pathname.split("/").pop() || "index.html";
    const details = explainerDetails("formula", rule.title, [
      ["Purpose", rule.purpose],
      ["How to read it", rule.reading],
      ["Physical or mathematical meaning", rule.meaning],
      ["Validity and limitation", rule.limit],
      ["Verification status", verificationFor(text, heading, page)]
    ], symbolsFor(text));
    details.dataset.sourceElement = element.id || "";
    element.insertAdjacentElement("afterend", details);
  }
  function ruleForVisual(id, label) {
    const found = visualRules.find(([pattern]) => pattern.test(id));
    return found ? {title: found[1], use: found[2], meaning: found[3], limit: found[4]} : {
      title: label || "Interactive scientific display",
      use: "Change one control at a time, read the numerical outputs, and compare the legend before interpreting the plotted shape.",
      meaning: "The display converts the surrounding calculation or catalogue into a visual relationship so parameter dependence can be inspected.",
      limit: "Screen position, colour and animation are encodings. They do not add evidence beyond the underlying formula, data and declared model."
    };
  }
  function decorateVisual(canvas) {
    // RH proof canvases with a native `.visual-explanation` already carry the
    // authoritative, formula-specific explanation.  Do not append a generic
    // second box (which was the source of the duplicated/misplaced copy).
    if (canvas.dataset.explained === "true" || hasManualExplanation(canvas, "visual") || hasGeneratedExplanation(canvas, "visual")) return;
    canvas.dataset.explained = "true";
    const rule = ruleForVisual(canvas.id, canvas.getAttribute("aria-label"));
    const scope = canvas.closest("section,article") || canvas.parentElement;
    const controls = [...scope.querySelectorAll("label")].map(label => label.textContent.replace(/\s+/g, " ").trim()).filter(Boolean).slice(0, 8);
    const buttons = [...scope.querySelectorAll("button")].map(button => button.textContent.trim()).filter(Boolean).slice(0, 6);
    const interaction = [
      controls.length ? `Controls: ${controls.join("; ")}.` : "This display has no direct parameter control; use selection, pointer or the accompanying filters where available.",
      buttons.length ? `Actions: ${buttons.join("; ")}.` : ""
    ].filter(Boolean).join(" ");
    const details = explainerDetails("visual", rule.title, [
      ["How to use it", `${rule.use} ${interaction}`],
      ["What to watch", "Change one input at a time and connect the moving mark or curve to the adjacent numerical outputs. Use axes, units, colour legend and branch/evidence badges together rather than reading shape alone."],
      ["What the visual means", rule.meaning],
      ["What it does not establish", rule.limit]
    ]);
    details.dataset.sourceElement = canvas.id || "";
    canvas.insertAdjacentElement("afterend", details);
  }
  function decorateFigure(figure) {
    if (figure.dataset.explained === "true") return;
    const image = figure.querySelector("img");
    if (!image) return;
    figure.dataset.explained = "true";
    const file = image.getAttribute("src")?.split("/").pop();
    const found = figureRules[file];
    const title = found?.[0] || image.alt || "Research figure";
    const fields = found ? [
      ["How to read it", found[1]], ["What it shows", found[2]], ["Interpretation boundary", found[3]]
    ] : [
      ["How to read it", "Identify axes, units, legend, normalization and source before comparing shapes or values."],
      ["What it shows", figure.querySelector("figcaption")?.textContent.trim() || "A source-linked research artefact."],
      ["Interpretation boundary", "The figure inherits the assumptions and evidence status of its source analysis."]
    ];
    figure.append(explainerDetails("figure", title, fields));
  }
  function decorateExplanations(rootNode = document) {
    rootNode.querySelectorAll?.(".math-box, .formula, .display-formula").forEach(decorateFormula);
    rootNode.querySelectorAll?.("canvas").forEach(decorateVisual);
    rootNode.querySelectorAll?.("figure").forEach(decorateFigure);
  }
  // Core tabs also carry a full foundation chapter; keep the reading-guide
  // contract intact by deriving a concise guide from that chapter when the
  // page-specific guide predates the chapter addition.
  const guideFallbackNext = {
    "index.html": ["theory.html", "Continue with the theory from first principles"],
    "tests.html": ["evidence.html", "Follow tests into the claim–evidence ledger"],
    "reproducibility.html": ["tests.html", "Inspect the executed test record"],
    "glossary.html": ["formulas.html", "Read the symbols in their equations"],
    "schrodinger.html": ["mathematics.html", "Explore the numerical-method laboratories"]
  };
  const guideFallbackQuestion = {
    "index.html": "What is SSZ, what does its present metric calculate, and which parts remain research questions?",
    "theory.html": "How does SSZ move from a physical idea to a defined geometry, equations of motion and testable observables?",
    "strong-field.html": "What does the locked static metric imply near rₛ, and which compact-object claims remain bridge- or completion-dependent?",
    "interior-global-structure.html": "Can the current exterior expression be continued to the areal centre, and what would a defensible global completion require?",
    "tests.html": "What was actually executed, what passed, and how much independent scientific support do those records provide?",
    "reproducibility.html": "What must be frozen and recorded so that another researcher can reproduce a scientific result rather than only rerun a script?",
    "glossary.html": "How do the portal’s symbols, units and evidence labels keep meanings stable across equations, pages and experiments?",
    "schrodinger.html": "What does the archived one-dimensional eigenproblem demonstrate, and why is it intentionally labelled a scientific toy?"
    ,"recursive-closure.html": "How does a finite rest-distance correction close into the Sagnac difference, reduced action bookkeeping and a phase readout?"
  };
  Object.entries(pageGuides).forEach(([page, guide]) => {
    if (!guide.blocks) return;
    const blocks = guide.blocks;
    guide.question = guideFallbackQuestion[page] || guide.question || guide.title;
    guide.path = guide.path || guide.lede;
    guide.meaning = guide.meaning || blocks[0]?.[1] || guide.lede;
    guide.limit = guide.limit || blocks.at(-1)?.[1] || guide.lede;
    guide.next ||= guideFallbackNext[page] || (page === "recursive-closure.html" ? ["jif.html", "Compare the phase readout with the JIF detector ledger"] : ["index.html", "Return to the portal overview"]);
  });
  const allFoundationChapters = {...foundationChapters};
  Object.entries(pageGuides).filter(([,value]) => value.blocks).forEach(([page,value]) => { allFoundationChapters[page] = value; });
  window.SSZPageGuides = pageGuides;
  window.SSZFoundationChapters = allFoundationChapters;
  window.SSZTestLessons = testLessons;
  window.SSZExplainers = {ruleForFormula, symbolsFor, verificationFor, ruleForVisual, decorateExplanations};
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
        group("Foundations", [["theory.html","Theory"],["formulas.html","Formulas"],["metric.html","Metric"],["regimes.html","Regimes"],["weak-field.html","Weak field"],["strong-field.html","Strong field"],["interior-global-structure.html","Interior"]]),
        group("Methods & labs", [["dynamics-energy.html","Dynamics & Energy"],["mathematics.html","Mathematics"],["qubits.html","Qubits"],["jif.html","JIF counted phase"],["recursive-closure.html","Recursive closure"],["schrodinger.html","QM wink"],["visual-lab.html","Visual lab"]]),
        group("Evidence", [["tests.html","Tests"],["evidence.html","Evidence"],["falsification.html","Falsification"],["workbench.html","Workbench"],["reproducibility.html","Reproduce"]]),
        group("Research map", [["observations.html","Observables"],["papers.html","Papers"],["rh-proof-candidate.html","Riemann-Zeta proof candidate"],["research.html","Research archive"],["repositories.html","Repositories"],["atlas.html","Atlas"],["glossary.html","Glossary"]]),
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
    const foundation = allFoundationChapters[here];
    const compass = document.getElementById("reading-compass");
    if (foundation && compass && !document.getElementById("foundational-synthesis")) {
      const section = document.createElement("section");
      section.id = "foundational-synthesis";
      section.className = "section foundational-synthesis";
      section.setAttribute("aria-labelledby", "foundational-synthesis-title");
      section.innerHTML = `<div class="section-head"><span class="section-kicker">Foundational synthesis</span><h2 id="foundational-synthesis-title">${foundation.title}</h2><p class="lead">${foundation.lede}</p></div><div class="foundation-grid">${foundation.blocks.map(([title,text],index)=>`<article><span>${String(index+1).padStart(2,"0")}</span><div><h3>${title}</h3><p>${text}</p></div></article>`).join("")}</div>${testLessons[here]?`<aside class="foundation-test-lesson"><span>What the 9,300-record audit adds</span><p>${testLessons[here]}</p></aside>`:""}<p class="foundation-reading-rule"><strong>Reading rule:</strong> keep the positive result and its boundary together. A tested derivation or pipeline is real evidence within its declared scope; a remaining open layer does not erase what has already passed.</p>`;
      compass.insertAdjacentElement("afterend", section);
    }
    decorateExplanations();
    if (typeof MutationObserver !== "undefined") {
      let explanationFrame = 0;
      new MutationObserver(() => {
        cancelAnimationFrame(explanationFrame);
        explanationFrame = requestAnimationFrame(() => decorateExplanations());
      }).observe(document.body, {childList: true, subtree: true});
    }
    const toggle = document.querySelector(".menu-toggle");
    toggle?.addEventListener("click", () => {
      const open = menu?.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(Boolean(open)));
    });

    document.querySelectorAll("[data-theme-toggle]").forEach(button => {
      const syncEmbeddedThemes = () => document.querySelectorAll('iframe[src*="zeta_grid_map_animated"]').forEach(frame => {
        frame.contentWindow?.postMessage({type: "ssz-theme", theme: root.dataset.theme}, "*");
      });
      document.querySelectorAll('iframe[src*="zeta_grid_map_animated"]').forEach(frame => frame.addEventListener("load", syncEmbeddedThemes, {once: true}));
      button.addEventListener("click", () => {
        root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem("ssz-theme", root.dataset.theme);
        window.dispatchEvent(new CustomEvent("ssz-theme-change"));
        syncEmbeddedThemes();
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
