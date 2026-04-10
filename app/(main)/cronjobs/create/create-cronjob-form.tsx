"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import * as z from "zod"

import { createCronjob } from "@/app/api/cronjobs/action"
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
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

export const createCronjobSchema = z.object({
  jobName: z
    .string()
    .min(1, "Job name cannot be empty")
    .max(255, "Job name is too long"),
  jobGroup: z
    .string()
    .min(1, "Job group cannot be empty")
    .max(255, "Job group is too long"),
  jobClass: z
    .string()
    .min(1, "Job class cannot be empty")
    .max(255, "Job class is too long"),
  expression: z
    .string()
    .min(1, "Cron expression cannot be empty")
    .max(100, "Cron expression is too long"),
  description: z.string().max(500, "Description is too long").optional(),
})

export type CreateCronjobRequest = z.infer<typeof createCronjobSchema>

export function CreateCronjobForm() {
  const router = useRouter()
  const form = useForm<CreateCronjobRequest>({
    resolver: zodResolver(createCronjobSchema as any),
    defaultValues: {
      jobName: "",
      jobGroup: "",
      jobClass: "",
      expression: "",
      description: "",
    },
  })

  async function onSubmit(data: CreateCronjobRequest) {
    const result = await createCronjob(data)
    if (result.success) {
      toast.success("Cronjob created successfully")

      form.reset({
        jobName: "",
        jobGroup: "",
        jobClass: "",
        expression: "",
        description: "",
      })

      router.push("/cronjobs")
      router.refresh()
    } else {
      toast.error(result.error || "An unexpected error occurred. Please try again.")
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="jobName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="jobName">
                Job Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="jobName"
                placeholder="Enter job name"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="jobGroup"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="jobGroup">
                Job Group <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="jobGroup"
                placeholder="Enter job group"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="jobClass"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="jobClass">
                Job Class <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="jobClass"
                placeholder="Enter job class"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="expression"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="expression">
                Cron Expression <span className="text-destructive">*</span>
              </FieldLabel>
              <InputGroup>
                <Input
                  {...field}
                  id="expression"
                  placeholder="0 0 * * *"
                  autoComplete="off"
                  className="font-mono"
                />
                <InputGroupAddon>
                  <InputGroupText className="text-xs text-muted-foreground">
                    example: 0 0 * * * (daily at 00:00)
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
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
                placeholder="Enter job description (optional)"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Separator className="my-8" />

      <div className="flex gap-4">
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? (
            <>
              <Spinner className="size-4 mr-2" /> Creating...
            </>
          ) : (
            "Create Cronjob"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
