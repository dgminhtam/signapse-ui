## Why

The global AI assistant currently reduces every persisted conversation item to plain message text even when the backend identifies an assistant message as an analysis and provides an `analysisId`. Users therefore lose the structured market context already persisted by the backend, while the removed full-page conversation UI is no longer available as an alternative.

## What Changes

- Represent persisted analysis references as named Assistant UI data message parts alongside the assistant answer text.
- Add a compact analysis disclosure inside analysis messages, with lazy loading, per-analysis cache, loading, failure, retry, and expanded states.
- Present decision-relevant analysis fields such as confidence, considered assets, limitations, key events, key narratives, and model information.
- Keep the primary answer immediately readable without requiring the structured analysis to load.
- Preserve workspace and conversation stale-request protection when loading analysis details.
- Exclude evidence browsing, Telegram delivery, dynamic generative UI, tool-call semantics, and raw model chain-of-thought presentation from this change.
- Reclassify the modal's previous exclusion of structured analysis: compact persisted analysis is supported, while full workbench controls remain excluded.

## Capabilities

### New Capabilities

- `ai-assistant-market-analysis-parts`: Covers Assistant UI data-part mapping, lazy persisted-analysis loading, compact disclosure rendering, state isolation, localization, and accessibility.

### Modified Capabilities

None.

## Impact

- Assistant runtime mapping in `components/assistant-ui/market-conversation-runtime.ts`.
- Workspace-scoped assistant controller and analysis cache in `components/assistant-ui/use-market-conversation-assistant.ts`.
- Message-part composition and compact analysis presentation in `components/assistant-ui/assistant-modal.tsx` and focused assistant analysis components.
- Existing authenticated `getMarketAnalysisById()` action and `MarketAnalysisResponse` contract; no backend endpoint change is required.
- English and Vietnamese assistant dictionary copy.
- Existing completed migration artifacts may need follow-up archival alignment because they currently describe full structured analysis as out of scope.
