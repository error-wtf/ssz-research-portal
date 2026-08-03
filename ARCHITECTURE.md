# Architecture

## Decision

The portal is deliberately plain static HTML, CSS and JavaScript. It keeps the supplied dashboard’s Inter typography, slate surfaces, gold accents and cards while replacing the incorrect cubic blend with a derivative-matched quintic C² implementation. Scientific plots use native Canvas and therefore do not depend on Chart.js.

## Runtime

- HTML pages contain the full scientific narrative and remain readable without JavaScript.
- `assets/css/site.css` provides the shared design system and responsive layouts.
- `assets/js/site.js` provides navigation, theme, copying, permalinks and page search.
- `assets/js/physics.js` contains browser-side SSZ functions, the dependency-free metric explorer and calculators.
- `assets/js/visual-lab.js` provides seven labelled, self-hosted Canvas visualisations.
- `assets/js/atlas.js` renders the static 35-repository research atlas and its interactive constellation.
- `assets/js/catalogs.js` loads static public-repository and test catalogues and escapes metadata before rendering.
- `data/*.json` contains generated and curated research metadata.

Private source markers are held only in the gitignored `.private-sources` file.
Inventory and catalogue generators consult it before reading or publishing a
record. The private marker file and excluded records never enter the repository.

All URLs are relative, so the site works at a GitHub Pages repository subpath.

## External resources

Some legacy pages retain the template’s Tailwind and icon CDN tags, although the core layout is supplied by the local stylesheet. The metric explorer and visual lab have no plotting CDN dependency. No tracker, account, database or client credential is used.
