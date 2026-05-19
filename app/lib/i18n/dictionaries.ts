import "server-only"

import { AppLocale, isAppLocale } from "./config"
import type { Dictionary } from "./dictionary-types"

export type { Dictionary } from "./dictionary-types"

const dictionaries: Record<AppLocale, () => Promise<Dictionary>> = {
  vi: () => import("./dictionaries/vi").then((module) => module.vi),
  en: () => import("./dictionaries/en").then((module) => module.en),
}

export function hasLocale(locale: string): locale is AppLocale {
  return isAppLocale(locale)
}

export async function getDictionary(locale: AppLocale): Promise<Dictionary> {
  return dictionaries[locale]()
}
