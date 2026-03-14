import { User } from "@supabase/supabase-js"
import Users from "./users/users"
import CreateUser from "./create-user"
import LogoutButton from "@/components/logout-button"
import { Suspense } from "react"

export default function Administrator({
  user,
  administrator,
}: {
  user: User
  administrator: {
    company_id: string
    user_id: string
  }
}) {
  return (
    <>
      <div className="px-8 py-16 lg:px-40">
        <div className="mb-4 flex items-center justify-between">
          <div className="mb-2">
            <p className="text-lg font-bold">Administrator</p>
            <p>{user.email}</p>
          </div>
          <LogoutButton />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
          <div className="w-full lg:col-span-2">
            <CreateUser company_id={administrator.company_id} />
          </div>
          <div className="w-full lg:col-span-4">
            <Suspense fallback={<div>Loading...</div>}>
              <Users company_id={administrator.company_id} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  )
}
