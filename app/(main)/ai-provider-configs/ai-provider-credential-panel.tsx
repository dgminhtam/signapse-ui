"use client"

import { format } from "date-fns"
import { Clock3, KeyRound, Plus, RefreshCw, TimerReset, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import {
  createAiProviderCredential,
  deleteAiProviderCredential,
  updateAiProviderCredential,
} from "@/app/api/ai-provider-configs/action"
import {
  AiProviderConfigResponse,
  AiProviderCredentialResponse,
} from "@/app/lib/ai-provider-configs/definitions"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { useHasPermission } from "@/components/permission-provider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

interface AiProviderCredentialPanelProps {
  provider: AiProviderConfigResponse
}

export function AiProviderCredentialPanel({
  provider,
}: AiProviderCredentialPanelProps) {
  const credentials = provider.credentials || []
  const canCreateCredential = useHasPermission("ai-provider-config:create")
  const canUpdateCredential = useHasPermission("ai-provider-config:update")
  const canDeleteCredential = useHasPermission("ai-provider-config:delete")
  const router = useRouter()
  const [label, setLabel] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleCreate() {
    const trimmedApiKey = apiKey.trim()

    if (!trimmedApiKey) {
      toast.error("Vui lòng nhập API key.")
      return
    }

    const trimmedLabel = label.trim()

    startTransition(async () => {
      const result = await createAiProviderCredential(provider.id, {
        ...(trimmedLabel ? { label: trimmedLabel } : {}),
        apiKey: trimmedApiKey,
      })

      if (result.success) {
        toast.success("Đã thêm credential AI.")
        setLabel("")
        setApiKey("")
        router.refresh()
        return
      }

      toast.error(result.error)
    })
  }

  return (
    <section className="w-full max-w-3xl overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="flex flex-col gap-2 px-6 pt-6">
        <h2 className="text-xl font-semibold tracking-tight text-card-foreground">
          Credential
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Quản lý các API key đã lưu cho cấu hình này. Hệ thống chỉ hiển thị preview, không trả về key đầy đủ.
        </p>
      </header>

      <div className="flex flex-col gap-6 px-6 py-6">
        {credentials.length > 0 ? (
          <div className="flex flex-col gap-3">
            {credentials.map((credential) => (
              <CredentialItem
                key={credential.id}
                providerId={provider.id}
                credential={credential}
                canUpdate={canUpdateCredential}
                canDelete={canDeleteCredential}
              />
            ))}
          </div>
        ) : (
          <Empty className="rounded-lg border border-dashed py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <KeyRound />
              </EmptyMedia>
              <EmptyTitle>Chưa có credential</EmptyTitle>
              <EmptyDescription>
                Thêm API key để cấu hình này có credential sử dụng với backend.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {canCreateCredential ? (
          <div className="rounded-lg border bg-muted/20 p-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="newCredentialLabel">Nhãn credential mới</FieldLabel>
                <Input
                  id="newCredentialLabel"
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                  placeholder="Ví dụ: Key dự phòng"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="newCredentialApiKey">
                  API key mới <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="newCredentialApiKey"
                  type="password"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  placeholder="Dán API key mới"
                  autoComplete="new-password"
                />
                <FieldDescription>
                  Key đầy đủ chỉ được gửi một lần khi tạo credential.
                </FieldDescription>
              </Field>
              <div>
                <Button type="button" onClick={handleCreate} disabled={isPending}>
                  {isPending ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <Plus data-icon="inline-start" />
                  )}
                  Thêm credential
                </Button>
              </div>
            </FieldGroup>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function CredentialItem({
  providerId,
  credential,
  canUpdate,
  canDelete,
}: {
  providerId: number
  credential: AiProviderCredentialResponse
  canUpdate: boolean
  canDelete: boolean
}) {
  const router = useRouter()
  const [label, setLabel] = useState(credential.label || "")
  const [apiKey, setApiKey] = useState("")
  const [isUpdating, startUpdating] = useTransition()

  function handleUpdate() {
    const trimmedLabel = label.trim()
    const trimmedApiKey = apiKey.trim()

    if (!trimmedLabel && !trimmedApiKey) {
      toast.error("Vui lòng nhập nhãn hoặc API key mới để cập nhật.")
      return
    }

    startUpdating(async () => {
      const result = await updateAiProviderCredential(providerId, credential.id, {
        label: trimmedLabel,
        ...(trimmedApiKey ? { apiKey: trimmedApiKey } : {}),
      })

      if (result.success) {
        toast.success("Đã cập nhật credential AI.")
        setApiKey("")
        router.refresh()
        return
      }

      toast.error(result.error)
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">
              {credential.label || `Credential #${credential.id}`}
            </span>
            {credential.keyPreview ? (
              <Badge variant="secondary">{credential.keyPreview}</Badge>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {formatDate(credential.lastUsedDate) ? (
              <AppTimeMetadata icon={Clock3}>
                Dùng gần nhất: {formatDate(credential.lastUsedDate)}
              </AppTimeMetadata>
            ) : null}
            {formatDate(credential.rateLimitedUntil) ? (
              <AppTimeMetadata icon={TimerReset}>
                Rate limit đến: {formatDate(credential.rateLimitedUntil)}
              </AppTimeMetadata>
            ) : null}
            {formatDate(credential.createdDate) ? (
              <AppTimeMetadata icon={Clock3}>
                Tạo lúc: {formatDate(credential.createdDate)}
              </AppTimeMetadata>
            ) : null}
            {formatDate(credential.lastModifiedDate) ? (
              <AppTimeMetadata icon={RefreshCw}>
                Cập nhật: {formatDate(credential.lastModifiedDate)}
              </AppTimeMetadata>
            ) : null}
          </div>
        </div>
        {canDelete ? (
          <DeleteCredentialButton
            providerId={providerId}
            credential={credential}
          />
        ) : null}
      </div>

      {canUpdate ? (
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
          <Field>
            <FieldLabel htmlFor={`credential-${credential.id}-label`}>
              Nhãn credential
            </FieldLabel>
            <Input
              id={`credential-${credential.id}-label`}
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Nhãn credential"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`credential-${credential.id}-api-key`}>
              API key mới
            </FieldLabel>
            <Input
              id={`credential-${credential.id}-api-key`}
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="Để trống nếu chỉ đổi nhãn"
              autoComplete="new-password"
            />
          </Field>
          <Button
            type="button"
            variant="outline"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <RefreshCw data-icon="inline-start" />
            )}
            Cập nhật
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function DeleteCredentialButton({
  providerId,
  credential,
}: {
  providerId: number
  credential: AiProviderCredentialResponse
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAiProviderCredential(providerId, credential.id)

      if (result.success) {
        toast.success("Đã xóa credential AI.")
        setOpen(false)
        router.refresh()
        return
      }

      toast.error(result.error)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 />
          <span className="sr-only">Xóa credential</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa credential AI?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Credential{" "}
            <strong>{credential.label || credential.keyPreview || `#${credential.id}`}</strong>{" "}
            sẽ bị xóa khỏi cấu hình nhà cung cấp AI.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault()
              handleDelete()
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Spinner data-icon="inline-start" />
                Đang xóa...
              </>
            ) : (
              "Xóa credential"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function formatDate(value?: string) {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return null

  return format(date, "dd/MM/yyyy HH:mm")
}
