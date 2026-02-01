"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, Plus, Clock } from "lucide-react"
import { DoctorSchedule } from "@/types/database"
import { formatDateArabic, formatTimeDubai } from "@/lib/utils"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"

interface DayScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date | null
  slots: DoctorSchedule[]
  onAddSlot: (data: {
    start_time: string
    end_time: string
    slot_duration_minutes: number
    notes?: string
  }) => Promise<void>
  onDeleteSlot: (id: string) => Promise<boolean>
}

export function DayScheduleModal({
  open,
  onOpenChange,
  date,
  slots,
  onAddSlot,
  onDeleteSlot,
}: DayScheduleModalProps) {
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [slotDuration, setSlotDuration] = useState("30")
  const [notes, setNotes] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleAdd = async () => {
    if (startTime >= endTime) {
      return
    }
    setIsAdding(true)
    await onAddSlot({
      start_time: startTime,
      end_time: endTime,
      slot_duration_minutes: parseInt(slotDuration),
      notes: notes || undefined,
    })
    setIsAdding(false)
    setNotes("")
  }

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await onDeleteSlot(deleteId)
      setDeleteId(null)
    }
  }

  const calculateSlots = (start: string, end: string, duration: number) => {
    const [startHour, startMin] = start.split(":").map(Number)
    const [endHour, endMin] = end.split(":").map(Number)
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    return Math.floor((endMinutes - startMinutes) / duration)
  }

  if (!date) return null

  const slotsCount = calculateSlots(startTime, endTime, parseInt(slotDuration))

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#722F37]" />
              جدول يوم {formatDateArabic(date)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Existing Slots */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700">
                الفترات الحالية ({slots.length})
              </h3>
              {slots.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">لا توجد فترات مضافة</p>
                  <p className="text-xs text-gray-400 mt-1">
                    أضف فترة عمل جديدة من النموذج أدناه
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div>
                        <span className="font-medium text-[#722F37]">
                          {formatTimeDubai(slot.start_time)} -{" "}
                          {formatTimeDubai(slot.end_time)}
                        </span>
                        <span className="text-sm text-gray-500 mr-3">
                          ({slot.slot_duration_minutes} دقيقة لكل موعد)
                        </span>
                        {slot.notes && (
                          <p className="text-xs text-gray-400 mt-1">
                            {slot.notes}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteId(slot.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Slot Form */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold text-sm text-gray-700">
                إضافة فترة جديدة
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>وقت البداية</Label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label>وقت النهاية</Label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="text-center"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>مدة كل موعد</Label>
                <Select value={slotDuration} onValueChange={setSlotDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 دقيقة</SelectItem>
                    <SelectItem value="30">30 دقيقة</SelectItem>
                    <SelectItem value="45">45 دقيقة</SelectItem>
                    <SelectItem value="60">60 دقيقة</SelectItem>
                  </SelectContent>
                </Select>
                {slotsCount > 0 && (
                  <p className="text-xs text-gray-500">
                    سيتم إنشاء {slotsCount} موعد متاح
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>ملاحظات (اختياري)</Label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: فترة صباحية فقط"
                />
              </div>

              <Button
                onClick={handleAdd}
                disabled={isAdding || startTime >= endTime}
                className="w-full bg-[#722F37] hover:bg-[#5C262D]"
              >
                <Plus className="w-4 h-4 ml-2" />
                {isAdding ? "جارٍ الإضافة..." : "إضافة فترة"}
              </Button>

              {startTime >= endTime && (
                <p className="text-sm text-red-500 text-center">
                  وقت البداية يجب أن يكون قبل وقت النهاية
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف الفترة"
        description="هل أنت متأكد من حذف هذه الفترة؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={handleConfirmDelete}
        confirmText="حذف"
      />
    </>
  )
}
