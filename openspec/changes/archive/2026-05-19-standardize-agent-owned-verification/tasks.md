## 1. Update Repo Guidance

- [x] 1.1 Update `AGENTS.md` verification guidance so Codex-owned completion requires lint/typecheck and OpenSpec validation where applicable, while smoke/browser/manual/auth/backend-data QA is user-owned unless explicitly requested.
- [x] 1.2 Add a task-authoring rule to `AGENTS.md` that future `tasks.md` verification checklists must not include unchecked smoke/browser/manual/auth/backend-data archive gates by default.

## 2. Update OpenSpec Skill Guidance

- [x] 2.1 Update `.codex/skills/openspec-propose/SKILL.md` so future generated task checklists keep smoke/browser/manual/auth/backend-data QA out of default unchecked tasks.
- [x] 2.2 Update `.codex/skills/openspec-apply-change/SKILL.md` so existing smoke-like tasks that are user-owned may be transferred out of the archive gate instead of treated as Codex blockers.

## 3. Migrate Active Change Tasks

- [x] 3.1 Identify active, non-archived `tasks.md` files with unchecked smoke/browser/manual/auth/backend-data verification tasks.
- [x] 3.2 Convert user-owned smoke-like unchecked tasks into checked transfer notes or non-checkbox `User-owned manual QA` notes, preserving the original QA details.
- [x] 3.3 Leave implementation, cleanup, lint, typecheck, static search, dependency, and OpenSpec validation tasks unchecked unless they are actually complete.
- [x] 3.4 Re-run `openspec list --json` and confirm changes that were blocked only by user-owned smoke tasks now report complete or have only real Codex-owned work remaining.

## 4. Verification

- [x] 4.1 Run `pnpm lint` or the narrowest relevant lint command if full lint is blocked by unrelated existing issues.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Run `openspec validate standardize-agent-owned-verification --strict`.
