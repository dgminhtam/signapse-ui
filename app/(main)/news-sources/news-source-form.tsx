"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { createNewsSource, updateNewsSource } from "@/app/api/news-sources/action"
import { NewsSourceResponse, NewsSourceRequest } from "@/app/lib/news-sources/definitions"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

const newsSourceSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name is too long"),
  url: z
    .string()
    .url("Invalid URL format")
    .min(1, "URL is required"),
  rssUrl: z.union([z.literal(""), z.string().url("Invalid RSS URL format")]),
  description: z
    .string()
    .max(500, "Description is too long")
    .optional()
    .or(z.literal("")),
  active: z.boolean().default(true),
})

type NewsSourceFormValues = z.infer<typeof newsSourceSchema>

interface NewsSourceFormProps {
  initialData?: NewsSourceResponse
}

export function NewsSourceForm({ initialData }: NewsSourceFormProps) {
  const router = useRouter()
  const isEdit = !!initialData

  const form = useForm<NewsSourceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(newsSourceSchema as any),
    defaultValues: {
      name: initialData?.name || "",
      url: initialData?.url || "",
      rssUrl: initialData?.rssUrl || "",
      description: initialData?.description || "",
      active: initialData?.active ?? true,
    },
  })

  async function onSubmit(data: NewsSourceFormValues) {
    const request: NewsSourceRequest = {
      ...data,
      rssUrl: data.rssUrl || "",
      description: data.description || "",
    }

    const result = isEdit 
      ? await updateNewsSource(initialData.id, request)
      : await createNewsSource(request)

    if (result.success) {
      toast.success(isEdit ? "News source updated successfully" : "News source created successfully")
      router.push("/news-sources")
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">
                Source Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="name"
                placeholder="e.g. Google News"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

      <Controller
        name="url"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="url">
              Website URL <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              {...field}
              id="url"
              placeholder="https://example.com"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="rssUrl"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="rssUrl">RSS URL</FieldLabel>
            <Input
              {...field}
              id="rssUrl"
              placeholder="https://example.com/rss.xml"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                {...field}
                id="description"
                placeholder="Optional description"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="active"
          control={form.control}
          render={({ field }) => (
            <Field className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FieldLabel className="text-base">Active Status</FieldLabel>
                <div className="text-sm text-muted-foreground">
                  Allow system to crawl articles from this source.
                </div>
              </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
            </Field>
          )}
        />
      </FieldGroup>

      <Separator className="my-8" />

      <div className="flex gap-4">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? (
            <>
              <Spinner className="size-4 mr-2" /> {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            isEdit ? "Update Source" : "Create Source"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/news-sources")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
