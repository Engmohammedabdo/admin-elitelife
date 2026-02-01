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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Service, ServiceFormData, Department } from "@/types/database"

interface ServiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: Service | null
  departments: Department[]
  onSubmit: (data: ServiceFormData) => Promise<void>
}

export function ServiceForm({
  open,
  onOpenChange,
  service,
  departments,
  onSubmit,
}: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ServiceFormData>({
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    department_id: "",
    duration_minutes: 60,
    service_type: "procedure",
    price: null,
    is_active: true,
  })

  useEffect(() => {
    if (service) {
      setFormData({
        name_ar: service.name_ar,
        name_en: service.name_en,
        description_ar: service.description_ar || "",
        description_en: service.description_en || "",
        department_id: service.department_id,
        duration_minutes: service.duration_minutes,
        service_type: service.service_type,
        price: service.price,
        is_active: service.is_active,
      })
    } else {
      setFormData({
        name_ar: "",
        name_en: "",
        description_ar: "",
        description_en: "",
        department_id: "",
        duration_minutes: 60,
        service_type: "procedure",
        price: null,
        is_active: true,
      })
    }
  }, [service, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSubmit(formData)
    setIsSubmitting(false)
  }

  const activeDepartments = departments.filter((d) => d.is_active)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {service ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
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
                placeholder="مثال: فحص الجلدية"
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
                placeholder="e.g. Dermatology Consultation"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description_ar">الوصف بالعربية</Label>
              <Input
                id="description_ar"
                value={formData.description_ar || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description_ar: e.target.value })
                }
                dir="rtl"
                placeholder="وصف مختصر للخدمة"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description_en">الوصف بالإنجليزية</Label>
              <Input
                id="description_en"
                value={formData.description_en || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description_en: e.target.value })
                }
                dir="ltr"
                placeholder="Brief description"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>القسم *</Label>
              <Select
                value={formData.department_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, department_id: value })
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
            <div className="space-y-2">
              <Label>نوع الخدمة *</Label>
              <Select
                value={formData.service_type}
                onValueChange={(value: "consultation" | "procedure") =>
                  setFormData({ ...formData, service_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">استشارة</SelectItem>
                  <SelectItem value="procedure">إجراء طبي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">المدة (بالدقائق) *</Label>
              <Select
                value={formData.duration_minutes.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, duration_minutes: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 دقيقة</SelectItem>
                  <SelectItem value="30">30 دقيقة</SelectItem>
                  <SelectItem value="45">45 دقيقة</SelectItem>
                  <SelectItem value="60">60 دقيقة</SelectItem>
                  <SelectItem value="90">90 دقيقة</SelectItem>
                  <SelectItem value="120">120 دقيقة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">السعر (درهم)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                dir="ltr"
                placeholder="مثال: 500"
              />
            </div>
          </div>

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
              {isSubmitting ? "جارٍ الحفظ..." : service ? "حفظ التعديلات" : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
