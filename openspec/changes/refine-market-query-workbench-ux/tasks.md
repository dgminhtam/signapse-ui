## 1. Clarify query execution state

- [x] 1.1 Refactor `app/(main)/market-query/market-query-workbench.tsx` to model first-run, running, and latest-completed phases explicitly.
- [x] 1.2 Update the resubmission flow so a newly submitted query no longer leaves the previous briefing presented as the active result while the next response is pending.
- [x] 1.3 Add a pending surface that identifies the question currently being executed while keeping the textarea and submit button disabled with spinner feedback.
- [x] 1.4 Define and implement the failed-resubmission state so a previous successful briefing can remain available only as clearly labeled prior context.

## 2. Remove duplicated guidance and streamline first-run UX

- [x] 2.1 Consolidate duplicated instructional copy across the page description, hero area, helper panel, and empty state into one primary first-run guidance path.
- [x] 2.2 Keep example prompts in a single location before the first submission and remove repeated prompt modules elsewhere on the page.
- [x] 2.3 Ensure the running, success, and failure views each keep the active submitted question visible in the result context.
- [x] 2.4 Update all user-facing copy in the refined workbench flow to remain concise, professional, and consistently Vietnamese.

## 3. Rebalance result hierarchy and traceability cues

- [x] 3.1 Reorder or restyle completed-result sections so the answer, confidence, limitations, and evidence form the primary reading path.
- [x] 3.2 Demote raw fallback identifiers, slugs, and other internal-looking metadata from primary card titles and primary action areas.
- [x] 3.3 Replace repetitive disabled traceability buttons with compact permission feedback while preserving interactive drill-downs for authorized users.
- [x] 3.4 Add in-page result and error visibility behavior so major state changes are discoverable without relying only on toast notifications.

## 4. Verify accessibility and responsive readability

- [x] 4.1 Verify keyboard and viewport behavior for result completion and failure states, including whichever focus or scroll visibility aid is implemented.
- [x] 4.2 Verify the narrow-layout reading order keeps composer, current query context, answer, trust signals, and evidence ahead of lower-priority modules.
- [x] 4.3 Verify confidence, limitation, and permission cues remain understandable without color alone.

## 5. Verify operator-facing behavior

- [x] 5.1 Verify idle, running, completed, failed-resubmission, and recovery flows of `/market-query` against the new usability requirements.
- [x] 5.2 Verify evidence rendering for users with and without `event:read` and `source-document:read` so traceability stays informative without noisy disabled actions.
- [x] 5.3 Run lint and typecheck for the refined market-query scope and note any unrelated issues that block a fully green verification pass.

Verification note: `pnpm typecheck` passed on April 25, 2026. Scoped `pnpm lint -- "app/(main)/market-query" "app/api/query" "app/lib/market-query" "config/site.ts"` passed on April 25, 2026. `git diff --check` passed for the same scope. `pnpm exec prettier --write ...` could not run in this shell because the `prettier` binary was not recognized.

## 6. Address follow-up UI/UX review findings

- [x] 6.1 Fix mojibake and unaccented Vietnamese copy in `app/(main)/market-query/*`, `app/lib/market-query/*`, `app/api/query/action.ts`, and market-query navigation labels.
- [x] 6.2 Remove the competing inner hero from the client workbench so the route `CardHeader` owns page orientation and the query composer becomes the first meaningful region.
- [x] 6.3 Flatten the completed-result layout so answer and evidence have stronger hierarchy than trust metadata, key events, and reasoning without stacking many equal card-like panels.
- [x] 6.4 Align evidence document labels, permission hints, and internal drill-down routes with the SourceDocument model instead of legacy news-article-only wording.
- [x] 6.5 Split `market-query-workbench.tsx` into focused local components for composer, query state, briefing content, evidence list, key events, and reasoning while keeping state orchestration clear.

## 7. Re-verify review findings

- [x] 7.1 Verify no visible market-query copy contains mojibake or non-professional Vietnamese.
- [x] 7.2 Verify the first-run, running, success, and failed-resubmission layouts avoid nested equal-weight card clutter.
- [x] 7.3 Verify evidence traceability remains useful for authorized and restricted users, including non-NEWS evidence where backend data allows it.
- [x] 7.4 Re-run targeted typecheck/lint checks or document remaining unrelated blockers.
