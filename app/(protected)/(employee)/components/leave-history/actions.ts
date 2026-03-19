"use server"

import { createClient } from "@/lib/supabase/server"
import { getEmployee } from "@/app/auth/actions"
import { revalidatePath } from "next/cache"

export async function recallLeaveRequest(leaveId: string) {
  try {
    const employee = await getEmployee()

    if (!employee) {
      throw new Error("Employee not found")
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from("leaves")
      .update({ status: 4 })
      .eq("employee_id", employee.id)
      .eq("id", leaveId)

    if (error) {
      throw error
    }

    revalidatePath("/leave/history")
    return { success: true }
  } catch (error) {
    console.error("Error recalling leave request:", error)
    return { success: false, message: "Failed to recall leave request" }
  }
}
