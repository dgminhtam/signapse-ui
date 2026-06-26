## 1. Graph State Styling

- [x] 1.1 Replace opacity-based dim palette fields with neutral gray color fields in Graph View canvas palette.
- [x] 1.2 Update node `dim` state to use gray fill and label colors instead of opacity reduction.
- [x] 1.3 Update edge `dim` state to use a gray stroke instead of opacity reduction.
- [x] 1.4 Keep hover behavior mapped to `highlight` and click active behavior mapped to `selected` without adding custom graph traversal.
- [x] 1.5 Keep active related context off the `selected` state so clicking a related node transfers active selection instead of clearing it.

## 2. Verification

- [x] 2.1 Run `openspec.cmd validate clarify-graph-view-state-styles --strict`.
- [x] 2.2 Run `pnpm.cmd typecheck`.
- [x] 2.3 Run `pnpm.cmd lint`.
