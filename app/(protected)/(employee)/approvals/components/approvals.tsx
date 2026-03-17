import { columns, LeaveApprovalItem } from "./columns"
import { DataTable } from "./data-table"
import { createClient } from "@/lib/supabase/server"
import { getEmployee } from "@/app/auth/actions"

export async function getApprovalsData(): Promise<LeaveApprovalItem[]> {
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
    .eq("approving_manager_id", employee.id)

  if (error) {
    console.error("Error fetching approvals:", error)
    return []
  }

  const formattedLeaves: LeaveApprovalItem[] = (leaves || []).map(
    (leave: any) => ({
      id: leave.id,
      employee_id: leave.employee_id,
      employee_name: leave.employee_profiles
        ? `${leave.employee_profiles.first_name || ""} ${leave.employee_profiles.last_name || ""}`.trim()
        : "Unknown",
      date: new Date(leave.date),
      duration: leave.duration,
      reason: leave.reason,
      type: leave.leave_types?.leave_type || "Unknown",
      status: leave.status?.status_name || "Unknown",
      remarks: leave.remarks,
    })
  )

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
