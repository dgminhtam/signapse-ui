## 1. Shared Impact Classification

- [x] 1.1 Add a typed locale-independent High, Medium, and Low impact classifier in the existing economic-calendar definitions and refactor the current label and badge helpers to reuse it without changing their output.
- [x] 1.2 Extend the existing deterministic economic-calendar impact check to cover case, whitespace, null, empty, unknown, and the unchanged label and badge behavior.

## 2. Workbench Event Settings State

- [x] 2.1 Add canonical default-selected impact state and a narrow checkbox toggle handler to `MarketChartWorkbench`, then pass them into `MarketChartTopToolbar`.
- [x] 2.2 Derive filtered calendar events from raw loaded events and use the filtered collection for calendar groups, ChartSurface events, lane content, legend visibility, and counts while leaving loaded data unchanged.

## 3. Functional Consolidated Popover

- [x] 3.1 Bind the popover Events and Economic Calendar switches to the existing workbench-controlled values and layer change handlers, removing the prototype-only Calendar state.
- [x] 3.2 Bind the three impact checkboxes to the workbench impact selection, preserve their values while Calendar is disabled, and ensure no selection produces an empty calendar-derived view.
- [x] 3.3 Remove the separate Events and Economic Calendar toolbar toggles and clean up only imports or prototype code made unused by their replacement.

## 4. Verification

- [x] 4.1 Run the deterministic impact check, targeted lint for touched files, and project typecheck.
- [x] 4.2 Run strict OpenSpec validation, scoped diff checks, and static searches confirming the obsolete prototype state and separate toolbar toggles are removed without adding impact API parameters, URL state, persistence, or dependencies.

User-owned manual QA: Review the consolidated command at desktop and narrow widths; verify keyboard focus and dismissal, layer enable/disable behavior, impact filtering including all unchecked, and filter preservation after toggling Economic Calendar.
