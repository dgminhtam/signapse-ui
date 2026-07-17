## Context

`/news-articles/{id}` is an async Server Component that fetches `NewsArticleResponse.content` and currently places the string directly inside an `<article>` with preserved whitespace. That keeps the route simple but displays Markdown markers as text and discards the semantic structure already supplied by the backend.

The route must remain a reader-first surface, preserve its existing editorial layout and localized empty state, and avoid a client-side editor or executable content pipeline. The project uses Next.js 16 App Router, React Server Components, Tailwind CSS v4, and the radix-nova shadcn preset.

## Goals / Non-Goals

**Goals:**

- Render backend article content as CommonMark plus GitHub Flavored Markdown.
- Keep parsing and rendering in the existing server-rendered route.
- Apply shadcn Typeset rhythm and theme tokens without changing global theme values or the page's existing width hierarchy.
- Preserve semantic heading order, responsive tables, safe links, inline images, code, lists, blockquotes, and localized missing-content behavior.
- Treat backend content as untrusted presentation input even when it originates from an internal API.

**Non-Goals:**

- Supporting raw HTML, MDX, JSX, embedded React components, or client-side Markdown editing.
- Adding syntax highlighting, heading anchors, a table of contents, math rendering, or a general-purpose shared content platform.
- Changing the news article API, ingestion, localization, permissions, feature-image handling, quick detail, or list surfaces.
- Adding Tailwind Typography, a sanitizer package, or another Markdown parser.

## Decisions

### Use `react-markdown` with `remark-gfm` in a route-local Server Component

The implementation will add a small route-local renderer that accepts the article content string and returns React elements through `react-markdown`. `remark-gfm` will add tables, task lists, autolinks, strikethrough, and footnotes. The renderer remains a Server Component and does not add `"use client"`.

This fits the current route boundary and produces React elements without serializing HTML. `@next/mdx` was rejected because the content is runtime data and must not execute JSX; `marked` was rejected because it produces HTML strings that require a separate sanitization boundary; the installed Lexical editor stack was rejected because a read-only article does not need editor state or browser runtime.

### Use shadcn Typeset as the article typography layer

The implementation will add the minimum Typeset rules and an article preset to the existing `app/globals.css`, then apply `typeset typeset-article` to the rendered article container. The preset will tune only body size, leading, and vertical flow while inheriting the current Geist fonts, theme colors, radius, and dark-mode tokens. The page layout continues to own maximum width.

Typeset was chosen over `@tailwindcss/typography` because it is the shadcn-native styling layer for rendered Markdown, follows existing application tokens automatically, and does not require another dependency. The project will not copy unrelated Typeset presets or streaming-specific variants.

### Make non-executable rendering explicit

The renderer will set `skipHtml` and will not install or configure `rehype-raw`. It will retain `react-markdown`'s safe URL transformation so unsupported or executable protocols are not emitted as usable destinations. No `dangerouslySetInnerHTML` boundary will be introduced.

Raw HTML embedded in the backend string will therefore be omitted rather than interpreted. This is intentional: the backend contract is Markdown, not trusted HTML.

### Preserve article semantics with only necessary component mappings

The page title remains the single top-level `h1`. Markdown headings will be normalized so body structure begins at `h2` and never creates a competing page-level heading. Markdown thematic breaks will use the existing shadcn `Separator`, and tables will render inside the Typeset horizontal-scroll wrapper so narrow viewports do not overflow.

Other supported Markdown elements will use the semantic output provided by `react-markdown` and the container-level Typeset styles. Inline Markdown images will keep the renderer's standard element and safe URL handling because the content contract does not provide the dimensions required by `next/image`; this exception is limited to article-body Markdown, while the existing feature image continues to use `next/image`.

### Limit the first implementation to the canonical detail route

The renderer will be colocated with the news article detail route and used only for the full `content` field. Description, list excerpts, graph inspectors, and quick-detail previews remain plain text. A shared Markdown abstraction is deferred until another non-chat surface needs the same contract.

## Risks / Trade-offs

- **Raw HTML supplied by the backend disappears** -> Keep `skipHtml` explicit and treat HTML support as a separate contract and security change if it is ever required.
- **Malformed Markdown may not match the author's intended structure** -> Rely on CommonMark parsing and preserve readable text rather than adding content-repair heuristics.
- **Inline article images lack intrinsic dimension metadata and may shift layout while loading** -> Keep them responsive through Typeset and retain `next/image` for the separately modeled feature image; add a media contract only if real payloads make inline-image stability material.
- **Large articles add server parsing work per render** -> Use the synchronous renderer without extra transforms; profile before adding caching or precompilation.
- **Body heading normalization changes the literal Markdown level** -> Prefer a correct page outline under the existing article title over multiple competing `h1` elements.

## Migration Plan

1. Add the two Markdown runtime dependencies and Typeset rules.
2. Introduce the route-local server renderer and replace the current plain-string article body.
3. Verify representative CommonMark, GFM, unsafe HTML, responsive table, and empty-content cases.
4. Roll back by restoring the direct string render and removing the two dependencies and Typeset rules; no data migration is required.

## Open Questions

None. Inline article images will use semantic Markdown output until the backend exposes a richer media contract.
