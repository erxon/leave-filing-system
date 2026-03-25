"use server"

import { createClient } from "@/lib/supabase/server"
import { getNationalHolidays } from "@/lib/google-calendar"

export async function getApprovedLeaveRequests() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    const { data: employee, error: employeeFetchError } = await supabase
      .from("employee_profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!employee && employeeFetchError) {
      throw new Error("Failed to fetch employee profile", {
        cause: employeeFetchError,
      })
    }

    const { data: leaves, error: leavesFetchError } = await supabase
      .from("leaves")
      .select(
        `*,
        status: status(status_name),
        leave_type: leave_types(leave_type),
        employee_profiles!leaves_employee_id_fkey (
          first_name,
          last_name,
          avatar_url
        )`
      )
      .eq("status", 2)
      .eq("department_id", employee.department_id)

    if (leavesFetchError) {
      console.log(leavesFetchError)
      throw new Error("Failed to fetch approved leave requests", {
        cause: leavesFetchError,
      })
    }

    return leaves
  } catch (error) {
    console.error("Error fetching approved leave requests:", error)
    return []
  }
}

export async function fetchHolidaysAction() {
  const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY

  if (!API_KEY) throw new Error("Missing API Key")

  const holidays = await getNationalHolidays(API_KEY, 2026)
  return holidays
}
