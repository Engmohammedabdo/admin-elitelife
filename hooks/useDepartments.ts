"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Department, DepartmentFormData } from "@/types/database"
import { generateCode } from "@/lib/utils"
import { toast } from "sonner"

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDepartments = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
      toast.error("خطأ في تحميل الأقسام")
    } else {
      setDepartments(data || [])
    }

    setLoading(false)
  }, [])

  const createDepartment = async (formData: DepartmentFormData) => {
    const code = await generateCode("DEP", supabase, "departments")

    const { data, error } = await supabase
      .from("departments")
      .insert({ ...formData, code })
      .select()
      .single()

    if (error) {
      toast.error("خطأ في إضافة القسم")
      return null
    }

    toast.success("تم إضافة القسم بنجاح")
    await fetchDepartments()
    return data
  }

  const updateDepartment = async (id: string, formData: Partial<DepartmentFormData>) => {
    const { error } = await supabase
      .from("departments")
      .update(formData)
      .eq("id", id)

    if (error) {
      toast.error("خطأ في تحديث القسم")
      return false
    }

    toast.success("تم تحديث القسم بنجاح")
    await fetchDepartments()
    return true
  }

  const deleteDepartment = async (id: string) => {
    const { error } = await supabase
      .from("departments")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error("خطأ في حذف القسم - قد يكون مرتبطاً بأطباء أو خدمات")
      return false
    }

    toast.success("تم حذف القسم بنجاح")
    await fetchDepartments()
    return true
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    return updateDepartment(id, { is_active: !isActive })
  }

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    toggleActive,
  }
}
