import { getBlogById } from "@/app/api/blogs/action";
import { hasPermission } from "@/app/lib/permissions";
import { getCurrentPermissions } from "@/app/lib/permissions-server";
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
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { UpdateBlogForm } from "./update-blog-form";

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditBlogPage({ params }: PageProps) {
    const permissions = await getCurrentPermissions();

    if (!hasPermission(permissions, "blog:update")) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Chá»‰nh sá»­a bÃ i viáº¿t</CardTitle>
                    <CardDescription>
                        Cáº­p nháº­t thÃ´ng tin chi tiáº¿t, ná»™i dung vÃ  hÃ¬nh áº£nh bÃ i viáº¿t.
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent className="pt-6">
                    <AccessDenied
                        description="Báº¡n khÃ´ng cÃ³ quyá»n chá»‰nh sá»­a bÃ i viáº¿t."
                        permission="blog:update"
                    />
                </CardContent>
            </Card>
        )
    }

    const { id } = await params;
    const blogId = Number(id);

    return (
        <Card>
            {/* Static Header */}
            <CardHeader>
                <CardTitle>Chỉnh sửa bài viết</CardTitle>
                <CardDescription>
                    Cập nhật thông tin chi tiết, nội dung và hình ảnh bài viết.
                </CardDescription>
            </CardHeader>

            <Separator />

            {/* Loading State */}
            <Suspense fallback={<UpdateBlogSkeleton />}>
                <FetchBlogData id={blogId} />
            </Suspense>
        </Card>
    )
}

// --- Component Fetch Data ---
async function FetchBlogData({ id }: { id: number }) {
    const blog = await getBlogById(id);

    if (!blog) {
        notFound();
    }

    return (
        <CardContent className="pt-6">
            <UpdateBlogForm blog={blog} />
        </CardContent>
    );
}

// --- Component Skeleton ---
function UpdateBlogSkeleton() {
    return (
        <CardContent className="space-y-8 pt-6">
            {/* Tiêu đề */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Slug */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Mô tả ngắn */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
            </div>

            {/* Nội dung */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-96 w-full" />
            </div>

            {/* Trạng thái */}
            <Skeleton className="h-20 w-full rounded-lg" />

            <Separator />

            {/* Buttons */}
            <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
            </div>
        </CardContent>
    )
}
