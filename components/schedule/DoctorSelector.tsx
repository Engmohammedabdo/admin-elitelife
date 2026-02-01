"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Stethoscope } from "lucide-react"
import { Doctor } from "@/types/database"

interface DoctorSelectorProps {
  doctors: Doctor[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function DoctorSelector({
  doctors,
  selectedId,
  onSelect,
}: DoctorSelectorProps) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-[#722F37]">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              اختر الطبيب
            </label>
            <Select
              value={selectedId || ""}
              onValueChange={(value) => onSelect(value || null)}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="اختر طبيباً لعرض جدوله" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div className="flex items-center gap-2">
                      <span>{doctor.name_ar}</span>
                      {doctor.department && (
                        <span className="text-gray-500 text-sm">
                          - {doctor.department.name_ar}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
