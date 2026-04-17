"use client"

import { useRouter } from "next/navigation"
import { BookOpen } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

import { ingestArticleToWiki } from "@/app/api/wiki/action"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { useHasPermission } from "@/components/permission-provider"
import { cn } from "@/lib/utils"

interface IngestWikiButtonProps {
  articleId: number
  variant?: "ghost" | "outline" | "default" | "secondary"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm"
  showText?: boolean
  redirectToWikiOnSuccess?: boolean
  className?: string
}

export function IngestWikiButton({
  articleId,
  variant = "ghost",
  size = "icon",
  showText = false,
  redirectToWikiOnSuccess = false,
  className,
}: IngestWikiButtonProps) {
  const canIngestWiki = useHasPermission("wiki:ingest")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleIngest = () => {
    startTransition(async () => {
      const result = await ingestArticleToWiki(articleId)

      if (result.success) {
        toast.success("Article added to wiki successfully")

        if (redirectToWikiOnSuccess) {
          router.push(`/wiki/${encodeURIComponent(result.data.slug)}`)
          router.refresh()
          return
        }

        router.refresh()
        return
      }

      toast.error(result.error || "Failed to add article to wiki")
    })
  }

  if (!canIngestWiki) {
    return null
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleIngest}
      disabled={isPending}
      className={cn(
        "text-primary hover:bg-primary/10 hover:text-primary",
        showText && "gap-2 px-3",
        className
      )}
    >
      {isPending ? (
        <Spinner className="h-4 w-4" data-icon="inline-start" />
      ) : (
        <BookOpen className="h-4 w-4" data-icon="inline-start" />
      )}
      {showText ? <span>{isPending ? "Adding..." : "Add to Wiki"}</span> : <span className="sr-only">Add to Wiki</span>}
    </Button>
  )
}
