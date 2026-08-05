# Segmented Spacetime Research Portal

A static, provenance-first GitHub Pages portal for Segmented Spacetime (SSZ). It expands the supplied `ssz_forschungs_dashboard_v2.html` design into an English research site without a framework, database or backend. LaTeX source material may be analysed, while published equations are accessible HTML rather than a required TeX build.

**Live Pages:** [error-wtf.github.io/ssz-research-portal](https://error-wtf.github.io/ssz-research-portal/)

The self-hosted portal includes interactive Canvas and WebGL modules for metric geometry, observables, repository evidence and JIF counted phase. The dedicated JIF tab adds animated massive-system phasors, a detector-centred phase ledger, the public paper/timestamp notice and direct links to all four public JIF repositories. A separate QM wink tab presents the archived one-dimensional Schrödinger-style Easter egg as humour and explicitly not as scientifically validated evidence. The research archive also includes selected, clearly scoped figures from `ssz-paper-plots`.

## Run

```bash
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/`.

## Regenerate and validate

```bash
python3 scripts/inventory_files.py
python3 scripts/build_catalogs.py
python3 scripts/index_public_repositories.py
python3 scripts/validate_content.py
python3 scripts/check_links.py
python3 scripts/check_secrets.py
node scripts/test_physics.js
node scripts/test_jif.js
node scripts/test_page_guides.js
```

The source inventory uses public, neutral project-relative path references. It never publishes local home-directory paths, credentials, or authenticated remote URLs.

`data/public-repositories-all.json` records the public repositories in the latest API snapshot. `data/public-research-repositories.json` selects the classified physics and mathematics projects. The generated browser catalogue needs no GitHub token.

## Scientific scope

SSZ is treated as a mathematically concrete and falsifiable strong-field research programme, not as a completed or empirically confirmed fundamental theory. The P0 correction has priority: finite horizon time dilation is retained, while complete central regularity and singularity freedom are not claimed.
