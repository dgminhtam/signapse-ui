## 1. Data Contracts And API Actions

- [x] 1.1 Add market conversation, chat message, analysis, evidence, Telegram delivery, request, and response types in the market query data layer.
- [x] 1.2 Add Zod schemas for create conversation, submit message, analysis response, evidence response, Telegram delivery request/response, and paginated conversation list parsing.
- [x] 1.3 Add authenticated server actions for `GET /market-conversations`, `POST /market-conversations`, `GET /market-conversations/{id}`, `POST /market-conversations/{id}/messages`, `GET /market-analyses/{id}`, `GET /market-analyses/{id}/evidence`, and `POST /market-analyses/{id}/telegram-deliveries`.
- [x] 1.4 Ensure market conversation actions validate blank title/message before API calls and never send `workspaceId`, `userId`, or `ownerId`.
- [x] 1.5 Add helper logic for deriving a capped non-blank conversation title from the first question.

## 2. Routing, Navigation, And Legacy Replacement

- [x] 2.1 Add protected locale routes for `/market-conversations` and `/market-conversations/[conversationId]` with `query:execute` access checks.
- [x] 2.2 Update sidebar navigation and breadcrumb mapping to use `/market-conversations` as the market query entry point.
- [x] 2.3 Replace the legacy `/market-query` product route with a locale-preserving redirect or equivalent non-legacy flow to `/market-conversations`.
- [x] 2.4 Remove primary-surface calls to `POST /query` and delete or retire legacy one-shot workbench components that are no longer referenced.
- [x] 2.5 Add route-level error boundaries and Suspense skeletons that mirror the final list/detail layouts.

## 3. Conversation List And Start Flow

- [x] 3.1 Build the conversation list page using the cardless workspace layout, URL `page`/`size` state, and backend 0-indexed pagination.
- [x] 3.2 Render conversation summary rows with title, updated timestamp, created timestamp where useful, and localized detail links.
- [x] 3.3 Add the empty/start state with a first-question composer instead of a separate title form.
- [x] 3.4 Implement create-and-submit flow that creates a conversation from the derived first-question title, opens the detail route, and submits the first message.
- [x] 3.5 Preserve first-question text on create or initial-submit failure and show localized validation/error feedback.

## 4. Conversation Detail And Composer

- [x] 4.1 Build the conversation detail timeline from `GET /market-conversations/{id}` and render messages in backend response order.
- [x] 4.2 Render user messages, assistant pending messages, assistant completed analysis messages, and assistant failed messages with stable accessible states.
- [x] 4.3 Add the detail composer with blank-message validation, disabled pending state, repo-standard `<Spinner>`, and typed-message recovery on network failure.
- [x] 4.4 Submit messages synchronously through `POST /market-conversations/{id}/messages` and reconcile the returned `userMessage` and `assistantMessage` in the timeline.
- [x] 4.5 Ensure the detail composer does not call the streaming endpoint and does not expose an `asOfTime` input.

## 5. Analysis Rendering And Evidence

- [x] 5.1 Render completed assistant analysis content with answer, visible limitations, assets considered, confidence, and model metadata when useful.
- [x] 5.2 Lazy-load and cache structured analysis details by `analysisId` for reasoning chain, key events, and key narratives.
- [x] 5.3 Render key events and key narratives with compact readable fallbacks for partial object shapes and without raw JSON as the primary UI.
- [x] 5.4 Add an evidence drawer that lazy-loads `GET /market-analyses/{id}/evidence`, preserves backend ordering, and displays snapshot title/source/timestamp/url/note/role fields.
- [x] 5.5 Add evidence drawer empty, loading, failure, and retry states while keeping the conversation timeline usable.
- [x] 5.6 Add optional internal links for evidence entity IDs only when the route and permission are available; external `urlSnapshot` links open in a new tab.

## 6. Manual Telegram Delivery

- [x] 6.1 Load Telegram destinations for the conversation detail action surface and filter eligible destinations to `status === "ACTIVE"`.
- [x] 6.2 Preselect the only active destination, require selection when multiple active destinations exist, and show setup guidance when no active destination exists.
- [x] 6.3 Add manual send action for completed assistant analyses with pending state, disabled invalid state, and localized feedback.
- [x] 6.4 Treat `duplicate=true` or sent delivery responses as success/already-sent and keep local analysis content unchanged.
- [x] 6.5 Render Telegram delivery failure states from response status or `failureReason` and allow retry.

## 7. Localization And Contract Cleanup

- [x] 7.1 Add English and Vietnamese dictionary entries for conversation navigation, list, start composer, detail timeline, analysis sections, evidence drawer, Telegram send, validation, toasts, and errors.
- [x] 7.2 Update market query DTO/rendering drift that affects reused analysis UI: `description` for key events, `keyNarratives[]`, `newsArticle*` evidence fields, and `evidenceNote`.
- [x] 7.3 Remove stale source-document-oriented evidence labels or links from any reused market analysis components.
- [x] 7.4 Update `docs/APIMAPPING.md` and `docs/api_mapping.json`-derived references if frontend integration status changes.

## 8. Verification

- [x] 8.1 Run `openspec validate add-market-conversation-ui --strict`.
- [x] 8.2 Run the repo typecheck command or report why it cannot run.
- [x] 8.3 Run the repo lint command or report why it cannot run.
- [x] 8.4 Run static search to confirm the primary market conversation UI does not call `POST /query` or `/market-conversations/{id}/messages/stream`.
- [x] 8.5 Perform deterministic review against AGENTS.md rules for locale copy, shadcn wrapper composition, URL pagination, form pending states, evidence links, and Telegram destructive-action avoidance.

User-owned manual QA notes: authenticated browser flow, current workspace selection, provider-backed analysis generation, persisted evidence content with real data, Telegram delivery to a verified destination, and responsive desktop/mobile checks.

Verification notes: `pnpm typecheck`, scoped `pnpm lint -- "app/[lang]/(main)/market-conversations" "app/api/market-conversations" "app/lib/market-query/definitions.ts"`, `openspec validate add-market-conversation-ui --strict`, and static search for `/query`, message stream, and `asOfTime` in the primary conversation surface passed. Full-repo `pnpm lint` was run and is currently blocked by pre-existing lint debt outside this change, including `components/logo.tsx` `react-hooks/set-state-in-effect`.
