## 1. Audit Dialog Close Actions

- [x] 1.1 Review affected dialog files and identify close/cancel/dismiss buttons that only close the dialog.
- [x] 1.2 Confirm which dialogs must remain controlled because their open state is owned by parent workflow state.
- [x] 1.3 Confirm whether any close/cancel button has side effects that cannot be handled by root `onOpenChange`.

## 2. Implement Shadcn Composition

- [x] 2.1 Import `DialogClose` from `@/components/ui/dialog` in affected dialog files that need pure close actions.
- [x] 2.2 Wrap pure close/cancel footer buttons with `DialogClose asChild` and keep the existing `Button` variant, disabled state, type, label, and spinner behavior.
- [x] 2.3 Remove direct `onOpenChange(false)` or equivalent close-only handlers from buttons converted to `DialogClose asChild`.
- [x] 2.4 Keep manual close handlers only where the action performs required behavior beyond closing and document the reason through clear surrounding code.

## 3. Verification

- [x] 3.1 Run targeted lint or typecheck for touched dialog files.
- [x] 3.2 Verify dialog composition still includes `DialogTitle` and uses `DialogFooter` without legacy custom footer layout.
- [x] 3.3 Smoke test affected dialogs when an authenticated local session is available; otherwise document the auth limitation. Authenticated browser smoke was not available in this session, so verification used static composition checks plus lint/typecheck.
