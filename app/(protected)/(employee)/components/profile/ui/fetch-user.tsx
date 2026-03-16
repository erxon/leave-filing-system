import { createClient } from "@/lib/supabase/server"
import ProfileCard from "./profile-card"

export default async function FetchUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const { data: employee } = await supabase
    .from("employee_profiles")
    .select("*")
    .eq("id", data.user?.id)
    .single()

  if (error) throw error

  return <ProfileCard employee={employee} />
}
