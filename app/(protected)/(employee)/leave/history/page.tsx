import LeaveHistory from "../../components/leave-history/ui/leave-history"
import { getData } from "../../components/leave-history/ui/leave-history"

export default async function Page() {
  const leaveData = await getData()

  return (
    <>
      <div className="flex flex-col justify-start">
        <h2 className="mb-2 text-xl font-bold tracking-tight">Leave History</h2>
        <p className="w-full text-sm text-muted-foreground">
          View your leave history and track your leave balance.
        </p>
      </div>
      <LeaveHistory data={leaveData} />
    </>
  )
}
