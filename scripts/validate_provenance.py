#!/usr/bin/env python3
"""Validate file hashes and provenance references that are locally resolvable."""
import hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
claims=json.loads((ROOT/"data/evidence-ledger.json").read_text())["claims"]
checked=0
for row in claims:
    path=Path(row["source_document"])
    if path.is_file():
        assert hashlib.sha256(path.read_bytes()).hexdigest()==row["source_sha256"], row["id"]
        checked+=1
cert=json.loads((ROOT/"data/strong-field-certificates.json").read_text())
browser=ROOT/cert["provenance"]["browser_engine_path"]
assert hashlib.sha256(browser.read_bytes()).hexdigest()==cert["provenance"]["browser_engine_sha256"]
print(f"OK: {checked} directly resolvable source hashes and browser-engine certificate verified")
