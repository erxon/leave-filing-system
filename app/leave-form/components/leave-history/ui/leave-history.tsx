import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"

export async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
  ]
}

interface LeaveHistoryProps {
  data: Payment[]
}

export default function LeaveHistory({ data }: LeaveHistoryProps) {
  return (
    <div className="container py-4">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
