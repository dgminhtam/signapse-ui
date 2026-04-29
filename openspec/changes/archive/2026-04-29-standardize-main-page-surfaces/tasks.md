## 1. Repo Guidance And Scope Audit

- [x] 1.1 Update `AGENTS.md` to replace the old main-card page rule with cardless workspace guidance for `app/(main)` pages.
- [x] 1.2 Update `AGENTS.md` review expectations and feature checklist so decorative top-level main `Card` shells are review findings, while meaningful inner cards remain allowed.
- [x] 1.3 Audit all `app/(main)/**/page.tsx` files that import `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, or `Separator`, and classify each usage as main-shell removal or meaningful inner surface retention.
- [x] 1.4 Correct breadcrumb labels in `components/app-breadcrumbs.tsx` that now serve as canonical page identity after duplicated card titles are removed.

## 2. Cardless Page Migration

- [x] 2.1 Remove decorative main-card shells from active list pages, including permission-denied and suspense fallback branches, while preserving existing data fetching, permissions, search, sort, pagination, and table behavior.
- [x] 2.2 Remove decorative main-card shells from create and edit pages, preserving form flows, cancel behavior, pending states, and safe section grouping for form content.
- [x] 2.3 Remove decorative main-card shells from detail pages, preserving dynamic titles, back navigation, detail panels, related sections, and meaningful inner card surfaces.
- [x] 2.4 Remove decorative main-card shells from tool and dashboard pages, preserving meaningful repeated cards, workbench panels, and access-denied states.
- [x] 2.5 Update page-local skeletons and suspense fallbacks so loading states mirror the new cardless workspace instead of the removed main-card shell.

## 3. Cleanup

- [x] 3.1 Remove unused imports from `components/ui/card` and `components/ui/separator` after each migrated page no longer needs them.
- [x] 3.2 Remove dead wrapper components, duplicate page descriptions, stale static headings, and layout classes that only supported `Card > CardHeader > Separator > CardContent`.
- [x] 3.3 Ensure `Card` remains only where it represents a meaningful inner surface such as repeated dashboard items, form/detail sections, access-denied panels, or workbench panels.
- [x] 3.4 Ensure user-facing copy touched by the migration remains professional Vietnamese and no stale mojibake text is left in migrated page shells.

## 4. Verification

- [x] 4.1 Run grep checks to confirm no active page still uses the decorative main-card shell pattern.
- [x] 4.2 Run grep checks to confirm unused `Card*` and `Separator` imports were removed from migrated files.
- [x] 4.3 Run `pnpm typecheck`.
- [x] 4.4 Run `pnpm build`.
- [x] 4.5 Smoke inspect representative list, create, edit, detail, dashboard, and tool pages if a local authenticated session is available.
