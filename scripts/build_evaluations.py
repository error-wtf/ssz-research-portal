#!/usr/bin/env python3
"""Build a public, provenance-aware evaluation summary from canonical result files.

Only compact aggregate values are published. Local absolute paths, raw stdout,
private topics and copied source documents never enter the output.
"""

from __future__ import annotations

import json
import math
from collections import Counter
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
PHYSICS = PROJECT.parent / "physics"
ALL_TESTS = PHYSICS / "ssz-all-tests"
UNIFIED = PHYSICS / "Segmented-Spacetime-Mass-Projection-Unified-Results"


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def json_safe(value):
    """Recursively replace non-finite source numbers with JSON null."""
    if isinstance(value, float) and not math.isfinite(value):
        return None
    if isinstance(value, dict):
        return {key: json_safe(item) for key, item in value.items()}
    if isinstance(value, list):
        return [json_safe(item) for item in value]
    return value


def build() -> dict:
    live = read_json(ALL_TESTS / "LIVE_STATUS.json")
    historical = read_json(ALL_TESTS / "MASTER_RESULTS.json")
    paired = read_json(UNIFIED / "summary_full_pipeline_enriched.json")
    executed = read_json(UNIFIED / "outputs/complete_test_results.json")
    audit = read_json(ALL_TESTS / "analysis-index.json")
    catalogue = read_json(PROJECT / "data" / "tests.json")

    repositories = []
    for name, result in live.items():
        repositories.append({
            "repository": name,
            "passed": int(result["passed"]),
            "failed": int(result["failed"]),
            "expected": int(result["expected"]),
            "status": result["status"],
            "snapshot": "2026-05-04",
            "environment": "Python 3.12 · Windows 11",
            "evidence_class": "captured repository test run",
            "does_not_prove": "Independent empirical preference for SSZ or validity outside the asserted code paths.",
        })

    older = []
    for name, result in historical.items():
        older.append({
            "repository": name,
            "expected": int(result["expected"]),
            "passed": int(result["passed"]),
            "failed": int(result["failed"]),
            "rate_label": result["rate"],
            "status": "historical-conflicting-snapshot",
            "interpretation": "Retained because it records earlier collection, dependency or counting problems; it must not be merged with the later live snapshot.",
        })

    categories = []
    for category, rows in executed["categories"].items():
        counts = {"PASSED": 0, "FAILED": 0, "SKIPPED": 0}
        duration = 0.0
        for row in rows:
            counts[row["status"]] = counts.get(row["status"], 0) + 1
            duration += float(str(row["duration"]).rstrip("s") or 0)
        categories.append({
            "category": category,
            "passed": counts.get("PASSED", 0),
            "failed": counts.get("FAILED", 0),
            "skipped": counts.get("SKIPPED", 0),
            "duration_seconds": round(duration, 2),
            "unit": "executed or classified script",
        })

    total_passed = sum(item["passed"] for item in repositories)
    total_failed = sum(item["failed"] for item in repositories)
    category_counts = Counter(item["category"] for item in catalogue["tests"])
    repository_counts = Counter(item["repository"] for item in catalogue["tests"])
    quantity_counts = Counter(item["quantity"] for item in catalogue["tests"])
    return {
        "generated_from": [
            "ssz-all-tests/LIVE_STATUS.json",
            "ssz-all-tests/MASTER_RESULTS.json",
            "ssz-all-tests/analysis-index.json",
            "Segmented-Spacetime-Mass-Projection-Unified-Results/summary_full_pipeline_enriched.json",
            "Segmented-Spacetime-Mass-Projection-Unified-Results/outputs/complete_test_results.json",
        ],
        "current_snapshot": {
            "date": "2026-05-04",
            "repositories": len(repositories),
            "passed": total_passed,
            "failed": total_failed,
            "status": "captured all-green snapshot",
            "warning": "Counts are repository test outcomes from a recorded environment. They are not independent experiments and not all tests have equal scientific scope.",
        },
        "repositories": repositories,
        "historical_snapshot": {
            "date": "2026-04-28",
            "repositories": older,
            "warning": "This earlier orchestration snapshot contains dependency, collection and expected-count inconsistencies. It is shown for auditability, not combined with the later snapshot.",
        },
        "audit_snapshot": {
            "date": audit["generated"],
            "repositories": audit["total_repos"],
            "detected": audit["total_detected"],
            "mapped": audit["total_mapped"],
            "executed": audit["total_executed"],
            "expected_minimum": audit["expected_min"],
            "count_ok": audit["count_ok"],
            "failures": [
                {
                    "repository": row["repo"],
                    "test": row["id"].replace("\\", "/"),
                    "classification": row["repo_type"],
                    "status": "failed in audit snapshot",
                }
                for row in audit["real_failures"]
            ],
            "timeouts": [
                {
                    "repository": name,
                    "duration_seconds": result["duration_s"],
                    "exit_code": result["exit_code"],
                    "interpretation": "Runner timeout or uncompleted validation; not a passing or failing physics assertion.",
                }
                for name, result in audit["repos"].items()
                if result["exit_code"] == -1
            ],
            "warning": "This intermediate runner audit uses a different repository set and counting method from both dated snapshots. It documents failure recovery and must remain separate.",
        },
        "numeric_diagnostics": [
            {"name": "GPS weak-field redshift", "value": 1.922899e-7, "value_label": "1.922899×10⁻⁷ relative error", "tolerance": 1e-3, "tolerance_label": "≤ 1×10⁻³", "repository": "ssz-metric-pure", "source": "tests/test_validation_ssz_calibrated.py", "meaning": "The encoded calibrated weak-field implementation agrees with the GR reference for the selected Earth–GPS configuration.", "boundary": "A comparison to a GR-derived reference is not an independent experimental fit."},
            {"name": "Pound–Rebka proxy", "value": 5.119032e-3, "value_label": "5.119032×10⁻³ relative error", "tolerance": 1e-2, "tolerance_label": "≤ 1×10⁻²", "repository": "ssz-metric-pure", "source": "tests/test_validation_ssz_calibrated.py", "meaning": "The implementation lies within its encoded one-percent weak-field tolerance.", "boundary": "This runner record does not reconstruct the original measurement likelihood."},
            {"name": "Mountain clock proxy", "value": 1.212028e-3, "value_label": "1.212028×10⁻³ relative error", "tolerance": 5e-3, "tolerance_label": "≤ 5×10⁻³", "repository": "ssz-metric-pure", "source": "tests/test_validation_ssz_calibrated.py", "meaning": "The selected 1 km elevation case satisfies its encoded weak-field comparison.", "boundary": "The comparison is a numerical reference case, not a new clock experiment."},
            {"name": "Earth low-orbit energy drift", "value": 7.648e-12, "value_label": "7.648×10⁻¹²", "tolerance": 1e-9, "tolerance_label": "< 1×10⁻⁹ portal guardrail", "repository": "ssz-metric-pure", "source": "tests/test_sparse_validators.py", "meaning": "The sampled numerical trajectory conserves its encoded energy proxy to a small drift.", "boundary": "One integrator and sampling regime do not establish global geodesic completeness."},
            {"name": "Trapz–Simpson travel-time agreement", "value": 8.238527e-16, "value_label": "8.238527×10⁻¹⁶ relative difference", "tolerance": 1e-9, "tolerance_label": "≤ 1×10⁻⁹", "repository": "ssz-metric-pure", "source": "tests/test_validation_ssz_calibrated.py", "meaning": "Two quadrature methods agree for the encoded Earth-to-GPS path.", "boundary": "Agreement between numerical methods does not validate the underlying metric against nature."},
        ],
        "claim_evidence_matrix": [
            {"claim": "Metric functions and inverse identities are implemented consistently", "class": "mathematical implementation", "status": "tested", "support": "Metric, inverse, compatibility and tensor-pipeline assertions across canonical metric repositories.", "does_not_establish": "A fundamental action, unique field equations or empirical truth."},
            {"claim": "The weak-field branch reproduces selected reference limits", "class": "reference compatibility", "status": "tested", "support": "GPS, Pound–Rebka, mountain-clock, asymptotic and PPN-style encoded comparisons.", "does_not_establish": "Independent parameter-free confirmation across all weak-field observations."},
            {"claim": "Selected numerical trajectories are stable", "class": "numerical validation", "status": "tested", "support": "Energy-drift, step-size and quadrature-consistency assertions.", "does_not_establish": "Global geodesic or causal completeness."},
            {"claim": "The segmented residual is smaller in the supplied paired sample", "class": "dataset-conditioned result", "status": "conditional", "support": "66 of 67 paired residual comparisons; two-sided sign-test p≈9.2×10⁻¹⁹.", "does_not_establish": "Causal mechanism, unbiased selection, flexibility penalty or external replication."},
            {"claim": "The horizon time-dilation factor remains finite", "class": "canonical analytic result", "status": "tested", "support": "Ξ(rₛ)=0.801711847… and D(rₛ)=0.555027709… from the canonical strong branch.", "does_not_establish": "A regular centre or globally complete interior geometry."},
            {"claim": "The canonical diagonal continuation is regular at r=0", "class": "superseded claim", "status": "corrected", "support": "No current support: P0 gives R~3/(2r²) and K~9/(4r⁴).", "does_not_establish": "Central regularity; this statement is explicitly rejected."},
            {"claim": "SSZ is empirically preferred as a fundamental theory", "class": "global empirical claim", "status": "open", "support": "No independent decisive dataset currently establishes this.", "does_not_establish": "Fundamental-theory status or confirmation over GR."},
        ],
        "unified_execution": {
            "date": executed["timestamp"],
            "categories": categories,
            "warning": "A passed script may be a smoke test, export tool or analysis runner rather than a pytest physics assertion.",
        },
        "artifact_catalogue": {
            "count": len(catalogue["tests"]),
            "unit": "catalogued test/result artefact",
            "categories": [
                {"name": name, "count": count}
                for name, count in category_counts.most_common()
            ],
            "repositories": [
                {"name": name, "count": count}
                for name, count in repository_counts.most_common()
            ],
            "quantities": [
                {"name": name, "count": count}
                for name, count in quantity_counts.most_common()
            ],
            "warning": "Catalogue rows support discovery and coverage analysis. They are not pass outcomes and cannot be added to captured-run totals.",
        },
        "mass_projection_evaluation": {
            "sample_pairs": paired["paired"]["N_pairs"],
            "segment_better": paired["paired"]["N_Seg_better"],
            "share_segment_better": paired["paired"]["share_Seg_better"],
            "binomial_two_sided_p": paired["paired"]["binom_two_sided_p"],
            "median": paired["med"],
            "confidence_intervals": paired["cis"],
            "mass_bins": paired["bins"],
            "interpretation": "Within this specific 67-pair pipeline and its residual definition, the segmented model has the lower residual in 66 pairs.",
            "limitations": [
                "The result is conditional on the supplied sample, preprocessing, residual definition and model parameterisation.",
                "A paired sign test does not by itself establish a causal physical mechanism.",
                "Model flexibility, selection effects and external replication require separate evaluation.",
                "Several high-mass bins are empty or sparsely populated.",
            ],
        },
        "canonical_corrections": [
            {
                "historical_claim": "finite curvature everywhere / singularities resolved",
                "current_status": "superseded by P0",
                "current_statement": "For the canonical diagonal continuation, R ~ 3/(2r²) and K ~ 9/(4r⁴) as r approaches the areal centre.",
            },
            {
                "historical_claim": "a green software suite confirms the physical theory",
                "current_status": "overstatement",
                "current_statement": "A green suite confirms only the encoded assertions in the recorded environment.",
            },
            {
                "historical_claim": "all result counters are directly additive",
                "current_status": "invalid counting rule",
                "current_statement": "Pytest cases, scripts, phases, logs, skips and historical snapshots remain separate units.",
            },
        ],
    }


if __name__ == "__main__":
    output = json_safe(build())
    destination = PROJECT / "data" / "evaluations.json"
    destination.write_text(json.dumps(output, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")
    print(
        f"built {destination.name}: "
        f"{output['current_snapshot']['passed']} current outcomes, "
        f"{len(output['repositories'])} repositories"
    )
