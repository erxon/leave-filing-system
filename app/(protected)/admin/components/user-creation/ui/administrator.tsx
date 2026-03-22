import Users from "./users/users"
import CreateUser from "./create-user"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Import } from "lucide-react"

export default function Administrator({
  administrator,
}: {
  administrator: {
    company_id: string
    user_id: string
  }
}) {
  return (
    <>
      <div className="px-8 py-4">
        <div className="mb-8 flex justify-between">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Manage Users</h2>
            <p className="text-sm text-muted-foreground">
              Create users or import them. Generate temporary passwords
            </p>
          </div>
          <Button>
            <Import />
            Import
          </Button>
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
