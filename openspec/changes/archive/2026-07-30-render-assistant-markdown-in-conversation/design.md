## Context

`MarketConversationAssistant` receives backend message content as a text string and currently renders every non-empty message inside a pre-wrapped paragraph. Assistant responses regularly use Markdown syntax, so emphasis, lists, tables, and code remain visible as punctuation instead of becoming readable structure.

The repository already depends on `react-markdown` and `remark-gfm`, and `app/globals.css` already provides the shadcn `typeset` rules used by news article Markdown. The active conversation is dynamically loaded behind the protected permission boundary and already preserves a complete accessible response while visually revealing assistant text over a bounded duration.

The separate `remove-legacy-assistant-ui-conversation` change removes unreachable code while explicitly preserving this active component. Its final verification and archive should complete before this behavior change is applied.

## Goals / Non-Goals

**Goals:**

- Present completed assistant responses as readable GitHub Flavored Markdown.
- Keep message tables, code blocks, and long content inside the bounded conversation overlay.
- Preserve backend text-only persistence, user-message literal text, failed-message handling, progressive reveal timing, and assistive-technology access to the complete response.
- Reuse installed packages and semantic theme tokens with equivalent light/dark behavior.
- Keep the change local to the active conversation presentation.

**Non-Goals:**

- Changing backend prompts, DTOs, storage, permissions, API mapping, or message submission.
- Rendering user messages as Markdown.
- Supporting raw HTML, MDX, remote images, math, Mermaid, syntax highlighting, or executable embeds.
- Reformatting tracking-rail previews or History summaries.
- Replacing the existing progressive reveal with backend streaming or a streaming-specific Markdown parser.
- Refactoring the route-local news article renderer into a new shared abstraction.

## Decisions

### Render only completed assistant messages with the installed Markdown stack

`DemoMessage` will route non-empty `ASSISTANT` messages with status `COMPLETED` through `react-markdown` with `remark-gfm`. User messages and failed assistant messages remain in the existing plain-text paragraph path.

This is smaller and safer than changing the backend contract or creating a custom parser. The news article component is not imported because it is route-local and carries article-specific wrapper, heading, spacing, and footer behavior; only its established parser pattern and the global typeset rules are reused.

### Parse once after progressive reveal

While a completed assistant message is undergoing the existing visual reveal, the visible branch remains pre-wrapped plain text and the complete response remains available through the existing screen-reader-only node. When reveal state clears, the message switches once to semantic Markdown.

Parsing the partial string on every animation frame was rejected because unfinished Markdown changes structure as delimiters arrive, GFM tables appear only after sufficient rows exist, and repeated parsing adds avoidable work and layout churn. Adding a streaming-Markdown dependency was rejected because the backend response is synchronous and the current reveal is bounded presentation rather than transport streaming.

### Constrain Markdown to safe, chat-appropriate output

The renderer will:

- enable GFM for tables, autolinks, strikethrough, and task lists;
- set `skipHtml` and not enable `rehypeRaw`;
- suppress Markdown images so assistant output cannot trigger remote image requests;
- retain the library's safe default URL transformation;
- map assistant headings below the surrounding application and overlay hierarchy;
- wrap tables in the existing `typeset-scroll` container;
- reuse existing typeset code-block overflow and focus-visible link treatment.

Assistant Markdown content will use the full available ghost-bubble width. A scoped CSS class may only tune the existing typeset size, line-height, and content flow for the dense conversation viewport; colors and chrome continue to come from semantic tokens.

### Preserve presentation ownership and existing contracts

The change does not normalize or rewrite stored message content. Reloaded and newly submitted messages follow the same role/status rendering decision. Failure markers remain adjacent to failed assistant content, and tracking previews continue using bounded plain text.

No localization keys are required because the renderer introduces no visible controls or labels.

## Risks / Trade-offs

- **Raw Markdown remains visible during the bounded reveal** → Parse only once for stability; if this transition proves distracting in authenticated QA, a later change can remove the artificial reveal rather than add a streaming parser.
- **Large GFM tables can exceed message width** → Give assistant Markdown the available bubble width and contain overflow in `typeset-scroll`, never the Popover or page.
- **Malformed Markdown can produce imperfect structure** → Rely on CommonMark/GFM fallback behavior; content remains readable text without preprocessing or repair heuristics.
- **Markdown adds work to the assistant client chunk** → Reuse already installed packages within the existing dynamic assistant boundary and avoid syntax-highlighting, math, or diagram plugins.
- **AI-authored links may navigate away from the application** → Keep the library's safe protocol filtering and normal browser navigation semantics; do not invent link rewriting in this change.

## Migration Plan

1. Complete and archive `remove-legacy-assistant-ui-conversation`.
2. Add the assistant-only Markdown render branch and scoped compact typeset treatment.
3. Verify supported formatting, containment, safety, accessibility, lint, and typecheck.
4. Roll back by restoring the existing plain-text branch; persisted content requires no migration.

## Open Questions

None. Remote images, syntax highlighting, math, diagrams, and streaming-aware rendering remain explicitly deferred until a demonstrated product need exists.
