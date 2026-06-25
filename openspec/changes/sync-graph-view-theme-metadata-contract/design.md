## Context

`GET /graph-view` no longer returns theme or warm episode as graph topology. The backend contract now exposes node kinds `event`, `asset`, `news-article`, and `narrative`; edge kinds `event-asset`, `news-article-event`, `narrative-event`, and `narrative-asset`; and `GraphNodeMetadata.themes[]` for event/narrative theme context.

The frontend still carries the older topology in its Graph View schema, visuals, count order, force constants, labels, and specs. `buildGraphModel()` currently filters `theme` and `event-theme` after validation, which made sense during transition, but it now hides contract drift instead of representing the backend source of truth.

## Goals / Non-Goals

**Goals:**

- Align Graph View frontend validation with the current backend response shape.
- Remove theme node and event-theme edge support from Graph View runtime topology.
- Preserve backend theme context through typed `metadata.themes[]`.
- Surface theme metadata on event and narrative node inspection without adding graph clutter.
- Keep API mapping, OpenSpec requirements, dictionaries, and runtime behavior consistent.

**Non-Goals:**

- Do not introduce a new graph leaf layout or synthetic theme leaf nodes.
- Do not change backend APIs, permissions, routes, or persistence.
- Do not add canonical theme detail routes or quick-detail actions.
- Do not change global app theme/dark-mode behavior.

## Decisions

### Treat theme as metadata, not topology

Graph View should remove `theme` from `GraphViewNodeKind`, `graphViewNodeKindSchema`, parser regex, node visual maps, count order, layout constants, and dictionary node-kind labels. It should also remove `event-theme` from edge kinds, schema, visuals, count order, layout constants, and dictionary edge-kind labels.

Alternative considered: keep accepting legacy `theme` / `event-theme` and continue filtering in `buildGraphModel()`. That would make frontend validation less strict than the documented backend contract and could mask stale backend or fixture payloads.

### Preserve `metadata.themes[]` as a small typed metadata list

Add a `GraphViewNodeThemeMetadata` type/schema with `title?: string | null` and `relationType?: string | null`, plus `themes?: GraphViewNodeThemeMetadata[] | null` on `GraphViewNodeMetadata`. The relation type should use existing relation label dictionaries where possible because `PRIMARY_THEME` and `SECONDARY_THEME` remain meaningful labels.

Alternative considered: model `relationType` as a strict enum. The OpenAPI snapshot enumerates two values, but the existing graph definitions commonly accept string-like metadata to avoid blocking rendering when backend enum values expand.

### Render theme metadata inside the inspector

Event and narrative inspectors should show the compact list of theme titles and relation labels when `metadata.themes[]` is present. Theme metadata should not affect relation counts, graph edge counts, focus/hover state, or quick detail routing because it is no longer graph topology.

Alternative considered: render theme metadata as hidden/synthetic leaf nodes in the canvas. That belongs to a separate leaf-layout proposal because it changes topology, counts, selection behavior, and visual density.

### Keep response validation strict for current topology

`graphViewResponseSchema` should reject removed node/edge kinds after the sync. If a legacy payload appears, the existing validation diagnostic logging should identify the offending path rather than silently filtering it.

Alternative considered: preprocess legacy graph responses into the new metadata form on the frontend. That would duplicate backend migration logic and weaken the contract boundary.

## Risks / Trade-offs

- [Risk] Backend runtime might still emit a legacy `theme` node or `event-theme` edge in some environment. -> Mitigation: strict validation fails fast with concise diagnostics, and `docs/APIMAPPING.md` documents the expected contract.
- [Risk] Theme metadata can crowd the node inspector for events with many themes. -> Mitigation: render as compact metadata and keep relation summary separate.
- [Risk] Removing dictionary keys can affect inferred dictionary types. -> Mitigation: update both `en` and `vi` dictionaries together and let TypeScript catch any stale references.
- [Risk] Specs still mention theme topology in archived/main requirements. -> Mitigation: modify the main graph-view backend and inspector requirements in this change so archive will sync the new source of truth.
