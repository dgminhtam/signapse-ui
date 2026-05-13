"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Clock3, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { updateNewsOutlet } from "@/app/api/news-outlets/action"
import {
  NewsOutletResponse,
  UpdateNewsOutletRequest,
} from "@/app/lib/news-outlets/definitions"
import {
  AppFormShell,
  AppFormShellBody,
  AppFormShellFooter,
} from "@/components/app-form-shell"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import {
  NewsOutletFormFields,
  NewsOutletFormValues,
  newsOutletFormSchema,
} from "./news-outlet-form-fields"

interface NewsOutletUpdateFormProps {
  newsOutlet: NewsOutletResponse
}

function formatDateTime(value?: string) {
  if (!value) {
    return "Chưa có"
  }

  return format(new Date(value), "dd/MM/yyyy HH:mm")
}

function getInitialFormValues(
  newsOutlet: NewsOutletResponse
): NewsOutletFormValues {
  return {
    name: newsOutlet.name || "",
    homepageUrl: newsOutlet.homepageUrl || "",
    rssUrl: newsOutlet.rssUrl || "",
    description: newsOutlet.description || "",
    active: newsOutlet.active ?? true,
  }
}

export function NewsOutletUpdateForm({
  newsOutlet,
}: NewsOutletUpdateFormProps) {
  const router = useRouter()
  const initialFormValues = getInitialFormValues(newsOutlet)
  const form = useForm<NewsOutletFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(newsOutletFormSchema as any),
    defaultValues: initialFormValues,
  })

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(data: NewsOutletFormValues) {
    const request: UpdateNewsOutletRequest = {
      name: data.name.trim(),
      homepageUrl: data.homepageUrl.trim(),
      active: data.active,
      ...(data.rssUrl?.trim() ? { rssUrl: data.rssUrl.trim() } : {}),
      ...(data.description?.trim()
        ? { description: data.description.trim() }
        : {}),
    }

    const result = await updateNewsOutlet(newsOutlet.id, request)

    if (result.success) {
      toast.success("Đã cập nhật nguồn tin thành công.")
      router.push("/news-outlets")
      router.refresh()
      return
    }

    toast.error(result.error)
  }

  return (
    <AppFormShell
      title="Chỉnh sửa nguồn tin"
      description="Cập nhật thông tin nhận diện và trạng thái sử dụng của nguồn tin."
      width="lg"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AppFormShellBody className="flex flex-col gap-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Tạo lúc
              </div>
              <p className="mt-2">
                <AppTimeMetadata icon={Clock3}>
                {formatDateTime(newsOutlet.createdDate)}
                </AppTimeMetadata>
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Cập nhật lần cuối
              </div>
              <p className="mt-2">
                <AppTimeMetadata icon={RefreshCw}>
                {formatDateTime(newsOutlet.lastModifiedDate)}
                </AppTimeMetadata>
              </p>
            </div>
          </div>

          <NewsOutletFormFields
            control={form.control}
            isSubmitting={isSubmitting}
          />
        </AppFormShellBody>

        <AppFormShellFooter className="sm:justify-start">
          <div className="flex gap-4">
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 size-4" data-icon="inline-start" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => form.reset(initialFormValues)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
          </div>
        </AppFormShellFooter>
      </form>
    </AppFormShell>
  )
}
