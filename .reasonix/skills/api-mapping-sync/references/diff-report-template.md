# Diff Report Template

Use this shape when the user asks to update `docs/APIMAPPING.md` from `docs/api_mapping.json` and wants diffs.

## Summary

- State whether `docs/APIMAPPING.md` was already aligned or was updated.
- Mention the backend snapshot source: `docs/api_mapping.json`.
- Mention the comparison target: `docs/APIMAPPING.md`.

## Contract Diffs

Group confirmed backend differences by category:

- New endpoints
- Removed endpoints
- Changed endpoint methods, params, or operationIds
- New schemas
- Removed schemas
- Changed schema fields or enums
- Permission or status notes that matter to FE

When there are many changes, prioritize frontend-relevant changes and avoid dumping the full OpenAPI document.

## APIMAPPING.md Updates

List the documentation edits made:

- sections updated
- endpoint rows changed
- status or frontend integration notes changed
- known drift notes changed

## Frontend Impact

Map the contract drift to likely frontend locations:

- `app/lib/**/definitions.ts`
- `app/api/**/action.ts`
- `app/(main)/**`
- `config/site.ts`
- docs-only if no frontend code change was requested

## Validation

Report what was checked:

- JSON paths/schemas inspected
- `git diff -- docs/APIMAPPING.md`
- optional typecheck/lint only if frontend code changed

If no authenticated runtime test was possible, say so clearly.
