# Change Checklist

Use this checklist when the live dev OpenAPI contract changes or before integrating a new or changed backend API.

## What Counts As Real Contract Drift

- New or removed path, method, or `operationId`
- Added, removed, or renamed request fields
- Added, removed, or renamed response fields
- Enum value changes
- Type changes
- Nullable versus non-nullable changes
- Optional versus required changes
- New schema families that need a new section in `docs/APIMAPPING.md`

## What Usually Does Not Need A Doc Update

- Property order only
- Formatting only
- Reordered `required` arrays with no semantic change

## Frontend Impact Map

Check these places when the contract changes:

- `app/lib/**/definitions.ts` for DTO and label drift
- `app/api/**/action.ts` for payload shape drift
- `app/(main)/**/page.tsx` and feature client components for render drift
- `config/site.ts` if a new endpoint introduces a new feature surface or permission-aware navigation
- `docs/APIMAPPING.md` for frontend ownership, implementation status, and drift notes

## Suggested Reading Order

1. Fresh JSON from the authoritative OpenAPI endpoint declared in `SKILL.md`
2. `docs/APIMAPPING.md`
3. affected frontend files under `app/lib`, `app/api`, and `app/(main)`

## Reporting Pattern

1. Confirm the backend contract change.
2. Update `docs/APIMAPPING.md`.
3. Explain frontend impact.
4. Only edit frontend code when the user explicitly asks for integration.
