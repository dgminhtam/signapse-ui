## Why

The recent large-graph performance optimization changed core Graph View behavior: drag, force motion, hover dim/focus, and animation no longer feel like the previous G6 team-clustering experience. Performance work must preserve the existing analytical interaction model and only reduce rendering/calculation cost in behavior-safe areas.

## What Changes

- Restore Graph View behavior invariants from the pre-optimization implementation.
- Require performance optimization to keep node drag, linked force reaction, hover dim/focus, settle animation, click selection, and quick detail behavior unchanged.
- Limit future performance work to behavior-safe areas such as default label budget, visual drawing cost, adjacency lookup, and duplicate work removal.
- Remove or revert dense-graph branches that disable animation, disable hover activation, or weaken force layout behavior.
- Keep the current G6 engine, backend graph contract, local inspector, and quick-detail drawer.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `graph-view-g6-force-layout`: Force layout optimization must preserve animation, node drag, and linked-node force reaction behavior.
- `graph-view-hover-spotlight`: Hover optimization must preserve hover dim/focus behavior for all graph sizes.
- `graph-view-readability-interaction`: Label/readability optimization must preserve existing interaction behavior and only adjust behavior-safe label/visual costs.
- `graph-view-selection-state-lifecycle`: Selection batching or diffing must not disable existing hover, drag, animation, or force-layout behavior.

## Impact

- Affected code: `app/[lang]/(main)/graph-view/graph-view-canvas.tsx`.
- Affected OpenSpec: Graph View force layout, hover spotlight, readability interaction, and large-graph performance specs.
- APIs: No backend contract changes.
- Dependencies: No new packages and no graph engine migration.
