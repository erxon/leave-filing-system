"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { approveLeave, rejectLeave } from "../actions"
import { toast } from "sonner"

export type LeaveApprovalItem = {
  id: string
  employee_id: string
  employee_name: string
  date: Date
  duration: string
  reason: string
  type: string
  status: string
  remarks?: string | null
}

export const columns: ColumnDef<LeaveApprovalItem>[] = [
  {
    accessorKey: "id",
    header: "Request ID",
  },
  {
    accessorKey: "employee_name",
    header: "Employee",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return format(row.getValue("date"), "MMM d, yyyy")
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      return <span className="capitalize">{row.getValue("duration")}</span>
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      if (status === "approved") {
        return <Badge variant="default">{status}</Badge>
      } else if (status === "pending") {
        return <Badge variant="secondary">{status}</Badge>
      } else if (status === "rejected") {
        return <Badge variant="destructive">{status}</Badge>
      }
      return <Badge variant="outline">{status}</Badge>
    },
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => {
      return row.getValue("remarks") || "-"
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [rejectOpen, setRejectOpen] = useState(false)
      const [approveOpen, setApproveOpen] = useState(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setApproveOpen(true)}>
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRejectOpen(true)}>
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <RejectDialog
            id={row.original.id}
            open={rejectOpen}
            setOpen={setRejectOpen}
          />
          <ApproveDialog
            id={row.original.id}
            employee_id={row.original.employee_id}
            open={approveOpen}
            setOpen={setApproveOpen}
          />
        </>
      )
    },
  },
]

function ApproveDialog({
  employee_id,
  id,
  open,
  setOpen,
}: {
  employee_id: string
  id: string
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const result = await approveLeave(id, employee_id)

      if (!result.success) {
        toast.error("Something went wrong")
      } else {
        toast.success("Leave was approved")
        setOpen(false)
      }
    } catch (error: any) {
      toast.error(error.message)
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Leave</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this leave request?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSubmit}>
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RejectDialog({
  id,
  open,
  setOpen,
}: {
  id: string
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const [remarks, setRemarks] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)

    const result = await rejectLeave(id, remarks)

    if (result.error) {
      console.error("Error rejecting leave:", result.error)
      toast.error("Something went wrong")
    } else {
      toast.success("Leave was rejected")
      setOpen(false)
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Leave</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject this leave request?
          </DialogDescription>
        </DialogHeader>
        <div>
          <Textarea
            placeholder="Remarks"
            rows={4}
            className="resize-none"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSubmit}>
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
