## 1. Adopt Dropdown Wrapper Types

- [x] 1.1 Remove direct Radix dropdown prop-type imports from `align-toolbar-button.tsx`, `export-toolbar-button.tsx`, `import-toolbar-button.tsx`, `insert-toolbar-button.tsx`, `media-toolbar-button.tsx`, `more-toolbar-button.tsx`, and `table-toolbar-button.tsx`, and derive root props from the local `DropdownMenu` wrapper.
- [x] 1.2 Replace direct Radix root and item prop types in `font-color-toolbar-button.tsx` with `React.ComponentProps` derived from the local `DropdownMenu` and `DropdownMenuItem` wrappers.

## 2. Adopt Standard Radio Indicators

- [x] 2.1 Update `line-height-toolbar-button.tsx`, `mode-toolbar-button.tsx`, and `turn-into-toolbar-button.tsx` to use the `DropdownMenuRadioItem` wrapper's built-in indicator, removing direct primitive imports, duplicate check markup/helpers, obsolete icons, and indicator-hiding chrome while retaining layout constraints.

## 3. Adopt Shared Tooltip Wrapper

- [x] 3.1 Update `toolbar.tsx` to use `TooltipContent` from `@/components/ui/tooltip` and delete the local Radix tooltip content component while preserving the mount guard, `withTooltip`, `TooltipTrigger asChild`, root props, and caller-overridable `sideOffset={4}` default.

## 4. Verify Migration

- [x] 4.1 Run `rg -n "@radix-ui/react-(dropdown-menu|tooltip)" components/ui` and confirm no direct dropdown-menu or tooltip imports remain while unrelated `@radix-ui/react-toolbar` usage is unchanged.
- [x] 4.2 Run ESLint for the twelve changed Plate consumer files and resolve every introduced finding.

  Verification note: targeted ESLint found no migration-introduced issue; it still reports the pre-existing `react-hooks/refs` error at `font-color-toolbar-button.tsx:428` and an unused-disable warning at line 180, both outside this change's edited regions.
- [x] 4.3 Run `pnpm.cmd typecheck` and confirm the overlay `TS2307` module-resolution errors are gone with no new errors; the separately tracked `date-node.tsx` focus-prop error may remain as the documented baseline exception.

  Verification note: typecheck now reports only the explicitly excluded `date-node.tsx:71` `initialFocus` error; no overlay `TS2307` errors or new errors remain.
- [x] 4.4 Run `pnpm.cmd dlx shadcn@latest add dropdown-menu tooltip --dry-run` and confirm both installed wrapper files remain identical to current registry output.
- [x] 4.5 Run `git diff --check` and review the scoped diff to confirm no wrapper source, package manifest, lockfile, date-node, or unrelated toolbar changes were introduced.

  Verification note: `git diff --check` passed. The working tree already contained user-owned changes to `app/globals.css`, `components.json`, `package.json`, and `pnpm-lock.yaml`; this migration did not edit those files, either wrapper, or `date-node.tsx`.

## User-owned manual QA

After the separate date-node focus error no longer blocks the editor route, verify `/vi/editor`: open dropdowns with Enter/Space, navigate with arrow keys, select an item, close with Escape and confirm focus restoration; confirm radio menus show exactly one check; and confirm shared tooltips appear on hover and keyboard focus with the standard arrow and expected placement. This QA is not an archive-blocking checkbox for this change.
