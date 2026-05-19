## 1. Confirm Current Hydration Fix

- [x] 1.1 Re-read the reported hydration stack and confirm the mismatch is limited to the personal notes quick sheet `aria-controls` generated id.
- [x] 1.2 Verify `components/personal-notes-quick-sheet.tsx` uses one deterministic content id shared by `SheetTrigger aria-controls` and `SheetContent id`.
- [x] 1.3 Confirm no broader server/client tree divergence is introduced by the quick sheet render path.

## 2. Document Repo Rule

- [x] 2.1 Add an `AGENTS.md` rule for Radix/shadcn overlay hydration mismatches under the UI or shadcn guidance section.
- [x] 2.2 The rule must require root-cause investigation before fixes, including checks for browser-only render branches, random/time values, locale render drift, permission/client-only conditional rendering, invalid HTML nesting, and browser extension interference.
- [x] 2.3 The rule must prefer deterministic trigger/content ids for affected SSR-rendered overlay usages when the mismatch is limited to generated accessibility attributes.
- [x] 2.4 The rule must prohibit defaulting to `dynamic(..., { ssr: false })`, mount-only wrappers, `suppressHydrationWarning`, or local patches in `components/ui/*` for this class of issue.
- [x] 2.5 The rule must clarify singleton overlays may use constant ids, while repeated overlays must derive ids from stable entity keys or another collision-free deterministic source.

## 3. Verification

- [x] 3.1 Run lint on the touched files.
- [ ] 3.2 Reload the affected route in development and confirm the hydration warning no longer appears for the personal notes quick sheet trigger.
  - Blocked locally: the dev server responds at `http://localhost:3000/vi`, but this thread has no authenticated browser console or installed Playwright/Puppeteer runtime to verify the client-side hydration warning directly.
- [x] 3.3 Run `openspec validate standardize-radix-hydration-stable-ids --strict`.
