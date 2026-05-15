## 1. Sidebar State Treatment

- [x] 1.1 Update active top-level leaf item styling in `components/app-sidebar.tsx` to use accent-based local treatment instead of `sidebar-primary`.
- [x] 1.2 Update active child item styling in `components/app-sidebar.tsx` to use accent-based local treatment instead of `sidebar-primary`.
- [x] 1.3 Remove parent expanded background styling so open parent items only show chevron rotation.
- [x] 1.4 Keep parent-with-active-child visually secondary to the active child item, using at most mild text or chevron emphasis.
- [x] 1.5 Preserve existing sidebar row height, indentation, and spacing behavior.

## 2. Documentation

- [x] 2.1 Update `AGENTS.md` sidebar rules so active/current page items no longer require `sidebar-primary`.
- [x] 2.2 Document that sidebar active state uses accent-based local composition, hover stays `sidebar-accent`, focus-visible stays `sidebar-ring`, and expanded parent state uses chevron rotation without background.

## 3. Verification

- [x] 3.1 Verify no new global sidebar active token is introduced and no theme token is changed for this local refinement.
- [x] 3.2 Run targeted lint for `components/app-sidebar.tsx`.
- [x] 3.3 Run `openspec validate refine-sidebar-accent-active-state --strict`.
