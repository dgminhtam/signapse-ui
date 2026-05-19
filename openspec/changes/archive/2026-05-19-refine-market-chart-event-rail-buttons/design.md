## Context

The market chart event rail sits below the KLineChart canvas and provides quick access to annotation groups in the currently loaded range. Its current milestone controls are custom rounded chip buttons. They work functionally, but the visual language diverges from the rest of the screen, where toolbar actions and controls are composed from shadcn primitives.

The rail should remain a compact chart-adjacent control, not a separate event panel. Users should primarily inspect events through chart markers and popups, while the bottom rail acts as a secondary navigation aid for scanning available milestones.

## Goals / Non-Goals

**Goals:**

- Make event milestone actions look and behave like Signapse/shadcn controls.
- Use `Button variant="outline"` for individual event milestone actions.
- Keep the rail compact, low-chrome, and visually subordinate to the chart.
- Preserve current annotation selection behavior and keyboard accessibility.
- Keep count badges for grouped milestones without turning every item into a decorated chip.

**Non-Goals:**

- Do not introduce a custom timeline scrubber or mini chart.
- Do not add new event filters, sorting, pagination, route params, or lazy-load behavior.
- Do not change annotation marker rendering, popup content, or backend annotation contract.
- Do not edit shadcn primitives in `@/components/ui/`.
- Do not add dependencies or global theme tokens.

## Decisions

### 1. Compose milestone actions with shadcn `Button`

Use the existing `Button` component with `variant="outline"` for each event milestone action. Use `size="xs"` if the compact rail density needs to stay close to the current chip height.

Rationale: This gives the rail consistent radius, focus ring, hover treatment, disabled behavior, and typography without duplicating button styling.

Alternative considered: keep custom `button` styling and tune radius/colors. Rejected because it continues the bespoke control problem and creates another style surface to review.

### 2. Treat selected milestone as an outlined button state, not a new component

Keep `aria-pressed` for pressed state and apply a narrow local selected treatment on top of the outline button, such as `border-primary bg-primary/5 text-foreground`. Do not turn selected milestones into default/filled primary buttons because the rail is secondary to chart reading.

Rationale: Users need to see the selected milestone, but the control should not compete with the chart markers or popup.

Alternative considered: use `variant="default"` for selected items. Rejected because it over-emphasizes the rail and can make the bottom strip feel like the primary navigation.

### 3. Keep the rail structure simple

Keep a leading status text such as `12 mốc sự kiện` and render milestone actions in a horizontally scrollable trailing row. Loading can keep a compact `Skeleton`, and empty state can remain a single muted text line.

Rationale: This keeps the bottom rail predictable and avoids introducing a heavy timeline model before there is a product requirement for scrubbing or event density analysis.

Alternative considered: replace the rail with a dot timeline. Rejected for this change because it requires more custom layout, interaction mapping, and accessibility work than the current need warrants.

## Risks / Trade-offs

- [Outline buttons may consume slightly more width than custom chips] -> Keep `size="xs"`, horizontal scroll fallback, and short timestamp labels.
- [Selected state may be too subtle] -> Use `aria-pressed` plus a small local selected class; avoid filled primary unless visual review proves the state is unclear.
- [Rail still competes with chart at high event density] -> Keep it horizontally scrollable and secondary; deeper density handling can be a future timeline/scrubber proposal.
- [Badge inside button can feel crowded] -> Only show count badges for grouped milestones and keep the badge secondary.

## Migration Plan

1. Update the event rail milestone map to render `Button variant="outline"` instead of raw custom `button`.
2. Preserve `aria-pressed`, click behavior, event dot, timestamp label, and grouped event count badge.
3. Tune only local layout classes needed for rail density and horizontal scrolling.
4. Run targeted market chart lint, typecheck, build, and OpenSpec validation.
5. Smoke check `/market-charts` with annotations when an authenticated chart session is available.

## Open Questions

- No blocking open questions. The selected direction is `Button variant="outline"` for milestone actions.
