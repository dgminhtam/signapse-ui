"use server"

import { fetchAuthenticated } from '@/app/api/auth/action';
import { SearchParams, Page, ActionResult } from '@/app/lib/definitions';
import { queryParamsToString } from '@/app/lib/utils';
import { ArticleResponse, ArticleListResponse } from '@/app/lib/articles/definitions';
import { revalidatePath } from 'next/cache';

export async function getArticles(searchParams: SearchParams): Promise<Page<ArticleListResponse>> {
    return fetchAuthenticated<Page<ArticleListResponse>>(`/articles?${queryParamsToString(searchParams)}`);
}

export async function getArticleById(id: number): Promise<ArticleResponse> {
    return fetchAuthenticated<ArticleResponse>(`/articles/${id}`);
}

export async function deleteArticle(id: number): Promise<ActionResult> {
    try {
        await fetchAuthenticated<void>(`/articles/${id}`, {
            method: "DELETE",
        });
        revalidatePath("/articles");
        return { success: true, data: undefined };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to delete article" };
    }
}
