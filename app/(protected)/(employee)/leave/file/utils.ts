"use server"

import { createClient } from "@/lib/supabase/server"
import { getEmployee } from "@/app/auth/actions"

export type ConflictResponse = {
  is_conflicting: boolean
  current_count: number
  max_allowed: number
  status: "green" | "yellow" | "red" | "none"
  message: string
}

export const checkConflicts = async (
  isoDate: string
): Promise<ConflictResponse> => {
  const supabase = await createClient()
  const employee = await getEmployee()

  if (!employee) {
    return {
      is_conflicting: false,
      current_count: 0,
      max_allowed: 0,
      status: "none",
      message: "Unauthorized",
    }
  }

  const { data: existingLeave, error: existingError } = await supabase
    .from("leaves")
    .select("status")
    .eq("date", isoDate)
    .eq("employee_id", employee.id)
    .in("status", [1, 2])
    .maybeSingle()

  if (existingError) {
    console.error("Failed to check existing leaves:", existingError)
  }

  if (existingLeave) {
    const statusText = existingLeave.status === 1 ? "pending" : "approved"
    return {
      is_conflicting: true,
      current_count: 0,
      max_allowed: 0,
      status: "red",
      message: `You already have a ${statusText} leave on this date. Contact your manager.`,
    }
  }

  const { data, error } = await supabase.rpc(
    "check_department_leave_conflict",
    {
      p_department_id: employee.department_id,
      p_requested_date: isoDate,
      p_pending_status_id: 1,
      p_approved_status_id: 2,
    }
  )

  if (error || !data || data.length === 0) {
    console.error("Conflict check failed:", error)
    return {
      is_conflicting: false,
      current_count: 0,
      max_allowed: 0,
      status: "none",
      message: "Failed to check conflicts.",
    }
  }

  const { current_count, max_allowed, is_conflicting } = data[0]

  if (is_conflicting) {
    return {
      is_conflicting,
      current_count,
      max_allowed,
      status: "red",
      message: `Limit reached: ${max_allowed} people are already off on this date. Contact your manager.`,
    }
  } else if (current_count + 1 === max_allowed) {
    return {
      is_conflicting,
      current_count,
      max_allowed,
      status: "yellow",
      message:
        "Warning: You are the last person allowed for this date. Contact your manager.",
    }
  } else {
    return {
      is_conflicting,
      current_count,
      max_allowed,
      status: "green",
      message: `Available: ${current_count} out of ${max_allowed} people are off.`,
    }
  }
}
