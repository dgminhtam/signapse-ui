## Context

The dialog surfaces currently use the local shadcn wrapper from `@/components/ui/dialog`, but several close and cancel buttons still close dialogs imperatively through `onOpenChange(false)` or a local close handler. The shadcn example provided by the user composes close-only actions with `DialogClose asChild`, which keeps close behavior inside the dialog primitive while preserving the existing `Button` styling.

The affected dialogs are controlled by parent state because they are opened from existing app flows such as selecting AI models, creating or renaming workspaces, editing a workspace watchlist, and editing role permissions. Controlled `open` and `onOpenChange` remain appropriate for those flows.

## Goals / Non-Goals

**Goals:**

- Use `DialogClose asChild` for dialog footer buttons whose only purpose is to close or cancel the dialog.
- Preserve controlled dialog state where the trigger is outside the dialog component or the dialog is opened after another workflow step.
- Keep default shadcn dialog structure and styling, with only layout-driven `className` overrides where needed.
- Preserve pending states, disabled states, Vietnamese labels, submit/save behavior, model selection, permission selection, and workspace behavior.

**Non-Goals:**

- Do not replace controlled dialogs with uncontrolled `DialogTrigger` flows.
- Do not redesign model picker items, role permission layout, workspace forms, or watchlist content.
- Do not modify backend API contracts, server actions, validation schemas, or global theme tokens.
- Do not edit `components/ui/dialog.tsx` unless implementation reveals a wrapper defect.

## Decisions

### Use `DialogClose asChild` for pure close actions

Close-only footer actions will wrap the existing `Button` with `DialogClose asChild`. This mirrors the shadcn example and lets the dialog primitive drive close behavior through its own context.

Alternative considered: keep `onClick={() => onOpenChange(false)}` because it already works. Rejected because it is more imperative than the shadcn composition pattern and is the exact mismatch called out by the user.

### Keep controlled dialog root where state is owned by the parent flow

Dialogs that receive `open` and `onOpenChange` from parent state will stay controlled. `DialogClose` still works inside a controlled dialog because it requests the root to close through `onOpenChange`.

Alternative considered: add `DialogTrigger asChild` around every opener. Rejected because several openers live outside the dialog component or depend on prior validation/loading state.

### Keep custom handlers only when close has real side effects

If a close/cancel action must perform business logic beyond closing, the implementation may keep a handler. If the side effects are already centralized in the root `onOpenChange`, the footer action should still use `DialogClose asChild` and let the root handler run.

Alternative considered: wrap every cancel button in `DialogClose` unconditionally. Rejected because future dialogs may require explicit confirm/discard logic or non-close side effects.

## Risks / Trade-offs

- **Risk:** A disabled close button wrapped with `DialogClose asChild` may still need to preserve disabled pending behavior. → **Mitigation:** Keep the existing `disabled` prop on the child `Button` for pending or loading states.
- **Risk:** Dialogs with cleanup in custom close handlers could lose cleanup if moved blindly. → **Mitigation:** Check whether cleanup is attached to root `onOpenChange`; only remove direct handlers when behavior remains equivalent.
- **Risk:** Browser smoke may still be blocked by Clerk authentication. → **Mitigation:** Run lint/typecheck and document any unauthenticated smoke-test limitation.
