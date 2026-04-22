"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  createNewsOutlet,
  updateNewsOutlet,
} from "@/app/api/news-outlets/action"
import {
  NewsOutletRequest,
  NewsOutletResponse,
} from "@/app/lib/news-outlets/definitions"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const newsOutletSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Ten nguon tin la bat buoc")
    .max(255, "Ten nguon tin khong duoc vuot qua 255 ky tu"),
  slug: z
    .string()
    .trim()
    .max(255, "Slug khong duoc vuot qua 255 ky tu")
    .optional()
    .or(z.literal("")),
  homepageUrl: z
    .string()
    .trim()
    .url("URL trang chu khong hop le")
    .min(1, "URL trang chu la bat buoc"),
  rssUrl: z.union([z.literal(""), z.string().trim().url("URL RSS khong hop le")]),
  description: z
    .string()
    .trim()
    .max(1000, "Mo ta khong duoc vuot qua 1000 ky tu")
    .optional()
    .or(z.literal("")),
  active: z.boolean().default(true),
})

type NewsOutletFormValues = z.infer<typeof newsOutletSchema>

interface NewsOutletFormProps {
  initialData?: NewsOutletResponse
}

function formatDateTime(value?: string) {
  if (!value) {
    return "Chua co"
  }

  return format(new Date(value), "dd/MM/yyyy HH:mm")
}

export function NewsOutletForm({ initialData }: NewsOutletFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const initialFormValues: NewsOutletFormValues = {
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    homepageUrl: initialData?.homepageUrl || "",
    rssUrl: initialData?.rssUrl || "",
    description: initialData?.description || "",
    active: initialData?.active ?? true,
  }

  const form = useForm<NewsOutletFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(newsOutletSchema as any),
    defaultValues: initialFormValues,
  })

  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(data: NewsOutletFormValues) {
    const request: NewsOutletRequest = {
      name: data.name.trim(),
      homepageUrl: data.homepageUrl.trim(),
      active: data.active,
      ...(data.slug?.trim() ? { slug: data.slug.trim() } : {}),
      ...(data.rssUrl?.trim() ? { rssUrl: data.rssUrl.trim() } : {}),
      ...(data.description?.trim() ? { description: data.description.trim() } : {}),
    }

    const result =
      isEdit && initialData
        ? await updateNewsOutlet(initialData.id, request)
        : await createNewsOutlet(request)

    if (result.success) {
      toast.success(
        isEdit
          ? "Da cap nhat nguon tin thanh cong."
          : "Da tao nguon tin thanh cong."
      )
      router.push("/news-outlets")
      router.refresh()
      return
    }

    toast.error(result.error)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {isEdit ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Slug
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">
              {initialData?.slug || "Tu sinh tu ten"}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Tao luc
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">
              {formatDateTime(initialData?.createdDate)}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Cap nhat lan cuoi
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">
              {formatDateTime(initialData?.lastModifiedDate)}
            </p>
          </div>
        </div>
      ) : null}

      <FieldSet>
        <FieldLegend>Thong tin co ban</FieldLegend>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">
                  Ten nguon tin <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="name"
                  placeholder="Vi du: Investing VN News"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )}
          />

          <Controller
            name="slug"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="slug">Slug</FieldLabel>
                <Input
                  {...field}
                  id="slug"
                  placeholder="de trong de backend tu sinh"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                <FieldDescription>
                  Co the de trong neu ban muon backend tu sinh slug.
                </FieldDescription>
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )}
          />

          <Controller
            name="homepageUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="homepageUrl">
                  URL trang chu <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="homepageUrl"
                  placeholder="https://example.com"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )}
          />

          <Controller
            name="rssUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="rssUrl">URL RSS</FieldLabel>
                <Input
                  {...field}
                  id="rssUrl"
                  placeholder="https://example.com/rss.xml"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
                <FieldDescription>
                  De trong neu nguon tin khong cung cap RSS.
                </FieldDescription>
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">Mo ta</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  rows={4}
                  placeholder="Mo ta ngan ve pham vi va vai tro cua nguon tin."
                  disabled={isSubmitting}
                />
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <Separator />

      <FieldSet>
        <FieldLegend>Trang thai</FieldLegend>
        <FieldGroup>
          <Controller
            name="active"
            control={form.control}
            render={({ field }) => (
              <Field className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="flex flex-col gap-0.5">
                  <FieldLabel className="text-base">Kich hoat nguon tin</FieldLabel>
                  <div className="text-sm text-muted-foreground">
                    Cho phep he thong tiep tuc su dung nguon tin nay trong quy trinh
                    xu ly noi dung.
                  </div>
                </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <Separator />

      <div className="flex gap-4">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 size-4" data-icon="inline-start" />
              {isEdit ? "Dang luu..." : "Dang tao..."}
            </>
          ) : isEdit ? (
            "Luu thay doi"
          ) : (
            "Tao nguon tin"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => form.reset(initialFormValues)}
          disabled={isSubmitting}
        >
          Huy
        </Button>
      </div>
    </form>
  )
}
