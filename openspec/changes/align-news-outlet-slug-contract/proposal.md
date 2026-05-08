## Why

The latest backend snapshot removed `slug` from news outlet create, update, list, and detail contracts, while the frontend form, DTOs, and `APIMAPPING.md` still partially describe or send it. This makes the API ledger internally inconsistent and leaves the edit flow able to submit a field the backend no longer accepts.

## What Changes

- Align the `news-outlets` section in `docs/APIMAPPING.md` so `GET /news-outlets/{id}` and `PUT /news-outlets/{id}` explicitly reflect the remaining frontend drift around removed `slug`.
- Remove `slug` from frontend news outlet request, list response, and detail response definitions.
- Remove the `slug` field from create/edit form validation, initial values, request payloads, visible metadata, and editable controls.
- Keep `description` in create/edit/detail flows, while keeping it absent from list response usage.
- Preserve the existing `/news-outlets` route, permissions, redirect compatibility, active toggle, delete action, and list UX refinements.

## Capabilities

### New Capabilities
- `news-outlet-contract-alignment`: Covers frontend and documentation alignment for the simplified news outlet backend contract.

### Modified Capabilities

## Impact

- Affected documentation:
  - `docs/APIMAPPING.md`
- Affected frontend code:
  - `app/lib/news-outlets/definitions.ts`
  - `app/(main)/news-outlets/news-outlet-form.tsx`
  - potentially `app/(main)/news-outlets/create/page.tsx` and `app/(main)/news-outlets/[id]/page.tsx` skeletons/copy if they mirror the removed slug field
- No backend endpoint, permission, dependency, or route changes are required.
