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
    }
  };
  const formulaRules = [
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
    [/atlas-map/, "Repository topology", "Select a node and compare its size and colour with the legend. Use the linked filters to move from a relationship overview to the underlying repository cards.", "Node size encodes indexed file count on a logarithmic scale; colour encodes research domain. Connections describe catalogue relationships.", "Dense or large nodes are not stronger evidence. The graph measures project organization, not scientific validity."],
    [/claim-graph/, "Claim dependencies", "Select a claim or lock and follow every incoming and outgoing edge. Cross-check the selected node against the textual ledger and source hash.", "Edges represent declared logical or provenance dependence: a downstream statement may fail if an upstream definition, implementation or evidence item changes.", "The network is not a causal graph of nature and edge count is not evidential weight."],
    [/metric-chart|metric-branches|regime-canvas|continuity-canvas|weak-field-canvas/, "Radial branches and limits", "Move the radius control slowly across marked boundaries and compare values before comparing derivatives or residuals. Toggle logarithmic axes when available.", "Coincident curves show agreement at the displayed resolution; derivative and residual panels reveal differences hidden by an ordinary linear plot.", "Screen overlap is not exact equality. Read numerical outputs and branch labels, and do not extrapolate a branch outside its declared domain."],
    [/metric-geometry|radial-canvas|components-canvas|metric-coefficients/, "Metric scaling", "Change the normalized radius and watch Ξ, D, temporal scale and radial scale update together. Compare reciprocal quantities rather than treating them as independent controls.", "The geometry is a visual encoding of A=D² and B=D⁻². Stretching and clock symbols communicate coefficient changes; the displayed sizes are not literal objects.", "Projection and animation are explanatory. Invariant physical conclusions require equations, not apparent pixel distances."],
    [/dynamics-potential|potential-canvas|certificate-chart|blend-lab-canvas/, "Effective-potential and bridge sensitivity", "Vary radius, angular momentum or bridge parameters and watch stationary points move. Compare the candidate value with its residual and sensitivity interval.", "Extrema identify circular-orbit candidates of the declared static metric. Movement under bridge variation quantifies model dependence.", "A stationary point is not an observed photon ring or ISCO. Rotation, plasma, stability and emission physics remain separate."],
    [/emergence-canvas|phi-canvas/, "Conceptual pattern geometry", "Change symmetry, wavelength or logarithmic spacing and observe how the pattern reorganizes. Compare the golden-ratio setting with nearby deliberate alternatives.", "The animation demonstrates interference or nested geometric structure and makes parameter dependence visible.", "This module is conceptual. Visual resemblance does not derive the canonical metric or provide experimental evidence."],
    [/jif-phase/, "Counted phase comparison", "Change radius, proper frequency and duration. Watch the SSZ phasor lag or advance relative to the infinity reference and compare the count ledger.", "Angular separation represents accumulated phase difference; the numeric lag converts that angle into cycles.", "Animation speed is scaled for perception. A detector prediction needs calibration, noise and a preregistered phase convention."],
    [/jif-ledger/, "Detector phase ledger", "Adjust emission, transfer, interaction-node and detector contributions one at a time. Check both the unwrapped total and wrapped phase.", "Vector addition preserves the sign and ownership of each contribution, making cancellation and degeneracy visible.", "A wrapped endpoint alone cannot identify which physical contribution caused it; the full ledger must be retained."],
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
    return element.closest("section,article")?.querySelector("h2,h3")?.textContent.trim()
      || element.previousElementSibling?.textContent.trim()
      || document.title;
  }
  function ruleForFormula(text, heading = "") {
    const source = `${heading} ${text}`;
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
    details.innerHTML = `<summary><span>${kind === "formula" ? "Explain this formula" : kind === "visual" ? "Explain this visual" : "Explain this figure"}</span><strong>${title}</strong></summary><div class="explainer-body">${fields.map(([label,value]) => `<section><h4>${label}</h4><p>${value}</p></section>`).join("")}${symbols.length ? `<section class="explainer-symbols"><h4>Symbols and units</h4><ul>${symbols.map(symbol => `<li>${symbol}</li>`).join("")}</ul></section>` : ""}</div>`;
    return details;
  }
  function decorateFormula(element) {
    if (element.dataset.explained === "true" || element.closest(".formula-explainer")) return;
    element.dataset.explained = "true";
    const text = element.textContent.replace(/\s+/g, " ").trim();
    const heading = headingFor(element);
    const rule = ruleForFormula(text, heading);
    const page = location.pathname.split("/").pop() || "index.html";
    element.insertAdjacentElement("afterend", explainerDetails("formula", rule.title, [
      ["Purpose", rule.purpose],
      ["How to read it", rule.reading],
      ["Physical or mathematical meaning", rule.meaning],
      ["Validity and limitation", rule.limit],
      ["Verification status", verificationFor(text, heading, page)]
    ], symbolsFor(text)));
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
    if (canvas.dataset.explained === "true") return;
    canvas.dataset.explained = "true";
    const rule = ruleForVisual(canvas.id, canvas.getAttribute("aria-label"));
    const scope = canvas.closest("section,article") || canvas.parentElement;
    const controls = [...scope.querySelectorAll("label")].map(label => label.textContent.replace(/\s+/g, " ").trim()).filter(Boolean).slice(0, 8);
    const buttons = [...scope.querySelectorAll("button")].map(button => button.textContent.trim()).filter(Boolean).slice(0, 6);
    const interaction = [
      controls.length ? `Controls: ${controls.join("; ")}.` : "This display has no direct parameter control; use selection, pointer or the accompanying filters where available.",
      buttons.length ? `Actions: ${buttons.join("; ")}.` : ""
    ].filter(Boolean).join(" ");
    canvas.insertAdjacentElement("afterend", explainerDetails("visual", rule.title, [
      ["How to use it", `${rule.use} ${interaction}`],
      ["What to watch", "Change one input at a time and connect the moving mark or curve to the adjacent numerical outputs. Use axes, units, colour legend and branch/evidence badges together rather than reading shape alone."],
      ["What the visual means", rule.meaning],
      ["What it does not establish", rule.limit]
    ]));
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
  window.SSZPageGuides = pageGuides;
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
