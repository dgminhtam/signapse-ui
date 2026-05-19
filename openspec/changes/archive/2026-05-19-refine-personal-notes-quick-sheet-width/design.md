## Context

The personal notes feature already provides a header-triggered quick Sheet and a full `/notes` workspace. The current quick Sheet uses a desktop two-column grid inside a shadcn Sheet, but the Sheet is still constrained by the wrapper's default right-side max width. Because the grid switches to two columns based on viewport width rather than actual Sheet width, the note rail takes a fixed 18rem column and leaves too little space for the editor. The result is a vertical-looking toolbar and cramped writing area.

The user wants the Sheet to be larger, roughly 60% of the screen, while keeping it as a quick overlay.

## Goals / Non-Goals

**Goals:**

- Make the personal notes quick Sheet comfortable on desktop by targeting about 60vw width.
- Keep the current page visible behind the Sheet for quick capture context.
- Preserve a usable note rail plus editor layout when the Sheet has enough room.
- Avoid toolbar collapse and editor crowding at common desktop widths.
- Keep mobile and narrow viewport behavior stable.

**Non-Goals:**

- Replace the full `/notes` workspace.
- Add new note metadata, title, tags, search, sharing, collaboration, or autosave.
- Change backend payloads or permission checks.
- Install a new editor dependency as part of this layout refinement.

## Decisions

### 1. Use a wider desktop Sheet, approximately 60vw

The quick Sheet should override the right-side Sheet max width at the call site with a responsive width target such as `w-[min(60vw,calc(100vw-2rem))]` and a sensible maximum if needed. This keeps the change scoped to the personal notes usage instead of changing the global shadcn Sheet wrapper.

Why:

- The quick note use case benefits from more writing space.
- The user explicitly accepts a larger Sheet around 60% of the screen.
- Changing the global Sheet wrapper would affect unrelated features.

Alternatives considered:

- Keep the current width and switch to one-column only.
- Rejected for this refinement because the user prefers a larger Sheet and the note rail can remain useful at 60vw.
- Make the Sheet full-screen.
- Rejected because the full `/notes` workspace already covers large editing and teaching.

### 2. Let the inner layout respond to usable width, not only viewport width

The two-column rail/editor layout should only appear when the Sheet itself has enough horizontal room. On narrower Sheet sizes, recent notes should stack above the editor or use a compact list area so the editor remains the primary surface.

Why:

- Viewport breakpoints alone caused the current bug.
- The editor toolbar needs enough inline space to remain horizontal and scannable.
- The quick Sheet should degrade gracefully on laptops, zoomed browsers, and split-screen use.

Alternatives considered:

- Force two columns at all desktop viewport sizes.
- Rejected because it repeats the current failure mode.
- Hide recent notes entirely in the Sheet.
- Rejected because quick switching between recent notes is part of the quick capture value.

### 3. Keep `/notes` as the teaching and long-form workspace

The wider Sheet improves quick capture, but the `Mở rộng` action should remain prominent for screen-share teaching, large notes, presentation mode, pagination, and delete-heavy workflows.

Why:

- A 60vw Sheet is more comfortable, but it is still an overlay.
- The full workspace remains the correct place for large editing and presentation.

## Risks / Trade-offs

- [Wider Sheet covers more of the current app] -> Keep it below full width and preserve the overlay behavior with the app still visible behind it.
- [Fixed 60vw may still be cramped on small desktop widths] -> Use responsive constraints and fall back to stacked layout when space is limited.
- [Toolbar may still wrap if too many buttons are visible] -> Verify at common desktop sizes and adjust toolbar overflow/wrapping inside the editor if needed.
