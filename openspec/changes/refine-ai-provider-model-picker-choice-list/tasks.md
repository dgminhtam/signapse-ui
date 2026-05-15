## 1. Shadcn Wrapper Setup

- [x] 1.1 Run `pnpm dlx shadcn@latest add scroll-area radio-group --dry-run` and confirm only the two missing shadcn wrapper files are created.
- [x] 1.2 Add `scroll-area` and `radio-group` through the shadcn CLI, then review the generated wrapper files for expected `radix-nova` composition and imports.

## 2. Model Picker Refactor

- [x] 2.1 Update `app/(main)/ai-provider-configs/ai-provider-model-picker-dialog.tsx` imports to use `ScrollArea`, `RadioGroup`, `RadioGroupItem`, and the needed `Field` primitives.
- [x] 2.2 Replace the populated model list's custom `div overflow-y-auto` container with `ScrollArea` using only layout containment classes.
- [x] 2.3 Replace custom model option `<button>` rows and check icon state with a controlled `RadioGroup`.
- [x] 2.4 Render each model option as a shadcn choice card using `FieldLabel`, `Field orientation="horizontal"`, `FieldContent`, `FieldTitle`, `FieldDescription`, and `RadioGroupItem`.
- [x] 2.5 Preserve long model id readability without adding custom row chrome that overrides shadcn height, radius, border, hover, selected, shadow, or color treatment.
- [x] 2.6 Preserve empty state behavior, selected model initialization, disabled confirm state, confirm callback, and Vietnamese dialog copy.

## 3. Verification

- [x] 3.1 Run targeted lint for the model picker dialog and the two added shadcn wrapper files.
- [x] 3.2 Run `pnpm typecheck`.
- [ ] 3.3 Smoke review the AI provider model picker dialog when a browser/authenticated local app state is available, checking that the list scrolls inside the dialog and selected radio choice cards match shadcn Nova.
- [x] 3.4 Run `openspec validate refine-ai-provider-model-picker-choice-list --strict`.
