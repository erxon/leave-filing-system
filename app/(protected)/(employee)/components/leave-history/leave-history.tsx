import { columns, LeaveHistoryItem } from "./columns"
import { DataTable } from "./data-table"
import { createClient } from "@/lib/supabase/server"
import { getEmployee } from "@/app/auth/actions"

interface LeaveWithDetails {
  id: string
  employee_id: string
  date: string
  duration: string
  reason: string
  remarks: string | null
  leave_types: { leave_type: string } | null
  status: { status_name: string } | null
}

export async function getData(): Promise<LeaveHistoryItem[]> {
  const supabase = await createClient()

  const employee = await getEmployee()

  const { data: leaves, error } = await supabase
    .from("leaves")
    .select(
      `
      *,
      leave_types ( leave_type ),
      status ( status_name ),
      employee_profiles!leaves_employee_id_fkey ( first_name, last_name )
      `
    )
    .eq("employee_id", employee.id)

  if (error) {
    return []
  }

  // Supabase returns nested objects for foregin keys and string for dates.
  // We need to map them to match LeaveHistoryItem.

  const formattedLeaves: LeaveHistoryItem[] = (
    (leaves as unknown as LeaveWithDetails[]) || []
  ).map((leave) => ({
    id: leave.id,
    employee_id: leave.employee_id,
    date: new Date(leave.date),
    duration: leave.duration,
    reason: leave.reason,
    type: leave.leave_types?.leave_type || "Unknown",
    status: leave.status?.status_name || "Unknown",
    remarks: leave.remarks,
  }))

  return formattedLeaves
}

interface LeaveHistoryProps {
  data: LeaveHistoryItem[]
}

export default function LeaveHistory({ data }: LeaveHistoryProps) {
  return (
    <div className="py-4">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
