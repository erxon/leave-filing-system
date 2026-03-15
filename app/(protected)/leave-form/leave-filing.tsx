"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import LeaveFilingForm from "./components/leave-filing/ui/leave-filing-form"
import LeaveHistory from "./components/leave-history/ui/leave-history"
import ProfileCard from "./components/profile/ui/profile-card"
import LeaveFilingDialog from "./components/leave-filing/ui/mobile/leave-filing-dialog"
import { Payment } from "./components/leave-history/ui/columns"

export default function LeaveFiling({ data }: { data: Payment[] }) {
  const isMobile = useMediaQuery("(max-width: 1380px)")

  return (
    <div>
      <div className="lg:grid lg:grid-cols-10 lg:gap-4">
        <div className="mb-8 lg:col-span-3 lg:mb-0">
          <h1 className="mb-4 text-lg font-medium">File a Leave</h1>
          {isMobile ? <LeaveFilingDialog /> : <LeaveFilingForm />}
        </div>
        <div className="lg:col-span-7">
          <h1 className="text-lg font-medium">Leaves</h1>
          <LeaveHistory data={data} />
        </div>
      </div>
    </div>
  )
}
