#!/usr/bin/env python3
"""Extract reviewable conflict signals from every test-catalogue record."""
from __future__ import annotations

import hashlib
import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "data/tests.json"
OUTPUT = ROOT / "data/repository-conflict-audit.json"

SIGNALS = {
    "branch-or-blend": r"blend|branch|transition|boundary|c2|continuity|discontin",
    "derivative-or-gradient": r"derivative|gradient|finite.?difference|hessian",
    "radial-variable-or-scaling": r"r_over_rs|rs_over_r|radial.?scal|mass.?scal|dimension",
    "centre-curvature-or-regularity": r"centre|center|singular|curvature|ricci|kretschmann|regular",
    "legacy-or-superseded": r"legacy|deprecated|old|supersed|migration",
    "negative-control-or-expected-failure": r"negative.?control|expected.?fail|xfail|reject|failure|fail",
    "uncertainty-or-tolerance": r"uncertain|tolerance|residual|error|noise|covarian|sigma",
}


def text(record: dict) -> str:
    return " ".join(str(v) for v in record.values()).lower()


def main() -> None:
    raw = SOURCE.read_bytes()
    records = json.loads(raw)["tests"]
    grouped: dict[str, list[dict]] = defaultdict(list)
    for record in records:
        body = text(record)
        for signal, pattern in SIGNALS.items():
            if re.search(pattern, body, re.I):
                grouped[signal].append(record)
    signals = []
    for signal, matches in grouped.items():
        repos = sorted({x["repository"] for x in matches})
        identities = {
            (x["repository"], x["file"], x["test_name"]) for x in matches
        }
        examples = sorted(
            ({
                "repository": x["repository"],
                "test_name": x["test_name"],
                "file": x["file"],
                "status": x["status"],
            } for x in matches),
            key=lambda x: (x["repository"], x["file"], x["test_name"]),
        )[:40]
        signals.append({
            "signal": signal,
            "records": len(matches),
            "file_level_identities": len(identities),
            "repository_count": len(repos),
            "repositories": repos,
            "examples": examples,
            "interpretation": (
                "A review signal, not an automatically confirmed scientific "
                "conflict. Open the cited test and source before migration."
            ),
        })
    result = {
        "schema_version": "1.0.0",
        "snapshot_date": "2026-08-03",
        "records_examined": len(records),
        "source_sha256": hashlib.sha256(raw).hexdigest(),
        "method": (
            "All test records were searched for conflict-relevant vocabulary. "
            "The output expands the eight curated conflicts with traceable "
            "review candidates and never invents a source line."
        ),
        "signals": signals,
    }
    OUTPUT.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n")
    print(f"audited {len(records)} records; emitted {len(signals)} signal classes")


if __name__ == "__main__":
    main()
