## 1. Event Contract Alignment

- [x] 1.1 Update `app/lib/events/definitions.ts` to remove obsolete event fields and add the simplified `EventStatus` / `EventEnrichmentOutcome` enum values.
- [x] 1.2 Update event status labels, badge variants, enrichment result summaries, failure detection, and batch summary handling in `app/(main)/events/event-presentation.ts`.
- [x] 1.3 Include `deferredCount` in `PendingEventEnrichmentBatchResult` and surface it in the batch enrichment toast summary when present.

## 2. Event List Refinement

- [x] 2.1 Update `app/(main)/events/event-list.tsx` to render `description`, one status badge, occurred time, confidence, and the detail action without active or separate enrichment-status UI.
- [x] 2.2 Update event search query keys and placeholder copy if needed so search targets the simplified contract fields.
- [x] 2.3 Update `app/(main)/events/page.tsx` header copy and list skeleton to match the simplified table columns and toolbar layout.

## 3. Event Detail Refinement

- [x] 3.1 Update `app/(main)/events/[id]/page.tsx` header to show event status, confidence, occurred time, confirmed time, title, description, and the enrichment action as the primary visible content.
- [x] 3.2 Remove the obsolete dedicated enrichment-status section, active flag display, enrichment timestamps, and enrichment error display from event detail.
- [x] 3.3 Reorder detail content so evidence appears before assets and themes, while preserving permission-aware article links and original URL links.
- [x] 3.4 Move `id`, `slug`, `canonicalKey`, `createdDate`, and `lastModifiedDate` into a lower-priority technical details area.
- [x] 3.5 Update `EventDetailSkeleton` to mirror the simplified detail layout and section order.

## 4. Repo Guidance And Documentation

- [x] 4.1 Add a simplified backend surface hierarchy rule to `AGENTS.md` under the UI or UX guidance area.
- [x] 4.2 Update `docs/APIMAPPING.md` so the event section no longer reports stale FE drift after the implementation is aligned.
- [x] 4.3 Review event user-facing Vietnamese copy for clarity and consistency after the layout changes.

## 5. Verification

- [x] 5.1 Run focused lint for the changed event files and documentation-adjacent code paths.
- [x] 5.2 Run `pnpm typecheck`.
- [x] 5.3 Run `pnpm build` or document why a full build could not be completed.
- [x] 5.4 Smoke-check event list/detail behavior against available local data or document the runtime validation gap.
