## Context

`MarketChartTopToolbar` owns both the Events and Indicators popovers. Events already uses a localized descriptive header and controlled `Switch` fields inside muted `Item` surfaces, while Indicators uses a vertical multiple `ToggleGroup`. Indicator selection is already controlled by `activeIndicators` and routed through `onIndicatorChange` to the existing canvas adapter.

The curated list currently contains ten indicators. Volume is conditionally unavailable, and the toolbar command displays the active indicator count.

## Goals / Non-Goals

**Goals:**

- Align the indicator popover hierarchy and control semantics with Event settings.
- Make every indicator's enabled state immediately readable.
- Preserve keyboard, screen-reader, Volume availability, active-count, and canvas-update behavior.
- Keep the complete list usable within the available viewport.

**Non-Goals:**

- Change indicator calculations, defaults, ordering, or chart rendering.
- Add per-indicator parameters, descriptions, categories, search, persistence, or API calls.
- Extract a shared settings component or alter shadcn wrappers.

## Decisions

### Reuse the Event settings composition

The indicator popover will use `PopoverHeader`, `PopoverTitle`, `PopoverDescription`, and one `Item variant="muted" size="sm"` per indicator. Each item contains a horizontal labeled `Field` and a controlled `Switch`.

This preserves the established visual language without introducing a new component abstraction. Keeping plain technical labels also avoids making a compact ten-item list harder to scan.

### Adapt each switch to the existing array callback

Each switch derives `checked` from `activeIndicators.includes(indicator)`. A change produces the next indicator array and passes it to the existing `onIndicatorChange` callback. The callback, Volume guard, canvas adapter call, error toast, and active-count display remain unchanged.

This is preferred over changing the callback contract because selection state is still naturally represented as one array and the current boundary already handles availability and chart synchronization.

### Preserve unavailable Volume semantics

The Volume switch and its item remain visible but disabled when usable volume data is absent. Its accessible label and disabled state remain available to assistive technology, while the existing guard prevents Volume from remaining active.

### Use localized header copy and viewport-aware overflow

Vietnamese and English dictionaries will provide a settings-oriented title and one purpose description. The popover will retain compact responsive width and constrain vertical overflow to the Radix-reported available height so all ten items remain reachable on short viewports.

## Risks / Trade-offs

- [Ten separate muted surfaces make the popover taller] → Constrain it to available viewport height with vertical scrolling.
- [Array updates could accidentally duplicate an indicator] → Derive the next selection from the curated list or otherwise ensure additions are unique.
- [Replacing toggle items could weaken accessible state labeling] → Associate every switch with a stable `id` and `FieldLabel`, and preserve the disabled Volume state.
- [Visual alignment may drift from Event settings] → Reuse the same Popover, Item, Field, and Switch primitives and sizes already present in the toolbar.
