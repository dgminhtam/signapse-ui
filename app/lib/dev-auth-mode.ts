import { DEV_AUTH_PERMISSION } from "@/app/lib/permissions"

export function isDevAuthModeEnabled(): boolean {
  return (
    process.env.SIGNAPSE_AUTH_MODE === "disabled" &&
    process.env.NODE_ENV !== "production"
  )
}

/**
 * P0 browser tests use a stricter sub-mode so normal local dev-auth keeps its
 * existing Clerk-backed developer tools while the fixture browser can boot
 * without any Clerk client or middleware initialization.
 */
export function isP0FixtureModeEnabled(): boolean {
  return (
    isDevAuthModeEnabled() && process.env.SIGNAPSE_E2E_MODE === "fixture"
  )
}

export function getDevAuthPermissions(): string[] {
  return [DEV_AUTH_PERMISSION]
}

export function getDevAuthUser() {
  return {
    id: "dev-auth-user",
    imageUrl: "",
    fullName: "Signapse Developer",
    username: "dev",
  }
}
