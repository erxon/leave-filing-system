import { createClient } from "@/lib/supabase/server"
import { NavUser } from "./nav-user"

export default async function FetchUser() {
  const supabase = await createClient()

  const { data: user, error } = await supabase.auth.getUser()

  if (error) throw error

  return (
    <NavUser
      user={{
        email: user.user?.email ?? "",
        name: "Administrator",
        avatar: "",
      }}
    />
  )
}
