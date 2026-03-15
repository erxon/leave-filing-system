"use client"

import { Button } from "./ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  return (
    <Button
      onClick={async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/auth/admin/login")
      }}
      variant={"outline"}
    >
      Logout
    </Button>
  )
}
