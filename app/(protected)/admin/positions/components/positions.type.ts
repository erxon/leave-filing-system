export interface Position {
  id: string
  name: string
  description: string
  department_id: string
  reports_to?: string | null
  reporting_to?: { name: string } | null
}
