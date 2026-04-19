"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import {
  MediaReferenceRequest,
  NewsPrimaryEventDerivationResult,
  PendingNewsEventDerivationBatchResult,
  SourceDocumentListResponse,
  SourceDocumentResponse,
} from "@/app/lib/source-documents/definitions"
import { queryParamsToString } from "@/app/lib/utils"

function revalidateSourceDocumentRoutes(id?: number) {
  revalidatePath("/source-documents")

  if (typeof id === "number") {
    revalidatePath(`/source-documents/${id}`)
    return
  }

  revalidatePath("/source-documents/[id]", "page")
}

export async function getSourceDocuments(
  searchParams: SearchParams
): Promise<Page<SourceDocumentListResponse>> {
  return fetchAuthenticated<Page<SourceDocumentListResponse>>(
    `/source-documents?${queryParamsToString(searchParams)}`
  )
}

export async function getSourceDocumentById(id: number): Promise<SourceDocumentResponse> {
  return fetchAuthenticated<SourceDocumentResponse>(`/source-documents/${id}`)
}

export async function deleteSourceDocument(id: number): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(`/source-documents/${id}`, {
      method: "DELETE",
    })

    revalidateSourceDocumentRoutes(id)

    return { success: true, data: undefined }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể xóa tài liệu nguồn",
    }
  }
}

export async function analyzeSourceDocument(
  id: number
): Promise<ActionResult<SourceDocumentResponse>> {
  try {
    const data = await fetchAuthenticated<SourceDocumentResponse>(
      `/source-documents/${id}/analyze`,
      {
        method: "POST",
      }
    )

    revalidateSourceDocumentRoutes(id)

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Không thể phân tích tài liệu nguồn",
    }
  }
}

export async function crawlSourceDocumentFullContent(
  id: number
): Promise<ActionResult<SourceDocumentResponse>> {
  try {
    const data = await fetchAuthenticated<SourceDocumentResponse>(
      `/source-documents/${id}/crawl-full-content`,
      {
        method: "POST",
      }
    )

    revalidateSourceDocumentRoutes(id)

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Không thể tải lại nội dung đầy đủ",
    }
  }
}

export async function derivePrimaryEventFromSourceDocument(
  id: number
): Promise<ActionResult<NewsPrimaryEventDerivationResult>> {
  try {
    const data = await fetchAuthenticated<NewsPrimaryEventDerivationResult>(
      `/source-documents/${id}/derive-primary-event`,
      {
        method: "POST",
      }
    )

    revalidateSourceDocumentRoutes(id)

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Không thể suy diễn sự kiện chính cho tài liệu nguồn",
    }
  }
}

export async function derivePendingNewsEvents(
  batchSize?: number
): Promise<ActionResult<PendingNewsEventDerivationBatchResult>> {
  try {
    const query = typeof batchSize === "number" ? `?batchSize=${batchSize}` : ""
    const data = await fetchAuthenticated<PendingNewsEventDerivationBatchResult>(
      `/source-documents/derive-pending-news-events${query}`,
      {
        method: "POST",
      }
    )

    revalidateSourceDocumentRoutes()

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Không thể suy diễn các tài liệu tin tức đang chờ",
    }
  }
}

export async function updateSourceDocumentFeatureImage(
  id: number,
  request: MediaReferenceRequest
): Promise<ActionResult<SourceDocumentResponse>> {
  try {
    const data = await fetchAuthenticated<SourceDocumentResponse>(
      `/source-documents/${id}/feature-image`,
      {
        method: "PATCH",
        body: JSON.stringify(request),
      }
    )

    revalidateSourceDocumentRoutes(id)

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Không thể cập nhật ảnh đại diện tài liệu nguồn",
    }
  }
}
