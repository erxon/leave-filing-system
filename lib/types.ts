export interface EmployeeProfile {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  manager_id: string
  role: string
  temp_password?: string
  company_id: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

export interface Leave {
  leave_type: string
  reason: string | null
  duration: string | null
  date: Date
}
