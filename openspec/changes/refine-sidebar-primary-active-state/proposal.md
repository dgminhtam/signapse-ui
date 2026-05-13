## Why

Sidebar navigation needs a stronger current-page signal, but the current dark `--sidebar-primary` token is the shadcn sidebar default blue/purple value and feels unrelated to Signapse's neutral visual baseline. This change makes active navigation more legible while keeping sidebar tokens neutral-consistent and preserving accessible focus behavior.

## What Changes

- Normalize `--sidebar-primary` and `--sidebar-primary-foreground` so sidebar primary remains consistent with the project's shadcn neutral baseline in both light and dark modes.
- Use `sidebar-primary` / `sidebar-primary-foreground` only for the item that represents the current page.
- Keep hover treatment on `sidebar-accent` / `sidebar-accent-foreground` so hover remains light feedback and does not compete with active state.
- Keep focus-visible treatment on `sidebar-ring`; do not mix keyboard focus with selected/current state color.
- Keep expanded parent treatment on `sidebar-accent` so an opened group reads as context, not as the current page.
- When a parent contains the active child, keep the parent as contextual emphasis with `sidebar-accent`, stronger font/chevron treatment, and no `sidebar-primary` background.
- Preserve existing sidebar density, radius, child indentation, child width expansion, and `py-1` child-list spacing.
- Update `AGENTS.md` sidebar guidance to document the finalized state hierarchy.
- Do not edit shadcn primitives in `components/ui/`.

## Capabilities

### New Capabilities
- `sidebar-navigation-hierarchy`: Defines Signapse sidebar token ownership, current-page active treatment, parent/context treatment, hover, and focus-visible behavior.

### Modified Capabilities

## Impact

- Affected code: `app/globals.css`, `components/app-sidebar.tsx`.
- Affected guidance: `AGENTS.md`.
- Affected specs: new `sidebar-navigation-hierarchy` capability.
- APIs/dependencies: none.
