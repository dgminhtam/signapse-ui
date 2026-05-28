## Context

The market chart uses KLineChart as the rendering engine and applies chart-local style objects from `market-chart-canvas.tsx`. Recent polishing made grid lines dashed and drawing overlays lighter, but the result can feel softer than TradingView because canvas lines below one CSS pixel and neutral semi-transparent drawing colors are prone to anti-aliasing and low perceived contrast.

The change should keep the current KLineChart engine and data flow intact. The target is visual crispness: chart guides should remain subtle, while user-created drawing objects should read as intentional workstation tools rather than gray decorative lines.

## Goals / Non-Goals

**Goals:**

- Make chart grid lines feel crisper without increasing visual noise.
- Use a dedicated drawing-tool palette that is distinct from candle direction colors and annotation reaction colors.
- Restore drawing overlay stroke sizes to canvas-friendly values.
- Keep all changes scoped to the market chart KLineChart adapter style helpers.
- Include a small runtime review of canvas/container pixel sizing before changing styles, so the fix is not based only on color tweaks.

**Non-Goals:**

- Do not replace KLineChart or add a new chart dependency.
- Do not change backend APIs, live SSE behavior, lazy history loading, annotation grouping, screenshot, fullscreen, top toolbar, or routing.
- Do not change global shadcn theme tokens or app-wide colors.
- Do not add a user-facing drawing color picker in this change.

## Decisions

1. Keep grid neutral but avoid subpixel grid width.

   Grid lines should remain dashed and low-emphasis, but the style should avoid `size` values below one CSS pixel. If visual density becomes too high, reduce alpha through the chart-local palette instead of using subpixel stroke width.

   Alternative considered: keep `0.25px` grid and only lower alpha. This preserves the current intent but keeps the likely source of canvas softness.

2. Use a chart-tool blue palette for drawing objects.

   Drawing overlays should use a blue hue such as `#2563eb` in light mode and `#60a5fa` in dark mode, with selected states using a stronger same-hue value. This keeps drawings separate from green/red candles and positive/negative/neutral annotation semantics.

   Alternative considered: use foreground black/white for maximum contrast. That is sharp, but it competes with axes and technical chart text and feels less like an active tool layer.

3. Restore drawing overlay stroke widths to crisp values.

   Line, circle, and rectangle borders should use `1px`; selected point borders can use `2px`. The visual weight should be controlled by color and opacity, not fractional line widths.

   Alternative considered: keep `0.75px` for a lighter look. It is visually subtle, but canvas anti-aliasing can make it feel fuzzy and less professional.

4. Keep pixel-path verification as review work, not a permanent UI feature.

   Implementation should inspect or reason about the container/canvas sizing path to confirm there is no obvious CSS transform or DPR mismatch. No debug overlay should ship.

## Risks / Trade-offs

- Crisper grid lines could feel busier if alpha is too high. Mitigation: use `1px` line size with lower alpha and keep dashed style.
- Blue drawing lines could conflict with active/focus treatment if overused. Mitigation: keep the palette chart-local and reserve it only for drawing overlays.
- KLineChart may still anti-alias candle edges internally. Mitigation: treat this change as local rendering polish, not a promise of pixel-identical TradingView output.
- Browser zoom and OS display scaling can still affect canvas perception. Mitigation: include deterministic review notes and avoid claiming the issue is fully solved by style alone.
