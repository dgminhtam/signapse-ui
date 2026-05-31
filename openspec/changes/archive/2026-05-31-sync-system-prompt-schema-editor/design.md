## Context

The current system prompt module was built around a simple backend contract: `promptType` plus `content`. The latest backend snapshot changes that surface into a prompt contract editor: responses now include `name`, `localizedNames`, and `responseSchema`, while create requires `responseSchema` and update can change `content`, `responseSchema`, and `localizedNames`.

The target user is an administrator or operator with enough technical context to manage AI workflow output contracts. They need to see and edit the prompt text, but they also need to understand the JSON shape the AI is expected to return. The schema example for narrative refresh contains nested objects, arrays, enums, required fields, min/max constraints, and map-like localized payloads via `additionalProperties`.

The repo constraints are important:

- App routes live under `app/[lang]` and user-facing copy comes from dictionaries.
- System prompt endpoints require Clerk JWT and must continue using `fetchAuthenticated()`.
- Forms use focused form shells and shadcn wrappers from `@/components/ui`.
- The system prompt screen should remain an admin tool, not a marketing-like or decorative interface.

## Goals / Non-Goals

**Goals:**

- Align system prompt types and request/response definitions with the current backend snapshot.
- Let users create and update prompt content, localized names, and response schema.
- Provide a schema builder that covers the JSON Schema subset currently needed by Signapse AI workflow contracts.
- Provide a JSON tab so advanced or unsupported schema shapes remain operable.
- Validate raw JSON before submit and prevent malformed schema payloads from reaching the backend.
- Keep the screen consistent with existing Signapse form, shadcn, i18n, and permission patterns.

**Non-Goals:**

- Build a complete JSON Schema authoring product for every draft keyword.
- Validate sample AI output against `responseSchema`.
- Introduce Monaco, CodeMirror, AJV, or another editor/validator dependency in this MVP.
- Change backend API behavior or prompt execution semantics.
- Redesign the whole system prompt list page beyond the fields and labels needed for the new contract.

## Decisions

### 1. Model the backend contract directly

Frontend definitions will add a narrow JSON value type and update system prompt DTOs to include `name`, `localizedNames`, and `responseSchema`. Create requests will include `promptType`, trimmed `content`, parsed `responseSchema`, and optional `localizedNames`. Update requests will include trimmed `content`, parsed `responseSchema`, and optional `localizedNames`.

Alternative considered: keep `responseSchema` as `Record<string, unknown>` everywhere. That is quick, but it hides arrays, primitives, and null at type boundaries. A small `JsonValue` type is more honest without over-modeling backend `JsonNode`.

### 2. Treat prompt content and response schema as sibling form sections

The edit/create surface should remain a focused form shell, with metadata first, prompt content second, and response schema third. The schema section owns its own tabs: `Trinh dung` and `JSON`. This avoids a top-level tab structure where saving, validation, and required fields can become hidden across separate pages.

Alternative considered: make `Prompt` and `Schema` top-level tabs like the reference image. That works for a small modal, but in this admin form it risks hiding required schema errors while users are editing prompt text.

### 3. Implement a Signapse subset schema builder

The builder will support the schema constructs already present in backend examples:

- `object` with `properties`, `required`, and `additionalProperties`;
- `array` with `items`;
- `string` with optional `enum`;
- `number` with optional `minimum` and `maximum`;
- `boolean`;
- map object via `additionalProperties: <schema>`.

Unsupported schema keywords will be preserved through the JSON tab. If a schema cannot be represented safely in the builder, the builder should show a JSON-only notice instead of silently dropping unknown data.

Alternative considered: build a fully generic recursive JSON Schema editor. That would expand scope sharply and invite partial or incorrect draft support. The subset approach matches current product needs and keeps the UI understandable.

### 4. Use one parsed schema source of truth

The form should keep the parsed `responseSchema` as the canonical value. The JSON tab maintains text derived from the parsed value, and only updates the parsed value after successful JSON parse. Submit always sends the parsed value, never unchecked text.

Alternative considered: keep builder state and JSON text as separate states and reconcile on submit. That creates drift risk and makes cancel/reset behavior harder.

### 5. Display localized names without replacing stable identifiers

List and edit surfaces should prefer `localizedNames[currentLanguage]`, then `name`, then dictionary label, then raw `promptType`. The raw `promptType` remains visible as low-priority technical metadata because it is still the route and backend identifier.

Alternative considered: rely only on backend `name`. That would ignore locale-specific labels and lose the existing dictionary fallback when backend data is incomplete.

### 6. Keep shadcn composition local to feature code

The schema editor should compose existing wrappers: `FieldGroup`, `FieldSet`, `Tabs`, `Select`, `Button`, `Tooltip`, `Collapsible`, `Badge`, `InputGroup`, `ScrollArea`, and `Spinner`. It should not patch `components/ui/*` or override component chrome to mimic the dark reference image.

Alternative considered: add or modify a visual builder component library. That adds dependency and styling risk before the product shape is proven.

## Risks / Trade-offs

- Unsupported schema loss -> Mitigate by JSON-only fallback for unsupported shapes and by preserving raw parsed schema until JSON edits are valid.
- Builder complexity grows with nested schemas -> Mitigate by supporting only the documented subset and using recursive components with clear depth indentation.
- Create flow fails if schema is empty -> Mitigate by defaulting create to `{ "type": "object", "additionalProperties": false, "properties": {} }`.
- Users may expect builder validation to prove schema correctness -> Mitigate by copy and validation states that distinguish JSON parse validity from full JSON Schema validation.
- APIMAPPING drift remains misleading -> Mitigate by updating the system prompt section from `docs/api_mapping.json` as part of implementation.

## Migration Plan

1. Update types, enum constants, labels, helpers, and actions to match the backend snapshot.
2. Add schema parse/format helpers and the response schema editor components under the system prompt feature boundary.
3. Update create/edit forms to submit `responseSchema` and `localizedNames`.
4. Update list/detail labels and search fields to account for backend names where supported.
5. Update `docs/APIMAPPING.md` for current system prompt enum and payload drift.
6. Validate with typecheck, OpenSpec validation, static searches for removed prompt types, and a deterministic review of create/update payloads.

## Open Questions

- Should `localizedNames` be limited to configured app locales (`vi`, `en`) in the first implementation, or should the form allow arbitrary locale keys?
- Should backend treat omitted `localizedNames` on update as "unchanged" or "clear all"? Implementation should avoid sending an empty object unless the user has explicitly edited localized names.
