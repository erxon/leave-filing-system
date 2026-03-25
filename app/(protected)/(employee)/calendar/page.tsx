import { getEmployee } from "@/app/auth/actions"
import { redirect } from "next/navigation"
import { HolidayCard } from "./components/holiday-card"
import { addDays, subDays, startOfMonth, addMonths, setDate } from "date-fns"
import DepartmentCalendar, { Holidays } from "./department-calendar"
import { HolidayEvent } from "./components/custom-calendar"

export default async function CalendarPage() {
  const employee = await getEmployee()

  if (!employee) {
    redirect("/auth/login")
  }

  // --- Mock Data ---
  const currentMonthStart = startOfMonth(new Date())

  const mockHolidays: HolidayEvent[] = [
    {
      id: "h1",
      name: "Company Townhall (Half Day)",
      date: setDate(currentMonthStart, 15), // 15th of current month
    },
    {
      id: "h2",
      name: "Regional Public Holiday",
      date: setDate(currentMonthStart, 25), // 25th of current month
    },
    {
      id: "h3",
      name: "Upcoming Developer Summit",
      date: setDate(addMonths(currentMonthStart, 1), 5), // 5th of next month
    },
  ]

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] w-full flex-col space-y-4">
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
          <div className="rounded-lg bg-yellow-100 p-2 text-xs dark:bg-yellow-900/30 dark:text-yellow-100">
            Pending Leave
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="rounded-lg bg-red-100 p-2 text-xs dark:bg-red-900/30 dark:text-red-100">
            Rejected Leave
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
        <div className="h-full lg:col-span-1">
          <Holidays />
        </div>
      </div>
    </div>
  )
}
