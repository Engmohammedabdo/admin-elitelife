"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Doctor, DoctorFormData, Department, Service } from "@/types/database"

interface DoctorFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  doctor: Doctor | null
  departments: Department[]
  services: Service[]
  onSubmit: (data: DoctorFormData) => Promise<void>
}

export function DoctorForm({
  open,
  onOpenChange,
  doctor,
  departments,
  services,
  onSubmit,
}: DoctorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<DoctorFormData>({
    name_ar: "",
    name_en: "",
    department_id: "",
    specialization_ar: "",
    specialization_en: "",
    is_active: true,
    service_ids: [],
  })

  useEffect(() => {
    if (doctor) {
      setFormData({
        name_ar: doctor.name_ar,
        name_en: doctor.name_en,
        department_id: doctor.department_id,
        specialization_ar: doctor.specialization_ar || "",
        specialization_en: doctor.specialization_en || "",
        is_active: doctor.is_active,
        service_ids: doctor.doctor_services?.map((ds) => ds.service_id) || [],
      })
    } else {
      setFormData({
        name_ar: "",
        name_en: "",
        department_id: "",
        specialization_ar: "",
        specialization_en: "",
        is_active: true,
        service_ids: [],
      })
    }
  }, [doctor, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSubmit(formData)
    setIsSubmitting(false)
  }

  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      service_ids: prev.service_ids?.includes(serviceId)
        ? prev.service_ids.filter((id) => id !== serviceId)
        : [...(prev.service_ids || []), serviceId],
    }))
  }

  const activeDepartments = departments.filter((d) => d.is_active)
  const departmentServices = services.filter(
    (s) => s.department_id === formData.department_id && s.is_active
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {doctor ? "تعديل الطبيب" : "إضافة طبيب جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_ar">الاسم بالعربية *</Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) =>
                  setFormData({ ...formData, name_ar: e.target.value })
                }
                required
                dir="rtl"
                placeholder="مثال: د. أحمد محمد"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_en">الاسم بالإنجليزية *</Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) =>
                  setFormData({ ...formData, name_en: e.target.value })
                }
                required
                dir="ltr"
                placeholder="e.g. Dr. Ahmed Mohamed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>القسم *</Label>
            <Select
              value={formData.department_id}
              onValueChange={(value) =>
                setFormData({ ...formData, department_id: value, service_ids: [] })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر القسم" />
              </SelectTrigger>
              <SelectContent>
                {activeDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialization_ar">التخصص بالعربية</Label>
              <Input
                id="specialization_ar"
                value={formData.specialization_ar || ""}
                onChange={(e) =>
                  setFormData({ ...formData, specialization_ar: e.target.value })
                }
                dir="rtl"
                placeholder="مثال: استشاري جلدية"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization_en">التخصص بالإنجليزية</Label>
              <Input
                id="specialization_en"
                value={formData.specialization_en || ""}
                onChange={(e) =>
                  setFormData({ ...formData, specialization_en: e.target.value })
                }
                dir="ltr"
                placeholder="e.g. Dermatology Consultant"
              />
            </div>
          </div>

          {/* Services Selection */}
          {formData.department_id && (
            <div className="space-y-2">
              <Label>الخدمات التي يقدمها الطبيب</Label>
              <ScrollArea className="h-48 border rounded-md p-3">
                {departmentServices.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    لا توجد خدمات لهذا القسم
                  </p>
                ) : (
                  <div className="space-y-3">
                    {departmentServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-gray-50"
                      >
                        <Checkbox
                          id={service.id}
                          checked={formData.service_ids?.includes(service.id)}
                          onCheckedChange={() => toggleService(service.id)}
                        />
                        <label
                          htmlFor={service.id}
                          className="text-sm cursor-pointer flex-1"
                        >
                          <span className="font-medium">{service.name_ar}</span>
                          <span className="text-gray-500 text-xs mr-2">
                            ({service.duration_minutes} دقيقة)
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              {formData.service_ids && formData.service_ids.length > 0 && (
                <p className="text-sm text-gray-600">
                  تم اختيار {formData.service_ids.length} خدمة
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked as boolean })
              }
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              مفعل
            </Label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#722F37] hover:bg-[#5C262D]"
            >
              {isSubmitting ? "جارٍ الحفظ..." : doctor ? "حفظ التعديلات" : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
