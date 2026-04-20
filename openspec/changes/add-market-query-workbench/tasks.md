## 1. Market-query contract and permissions

- [x] 1.1 Add `app/lib/market-query/definitions.ts` with `MarketQueryRequest`, `MarketQueryResponse`, `MarketQueryKeyEventResponse`, `MarketQueryEvidenceResponse`, any UI label helpers needed for evidence/document semantics, and a dedicated `query:execute` permission helper.
- [x] 1.2 Add `app/api/query/action.ts` with an authenticated `queryMarket` action that reads backend text safely before parsing JSON and returns a frontend-safe action result shape for success and failure states.
- [x] 1.3 Reuse existing event and source-document permission helpers so the market-query UI can decide when related entity links should be interactive.

## 2. Route shell and workbench UX

- [x] 2.1 Add the protected `/market-query` route under `app/(main)/market-query/page.tsx` with the repo-standard `Card` shell, `CardHeader`, `CardDescription`, `Separator`, and `Suspense` boundary.
- [x] 2.2 Add `app/(main)/market-query/error.tsx` for local route errors and a client workbench component that provides a large question composer, optional `asOfTime` input, disabled pending state, and submit spinner feedback.
- [x] 2.3 Render the result as a structured briefing with sections for `Kết luận`, confidence, assets considered, limitations, key events, evidence, and a collapsed-by-default `Quá trình tổng hợp`, plus a repo-standard empty state before the first submission.

## 3. Navigation and permission-aware traceability

- [x] 3.1 Update `config/site.ts` so the protected navigation exposes `Truy vấn thị trường` under the `Nội dung` group only for users who have `query:execute`.
- [x] 3.2 Make `keyEvents` and `evidence` render permission-aware links into `/events/[id]` and `/source-documents/[id]`, while preserving non-link metadata for users who lack the corresponding read permissions.
- [x] 3.3 Keep the page stateless in v1 by showing only the current query and current response, without any saved history, thread list, or prior-run module.

## 4. Documentation and verification

- [x] 4.1 Update `docs/APIMAPPING.md` so `/query` is marked as implemented in the frontend and the workbench ownership is documented.
- [ ] 4.2 Verify the workbench against a local backend response, including route gating, pending feedback, structured result rendering, empty sections, collapsed reasoning behavior, and permission-aware traceability links.
- [x] 4.3 Run lint and typecheck for the changed scope, and note any unrelated pre-existing issues if they prevent a fully green verification pass.

## 5. Runtime hardening and UI simplification

- [x] 5.1 Update `app/lib/market-query/definitions.ts` so the frontend accepts nullable optional timestamps returned by `/query`, especially `evidence[].publishedAt` and `keyEvents[].occurredAt`, without rejecting the full response.
- [x] 5.2 Update `app/api/query/action.ts` so the v1 request omits `asOfTime` in the normal market-query flow instead of requiring or injecting a user-managed value.
- [x] 5.3 Simplify `app/(main)/market-query/market-query-workbench.tsx` by removing the user-facing `asOfTime` input and adjusting the summary copy/UI to reflect backend-managed current analysis time.
- [x] 5.4 Verify with a real `/query` payload containing `publishedAt: null` and `occurredAt: null` that the workbench renders successfully and no longer shows the generic schema-mismatch error.
