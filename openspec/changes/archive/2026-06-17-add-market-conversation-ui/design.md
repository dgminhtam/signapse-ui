## Context

Signapse UI currently exposes `/market-query` as a protected one-shot analysis workbench. It submits `POST /query`, renders only the latest response, and does not persist conversation history in the frontend surface.

Backend now provides synchronous persisted market conversation APIs under `query:execute`: conversations, messages, persisted analyses, analysis evidence snapshots, and manual Telegram delivery. The Phase 10 frontend contract makes this conversation workflow the primary market query product surface, while streaming and richer lifecycle behavior remain future work.

The implementation must fit the existing Next.js 16 App Router, locale-prefixed routes, Clerk-authenticated server actions, dictionary-backed copy, shadcn wrapper policy, cardless app workspace layout, URL-driven list pagination, and existing Telegram destination integration.

## Goals / Non-Goals

**Goals:**
- Make `/market-conversations` the canonical protected market query experience.
- Let users start a conversation by entering the first question; derive the initial conversation title from that question.
- Show persisted conversation lists and detail timelines scoped by backend current workspace.
- Submit messages synchronously and render returned user and assistant messages without using streaming.
- Render assistant analysis messages with answer, limitations, assets considered, reasoning, key events, key narratives, evidence access, and Telegram delivery action.
- Lazy-load analysis details and evidence snapshots by `analysisId`.
- Use active Telegram destinations as eligible delivery targets for manual analysis send.
- Remove the legacy one-shot `/market-query` product flow and avoid primary-surface calls to `POST /query`.

**Non-Goals:**
- Token streaming or `POST /market-conversations/{id}/messages/stream`.
- Conversation rename, delete, archive, AI auto-title, collaborative chat, message edit/delete/regenerate, retry-by-message-id, or raw tool-call trace UI.
- Default Telegram feature routing for manual analysis delivery or a new `MANUAL_MARKET_ANALYSIS` feature key.
- Backend workspace selection changes; the frontend does not send `workspaceId` to market conversation endpoints.
- Rendering raw analysis JSON as the primary UI.

## Decisions

### Canonical route

Use `/market-conversations` and `/market-conversations/[conversationId]` as the canonical routes. Navigation and breadcrumbs should point to the new route. The old `/market-query` workbench is not retained as a product flow; implementation may redirect it to `/market-conversations` only for path compatibility if that is simpler for bookmarks.

Alternative considered: retrofit `/market-query` in place. Rejected because the backend and planning contract name the persisted domain `market-conversations`, and the new surface has list/detail semantics rather than a single workbench.

### Conversation creation flow

Use the first submitted question as both the initial message and the basis for the conversation title. The UI should not block the user with a separate title form. A conservative title derivation should trim the question and cap display length before calling `POST /market-conversations`; the full message remains the submitted message.

Alternative considered: require a separate title. Rejected because the user explicitly chose first-question title derivation and the roadmap allows this lower-friction flow.

### API boundary

Add market conversation actions and Zod schemas near the existing market query data layer. All private endpoints use `fetchAuthenticated()`. The frontend must not send `userId`, `ownerId`, or `workspaceId`.

`GET /market-conversations` follows the existing Spring `Page<T>` pattern with URL `page` and `size` remaining 1-indexed in the UI and 0-indexed for backend calls. The default list sort should request most recently updated conversations first.

Alternative considered: call endpoints directly from client components. Rejected because authenticated backend calls in this repo are centralized through server actions and `fetchAuthenticated()`.

### Timeline state

Conversation detail should be a client workspace hydrated from server-loaded conversation data. Submitting a message disables the composer for that conversation, appends or replaces local optimistic placeholders with the returned `userMessage` and `assistantMessage`, and keeps the typed message recoverable on network failure.

Synchronous Phase 10 still needs to render `ASSISTANT/PENDING`, `ASSISTANT/FAILED`, and failed HTTP states gracefully, because backend may persist placeholders or future work may introduce polling/streaming.

Alternative considered: always refetch detail after submit before updating the timeline. Rejected for MVP responsiveness, but a targeted refresh after success remains acceptable if ordering drift appears.

### Analysis and evidence loading

Assistant analysis messages render `content` immediately. Structured analysis detail from `GET /market-analyses/{id}` should lazy-load when the user expands or opens details and should cache by `analysisId` for the current page session. Evidence drawer content should lazy-load from `GET /market-analyses/{id}/evidence` and use snapshot fields as display source of truth.

Evidence links to internal entities are optional enhancements when IDs and routes exist. The drawer must not depend on live event, narrative, or news article APIs to render the evidence snapshot.

Alternative considered: reuse the old one-shot evidence component unchanged. Rejected because the current component is source-document oriented, while the new contract uses snapshot evidence fields and `newsArticle*` identifiers.

### Telegram manual send

Use existing Telegram destination loading and treat `status === "ACTIVE"` as eligible for Phase 10. If there is exactly one active destination, preselect it. If there are multiple, require a selection. If there are none, show a setup prompt or route to Telegram configuration and hide direct send.

Manual delivery calls only `POST /market-analyses/{id}/telegram-deliveries` with `{ destinationId }`. `duplicate=true` is a successful already-sent state, not a fatal error.

Alternative considered: add a manual market analysis feature route. Rejected because Phase 10 explicitly excludes default Telegram feature routing for this flow.

### Localization and UI composition

All new labels, toasts, placeholders, validation messages, and empty states must be dictionary-backed in English and Vietnamese. The route should use the app's cardless workspace, existing shadcn wrappers, `<Empty>` states, `<Spinner>` pending buttons, drawer/sheet wrappers, URL-preserving localized links, and responsive layouts that avoid outer main cards.

## Risks / Trade-offs

- [Backend response shape drifts from roadmap examples] -> Validate with Zod schemas that accept documented nullability and optional fields, then surface a localized response-invalid error instead of crashing.
- [Conversation title derived from a long question becomes noisy] -> Trim and cap the title while preserving the full submitted message.
- [Local timeline ordering diverges after submit] -> Prefer returned message order and allow a follow-up detail refresh after successful submit if needed.
- [No active Telegram destination blocks manual send] -> Keep analysis usable, show a setup affordance, and do not call delivery without a destination id.
- [Removing `/market-query` surprises existing bookmarks] -> Update navigation to `/market-conversations`; optionally keep a lightweight locale-preserving redirect from `/market-query` to the new route without preserving the old workbench.
- [Analysis sections have partially unstable `keyEvents` or `keyNarratives` inner shapes] -> Render readable title/name/summary/thesis/id fallbacks and avoid raw JSON as the primary presentation.

## Migration Plan

1. Add market conversation DTOs, schemas, and server actions.
2. Add `/market-conversations` list/start route and `/market-conversations/[conversationId]` detail route.
3. Wire navigation, breadcrumbs, permissions, dictionaries, and localized links to the new route.
4. Replace the old `/market-query` product flow by redirecting or removing it from navigation, with no primary UI call to `POST /query`.
5. Add timeline, composer, analysis rendering, evidence drawer, and Telegram delivery.
6. Update API mapping documentation after integration.

Rollback is UI-local: restore navigation to `/market-query`, remove the new routes/actions, and keep backend conversation APIs unused by frontend.

## Open Questions

- Should `/market-query` become a locale-preserving redirect to `/market-conversations`, or should it return not found after navigation moves? A redirect is recommended for bookmark compatibility while still not retaining the legacy flow.
