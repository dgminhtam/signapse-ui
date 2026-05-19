## 1. Event Contract Alignment

- [x] 1.1 Update `app/lib/events/definitions.ts` to remove `slug` and `confirmedAt` from event responses.
- [x] 1.2 Rename `EventEvidenceSummaryResponse` fields from `artifactType`, `artifactId`, `artifactTitle`, and `artifactUrl` to `newsArticleId`, `newsArticleTitle`, and `newsArticleUrl`.
- [x] 1.3 Remove artifact-type imports and helpers from event detail code paths that no longer need generic artifact classification.

## 2. Event Detail And Quick Detail Cleanup

- [x] 2.1 Remove the "Xác nhận lúc" fact from `app/(main)/events/[id]/page.tsx`.
- [x] 2.2 Remove the "Xác nhận lúc" quick fact from `app/(main)/events/event-quick-detail-content.tsx`.
- [x] 2.3 Update full event detail evidence rendering to use `newsArticleTitle`, `newsArticleId`, and `newsArticleUrl`.
- [x] 2.4 Update event quick detail evidence rendering to use `newsArticleTitle`, `newsArticleId`, and `newsArticleUrl`.
- [x] 2.5 Remove "Mã sự kiện" and "Slug" from the event detail technical information section.
- [x] 2.6 Update event detail skeletons so loading placeholders match the cleaned facts, action cluster, and technical information section.

## 3. Event Detail Action Layout

- [x] 3.1 Move `EventEnrichButton` and `EventMarketReactionButton` into a compact action cluster aligned to the right of the event title area on desktop.
- [x] 3.2 Keep the action cluster responsive so it wraps cleanly below the title content on narrow viewports.
- [x] 3.3 Shorten the visible asset/theme enrichment button label while preserving accessible naming, spinner, disabled state, toast, permission gating, and refresh behavior.
- [x] 3.4 Shorten the visible market reaction derivation button label while preserving accessible naming, spinner, disabled state, toast, permission gating, and refresh behavior.

## 4. Adjacent Contract Alignment

- [x] 4.1 Update `app/lib/news-articles/definitions.ts` linked event types to remove `eventSlug` and the removed enrichment-status field.
- [x] 4.2 Update news article detail and quick detail linked-event badges to use the current event status enum only.
- [x] 4.3 Update market chart annotation evidence types and Zod schema from `sourceDocumentId` to `newsArticleId`.
- [x] 4.4 Update graph view edge kind types, schemas, labels, filters, and visuals from `source-artifact-event` to `news-article-event`.

## 5. Documentation And Verification

- [x] 5.1 Update `docs/APIMAPPING.md` event notes for removed `slug`/`confirmedAt` and renamed evidence fields.
- [x] 5.2 Update `docs/APIMAPPING.md` market chart annotation evidence and graph edge kind notes.
- [x] 5.3 Run focused TypeScript validation for changed modules or `pnpm typecheck`.
- [x] 5.4 Run `pnpm build` or document why a full build could not be completed.
- [x] 5.5 Smoke-check event detail and quick detail behavior against available local data, or document the runtime validation gap.
