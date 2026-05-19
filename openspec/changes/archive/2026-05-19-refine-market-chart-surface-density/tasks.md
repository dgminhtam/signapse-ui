## 1. Full-Width Chart Layout

- [x] 1.1 Remove the persistent right summary rail/card from the market chart workbench.
- [x] 1.2 Remove unused summary-panel helpers/imports that become dead code after the rail is removed.
- [x] 1.3 Change the chart/content layout so the chart surface uses the available workspace width.
- [x] 1.4 Preserve existing chart loading, empty, error, refresh, URL state, and annotation behavior after the layout change.

## 2. Surface Spacing And Radius

- [x] 2.1 Move toolbar-to-chart spacing onto the chart surface with `mt-4`, matching `AppListTable`.
- [x] 2.2 Remove parent layout gaps that create larger custom spacing between toolbar and chart.
- [x] 2.3 Normalize chart surface shell to standard `rounded-xl`, `border-border`, and `bg-card` treatment.
- [x] 2.4 Remove custom chart shell radius classes such as `rounded-[28px]` and `rounded-t-[28px]`.
- [x] 2.5 Preserve the clipped chart visual region while keeping annotation popup layer outside clipping.

## 3. Toolbar Control Density

- [x] 3.1 Normalize the `Sự kiện` switch wrapper height to match default shadcn control height.
- [x] 3.2 Normalize the switch wrapper radius, border, background, and shadow treatment to align with `SelectTrigger`, `Input`, and `Button`.
- [x] 3.3 Verify the switch wrapper remains responsive and does not overflow on mobile.

## 4. Chart Font Consistency

- [x] 4.1 Add a local chart font resolver or constant in the KLineChart canvas adapter using the app sans font stack.
- [x] 4.2 Apply the app font family to supported KLineChart axis tick text styles.
- [x] 4.3 Apply the app font family to supported KLineChart crosshair and tooltip/legend text styles.
- [x] 4.4 Keep font changes local to the chart adapter without changing global theme tokens or shadcn primitives.

## 5. Verification

- [x] 5.1 Run targeted lint for market chart files.
- [x] 5.2 Run `pnpm typecheck`.
- [x] 5.3 Run `pnpm build`.
- [x] 5.4 Run `openspec validate --changes refine-market-chart-surface-density`.
- [x] 5.5 Smoke test or visually inspect `/market-charts` for full-width chart, toolbar spacing, switch wrapper alignment, chart radius, chart font, and annotation popup layering when an authenticated chart fixture is available; otherwise document the blocker. Blocked locally because this session does not have an authenticated Clerk workspace/browser chart fixture to inspect loaded chart states.
