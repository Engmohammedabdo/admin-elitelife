"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useDepartments } from "@/hooks/useDepartments"
import { DepartmentTable } from "@/components/departments/DepartmentTable"
import { DepartmentForm } from "@/components/departments/DepartmentForm"
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton"
import { Header } from "@/components/layout/Header"
import { Department, DepartmentFormData } from "@/types/database"

export default function DepartmentsPage() {
  const {
    departments,
    loading,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    toggleActive,
  } = useDepartments()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)

  const handleAdd = () => {
    setEditingDepartment(null)
    setIsFormOpen(true)
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: DepartmentFormData) => {
    if (editingDepartment) {
      await updateDepartment(editingDepartment.id, data)
    } else {
      await createDepartment(data)
    }
    setIsFormOpen(false)
    setEditingDepartment(null)
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Header title="الأقسام" description="إدارة أقسام المركز الطبي" />
        <Button onClick={handleAdd} className="bg-[#722F37] hover:bg-[#5C262D]">
          <Plus className="w-4 h-4 ml-2" />
          إضافة قسم
        </Button>
      </div>

      <DepartmentTable
        departments={departments}
        onEdit={handleEdit}
        onDelete={deleteDepartment}
        onToggleActive={toggleActive}
      />

      <DepartmentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        department={editingDepartment}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
