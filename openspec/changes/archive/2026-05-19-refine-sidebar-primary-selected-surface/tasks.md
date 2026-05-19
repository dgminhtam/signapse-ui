## 1. Theme Tokens

- [x] 1.1 Update light `--sidebar-primary` and `--sidebar-primary-foreground` in `app/globals.css` so selected navigation is neutral gray and readable without inverse CTA styling.
- [x] 1.2 Update dark `--sidebar-primary` and `--sidebar-primary-foreground` in `app/globals.css` so selected navigation is stronger than hover and readable.
- [x] 1.3 Verify no `--sidebar-active` token is introduced and global `--primary`/`--accent` are unchanged.

## 2. Sidebar State Treatment

- [x] 2.1 Update active top-level leaf item styling in `components/app-sidebar.tsx` to use `bg-sidebar-primary` and `text-sidebar-primary-foreground`.
- [x] 2.2 Update active child item styling in `components/app-sidebar.tsx` to use `bg-sidebar-primary` and `text-sidebar-primary-foreground`.
- [x] 2.3 Remove active font emphasis from leaf and child items so active is communicated by background only.
- [x] 2.4 Remove parent-with-active-child font emphasis from parent items.
- [x] 2.5 Keep parent expanded state background-free with only chevron rotation.
- [x] 2.6 Preserve existing sidebar row height, spacing, and child indentation behavior.

## 3. Documentation

- [x] 3.1 Update `AGENTS.md` sidebar rules so active/current page items use `sidebar-primary` only as a neutral selected surface.
- [x] 3.2 Document that hover remains `sidebar-accent`, focus-visible remains `sidebar-ring`, expanded parent uses chevron rotation only, and active/parent labels should not become bold just because of state.

## 4. Verification

- [x] 4.1 Search sidebar implementation and theme for forbidden `--sidebar-active` usage and unintended global token edits.
- [x] 4.2 Run targeted lint for `components/app-sidebar.tsx`.
- [x] 4.3 Run `openspec validate refine-sidebar-primary-selected-surface --strict`.
