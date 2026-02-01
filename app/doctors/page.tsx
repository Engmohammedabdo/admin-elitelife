"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useDoctors } from "@/hooks/useDoctors"
import { useDepartments } from "@/hooks/useDepartments"
import { useServices } from "@/hooks/useServices"
import { DoctorTable } from "@/components/doctors/DoctorTable"
import { DoctorForm } from "@/components/doctors/DoctorForm"
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton"
import { Header } from "@/components/layout/Header"
import { Doctor, DoctorFormData } from "@/types/database"

export default function DoctorsPage() {
  const {
    doctors,
    loading,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    toggleActive,
  } = useDoctors()

  const { departments } = useDepartments()
  const { services } = useServices()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)

  const handleAdd = () => {
    setEditingDoctor(null)
    setIsFormOpen(true)
  }

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: DoctorFormData) => {
    if (editingDoctor) {
      await updateDoctor(editingDoctor.id, data)
    } else {
      await createDoctor(data)
    }
    setIsFormOpen(false)
    setEditingDoctor(null)
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Header title="الأطباء" description="إدارة الأطباء والتخصصات" />
        <Button onClick={handleAdd} className="bg-[#722F37] hover:bg-[#5C262D]">
          <Plus className="w-4 h-4 ml-2" />
          إضافة طبيب
        </Button>
      </div>

      <DoctorTable
        doctors={doctors}
        onEdit={handleEdit}
        onDelete={deleteDoctor}
        onToggleActive={toggleActive}
      />

      <DoctorForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        doctor={editingDoctor}
        departments={departments}
        services={services}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
