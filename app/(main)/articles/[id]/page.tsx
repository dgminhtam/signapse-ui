import { getArticleById } from "@/app/api/articles/action"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Calendar, User, Newspaper, ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { AnalyzeButton } from "../analyze-button"
import { IngestWikiButton } from "../ingest-wiki-button"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "article:read")) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Article Detail</CardTitle>
            <CardDescription>
              Review article content and available actions.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <AccessDenied
              description="You do not have permission to view article details."
              permission="article:read"
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  const { id } = await params
  const articleId = Number(id)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/articles">
            <ArrowLeft className="mr-2 h-4 w-4" data-icon="inline-start" /> Back to list
          </Link>
        </Button>
      </div>

      <Card>
        <Suspense fallback={<ArticleDetailSkeleton />}>
          <FetchArticleData id={articleId} />
        </Suspense>
      </Card>
    </div>
  )
}

async function FetchArticleData({ id }: { id: number }) {
  const article = await getArticleById(id)

  if (!article) {
    notFound()
  }

  return (
    <>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-2xl">{article.title}</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
              <div className="flex items-center gap-1.5">
                <Newspaper className="h-4 w-4" />
                <span>{article.sourceName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(article.publishedAt), "MMMM dd, yyyy HH:mm")}</span>
              </div>
              {article.author && (
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <AnalyzeButton id={article.id} variant="outline" size="sm" showText className="shrink-0" />
            <IngestWikiButton
              articleId={article.id}
              variant="outline"
              size="sm"
              showText
              redirectToWikiOnSuccess
              className="shrink-0"
            />
            <Button variant="outline" size="sm" asChild className="shrink-0">
               <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" data-icon="inline-start" />
                  View Original
               </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          {article.imageUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.title}
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                {article.description}
            </p>
            <Separator className="my-6" />
            <div className="whitespace-pre-wrap leading-7 text-foreground/90">
                {article.content || "No detailed content available."}
            </div>
          </div>
        </div>
      </CardContent>
    </>
  )
}

function ArticleDetailSkeleton() {
  return (
    <>
      <CardHeader>
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-6 pt-6">
        <Skeleton className="aspect-video w-full rounded-lg" />
        <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </>
  )
}
