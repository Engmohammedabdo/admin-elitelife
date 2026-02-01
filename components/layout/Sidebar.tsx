"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building2,
  Stethoscope,
  Syringe,
  CalendarDays,
  Settings,
  Eye,
} from "lucide-react"

const navItems = [
  { href: "/", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/departments", label: "الأقسام", icon: Building2 },
  { href: "/doctors", label: "الأطباء", icon: Stethoscope },
  { href: "/services", label: "الخدمات", icon: Syringe },
  { href: "/schedule", label: "الجدول", icon: CalendarDays },
  { href: "/settings", label: "الإعدادات", icon: Settings },
  { href: "/preview", label: "المعاينة", icon: Eye },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed right-0 top-0 h-full w-64 bg-[#722F37] text-white shadow-lg z-50">
      {/* Logo */}
      <div className="p-6 border-b border-[#5C262D]">
        <h1 className="text-xl font-bold text-[#C5A572]">Elite Life</h1>
        <p className="text-sm text-[#E8D5B7]">لوحة التحكم</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-[#C5A572] text-[#722F37] font-semibold"
                  : "hover:bg-[#5C262D] text-[#F5E6D3]"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#5C262D]">
        <p className="text-xs text-center text-[#E8D5B7]">
          Elite Life Medical Centre
        </p>
        <p className="text-xs text-center text-[#C5A572]">Dubai, UAE</p>
      </div>
    </aside>
  )
}
