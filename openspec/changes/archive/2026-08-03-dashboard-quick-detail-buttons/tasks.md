## 1. Dashboard trigger implementation

- [x] 1.1 Rename the shared dashboard quick-detail trigger to `DashboardQuickDetailButton` and render a native `button type="button"` that opens the existing local drawer state.
- [x] 1.2 Update Event Timeline and Latest News rows to use the button trigger and remove their per-row canonical `href` props.

## 2. Contract and verification

- [x] 2.1 Keep the drawer full-page `LocalizedLink` action unchanged and verify no Graph View or Market Charts trigger changes.
- [x] 2.2 Run OpenSpec validation, lint, typecheck, and a static search for stale dashboard link-trigger references.

User-owned manual QA: click and keyboard-activate Event Timeline and Latest News rows; verify drawer open/close, focus return, no top loading bar, and full-page drawer actions.
