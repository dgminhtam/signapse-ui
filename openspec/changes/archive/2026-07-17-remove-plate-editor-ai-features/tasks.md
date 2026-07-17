## 1. Remove Plate AI Runtime Wiring

- [x] 1.1 Remove `AIKit`, `CopilotKit`, and `SettingsDialog` from the shared editor composition while retaining the directly registered Markdown and cursor-overlay kits.
- [x] 1.2 Remove AI buttons and icons from the fixed and floating toolbars, the AI group from the slash menu, the Ask AI block-context action, and the `Mod+J` block-selection handler.
- [x] 1.3 Remove AI streaming/open-state branches from the cursor overlay and floating toolbar without changing their remaining non-AI selection and link behavior.

## 2. Delete Plate AI-Owned Sources

- [x] 2.1 Delete the command/chat and copilot plugin files, chat hook, settings dialog, AI toolbar/menu/node/chat-editor components, and ghost-text component.
- [x] 2.2 Delete the complete `app/api/ai/**` command/copilot route, prompt, and utility tree plus the now-unreferenced `lib/markdown-joiner-transform.ts` stream helper without adding disabled handlers or compatibility stubs.
- [x] 2.3 Remove the AI and AI Chat editor variants plus the AI feature section, shortcut instructions, and AI comparison row from the bundled editor document.

## 3. Remove Unused Dependencies

- [x] 3.1 Remove `@platejs/ai`, `@ai-sdk/react`, `@faker-js/faker`, `ai`, and `dedent` from `package.json` and regenerate `pnpm-lock.yaml` while preserving dependencies used by non-AI editor and product features.

## 4. Verify The Removal Boundary

- [x] 4.1 Search the source, manifest, and route tree to confirm no Plate AI package imports, plugin symbols, command/copilot paths, AI entry-point copy, settings, or AI-only source files remain, and confirm unrelated AI provider, system-prompt, assistant-ui, and Lexical editor areas were not changed.
- [x] 4.2 Run ESLint for every modified shared Plate editor file and resolve all findings introduced by this change.
  - Verification note: targeted ESLint reports only the pre-existing `props as any` finding in `components/editor/plugins/block-selection-kit.tsx`.
- [x] 4.3 Run `pnpm typecheck`, resolve every diagnostic introduced by this change, and record the known out-of-scope `date-node.tsx` `initialFocus` diagnostic separately if it remains.
  - Verification note: typecheck reports only the excluded `components/ui/date-node.tsx` `initialFocus` diagnostic.
- [x] 4.4 Run `git diff --check` and strict OpenSpec validation for `remove-plate-editor-ai-features`.
