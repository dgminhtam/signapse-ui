## 1. Unify Image URL insertion

- [x] 1.1 Extract the existing controlled media URL dialog from `MediaToolbarButton` as a reusable local export while preserving the fixed toolbar trigger and validated `img` insertion behavior.
- [x] 1.2 Route Insert → Image to the shared dialog outside the dropdown content, close the menu without refocusing the editor, and leave every non-Image Insert action unchanged.
- [x] 1.3 Remove the unused `insertMedia` import and `KEYS.img` branch from the shared block transform after confirming no application caller depends on that prompt-capable path.

## 2. Replace native comment alerts

- [x] 2.1 Add one matching Vietnamese and English editor comment dictionary message for the missing-ID retry failure.
- [x] 2.2 Replace both missing-comment-ID `alert()` guards with `toast.error()` using the localized message while preserving their early-return behavior.

## 3. Verify native browser dialogs are unreachable

- [x] 3.1 Run static searches confirming application source contains no native `prompt()`, `alert()`, or `confirm()` calls and no call to Plate's `insertMedia()` prompt path.
- [x] 3.2 Run scoped lint for the affected editor, toolbar, comment, and dictionary files, then run `pnpm typecheck`.
- [x] 3.3 Run `pnpm build`, strict OpenSpec validation for `remove-editor-native-browser-dialogs`, and `git diff --check`.
