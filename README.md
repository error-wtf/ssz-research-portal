# Segmented Spacetime Research Portal

A static, provenance-first GitHub Pages portal for Segmented Spacetime (SSZ) and JIF. It expands the supplied `ssz_forschungs_dashboard_v2.html` design into an English research site without a framework, database, backend, archive extraction, or TeX build.

## Run

```bash
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/`.

## Regenerate and validate

```bash
python3 scripts/inventory_files.py
python3 scripts/build_catalogs.py
python3 scripts/validate_content.py
python3 scripts/check_links.py
python3 scripts/check_secrets.py
```

The source inventory uses public, neutral path references such as `physics/ssz-jif-core/...`. It never publishes `/home/error`, credentials, or authenticated remote URLs.

## Scientific scope

SSZ is treated as a mathematically concrete and falsifiable strong-field research programme, not as a completed or empirically confirmed fundamental theory. The P0 correction has priority: finite horizon time dilation is retained, while complete central regularity and singularity freedom are not claimed.
