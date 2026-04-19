"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { createSource, updateSource } from "@/app/api/sources/action"
import {
  SOURCE_TYPE_LABELS,
  SourceRequest,
  SourceResponse,
  SourceType,
} from "@/app/lib/sources/definitions"
import { Badge } from "@/components/ui/badge"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const sourceTypeOptions = Object.entries(SOURCE_TYPE_LABELS).map(
  ([value, label]) => ({
    value: value as SourceType,
    label,
  })
)

const sourceSchema = z.object({
  name: z
    .string()
    .min(1, "Tên nguồn là bắt buộc")
    .max(255, "Tên nguồn không được vượt quá 255 ký tự"),
  type: z.enum([
    "NEWS",
    "ECONOMIC_CALENDAR",
    "RESEARCH",
    "MARKET_DATA",
    "SENTIMENT",
    "OTHER",
  ]),
  url: z
    .string()
    .url("URL website không hợp lệ")
    .min(1, "URL website là bắt buộc"),
  rssUrl: z.union([z.literal(""), z.string().url("URL RSS không hợp lệ")]),
  description: z
    .string()
    .max(1000, "Mô tả không được vượt quá 1000 ký tự")
    .optional()
    .or(z.literal("")),
  active: z.boolean().default(true),
})

type SourceFormValues = z.infer<typeof sourceSchema>

interface SourceFormProps {
  initialData?: SourceResponse
}

function formatDateTime(value?: string) {
  if (!value) {
    return "Chưa có"
  }

  return format(new Date(value), "dd/MM/yyyy HH:mm")
}

function getIngestStatusLabel(status?: string) {
  if (!status) {
    return "Chưa ingest"
  }

  return status
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

function getIngestStatusVariant(
  status?: string
): "outline" | "secondary" | "destructive" {
  if (!status) {
    return "outline"
  }

  const normalizedStatus = status.toUpperCase()
  if (normalizedStatus.includes("FAIL") || normalizedStatus.includes("ERROR")) {
    return "destructive"
  }

  if (normalizedStatus.includes("SUCCESS") || normalizedStatus.includes("DONE")) {
    return "secondary"
  }

  return "outline"
}

export function SourceForm({ initialData }: SourceFormProps) {
  const router = useRouter()
  const isEdit = !!initialData
  const isSystemManaged = initialData?.systemManaged === true
  const isReadOnly = isEdit && isSystemManaged

  const initialFormValues: SourceFormValues = {
    name: initialData?.name || "",
    type: initialData?.type || "NEWS",
    url: initialData?.url || "",
    rssUrl: initialData?.rssUrl || "",
    description: initialData?.description || "",
    active: initialData?.active ?? true,
  }

  const form = useForm<SourceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(sourceSchema as any),
    defaultValues: initialFormValues,
  })

  const isSubmitting = form.formState.isSubmitting
  const isFormDisabled = isSubmitting || isReadOnly

  async function onSubmit(data: SourceFormValues) {
    if (isReadOnly) {
      toast.error("Nguồn này do hệ thống quản lý và không thể chỉnh sửa thủ công.")
      return
    }

    const request: SourceRequest = {
      name: data.name.trim(),
      type: data.type,
      url: data.url.trim(),
      rssUrl: (data.rssUrl ?? "").trim() || undefined,
      description: (data.description ?? "").trim() || undefined,
      active: data.active,
    }

    const result =
      isEdit && initialData
        ? await updateSource(initialData.id, request)
        : await createSource(request)

    if (result.success) {
      toast.success(
        isEdit
          ? "Đã cập nhật nguồn dữ liệu thành công."
          : "Đã tạo nguồn dữ liệu thành công."
      )
      router.push("/sources")
      router.refresh()
      return
    }

    toast.error(result.error)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {isEdit ? (
        <div className="flex flex-col gap-4">
          {isSystemManaged ? (
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              <div className="mb-1 font-semibold text-foreground">
                Nguồn này do hệ thống quản lý
              </div>
              <p>
                Bạn chỉ có thể xem thông tin và metadata ingest. Các thao tác chỉnh
                sửa thủ công đã bị khóa.
              </p>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Loại nguồn
              </div>
              <div className="mt-2">
                <Badge variant="outline">{SOURCE_TYPE_LABELS[initialData.type]}</Badge>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Trạng thái quản lý
              </div>
              <div className="mt-2">
                <Badge variant={isSystemManaged ? "secondary" : "outline"}>
                  {isSystemManaged ? "Nguồn hệ thống" : "Nguồn tùy chỉnh"}
                </Badge>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ingest gần nhất
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">
                {formatDateTime(initialData.lastIngestedAt)}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Trạng thái ingest
              </div>
              <div className="mt-2">
                <Badge variant={getIngestStatusVariant(initialData.lastIngestStatus)}>
                  {getIngestStatusLabel(initialData.lastIngestStatus)}
                </Badge>
              </div>
            </div>
          </div>

          {initialData.lastIngestError ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              <div className="mb-1 font-semibold">Lỗi ingest gần nhất</div>
              <div className="whitespace-pre-wrap">{initialData.lastIngestError}</div>
            </div>
          ) : null}
        </div>
      ) : null}

      <FieldSet>
        <FieldLegend>Thông tin cơ bản</FieldLegend>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">
                  Tên nguồn <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="name"
                  placeholder="Ví dụ: Google News"
                  autoComplete="off"
                  disabled={isFormDisabled}
                />
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )}
          />

          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="type">
                  Loại nguồn <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isFormDisabled}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Chọn loại nguồn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {sourceTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )}
          />

          <Controller
            name="url"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="url">
                  URL website <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="url"
                  placeholder="https://example.com"
                  autoComplete="off"
                  disabled={isFormDisabled}
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
                  disabled={isFormDisabled}
                />
                <FieldDescription>
                  Để trống nếu nguồn không cung cấp RSS.
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
                <FieldLabel htmlFor="description">Mô tả</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  rows={4}
                  placeholder="Mô tả ngắn về mục đích và phạm vi của nguồn dữ liệu."
                  disabled={isFormDisabled}
                />
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <Separator />

      <FieldSet>
        <FieldLegend>Trạng thái nguồn</FieldLegend>
        <FieldGroup>
          <Controller
            name="active"
            control={form.control}
            render={({ field }) => (
              <Field className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="flex flex-col gap-0.5">
                  <FieldLabel className="text-base">Kích hoạt nguồn</FieldLabel>
                  <div className="text-sm text-muted-foreground">
                    Cho phép hệ thống tiếp tục ingest dữ liệu từ nguồn này.
                  </div>
                </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isFormDisabled}
                />
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <Separator />

      <div className="flex gap-4">
        <Button disabled={isFormDisabled} type="submit">
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 size-4" data-icon="inline-start" />
              {isEdit ? "Đang lưu..." : "Đang tạo..."}
            </>
          ) : isEdit ? (
            "Lưu thay đổi"
          ) : (
            "Tạo nguồn"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => form.reset(initialFormValues)}
          disabled={isFormDisabled}
        >
          Hủy
        </Button>
      </div>
    </form>
  )
}
