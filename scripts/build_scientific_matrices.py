#!/usr/bin/env python3
"""Build explicit maturity, open-problem and repository-conflict matrices."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
STAGES = ["definition", "derivation", "implementation", "internal_test",
          "forward_model", "real_data", "uncertainty_model", "model_comparison",
          "independent_reproduction", "falsification"]

def maturity(domain, levels, note):
    return {"domain": domain, "stages": dict(zip(STAGES, levels)), "audit_note": note}

rows = [
    maturity("Static clocks", ["complete","complete","complete","complete","partial","partial","partial","open","open","partial"], "Finite static-clock dilation is defined; this does not establish global causal structure."),
    maturity("Gravitational redshift", ["complete","complete","complete","complete","complete","partial","partial","partial","open","partial"], "Current public comparisons are compatibility studies, not independent confirmation."),
    maturity("PPN", ["complete","complete","complete","complete","complete","partial","partial","partial","open","partial"], "Weak-field consistency does not validate the strong-field completion."),
    maturity("Light deflection", ["complete","complete","complete","complete","complete","partial","partial","partial","open","partial"], "Separate analytic limiting checks from observational inference."),
    maturity("Shapiro delay", ["complete","complete","complete","complete","complete","partial","partial","partial","open","partial"], "Public artifacts primarily test the weak-field limit."),
    maturity("Mercury perihelion", ["complete","complete","complete","complete","complete","partial","partial","partial","open","partial"], "Agreement is a limiting-regime check."),
    maturity("Timelike orbits", ["complete","partial","complete","complete","proxy","open","open","open","open","partial"], "Bridge-local stationary candidates require sensitivity certificates."),
    maturity("Null geodesics", ["complete","partial","complete","complete","proxy","open","open","open","open","partial"], "A stationary effective-potential candidate is not a full observation."),
    maturity("Lensing", ["partial","partial","partial","partial","proxy","open","open","open","open","open"], "No complete source-to-detector inference pipeline is established."),
    maturity("Photon sphere", ["complete","partial","complete","complete","proxy","open","partial","partial","open","partial"], "The current candidate is matching-sensitive."),
    maturity("Shadow", ["partial","partial","complete","complete","proxy","partial","partial","partial","open","partial"], "Impact parameter is a shadow proxy without plasma/radiative transfer."),
    maturity("ISCO", ["complete","partial","complete","complete","proxy","open","partial","partial","open","partial"], "Candidate depends on static metric and matching prescription."),
    maturity("Sagnac", ["complete","partial","complete","complete","partial","partial","partial","open","open","partial"], "Rotation analogies must retain observer and synchronization scope."),
    maturity("Neutron stars", ["partial","open","partial","partial","proxy","open","open","open","open","open"], "No canonical matter-coupled stellar solution."),
    maturity("S-stars", ["partial","partial","complete","partial","partial","partial","partial","partial","open","partial"], "Exploratory comparisons require full nuisance/systematics treatment."),
    maturity("Sgr A*", ["partial","partial","complete","partial","proxy","partial","partial","partial","open","partial"], "Point-mass and Galactic mass models must not be conflated."),
    maturity("M87*", ["partial","partial","partial","partial","proxy","partial","partial","partial","open","partial"], "No complete SSZ radiative-transfer fit."),
    maturity("EHT-scale tests", ["partial","partial","partial","partial","proxy","partial","open","open","open","partial"], "Image-domain likelihood and systematics remain open."),
    maturity("Nebular and stellar models", ["partial","partial","partial","partial","proxy","partial","partial","open","open","open"], "Public repositories contain exploratory models of uneven maturity."),
    maturity("Gravitational waves", ["partial","open","partial","partial","proxy","open","open","open","open","open"], "No complete perturbation and waveform theory."),
    maturity("Electromagnetic extensions", ["partial","open","partial","partial","proxy","open","open","open","open","open"], "Not part of the canonical static metric core."),
    maturity("Quantum extensions", ["hypothesis","open","partial","partial","proxy","open","open","open","open","open"], "No empirically confirmed quantum-gravity completion."),
]
(DATA/"observable-maturity.json").write_text(json.dumps({
    "schema_version":"1.0.0","snapshot_date":"2026-08-03","stage_order":STAGES,
    "status_vocabulary":["complete","partial","proxy","legacy","open","excluded","hypothesis"],
    "domains":rows,
    "guardrail":"Internal tests establish implementation behavior, not empirical confirmation."
},indent=2)+"\n")

problems = [
("Fundamental action","No canonical variational action","Derive an action whose Euler–Lagrange equations recover the declared metric sector"),
("Field equations","Metric ansatz exists; complete dynamics do not","State and solve covariant field equations"),
("Stress-energy interpretation","Effective source interpretation remains incomplete","Derive stress tensor and test conservation and energy conditions"),
("Global interior solution","Diagonal continuation is centrally singular","Construct and match a physical interior or boundary geometry"),
("Causal structure","Finite static coefficients are known locally","Complete maximal extension and causal diagram"),
("Stability","No complete mode-stability proof","Establish linear and nonlinear stability domains"),
("Rotation","No complete nonperturbative rotating solution","Derive rotating geometry and recover static limit"),
("Perturbations and QNMs","Published values are proxy-level","Derive gauge-controlled perturbation equations and spectra"),
("Waveforms","No complete waveform generator","Build equations, radiation sector and injection studies"),
("EHT radiative transfer","Shadow proxies exist","Implement plasma emission, transfer and image-domain likelihood"),
("Compact-star matter","No canonical EOS-coupled solution","Solve stellar structure with declared matter model"),
("Systematic uncertainty","Sensitivity work is incomplete","Propagate blend, numerical, data and nuisance uncertainties"),
("Independent reproduction","Most checks are project-internal","Obtain independent code and data reproduction"),
("Uniqueness of golden-ratio structure","Motivated but not uniquely derived","Prove uniqueness or quantify competing parameterizations"),
]
(DATA/"open-problems-matrix.json").write_text(json.dumps({
    "schema_version":"1.0.0","snapshot_date":"2026-08-03",
    "problems":[{"id":f"SSZ-OPEN-{i:03d}","problem":p,"current_status":s,
      "acceptance_criterion":a,"negative_result":"Failure of the acceptance criterion constrains or rejects the proposed completion.",
      "dependencies":[],"status":"open"} for i,(p,s,a) in enumerate(problems,1)]
},indent=2)+"\n")

print(f"built {len(rows)} maturity domains and {len(problems)} open problems")
