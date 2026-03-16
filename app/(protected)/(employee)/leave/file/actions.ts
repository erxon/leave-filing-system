"use server"

import { createClient } from "@/lib/supabase/server"
import { getEmployee } from "@/app/auth/actions"

interface Leaves {
  leave_type: string
  dates: Date[] | undefined
  date_details: Record<string, { duration: string; reason: string }>
}

export async function fileMultipleLeaves(leaves: Leaves) {
  try {
    const supabase = await createClient()

    const employee = await getEmployee()

    const { data: leaveTypes, error: leaveTypesError } = await supabase
      .from("leave_types")
      .select("*")

    const leaveType = leaveTypes?.find((lt) => lt.code === leaves.leave_type)

    const leavesToInsert = []

    if (leaves.dates && leaves.dates.length > 0) {
      for (const date of leaves.dates) {
        const { data: existingLeave, error: existingLeaveError } =
          await supabase
            .from("leaves")
            .select("*")
            .eq("date", date.toISOString())
            .eq("employee_id", employee?.id)
            .single()

        if (existingLeave) {
          throw new Error(
            `Leave already filed for this date ${date.toDateString()}`
          )
        }

        leavesToInsert.push({
          employee_id: employee?.id,
          leave_type: leaveType?.id,
          status: 1,
          approving_manager_id: employee?.manager_id,
          reason: leaves.date_details[date.toISOString()].reason,
          duration: leaves.date_details[date.toISOString()].duration,
          date: date.toISOString(),
        })
      }
    }

    const { data, error } = await supabase.from("leaves").insert(leavesToInsert)

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, data: data, message: "Success" }
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
