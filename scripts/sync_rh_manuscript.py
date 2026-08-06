#!/usr/bin/env python3
"""Render the vendored canonical RH manuscript into the public portal page."""

from __future__ import annotations

import hashlib
import html
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/docs/RH_PROOF_CANDIDATE_COMPLETE.md"
PAGE = ROOT / "rh-proof-candidate.html"
START = "<!-- RH_MANUSCRIPT_START -->"
END = "<!-- RH_MANUSCRIPT_END -->"


def inline(text: str) -> str:
    escaped = html.escape(text, quote=False)
    escaped = re.sub(r"`([^`]+)`", r"<code>\1</code>", escaped)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", escaped)
    return escaped


def render(markdown: str, digest: str) -> str:
    lines = markdown.splitlines()
    body: list[str] = []
    paragraph: list[str] = []
    in_math = False
    math_lines: list[str] = []
    list_items: list[str] = []

    def flush_paragraph() -> None:
        if paragraph:
            body.append(f"<p>{inline(' '.join(part.strip() for part in paragraph))}</p>")
            paragraph.clear()

    def close_list() -> None:
        if list_items:
            body.append("<ul>")
            body.extend(f"<li>{inline(item)}</li>" for item in list_items)
            body.append("</ul>")
            list_items.clear()

    for line in lines:
        stripped = line.strip()
        if in_math:
            math_lines.append(line)
            if stripped == r"\]":
                body.append('<div class="rh-equation">' + "\n".join(math_lines) + "</div>")
                math_lines.clear()
                in_math = False
            continue
        if stripped == r"\[":
            flush_paragraph()
            close_list()
            in_math = True
            math_lines = [line]
            continue
        heading = re.match(r"^(#{1,4})\s+(.+)$", line)
        if heading:
            flush_paragraph()
            close_list()
            source_level = len(heading.group(1))
            level = min(4, source_level + 1)
            body.append(f"<h{level}>{inline(heading.group(2))}</h{level}>")
            continue
        item = re.match(r"^\s*\*\s+(.+)$", line)
        if item:
            flush_paragraph()
            list_items.append(item.group(1))
            continue
        if list_items and line.startswith("  "):
            list_items[-1] += " " + stripped
            continue
        if not stripped:
            flush_paragraph()
            close_list()
            continue
        close_list()
        paragraph.append(line)

    flush_paragraph()
    close_list()
    if in_math:
        raise SystemExit("Unclosed display-math block in canonical manuscript")

    return f"""
<section id="canonical-manuscript" class="section rh-canonical-manuscript" data-source-sha256="{digest}">
<div class="section-head">
<span class="rh-kicker">10 · complete canonical manuscript</span>
<h2>The full proof-candidate text, synchronized from the source repository</h2>
<p>This section contains the complete text of <code>docs/RH_PROOF_CANDIDATE_COMPLETE.md</code>, not a shortened portal summary. The reader-friendly derivation above and this canonical copy are kept together so omissions are mechanically detectable.</p>
</div>
<div class="rh-manuscript-provenance">
<strong>Vendored source SHA-256</strong>
<code>{digest}</code>
<a href="assets/docs/RH_PROOF_CANDIDATE_COMPLETE.md">Open the exact Markdown source</a>
</div>
<article class="rh-manuscript-body">
{chr(10).join(body)}
</article>
</section>
""".strip()


def main() -> None:
    markdown = SOURCE.read_text(encoding="utf-8")
    digest = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
    page = PAGE.read_text(encoding="utf-8")
    if START not in page or END not in page:
        raise SystemExit("RH manuscript synchronization markers are missing")
    prefix, remainder = page.split(START, 1)
    _, suffix = remainder.split(END, 1)
    rendered = render(markdown, digest)
    PAGE.write_text(
        f"{prefix}{START}\n{rendered}\n{END}{suffix}",
        encoding="utf-8",
    )
    print(f"Synced {SOURCE.relative_to(ROOT)} into {PAGE.name}")
    print(f"SHA-256: {digest}")


if __name__ == "__main__":
    main()
