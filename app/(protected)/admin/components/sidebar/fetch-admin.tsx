import supabaseAdmin from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { NavAdminUser } from "./nav-admin-user"

export async function FetchAdmin() {
  const supabase = await createClient()
  const { data: admin, error } = await supabase.auth.getUser()
  const { data: adminData, error: adminDataError } = await supabaseAdmin
    .from("administrators")
    .select("*")
    .eq("user_id", admin?.user?.id)
    .single()

  if (error || adminDataError) {
    throw new Error("Error fetching admin")
  }

  return <NavAdminUser adminData={adminData} />
}
