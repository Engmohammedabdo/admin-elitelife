"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Filter } from "lucide-react"
import { useServices } from "@/hooks/useServices"
import { useDepartments } from "@/hooks/useDepartments"
import { ServiceTable } from "@/components/services/ServiceTable"
import { ServiceForm } from "@/components/services/ServiceForm"
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton"
import { Header } from "@/components/layout/Header"
import { Service, ServiceFormData } from "@/types/database"

export default function ServicesPage() {
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null)
  const { departments } = useDepartments()
  const {
    services,
    loading,
    createService,
    updateService,
    deleteService,
    toggleActive,
    fetchServices,
  } = useServices(departmentFilter)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const handleAdd = () => {
    setEditingService(null)
    setIsFormOpen(true)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setIsFormOpen(true)
  }

  const handleFormSubmit = async (data: ServiceFormData) => {
    if (editingService) {
      await updateService(editingService.id, data)
    } else {
      await createService(data)
    }
    setIsFormOpen(false)
    setEditingService(null)
  }

  const handleFilterChange = (value: string) => {
    setDepartmentFilter(value === "all" ? null : value)
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Header title="الخدمات" description="إدارة الخدمات الطبية" />
        <Button onClick={handleAdd} className="bg-[#722F37] hover:bg-[#5C262D]">
          <Plus className="w-4 h-4 ml-2" />
          إضافة خدمة
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-5 h-5 text-gray-500" />
        <Select
          value={departmentFilter || "all"}
          onValueChange={handleFilterChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="فلتر حسب القسم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأقسام</SelectItem>
            {departments
              .filter((d) => d.is_active)
              .map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name_ar}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <ServiceTable
        services={services}
        onEdit={handleEdit}
        onDelete={deleteService}
        onToggleActive={toggleActive}
      />

      <ServiceForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        service={editingService}
        departments={departments}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
