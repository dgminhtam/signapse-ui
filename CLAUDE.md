# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use slash commands: `/dev`, `/build`, `/lint`, `/format`, `/typecheck`

To start the production server: `pnpm start`

## Architecture

**Next.js 16 App Router** management dashboard for an AI-powered trading signal system.

- **Auth:** Clerk (JWT injected via `fetchAuthenticated()` in `app/lib/utils.ts`)
- **UI:** shadcn/ui (`@/components/ui/`) + Tailwind CSS v4, Lucide icons, Geist font
- **Toasts:** `sonner` only — never `alert()`
- **Validation:** Zod v4 on both frontend and backend DTO mapping

### Route groups

- `app/(main)/` — Protected routes. `layout.tsx` checks Clerk auth server-side.
- `app/(auth)/` — Clerk sign-in pages.
- `app/api/[feature]/action.ts` — Server Actions per feature.

### Feature folder convention

Each feature lives entirely in its own directory:

```
app/(main)/[feature]/
├── page.tsx              # Server Component: fetch + Suspense + Skeleton
├── error.tsx             # Local error boundary
├── [feature]-list.tsx    # Client Component: table/list
├── [feature]-form.tsx    # Client Component: create/edit form
└── [feature]-search.tsx  # Client Component: debounced search
```

### State management

- **URL-as-State:** All filters and pagination go in the URL (`page`/`size` query params). URL is 1-indexed; backend expects 0-indexed.
- Use `useTransition` + `router.push/replace` for URL updates.
- Search inputs must debounce (300ms) via `use-debounce`.

## Development Rules (from `.agents/rules/main.md`)

### API calls
- Always use `fetchAuthenticated()` to attach Clerk JWT automatically.
- Call `response.text()` before `JSON.parse()` to avoid crashes on empty backend responses.

### UX requirements (all mandatory)
- Submit/Save buttons **must** show `<Spinner>` and be `disabled={isPending}` during requests.
- Destructive actions (delete) **must** use `<AlertDialog>` with an irreversibility warning.
- Edit forms **must** have a `variant="ghost"` Cancel button that resets to original state.
- After successful form submit: `router.push()` to list page + `router.refresh()`.
- Skeleton loaders must match the real layout exactly (same columns, sizes) to prevent layout shift.

### UI conventions
- Use `gap-*` in flex/grid (not `space-y-*`) to avoid layout bugs with conditional rendering.
- Empty states: always use `<Empty>` component, never bare text.
- Icons inside buttons: use `data-icon="inline-start"` attribute.
- `SelectItem` must be inside `SelectGroup`; `DropdownMenuItem` inside `DropdownMenuGroup`.

### shadcn/ui components
- **Do not modify** files in `@/components/ui/` (especially `sidebar.tsx`). These are kept pristine for upstream updates.
- If a bug appears (e.g., hydration mismatch), fix it at the usage site (e.g., `app-sidebar.tsx`), not inside `ui/`.

### Language
- All UI text (labels, placeholders, toasts, metadata) must be **professional English** — no mixing languages.

## Environment Variables

Required in `.env`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
API_BASE_URL   # e.g. http://localhost:8484
```

## Feature Completion Checklist

Before marking a feature done:
- [ ] `page.tsx` has `Suspense` with a layout-accurate `Skeleton`
- [ ] `error.tsx` exists for server error handling
- [ ] Search uses debounce
- [ ] All UI text is professional English
- [ ] Submit buttons have `Spinner` + disabled state
- [ ] Delete actions use `AlertDialog`
- [ ] Success redirects do `router.push()` + `router.refresh()`
