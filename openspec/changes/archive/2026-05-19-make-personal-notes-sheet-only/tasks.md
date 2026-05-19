## 1. Remove Standalone Workspace

- [x] 1.1 Remove or deactivate `app/(main)/notes` page files so personal notes are no longer a standalone app destination.
- [x] 1.2 Remove `/notes` breadcrumb/navigation references and any Sheet action that routes to `/notes`.
- [x] 1.3 Clean up personal-note action revalidation paths that only targeted the removed `/notes` workspace, while keeping backend calls unchanged.

## 2. Refine Header And Sheet Chrome

- [x] 2.1 Change the header trigger label from `Ghi chú của tôi` to `Ghi chú`.
- [x] 2.2 Replace the current book-style trigger icon with a lighter note-style icon that fits beside the mode toggle.
- [x] 2.3 Remove visible Sheet title and description copy while preserving an accessible `SheetTitle`.
- [x] 2.4 Keep the Sheet top action row compact while supporting icon-only fullscreen controls.

## 3. Convert Fullscreen To Editable Expanded Sheet

- [x] 3.1 Replace the separate read-only fullscreen overlay/editor with a fullscreen layout state on the existing `SheetContent`.
- [x] 3.2 Ensure fullscreen keeps the same note list, `PersonalNoteEditor`, toolbar, save bar, draft HTML, dirty state, permissions, and explicit save flow mounted and usable.
- [x] 3.3 Change the fullscreen action to an icon-only `ExpandIcon` button in normal Sheet mode with no visible text label.
- [x] 3.4 When fullscreen is active, switch the action to an icon-only `MinimizeIcon` button with no visible text label.
- [x] 3.5 Ensure exiting fullscreen returns to the 60% Sheet layout without save, discard confirmation, backend reload, route navigation, or draft loss.
- [x] 3.6 Ensure closing the Sheet from either normal or fullscreen mode still uses the existing dirty-discard confirmation.

## 4. Streamline XEditor Toolbar

- [x] 4.1 Remove `SubSuperToolbarPlugin` from the visible top toolbar and clean up now-unused imports.
- [x] 4.2 Remove the visible `LinkToolbarPlugin` control from the top toolbar while preserving link extensions/auto-link behavior where possible.
- [x] 4.3 Remove `ShareContentPlugin` from the bottom action bar and clean up now-unused imports.
- [x] 4.4 Remove `TreeViewPlugin` from the bottom action bar and clean up now-unused imports.
- [x] 4.5 Verify remaining toolbar actions still render without spacing gaps or stale separators.

## 5. Remove Markdown And Align Font Size

- [x] 5.1 Update `FontSizeToolbarPlugin` so the numeric input uses default shadcn height and only keeps layout classes such as width/text alignment.
- [x] 5.2 Update minus/plus font-size buttons to align with the default input height and remove manual icon size classes.
- [x] 5.3 Remove `MarkdownTogglePlugin` from the editor bottom action bar and clean up now-unused imports.
- [x] 5.4 Remove `MarkdownShortcutsExtension`, `MARKDOWN_TRANSFORMERS`, and Markdown transformer imports/wiring from `components/editor-x/editor.tsx`.
- [x] 5.5 Remove unreferenced Markdown-specific editor source files after confirming they have no live imports.
- [ ] 5.6 Remove Markdown-related package dependencies from `package.json` and lockfile if no live source imports remain.
- [x] 5.7 If any Markdown-related source or dependency cannot be cleanly removed, stop and report exact blocker paths/package names for manual deletion.

## 6. Verification

- [x] 6.1 Run typecheck and focused lint for changed personal-note/editor files.
- [x] 6.2 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke-test opening the Sheet, editing a draft, entering fullscreen before saving, continuing to edit in fullscreen, minimizing, then saving.
- [x] 6.3 Verify no in-app UI or action routes to `/notes`.
- [x] 6.4 Run `openspec validate make-personal-notes-sheet-only --strict`.
