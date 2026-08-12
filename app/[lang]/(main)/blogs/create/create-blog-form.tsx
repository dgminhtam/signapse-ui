"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as z from "zod"

import { createBlog } from "@/app/api/blogs/action"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { useLocalization } from "@/app/lib/i18n/provider"
import { useLocalizedPath } from "@/components/localized-link"
import {
  AppFormShell,
  AppFormShellBody,
  AppFormShellFooter,
} from "@/components/app-form-shell"
import { AppFormSwitchField } from "@/components/app-form-switch-field"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"

export function getCreateBlogSchema(dictionary: Dictionary) {
  return z.object({
    title: z
      .string()
      .min(1, dictionary.blogs.titleRequired)
      .max(255, dictionary.blogs.titleTooLong),
    slug: z
      .string()
      .min(1, dictionary.blogs.slugRequired)
      .max(255)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, dictionary.blogs.slugInvalid),
    content: z.string().min(1, dictionary.blogs.contentRequired),
    shortDescription: z.string(),
    isVisible: z.boolean(),
  })
}

export type CreateBlogRequest = z.infer<ReturnType<typeof getCreateBlogSchema>>

export function CreateBlogForm() {
  const router = useRouter()
  const { dictionary, formatMessage, formatNumber } = useLocalization()
  const blogsPath = useLocalizedPath("/blogs")
  const createBlogSchema = useMemo(
    () => getCreateBlogSchema(dictionary),
    [dictionary]
  )
  const form = useForm<CreateBlogRequest>({
    resolver: zodResolver(createBlogSchema as never),
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
      toast.success(dictionary.blogs.createSuccess)

      form.reset({
        title: "",
        slug: "",
        content: "",
        shortDescription: "",
        isVisible: true,
      })

      router.push(blogsPath)
      router.refresh()
    } else {
      toast.error(result.error || dictionary.blogs.unexpectedError)
    }
  }

  return (
    <AppFormShell
      title={dictionary.blogs.createTitle}
      description={dictionary.blogs.createDescription}
      width="lg"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AppFormShellBody>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">
                    {dictionary.blogs.titleLabel}{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    placeholder={dictionary.blogs.titlePlaceholder}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="shortDescription"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="shortDescription">
                    {dictionary.blogs.shortDescriptionLabel}{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="shortDescription"
                      placeholder={dictionary.blogs.shortDescriptionPlaceholder}
                      rows={3}
                      className="min-h-20 resize-none"
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="text-xs tabular-nums">
                        {formatMessage(dictionary.blogs.characters, {
                          count: formatNumber(field.value?.length || 0),
                        })}
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="content">
                    {dictionary.blogs.contentLabel}{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="content"
                      placeholder={dictionary.blogs.contentPlaceholder}
                      rows={15}
                      className="min-h-96 resize-none font-mono"
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="text-xs tabular-nums">
                        {formatMessage(dictionary.blogs.characters, {
                          count: formatNumber(field.value?.length || 0),
                        })}
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="isVisible"
              control={form.control}
              render={({ field }) => (
                <AppFormSwitchField
                  id="isVisible"
                  label={dictionary.blogs.publicLabel}
                  description={dictionary.blogs.publicDescription}
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </FieldGroup>
        </AppFormShellBody>

        <AppFormShellFooter>
          <div className="flex gap-4">
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? (
                <>
                  <Spinner data-icon="inline-start" />{" "}
                  {dictionary.blogs.createPending}
                </>
              ) : (
                dictionary.blogs.createAction
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(blogsPath)}
            >
              {dictionary.common.cancel}
            </Button>
          </div>
        </AppFormShellFooter>
      </form>
    </AppFormShell>
  )
}
