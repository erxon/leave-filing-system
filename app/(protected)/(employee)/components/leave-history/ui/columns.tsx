"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export type LeaveHistoryItem = {
  id: string
  type: "Sick Leave" | "Vacation Leave" | "Emergency Leave" | "Maternity Leave" | "Paternity Leave"
  date: Date
  duration: "full-day" | "half-day"
  reason: string
  status: "Pending" | "Approved" | "Rejected"
}

export const columns: ColumnDef<LeaveHistoryItem>[] = [
  {
    accessorKey: "id",
    header: "Request ID",
  },
  {
    accessorKey: "type",
    header: "Leave Type",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return format(row.getValue("date"), "MMM d, yyyy")
    }
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      return <span className="capitalize">{row.getValue("duration")}</span>
    }
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status")
      let variant: "default" | "secondary" | "destructive" = "secondary"
      
      if (status === "Approved") variant = "default"
      if (status === "Rejected") variant = "destructive"

      return <Badge variant={variant}>{status}</Badge>
    }
  },
]