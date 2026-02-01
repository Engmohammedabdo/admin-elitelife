"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, Calendar, Stethoscope, Syringe, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton"
import { Header } from "@/components/layout/Header"
import { Doctor, DoctorSchedule, Service } from "@/types/database"
import { format, addDays } from "date-fns"
import { ar } from "date-fns/locale"
import { formatTimeDubai } from "@/lib/utils"

interface DoctorWithDetails extends Doctor {
  schedules?: DoctorSchedule[]
}

export default function PreviewPage() {
  const [doctors, setDoctors] = useState<DoctorWithDetails[]>([])
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const today = format(new Date(), "yyyy-MM-dd")
      const nextWeek = format(addDays(new Date(), 7), "yyyy-MM-dd")

      const { data } = await supabase
        .from("doctors")
        .select(`
          *,
          department:departments(*),
          doctor_services(
            *,
            service:services(*)
          ),
          schedules:doctor_schedules(*)
        `)
        .eq("is_active", true)
        .gte("doctor_schedules.schedule_date", today)
        .lte("doctor_schedules.schedule_date", nextWeek)
        .order("name_ar")

      if (data) {
        // Filter schedules for next 7 days
        const doctorsWithSchedules = data.map((doctor) => ({
          ...doctor,
          schedules: (doctor.schedules || []).filter(
            (s: DoctorSchedule) =>
              s.schedule_date >= today && s.schedule_date <= nextWeek
          ),
        }))
        setDoctors(doctorsWithSchedules)
        if (doctorsWithSchedules.length > 0) {
          setSelectedDoctorId(doctorsWithSchedules[0].id)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId)

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <Header
        title="المعاينة"
        description="عرض البيانات كما يراها المساعد الذكي (AI Agent)"
      />

      <Card className="bg-gradient-to-br from-[#722F37] to-[#5C262D] text-white">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <Eye className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">وضع المعاينة</h2>
              <p className="text-white/80">
                هذه الصفحة تعرض البيانات بنفس الطريقة التي يراها المساعد الذكي
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Stethoscope className="w-5 h-5 text-[#722F37]" />
            اختر الطبيب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedDoctorId || ""}
            onValueChange={setSelectedDoctorId}
          >
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="اختر طبيباً" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name_ar} - {doctor.department?.name_ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedDoctor && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Doctor Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">معلومات الطبيب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">الاسم</p>
                <p className="font-medium">{selectedDoctor.name_ar}</p>
                <p className="text-gray-600" dir="ltr">
                  {selectedDoctor.name_en}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">القسم</p>
                <p className="font-medium">
                  {selectedDoctor.department?.name_ar}
                </p>
              </div>
              {selectedDoctor.specialization_ar && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">التخصص</p>
                  <p className="font-medium">
                    {selectedDoctor.specialization_ar}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Syringe className="w-5 h-5 text-[#722F37]" />
                الخدمات المتاحة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDoctor.doctor_services &&
              selectedDoctor.doctor_services.length > 0 ? (
                <div className="space-y-3">
                  {selectedDoctor.doctor_services.map((ds) => (
                    <div
                      key={ds.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{ds.service?.name_ar}</p>
                        <p className="text-sm text-gray-500">
                          {ds.service?.duration_minutes} دقيقة
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          ds.service?.service_type === "consultation"
                            ? "border-blue-500 text-blue-600"
                            : "border-purple-500 text-purple-600"
                        }
                      >
                        {ds.service?.service_type === "consultation"
                          ? "استشارة"
                          : "إجراء"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  لا توجد خدمات مسجلة
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Available Schedules */}
      {selectedDoctor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-[#722F37]" />
              المواعيد المتاحة (الأسبوع القادم)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDoctor.schedules && selectedDoctor.schedules.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">اليوم</TableHead>
                    <TableHead className="text-right">من</TableHead>
                    <TableHead className="text-right">إلى</TableHead>
                    <TableHead className="text-right">مدة الموعد</TableHead>
                    <TableHead className="text-right">عدد المواعيد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedDoctor.schedules
                    .sort((a, b) => a.schedule_date.localeCompare(b.schedule_date))
                    .map((schedule) => {
                      const date = new Date(schedule.schedule_date)
                      const dayName = format(date, "EEEE", { locale: ar })
                      const formattedDate = format(date, "d MMMM", { locale: ar })

                      // Calculate number of slots
                      const [startH, startM] = schedule.start_time
                        .split(":")
                        .map(Number)
                      const [endH, endM] = schedule.end_time.split(":").map(Number)
                      const totalMinutes =
                        endH * 60 + endM - (startH * 60 + startM)
                      const slotsCount = Math.floor(
                        totalMinutes / schedule.slot_duration_minutes
                      )

                      return (
                        <TableRow key={schedule.id}>
                          <TableCell className="font-medium">
                            {formattedDate}
                          </TableCell>
                          <TableCell>{dayName}</TableCell>
                          <TableCell>
                            {formatTimeDubai(schedule.start_time)}
                          </TableCell>
                          <TableCell>
                            {formatTimeDubai(schedule.end_time)}
                          </TableCell>
                          <TableCell>
                            {schedule.slot_duration_minutes} دقيقة
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              {slotsCount} موعد
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  لا توجد مواعيد متاحة في الأسبوع القادم
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary for AI */}
      <Card className="border-[#C5A572]">
        <CardHeader className="bg-[#FDF8F0]">
          <CardTitle className="text-lg text-[#722F37]">
            ملخص للمساعد الذكي
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-[#FDF8F0] pt-4">
          <div className="bg-white p-4 rounded-lg font-mono text-sm">
            <pre className="whitespace-pre-wrap text-gray-700" dir="ltr">
              {selectedDoctor
                ? `Doctor: ${selectedDoctor.name_en}
Department: ${selectedDoctor.department?.name_en || "N/A"}
Specialization: ${selectedDoctor.specialization_en || "N/A"}
Services: ${
                    selectedDoctor.doctor_services
                      ?.map((ds) => ds.service?.name_en)
                      .join(", ") || "None"
                  }
Available Slots: ${selectedDoctor.schedules?.length || 0} time periods this week`
                : "No doctor selected"}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
