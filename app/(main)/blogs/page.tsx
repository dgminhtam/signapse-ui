import { Suspense } from "react";
import { BlogListPage } from "@/app/(main)/blogs/blog-list";
import { getBlogs } from "@/app/api/blogs/action";
import { hasPermission } from "@/app/lib/permissions";
import { getCurrentPermissions } from "@/app/lib/permissions-server";
import { buildSortQuery, buildFilterQuery } from "@/app/lib/utils";
import { AccessDenied } from "@/components/access-denied";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: BlogPageProps) {
    const permissions = await getCurrentPermissions();

    if (!hasPermission(permissions, "blog:read")) {
        return (
            <AccessDenied
                description="Bạn không có quyền xem danh sách bài viết."
                permission="blog:read"
            />
        );
    }

    return (
        <Suspense fallback={<BlogListSkeleton />}>
            <BlogListContent searchParamsPromise={searchParams} />
        </Suspense>
    );
}

async function BlogListContent({
    searchParamsPromise
}: {
    searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParamsPromise;
    const { page = '1', size = '12', sort = '', ...filterParams } = resolvedParams;

    const pageIndex = Math.max(0, Number(page) - 1);
    const filter = buildFilterQuery(filterParams);

    const blogPage = await getBlogs({
        filter: filter,
        page: pageIndex,
        size: Number(size),
        sort: buildSortQuery(sort as string),
    });

    return <BlogListPage blogPage={blogPage} />;
}

function BlogListSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-4 w-full sm:w-auto flex-1 items-center">
                    <Skeleton className="h-10 w-[160px]" />
                    <Skeleton className="h-10 w-full max-w-sm" />
                </div>
                <Skeleton className="h-10 w-[180px]" />
            </div>

            <div className="border rounded-md">
                <div className="h-10 bg-muted/50 border-b px-4 flex items-center gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                    <Skeleton className="h-4 w-20 ml-auto" />
                </div>

                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 px-4 flex items-center gap-4 border-b last:border-0">
                        <div className="flex min-w-[200px] flex-3 flex-col gap-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full mx-auto" />
                        <Skeleton className="h-4 w-32 mx-auto" />
                        <div className="ml-auto flex gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </div>
    )
}
