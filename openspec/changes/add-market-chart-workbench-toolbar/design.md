## Context

The market chart workbench currently renders asset, timeframe, annotation, and refresh controls in an `AppListToolbar` above the chart surface. That keeps the first implementation consistent with list pages, but it no longer matches the product direction for a chart-first workstation. The chart surface already uses KLineCharts directly, and the local KLineCharts type surface exposes indicator and screenshot APIs that can support richer chart commands without adopting `@klinecharts/pro`.

Relevant constraints:

- Asset selection MUST remain watchlist-only; no manual symbol input.
- Route state MUST remain limited to `assetId` and `timeframe`.
- Status/update metadata remains in the bottom chart status rail, not beside toolbar controls.
- UI primitives should compose existing shadcn wrappers and avoid custom primitive chrome.
- KLineCharts-specific APIs should stay behind the chart canvas adapter boundary.

## Goals / Non-Goals

**Goals:**

- Move market chart controls into a chart workbench top toolbar owned by the chart surface.
- Use a single-select shadcn `ToggleGroup` for timeframe changes.
- Treat annotation visibility as a chart toolbar command/toggle.
- Add initial indicator, screenshot, and fullscreen commands in the toolbar.
- Keep responsive, accessible, localized, and minimal chart workspace behavior.
- Keep KLineCharts integration details encapsulated behind a narrow Signapse adapter/handle.

**Non-Goals:**

- Do not migrate to `@klinecharts/pro` or another chart engine.
- Do not add drawing tools or a left-side drawing toolbar in this change.
- Do not persist indicator layouts or user chart templates yet.
- Do not add manual `from`/`to` controls.
- Do not change backend chart APIs.

## Decisions

### Put the top toolbar inside the chart surface

Render a chart-specific toolbar as the first child of the market chart surface instead of using `AppListToolbar`.

Rationale: `AppListToolbar` is tuned for list pages with leading search/action and trailing view controls. A chart workstation needs a denser command strip that visually belongs to the chart canvas.

Alternative considered: keep `AppListToolbar` and add more controls. This would be faster, but it keeps the chart screen visually tied to table/list patterns and makes fullscreen awkward because controls could remain outside the fullscreen surface.

### Keep asset as `Select`, convert timeframe to `ToggleGroup`

The asset control remains a shadcn `Select` because options come from the workspace watchlist and labels can be long. Timeframe becomes a single-select `ToggleGroup` because values are short and frequent switching is a core chart interaction.

Rationale: this matches charting product expectations while preserving watchlist-only guardrails.

Alternative considered: use a segmented custom control. Existing `ToggleGroup` already provides pressed/focus semantics and avoids custom control chrome.

### Use a narrow chart canvas command handle

Expose only Signapse-owned commands from `MarketChartCanvas`, such as applying supported indicators, exporting a chart image, and resizing after fullscreen changes. Do not pass the raw KLineCharts `Chart` instance through the workbench.

Rationale: this keeps vendor APIs contained and leaves room to change chart internals later.

Alternative considered: lift the KLineCharts instance to the workbench. That would make toolbar integration quick but would leak vendor-specific types across the feature and make future cleanup harder.

### Start indicator command as a controlled minimal surface

The toolbar indicator command should open a small Signapse-owned surface, such as a popover or sheet, listing a curated first set of supported KLineCharts indicators. The initial implementation may support toggling common indicators while keeping parameter editing and persistence for later.

Rationale: users get a useful chart-workbench affordance now, while the UI stays simple and shadcn-aligned.

Alternative considered: expose every KLineCharts indicator and settings immediately. That creates a broad UX and testing surface before persistence/design conventions exist.

### Screenshot captures the chart first, not the full app chrome

Use KLineCharts screenshot/export capability through the adapter for the initial screenshot command. The command may exclude DOM overlays such as Signapse annotation marker buttons unless including overlays is feasible without brittle DOM capture logic.

Rationale: chart image export is the stable engine-backed capability. Capturing the whole surface including DOM overlays can be added later if product needs it.

Alternative considered: use a DOM-to-image library. That adds dependency and theme/font edge cases that are unnecessary for the initial chart command.

### Fullscreen applies to the chart surface

Use the browser Fullscreen API on the chart surface container so toolbar, chart canvas, popup, and bottom status rail remain together. Trigger a chart resize when entering or exiting fullscreen.

Rationale: fullscreen should preserve the workstation controls instead of showing only the canvas.

Alternative considered: fullscreen only the KLineCharts DOM. That maximizes chart pixels but hides the toolbar commands that make the view useful.

## Risks / Trade-offs

- Screenshot may not include Signapse DOM annotation markers initially -> Mitigate by documenting the behavior in code/tasks and keeping the command name focused on chart capture.
- Indicator scope can grow quickly -> Mitigate with a curated initial indicator list and no parameter persistence in this change.
- Timeframe toggle can overflow on narrow screens -> Mitigate with responsive wrapping or horizontal overflow contained inside the toolbar, without causing page-level horizontal scroll.
- Fullscreen behavior varies by browser and can fail when unsupported -> Mitigate with disabled/guarded state and non-crashing fallback.
- Toolbar density may drift from shadcn defaults -> Mitigate by using existing `Button`, `Toggle`, `ToggleGroup`, `Select`, and `Separator` wrappers with layout-only class overrides.
