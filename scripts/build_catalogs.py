#!/usr/bin/env python3
"""Generate repository, test, formula and research-status catalogues."""

from __future__ import annotations

import json
import os
import re
import subprocess
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
SOURCE_HOME = Path(os.getenv("SSZ_SOURCE_HOME", PROJECT.parent))
PRIVATE_MARKERS_FILE = PROJECT / ".private-sources"
PRIVATE_MARKERS = tuple(
    line.strip().lower() for line in PRIVATE_MARKERS_FILE.read_text(encoding="utf-8").splitlines()
    if line.strip() and not line.startswith("#")
) if PRIVATE_MARKERS_FILE.exists() else ()
PHYSICS = SOURCE_HOME / "physics"
RAG_REPOS = SOURCE_HOME / "rag" / "repositories.md"
FILES = json.loads((PROJECT / "data/files.json").read_text(encoding="utf-8"))["files"]


def git(repo: Path, *args: str) -> str:
    try:
        return subprocess.run(
            ["git", "-C", str(repo), *args], check=True, text=True,
            stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, timeout=20
        ).stdout.strip()
    except (subprocess.SubprocessError, OSError):
        return ""


def public_repo_rows() -> dict[str, dict]:
    rows: dict[str, dict] = {}
    pattern = re.compile(
        r"\| \[([^]]+)\]\((https://github\.com/[^)]+)\) \| ([^|]*) \| `([^`]*)` \| ([^|]*) \|"
    )
    for match in pattern.finditer(RAG_REPOS.read_text(encoding="utf-8")):
        full_name, url, description, branch, status = (x.strip() for x in match.groups())
        rows[full_name.split("/")[-1].lower()] = {
            "full_name": full_name, "url": url, "description": description,
            "listed_branch": branch, "public_status": status,
        }
    return rows


def classify_repo(name: str, description: str) -> list[str]:
    text = f"{name} {description}".lower()
    tags = []
    for tag, needles in {
        "Theory": ("theory", "metric", "spacetime", "geometry", "lagrange"),
        "Tests": ("test", "validation", "benchmark"),
        "Data": ("data", "g79", "energy", "mass-projection"),
        "Simulation": ("trajectory", "simulation", "calculation"),
        "Visualisation": ("plot", "starmap", "lensing"),
        "Documentation": ("documentation", "book", "how-to"),
        "Mathematics": ("pi", "zeta", "chord", "symplectic", "cycle"),
    }.items():
        if any(word in text for word in needles):
            tags.append(tag)
    return tags or ["Research"]


def build_repositories() -> list[dict]:
    public = public_repo_rows()
    counts = Counter(x["repository"] for x in FILES)
    test_counts = Counter(x["repository"] for x in FILES if x["test_related"])
    repos = []
    for repo in sorted(
        p for p in PHYSICS.iterdir()
        if (p / ".git").exists() and not any(marker in p.name.lower() for marker in PRIVATE_MARKERS)
    ):
        remote = git(repo, "remote", "get-url", "origin")
        safe_remote = remote if remote.startswith("https://github.com/") else ""
        entry = public.get(repo.name.lower(), {})
        branch = git(repo, "branch", "--show-current") or entry.get("listed_branch", "")
        commit = git(repo, "rev-parse", "--short=12", "HEAD")
        commit_date = git(repo, "log", "-1", "--format=%cI")
        latest_tag = git(repo, "describe", "--tags", "--abbrev=0")
        description = entry.get("description", "Local SSZ/physics research repository")
        porcelain = git(repo, "status", "--porcelain")
        repos.append({
            "name": repo.name,
            "full_name": entry.get("full_name", f"error-wtf/{repo.name}"),
            "description": description,
            "public_url": entry.get("url", safe_remote),
            "local_reference": f"physics/{repo.name}",
            "scientific_role": ", ".join(classify_repo(repo.name, description)),
            "tags": classify_repo(repo.name, description),
            "default_branch": branch,
            "commit": commit,
            "commit_date": commit_date,
            "release": latest_tag or "no local tag",
            "status": {"aktiv": "active", "archiviert": "archived"}.get(entry.get("public_status", ""), "local"),
            "working_tree": "modified" if porcelain else "clean",
            "file_count": counts[repo.name],
            "test_related_files": test_counts[repo.name],
        })
    return repos


def build_tests() -> list[dict]:
    tests = []
    definition = re.compile(r"^\s*(?:async\s+)?def\s+(test_[A-Za-z0-9_]+)\s*\(", re.M)
    class_def = re.compile(r"^\s*class\s+(Test[A-Za-z0-9_]+)", re.M)
    status_re = re.compile(r"\b(PASS(?:ED)?|FAIL(?:ED)?|SKIP(?:PED)?|XFAIL|XPASS)\b", re.I)
    for item in FILES:
        path = item["path"]
        if not item["test_related"] or item["processing_status"] != "text-indexed":
            continue
        absolute = SOURCE_HOME / path
        if not absolute.exists() or absolute.stat().st_size > 2_000_000:
            continue
        try:
            text = absolute.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        names = definition.findall(text)
        if not names and absolute.suffix == ".py" and ("test" in absolute.name.lower()):
            names = class_def.findall(text) or [absolute.stem]
        if not names and absolute.suffix.lower() not in {".md", ".txt", ".json", ".csv", ".log"}:
            continue
        statuses = Counter(x.upper() for x in status_re.findall(text))
        if not names and statuses:
            names = [absolute.stem]
        for name in names[:500]:
            lower = f"{name} {path}".lower()
            category = (
                "Limit test" if any(x in lower for x in ("limit", "asympt", "boundary"))
                else "Dimensional check" if any(x in lower for x in ("dimension", "unit"))
                else "Regression test" if "regression" in lower
                else "Symbolic test" if any(x in lower for x in ("symbolic", "sympy", "tensor"))
                else "Data comparison" if any(x in lower for x in ("data", "fit", "observation"))
                else "Numerical test" if any(x in lower for x in ("numeric", "precision", "tolerance"))
                else "Unit/integration test"
            )
            tests.append({
                "repository": item["repository"],
                "test_name": name,
                "category": category,
                "quantity": item["topic"],
                "result": "PASS/FAIL is determined by a reproduced run" if not statuses else dict(statuses),
                "status": "catalogued",
                "tolerance": "from implementation/fixture",
                "file": path,
                "command": f"pytest {path.split('/', 1)[-1]} -q" if absolute.suffix == ".py" else "see result artefact",
                "meaning": f"Checks an implemented aspect of “{item['topic']}”.",
                "does_not_prove": "A software test is not empirical confirmation by nature.",
            })
    return tests


def build_formula_candidates() -> list[dict]:
    candidates = []
    seen = set()
    block_re = re.compile(r"\$\$(.+?)\$\$|\\\[(.+?)\\\]", re.S)
    inline_re = re.compile(r"`([^`]*(?:Xi|Ξ|D\(|r_s|dJ|K\(|R\()[^`]*)`")
    priority = [
        "CANONICAL_XI_AND_BLEND_RESOLUTION.md", "SSZ_CANONICAL_FORMULAS_2026.md",
        "JIF_FOUNDATION_CANONICAL.md", "formula_compendium.md", "black_hole_metric.md",
        "singularities.md", "ppn_formulas.md", "worked_examples.md",
    ]
    selected = sorted(
        (x for x in FILES if x["processing_status"] == "text-indexed" and
         (x["extension"] in {".tex", ".md", ".txt"})),
        key=lambda x: (not any(p in x["path"] for p in priority), x["path"])
    )
    for item in selected:
        absolute = SOURCE_HOME / item["path"]
        if not absolute.exists() or absolute.stat().st_size > 3_000_000:
            continue
        text = absolute.read_text(encoding="utf-8", errors="replace")
        raw = ["".join(x).strip() for x in block_re.findall(text)]
        raw += inline_re.findall(text)
        for formula in raw:
            compact = re.sub(r"\s+", " ", formula).strip()
            compact = re.sub(r"/home/[^\s\"']+", "$SOURCE_PATH", compact)
            if not (3 < len(compact) < 1000):
                continue
            key = re.sub(r"\s+", "", compact).lower()
            if key in seen:
                continue
            seen.add(key)
            candidates.append({
                "formula": compact,
                "source": item["path"],
                "repository": item["repository"],
                "topic": item["topic"],
                "status": "candidate-needs-human-context" if not item["canonical"] else "canonical-source-candidate",
            })
            if len(candidates) >= 4000:
                return candidates
    return candidates


def write(name: str, value) -> None:
    (PROJECT / "data" / name).write_text(
        json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def main() -> None:
    repositories = build_repositories()
    tests = build_tests()
    formulas = build_formula_candidates()
    write("repositories.json", {"count": len(repositories), "repositories": repositories})
    write("tests.json", {"count": len(tests), "tests": tests})
    write("formula-candidates.json", {"count": len(formulas), "formulas": formulas})
    summary = {
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "repositories": len(repositories),
        "tests": len(tests),
        "formula_candidates": len(formulas),
    }
    write("catalog-summary.json", summary)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
