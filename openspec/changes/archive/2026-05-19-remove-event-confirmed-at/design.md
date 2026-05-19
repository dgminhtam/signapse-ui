## Context

The current backend snapshot keeps the Events endpoints but removes several fields that the frontend still models. `EventListResponse` and `EventResponse` no longer include `slug` or `confirmedAt`; event evidence no longer uses generic `artifact*` fields and now points directly at news articles through `newsArticleId`, `newsArticleTitle`, and `newsArticleUrl`.

This is visible on the event detail surfaces. The list is mostly safe because it already renders `occurredAt`, but detail and quick detail still show "Xác nhận lúc" and still render evidence from the old artifact shape. The detail page also keeps low-value technical identifiers near the bottom, including "Mã sự kiện" and "Slug", while the user wants those removed from the technical section.

Adjacent surfaces carry the same naming migration. Market chart annotation evidence now uses `newsArticleId` instead of `sourceDocumentId`, and graph edges now use `news-article-event` instead of `source-artifact-event`. These are frontend contract changes, not new workflows.

The detail page already has a good local comparison point: news article detail keeps the title/metadata on the left and a compact action cluster on the right. Event detail should follow that pattern so operator actions are easy to find without turning them into a separate content section.

## Goals / Non-Goals

**Goals:**

- Align event DTOs, detail UI, and quick detail UI with the current backend event response shape.
- Remove event detail presentation for `confirmedAt`, event id, and slug because those values are no longer part of the intended operator surface.
- Keep `occurredAt`, `confidence`, `status`, `description`, evidence, assets, themes, market reactions, and audit timestamps as the meaningful event detail hierarchy.
- Rename evidence rendering to the news article-specific fields returned by backend and preserve news article detail/original URL actions.
- Shorten event operator action labels while keeping pending state, spinner, disabled state, permission gating, toast, refresh, and existing API calls.
- Move the asset/theme enrichment action and market reaction derivation action into one compact cluster aligned to the right of the event title on desktop.
- Align market chart annotation evidence and graph edge kind contracts with news article naming.
- Update `docs/APIMAPPING.md` so the frontend integration ledger captures the remaining event-related drift accurately.

**Non-Goals:**

- Do not add event create, update, delete, archive, or manual timestamp editing.
- Do not change backend endpoint names, permission names, or request semantics.
- Do not redesign the whole event detail page beyond the requested contract cleanup and action placement.
- Do not add new chart, graph, or event evidence features beyond mapping the renamed fields.
- Do not modify shadcn primitives in `components/ui`.

## Decisions

1. Remove removed backend fields instead of aliasing them locally.

   Rationale: Keeping `slug` or `confirmedAt` as optional frontend-only fields would hide contract drift and keep empty UI slots alive. The page should reflect what the backend now intends to expose.

   Alternative considered: Keep the fields optional and let them render "Chưa có". This would avoid code churn but preserve misleading UI.

2. Treat event evidence as news article evidence.

   Rationale: The new response shape is explicitly news article-based. The UI should show the news article title, news outlet, published time, evidence role, confidence, and note, with links to `/news-articles/{newsArticleId}` and `newsArticleUrl` when available.

   Alternative considered: Convert `newsArticle*` back to `artifact*` in an adapter. This keeps existing components stable but reintroduces the generic concept the backend removed.

3. Make event detail actions mirror the news article detail action row.

   Rationale: Operators already see detail-level actions grouped at the top right on news article detail. Reusing the same layout rhythm makes the event detail page easier to scan and keeps the actions close to the event title.

   Alternative considered: Leave actions beneath the title block. That keeps implementation smaller but makes the action cluster read as body content and wastes horizontal space on desktop.

4. Keep the two event operator actions as visible buttons, but shorten labels.

   Rationale: These are primary event operations, unlike the secondary dropdown actions on news article detail. Visible buttons remain appropriate, but shorter labels reduce width and make the grouped layout less heavy.

   Proposed copy:
   - Asset/theme enrichment: `Làm giàu`
   - Market reaction derivation: `Tác động`

   Alternative considered: Move both actions into a kebab menu. This would match the compactness of news article detail, but it would hide high-frequency event operations and make pending feedback less direct.

5. Remove "Mã sự kiện" and "Slug" from technical information while keeping traceability through route context and canonical key.

   Rationale: The route already contains the id, and backend no longer exposes slug. `canonicalKey`, `createdDate`, and `lastModifiedDate` remain useful low-priority debugging context.

   Alternative considered: Keep the event id for support/debugging. The user explicitly requested removing "Mã sự kiện", so support workflows should rely on URL id or backend logs if needed.

6. Update adjacent strict validators where backend enum/field renames can break runtime.

   Rationale: Graph view validates backend responses with Zod, so `news-article-event` must be accepted or the whole graph can fail. Market chart annotation evidence should parse `newsArticleId` so future links or evidence displays do not silently lose the id.

   Alternative considered: Delay adjacent surfaces until users hit runtime failures. The contract drift is already confirmed in the snapshot, so deferring would leave known breakage behind.

## Risks / Trade-offs

- [Operators may lose a visible event id that helped support conversations] -> Keep route URLs and canonical key available; document that "Mã sự kiện" is intentionally removed from the technical panel.
- [Short labels may be ambiguous without context] -> Use clear button titles/tooltips or accessible labels if needed while keeping visible text short.
- [Existing data may still include old artifact fields during backend rollout] -> Prefer the current snapshot; do not add broad compatibility adapters unless runtime data proves a mixed deployment window.
- [Graph edge rename can affect colors, filters, and legends in several files] -> Update the type union, schema, labels, workbench allowed kinds, and visuals together.
- [Documentation may claim more alignment than code delivers] -> Update APIMAPPING only after the implementation paths are changed, and call out any residual drift explicitly.

## Migration Plan

1. Update Events DTOs to remove `slug`/`confirmedAt` and rename evidence fields to `newsArticle*`.
2. Update event detail and quick detail evidence rendering and remove removed time/technical items.
3. Update event detail action placement and shorten visible action labels.
4. Update news article linked event DTOs/status handling for removed `eventSlug` and current event status enum.
5. Update market chart annotation evidence `newsArticleId` typing/schema.
6. Update graph view edge kind from `source-artifact-event` to `news-article-event` wherever the frontend validates, labels, filters, or styles edge kinds.
7. Refresh `docs/APIMAPPING.md` event, market chart, and graph view notes.
8. Run focused typecheck/build or document blockers.

Rollback is straightforward because the work is frontend contract alignment: revert the DTO/UI/schema changes if backend reintroduces the older fields or enum names.

## Open Questions

- Should the short visible button text be exactly `Làm giàu` and `Tác động`, or should implementation use slightly longer `Làm giàu sự kiện` and `Suy luận tác động` if visual testing shows room?
