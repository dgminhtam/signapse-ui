## REMOVED Requirements

### Requirement: Frontend MUST provide a protected market-query workbench
**Reason**: The persisted market conversation surface replaces the protected one-shot market-query workbench as the primary product experience.
**Migration**: Use the new `/market-conversations` route and `market-conversation-ui` capability for protected navigation, route access, and `query:execute` gating.

### Requirement: Market-query workbench MUST support one-shot query execution
**Reason**: One-shot `POST /query` execution is no longer retained as the frontend market query product flow.
**Migration**: Start or continue conversations through `POST /market-conversations` and `POST /market-conversations/{id}/messages`.

### Requirement: Market-query results MUST render as a structured analytical briefing
**Reason**: Market analysis is now rendered inside assistant analysis messages tied to persisted conversations.
**Migration**: Render answer, limitations, assets considered, reasoning, key events, key narratives, evidence, and Telegram actions through `market-conversation-ui`.

### Requirement: Market-query response parsing MUST tolerate nullable optional timestamps
**Reason**: The legacy one-shot `MarketQueryResponse` parser is no longer the primary frontend parser for market analysis display.
**Migration**: Conversation and analysis schemas must tolerate documented nullability for persisted analysis and evidence snapshot timestamps.

### Requirement: Market-query traceability MUST respect related entity permissions
**Reason**: Traceability moves from one-shot source-document/event result sections to persisted analysis evidence snapshots and optional entity links.
**Migration**: Use the evidence drawer in `market-conversation-ui`, with optional internal links only when IDs, routes, and permissions are available.
