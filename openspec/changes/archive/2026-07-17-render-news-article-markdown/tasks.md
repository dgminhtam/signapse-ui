## 1. Markdown and Typeset Setup

- [x] 1.1 Add `react-markdown` and `remark-gfm` as runtime dependencies with pnpm.
- [x] 1.2 Integrate the official shadcn Typeset base rules and one article preset into `app/globals.css`, inheriting existing theme tokens and leaving the page layout responsible for maximum width.

## 2. Server Markdown Rendering

- [x] 2.1 Create a route-local Server Component for news article Markdown using `react-markdown`, `remark-gfm`, explicit `skipHtml`, and the default safe URL transformation.
- [x] 2.2 Add only the required component mappings to keep body headings below the page `h1`, render thematic breaks with shadcn `Separator`, and wrap wide tables with the Typeset scroll treatment.
- [x] 2.3 Replace the detail route's plain-string article body with the Markdown renderer while preserving the localized empty-content fallback, existing editorial measure, feature image, and responsive reading order.
- [x] 2.4 Confirm the route adds no `"use client"`, `dangerouslySetInnerHTML`, `rehype-raw`, MDX execution, shared renderer abstraction, or changes to other news article surfaces.

## 3. Verification

- [x] 3.1 Run deterministic static searches confirming the safe server-rendering boundary, heading/table/separator mappings, and removal of the old `whitespace-pre-wrap` body renderer.
- [x] 3.2 Run strict OpenSpec validation for `render-news-article-markdown`.
- [x] 3.3 Run `pnpm typecheck`, `pnpm lint`, and `pnpm build`, resolving errors introduced by this change.

User-owned manual QA: verify one representative backend article containing headings, emphasis, links, lists, a blockquote, GFM table/task list, inline image, raw HTML, and an unsafe URL in both light and dark themes at desktop and narrow widths.
