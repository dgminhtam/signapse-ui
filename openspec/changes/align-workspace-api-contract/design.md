## Context

`docs/api_mapping.json` is the source of truth for the backend snapshot. The current workspace schema keeps `name` as the only create/update field and removes `slug` from `WorkspaceResponse` and `WorkspaceSummaryResponse`. The frontend still declares `slug`, passes it through workspace create/rename actions, renders it in the workspace switcher, and shows it in the workspace overview.

The same snapshot changed `/me` from `workspace` to `currentWorkspace` and models `mainImage` as `MediaResponse`. Current frontend consumers mainly use `/me.permissions`, but the response type should still match the backend so future consumers do not build on stale fields.

## Goals / Non-Goals

**Goals:**
- Align workspace definitions with the current backend snapshot.
- Ensure create and update workspace actions submit only `name`.
- Remove obsolete `slug` UI from workspace switcher dialogs, menu subtitles, overview metrics, and technical detail layout.
- Align `/me` frontend definitions with `currentWorkspace` and media-object `mainImage`.
- Update `docs/APIMAPPING.md` so the workspace and user drift notes match the implemented state after this change.

**Non-Goals:**
- Redesign workspace selection placement, sidebar branding, or the watchlist editor.
- Change backend endpoints, permissions, active workspace resolution, pagination, or route behavior.
- Add new workspace fields, fallback slugs, generated display identifiers, or compatibility payloads.
- Refactor unrelated `news-outlets`, `assets`, `graph-view`, or market chart contract drift.

## Decisions

- Treat workspace `slug` as removed rather than optional.
  - Rationale: the current backend snapshot removes `slug` from request and response schemas, so an optional frontend field would still invite unsupported payloads and stale rendering.
  - Alternative considered: keep a hidden or optional slug in TypeScript for compatibility. This keeps drift alive and weakens the contract signal.

- Keep workspace create/update actions simple and pass through a name-only object.
  - Rationale: both backend request schemas now only define `name`; sanitizing at the caller and type layer is enough.
  - Alternative considered: add runtime payload filtering in `app/api/workspaces/action.ts`. This is unnecessary if callers and definitions no longer include unsupported fields.

- Replace slug subtitles with meaningful current-state copy instead of inventing a derived identifier.
  - Rationale: backend no longer exposes a stable short identifier; using workspace name twice or deriving one locally adds noise.
  - Alternative considered: show `#id` in the menu. IDs are technical metadata and should not become primary user-facing scan text unless needed.

- Update `/me` types now even though current permission code only reads `permissions`.
  - Rationale: stale shared response types create quiet future drift. Aligning them is small and keeps the frontend contract ledger honest.
  - Alternative considered: defer `/me` typing until a user profile surface consumes it. This leaves known drift documented but unresolved.

## Risks / Trade-offs

- Removing slug shortens dialogs and overview cards -> verify the focused dialog/body spacing and overview layout still look intentional without placeholder copy.
- Backend may currently ignore unknown `slug` fields -> the frontend should still stop sending them because strict parsing could reject the payload later.
- `/me.mainImage` media object shape may need only a minimal local type -> reuse or mirror the existing media response shape instead of widening to `any`.
- Existing docs already mark workspace drift -> update `docs/APIMAPPING.md` after code changes so the ledger does not keep stale "Can cap nhat FE" notes.
