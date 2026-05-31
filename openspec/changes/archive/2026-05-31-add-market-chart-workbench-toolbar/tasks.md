## 1. Toolbar Composition

- [x] 1.1 Replace the market chart `AppListToolbar` usage with a chart-specific top toolbar rendered inside the chart surface.
- [x] 1.2 Keep the watchlist asset selector as the leading toolbar control with existing watchlist-only validation and URL behavior.
- [x] 1.3 Replace the timeframe `Select` with a single-select shadcn `ToggleGroup` that updates the existing `timeframe` route state.
- [x] 1.4 Replace the annotation switch treatment with a toolbar command/toggle while preserving existing annotation loading and marker behavior.
- [x] 1.5 Ensure the toolbar responds on narrow viewports without causing page-level horizontal overflow.

## 2. Chart Commands

- [x] 2.1 Add a narrow market chart canvas command handle for chart actions without exposing raw KLineCharts instances outside the canvas adapter.
- [x] 2.2 Implement the indicator toolbar command with a minimal Signapse-owned control surface and a curated first set of supported indicators.
- [x] 2.3 Implement the screenshot toolbar command through the canvas command handle with non-crashing unavailable-state feedback.
- [x] 2.4 Implement fullscreen on the chart surface container and trigger chart resize after fullscreen state changes.
- [x] 2.5 Preserve the bottom status rail placement for update metadata and event marker text.

## 3. Polish, Copy, And Skeletons

- [x] 3.1 Add or update professional Vietnamese dictionary copy for toolbar command labels, aria labels, unavailable feedback, and indicator controls.
- [x] 3.2 Update page-level and embedded market chart skeletons so their toolbar cues mirror the final chart workbench toolbar.
- [x] 3.3 Review toolbar focus-visible, pressed, disabled, and loading states against shadcn wrapper semantics.
- [x] 3.4 Confirm no manual symbol input, manual `from`/`to` controls, or stale update metadata are introduced into the toolbar.

## 4. Verification

- [x] 4.1 Run `openspec validate add-market-chart-workbench-toolbar --strict`.
- [x] 4.2 Run `pnpm lint`.
- [x] 4.3 Run `pnpm typecheck`.
- [x] 4.4 Run static search or code review to confirm KLineCharts vendor types remain contained in the market chart canvas adapter boundary.

User-owned manual QA: verify the toolbar visually on desktop/mobile, fullscreen behavior in the target browser, and whether screenshot output should include Signapse DOM annotation markers in a later iteration.
