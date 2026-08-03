#!/usr/bin/env python3
"""Validate internal static links and fragment targets."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if "id" in values:
            self.ids.add(values["id"])
        for key in ("href", "src"):
            if key in values:
                self.links.append(values[key])


def parsed(path):
    parser = Parser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def main():
    html = {path.resolve(): parsed(path) for path in ROOT.glob("*.html")}
    errors = []
    checked = 0
    for source, parser in html.items():
        for raw in parser.links:
            split = urlsplit(raw)
            if split.scheme or raw.startswith("//") or raw.startswith("mailto:"):
                continue
            target_path = (source.parent / unquote(split.path)).resolve() if split.path else source
            if split.path.endswith("/"):
                target_path /= "index.html"
            checked += 1
            if not target_path.exists():
                errors.append(f"{source.name}: missing {raw}")
                continue
            if split.fragment and target_path.suffix == ".html":
                target = html.get(target_path) or parsed(target_path)
                if split.fragment not in target.ids:
                    errors.append(f"{source.name}: missing fragment {raw}")
    if errors:
        raise SystemExit("\n".join(errors))
    print(f"OK: {checked} internal links/assets checked across {len(html)} HTML pages")


if __name__ == "__main__":
    main()
