## Context

The current Graph View server action fetches `GET /graph-view` and validates the response with `graphViewResponseSchema` before rendering. The backend OpenAPI snapshot now defines `GraphEdge.kind` as `event-asset`, `event-theme`, or `news-article-event`, while the frontend still accepts, labels, counts, and styles the older `source-artifact-event` kind.

This mismatch explains the runtime console error `Graph view response validation failed`: Zod rejects the backend payload before the G6 canvas receives any data. An active broader change, `remove-event-confirmed-at`, already documents the same backend rename, but this change scopes only the Graph View contract alignment needed to restore the screen.

## Goals / Non-Goals

**Goals:**

- Accept the current backend `news-article-event` edge kind in Graph View response validation.
- Use the renamed edge kind consistently in graph model counts, HUD summaries, visual styling, and user-facing labels.
- Keep Graph View node contract aligned with the current backend node kinds.
- Make validation failure logs actionable enough to identify future mismatches quickly.
- Update the Graph View API mapping notes to reflect the current backend contract.

**Non-Goals:**

- Do not redesign the G6 layout, drag behavior, hover spotlight, zoom controls, or node detail inspector.
- Do not add a compatibility adapter for legacy `source-artifact-event` unless runtime data proves a mixed backend rollout is required.
- Do not change backend endpoints, permissions, API response shape, or dependencies.
- Do not alter unrelated event detail, market chart, or news article contracts in this focused change.

## Decisions

1. Treat `news-article-event` as the canonical edge kind.

   Rationale: The backend snapshot and existing OpenSpec notes both identify `news-article-event` as the current contract. Keeping the old kind in primary filters or legends would preserve stale terminology and make future debugging harder.

   Alternative considered: Accept both `source-artifact-event` and `news-article-event`. This would be safer for a mixed deployment window, but it weakens the contract alignment and keeps old UI labels alive. If the user confirms mixed BE versions must be supported, that should be added explicitly.

2. Update all frontend graph-kind lookup surfaces together.

   Rationale: The edge kind appears in type unions, Zod enum validation, label maps, model count order, HUD order, and visual style maps. Updating only the schema would allow render to proceed but could silently drop counts or styling.

   Alternative considered: Normalize the backend kind to the old frontend kind in a mapper. That avoids touching more files, but it hides the backend contract from the rest of the app and conflicts with the contract-led cleanup.

3. Keep the validation boundary strict, but improve diagnostics.

   Rationale: Strict validation is valuable because graph payloads are dense and failures should stop bad data early. The problem is not strictness itself; it is that the visible console message currently appears as `{}` in the browser. Diagnostics should include concise issue path/message details in server logs.

   Alternative considered: Remove Zod validation for Graph View. That would avoid the current crash but would move failures into G6 rendering where errors are harder to trace and may corrupt the visualization.

4. Scope documentation updates to the frontend contract ledger.

   Rationale: `docs/APIMAPPING.md` still says Graph View uses `source-artifact-event`, while `docs/api_mapping.json` already says `news-article-event`. The ledger should reflect the state the frontend implements after this change.

## Risks / Trade-offs

- [Backend still returns legacy `source-artifact-event` in some environments] -> Graph View would continue to fail there; verify against the current local backend and add explicit dual-kind compatibility only if mixed rollout is confirmed.
- [A stale style/count map is missed] -> TypeScript should catch most misses once `GraphViewEdgeKind` changes; run focused typecheck/lint after implementation.
- [Improved logging exposes too much raw payload] -> Log summarized Zod issue path/message only, not the full backend response.
- [Overlap with `remove-event-confirmed-at`] -> Keep this change Graph View-only and mark the broader task as covered or avoid duplicate implementation when applying the broader change later.

## Migration Plan

1. Rename Graph View edge kind typing/schema/labels from `source-artifact-event` to `news-article-event`.
2. Update Graph View model, HUD, and visual style references to the renamed kind.
3. Improve validation diagnostics in the Graph View server action if current summaries are not visible enough in development logs.
4. Update `docs/APIMAPPING.md` Graph View notes to match the current backend snapshot.
5. Run focused lint/typecheck for touched Graph View files and verify `/graph-view` renders against local backend data.

Rollback is a normal frontend revert. If backend rollback requires old edge kinds, reintroduce legacy compatibility intentionally with an explicit spec update.
