## Why

The news article detail route currently renders backend Markdown as plain text, so headings, lists, links, tables, and other article structure are lost even when `content` is correctly formatted. The reader-first page needs a safe server-rendered Markdown pipeline and typography that follows the existing shadcn theme.

## What Changes

- Render news article `content` as CommonMark with GitHub Flavored Markdown extensions on `/news-articles/{id}`.
- Use shadcn Typeset to provide theme-aware long-form typography while preserving the existing editorial width and responsive reading flow.
- Keep Markdown rendering on the server and explicitly reject raw HTML or executable MDX/JSX content.
- Define semantic rendering for body headings, links, lists, blockquotes, code, separators, task lists, and responsive tables.

## Capabilities

### New Capabilities

- `news-article-markdown-rendering`: Defines the supported Markdown dialect, safe rendering behavior, semantic article hierarchy, and shadcn Typeset presentation for news article content.

### Modified Capabilities

None.

## Impact

- Affects the canonical news article detail route and its route-local content renderer.
- Adds `react-markdown` and `remark-gfm` as runtime dependencies.
- Adds shadcn Typeset styles to the existing global Tailwind CSS entry point without changing application theme tokens.
- Does not change backend payloads, API actions, permissions, list pages, quick-detail surfaces, feature-image handling, or article ingestion.
