#!/usr/bin/env python3
"""Validate stable claim identities and minimum evidence-chain completeness."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
ledger=json.loads((ROOT/"data/evidence-ledger.json").read_text())
required={"id","title","statement","evidence_class","status","canonical_version",
"mathematical_assumptions","formula_ids","domain","observer_coordinate_scope",
"source_document","source_section","source_id","source_sha256","repository","repository_path",
"commit_sha","test_id","reproduction_command","numerical_result","uncertainty","conflicts",
"does_not_prove","falsification_criterion","last_reviewed","dependencies"}
claims=ledger["claims"]; ids=[row["id"] for row in claims]
assert len(ids)==len(set(ids)), "duplicate Claim-ID"
for row in claims:
    missing=required-set(row)
    assert not missing, f"{row.get('id')}: missing {sorted(missing)}"
    assert row["id"].startswith("SSZ-CLAIM-")
    assert len(row["source_sha256"])==64
    assert set(row["dependencies"])<=set(ids), f"{row['id']}: unresolved dependency"
    assert row["does_not_prove"], f"{row['id']}: missing interpretation boundary"
print(f"OK: {len(claims)} claims have complete minimum evidence chains")
