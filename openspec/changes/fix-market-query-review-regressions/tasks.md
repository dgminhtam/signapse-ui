## 1. Audit current regressions

- [x] 1.1 Search `app/(main)/market-query`, `app/lib/market-query`, `app/api/query/action.ts`, and `config/site.ts` for mojibake markers, unaccented fallback copy, English UI labels, and legacy evidence wording.
- [x] 1.2 Review `/market-query` idle, running, success, error, empty, and permission-restricted states against the review findings before editing.
- [x] 1.3 Confirm which current component splits are already acceptable and identify only the remaining extraction or cleanup needed for this change.

## 2. Fix professional Vietnamese copy

- [x] 2.1 Replace corrupted Vietnamese text in `market-query-workbench.tsx` announcements, validation messages, toast feedback, and state copy.
- [x] 2.2 Replace corrupted Vietnamese text in market-query presentational components including composer, briefing content, evidence list, key events, reasoning panel, section helpers, and state card.
- [x] 2.3 Replace corrupted or inconsistent user-facing text in market-query definitions, format helpers, query action fallbacks, and `config/site.ts` labels that affect this screen.

## 3. Harden layout hierarchy

- [x] 3.1 Verify the route `CardHeader` is the only page orientation and remove any residual hero-style title, badge, or duplicate description inside the client workbench.
- [x] 3.2 Adjust the completed-result layout so the answer and evidence path are visually primary, while confidence, limitations, assets, key events, and reasoning use lighter secondary treatments.
- [x] 3.3 Verify first-run and narrow viewport ordering keeps composer, active query state, answer, trust cues, and evidence ahead of lower-priority supporting sections.

## 4. Align evidence traceability with SourceDocument

- [x] 4.1 Update evidence row labels, permission hints, and action copy to use SourceDocument-oriented language.
- [x] 4.2 Ensure source artifact internal links are generated through the SourceDocument helper path and avoid NEWS-only or `/news-articles` assumptions in row rendering.
- [x] 4.3 Verify evidence remains readable when event or source-document permissions are missing without repeating noisy disabled controls.

## 5. Keep component structure maintainable

- [x] 5.1 Keep state orchestration in the main workbench and preserve local components for composer, result content, evidence, key events, reasoning, and state surfaces.
- [x] 5.2 Extract or rename only the remaining code that directly improves reviewability for this change; avoid new shared abstractions.
- [x] 5.3 Remove unused market-query imports or dead local helpers found during the cleanup.

## 6. Verification

- [x] 6.1 Run targeted search to confirm no market-query-visible strings contain mojibake markers such as `Ã`, `Ä`, `Æ`, `áº`, or `á»`.
- [x] 6.2 Run `pnpm lint` or the narrowest available lint command for the touched market-query/config files.
- [x] 6.3 Run `pnpm typecheck`.
- [ ] 6.4 Smoke test `/market-query` manually with idle, running, success, error, empty evidence, and permission-restricted scenarios where local backend data allows it.

Verification note: case-sensitive targeted search and UTF-8 Node search found no mojibake markers in the touched market-query/config scope. `pnpm lint -- "app/(main)/market-query" "app/lib/market-query" "app/api/query/action.ts" "config/site.ts"` passed. `pnpm typecheck` passed. `git diff --check -- "app/(main)/market-query" "app/lib/market-query" "app/api/query/action.ts" "config/site.ts" "openspec/changes/fix-market-query-review-regressions"` passed. Full `pnpm lint` remains blocked by pre-existing unrelated lint errors outside this change. Manual browser smoke test was not run in this session.
