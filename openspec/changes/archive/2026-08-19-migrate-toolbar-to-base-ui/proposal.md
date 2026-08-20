## Why

The Plate/editor Toolbar is the remaining direct Radix Toolbar integration deliberately excluded from the completed shadcn-wrapper migration. Base UI now provides the Toolbar primitives needed to remove that exception, but the migration must preserve editor workflows, keyboard behavior, and overlay composition rather than becoming a visual redesign.

## What Changes

- Migrate the shared Plate/editor Toolbar and its consumers from `@radix-ui/react-toolbar` to the installed Base UI Toolbar and Toggle APIs.
- Preserve the supported shared Toolbar API and current visual contract while removing unused internal Radix toggle-group exports.
- Preserve disabled-control focus behavior, pressed-state semantics, popup focus return, tooltips, font-size input caret behavior, and fixed/floating/table toolbar workflows.
- Adopt Base UI trigger composition for toolbar dropdowns and popovers; retain the required inverse Tooltip composition.
- Replace the split-list control's nested interactive markup with sibling primary-action and menu-trigger controls.
- Set the fixed toolbar's semantic orientation to vertical while retaining horizontal behavior for floating and table toolbars.
- Remove the direct `@radix-ui/react-toolbar` dependency after the consumer sweep confirms no remaining imports.
- Add an ADR that records the reversal of the prior Toolbar migration exception.

## Capabilities

### New Capabilities

- `base-ui-plate-toolbar-migration`: Defines the Base UI migration boundary and interaction-preservation requirements for the shared Plate/editor Toolbar.

### Modified Capabilities

- `plate-editor-overlay-composition`: Updates shared toolbar tooltip and overlay-trigger composition to use the Base UI Toolbar contract while preserving existing overlay behavior.

## Impact

- Affected code: the shared Toolbar wrapper, its fixed, floating, and table integrations, and toolbar controls that compose dropdowns, popovers, toggles, split actions, or the font-size input.
- Affected dependencies: remove the direct `@radix-ui/react-toolbar` manifest and lockfile entry; `@base-ui/react` is already installed.
- Affected documentation: add a narrow ADR following the existing Base UI migration decision; leave the prior shadcn-wrapper change unchanged.
