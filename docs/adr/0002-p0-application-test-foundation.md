---
status: accepted
---

# Adopt a deterministic P0 application test foundation

Signapse will establish a production-dashboard test foundation with Vitest, React Testing Library, user-event, and MSW. P0 covers deterministic domain, request-boundary, and representative component behavior without a real Clerk session, backend, or browser E2E; Playwright remains a later capability. The suite uses `pnpm test` as a non-watch gate, reports coverage without a global threshold initially, and keeps existing coming-soon and internal-skill checks separate.
