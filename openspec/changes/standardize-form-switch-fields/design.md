## Context

Signapse already uses shadcn primitives and focused form shells for create/update flows. The `Switch` primitive itself is not the problem; the inconsistent wrapper treatment around form switches is. Current examples include large bordered blocks with prominent labels and descriptions for secondary boolean settings, while other form fields use tighter `FieldLabel` and `FieldDescription` rhythm.

Related switch contexts already have separate rules: list/table row switches use compact status capsules, and toolbar/workbench switches align to control height. This change creates the missing rule for form and detail setting switches without mixing those density contexts.

## Goals / Non-Goals

**Goals:**

- Make boolean form settings feel like supporting fields, not mini cards.
- Keep labels readable but aligned with normal field label hierarchy.
- Reduce unnecessary description copy and vertical height.
- Ensure create/update/detail switch fields remain accessible and consistent.
- Add repo guidance so future implementation and reviews have a concrete rule.

**Non-Goals:**

- Do not modify `components/ui/switch.tsx` or other shadcn primitives.
- Do not redesign list/table row switch capsules.
- Do not redesign toolbar/workbench toggles, permission matrix switches, or Telegram route rows in this change.
- Do not change backend boolean semantics or form submission behavior.

## Decisions

1. Use an app-level composition pattern rather than changing shadcn `Switch`.
   - The shadcn primitive should remain the baseline interaction control.
   - The visual inconsistency comes from wrapper layout, typography, and copy weight.
   - If duplication is high, add a shared helper such as `AppFormSwitchField` outside `components/ui/`; otherwise apply the same composition locally.

2. Keep the switch visual size default unless the surrounding context requires a proven compact variant.
   - Default shadcn switch is familiar and touch-friendly.
   - The row becomes compact by using tighter wrapper padding and normal label typography, not by shrinking the primitive first.
   - Alternative considered: use `Switch size="sm"` everywhere. This would reduce visual weight but can make a form control feel too small compared with inputs.

3. Treat descriptions as optional supporting copy.
   - Keep a short muted description when the toggle has a side effect, broad scope, permission implication, or non-obvious consequence.
   - Remove descriptions that restate the label, such as explaining that an active toggle makes something active.
   - This follows the repo rule to minimize copy that does not help a user decide.

4. Keep scope boundaries explicit.
   - Row/table switches, toolbar switches, route rows, and dialog matrices have different scanning and density needs.
   - Pulling every `Switch` into one pattern would create a mushy all-purpose component. Tiny taxonomy, big payoff.

## Risks / Trade-offs

- [Risk] A shared helper could become too generic and start owning form behavior. -> Keep it presentational only: label, optional description, control, state styling, and IDs; no submit, mutation, or create/edit branching.
- [Risk] Removing descriptions could hide important consequences. -> Audit each description; remove only redundant copy and keep consequence-based help text.
- [Risk] Compact rows may feel cramped on narrow screens. -> Allow responsive stacking when content length requires it, while preserving the same hierarchy and accessible wiring.
- [Risk] Similar-looking switches outside forms may be accidentally migrated. -> Tasks require an explicit out-of-scope list and targeted search after migration.

## Migration Plan

1. Add or choose the shared form switch composition outside `components/ui/`.
2. Migrate matching create/update/detail switch fields to the compact treatment.
3. Update AGENTS guidance and review checklist coverage.
4. Verify with targeted search, lint/typecheck, and visual smoke review where possible.
