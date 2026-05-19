## Why

The news outlet create and edit flows currently share one submit-owning `NewsOutletForm` that switches behavior with `initialData` / `isEdit`. That keeps the file compact today, but it blends two different user intents, payload shapes, permission contexts, and future UX directions into one component.

## What Changes

- Split the news outlet create and edit flows into separate top-level form components.
- Remove the shared create/edit form component that owns submit behavior and branches on `initialData` / `isEdit`.
- Keep shared low-level field composition only if it is mode-agnostic and does not own create/edit submit logic.
- Use create-specific copy, defaults, validation intent, submit action, and payload construction in the create form.
- Use edit-specific copy, initial values, reset behavior, metadata display, submit action, and payload construction in the edit form.
- Add a repo rule note that create and edit screens must not share the same submit-owning form component; each flow needs its own create/edit form component.
- Preserve the current route model, permissions, focused form shell, redirect behavior, and news outlet API contract.

## Capabilities

### New Capabilities
- `news-outlet-form-separation`: Covers separate create/edit form ownership, allowed shared field primitives, and the repo rule that create and edit forms must not use one shared submit-owning form component.

### Modified Capabilities

## Impact

- Affected frontend code:
  - `app/(main)/news-outlets/create/page.tsx`
  - `app/(main)/news-outlets/[id]/page.tsx`
  - `app/(main)/news-outlets/news-outlet-form.tsx`
  - new create/edit form files under `app/(main)/news-outlets/`
  - optionally a mode-agnostic field helper/component under the same feature directory
- Affected repo rules:
  - `AGENTS.md`
- No backend endpoint, route, permission, dependency, or API mapping contract changes are required.
