"use server"

import { createClient } from "@/lib/supabase/server"

export async function getLeaveStatus(status_id: string) {
  const supabase = await createClient()
  const { data: leaveStatus, error } = await supabase
    .from("status")
    .select("status_name")
    .eq("id", status_id)
    .single()

  if (error) {
    console.error("Error fetching leave status:", error)
    return ""
  }

  return leaveStatus.status_name
}
