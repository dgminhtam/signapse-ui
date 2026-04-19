"use client"

import { CronjobListResponse } from "@/app/lib/cronjobs/definitions"
import { Page } from "@/app/lib/definitions"
import { AppPaginationControls } from "@/components/app-pagination-controls"
import { useHasPermission } from "@/components/permission-provider"
import { SortSelect } from "@/components/sort-select"
import { CronjobSearch } from "./cronjob-search"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  Edit2,
  Plus,
  Trash2,
  FileClock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import {
  deleteCronjob,
  startCronjob,
  pauseCronjob,
  resumeCronjob,
} from "@/app/api/cronjobs/action"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
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
import { Spinner } from "@/components/ui/spinner"

interface CronjobListProps {
  cronjobPage: Page<CronjobListResponse>
}

function getStatusBadge(status: string | undefined) {
  const statusValue = status || "SCHEDULED"
  switch (statusValue) {
    case "RUNNING":
      return (
        <Badge
          variant="default"
          className="gap-1 bg-green-500/10 text-green-700 dark:text-green-400"
        >
          <Play className="h-3 w-3" /> Running
        </Badge>
      )
    case "PAUSED":
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
        >
          <Pause className="h-3 w-3" /> Paused
        </Badge>
      )
    case "COMPLETE":
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-blue-500/10 text-blue-700 dark:text-blue-400"
        >
          <CheckCircle className="h-3 w-3" /> Completed
        </Badge>
      )
    case "SCHEDULED":
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-gray-500/10 text-gray-700 dark:text-gray-400"
        >
          <Clock className="h-3 w-3" /> Scheduled
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary" className="gap-1">
          {status}
        </Badge>
      )
  }
}

export function CronjobListPage({ cronjobPage }: CronjobListProps) {
  const cronjobs = cronjobPage.content
  const canCreateCronjob = useHasPermission("cronjob:create")
  const canUpdateCronjob = useHasPermission("cronjob:update")
  const canDeleteCronjob = useHasPermission("cronjob:delete")

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
          {canCreateCronjob ? (
            <Button asChild>
              <Link href="/cronjobs/create">
                <Plus data-icon="inline-start" /> Create new cronjob
              </Link>
            </Button>
          ) : null}
          <CronjobSearch />
        </div>
        <div className="flex items-center gap-2">
          <SortSelect
            options={[
              { label: "Latest", value: "id_desc" },
              { label: "Oldest", value: "id_asc" },
              { label: "Name (A-Z)", value: "jobName_asc" },
              { label: "Name (Z-A)", value: "jobName_desc" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Card className="overflow-hidden border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-semibold text-foreground">
                  Job Name
                </TableHead>
                <TableHead className="text-center font-semibold text-foreground">
                  Group
                </TableHead>
                <TableHead className="text-center font-semibold text-foreground">
                  Status
                </TableHead>
                <TableHead className="text-center font-semibold text-foreground">
                  Cron Expression
                </TableHead>
                <TableHead className="text-center font-semibold text-foreground">
                  Next Execution
                </TableHead>
                <TableHead className="text-center font-semibold text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cronjobs.length > 0 ? (
                cronjobs.map((cronjob) => (
                  <TableRow
                    key={cronjob.id}
                    className="border-border transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium text-foreground">
                      <Link href={`/cronjobs/${cronjob.id}`}>
                        {cronjob.jobName}
                      </Link>
                      {cronjob.description && (
                        <>
                          <br />
                          <span className="block max-w-[250px] truncate text-xs text-muted-foreground">
                            {cronjob.description}
                          </span>
                        </>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {cronjob.jobGroup}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(cronjob.jobStatus)}
                    </TableCell>
                    <TableCell className="text-center font-mono text-sm text-muted-foreground">
                      {cronjob.cronExpression}
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {cronjob.nextTriggeredTime
                        ? format(
                            new Date(cronjob.nextTriggeredTime),
                            "dd/MM/yyyy HH:mm"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <StatusActions
                          id={cronjob.id}
                          status={cronjob.jobStatus}
                        />
                        {canUpdateCronjob ? (
                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground"
                            title="Edit"
                          >
                            <Link href={`/cronjobs/${cronjob.id}`}>
                              <Edit2 />
                            </Link>
                          </Button>
                        ) : null}
                        {canDeleteCronjob ? <DeleteCronjobButton id={cronjob.id} /> : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <FileClock />
                        </EmptyMedia>
                        <EmptyTitle>No cronjobs found</EmptyTitle>
                        <EmptyDescription>
                          Create your first cronjob to get started.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <AppPaginationControls page={cronjobPage} className="mt-4" />
    </div>
  )
}

function StatusActions({ id, status }: { id: number; status: string }) {
  const canStartCronjob = useHasPermission("cronjob:start")
  const canPauseCronjob = useHasPermission("cronjob:pause")
  const canResumeCronjob = useHasPermission("cronjob:resume")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleStart = () => {
    startTransition(async () => {
      const result = await startCronjob(id)
      if (result.success) {
        toast.success("Cronjob started successfully")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to start cronjob")
      }
    })
  }

  const handlePause = () => {
    startTransition(async () => {
      const result = await pauseCronjob(id)
      if (result.success) {
        toast.success("Cronjob paused successfully")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to pause cronjob")
      }
    })
  }

  const handleResume = () => {
    startTransition(async () => {
      const result = await resumeCronjob(id)
      if (result.success) {
        toast.success("Cronjob resumed successfully")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to resume cronjob")
      }
    })
  }

  const statusValue = status || "SCHEDULED"

  return (
    <>
      {(statusValue === "SCHEDULED" || statusValue === "COMPLETE") && (
        <div className="flex items-center gap-1">
          {canStartCronjob ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-600 hover:bg-green-500/10 hover:text-green-700"
              title="Start"
              disabled={isPending}
              onClick={handleStart}
            >
              {isPending ? <Spinner className="size-4" /> : <Play className="h-4 w-4" />}
            </Button>
          ) : null}
          {canPauseCronjob ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-yellow-600 hover:bg-yellow-500/10 hover:text-yellow-700"
              title="Pause"
              disabled={isPending}
              onClick={handlePause}
            >
              {isPending ? <Spinner className="size-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          ) : null}
        </div>
      )}
      {(statusValue === "PAUSED" && canResumeCronjob) ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-600 hover:bg-blue-500/10 hover:text-blue-700"
          title="Resume"
          disabled={isPending}
          onClick={handleResume}
        >
          {isPending ? (
            <Spinner className="size-4" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
        </Button>
      ) : null}
    </>
  )
}

function DeleteCronjobButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteCronjob(id)
      if (result.success) {
        toast.success("Cronjob deleted successfully")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete cronjob")
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          title="Delete"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            cronjob from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
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
