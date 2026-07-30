## Why

Assistant responses are persisted as text but commonly contain GitHub Flavored Markdown, while the active conversation currently renders every message as pre-wrapped plain text. Users therefore see raw emphasis markers, list syntax, pipe tables, and code fences instead of readable financial analysis.

## What Changes

- Render completed assistant message content as safe GitHub Flavored Markdown in the promoted global conversation.
- Reuse the installed `react-markdown`, `remark-gfm`, and shared `typeset` presentation instead of adding a parser or dependency.
- Keep user messages and assistant messages still undergoing progressive reveal as plain text.
- Keep tables and code blocks contained within the message surface through local horizontal scrolling.
- Ignore raw HTML and remote Markdown images; do not add executable HTML, MDX, syntax highlighting, math, or diagram support.
- Preserve the backend text-only message contract, persisted transcript truth, failure markers, tracking previews, progressive reveal timing, and screen-reader full-text behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `demo-conversation`: Require safe, responsive Markdown presentation for completed assistant messages while preserving plain-text user input and the existing reveal/accessibility behavior.

## Impact

- Active UI: `components/market-conversation-assistant/market-conversation-assistant.tsx` and its scoped stylesheet.
- Existing presentation reused: `app/globals.css` typeset rules and the Markdown pattern already used by news articles.
- Dependencies: no additions; `react-markdown` and `remark-gfm` remain existing dependencies.
- APIs and data: no backend, DTO, permission, API mapping, persistence, or localization contract changes.
- Sequencing: implementation should follow completion of `remove-legacy-assistant-ui-conversation`, which currently preserves the active conversation behavior while removing its unreachable predecessor.
