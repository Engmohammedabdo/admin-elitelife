"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Doctor, DoctorFormData } from "@/types/database"
import { generateCode } from "@/lib/utils"
import { toast } from "sonner"

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDoctors = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from("doctors")
      .select(`
        *,
        department:departments(*),
        doctor_services(
          *,
          service:services(*)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
      toast.error("خطأ في تحميل الأطباء")
    } else {
      setDoctors(data || [])
    }

    setLoading(false)
  }, [])

  const createDoctor = async (formData: DoctorFormData) => {
    const { service_ids, ...doctorData } = formData
    const code = await generateCode("DOC", supabase, "doctors")

    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .insert({ ...doctorData, code })
      .select()
      .single()

    if (doctorError) {
      toast.error("خطأ في إضافة الطبيب")
      return null
    }

    if (service_ids && service_ids.length > 0) {
      const doctorServices = service_ids.map((service_id) => ({
        doctor_id: doctor.id,
        service_id,
        is_active: true,
      }))

      const { error: servicesError } = await supabase
        .from("doctor_services")
        .insert(doctorServices)

      if (servicesError) {
        toast.error("تم إضافة الطبيب لكن حدث خطأ في ربط الخدمات")
      }
    }

    toast.success("تم إضافة الطبيب بنجاح")
    await fetchDoctors()
    return doctor
  }

  const updateDoctor = async (id: string, formData: DoctorFormData) => {
    const { service_ids, ...doctorData } = formData

    const { error: doctorError } = await supabase
      .from("doctors")
      .update(doctorData)
      .eq("id", id)

    if (doctorError) {
      toast.error("خطأ في تحديث الطبيب")
      return false
    }

    if (service_ids !== undefined) {
      await supabase.from("doctor_services").delete().eq("doctor_id", id)

      if (service_ids.length > 0) {
        const doctorServices = service_ids.map((service_id) => ({
          doctor_id: id,
          service_id,
          is_active: true,
        }))

        await supabase.from("doctor_services").insert(doctorServices)
      }
    }

    toast.success("تم تحديث الطبيب بنجاح")
    await fetchDoctors()
    return true
  }

  const deleteDoctor = async (id: string) => {
    const { error } = await supabase.from("doctors").delete().eq("id", id)

    if (error) {
      toast.error("خطأ في حذف الطبيب")
      return false
    }

    toast.success("تم حذف الطبيب بنجاح")
    await fetchDoctors()
    return true
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("doctors")
      .update({ is_active: !isActive })
      .eq("id", id)

    if (error) {
      toast.error("خطأ في تغيير حالة الطبيب")
      return false
    }

    toast.success(isActive ? "تم إلغاء تفعيل الطبيب" : "تم تفعيل الطبيب")
    await fetchDoctors()
    return true
  }

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  return {
    doctors,
    loading,
    error,
    fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    toggleActive,
  }
}
