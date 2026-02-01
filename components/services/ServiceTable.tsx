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
import { Service } from "@/types/database"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EmptyState } from "@/components/shared/EmptyState"

interface ServiceTableProps {
  services: Service[]
  onEdit: (service: Service) => void
  onDelete: (id: string) => Promise<boolean>
  onToggleActive: (id: string, isActive: boolean) => Promise<boolean>
}

export function ServiceTable({
  services,
  onEdit,
  onDelete,
  onToggleActive,
}: ServiceTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleConfirmDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId)
      setDeleteId(null)
    }
  }

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <EmptyState
            title="لا توجد خدمات"
            description="ابدأ بإضافة خدمة جديدة"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">قائمة الخدمات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الكود</TableHead>
                <TableHead className="text-right">الاسم بالعربية</TableHead>
                <TableHead className="text-right">القسم</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">المدة</TableHead>
                <TableHead className="text-right">السعر</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right w-[100px]">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id} className="table-row-hover">
                  <TableCell className="font-mono text-sm">
                    {service.code}
                  </TableCell>
                  <TableCell className="font-medium">
                    {service.name_ar}
                  </TableCell>
                  <TableCell>
                    {service.department?.name_ar || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        service.service_type === "consultation"
                          ? "border-blue-500 text-blue-600"
                          : "border-purple-500 text-purple-600"
                      }
                    >
                      {service.service_type === "consultation" ? "استشارة" : "إجراء"}
                    </Badge>
                  </TableCell>
                  <TableCell>{service.duration_minutes} دقيقة</TableCell>
                  <TableCell>
                    {service.price ? `${service.price} درهم` : "-"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge isActive={service.is_active} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(service)}>
                          <Pencil className="w-4 h-4 ml-2" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onToggleActive(service.id, service.is_active)
                          }
                        >
                          <Power className="w-4 h-4 ml-2" />
                          {service.is_active ? "إلغاء التفعيل" : "تفعيل"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(service.id)}
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
        title="حذف الخدمة"
        description="هل أنت متأكد من حذف هذه الخدمة؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={handleConfirmDelete}
        confirmText="حذف"
      />
    </>
  )
}
