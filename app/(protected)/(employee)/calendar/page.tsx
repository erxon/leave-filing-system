import { getEmployee } from "@/app/auth/actions"
import { redirect } from "next/navigation"
import DepartmentCalendar, { Holidays } from "./department-calendar"
import { DepartmentMembers } from "./components/department-members"
import { getDepartmentMembers } from "./actions"

export default async function CalendarPage() {
  const employee = await getEmployee()

  if (!employee) {
    redirect("/auth/login")
  }

  const departmentMembers = await getDepartmentMembers()

  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex flex-col justify-start">
        <h2 className="mb-2 text-xl font-bold tracking-tight">
          Department Calendar
        </h2>
        <p className="w-full text-sm text-muted-foreground">
          Plan projects, meetings, and assignments around approved teammate
          absences and company holidays.
        </p>
      </div>

      {/* Updated Layout: CSS Grid for Side-by-Side */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-cyan-100 p-2 text-xs dark:bg-cyan-900/30 dark:text-cyan-100">
            Approved Sick Leave
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-green-100 p-2 text-xs dark:bg-green-900/30 dark:text-green-100">
            Approved Vacation Leave
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-purple-100 p-2 text-xs dark:bg-purple-900/30 dark:text-purple-100">
            Holiday
          </div>
        </div>
      </div>

      <div className="grid min-h-[600px] flex-1 grid-cols-1 gap-6 pb-10 lg:grid-cols-4">
        <div className="h-full lg:col-span-3">
          <DepartmentCalendar />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1">
          <DepartmentMembers members={departmentMembers} />
          <Holidays />
        </div>
      </div>
    </div>
  )
}
