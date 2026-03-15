"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { EmployeeProfile } from "@/lib/types"

export default function ProfileCard({
  employee,
}: {
  employee: EmployeeProfile
}) {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }
  return (
    <div className="flex w-full items-center justify-between gap-4 border p-2 md:w-80">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>
            {employee.first_name.charAt(0) + employee.last_name.charAt(0)}
          </AvatarFallback>
          <AvatarImage src={""} />
        </Avatar>
        <div>
          <p className="lg:text-md text-sm font-medium">
            {employee.first_name + " " + employee.last_name}
          </p>
          <p className="text-xs md:text-sm">{employee.employee_id}</p>
        </div>
      </div>
      <Button size={"sm"} variant={"ghost"}>
        Logout
      </Button>
    </div>
  )
}
