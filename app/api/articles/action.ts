"use server"

import { fetchAuthenticated } from '@/app/api/auth/action';
import { SearchParams, Page } from '@/app/lib/definitions';
import { queryParamsToString } from '@/app/lib/utils';
import { ArticleResponse, ArticleListResponse } from '@/app/lib/articles/definitions';
import { revalidatePath } from 'next/cache';

export async function getArticles(searchParams: SearchParams): Promise<Page<ArticleListResponse>> {
    return fetchAuthenticated<Page<ArticleListResponse>>(`/articles?${queryParamsToString(searchParams)}`);
}

export async function getArticleById(id: number): Promise<ArticleResponse> {
    return fetchAuthenticated<ArticleResponse>(`/articles/${id}`);
}

export async function deleteArticle(id: number): Promise<void> {
    await fetchAuthenticated<void>(`/articles/${id}`, {
        method: "DELETE",
    });
    revalidatePath("/articles");
}
