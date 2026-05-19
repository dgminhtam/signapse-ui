## 1. Guidance

- [x] 1.1 Add AGENTS.md guidance for create/update/detail switch fields to use compact form treatment.
- [x] 1.2 Clarify in AGENTS.md that form/detail switch rules are separate from list row capsules, toolbar/workbench toggles, dialog permission matrices, and route row switches.

## 2. Shared Pattern

- [x] 2.1 Decide whether local composition is enough or add a presentational app-level helper outside `components/ui/`.
- [x] 2.2 If adding a helper, keep it submit-agnostic and mode-agnostic: no mutation, no create/edit branching, no form ownership.
- [x] 2.3 Ensure the pattern supports label, optional description, switch alignment, disabled state, pending-safe layout, and accessible naming.

## 3. Migrate Matching Switch Fields

- [x] 3.1 Update AI provider config create and update default-provider switches to the compact form switch treatment.
- [x] 3.2 Update news outlet create/update active switch fields to the compact form switch treatment.
- [x] 3.3 Update blog create/update visibility switches to the compact form switch treatment.
- [x] 3.4 Search all create/update/detail screens for remaining oversized form switch wrappers and migrate matching cases.
- [x] 3.5 Keep row/list/table capsules, toolbar/workbench toggles, Telegram route row switches, and permission matrix switches unchanged unless a found usage is actually a form/detail setting field.

## 4. Copy And Accessibility

- [x] 4.1 Remove redundant switch descriptions that restate the label.
- [x] 4.2 Keep concise muted descriptions only for non-obvious consequence, scope, permission, or global-default behavior.
- [x] 4.3 Verify every migrated switch has a visible label association or equivalent accessible name and preserves disabled behavior.

## 5. Verification

- [x] 5.1 Run targeted search to confirm migrated form switches no longer use heading-sized labels or card-like switch-only wrappers.
- [x] 5.2 Run lint or typecheck for touched files.
- [x] 5.3 Run OpenSpec validation for `standardize-form-switch-fields`.
- [x] 5.4 Visually smoke check representative create/update/detail switch fields where local auth and data allow it; otherwise document the blocker.

Verification note: Added `AppFormSwitchField` outside `components/ui/` and migrated AI provider default-provider switches, news outlet active switch, and blog visibility switches. Targeted search found no remaining migrated form switch importing `components/ui/switch`, rendering `<Switch>` directly, using `text-base` switch labels, or using `rounded-lg border p-4` as a switch-only wrapper; the remaining `rounded-lg border p-4` match is an AI credential field group, not a switch. `pnpm lint -- components/app-form-switch-field.tsx "app/(main)/ai-provider-configs/ai-provider-config-create-form.tsx" "app/(main)/ai-provider-configs/ai-provider-config-update-form.tsx" "app/(main)/blogs/create/create-blog-form.tsx" "app/(main)/blogs/[id]/update-blog-form.tsx" "app/(main)/news-outlets/news-outlet-form-fields.tsx"` passed with two pre-existing React Compiler warnings for React Hook Form `form.watch()` in blog create/update forms. `pnpm typecheck` passed. `openspec validate standardize-form-switch-fields --strict` passed. Visual smoke test was not run because this session does not have an authenticated local app/browser state for representative create/update/detail screens.
