"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { useOptimistic, useTransition } from "react"

import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const SEARCH_PARAM_KEY = "jobName[containsIgnoreCase]"
const SEARCH_INPUT_ID = "cronjob-search"

export function CronjobSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()
  const currentSearch = searchParams.get(SEARCH_PARAM_KEY)?.toString() || ""
  const [value, setValue] = useOptimistic(currentSearch)

  const handleSearch = useDebouncedCallback((term: string) => {
    const trimmedTerm = term.trim()
    const params = new URLSearchParams(searchParams)
    setValue(trimmedTerm)

    if (trimmedTerm) {
      params.set(SEARCH_PARAM_KEY, trimmedTerm)
    } else {
      params.delete(SEARCH_PARAM_KEY)
    }

    params.set("page", "1")

    const query = params.toString()

    startTransition(() => {
      replace(query ? `${pathname}?${query}` : pathname)
    })
  }, 300)

  return (
    <div className="relative flex w-full items-center sm:w-80 lg:w-96">
      <label htmlFor={SEARCH_INPUT_ID} className="sr-only">
        Tìm tác vụ định kỳ
      </label>
      <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        id={SEARCH_INPUT_ID}
        type="search"
        placeholder="Tìm theo tên tác vụ..."
        className="w-full bg-background pl-9 pr-10"
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          handleSearch(event.target.value)
        }}
      />
      {isPending ? (
        <Spinner className="absolute right-2.5 h-4 w-4 text-muted-foreground" />
      ) : null}
    </div>
  )
}
