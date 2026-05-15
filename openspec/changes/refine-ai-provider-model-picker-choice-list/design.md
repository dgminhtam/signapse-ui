## Context

The AI provider model picker dialog currently renders model options as custom `<button>` rows inside a plain `div` with `overflow-y-auto`. This works functionally, but it duplicates state and chrome that shadcn already provides through `RadioGroup`, `Field`, and `ScrollArea`.

The repo has recently standardized on the shadcn `radix-nova` preset and `AGENTS.md` now asks feature code to prefer wrapper defaults over custom height, radius, border, hover, selected, and typography treatments. The current model picker list is therefore a good candidate for a small focused cleanup.

`components/ui/scroll-area.tsx` and `components/ui/radio-group.tsx` are not installed yet. The shadcn dry-run indicates both can be added as new wrapper files. The implementation should add them through the shadcn CLI rather than importing Radix directly in feature code.

## Goals / Non-Goals

**Goals:**

- Use shadcn `ScrollArea` for the model list's scrollable region.
- Use shadcn `RadioGroup` and `RadioGroupItem` for selected model state, keyboard behavior, focus, and accessible radio semantics.
- Use shadcn `Field` choice-card composition for each model item so the selected treatment comes from the wrapper pattern rather than custom row styling.
- Preserve existing model option data, selected model initialization, confirm action, empty state, and Vietnamese dialog copy.
- Keep dialog containment classes that are layout-only, such as max height and responsive width.

**Non-Goals:**

- Do not change backend AI provider APIs, model catalog DTOs, credential validation, or per-credential model business rules.
- Do not redesign the full credential panel or create/update forms.
- Do not change global theme tokens, dialog wrapper internals, or existing shadcn wrapper files other than adding `scroll-area` and `radio-group`.
- Do not add external UI libraries or import Radix primitives outside `components/ui/*`.

## Decisions

### Add the missing shadcn wrappers before composing the dialog

Use `pnpm dlx shadcn@latest add scroll-area radio-group` to create `components/ui/scroll-area.tsx` and `components/ui/radio-group.tsx`.

Rationale: this follows the repo rule that app code imports shadcn wrappers from `@/components/ui/` rather than primitive libraries. It also keeps generated wrapper chrome aligned with the current `radix-nova` baseline.

Alternative considered: import Radix ScrollArea or RadioGroup directly in the model picker. Rejected because app/feature code must not import primitive libraries directly when a shadcn wrapper can be installed.

### Let Field choice-card composition own row chrome

Render each model option as:

- `FieldLabel htmlFor=<radio id>`
- `Field orientation="horizontal"`
- `FieldContent`
- `FieldTitle` for `model.label || model.id`
- `FieldDescription` for `model.id` when it differs from the label
- `RadioGroupItem value=<model.id> id=<radio id>`

Rationale: the `FieldLabel` wrapper already supplies the border, radius, padding, and checked-state treatment for fields containing a checked radio. This is closer to the shadcn template and avoids custom `rounded-lg border px-4 py-3 hover:*` row classes.

Alternative considered: keep custom row buttons but place them inside `ScrollArea`. Rejected because it solves only the scrollbar issue and leaves item selection as custom UI.

### Use ScrollArea for containment, not decorative chrome

Wrap the populated list in `ScrollArea` with layout-only height constraints such as `max-h-[min(56vh,480px)]` and `min-h-0`. Avoid adding a second decorative border around the list when each choice-card item already has a border.

Rationale: a bordered `ScrollArea` plus bordered choice cards can look visually heavy and less like the shadcn choice-card example. The scroll container should solve overflow and scrollbar styling; the choice item should own item boundaries.

Alternative considered: copy the docs sample exactly with `rounded-md border p-4` on `ScrollArea`. That is useful for plain text examples, but this dialog already has bordered choice cards and a dialog surface.

### Keep business flow unchanged

The dialog still initializes from `currentModel`, disables confirm when no model is selected, calls `onConfirm(selectedModel)`, and delegates closing behavior to the parent flow.

Rationale: the requested change is presentation and interaction semantics for the list, not a change to credential validation or model catalog logic.

## Risks / Trade-offs

- Radio semantics change the underlying DOM from buttons to radio items -> mitigate by using controlled `RadioGroup` and keeping the same selected string value.
- Long model IDs may create horizontal overflow -> mitigate by keeping break/truncation behavior on title/description wrappers where needed without changing component chrome.
- Adding wrappers changes the local component inventory -> mitigate with shadcn CLI dry-run/view, targeted lint, and typecheck.
- Browser smoke may still be limited by missing local authenticated browser runtime -> mitigate by documenting any skipped visual smoke in apply summary.

## Migration Plan

1. Add `scroll-area` and `radio-group` through the shadcn CLI.
2. Refactor the model picker dialog list from custom button rows to `ScrollArea` containing a controlled `RadioGroup`.
3. Compose model items with `FieldLabel`, `Field`, `FieldContent`, `FieldTitle`, `FieldDescription`, and `RadioGroupItem`.
4. Preserve empty state behavior and confirm button behavior.
5. Verify with targeted lint, typecheck, and visual/browser smoke when available.

Rollback is a normal git revert of the dialog file and the two added wrapper files.

## Open Questions

- None for implementation. The chosen pattern follows the user's requested shadcn examples and keeps scope local to the model picker dialog.
