## Why

The AI provider model picker now uses a shadcn Dialog, but the model list still relies on a custom scroll container and hand-styled button rows. This keeps the most visible part of the picker slightly out of sync with the repo's `radix-nova` shadcn baseline.

## What Changes

- Replace the model picker's custom `overflow-y-auto` list area with shadcn `ScrollArea`.
- Replace custom clickable model row buttons with shadcn `RadioGroup` composed with `Field`, `FieldLabel`, `FieldContent`, `FieldTitle`, `FieldDescription`, and `RadioGroupItem`.
- Add missing shadcn wrappers for `scroll-area` and `radio-group` through the shadcn CLI workflow.
- Preserve the existing selected model state, confirm action, empty state, Vietnamese copy, and parent credential/model business flow.
- Keep layout constraints for dialog height and list containment, but avoid custom row chrome such as hand-written border, radius, hover, selected, or check-icon treatments.

## Capabilities

### New Capabilities
- `ai-provider-model-picker-choice-list`: Defines the AI provider model picker list behavior and shadcn-composed choice-card presentation.

### Modified Capabilities
- None.

## Impact

- Affected UI: `app/(main)/ai-provider-configs/ai-provider-model-picker-dialog.tsx`
- Affected shadcn wrappers: add `components/ui/scroll-area.tsx` and `components/ui/radio-group.tsx`
- Affected dependencies: no new external UI libraries; wrappers use existing shadcn/Radix dependency pattern
- Expected verification: shadcn dry-run/view for wrappers, targeted lint for touched files, `pnpm typecheck`, and a smoke review of the model picker dialog when browser/auth state is available
