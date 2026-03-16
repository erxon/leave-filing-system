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

  const recentRequests = [
    {
      id: "REQ-001",
      type: "Vacation Leave",
      date: "Oct 12 - Oct 15",
      status: "Approved",
    },
    { id: "REQ-002", type: "Sick Leave", date: "Oct 01", status: "Pending" },
    {
      id: "REQ-003",
      type: "Emergency Leave",
      date: "Sep 15",
      status: "Rejected",
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                {recentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "Approved"
                            ? "default"
                            : request.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {request.status}
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
