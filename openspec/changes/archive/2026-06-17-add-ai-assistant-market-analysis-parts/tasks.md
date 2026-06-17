## 1. Runtime Analysis Part Mapping

- [x] 1.1 Extend the assistant conversation snapshot to preserve backend message kind and the analysis reference needed by the runtime boundary.
- [x] 1.2 Convert completed, pending, and failed `ANALYSIS` messages into normal text plus a typed `data-market-analysis` part while keeping `TEXT` messages text-only.
- [x] 1.3 Add focused deterministic checks for text-only conversion, valid analysis-part conversion, missing analysis identifiers, and message failure status mapping.

## 2. Conversation-Scoped Analysis State

- [x] 2.1 Add typed idle, loading, loaded, and error analysis cache state to the market conversation assistant controller.
- [x] 2.2 Implement lazy `getMarketAnalysisById()` loading, duplicate-request prevention, cached reopen behavior, and explicit retry by `analysisId`.
- [x] 2.3 Add expanded-analysis state and reset it when starting a draft, selecting another conversation, or changing workspace.
- [x] 2.4 Guard analysis request completion with the existing workspace and thread epochs so stale results cannot commit after a context change.

## 3. Assistant UI Message-Part Rendering

- [x] 3.1 Replace manual text extraction in assistant messages with `MessagePrimitive.Parts` composition and a named `market-analysis` data-part renderer supported by the installed Assistant UI version.
- [x] 3.2 Implement a compact collapsed analysis disclosure that preserves the answer as the primary content and exposes valid completed analyses on demand.
- [x] 3.3 Implement localized loading, loaded, unavailable, failure, and retry states without hiding or replacing the assistant answer.
- [x] 3.4 Render bounded confidence, model, asset, limitation, key-event, and key-narrative summaries while omitting empty sections and raw JSON.
- [x] 3.5 Keep `reasoningChain`, evidence controls, Telegram delivery, tool controls, and removed canonical-route actions out of the analysis part.

## 4. Localization And Accessibility

- [x] 4.1 Add synchronized English and Vietnamese dictionary keys for analysis availability, disclosure actions, loading, failure, retry, confidence, model, assets, limitations, events, narratives, and unavailable values.
- [x] 4.2 Add semantic disclosure controls with `aria-expanded`, an associated content identifier, visible focus treatment, and stable keyboard behavior.
- [x] 4.3 Verify loading and failure announcements remain understandable without introducing duplicate live-region noise for the surrounding message.

## 5. OpenSpec And Contract Alignment

- [x] 5.1 Confirm implementation continues to use the existing authenticated `/market-analyses/{id}` action and does not add or bypass API clients.
- [x] 5.2 Run static checks confirming no eager per-page analysis loading, tool-call/generative-UI mapping, raw chain-of-thought label, evidence control, Telegram control, or removed route action was introduced.
- [x] 5.3 Align active completed AI assistant migration artifacts that explicitly require structured analysis to be absent, so archival leaves an unambiguous final capability set.

## 6. Verification

- [x] 6.1 Run scoped lint for changed assistant runtime, controller, analysis presentation, and localization files.
- [x] 6.2 Run `pnpm typecheck`.
- [x] 6.3 Run `openspec validate add-ai-assistant-market-analysis-parts --strict`.
- [x] 6.4 Perform deterministic review against Assistant UI `data-*` part conversion, cache ownership, stale-result protection, modal density, localization, and accessibility requirements.

User-owned manual QA: With authenticated backend data, open analysis messages in English and Vietnamese, verify first expansion loads once, reopening uses cache, retry works after a failed analysis request, switching conversations or workspaces cannot reveal stale analysis, and long conversations remain readable in normal and fullscreen modal modes.
