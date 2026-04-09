import { Suspense } from "react";
import { CreateBlogForm } from "./create-blog-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
    return (
        <Card>
            {/* Static Header */}
            <CardHeader>
                <CardTitle>Tạo bài viết mới</CardTitle>
                <CardDescription>
                    Điền thông tin chi tiết để thêm bài viết mới vào hệ thống.
                </CardDescription>
            </CardHeader>

            <Separator />

            {/* Form - no async data needed for create */}
            <CardContent className="pt-6">
                <CreateBlogForm />
            </CardContent>
        </Card>
    )
}
