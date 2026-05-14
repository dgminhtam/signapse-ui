"use client"

import { format } from "date-fns"
import {
  Clock3,
  KeyRound,
  Plus,
  RefreshCw,
  TimerReset,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import {
  createAiProviderCredential,
  deleteAiProviderCredential,
  getAiProviderModelCatalog,
  updateAiProviderCredential,
} from "@/app/api/ai-provider-configs/action"
import {
  AiProviderConfigResponse,
  AiProviderCredentialResponse,
  AiProviderModelCatalogRequest,
  AiProviderModelOptionResponse,
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

import {
  AiProviderCredentialModelActionButton,
  AiProviderCredentialModelSummary,
} from "./ai-provider-credential-model-control"
import { AiProviderModelPickerDialog } from "./ai-provider-model-picker-dialog"

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
  const canFetchModelCatalog = useHasPermission(
    "ai-provider-config:model-catalog"
  )

  return (
    <section className="w-full max-w-3xl overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="flex flex-col gap-2 px-6 pt-6">
        <h2 className="text-xl font-semibold tracking-tight text-card-foreground">
          Credential
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Quản lý API key và model đã chọn cho từng credential.
        </p>
      </header>

      <div className="flex flex-col gap-6 px-6 py-6">
        {credentials.length > 0 ? (
          <div className="flex flex-col gap-3">
            {credentials.map((credential) => (
              <CredentialItem
                key={credential.id}
                provider={provider}
                credential={credential}
                canUpdate={canUpdateCredential}
                canDelete={canDeleteCredential}
                canFetchModelCatalog={canFetchModelCatalog}
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
                Thêm API key và chọn model để cấu hình này có thể sử dụng với
                backend.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {canCreateCredential ? (
          <CreateCredentialForm
            provider={provider}
            canFetchModelCatalog={canFetchModelCatalog}
          />
        ) : null}
      </div>
    </section>
  )
}

function CreateCredentialForm({
  provider,
  canFetchModelCatalog,
}: {
  provider: AiProviderConfigResponse
  canFetchModelCatalog: boolean
}) {
  const router = useRouter()
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("")
  const [modelOptions, setModelOptions] = useState<
    AiProviderModelOptionResponse[]
  >([])
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false)
  const [isAuthenticating, startAuthenticating] = useTransition()
  const [isCreating, startCreating] = useTransition()

  function handleApiKeyChange(value: string) {
    setApiKey(value)
    setModel("")
    setModelOptions([])
  }

  function handleAuthenticateAndSelectModel() {
    const trimmedApiKey = apiKey.trim()

    if (!trimmedApiKey) {
      toast.error("Vui lòng nhập API key để xác thực.")
      return
    }

    const request: AiProviderModelCatalogRequest = {
      providerType: provider.providerType,
      apiKey: trimmedApiKey,
      baseUrl: provider.baseUrl?.trim() || undefined,
    }

    startAuthenticating(async () => {
      const result = await getAiProviderModelCatalog(request)

      if (result.success) {
        setModelOptions(result.data.models)
        setIsModelDialogOpen(true)
        toast.success("Xác thực credential thành công")
        return
      }

      setModelOptions([])
      setIsModelDialogOpen(false)
      toast.error(result.error || "Không thể xác thực credential")
    })
  }

  function handleCreate() {
    const trimmedApiKey = apiKey.trim()
    const trimmedModel = model.trim()

    if (!trimmedApiKey || !trimmedModel) {
      toast.error("Vui lòng xác thực API key và chọn model.")
      return
    }

    startCreating(async () => {
      const result = await createAiProviderCredential(provider.id, {
        apiKey: trimmedApiKey,
        model: trimmedModel,
      })

      if (result.success) {
        toast.success("Đã thêm credential AI.")
        setApiKey("")
        setModel("")
        setModelOptions([])
        router.refresh()
        return
      }

      toast.error(result.error)
    })
  }

  return (
    <>
      <div className="rounded-lg border bg-muted/20 p-4">
        <FieldGroup>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-medium">API key và model mới</div>
            <AiProviderCredentialModelActionButton
              model={model}
              isPending={isAuthenticating}
              disabled={!canFetchModelCatalog || isAuthenticating || isCreating}
              onClick={handleAuthenticateAndSelectModel}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.75fr)]">
            <Field>
              <FieldLabel htmlFor="newCredentialApiKey">
                API key mới <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="newCredentialApiKey"
                type="password"
                value={apiKey}
                onChange={(event) => handleApiKeyChange(event.target.value)}
                placeholder="Dán API key mới"
                autoComplete="new-password"
              />
              <FieldDescription>
                Key đầy đủ chỉ được gửi một lần khi tạo credential.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>
                Model <span className="text-destructive">*</span>
              </FieldLabel>
              <AiProviderCredentialModelSummary model={model} />
            </Field>
          </div>

          <div>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={isCreating || !apiKey.trim() || !model.trim()}
            >
              {isCreating ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Plus data-icon="inline-start" />
              )}
              Thêm credential
            </Button>
          </div>
        </FieldGroup>
      </div>

      <AiProviderModelPickerDialog
        currentModel={model}
        models={modelOptions}
        open={isModelDialogOpen}
        onOpenChange={setIsModelDialogOpen}
        onConfirm={(modelId) => {
          setModel(modelId)
          setIsModelDialogOpen(false)
          toast.success("Đã chọn model cho credential")
        }}
      />
    </>
  )
}

function CredentialItem({
  provider,
  credential,
  canUpdate,
  canDelete,
  canFetchModelCatalog,
}: {
  provider: AiProviderConfigResponse
  credential: AiProviderCredentialResponse
  canUpdate: boolean
  canDelete: boolean
  canFetchModelCatalog: boolean
}) {
  const router = useRouter()
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("")
  const [modelOptions, setModelOptions] = useState<
    AiProviderModelOptionResponse[]
  >([])
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false)
  const [isAuthenticating, startAuthenticating] = useTransition()
  const [isUpdating, startUpdating] = useTransition()

  function handleApiKeyChange(value: string) {
    setApiKey(value)
    setModel("")
    setModelOptions([])
  }

  function handleAuthenticateAndSelectModel() {
    const trimmedApiKey = apiKey.trim()

    if (!trimmedApiKey) {
      toast.error("Vui lòng nhập API key mới để xác thực.")
      return
    }

    const request: AiProviderModelCatalogRequest = {
      providerType: provider.providerType,
      apiKey: trimmedApiKey,
      baseUrl: provider.baseUrl?.trim() || undefined,
    }

    startAuthenticating(async () => {
      const result = await getAiProviderModelCatalog(request)

      if (result.success) {
        setModelOptions(result.data.models)
        setIsModelDialogOpen(true)
        toast.success("Xác thực credential thành công")
        return
      }

      setModelOptions([])
      setIsModelDialogOpen(false)
      toast.error(result.error || "Không thể xác thực credential")
    })
  }

  function handleUpdate() {
    const trimmedApiKey = apiKey.trim()
    const trimmedModel = model.trim()

    if (!trimmedApiKey || !trimmedModel) {
      toast.error("Vui lòng xác thực API key mới và chọn model.")
      return
    }

    startUpdating(async () => {
      const result = await updateAiProviderCredential(provider.id, credential.id, {
        apiKey: trimmedApiKey,
        model: trimmedModel,
      })

      if (result.success) {
        toast.success("Đã cập nhật credential AI.")
        setApiKey("")
        setModel("")
        setModelOptions([])
        router.refresh()
        return
      }

      toast.error(result.error)
    })
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-lg border p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="min-w-0 break-all font-medium text-foreground">
                {credential.model || "Chưa chọn model"}
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
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {canUpdate ? (
              <AiProviderCredentialModelActionButton
                model={model}
                isPending={isAuthenticating}
                disabled={
                  !canFetchModelCatalog || isAuthenticating || isUpdating
                }
                onClick={handleAuthenticateAndSelectModel}
              />
            ) : null}
            {canDelete ? (
              <DeleteCredentialButton
                providerId={provider.id}
                credential={credential}
              />
            ) : null}
          </div>
        </div>

        {canUpdate ? (
          <FieldGroup>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.75fr)]">
              <Field>
                <FieldLabel htmlFor={`credential-${credential.id}-api-key`}>
                  API key mới
                </FieldLabel>
                <Input
                  id={`credential-${credential.id}-api-key`}
                  type="password"
                  value={apiKey}
                  onChange={(event) => handleApiKeyChange(event.target.value)}
                  placeholder="Dán API key mới để xác thực lại model"
                  autoComplete="new-password"
                />
              </Field>
              <Field>
                <FieldLabel>
                  Model <span className="text-destructive">*</span>
                </FieldLabel>
                <AiProviderCredentialModelSummary model={model} />
              </Field>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleUpdate}
              disabled={isUpdating || !apiKey.trim() || !model.trim()}
            >
              {isUpdating ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <RefreshCw data-icon="inline-start" />
              )}
              Cập nhật
            </Button>
          </FieldGroup>
        ) : null}
      </div>

      <AiProviderModelPickerDialog
        currentModel={model}
        models={modelOptions}
        open={isModelDialogOpen}
        onOpenChange={setIsModelDialogOpen}
        onConfirm={(modelId) => {
          setModel(modelId)
          setIsModelDialogOpen(false)
          toast.success("Đã chọn model cho credential")
        }}
      />
    </>
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
  const credentialName =
    credential.model || credential.keyPreview || `#${credential.id}`

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
            <strong>{credentialName}</strong> sẽ bị xóa khỏi cấu hình nhà cung
            cấp AI.
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
