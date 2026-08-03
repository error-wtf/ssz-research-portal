# Deployment

The site is GitHub Pages compatible without a build step. All internal asset links are relative.

The included workflow publishes the repository root as a Pages artefact after validation. Required repository setting: **Pages → Source → GitHub Actions**.

Local preview:

```bash
python3 -m http.server 8000
```

No token is required by the deployed browser. Any authenticated GitHub metadata refresh happens locally before static JSON is committed.
