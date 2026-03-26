import QuickLeave from "../components/leave-filing/ui/quick-leave"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import RemainingLeaves from "../components/cards/remaining-leaves"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getEmployee } from "@/app/auth/actions"
import {
  getApprovedLeaveRequests,
  fetchHolidaysAction,
} from "../calendar/actions"
import { DashboardCalendar } from "./components/dashboard-calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HolidayEvent, Leave } from "../calendar/components/custom-calendar"

export default async function Page() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const employee = await getEmployee()

  if (error || !data.user || !employee) {
    redirect("/auth/login")
  }

  // Fetch recent queries
  const { data: recentRequests } = await supabase
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
    .limit(5)
    .order("created_at", { ascending: false })

  // Fetch company and department details
  const { data: profileDetails } = await supabase
    .from("employee_profiles")
    .select(
      "department_id: departments(name), company_id: company(name, description, logo)"
    )
    .eq("id", employee.id)
    .single()

  // Fetch leaves & holidays for calendar widget
  const approvedLeaves = await getApprovedLeaveRequests()
  const holidays = await fetchHolidaysAction()

  // Resolve object details gracefully if any tables don't exist yet
  const departmentName = (profileDetails?.department_id as { name: string } | undefined)?.name || "N/A"
  const companyLogo = (profileDetails?.company_id as { logo: string } | undefined)?.logo
  const companyName = (profileDetails?.company_id as { name: string } | undefined)?.name || "N/A"

  interface JoinedLeave {
    id: string
    date: string
    duration: "full-day" | "half-day"
    employee_profiles: { first_name: string; last_name: string } | null
    leave_type: { leave_type: string } | null
    status: { status_name: string } | null
  }

  // Format leaves for the calendar widget
  const formattedLeaves = (approvedLeaves as unknown as JoinedLeave[]).map((leave) => ({
    id: leave.id,
    employeeName:
      leave.employee_profiles?.first_name +
      " " +
      leave.employee_profiles?.last_name,
    type: leave.leave_type?.leave_type || "Leave",
    duration: leave.duration,
    startDate: new Date(leave.date),
    endDate: new Date(leave.date),
    status: leave.status?.status_name || "approved",
  }))

  const formattedHolidays = holidays.map((holiday) => ({
    id: holiday.name + holiday.date,
    name: holiday.name,
    date: new Date(holiday.date),
  }))

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Hi, {employee.first_name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Employee ID {employee.employee_id}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <QuickLeave />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="truncate text-2xl font-bold">{departmentName}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={companyLogo} />
              <AvatarFallback>{companyName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="truncate text-2xl font-bold">{companyName}</div>
          </CardContent>
        </Card>
        <RemainingLeaves />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Leave Requests</CardTitle>
              <CardDescription>
                A summary of your recently filed leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRequests?.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.id}
                      </TableCell>
                      <TableCell>{request.leave_types?.leave_type}</TableCell>
                      <TableCell>
                        {new Date(request.date).toISOString().split("T")[0]}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status.status_name === "approved"
                              ? "default"
                              : request.status.status_name === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {request.status.status_name}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!recentRequests?.length && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No recent requests.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <DashboardCalendar
            leaves={formattedLeaves as Leave[]}
            holidays={formattedHolidays as HolidayEvent[]}
          />
        </div>
      </div>
    </div>
  )
}

