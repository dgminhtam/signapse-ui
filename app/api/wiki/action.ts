"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult } from "@/app/lib/definitions"
import { WikiPageResponse, WikiPageSourceRefResponse } from "@/app/lib/wiki/definitions"

export async function getWikiPages(): Promise<WikiPageResponse[]> {
  return fetchAuthenticated<WikiPageResponse[]>("/wiki/pages")
}

export async function getWikiPageBySlug(slug: string): Promise<WikiPageResponse> {
  return fetchAuthenticated<WikiPageResponse>(`/wiki/pages/${encodeURIComponent(slug)}`)
}

export async function getWikiPageSources(id: number): Promise<WikiPageSourceRefResponse[]> {
  return fetchAuthenticated<WikiPageSourceRefResponse[]>(`/wiki/pages/${id}/sources`)
}

export async function ingestArticleToWiki(articleId: number): Promise<ActionResult<WikiPageResponse>> {
  try {
    const data = await fetchAuthenticated<WikiPageResponse>(`/wiki/ingest/articles/${articleId}`, {
      method: "POST",
    })

    revalidatePath("/wiki")
    revalidatePath(`/wiki/${data.slug}`)
    revalidatePath("/articles")
    revalidatePath(`/articles/${articleId}`)

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add article to wiki",
    }
  }
}
