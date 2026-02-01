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
import { MoreHorizontal, Pencil, Trash2, Power } from "lucide-react"
import { Department } from "@/types/database"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EmptyState } from "@/components/shared/EmptyState"

interface DepartmentTableProps {
  departments: Department[]
  onEdit: (department: Department) => void
  onDelete: (id: string) => Promise<boolean>
  onToggleActive: (id: string, isActive: boolean) => Promise<boolean>
}

export function DepartmentTable({
  departments,
  onEdit,
  onDelete,
  onToggleActive,
}: DepartmentTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId)
      setDeleteId(null)
    }
  }

  if (departments.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            title="لا توجد أقسام"
            description="ابدأ بإضافة قسم جديد"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">قائمة الأقسام</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الكود</TableHead>
                <TableHead className="text-right">الاسم بالعربية</TableHead>
                <TableHead className="text-right">الاسم بالإنجليزية</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right w-[100px]">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id} className="table-row-hover">
                  <TableCell className="font-mono text-sm">
                    {department.code}
                  </TableCell>
                  <TableCell className="font-medium">
                    {department.name_ar}
                  </TableCell>
                  <TableCell dir="ltr" className="text-right">
                    {department.name_en}
                  </TableCell>
                  <TableCell>
                    <StatusBadge isActive={department.is_active} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(department)}>
                          <Pencil className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onToggleActive(department.id, department.is_active)
                          }
                        >
                          <Power className="w-4 h-4 ml-2" />
                          {department.is_active ? "إلغاء التفعيل" : "تفعيل"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(department.id)}
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
        title="حذف القسم"
        description="هل أنت متأكد من حذف هذا القسم؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={handleConfirmDelete}
        confirmText="حذف"
      />
    </>
  )
}
