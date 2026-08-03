#!/usr/bin/env python3
"""Validate JSON topology and non-negotiable scientific wording."""

import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_JSON = {
    "files.json": ("summary", "files"),
    "repositories.json": ("count", "repositories"),
    "tests.json": ("count", "tests"),
    "formulas.json": ("count", "formulas"),
    "symbols.json": ("count", "symbols"),
    "claims.json": ("count", "claims"),
    "conflicts.json": ("count", "conflicts"),
    "provenance.json": ("count", "chains"),
    "releases.json": ("count", "releases"),
    "open_questions.json": ("count", "questions"),
    "public-repositories-all.json": None,
    "public-research-repositories.json": None,
    "physics-atlas.json": ("count", "repositories"),
    "papers.json": ("count", "papers"),
    "observations.json": ("count", "objects"),
    "starmap-stars.json": ("count", "stars"),
    "evaluations.json": None,
    "evidence-ledger.json": ("claims",),
    "claim-dependencies.json": ("edges",),
    "strong-field-certificates.json": ("canonical", "sensitivity", "provenance"),
    "observable-maturity.json": ("domains", "stage_order"),
    "open-problems-matrix.json": ("problems",),
}


def main():
    for name, keys in REQUIRED_JSON.items():
        data = json.loads((ROOT / "data" / name).read_text(encoding="utf-8"))
        for key in keys or ():
            assert key in data, f"{name}: missing {key}"
    all_public = json.loads((ROOT / "data/public-repositories-all.json").read_text(encoding="utf-8"))
    research_public = json.loads((ROOT / "data/public-research-repositories.json").read_text(encoding="utf-8"))
    assert len(all_public) == 42, "public-scope repository snapshot count changed"
    assert len(research_public) == 30, "physics/mathematics classification incomplete"
    atlas = json.loads((ROOT / "data/physics-atlas.json").read_text(encoding="utf-8"))
    assert atlas["count"] == 34, "public non-private physics atlas coverage incomplete"
    papers = json.loads((ROOT / "data/papers.json").read_text(encoding="utf-8"))
    observations = json.loads((ROOT / "data/observations.json").read_text(encoding="utf-8"))
    formulas = json.loads((ROOT / "data/formulas.json").read_text(encoding="utf-8"))
    starmap = json.loads((ROOT / "data/starmap-stars.json").read_text(encoding="utf-8"))
    assert papers["count"] == 25, "numbered paper index incomplete"
    assert len(papers["papers"]) == papers["count"]
    assert observations["count"] >= 200, "observation catalogue subset too small"
    assert len(formulas["formulas"]) >= 90, "curated formula reference too small"
    assert starmap["count"] >= 3000, "Gaia starmap catalogue too small"
    assert "legacy Xi and D columns are not used" in starmap["guardrail"]
    assert {item["domain"] for item in research_public} == {
        "physics", "mathematics", "physics-and-mathematics"
    }
    pages = "\n".join(path.read_text(encoding="utf-8") for path in ROOT.glob("*.html"))
    required = [
        "SSZ Interior and Global Structure", "R(r)~3/(2r²)", "K(r)~9/(4r⁴)",
        "not yet a complete", "Software test",
    ]
    for phrase in required:
        assert phrase.lower() in pages.lower(), f"missing scientific guardrail: {phrase}"
    forbidden = ["SSZ has NO singularities", "complete singularity-free black hole solution"]
    for phrase in forbidden:
        assert phrase.lower() not in pages.lower(), f"legacy overclaim published: {phrase}"
    publishable = "\n".join(
        path.read_text(encoding="utf-8", errors="ignore")
        for path in ROOT.rglob("*")
        if path.is_file() and ".git" not in path.parts and "source-template" not in path.parts
        and path.suffix.lower() in {".html", ".js", ".css", ".json", ".md", ".py"}
    )
    private_markers = ("ji" + "f", "joint " + "interval framework")
    for marker in private_markers:
        assert marker not in publishable.lower(), f"private research marker published: {marker}"
    private_book_markers = ("ssz_" + "book_en", "segmented-spacetime-" + "book")
    for marker in private_book_markers:
        assert marker not in publishable.lower(), f"private book artefact published: {marker}"
    evaluations = json.loads((ROOT / "data/evaluations.json").read_text(encoding="utf-8"))
    raw_evaluations = (ROOT / "data/evaluations.json").read_text(encoding="utf-8")
    assert "NaN" not in raw_evaluations and "Infinity" not in raw_evaluations
    assert evaluations["current_snapshot"]["passed"] == 1296
    assert evaluations["current_snapshot"]["repositories"] == 12
    assert evaluations["artifact_catalogue"]["count"] == 9300
    assert evaluations["audit_snapshot"]["executed"] == 1175
    assert len(evaluations["audit_snapshot"]["failures"]) == 3
    assert evaluations["audit_snapshot"]["timeouts"][0]["duration_seconds"] > 600
    assert len(evaluations["numeric_diagnostics"]) >= 5
    assert all(row["value"] <= row["tolerance"] for row in evaluations["numeric_diagnostics"])
    claim_statuses = {row["status"] for row in evaluations["claim_evidence_matrix"]}
    assert {"tested", "conditional", "corrected", "open"} <= claim_statuses
    assert (ROOT / "regimes.html").exists(), "regime-boundary page missing"
    tests_page = (ROOT / "tests.html").read_text(encoding="utf-8")
    for canvas_id in ("evaluation-chart", "evaluation-ci-chart", "evaluation-bin-chart",
                      "artifact-category-chart", "artifact-quantity-chart",
                      "snapshot-chart", "diagnostic-chart"):
        assert f'id="{canvas_id}"' in tests_page, f"missing evaluation visual: {canvas_id}"
    assert len(list(ROOT.glob("*.html"))) >= 21
    for page in ("evidence.html", "interior-global-structure.html", "falsification.html", "workbench.html", "qubits.html", "weak-field.html"):
        assert (ROOT / page).exists(), f"missing scientific audit page: {page}"
    certificates = json.loads((ROOT / "data/strong-field-certificates.json").read_text())
    assert certificates["precision_decimal_digits"] >= 50
    assert certificates["sensitivity"]["variant_count"] == 27
    assert len(json.loads((ROOT / "data/observable-maturity.json").read_text())["domains"]) >= 20
    visual = (ROOT / "visual-lab.html").read_text(encoding="utf-8")
    for canvas_id in ("phi-canvas", "radial-canvas", "lensing-canvas", "potential-canvas",
                      "starmap-canvas", "sagnac-canvas", "curvature-canvas",
                      "continuity-canvas", "components-canvas", "clocks-canvas",
                      "spectrum-canvas", "null-canvas", "galactic-year-canvas",
                      "chord-canvas", "schumann-canvas", "interior-canvas",
                      "galactic-webgl", "galactic-top-canvas", "galactic-side-canvas",
                      "galactic-clock-canvas"):
        assert f'id="{canvas_id}"' in visual, f"missing visual module: {canvas_id}"
    for control_id in (
        "component-radius", "component-theta", "component-form", "component-log",
        "component-inverse", "component-xi", "component-ds", "component-gtt",
        "component-grr", "component-gtr", "component-signature", "component-det",
        "component-null",
        "interior-radius", "interior-xi", "interior-d", "interior-r", "interior-k",
        "regime-radius", "regime-formula", "regime-description",
        "galactic-time", "galactic-z-period", "galactic-z-scale",
    ):
        assert f'id="{control_id}"' in visual, f"incomplete metric explorer: {control_id}"
    advanced = (ROOT / "assets/js/advanced-visuals.js").read_text(encoding="utf-8")
    assert "window.SSZ.branch" in advanced
    assert 'form==="diagonal"' in advanced and "1-beta" in advanced
    physics = (ROOT / "assets/js/physics.js").read_text(encoding="utf-8")
    assert "orbitDiagnostics" in physics and "angularMomentumSquared" in physics
    assert (ROOT / "scripts/test_browser_physics.mjs").exists()
    theory = (ROOT / "theory.html").read_text(encoding="utf-8")
    assert '<dl class="notation-definition">' in theory
    assert "<dt><var>t</var></dt>" in theory and "<strong>4πr²</strong>" in theory
    dependency_labs = (ROOT / "assets/js/dependency-labs.js").read_text(encoding="utf-8")
    assert "properDistance" in dependency_labs and "P0 leading centre asymptotics" in dependency_labs
    galactic_3d = (ROOT / "assets/js/galactic-year-3d.js").read_text(encoding="utf-8")
    assert 'getContext("webgl"' in galactic_3d and "scientific_roles" in galactic_3d
    workbench = (ROOT / "workbench.html").read_text(encoding="utf-8")
    for element_id in ("blend-lab-canvas", "geodesic-canvas", "independence-canvas", "interior-sandbox-canvas", "dimension-formula"):
        assert f'id="{element_id}"' in workbench
    assert (ROOT / "data/test-independence.json").exists()

    # Independent canonical-value audit for the equations shared by all browser explorers.
    golden = (1 + math.sqrt(5)) / 2
    xi_horizon = 1 - math.exp(-golden)
    dilation_horizon = 1 / (1 + xi_horizon)
    assert abs(xi_horizon - 0.8017118471377939) < 1e-14
    assert abs(dilation_horizon - 0.5550277096687818) < 1e-14
    assert abs(dilation_horizon * (1 + xi_horizon) - 1) < 1e-14

    # Repository-visual counterchecks: keep adopted Galactic kinematics separate
    # from the Sgr A* point-mass model, and verify the Schumann baseline.
    G, c, solar_mass, kpc, year = 6.67430e-11, 299792458, 1.98847e30, 3.085677581491367e19, 365.25 * 86400
    radius, velocity, central_mass = 8.3 * kpc, 220_000, 4.3e6 * solar_mass
    galactic_kinematic_myr = 2 * math.pi * radius / velocity / year / 1e6
    galactic_point_mass_myr = 2 * math.pi * math.sqrt(radius**3 / (G * central_mass)) / year / 1e6
    assert 230 < galactic_kinematic_myr < 235
    assert galactic_point_mass_myr > 10_000
    source_radius = 8.122 * kpc
    source_speed = 240_000
    source_period_myr = 2 * math.pi * source_radius / source_speed / year / 1e6
    angular_period_myr = 1_296_000_000 / 6.411 / 1e6
    enclosed_mass_solar = source_speed**2 * source_radius / G / 1.98847e30
    source_xi = (2 * G * central_mass / 299_792_458**2) / (2 * source_radius)
    source_clock_increment_years = source_period_myr * 1e6 * source_xi
    assert 207 < source_period_myr < 209
    assert 201 < angular_period_myr < 203
    assert 1.0e11 < enclosed_mass_solar < 1.2e11
    assert 2.4e-11 < source_xi < 2.8e-11
    assert 0.004 < source_clock_increment_years < 0.007
    schumann_f1 = .74 * c / (2 * math.pi * 6_371_000) * math.sqrt(2)
    assert 7.7 < schumann_f1 < 8.0
    print("OK: JSON schemas, page set and P0 scientific guardrails validated")


if __name__ == "__main__":
    main()
