import { getBlogById } from "@/app/api/blogs/action";
import { hasPermission } from "@/app/lib/permissions";
import { getCurrentPermissions } from "@/app/lib/permissions-server";
import { AccessDenied } from "@/components/access-denied";
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
            <AccessDenied
                description="Bạn không có quyền chỉnh sửa bài viết."
                permission="blog:update"
            />
        )
    }

    const { id } = await params;
    const blogId = Number(id);

    return (
        <Suspense fallback={<UpdateBlogSkeleton />}>
            <FetchBlogData id={blogId} />
        </Suspense>
    )
}

// --- Component Fetch Data ---
async function FetchBlogData({ id }: { id: number }) {
    const blog = await getBlogById(id);

    if (!blog) {
        notFound();
    }

    return <UpdateBlogForm blog={blog} />;
}

// --- Component Skeleton ---
function UpdateBlogSkeleton() {
    return (
        <div className="flex flex-col gap-8">
            {/* Tiêu đề */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Mô tả ngắn */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
            </div>

            {/* Nội dung */}
            <div className="flex flex-col gap-2">
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
        </div>
    )
}
