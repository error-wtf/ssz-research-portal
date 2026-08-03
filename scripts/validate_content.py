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
    "public-repositories-all.json": None,
    "public-research-repositories.json": None,
    "physics-atlas.json": ("count", "repositories"),
    "papers.json": ("count", "papers"),
    "observations.json": ("count", "objects"),
}


def main():
    for name, keys in REQUIRED_JSON.items():
        data = json.loads((ROOT / "data" / name).read_text(encoding="utf-8"))
        for key in keys or ():
            assert key in data, f"{name}: missing {key}"
    all_public = json.loads((ROOT / "data/public-repositories-all.json").read_text(encoding="utf-8"))
    research_public = json.loads((ROOT / "data/public-research-repositories.json").read_text(encoding="utf-8"))
    assert len(all_public) == 42, "public-scope repository snapshot count changed"
    assert len(research_public) == 30, "physics/mathematics classification incomplete"
    atlas = json.loads((ROOT / "data/physics-atlas.json").read_text(encoding="utf-8"))
    assert atlas["count"] == 35, "public physics atlas coverage incomplete"
    papers = json.loads((ROOT / "data/papers.json").read_text(encoding="utf-8"))
    observations = json.loads((ROOT / "data/observations.json").read_text(encoding="utf-8"))
    formulas = json.loads((ROOT / "data/formulas.json").read_text(encoding="utf-8"))
    assert papers["count"] == 25, "numbered paper index incomplete"
    assert len(papers["papers"]) == papers["count"]
    assert observations["count"] >= 200, "observation catalogue subset too small"
    assert len(formulas["formulas"]) >= 25, "curated formula reference too small"
    assert {item["domain"] for item in research_public} == {
        "physics", "mathematics", "physics-and-mathematics"
    }
    pages = "\n".join(path.read_text(encoding="utf-8") for path in ROOT.glob("*.html"))
    required = [
        "SSZ Interior and Global Structure", "R(r)~3/(2r²)", "K(r)~9/(4r⁴)",
        "not yet a complete", "Software test",
    ]
    for phrase in required:
        assert phrase.lower() in pages.lower(), f"missing scientific guardrail: {phrase}"
    forbidden = ["SSZ has NO singularities", "complete singularity-free black hole solution"]
    for phrase in forbidden:
        assert phrase.lower() not in pages.lower(), f"legacy overclaim published: {phrase}"
    publishable = "\n".join(
        path.read_text(encoding="utf-8", errors="ignore")
        for path in ROOT.rglob("*")
        if path.is_file() and ".git" not in path.parts and "source-template" not in path.parts
        and path.suffix.lower() in {".html", ".js", ".css", ".json", ".md", ".py"}
    )
    private_markers = ("ji" + "f", "joint " + "interval framework")
    for marker in private_markers:
        assert marker not in publishable.lower(), f"private research marker published: {marker}"
    assert len(list(ROOT.glob("*.html"))) >= 8
    visual = (ROOT / "visual-lab.html").read_text(encoding="utf-8")
    for canvas_id in ("phi-canvas", "radial-canvas", "lensing-canvas", "potential-canvas", "starmap-canvas", "sagnac-canvas", "curvature-canvas"):
        assert f'id="{canvas_id}"' in visual, f"missing visual module: {canvas_id}"
    print("OK: JSON schemas, page set and P0 scientific guardrails validated")


if __name__ == "__main__":
    main()
