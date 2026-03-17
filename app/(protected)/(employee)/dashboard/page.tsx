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

export default async function Page() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const employee = await getEmployee()

  if (error || !data.user) {
    redirect("/auth/login")
  }

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <RemainingLeaves />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
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
                    <TableCell className="font-medium">{request.id}</TableCell>
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
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
