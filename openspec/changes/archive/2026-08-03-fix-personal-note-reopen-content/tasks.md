## 1. Persisted Remount Snapshot

- [x] 1.1 Update successful personal-note save handling to retain `note.content` in `editorInitialValue` alongside the returned id and summary metadata, without changing the live Plate value or adding a detail request.

## 2. Verification

- [x] 2.1 Run focused lint for the Personal Notes Sheet and run the project typecheck.
- [x] 2.2 Run strict OpenSpec validation and statically verify that the cached reopen path uses the successful mutation snapshot without an extra detail fetch.
