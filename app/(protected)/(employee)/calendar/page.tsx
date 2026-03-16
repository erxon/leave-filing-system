import { getEmployee } from "@/app/auth/actions"
import { redirect } from "next/navigation"
import CustomCalendar, {
  ApprovedLeave,
  HolidayEvent,
} from "./components/custom-calendar"
import { HolidayCard } from "./components/holiday-card"
import { addDays, subDays, startOfMonth, addMonths, setDate } from "date-fns"

export default async function CalendarPage() {
  const employee = await getEmployee()

  if (!employee) {
    redirect("/auth/login")
  }

  // --- Mock Data ---
  const currentMonthStart = startOfMonth(new Date())

  const mockLeaves: ApprovedLeave[] = [
    {
      id: "leave-1",
      employeeName: "Alice Smith",
      type: "Vacation Leave",
      duration: "full-day",
      startDate: new Date(),
      endDate: addDays(new Date(), 2),
    },
    {
      id: "leave-2",
      employeeName: "Bob Johnson",
      type: "Sick Leave",
      duration: "half-day",
      startDate: subDays(new Date(), 5),
      endDate: subDays(new Date(), 4),
    },
    {
      id: "leave-3",
      employeeName: "Charlie Brown",
      type: "Vacation Leave",
      duration: "full-day",
      startDate: addDays(new Date(), 10),
      endDate: addDays(new Date(), 14),
    },
    {
      id: "leave-4",
      employeeName: employee.first_name + " " + employee.last_name,
      type: "Vacation Leave",
      duration: "full-day",
      startDate: addDays(new Date(), -1),
      endDate: addDays(new Date(), 3),
    },
  ]

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
    <div className="mx-auto flex h-[calc(100vh-4rem)] w-full flex-col space-y-4 p-8 pt-6">
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
      <div className="grid min-h-[600px] flex-1 grid-cols-1 gap-6 pb-10 lg:grid-cols-4">
        {/* Main Calendar takes up 3 columns */}
        <div className="h-full lg:col-span-3">
          <CustomCalendar events={mockLeaves} holidays={mockHolidays} />
        </div>

        {/* Holiday Card takes up 1 column */}
        <div className="h-full lg:col-span-1">
          <HolidayCard holidays={mockHolidays} />
        </div>
      </div>
    </div>
  )
}
