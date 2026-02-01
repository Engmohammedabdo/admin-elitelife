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
import { Department, DepartmentFormData } from "@/types/database"

interface DepartmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  department: Department | null
  onSubmit: (data: DepartmentFormData) => Promise<void>
}

export function DepartmentForm({
  open,
  onOpenChange,
  department,
  onSubmit,
}: DepartmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<DepartmentFormData>({
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    is_active: true,
  })

  useEffect(() => {
    if (department) {
      setFormData({
        name_ar: department.name_ar,
        name_en: department.name_en,
        description_ar: department.description_ar || "",
        description_en: department.description_en || "",
        is_active: department.is_active,
      })
    } else {
      setFormData({
        name_ar: "",
        name_en: "",
        description_ar: "",
        description_en: "",
        is_active: true,
      })
    }
  }, [department, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSubmit(formData)
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {department ? "تعديل القسم" : "إضافة قسم جديد"}
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
                placeholder="مثال: قسم الجلدية"
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
                placeholder="e.g. Dermatology"
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
                placeholder="وصف مختصر للقسم"
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
              {isSubmitting ? "جارٍ الحفظ..." : department ? "حفظ التعديلات" : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
