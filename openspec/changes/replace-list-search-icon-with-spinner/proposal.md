## Why

List toolbar search currently renders a stable search icon on the left and a pending spinner in a trailing addon. That works, but it adds an extra visual slot and small layout complexity for a secondary feedback state.

Replacing the leading search icon with the spinner during pending search keeps the control compact, removes the need for trailing spinner spacing, and matches the shadcn `InputGroupAddon` composition more cleanly.

## What Changes

- Update list toolbar search components so the pending `<Spinner>` replaces the leading `<Search>` icon inside the same `InputGroupAddon`.
- Remove trailing `InputGroupAddon align="inline-end"` spinner slots from list search inputs.
- Remove ad hoc spacing used only to reserve spinner space, such as `className="min-w-8"` on the trailing addon.
- Preserve each list search component's URL query key, placeholder, debounce timing, controlled value behavior, trim behavior, page reset, `router.replace()` flow, responsive wrapper width, `type="search"`, `id`, and `sr-only` label.
- Add `AGENTS.md` guidance that pending list search feedback uses icon replacement in the leading `InputGroupAddon`, not a trailing addon, external spinner, or absolute positioning.

## Capabilities

### New Capabilities

- `list-search-pending-spinner`: Standardizes list toolbar search pending feedback so spinner replaces the leading search icon inside the same `InputGroupAddon`.

### Modified Capabilities

- None.

## Impact

- Affected guidance: `AGENTS.md`.
- Affected list search components:
  - `app/(main)/blogs/blog-search.tsx`
  - `app/(main)/cronjobs/cronjob-search.tsx`
  - `app/(main)/economic-calendar/economic-calendar-search.tsx`
  - `app/(main)/events/event-search.tsx`
  - `app/(main)/news-articles/news-article-search.tsx`
  - `app/(main)/news-outlets/news-outlet-search.tsx`
  - `app/(main)/system-prompts/system-prompt-search.tsx`
- No API, dependency, route, or data contract changes.
