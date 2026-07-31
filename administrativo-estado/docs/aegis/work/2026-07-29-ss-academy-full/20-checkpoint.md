# Todo checkpoint

> Incremental checkpoint 2026-07-30: se han completado los diez módulos restantes (G12, G21-G23 y S08-S13) como borradores trazables. El corpus queda en 36 módulos, 684 afirmaciones y 316 preguntas; siguen pendientes las revisiones humanas y la publicación.

## Current todo

1. Reconcile the existing specification with the expanded curriculum and Bizum/WhatsApp authority.
2. Verify the complete 36-topic official program and source matrix.
3. Extend the editorial catalog and validators.
4. Produce theory and practical assets in reviewable batches.
5. Implement the no-cost order, communication and operating flows.
6. Prepare Moodle imports and validate the full learner journey.
7. Publish only after external prerequisites are supplied and tested.

## Completed

- Created isolated branch `codex/ss-academy-full`.
- Diagnosed and repaired the inconsistent dependency lockfile.
- Reconciled the active specification with a 23-topic general block, 13-topic specific block, professional Bizum orders and individual WhatsApp support.
- Created the exact 36-topic catalog and graph validators for modules, claims, questions and cases.
- Produced 36 reviewable draft modules (`G01`–`G23`, `S01`–`S13`): 684 normative claims and 288 module questions. Added `MC01`, `MC02` and `CP01` with 28 practical questions. No asset is marked as human-reviewed or publishable.
- Added deterministic Moodle question/module exporters with SHA-256 manifests and drift checks. Real Moodle import/re-export remains external.
- Separated payment and access state machines; added real SQLite migration tests for order, report, verification, refund, access and append-only event constraints.
- Restricted the public funnel endpoint so a browser cannot assert payment, access or refund events; added event idempotency, metadata allowlists and a session rate limit.
- Verified the current local slice with 108 unit tests, a complete build and the rendered HTML suite.

## Active slice

Review the complete 36-module corpus with Alba, then review the beta pack before any publication or commercial activation.

## Evidence refs

- Commit `45b44e8` (`Build validated SS academy editorial corpus`).
- `npm run content:validate`: 36 topics; 26 modules; 484 claims; 236 questions; 3 structured cases; exit 0.
- `npm run build`: content validation plus vinext build; exit 0.
- `npm run lint`: exit 0.
- `npm run test:unit`: 108/108 passed.
- `node --test tests/rendered-html.test.mjs`: 5/5 passed.
- `content:gate-beta`: structuralReady true, publicationReady false, exit 3 as designed because human/editorial/legal/normative review is pending.

## Blocked on

- Moodle backup or access.
- Seller identity, NIF, address, public contact, tax/price/contract terms and external legal review.
- Active professional Bizum service whose cost is confirmed as zero or separately authorized.
- WhatsApp Business number, service hours and responsible operator.
- Transactional email configuration for durable contractual confirmation and Moodle invitation.
- Access to the existing Sites project.

These blockers do not prevent current source, content or local implementation work.

## Resume state

Resume in `C:\Users\David\.codex\worktrees\gsi-casos-practicos\ss-academy-full` on branch `codex/ss-academy-full` at the latest clean commit. Re-read this checkpoint, the new objective and `git status` before editing.

## Drift check

- Serves original outcome: yes.
- New owners introduced: canonical editorial source, manual order verification, transactional email and individual WhatsApp contact; each has an explicit contract or pending task.
- Paid-service drift: none.
- Release gate drift: none; orders remain disabled until every external commercial gate is satisfied.
- Decision: continue with local source, content, order and QA work.
