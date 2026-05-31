## Why

Backend `system-prompts` has moved from a content-only contract to a prompt plus output-schema contract. The current frontend can edit prompt content, but it cannot submit the required `responseSchema`, surface `name` or `localizedNames`, or handle the updated prompt type enum, so create/update flows can drift from the active backend API.

System prompts now define the expected JSON output for AI workflows. Administrators need a focused editing surface that makes that schema understandable and safe to change without forcing every edit through raw JSON.

## What Changes

- Align frontend system prompt DTOs, enum options, labels, and route validation with the latest backend snapshot.
- Add `name`, `localizedNames`, and `responseSchema` support to system prompt list/detail/create/update surfaces.
- Replace the content-only edit form with a prompt workbench that treats prompt content and output schema as first-class sections.
- Add a hybrid response schema editor:
  - structured builder for the JSON Schema subset Signapse workflows use most often;
  - raw JSON tab for advanced or unsupported schema shapes;
  - validation before submit so malformed JSON is not sent to the backend.
- Default create flow to a valid minimal object schema because `responseSchema` is required by backend create.
- Update API mapping documentation so the system prompt section reflects the current enum and payload shape.
- Preserve existing permission gates, localized routes, Vietnamese UI copy, form pending states, and delete confirmation behavior.

## Capabilities

### New Capabilities
- `system-prompt-schema-editor`: Covers contract-aligned system prompt management, including prompt metadata, response schema editing, validation, and create/update submission behavior.

### Modified Capabilities

None.

## Impact

- Affected frontend data layer:
  - `app/lib/system-prompts/definitions.ts`
  - `app/api/system-prompts/action.ts`
- Affected UI:
  - `app/[lang]/(main)/system-prompts/*`
  - `app/lib/i18n/dictionaries/*`
  - shared shadcn wrappers only through composition, not visual chrome changes
- Affected docs:
  - `docs/APIMAPPING.md`
- No backend code changes are expected.
- No new dependency is required for the MVP schema editor; a richer code editor can be proposed separately if needed.
