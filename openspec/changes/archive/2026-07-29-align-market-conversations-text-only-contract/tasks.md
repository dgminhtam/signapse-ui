## 1. Align the conversation contract

- [x] 1.1 Update `MarketChatMessageResponse`, its role/status types, and Zod schema to match the current text-only `ChatMessageResponse` without `kind`, `analysisId`, or `PENDING`.
- [x] 1.2 Remove the top-level `analysisId` from the submit response type/schema while preserving `{ message }` submission, returned user/assistant messages, history pagination, and failure details.

## 2. Simplify the assistant runtime

- [x] 2.1 Reduce the conversation runtime snapshot and mapper to role, completed/failed status, text content, failure reason, and timestamp; remove analysis metadata, validation, and data-part generation.
- [x] 2.2 Remove the `market-analysis` data renderer from the assistant modal so all supported assistant content uses the existing text renderer.
- [x] 2.3 Remove analysis cache, request-key, expansion, load, retry, toggle, and reset behavior from the conversation controller without changing history or submission behavior.

## 3. Delete the unreachable analysis surface

- [x] 3.1 Delete `market-analysis-part.tsx` and remove matching English/Vietnamese assistant analysis-only dictionary entries.
- [x] 3.2 Use CodeGraph/static references to remove `/market-analyses/*` frontend actions, DTOs, schemas, and helpers only when the deleted disclosure was their last caller.
- [x] 3.3 Replace `check-assistant-market-analysis-runtime.ts` with one minimal deterministic text-only runtime check covering normal assistant text and failed assistant text.

## 4. Synchronize documentation

- [x] 4.1 Update the market-conversation rows and notes in `docs/APIMAPPING.md` from `docs/api_mapping.json`: document removed `kind`, `analysisId`, submit-result `analysisId`, and `PENDING`.
- [x] 4.2 Keep `/market-analyses/*` endpoints in the backend ledger but mark their actual frontend ownership/status after dead-code cleanup, and leave `add-demo-conversation` unchanged.

## 5. Verify the change

- [x] 5.1 Run the focused text-only runtime check and a static search confirming live conversation code/docs no longer reference message `kind`, message `analysisId`, `data-market-analysis`, or backend message `PENDING`.
- [x] 5.2 Run targeted lint for changed TypeScript/TSX files and `pnpm.cmd typecheck`.
- [x] 5.3 Run `openspec.cmd validate align-market-conversations-text-only-contract --strict` and inspect the final diff for scope and readable UTF-8 Markdown.
