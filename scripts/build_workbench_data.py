#!/usr/bin/env python3
"""Build transparent grouping data for scientific workbench visualisations."""
import hashlib,json
from collections import Counter,defaultdict
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
tests=json.loads((ROOT/"data/tests.json").read_text())["tests"]
groups=defaultdict(lambda:{"records":0,"repositories":set(),"categories":Counter(),"files":set()})
for row in tests:
    key=row.get("quantity") or "Unclassified"
    g=groups[key];g["records"]+=1;g["repositories"].add(row.get("repository","unknown"));g["categories"][row.get("category","unknown")]+=1;g["files"].add(row.get("file",""))
payload={
  "schema_version":"1.0.0","snapshot_date":"2026-08-03",
  "record_count":len(tests),"repository_count":len({r.get("repository") for r in tests}),
  "category_count":len({r.get("category") for r in tests}),
  "source_manifest_sha256":hashlib.sha256((ROOT/"data/tests.json").read_bytes()).hexdigest(),
  "groups":[{"name":name,"records":g["records"],"repositories":len(g["repositories"]),
    "source_files":len(g["files"]),"categories":dict(g["categories"]),
    "independence_status":"not established by catalogue grouping"} for name,g in sorted(groups.items())],
  "guardrails":[
    "A catalogue record is not necessarily a test function or an independent test case.",
    "Parameterized cases, logs, result artefacts and assertions may share code, formulas and data.",
    "These groups expose shared provenance; they do not claim a count of independent physical domains."
  ]
}
(ROOT/"data/test-independence.json").write_text(json.dumps(payload,indent=2)+"\n")
print(f"built test-independence catalogue: {len(tests)} records, {len(payload['groups'])} provenance groups")
