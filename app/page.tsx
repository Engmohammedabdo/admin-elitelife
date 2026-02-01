"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Stethoscope, Syringe, CalendarDays } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/layout/Header"

interface Stats {
  departments: number
  doctors: number
  services: number
  schedules: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const [depts, docs, servs, scheds] = await Promise.all([
        supabase.from("departments").select("id", { count: "exact", head: true }),
        supabase.from("doctors").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("doctor_schedules").select("id", { count: "exact", head: true }),
      ])

      setStats({
        departments: depts.count || 0,
        doctors: docs.count || 0,
        services: servs.count || 0,
        schedules: scheds.count || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  const cards = [
    {
      title: "الأقسام",
      count: stats?.departments,
      icon: Building2,
      href: "/departments",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "الأطباء",
      count: stats?.doctors,
      icon: Stethoscope,
      href: "/doctors",
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "الخدمات",
      count: stats?.services,
      icon: Syringe,
      href: "/services",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "المواعيد",
      count: stats?.schedules,
      icon: CalendarDays,
      href: "/schedule",
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      <Header
        title="لوحة التحكم"
        description="مرحباً بك في لوحة إدارة مركز إيليت لايف الطبي"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.href} href={card.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-10 w-16" />
                  ) : (
                    <div className="text-3xl font-bold text-[#722F37]">
                      {card.count}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow">
          <CardHeader>
            <CardTitle className="text-lg text-[#722F37]">روابط سريعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/schedule"
              className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors"
            >
              <CalendarDays className="w-5 h-5 text-[#722F37]" />
              <span>إدارة جدول المواعيد</span>
            </Link>
            <Link
              href="/doctors"
              className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors"
            >
              <Stethoscope className="w-5 h-5 text-[#722F37]" />
              <span>إضافة طبيب جديد</span>
            </Link>
            <Link
              href="/services"
              className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors"
            >
              <Syringe className="w-5 h-5 text-[#722F37]" />
              <span>إدارة الخدمات</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow">
          <CardHeader>
            <CardTitle className="text-lg text-[#722F37]">معلومات المركز</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium">الاسم:</span> مركز إيليت لايف الطبي
            </p>
            <p>
              <span className="font-medium">الموقع:</span> دبي، الإمارات العربية المتحدة
            </p>
            <p>
              <span className="font-medium">ساعات العمل:</span> 9:00 ص - 9:00 م
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
