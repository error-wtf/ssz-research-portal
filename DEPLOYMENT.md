# Deployment

The site is GitHub Pages compatible without a build step. All internal asset links are relative.

`pages-workflow.example.yml` documents an optional Actions deployment after
renaming it to `.github/workflows/pages.yml` with a credential authorised to
manage workflows. The current deployment uses GitHub Pages’ `main`/root branch
source, so the published site requires no workflow permission.

Local preview:

```bash
python3 -m http.server 8000
```

No token is required by the deployed browser. Any authenticated GitHub metadata refresh happens locally before static JSON is committed.
