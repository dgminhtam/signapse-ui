## Context

The previous list search InputGroup standardization moved search controls to shadcn `InputGroup`, `InputGroupInput`, and `InputGroupAddon`. The current implementation keeps the search icon in the leading addon and renders a pending spinner in a trailing addon with reserved width.

The product direction is now simpler: list search pending feedback should replace the search icon in the same leading addon. This keeps the search control compact and avoids an extra empty trailing slot when not pending.

## Goals / Non-Goals

**Goals:**

- Use a single leading `InputGroupAddon` for both idle search affordance and pending feedback.
- Render `<Search />` when idle and `<Spinner />` when a search route transition is pending.
- Remove trailing search spinner addons and any class used only to reserve spinner space.
- Preserve current search behavior, accessibility, width, Vietnamese copy, and URL state handling.
- Document the rule in `AGENTS.md`.

**Non-Goals:**

- Do not introduce a shared default search component.
- Do not modify shadcn wrappers in `components/ui/`.
- Do not redesign non-list search controls such as combobox, dialog, command, role permission, graph/workbench, or form field search-like inputs.
- Do not change search debounce timing, query param keys, placeholder text, routing behavior, or table/list layout.

## Decisions

- **Use icon replacement instead of trailing feedback.** The leading addon already communicates the search affordance; replacing that icon with a same-size spinner keeps the control visually stable without needing a second addon.
- **Keep the spinner inside `InputGroupAddon`.** This stays aligned with shadcn composition and avoids absolute positioning or custom input padding.
- **Do not reserve an idle trailing slot.** The trailing addon and `min-w-8` class are implementation artifacts from the previous pattern; removing them reduces chrome and avoids a right-side empty zone.
- **Keep per-feature search components.** Existing `AGENTS.md` guidance prefers local `[feature]-search.tsx` components and no shared default search component, so the change should be repeated surgically across the current list search files.

## Risks / Trade-offs

- **Risk: Pending state removes the search affordance temporarily.** → Mitigation: the input remains focused, placeholder/value remain visible, and the spinner appears exactly where the search affordance was.
- **Risk: Future list search files reintroduce trailing spinner addons.** → Mitigation: add explicit `AGENTS.md` guidance and review criteria through this change.
- **Risk: Over-scoping into non-list search.** → Mitigation: limit implementation to `*search.tsx` list toolbar components currently using the list search InputGroup pattern.
