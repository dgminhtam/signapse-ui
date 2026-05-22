---
name: hydration-mismatch
description: Investigate and fix hydration mismatches on Radix/shadcn overlays in Signapse without hiding the root cause.
---

# Hydration Mismatch On Radix/shadcn Overlays

Use this skill when a hydration mismatch involves `Dialog`, `Sheet`, `AlertDialog`, `Popover`, or related trigger/content composition.

## Investigation

Always investigate the root cause before changing implementation. Check these common causes first:

- Render branches that depend on `typeof window`.
- `Date.now()` or `Math.random()` in render output.
- Locale-sensitive formatting during render.
- Conditional rendering based on permission or client-only state.
- Invalid HTML nesting.
- Browser extensions mutating the DOM.

## Preferred Fix

- Keep SSR enabled by default.
- If the mismatch is only a Radix-generated accessibility id such as `aria-controls`, provide a deterministic id at app usage level.
- Singleton overlays can use a constant id.
- Repeated row/list overlays must derive ids from a stable entity key or another deterministic non-colliding source.

## Do Not Do

- Do not use `dynamic(..., { ssr: false })` just to hide the mismatch.
- Do not add mount-only wrappers just to hide the mismatch.
- Do not use `suppressHydrationWarning` as a blanket fix.
- Do not patch `components/ui/*` for a local app-level issue.
- If the pattern repeats across many usages, create an OpenSpec proposal for an app-level helper or wrapper.
