## 1. Extend shared portal boundaries

- [ ] 1.1 Update `components/ui/select.tsx` so `SelectContent` resolves the nearest overlay host and preserves the default body portal when no host exists.
- [ ] 1.2 Update `components/ui/tooltip.tsx` so `TooltipContent` resolves the nearest overlay host with unchanged fallback and content behavior.
- [ ] 1.3 Update `components/ui/drawer.tsx` so Drawer/Vaul portal placement uses the nearest host, preserves explicit primitive container props when supplied, and keeps the existing Drawer composition API.
- [ ] 1.4 Update `components/ui/inline-combobox.tsx` so `InlineComboboxContent` passes the nearest host through Ariakit's `portalElement` API while preserving filtering, keyboard navigation, selection, and editor focus behavior.
- [ ] 1.5 Audit ContextMenu and other portal-based descendants for callers below the market chart or Personal Notes fullscreen boundaries; add host support only for a confirmed affected caller and record unchanged wrappers when no caller exists.

## 2. Contain market chart fullscreen overlays

- [ ] 2.1 Capture the market chart `ChartSurface` element with callback-ref/state lifecycle and provide it through the existing `OverlayPortalContainerProvider`.
- [ ] 2.2 Ensure the provider scope covers chart toolbar, canvas, drawing toolbar, annotation controls, and local entity quick-detail content so their existing Popover, Select, Tooltip, DropdownMenu, Dialog, AlertDialog, and Drawer portals target the fullscreen surface.
- [ ] 2.3 Preserve the existing Personal Notes Sheet provider and verify nested providers still resolve to the nearest host rather than leaking overlays to the outer surface.

## 3. Repository verification

- [ ] 3.1 Run targeted source checks confirming every affected wrapper consumes the shared host hook, the chart boundary provides the host, and no speculative ContextMenu change was introduced without a fullscreen caller.
- [ ] 3.2 Run `pnpm format` and inspect the resulting diff for unrelated changes.
- [ ] 3.3 Run `pnpm lint` and `pnpm typecheck`.
- [ ] 3.4 Run OpenSpec validation for `fix-fullscreen-overlay-portals` and confirm all required artifacts and task checkboxes are recognized.

User-owned manual QA: verify market chart and Personal Notes in normal and browser fullscreen modes, including toolbar/canvas overlays, quick detail, Plate comboboxes, nested overlays, focus return, Escape/outside dismissal, scrolling, and responsive placement.
