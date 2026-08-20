## Context

The shared Plate/editor Toolbar is a custom integration built on the direct `@radix-ui/react-toolbar` dependency. It was intentionally excluded from the prior shadcn wrapper migration because it is not a generated shadcn wrapper. Base UI 1.7.0 now provides the required Toolbar primitives, but its composition model differs in meaningful places: pressed state is modeled through Toggle, ordinary overlay triggers are rendered by the Toolbar button, and disabled controls are focusable by default.

The migration spans the shared wrapper and its fixed, floating, and table integrations. It must preserve existing editor commands, overlay portal behavior, Nova styling, and the public wrapper contract. It also reverses an architectural exception recorded in the prior Base UI ADR, so the decision needs a small follow-up ADR rather than an implicit scope expansion.

## Goals / Non-Goals

**Goals:**

- Replace the direct Radix Toolbar implementation with Base UI's supported Toolbar and Toggle composition.
- Preserve the shared Toolbar API, current visual layout, editor command outcomes, tooltip behavior, and overlay focus behavior.
- Make keyboard semantics explicit: disabled controls are skipped, the fixed toolbar is vertical, and floating/table toolbars remain horizontal.
- Remove invalid nested interactive markup from the split-list control without changing its primary or menu actions.
- Remove the direct Radix Toolbar dependency and document the architectural reversal.

**Non-Goals:**

- Migrating unrelated Radix packages, the primary list toolbar, or non-Plate toolbars.
- Redesigning Toolbar appearance, changing editor commands, or expanding to a broad accessibility remediation.
- Adding a test framework, automated browser-test infrastructure, or a long-lived Radix compatibility layer.
- Changing generated shadcn dropdown-menu or tooltip wrapper sources.

## Decisions

### Keep a dedicated Plate/editor Toolbar migration boundary

The Toolbar migration is a separate change from the shadcn wrapper migration and gets a narrow ADR. This preserves the previous change's audit trail while recording why the former exception is now safe to reverse.

Alternatives considered:

- Expand the existing shadcn-wrapper change: rejected because its approved scope explicitly excludes this custom editor integration.
- Leave the exception indefinitely: rejected because Base UI now has a supported Toolbar mapping and the direct dependency would remain without a technical need.

### Preserve the shared wrapper API while replacing its primitive implementation

The shared Toolbar surface remains the consumer boundary. Base UI Toolbar Root, Group, Button, Link, Separator, Toggle, and ToggleGroup provide the underlying behavior; consumers only change where their composition is no longer valid. Unused internal one-item toggle-group exports are removed rather than retained as a compatibility layer.

Alternatives considered:

- Expose raw Base UI primitive contracts to every consumer: rejected because the stable shared surface already provides a narrow integration boundary.
- Recreate Radix APIs in an adapter: rejected because it would retain an obsolete primitive model and hide Base UI semantics.

### Model pressed controls as individual controlled Toggles

The existing `pressed` contract remains. Each independently pressed control uses a Base UI Toggle rendered through the Toolbar button, producing `aria-pressed` and pressed-state styling. ToggleGroup is reserved for genuinely mutually exclusive sibling controls, not a single-item wrapper.

### Preserve Radix-compatible disabled focus behavior

Toolbar controls opt out of Base UI's default disabled focusability. This retains the current roving-focus behavior in which disabled controls are skipped by arrow-key navigation.

### Use Base UI's supported overlay composition direction

Dropdown and Popover triggers render inside a Toolbar button, so the toolbar remains the composite owner. Tooltip is the deliberate exception: the tooltip trigger renders the toolbar button. Existing local overlay wrappers continue to own portal placement, menu content, and tooltip surface behavior.

### Separate split actions and preserve the font-size input exception

The split-list control becomes sibling primary-action and menu-trigger controls, visually grouped but never nested as interactive descendants. The font-size input remains outside the roving-focus composite so Left and Right retain native caret behavior at its current visual position.

### Align toolbar orientation with layout

The fixed Toolbar explicitly declares vertical orientation, making Up and Down navigation match its column layout. Floating and table toolbars retain horizontal orientation and Left/Right navigation.

### Verify at the shared wrapper boundary without adding infrastructure

Verification targets observable behavior through the shared Toolbar as used by fixed, floating, and table integrations. The repository has no existing Toolbar test runner or covering test seam, so the change relies on typecheck, lint, static dependency/import checks, and a user-owned browser QA matrix rather than introducing new test infrastructure.

## Risks / Trade-offs

- [Overlay trigger composition can regress opening, dismissal, or focus return] → Convert every ordinary Toolbar dropdown/popover trigger consistently and verify Escape, selection, and focus restoration in browser QA.
- [Base UI state attributes differ from Radix attributes] → Update toolbar pressed selectors as part of the primitive conversion and verify active formatting/menu states.
- [The split-list correction can change event propagation] → Preserve the primary and secondary action contracts while testing each action independently.
- [The font-size input can conflict with roving navigation] → Keep it outside the composite and verify caret arrows, Tab order, and popover behavior.
- [Dependency cleanup can remove an indirect requirement] → Remove only the direct Toolbar dependency after static source and package-lock verification; leave other Radix dependencies untouched.

## Migration Plan

1. Record the direct Toolbar import and consumer inventory, then replace the shared primitive mapping and pressed-state styling.
2. Update ordinary overlay trigger composition, the split-list control, and the font-size input boundary in the affected consumers.
3. Apply explicit orientation at fixed, floating, and table integration boundaries.
4. Remove unused internal helpers and the direct dependency only after the consumer/import sweep is clean.
5. Add the ADR, run deterministic checks, and complete the focused browser QA matrix.

If a behavior regression is found, revert the Toolbar change as one unit and restore the direct dependency; do not retain a permanent compatibility layer.

## Open Questions

None. Product, compatibility, keyboard, overlay, input, scope, and verification decisions were resolved during the requirements grill.
