## Why

The system prompt schema builder currently falls back to JSON-only for backend-seeded schemas that are valid and accepted by the backend validator. This blocks administrators from using the structured builder on prompts that contain supported constraints such as `nullable` and `minLength`.

## What Changes

- Broaden the response schema builder's supported subset to match backend-accepted seeded schemas.
- Treat `nullable: true` as a supported schema modifier that must be preserved when editing in builder mode.
- Support string `minLength` constraints in builder mode so seeded Telegram market analysis schema can render without falling back.
- Recognize simple nullable type arrays such as `["string", "null"]` as equivalent to a supported base type plus nullable.
- Keep JSON-only fallback for genuinely unsupported structural keywords such as `$ref`, `oneOf`, `anyOf`, `allOf`, and conditional schema constructs.
- Add focused coverage for the backend seed cases that triggered the fallback.

## Capabilities

### New Capabilities
- `system-prompt-schema-builder-constraints`: Covers backend-compatible schema constraints that the system prompt builder must render, preserve, and submit safely.

### Modified Capabilities

None.

## Impact

- Affected UI/schema helper code:
  - `app/[lang]/(main)/system-prompts/system-prompt-schema.ts`
  - `app/[lang]/(main)/system-prompts/system-prompt-response-schema-editor.tsx`
- Affected localized copy if new labels or field descriptions are needed:
  - `app/lib/i18n/dictionaries/vi.ts`
  - `app/lib/i18n/dictionaries/en.ts`
- No backend API or seed change is required.
- No new dependency is expected.
