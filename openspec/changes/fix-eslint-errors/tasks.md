## 1. Editor plugin type boundaries

- [ ] 1.1 Replace the `any` spread in `components/editor/plugins/block-selection-kit.tsx:34` with the narrow plugin prop shape required by `BlockSelection`.
- [ ] 1.2 Replace the `emojiMartData as any` assertion in `components/editor/plugins/emoji-kit.tsx:10` with the installed emoji data type or a narrow `unknown`-to-library-type boundary.
- [ ] 1.3 Replace the `remarkEmoji as any` assertion in `components/editor/plugins/markdown-kit.tsx:18` with the compatible unified/Plate plugin type, keeping any compatibility assertion local to that third-party boundary.

## 2. Shared UI value and ref typing

- [ ] 2.1 Fix `components/ui/callout-node-static.tsx:18` by narrowing `backgroundColor` before passing it to the DOCX renderer, preserving the current fallback.
- [ ] 2.2 Fix `components/ui/callout-node-static.tsx:31` by narrowing `icon` before passing it to the DOCX renderer, preserving the current fallback.
- [ ] 2.3 Fix `components/ui/callout-node.tsx:34` by narrowing the interactive callout `backgroundColor` value without changing rendered styling.
- [ ] 2.4 Fix `components/ui/callout-node.tsx:55` by narrowing the interactive callout `icon` value without changing rendered content.
- [ ] 2.5 Replace the `any` annotation for `footnoteApi.references()` entries in `components/ui/footnote-node.tsx:243` with the existing Plate node-entry type.
- [ ] 2.6 Replace `(element as any).userId` in `components/ui/inline-combobox.tsx:94` with a guarded access that accepts only the expected string metadata.
- [ ] 2.7 Replace `(props.attributes as any).alt` in `components/ui/media-image-node-static.tsx:29` with a typed attribute read and the existing empty-string fallback.
- [ ] 2.8 Replace `React.Ref<any>` in `components/ui/table-node.tsx:1242` with the concrete button/ref type compatible with `useDraggable().handleRef`.

## 3. React lint correctness

- [ ] 3.1 Move `handleCopy` above its first use in `components/market-conversation-assistant/market-conversation-assistant.tsx:1279` without changing its callback behavior or dependencies.
- [ ] 3.2 Return the named component reference instead of an anonymous wrapper in `components/ui/block-draggable.tsx:70`.
- [ ] 3.3 Return the named component reference instead of an anonymous wrapper in `components/ui/block-list-static.tsx:28`.
- [ ] 3.4 Return the named component reference instead of an anonymous wrapper in `components/ui/block-list.tsx:38`.
- [ ] 3.5 Refactor `components/ui/font-color-toolbar-button.tsx:428` so refs are not cloned or accessed during render; trigger the existing color input from the user interaction handler.

## 4. Verification

- [ ] 4.1 Run `pnpm.cmd lint` and confirm it exits successfully with zero errors; do not add work for the existing warnings.
- [ ] 4.2 Run `pnpm.cmd typecheck` and review the final diff to confirm only the 16 error fixes are included, with no ESLint configuration, dependency, API, route, localization, or unrelated warning changes.
