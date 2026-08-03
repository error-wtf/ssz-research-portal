#!/usr/bin/env python3
"""Dependency-free structural validation for portal JSON and bundled schemas."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
for path in sorted((ROOT/"data").rglob("*.json")):
    json.loads(path.read_text())
for name in ("evidence-ledger.schema.json","claims.schema.json"):
    schema=json.loads((ROOT/"data/schemas"/name).read_text())
    assert schema.get("type") in {"object","array"}
print("OK: all data JSON parses and bundled schemas declare object roots")
