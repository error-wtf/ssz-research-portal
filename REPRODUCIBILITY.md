# Reproducibility

Run the portal:

```bash
python3 -m http.server 8000
```

Regenerate static research metadata:

```bash
python3 scripts/inventory_files.py
python3 scripts/build_catalogs.py
```

Validate:

```bash
python3 scripts/validate_content.py
python3 scripts/check_links.py
python3 scripts/check_secrets.py
```

Repository-level scientific tests remain in their own repositories and environments. This portal records and links them; it does not silently modify those environments.
