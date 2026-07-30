## Why

Persisted AI conversation messages currently provide no lightweight way to copy their source content or inspect when they were created. Adding a compact, accessible message footer makes common follow-up actions available without crowding the transcript.

## What Changes

- Add a role-aware footer beneath persisted conversation messages.
- Show Copy and created-time metadata for user messages.
- Show Copy, a localized Send to Telegram placeholder, and created-time metadata for completed assistant messages.
- Copy the original message string; assistant Markdown MUST be copied from the raw backend `content`, not extracted from rendered DOM text.
- Reveal the footer on hover for hover-capable pointers, on keyboard focus, and persistently on devices without hover.
- Provide localized tooltips, accessible names, copy success/error feedback, and Telegram placeholder feedback.
- Keep pending, revealing, empty, and failed message states from exposing actions that cannot operate on stable source content.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `demo-conversation`: Add accessible role-specific actions and created-time metadata to persisted message rows.

## Impact

- Affects the global market conversation message renderer, Vietnamese and English `demoConversation` dictionaries, and the existing deterministic conversation check.
- Reuses the existing message footer, button, tooltip, time-metadata, Clipboard API, localization, and Sonner patterns.
- Does not change backend APIs, message DTOs, permissions, routing, shared UI primitive contracts, or dependencies.
