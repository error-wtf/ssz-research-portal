#!/usr/bin/env python3
"""Validate the curated claim/formula/provenance graph."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[1] / "data"
for name in ("claims.json", "formulas.json", "provenance.json", "conflicts.json"):
    json.loads((root / name).read_text(encoding="utf-8"))
print("OK: curated provenance graph is valid JSON")
