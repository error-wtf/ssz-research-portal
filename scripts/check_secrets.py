#!/usr/bin/env python3
"""Conservative secret and private-path scanner for publishable files."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP = {".git"}
PATTERNS = {
    "GitHub token": re.compile(r"(?:ghp_|github_pat_)[A-Za-z0-9_]{16,}"),
    "AWS access key": re.compile(r"AKIA[0-9A-Z]{16}"),
    "private key": re.compile(r"-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----"),
    "authenticated URL": re.compile(r"https?://[^/\s:@]+:[^/\s@]+@"),
    "published private path": re.compile("/home/" + r"[^/\s]+/"),
}
TEXT_EXT = {".html", ".css", ".js", ".json", ".md", ".py", ".yml", ".yaml", ".txt", ".xml"}


def main():
    findings = []
    checked = 0
    for path in ROOT.rglob("*"):
        if not path.is_file() or any(part in SKIP for part in path.parts):
            continue
        if path.suffix.lower() not in TEXT_EXT or path.stat().st_size > 30_000_000:
            continue
        if path.name in {"check_secrets.py", "inventory_files.py"}:
            continue
        checked += 1
        text = path.read_text(encoding="utf-8", errors="replace")
        for label, pattern in PATTERNS.items():
            if pattern.search(text):
                findings.append(f"{path.relative_to(ROOT)}: {label}")
    if findings:
        raise SystemExit("\n".join(findings))
    print(f"OK: no recognised secrets in {checked} publishable text files")


if __name__ == "__main__":
    main()
