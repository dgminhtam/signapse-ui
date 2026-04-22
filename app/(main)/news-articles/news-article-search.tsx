"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"

import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

export function NewsArticleSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState(searchParams.get("title[containsIgnoreCase]") || "")

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", "1")

    if (term.trim()) {
      params.set("title[containsIgnoreCase]", term.trim())
    } else {
      params.delete("title[containsIgnoreCase]")
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }, 300)

  return (
    <div className="relative flex flex-1 shrink-0">
      <label htmlFor="news-article-search" className="sr-only">
        Tim bai viet tin tuc
      </label>
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="news-article-search"
        className="pl-9 pr-10"
        placeholder="Tim theo tieu de bai viet..."
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          handleSearch(event.target.value)
        }}
      />
      {isPending ? (
        <Spinner className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      ) : null}
    </div>
  )
}
