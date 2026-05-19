## Context

The project already standardizes on shadcn/ui from `@/components/ui/`, but several app and shared surfaces still compose overlay primitives directly from `radix-ui`. The AI provider model picker, workspace switcher, workspace watchlist editor, and role permission dialog each define their own overlay/content stacking, close button, title, description, and footer structure. This creates visual drift and caused the model picker overlay to blur the whole UI instead of keeping the dialog content clearly above the backdrop.

`components/ui/dialog.tsx` is currently absent, while `alert-dialog.tsx`, `sheet.tsx`, and `drawer.tsx` already exist as shadcn wrappers. The change should add the missing Dialog wrapper through the shadcn workflow and move feature/shared code to those wrappers.

## Goals / Non-Goals

**Goals:**
- Ensure ordinary modal flows use shadcn `Dialog` instead of direct Radix `DialogPrimitive`.
- Ensure destructive confirmations continue to use shadcn `AlertDialog`.
- Ensure side or bottom panels continue to use shadcn `Sheet` or `Drawer`.
- Update `AGENTS.md` so future work treats direct primitive imports in app/feature code as a review finding.
- Keep UI copy Vietnamese and preserve existing business behavior while changing composition.

**Non-Goals:**
- Re-theme shadcn components or alter global Tailwind/theme tokens.
- Rewrite all shadcn wrapper internals to avoid primitive imports; `components/ui/*` is allowed to wrap underlying libraries.
- Introduce a new UI library, overlay manager, or custom modal abstraction.
- Change AI provider validation/model selection business rules beyond fixing dialog composition.

## Decisions

### Add shadcn Dialog instead of hand-composing Radix

Use the shadcn CLI workflow to add `dialog` when missing, then import dialog parts from `@/components/ui/dialog`. This aligns with the local `shadcn` skill, keeps overlay stacking and close behavior centralized, and avoids repeated manual z-index/backdrop classes in feature code.

Alternative considered: keep Radix primitive imports and only adjust `z-index`. That would fix the immediate blur symptom but leave the project with duplicated overlay implementation and no durable guardrail.

### Allow primitive imports only inside shadcn wrapper files

The rule should forbid direct primitive imports in `app/**` and shared app components such as `components/workspace-switcher.tsx`, while allowing `components/ui/*` to import Radix, Vaul, Slot, or other underlying primitives as part of the shadcn source model.

Alternative considered: ban all primitive imports globally. That is not workable because shadcn components are source-owned wrappers around those primitives.

### Refactor known direct DialogPrimitive usages in the same change

The implementation should migrate the visible direct dialog usages discovered during exploration:
- `app/(main)/ai-provider-configs/ai-provider-model-picker-dialog.tsx`
- `app/(main)/roles/role-permission-dialog.tsx`
- `components/workspace-switcher.tsx`
- `components/workspace-watchlist-editor.tsx`

This keeps the new rule honest at the moment it lands. Broader primitive usage inside `components/ui/*` remains valid.

### Keep component choice semantic

The AI provider model picker is an ordinary selection modal and should use `Dialog`. Role permission editing can also remain a `Dialog` because it is a modal editing workflow. Destructive deletes or irreversible confirmations remain `AlertDialog`; drawer-like quick detail surfaces remain `Drawer` or `Sheet`.

## Risks / Trade-offs

- [Risk] Refactoring multiple dialogs can introduce layout drift in dense modals. → Mitigation: preserve existing body structure and only move shell/header/footer/close composition to shadcn Dialog parts.
- [Risk] Adding `components/ui/dialog.tsx` through shadcn could introduce upstream class defaults that differ from existing custom modals. → Mitigation: review generated file, use className overrides at usage sites for width/height only, and avoid manual overlay z-index in feature code.
- [Risk] A hard rule against external UI libraries could block a future legitimate component need. → Mitigation: require explicit proposal/user approval before adding any outside UI dependency.
- [Risk] Existing direct primitive imports may be used for non-overlay patterns. → Mitigation: scope the initial implementation to known dialog primitive usage and document the broader rule in `AGENTS.md` for future review.

## Migration Plan

1. Consult the local `shadcn` skill and shadcn Dialog docs before changing implementation.
2. Add the missing shadcn Dialog component with `pnpm dlx shadcn@latest add dialog` if `components/ui/dialog.tsx` is still absent.
3. Refactor each known `DialogPrimitive` usage to the shadcn Dialog composition.
4. Update `AGENTS.md` with the explicit component usage guardrail.
5. Verify TypeScript, targeted lint for touched files, and a browser smoke check of the AI provider model picker overlay.

## Open Questions

None.
