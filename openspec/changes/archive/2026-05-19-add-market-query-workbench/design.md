## Context

Backend now exposes `POST /query` with a compact request shape:

- required `question`
- optional `asOfTime`

The response is not a CRUD record or a conversational transcript. It is a structured analytical brief with:

- `answer`
- `confidence`
- `assetsConsidered`
- `limitations`
- `keyEvents`
- `evidence`
- `reasoningChain`

The admin frontend currently has no first-class surface for this workflow. Operators can browse `events` and `source-documents`, but they cannot ask a grounded market question and review the resulting synthesis inside the protected app.

The first frontend pass also exposed two runtime mismatches that now need to be folded back into the design:

- backend may return `null` for optional temporal fields such as `evidence[].publishedAt` and `keyEvents[].occurredAt`
- backend already defaults missing `asOfTime` to the current time, so the user-facing `asOfTime` control adds complexity without changing the effective result for the common flow

The repo already has strong conventions that this feature should follow:

- protected routes live under `app/(main)`
- each list/detail-style feature uses a server `page.tsx` shell with `Card`, `Separator`, and `Suspense`
- mutations and authenticated backend calls run through feature-local actions under `app/api/*/action.ts`
- user-facing copy must be Vietnamese
- loading and submit actions must show disabled controls and `Spinner`

The permission direction is now clear enough to design against:

- `query:execute` gates access to the market-query feature and its submit action
- related event drill-down still depends on `event:read`
- related source-document drill-down still depends on `source-document:read`

## Goals / Non-Goals

**Goals:**
- Add a protected `market-query` workbench route for one-shot grounded market analysis.
- Let authorized users submit a market question to `POST /query` without needing to manage analysis time manually in v1.
- Render the response as a structured briefing that is easy to scan, not as a chat UI.
- Keep `reasoningChain` available to all authorized users while preserving readability.
- Make related event and source-document navigation permission-aware.
- Accept runtime `MarketQueryResponse` payloads where optional temporal fields are `null`.
- Update `docs/APIMAPPING.md` so frontend ownership of `/query` is explicit.

**Non-Goals:**
- Adding saved query history, threads, or chat-style conversation memory.
- Introducing background polling, streaming, or incremental token rendering.
- Exposing system-prompt management or model-configuration controls from this page.
- Exposing a manual analysis-time picker in v1.
- Adding export, share, or print workflows in v1.
- Changing the backend request or response contract for `/query`.

## Decisions

### 1. Add a dedicated protected route at `/market-query`
The frontend will expose the feature as `/market-query` rather than `/query`, and it will place the navigation entry under the protected `Nội dung` group with the label `Truy vấn thị trường`.

Why:
- `/query` is backend-oriented and too generic for operators.
- `/market-query` is explicit in both routing and navigation, and it matches the feature's business meaning.

Alternatives considered:
- Reuse `/query` in the frontend.
- Rejected because it is ambiguous and does not read well in navigation.

### 2. Model the page as a workbench briefing, not a chat transcript
The page will have one composer and one result surface. The result surface will prioritize:

- `Kết luận`
- confidence and assets summary
- limitations
- key events
- evidence
- reasoning chain

Why:
- The backend returns a structured analytical brief, not turn-by-turn dialogue.
- Operators need scanability and traceability more than conversational chrome.

Alternatives considered:
- A chatbot-style timeline with user and assistant bubbles.
- Rejected because it would bury the evidence structure and make the page noisier than the API contract requires.

### 3. Keep v1 stateless and one-shot
The workbench will support one submitted question at a time and render only the latest result for the current page session. It will not show saved history, prior runs, or a thread rail.

Why:
- The backend API is request/response oriented and does not provide a history model.
- This keeps the first release small and focused on the core operator workflow.

Alternatives considered:
- Introduce local history state or a sidebar of previous prompts.
- Rejected because it adds UI complexity without backend support or a proven operator need.

### 4. Remove the user-facing `asOfTime` control and let backend own the default analysis time
The v1 workbench will not render a manual `asOfTime` input. Frontend will submit `question` only and let backend resolve the effective analysis time from its current-time default.

Why:
- This matches the actual operator need more closely: ask a question and get a current-state brief.
- It avoids frontend-side ambiguity around locale, timezone, and the exact datetime format backend expects.
- It removes one form control without reducing the primary value of the workbench.

Alternatives considered:
- Keep the `asOfTime` input because the backend schema allows it.
- Rejected because it adds UX weight for a control the product now prefers not to expose in v1.
- Send `asOfTime: null` explicitly on every request.
- Rejected because omitting the field entirely is cleaner at the HTTP boundary and aligns better with backend default semantics.

### 5. Gate the workbench with `query:execute`, but keep entity drill-down permission-aware
Route access, navigation visibility, and query execution will all require `query:execute`. Related event links in `keyEvents` and `evidence` will only be interactive when the user also has `event:read`. Related source-document links in `evidence` will only be interactive when the user also has `source-document:read`.

Why:
- This matches the backend permission model without overloading `query:execute` into a read-all permission.
- It lets the query response remain readable while respecting existing entity boundaries.

Alternatives considered:
- Hide all event/source-document identifiers unless the user also has the related read permission.
- Rejected because the response itself is part of the authorized query output, and hiding it would remove useful analytical context.

### 6. Treat optional temporal fields in market-query responses as nullable at the parsing boundary
Frontend parsing will accept `null` for optional temporal fields returned by `/query`, specifically the known runtime cases `evidence[].publishedAt` and `keyEvents[].occurredAt`.

Why:
- Backend runtime already returns `null` in legitimate responses, so treating those fields as strict strings incorrectly rejects otherwise-usable briefs.
- The UI already has meaningful fallback rendering for missing timestamps, so null-tolerant parsing matches the presentation layer better.
- This keeps frontend contract handling aligned with other repo domains that treat response timestamps as display strings rather than strict ISO-validated inputs.

Alternatives considered:
- Keep strict parsing and require backend to omit the fields instead of sending `null`.
- Rejected because it pushes a frontend runtime bug onto backend formatting details without improving operator outcomes.
- Normalize raw payload values after parsing.
- Rejected because the parser itself is the failing boundary; the schema must accept the backend shape first.

### 7. `reasoningChain` is visible to all authorized users, but collapsed by default
The workbench will render `reasoningChain` in its own section and default it to a collapsed presentation, with a clear control to expand the full chain.

Why:
- The user explicitly wants reasoning available to all users of this feature.
- Default collapse keeps the page focused on the answer and evidence for scan-first usage.

Alternatives considered:
- Hide reasoning behind elevated permissions.
- Rejected because it conflicts with the chosen product decision.
- Expand the full reasoning by default.
- Rejected because long chains would dominate the viewport and reduce readability.

### 8. Align the implementation with the repo's page-shell and feedback conventions
The feature will use:

- a server `page.tsx` with `Card`, `CardHeader`, `CardDescription`, `Separator`, and `Suspense`
- a local `error.tsx`
- a client workbench component for form state and submission
- disabled controls and `Spinner` during pending states
- repo-standard `Empty` handling when no result is present yet

Why:
- This keeps the route consistent with the rest of the protected admin app.
- It reduces implementation risk by following already-established patterns.

Alternatives considered:
- Build the page as a fully custom shell outside the standard route structure.
- Rejected because the feature fits naturally into the existing route conventions.

## Risks / Trade-offs

- [Long analytical responses may feel dense] -> Keep the layout hierarchical and collapse `reasoningChain` by default.
- [Users may expect query history from a prompt-based feature] -> Make the one-shot behavior explicit in the empty state and avoid any thread-like navigation affordance.
- [Permission differences can make some traceability links unavailable] -> Render disabled or non-interactive link affordances clearly so the missing navigation feels intentional.
- [Nullable backend timestamps may continue to drift in shape] -> Accept `null` at the schema boundary and keep fallback timestamp rendering text-based in the UI.
- [Removing `asOfTime` input reduces future flexibility] -> Keep request typings capable of representing `asOfTime`, but do not expose the control in v1 unless a new product decision reintroduces it.
- [The new route adds another entry under the content group] -> Keep the nav label concise and use the existing content information architecture.

## Migration Plan

1. Add market-query definitions, labels, and permission helpers.
2. Add authenticated query action support under `app/api/query/action.ts`.
3. Add the protected `/market-query` route, local error boundary, and workbench UI.
4. Simplify the composer by removing the user-facing `asOfTime` input and relying on backend default time semantics.
5. Make response parsing tolerant of nullable optional timestamps from `/query`.
6. Add permission-aware result rendering for related events and source documents.
7. Update navigation and `docs/APIMAPPING.md`.
8. Verify route gating, request shaping, result rendering, null-timestamp handling, and error handling.

## Open Questions

- None at the moment; route naming, permission gating, and v1 scope have been decided clearly enough to proceed.
