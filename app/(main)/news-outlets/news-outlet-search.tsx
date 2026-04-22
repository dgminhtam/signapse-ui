"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"

import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

export function NewsOutletSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
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
    <div className="relative max-w-sm flex-1">
      <label htmlFor="news-outlet-search" className="sr-only">
        Tim nguon tin
      </label>
      <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        id="news-outlet-search"
        type="search"
        placeholder="Tim theo ten nguon tin..."
        className="pl-8"
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
