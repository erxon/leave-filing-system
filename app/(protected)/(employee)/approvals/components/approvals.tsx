import { columns, LeaveApprovalItem } from "./columns"
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
  employee_profiles: {
    first_name: string
    last_name: string
    avatar_url: string
  } | null
}

export async function getApprovalsData(
  startDate?: string,
  endDate?: string
): Promise<LeaveApprovalItem[]> {
  const supabase = await createClient()
  const employee = await getEmployee()

  let query = supabase
    .from("leaves")
    .select(
      `
      *,
      leave_types ( leave_type ),
      status ( status_name ),
      employee_profiles!leaves_employee_id_fkey ( first_name, last_name, avatar_url )
      `
    )
    .eq("approving_manager_id", employee.id)

  if (startDate) {
    query = query.gte("date", startDate)
  }
  if (endDate) {
    query = query.lte("date", endDate)
  }

  const { data: leaves, error } = await query
  

  if (error) {
    console.error("Error fetching approvals:", error)
    return []
  }

  const formattedLeaves: LeaveApprovalItem[] = (
    (leaves as unknown as LeaveWithDetails[]) || []
  ).map((leave) => ({
    id: leave.id,
    employee_id: leave.employee_id,
    employee_name: leave.employee_profiles
      ? `${leave.employee_profiles.first_name || ""} ${leave.employee_profiles.last_name || ""}`.trim()
      : "Unknown",
    avatar_url: leave.employee_profiles?.avatar_url || "",
    date: new Date(leave.date),
    duration: leave.duration,
    reason: leave.reason,
    type: leave.leave_types?.leave_type || "Unknown",
    status: leave.status?.status_name || "Unknown",
    remarks: leave.remarks,
  }))

  return formattedLeaves
}

interface ApprovalsListProps {
  initialData?: LeaveApprovalItem[]
}

export default async function ApprovalsList({
  initialData,
}: ApprovalsListProps) {
  const data = initialData || (await getApprovalsData())

  return (
    <div className="py-4">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
