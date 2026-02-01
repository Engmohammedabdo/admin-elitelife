"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Service, ServiceFormData } from "@/types/database"
import { generateCode } from "@/lib/utils"
import { toast } from "sonner"

export function useServices(departmentFilter?: string | null) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from("services")
      .select(`*, department:departments(*)`)
      .order("created_at", { ascending: false })

    if (departmentFilter) {
      query = query.eq("department_id", departmentFilter)
    }

    const { data, error } = await query

    if (error) {
      setError(error.message)
      toast.error("خطأ في تحميل الخدمات")
    } else {
      setServices(data || [])
    }

    setLoading(false)
  }, [departmentFilter])

  const createService = async (formData: ServiceFormData) => {
    const code = await generateCode("SRV", supabase, "services")

    const { data, error } = await supabase
      .from("services")
      .insert({ ...formData, code })
      .select()
      .single()

    if (error) {
      toast.error("خطأ في إضافة الخدمة")
      return null
    }

    toast.success("تم إضافة الخدمة بنجاح")
    await fetchServices()
    return data
  }

  const updateService = async (id: string, formData: Partial<ServiceFormData>) => {
    const { error } = await supabase
      .from("services")
      .update(formData)
      .eq("id", id)

    if (error) {
      toast.error("خطأ في تحديث الخدمة")
      return false
    }

    toast.success("تم تحديث الخدمة بنجاح")
    await fetchServices()
    return true
  }

  const deleteService = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id)

    if (error) {
      toast.error("خطأ في حذف الخدمة - قد تكون مرتبطة بأطباء")
      return false
    }

    toast.success("تم حذف الخدمة بنجاح")
    await fetchServices()
    return true
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    return updateService(id, { is_active: !isActive })
  }

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
    toggleActive,
  }
}
