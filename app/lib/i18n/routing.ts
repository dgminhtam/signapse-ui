import {
  AppLocale,
  DEFAULT_APP_LOCALE,
  isAppLocale,
  parseAppLocale,
  SUPPORTED_APP_LOCALES,
} from "./config"

export const LOCALE_HEADER = "x-signapse-locale"

export function getPathLocale(pathname: string): AppLocale | null {
  const segment = pathname.split("/").filter(Boolean)[0]
  return isAppLocale(segment) ? segment : null
}

export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean)

  if (isAppLocale(segments[0])) {
    segments.shift()
  }

  return `/${segments.join("/")}`.replace(/\/$/, "") || "/"
}

export function withLocalePath(pathname: string, locale: AppLocale): string {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`
  const pathWithoutLocale = stripLocaleFromPathname(normalizedPathname)
  return pathWithoutLocale === "/" ? `/${locale}` : `/${locale}${pathWithoutLocale}`
}

export function replacePathLocale(pathname: string, locale: AppLocale): string {
  return withLocalePath(pathname, locale)
}

export function negotiateLocale(acceptLanguage: string | null): AppLocale {
  if (!acceptLanguage) {
    return DEFAULT_APP_LOCALE
  }

  const requestedLocales = acceptLanguage
    .split(",")
    .map((entry) => {
      const [tag, qValue] = entry.trim().split(";q=")
      const quality = qValue ? Number.parseFloat(qValue) : 1
      return {
        lang: tag.toLowerCase().split("-")[0],
        quality: Number.isFinite(quality) ? quality : 0,
      }
    })
    .sort((a, b) => b.quality - a.quality)

  const match = requestedLocales.find((entry) =>
    SUPPORTED_APP_LOCALES.includes(entry.lang as AppLocale)
  )

  return parseAppLocale(match?.lang)
}
