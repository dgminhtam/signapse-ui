## Why

Page-level back buttons currently use a ghost/small treatment with negative left margin. After the shadcn preset cleanup, that makes these navigation controls feel visually underweighted and inconsistent with the default control system.

Standardizing back buttons to outline/default size gives them a clear affordance without turning them into primary actions.

## What Changes

- Change page-level back buttons from `variant="ghost" size="sm"` to `variant="outline"` with default button size.
- Remove negative alignment offsets such as `className="-ml-2"` from page-level back buttons.
- Remove ad hoc gap classes such as `className="gap-2"` when the default `Button` gap already handles icon spacing.
- Remove manual `ArrowLeft` icon sizing classes and rely on `data-icon="inline-start"` plus button default icon sizing.
- Preserve existing `href`, label text, placement, and page structure.
- Keep pagination previous buttons, drawer close/back behavior, browser-history `router.back()`, and non-page-level controls out of scope.

## Capabilities

### New Capabilities

- `page-back-button-treatment`: Standardizes page-level back button visual treatment, size, and icon composition.

### Modified Capabilities

- None.

## Impact

- Affected page-level back buttons:
  - `app/(main)/events/[id]/page.tsx`
  - `app/(main)/economic-calendar/[id]/page.tsx`
  - `app/(main)/news-articles/[id]/page.tsx`
  - `app/(main)/system-prompts/[promptType]/page.tsx`
  - `app/(main)/system-prompts/create/page.tsx`
  - `app/(main)/news-outlets/create/page.tsx`
  - `app/(main)/news-outlets/[id]/page.tsx`
  - `app/(main)/ai-provider-configs/create/page.tsx`
  - `app/(main)/ai-provider-configs/[id]/page.tsx`
- No API, dependency, route, or data contract changes.
