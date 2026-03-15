import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { IconArrowBack } from "@tabler/icons-react"
import Unauthorized from "@/components/unauthorized"
import { redirect } from "next/navigation"

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: approvingManager, error: approvingManagerError } =
    await supabase
      .from("approving_managers")
      .select("*")
      .eq("id", user?.id)
      .single()

  const { data: administrator, error: administratorError } = await supabase
    .from("administrators")
    .select("*")
    .eq("id", user?.id)
    .single()

  if (
    !approvingManager ||
    !administrator ||
    approvingManagerError ||
    administratorError
  ) {
    return <Unauthorized />
  }

  return <div>Manage</div>
}
