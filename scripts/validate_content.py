#!/usr/bin/env python3
"""Validate JSON topology and non-negotiable scientific wording."""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_JSON = {
    "files.json": ("summary", "files"),
    "repositories.json": ("count", "repositories"),
    "tests.json": ("count", "tests"),
    "formulas.json": ("count", "formulas"),
    "symbols.json": ("count", "symbols"),
    "claims.json": ("count", "claims"),
    "conflicts.json": ("count", "conflicts"),
    "provenance.json": ("count", "chains"),
    "releases.json": ("count", "releases"),
    "open_questions.json": ("count", "questions"),
}


def main():
    for name, keys in REQUIRED_JSON.items():
        data = json.loads((ROOT / "data" / name).read_text(encoding="utf-8"))
        for key in keys:
            assert key in data, f"{name}: missing {key}"
    pages = "\n".join(path.read_text(encoding="utf-8") for path in ROOT.glob("*.html"))
    required = [
        "SSZ Interior and Global Structure", "R(r)~3/(2r²)", "K(r)~9/(4r⁴)",
        "not yet a complete", "Software test", "dJ=dΦ/(2π)",
    ]
    for phrase in required:
        assert phrase.lower() in pages.lower(), f"missing scientific guardrail: {phrase}"
    forbidden = ["SSZ has NO singularities", "complete singularity-free black hole solution"]
    for phrase in forbidden:
        assert phrase.lower() not in pages.lower(), f"legacy overclaim published: {phrase}"
    assert len(list(ROOT.glob("*.html"))) >= 8
    print("OK: JSON schemas, page set and P0 scientific guardrails validated")


if __name__ == "__main__":
    main()
