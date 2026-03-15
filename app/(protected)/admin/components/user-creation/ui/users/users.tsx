import { columns, Employee } from "./columns"
import { DataTable } from "./data-table"
import { getEmployees } from "../../actions"

async function getData(companyId: string): Promise<Employee[]> {
  // Fetch data from your API here.
  const employees = await getEmployees(companyId)
  return employees
}

export default async function Users({ company_id }: { company_id: string }) {
  const data = await getData(company_id)

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
