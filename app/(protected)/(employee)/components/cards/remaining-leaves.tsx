import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, HeartPulse, Activity, LucideIcon } from "lucide-react"
import { getEmployee } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"

interface RemainingLeaves {
  id: string
  employee_id: string
  remaining_leaves: number
  leave_type: string
  color: string
  icon: LucideIcon
}

export default async function RemainingLeaves() {
  const employee = await getEmployee()
  const supabase = await createClient()

  const { data: remainingLeaves } = await supabase
    .from("remaining_leaves")
    .select(
      `
      *,
      leave_type ( leave_type )
      `
    )
    .eq("employee_id", employee.id)

  const formattedRemainingLeaves: RemainingLeaves[] = (
    remainingLeaves || []
  ).map((leave) => ({
    id: leave.id,
    employee_id: leave.employee_id,
    remaining_leaves: leave.remaining_leaves,
    leave_type: leave.leave_type?.leave_type || "Unknown",
    color:
      leave.leave_type?.leave_type === "vacation leave"
        ? "text-blue-500"
        : leave.leave_type?.leave_type === "sick leave"
          ? "text-red-500"
          : "text-green-500",
    icon:
      leave.leave_type?.leave_type === "vacation leave"
        ? CalendarDays
        : leave.leave_type?.leave_type === "sick leave"
          ? HeartPulse
          : Activity,
  }))

  return (
    <>
      {formattedRemainingLeaves?.map((leave) => (
        <Card key={leave.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium">
              {leave.leave_type.toUpperCase()}
            </CardTitle>
            <leave.icon className={`h-4 w-4 ${leave.color}`} />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                leave.remaining_leaves === 0 && "text-red-500"
              }`}
            >
              {leave.remaining_leaves} Days
            </div>
            <p className="text-xs text-muted-foreground">
              Remaining leave balance
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
