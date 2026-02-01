"use client"

import { useState, useEffect } from "react"
import { useDoctors } from "@/hooks/useDoctors"
import { useSchedules } from "@/hooks/useSchedules"
import { DoctorSelector } from "@/components/schedule/DoctorSelector"
import { ScheduleCalendar } from "@/components/schedule/ScheduleCalendar"
import { DayScheduleModal } from "@/components/schedule/DayScheduleModal"
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton"
import { Header } from "@/components/layout/Header"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import { format } from "date-fns"

export default function SchedulePage() {
  const { doctors, loading: doctorsLoading } = useDoctors()
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    schedules,
    loading: schedulesLoading,
    fetchSchedules,
    getSchedulesForDate,
    createSchedule,
    deleteSchedule,
  } = useSchedules(selectedDoctorId)

  useEffect(() => {
    if (selectedDoctorId) {
      fetchSchedules()
    }
  }, [selectedDoctorId, fetchSchedules])

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleAddSlot = async (data: {
    start_time: string
    end_time: string
    slot_duration_minutes: number
    notes?: string
  }) => {
    if (!selectedDoctorId || !selectedDate) return

    await createSchedule({
      doctor_id: selectedDoctorId,
      schedule_date: format(selectedDate, "yyyy-MM-dd"),
      start_time: data.start_time,
      end_time: data.end_time,
      slot_duration_minutes: data.slot_duration_minutes,
      is_available: true,
      notes: data.notes,
    })
  }

  const activeDoctors = doctors.filter((d) => d.is_active)

  if (doctorsLoading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <Header
        title="جدول المواعيد"
        description="إدارة فترات عمل الأطباء والمواعيد المتاحة"
      />

      <DoctorSelector
        doctors={activeDoctors}
        selectedId={selectedDoctorId}
        onSelect={setSelectedDoctorId}
      />

      {!selectedDoctorId ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <CalendarDays className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                اختر طبيباً
              </h3>
              <p className="text-sm text-gray-500">
                اختر طبيباً من القائمة أعلاه لعرض وإدارة جدول مواعيده
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ScheduleCalendar
          schedules={schedules}
          loading={schedulesLoading}
          onDayClick={handleDayClick}
        />
      )}

      <DayScheduleModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        date={selectedDate}
        slots={
          selectedDate
            ? getSchedulesForDate(format(selectedDate, "yyyy-MM-dd"))
            : []
        }
        onAddSlot={handleAddSlot}
        onDeleteSlot={deleteSchedule}
      />
    </div>
  )
}
