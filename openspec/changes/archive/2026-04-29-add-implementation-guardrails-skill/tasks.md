## 1. Documentation Guardrail

- [x] 1.1 Add a concise implementation guardrail section to `AGENTS.md` covering scope lock, simplicity, surgical edits, and verification.
- [x] 1.2 Ensure the new `AGENTS.md` section stays brief and does not duplicate the full skill content.

## 2. Codex Skill

- [x] 2.1 Create `.codex/skills/implementation-guardrails/SKILL.md` with frontmatter name `implementation-guardrails`.
- [x] 2.2 Define when to use the skill: non-trivial implementation, refactor, bugfix, review, OpenSpec apply, or scope-sensitive cleanup.
- [x] 2.3 Add workflow guidance for clarifying scope, naming assumptions, avoiding speculative abstractions, making surgical edits, and verifying outcomes.
- [x] 2.4 State that `AGENTS.md`, active OpenSpec instructions, and explicit user requests take precedence over this skill.
- [x] 2.5 Keep the skill Signapse-specific and do not copy Claude/Cursor plugin files or long examples from `andrej-karpathy-skills-main`.

## 3. Verification

- [x] 3.1 Confirm `AGENTS.md` and the new skill are readable and use professional Vietnamese where appropriate.
- [x] 3.2 Confirm no runtime application files, dependencies, or unrelated skills were changed.
- [x] 3.3 Run `openspec status --change "add-implementation-guardrails-skill"` and verify the change is apply-ready.
