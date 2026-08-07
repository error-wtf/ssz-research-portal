# Explanation completeness audit

**Audit date:** 2026-08-07  
**Scope:** all portal HTML pages, the formula catalogue, native canvas explanations,
and the shared explanation renderer.

## Result

The portal now uses a single explanation owner for each rendered object:

- authored explanation blocks remain authoritative;
- the shared renderer adds one generated block only when no authored block exists;
- formula-catalogue entries are routed through semantic families rather than one
  copied segment-field paragraph;
- visual explanations identify the actual canvas, controls, encoded quantity,
  method and limitation.

The renderer deliberately keeps the full explanation contract:

1. purpose;
2. how to read the expression;
3. derivation and dependencies;
4. meaning and domain;
5. limits and scope;
6. verification and guardrails;
7. related formulas.

## Inventory

The automated inventory currently covers **28 HTML pages**, **134 static formula
blocks**, **98 catalogue formulas**, and **63 canvas visualisations**. The
coverage test rejects generic quantitative explanations and requires substantive
purpose, reading, meaning, limitation and verification text for every discovered
formula and canvas.

The portal also ships **36 portal-owned repository role records** in
`data/repository-scientific-roles.json`. Each record states role, authority
status, inputs, outputs, upstream/downstream dependencies, test classes,
evidence class, conflicts and an explicit non-claim boundary. GitHub metadata is
displayed as metadata only and cannot override those scientific annotations.

Evidence counts are intentionally separated: the catalogue contains **9,300
catalogued test/result artefacts**; the captured green snapshot contains **1,296
passing assertions across 12 repositories**; and the intermediate audit contains
**1,175 executed outcomes** with its own recorded failures and timeout. None is
presented as 9,300 independent experiments.

## Trace clarification

The historical one-sided cosine/sine boundary diagnostic is retained only as a
negative regression test. It is not a dependency of the canonical matching
route. The current route uses the exact two-sided Volterra identity

$$
u_-^\\alpha(x)-u_+^\\alpha(x)
=e^{-i\\alpha x}\\Xi(\\alpha),
$$

so an assumed zero of \\Xi gives equality of the two complete states for every
finite x. Reviewers must therefore distinguish the historical failed one-sided
inference from the current two-sided state-matching lemma.

## Evidence and non-claims

Verification text distinguishes definitions, algebraic identities, software
tests, convergence bounds, reference compatibility, dataset-conditioned
comparisons and independent replication. Passing repository tests documents
the implementation and evidence ledger; it is not itself an independent
experimental confirmation or an accepted proof of the Riemann hypothesis.

The portal status remains:

`CANDIDATE_PROOF_COMPLETE_PENDING_INDEPENDENT_REVIEW`

Any remaining question is therefore an external mathematical-review question,
not a hidden generic explanation or an undocumented copied paragraph.

## Reproduction

From the portal repository root:

`bash
node scripts/test_explanation_coverage.js
`

The test prints the discovered formula/canvas inventory and fails if a generic
formula explanation, missing semantic section, or underspecified visual remains.
