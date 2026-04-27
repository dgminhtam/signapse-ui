"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"

import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const SEARCH_PARAM_KEY = "name[containsIgnoreCase]"
const SEARCH_INPUT_ID = "topic-search"

export function TopicSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
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
    <div className="relative w-full sm:w-80 lg:w-96">
      <label htmlFor={SEARCH_INPUT_ID} className="sr-only">
        Tìm chủ đề
      </label>
      <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        id={SEARCH_INPUT_ID}
        type="search"
        placeholder="Tìm theo tên chủ đề..."
        className="pl-8 pr-10"
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          handleSearch(event.target.value)
        }}
      />
      {isPending ? (
        <div className="absolute top-2.5 right-2.5">
          <Spinner className="size-4" />
        </div>
      ) : null}
    </div>
  )
}
