#!/usr/bin/env python3
"""Audit every extracted test/result record without treating text markers as executions."""
from collections import Counter, defaultdict
from datetime import date
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / "data" / "tests.json"
payload = json.loads(source.read_text(encoding="utf-8"))
records = payload["tests"]
required = {
    "repository", "test_name", "category", "quantity", "result", "status",
    "file", "command", "meaning", "does_not_prove"
}
missing = Counter()
repos = Counter()
categories = Counter()
quantities = Counter()
files = Counter()
identities = Counter()
definitions = Counter()
marker_records = Counter()

for record in records:
    for key in required:
        if key not in record or record[key] in ("", None):
            missing[key] += 1
    repos[record.get("repository", "unassigned")] += 1
    categories[record.get("category", "unassigned")] += 1
    quantities[record.get("quantity", "unassigned")] += 1
    files[record.get("file", "unassigned")] += 1
    identity = (
        record.get("repository", ""),
        record.get("file", ""),
        record.get("test_name", "")
    )
    identities[identity] += 1
    definitions[(record.get("repository", ""), record.get("test_name", ""))] += 1
    result = record.get("result")
    if isinstance(result, dict):
        for marker in result:
            marker_records[marker.upper()] += 1
    else:
        marker_records["NO_PARSED_MARKER"] += 1

duplicate_rows = sum(count - 1 for count in identities.values() if count > 1)
audit = {
    "schema_version": "1.0.0",
    "audit_date": str(date.today()),
    "source": "data/tests.json",
    "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
    "records_examined": len(records),
    "unique_repository_file_test_identities": len(identities),
    "unique_repository_test_definitions": len(definitions),
    "duplicate_or_repeated_rows": duplicate_rows,
    "test_bearing_repositories": len(repos),
    "source_files": len(files),
    "required_field_omissions": dict(sorted(missing.items())),
    "records_by_repository": dict(repos.most_common()),
    "records_by_category": dict(categories.most_common()),
    "records_by_quantity": dict(quantities.most_common()),
    "text_markers_found_in_source_records": dict(marker_records.most_common()),
    "interpretation": {
        "catalogue_record": "An extracted test function or result artefact.",
        "unique_identity": "Deduplicated by repository, source file and extracted test name.",
        "text_marker": "A PASS/FAIL/SKIP token found in source text; not a fresh execution.",
        "executed_outcome": "Requires a dated runner, command, environment and process result."
    }
}
(ROOT / "data" / "test-catalog-audit.json").write_text(
    json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8"
)
print(json.dumps({
    "records_examined": audit["records_examined"],
    "unique_identities": audit["unique_repository_file_test_identities"],
    "unique_definitions": audit["unique_repository_test_definitions"],
    "repositories": audit["test_bearing_repositories"],
    "source_files": audit["source_files"],
    "missing_fields": sum(missing.values()),
    "duplicate_rows": duplicate_rows,
}, indent=2))
