## Context

The news outlet create/edit form now matches the simplified backend contract, but several user-facing strings remain unaccented or mojibake, including form title, description, labels, helper text, toast messages, and action copy. The form also uses shadcn `Field` validation state but does not pass `aria-invalid` to each input control.

This change is intentionally a form-quality pass. It should make the current form more professional and accessible without changing route semantics, permissions, DTOs, or backend integration.

## Goals / Non-Goals

**Goals:**
- Replace broken or unaccented Vietnamese copy in the news outlet form surface with professional Vietnamese text.
- Ensure each editable `Input` and `Textarea` exposes `aria-invalid` based on its field validation state.
- Keep the existing focused form shell, field set grouping, submit/cancel behavior, and redirect flow.

**Non-Goals:**
- Redesign `/news-outlets/{id}` into a read-only detail page.
- Change breadcrumb behavior, route names, permissions, or API mapping status.
- Change the news outlet DTO/payload shape.
- Refactor shared shadcn primitives or global theme tokens.

## Decisions

- Fix copy locally in the news outlet form surface.
  - Rationale: the broken strings are localized to this feature and do not require a shared i18n abstraction.
  - Alternative considered: introduce a centralized translation table. That would be heavier than the scope of two review findings.

- Add `aria-invalid={fieldState.invalid}` directly to each form control.
  - Rationale: this matches the repo's shadcn rule: `data-invalid` belongs on `Field`, while `aria-invalid` belongs on the control.
  - Alternative considered: rely only on visible `FieldError`. That is weaker for assistive technology and does not satisfy the local shadcn guidance.

- Keep current form layout unchanged except where copy length requires natural wrapping.
  - Rationale: the approved findings are about text quality and validation semantics, not information architecture.
  - Alternative considered: redesign the detail/edit surface. That belongs in a separate proposal if approved.

## Risks / Trade-offs

- Longer accented Vietnamese strings can wrap differently -> keep copy concise and verify text does not overflow buttons, field labels, helper text, or metadata cards.
- Adding `aria-invalid` without visible error wiring would be incomplete -> preserve existing `FieldError` behavior and only add semantic state.
- Scope creep into detail-vs-edit route semantics -> leave route/permission changes untouched in this proposal.
