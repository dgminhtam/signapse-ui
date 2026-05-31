## 1. Contract Alignment

- [x] 1.1 Update `app/lib/system-prompts/definitions.ts` with the current backend prompt type enum, `JsonValue`, `name`, `localizedNames`, `responseSchema`, and create/update request payloads.
- [x] 1.2 Update system prompt label helpers to prefer localized backend names, then backend `name`, then dictionary label, then raw `promptType`.
- [x] 1.3 Update Vietnamese and English dictionaries with current prompt type labels, workflow groups, localized-name copy, schema editor copy, validation messages, and tab labels.
- [x] 1.4 Update `app/api/system-prompts/action.ts` types and payload usage without changing the existing `fetchAuthenticated()` and route revalidation behavior.

## 2. Response Schema Utilities

- [x] 2.1 Add feature-local schema helpers for minimal object schema creation, JSON stringify formatting, JSON parse error handling, supported-subset detection, and safe cloning.
- [x] 2.2 Model the supported schema subset for object, array, string, number, boolean, enum values, min/max constraints, required fields, and map-like `additionalProperties`.
- [x] 2.3 Ensure unsupported JSON Schema keywords are preserved when editing through JSON mode and are not silently dropped by builder mode.

## 3. Schema Editor UI

- [x] 3.1 Add a feature-local response schema editor composed from existing shadcn wrappers, with builder and JSON tabs sharing one parsed schema value.
- [x] 3.2 Implement recursive builder rows for object properties, required toggles, type selection, nested array items, and map item schemas.
- [x] 3.3 Implement primitive constraint controls for string enum values and number `minimum`/`maximum` values.
- [x] 3.4 Implement raw JSON editing with parse/apply behavior, field-level validation errors, and no mutation submit while JSON is malformed.
- [x] 3.5 Add builder fallback state that directs users to JSON mode when the schema cannot be represented by the supported subset.

## 4. System Prompt Forms And List

- [x] 4.1 Update the create/edit form value model to include `localizedNames`, prompt content, parsed `responseSchema`, and JSON validation state.
- [x] 4.2 Update create form defaults so `promptType` uses a current backend enum value and `responseSchema` starts as a valid minimal object schema.
- [x] 4.3 Update edit form load, cancel, and reset behavior so localized names, content, and response schema all return to initial backend values.
- [x] 4.4 Update create/update submit handlers to send trimmed content, parsed response schema, and edited localized names, then preserve the existing localized redirect and refresh flow.
- [x] 4.5 Update the system prompt list to display localized prompt identity, keep raw `promptType` as technical metadata, and account for schema/name fields in relevant search or display behavior.
- [x] 4.6 Update skeletons and form layout so the schema editor does not cause avoidable layout shift and remains within the focused form shell.

## 5. Documentation And Verification

- [x] 5.1 Update `docs/APIMAPPING.md` so the system prompt section reflects the current enum values and `name`/`localizedNames`/`responseSchema` payload support from `docs/api_mapping.json`.
- [x] 5.2 Run a static search to confirm removed legacy prompt type defaults and labels are not still used in active frontend code.
- [x] 5.3 Run targeted lint for system prompt frontend files and shared files touched by this change.
- [x] 5.4 Run `pnpm typecheck`.
- [x] 5.5 Run `openspec validate sync-system-prompt-schema-editor --strict`.
- [x] 5.6 Perform a deterministic review of create/update payload construction, JSON parse failure handling, localized routing, and shadcn composition invariants.
