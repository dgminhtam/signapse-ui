## Why

Plate editor toolbar code currently imports Radix dropdown-menu and tooltip primitives directly even though the project already provides current `radix-nova` shadcn wrappers for both overlays. This bypasses the repository's shadcn composition contract and currently causes the editor build to fail when the undeclared Radix dropdown-menu package cannot be resolved.

## What Changes

- Replace direct Plate toolbar imports from `@radix-ui/react-dropdown-menu` with the existing `@/components/ui/dropdown-menu` wrapper and wrapper-derived prop types.
- Replace the toolbar's direct Radix tooltip content composition with `TooltipContent` from `@/components/ui/tooltip` while preserving the existing trigger, mount guard, placement default, and caller overrides.
- Remove duplicate radio-item indicator markup so dropdown radio items render exactly one indicator supplied by the shadcn wrapper.
- Keep both installed wrappers unchanged and add no direct Radix overlay dependency.
- Explicitly exclude the unrelated `date-node.tsx` `initialFocus`/`autoFocus` error from this change.

## Capabilities

### New Capabilities

- `plate-editor-overlay-composition`: Defines how Plate editor dropdown menus and tooltips consume the existing shadcn wrappers while preserving overlay behavior and standard indicator chrome.

### Modified Capabilities

None.

## Impact

- Affects eleven Plate dropdown-menu consumers under `components/ui/` and the shared Plate toolbar tooltip composition in `components/ui/toolbar.tsx`.
- Indirectly affects every Plate toolbar button that opts into the shared tooltip behavior, including the localized editor route.
- Does not change wrapper source files, public APIs, package dependencies, lockfiles, `@radix-ui/react-toolbar` usage, or date-node focus handling.
