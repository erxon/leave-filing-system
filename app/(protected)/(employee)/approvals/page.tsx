import ApprovalsList from "./components/approvals"
import { ApprovalsCalendar } from "./components/approvals-calendar"
import { getApprovalsData } from "./components/approvals"
import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getEmployee } from "@/app/auth/actions"
import { ExportLeavesDialog } from "./components/export-leaves-dialog"

export default async function Approvals() {
  const employee = await getEmployee()

  if (!employee || employee.role !== 2) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-center">
          <p className="text-muted-foreground">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    )
  }

  const data = await getApprovalsData()

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-xl font-semibold">Leave Approvals</h2>
        <ExportLeavesDialog />
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Suspense fallback={<div>Loading list...</div>}>
            <ApprovalsList initialData={data} />
          </Suspense>
        </TabsContent>
        <TabsContent value="calendar">
          <Suspense fallback={<div>Loading calendar...</div>}>
            <ApprovalsCalendar data={data} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
