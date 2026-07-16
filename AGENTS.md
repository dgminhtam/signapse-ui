# AGENTS.md

This document is the active repo-wide instruction file for Codex when working in Signapse UI.

## CodeGraph

- When the user asks about architecture, execution flow, bugs, refactors, impact review, or where code should be changed, prefer CodeGraph before manually opening files or running `rg`.
- Use `codegraph_context` as the default entry point for questions like "how does X work", bug investigation, or identifying related entry points.
- Use `codegraph_trace` when the task needs the path from symbol/interaction A to B, `codegraph_impact` before refactors, `codegraph_search` for fast symbol lookup, and `codegraph_explore` to gather several related symbols/files in one pass.
- Fall back to `rg`, direct file reads, or other tools only when CodeGraph lacks an index, returns insufficient context, or the task requires content outside symbols such as dictionaries, CSS, Markdown, config, or OpenSpec docs.

## Scoped Instructions And Skills

- `AGENTS.md` holds only repo-wide architecture, workflow, verification, and review policy.
- Before implementing or reviewing `app/api/**`, read `app/api/AGENTS.override.md`.
- Before implementing or reviewing `app/lib/**`, read `app/lib/AGENTS.override.md`.
- Before UI work under `app/[lang]/**` or `components/**`, read `components/AGENTS.override.md`.
- When a task spans multiple domains, read every applicable scoped instruction file.
- Scoped instructions extend this file; the more specific instruction wins when guidance conflicts.
- `.agents/skills` holds detailed recipes. When a task touches one of the domains below, read the corresponding skill before implementation or review.
- `shadcn`: adding, fixing, composing shadcn components, wrappers, CLI, docs, presets, and styling rules.
- `hydration-mismatch`: investigating hydration mismatch on Radix/shadcn overlays.
- `frontend-design`: redesign, UI polish, dashboards/workbenches, or new layouts that need visual direction.
- `accessibility`: keyboard, focus, screen reader, semantic markup, dialog/form accessibility.
- `api-mapping-sync`: when `docs/api_mapping.json`, `docs/APIMAPPING.md`, or backend contracts change.
- OpenSpec skills: use `openspec-propose`, `openspec-apply-change`, `openspec-archive-change`, and `openspec-explore` in the correct phase.

## Commands

- Prefer slash commands: `/dev`, `/build`, `/lint`, `/format`, `/typecheck`.
- Shell fallbacks: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm format`, `pnpm typecheck`.
- Run the production server with `pnpm start`.

## Architecture

Signapse UI is an admin dashboard built with **Next.js 16 App Router** for an AI-integrated trading signal system.

- **Stack:** Clerk, shadcn/ui, Tailwind CSS v4, Lucide icons, Geist, Geist Mono, and Zod v4.
- **Route groups:** `app/[lang]/(main)/` is the protected app, `app/[lang]/(auth)/` is Clerk auth, and `app/api/[feature]/action.ts` contains server actions by feature.

## Feature Structure

Each feature should live in its own folder when appropriate:

```text
app/[lang]/(main)/[feature]/
├── page.tsx              # Server Component: cardless workspace + Suspense boundary
├── [id]/page.tsx         # Detail page: cardless workspace + standard back button
├── error.tsx             # Local error boundary
├── [feature]-list.tsx    # Client Component: table/list + toolbar
├── [feature]-create-form.tsx
├── [feature]-update-form.tsx
└── [feature]-search.tsx
```

- Use relative imports such as `./component-name` for components inside the same feature.
- Add `error.tsx` for local server errors when the feature has a meaningful route/page.
- Create and update must not share one submit-owning form component; share only field primitives/helpers that are not mode-dependent.

## Implementation Guardrails

- Before non-trivial changes, lock scope with the goal, assumptions, non-goals, and completion criteria.
- Prefer the simplest solution that satisfies the requirement; do not add abstractions, config, or fallbacks without a clear need.
- Make surgical edits: only change directly related files, follow existing style, and do not clean up unrelated code.
- When replacing a library/vendor UI or chart engine, the migration must remove old unused sources completely: dependency, imports/types/helpers, adapters, attribution/vendor copy, active OpenSpec/docs references, and temporary dead components.
- When editing Markdown, TS, or TSX, keep UTF-8 and avoid whole-file rewrites through commands that may change encoding/newlines. Prefer `apply_patch`; if a script/bulk edit is unavoidable, keep it narrow, encoding-aware, and check the diff/readability afterwards.
- Finish agent-owned work with appropriate verification such as lint, typecheck, OpenSpec validation, static search, or deterministic review; if verification cannot run, state why.
- When creating/updating OpenSpec `tasks.md`, the default verification checklist should include only checks Codex can run from the repo. Do not add smoke/browser/visual/manual/auth/backend-data QA as archive-blocking checkboxes unless the user explicitly asks; when needed, record them as non-checkbox notes such as `User-owned manual QA`.

## I18n And Locale Routing

- The app uses locale route `app/[lang]` with locales declared in `app/lib/i18n/config.ts`; do not create parallel UI routes outside `[lang]`.
- User-facing copy must come from dictionaries through `getDictionary()`, `getServerDictionary()`, or `useLocalization()`; do not hardcode labels, toasts, placeholders, or menu text in new components.
- When removing or replacing a UI route, remove old redirect compatibility routes in the same change unless the user explicitly asks to keep a legacy redirect.

## Shadcn And Theme Policy

- Feature/shared code must use `radix-nova` default chrome; `className` on shadcn primitives should be used only for layout such as width, max-width, flex/grid, gap, alignment, max-height, overflow, truncate, or responsive constraints.
- Do not add `h-*`, `min-h-*`, `rounded-*`, padding, foreground/background, border, ring, shadow, or typography classes to primitives only to change default height, radius, color, border, or density.
- Badge is the explicit color exception to the preceding `className` restrictions. Prefer the built-in `default`, `secondary`, `destructive`, `outline`, or `ghost` variants when they express the intended meaning.
- When a Badge needs a categorical color not covered by a built-in variant, only these exact palettes are allowed: blue (`bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300`), green (`bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300`), sky (`bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300`), purple (`bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300`), and red (`bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300`). This exception applies only to `<Badge>` and does not permit raw palette or manual `dark:` color classes on other primitives.
- When compact controls are needed, prefer existing variant/size options; hard-code height/radius only when no suitable size/variant exists and there is a clear product reason.
- Theme tokens in `app/globals.css` and `tailwind.baseColor` in `components.json` must follow the `radix-nova` neutral default; do not silently change `--primary`, `--accent`, `--sidebar-*`, chart tokens, or wrapper chrome to fix a local issue.

## UI Composition Invariants

- After a successful submit, use `router.push()` back to the list page, then `router.refresh()`.
- The top loading bar must always be enabled for page transitions.
- Time metadata on list/detail/drawer/supporting panels uses secondary treatment: inline icon `size-3`, `text-xs text-muted-foreground tabular-nums`; do not use badges or strong value styling for plain timestamps.

## List, Search And Pagination

- List search belongs in `[feature]-search.tsx`, uses a controlled input initialized from `useSearchParams()`, and syncs when the query param changes.
- Search uses `use-debounce` at `300ms`; do not add a `Search` button unless there is a specific business requirement.
- When search changes, trim the value, remove the query param if empty, and reset `page` to `1`.
- Search input must have `type="search"`, an `id`, and an `sr-only` label.
- Search composes with `InputGroup`, `InputGroupInput`, and `InputGroupAddon`; the idle icon and pending `<Spinner>` replace each other in the leading addon. Do not use absolute icons, trailing spinners, or reserved trailing width.
- Search wrapper is consistently `w-full sm:w-80 lg:w-96`; search sits in the leading area with the primary action, while view controls such as filter/sort/page size sit in the trailing area.
- Page size selector belongs in trailing controls, uses standard options `10`, `20`, `50`, `100`, default `10`; do not duplicate it in footer pagination.
- Sort/page size controls use disabled-only pending feedback; do not render a spinner inside or beside the select trigger.

## Page, Toolbar, Table And Form Layout

- Pages in `app/[lang]/(main)` use the cardless workspace from the parent padding layout; do not wrap the whole page in a main `<Card>` just to repeat breadcrumb title.
- Breadcrumb in the app header is the primary page identity for simple pages; if the label is wrong, fix breadcrumb mapping instead of adding a duplicate heading.
- Use `<Card>` only for inner surfaces with real boundaries such as form sections, detail panels, dashboard tiles, access-denied/error panels, or repeated items.
- List pages render shared toolbar, `AppListTable`, and pagination surface directly; do not add an outer main Card/Header/Title/Description/Separator.
- Toolbar responsiveness uses `flex-col sm:flex-row sm:justify-between`; leading is primary action/search, trailing is view controls.
- Primary toolbar controls use default shadcn size/chrome; do not add custom height/radius/padding or `size="sm"` only to change density.
- Boolean toggles in list/table rows use a compact status capsule with label, switch, `aria-label`, stable disabled/pending behavior, and skeletons that mirror the shape.
- Form body uses `FieldGroup`, `FieldSet`, and `gap-*`. Footer is separated from the body by border/subtle background and contains primary and secondary actions.
- Switches in create/update/detail use compact field treatment; this rule does not apply to row list/table capsules, toolbar/workbench toggles, dialog permission matrices, or route row switches.

## Quick Detail Overlay

- Quick detail on analytical workspaces such as Graph View, Market Charts, or dense data workbenches must be a local overlay owned by the workspace through local state.
- Opening/closing quick detail must not change the URL or use `router.back()`, `router.push()`, or `router.replace()` just to manage drawer state.
- Canonical detail routes such as `/events/{id}` and `/news-articles/{id}` remain full detail pages by default for normal links, reloads, copied URLs, direct navigation, and list/detail CRUD.
- Local quick detail drawers must include loading, error/access-denied states inside the overlay, focused content that does not embed the full page shell, and a clear action to open the canonical full detail page.
- If route interception is desired for quick detail, it needs a separate proposal covering route scope, affected links, Back/Forward behavior, how to avoid reloading the workspace behind it, and source cleanup plan; do not add global `@quickDetail` under `(main)` as the default pattern.

## Content, Language And Accessibility

- Each screen should show only text that helps users make decisions or complete tasks; do not add copy that repeats breadcrumb/control/metric meaning.
- Avoid decorative badges, page identity body headings, hero copy, `CardDescription`, panel placeholders, or implementation-detail copy when it does not add decision value.
- Dense data screens prioritize controls and primary data; long copy, roadmap/future feature notes, and legal/vendor notes should move to tooltips, small help text, footer legal areas, or docs.
- Vendor/license attribution must not be silently removed; if it leaves the main surface, replace it with a notice/link in a user-accessible location.
- When a UI change has keyboard/focus/screen reader risk, read `.codex/skills/accessibility`.

## Sidebar

- Real active sidebar items use `sidebar-primary` and `sidebar-primary-foreground` as a neutral selected surface; they should not feel like CTA/inverse buttons.
- Hover uses `sidebar-accent`; focus-visible keeps `sidebar-ring`; focus is an accessibility state and must not be mixed with selected/current state.
- An open parent does not use background state; expanded state only needs chevron rotation.
- Active items and parents with active children do not increase font weight solely because of state.
- Do not add custom active color tokens, use global `accent`, or silently change `--sidebar-*` to fix a local issue.
- Density is handled in `AppSidebar`; child lists keep clear left indent, expand reasonably, and use `py-1`.

## Validation And Typing

- Use Zod v4 or later for schema validation.
- If `zodResolver` has a temporary type issue such as `_zod.version`, use `as any` only as a narrow workaround at the resolver boundary.
- Flag `any` as a review finding unless it is a justified narrow boundary workaround.

## Review Expectations

- Review according to the rules in this file and related skills.
- Prioritize findings by drift category: shadcn chrome drift, toolbar/table spacing drift, main-card shell drift, form-shell drift, table surface drift, skeleton mismatch, URL state/search mismatch, API contract hierarchy drift, accessibility regression, UI copy noise, non-Vietnamese UI copy, unsafe destructive action, unchecked `any`.
- For each finding, identify file/line, behavioral or UX risk, and the minimal recommended fix.
- If there are no findings, say that clearly and mention residual risk or checks not run.
