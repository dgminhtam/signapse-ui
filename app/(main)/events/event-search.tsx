"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { useOptimistic, useTransition } from "react"

import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const SEARCH_PARAM_KEY = "title[containsIgnoreCase],canonicalKey[containsIgnoreCase]"
const SEARCH_INPUT_ID = "event-search"

export function EventSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()
  const currentSearch = searchParams.get(SEARCH_PARAM_KEY)?.toString() || ""
  const [value, setValue] = useOptimistic(currentSearch)

  const handleSearch = useDebouncedCallback((term: string) => {
    const trimmedTerm = term.trim()
    const params = new URLSearchParams(searchParams)
    params.set("page", "1")
    setValue(trimmedTerm)

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
    <div className="relative flex w-full sm:w-80 lg:w-96">
      <label htmlFor={SEARCH_INPUT_ID} className="sr-only">
        Tìm sự kiện
      </label>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id={SEARCH_INPUT_ID}
        type="search"
        className="pl-9 pr-10"
        placeholder="Tìm theo tiêu đề hoặc khóa chuẩn..."
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          handleSearch(event.target.value)
        }}
      />
      {isPending ? (
        <Spinner className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      ) : null}
    </div>
  )
}
