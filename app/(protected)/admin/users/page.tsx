import { createClient } from "@/lib/supabase/server"
import Unauthorized from "@/components/unauthorized"
import { redirect } from "next/navigation"
import Administrator from "../components/user-creation/ui/administrator"

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: administrator, error: administratorError } = await supabase
    .from("administrators")
    .select("*")
    .eq("user_id", user?.id)
    .single()

  if (!administrator || administratorError) {
    return <Unauthorized />
  }

  return <Administrator administrator={administrator} />
}
