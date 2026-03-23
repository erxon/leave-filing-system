import { createClient } from "@/lib/supabase/server"
import ResetPasswordForm from "./reset-password-form"
import { redirect } from "next/navigation"

export default async function Page() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: employee } = await supabase
    .from("employee_profiles")
    .select("*")
    .eq("id", user.user?.id)
    .single()

  if (!employee) redirect("/auth/login")

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm
          employeeId={employee.employee_id}
          name={`${employee.first_name} ${employee.last_name}`}
        />
      </div>
    </div>
  )
}
