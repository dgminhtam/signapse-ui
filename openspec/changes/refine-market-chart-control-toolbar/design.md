## Context

The `/market-charts` workbench currently renders asset selection, timeframe, annotation toggle, reload, and freshness text inside a bordered muted surface. That made sense while the chart screen was being assembled, but the rest of Signapse has since standardized compact control rows around `AppListToolbar`-style leading/trailing groups and minimal page chrome.

The chart also currently shows latest-update freshness beside the controls. Product feedback is to move that context into the chart itself, near the chart identity, so the chart reads as a single financial instrument view such as `XAU/USD - 1 giờ - Cập nhật 10:17 07/05/2026`.

## Goals / Non-Goals

**Goals:**

- Make the market chart controls visually consistent with existing list/search/filter toolbar groups.
- Remove the card-like wrapper around the control cluster.
- Keep controls compact, responsive, and aligned without custom height overrides.
- Move freshness text from the toolbar into the chart surface.
- Present chart identity and freshness as one concise label inside the chart area.
- Keep the implementation local to market chart components.

**Non-Goals:**

- Do not change backend candle APIs, request windows, DTO schemas, permissions, or route state.
- Do not add manual `from`/`to` controls or lazy historical loading.
- Do not redesign the summary rail, annotation popup content, marker visuals, or chart engine.
- Do not introduce a new shared toolbar abstraction unless the existing `AppListToolbar` composition already fits cleanly.

## Decisions

### Use list-toolbar composition for the chart controls

The control row should reuse the same layout rhythm as list pages: a leading area for the primary selector and a trailing area for view/action controls. The market chart is not a list, but the control shape is the same: one primary object selector plus secondary view controls.

Rationale: this keeps the screen consistent with the product without adding another local shell pattern.

Alternative considered: keep the existing `FieldGroup` grid and only remove the border. Rejected because the grid still reads like a form and keeps labels/vertical alignment heavier than needed for an operational chart toolbar.

### Keep labels accessible but not visually dominant

Visible labels such as `Tài sản watchlist` and `Khung` are redundant when the selected values and placeholders already identify the controls. The implementation should keep labels available to assistive technology through `sr-only` text and use placeholders or compact trigger text for sighted users.

Rationale: this follows the screen-minimalism rules in `AGENTS.md` and reduces toolbar height without losing accessibility.

Alternative considered: show labels above each control. Rejected because it recreates the form-card feel the change is meant to remove.

### Render chart context as a React-owned overlay

The label `XAU/USD - 1 giờ - Cập nhật 10:17 07/05/2026` should be rendered by React in the chart surface or canvas wrapper, positioned to feel like a chart legend/header.

Rationale: KLineChart has internal tooltip/title templates, but product copy should remain under Signapse control rather than depending on chart-engine internals. A React overlay is easier to style, localize, test, and adjust if the chart engine changes again.

Alternative considered: customize KLineChart's candle tooltip title template. Rejected for this change because it couples product freshness text to KLineChart tooltip behavior and may conflict with crosshair/hover semantics.

### Avoid duplicate chart identity

If KLineChart's native title still displays symbol/period text, the implementation should prevent visually duplicate chart identity. Either suppress/reduce the native title if supported by styles, or place the React label so it replaces the need for a separate visible identity without fighting the chart.

Rationale: duplicated `XAU/USD - 1H` text makes the chart feel noisy and violates the minimal content rule.

## Risks / Trade-offs

- [KLineChart native title cannot be fully suppressed through stable styling] -> Keep the React label subtle and avoid rendering an additional duplicate outside the chart surface; document any library limitation during implementation.
- [Overlay label competes with OHLC tooltip text] -> Position it in the same top-left chart context zone with compact typography and pointer-events disabled.
- [Toolbar loses useful context when labels are hidden] -> Keep accessible labels, strong placeholders, and stable selected values.
- [Responsive toolbar becomes cramped] -> Stack controls on mobile using the existing toolbar responsive behavior and keep full-width asset selection on narrow screens.
