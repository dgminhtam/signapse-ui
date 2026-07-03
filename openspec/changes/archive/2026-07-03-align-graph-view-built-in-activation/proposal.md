## Why

Graph View currently mixes G6 built-in hover behavior with custom hover and selection state loops. This makes hover and active visuals inconsistent and adds unnecessary full-graph state churn.

## What Changes

- Align hover activation with the G6 sample pattern using `hover-activate`, first-degree relation highlighting, and dimmed unrelated elements.
- Add an active/click mode that uses G6 behavior-style state handling and matches the hover visual treatment.
- Remove custom pointer-enter active state handling and custom selected/related/inactive state loops where G6 behavior can own the interaction.
- Keep React selection state only for the node detail inspector and active-mode lifecycle.
- Preserve node drag, canvas pan, controlled zoom, quick detail actions, and existing graph data contracts.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `graph-view-hover-spotlight`: Hover visual behavior changes to match G6 built-in highlight/dim activation semantics.
- `graph-view-selection-state-lifecycle`: Selection state handling changes from custom full-graph batching to G6 behavior-style active state handling while keeping inspector state.
- `graph-view-large-graph-performance`: Performance expectations change from avoiding dimmed unrelated state updates to minimizing custom churn while accepting G6 sample-style dim behavior.

## Impact

- Affected code: `app/[lang]/(main)/graph-view/graph-view-canvas.tsx`.
- Affected behavior: graph hover and click/active visual states.
- No backend API, data contract, route, dependency, or localization changes expected.
