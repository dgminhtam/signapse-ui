## Context

Graph View currently mixes G6 built-in behaviors with custom layout heuristics, per-kind force tables, label expansion callbacks, and lifecycle guards. Recent interaction work moved hover and active modes closer to the G6 sample pattern, so the remaining custom code is now mostly maintenance cost.

## Goals / Non-Goals

**Goals:**

- Keep the existing Graph View screen, data contract, quick detail drawer, HUD counts, pan/zoom/recenter controls, hover context, active context, and node drag.
- Remove custom force clustering, hierarchy/is-leaf mapping, dense-label heuristics, expanded-label state callbacks, duplicate fit/loading surfaces, and unnecessary drag click suppression.
- Prefer G6 behavior configuration and static G6 state styles over local graph-wide restyling code.

**Non-Goals:**

- No backend graph payload changes.
- No new graph engine, dependency, or visual redesign.
- No route, quick-detail, permission, or i18n changes beyond deleting code that becomes unused.

## Decisions

- Use a minimal G6 force layout instead of per-kind force tuning.
  - Rationale: the refactor goal is raw G6 behavior, and the current tuning tables are the main custom layout surface.
  - Alternative considered: keep relation-specific distances and only rename helpers. Rejected because it preserves the complexity being removed.

- Use static state style objects for `highlight`, `selected`, and `dim`.
  - Rationale: G6 already applies state to the active element and degree context; callback state styles that rewrite labels and line widths create extra custom behavior.
  - Alternative considered: keep expanded labels on hover/active. Rejected because it is custom canvas behavior and requires extra helper code.

- Keep React state only for product UI outside G6.
  - Rationale: React still owns the selected node inspector and quick detail drawer, while G6 owns graph state visuals.
  - Alternative considered: manually batch all selected/dim states from React. Rejected because `click-select` already covers the interaction.

- Delete duplicate loading/fallback markup where possible.
  - Rationale: the page Suspense fallback and dynamic import loading fallback describe the same surface.
  - Alternative considered: keep both in sync manually. Rejected because it is duplicated UI maintenance.

## Risks / Trade-offs

- Less hand-tuned spacing may change graph shape → mitigate by using G6-supported layout parameters only when the raw default is unreadable.
- Removing hover expanded labels may make some hidden labels less discoverable → mitigate through active inspector and existing labels rather than custom hover geometry.
- Removing click-after-drag suppression may expose a G6 behavior gap → verify drag release does not select a node; add the smallest local guard only if needed.
