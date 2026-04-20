## Why

Backend now exposes `POST /query` for grounded market analysis, and the admin frontend has started integrating it through a dedicated workbench. However, the current frontend contract is too strict for runtime payloads that return `null` in optional time fields, and the UI still exposes an `asOfTime` control even though backend already defaults missing values to the current time. This creates both a parsing bug and unnecessary operator complexity in the market-query flow.

## What Changes

- Add a protected frontend `market-query` feature that executes authenticated `POST /query` requests from the admin app.
- Refine the dedicated market-query workbench so the composer only asks for the market question and lets backend own the analysis timestamp when `asOfTime` is absent.
- Update the query request shaping so frontend omits `asOfTime` in v1 instead of asking the user to provide it manually.
- Render the query result as a structured briefing instead of a chat transcript, including:
  - final answer
  - confidence summary
  - assets considered
  - limitations
  - key events
  - evidence
  - reasoning chain
- Relax the frontend response contract for market-query so optional temporal fields such as `evidence[].publishedAt` and `keyEvents[].occurredAt` may arrive as `null` without breaking the whole response.
- Gate page access and execution with `query:execute`.
- Place the new entry under the protected `Nội dung` navigation so the feature is discoverable beside `Sự kiện` and `Tài liệu nguồn`.
- Keep V1 stateless: one question, one response, no saved history, no thread list.
- Update `docs/APIMAPPING.md` so the frontend coverage for `/query` is reflected in the mapping document.

## Capabilities

### New Capabilities
- `market-query-workbench`: Execute grounded market queries and review structured analytical results inside a dedicated admin workbench.

### Modified Capabilities
- None.

## Impact

- Updated query DTOs and runtime parsing rules under `app/lib/market-query/*`.
- Updated authenticated query action in `app/api/query/action.ts`.
- Updated protected route and UI under `app/(main)/market-query/*` to remove manual `asOfTime` input and reflect backend-managed analysis time.
- Updated navigation in `config/site.ts`.
- Updated API mapping notes in `docs/APIMAPPING.md`.
