## 1. Root Guidance Consolidation

- [x] 1.1 Add scoped instruction routing to `AGENTS.md` and `AGENTS.vi.md` for API, library, UI, and cross-domain tasks.
- [x] 1.2 Correct architecture, feature-tree, and page-layout paths to use `app/[lang]/(main)` and `app/[lang]/(auth)` in both root files.
- [x] 1.3 Remove root rules that have equivalent or stronger scoped coverage while retaining unmatched feature, UI, quick-detail, sidebar, content, validation, contract, and review constraints.
- [x] 1.4 Keep the English and Vietnamese root files structurally and semantically synchronized after consolidation.

## 2. Verification

- [x] 2.1 Verify the three referenced override files exist and every scoped router path is present in both root guidance files.
- [x] 2.2 Run static searches confirming stale bare `app/(main)` and `app/(auth)` paths are absent from both root files.
- [x] 2.3 Compare root section structure and retained product-critical constraints across the English and Vietnamese files.
- [x] 2.4 Review the Markdown diff for UTF-8 readability and run OpenSpec validation for `streamline-root-agent-guidance`.
