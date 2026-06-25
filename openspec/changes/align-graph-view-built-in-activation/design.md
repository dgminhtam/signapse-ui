## Context

Graph View currently uses G6 `hover-activate` for relation hover, then adds custom `node:pointerenter` state handling for an extra `active` state. Click selection is handled separately by React state plus a custom `applySelectedGraphStates()` loop over every node and edge.

The target behavior is closer to the G6 sample: hover and active/click use the same highlight plus dim visual language, while G6 behaviors own relation state updates.

## Goals / Non-Goals

**Goals:**

- Make hover and active/click visuals consistent.
- Use G6 built-in behavior semantics for first-degree highlight and dim.
- Remove custom active hover handling and custom selected relation loops.
- Keep the selected node inspector and quick detail flow.

**Non-Goals:**

- Changing backend graph contracts.
- Changing force layout, zoom, pan, or drag behavior beyond state interaction wiring.
- Adding new graph libraries or dependencies.

## Decisions

1. Use G6 `hover-activate` as the only hover state writer.

   Hover will use `degree: 1`, `state: "highlight"`, and `inactiveState: "dim"` to match the sample. The custom `node:pointerenter` and `active` cleanup code will be removed.

2. Use G6 `click-select` for active/click state.

   Active mode will use `degree: 1`, `state: "selected"`, `neighborState: "selected"`, and `unselectedState: "dim"`. The `selected` state styling will mirror the `highlight` state so active and hover look the same.

3. Keep React selection state only for UI state.

   `selectedNodeId` remains the source for the detail inspector and for disabling hover while a node is active. G6 owns visual state; React no longer loops over graph elements to apply selected visuals.

4. Keep dim, but make it simple.

   Dim is required by the requested sample alignment. It will be a single shared state for hover and active instead of separate `inactive`, `selected-inactive`, and related opacity variants.

## Risks / Trade-offs

- G6 dim still updates unrelated graph elements by design. Mitigation: remove the extra custom state pass so Signapse does no additional graph-wide loop.
- `click-select` canvas clearing and React inspector clearing must stay synchronized. Mitigation: keep the existing canvas click React clear path or wire `click-select` callbacks to update `selectedNodeId`.
- Existing hover full-label behavior can conflict with strict sample styling. Mitigation: keep full-title reveal in the shared highlight/selected style unless product explicitly chooses sample-only minimal labels.
