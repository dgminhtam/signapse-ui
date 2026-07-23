## 1. Popover Composition

- [x] 1.1 Update the shared shadcn `PopoverContent` to portal into the nearest overlay container and retain the default body portal otherwise.
- [x] 1.2 Migrate the Plate emoji Popover to the local shadcn wrapper while preserving controlled open state, picker dimensions, and single-layer wrapper chrome.

## 2. Verification

- [x] 2.1 Run the repository typecheck and lint checks for the Popover and emoji picker changes.
- [x] 2.2 Run OpenSpec validation and static searches confirming the emoji picker no longer imports Radix Popover directly or owns duplicate Popover surface chrome.

User-owned manual QA: select an emoji inside Personal Notes and on `/editor`, and confirm the Sheet remains modal while the picker follows close-on-select behavior.
