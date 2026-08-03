#!/usr/bin/env python3
"""Audit page structure and public repository coverage across the static portal."""
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids=[]; self.links=[]; self.scripts=[]; self.canvases=0
        self.h1=0; self.main=0; self.nav=0; self.footer=0
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if "id" in a:self.ids.append(a["id"])
        if "href" in a:self.links.append(a["href"])
        if tag=="script" and "src" in a:self.scripts.append(a["src"])
        if tag=="canvas":self.canvases+=1
        if tag=="h1":self.h1+=1
        if tag=="main":self.main+=1
        if tag=="nav":self.nav+=1
        if tag=="footer":self.footer+=1

pages={}
issues=[]
for path in sorted(ROOT.glob("*.html")):
    text=path.read_text(encoding="utf-8")
    p=PageParser();p.feed(text);pages[path.name]={"text":text,"parser":p}
    duplicate=[key for key,n in Counter(p.ids).items() if n>1]
    if duplicate:issues.append({"page":path.name,"severity":"error","issue":"duplicate IDs","detail":duplicate})
    for label,value in (("h1",p.h1),("main",p.main),("navigation",p.nav),("footer",p.footer)):
        if value<1:issues.append({"page":path.name,"severity":"error","issue":f"missing {label}","detail":value})
    if "window.MathJax=" in text:
        issues.append({"page":path.name,"severity":"error","issue":"inline MathJax config can violate CSP","detail":""})

repo_payload=json.loads((ROOT/"data/repositories.json").read_text(encoding="utf-8"))
repos=repo_payload["repositories"]
coverage=[]
content_pages={k:v for k,v in pages.items() if k not in {"atlas.html","repositories.html"}}
for repo in repos:
    name=repo["name"]
    url=repo.get("public_url","")
    mentioned=[page for page,v in content_pages.items() if name.lower() in v["text"].lower()]
    linked=[page for page,v in pages.items() if url and url in v["text"]]
    interactive=[page for page in mentioned if pages[page]["parser"].canvases>0]
    coverage.append({
        "repository":name,"public_url":url,"content_pages":mentioned,
        "direct_link_pages":linked,"interactive_context_pages":interactive,
        "coverage_status":"interactive" if interactive else "explained" if mentioned else "catalogue-only"
    })
    if not mentioned:
        issues.append({"page":"portal","severity":"warning","issue":"repository only in catalogue/atlas","detail":name})
    if url and not linked:
        issues.append({"page":"portal","severity":"warning","issue":"repository lacks direct public link","detail":name})

report={
    "pages_audited":len(pages),
    "repositories_audited":len(repos),
    "test_catalog_records":json.loads((ROOT/"data/tests.json").read_text())["count"],
    "page_issue_count":len(issues),
    "issues":issues,
    "repository_coverage":coverage,
    "coverage_summary":dict(Counter(x["coverage_status"] for x in coverage))
}
(ROOT/"data/portal-coverage-audit.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps({k:report[k] for k in ("pages_audited","repositories_audited","test_catalog_records","page_issue_count","coverage_summary")},indent=2))
