import { headers } from "next/headers"

import {
  AppLocale,
  DEFAULT_APP_LOCALE,
  isAppLocale,
} from "./config"
import { getDictionary } from "./dictionaries"
import { getPathLocale, LOCALE_HEADER } from "./routing"

export async function getRequestLocale(): Promise<AppLocale> {
  try {
    const headersList = await headers()
    const headerValue = headersList.get(LOCALE_HEADER)

    if (isAppLocale(headerValue)) {
      return headerValue
    }

    const referer = headersList.get("referer")
    if (referer) {
      return getPathLocale(new URL(referer).pathname) ?? DEFAULT_APP_LOCALE
    }

    return DEFAULT_APP_LOCALE
  } catch {
    return DEFAULT_APP_LOCALE
  }
}

export async function getServerDictionary() {
  const locale = await getRequestLocale()
  return getDictionary(locale)
}
