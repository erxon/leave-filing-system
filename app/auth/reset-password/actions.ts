"use server"

import { createClient } from "@/lib/supabase/server"

export async function completePasswordReset() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user) return { error: "User not found" }

  const { data: employee } = await supabase
    .from("employee_profiles")
    .select("*")
    .eq("id", user.user?.id)
    .single()

  if (!employee) return { error: "Employee not found" }

  const { error: employeeUpdateError } = await supabase
    .from("employee_profiles")
    .update({
      is_password_reset: true,
    })
    .eq("id", user.user?.id)

  if (employeeUpdateError) return { error: employeeUpdateError.message }

  return { success: true }
}
