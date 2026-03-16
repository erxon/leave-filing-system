import LeaveHistory from "../../components/leave-history/ui/leave-history"
import { getData } from "../../components/leave-history/ui/leave-history"

export default async function Page() {
  const leaveData = await getData()
  return <LeaveHistory data={leaveData} />
}
