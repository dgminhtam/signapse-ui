## Context

The market chart toolbar already uses a compact switch control where the label and switch live inside one bordered control surface. The news outlet list active control currently places status text, switch, and pending spinner as separate inline pieces inside a table cell. That makes the control feel visually less intentional and increases the chance of row-width jitter when mutation feedback appears.

This change applies the same capsule language to list-table boolean row states while keeping the list context distinct: the label inside a row capsule represents the current state, because the table header already names the field.

## Goals / Non-Goals

**Goals:**

- Make the news outlet active switch look like one coherent row control.
- Add reusable repo rules for inline boolean switches in list/table rows.
- Preserve accessibility, permission disabled state, mutation feedback, and skeleton fidelity.
- Keep table density appropriate for admin list scanning.

**Non-Goals:**

- Do not change the global shadcn `Switch` primitive.
- Do not create a new shared component unless implementation reveals repeated usage that needs it.
- Do not redesign form switches, dialog switches, or toolbar switches outside list/table row contexts.
- Do not change backend active/toggle APIs.

## Decisions

1. Use a row-level capsule, not loose label plus switch.
   - The list control should render as an `inline-flex` capsule with stable height, border, subtle background, status text, and `Switch`.
   - Rationale: this mirrors the market chart switch treatment without making the table cell feel like a form section.
   - Alternative considered: keep the current label and switch but tweak spacing. That improves density only slightly and does not solve the “loose pieces” feel.

2. Use state labels inside list capsules.
   - News outlet rows should label the current state as `Đang bật` or `Tạm dừng`.
   - Rationale: the table header already says `Kích hoạt`, so repeating a field label inside every row is lower value than showing the current state.
   - Alternative considered: use a static label like `Nguồn tin`. That follows toolbar controls, but it is less useful for quick row scanning.

3. Keep pending feedback stable.
   - The capsule should not grow or shift when a toggle mutation is pending. Pending can be shown by disabling/dimming the capsule and using a reserved spinner slot, or by a fixed-size spinner overlay/slot.
   - Rationale: list rows should remain stable during fast inline mutations.
   - Alternative considered: show a toast only. Toast is useful after completion but does not tell the row is currently busy.

4. Add rules at the repo guidance level.
   - Add list/table switch guidance to `AGENTS.md` so future list screens use the same treatment.
   - Rationale: the user explicitly wants this pattern to apply beyond the news outlet list.
   - Alternative considered: document only in this OpenSpec change. That would not guide future work once this change is archived.

## Risks / Trade-offs

- Wider row control could squeeze narrow table layouts. → Keep a fixed or max width suited to the column, and preserve horizontal scroll as the fallback for small viewports.
- A capsule could look like a filter toolbar control if copied too literally. → Use status text, compact width, and centered table-cell alignment to keep the row-action meaning clear.
- Pending indicator may add visual noise in dense lists. → Reserve it only for the row being toggled and keep it small/subtle.
