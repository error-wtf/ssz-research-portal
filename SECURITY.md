# Security

- `gittoken.env`, `.env*`, SSH material and credential helpers are ignored.
- no token is copied into HTML, CSS, JavaScript, JSON, logs or screenshots;
- no browser-side authenticated GitHub request exists;
- source paths are normalised to `physics/...` or `rag/...`;
- archive contents are not extracted;
- a repository-wide secret scan runs before publication;
- external links use public HTTPS URLs;
- no force-push, history rewrite or source-repository reset is part of this project.
