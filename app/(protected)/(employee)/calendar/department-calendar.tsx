import { getApprovedLeaveRequests, fetchHolidaysAction } from "./actions"
import CustomCalendar from "./components/custom-calendar"
import { HolidayCard } from "./components/holiday-card"

export default async function DepartmentCalendar() {
  const leaves = await getApprovedLeaveRequests()
  const holidays = await fetchHolidaysAction()

  const formattedLeaves = leaves.map((leave) => ({
    id: leave.id,
    employeeName:
      leave.employee_profiles.first_name +
      " " +
      leave.employee_profiles.last_name,
    avatar_url: leave.employee_profiles.avatar_url,
    type: leave.leave_type.leave_type,
    duration: leave.duration,
    startDate: new Date(leave.date),
    endDate: new Date(leave.date),
    status: leave.status.status_name,
  }))

  const formattedHolidays = holidays.map((holiday) => ({
    id: holiday.name + holiday.date,
    name: holiday.name,
    date: new Date(holiday.date),
  }))

  return (
    <div>
      <CustomCalendar events={formattedLeaves} holidays={formattedHolidays} />
    </div>
  )
}

export async function Holidays() {
  const holidays = await fetchHolidaysAction()

  const formattedHolidays = holidays.map((holiday) => ({
    id: holiday.name + holiday.date,
    name: holiday.name,
    date: new Date(holiday.date),
  }))

  return <HolidayCard holidays={formattedHolidays} />
}
