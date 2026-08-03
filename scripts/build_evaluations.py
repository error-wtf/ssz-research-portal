#!/usr/bin/env python3
"""Build a public, provenance-aware evaluation summary from canonical result files.

Only compact aggregate values are published. Local absolute paths, raw stdout,
private topics and copied source documents never enter the output.
"""

from __future__ import annotations

import json
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
PHYSICS = PROJECT.parent / "physics"
ALL_TESTS = PHYSICS / "ssz-all-tests"
UNIFIED = PHYSICS / "Segmented-Spacetime-Mass-Projection-Unified-Results"


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def build() -> dict:
    live = read_json(ALL_TESTS / "LIVE_STATUS.json")
    historical = read_json(ALL_TESTS / "MASTER_RESULTS.json")
    paired = read_json(UNIFIED / "summary_full_pipeline_enriched.json")
    executed = read_json(UNIFIED / "outputs/complete_test_results.json")

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
    return {
        "generated_from": [
            "ssz-all-tests/LIVE_STATUS.json",
            "ssz-all-tests/MASTER_RESULTS.json",
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
        "unified_execution": {
            "date": executed["timestamp"],
            "categories": categories,
            "warning": "A passed script may be a smoke test, export tool or analysis runner rather than a pytest physics assertion.",
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
    output = build()
    destination = PROJECT / "data" / "evaluations.json"
    destination.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        f"built {destination.name}: "
        f"{output['current_snapshot']['passed']} current outcomes, "
        f"{len(output['repositories'])} repositories"
    )
