## 1. Audit

- [x] 1.1 Review current dialog usages and classify each `className` as shell styling or required content layout.
- [x] 1.2 Recheck shadcn Dialog docs/skill guidance before editing so defaults and allowed layout overrides are clear.

## 2. Dialog Style Cleanup

- [x] 2.1 Simplify the AI provider model picker dialog to use default shadcn chrome, removing manual close/header/footer shell styling while preserving width and list scroll layout.
- [x] 2.2 Simplify the workspace create/rename dialog to use default shadcn chrome with minimal width override only if needed.
- [x] 2.3 Simplify the workspace watchlist editor dialog to use default shadcn chrome while preserving watchlist loading, permission, save, and pending-close behavior.
- [x] 2.4 Simplify the role permission dialog to remove legacy shell styling while retaining only dense-editor layout overrides such as width, max-height, flex, and body overflow.

## 3. Guardrail Review

- [x] 3.1 Confirm target dialog usages no longer use `p-0`, `gap-0`, manual header/footer borders, custom dialog shadows, custom header backgrounds, or title typography overrides unless justified as layout.
- [x] 3.2 Confirm `DialogContent` uses the default close button everywhere it is sufficient, with any custom close behavior documented by pending-state requirements.

## 4. Verification

- [x] 4.1 Run targeted formatting for the touched dialog files.
- [x] 4.2 Run TypeScript checking.
- [x] 4.3 Run targeted lint for the touched dialog files.
- [x] 4.4 Run `openspec validate prefer-default-shadcn-dialog-styles --strict`.
- [x] 4.5 Attempt browser smoke for the AI provider model picker if an authenticated local session is available; otherwise document the auth blocker.
