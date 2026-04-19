"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import {
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
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"

import { WorkspaceWatchlistEditor } from "./workspace-watchlist-editor"

interface WorkspaceSwitcherProps {
  workspaces: WorkspaceResponse[]
  activeWorkspace: WorkspaceResponse | null
  logo: React.ElementType
  canCreateWorkspace: boolean
  canRenameWorkspace: boolean
  canSetDefaultWorkspace: boolean
  canReadAsset: boolean
  canReadWatchlist: boolean
  canCreateWatchlist: boolean
  canDeleteWatchlist: boolean
}

export function WorkspaceSwitcherV2({
  workspaces,
  activeWorkspace,
  logo: Logo,
  canCreateWorkspace,
  canRenameWorkspace,
  canSetDefaultWorkspace,
  canReadAsset,
  canReadWatchlist,
  canCreateWatchlist,
  canDeleteWatchlist,
}: WorkspaceSwitcherProps) {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const [isPending, startTransition] = React.useTransition()

  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isRenameOpen, setIsRenameOpen] = React.useState(false)
  const [isWatchlistOpen, setIsWatchlistOpen] = React.useState(false)

  const [createName, setCreateName] = React.useState("")
  const [createSlug, setCreateSlug] = React.useState("")
  const [renameName, setRenameName] = React.useState("")
  const [renameSlug, setRenameSlug] = React.useState("")

  React.useEffect(() => {
    if (!isRenameOpen || !activeWorkspace) {
      return
    }

    setRenameName(activeWorkspace.name ?? "")
    setRenameSlug(activeWorkspace.slug ?? "")
  }, [activeWorkspace, isRenameOpen])

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

      toast.success(`Da chuyen sang workspace "${workspace.name}"`)
      router.refresh()
    })
  }

  async function handleCreateWorkspace() {
    if (!canCreateWorkspace) {
      return
    }

    const name = createName.trim()
    const slug = createSlug.trim()

    if (!name) {
      toast.error("Vui long nhap ten workspace")
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

      toast.success(
        "Tạo workspace thành công. Bạn có thể chuyển sang workspace mới để quản lý danh sách theo dõi."
      )
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
      toast.error("Workspace ca nhan khong ho tro doi ten")
      return
    }

    const name = renameName.trim()
    const slug = renameSlug.trim()

    if (!name) {
      toast.error("Vui long nhap ten workspace")
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

      toast.success("Cap nhat workspace thanh cong")
      setIsRenameOpen(false)
      router.refresh()
    })
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Logo />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {activeWorkspace?.name ?? "No Workspace selected"}
                  </span>
                  <span className="truncate text-xs">
                    {activeWorkspace
                      ? (activeWorkspace.personal ? "Personal workspace" : activeWorkspace.slug)
                      : "Please select or create one"}
                  </span>
                </div>
                <ChevronsUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                {workspaces.map((workspace) => {
                  const isSelected = activeWorkspace?.id === workspace.id

                  return (
                    <DropdownMenuItem
                      key={workspace.id}
                      disabled={isPending || !canSetDefaultWorkspace}
                      onClick={() => handleSwitchWorkspace(workspace)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border">
                        <Logo />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate">{workspace.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {workspace.personal ? "personal" : workspace.slug}
                        </span>
                      </div>
                      {isSelected ? <CheckIcon className="size-4 text-primary" /> : null}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
              <DropdownMenuSeparator
                className={!canCreateWorkspace && !canRenameWorkspace && !canManageWatchlist ? "hidden" : ""}
              />
              <DropdownMenuItem
                className={canCreateWorkspace ? "gap-2 p-2" : "hidden"}
                onSelect={(event) => {
                  event.preventDefault()
                  setIsCreateOpen(true)
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <PlusIcon className="size-4" />
                </div>
                <div className="font-medium">Tao workspace</div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={canRenameWorkspace ? "gap-2 p-2" : "hidden"}
                disabled={!canRenameWorkspace || !activeWorkspace || activeWorkspace.personal}
                onSelect={(event) => {
                  event.preventDefault()
                  setIsRenameOpen(true)
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <PencilIcon className="size-4" />
                </div>
                <div className="font-medium">Doi ten workspace</div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={canManageWatchlist ? "gap-2 p-2" : "hidden"}
                disabled={!canManageWatchlist}
                onSelect={(event) => {
                  event.preventDefault()
                  setIsWatchlistOpen(true)
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <ListPlusIcon className="size-4" />
                </div>
                <div className="font-medium">Chỉnh danh sách theo dõi</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <DialogPrimitive.Root open={canCreateWorkspace && isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-popover text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
            <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
              <div className="flex flex-col gap-1">
                <DialogPrimitive.Title className="text-lg font-medium text-foreground">
                  Tao workspace moi
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-sm text-muted-foreground">
                  Nhập tên và slug tùy chọn để tạo workspace mới. Danh sách theo dõi sẽ được
                  quản lý sau khi workspace được chọn.
                </DialogPrimitive.Description>
              </div>
              <DialogPrimitive.Close asChild>
                <Button type="button" variant="ghost" size="icon-sm">
                  <XIcon />
                  <span className="sr-only">Dong</span>
                </Button>
              </DialogPrimitive.Close>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ten workspace *</label>
                <Input
                  value={createName}
                  onChange={(event) => setCreateName(event.target.value)}
                  placeholder="Vi du: Team Research"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug (tuy chon)</label>
                <Input
                  value={createSlug}
                  onChange={(event) => setCreateSlug(event.target.value)}
                  placeholder="team-research"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
                Huy
              </Button>
              <Button type="button" disabled={isPending} onClick={handleCreateWorkspace}>
                Tao workspace
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <DialogPrimitive.Root open={canRenameWorkspace && isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-popover text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
            <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
              <div className="flex flex-col gap-1">
                <DialogPrimitive.Title className="text-lg font-medium text-foreground">
                  Doi ten workspace
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-sm text-muted-foreground">
                  Cập nhật tên hoặc slug cho workspace đang chọn. Danh sách theo dõi được quản lý
                  bằng hành động riêng trong menu workspace.
                </DialogPrimitive.Description>
              </div>
              <DialogPrimitive.Close asChild>
                <Button type="button" variant="ghost" size="icon-sm">
                  <XIcon />
                  <span className="sr-only">Dong</span>
                </Button>
              </DialogPrimitive.Close>
            </div>

            <div className="flex flex-col gap-4 px-6 py-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ten workspace *</label>
                <Input
                  value={renameName}
                  onChange={(event) => setRenameName(event.target.value)}
                  placeholder="Vi du: Team Research"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug (tuy chon)</label>
                <Input
                  value={renameSlug}
                  onChange={(event) => setRenameSlug(event.target.value)}
                  placeholder="team-research"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
              <Button type="button" variant="ghost" onClick={() => setIsRenameOpen(false)}>
                Huy
              </Button>
              <Button
                type="button"
                disabled={isPending || !canRenameWorkspace || !activeWorkspace || activeWorkspace.personal}
                onClick={handleRenameWorkspace}
              >
                Luu thay doi
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

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
