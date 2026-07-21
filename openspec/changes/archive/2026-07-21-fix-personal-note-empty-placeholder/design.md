## Context

Plate exposes two complementary placeholder paths. The editor-level `placeholder` prop covers a pristine document containing one empty block, while `BlockPlaceholderPlugin` covers the focused empty block in a non-pristine document and intentionally excludes the pristine state. Personal Notes currently uses only the plugin path and registers that plugin once through `EditorKit` and again conditionally in `PlateEditor` to inject localized copy.

`PlateEditor` is the only current consumer of `EditorKit`, and Personal Notes already provides localized `bodyPlaceholder` copy through the shared editor's public input.

## Goals / Non-Goals

**Goals:**

- Display the localized writing hint in a completely empty editable Personal Notes draft.
- Retain the existing focused-empty-paragraph hint after the document contains other blocks.
- Register one block-placeholder plugin with clear ownership.
- Use Plate's documented default placeholder guards and root-block query.

**Non-Goals:**

- Change freeform block ordering, title derivation, save behavior, persistence payloads, or API contracts.
- Add placeholders for headings, quotes, lists, or read-only notes.
- Add auto-focus or override Plate's pristine-editor guard.
- Introduce a configurable editor-kit factory for hypothetical future consumers.

## Decisions

### Use the editor-level placeholder for pristine drafts

`PlateEditor` will pass the localized body copy to the rendered `Editor` through its native Plate `placeholder` prop only when the editor is editable. This is the Plate-owned path for a globally empty editor and avoids changing plugin internals.

Alternative considered: override the block plugin's pristine-editor guard. Rejected because it duplicates behavior already owned by Plate's editor-level placeholder and depends on internal plugin state.

### Make PlateEditor the single placeholder-plugin owner

`EditorKit` will stop including `BlockPlaceholderKit`, the now-redundant kit file will be removed, and `PlateEditor` will append exactly one configured `BlockPlaceholderPlugin`. This keeps dynamic localized copy next to the component input that supplies it and reduces duplicate-key plugin composition.

Alternative considered: introduce `createEditorKit(options)`. Rejected because `EditorKit` currently has one consumer and a factory would add an unnecessary configuration layer.

### Override only localized copy and styling

The configured plugin will keep the existing pseudo-element styling. When `bodyPlaceholder` is present, it will override the paragraph entry in `placeholders`; otherwise Plate's default paragraph copy remains available. The integration will omit a custom `query` and rely on Plate's default root-level query. Because the placeholder map contains only the paragraph key, an additional `node.type` predicate is unnecessary.

The editor-level prop and block plugin do not conflict: Plate's block plugin excludes the pristine single-empty-block state, while the editor-level prop covers that state.

## Risks / Trade-offs

- [Plate changes its documented default placeholder behavior in a future upgrade] → Recheck the placeholder contract during Plate upgrades; keep the integration on public props and plugin options.
- [A future direct `EditorKit` consumer expects placeholder behavior] → Add the plugin explicitly at that consumer when it exists instead of introducing a factory now.
- [Read-only empty content displays an editing hint] → Do not pass the editor-level placeholder when `readOnly` is true; the block plugin is already edit-only.
