#!/usr/bin/env python3
"""Build the public SSZ claim/evidence ledger from curated public sources."""
from __future__ import annotations

import hashlib
import json
import subprocess
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PHYSICS = ROOT.parent / "physics"
LOCK = PHYSICS / "hilfsdateien" / "CANONICAL_XI_AND_BLEND_RESOLUTION.md"
METRIC = PHYSICS / "SSZ-METRIC_COMPLETE"
REVIEWED = date(2026, 8, 3).isoformat()


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def git_sha(path: Path) -> str:
    return subprocess.check_output(["git", "-C", str(path), "rev-parse", "HEAD"], text=True).strip()


LOCK_SHA = digest(LOCK)
METRIC_SHA = git_sha(METRIC)


def claim(
    claim_id: str, title: str, statement: str, evidence_class: str, status: str,
    assumptions: list[str], definitions: list[str], formulas: list[str], domain: str,
    scope: str, source: str, section: str, source_id: str, file_hash: str,
    repository: str, path: str, symbol: str, commit: str, test_id: str,
    command: str, inputs: list[dict], result: str, uncertainty: str,
    dependencies: list[str], conflicts: list[str], non_implications: list[str],
    falsification: str,
) -> dict:
    return {
        "id": claim_id, "title": title, "statement": statement,
        "evidence_class": evidence_class, "status": status, "canonical_version": "P0-2026.08",
        "mathematical_assumptions": assumptions, "definitions": definitions,
        "formula_ids": formulas, "domain": domain, "observer_coordinate_scope": scope,
        "source_document": source, "source_section": section, "source_id": source_id,
        "source_sha256": file_hash, "repository": repository, "repository_path": path,
        "code_symbol": symbol, "commit_sha": commit, "test_id": test_id,
        "reproduction_command": command, "inputs": inputs, "numerical_result": result,
        "uncertainty": uncertainty, "dependencies": dependencies, "conflicts": conflicts,
        "does_not_prove": non_implications, "falsification_criterion": falsification,
        "last_reviewed": REVIEWED,
    }


claims = [
    claim("SSZ-CLAIM-SCOPE-001", "Scientific status",
          "SSZ is a mathematically concrete and falsifiable strong-field research programme, not a complete or empirically confirmed fundamental theory.",
          "Interpretation", "canonical", ["Public static SSZ scope only"], ["effective geometry", "empirical confirmation"],
          [], "Public SSZ programme", "Epistemic scope, not a coordinate claim",
          "Canonical Xi and Blend Resolution", "P0 scope", "P0-SCOPE", LOCK_SHA,
          "error-wtf/ssz-research-portal", "SCIENTIFIC_SCOPE.md", "", "58c1ebbfce188cdab91e0b791add3e72af437ed3",
          "privacy-and-scope-guard", "python3 scripts/validate_content.py", [], "Scope guard passes",
          "Not statistical", [], ["legacy-complete-theory-language"],
          ["A fundamental action", "complete field equations", "empirical confirmation"],
          "A complete public derivation or decisive independent evidence would require this status to be updated, not silently reworded."),
    claim("SSZ-CLAIM-XI-STRONG-001", "Canonical strong branch",
          "For x=r/r_s<1.8, Xi_strong(x)=1-exp(-phi/x).",
          "Definition", "canonical", ["x>0", "phi=(1+sqrt(5))/2"], ["x=r/r_s", "Xi"],
          ["SSZ-FORM-XI-STRONG"], "0<x<1.8", "Static spherical areal-radius chart",
          "Canonical Xi and Blend Resolution", "Canonical strong branch", "P0-XI-STRONG", LOCK_SHA,
          "error-wtf/SSZ-METRIC_COMPLETE", "ssz_metric/xi.py", "xi_strong", METRIC_SHA,
          "test_canonical_strong_branch_formula", "pytest -q tests/test_canonical_xi_primary.py",
          [{"name":"x","unit":"1","range":"0<x<1.8"}], "Definition and sampled implementation agree",
          "Floating-point tolerance declared by test", [], ["reversed-exponent-legacy"],
          ["Microphysical origin of Xi", "global interior solution"], "Any implementation or publication using a different formula under this Claim-ID fails the canonical lock."),
    claim("SSZ-CLAIM-BLEND-C2-001", "Derivative-matched C2 bridge",
          "The interval 1.8<=x<=2.2 is a quintic Hermite bridge matching Xi, dXi/dx and d2Xi/dx2 at both endpoints.",
          "Definition", "canonical", ["Both endpoint branches are twice differentiable"], ["x0=1.8", "x1=2.2", "quintic Hermite basis"],
          ["SSZ-FORM-BLEND-H5"], "1.8<=x<=2.2", "Static spherical areal-radius chart",
          "Canonical Xi and Blend Resolution", "Blend resolution", "P0-BLEND-C2", LOCK_SHA,
          "error-wtf/ssz-research-portal", "assets/js/physics.js", "hermite5", "58c1ebbfce188cdab91e0b791add3e72af437ed3",
          "browser-branch-continuity", "node scripts/test_browser_physics.mjs",
          [{"name":"x0","value":1.8},{"name":"x1","value":2.2}], "Six endpoint identities tested",
          "Browser regression tolerance", ["SSZ-CLAIM-XI-STRONG-001", "SSZ-CLAIM-XI-WEAK-001"],
          ["zero-slope-smoothstep-drift"], ["Uniqueness among all possible C2 completions", "blend-independent orbit extrema"],
          "Failure of any value, slope or curvature endpoint identity rejects this bridge implementation."),
    claim("SSZ-CLAIM-XI-WEAK-001", "Canonical weak branch",
          "For x>2.2, Xi_weak(x)=1/(2x)=r_s/(2r).",
          "Definition", "canonical", ["x>2.2"], ["x=r/r_s", "Xi"], ["SSZ-FORM-XI-WEAK"],
          "x>2.2", "Static spherical areal-radius chart", "Canonical Xi and Blend Resolution",
          "Canonical weak branch", "P0-XI-WEAK", LOCK_SHA, "error-wtf/SSZ-METRIC_COMPLETE",
          "ssz_metric/xi.py", "xi_weak", METRIC_SHA, "test_canonical_weak_branch_formula",
          "pytest -q tests/test_canonical_xi_primary.py", [{"name":"x","unit":"1","range":"x>2.2"}],
          "Definition and sampled implementation agree", "Floating-point tolerance declared by test", [],
          ["wrong-far-field-limit"], ["Novel weak-field empirical preference"], "A nonzero asymptotic Xi or coefficient other than 1/2 rejects the locked weak branch."),
    claim("SSZ-CLAIM-METRIC-DIAGONAL-001", "Canonical diagonal metric",
          "The public static ansatz is ds2=-D2 c2 dt2+D^-2 dr2+r2 dOmega2 with D=(1+Xi)^-1.",
          "Definition", "canonical", ["Static", "spherical symmetry", "r is areal radius"], ["D", "Xi", "areal radius"],
          ["SSZ-FORM-D", "SSZ-FORM-METRIC"], "r>0 in the declared static chart", "Static observers and spherical coordinates",
          "SSZ-METRIC_COMPLETE specification", "Diagonal metric", "METRIC-DIAGONAL", digest(METRIC/"docs/SPECIFICATION.md"),
          "error-wtf/SSZ-METRIC_COMPLETE", "ssz_metric/metric.py", "metric_diagonal", METRIC_SHA,
          "test_metric_diagonal", "pytest -q tests/test_metric_diagonal.py",
          [{"name":"c","unit":"m s^-1"},{"name":"r","unit":"m"}], "Inverse and determinant identities pass",
          "Test tolerances in source", ["SSZ-CLAIM-XI-STRONG-001", "SSZ-CLAIM-BLEND-C2-001", "SSZ-CLAIM-XI-WEAK-001"],
          [], ["Fundamental action", "dynamical formation", "rotating solution"], "Violation of inverse, determinant, signature or declared branch mapping rejects the implementation."),
    claim("SSZ-CLAIM-HORIZON-D-001", "Finite horizon time factor",
          "Within the declared static geometry, Xi(r_s)=0.8017118471377938 and D(r_s)=0.5550277096687818.",
          "Mathematically derived result", "canonical", ["Use the locked strong branch at x=1", "D=(1+Xi)^-1"],
          ["x=1", "static clock factor"], ["SSZ-FORM-XI-STRONG", "SSZ-FORM-D"], "r=r_s",
          "Static observer limit in the declared chart", "Canonical Xi and Blend Resolution", "Horizon checkpoint",
          "P0-HORIZON", LOCK_SHA, "error-wtf/ssz-research-portal", "assets/js/physics.js", "branch",
          "58c1ebbfce188cdab91e0b791add3e72af437ed3", "browser-horizon-values",
          "node scripts/test_browser_physics.mjs", [{"name":"x","value":1,"unit":"1"}],
          "Xi=0.8017118471377938; D=0.5550277096687818", "Absolute numerical audit <1e-14",
          ["SSZ-CLAIM-XI-STRONG-001", "SSZ-CLAIM-METRIC-DIAGONAL-001"], ["legacy-Xi-horizon-equals-one"],
          ["Global horizon absence", "central regularity", "geodesic completeness"], "A reproducible evaluation of the locked formula outside tolerance rejects the implementation or quoted values."),
    claim("SSZ-CLAIM-P0-CENTRE-001", "Non-regular areal centre",
          "For the present canonical diagonal continuation, A tends to 1/4 while R~3/(2r2) and K~9/(4r4); the areal centre is not regular.",
          "Mathematically derived result", "corrected", ["Formal continuation of the strong branch to r->0", "r remains areal radius"],
          ["A=D2", "Ricci scalar R", "Kretschmann scalar K"], ["SSZ-FORM-CENTRE-A", "SSZ-FORM-CENTRE-R", "SSZ-FORM-CENTRE-K"],
          "r->0+", "Canonical diagonal continuation; not a new interior solution", "Canonical Xi and Blend Resolution",
          "P0 centre correction", "P0-CENTRE", LOCK_SHA, "error-wtf/ssz-research-portal",
          "theory.html#interior", "", "58c1ebbfce188cdab91e0b791add3e72af437ed3",
          "p0-centre-guard", "python3 scripts/validate_content.py", [{"name":"r","limit":"0+"}],
          "A->1/4; R~3/(2r^2); K~9/(4r^4)", "Asymptotic statement",
          ["SSZ-CLAIM-METRIC-DIAGONAL-001"], ["legacy-singularity-free-centre"],
          ["No alternative interior can exist", "global causal classification"], "A regular-centre claim for this continuation is rejected unless all invariant divergences are removed by a demonstrated geometry."),
    claim("SSZ-CLAIM-ORBIT-PROXY-001", "Blend-localized stationary candidates",
          "Current photon and timelike stationary candidates computed near x=2.1–2.2 are matching-prescription diagnostics, not universal SSZ observables.",
          "Numerical result", "conditional", ["Canonical derivative-matched bridge", "static diagonal metric"],
          ["null effective potential", "timelike angular momentum proxy"], ["SSZ-FORM-NULL-POTENTIAL", "SSZ-FORM-L2"],
          "1.8<=x<=2.2", "Static spherical effective-potential calculation", "Portal browser physics audit",
          "Orbit diagnostics", "ORBIT-PROXY", digest(ROOT/"assets/js/physics.js"), "error-wtf/ssz-research-portal",
          "assets/js/physics.js", "orbitDiagnostics", "58c1ebbfce188cdab91e0b791add3e72af437ed3",
          "browser-orbit-diagnostics", "node scripts/test_browser_physics.mjs", [{"name":"grid_step","value":0.0005}],
          "null candidate x≈2.130175; impact proxy≈2.656527; L2 minimum x≈2.199652",
          "Grid and interpolation sensitivity not yet a full certificate", ["SSZ-CLAIM-BLEND-C2-001", "SSZ-CLAIM-METRIC-DIAGONAL-001"],
          ["historic-universal-photon-sphere-values"], ["Blend independence", "observable shadow image", "ISCO theorem"],
          "Material displacement under admissible C2 bridges falsifies universality and retains only matching-dependent status."),
    claim("SSZ-CLAIM-TESTS-BOUNDARY-001", "Software evidence boundary",
          "A passing software assertion establishes only the encoded property in its recorded environment.",
          "Software Unit Test", "canonical", ["Test source, inputs and environment are identified"], ["PASS", "empirical confirmation"],
          [], "All public software results", "Engineering and numerical evidence", "Portal test audit",
          "Evidence ladder", "TEST-BOUNDARY", digest(ROOT/"data/evaluations.json"), "error-wtf/ssz-research-portal",
          "tests.html", "", "58c1ebbfce188cdab91e0b791add3e72af437ed3", "strict-evaluation-json",
          "python3 scripts/audit_test_catalog.py", [], "9,300 records; 5,294 unique repository/test definitions; 1,296-pass historical execution subset",
          "Non-statistical aggregate", [], ["tests-confirm-nature"], ["Independent experiment", "model preference"],
          "Any portal language equating an internal PASS with empirical confirmation violates this claim."),
    claim("SSZ-CLAIM-INTERIOR-OPEN-001", "Global interior remains open",
          "No public canonical solution currently proves a regular global interior, maximal extension, geodesic completeness or causal completeness.",
          "Open derivation", "open", ["Current public corpus and P0 hierarchy"], ["interior solution", "maximal extension"],
          [], "r<=r_s and global extension", "Global geometric scope", "Canonical Xi and Blend Resolution",
          "Open completion tasks", "INTERIOR-OPEN", LOCK_SHA, "error-wtf/ssz-research-portal",
          "interior-global-structure.html", "", "58c1ebbfce188cdab91e0b791add3e72af437ed3",
          "open-problem-presence", "python3 scripts/validate_claims.py", [], "Open", "Not applicable",
          ["SSZ-CLAIM-P0-CENTRE-001"], ["legacy-complete-singularity-resolution"],
          ["Impossibility of a future regular completion"], "A complete public solution must supply a metric, source/dynamics, junction conditions, invariants and causal/geodesic analysis."),
]

dependencies = [{"source": item["id"], "targets": item["dependencies"]} for item in claims]
ledger = {
    "schema_version": "1.0.0", "canonical_lock": "P0-2026.08", "last_reviewed": REVIEWED,
    "evidence_classes": ["Definition", "Mathematically derived result", "Algebraic identity", "Numerical result",
                         "Software Unit Test", "Regression test", "Engineering benchmark", "Synthetic test",
                         "Real-data compatibility", "Forward comparison", "Fit", "Null result", "Interpretation",
                         "Hypothesis", "Open derivation", "Empirically unconfirmed prediction"],
    "claims": claims,
}

schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema", "title": "SSZ evidence ledger",
    "type": "object", "required": ["schema_version", "canonical_lock", "claims"],
    "properties": {"schema_version":{"type":"string"}, "canonical_lock":{"type":"string"}, "claims":{
        "type":"array", "items":{"type":"object", "required":[
            "id","title","statement","evidence_class","status","canonical_version","mathematical_assumptions",
            "definitions","formula_ids","domain","observer_coordinate_scope","source_document","source_section",
            "source_sha256","repository","repository_path","commit_sha","test_id","reproduction_command","inputs",
            "numerical_result","uncertainty","dependencies","conflicts","does_not_prove","falsification_criterion",
            "last_reviewed"], "properties":{"id":{"type":"string","pattern":"^SSZ-CLAIM-[A-Z0-9-]+$"}}
        }}}}

data = ROOT / "data"
(data/"evidence-ledger.json").write_text(json.dumps(ledger, indent=2, ensure_ascii=False)+"\n")
(data/"claims.json").write_text(json.dumps({"count":len(claims),"claims":claims}, indent=2, ensure_ascii=False)+"\n")
(data/"claim-dependencies.json").write_text(json.dumps({"edges":dependencies}, indent=2)+"\n")
(data/"schemas").mkdir(exist_ok=True)
(data/"schemas"/"evidence-ledger.schema.json").write_text(json.dumps(schema, indent=2)+"\n")
(data/"schemas"/"claims.schema.json").write_text(json.dumps(schema["properties"]["claims"], indent=2)+"\n")
print(f"built evidence ledger: {len(claims)} claims")
