"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { updateManagedUser } from "@/app/api/user/action"
import { useLocalization } from "@/app/lib/i18n/provider"
import type { RoleResponse } from "@/app/lib/roles/definitions"
import type {
  UpdateManagedUserRequest,
  UserResponse,
} from "@/app/lib/users/definitions"
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
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
import { Spinner } from "@/components/ui/spinner"

interface UserFormDialogProps {
  open: boolean
  roles: RoleResponse[]
  rolesAvailable: boolean
  user: UserResponse | null
  onOpenChange: (open: boolean) => void
}

interface UserFormValues {
  email: string
  firstName: string
  lastName: string
  phone: string
  birthday: string
  roleId: string
}

function getFirstNonEmptyValue(...values: unknown[]) {
  for (const value of values) {
    if (value === null || value === undefined) {
      continue
    }

    const stringValue = String(value).trim()

    if (stringValue) {
      return stringValue
    }
  }

  return ""
}

function getDateInputValue(...values: unknown[]) {
  const value = getFirstNonEmptyValue(...values)

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)
  const year = dateParts.find((part) => part.type === "year")?.value
  const month = dateParts.find((part) => part.type === "month")?.value
  const day = dateParts.find((part) => part.type === "day")?.value

  return year && month && day ? `${year}-${month}-${day}` : ""
}

function getInitialRoleId(user: UserResponse | null, roles: RoleResponse[]) {
  if (!user?.role_name) {
    return ""
  }

  return (
    roles
      .find(
        (role) => role.key === user.role_name || role.name === user.role_name
      )
      ?.id.toString() ?? ""
  )
}

function getInitialValues(
  user: UserResponse | null,
  roles: RoleResponse[]
): UserFormValues {
  if (user) {
    return {
      birthday: getDateInputValue(user.birthday),
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone:
        user.phone === null || user.phone === undefined
          ? ""
          : String(user.phone),
      roleId: getInitialRoleId(user, roles),
    }
  }

  return {
    birthday: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    roleId: "",
  }
}

export function UserFormDialog({
  open,
  roles,
  rolesAvailable,
  user,
  onOpenChange,
}: UserFormDialogProps) {
  const router = useRouter()
  const { dictionary } = useLocalization()
  const t = dictionary.users
  const initialValues = useMemo(
    () => getInitialValues(user, roles),
    [roles, user]
  )
  const schema = useMemo(
    () =>
      z.object({
        email: z.string().trim(),
        firstName: z.string().trim().min(1, t.firstNameRequired),
        lastName: z.string().trim().min(1, t.lastNameRequired),
        phone: z.string().trim(),
        birthday: z
          .string()
          .trim()
          .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), {
            message: t.birthdayInvalid,
          }),
        roleId: z.string().trim().min(1, t.roleRequired),
      }),
    [t]
  )
  const form = useForm<UserFormValues>({
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

  async function onSubmit(values: UserFormValues) {
    if (!user) {
      return
    }

    const names = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
    }
    const result = await updateManagedUser(user.id, {
      ...names,
      birthday: values.birthday.trim(),
      phone: values.phone.trim(),
      roleId: Number(values.roleId),
    } satisfies UpdateManagedUserRequest)

    if (result.success) {
      toast.success(t.updateSuccess)
      onOpenChange(false)
      router.refresh()
      return
    }

    toast.error(result.error)
  }

  function handleCancel() {
    form.reset(initialValues)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.updateTitle}</DialogTitle>
          <DialogDescription>{t.updateDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} data-disabled>
                  <FieldLabel htmlFor="user-email">{t.emailLabel}</FieldLabel>
                  <Input
                    {...field}
                    id="user-email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    aria-invalid={fieldState.invalid}
                    disabled
                  />
                  <FieldDescription>
                    {t.emailReadOnlyDescription}
                  </FieldDescription>
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="user-last-name">
                      {t.lastNameLabel}{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="user-last-name"
                      placeholder={t.lastNamePlaceholder}
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="user-first-name">
                      {t.firstNameLabel}{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="user-first-name"
                      placeholder={t.firstNamePlaceholder}
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="user-phone">{t.phoneLabel}</FieldLabel>
                    <Input
                      {...field}
                      id="user-phone"
                      type="tel"
                      placeholder={t.phonePlaceholder}
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="birthday"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="user-birthday">
                      {t.birthdayLabel}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="user-birthday"
                      type="date"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="roleId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="user-role">
                    {t.roleLabel} <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting || !rolesAvailable}
                  >
                    <SelectTrigger
                      id="user-role"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder={t.rolePlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                  {!rolesAvailable ? (
                    <FieldDescription>
                      {t.roleCatalogUnavailable}
                    </FieldDescription>
                  ) : null}
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
            <Button type="submit" disabled={isSubmitting || !rolesAvailable}>
              {isSubmitting ? (
                <>
                  <Spinner data-icon="inline-start" />
                  {t.updatePending}
                </>
              ) : (
                <>
                  <Save data-icon="inline-start" />
                  {dictionary.common.update}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
