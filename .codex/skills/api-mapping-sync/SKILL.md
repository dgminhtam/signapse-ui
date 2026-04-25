---
name: api-mapping-sync
description: Update Signapse docs/APIMAPPING.md from docs/api_mapping.json and report exact API/documentation diffs. Use when api_mapping.json changes, when backend APIs are updated, when APIMAPPING.md must be refreshed, or when the user asks what changed between the backend contract and frontend mapping docs.
---

# API Mapping Sync

Keep Signapse frontend-facing API docs aligned with the latest backend snapshot in `docs/api_mapping.json`.

## Workflow

1. Load the current mapping sources:
- `docs/api_mapping.json`
- `docs/APIMAPPING.md`
- any user-mentioned frontend files if the request includes code sync

2. Compare `api_mapping.json` against `APIMAPPING.md`, not just against git history:
- endpoint surface: new or removed paths, methods, and operationIds
- request and response contracts: field adds, removals, renames, enum changes, nullability, requiredness, and payload shape
- implementation status already documented in `docs/APIMAPPING.md`
- documented frontend ownership, known drift, and permission notes

3. Update `docs/APIMAPPING.md`:
- keep the current structure and tone
- update the verification date when the snapshot changed materially
- document only confirmed differences from `docs/api_mapping.json`
- write concise frontend-oriented notes: what changed, where it affects frontend, and whether docs or code already match
- ignore pure property reorder unless it changes semantics

4. Report diffs after editing:
- confirmed backend contract differences
- APIMAPPING.md changes made
- frontend impact or follow-up code work
- validation limits

5. Call out frontend impact:
- map schema drift to likely frontend types, actions, forms, list and detail renders, permissions, navigation, and labels
- if the user asked only for docs, stop after the impact summary
- if the user asked to integrate code too, update the affected frontend files after the doc change

## Focus Areas

Read [references/change-checklist.md](references/change-checklist.md) before updating large or ambiguous diffs.
Use [references/diff-report-template.md](references/diff-report-template.md) for the final response when the user asks for diffs.

## Repo Rules

- Treat `docs/api_mapping.json` as the source of truth for the current backend snapshot.
- Treat `docs/APIMAPPING.md` as the frontend integration ledger, not a full API spec.
- Preserve Vietnamese wording in `docs/APIMAPPING.md`.
- Verify exact field names, enums, and nullability directly from JSON before writing them.
- When new endpoints appear, note the route, method, purpose, and frontend ownership or status.
- When fields are renamed or removed, inspect likely impact in `app/lib`, `app/(main)`, and `app/api`.
- When reporting dates, prefer the current absolute date rather than relative wording.
- Never claim frontend code is integrated only because an endpoint exists in `api_mapping.json`; confirm matching actions, definitions, routes, or UI first.
- If a previous comparison only used git history, redo the comparison against `docs/APIMAPPING.md` before updating docs.

## Useful Commands

- `rg -n "\"/query\"|operationId|enum|required|properties" docs/api_mapping.json`
- `rg -n "query|source-document|event|system prompt" docs/APIMAPPING.md app`
- `git diff -- docs/api_mapping.json docs/APIMAPPING.md`
- `git diff -- docs/APIMAPPING.md`

## Output Expectations

- Summarize confirmed contract changes first.
- List `docs/APIMAPPING.md` updates next.
- List frontend impact or remaining drift next.
- Mention what was updated in `docs/APIMAPPING.md`.
- Mention validation limits if frontend code was not updated or tested.
