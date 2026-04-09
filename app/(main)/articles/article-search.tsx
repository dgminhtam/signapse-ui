"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { useState, useTransition } from "react"
import { Spinner } from "@/components/ui/spinner"

export function ArticleSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState(searchParams.get("filter")?.toString() || "")

  const handleSearch = useDebouncedCallback((term) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      params.set("page", "1")
      if (term) {
        params.set("filter", term)
      } else {
        params.delete("filter")
      }
      replace(`${pathname}?${params.toString()}`)
    })
  }, 300)

  return (
    <div className="relative flex flex-1 shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="search"
        className="pl-9 pr-10"
        placeholder="Search articles..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          handleSearch(e.target.value)
        }}
      />
      {isPending && (
        <Spinner className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
    </div>
  )
}
