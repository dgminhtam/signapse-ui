## 1. Dense Graph Policy

- [x] 1.1 Add Graph View constants/helpers for detecting dense graph payloads from node and edge counts.
- [x] 1.2 Add a label priority helper that distinguishes orientation anchors, high-connectivity nodes, selected nodes, hovered nodes, and lower-priority event/article nodes.
- [x] 1.3 Ensure dense graph policy does not require backend contract changes or new dependencies.

## 2. Label Level Of Detail

- [x] 2.1 Update G6 graph data mapping so dense graphs render fewer default labels for low-priority event/article nodes.
- [x] 2.2 Preserve default labels for assets, themes, selected/hovered contexts, local orientation anchors, and high-connectivity nodes.
- [x] 2.3 Preserve full-title in-canvas reveal for hovered and selected nodes without reintroducing separate node tooltips.
- [x] 2.4 Keep sparse graph label behavior consistent with the existing readable bounded-label policy.

## 3. Incremental Interaction State

- [x] 3.1 Replace overlapping broad hover behavior with a single hover state path that targets hovered node, related nodes, and related edges.
- [x] 3.2 Track previous hover context and clear only the affected previous hover states.
- [x] 3.3 Update selected-node state handling to apply the smallest practical diff between previous and current selected contexts.
- [x] 3.4 Preserve click-to-select, canvas-click clearing, node drag, local inspector, and quick-detail behavior.
- [x] 3.5 Ensure hover and selection do not rebuild the G6 graph instance or restart the force layout.

## 4. Visual And Layout Cost

- [x] 4.1 Reduce broad default shadow, heavy label stroke, and nonessential animation cost for dense graph payloads.
- [x] 4.2 Keep clear visual emphasis for hovered, selected, and related-focus elements.
- [x] 4.3 Keep force layout bounded after initial render and avoid continuous nonessential motion after the graph settles.
- [x] 4.4 Preserve dark and light mode label readability without opaque label-card backgrounds.

## 5. Verification

- [x] 5.1 Run `openspec validate optimize-graph-view-large-graph-performance`.
- [x] 5.2 Run static search or deterministic code review confirming hover/selection no longer intentionally updates every graph element for normal dense graph interactions.
- [x] 5.3 Run static search confirming no separate node tooltip/hover card was reintroduced for node title reveal.
- [x] 5.4 Run `pnpm lint`. Note: command ran and failed on unrelated existing errors outside Graph View.
- [x] 5.5 Run `pnpm typecheck`.
