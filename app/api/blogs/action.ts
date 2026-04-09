"use server"

import { fetchAuthenticated } from '@/app/api/auth/action';
import { SearchParams, Page } from '@/app/lib/definitions';
import { queryParamsToString } from '@/app/lib/utils';
import { BlogPost, BlogPostListResponse, CreateBlogPostRequest, UpdateBlogPostRequest } from '@/app/lib/blogs/definitions';
import { revalidatePath } from 'next/cache';

export async function getBlogs(searchParams: SearchParams): Promise<Page<BlogPostListResponse>> {
    return fetchAuthenticated<Page<BlogPostListResponse>>(`/blogs?${queryParamsToString(searchParams)}`);
}

export async function getBlogById(id: number): Promise<BlogPost> {
    return fetchAuthenticated<BlogPost>(`/blogs/${id}`);
}

export async function createBlog(request: CreateBlogPostRequest): Promise<BlogPost> {
    const blog = await fetchAuthenticated<BlogPost>("/blogs", {
        method: "POST",
        body: JSON.stringify(request),
    });
    revalidatePath("/blogs");
    return blog;
}

export async function updateBlog(id: number, request: UpdateBlogPostRequest): Promise<BlogPost> {
    const blog = await fetchAuthenticated<BlogPost>(`/blogs/${id}`, {
        method: "PUT",
        body: JSON.stringify(request),
    });
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${id}`);
    return blog;
}

export async function deleteBlog(id: number): Promise<void> {
    await fetchAuthenticated<void>(`/blogs/${id}`, {
        method: "DELETE",
    });
    revalidatePath("/blogs");
}
