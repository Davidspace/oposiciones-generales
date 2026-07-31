# Task intent — full SS academy

## Requested outcome

Deliver a working, low-maintenance academy or complete resource set for the C1 Administrative Corps of the Social Security Administration, covering theory and practical preparation. Use Bizum for payment and WhatsApp for communication, without spending money.

## Scope

- 23 general topics for the first part.
- 13 specific topics for the first and practical parts.
- Free diagnostic, paid product, question bank, connected cases and simulations.
- Moodle-ready editorial assets and operating documentation.
- Bizum order and manual confirmation flow that does not pretend to be an automated commercial gateway.
- WhatsApp Business click-to-chat, quick replies, labels and bounded support.
- Privacy, terms and evidence gates before real capture or sale.

## Non-goals

- Purchases, paid advertising, paid APIs or paid plugins.
- Invented seller identity, Bizum number, WhatsApp number or credentials.
- Personal legal advice.
- Weekly live classes, unlimited tutoring or daily community moderation.
- Publishing unreviewed legal doctrine as definitive.

## Baseline read set

- `CONTEXT.md`
- `specs/002-ss-casolab-academy/spec.md`
- `specs/002-ss-casolab-academy/plan.md`
- `specs/002-ss-casolab-academy/tasks.md`
- `specs/002-ss-casolab-academy/contracts/`
- `content-source/catalog.json`
- current application, database and tests
- official BOE call, correction, tribunal criteria and process page

## Impact statement

This change expands the curriculum from 13 to 36 topics and replaces the assumed hosted checkout/email operating model with a Bizum/WhatsApp model. It changes product scope, data handling, order states, support expectations and verification boundaries.

## Baseline usage

- Required refs: listed above.
- Acknowledged: context, spec, plan, tasks, current tests and previous official findings.
- Missing: Moodle artifact/access, seller identity, Bizum destination, WhatsApp Business number and production Sites access.
- Decision: continue on all non-blocked editorial, architectural, test and documentation work.

## Execution readiness view

- Intent lock: complete theory and practical academy, Bizum, WhatsApp, zero spend.
- Scope fence: national C1 Social Security, free-access path first; no personal case advice.
- Baseline lock: official sources and versioned editorial catalog are canonical.
- Compatibility boundary: existing free diagnostic and GSI control keep working until deliberately retired.
- Retirement boundary: hosted checkout and email assumptions must be removed where superseded, not kept as silent duplicate owners.
- Task batches: source of truth; editorial tooling; theory; practical bank; Bizum/WhatsApp; Moodle; publication.
- Test obligations: schema/content validation, unit, integration, accessibility, mobile, manual payment-state runbook and production smoke test.
- Review gates: academic review, normative review and legal/commercial fields completed before publication.
- Drift rule: stop and revise the spec if a feature increases daily support, requires paid infrastructure or loses normative traceability.
- Evidence required for completion: every requirement mapped to direct files, tests, rendered behavior or external state.

