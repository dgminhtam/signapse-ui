## Context

Backend has already stabilized the `GET /graph-view` contract for a shared knowledge graph that returns `nodes[]` and `edges[]` across four MVP node kinds: `event`, `asset`, `theme`, and `source-document`. The contract explicitly assigns layout ownership to the frontend and does not return coordinates, force parameters, or rendering hints.

The admin app currently has no frontend surface for this API. `docs/APIMAPPING.md` marks `/graph-view` as not yet integrated, while `docs/graph-view-api-contract.md` already defines the runtime contract and click-through guidance for FE. The protected app does, however, already have adjacent read surfaces for `events` and `source-documents`, along with permission helpers and route gating patterns that can be reused.

There are several repository constraints that shape the implementation:

- protected routes live under `app/(main)`
- feature routes use a server `page.tsx` shell with `Card`, `CardHeader`, `CardDescription`, `Separator`, and `Suspense`
- authenticated backend access goes through feature-local actions under `app/api/*/action.ts`
- user-facing UI text must be Vietnamese
- the repo currently has no installed graph visualization dependency
- there is no protected asset or theme detail route today, even though backend has asset read APIs

This change benefits from a design document because it introduces a new graph rendering stack, a client-owned layout lifecycle, and a browse interaction model that spans transport, permissions, navigation, and visualization concerns.

## Goals / Non-Goals

**Goals:**
- Add a protected frontend graph browsing route backed by `GET /graph-view`.
- Render the shared graph with an Obsidian-like browse experience: force-directed layout, pan/zoom, hover highlight, and selection.
- Use a frontend-owned graph stack that fits React/Next.js and can scale beyond a tiny node count.
- Make the graph route discoverable from protected navigation and gate it with `graph-view:read`.
- Support permission-aware drill-down into existing entity routes where those routes already exist.
- Keep graph-side metadata useful even when a node kind does not yet have a dedicated frontend detail route.
- Align the implementation with repo-standard page shell, empty/loading/error states, and API mapping documentation.

**Non-Goals:**
- Graph editing, node mutation, edge mutation, or backend write APIs.
- Query-specific graph slices, watchlist overlays, workspace personalization, or advanced graph filtering in v1.
- Backend-generated layout coordinates, color tokens, or cluster hints.
- A dedicated asset or theme detail route as part of this change.
- Server-side graph layout computation or graph image export.

## Decisions

### 1. Expose the feature at `/graph-view` and point the navigation entry there
The protected frontend route will live at `/graph-view`, with a navigation label of `Biểu đồ tri thức`.

Why:
- It follows the repo's feature-folder convention under `app/(main)/[feature]`.
- It avoids coupling a new feature to the otherwise empty root route at `/`.
- It keeps the route name aligned with the backend/API terminology and related documentation.

Alternatives considered:
- Reuse `/` as the graph page.
- Rejected because the repo's feature organization points toward a dedicated feature folder, and using `/` would make the route structure less consistent.

### 2. Use `Sigma.js + graphology + @react-sigma/core` as the visualization stack
The graph canvas will use Sigma for rendering, graphology as the in-memory graph model, and React Sigma as the React bridge.

Why:
- The target UX is a browseable relationship graph, not a node editor. Sigma's model fits graph exploration better than editor-centric libraries.
- Sigma is designed for interactive graph visualization with WebGL rendering and typed node/edge events, which aligns with hover highlight, node selection, and side-panel detail flows.
- graphology provides a graph model plus layout ecosystem that fits the contract's frontend-owned layout responsibility.
- React Sigma gives a cleaner integration path for a client component inside the Next.js route shell.

Alternatives considered:
- `react-force-graph-2d`
- Rejected as the primary direction because it is excellent for quick spikes but gives less structured control for a productionized React admin surface.
- `Cytoscape.js`
- Rejected for v1 because it is heavier than needed for the current browse scope and would add more integration surface than the chosen path.
- `React Flow`
- Rejected because the feature is graph browsing, not a node-based editor workflow.

### 3. Run layout on the client in two phases: initial seeding and force-directed settling
The frontend will seed node positions locally and then run a force-directed layout in the browser. After the graph settles, the viewport remains interactive while the expensive layout work is no longer continuously recomputed.

Why:
- The backend contract explicitly leaves layout to the frontend.
- ForceAtlas-style layouts are a strong fit for an Obsidian-like browse graph.
- Seeding initial coordinates avoids the ForceAtlas edge case where every node starts at `(0,0)`.
- Stopping or freezing the layout after settling reduces needless work and helps preserve user orientation once the graph is readable.

Alternatives considered:
- Expect backend to provide coordinates.
- Rejected because the contract explicitly excludes backend-generated layout.
- Continuously run physics forever while the page is open.
- Rejected because it adds unnecessary CPU cost and makes the graph feel unstable after the initial layout.
- Use a static deterministic layout only.
- Rejected because it would lose the exploratory, clustered feel expected from the chosen UX direction.

### 4. Split the route into a server shell plus a client workbench
`app/(main)/graph-view/page.tsx` will own permission gating and the standard `Card` shell, while a client workbench component will own graph rendering, viewport controls, hover/select state, and side-panel state.

Why:
- This matches the established route pattern already used by adjacent protected features.
- Server gating keeps permission handling aligned with the repo's existing approach.
- The graph canvas and Sigma lifecycle are inherently client concerns and should stay isolated from the server shell.

Alternatives considered:
- Build the entire page as a fully client-rendered route shell.
- Rejected because it would diverge from the repo's route conventions and weaken server-side permission gating.

### 5. Use a browse-first interaction model with a detail panel instead of route-per-click
The graph will treat click as selection first, not immediate navigation. Node and edge selection will update a side panel that shows labels, kinds, metadata, and relation semantics. Drill-down links will appear inside that detail panel when the current node kind has a supported frontend route and the current user has permission to open it.

Why:
- This preserves spatial context and makes the graph feel like a browse surface, not a list of links.
- The API contract already treats `metadata` as lightweight browse data suitable for tooltips and side panels.
- It avoids accidental navigation while users are exploring clusters.

Alternatives considered:
- Immediate route navigation on every node click.
- Rejected because it would interrupt exploration and make the graph feel fragile.
- Fetch full entity detail on every selection.
- Rejected because the contract already includes lightweight metadata, and v1 does not need selection-triggered secondary API calls.

### 6. Support drill-down only for routes that already exist in the protected app
The graph will expose interactive drill-down for:

- `event` nodes to `/events/{id}` when the user has `event:read`
- `source-document` nodes to `/source-documents/{id}` when the user has `source-document:read`

For `asset` and `theme` nodes, v1 will show local metadata in the panel and keep them non-navigable.

Why:
- Event and source-document detail pages already exist and match the graph's traceability use case.
- There is no protected asset or theme route today, so promising drill-down there would create spec drift against the actual app surface.
- Local metadata still gives operators useful context for asset/theme nodes without expanding scope.

Alternatives considered:
- Add asset and theme detail routes as part of this change.
- Rejected because it would turn a graph browse feature into a broader entity-surface expansion.
- Hide asset and theme nodes from the graph until routes exist.
- Rejected because those node kinds are part of the backend MVP contract and are central to the graph's value.

### 7. Distinguish node and edge kinds visually, but keep styling data-owned by the frontend
The frontend will map `kind` and `relationType` into visual styling decisions such as color, size accent, iconography, and edge treatment. These choices live entirely in FE and are not part of the backend contract.

Why:
- The contract explicitly excludes backend-generated style tokens.
- Operators need fast visual scanning to separate events, assets, themes, and source documents.
- Relation type and edge kind should remain readable without opening every detail panel.

Alternatives considered:
- Ask backend for color/style tokens.
- Rejected because it expands the API contract and conflicts with the stated FE ownership.

## Risks / Trade-offs

- [Layout tuning may feel unstable or noisy on first pass] -> Start with a conservative force layout, seed positions deterministically enough for repeatability, and freeze once the graph reaches a readable state.
- [Large graphs may still stress the browser] -> Use a rendering stack designed for graph visualization, keep v1 to the documented MVP node/edge kinds, and verify behavior against realistic payload sizes before shipping broadly.
- [Asset and theme nodes will not deep-link in v1] -> Make the side-panel treatment intentional and useful so the missing drill-down feels like scoped product behavior rather than a broken link.
- [A new client dependency adds bundle and maintenance surface] -> Keep the dependency set focused on the chosen graph stack and avoid adding multiple overlapping graph libraries.
- [Users may expect the existing root nav item to land on `/`] -> Update the protected navigation entry to point directly at `/graph-view` so discoverability is explicit and the blank root page is no longer the default graph entry point.

## Migration Plan

1. Add graph-view definitions, permission helpers, and authenticated action wrappers.
2. Add the protected `/graph-view` route shell, local error boundary, and client graph workbench.
3. Add the graph rendering dependencies and implement the client-owned layout lifecycle.
4. Add panel-based selection, hover highlight, and permission-aware drill-down affordances.
5. Update the protected navigation entry and `docs/APIMAPPING.md`.
6. Verify empty, loading, error, populated, and permission-restricted browse states.

Rollback strategy:
- Remove the `/graph-view` route and navigation entry while keeping the backend API untouched.
- Remove the graph dependencies if the feature is reverted before adoption.

## Open Questions

- None for this proposal. The route shape, API contract, and visualization direction are now specific enough to proceed into implementation planning.
