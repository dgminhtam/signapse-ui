## 1. Dashboard Contract Boundary

- [x] 1.1 Re-check the latest `docs/api_mapping.json` contract for `GET /dashboard/summary`, resync `docs/APIMAPPING.md` if BE has changed it, and update these artifacts before coding so the latest backend contract remains authoritative.
- [x] 1.2 Align the reusable `NarrativeAssetSummaryResponse` Zod schema and inferred type in `app/lib/narratives/definitions.ts` with the documented required fields, nullable weight, asset types, and `PRIMARY | AFFECTED` relation types.
- [x] 1.3 Add the Market Narrative theme, item, and metric schemas to `app/lib/dashboard/definitions.ts`; require `marketNarratives` on `DashboardSummaryResponse`; enforce the backend maximum of three items; and mirror the latest required-versus-nullable fields, lifecycle statuses, timestamps, and open string error codes exactly.
- [x] 1.4 Extend `app/lib/dashboard/definitions.assert.mjs` with deterministic checks for a valid one-to-three-item metric, all metric states, lifecycle statuses, asset/relation enums, required-nullable values, an unknown canonical error-code string, missing required fields, null `primaryTheme`, and more than three items.

## 2. Production Market Narratives Surface

- [x] 2.1 Add Vietnamese and English `workspaceOverview.marketNarratives` dictionary copy for headings, description, Graph View action, lifecycle labels, theme/assets/confidence/update metadata, nullable-content fallbacks, empty/denied/error states, accessible names, and invalid-time fallback.
- [x] 2.2 Create `app/[lang]/(main)/dashboard/market-narratives.tsx` as a production-local Server Component that renders every validated narrative and related asset in backend order with neutral iconography, approved Badge variants, localized formatting, and no direction, causality, recommendation, or frontend ranking inference.
- [x] 2.3 Implement independent endpoint-failure, defensive available-with-no-items, `EMPTY`, `DENIED`, and `ERROR` presentations without mock, stale, synthesized, or raw-error-code primary content.
- [x] 2.4 Add the module-wide localized Graph View header action only when available items exist and the existing Graph View read capability permits the destination; do not add narrative item links or new routes.
- [x] 2.5 Add an accessible responsive Market Narratives skeleton with the Card header/action footprint and three representative rows using existing motion-reduction-safe Skeleton primitives.

## 3. Dashboard Composition

- [x] 3.1 Pass `summary.marketNarratives`, the existing summary error path, locale, dictionary, and Graph View capability into Market Narratives from `app/[lang]/(main)/dashboard/page.tsx` without adding or changing a data request.
- [x] 3.2 Pair Assets in Focus and Market Narratives in a route-owned twelve-column row with seven/five large-screen spans, stacked narrow-screen behavior, and identical wrappers in `WorkspaceOverviewSkeleton`.
- [x] 3.3 Confirm the production implementation neither sorts, filters, nor slices backend narrative or asset arrays and that `/dashboard-prototype` remains unchanged, isolated, and free of production summary calls.

## 4. Verification

- [x] 4.1 Run the focused dashboard schema assertion with a TypeScript-aware Node 22 invocation, `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
- [x] 4.2 Run strict OpenSpec validation for `add-dashboard-market-narratives` and static searches confirming no additional Market Narratives request, no prototype mock/scenario import, no frontend narrative/asset reordering or truncation, and no unsupported lifecycle or market-direction presentation.

User-owned manual QA: compare authenticated `/vi/dashboard` and `/en/dashboard` against `/dashboard-prototype` using available, nullable-content, empty, denied, error, endpoint-failure, and Graph View permission combinations at desktop/mobile widths, light/dark themes, and 200% zoom.
