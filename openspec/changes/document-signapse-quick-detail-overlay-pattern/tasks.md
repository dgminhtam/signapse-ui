## 1. Documentation Rewrite

- [x] 1.1 Rename or retitle `docs/pdp-quick-view-drawer-nextjs-shadcn.md` around the Signapse entity quick detail overlay pattern.
- [x] 1.2 Replace ecommerce PDP/product/cart/SKU examples with Signapse graph node, market-chart annotation, event, news article, and source evidence examples.
- [x] 1.3 Document the user journey for opening event or news article detail from Graph View and Market Charts without leaving the current analytical workspace.
- [x] 1.4 Document the canonical URL behavior for soft navigation overlay versus hard navigation full detail page.

## 2. Pattern Guidance

- [x] 2.1 Document `event` and `news-article` as the initial supported entity types and mark other entities as future scope.
- [x] 2.2 Document right-side shadcn `Sheet` as the recommended Signapse overlay shell, using `@/components/ui/sheet` terminology.
- [x] 2.3 Document a future `app/(main)/@quickDetail` parallel route slot and intercepted routes as implementation guidance only.
- [x] 2.4 Document that graph node inspectors and market-chart annotation popups remain lightweight summary surfaces, while quick detail is the richer reading surface.
- [x] 2.5 Document that future implementation should extract shared detail content separately from full page shells.

## 3. Scope And Verification

- [x] 3.1 Add explicit non-goals stating this change does not implement app routes, shared detail components, quick detail UI, API changes, or shadcn primitive changes.
- [x] 3.2 Add future implementation checks for soft navigation, hard navigation, reload, copied URL, Back/Forward, focus handling, scroll containment, loading, error, and permission states.
- [x] 3.3 Review the document for Signapse repo conventions: Vietnamese professional wording where user-facing, no `@workspace/ui`, no Drawer-first guidance, and no ecommerce-only examples.
- [x] 3.4 Run `openspec validate document-signapse-quick-detail-overlay-pattern --strict`.
