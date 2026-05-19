## Context

Signapse uses Next.js App Router with React 19 and shadcn `radix-nova` wrappers backed by Radix primitives. Radix `Dialog` powers both `Dialog` and `Sheet`; it creates `contentId`, `titleId`, and `descriptionId` via `useId()` and wires `contentId` to trigger `aria-controls`.

The observed issue is a React hydration warning where the server-rendered trigger has one Radix-generated `aria-controls` value and the client render computes a different one. This is an accessibility attribute mismatch, not a visual layout change. The affected example is the personal notes quick sheet in the app header.

## Goals / Non-Goals

**Goals:**

- Preserve SSR for header and navigation controls.
- Remove Radix-generated id hydration mismatches for affected overlay trigger/content pairs.
- Keep trigger/content accessibility relationships explicit and stable.
- Add an `AGENTS.md` rule so future fixes follow the same debugging and implementation path.
- Keep shadcn wrappers aligned with the installed preset unless a broader wrapper-level pattern is explicitly proposed.

**Non-Goals:**

- Do not disable SSR for all Radix overlays.
- Do not add mount-only wrappers just to silence hydration warnings.
- Do not use `suppressHydrationWarning` for overlay trigger mismatches.
- Do not patch `components/ui/sheet.tsx`, `components/ui/dialog.tsx`, or other shadcn wrappers for a single app-level usage.
- Do not migrate unrelated Sheet/Dialog usages without evidence of the same mismatch.

## Decisions

### Decision 1: Fix affected usage with deterministic ids

When the mismatch is limited to Radix-generated overlay ids, the affected app-level usage will provide a deterministic id for the content and the matching relationship on the trigger. For the quick personal notes sheet, this means a stable content id such as `personal-notes-quick-sheet-content`, passed to `SheetContent id` and `SheetTrigger aria-controls`.

Alternatives considered:

- **Disable SSR for the component**: rejected because the trigger is part of the header and should be available in server-rendered HTML.
- **Use mount-only rendering**: rejected because it causes unnecessary UI disappearance or delayed controls during hydration.
- **Use `suppressHydrationWarning`**: rejected because React will not patch the mismatched attribute and the warning would hide an accessibility relationship mismatch.

### Decision 2: Investigate tree consistency before applying stable ids

Stable ids are the fix only after checking that the server/client tree is otherwise identical. The investigation must rule out common hydration causes such as `typeof window` render branches, time/random values, locale-dependent formatting during render, permission/client-only conditional rendering, invalid nesting, or browser extension interference.

Alternatives considered:

- **Apply stable ids everywhere up front**: rejected because broad changes can mask real hydration bugs and create unnecessary custom conventions.
- **Trust the stack trace only**: rejected because Radix id mismatch can be a symptom of earlier tree divergence.

### Decision 3: Keep wrapper changes out of scope

The project rule is to avoid custom patching shadcn wrappers for local app needs. Since Radix/shadcn wrappers are expected to remain preset-aligned, the initial fix belongs in app-level composition. If the same problem repeats across multiple app-level overlays, a future change may introduce a small shared app-level helper or rule extension.

Alternatives considered:

- **Patch `SheetTrigger` or `DialogTrigger` globally**: rejected because wrapper-level id rewriting can break Radix assumptions and diverge from shadcn preset behavior.
- **Introduce a shared helper immediately**: rejected until there are at least two or more similar usages that justify abstraction.

## Risks / Trade-offs

- [Risk] A stable id can collide if multiple instances of the same overlay render on one page. -> Mitigation: singleton overlays may use constants; repeated list/row overlays must derive ids from stable entity keys or use `useId()` consistently within a stable tree.
- [Risk] Stable ids can hide a deeper tree mismatch if applied too early. -> Mitigation: require root-cause investigation before adding deterministic ids.
- [Risk] Future Radix versions may fix the React 19 mismatch. -> Mitigation: keep workaround local and easy to remove when dependencies are upgraded and verified.
- [Risk] Manual trigger/content wiring can drift. -> Mitigation: define constants near the component and pass the same value to both trigger and content.

## Migration Plan

1. Keep the current quick personal notes sheet fix as the reference implementation.
2. Add `AGENTS.md` guidance under UI/shadcn or hydration review rules.
3. Verify the affected file with lint and manually confirm the console hydration warning no longer appears after a full reload.
4. Do not migrate other overlays unless a matching hydration warning is observed.
