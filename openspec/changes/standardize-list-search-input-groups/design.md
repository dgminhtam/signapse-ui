## Context

The repo already has shadcn `InputGroup`, `InputGroupInput`, and `InputGroupAddon` installed. The current list search controls still use raw `Input` plus manually positioned `Search` icons and spinners. Each search file repeats slightly different values such as `left-2.5`, `left-3`, `top-2.5`, `top-1/2`, `pl-8`, `pl-9`, `pr-10`, `h-4`, and `w-4`.

The list toolbar has also drifted: leading controls use `gap-4`, while trailing sort/page-size controls use `gap-2`. That makes action plus search feel more spread out than the view-control cluster.

## Goals / Non-Goals

**Goals:**

- Make list search icon alignment consistent by using shadcn InputGroup composition.
- Remove per-page manual search icon positioning and sizing.
- Keep list search behavior, URL contract, debounce timing, and responsive width unchanged.
- Align leading toolbar spacing with trailing control spacing.
- Add durable repo guidance so future list search components follow the same pattern.

**Non-Goals:**

- Do not create a shared default list search component; local `[feature]-search.tsx` files remain preferred.
- Do not change query keys, backend search fields, route URLs, or search semantics.
- Do not modify `components/ui/input-group.tsx` or `components/ui/input.tsx`.
- Do not redesign non-list search fields such as command/dialog search, combobox search, role permission dialog search, or market query inputs.

## Decisions

1. Use InputGroup for list search chrome.
   - Each list search should render:
     - wrapper `className="w-full sm:w-80 lg:w-96"`
     - `InputGroup`
     - leading `InputGroupAddon` with `<Search />`
     - `InputGroupInput type="search"`
     - optional trailing `InputGroupAddon align="inline-end"` for pending spinner
   - Rationale: this matches the shadcn pattern and centralizes icon sizing/alignment in `InputGroupAddon`.
   - Alternative considered: continue raw `Input` and standardize padding/icon classes. That still duplicates what InputGroup already owns.

2. Keep search components local.
   - Existing AGENTS guidance says not to create a shared default list search component.
   - The behavioral differences are query key, placeholder, URL field mapping, and controlled-state strategy, so local components remain clearer.

3. Reserve pending feedback inside the InputGroup.
   - Pending spinner should remain inline because list search rules require it.
   - It should live in a trailing addon instead of an absolute positioned element.
   - To avoid content jitter, implementation can render a fixed-width trailing addon only when needed or keep a stable addon slot.

4. Tighten leading toolbar gap to `gap-2`.
   - Sort plus page size already use `gap-2`.
   - Primary action plus search should feel like one leading control cluster, not two separate zones.
   - `AppListToolbar` itself can keep `gap-4` between leading and trailing groups.

## Risks / Trade-offs

- [Risk] `InputGroup` currently has `h-8`, while default `Input` height may differ from previous list search visuals. -> Mitigation: use the installed shadcn wrapper as source of truth and verify toolbar height against current controls; if the active shadcn preset changes height, follow the preset rather than custom per-page overrides.
- [Risk] Pending spinner in a trailing addon can shorten visible input text. -> Mitigation: reserve the trailing addon only for pending state or keep it compact and let input text remain flexible.
- [Risk] Some search components use `useOptimistic` while others use `useState` plus sync effect. -> Mitigation: keep existing behavior unless a file has a clear bug; this change is visual composition and toolbar spacing, not state refactoring.
- [Risk] Non-list search controls may be accidentally migrated. -> Mitigation: tasks explicitly exclude command/dialog/combobox/workbench search fields.

## Migration Plan

1. Update `AGENTS.md` search-list rules to require `InputGroup` composition and forbid manual absolute search icons in list search.
2. Change `AppListToolbarLeading` from `gap-4` to `gap-2`.
3. Migrate each list search file to `InputGroup`, preserving local query behavior and responsive width.
4. Search for remaining list search raw `Input` + absolute search icon patterns.
5. Run targeted lint/typecheck and OpenSpec validation; visually smoke check representative list toolbars if local auth/data allow it.
