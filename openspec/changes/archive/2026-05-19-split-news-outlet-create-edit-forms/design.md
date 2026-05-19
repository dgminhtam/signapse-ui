## Context

`app/(main)/news-outlets/create/page.tsx` and `app/(main)/news-outlets/[id]/page.tsx` currently render the same `NewsOutletForm`. The component decides create versus edit by checking `initialData`, then changes title, description, metadata, submit text, toast copy, and mutation action with `isEdit`.

This shared submit-owning form now hides meaningful differences between the flows. Create is a new-entity declaration flow. Edit is an existing-entity update flow with fetched data, metadata, reset-to-original behavior, and update-only permissions. The backend snapshot also distinguishes create and update request requiredness, even though the current frontend type still uses one request interface.

## Goals / Non-Goals

**Goals:**
- Replace the shared submit-owning `NewsOutletForm` with separate create and edit form components.
- Keep create and edit copy, default values, mutation calls, pending labels, toast messages, and reset behavior local to each form.
- Allow only mode-agnostic shared field primitives/helpers that do not decide create versus edit and do not own submission.
- Add a repo rule to prevent future create/edit screens from using one shared submit-owning form component.
- Preserve focused form shell requirements, Vietnamese copy, accessible validation state, and current route/permission behavior.

**Non-Goals:**
- Convert `/news-outlets/{id}` into a read-only detail page.
- Change route names, breadcrumbs, permissions, or navigation.
- Change backend endpoints or API mapping contract.
- Refactor unrelated create/edit forms across the repo in this change.

## Decisions

- Create two explicit form containers: `NewsOutletCreateForm` and `NewsOutletUpdateForm`.
  - Rationale: each container owns one flow, one mutation, one set of copy, and one default-value strategy.
  - Alternative considered: keep `NewsOutletForm` with clearer props. This still violates the requested rule and preserves mode branching.

- Share only mode-agnostic field code if duplication becomes noisy.
  - Rationale: fields such as name, homepage URL, RSS URL, description, and active state are visually similar, but sharing must not reintroduce a combined create/edit form.
  - Alternative considered: duplicate all JSX. This is acceptable if simpler, but a small `NewsOutletFormFields` component/helper can reduce mechanical duplication as long as it has no submit logic and no `isEdit`.

- Prefer separate request value builders/types when implementation touches payload construction.
  - Rationale: create requires `name` and `homepageUrl`, while update can be modeled separately and remain future-proof if backend partial-update behavior becomes important.
  - Alternative considered: keep a single `NewsOutletRequest` type. This is usable today but blurs create/update semantics.

- Add the rule in `AGENTS.md`, not under `components/ui` or global theme files.
  - Rationale: this is a repository workflow/layout rule, matching the existing "Bố cục màn hình tạo mới và chỉnh sửa" section.
  - Alternative considered: keep the rule only in OpenSpec. That would not guide future work after this change is archived.

## Risks / Trade-offs

- [Risk] Field JSX duplication increases slightly -> Mitigate by sharing only mode-agnostic field primitives if it stays simple.
- [Risk] A shared helper accidentally grows `isEdit` branching over time -> Mitigate with the new rule: no shared submit-owning create/edit form and no create/edit branching inside field primitives.
- [Risk] Splitting forms changes behavior unintentionally -> Mitigate by preserving the existing route model, mutations, redirect, `router.refresh()`, and reset behavior, then running targeted lint/typecheck.
- [Risk] Existing active OpenSpec changes touch the same file -> Mitigate by making a surgical patch and reviewing current file state before editing.
