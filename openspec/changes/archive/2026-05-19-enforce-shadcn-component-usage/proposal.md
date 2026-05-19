## Why

Several interactive UI surfaces compose Radix primitives directly instead of using shadcn/ui wrappers, which creates inconsistent overlay behavior and bypasses the project's component guidance. This is visible in the AI provider model picker where the backdrop can visually blur the dialog content instead of only dimming the surrounding page.

## What Changes

- Add a repo-wide requirement that feature and shared app code use shadcn/ui components from `@/components/ui/` instead of importing primitive libraries directly when a shadcn component exists or can be added.
- Add the missing shadcn `Dialog` component to `@/components/ui/` through the shadcn workflow, then refactor modal dialog usages to import `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, and `DialogClose` from `@/components/ui/dialog`.
- Refactor the AI provider model picker dialog to use shadcn Dialog composition so content stacks above the overlay and keeps the modal crisp while only the surrounding page is dimmed or blurred.
- Audit and migrate existing direct `DialogPrimitive` usages in app/shared code, including workspace switcher, workspace watchlist editor, and role permission dialog, while keeping shadcn wrapper internals inside `components/ui` as the only place primitive imports are allowed.
- Update `AGENTS.md` with an explicit rule: use shadcn components only, do not use underlying primitive libraries directly in feature/app code, do not install outside UI libraries without explicit approval/proposal, and consult the local `shadcn` skill before adding, fixing, debugging, styling, or composing shadcn components.
- Keep destructive confirmations on `AlertDialog`, side panels on `Sheet` or `Drawer`, and ordinary modal selection/editing flows on `Dialog`.

## Capabilities

### New Capabilities
- `shadcn-component-usage`: Governs how app and feature UI surfaces select, add, and compose shadcn/ui components instead of primitive or external UI libraries.

### Modified Capabilities
- None.

## Impact

- Affected guidance: `AGENTS.md`
- Affected shadcn component inventory: `components/ui/dialog.tsx` added if absent
- Affected feature/shared code: AI provider model picker dialog, workspace switcher dialog, workspace watchlist editor dialog, role permission dialog
- Verification: shadcn docs/skill review, TypeScript check, targeted lint for touched files, and UI smoke check for model picker overlay behavior
