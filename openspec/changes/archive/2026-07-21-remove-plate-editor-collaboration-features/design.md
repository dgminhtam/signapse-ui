## Context

The shared Plate editor composes Comment, Discussion, and Suggestion plugin graphs copied from the Plate playground. Those graphs add fixed and floating toolbar controls, interactive and static renderers, review popovers, hard-coded users and discussions, annotation-aware transforms, and three direct dependencies. Personal Notes is a single-user workflow: update permission already determines whether the editor is writable, while comments and suggestions have no backend identity, review, or discussion persistence.

The feature also reaches beyond its visible buttons. Static export includes base comment and suggestion kits, several inline element renderers apply suggestion styles, Markdown treats collaboration metadata as plain marks, the link toolbar repositions around active annotations, and the default demo document contains annotated content. Cleanup therefore has to remove the whole dependency graph rather than hide the toolbar entries.

## Goals / Non-Goals

**Goals:**

- Remove Comment, Discussion, Suggestion, and editor-local Mode behavior from interactive and static editor composition.
- Delete collaboration-only UI, helpers, demo data, localization, and direct dependencies.
- Preserve ordinary editing, permission-controlled read-only behavior, Markdown, export, links, tables, block insertion, and the remaining toolbar actions.
- Leave no active source, dependency, or specification contract that claims collaboration support.

**Non-Goals:**

- Add a replacement collaboration or review workflow.
- Change Personal Notes APIs, save coordination, permissions, or content schema version.
- Automatically migrate persisted pending annotations.
- Rewrite unrelated editor components or archived OpenSpec history.

## Decisions

### Delete the collaboration graph instead of hiding controls

Remove the three runtime kits, the two static base kits, toolbar buttons, node renderers, discussion popovers, comment editor, annotation index, and suggestion styling helper. Hiding buttons alone was rejected because it would retain unused runtime transforms, hard-coded demo identities, bundle weight, and dependency maintenance.

### Let host permissions own editability

Delete the entire Mode selector rather than retain an Editing/Viewing-only version. `PlateEditor.readOnly`, supplied by the Personal Notes permission flow, remains the single source of truth. A second local viewing toggle was rejected because it adds state without a single-user requirement.

### Simplify surviving editor paths at their integration points

Block insertion will call `removeNodes` directly after SuggestionPlugin is removed. Markdown will drop collaboration-only `plainMarks`; link placement will use its normal placement; comment-specific editor variants and types will be removed; inline date, equation, link, mention, and static media renderers will lose annotation styling only. Interactive and static editor kits remain aligned so export does not reference deleted plugins.

### Remove demo and localization residue

Delete annotated paragraphs, comparison rows, hard-coded users and discussions, and the comment-only dictionary key. Active specs will be updated so they no longer preserve or localize removed behavior.

### Avoid an application compatibility shim

Do not add a recursive content normalizer, feature flag, or schema bump without evidence of persisted annotations. A pre-deployment data check is the smallest safe boundary. If annotations exist, resolve them separately before this removal: accept pending suggestions first, then strip comment metadata. Merely stripping suggestion metadata is unsafe because proposed deletions could become visible text.

## Risks / Trade-offs

- [Risk] Existing notes may contain unresolved `suggestion_*` or `comment_*` metadata. → Mitigation: inspect persisted content before deployment; if found, complete a separate accept-and-clean migration before shipping this change.
- [Risk] Removing SuggestionPlugin wrappers could break block insertion. → Mitigation: replace the two `withoutSuggestions` wrappers with their existing inner `removeNodes` calls and verify Insert/Turn Into types compile.
- [Risk] Static export can retain references after runtime cleanup. → Mitigation: remove both base kits from `BaseEditorKit` and statically search all active source and manifests for collaboration imports.
- [Trade-off] Existing unresolved review state is not supported after removal. → Accepted because the product has no collaboration backend or multi-user review workflow.

## Migration Plan

1. Deployment owner checks persisted Personal Notes content for comment or suggestion metadata.
2. If none exists, remove the application graph and dependencies without changing the content schema version.
3. If annotations exist, pause deployment and resolve them through a separate migration before applying this change.
4. Verify remaining editor composition, dependency manifests, localization parity, TypeScript, lint, OpenSpec, and diff integrity.
5. Roll back by reverting the change; no backend or schema rollback is required.

## Open Questions

No application-design questions remain. Deployment still requires confirmation that persisted notes do not contain valuable unresolved annotations.
