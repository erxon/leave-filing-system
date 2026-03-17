"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function approveLeave(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("leaves")
    .update({ status: 2 })
    .eq("id", id)

  if (error) {
    console.error("Error approving leave:", error)
    return { error }
  }

  revalidatePath("/approvals")
  return { success: true }
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
