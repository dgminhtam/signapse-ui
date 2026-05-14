## Why

The dialog refactor moved modal flows onto the shadcn `Dialog` wrapper, but the usages still carry much of the old hand-built shell styling. This keeps the UI visually tied to the previous custom implementation and conflicts with the shadcn guidance to use component defaults first, with `className` reserved mainly for layout.

## What Changes

- Prefer default shadcn `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, and built-in close button styling across the dialog surfaces touched by the shadcn Dialog migration.
- Remove legacy shell overrides such as `p-0`, `gap-0`, custom header/footer borders, custom dialog shadows, custom header backgrounds, manual close button rows, and repeated title/description typography when the shadcn default already provides the treatment.
- Keep only layout-driven overrides that are necessary for the dialog's content, such as modal width, maximum height, flex layout for scrollable dense dialogs, and body overflow behavior.
- Apply the cleanup to the AI provider model picker, workspace create/rename dialog, workspace watchlist editor, and role permission dialog.
- Preserve all business behavior, data flow, pending states, validation, Vietnamese copy, and existing user actions.
- Do not change global theme tokens or shadcn wrapper defaults unless a wrapper bug is discovered.

## Capabilities

### New Capabilities
- `default-shadcn-dialog-styling`: Governs how dialog feature usages prioritize shadcn default styling and limit overrides to layout-only needs.

### Modified Capabilities
- None.

## Impact

- Affected feature/shared UI:
  - `app/(main)/ai-provider-configs/ai-provider-model-picker-dialog.tsx`
  - `components/workspace-switcher.tsx`
  - `components/workspace-watchlist-editor.tsx`
  - `app/(main)/roles/role-permission-dialog.tsx`
- Affected active change context: builds on `enforce-shadcn-component-usage` but remains scoped to style cleanup.
- Verification: targeted lint/typecheck and code review for reduced styling overrides; browser smoke remains dependent on authenticated access.
