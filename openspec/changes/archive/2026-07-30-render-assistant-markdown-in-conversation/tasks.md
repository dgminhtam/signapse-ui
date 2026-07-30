Implementation prerequisite: complete and archive `remove-legacy-assistant-ui-conversation` before applying this change.

## 1. Add Safe Assistant Markdown Rendering

- [x] 1.1 Update `DemoMessage` to render only completed assistant content through the installed `react-markdown` and `remark-gfm` stack while keeping user, failed, empty, and actively revealed content on the existing plain-text path.
- [x] 1.2 Configure chat-safe Markdown components: skip raw HTML, suppress images, preserve safe URL transformation, lower heading hierarchy, and wrap GFM tables for local horizontal scrolling.
- [x] 1.3 Reuse the global `typeset` rules with the assistant message's available width and add only the scoped compact size, leading, and flow adjustments needed by the bounded conversation viewport.

## 2. Preserve Conversation Behavior

- [x] 2.1 Confirm progressive reveal still exposes the complete screen-reader text without repeated partial announcements and switches once to Markdown after reveal completion.
- [x] 2.2 Confirm persisted reloads and new submissions share the same rendering decision while failure markers, tracking previews, History, submission, and workspace lifecycle remain unchanged.

## 3. Verify The Change

- [x] 3.1 Run static checks for assistant-only Markdown ownership, `skipHtml`, image suppression, GFM table containment, unchanged user plain text, and no new Markdown dependency or raw-HTML plugin.
- [x] 3.2 Run targeted lint for the active conversation component and scoped stylesheet-related source.
- [x] 3.3 Run the repository typecheck.
- [x] 3.4 Run `openspec validate render-assistant-markdown-in-conversation --strict`.

User-owned manual QA: verify representative bold text, headings, lists, links, code, GFM tables, malformed Markdown, raw HTML, long tokens, reveal completion, persisted reloads, keyboard focus, screen-reader output, light/dark themes, mobile width, and zoom at 200%.
