## Context

The system prompt response schema editor introduced a deliberately small builder subset: object, array, string, number, boolean, object properties, required fields, `additionalProperties`, string enum, and number min/max. That subset covers many seeded prompts, including the narrative refresh schema, but the support check is stricter than the backend contract because it rejects any schema keyword outside a per-type whitelist.

Backend seed data currently includes valid schemas with `nullable: true` and `minLength`. The backend validator accepts those keywords and also supports `type` as an array of strings, including `null`. The frontend therefore misclassifies some valid backend-owned schemas as unsupported and sends users to JSON mode even when the builder could safely render and preserve them.

## Goals / Non-Goals

**Goals:**

- Let builder mode render backend-seeded schemas that use `nullable: true` or string `minLength`.
- Preserve supported constraints when users edit nearby fields in builder mode.
- Treat simple nullable type arrays as a supported representation of nullable fields.
- Keep the JSON-only fallback for structural schema constructs outside the builder subset.
- Keep the change local to the system prompt schema editor and helper layer.

**Non-Goals:**

- Build a complete JSON Schema editor.
- Add external validation or code editor dependencies.
- Change backend validation, seed data, or API serialization.
- Add support for `$ref`, `oneOf`, `anyOf`, `allOf`, conditional schemas, tuple arrays, or arbitrary annotation keywords in this change.

## Decisions

### 1. Normalize builder type separately from raw schema storage

The helper layer should continue storing the raw parsed schema object, but builder rendering should resolve a normalized view: base builder type plus nullable flag. A schema with `type: "string"` and `nullable: true` and a schema with `type: ["string", "null"]` both resolve to a string builder node with nullable enabled.

Alternative considered: rewrite all incoming schemas into one canonical shape. That risks changing persisted schema formatting and creates unnecessary payload churn. Normalizing only for rendering keeps the raw schema stable unless the user edits it.

### 2. Add globally supported nullable handling

`nullable` should be accepted on every supported node type because the backend validator checks it for null values regardless of base type. Builder edits should preserve the flag when changing labels, required state, enum values, min/max, items, or object children. If the user changes a node to a different type, nullable can stay because it is type-independent.

Alternative considered: support nullable only on the `event` object seed field. That would fix one prompt but leave the frontend out of sync with backend validator behavior.

### 3. Add string minLength as a first-class string constraint

String schemas should accept `minLength` when it is a number. Builder mode should expose a compact numeric control for it, similar in spirit to number `minimum` and `maximum`. Empty input removes `minLength`; invalid numeric input should not be submitted as a schema mutation.

Alternative considered: merely allow `minLength` as pass-through metadata with no UI. That would render the builder but make the constraint invisible and easy to accidentally drop during edits.

### 4. Keep strict fallback for unsupported structural keywords

The builder should continue to return JSON-only for schemas containing structural keywords that can change validation semantics in ways the UI cannot express. Examples include `$ref`, `oneOf`, `anyOf`, `allOf`, `not`, `if`, `then`, and `else`.

Alternative considered: allow every unknown keyword as pass-through. That would avoid fallback but could give users false confidence that the builder fully understands the schema they are editing.

## Risks / Trade-offs

- Constraint drift between FE and BE -> Mitigate by basing the allowed keywords on the current backend validator and seed file, then adding static fixture checks for the known seed keywords.
- Raw type array preservation is subtle -> Mitigate by only supporting simple arrays with one supported non-null type plus `null`; other type arrays remain JSON-only.
- Builder controls can become visually crowded -> Mitigate by adding only the `minLength` string control in this change and keeping advanced structures in JSON mode.
- Unsupported keywords might still surprise users -> Mitigate by preserving the existing JSON-only notice and using it only when the builder cannot safely represent the schema.
