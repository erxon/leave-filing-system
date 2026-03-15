import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import LeaveFiling from "./leave-filing"
import { getData } from "./components/leave-history/ui/leave-history"
import FetchUser from "./components/profile/ui/fetch-user"
import { Suspense } from "react"

export default async function Page() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (!data || error) {
    redirect("/auth/login")
  }
  const leaveData = await getData()

  return (
    <div>
      <div className="mb-8">
        <Suspense fallback={<div>Loading...</div>}>
          <FetchUser />
        </Suspense>
      </div>
      <LeaveFiling data={leaveData} />
    </div>
  )
}
