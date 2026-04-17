"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  Edit2,
  ExternalLink,
  Globe,
  Newspaper,
  Plus,
  Rss,
  Trash2,
} from "lucide-react"

import { deleteSource, toggleSourceActive } from "@/app/api/sources/action"
import { Page } from "@/app/lib/definitions"
import { SourceListResponse } from "@/app/lib/sources/definitions"
import { AppPagination } from "@/components/app-pagination"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { useHasPermission } from "@/components/permission-provider"
import { SortSelect } from "@/components/sort-select"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

import { SourceSearch } from "./source-search"

interface SourceListProps {
  sourcePage: Page<SourceListResponse>
}

export function SourceListPage({ sourcePage }: SourceListProps) {
  const sources = sourcePage?.content || []
  const canCreateSource = useHasPermission("source:create")
  const canUpdateSource = useHasPermission("source:update")
  const canDeleteSource = useHasPermission("source:delete")

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
          {canCreateSource ? (
            <Button asChild>
              <Link href="/sources/create">
                <Plus data-icon="inline-start" /> Add source
              </Link>
            </Button>
          ) : null}
          <SourceSearch />
        </div>
        <div className="flex items-center gap-2">
          <SortSelect
            options={[
              { label: "Latest", value: "id_desc" },
              { label: "Oldest", value: "id_asc" },
              { label: "Name (A-Z)", value: "name_asc" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground">Source Name</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Status</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Created Date</TableHead>
                <TableHead className="text-center font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.length > 0 ? (
                sources.map((source) => (
                  <TableRow key={source.id} className="border-border transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">
                      <div className="flex flex-col">
                        <Link href={`/sources/${source.id}`} className="flex items-center gap-1.5 hover:underline">
                          {source.name}
                        </Link>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                        >
                          <Globe className="h-3 w-3" /> Website: {source.url}{" "}
                          <ExternalLink className="h-2 w-2" />
                        </a>
                        {source.rssUrl ? (
                          <a
                            href={source.rssUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                          >
                            <Rss className="h-3 w-3" /> RSS: {source.rssUrl}{" "}
                            <ExternalLink className="h-2 w-2" />
                          </a>
                        ) : (
                          <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <Rss className="h-3 w-3" /> RSS: -
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <ToggleActiveSwitch
                          id={source.id}
                          active={source.active}
                          canUpdate={canUpdateSource}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                      {format(new Date(source.createdDate), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {canUpdateSource ? (
                          <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Link href={`/sources/${source.id}`}>
                              <Edit2 className="h-4 w-4" />
                            </Link>
                          </Button>
                        ) : null}
                        {canDeleteSource ? (
                          <DeleteSourceButton id={source.id} name={source.name} />
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-24 text-center">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon"><Newspaper /></EmptyMedia>
                        <EmptyTitle>No sources found</EmptyTitle>
                        <EmptyDescription>Add your first source to start collecting articles.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="my-4 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <AppSelectPageSize />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {(sourcePage?.number ?? 0) + 1} of {sourcePage?.totalPages ?? 0} ({sourcePage?.totalElements ?? 0} sources)
          </span>
        </div>
        <div className="flex gap-2">
          <AppPagination
            totalElements={sourcePage?.totalElements ?? 0}
            itemsPerPage={sourcePage?.size ?? 12}
          />
        </div>
      </div>
    </div>
  )
}

function ToggleActiveSwitch({
  id,
  active,
  canUpdate,
}: {
  id: number
  active: boolean
  canUpdate: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleSourceActive(id)
      if (result.success) {
        toast.success(`Source ${active ? "disabled" : "enabled"} successfully`)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={active}
        onCheckedChange={handleToggle}
        disabled={isPending || !canUpdate}
      />
      {isPending && <Spinner className="size-3" />}
    </div>
  )
}

function DeleteSourceButton({ id, name }: { id: number; name: string }) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSource(id)
      if (result.success) {
        toast.success(`Source "${name}" deleted successfully`)
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the source <strong>{name}</strong> and potentially affect associated articles.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => { e.preventDefault(); handleDelete() }}
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
