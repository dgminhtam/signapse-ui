## 1. Contract And Runtime Mapping

- [x] 1.1 Confirm market conversation DTOs and snapshots model `analysisId` as nullable for submit, conversation detail, and message-list responses.
- [x] 1.2 Ensure the Assistant UI runtime converter emits `data-market-analysis` only when `role=assistant`, `kind=ANALYSIS`, and `analysisId` is a valid non-null identifier.
- [x] 1.3 Ensure `TEXT` assistant messages remain text-only even if they represent chat, clarification, refusal, or an inconsistent payload with a stray `analysisId`.
- [x] 1.4 Ensure `ANALYSIS` messages with `analysisId=null` preserve text and status presentation without loading or displaying analysis details.

## 2. Assistant Modal UX

- [x] 2.1 Confirm normal chat, clarification, and refusal responses render as plain assistant messages without analysis badges, disclosures, loaders, retry actions, or unavailable-analysis placeholders.
- [x] 2.2 Confirm valid analysis turns still render the answer first and keep compact analysis disclosure lazy-loaded through the existing authenticated analysis action.
- [x] 2.3 Confirm the composer and pending states do not imply every assistant response will produce an analysis.

## 3. Documentation And API Mapping

- [x] 3.1 Update `docs/APIMAPPING.md` to document nullable `analysisId`, `assistantMessage.kind=TEXT` for non-analysis turns, and `assistantMessage.kind=ANALYSIS` for analysis turns.
- [x] 3.2 If a refreshed OpenAPI snapshot is available, update `docs/api_mapping.json` and regenerate/check mapping documentation through the API mapping workflow.
- [x] 3.3 Confirm docs do not mention a frontend `responseType` field or any inferred chat, clarification, or refusal subtype.

## 4. Deterministic Checks

- [x] 4.1 Add or update focused runtime checks for `TEXT + analysisId=null`, `TEXT + analysisId=number`, `ANALYSIS + analysisId=number`, and `ANALYSIS + analysisId=null`.
- [x] 4.2 Run the focused runtime check script or targeted tests covering the Assistant UI conversion behavior.
- [x] 4.3 Run scoped lint for changed assistant runtime, modal, localization, script, and documentation-adjacent TypeScript files.
- [x] 4.4 Run `pnpm typecheck`.
- [x] 4.5 Run `openspec validate align-ai-assistant-nullable-analysis-contract --strict`.
- [x] 4.6 Run static searches confirming no frontend subtype guessing, eager analysis loading, responseType dependency, evidence control, Telegram control, tool-call UI, or generative UI was introduced.

User-owned manual QA: With authenticated backend data, submit one normal chat, one clarification-style prompt, one refusal-style prompt, and one analysis prompt; verify only the analysis turn shows the compact analysis disclosure.
