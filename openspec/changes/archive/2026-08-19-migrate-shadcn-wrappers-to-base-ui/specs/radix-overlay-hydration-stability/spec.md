## MODIFIED Requirements

### Requirement: SSR overlay hydration mismatches are investigated before fixing
The system SHALL require root-cause investigation before changing any SSR-rendered Base UI/Radix-backed shadcn overlay to address a hydration mismatch.

#### Scenario: Mismatch is reported on an overlay trigger
- **WHEN** React reports a hydration mismatch on a shadcn overlay trigger such as `DialogTrigger`, `SheetTrigger`, `AlertDialogTrigger`, `PopoverTrigger`, or a migrated Base UI overlay
- **THEN** the implementation MUST first check for server/client render divergence such as browser-only branches, random or time-dependent render values, locale-dependent formatting, permission/client-only conditional rendering, invalid HTML nesting, or browser extension interference

### Requirement: Deterministic ids preserve trigger and content relationships
The system SHALL use deterministic ids for affected SSR-rendered shadcn overlay trigger/content pairs when the mismatch is limited to generated accessibility attributes.

#### Scenario: Singleton overlay has generated id mismatch
- **WHEN** a singleton overlay trigger renders a mismatched generated `aria-controls` value between server and client
- **THEN** the implementation MUST provide a stable content id and use the same id for the trigger/content relationship without changing visible behavior

#### Scenario: Repeated overlay has generated id mismatch
- **WHEN** repeated overlays such as row actions or list items require stable ids
- **THEN** the implementation MUST derive ids from stable entity keys or another deterministic source that cannot collide within the page

### Requirement: Hydration fixes preserve SSR and shadcn wrapper integrity
The system SHALL preserve SSR and shadcn wrapper alignment when fixing Base UI/Radix-backed overlay hydration mismatches.

#### Scenario: Overlay mismatch can be fixed at app composition
- **WHEN** an app-level overlay usage can provide deterministic ids at the trigger/content composition boundary
- **THEN** the implementation MUST prefer the app-level fix over disabling SSR, mount-only rendering, `suppressHydrationWarning`, or patching the default shadcn wrapper

#### Scenario: Same mismatch repeats across multiple overlays
- **WHEN** the same generated-id mismatch is confirmed across multiple overlay usages
- **THEN** the implementation MUST propose a scoped app-level helper or wrapper extension rule before applying broad changes

### Requirement: Agent guidance documents the hydration pattern
The system SHALL document the Base UI/Radix-backed shadcn overlay hydration fix pattern in `AGENTS.md`.

#### Scenario: Future agents review overlay hydration issues
- **WHEN** an agent encounters a shadcn overlay hydration mismatch
- **THEN** `AGENTS.md` MUST instruct the agent to investigate root cause, keep SSR by default, avoid suppression or no-SSR escape hatches, prefer deterministic ids for the affected usage, and avoid patching default shadcn wrappers for local issues
