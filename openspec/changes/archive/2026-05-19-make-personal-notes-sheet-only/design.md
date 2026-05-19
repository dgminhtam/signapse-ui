## Context

Personal notes started with two frontends: a header Sheet for quick access and a standalone `/notes` workspace with fuller controls and presentation mode. Product direction now keeps personal notes as a fast header utility only, optimized for instructors or traders who want to write and show notes during screen share without navigating away from the current workspace.

The Sheet should not spend vertical space on repeated visible title/description copy. It also should not route to `/notes`. The newest review changes fullscreen from a read-only presentation viewer into a full-screen version of the same Sheet editor, because instructors still need formatting, saving, note switching, and quick edits while presenting.

## Goals / Non-Goals

**Goals:**

- Make the header Sheet the only personal-note UI surface.
- Remove or deactivate the standalone `/notes` workspace and related navigation affordances.
- Compress Sheet chrome by removing visible title/description copy while preserving accessible dialog naming.
- Replace `Mở rộng` with an icon-only fullscreen toggle inside the Sheet flow.
- Fullscreen the current Sheet/editor surface instead of creating a separate read-only editor/viewer.
- Keep all editing functionality available in fullscreen: toolbar, bottom action bar, note list, save bar, create/update, dirty state, permissions, and explicit save.
- Use `ExpandIcon` for entering fullscreen and `MinimizeIcon` without visible text for leaving fullscreen.
- Remove low-value x-editor controls from the visible toolbar: subscript/superscript, visible link toggle, share action, and tree view action.
- Align the font-size picker with default shadcn control sizing instead of hard-coding input height or icon size.
- Remove Markdown editor behavior and code paths completely from the personal note editor, with no backwards compatibility requirement.

**Non-Goals:**

- Changing personal-note backend endpoints, DTOs, ownership, sanitization, or permissions.
- Adding student sharing, collaboration, title fields, tags, or workspace-scoped notes.
- Replacing x-editor or reducing core rich-text editing features beyond the requested toolbar and Markdown cleanup.
- Reworking unrelated header controls or global layout.

## Decisions

### 1. Treat the Sheet as the product surface

The `/notes` route and its page-level workspace should be removed or made unreachable. Header access remains permission-gated through `PersonalNotesQuickSheet`.

Why:

- The user no longer needs a separate notes page.
- The Sheet keeps notes available beside the workspace selector without changing context.
- Removing the page prevents duplicate UI logic for listing, editing, fullscreen, and dirty-state handling.

Alternative considered:

- Keep `/notes` as a hidden advanced page. Rejected because it preserves maintenance cost and contradicts the Sheet-only direction.

### 2. Fullscreen expands the same Sheet/editor

The fullscreen control should toggle layout state on `PersonalNotesQuickSheet` and make the existing `SheetContent` occupy the full viewport. It should not render a second `PersonalNoteEditor`, and it should not switch to `readOnly`.

Why:

- Keeping the same editor instance preserves selection, undo/redo history, draft HTML, dirty state, and toolbar state more naturally.
- Instructors can keep writing while screen sharing.
- Save remains explicit and visible; fullscreen does not imply backend persistence.

Alternative considered:

- Render a separate read-only fullscreen editor from `draftHtml`. Rejected by the latest product direction because fullscreen must keep full functionality.

### 3. Fullscreen controls are icon-only

The compact action row should expose an icon-only fullscreen button. Normal Sheet mode uses `ExpandIcon`; fullscreen mode uses `MinimizeIcon` with no visible text label. The button still needs an accessible label through `aria-label` and should use the existing button/icon composition pattern.

Why:

- The Sheet header area is intentionally compact.
- The icon maps directly to the action and avoids spending horizontal space on copy.

Alternative considered:

- Keep `Trình bày` visible text. Rejected because the user explicitly requested icon-only, and the action is now a view-size toggle rather than a presentation label.

### 4. Keep accessibility while removing visible Sheet copy

The Sheet should avoid visible `SheetTitle` and description copy to reclaim editor space, but it should still provide an accessible title using `sr-only` or equivalent shadcn/Radix-compatible labeling.

Why:

- The visible heading duplicates the header trigger and does not help the fast-note workflow.
- Radix dialog content still benefits from a semantic title for assistive technologies.

Alternative considered:

- Remove `SheetTitle` entirely. Rejected because it would weaken dialog accessibility.

### 5. Simplify x-editor toolbar composition

Remove `SubSuperToolbarPlugin` and `LinkToolbarPlugin` from the main toolbar, and remove `ShareContentPlugin` and `TreeViewPlugin` from the bottom actions. Keep the underlying link extensions for existing links, auto-link behavior, and clickable links unless implementation shows they are unused.

Why:

- Subscript/superscript and visible link actions are low-priority for quick teaching/trading notes.
- Share and tree view actions add noise and are not part of the personal note workflow.
- Keeping link extensions avoids breaking already-saved HTML that contains links.

Alternative considered:

- Move manual link insertion into the insert menu immediately. Deferred because the user allowed either putting link into insert or removing it, and removing the visible toolbar control is the smaller change.

### 6. Remove Markdown behavior instead of hiding it

The personal note editor should remove `MarkdownTogglePlugin`, `MarkdownShortcutsExtension`, Markdown transformer arrays/imports, and Markdown-specific source/dependency references when they are no longer used. This is not a compatibility migration: existing saved content is persisted as sanitized HTML, and the product direction explicitly does not support Markdown authoring for personal notes.

Why:

- The note workflow is rich-text-first and optimized for screen-share teaching/trading.
- Markdown conversion can surprise users by turning the whole note into a code block representation.
- Markdown shortcuts create implicit formatting behavior that the user does not want in this editor.
- Removing the code path reduces UI and source complexity.

Alternative considered:

- Hide only the bottom Markdown toggle while keeping Markdown shortcuts. Rejected because the user explicitly decided Markdown is not used here and wants the related code cleaned up.

Implementation note:

- After removing editor references, run a reference search for Markdown-related files and packages. If a Markdown file or dependency is still live because another non-Markdown feature depends on it, do not leave an unexplained partial cleanup; report the blocker with exact file paths so the user can decide whether to delete those pieces manually.

### 7. Let shadcn default sizing align font-size controls

The font-size input should stop overriding height. The neighboring minus/plus buttons should use an existing shadcn button size that aligns with the default input height, and icons inside those buttons should not carry manual size classes.

Why:

- The current hard-coded input height makes the control look visually misaligned beside icon buttons.
- Repo UI rules prefer default shadcn chrome and avoid manual height/icon sizing unless product need demands it.

Alternative considered:

- Hard-code every control to the same explicit height. Rejected because it recreates shadcn chrome in app code and is more brittle than using default sizes.

## Risks / Trade-offs

- [Removing `/notes` breaks stale links] -> Ensure no in-app UI links to `/notes`; allow the route to be removed or redirected based on implementation simplicity.
- [Fullscreen changes may remount the editor] -> Prefer toggling classes on the same Sheet/editor tree rather than rendering a second editor.
- [Icon-only fullscreen buttons can be ambiguous] -> Use clear `aria-label` text and, if the existing app pattern supports it, tooltip-only helper text without visible label.
- [Removing link toolbar reduces manual link creation] -> Preserve auto-link/clickable link behavior; add insert-menu link later only if users need manual link creation.
- [Removing tree view reduces debugging visibility] -> This is acceptable for production note taking; tree view is not user-facing value.
- [Markdown cleanup leaves orphan files or dependencies] -> Run reference search after removing editor references; delete unreferenced Markdown files/dependencies, or list blockers explicitly if clean removal is not possible.
- [Existing notes contain Markdown-looking text] -> Treat it as normal rich text/HTML; no Markdown compatibility path is required.
- [Font-size control still drifts visually] -> Verify against fullscreen toolbar after removing input height overrides and manual icon sizing.
