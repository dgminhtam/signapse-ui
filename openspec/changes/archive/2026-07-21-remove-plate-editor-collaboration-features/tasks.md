## 1. Remove collaboration composition

- [x] 1.1 Remove Comment, Discussion, and Suggestion kits from the interactive `EditorKit` and their base kits from `BaseEditorKit`, preserving the remaining plugin order.
- [x] 1.2 Remove Comment and Mode from the fixed toolbar and Comment and Suggestion from the floating toolbar without leaving empty toolbar groups.
- [x] 1.3 Simplify surviving integration points by calling block removal directly, removing collaboration-only Markdown marks, restoring normal link placement, and deleting comment-only editor variants and text typing.

## 2. Delete feature implementation and residue

- [x] 2.1 Delete the collaboration-only runtime/base plugin files, toolbar buttons, comment and suggestion renderers, discussion/review UI, annotation index, and demo discussion data.
- [x] 2.2 Remove inline suggestion styling from date, equation, link, mention, and static media nodes, then delete the unused suggestion styling helper.
- [x] 2.3 Remove annotated Comment/Suggestion content and comparison rows from the default editor document.
- [x] 2.4 Remove the comment-only English and Vietnamese dictionary key while preserving dictionary parity.

## 3. Remove dependencies

- [x] 3.1 Remove direct dependencies on `@platejs/comment`, `@platejs/suggestion`, and `date-fns`, updating both `package.json` and `pnpm-lock.yaml` through pnpm.
- [x] 3.2 Confirm active source and manifests contain no imports or runtime references to the removed plugins, controls, renderers, helpers, or dependencies.

## 4. Verification

- [x] 4.1 Run targeted lint on every surviving modified TypeScript and TSX file.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Run OpenSpec validation for the change and repository, then run `git diff --check`.

User-owned deployment note: inspect persisted Personal Notes content for `suggestion_*` or `comment_*` metadata before deployment. If found, resolve suggestions and clean annotations in a separate migration before shipping this removal.

Verification note: targeted lint reached every surviving modified TS/TSX file; it remains non-zero only for the pre-existing `remarkEmoji as any` error in `markdown-kit.tsx` and an existing unused eslint-disable warning in `equation-node.tsx`.
