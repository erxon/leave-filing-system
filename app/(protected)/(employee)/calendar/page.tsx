import { getEmployee } from "@/app/auth/actions"
import { redirect } from "next/navigation"
import CustomCalendar, { ApprovedLeave } from "./components/custom-calendar"
import { addDays, subDays } from "date-fns"

export default async function CalendarPage() {
  const employee = await getEmployee()

  if (!employee) {
    redirect("/auth/login")
  }

  // --- Mock Data ---
  // When a real schema is added, this will be swapped for a Supabase
  // query filtering by employee's department/company_id & status = 'approved'.
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
      employeeName: employee.first_name + " " + employee.last_name, // Your own leave
      type: "Vacation Leave",
      duration: "full-day",
      startDate: addDays(new Date(), -1),
      endDate: addDays(new Date(), 3),
    },
  ]

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-7xl flex-col space-y-4 p-8 pt-6">
      <div className="flex flex-col justify-start">
        <h2 className="mb-2 text-xl font-bold tracking-tight">
          Department Calendar
        </h2>
        <p className="w-full text-sm text-muted-foreground">
          Plan projects, meetings, and assignments around approved teammate
          absences.
        </p>
      </div>
      <div className="relative min-h-[600px] w-full flex-1 pb-10">
        <CustomCalendar events={mockLeaves} />
      </div>
    </div>
  )
}
