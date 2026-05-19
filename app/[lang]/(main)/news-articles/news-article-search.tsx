"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"

import { useLocalization } from "@/app/lib/i18n/provider"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"

const SEARCH_PARAM_KEY = "title[containsIgnoreCase]"
const SEARCH_INPUT_ID = "news-article-search"

export function NewsArticleSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const { dictionary } = useLocalization()
  const [isPending, startTransition] = useTransition()
  const currentSearch = searchParams.get(SEARCH_PARAM_KEY)?.toString() || ""
  const [value, setValue] = useState(currentSearch)

  useEffect(() => {
    setValue(currentSearch)
  }, [currentSearch])

  const handleSearch = useDebouncedCallback((term: string) => {
    const trimmedTerm = term.trim()
    const params = new URLSearchParams(searchParams)
    params.set("page", "1")

    if (trimmedTerm) {
      params.set(SEARCH_PARAM_KEY, trimmedTerm)
    } else {
      params.delete(SEARCH_PARAM_KEY)
    }

    const query = params.toString()

    startTransition(() => {
      replace(query ? `${pathname}?${query}` : pathname)
    })
  }, 300)

  return (
    <div className="w-full sm:w-80 lg:w-96">
      <label htmlFor={SEARCH_INPUT_ID} className="sr-only">
        {dictionary.newsArticles.searchLabel}
      </label>
      <InputGroup>
        <InputGroupAddon>
          {isPending ? (
            <Spinner aria-label={dictionary.newsArticles.searchPending} />
          ) : (
            <Search aria-hidden="true" />
          )}
        </InputGroupAddon>
        <InputGroupInput
          id={SEARCH_INPUT_ID}
          type="search"
          placeholder={dictionary.newsArticles.searchPlaceholder}
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
