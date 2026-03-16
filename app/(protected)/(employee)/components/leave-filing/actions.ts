"use server"

import { Leave } from "@/lib/types"
import { createClient } from "@/lib/supabase/server"
import { getEmployee, getUser } from "@/app/auth/actions"

export async function fileSingleLeave(leave: Leave) {
  try {
    const supabase = await createClient()

    const employee = await getEmployee()
    const { data: leaveTypes, error: leaveTypesError } = await supabase
      .from("leave_types")
      .select("*")

    const leaveType = leaveTypes?.find((lt) => lt.code === leave.leave_type)

    if (!leaveType) {
      throw new Error("Invalid leave type")
    }

    // Convert date to ISO
    const dateISO = leave.date.toISOString()

    // Check if the date is already in the database
    const { data: existingLeave, error: existingLeaveError } = await supabase
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
      reason: leave.reason,
      duration: leave.duration,
      date: dateISO,
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, data: data, message: "Success" }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}
