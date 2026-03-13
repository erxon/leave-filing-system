import { columns, Employee } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Employee[]> {
  // Fetch data from your API here.
  return [
    {
      employee_id: "12345678",
      first_name: "John",
      last_name: "Doe",
      manager_id: "12345678",
      role: "employee",
    },
    // ...
  ]
}

export default async function Users() {
  const data = await getData()

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
