---
name: accessibility
description: Improve accessibility for web UI in this repo. Use for WCAG 2.2 audits, keyboard and focus fixes, screen reader support, semantic markup, accessible forms, dialogs, and navigation.
---

# Accessibility

Use this skill when changing accessibility-sensitive UI or when the user explicitly asks for accessibility improvements.

## Goals

- Improve keyboard accessibility, focus management, and semantic structure.
- Improve screen reader support with labels, names, roles, and descriptions.
- Improve WCAG 2.2 AA compliance for forms, navigation, feedback, and interactive controls.
- Reduce regressions by pairing UI changes with manual accessibility checks.

## Core checklist

### Perceivable

- Every meaningful image needs an `alt`.
- Decorative images must use `alt=""`.
- Icon-only buttons must have an accessible name.
- Color must not be the only error or status signal.
- Text and UI controls must meet contrast requirements.

### Operable

- Every interactive control must be reachable and usable with keyboard only.
- Never remove focus styles without replacing them with a visible equivalent.
- Avoid keyboard traps.
- Respect `prefers-reduced-motion`.
- Interactive targets should meet the WCAG 2.2 minimum target size expectation.

### Understandable

- Inputs need associated labels.
- Errors should be specific, visible, and announced to assistive tech.
- Navigation and help affordances should stay consistent across pages.
- User-facing content should be clear and predictable.

### Robust

- Prefer native HTML elements over ARIA re-creations.
- Use ARIA only when native semantics are not sufficient.
- Dynamic updates should use `aria-live` or equivalent patterns when users need announcements.

## Working rules

- Prefer native elements like `button`, `input`, `label`, `dialog`, and `nav`.
- For icon buttons, use `aria-label` or visually hidden text.
- For forms, set `aria-invalid` and connect errors with `aria-describedby` when needed.
- For dialogs and overlays, ensure focus moves in, stays constrained appropriately, and returns on close.
- For skip navigation, add a skip link when pages have repeated top navigation.

## Minimum manual test pass

- Tab through the whole screen without getting stuck.
- Activate primary actions with Enter and Space where appropriate.
- Confirm visible focus on all actionable elements.
- Verify forms expose labels and errors correctly.
- Verify the page is still usable at 200% zoom.
- Verify reduced-motion users are not forced through heavy animation.

## References

- [WCAG criteria reference](references/WCAG.md)
- [Accessibility code patterns](references/A11Y-PATTERNS.md)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
