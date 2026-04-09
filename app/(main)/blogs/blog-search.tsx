"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"

export function BlogSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const initialSearch = searchParams.get("title[containsIgnoreCase]")?.toString() || ""
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [isPending, setIsPending] = useState(false)

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (term) {
      params.set("title[containsIgnoreCase]", term)
    } else {
      params.delete("title[containsIgnoreCase]")
    }
    
    params.set("page", "1") // reset page on search

    router.replace(`${pathname}?${params.toString()}`)
    setIsPending(false)
  }, 300)

  return (
    <div className="relative flex flex-1 w-full max-w-sm items-center">
      <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Tìm kiếm bài viết..."
        className="w-full bg-background pl-9 pr-9"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setIsPending(true)
          handleSearch(e.target.value)
        }}
      />
      {isPending && (
        <Spinner className="absolute right-2.5 h-4 w-4 text-muted-foreground" />
      )}
    </div>
  )
}
