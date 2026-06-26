## Context

Graph View already uses G6 built-in `hover-activate` and `click-select` behaviors for first-degree context emphasis. The current node and edge state styles define `highlight`, `selected`, and `dim`, but `highlight` and `selected` are visually identical while `dim` is implemented through opacity values. This makes the state purpose less obvious and can make unrelated graph context look faded instead of deliberately neutral.

## Goals / Non-Goals

**Goals:**

- Keep hover and active selection on G6 built-in behaviors.
- Make hover map to `highlight`, active target selection map to `selected`, and active related context map to `highlight`.
- Keep focused hover and selected effects visually aligned.
- Change unrelated node and edge `dim` styling to neutral gray color treatment instead of opacity reduction.
- Keep the change scoped to Graph View canvas state styling.

**Non-Goals:**

- Do not add custom graph traversal or manual per-element state orchestration.
- Do not change graph layout, force parameters, zoom, drag, quick detail, or backend graph contracts.
- Do not introduce a new design token system or dependency.

## Decisions

1. Keep G6 built-in state assignment.

   `hover-activate` already applies `highlight` and `dim` for hovered first-degree context. `click-select` can apply `selected` to the active target, `highlight` to first-degree related context, and `dim` to unrelated context. Reusing these behaviors keeps the implementation short and avoids rebuilding the relation state logic in application code.

2. Keep `selected` only on the active target.

   G6 toggles selection based on whether the clicked target already has the configured `selected` state. If related nodes also receive `selected`, clicking a related node clears selection instead of transferring it. Related active context should therefore use the existing `highlight` state while the active target keeps `selected`.

3. Replace dim opacity fields with neutral gray fields.

   The dim state should communicate "background context" through gray coloring, not broad opacity reduction. This avoids faded labels and edges while still separating focused relations from unrelated context.

4. Do not make "edge-only degree" custom logic.

   The current G6 degree behavior highlights or selects first-degree related graph context, including related nodes and edges. Restricting the relation state to only edges would require custom filtering and would reintroduce the custom state churn this graph view has been simplifying away.

## Risks / Trade-offs

- Gray dim color may reduce kind-specific color cues while a hover or active state is present. Mitigation: the focused node and related edges remain emphasized, and normal colors return when the state clears.
- G6 built-in degree state includes related nodes as well as related edges. Mitigation: accept the built-in behavior to avoid custom traversal; revisit only if user testing shows related nodes should not be emphasized.
- Existing dim opacity palette fields may become unused. Mitigation: remove the old opacity fields in the same implementation pass.
