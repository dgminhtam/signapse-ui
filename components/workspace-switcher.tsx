"use client"

import * as React from "react"
import {
  BriefcaseBusinessIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  ListPlusIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  createWorkspace,
  setCurrentWorkspace,
  updateWorkspace,
} from "@/app/api/workspaces/action"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

const WORKSPACE_SWITCHER_TRIGGER_ID = "workspace-switcher-trigger"

interface WorkspaceSwitcherProps {
  workspaces: WorkspaceResponse[]
  currentWorkspace: WorkspaceResponse | null
  canCreateWorkspace: boolean
  canRenameWorkspace: boolean
  canSetCurrentWorkspace: boolean
  canReadAsset: boolean
  canReadWatchlist: boolean
  canCreateWatchlist: boolean
  canDeleteWatchlist: boolean
  className?: string
}

export function WorkspaceSwitcher({
  workspaces,
  currentWorkspace,
  canCreateWorkspace,
  canRenameWorkspace,
  canSetCurrentWorkspace,
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
  const [renameName, setRenameName] = React.useState("")

  const canManageWatchlist =
    !!currentWorkspace &&
    canReadAsset &&
    canReadWatchlist &&
    canCreateWatchlist &&
    canDeleteWatchlist

  async function handleSwitchWorkspace(workspace: WorkspaceResponse) {
    if (!canSetCurrentWorkspace || workspace.id === currentWorkspace?.id) {
      return
    }

    startTransition(async () => {
      const result = await setCurrentWorkspace(workspace.id)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success(`Đã chuyển sang không gian làm việc "${workspace.name}".`)
      router.refresh()
    })
  }

  function openRenameDialog() {
    if (!currentWorkspace) {
      return
    }

    setRenameName(currentWorkspace.name ?? "")
    setIsRenameOpen(true)
  }

  async function handleCreateWorkspace() {
    if (!canCreateWorkspace) {
      return
    }

    const name = createName.trim()

    if (!name) {
      toast.error("Vui lòng nhập tên không gian làm việc.")
      return
    }

    startTransition(async () => {
      const result = await createWorkspace({
        name,
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success("Đã tạo không gian làm việc.")
      setCreateName("")
      setIsCreateOpen(false)
      router.refresh()
    })
  }

  async function handleRenameWorkspace() {
    if (!canRenameWorkspace || !currentWorkspace) {
      return
    }

    const name = renameName.trim()

    if (!name) {
      toast.error("Vui lòng nhập tên không gian làm việc.")
      return
    }

    startTransition(async () => {
      const result = await updateWorkspace(currentWorkspace.id, {
        name,
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
        <DropdownMenuTrigger asChild id={WORKSPACE_SWITCHER_TRIGGER_ID}>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "max-w-full justify-between gap-2 px-3 md:min-w-56",
              className
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <BriefcaseBusinessIcon className="size-4" />
              </span>
              <span className="max-w-44 truncate text-sm font-medium md:max-w-52">
                {currentWorkspace?.name ?? "Chưa chọn"}
              </span>
            </span>
            {isPending ? (
              <Spinner className="size-4" />
            ) : (
              <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-72"
          align="end"
          aria-labelledby={WORKSPACE_SWITCHER_TRIGGER_ID}
        >
          <DropdownMenuLabel>Không gian làm việc</DropdownMenuLabel>
          <DropdownMenuGroup>
            {workspaces.length > 0 ? (
              workspaces.map((workspace) => {
                const isSelected = currentWorkspace?.id === workspace.id

                return (
                  <DropdownMenuItem
                    key={workspace.id}
                    disabled={
                      isPending || !canSetCurrentWorkspace || isSelected
                    }
                    onSelect={() => void handleSwitchWorkspace(workspace)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-8 items-center justify-center rounded-md border bg-muted/40">
                      <BriefcaseBusinessIcon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium">
                        {workspace.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {isSelected ? "Đang hoạt động" : "Có thể chuyển sang"}
                      </span>
                    </div>
                    {isSelected ? (
                      <CheckIcon className="size-4 text-primary" />
                    ) : null}
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
              disabled={!canRenameWorkspace || !currentWorkspace}
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
        description="Nhập tên cho không gian làm việc mới."
        name={createName}
        submitLabel="Tạo không gian làm việc"
        isPending={isPending}
        onNameChange={setCreateName}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateWorkspace}
      />

      <WorkspaceFormDialog
        open={canRenameWorkspace && isRenameOpen}
        title="Đổi tên không gian làm việc"
        description="Cập nhật tên cho không gian làm việc đang hoạt động."
        name={renameName}
        submitLabel="Lưu thay đổi"
        isPending={isPending}
        onNameChange={setRenameName}
        onOpenChange={setIsRenameOpen}
        onSubmit={handleRenameWorkspace}
      />

      <WorkspaceWatchlistEditor
        open={isWatchlistOpen}
        onOpenChange={setIsWatchlistOpen}
        workspace={currentWorkspace}
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
  submitLabel,
  isPending,
  onNameChange,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  title: string
  description: string
  name: string
  submitLabel: string
  isPending: boolean
  onNameChange: (value: string) => void
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Tên không gian làm việc *
            <Input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Ví dụ: Nhóm nghiên cứu"
            />
          </label>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={isPending}>
              Hủy
            </Button>
          </DialogClose>
          <Button type="button" disabled={isPending} onClick={onSubmit}>
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
