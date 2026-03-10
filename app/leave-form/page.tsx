import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import LeaveFiling from "./leave-filing"
import { getData } from "./components/leave-history/ui/leave-history"

export default async function Page() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (!data || error) {
    redirect("/auth/login")
  }
  const leaveData = await getData()

  return (
    <div>
      <LeaveFiling data={leaveData} />
    </div>
  )
}
