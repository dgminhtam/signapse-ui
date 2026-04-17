import { Suspense } from "react"
import { format } from "date-fns"
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  FileText,
  Hash,
  Layers3,
  RefreshCcw,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getWikiPageBySlug, getWikiPageSources } from "@/app/api/wiki/action"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { WikiPageResponse, WikiPageSourceRefResponse } from "@/app/lib/wiki/definitions"
import { AccessDenied } from "@/components/access-denied"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import { WikiSourceReferences } from "../wiki-source-references"

type ApiLikeError = Error & { status?: number }

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

function formatDateTime(value?: string) {
  if (!value) {
    return "N/A"
  }

  return format(new Date(value), "dd/MM/yyyy HH:mm")
}

function getPageTypeLabel(pageType: string) {
  switch (pageType) {
    case "INDEX":
      return "Index"
    case "SOURCE_SUMMARY":
      return "Source Summary"
    default:
      return pageType
  }
}

function isNotFoundError(error: unknown) {
  if (!(error instanceof Error)) {
    return false
  }

  if ((error as ApiLikeError).status === 404) {
    return true
  }

  return /(?:^|\b)(?:404|not[\s-]?found)(?:\b|$)/i.test(error.message)
}

export default async function WikiDetailPage({ params }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "wiki:read")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wiki Detail</CardTitle>
          <CardDescription>
            View synthesized wiki content and the source articles used to build this page.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="You do not have permission to view wiki details."
            permission="wiki:read"
          />
        </CardContent>
      </Card>
    )
  }

  const { slug } = await params

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/wiki">
            <ArrowLeft className="mr-2 h-4 w-4" data-icon="inline-start" />
            Back to wiki
          </Link>
        </Button>
      </div>

      <Card>
        <Suspense fallback={<WikiDetailSkeleton />}>
          <FetchWikiData slug={slug} />
        </Suspense>
      </Card>
    </div>
  )
}

async function FetchWikiData({ slug }: { slug: string }) {
  let page: WikiPageResponse

  try {
    page = await getWikiPageBySlug(slug)
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound()
    }

    throw error
  }

  let sources: WikiPageSourceRefResponse[] = []
  try {
    sources = await getWikiPageSources(page.id)
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error
    }
  }

  return (
    <>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{getPageTypeLabel(page.pageType)}</Badge>
              <Badge
                variant={page.active ? "secondary" : "outline"}
                className={page.active ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20" : ""}
              >
                {page.active ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="space-y-1">
              <CardTitle className="text-2xl">{page.title}</CardTitle>
              <CardDescription>
                View synthesized wiki content and the source articles used to build this page.
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Hash className="h-3.5 w-3.5" />
                Slug
              </div>
              <p className="mt-2 break-all font-medium text-foreground">{page.slug}</p>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                Sources
              </div>
              <p className="mt-2 font-medium text-foreground">{page.sourceCount}</p>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Last Synthesized
              </div>
              <p className="mt-2 font-medium text-foreground">{formatDateTime(page.lastSynthesizedAt)}</p>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                Created
              </div>
              <p className="mt-2 font-medium text-foreground">{formatDateTime(page.createdDate)}</p>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <RefreshCcw className="h-3.5 w-3.5" />
                Last Updated
              </div>
              <p className="mt-2 font-medium text-foreground">{formatDateTime(page.lastModifiedDate)}</p>
            </div>
          </div>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Summary
              </h2>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                {page.summary?.trim() || "No summary available."}
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Content
              </h2>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                {page.content?.trim() || "No content available."}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Source References
              </h2>
            </div>
            <WikiSourceReferences sources={sources} />
          </section>
        </div>
      </CardContent>
    </>
  )
}

function WikiDetailSkeleton() {
  return (
    <>
      <CardHeader className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-8 pt-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="rounded-lg border p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-5 w-full" />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
      </CardContent>
    </>
  )
}
