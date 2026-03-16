import { getEmployee } from "@/app/auth/actions"
import { ProfileForm } from "./components/profile-form"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const employee = await getEmployee()

  if (!employee) {
    redirect("/auth/login")
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-xl font-bold tracking-tight">Profile</h2>
      </div>

      <ProfileForm employee={employee} />
    </div>
  )
}
