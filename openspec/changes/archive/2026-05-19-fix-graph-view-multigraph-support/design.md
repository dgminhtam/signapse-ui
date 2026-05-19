## Context

The current graph view model is built with `MultiDirectedGraph`, and the backend legitimately returns multiple edges with the same `sourceNodeId` and `targetNodeId` when those edges represent different semantic relations. The crash happens later in the rendering pipeline because `SigmaContainer` creates a default simple `graphology` graph unless a compatible graph constructor or instance is supplied. When `useLoadGraph` copies the graph model into that simple graph, Graphology rejects the second edge for the same node pair.

## Goals / Non-Goals

**Goals:**
- Make graph view accept valid multigraph payloads from the backend.
- Preserve distinct edge keys and relation metadata for parallel edges.
- Fix the issue with a minimal frontend change that does not alter current graph-view behaviors beyond preventing the crash.

**Non-Goals:**
- Changing the backend payload format or forcing backend deduplication.
- Redesigning how parallel edges are visually separated or labeled.
- Reworking graph view layout, interaction model, or non-related Sigma settings.

## Decisions

### Use a multigraph-compatible Sigma graph at container initialization

`SigmaContainer` must receive a graph constructor or instance that supports multiple edges between the same nodes. This keeps the existing `buildGraphModel` and `useLoadGraph` flow intact while aligning Sigma's internal graph type with the already-correct frontend model type.

Alternative considered:
- Deduplicate backend edges before loading them. Rejected because it would discard valid semantic relations such as `PRIMARY_SUBJECT` and `AFFECTED_ASSET` between the same two nodes.

### Preserve edge uniqueness by `id`, not by source-target pair

The current model-layer dedupe by `edge.id` is the correct boundary. Different edge IDs that share source and target are still distinct relations and must remain independently addressable for selection, labels, and metadata.

Alternative considered:
- Collapse multi-edges into a single aggregated edge. Rejected because it changes the meaning of the payload and would hide relation-level detail from the UI.

### Add a regression check using a payload with parallel edges

The fix should be guarded by a targeted regression path that exercises repeated source-target pairs with different edge keys. This reduces the risk of future refactors reintroducing a simple graph somewhere in the Sigma integration.

## Risks / Trade-offs

- [Library integration assumption] `@react-sigma/core` may change how it instantiates graphs in future versions. → Mitigation: rely on its supported `graph` prop contract and verify with a regression case.
- [Visual overlap remains] Parallel edges may still appear visually close to each other. → Mitigation: accept this for the bug fix; any edge-separation UX improvement can be proposed separately.
- [Route-level verification gap] If automated browser verification remains auth-blocked, runtime confirmation may depend on a local authenticated session. → Mitigation: keep a deterministic payload-based regression check in code and document any manual verification needed.

## Migration Plan

This is a frontend-only fix with no data migration. Deploy by shipping the updated graph container initialization, then verify the graph view route against a payload that contains duplicate source-target pairs with distinct edge IDs. Rollback is a standard frontend revert if the Sigma integration behaves unexpectedly.

## Open Questions

- No blocking open questions for implementation. A future follow-up may decide whether parallel edges need stronger visual separation.
