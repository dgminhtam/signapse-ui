"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import {
  BriefcaseBusinessIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  ListPlusIcon,
  PencilIcon,
  PlusIcon,
  XIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  createWorkspace,
  setDefaultWorkspace,
  updateWorkspace,
} from "@/app/api/workspaces/action"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import { WorkspaceWatchlistEditor } from "./workspace-watchlist-editor"

interface WorkspaceSwitcherProps {
  workspaces: WorkspaceResponse[]
  activeWorkspace: WorkspaceResponse | null
  canCreateWorkspace: boolean
  canRenameWorkspace: boolean
  canSetDefaultWorkspace: boolean
  canReadAsset: boolean
  canReadWatchlist: boolean
  canCreateWatchlist: boolean
  canDeleteWatchlist: boolean
  className?: string
}

export function WorkspaceSwitcher({
  workspaces,
  activeWorkspace,
  canCreateWorkspace,
  canRenameWorkspace,
  canSetDefaultWorkspace,
  canReadAsset,
  canReadWatchlist,
  canCreateWatchlist,
  canDeleteWatchlist,
  className,
}: WorkspaceSwitcherProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isRenameOpen, setIsRenameOpen] = React.useState(false)
  const [isWatchlistOpen, setIsWatchlistOpen] = React.useState(false)
  const [createName, setCreateName] = React.useState("")
  const [createSlug, setCreateSlug] = React.useState("")
  const [renameName, setRenameName] = React.useState("")
  const [renameSlug, setRenameSlug] = React.useState("")

  const canManageWatchlist =
    !!activeWorkspace &&
    canReadAsset &&
    canReadWatchlist &&
    canCreateWatchlist &&
    canDeleteWatchlist

  async function handleSwitchWorkspace(workspace: WorkspaceResponse) {
    if (!canSetDefaultWorkspace || workspace.id === activeWorkspace?.id) {
      return
    }

    startTransition(async () => {
      const result = await setDefaultWorkspace(workspace.id)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(`Đã chuyển sang không gian làm việc "${workspace.name}".`)
      router.refresh()
    })
  }

  function openRenameDialog() {
    if (!activeWorkspace) {
      return
    }

    setRenameName(activeWorkspace.name ?? "")
    setRenameSlug(activeWorkspace.slug ?? "")
    setIsRenameOpen(true)
  }

  async function handleCreateWorkspace() {
    if (!canCreateWorkspace) {
      return
    }

    const name = createName.trim()
    const slug = createSlug.trim()

    if (!name) {
      toast.error("Vui lòng nhập tên không gian làm việc.")
      return
    }

    startTransition(async () => {
      const result = await createWorkspace({
        name,
        ...(slug ? { slug } : {}),
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success("Đã tạo không gian làm việc.")
      setCreateName("")
      setCreateSlug("")
      setIsCreateOpen(false)
      router.refresh()
    })
  }

  async function handleRenameWorkspace() {
    if (!canRenameWorkspace || !activeWorkspace) {
      return
    }

    if (activeWorkspace.personal) {
      toast.error("Không gian làm việc cá nhân không hỗ trợ đổi tên.")
      return
    }

    const name = renameName.trim()
    const slug = renameSlug.trim()

    if (!name) {
      toast.error("Vui lòng nhập tên không gian làm việc.")
      return
    }

    startTransition(async () => {
      const result = await updateWorkspace(activeWorkspace.id, {
        name,
        ...(slug ? { slug } : {}),
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success("Đã cập nhật không gian làm việc.")
      setIsRenameOpen(false)
      router.refresh()
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-10 max-w-full justify-between gap-3 px-3 md:min-w-64",
              className
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <BriefcaseBusinessIcon className="size-4" />
              </span>
              <span className="flex min-w-0 flex-col items-start leading-tight">
                <span className="text-xs text-muted-foreground">Không gian làm việc</span>
                <span className="max-w-44 truncate text-sm font-medium md:max-w-52">
                  {activeWorkspace?.name ?? "Chưa chọn"}
                </span>
              </span>
            </span>
            {isPending ? (
              <Spinner className="size-4" />
            ) : (
              <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="end">
          <DropdownMenuLabel>Không gian làm việc</DropdownMenuLabel>
          <DropdownMenuGroup>
            {workspaces.length > 0 ? (
              workspaces.map((workspace) => {
                const isSelected = activeWorkspace?.id === workspace.id

                return (
                  <DropdownMenuItem
                    key={workspace.id}
                    disabled={isPending || !canSetDefaultWorkspace}
                    onClick={() => void handleSwitchWorkspace(workspace)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-8 items-center justify-center rounded-md border bg-muted/40">
                      <BriefcaseBusinessIcon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium">{workspace.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {workspace.personal ? "Cá nhân" : workspace.slug}
                      </span>
                    </div>
                    {isSelected ? <CheckIcon className="size-4 text-primary" /> : null}
                  </DropdownMenuItem>
                )
              })
            ) : (
              <DropdownMenuItem disabled className="p-2 text-muted-foreground">
                Chưa có không gian làm việc
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator
            className={
              !canCreateWorkspace && !canRenameWorkspace && !canManageWatchlist
                ? "hidden"
                : ""
            }
          />

          <DropdownMenuGroup>
            <DropdownMenuItem
              className={canCreateWorkspace ? "gap-2 p-2" : "hidden"}
              onSelect={(event) => {
                event.preventDefault()
                setIsCreateOpen(true)
              }}
            >
              <PlusIcon className="size-4" />
              Tạo không gian làm việc
            </DropdownMenuItem>
            <DropdownMenuItem
              className={canRenameWorkspace ? "gap-2 p-2" : "hidden"}
              disabled={!canRenameWorkspace || !activeWorkspace || activeWorkspace.personal}
              onSelect={(event) => {
                event.preventDefault()
                openRenameDialog()
              }}
            >
              <PencilIcon className="size-4" />
              Đổi tên không gian làm việc
            </DropdownMenuItem>
            <DropdownMenuItem
              className={canManageWatchlist ? "gap-2 p-2" : "hidden"}
              disabled={!canManageWatchlist}
              onSelect={(event) => {
                event.preventDefault()
                setIsWatchlistOpen(true)
              }}
            >
              <ListPlusIcon className="size-4" />
              Quản lý tài sản theo dõi
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <WorkspaceFormDialog
        open={canCreateWorkspace && isCreateOpen}
        title="Tạo không gian làm việc mới"
        description="Nhập tên và slug tùy chọn để tạo không gian làm việc mới."
        name={createName}
        slug={createSlug}
        submitLabel="Tạo không gian làm việc"
        isPending={isPending}
        onNameChange={setCreateName}
        onSlugChange={setCreateSlug}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateWorkspace}
      />

      <WorkspaceFormDialog
        open={canRenameWorkspace && isRenameOpen}
        title="Đổi tên không gian làm việc"
        description="Cập nhật tên hoặc slug cho không gian làm việc đang chọn."
        name={renameName}
        slug={renameSlug}
        submitLabel="Lưu thay đổi"
        isPending={isPending}
        onNameChange={setRenameName}
        onSlugChange={setRenameSlug}
        onOpenChange={setIsRenameOpen}
        onSubmit={handleRenameWorkspace}
      />

      <WorkspaceWatchlistEditor
        open={isWatchlistOpen}
        onOpenChange={setIsWatchlistOpen}
        workspace={activeWorkspace}
        canReadAsset={canReadAsset}
        canReadWatchlist={canReadWatchlist}
        canCreateWatchlist={canCreateWatchlist}
        canDeleteWatchlist={canDeleteWatchlist}
      />
    </>
  )
}

function WorkspaceFormDialog({
  open,
  title,
  description,
  name,
  slug,
  submitLabel,
  isPending,
  onNameChange,
  onSlugChange,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  title: string
  description: string
  name: string
  slug: string
  submitLabel: string
  isPending: boolean
  onNameChange: (value: string) => void
  onSlugChange: (value: string) => void
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-popover text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
          <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
            <div className="flex flex-col gap-1">
              <DialogPrimitive.Title className="text-lg font-medium text-foreground">
                {title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-sm text-muted-foreground">
                {description}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close asChild>
              <Button type="button" variant="ghost" size="icon-sm" disabled={isPending}>
                <XIcon />
                <span className="sr-only">Đóng</span>
              </Button>
            </DialogPrimitive.Close>
          </div>

          <div className="flex flex-col gap-4 px-6 py-5">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Tên không gian làm việc *
              <Input
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder="Ví dụ: Nhóm nghiên cứu"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Slug tùy chọn
              <Input
                value={slug}
                onChange={(event) => onSlugChange(event.target.value)}
                placeholder="nhom-nghien-cuu"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="button" disabled={isPending} onClick={onSubmit}>
              {isPending ? <Spinner data-icon="inline-start" /> : null}
              {submitLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
