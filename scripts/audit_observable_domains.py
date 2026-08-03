#!/usr/bin/env python3
"""Audit every generated test record against the public Observatory domains.

This is deliberately a catalogue audit, not a test runner.  It prevents the
public maturity view from being maintained by memory or by a small snapshot.
"""
from __future__ import annotations

import hashlib
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TESTS = ROOT / "data/tests.json"
OUTPUT = ROOT / "data/observable-test-audit.json"

DOMAINS = {
    "Static clocks": r"clock|time.?dilat|proper.?time|frequency.?shift|pound.?rebka|galileo|gps",
    "Gravitational redshift": r"redshift|z_ssz|frequency.?shift|pound.?rebka",
    "PPN": r"ppn|parameteri[sz]ed",
    "Light deflection": r"deflect|light.?bend|eddington",
    "Shapiro delay": r"shapiro",
    "Mercury perihelion": r"mercur|perihel|precession",
    "Timelike orbits": r"timelike|massive.?geodes|orbital|orbit|periaps|turning.?point",
    "Null geodesics": r"null.?geodes|null.?ray|photon.?path|light.?path|impact.?parameter",
    "Lensing": r"lens|einstein.?ring|image.?position|source.?position",
    "Photon sphere": r"photon.?sphere|r_ph|photon.?orbit",
    "Shadow": r"shadow|critical.?impact|b_crit",
    "ISCO": r"isco|innermost.?stable",
    "Sagnac": r"sagnac|rotation.?phase|counter.?propagat",
    "Neutron stars": r"neutron|nicer|pulsar|compact.?star",
    "S-stars": r"(^|[^a-z0-9])s2([^a-z0-9]|$)|s.?star|s29|s38|s62|s471",
    "Sgr A*": r"sgr.?a|sagittarius.?a",
    "M87*": r"m87",
    "EHT-scale tests": r"eht|alma|event.?horizon|shadow|ring.?diameter",
    "Nebular and stellar models": r"nebula|g79|cygnus|gaia|simbad|stellar|star.?map",
    "Gravitational waves": r"ligo|virgo|gwosc|waveform|strain|ringdown|\bqnm\b|inspiral",
    "Electromagnetic extensions": r"electromagnet|fine.?structure|alpha|schumann|frequency.?curvature",
    "Quantum extensions": r"quantum|qubit|entangl|bell|chsh|coherence|surface.?code",
    "Qubit phase and compensation": r"qubit|gate.?phase|phase.?compens|entangl|bell|chsh|coherence",
}

STAGES = {
    "definition": r"definition|formula|identity|constant|registry|canonical|dimension",
    "derivation": r"deriv|symbolic|gradient|hessian|limit|asympt|equation",
    "implementation": r".+",
    "internal_test": r".+",
    "forward_model": r"forward|predict|observable|propagat|simulate|injection",
    "real_data": r"real.?data|observ|dataset|catalog|fits|csv|gwosc|gaia|simbad|nicer|alma|eso",
    "uncertainty_model": r"uncertain|error|noise|sigma|covarian|monte.?carlo|residual|tolerance",
    "model_comparison": r"compare|comparison|versus|vs.?gr|baseline|reference|model",
    "independent_reproduction": r"reproduc|cross.?platform|external|independent|benchmark.?replay",
    "falsification": r"falsif|reject|negative.?control|countertest|failure|fail|anti.?circular",
}


def searchable(record: dict) -> str:
    return " ".join(
        str(record.get(key, ""))
        for key in ("repository", "test_name", "category", "quantity", "file",
                    "command", "meaning", "does_not_prove", "result", "status")
    ).lower()


def summarize(records: list[dict]) -> dict:
    identities = {
        (r.get("repository"), r.get("file"), r.get("test_name")) for r in records
    }
    definitions = {(r.get("repository"), r.get("test_name")) for r in records}
    repos = sorted({r.get("repository") for r in records if r.get("repository")})
    files = sorted({r.get("file") for r in records if r.get("file")})
    categories = Counter(r.get("category", "unclassified") for r in records)
    stages = {}
    for stage, pattern in STAGES.items():
        selected = records if pattern == r".+" else [
            r for r in records if re.search(pattern, searchable(r), re.I)
        ]
        stages[stage] = {
            "records": len(selected),
            "definitions": len({
                (r.get("repository"), r.get("test_name")) for r in selected
            }),
            "repositories": len({
                r.get("repository") for r in selected if r.get("repository")
            }),
            "source_files": len({
                r.get("file") for r in selected if r.get("file")
            }),
        }
    examples = sorted(
        ({
            "repository": r.get("repository"),
            "test_name": r.get("test_name"),
            "category": r.get("category"),
            "file": r.get("file"),
            "status": r.get("status"),
        } for r in records),
        key=lambda x: (x["repository"] or "", x["test_name"] or "", x["file"] or ""),
    )[:24]
    return {
        "records": len(records),
        "unique_definitions": len(definitions),
        "file_level_identities": len(identities),
        "repositories": repos,
        "repository_count": len(repos),
        "source_file_count": len(files),
        "categories": dict(sorted(categories.items())),
        "stage_evidence": stages,
        "examples": examples,
    }


def main() -> None:
    raw = TESTS.read_bytes()
    payload = json.loads(raw)
    tests = payload["tests"]
    domains = []
    for name, pattern in DOMAINS.items():
        matches = [r for r in tests if re.search(pattern, searchable(r), re.I)]
        domains.append({"domain": name, **summarize(matches)})
    assigned = {
        (r["repository"], r["file"], r["test_name"])
        for name, pattern in DOMAINS.items()
        for r in tests if re.search(pattern, searchable(r), re.I)
    }
    result = {
        "schema_version": "1.0.0",
        "snapshot_date": "2026-08-03",
        "source": "data/tests.json",
        "source_sha256": hashlib.sha256(raw).hexdigest(),
        "records_examined": len(tests),
        "method": (
            "Every catalogue record is searched against published domain and "
            "evidence-stage vocabularies. Overlap is intentional. Counts show "
            "catalogue coverage; they do not turn a software record into an "
            "independent experiment or a completed theory."
        ),
        "domains": domains,
        "unassigned_file_level_identities": len({
            (r["repository"], r["file"], r["test_name"]) for r in tests
        } - assigned),
    }
    OUTPUT.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n")
    print(f"audited {len(tests)} records across {len(domains)} observable domains")


if __name__ == "__main__":
    main()
