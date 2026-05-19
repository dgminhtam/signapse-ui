## 1. Shadcn Preparation

- [x] 1.1 Review the local `shadcn` skill guidance for overlay composition, icon handling, semantic tokens, and installed component checks.
- [x] 1.2 Run `pnpm dlx shadcn@latest docs dialog` and review the current Dialog usage guidance before implementation.
- [x] 1.3 Confirm `components/ui/dialog.tsx` is absent or outdated, then add the shadcn Dialog component through the shadcn CLI workflow without installing any outside UI library.
- [x] 1.4 Review the generated Dialog file and keep primitive imports scoped to `components/ui/dialog.tsx`.

## 2. Dialog Refactor

- [x] 2.1 Refactor the AI provider model picker to use `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, and `DialogClose` from `@/components/ui/dialog`.
- [x] 2.2 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Verify the AI provider model picker keeps dialog content crisp above the backdrop while only the surrounding page is dimmed or blurred.
- [x] 2.3 Refactor the workspace switcher dialog to use the shadcn Dialog wrapper while preserving its current behavior and Vietnamese UI copy.
- [x] 2.4 Refactor the workspace watchlist editor dialog to use the shadcn Dialog wrapper while preserving watchlist selection and save behavior.
- [x] 2.5 Refactor the role permission dialog to use the shadcn Dialog wrapper while preserving permission selection, pending feedback, and save behavior.

## 3. Repo Guardrails

- [x] 3.1 Update `AGENTS.md` with the explicit rule that app and feature code must use shadcn components from `@/components/ui/` instead of direct primitive UI library imports.
- [x] 3.2 Document in `AGENTS.md` that primitive imports are allowed inside shadcn wrapper files under `components/ui/*` but not in app/feature composition.
- [x] 3.3 Document in `AGENTS.md` that outside UI libraries must not be installed unless explicitly approved through a proposal or user decision.
- [x] 3.4 Document in `AGENTS.md` that the local `shadcn` skill must be consulted before adding, fixing, debugging, styling, or composing shadcn components.

## 4. Verification

- [x] 4.1 Run a search to confirm direct `DialogPrimitive` imports are removed from app and shared non-`components/ui` code.
- [x] 4.2 Run TypeScript checking.
- [x] 4.3 Run targeted lint for the touched AI provider, workspace, role, and guidance files.
- [x] 4.4 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke test the AI provider model picker dialog in the browser and confirm the overlay behavior matches the requirement.
- [x] 4.5 Run `openspec validate enforce-shadcn-component-usage --strict`.
