"use client"

import * as React from "react"
import { LanguagesIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
  APP_LOCALE_SHORT_LABELS,
  AppLocale,
  isAppLocale,
  SUPPORTED_APP_LOCALES,
} from "@/app/lib/i18n/config"
import { useLocalization } from "@/app/lib/i18n/provider"
import { replacePathLocale } from "@/app/lib/i18n/routing"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LANGUAGE_SELECTOR_TRIGGER_ID = "language-selector-trigger"

export function LanguageSelector() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()
  const { locale, dictionary } = useLocalization()
  const localeLabels: Record<AppLocale, string> = {
    en: dictionary.locale.english,
    vi: dictionary.locale.vietnamese,
  }

  function handleLocaleChange(value: string) {
    if (!isAppLocale(value) || value === locale) {
      return
    }

    startTransition(() => {
      const nextPathname = replacePathLocale(pathname, value)
      const queryString = searchParams.toString()
      router.replace(
        queryString ? `${nextPathname}?${queryString}` : nextPathname
      )
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild id={LANGUAGE_SELECTOR_TRIGGER_ID}>
        <Button
          variant="outline"
          disabled={isPending}
          aria-label={dictionary.locale.selectorLabel}
        >
          <LanguagesIcon data-icon="inline-start" />
          {APP_LOCALE_SHORT_LABELS[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        aria-labelledby={LANGUAGE_SELECTOR_TRIGGER_ID}
        className="min-w-40"
      >
        <DropdownMenuLabel>
          {dictionary.locale.currentLanguage}
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={handleLocaleChange}
          >
            {SUPPORTED_APP_LOCALES.map((appLocale: AppLocale) => (
              <DropdownMenuRadioItem
                key={appLocale}
                value={appLocale}
                disabled={isPending}
              >
                {localeLabels[appLocale]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
