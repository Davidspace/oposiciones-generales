# Evidence bundle

## Baseline verification — 2026-07-29

| Evidence | Result |
|---|---|
| `npm ci --ignore-scripts --no-audit --no-fund` | 506 packages installed; exit 0 |
| `npm run content:validate` | 13-topic baseline catalog valid |
| `npm run lint` | exit 0 |
| `npm test` | build plus 9 tests passed |
| `git diff --check` before lock commit | clean |

## Dependency repair

- Symptom: clean `npm ci` rejected the committed lockfile.
- Root cause: missing `@emnapi/core` and `@emnapi/runtime` entries and incompatible hoisted `@emnapi/wasi-threads` resolution.
- Canonical owner: `package-lock.json`.
- Repair: regenerate lock metadata only; 37 insertions and 3 deletions.
- Verification: clean install and full existing suite pass.
- Retirement: no fallback or duplicate install path added.

## Evidence still required

- Direct official source coverage and independent review for the remaining 33 topic modules.
- Migration of the public MC01 text and decisions from `lib/ss-casolab.ts` to the canonical content source.
- Moodle import/re-export and restored-backup tests against the real course.
- Bizum order APIs, authenticated manual confirmation, reconciliation and refund runbook.
- WhatsApp links and consent behavior with configured test number.
- Real seller/legal/offer fields and an external legal review.
- Production deployment and full end-to-end purchase/access test.

## Editorial and commerce slice — 2026-07-30

| Evidence | Result |
|---|---|
| `npm run content:validate` | 36 topics; 24 draft modules; 444 claims; 220 questions; 3 structured cases; exit 0 |
| `tests/moodle-export.test.mjs` + `tests/moodle-module-export.test.mjs` | 7/7 passed; deterministic manifests and drift detection |
| `tests/funnel-events.test.mjs` | 4/4 passed; browser cannot assert sale/access/refund and metadata is allowlisted |
| `tests/order-state.test.mjs` | 8/8 passed; payment and access transitions are separate and actor-gated |
| `tests/order-schema.test.mjs` + `tests/order-migration.test.mjs` | 11/11 passed against SQLite with migrations `0000` through `0003` |
| `npm run build` | content validation plus vinext build; exit 0 |
| `npm run lint` | exit 0 |
| `npm run test:unit` | 108/108 passed at this checkpoint |
| `node --test tests/rendered-html.test.mjs` | 5/5 passed |
| `npm run content:gate-beta` | structuralReady true; publicationReady false; exit 3 because reviews remain pending |

The content remains `draft`/`pending`. Automated validation proves structure and internal consistency; it is not evidence of Alba's review, legal approval, a Moodle import, a professional Bizum contract or a real payment. The checkpoint is committed as `254a95f`.

## G19 editorial slice — 2026-07-30

| Evidence | Result |
|---|---|
| G19 source slice | 20 official-BOE-traced claims, 8 questions, lesson and review sheet; all remain `draft`/`pending` |
| `npm run content:validate` | 36 topics; 25 modules; 464 claims; 228 questions; 3 structured cases; exit 0 |
| `npm run test:unit` | 108/108 passed |
| `npm run build` | exit 0 |

The G19 slice is not approved for publication. Human academic, legal and normative review remains required.

## G20 editorial slice — 2026-07-30

| Evidence | Result |
|---|---|
| G20 source slice | 20 official-BOE-traced claims, 8 questions, lesson and review sheet; all remain `draft`/`pending` |
| `npm run content:validate` | 36 topics; 26 modules; 484 claims; 236 questions; 3 structured cases; exit 0 |
| `npm run test:unit` | 108/108 passed |
| `npm run build` | exit 0 |
| `content:gate-beta` | structuralReady true; publicationReady false; exit 3 by design while reviews remain pending |

The G20 slice is not approved for publication. Human academic, legal and normative review remains required.

## Complete remaining SS modules — 2026-07-30

| Evidence | Result |
|---|---|
| G12, G21-G23, S08-S13 source slices | 10 modules; 200 official-source-traced claims; 80 questions; lesson and review sheet for each; all remain `draft`/`pending` |
| `npm run content:validate` | 36 topics; 36 modules; 684 claims; 316 questions; 3 structured cases; exit 0 |
| `npm run lint` | exit 0 |
| `npm run test:unit` | 108/108 passed |
| `npm run build` | exit 0 |
| `node --test tests/rendered-html.test.mjs` | 6/6 passed |
| `npm run content:gate-beta` | structuralReady true; publicationReady false; exit 3 by design while reviews remain pending |

The complete editorial corpus is structurally ready for human review. This evidence does not prove legal approval, Moodle import, seller readiness, payment activation or publication readiness.

## Curriculum coverage audit — 2026-07-30

| Evidence | Result |
|---|---|
| `npm run content:audit` | 36/36 themes present; 288/288 module questions; no missing question or claim references; exit 0 |
| `94-curriculum-audit.md` | General block 23/23 and specific block 13/13; case targets and review order are explicit |
| Publication gate | Closed: 36 modules still need academic, legal and normative review; practical bank remains below target |

The audit proves structural coverage only. Alba must still verify programme epigraphs, difficulty, calculations and the Moodle inventory before any module or case becomes publishable.

## Practical microcase bank — 2026-07-30

| Evidence | Result |
|---|---|
| `npm run content:practical-drafts` | 6 original microcases; 30 practical questions; 30 normative claims; all `draft`/`pending` |
| `npm run content:validate` | 36 topics; 36 modules; 714 claims; 346 questions; 9 structured cases; exit 0 |
| `npm run content:audit` | 8/8 microcases; 1/4 full cases; 0/2 simulations; publication remains closed |
| Curriculum links | MC03–MC08 connected to S04–S12 in module manifests and audit |

This slice closes the minimum microcase count but does not prove academic, legal or normative approval. Full cases, simulations, Moodle import and external review remain outstanding.

## Practical full-case bank — 2026-07-30

| Evidence | Result |
|---|---|
| `npm run content:full-case-drafts` | CP02–CP04; 54 questions; 54 normative claims; all `draft`/`pending` |
| `npm run content:validate` | 36 topics; 36 modules; 768 claims; 400 questions; 12 structured cases; exit 0 |
| `npm run content:audit` | 8/8 microcases; 4/4 full cases; 0/2 simulations; publication remains closed |
| Full-case shape | Each case has 15 main questions and 3 reserve questions in declared order |

The full-case slice completes the minimum case count structurally. It does not prove legal correctness, calibration, academic approval, Moodle import or publication readiness.

## Practical simulations — 2026-07-30

| Evidence | Result |
|---|---|
| `npm run content:simulation-drafts` | `SIM01` and `SIM02`; each has 73 general questions, 120 minutes and an associated full case |
| `npm run content:validate` | 36 topics; 36 modules; 770 claims; 400 questions; 14 structured cases; exit 0 |
| `npm run content:audit` | 8/8 microcases; 4/4 full cases; 2/2 simulations; publication remains closed |
| `npm run content:gate-beta` | Structural gate green: 8/8 modules, 92 referenced questions, 120 claims and 3 cases; publication gate closed with 429 review issues |
| SIM02 boundary | Initial selection is valid structurally but still needs a dedicated reviewed `assessment-only` bank and calibration |

The minimum practical inventory is now structurally complete. Human academic, legal and normative review, Moodle import, calibration and commercial gates remain open work.

## TAI Moodle inventory and landing — 2026-07-30

| Evidence | Result |
|---|---|
| Moodle course | Read-only review of `TAI - CUERPO DE TÉCNICOS AUXILIARES DE INFORMÁTICA` (course id 18) |
| Course inventory | 33 topic sections; 33 PDF resources; 33 topic autoevaluations; 10 full simulations; one information page and one announcements forum |
| Exam structure shown in Moodle | 80 questions plus 5 reserve in the first part; 20 practical questions plus 5 reserve in the second part; 120 minutes; one-third penalty for errors; blanks do not penalize |
| Simulation split | Five simulations for block III and five for block IV |
| TAI landing | `/tai` now describes only the LORMAN Moodle inventory, the asynchronous format and a 59 € launch-price proposal; it has no third-party course link |
| Boundary | Moodle was read only. Own checkout and enrolment remain disabled until configured |

## S03 source audit â€” 2026-07-30

| Evidence | Result |
|---|---|
| `98-s03-source-audit.md` | S03 reviewed against the consolidated TRLGSS, RD 84/1996 and Order TAS/2865/2003; all 23 claims retain traceable official sources and pending review status |
| High-risk checks | Affiliation, pluriempleo/pluriactividad, 60-day advance, three-day low, late effects, article 166 categories and 1,080 days/12 years convention rule are explicitly queued for human review |
| Publication boundary | No module, claim, question or case was marked approved; the beta/publication gate remains closed |
