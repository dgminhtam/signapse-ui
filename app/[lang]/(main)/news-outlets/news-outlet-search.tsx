"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"

import { useLocalization } from "@/app/lib/i18n/provider"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"

export function NewsOutletSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const { dictionary } = useLocalization()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState(
    searchParams.get("name[containsIgnoreCase]")?.toString() || ""
  )

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)

    params.set("page", "1")

    if (term.trim()) {
      params.set("name[containsIgnoreCase]", term.trim())
    } else {
      params.delete("name[containsIgnoreCase]")
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }, 300)

  return (
    <div className="w-full sm:w-80 lg:w-96">
      <label htmlFor="news-outlet-search" className="sr-only">
        {dictionary.newsOutlets.searchLabel}
      </label>
      <InputGroup>
        <InputGroupAddon>
          {isPending ? (
            <Spinner aria-label={dictionary.newsOutlets.searchPending} />
          ) : (
            <Search aria-hidden="true" />
          )}
        </InputGroupAddon>
        <InputGroupInput
          id="news-outlet-search"
          type="search"
          placeholder={dictionary.newsOutlets.searchPlaceholder}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            handleSearch(event.target.value)
          }}
        />
      </InputGroup>
    </div>
  )
}
