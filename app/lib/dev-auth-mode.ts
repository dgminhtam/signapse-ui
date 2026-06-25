import { DEV_AUTH_PERMISSION } from "@/app/lib/permissions"

export function isDevAuthModeEnabled(): boolean {
  return (
    process.env.SIGNAPSE_AUTH_MODE === "disabled" &&
    process.env.NODE_ENV !== "production"
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
