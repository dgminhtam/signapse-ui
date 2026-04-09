"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"

export function CronjobSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const initialSearch =
    searchParams.get("jobName[containsIgnoreCase]")?.toString() || ""
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [isPending, setIsPending] = useState(false)

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set("jobName[containsIgnoreCase]", term)
    } else {
      params.delete("jobName[containsIgnoreCase]")
    }

    params.set("page", "1")

    router.replace(`${pathname}?${params.toString()}`)
    setIsPending(false)
  }, 300)

  return (
    <div className="relative flex w-full max-w-sm flex-1 items-center">
      <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search cronjob..."
        className="w-full bg-background pr-9 pl-9"
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
