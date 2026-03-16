"use server"

import { createClient } from "@/lib/supabase/server"

export async function getUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return null
  }

  return data.user
}

export async function getEmployee() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return null
  }

  const { data: employee, error: employeeError } = await supabase
    .from("employee_profiles")
    .select("*")
    .eq("id", data.user.id)
    .single()

  if (employeeError || !employee) {
    return null
  }

  return employee
}
