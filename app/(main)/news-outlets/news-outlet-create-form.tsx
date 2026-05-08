"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { createNewsOutlet } from "@/app/api/news-outlets/action"
import { CreateNewsOutletRequest } from "@/app/lib/news-outlets/definitions"
import {
  AppFormShell,
  AppFormShellBody,
  AppFormShellFooter,
} from "@/components/app-form-shell"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import {
  NewsOutletFormFields,
  NewsOutletFormValues,
  newsOutletFormSchema,
} from "./news-outlet-form-fields"

const initialFormValues: NewsOutletFormValues = {
  name: "",
  homepageUrl: "",
  rssUrl: "",
  description: "",
  active: true,
}

export function NewsOutletCreateForm() {
  const router = useRouter()
  const form = useForm<NewsOutletFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(newsOutletFormSchema as any),
    defaultValues: initialFormValues,
  })

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(data: NewsOutletFormValues) {
    const request: CreateNewsOutletRequest = {
      name: data.name.trim(),
      homepageUrl: data.homepageUrl.trim(),
      active: data.active,
      ...(data.rssUrl?.trim() ? { rssUrl: data.rssUrl.trim() } : {}),
      ...(data.description?.trim()
        ? { description: data.description.trim() }
        : {}),
    }

    const result = await createNewsOutlet(request)

    if (result.success) {
      toast.success("Đã tạo nguồn tin thành công.")
      router.push("/news-outlets")
      router.refresh()
      return
    }

    toast.error(result.error)
  }

  return (
    <AppFormShell
      title="Tạo nguồn tin"
      description="Khai báo nguồn tin để hệ thống có thể thu thập và xử lý nội dung."
      width="lg"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AppFormShellBody className="flex flex-col gap-8">
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
                  Đang tạo...
                </>
              ) : (
                "Tạo nguồn tin"
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
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
