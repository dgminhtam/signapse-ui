## Context

The previous change introduced `components/ui/dialog.tsx` and migrated direct `DialogPrimitive` usages to shadcn `Dialog` parts. That solved the component ownership problem, but the feature usages still recreate the old custom dialog shell through usage-level classes such as `p-0`, `gap-0`, `border-b`, `border-t`, custom shadows, custom header backgrounds, custom title typography, and manual close buttons.

The shadcn skill explicitly prefers existing component styling and reserves `className` for layout rather than restyling. This change narrows the dialog usages so the shadcn wrapper owns the modal chrome while feature code owns only content layout.

## Goals / Non-Goals

**Goals:**
- Remove legacy dialog shell styling from feature/shared dialog usages.
- Use the default shadcn close button whenever the default close affordance is sufficient.
- Keep only layout constraints that the default component cannot infer, such as wider modal width, maximum height, scrollable body regions, and dense permission-dialog flex layout.
- Preserve all business behavior and user-facing Vietnamese copy.
- Keep the new `components/ui/dialog.tsx` wrapper as the single source of dialog chrome.

**Non-Goals:**
- Rework the global shadcn Dialog wrapper styling.
- Redesign the content inside model, workspace, watchlist, or permission workflows.
- Change validation, save, pending, permission, or data-loading behavior.
- Resolve authenticated browser smoke limitations from the previous change.

## Decisions

### Default chrome comes from `DialogContent`

Feature usages should stop setting `p-0`, `gap-0`, custom shell shadows, header/footer borders, and header backgrounds. The default `DialogContent` padding, gap, ring, shadow, close button, title, and description treatments should be the visual baseline.

Alternative considered: keep old shell overrides while merely changing colors to semantic tokens. That still preserves the custom implementation and misses the user's goal of using shadcn defaults.

### Width and scroll are valid layout overrides

Some dialogs need more than the default `sm:max-w-md` size. Width, max-height, flex layout, and overflow are acceptable because they express content layout rather than visual chrome. For example, the role permission dialog may keep a wider max width and scrollable body; the AI model picker may keep a wider content width and list scroll constraints.

Alternative considered: remove all `className` props from every Dialog part. That would make dense workflows cramped and may break scroll behavior.

### Default close button replaces manual header close rows

When the default close button works, usages should remove `showCloseButton={false}`, `DialogClose`, `XIcon`, and the extra header row used only to place a close button. A custom close button should remain only if it is necessary for business behavior such as disabled close while a save is pending.

Alternative considered: always use custom close buttons for consistency with previous UI. That keeps old shell structure and duplicates the shadcn wrapper's built-in behavior.

### Role permission dialog gets the narrowest exception

The role permission dialog is a dense editor and may retain layout classes such as `flex`, `max-h`, `overflow-hidden`, and a wider `sm:max-w-[960px]`. It should still remove style classes like custom header background, custom dialog shadow, title font overrides, and shell borders where default shadcn treatment is sufficient.

## Risks / Trade-offs

- [Risk] Removing custom header/footer borders may reduce visual separation in dense dialogs. -> Mitigation: keep content grouping inside the body where needed, but let Dialog shell chrome stay default.
- [Risk] Default close button may allow closing during pending operations where the previous custom button was disabled. -> Mitigation: only use default close when close does not need to be blocked; otherwise document the exception and keep it local.
- [Risk] Width/scroll cleanup could make long lists harder to use. -> Mitigation: preserve layout-only width and overflow constraints for model lists, watchlist selection, and permission editing.
- [Risk] Browser smoke may still be blocked by Clerk authentication. -> Mitigation: run typecheck/lint and code-level review; perform browser smoke only when an authenticated session is available.

## Migration Plan

1. Review current dialog usages and identify classes that style shell chrome versus classes that provide content layout.
2. Remove manual close buttons and `showCloseButton={false}` where default shadcn close behavior is acceptable.
3. Remove header/footer shell borders, custom padding resets, custom shadows, custom backgrounds, and custom title/description typography from the target dialogs.
4. Retain only width, max-height, flex, and overflow classes needed by dense content.
5. Run targeted formatting, lint, typecheck, and OpenSpec validation.

## Open Questions

None.
