## Why

News outlet list rows currently render active state as a loose text label, switch, and pending spinner. The pattern is functional, but it feels visually weaker than the compact switch capsule already used in the market chart toolbar and is harder to reuse consistently across dense list tables.

## What Changes

- Refine the news outlet list active control into a compact status capsule inspired by the market chart event switch treatment.
- Keep the row status scan-friendly by placing the state label and switch inside the same stable-width control.
- Preserve accessible switch semantics with per-row `aria-label`, disabled behavior, mutation feedback, and no layout shift while pending.
- Add repo rules for list-table switch controls so other list screens follow the same capsule treatment when a boolean row state is toggled inline.
- Update the news outlet list skeleton to mirror the final switch capsule shape.

## Capabilities

### New Capabilities
- `list-switch-status-capsules`: Covers inline boolean switch controls in list/table rows, including capsule layout, accessible labeling, pending behavior, skeleton matching, and reuse rules.

### Modified Capabilities
- None.

## Impact

- `AGENTS.md`
- `app/(main)/news-outlets/news-outlet-list.tsx`
- `app/(main)/news-outlets/page.tsx`
- No API or dependency changes.
