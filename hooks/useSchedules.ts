"use client"

import { useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { DoctorSchedule, ScheduleFormData } from "@/types/database"
import { toast } from "sonner"

export function useSchedules(doctorId: string | null) {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedules = useCallback(async () => {
    if (!doctorId) {
      setSchedules([])
      return
    }

    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from("doctor_schedules")
      .select("*")
      .eq("doctor_id", doctorId)
      .order("schedule_date", { ascending: true })
      .order("start_time", { ascending: true })

    if (error) {
      setError(error.message)
      toast.error("خطأ في تحميل الجدول")
    } else {
      setSchedules(data || [])
    }

    setLoading(false)
  }, [doctorId])

  const getSchedulesForDate = (date: string): DoctorSchedule[] => {
    return schedules.filter((s) => s.schedule_date === date)
  }

  const createSchedule = async (formData: ScheduleFormData) => {
    const { data, error } = await supabase
      .from("doctor_schedules")
      .insert(formData)
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        toast.error("يوجد موعد مكرر في هذا الوقت")
      } else {
        toast.error("خطأ في إضافة الفترة")
      }
      return null
    }

    toast.success("تم إضافة فترة العمل بنجاح")
    await fetchSchedules()
    return data
  }

  const updateSchedule = async (id: string, formData: Partial<ScheduleFormData>) => {
    const { error } = await supabase
      .from("doctor_schedules")
      .update(formData)
      .eq("id", id)

    if (error) {
      toast.error("خطأ في تحديث الفترة")
      return false
    }

    toast.success("تم تحديث الفترة بنجاح")
    await fetchSchedules()
    return true
  }

  const deleteSchedule = async (id: string) => {
    const { error } = await supabase
      .from("doctor_schedules")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error("خطأ في حذف الفترة")
      return false
    }

    toast.success("تم حذف الفترة بنجاح")
    await fetchSchedules()
    return true
  }

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    getSchedulesForDate,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  }
}
