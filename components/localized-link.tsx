"use client"

import Link, { type LinkProps } from "next/link"
import * as React from "react"

import { useLocalization } from "@/app/lib/i18n/provider"
import { withLocalePath } from "@/app/lib/i18n/routing"

type LocalizedHref = LinkProps["href"]

function localizeHref(
  href: LocalizedHref,
  locale: ReturnType<typeof useLocalization>["locale"]
) {
  if (typeof href === "string") {
    return href.startsWith("/") ? withLocalePath(href, locale) : href
  }

  if (typeof href.pathname === "string" && href.pathname.startsWith("/")) {
    return {
      ...href,
      pathname: withLocalePath(href.pathname, locale),
    }
  }

  return href
}

export function useLocalizedHref(href: LocalizedHref) {
  const { locale } = useLocalization()
  return React.useMemo(() => localizeHref(href, locale), [href, locale])
}

export function useLocalizedPath(path: string) {
  const { locale } = useLocalization()
  return React.useMemo(() => withLocalePath(path, locale), [path, locale])
}

export function LocalizedLink({
  href,
  ...props
}: React.ComponentProps<typeof Link>) {
  const localizedHref = useLocalizedHref(href)

  return <Link href={localizedHref} {...props} />
}
