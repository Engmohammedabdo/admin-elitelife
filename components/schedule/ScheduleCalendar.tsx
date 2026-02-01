"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { DoctorSchedule } from "@/types/database"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns"
import { ar } from "date-fns/locale"

interface ScheduleCalendarProps {
  schedules: DoctorSchedule[]
  loading: boolean
  onDayClick: (date: Date) => void
}

const WEEKDAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]

export function ScheduleCalendar({
  schedules,
  loading,
  onDayClick,
}: ScheduleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  const getSchedulesForDate = (date: Date): DoctorSchedule[] => {
    const dateStr = format(date, "yyyy-MM-dd")
    return schedules.filter((s) => s.schedule_date === dateStr)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const isPastDate = (date: Date) => {
    return isBefore(date, startOfDay(new Date()))
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {format(currentMonth, "MMMM yyyy", { locale: ar })}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            جارٍ تحميل الجدول...
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {/* Weekday headers */}
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day) => {
              const daySchedules = getSchedulesForDate(day)
              const hasSchedule = daySchedules.length > 0
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isCurrentDay = isToday(day)
              const isPast = isPastDate(day)

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => !isPast && onDayClick(day)}
                  disabled={isPast}
                  className={`
                    relative p-2 min-h-[80px] rounded-lg border transition-all
                    ${!isCurrentMonth ? "opacity-40" : ""}
                    ${isPast ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-[#722F37]"}
                    ${isCurrentDay ? "border-[#C5A572] border-2" : "border-gray-200"}
                    ${hasSchedule ? "bg-[#722F37]/5" : "bg-white"}
                  `}
                >
                  <span
                    className={`
                      text-sm font-medium
                      ${isCurrentDay ? "text-[#722F37] font-bold" : "text-gray-700"}
                    `}
                  >
                    {format(day, "d")}
                  </span>

                  {hasSchedule && (
                    <div className="mt-1 space-y-1">
                      {daySchedules.slice(0, 2).map((schedule, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-[#722F37] text-white px-1 py-0.5 rounded truncate"
                        >
                          {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                        </div>
                      ))}
                      {daySchedules.length > 2 && (
                        <div className="text-xs text-[#722F37] font-medium">
                          +{daySchedules.length - 2} فترات
                        </div>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-[#C5A572]" />
            <span>اليوم</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#722F37]" />
            <span>يوم به مواعيد</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
