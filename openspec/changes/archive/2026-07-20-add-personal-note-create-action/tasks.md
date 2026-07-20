## 1. Personal Notes Sheet

- [x] 1.1 Add the permission-gated new-note button above the summary list using the existing localized draft label and outline Button chrome.
- [x] 1.2 Add the new-draft transition that flushes the active editor, aborts on failure, invalidates pending detail responses, clears selection, and reuses the existing blank editor initialization.
- [x] 1.3 Render a provisional draft item together with persisted summaries and preserve selected autosave status and Load more behavior.

## 2. Verification

- [x] 2.1 Run the targeted linter for `components/personal-notes-quick-sheet.tsx` and run the TypeScript typecheck.
- [x] 2.2 Run strict OpenSpec validation for `add-personal-note-create-action`.
