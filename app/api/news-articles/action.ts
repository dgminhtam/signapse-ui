"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import { getDictionary } from "@/app/lib/i18n/dictionaries"
import { getRequestLocale } from "@/app/lib/i18n/server"
import {
  MediaReferenceRequest,
  NewsArticleListResponse,
  NewsArticleResponse,
  NewsPrimaryEventDerivationResult,
  PendingNewsEventDerivationBatchResult,
} from "@/app/lib/news-articles/definitions"
import { queryParamsToString } from "@/app/lib/utils"

function revalidateNewsArticleRoutes(id?: number) {
  revalidatePath("/news-articles")

  if (typeof id === "number") {
    revalidatePath(`/news-articles/${id}`)
    return
  }

  revalidatePath("/news-articles/[id]", "page")
}

export async function getNewsArticles(
  searchParams: SearchParams
): Promise<Page<NewsArticleListResponse>> {
  return fetchAuthenticated<Page<NewsArticleListResponse>>(
    `/news-articles?${queryParamsToString(searchParams)}`
  )
}

export async function getNewsArticleById(id: number): Promise<NewsArticleResponse> {
  return fetchAuthenticated<NewsArticleResponse>(`/news-articles/${id}`)
}

export async function deleteNewsArticle(id: number): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(`/news-articles/${id}`, {
      method: "DELETE",
    })

    revalidateNewsArticleRoutes(id)

    return { success: true, data: undefined }
  } catch (error: unknown) {
    const dictionary = await getDictionary(await getRequestLocale())
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.newsArticles.deleteError,
    }
  }
}

export async function crawlNewsArticleFullContent(
  id: number
): Promise<ActionResult<NewsArticleResponse>> {
  try {
    const data = await fetchAuthenticated<NewsArticleResponse>(
      `/news-articles/${id}/crawl-full-content`,
      {
        method: "POST",
      }
    )

    revalidateNewsArticleRoutes(id)

    return { success: true, data }
  } catch (error: unknown) {
    const dictionary = await getDictionary(await getRequestLocale())
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.newsArticles.featureImageError,
    }
  }
}

export async function derivePrimaryEventFromNewsArticle(
  id: number
): Promise<ActionResult<NewsPrimaryEventDerivationResult>> {
  try {
    const data = await fetchAuthenticated<NewsPrimaryEventDerivationResult>(
      `/news-articles/${id}/derive-primary-event`,
      {
        method: "POST",
      }
    )

    revalidateNewsArticleRoutes(id)

    return { success: true, data }
  } catch (error: unknown) {
    const dictionary = await getDictionary(await getRequestLocale())
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.newsArticles.deriveEventError,
    }
  }
}

export async function derivePendingNewsArticleEvents(
  batchSize?: number
): Promise<ActionResult<PendingNewsEventDerivationBatchResult>> {
  try {
    const query = typeof batchSize === "number" ? `?batchSize=${batchSize}` : ""
    const data = await fetchAuthenticated<PendingNewsEventDerivationBatchResult>(
      `/news-articles/derive-pending-news-events${query}`,
      {
        method: "POST",
      }
    )

    revalidateNewsArticleRoutes()

    return { success: true, data }
  } catch (error: unknown) {
    const dictionary = await getDictionary(await getRequestLocale())
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.newsArticles.derivePendingError,
    }
  }
}

export async function updateNewsArticleFeatureImage(
  id: number,
  request: MediaReferenceRequest
): Promise<ActionResult<NewsArticleResponse>> {
  try {
    const data = await fetchAuthenticated<NewsArticleResponse>(
      `/news-articles/${id}/feature-image`,
      {
        method: "PATCH",
        body: JSON.stringify(request),
      }
    )

    revalidateNewsArticleRoutes(id)

    return { success: true, data }
  } catch (error: unknown) {
    const dictionary = await getDictionary(await getRequestLocale())
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.newsArticles.reloadContentError,
    }
  }
}
