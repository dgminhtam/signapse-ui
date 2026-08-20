## 1. Shared Toolbar foundation

- [x] 1.1 Replace the shared Plate/editor Toolbar's direct Radix primitive mapping with Base UI Toolbar primitives while preserving supported wrapper props and Nova styling.
- [x] 1.2 Preserve the `pressed` contract with Base UI Toggle, migrate active-state selectors, skip disabled controls in roving focus, and remove unused internal toggle-group helpers.
- [x] 1.3 Declare vertical orientation at the fixed Toolbar boundary and retain horizontal orientation at floating and table Toolbar boundaries.

## 2. Toolbar consumer composition

- [x] 2.1 Convert affected Toolbar dropdown and popover triggers to the supported Base UI Toolbar-button composition while preserving existing overlay wrappers, outcomes, and focus return.
- [x] 2.2 Preserve Tooltip's inverse composition through the local Tooltip wrapper and the Base UI Toolbar button.
- [x] 2.3 Refactor the split-list control into visually grouped sibling primary-action and menu-trigger controls without nested interactive markup.
- [x] 2.4 Keep the font-size input outside roving focus and preserve its native caret, Tab, and popover behavior.

## 3. Dependency and migration-record cleanup

- [x] 3.1 Sweep Toolbar consumers and remove the direct `@radix-ui/react-toolbar` dependency from the manifest and lockfile once no source imports remain.
- [x] 3.2 Update the active migration record with the Toolbar scope, dependency cleanup, intentional exceptions, and deterministic verification results without rewriting the historical shadcn-wrapper scope.

## 4. Verification

- [x] 4.1 Run TypeScript type checking and resolve migration-related errors.
- [x] 4.2 Run linting and resolve migration-related errors.
- [x] 4.3 Run a static source and dependency sweep confirming no direct Radix Toolbar imports or manifest dependency remain.
- [x] 4.4 Validate the OpenSpec change in strict mode.

User-owned manual QA (not archive-blocking): verify fixed-toolbar Up/Down navigation; floating and table Toolbar Left/Right navigation; disabled controls skipped by roving focus; pressed state; dropdown, popover, and tooltip behavior; Escape and focus return; split-list primary and menu actions; font-size caret and Tab behavior; and visual parity.
