#!/usr/bin/env python3
"""Build the public, path-sanitised SSZ source inventory.

Archives are catalogued but never opened. Existing TeX sources are indexed and
text-scanned; the portal itself publishes no TeX build artefacts.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
HOME = Path(os.getenv("SSZ_SOURCE_HOME", PROJECT.parent))
PRIVATE_MARKERS_FILE = PROJECT / ".private-sources"
DEFAULT_PRIVATE_MARKERS = (
    "ssz-" + "jif-core",
    "ssz-" + "jif-forward-lab",
    "j" + "if",
    "segmented-spacetime-" + "book",
    "ssz_" + "book_en",
)
PRIVATE_MARKERS = DEFAULT_PRIVATE_MARKERS + tuple(
    line.strip().lower() for line in PRIVATE_MARKERS_FILE.read_text(encoding="utf-8").splitlines()
    if line.strip() and not line.startswith("#")
) if PRIVATE_MARKERS_FILE.exists() else ()
ROOTS = [
    HOME / "physics",
    HOME / "rag",
]
EXCLUDED_DIRS = {
    ".git", ".hg", ".svn", "node_modules", "venv", ".venv", "__pycache__",
    ".pytest_cache", ".mypy_cache", ".ruff_cache", ".tox", "dist", "build",
    "coverage", ".coverage", "tmp", "temp",
}
ARCHIVE_SUFFIXES = (".zip", ".tar", ".tar.gz", ".tgz", ".7z", ".rar", ".gz")
TEXT_SUFFIXES = {
    ".md", ".txt", ".rst", ".tex", ".html", ".css", ".js", ".ts", ".tsx",
    ".jsx", ".py", ".ipynb", ".json", ".jsonl", ".yaml", ".yml", ".toml",
    ".csv", ".tsv", ".xml", ".svg", ".ini", ".cfg", ".conf", ".sh",
}
IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}
TEST_RE = re.compile(r"(^|[/_.-])(test|tests|validation|audit|benchmark|result|report)([/_.-]|$)", re.I)
LEGACY_RE = re.compile(r"legacy|deprecated|obsolete|archive|old|histor", re.I)
CANON_RE = re.compile(r"canonical|single.source.of.truth|model.lock|branch.lock|p0", re.I)
GENERATED_RE = re.compile(r"generated|full.output|coverage|dist|build|export", re.I)


def public_path(path: Path) -> str:
    try:
        return "physics/" + path.relative_to(HOME / "physics").as_posix()
    except ValueError:
        return "rag/" + path.relative_to(HOME / "rag").as_posix()


def repository_for(path: Path) -> str:
    if HOME / "physics" in path.parents:
        relative = path.relative_to(HOME / "physics")
        first = relative.parts[0] if relative.parts else "physics"
        candidate = HOME / "physics" / first
        if (candidate / ".git").exists():
            return first
        if first == "hilfsdateien" and len(relative.parts) > 2 and relative.parts[1] == "markdowns":
            return relative.parts[2]
        return "SSZ research corpus"
    return "RAG knowledge corpus"


def topic_for(value: str) -> str:
    lowered = value.lower()
    rules = [
        ("Interior and global structure", ("singular", "kretsch", "ricci", "interior", "global_structure")),
        ("Strong field", ("strong", "black_hole", "horizon", "isco", "photon", "qnm", "shadow")),
        ("Weak field", ("ppn", "mercur", "shapiro", "cassini", "weak")),
        ("Lensing and observation", ("lens", "redshift", "sgr", "m87", "cygnus", "g79")),
        ("Rotation and Sagnac", ("sagnac", "rotation", "frame_drag")),
        ("Metric and geometry", ("metric", "geodes", "tensor", "curvature", "xi", "dilation")),
        ("Tests and validation", ("test", "valid", "audit", "benchmark", "result")),
        ("Reproducibility", ("repro", "requirements", "environment", "lock", "workflow")),
        ("Documentation and papers", ("readme", "paper", "book", "documentation", "glossary")),
        ("Code and simulation", (".py", ".js", ".ts", "src/", "simulation", "notebook")),
    ]
    for topic, needles in rules:
        if any(needle in lowered for needle in needles):
            return topic
    return "Other research artefacts"


def function_for(path: Path, relative: str) -> str:
    suffix = path.suffix.lower()
    if any(relative.lower().endswith(s) for s in ARCHIVE_SUFFIXES):
        return "Archive (catalogued only)"
    if TEST_RE.search(relative):
        return "Test result" if suffix in {".json", ".csv", ".tsv", ".md", ".txt"} else "Test code"
    if suffix in {".md", ".rst", ".txt", ".tex", ".pdf", ".html"}:
        return "Documentation"
    if suffix in {".py", ".js", ".ts", ".tsx", ".jsx", ".sh", ".ipynb"}:
        return "Source code"
    if suffix in {".json", ".jsonl", ".csv", ".tsv", ".yaml", ".yml", ".toml", ".xml"}:
        return "Data or configuration"
    if suffix in IMAGE_SUFFIXES:
        return "Visualisation"
    return "Binary or supporting artefact"


def short_description(path: Path, text: str | None, function: str) -> str:
    if text:
        for line in text.splitlines():
            clean = re.sub(r"^[#*\-\s]+", "", line).strip()
            if 12 <= len(clean) <= 180:
                clean = clean.replace(str(HOME), "$SOURCE_ROOT")
                clean = re.sub("/home/" + r"[^/\s\"']+", "$SOURCE_ROOT", clean)
                return clean
    return f"{function}: {path.name}"


def read_text(path: Path) -> tuple[str | None, str | None]:
    if path.suffix.lower() not in TEXT_SUFFIXES:
        return None, None
    try:
        return path.read_text(encoding="utf-8"), None
    except UnicodeDecodeError:
        try:
            return path.read_text(encoding="latin-1"), "latin-1 fallback"
        except OSError as exc:
            return None, type(exc).__name__
    except OSError as exc:
        return None, type(exc).__name__


def main() -> None:
    files: list[dict] = []
    hash_groups: dict[str, list[int]] = defaultdict(list)
    stats = Counter()

    for root in ROOTS:
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = sorted(d for d in dirnames if d not in EXCLUDED_DIRS)
            for filename in sorted(filenames):
                path = Path(dirpath) / filename
                relative = public_path(path)
                if any(marker in relative.lower() for marker in PRIVATE_MARKERS):
                    continue
                try:
                    stat = path.stat()
                except OSError:
                    stats["unreadable"] += 1
                    continue
                archive = any(relative.lower().endswith(s) for s in ARCHIVE_SUFFIXES)
                text, error = (None, None) if archive else read_text(path)
                privacy_probe = f"{relative}\n{text or ''}".lower()
                if any(marker in privacy_probe for marker in PRIVATE_MARKERS):
                    stats["private_excluded"] += 1
                    continue
                digest = ""
                try:
                    hasher = hashlib.sha256()
                    with path.open("rb") as handle:
                        for block in iter(lambda: handle.read(1024 * 1024), b""):
                            hasher.update(block)
                    digest = hasher.hexdigest()
                except OSError:
                    error = error or "hash-read-error"

                flags = f"{relative}\n{text[:4000] if text else ''}"
                category = function_for(path, relative)
                canonical = bool(CANON_RE.search(flags))
                legacy = bool(LEGACY_RE.search(flags))
                generated = bool(GENERATED_RE.search(relative))
                if archive:
                    processing = "catalogued-not-opened"
                    stats["archives"] += 1
                elif text is not None:
                    processing = "text-indexed"
                    stats["text_indexed"] += 1
                elif error:
                    processing = "unreadable"
                    stats["unreadable"] += 1
                else:
                    processing = "binary-catalogued"
                    stats["binary"] += 1

                item = {
                    "id": len(files) + 1,
                    "path": relative,
                    "name": filename,
                    "extension": "".join(path.suffixes).lower() or "(none)",
                    "size_bytes": stat.st_size,
                    "modified_utc": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(),
                    "data_type": path.suffix.lower().lstrip(".") or "unknown",
                    "repository": repository_for(path),
                    "topic": topic_for(relative),
                    "scientific_function": category,
                    "relevance": "central" if canonical else ("high" if category in {"Test result", "Test code", "Documentation"} else "supporting"),
                    "processing_status": processing,
                    "canonical": canonical,
                    "legacy": legacy,
                    "generated": generated,
                    "test_related": bool(TEST_RE.search(relative)),
                    "description": short_description(path, text, category),
                    "sha256": digest,
                    "duplicate_of": None,
                    "read_note": error,
                }
                files.append(item)
                if digest:
                    hash_groups[digest].append(len(files) - 1)

    duplicate_groups = 0
    duplicate_files = 0
    for indexes in hash_groups.values():
        if len(indexes) < 2:
            continue
        duplicate_groups += 1
        original = files[indexes[0]]["path"]
        for index in indexes[1:]:
            files[index]["duplicate_of"] = original
            duplicate_files += 1

    summary = {
        "generated_utc": datetime.now(timezone.utc).isoformat(),
        "source_roots": ["physics/", "rag/"],
        "total_files": len(files),
        "text_indexed": stats["text_indexed"],
        "binary_catalogued": stats["binary"],
        "archives_catalogued_not_opened": stats["archives"],
        "unreadable": stats["unreadable"],
        "private_excluded": stats["private_excluded"],
        "duplicate_groups": duplicate_groups,
        "duplicate_files": duplicate_files,
        "canonical_marked": sum(bool(x["canonical"]) for x in files),
        "legacy_marked": sum(bool(x["legacy"]) for x in files),
        "test_related": sum(bool(x["test_related"]) for x in files),
        "repositories_or_corpora": len({x["repository"] for x in files}),
        "extensions": dict(Counter(x["extension"] for x in files).most_common()),
        "topics": dict(Counter(x["topic"] for x in files).most_common()),
    }
    output = {"summary": summary, "files": files}
    (PROJECT / "data" / "files.json").write_text(
        json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (PROJECT / "data" / "inventory-summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
