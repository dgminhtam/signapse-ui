## Context

The active AI provider contract change moved validation and model selection onto each credential. The resulting UI is functionally correct, but the row layout currently gives equal visual weight to section legends, row labels, helper text, model copy, and actions. This makes a simple operator task feel larger than it is.

The target surface is an admin form/detail editor, so the best direction is restrained density: keep the required validation path obvious, reduce repeated explanations, and align the API key and model controls into one compact row when viewport width allows.

## Goals / Non-Goals

**Goals:**

- Make credential rows faster to scan without hiding required validation.
- Rename the create form section from `Credential ban đầu` to `API key và model`.
- Make row indexes such as `Credential 1` secondary, not heading-like.
- Put model validation and delete actions in the row header action area.
- Show selected model in an input-height summary surface beside the API key input on desktop.
- Keep mobile layout readable by stacking fields and actions naturally.
- Use existing shadcn primitives, semantic tokens, Lucide icons, and Signapse form conventions.

**Non-Goals:**

- No changes to AI provider API contracts, server actions, validation business rules, permissions, or model catalog behavior.
- No new shared `components/ui` primitives.
- No global theme/sidebar changes.
- No decorative redesign, new color palette, or larger form shell refactor.

## Decisions

1. **Use `API key và model` as the create section legend.**

   This copy names the actual data pair the user must provide. It is clearer than `Credential ban đầu`, which sounds like a lifecycle concept and also became visually too prominent.

   Alternative considered: `Danh sách credential`. That is accurate but less task-focused for a create flow where the user is entering API keys and selecting models.

2. **Demote row identity to secondary metadata.**

   `Credential 1`, `Credential 2`, and similar row indexes should use a muted, small treatment. They orient the user but should not compete with field labels or model state.

   Alternative considered: removing row labels completely. That saves space, but weakens orientation when multiple credentials are present.

3. **Move validation action into the row header.**

   The model catalog action belongs beside delete because both operate on the credential row as a whole. The button should use `KeyRound`, `data-icon="inline-start"`, and compact copy:

   - `Chọn model` when no model is selected.
   - `Đổi model` when a model is already selected.
   - `Đang kiểm tra...` while catalog validation is pending.

   Alternative considered: keeping the action inside the model field. That made the field stack taller and forced extra explanatory text.

4. **Represent selected model as a compact field-like summary.**

   The model display should be visually aligned with `Input` height on desktop, with `truncate` or `break-all` handling for long model ids. Empty state can simply read `Chưa chọn model`; it does not need a large icon or dashed panel.

   Alternative considered: leaving the dashed model box. It communicates an empty/drop-zone concept, but the model selection is not drag/drop and the height is out of proportion to the input.

5. **Remove repeated row helper text.**

   The row does not need `Model được lưu trực tiếp trên credential này.` or `Xác thực credential để tải catalog model.` once the section legend, field labels, and `Chọn model` action are clear.

   Alternative considered: keeping one helper text per row. It still becomes noisy when users add multiple credentials.

## Risks / Trade-offs

- Compactness could make validation rules less explicit -> Keep required marks, disabled submit behavior, inline field errors, and clear toast messages.
- Long model ids could make the row overflow -> Use `min-w-0`, truncation, or wrapping in the model summary surface.
- Header action cluster could crowd on mobile -> Stack header content and actions with `flex-col` to preserve hit targets.
- Existing credential update flow has more metadata -> Apply the compact input/model/action pattern only to the editable update controls, while preserving saved model, key preview, and time metadata display.

## Migration Plan

1. Update create credential row hierarchy, section legend, action cluster, and model summary surface.
2. Update credential panel add/update controls to use the same compact model action and summary pattern.
3. Update create skeleton where it mirrors credential row layout.
4. Run TypeScript and targeted lint for AI provider files.
5. Smoke review create with one/multiple credentials and credential panel add/update model selection.

Rollback is a normal frontend revert of this change. No data migration is required.

## Open Questions

- Should the model summary surface be implemented inline in each form, or extracted as a local feature helper such as `CredentialModelSummary` if duplication appears between create and edit credential flows?
