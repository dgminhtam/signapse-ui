## Why

Switch fields in create, update, and detail setting surfaces are currently heavier than neighboring form fields: some use card-like borders, large labels, persistent descriptions, and tall padding. This makes supporting boolean settings compete with primary inputs and creates uneven form rhythm.

## What Changes

- Introduce a consistent compact treatment for form/detail switch fields: horizontal label/content on the left, switch on the right, default shadcn switch primitive, compact border/padding, and no heading-sized label.
- Standardize all similar create/update switch fields currently found in AI provider config, news outlet, and blog forms.
- Add AGENTS guidance for create/update/detail switch fields so future screens do not reintroduce oversized switch cards.
- Keep descriptions only when they add consequence, scope, or safety context; remove descriptions that merely repeat the label.
- Preserve accessible labels, description wiring, disabled states, and pending behavior.
- Exclude list/table row switch capsules, toolbar/workbench toggles, dialog permission matrices, and route rows from this form-field cleanup unless they are later redesigned under their own scope.

## Capabilities

### New Capabilities

- `form-switch-fields`: Covers compact, accessible, and scope-bounded switch field treatment for create/update/detail forms and detail setting panels.

### Modified Capabilities

- None.

## Impact

- Affected guidance: `AGENTS.md`.
- Expected implementation touchpoints: AI provider config create/update forms, blog create/update forms, news outlet create/update shared field primitives, and any newly discovered create/update/detail switch fields that match the oversized form-field pattern.
- Possible shared app component: an app-level switch field helper outside `components/ui/` if it reduces duplication without owning submit behavior.
- No backend API, dependency, route contract, or shadcn primitive changes.
