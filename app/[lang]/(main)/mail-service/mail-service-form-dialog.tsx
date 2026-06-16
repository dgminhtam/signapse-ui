"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, MailPlus, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import {
  createMailService,
  updateMailService,
} from "@/app/api/mail-service/action"
import { useLocalization } from "@/app/lib/i18n/provider"
import type { MailServiceRecord } from "@/app/lib/mail-service/definitions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"

type MailServiceFormMode = "create" | "update"

interface MailServiceFormDialogProps {
  mode: MailServiceFormMode
  mailService: MailServiceRecord | null
  open: boolean
  providers: string[]
  existingEmails: string[]
  onOpenChange: (open: boolean) => void
}

interface MailServiceFormValues {
  email: string
  provider: string
  password: string
  is_default: boolean
}

function getInitialValues(
  mode: MailServiceFormMode,
  mailService: MailServiceRecord | null
): MailServiceFormValues {
  if (mode === "update" && mailService) {
    return {
      email: mailService.email,
      provider: mailService.provider,
      password: mailService.password ?? "",
      is_default: mailService.isDefault,
    }
  }

  return {
    email: "",
    provider: "",
    password: "",
    is_default: false,
  }
}

export function MailServiceFormDialog({
  mode,
  mailService,
  open,
  providers,
  existingEmails,
  onOpenChange,
}: MailServiceFormDialogProps) {
  const router = useRouter()
  const { dictionary } = useLocalization()
  const t = dictionary.mailService
  const isUpdate = mode === "update"
  const [showPassword, setShowPassword] = useState(false)
  const initialValues = useMemo(
    () => getInitialValues(mode, mailService),
    [mailService, mode]
  )
  const existingEmailSet = useMemo(
    () =>
      new Set(
        existingEmails.map((email) => email.trim().toLowerCase())
      ),
    [existingEmails]
  )
  const schema = useMemo(
    () =>
      z.object({
        email: isUpdate
          ? z.string().trim().min(1, t.emailRequired)
          : z
              .string()
              .trim()
              .min(1, t.emailRequired)
              .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t.emailInvalid)
              .refine(
                (email) => !existingEmailSet.has(email.toLowerCase()),
                t.emailDuplicate
              ),
        provider: z.string().trim().min(1, t.providerRequired),
        password: z.string().trim().min(1, t.passwordRequired),
        is_default: z.boolean(),
      }),
    [existingEmailSet, isUpdate, t]
  )
  const form = useForm<MailServiceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: initialValues,
  })
  const isSubmitting = form.formState.isSubmitting

  useEffect(() => {
    if (open) {
      form.reset(initialValues)
    }
  }, [form, initialValues, open])

  async function onSubmit(values: MailServiceFormValues) {
    const request = {
      email: values.email.trim(),
      provider: values.provider.trim(),
      password: values.password.trim(),
      is_default: form.getValues("is_default"),
    }
    const result = isUpdate
      ? await updateMailService(request)
      : await createMailService(request)

    if (result.success) {
      toast.success(isUpdate ? t.updateSuccess : t.createSuccess)
      setShowPassword(false)
      onOpenChange(false)
      router.refresh()
      return
    }

    toast.error(result.error)
  }

  function handleCancel() {
    form.reset(initialValues)
    setShowPassword(false)
    onOpenChange(false)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset(initialValues)
      setShowPassword(false)
    }

    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isUpdate ? t.updateTitle : t.createTitle}</DialogTitle>
          <DialogDescription>
            {isUpdate ? t.updateDescription : t.createDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  data-disabled={isUpdate ? true : undefined}
                >
                  <FieldLabel htmlFor="mail-service-email">
                    {t.emailLabel} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="mail-service-email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting || isUpdate}
                  />
                  {isUpdate ? (
                    <FieldDescription>
                      {t.emailReadOnlyDescription}
                    </FieldDescription>
                  ) : null}
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Controller
              name="provider"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  data-disabled={isUpdate ? true : undefined}
                >
                  <FieldLabel htmlFor="mail-service-provider">
                    {t.providerLabel}{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  {isUpdate ? (
                    <Input
                      {...field}
                      id="mail-service-provider"
                      aria-invalid={fieldState.invalid}
                      disabled
                    />
                  ) : (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting || providers.length === 0}
                    >
                      <SelectTrigger
                        id="mail-service-provider"
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder={t.providerPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {providers.map((provider) => (
                            <SelectItem key={provider} value={provider}>
                              {provider}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                  {isUpdate ? (
                    <FieldDescription>
                      {t.providerReadOnlyDescription}
                    </FieldDescription>
                  ) : providers.length === 0 ? (
                    <FieldDescription>{t.noProviders}</FieldDescription>
                  ) : null}
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="mail-service-password">
                    {t.passwordLabel}{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="mail-service-password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t.passwordPlaceholder}
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        size="icon-xs"
                        aria-label={
                          showPassword ? t.hidePassword : t.showPassword
                        }
                        disabled={isSubmitting}
                        onClick={() => setShowPassword((value) => !value)}
                      >
                        {showPassword ? (
                          <EyeOff data-icon="inline-start" />
                        ) : (
                          <Eye data-icon="inline-start" />
                        )}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Controller
              name="is_default"
              control={form.control}
              render={({ field }) => (
                <Field orientation="horizontal">
                  <Switch
                    id="mail-service-default"
                    type="button"
                    checked={Boolean(field.value)}
                    onCheckedChange={(checked) => {
                      field.onChange(checked)
                      form.setValue("is_default", checked, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }}
                    disabled={isSubmitting}
                    aria-label={t.defaultLabel}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="mail-service-default">
                      {t.defaultLabel}
                    </FieldLabel>
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {dictionary.common.cancel}
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || (!isUpdate && providers.length === 0)
              }
            >
              {isSubmitting ? (
                <>
                  <Spinner data-icon="inline-start" />
                  {isUpdate ? t.updatePending : t.createPending}
                </>
              ) : isUpdate ? (
                <>
                  <Save data-icon="inline-start" />
                  {dictionary.common.update}
                </>
              ) : (
                <>
                  <MailPlus data-icon="inline-start" />
                  {t.addMail}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
