"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function approveLeave(id: string, employee_id: string) {
  try {
    const supabase = await createClient()
    const { data: leave, error } = await supabase
      .from("leaves")
      .update({ status: 2 })
      .eq("id", id)
      .select()
      .single()

    const { data: remainingLeaves, error: remainingLeavesError } =
      await supabase
        .from("remaining_leaves")
        .select("*")
        .eq("employee_id", employee_id)
        .eq("leave_type", leave.leave_type)
        .single()

    if (remainingLeaves.remaining_leaves === 0) {
      throw new Error(
        "Can't proceed approving the leave, employee has no remaining leaves"
      )
    }

    const deduction = leave.duration === "full-day" ? 1 : 0.5

    const { error: updateRemainingLeavesError } = await supabase
      .from("remaining_leaves")
      .update({
        remaining_leaves: remainingLeaves.remaining_leaves - deduction,
      })
      .eq("employee_id", employee_id)
      .eq("leave_type", leave.leave_type)

    if (error) {
      throw new Error("Error approving leave")
    }

    if (remainingLeavesError) {
      throw new Error("Error fetching remaining leaves")
    }

    if (updateRemainingLeavesError) {
      throw new Error("Error updating remaining leaves")
    }

    revalidatePath("/approvals")
    return { success: true }
  } catch (error) {
    console.error("Error approving leave:", error)
    return { success: false }
  }
}

export async function rejectLeave(id: string, remarks: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("leaves")
    .update({ status: 3, remarks })
    .eq("id", id)

  if (error) {
    console.error("Error rejecting leave:", error)
    return { error }
  }

  revalidatePath("/approvals")
  return { success: true }
}
