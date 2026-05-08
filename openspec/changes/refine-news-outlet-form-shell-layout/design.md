## Context

News outlet create and edit now use separate focused form shells. Both currently use `width="md"` (`max-w-2xl`) and inherit the shared `AppFormShellFooter` default `sm:justify-end`. This works mechanically, but the footer action alignment feels closer to a dialog than a page-level editing surface, and URL-heavy fields benefit from a little more width.

The repository already models form shell width through `AppFormShell` (`sm`, `md`, `lg`) and allows local footer overrides through `AppFormShellFooter className`. The safest move is to adjust the news outlet forms locally first, then clarify repo guidance without changing every form in the app.

## Goals / Non-Goals

**Goals:**

- Make news outlet create/edit forms feel like page-level focused tasks.
- Use a wider but still constrained form shell for URL-heavy source configuration.
- Align footer actions with the field column on the left.
- Keep create/update behavior, validation, mutation, toast, cancel, redirect, and refresh unchanged.
- Ensure any matching fallback/skeleton uses the same width and footer alignment.

**Non-Goals:**

- Do not make the form shell full-width.
- Do not change `AppFormShellFooter` default alignment globally.
- Do not redesign unrelated focused forms.
- Do not change backend request/response contracts.

## Decisions

1. Use `width="lg"` for news outlet create/edit.
   - Rationale: `max-w-3xl` gives long URL fields more room while preserving focused task framing.
   - Alternative considered: full-width. Rejected because it would make inputs overly long and reduce task focus.

2. Override footer alignment locally.
   - Use `AppFormShellFooter className="sm:justify-start"` for news outlet create/edit.
   - Rationale: the primary action should follow the same left edge as fields in a page-level form.
   - Alternative considered: change the shared default from `justify-end` to `justify-start`. Rejected for now because other forms may depend on the existing default and need separate review.

3. Keep button order and semantics unchanged.
   - Submit remains first and cancel remains second.
   - Rationale: the action hierarchy is already correct; the issue is placement, not command order.

4. Treat skeleton/fallback as conditional but mandatory when present.
   - If a news outlet create/edit loading fallback exists or is added, it must mirror `width="lg"` and left-aligned footer actions.
   - Rationale: the repo rule already requires create/update skeletons to mirror final form shell layout.

5. Clarify `AGENTS.md` rather than overgeneralizing.
   - Add guidance that page-level focused form actions can be left-aligned when it improves continuity with fields, and URL-heavy CRUD forms can use `max-w-3xl`.
   - Rationale: this captures the decision without forcing every existing form to change.

## Risks / Trade-offs

- Wider shell could make short fields feel sparse. -> Keep the shell constrained to `max-w-3xl`, not full-width.
- Local footer override could diverge from other forms. -> Capture the rationale in `AGENTS.md` and limit implementation to news outlet.
- Adding a route skeleton could expand scope. -> Only add or update skeleton/fallback if it is already part of the route behavior or needed to satisfy existing layout expectations.
