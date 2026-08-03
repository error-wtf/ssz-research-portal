# Formula Catalogue

- `data/formulas.json`: 28 reviewed central equations with a stable identifier,
  topic, readable MathJax source, units, domain and interpretation guardrail.
- `data/formula-candidates.json`: 4,000 deduplicated automatically extracted equation candidates.

Candidate extraction includes existing Markdown, text and TeX sources. Candidates
are never promoted to canonical status without context review. The website
renders reviewed mathematics in normal HTML with progressive MathJax enhancement;
it has no TeX build pipeline and remains readable if MathJax is unavailable.
