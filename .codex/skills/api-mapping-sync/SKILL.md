---
name: api-mapping-sync
description: Sync Signapse backend API snapshot changes into frontend-facing docs. Use when docs/api_mapping.json changes, when the backend API has been updated, when comparing docs/api_mapping.json with docs/APIMAPPING.md, or when frontend integration notes must be refreshed from the latest contract.
---

# API Mapping Sync

Keep Signapse frontend-facing API docs aligned with the latest backend snapshot in `docs/api_mapping.json`.

## Workflow

1. Load the current contract sources:
- `docs/api_mapping.json`
- `docs/APIMAPPING.md`
- any user-mentioned frontend files if the request includes code sync

2. Diff in this order:
- endpoint surface: new or removed paths, methods, and operationIds
- request and response contracts: field adds, removals, renames, enum changes, nullability, requiredness, and payload shape
- notes already documented in `docs/APIMAPPING.md`

3. Update `docs/APIMAPPING.md`:
- keep the current structure and tone
- update the verification date when the snapshot changed materially
- document only confirmed differences from `docs/api_mapping.json`
- write concise frontend-oriented notes: what changed, where it affects frontend, and whether docs or code already match
- ignore pure property reorder unless it changes semantics

4. Call out frontend impact:
- map schema drift to likely frontend types, actions, forms, list and detail renders, permissions, navigation, and labels
- if the user asked only for docs, stop after the impact summary
- if the user asked to integrate code too, update the affected frontend files after the doc change

## Focus Areas

Read [references/change-checklist.md](references/change-checklist.md) before updating large or ambiguous diffs.

## Repo Rules

- Treat `docs/api_mapping.json` as the source of truth for the current backend snapshot.
- Treat `docs/APIMAPPING.md` as the frontend integration ledger, not a full API spec.
- Preserve Vietnamese wording in `docs/APIMAPPING.md`.
- Verify exact field names, enums, and nullability directly from JSON before writing them.
- When new endpoints appear, note the route, method, purpose, and frontend ownership or status.
- When fields are renamed or removed, inspect likely impact in `app/lib`, `app/(main)`, and `app/api`.
- When reporting dates, prefer the current absolute date rather than relative wording.

## Useful Commands

- `rg -n "\"/query\"|operationId|enum|required|properties" docs/api_mapping.json`
- `rg -n "query|source-document|event|system prompt" docs/APIMAPPING.md app`
- `git diff -- docs/api_mapping.json docs/APIMAPPING.md`

## Output Expectations

- Summarize confirmed contract changes first.
- List frontend impact next.
- Mention what was updated in `docs/APIMAPPING.md`.
- Mention validation limits if frontend code was not updated or tested.
