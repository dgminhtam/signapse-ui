## Context

Insert → Image currently calls the shared `insertBlock` transform, whose Image branch calls Plate's `insertMedia()` without a `getUrl` callback. Plate therefore falls back to `window.prompt()`. The fixed Image toolbar already provides the desired localized `AlertDialog`, URL validation, and `img` node insertion. Separately, comment edit and delete guards use the same hardcoded native `alert()` when a comment ID is not ready.

The implementation must preserve the existing media node shape, keep shadcn primitives unchanged, use the existing `sonner` dependency, and avoid patching third-party package code.

## Goals / Non-Goals

**Goals:**

- Give Insert → Image the same localized URL-entry behavior as the fixed Image toolbar action.
- Make Plate's default browser prompt unreachable from application code.
- Replace both comment alerts with one dictionary-backed error toast.
- Leave one static verification boundary covering native browser dialogs.

**Non-Goals:**

- Adding media upload support or another media insertion path.
- Redesigning editor comments, media nodes, or toolbar layout.
- Modifying shadcn wrappers, Plate package sources, or dependencies.
- Localizing unrelated legacy editor copy.

## Decisions

### Reuse one controlled media URL dialog

Extract the existing controlled media URL dialog composition from `MediaToolbarButton` and reuse it from `InsertToolbarButton`. The fixed toolbar keeps its button-owned open state; the Insert toolbar owns separate open state outside the dropdown content so closing the menu does not unmount the dialog.

Alternative considered: duplicate the dialog in the Insert toolbar. Rejected because it would duplicate validation, localization, and node insertion behavior.

### Remove the prompt-capable Image transform branch

Handle the Image item as a dialog-opening action in `InsertToolbarButton`, then delete the `KEYS.img` entry and `insertMedia` import from the shared block transform after confirming no caller needs them. The dialog inserts the same `img` node shape used by the fixed toolbar.

Alternative considered: pass a callback into `insertMedia`. Rejected because opening React modal state through an imperative URL callback adds coordination without reusing the existing dialog surface.

### Use one localized toast message for both comment guards

Add matching Vietnamese and English editor comment dictionary keys and call `toast.error()` from both missing-ID guards. The condition and early return remain unchanged.

Alternative considered: add a custom error component or separate edit/delete messages. Rejected because the failure and recovery are identical and `sonner` is already the application standard.

### Define reachability at the application boundary

Verification scans application source for native `prompt()`, `alert()`, and `confirm()` calls and ensures application code no longer imports or calls Plate's `insertMedia()` prompt path. Third-party package code may retain its unused fallback implementation.

## Risks / Trade-offs

- Dropdown close focus could compete with dialog autofocus → Keep the controlled dialog outside dropdown content and do not refocus the editor when choosing Image.
- A future caller could reintroduce Plate's default prompt → Retain static search for `insertMedia` and native dialog calls in verification.
- The dependency still contains `window.prompt()` internally → Treat unused dependency implementation as out of scope and verify application reachability instead.

## Migration Plan

Apply the dialog reuse and remove the obsolete transform path, replace both comment alerts and add dictionary keys, then run scoped lint, typecheck, production build, static searches, and strict OpenSpec validation. Rollback is a direct code revert; no data migration is required.

## Open Questions

None.
