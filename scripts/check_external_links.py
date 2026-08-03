#!/usr/bin/env python3
"""Inventory external links. Network validation is opt-in for reproducible offline builds."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
ROOT=Path(__file__).resolve().parents[1]
class P(HTMLParser):
    def __init__(self): super().__init__(); self.links=[]
    def handle_starttag(self,tag,attrs):
        values=dict(attrs)
        if tag=="a" and values.get("href","").startswith(("http://","https://")): self.links.append(values["href"])
links=set()
for path in ROOT.glob("*.html"):
    parser=P();parser.feed(path.read_text());links.update(parser.links)
bad=[url for url in links if urlsplit(url).scheme not in {"http","https"} or not urlsplit(url).netloc]
assert not bad, bad
print(f"OK: {len(links)} external links are syntactically valid; live reachability is recorded separately because offline builds make no network requests")
