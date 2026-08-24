import { isAppLocale } from "@/app/lib/i18n/config"

/**
 * The public exception is deliberately narrow: locale roots and sign-in
 * descendants only. Every other pathname remains protected by default.
 */
export function isPublicLandingPathname(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean)
  const locale = segments[0]

  if (!isAppLocale(locale)) return false

  return segments.length === 1 || segments[1] === "sign-in"
}
