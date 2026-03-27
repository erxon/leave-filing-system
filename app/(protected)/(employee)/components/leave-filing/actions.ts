"use server"

import { Leave } from "@/lib/types"
import { createClient } from "@/lib/supabase/server"
import { getEmployee } from "@/app/auth/actions"
import { checkConflicts } from "@/app/(protected)/(employee)/leave/file/utils"

export async function fileSingleLeave(leave: Leave) {
  try {
    const supabase = await createClient()

    const employee = await getEmployee()

    const { data: leaveTypes } = await supabase.from("leave_types").select("*")

    const leaveType = leaveTypes?.find((lt) => lt.code === leave.leave_type)

    const { data: remainingLeaves } = await supabase
      .from("remaining_leaves")
      .select("*")
      .eq("employee_id", employee?.id)
      .eq(
        "leave_type",
        leaveTypes?.find((lt) => lt.code === leave.leave_type)?.id
      )
      .single()

    if (!leaveType) {
      throw new Error("Invalid leave type")
    }

    if (remainingLeaves.remaining_leaves === 0) {
      throw new Error(
        `Can't proceed filing the leave, employee has no remaining ${leaveType.leave_type}`
      )
    }

    // Convert date to ISO
    const dateISO = leave.date.toISOString()

    // Check if the date is already in the database
    const { data: existingLeave } = await supabase
      .from("leaves")
      .select("*")
      .eq("date", dateISO)
      .eq("employee_id", employee?.id)
      .single()

    if (existingLeave) {
      throw new Error("Leave already filed for this date")
    }

    const { data, error } = await supabase.from("leaves").insert({
      employee_id: employee?.id,
      leave_type: leaveType.id,
      status: 1,
      approving_manager_id: employee?.manager_id,
      department_id: employee.department_id,
      reason: leave.reason,
      duration: leave.duration,
      date: dateISO,
    })

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
