import { Suspense } from "react";
import { BlogListPage } from "@/app/(main)/blogs/blog-list";
import { getBlogs } from "@/app/api/blogs/action";
import { hasPermission } from "@/app/lib/permissions";
import { getCurrentPermissions } from "@/app/lib/permissions-server";
import { buildSortQuery, buildFilterQuery } from "@/app/lib/utils";
import { AccessDenied } from "@/components/access-denied";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: BlogPageProps) {
    const permissions = await getCurrentPermissions();

    if (!hasPermission(permissions, "blog:read")) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Quáº£n lÃ½ bÃ i viáº¿t</CardTitle>
                    <CardDescription>
                        Danh sÃ¡ch, tÃ¬m kiáº¿m vÃ  quáº£n lÃ½ toÃ n bá»™ bÃ i viáº¿t trong há»‡ thá»‘ng.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent className="pt-6">
                    <AccessDenied
                        description="Báº¡n khÃ´ng cÃ³ quyá»n xem danh sÃ¡ch bÃ i viáº¿t."
                        permission="blog:read"
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quản lý bài viết</CardTitle>
                <CardDescription>
                    Danh sách, tìm kiếm và quản lý toàn bộ bài viết trong hệ thống.
                </CardDescription>
            </CardHeader>

            <Separator />

            <Suspense fallback={<BlogListSkeleton />}>
                <BlogListContent searchParamsPromise={searchParams} />
            </Suspense>
        </Card>
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

    return (
        <CardContent>
            <BlogListPage blogPage={blogPage} />
        </CardContent>
    );
}

function BlogListSkeleton() {
    return (
        <CardContent className="pt-6 space-y-6">
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
                        <div className="space-y-2 flex-3 min-w-[200px]">
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
        </CardContent>
    )
}
