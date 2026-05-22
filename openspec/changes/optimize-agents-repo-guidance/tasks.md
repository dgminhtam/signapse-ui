## 1. Guidance Inventory

- [x] 1.1 Review current `AGENTS.md` and mark duplicated or overly detailed guidance around shadcn chrome, skeletons, toolbar/list/table/form layout, review expectations, and feature completion.
- [x] 1.2 Compare marked recipe-like guidance with existing Signapse skills and decide which rules remain global versus which rules become skill references.

## 2. AGENTS Refactor

- [x] 2.1 Add a concise scope and skill-routing section that defines `AGENTS.md` as repo-wide policy and `.codex/skills` as the home for reusable task workflows.
- [x] 2.2 Consolidate shadcn/radix-nova wrapper and default chrome guidance into one primary policy section while preserving the product-critical constraints.
- [x] 2.3 Consolidate skeleton, toolbar, list table, form shell, cardless workspace, content minimalism, quick detail, language, API, and destructive action guidance so the same rule is not restated across unrelated sections.
- [x] 2.4 Add encoding-safe editing guidance for Markdown, TypeScript, and TSX files, including UTF-8 preservation and narrow edit preference.
- [x] 2.5 Rewrite the review expectations as compact finding categories that reference earlier policy instead of duplicating full implementation rules.
- [x] 2.6 Update the feature completion checklist so Codex-owned verification is explicit and smoke/browser/visual/manual/auth/backend-data QA remains non-gating unless explicitly requested.

## 3. Skill Alignment

- [x] 3.1 Check the referenced Signapse skills for coverage of guidance that AGENTS now summarizes, especially `shadcn`, `implementation-guardrails`, `hydration-mismatch`, `frontend-design`, `accessibility`, and OpenSpec skills.
- [x] 3.2 Make only minimal skill doc updates if AGENTS points to a skill but the skill lacks the referenced workflow or policy.

## 4. Verification

- [x] 4.1 Run `openspec validate optimize-agents-repo-guidance --strict`.
- [x] 4.2 Run static review on `AGENTS.md` to confirm duplicated guidance was reduced and product-critical constraints remain present.
- [x] 4.3 Run `pnpm lint` if implementation touches files covered by lint.
- [x] 4.4 Run `pnpm typecheck` if implementation touches TypeScript or TSX files.
