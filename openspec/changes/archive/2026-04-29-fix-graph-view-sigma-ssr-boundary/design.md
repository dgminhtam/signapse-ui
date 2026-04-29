## Context

`/graph-view` is a protected App Router page that already resolves permissions and graph data on the server before rendering the graph browsing surface. The current implementation imports `@react-sigma/core` directly from `graph-view-workbench.tsx`, and Sigma's bundle touches `WebGL2RenderingContext` at module scope. Under Next.js 16 with Turbopack, that import chain is evaluated on the server render path, which throws before the page can finish server rendering.

This change needs an architectural boundary rather than a rendering guard. The route should keep server-rendered permission gating, page shell, and stable layout, while only the WebGL-dependent graph canvas becomes client-only.

## Goals / Non-Goals

**Goals:**
- Keep the protected `/graph-view` route server-renderable without requiring WebGL globals in the Node.js runtime.
- Preserve the existing graph-view data flow and browse interactions after client hydration.
- Limit the client-only boundary to the Sigma canvas import path instead of downgrading the entire page to client-only rendering.
- Provide a stable loading placeholder so the route layout does not shift while the canvas island loads.

**Non-Goals:**
- Replacing Sigma, Graphology, or ForceAtlas2 with a different graph engine.
- Redesigning the graph-view UX, metadata model, or API contract.
- Changing route permissions, backend endpoints, or graph interaction semantics.

## Decisions

### 1. Split graph-view into an SSR-safe shell and a client-only canvas island

The server page will keep fetching `GraphViewResponse`, checking `graph-view:read`, and rendering the route shell. A shell-level graph-view workbench will remain safe to include in the server render path by avoiding direct imports from `@react-sigma/core` or `sigma`.

The interactive canvas will move into a dedicated client-only module that owns Sigma hooks and WebGL-dependent rendering. That module will be loaded through `next/dynamic(..., { ssr: false })`.

Why this approach:
- It removes the browser-only import chain from the server path.
- It preserves server-rendered shell content and loading behavior.
- It keeps the WebGL boundary explicit and easier to maintain.

Alternatives considered:
- Dynamically importing the entire workbench: simpler, but it throws away SSR for the graph-view shell and inspector layout.
- Guarding Sigma usage with `typeof window !== "undefined"` inside component logic: insufficient because the crash happens during module evaluation, before component code runs.
- Polyfilling `WebGL2RenderingContext` on the server: fragile and misleading, because the server should not pretend to support a browser WebGL runtime.

### 2. Keep browse state outside the Sigma import boundary where practical

Selection, focus state, and inspector content should remain in the SSR-safe workbench shell when they do not require Sigma hooks directly. The client-only canvas island should receive the graph model and callback props needed to report hover, selection, and camera-triggered actions back to the shell.

Why this approach:
- The page keeps rendering a meaningful inspector shell before the canvas hydrates.
- Sigma-specific code stays localized to the canvas module.
- Future graph engine changes remain more isolated from the rest of the page chrome.

Alternative considered:
- Keeping all interaction state inside the canvas island: workable, but it couples the inspector and shell too tightly to Sigma and reduces the value of preserving SSR around the canvas.

### 3. Reuse graph-shaped loading UI for the dynamic canvas fallback

The dynamic island fallback will render a bounded placeholder that matches the canvas footprint in the existing graph-view layout. The shell can continue showing titles, filters, and inspector scaffolding while the canvas bundle hydrates on the client.

Why this approach:
- Prevents layout jump between SSR shell and hydrated canvas.
- Keeps the route visually consistent with the graph-view skeleton already used in the page.
- Makes loading behavior explicit instead of silently dropping the entire graph area.

Alternative considered:
- Returning `null` for the dynamic fallback: simpler but creates an empty hole and increases perceived instability.

## Risks / Trade-offs

- [Shell and canvas state become more distributed] → Mitigation: define a narrow prop interface between the SSR-safe workbench shell and the client-only canvas island, with clear ownership of selection and hover state.
- [Dynamic import can delay first interactive graph paint] → Mitigation: keep the island limited to Sigma code, reuse a purposeful placeholder, and avoid moving unrelated UI into the client-only chunk.
- [Future edits may accidentally reintroduce Sigma imports into the shell path] → Mitigation: keep Sigma imports isolated to one module family and document that boundary in the graph-view implementation.
- [Hydration mismatch risk if fallback shape diverges from hydrated layout] → Mitigation: match the dynamic fallback footprint to the final canvas container and keep shell markup stable.

## Migration Plan

1. Extract Sigma and WebGL-dependent rendering into a dedicated client-only canvas module.
2. Update the graph-view workbench and/or page composition so the server render path references that canvas only through `next/dynamic` with `ssr: false`.
3. Reconnect current graph interactions, loading, empty, and inspector states across the new boundary.
4. Verify that `/graph-view` no longer logs `WebGL2RenderingContext is not defined` during server rendering, then run typecheck, lint, and build validation.

Rollback strategy:
- Revert the boundary split and restore the previous import path if the change introduces regressions worse than the current recoverable rendering fallback.

## Open Questions

- Should the inspector remain fully shell-owned, or should a small amount of selection state stay inside the client-only canvas if that materially reduces prop plumbing?
- Is an additional regression check needed to assert the graph-view route stays SSR-safe under Turbopack, or is build plus runtime verification sufficient for this codebase?
