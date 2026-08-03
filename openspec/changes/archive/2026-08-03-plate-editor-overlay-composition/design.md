## Context

`BlockSelectionPlugin` currently uses Plate's default `afterEditable` renderer, whose hidden shadow input is portaled to `document.body`. The input is the focus target for block-selection operations, including select-all, copy, cut, paste, and deletion. In the Personal Notes Quick Sheet, the body-level input is outside the Radix Sheet focus boundary; `Ctrl/Cmd+A` followed by Delete therefore does not reliably reach the block-selection handlers.

The application currently avoids that path with `disableSelectAll: true` in `components/editor/plugins/block-selection-kit.tsx`. That restores native editor select-all but changes the intended block-selection contract. The fix must preserve the installed Plate behavior, keep the existing Sheet/Dialog portal boundary infrastructure, avoid dependency changes, and remain safe for the standalone `/editor` route.

## Goals / Non-Goals

**Goals:**

- Restore Plate's default block-selection select-all behavior by removing the application override.
- Keep the shadow input inside the nearest overlay boundary when an editor is rendered in a Sheet or Dialog.
- Keep the full upstream block-selection event behavior: keyboard selection, deletion, replacement typing, clipboard operations, duplicate, undo/redo, focus, and selection-area setup.
- Reuse public APIs and existing local portal context without changing generated shadcn wrappers or dependencies.
- Make the local fork easy to compare with the installed `@platejs/selection` renderer after upgrades.

**Non-Goals:**

- Do not change Sheet/Dialog focus-scope configuration.
- Do not migrate the editor from Sheet to Drawer or another overlay primitive.
- Do not add a new portal context, dependency, package alias, or build patch.
- Do not change block-selectability rules, context-menu behavior, or the visual selection renderer.
- Do not redesign Plate's block-selection interactions.

## Decisions

### 1. Override only `render.afterEditable` locally

Add a feature-local renderer based on the currently installed `BlockSelectionAfterEditable` and configure it as `BlockSelectionPlugin.render.afterEditable`. Keep the existing `belowRootNodes` renderer in `block-selection-kit.tsx` unchanged except for removing `disableSelectAll: true` and registering the new renderer.

This keeps the change at Plate's supported plugin slot. It avoids editing `node_modules` and avoids replacing the whole plugin. The local renderer will reuse exported helpers such as `copySelectedBlocks`, `pasteSelectedBlocks`, `selectInsertedBlocks`, and `useSelectionArea`. The small selected-node removal helper remains local because the upstream renderer's previous-block behavior is not exposed by the public removal transform.

Alternatives rejected:

- Keep `disableSelectAll: true`: fixes the symptom by removing block-selection select-all semantics.
- Enable/disable the option conditionally for Sheets: creates route-dependent editor behavior and leaves the focus-boundary defect intact.
- Render the upstream component and move its body portal after mount: introduces a race between React portal ownership and focus events.

### 2. Resolve a local portal host without a body fallback

Resolve the portal target in this order:

1. `useOverlayPortalContainer()` for the nearest Sheet/Dialog provider.
2. The local Plate container's parent, or the Plate container itself when no parent is available.
3. Render nothing until a host exists after mount.

The existing overlay provider already scopes shadcn Popover, DropdownMenu, and Dialog content. Reusing it keeps the shadow input in the same focus boundary as the editor. The standalone editor receives a local host instead of the global body portal. The renderer must never fall back to `document.body`, because that would reintroduce the bug.

### 3. Preserve upstream input and focus semantics

Keep the upstream shadow input's keyboard and clipboard handlers, programmatic focus/blur behavior, hidden visual styling, and `shadowInputRef` registration. Do not add `aria-hidden` or other focus-affecting attributes without a separate accessibility review; this input is intentionally focusable by script even though it is visually hidden.

The local renderer should remain client-only and only access `window`, `document`, or the portal host after mount. This preserves SSR safety and prevents an initial render from trying to portal into an unavailable Sheet or Plate ref.

### 4. Use a manual upstream-sync policy

Record the source version and intentional portal-host delta in the local renderer. On every `@platejs/selection` or `platejs` upgrade:

1. Compare the local renderer with the installed upstream `BlockSelectionAfterEditable`.
2. Port upstream handler/effect changes.
3. Preserve only the local host resolution difference.
4. Run typecheck, lint, and the Sheet/standalone keyboard matrix.

No automatic synchronization script is planned; it would add maintenance code for a single deliberate fork. The long-term removal condition is an upstream Plate option for configuring the shadow-input portal host.

## Risks / Trade-offs

- **[Upstream drift]** The local renderer can miss behavior changes after a Plate upgrade. → Keep the version/provenance comment, make comparison part of dependency-upgrade review, and verify the complete interaction matrix.
- **[Focus behavior]** A local portal host could alter focus restoration or keyboard event routing. → Use the existing provider/container hierarchy, preserve upstream handlers unchanged, and manually test Tab, Escape, Enter, arrows, and Sheet close behavior.
- **[Host lifecycle]** The Sheet ref and Plate container ref are unavailable during the first render. → Render the portal only after mount and when a host is non-null; do not use a global fallback.
- **[Read-only behavior]** The shadow input still receives selection events in a read-only editor. → Preserve upstream `isReadOnly` guards and explicitly test that Delete/Backspace do not mutate content.

## Migration Plan

1. Add the local renderer and wire it into `BlockSelectionKit`.
2. Remove only `disableSelectAll: true`; leave the existing selectable-block and context-menu options intact.
3. Run targeted lint/typecheck and inspect that no app-level `disableSelectAll` override remains.
4. Verify `/editor`, Personal Notes Sheet, read-only mode, clipboard actions, block movement, context menu, nested providers, and focus isolation.
5. If the change must be rolled back, restore the previous kit configuration and remove the local renderer. No persisted data or dependency state is migrated.

## Open Questions

- During implementation QA, confirm whether the local host should be the Plate container or its parent for the standalone editor's overflow behavior. The Sheet/Dialog provider remains the required first choice; this is a layout verification, not a behavior design blocker.
