"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as z from "zod"

import { createBlog } from "@/app/api/blogs/action"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(255, "Tiêu đề quá dài"),
  slug: z
    .string()
    .min(1, "Slug không được để trống")
    .max(255)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"
    ),
  content: z.string().min(1, "Nội dung không được để trống"),
  shortDescription: z.string(),
  isVisible: z.boolean(),
})

export type CreateBlogRequest = z.infer<typeof createBlogSchema>

export function CreateBlogForm() {
  const router = useRouter()
  const form = useForm<CreateBlogRequest>({
    resolver: zodResolver(createBlogSchema as any),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      shortDescription: "",
      isVisible: true,
    },
  })

  const titleValue = form.watch("title")

  useEffect(() => {
    if (titleValue) {
      const generatedSlug = titleValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")

      form.setValue("slug", generatedSlug, { shouldValidate: true })
    }
  }, [titleValue, form])

  async function onSubmit(data: CreateBlogRequest) {
    const result = await createBlog(data)
    if (result.success) {
      toast.success("Tạo bài viết thành công")

      form.reset({
        title: "",
        slug: "",
        content: "",
        shortDescription: "",
        isVisible: true,
      })

      router.push("/blogs")
      router.refresh()
    } else {
      toast.error(result.error || "Đã có lỗi không mong muốn xảy ra. Vui lòng thử lại.")
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="title">
              Tiêu đề <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              {...field}
              id="title"
              placeholder="Nhập tiêu đề bài viết"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="slug"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="slug">
              Slug (URL) <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              {...field}
              id="slug"
              placeholder="tu-dong-tao-theo-tieu-de"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="shortDescription"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="shortDescription">
              Mô tả ngắn <span className="text-destructive">*</span>
            </FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                {...field}
                id="shortDescription"
                placeholder="Nhập mô tả ngắn..."
                rows={3}
                className="min-h-20 resize-none"
              />
              <InputGroupAddon align="block-end">
                <InputGroupText className="text-xs tabular-nums">
                  {field.value?.length || 0} ký tự
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="content">
              Nội dung <span className="text-destructive">*</span>
            </FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                {...field}
                id="content"
                placeholder="Nhập nội dung bài viết (hỗ trợ HTML)..."
                rows={15}
                className="min-h-96 resize-none font-mono"
              />
              <InputGroupAddon align="block-end">
                <InputGroupText className="text-xs tabular-nums">
                  {field.value?.length || 0} ký tự
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="isVisible"
        control={form.control}
        render={({ field }) => (
          <Field>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex flex-col gap-0.5">
                <FieldLabel className="text-base">
                  Hiển thị công khai
                </FieldLabel>
                <p className="text-sm text-muted-foreground">
                  Công khai bài viết này trên cửa hàng
                </p>
              </div>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </div>
          </Field>
        )}
      />

      </FieldGroup>
      <Separator className="my-8" />

      <div className="flex gap-4">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? (
            <>
              <Spinner data-icon="inline-start" /> Đang tạo...
            </>
          ) : (
            "Tạo bài viết"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Hủy
        </Button>
      </div>
    </form>
  )
}
