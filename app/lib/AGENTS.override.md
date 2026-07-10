# Library And Contract Instructions

These instructions apply to `app/lib/**` and extend the repository-level guidance.

## Responsibilities

- `app/lib` owns backend DTOs, Zod schemas, permissions, i18n infrastructure, query helpers, path helpers, and reusable domain logic.
- Keep feature contracts in `app/lib/[feature]/definitions.ts`.
- Keep feature permission constants and checks in `app/lib/[feature]/permissions.ts`.
- Reuse shared contracts from `app/lib/definitions.ts`; do not duplicate pagination, sorting, option, or action-result types.
- Do not place route components or visual UI components in this folder.

## Contracts And Validation

- Definitions must reflect the current backend contract, including optionality and nullability.
- Remove stale DTO fields, aliases, and compatibility types when the backend removes them.
- Use Zod v4 for runtime validation of unknown or user-controlled data.
- Reuse inferred schema types when practical; do not maintain parallel types that can silently drift.
- Do not introduce `any`. A narrow `as any` is allowed only at an explicitly documented third-party resolver boundary.
- Keep mapping and parsing functions deterministic and free of UI side effects.

## Permissions

- Reuse `hasPermission()` and `hasAnyPermission()` from `app/lib/permissions.ts`.
- Feature permission names must be declared once as readonly constants.
- Client-safe permission modules must not import Clerk, server actions, or `next/headers`.
- Server-only permission lookup belongs in `permissions-server.ts` or another clearly server-only module.
- Permission failures must fail closed: unavailable permissions resolve to no access, not full access.

## I18n

- Supported locales and the default locale are owned by `app/lib/i18n/config.ts`.
- Vietnamese and English dictionaries must keep the same typed shape.
- Server code obtains locale and dictionaries through `getRequestLocale()` or `getServerDictionary()`.
- Client code consumes localization through `useLocalization()`.
- Locale-aware paths must use helpers from `app/lib/i18n/routing.ts`; do not hardcode `/vi` or `/en`.
- Date, number, percentage, and currency formatting must use the helpers in `app/lib/i18n/format.ts`.
- Keep server-only and client-only i18n modules separated; do not import `server.ts` into client code.

## Helpers

- Prefer platform primitives such as `URL`, `URLSearchParams`, `Intl`, and standard collection methods.
- Extend an existing helper before adding a second implementation of the same transformation.
- Keep utilities narrowly named and scoped; do not create generic abstraction layers for one caller.