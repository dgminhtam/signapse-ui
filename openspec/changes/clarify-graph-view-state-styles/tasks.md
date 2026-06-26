## 1. Graph State Styling

- [ ] 1.1 Replace opacity-based dim palette fields with neutral gray color fields in Graph View canvas palette.
- [ ] 1.2 Update node `dim` state to use gray fill and label colors instead of opacity reduction.
- [ ] 1.3 Update edge `dim` state to use a gray stroke instead of opacity reduction.
- [ ] 1.4 Keep hover behavior mapped to `highlight` and click active behavior mapped to `selected` without adding custom graph traversal.

## 2. Verification

- [ ] 2.1 Run `openspec.cmd validate clarify-graph-view-state-styles --strict`.
- [ ] 2.2 Run `pnpm.cmd typecheck`.
- [ ] 2.3 Run `pnpm.cmd lint`.
