## Context

The global assistant uses `useExternalStoreRuntime` with backend-owned market conversation messages. `ChatMessageResponse` already distinguishes `TEXT` and `ANALYSIS` messages and carries an optional `analysisId`, while `getMarketAnalysisById()` returns the persisted structured analysis. The current converter discards `kind`, stores only `analysisId` in custom metadata, and the message renderer manually extracts text parts, so the Assistant UI content-part pipeline never sees the analysis artifact.

The installed `@assistant-ui/react@0.14.16` supports named data message parts. A `ThreadMessageLike` part such as `{ type: "data-market-analysis", data }` is normalized to `{ type: "data", name: "market-analysis", data }` and can be rendered through `MessagePrimitive.Parts`. This matches the domain: a market analysis is persisted business data attached to an assistant response, not a tool invocation, generated UI specification, or model chain-of-thought.

## Goals / Non-Goals

**Goals:**

- Preserve the immediate assistant answer while adding a compact structured analysis disclosure to analysis messages.
- Use Assistant UI's native named data-part model instead of treating analysis as ad hoc message metadata.
- Load analysis details only when requested and cache each result for the active conversation session.
- Keep loading, error, retry, expansion, workspace switching, and conversation switching deterministic.
- Reuse the existing authenticated analysis action and localized market-analysis labels.

**Non-Goals:**

- Evidence browsing, Telegram delivery, analysis editing, regeneration, or full workbench controls.
- Rendering `reasoningChain` as raw model reasoning or chain-of-thought.
- Tool-call UI, generative UI specifications, Assistant Cloud, streaming, or a new backend endpoint.
- Eagerly loading analysis details for every message in a message page.
- Restoring removed market conversation detail routes.

## Decisions

### Represent analysis as a named Assistant UI data part

The runtime snapshot retains `kind`. For assistant messages with `kind === "ANALYSIS"`, the converter returns normal text content followed by a `data-market-analysis` part containing the stable `analysisId`, message status, and failure information needed for initial presentation. Text messages continue to emit only text content.

The modal replaces manual text-only extraction with `MessagePrimitive.Parts` and a named market-analysis renderer. The renderer validates and narrows the data-part payload before using it.

Alternative considered: keep `analysisId` only in `metadata.custom` and append a bespoke component after the text. Rejected because metadata is auxiliary message state, while analysis is user-visible content and Assistant UI already provides a typed content-part extension point.

Alternative considered: use tool-call parts. Rejected because the analysis is a completed persisted artifact, not an invocation that needs tool execution, approval, or result submission.

Alternative considered: use generative UI. Rejected because the analysis schema and presentation are controlled by Signapse and do not require backend-authored component trees.

### Keep analysis loading in the conversation coordinator

The workspace-scoped controller owns:

- `analysisCache: Record<number, AnalysisLoadState>`;
- expanded analysis identifiers;
- `loadAnalysis`, `retryAnalysis`, and `toggleAnalysis` actions;
- stale-result checks tied to the current workspace and selected conversation epochs.

Opening a completed analysis disclosure starts `getMarketAnalysisById()` only when that identifier is not already loading or loaded. Closing and reopening the same analysis reuses the cached result. Starting a new conversation, selecting another persisted conversation, or changing workspace clears expansion state; workspace changes also clear the cache. Conversation changes may clear the cache to keep ownership bounded and avoid carrying irrelevant data.

Alternative considered: let every analysis component fetch independently. Rejected because remounts and duplicate identifiers could produce repeated requests and fragmented stale-request handling.

### Use progressive disclosure optimized for the modal

The collapsed analysis part is a compact secondary region below the answer. It communicates analysis availability and, after loading, may show a concise confidence and asset summary. Expanding reveals only decision-relevant sections:

- confidence and model identity;
- assets considered;
- limitations;
- key events;
- key narratives.

The answer remains the primary message text. Object arrays use bounded readable summaries rather than raw JSON. Empty sections are omitted unless the absence itself helps interpretation. The disclosure uses semantic buttons with `aria-expanded` and an accessible relationship to its content.

Alternative considered: render the entire former detail-page analysis panel inside every message. Rejected because nested dense panels would make a compact modal difficult to scan and expensive to render.

### Treat persisted reasoning as internal unless a user-facing contract is introduced

`MarketAnalysisResponse.reasoningChain` is parsed and retained by the data layer but is not rendered by this change. A future requirement may expose a specifically user-facing methodology or rationale field, but the UI must not label persisted internal reasoning as the assistant's live thought process.

### Keep text resilient when analysis loading fails

Failure to fetch structured analysis does not replace or hide the assistant answer. The data part renders an inline localized failure with retry, while the surrounding message remains complete. A failed backend message continues to use the existing message failure treatment and does not offer an expandable analysis unless it has a valid completed artifact identifier.

## Risks / Trade-offs

- [A conversation with many expanded analyses increases memory use] -> Keep loading user-initiated, cache only within the active assistant session, and clear bounded state at conversation or workspace boundaries.
- [Analysis requests complete after a thread switch] -> Compare workspace and thread epochs before committing cache updates.
- [Data-part payloads drift or contain malformed values] -> Validate the named part payload at the renderer boundary and render nothing or a localized unavailable state when invalid.
- [The modal becomes visually dense] -> Keep the answer primary, default disclosures closed, omit empty sections, clamp object summaries, and avoid nested Cards.
- [The completed migration spec says structured analysis is absent] -> Treat this change as the explicit follow-up that supersedes that exclusion and archive changes in an order that leaves the final capability set unambiguous.
- [Assistant UI data-part APIs change in a future dependency upgrade] -> Keep conversion and rendering behind focused local helpers and verify against the installed version rather than adopting generative UI abstractions.

## Migration Plan

1. Extend the assistant message snapshot and converter to preserve message kind and emit the named analysis data part.
2. Add controller-owned analysis cache, expansion state, lazy loading, retry, and stale-result protection.
3. Replace manual text extraction with Assistant UI message-part rendering and add the compact analysis part component.
4. Add synchronized English and Vietnamese labels and focused deterministic tests.
5. Align the completed migration artifacts during archival so the final specs no longer claim compact structured analysis is absent.

Rollback restores text-only conversion and rendering. The backend contract and persisted analysis data remain unchanged.

## Open Questions

- Whether analysis cache should survive persisted conversation switching within the same workspace can be decided during implementation; clearing it is the conservative default.
- Evidence may later become a separate local overlay, but it requires its own scope decision and is not implied by this disclosure.
