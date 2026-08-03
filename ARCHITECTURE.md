# Architecture

## Decision

The portal is deliberately plain static HTML, CSS and JavaScript. It keeps the supplied dashboard’s Inter typography, slate surfaces, gold accents, cards, Chart.js plot and Tailwind CDN, while replacing its incorrect cubic blend with a derivative-matched quintic C² implementation.

## Runtime

- HTML pages contain the full scientific narrative and remain readable without JavaScript.
- `assets/css/site.css` provides the shared design system and responsive layouts.
- `assets/js/site.js` provides navigation, theme, copying, permalinks and page search.
- `assets/js/physics.js` contains browser-side SSZ functions, plots and calculators.
- `assets/js/catalogs.js` loads static repository and test catalogues.
- `data/*.json` contains generated and curated research metadata.

All URLs are relative, so the site works at a GitHub Pages repository subpath.

## External resources

The site retains the template’s lightweight Tailwind, Chart.js and Phosphor CDN dependencies. No tracker, account, database or client credential is used.
