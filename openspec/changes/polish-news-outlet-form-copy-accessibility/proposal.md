## Why

The news outlet create/edit form is functionally aligned with the latest API contract, but its visible Vietnamese copy still contains unaccented/mojibake text and its invalid controls are not fully exposed to assistive technology. This polish is needed so the admin form feels production-ready and follows the repo's shadcn form accessibility rules.

## What Changes

- Replace user-facing mojibake and unaccented Vietnamese text in the news outlet form with professional Vietnamese copy.
- Ensure form validation state is exposed on each editable `Input` and `Textarea` via `aria-invalid`.
- Preserve the existing form shell, fields, payload shape, redirect flow, permissions, and current detail/edit route model.
- Keep the change scoped to copy and form accessibility; do not redesign the news outlet detail/edit workflow or change the API mapping contract.

## Capabilities

### New Capabilities
- `news-outlet-form-quality`: Covers copy quality and accessible validation semantics for the news outlet create/edit form.

### Modified Capabilities

## Impact

- Affected frontend code:
  - `app/(main)/news-outlets/news-outlet-form.tsx`
  - potentially `app/(main)/news-outlets/create/page.tsx` and `app/(main)/news-outlets/[id]/page.tsx` if related visible copy is part of the same form surface
- No backend API, DTO, permission, route, or dependency changes are required.
