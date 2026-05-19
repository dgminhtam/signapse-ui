export const SUPPORTED_APP_LOCALES = ["vi", "en"] as const
export type AppLocale = (typeof SUPPORTED_APP_LOCALES)[number]

export const DEFAULT_APP_LOCALE: AppLocale = "vi"

export const APP_LOCALE_SHORT_LABELS: Record<AppLocale, string> = {
  vi: "VI",
  en: "EN",
}

export const APP_LOCALE_INTL: Record<AppLocale, string> = {
  vi: "vi-VN",
  en: "en-US",
}

export function isAppLocale(value: unknown): value is AppLocale {
  return (
    typeof value === "string" &&
    SUPPORTED_APP_LOCALES.includes(value as AppLocale)
  )
}

export function parseAppLocale(value: unknown): AppLocale {
  return isAppLocale(value) ? value : DEFAULT_APP_LOCALE
}

export function getIntlLocale(locale: AppLocale): string {
  return APP_LOCALE_INTL[locale]
}
