## 1. Canvas Simplification

- [x] 1.1 Remove hierarchy/is-leaf derivation, dense-label thresholds, and related unused node data from Graph View G6 data mapping.
- [x] 1.2 Replace per-kind force/link/many-body tuning helpers with a minimal G6-supported force layout configuration.
- [x] 1.3 Replace callback-based `highlight`, `selected`, and `dim` styles with static G6 state style objects.
- [x] 1.4 Keep hover and active first-degree context behavior through G6 behaviors while preserving React selected-node inspector state.
- [x] 1.5 Remove custom drag timestamp click suppression if G6 drag/click behavior satisfies the drag lifecycle spec.
- [x] 1.6 Keep only one initial fit/center path for graph render and recenter behavior.

## 2. Related Cleanup

- [x] 2.1 Deduplicate Graph View loading/fallback markup where it repeats the same canvas skeleton surface.
- [x] 2.2 Shrink graph visual label mapping helpers without changing localized HUD labels or colors.
- [x] 2.3 Remove imports, constants, helpers, and types made unused by the refactor.

## 3. Verification

- [x] 3.1 Run `openspec.cmd validate simplify-graph-view-g6-customizations --strict`.
- [x] 3.2 Run `pnpm.cmd typecheck`.
