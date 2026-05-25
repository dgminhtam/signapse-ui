## 1. Schema Support

- [x] 1.1 Add a normalized schema type helper that accepts string `type` and simple nullable type arrays while preserving the raw schema value.
- [x] 1.2 Extend supported-key checks so `nullable` is accepted on supported schema nodes and unsupported structural keywords still force JSON-only mode.
- [x] 1.3 Add string `minLength` parsing, formatting, and validation helpers alongside existing enum/minimum/maximum helpers.
- [x] 1.4 Add deterministic fixture coverage or an equivalent helper check for backend seed schemas containing `nullable` and `minLength`.

## 2. Builder UI

- [x] 2.1 Render a localized nullable control for supported schema nodes and preserve nullable state during builder edits.
- [x] 2.2 Render a localized `minLength` control for string schemas and update the parsed schema as a number or remove it when cleared.
- [x] 2.3 Keep type changes from carrying incompatible constraints while preserving type-independent nullable semantics.
- [x] 2.4 Confirm unsupported structural schemas still show the existing JSON-only fallback without losing parsed schema data.

## 3. Localized Copy

- [x] 3.1 Add Vietnamese and English dictionary entries for any new nullable or string-length labels, descriptions, or validation errors.
- [x] 3.2 Review system prompt schema editor copy to ensure the UI remains Vietnamese-first in the app surface.

## 4. Verification

- [x] 4.1 Run `pnpm typecheck`.
- [x] 4.2 Run targeted lint for `app/[lang]/(main)/system-prompts` and affected dictionaries.
- [x] 4.3 Run `openspec validate fix-system-prompt-schema-builder-constraints --strict`.
- [x] 4.4 Run a deterministic review confirming backend-seeded `NEWS_PRIMARY_EVENT_DERIVATION` and `TELEGRAM_MARKET_ANALYSIS` schemas are buildable while `$ref`/`oneOf` style schemas remain JSON-only.
