## 1. Popup Composition

- [x] 1.1 Import and use `ScrollArea` from `@/components/ui/scroll-area` in the market chart workbench.
- [x] 1.2 Refactor `renderAnnotationPopup()` so the shared header uses `PopoverHeader` and `PopoverTitle`.
- [x] 1.3 Replace the popup body's native `overflow-y-auto` container with `ScrollArea` while keeping the existing max-height behavior.
- [x] 1.4 Keep annotation group count, group color, close action, event opening, mobile fallback, and outcome rendering logic unchanged.

## 2. Verification

- [x] 2.1 Run `openspec.cmd validate standardize-market-chart-annotation-popover --strict`.
- [x] 2.2 Run `pnpm.cmd typecheck`.
- [x] 2.3 Run `pnpm.cmd lint`.
- [x] 2.4 Static-check that the desktop annotation popup no longer uses `PopoverContent` padding override `p-0` or native `overflow-y-auto` for the popup body.
