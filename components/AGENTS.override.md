# UI And Shared Component Instructions

These instructions apply to `components/**`. The root guidance may also route UI work under `app/[lang]/**` through this document.

## Component Placement

- Keep route-specific components beside their route under `app/[lang]/`.
- Place a component here only when it is shared across routes, layouts, or features.
- Use relative imports between files in the same component group.
- Keep server components as the default; add `"use client"` only when hooks, browser APIs, or interactive state require it.
- Do not move backend transport, DTO definitions, or permission declarations into UI components.

## Shadcn And Dependencies

- Compose application UI through wrappers in `@/components/ui/`.
- Only files under `components/ui/` may import `radix-ui`, `vaul`, or other original UI primitives directly.
- `components/ui/` follows the `radix-nova` preset and must not receive feature-specific visual customization.
- Before adding, syncing, or modifying a shadcn wrapper, read the `shadcn` skill and inspect the corresponding shadcn documentation and CLI diff.
- Feature and shared components may customize layout, width, alignment, overflow, and responsive behavior, but must preserve wrapper chrome.
- Use Lucide icons and `sonner`; do not introduce a second icon or toast system.
- For `components/assistant-ui/**`, read the focused assistant-ui skill matching the task before changing runtime, primitives, tools, streaming, or markdown behavior.

## Localization And Navigation

- User-facing labels, placeholders, messages, tooltips, and toasts must come from `useLocalization()`.
- Internal links must use `LocalizedLink`, `useLocalizedHref()`, or `useLocalizedPath()`.
- Use localization formatters for dates, numbers, percentages, and currencies.
- Do not call `toLocaleString()` directly during render.
- Do not hardcode `/vi` or `/en`.

## Composition Invariants

- Prefer `gap-*` in flex and grid layouts; do not use `space-y-*`.
- Empty states use `<Empty>`.
- Icons inside buttons use the wrapper's `data-icon` treatment.
- `SelectItem` belongs inside `SelectGroup`.
- `DropdownMenuItem` belongs inside `DropdownMenuGroup`.
- Pending submit and save buttons are disabled and include `<Spinner>`.
- Irreversible destructive actions use `<AlertDialog>` with a clear warning.
- Edit flows provide a ghost Cancel action that restores initial data or exits safely.
- Skeletons and Suspense fallbacks must mirror the final layout closely.
- Long text must use an explicit wrapping, truncation, or line-clamp strategy.

## Shared List And Form Surfaces

- Shared list pages compose `AppListToolbar`, `AppListTable`, and pagination without an outer page Card.
- `AppListToolbar` owns no bottom margin; `AppListTable` provides the standard `mt-4` spacing.
- Toolbar layout uses leading primary actions/search and trailing view controls.
- Tables use the shared header and empty-state components.
- Multiline table cells override the default nowrap behavior locally.
- Forms use `AppFormShell`, `AppFormShellBody`, and `AppFormShellFooter`.
- Use shell widths intentionally: `sm` for simple forms, `md` for common CRUD, and `lg` for dense forms.
- Form bodies compose `FieldGroup` and `FieldSet`.
- Plain timestamps use secondary metadata treatment rather than badges or strong value styling.

## URL State

- Filters, search, sorting, page, and page size remain in the URL.
- Use `page` and `size`; the browser URL is 1-indexed and backend pagination is 0-indexed.
- URL changes use `useTransition()` with `router.push()` or `router.replace()`.
- Search uses a controlled `type="search"` input, an accessible label, and a 300ms debounce.
- Empty search removes the query parameter and resets `page` to `1`.
- Page-size options are `10`, `20`, `50`, and `100`, with `10` as default.

## Accessibility

- Preserve semantic elements, labels, keyboard interaction, focus visibility, and screen-reader names.
- Dialogs and overlays must restore focus safely.
- Icon-only controls require an accessible name.
- Read the `accessibility` skill before changes involving focus, keyboard navigation, dialogs, forms, or screen-reader behavior.