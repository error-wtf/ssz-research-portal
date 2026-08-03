#!/usr/bin/env python3
"""Build safe, static GitHub repository catalogues.

The script accepts an API response cache so credentials never enter generated
files. With no cache it uses GitHub's public, unauthenticated API.
"""
from __future__ import annotations

import argparse
import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API = "https://api.github.com/users/error-wtf/repos?per_page=100&type=public&sort=updated"

MATH = {
    "Riemann-Zeta-Zero-Finding-Suite", "claudes-cycles", "pi-cluster",
    "chord-partition", "counterexample-commons", "CALCULATION_OF_NUMBER_PI",
    "pardon-symplectic-geometry-ssz-lab",
}
PHYSICS = {
    "ssz-research-portal", "Segmented-Spacetime-Mass-Projection-Unified-Results",
    "ssz-all-tests", "emergent-spacetime", "LOST_EINSTEIN_PAPERS",
    "SEGMENTED_SPACETIME", "ssz-radial-scaling", "frequency-curvature-validation",
    "ssz-lagrange", "ssz-trajectories", "ssz-paper-plots", "SSZ-HOW-TO-BEAM",
    "Segmented-Spacetime-Starmaps", "g79-cygnus-tests", "galactic-year",
    "segmented-calculation-suite", "segmented-energy", "ssz-complete-documentation",
    "ssz-lensing", "ssz-metric-pure", "ssz-qubits", "ssz-schumann",
    "ssz-ligo-tests", "SSZ-METRIC_COMPLETE",
}
BOTH = {"chord-partition", "ssz-radial-scaling", "pardon-symplectic-geometry-ssz-lab"}
P0_NOTES = {
    "ssz-metric-pure": (
        "The public repository description predates the P0 correction. "
        "The current diagonal continuation is not regular at the areal centre."
    ),
    "segmented-calculation-suite": (
        "The public repository description uses a pre-P0 singularity-free claim; "
        "the portal does not treat that wording as canonical."
    ),
}


def load(cache: str | None) -> list[dict]:
    if cache:
        return json.loads(Path(cache).read_text(encoding="utf-8"))
    request = urllib.request.Request(API, headers={"Accept": "application/vnd.github+json"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def safe(repo: dict) -> dict:
    name = repo["name"]
    if name in BOTH:
        domain = "physics-and-mathematics"
    elif name in PHYSICS:
        domain = "physics"
    elif name in MATH:
        domain = "mathematics"
    else:
        domain = "other"
    return {
        "name": name,
        "url": repo["html_url"],
        "description": repo.get("description") or "",
        "domain": domain,
        "archived": bool(repo.get("archived")),
        "language": repo.get("language"),
        "topics": repo.get("topics") or [],
        "default_branch": repo.get("default_branch"),
        "homepage": repo.get("homepage") or "",
        "updated_at": repo.get("updated_at"),
        "pushed_at": repo.get("pushed_at"),
        "stars": int(repo.get("stargazers_count", 0)),
        "forks": int(repo.get("forks_count", 0)),
        "license": (repo.get("license") or {}).get("spdx_id"),
        "portal_note": P0_NOTES.get(name, ""),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--cache", help="Path to a cached GitHub API JSON response")
    args = parser.parse_args()
    catalog = sorted((safe(repo) for repo in load(args.cache)), key=lambda item: item["name"].lower())
    research = [repo for repo in catalog if repo["domain"] != "other"]
    (ROOT / "data/public-repositories-all.json").write_text(
        json.dumps(catalog, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    (ROOT / "data/public-research-repositories.json").write_text(
        json.dumps(research, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    print(f"Public repositories: {len(catalog)}; physics/mathematics: {len(research)}")


if __name__ == "__main__":
    main()
