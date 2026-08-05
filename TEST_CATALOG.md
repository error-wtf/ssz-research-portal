# Test Catalogue

`data/tests.json` records the **9,300** publishable test/result records executed by the complete current runner after private-source exclusion. The records are not 9,300 independent experiments: they resolve to 5,294 unique repository/test definitions and 9,216 repository/file/test identities across 28 test-bearing repositories. Each entry includes repository, test name, category, quantity/topic, status, tolerance placeholder, source file, reproduction command, scientific meaning and an explicit “does not prove” boundary.

The catalogue distinguishes unit/integration, numerical, symbolic, limit, dimensional, regression and data-comparison evidence. Historical audit totals are not merged because they use different counting units.

The browser dashboard in `tests.html` pages and filters the static catalogue.
