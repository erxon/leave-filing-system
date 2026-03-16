import { columns, LeaveHistoryItem } from "./columns"
import { DataTable } from "./data-table"
import { addDays, subDays } from "date-fns"

export async function getData(): Promise<LeaveHistoryItem[]> {
  // Fetch data from your API here.
  const today = new Date()
  
  return [
    {
      id: "REQ-1001",
      type: "Vacation Leave",
      date: addDays(today, 5),
      duration: "full-day",
      reason: "Family trip",
      status: "Approved",
    },
    {
      id: "REQ-1002",
      type: "Sick Leave",
      date: subDays(today, 2),
      duration: "full-day",
      reason: "Fever and cough",
      status: "Approved",
    },
    {
      id: "REQ-1003",
      type: "Vacation Leave",
      date: addDays(today, 15),
      duration: "half-day",
      reason: "Personal errand",
      status: "Pending",
    },
    {
      id: "REQ-1004",
      type: "Emergency Leave",
      date: subDays(today, 10),
      duration: "full-day",
      reason: "Family emergency",
      status: "Approved",
    },
    {
      id: "REQ-1005",
      type: "Vacation Leave",
      date: subDays(today, 20),
      duration: "full-day",
      reason: "Rest",
      status: "Rejected",
    },
    {
      id: "REQ-1006",
      type: "Sick Leave",
      date: subDays(today, 30),
      duration: "half-day",
      reason: "Dental appointment",
      status: "Approved",
    },
    {
      id: "REQ-1007",
      type: "Vacation Leave",
      date: addDays(today, 30),
      duration: "full-day",
      reason: "Anniversary",
      status: "Pending",
    },
    {
      id: "REQ-1008",
      type: "Sick Leave",
      date: subDays(today, 45),
      duration: "full-day",
      reason: "Migraine",
      status: "Approved",
    },
  ]
}

interface LeaveHistoryProps {
  data: LeaveHistoryItem[]
}

export default function LeaveHistory({ data }: LeaveHistoryProps) {
  return (
    <div className="py-4">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
