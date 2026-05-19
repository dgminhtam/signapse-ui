## 1. Back Button Migration

- [ ] 1.1 Update `app/(main)/events/[id]/page.tsx` back button to `variant="outline"` with default size and no negative margin/gap override.
- [ ] 1.2 Update `app/(main)/economic-calendar/[id]/page.tsx` back button to `variant="outline"` with default size and no negative margin/gap/icon-size override.
- [ ] 1.3 Update `app/(main)/news-articles/[id]/page.tsx` back button to `variant="outline"` with default size and no negative margin override.
- [ ] 1.4 Update `app/(main)/system-prompts/[promptType]/page.tsx` back button to `variant="outline"` with default size and no negative margin override.
- [ ] 1.5 Update `app/(main)/system-prompts/create/page.tsx` back button to `variant="outline"` with default size and no negative margin override.
- [ ] 1.6 Update `app/(main)/news-outlets/create/page.tsx` back button to `variant="outline"` with default size and no negative margin override.
- [ ] 1.7 Update `app/(main)/news-outlets/[id]/page.tsx` back button to `variant="outline"` with default size and no negative margin override.
- [ ] 1.8 Update `app/(main)/ai-provider-configs/create/page.tsx` back button to `variant="outline"` with default size and no negative margin override.
- [ ] 1.9 Update `app/(main)/ai-provider-configs/[id]/page.tsx` back button to `variant="outline"` with default size and no negative margin override.

## 2. Behavior Preservation

- [ ] 2.1 Preserve every back button's existing `href`, visible label text, `asChild` composition, and placement above page content.
- [ ] 2.2 Keep `ArrowLeft data-icon="inline-start"` on every migrated back button.
- [ ] 2.3 Leave pagination previous controls, drawer close/back behavior, `router.back()`, form cancel buttons, and non-page-level controls unchanged.

## 3. Verification

- [ ] 3.1 Run targeted search to confirm page-level `ArrowLeft` back buttons no longer use `variant="ghost"`, `size="sm"`, `className="-ml-2"`, ad hoc `gap-2`, or manual `h-4 w-4` icon sizing.
- [ ] 3.2 Run targeted search to confirm pagination/drawer back controls were not changed.
- [ ] 3.3 Run targeted lint for migrated page files.
- [ ] 3.4 Run `pnpm typecheck`.
- [ ] 3.5 Run `openspec validate standardize-page-back-buttons --strict`.
- [x] 3.6 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Visually smoke check representative create/detail pages for outline/default back button alignment where local auth/data allow it; otherwise document the blocker.
