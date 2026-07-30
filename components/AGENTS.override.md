# UI And Shared Component Instructions

These instructions apply to `components/**`. The root guidance may also route UI work under `app/[lang]/**` through this document.

Before implementing or reviewing any user-visible UI or interaction in this scope, read `docs/design/DESIGN.md`; it is the source of truth for UI/UX outcomes.

## Component Placement

- Keep route-specific components beside their route under `app/[lang]/`.
- Place a component here only when it is shared across routes, layouts, or features.
- Use relative imports between files in the same component group.
- Keep server components as the default; add `"use client"` only when hooks, browser APIs, or interactive state require it.
- Do not move backend transport, DTO definitions, or permission declarations into UI components.

## Shadcn And Dependencies

- Compose application UI through wrappers in `@/components/ui/`.
- Only files under `components/ui/` may import `radix-ui`, `vaul`, or other original UI primitives directly.
- Before adding, syncing, or modifying a shadcn wrapper, read the `shadcn` skill and inspect the corresponding shadcn documentation and CLI diff.
- Use Lucide icons and `sonner`; do not introduce a second icon or toast system.

## Localization And Navigation

- User-facing labels, placeholders, messages, tooltips, and toasts must come from `useLocalization()`.
- Internal links must use `LocalizedLink`, `useLocalizedHref()`, or `useLocalizedPath()`.
- Use localization formatters for dates, numbers, percentages, and currencies.
- Do not call `toLocaleString()` directly during render.
- Do not hardcode `/vi` or `/en`.

## Composition Invariants

- `SelectItem` belongs inside `SelectGroup`.
- `DropdownMenuItem` belongs inside `DropdownMenuGroup`.
- Irreversible destructive actions use `<AlertDialog>` with a clear warning.

## URL State

- URL changes use `useTransition()` with `router.push()` or `router.replace()`.
- URL-backed search components sync a controlled input from `useSearchParams()` and use `use-debounce`.

## Accessibility Workflow

- Read the `accessibility` skill before changes involving focus, keyboard navigation, dialogs, forms, or screen-reader behavior.
