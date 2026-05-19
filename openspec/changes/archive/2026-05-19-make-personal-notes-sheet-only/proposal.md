## Why

Personal notes are intended as a fast teaching/trading note tool available beside the workspace selector. The experience should stay in the header Sheet, but the fullscreen flow should now behave like an expanded editing surface instead of a read-only presentation viewer so instructors can keep writing, formatting, saving, and switching notes while screen sharing.

## What Changes

- Remove the standalone personal notes `/notes` page experience from the app UI.
- Keep personal notes available from the app header through the quick Sheet only.
- Simplify the header trigger label from `Ghi chú của tôi` to `Ghi chú` and use a quieter note-style icon that visually fits beside the theme mode control.
- Remove visible Sheet title and description copy to maximize note/editor space, while preserving accessible dialog labeling.
- Replace the Sheet `Mở rộng` action with an icon-only fullscreen toggle.
- Fullscreen MUST expand the current Sheet/editor surface to the full viewport, not render a separate read-only viewer.
- Fullscreen MUST keep the same editor instance and full editor functionality: toolbar, note list, save bar, dirty state, permissions, and explicit save behavior.
- When fullscreen is active, the control MUST switch to an icon-only `MinimizeIcon` action with no visible text label.
- Simplify the x-editor toolbar by removing the subscript/superscript controls and the visible link toolbar control from the top toolbar.
- Simplify the x-editor bottom action bar by removing the share and tree view actions.
- Align the font-size control with shadcn default control sizing by removing hard-coded input height and manual icon sizing.
- Remove Markdown support from the personal note editor without backwards compatibility: no Markdown toggle, no Markdown shortcuts, no Markdown transformer plumbing, and no retained Markdown-specific source/dependencies when no longer referenced.
- If Markdown-related code cannot be cleanly removed because another live editor feature still depends on it, implementation MUST stop and report the exact blockers/files so they can be removed manually.
- Do not change backend personal-note endpoints, DTOs, sanitization, ownership, or permissions.

## Capabilities

### New Capabilities
- `personal-notes-sheet-only`: Covers the Sheet-only personal note experience, compact header trigger, editable fullscreen Sheet mode, streamlined x-editor toolbar, and removal of the standalone notes workspace UI.

### Modified Capabilities

## Impact

- Affected routes: `app/(main)/notes/*` removal or deactivation.
- Affected header: `app/(main)/layout.tsx` through the existing `PersonalNotesQuickSheet` integration only if route references or labels need cleanup.
- Affected components: `components/personal-notes-quick-sheet.tsx`, `components/personal-note-editor.tsx`, and `components/editor-x/*` toolbar composition.
- Affected dependencies: Markdown-related Lexical package usage may be removed from `package.json`/lockfile if no longer referenced after editor cleanup.
- Affected navigation metadata: breadcrumbs and any `/notes` references.
- Affected actions: `app/api/personal-notes/action.ts` revalidation paths may need cleanup after removing `/notes`.
- No backend API, database, dependency, or permission model change.
