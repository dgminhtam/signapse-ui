## Context

The repository lint command reports 16 errors and 26 warnings. `pnpm.cmd typecheck` currently passes, so the blocking failures are ESLint rules rather than unresolved TypeScript compilation. The errors cover three small groups: unsafe `any` usage at editor/UI library boundaries, React component/callback declaration issues, and render-time ref handling in the font-color toolbar.

The change is intentionally limited to the existing error locations. It must preserve runtime behavior, avoid ESLint configuration changes, and leave all warnings untouched.

## Goals / Non-Goals

**Goals:**

- Make `pnpm.cmd lint` report zero errors by fixing all 16 current errors.
- Replace `any` with existing library types, narrow local types, or runtime guards appropriate to each boundary.
- Preserve component output, editor behavior, drag behavior, copy behavior, and toolbar interaction.
- Keep the diff local to the files responsible for the errors.

**Non-Goals:**

- Do not fix, suppress, reclassify, or otherwise change the 26 existing warnings.
- Do not change ESLint rules, ignore patterns, dependencies, APIs, routes, localization, or product requirements.
- Do not perform unrelated refactoring or redesign the affected UI.

## Decisions

### Use narrow types and guards instead of rule suppression

For the 11 `no-explicit-any` errors, use the most local type that describes the actual value. Prefer existing Plate/React/unified/library types where available. At dynamic element and attribute boundaries, validate the runtime shape and use a safe fallback. If a third-party package has an incompatible declaration, keep any compatibility assertion narrow, use `unknown` as the intermediate boundary, and do not introduce a project-wide escape hatch.

This applies to the editor plugin props/data, callout fields, footnote entries, inline combobox metadata, media attributes, and table drag-handle ref.

### Preserve React component identity with named references

For the three `react/display-name` errors, return the already-named component reference from each wrapper instead of returning an anonymous function. This removes the lint failure without adding `displayName` assignments or changing the component API.

### Declare the copy callback before it is consumed

Move `handleCopy` above the object or callback that references it. The callback's implementation and dependencies remain unchanged; only declaration order changes to satisfy `react-hooks/immutability`.

### Keep ref access event-driven

Ref access in `ColorInput` will happen only inside the user-triggered interaction handler. Avoid cloning arbitrary children or reading/cloning refs during render. Preserve the existing color input trigger and menu behavior using the component's known child structure rather than a generic ref-forwarding abstraction.

### Verify the error budget directly

Run `pnpm.cmd lint` and `pnpm.cmd typecheck` after implementation. The acceptance condition is zero lint errors; the pre-existing warnings are not part of this change and must not be used as a reason to expand scope.

## Risks / Trade-offs

- [Third-party type declarations may not match the installed runtime package] → Keep assertions narrow at the package boundary and confirm with `pnpm.cmd typecheck` and lint.
- [Runtime guards may change behavior for malformed editor nodes] → Retain the existing fallbacks and only replace unsafe casts with equivalent string/type checks.
- [Refactoring the color input render path could alter toolbar interaction] → Keep the existing event handler and trigger semantics, then validate the lint/typecheck result and inspect the focused diff.
- [Warnings may be accidentally modified while editing nearby lines] → Compare the lint output before and after and treat any warning change as out of scope.

## Migration Plan

No migration or deployment step is required. Implement the surgical fixes, run the repository lint and typecheck commands, and review the diff for warning/config/dependency changes. Rollback is a normal revert of the change if verification exposes a behavioral regression.

## Open Questions

None. The scope, affected error classes, and warning exclusion are fixed by the request.
