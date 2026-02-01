export interface Department {
  id: string
  code: string
  name_ar: string
  name_en: string
  description_ar?: string | null
  description_en?: string | null
  is_active: boolean
  created_at: string
}

export interface Doctor {
  id: string
  code: string
  department_id: string
  name_ar: string
  name_en: string
  specialization_ar?: string | null
  specialization_en?: string | null
  is_active: boolean
  created_at: string
  department?: Department
  doctor_services?: DoctorService[]
}

export interface Service {
  id: string
  code: string
  department_id: string
  name_ar: string
  name_en: string
  description_ar?: string | null
  description_en?: string | null
  duration_minutes: number
  service_type: 'consultation' | 'procedure'
  price?: number | null
  is_active: boolean
  created_at: string
  department?: Department
}

export interface DoctorService {
  id: string
  doctor_id: string
  service_id: string
  is_active: boolean
  created_at: string
  service?: Service
}

export interface DoctorSchedule {
  id: string
  doctor_id: string
  schedule_date: string
  start_time: string
  end_time: string
  slot_duration_minutes: number
  is_available: boolean
  notes?: string | null
  created_at: string
  doctor?: Doctor
}

export interface Config {
  key: string
  value: string
  description?: string | null
  updated_at: string
}

// Form types
export type DepartmentFormData = Omit<Department, 'id' | 'code' | 'created_at'>
export type DoctorFormData = Omit<Doctor, 'id' | 'code' | 'created_at' | 'department' | 'doctor_services'> & {
  service_ids?: string[]
}
export type ServiceFormData = Omit<Service, 'id' | 'code' | 'created_at' | 'department'>
export type ScheduleFormData = Omit<DoctorSchedule, 'id' | 'created_at' | 'doctor'>
