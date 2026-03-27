"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download, FileDown } from "lucide-react"
import { DatePicker } from "../../components/leave-filing/ui/date-picker"
import { getDepartmentEmployees, getLeavesForExport } from "../actions"
import { toast } from "sonner"
import { format } from "date-fns"

export function ExportLeavesDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState<{ id: string; first_name: string; last_name: string }[]>([])
  const [filters, setFilters] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    status: "all",
    employeeId: "all",
  })

  useEffect(() => {
    if (open) {
      getDepartmentEmployees().then(setEmployees)
    }
  }, [open])

  const handleExport = async () => {
    setLoading(true)
    try {
      const result = await getLeavesForExport(filters)
      if (!result.success || !result.data) {
        toast.error(result.message || "Failed to fetch data for export")
        return
      }

      if (result.data.length === 0) {
        toast.info("No records found for the selected filters")
        return
      }

      // Generate CSV
      const headers = ["Employee", "Date", "Leave Type", "Duration", "Status", "Reason"]
      const rows = result.data.map((leave: any) => [
        `"${leave.employee_profiles.first_name} ${leave.employee_profiles.last_name}"`,
        format(new Date(leave.date), "yyyy-MM-dd"),
        `"${leave.leave_types?.leave_type || "N/A"}"`,
        `"${leave.duration}"`,
        `"${leave.status?.status_name || "N/A"}"`,
        `"${(leave.reason || "").replace(/"/g, '""')}"`
      ])

      const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n")
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `leave_records_${format(new Date(), "yyyyMMdd")}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("CSV Exported successfully")
      setOpen(false)
    } catch (error) {
      console.error("Export error:", error)
      toast.error("An error occurred during export")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileDown className="h-4 w-4" />
          Export CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Leave Records</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <DatePicker 
                date={filters.startDate} 
                onChange={(date) => setFilters({ ...filters, startDate: date })} 
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <DatePicker 
                date={filters.endDate} 
                onChange={(date) => setFilters({ ...filters, endDate: date })} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={filters.status} 
              onValueChange={(val) => setFilters({ ...filters, status: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Employee</Label>
            <Select 
              value={filters.employeeId} 
              onValueChange={(val) => setFilters({ ...filters, employeeId: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleExport} disabled={loading} className="w-full gap-2">
            {loading ? "Exporting..." : <><Download className="h-4 w-4" /> Download CSV</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
