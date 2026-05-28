## 1. Drawing Tool Group

- [x] 1.1 Update the drawing tool `ToggleGroup` to use `type="single"`, `orientation="vertical"`, and `spacing={1}`.
- [x] 1.2 Preserve existing active tool mapping so selecting a valid tool activates it and clearing/invalid values clear the active tool.
- [x] 1.3 Avoid custom wrapper markup or manual radius/spacing classes for drawing tool item separation.

## 2. Drawing State Group

- [x] 2.1 Replace standalone magnet, lock, and visibility `Toggle` controls with a controlled `ToggleGroup type="multiple"` using `orientation="vertical"` and `spacing={1}`.
- [x] 2.2 Derive ToggleGroup values from `isMagnetEnabled`, `isLocked`, and `isVisible`.
- [x] 2.3 Map ToggleGroup value changes back into a single drawing state patch without changing the active drawing tool.
- [x] 2.4 Preserve current tooltip and `aria-label` copy for magnet, lock/unlock, and show/hide states.

## 3. Delete Action Section

- [x] 3.1 Keep delete selected and clear all as action buttons outside ToggleGroups.
- [x] 3.2 Change selected-delete and clear-all icons so they are visually distinguishable.
- [x] 3.3 Preserve selected-delete disabled behavior and clear-all AlertDialog confirmation behavior.

## 4. Review And Verification

- [x] 4.1 Run static search or deterministic review to confirm no new primitive imports, custom wrapper divs for spacing, or global shadcn wrapper/theme changes were introduced.
- [x] 4.2 Run `openspec validate polish-market-chart-drawing-toolbar-groups --strict`.
- [x] 4.3 Run `pnpm typecheck`.
- [x] 4.4 Run `pnpm lint`.

User-owned manual QA note: after implementation, open `/vi/market-charts`, confirm drawing tools are visually separated, magnet/lock/visibility behave independently, delete selected differs from clear all, and clear all still asks for confirmation.
