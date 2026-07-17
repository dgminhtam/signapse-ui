## Context

The Plate editor toolbar is composed from shared files under `components/ui/`. Eleven files already render shadcn dropdown-menu components but retain direct Radix imports for prop types or item indicators, while `toolbar.tsx` imports the Radix tooltip namespace to build a local content component. Because the direct dropdown package is not declared, the editor route fails module resolution; both current shadcn wrappers are already installed and match the `radix-nova` registry versions.

The shared toolbar tooltip is used by many Plate buttons, so its migration must preserve the established opt-in behavior, client mount guard, trigger composition, placement, and caller-provided props. The dropdown radio-item migration must account for the indicator that the current wrapper already renders.

## Goals / Non-Goals

**Goals:**

- Route Plate dropdown-menu and tooltip composition through the existing shadcn wrappers.
- Remove all Plate overlay imports from `@radix-ui/react-dropdown-menu` and `@radix-ui/react-tooltip`.
- Preserve existing menu interactions and shared tooltip API behavior.
- Adopt the wrapper's standard radio indicator and tooltip chrome without duplicating either locally.
- Complete the migration without changing dependency manifests or generated wrappers.

**Non-Goals:**

- Fix `initialFocus`/`autoFocus` in `date-node.tsx` or any other Plate integration error.
- Change `@radix-ui/react-toolbar` usage.
- Regenerate or customize `components/ui/dropdown-menu.tsx` or `components/ui/tooltip.tsx`.
- Add or remove packages, update lockfiles, or change the shadcn preset/theme.
- Clean up editor localization, routes, menu grouping, or unrelated toolbar composition.

## Decisions

### 1. Use wrapper-derived component prop types

Dropdown roots and items will use `React.ComponentProps<typeof DropdownMenu>` and `React.ComponentProps<typeof DropdownMenuItem>` instead of types imported from the primitive package. This keeps runtime and type contracts anchored to the same local wrapper API.

Alternative considered: add the missing Radix package so the existing type imports resolve. This would preserve direct primitive coupling, conflict with the repository's shadcn-only composition contract, and add a dependency that the installed wrapper already encapsulates.

### 2. Let `DropdownMenuRadioItem` own its indicator

The three radio-menu consumers will remove direct `DropdownMenuItemIndicator` imports, local `CheckIcon` indicators, duplicate indicator helpers, and CSS selectors that hide the wrapper's first indicator. The current wrapper already renders the standard positioned check indicator, so consumers only retain layout constraints such as menu width.

Alternative considered: preserve the custom indicator and hide the wrapper indicator. That duplicates wrapper behavior and is fragile when shadcn updates its internal markup or styling.

### 3. Replace the local tooltip content primitive with the wrapper content

`toolbar.tsx` will import `TooltipContent` from `@/components/ui/tooltip` and remove its local Radix-based content implementation. The toolbar keeps `Tooltip`, `TooltipTrigger asChild`, `withTooltip`, the mount guard, and all existing tooltip/root props. It supplies `sideOffset={4}` before spreading `tooltipContentProps`, preserving the old default while allowing callers to override it.

This intentionally adopts the wrapper's standard content surface, animation, and arrow. Recreating the old local content with primitive parts was rejected because it would continue bypassing the wrapper and duplicate its chrome.

### 4. Keep wrappers and dependency files immutable in this change

The installed dropdown-menu and tooltip wrappers are already identical to current registry output, so implementation only updates consumers. No package manifest or lockfile edit is necessary because consumers stop referencing undeclared primitive packages directly.

## Risks / Trade-offs

- [Tooltip visuals change to the standard wrapper surface and arrow] → Treat this as the intended convergence on `radix-nova`; preserve behavioral props and verify the shared composition statically and through user-owned manual QA.
- [Removing custom radio markup could remove the visible selected state if a consumer is not using `DropdownMenuRadioItem`] → Limit indicator removal to the three confirmed radio-item consumers and verify each uses the wrapper radio item.
- [Shared toolbar changes can affect many editor buttons] → Keep its public props and mount/trigger structure unchanged, then run targeted lint and type checking.
- [Repository typecheck remains nonzero because of the excluded date-node error] → Compare against the known baseline and require that the two overlay module-resolution errors disappear with no new errors.

## Migration Plan

1. Replace direct dropdown prop-type imports with wrapper-derived component props in the seven root-only consumers and the font-color consumer.
2. Simplify the three radio-menu consumers to the wrapper's built-in indicator and remove obsolete icons/selectors.
3. Replace the local tooltip content implementation in `toolbar.tsx` with the existing wrapper export.
4. Run static import checks, targeted lint, typecheck baseline comparison, shadcn dry-run verification, and diff validation.

Rollback is a source revert of the twelve consumer files; there is no data, configuration, or dependency migration.

## Open Questions

None. The wrapper versions, affected consumers, preserved tooltip defaults, and excluded date-node work are already defined.
