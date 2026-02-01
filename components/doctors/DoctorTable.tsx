"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Power } from "lucide-react"
import { Doctor } from "@/types/database"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EmptyState } from "@/components/shared/EmptyState"

interface DoctorTableProps {
  doctors: Doctor[]
  onEdit: (doctor: Doctor) => void
  onDelete: (id: string) => Promise<boolean>
  onToggleActive: (id: string, isActive: boolean) => Promise<boolean>
}

export function DoctorTable({
  doctors,
  onEdit,
  onDelete,
  onToggleActive,
}: DoctorTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId)
      setDeleteId(null)
    }
  }

  if (doctors.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            title="لا يوجد أطباء"
            description="ابدأ بإضافة طبيب جديد"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">قائمة الأطباء</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الكود</TableHead>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">القسم</TableHead>
                <TableHead className="text-right">التخصص</TableHead>
                <TableHead className="text-right">الخدمات</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right w-[100px]">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id} className="table-row-hover">
                  <TableCell className="font-mono text-sm">
                    {doctor.code}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{doctor.name_ar}</p>
                      <p className="text-sm text-gray-500" dir="ltr">
                        {doctor.name_en}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{doctor.department?.name_ar || "-"}</TableCell>
                  <TableCell>
                    {doctor.specialization_ar || "-"}
                  </TableCell>
                  <TableCell>
                    {doctor.doctor_services && doctor.doctor_services.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {doctor.doctor_services.slice(0, 2).map((ds) => (
                          <Badge
                            key={ds.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {ds.service?.name_ar}
                          </Badge>
                        ))}
                        {doctor.doctor_services.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{doctor.doctor_services.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge isActive={doctor.is_active} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(doctor)}>
                          <Pencil className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onToggleActive(doctor.id, doctor.is_active)
                          }
                        >
                          <Power className="w-4 h-4 ml-2" />
                          {doctor.is_active ? "إلغاء التفعيل" : "تفعيل"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(doctor.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف الطبيب"
        description="هل أنت متأكد من حذف هذا الطبيب؟ سيتم حذف جميع المواعيد المرتبطة به."
        onConfirm={handleConfirmDelete}
        confirmText="حذف"
      />
    </>
  )
}
