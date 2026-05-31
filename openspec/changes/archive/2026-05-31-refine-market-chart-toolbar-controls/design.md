## Context

The market chart toolbar now lives inside the chart surface and includes asset selection, timeframe toggles, annotation visibility, indicator, screenshot, and fullscreen commands. The remaining issue is polish-level but user-visible: the timeframe control can appear clipped at its rounded edge, and toolbar commands still read slightly larger than the dense chart-workbench direction.

Relevant constraints:

- Use existing shadcn wrappers and built-in variants/sizes before adding custom chrome.
- Keep chart behavior, route state, watchlist-only asset selection, and command availability unchanged.
- Icons inside buttons and toggles must use `data-icon="inline-start"` and rely on wrapper sizing.
- Avoid page-level horizontal overflow; any timeframe overflow must remain contained within the toolbar.

## Goals / Non-Goals

**Goals:**

- Preserve the rounded-corner visual treatment of timeframe controls even inside the overflow container.
- Align toolbar commands to the smallest practical common shadcn size.
- Add an event/annotation icon so the event toggle matches neighboring icon-led commands.
- Keep skeleton cues aligned with the compact toolbar when necessary.

**Non-Goals:**

- Do not change market chart API calls, lazy loading, annotation mapping, indicator behavior, screenshot behavior, or fullscreen behavior.
- Do not add new chart commands or drawing tools.
- Do not introduce custom component chrome or new shared toolbar primitives.
- Do not change the watchlist-only asset selector treatment.

## Decisions

### Use shadcn compact sizes instead of custom height classes

Set toolbar actions to built-in compact sizes where supported, using `size="sm"` for `Toggle`, `ToggleGroup`, and text command `Button` controls.

Rationale: `Toggle` exposes `sm` as its smallest size, while `Button` also has `xs`. Using `sm` across toolbar controls keeps height, radius, icon sizing, and typography consistent without manually overriding primitive chrome.

Alternative considered: use `Button size="xs"` for all button commands. This would make buttons smaller than the annotation `Toggle`, causing a second density mismatch.

### Fix clipped corners at the overflow boundary

Keep timeframe overflow local to the timeframe wrapper, but add minimal layout-only breathing room around the toggle group so focus rings and rounded borders are not clipped by the scroll container edge.

Rationale: the issue is visual clipping from containment, not a need for new styling tokens. A tiny wrapper inset is less invasive than overriding `ToggleGroupItem` radius logic.

Alternative considered: replace `ToggleGroup` with standalone `Toggle` controls in a manual radio group. That remains a fallback if shadcn group composition continues to clip, but the first pass should preserve the standard `ToggleGroup` pattern.

### Add an event icon through existing icon conventions

Use an inline-start Lucide icon on the event/annotation toggle, without explicit icon sizing classes.

Rationale: other toolbar commands are icon-led. The event toggle should scan as a command in the same cluster while retaining its pressed state semantics.

Alternative considered: keep the event toggle text-only. That preserves current behavior but makes it feel visually unrelated to indicator, screenshot, and fullscreen commands.

## Risks / Trade-offs

- Compact controls may feel dense on touch devices -> Mitigate by using shadcn `sm` rather than custom extra-small heights and preserving wrapping/overflow behavior.
- Wrapper padding could slightly change toolbar measurements -> Mitigate by using minimal layout-only inset and checking skeleton alignment.
- Event icon choice can affect perceived meaning -> Mitigate by choosing a neutral event/time icon rather than a status or alert icon.
