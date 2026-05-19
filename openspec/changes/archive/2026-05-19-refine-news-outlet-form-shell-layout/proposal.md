## Why

The news outlet create/edit form is a focused page-level task, but its footer actions are right-aligned like a dialog footer while the form fields begin on the left. The current `max-w-2xl` shell also feels slightly narrow for URL-heavy fields, leaving too much unused workspace without improving readability.

## What Changes

- Widen the news outlet create and edit form shells from medium to large (`max-w-3xl`) while keeping the focused form surface instead of making it full-width.
- Left-align the create/edit footer actions so primary and cancel actions follow the same left edge as the fields.
- Keep submit pending behavior, cancel/reset behavior, redirect, and `router.refresh()` unchanged.
- Review and update any news outlet create/edit skeleton or fallback that mirrors the form shell so width and footer alignment match the final layout.
- Update `AGENTS.md` only if the current focused form shell rules need clarification for page-level form actions or URL-heavy CRUD forms.

## Capabilities

### New Capabilities
- `news-outlet-form-shell-layout`: Covers the news outlet create/edit form shell width, footer action alignment, matching fallback/skeleton layout, and local rule clarification.

### Modified Capabilities
- None.

## Impact

- `app/(main)/news-outlets/news-outlet-create-form.tsx`
- `app/(main)/news-outlets/news-outlet-update-form.tsx`
- `app/(main)/news-outlets/create/page.tsx` and/or `app/(main)/news-outlets/[id]/page.tsx` if form skeleton/fallback layout exists or is added.
- `AGENTS.md` if rules need clarification.
- No API, validation, permission, or dependency changes.
