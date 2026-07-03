## 1. State Model Cleanup

- [x] 1.1 Replace separate hover/selection state names with shared `highlight`, `dim`, and `selected` graph states.
- [x] 1.2 Make `selected` visual styling mirror `highlight` so active mode and hover mode look the same.
- [x] 1.3 Remove `selected-related`, `selected-inactive`, and custom inactive opacity state styling that is no longer needed.

## 2. Behavior Wiring

- [x] 2.1 Configure `hover-activate` with `degree: 1`, `state: "highlight"`, `inactiveState: "dim"`, and `animation: false`.
- [x] 2.2 Add G6 `click-select` for node active mode with first-degree relation highlighting and dimmed unrelated elements.
- [x] 2.3 Keep hover disabled while a node is active to avoid hover and active state fighting.

## 3. Custom Logic Removal

- [x] 3.1 Remove custom `node:pointerenter` / `node:pointerleave` active-state handlers and cleanup helpers.
- [x] 3.2 Remove `applySelectedGraphStates()` and the React effect that calls it.
- [x] 3.3 Keep React `selectedNodeId` only for the detail inspector, quick detail, and active-mode clear behavior.

## 4. Verification

- [x] 4.1 Run `pnpm.cmd typecheck`.
- [x] 4.2 Run `pnpm.cmd lint` and report any pre-existing warnings separately from this change.
- [x] 4.3 Run `openspec.cmd validate align-graph-view-built-in-activation --strict`.
