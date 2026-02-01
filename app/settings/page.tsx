"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Save, Building2, Phone, Globe, Clock, MapPin } from "lucide-react"
import { useConfig } from "@/hooks/useConfig"
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton"
import { Header } from "@/components/layout/Header"
import { toast } from "sonner"

interface SettingsForm {
  center_name_ar: string
  center_name_en: string
  assistant_name_ar: string
  assistant_name_en: string
  address_ar: string
  address_en: string
  phone: string
  working_hours_ar: string
  working_hours_en: string
  google_maps_url: string
  instagram_url: string
  website_url: string
}

const defaultSettings: SettingsForm = {
  center_name_ar: "مركز إيليت لايف الطبي",
  center_name_en: "Elite Life Medical Centre",
  assistant_name_ar: "مساعد إيليت",
  assistant_name_en: "Elite Assistant",
  address_ar: "دبي، الإمارات العربية المتحدة",
  address_en: "Dubai, UAE",
  phone: "+971 4 XXX XXXX",
  working_hours_ar: "9:00 ص - 9:00 م",
  working_hours_en: "9:00 AM - 9:00 PM",
  google_maps_url: "",
  instagram_url: "",
  website_url: "",
}

export default function SettingsPage() {
  const { config, loading, updateMultipleConfig, getConfigValue } = useConfig()
  const [formData, setFormData] = useState<SettingsForm>(defaultSettings)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (config.length > 0) {
      setFormData({
        center_name_ar: getConfigValue("center_name_ar") || defaultSettings.center_name_ar,
        center_name_en: getConfigValue("center_name_en") || defaultSettings.center_name_en,
        assistant_name_ar: getConfigValue("assistant_name_ar") || defaultSettings.assistant_name_ar,
        assistant_name_en: getConfigValue("assistant_name_en") || defaultSettings.assistant_name_en,
        address_ar: getConfigValue("address_ar") || defaultSettings.address_ar,
        address_en: getConfigValue("address_en") || defaultSettings.address_en,
        phone: getConfigValue("phone") || defaultSettings.phone,
        working_hours_ar: getConfigValue("working_hours_ar") || defaultSettings.working_hours_ar,
        working_hours_en: getConfigValue("working_hours_en") || defaultSettings.working_hours_en,
        google_maps_url: getConfigValue("google_maps_url") || "",
        instagram_url: getConfigValue("instagram_url") || "",
        website_url: getConfigValue("website_url") || "",
      })
    }
  }, [config])

  const handleSave = async () => {
    setIsSaving(true)

    const configs = Object.entries(formData).map(([key, value]) => ({
      key,
      value,
      description: getDescription(key),
    }))

    await updateMultipleConfig(configs)
    setIsSaving(false)
  }

  const getDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      center_name_ar: "اسم المركز بالعربية",
      center_name_en: "اسم المركز بالإنجليزية",
      assistant_name_ar: "اسم المساعد الذكي بالعربية",
      assistant_name_en: "اسم المساعد الذكي بالإنجليزية",
      address_ar: "العنوان بالعربية",
      address_en: "العنوان بالإنجليزية",
      phone: "رقم الهاتف",
      working_hours_ar: "ساعات العمل بالعربية",
      working_hours_en: "ساعات العمل بالإنجليزية",
      google_maps_url: "رابط خرائط جوجل",
      instagram_url: "رابط انستغرام",
      website_url: "رابط الموقع الإلكتروني",
    }
    return descriptions[key] || key
  }

  if (loading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Header title="الإعدادات" description="إعدادات المركز والمساعد الذكي" />
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#722F37] hover:bg-[#5C262D]"
        >
          <Save className="w-4 h-4 ml-2" />
          {isSaving ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Center Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="w-5 h-5 text-[#722F37]" />
              معلومات المركز
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم المركز بالعربية</Label>
                <Input
                  value={formData.center_name_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, center_name_ar: e.target.value })
                  }
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label>اسم المركز بالإنجليزية</Label>
                <Input
                  value={formData.center_name_en}
                  onChange={(e) =>
                    setFormData({ ...formData, center_name_en: e.target.value })
                  }
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم المساعد الذكي بالعربية</Label>
                <Input
                  value={formData.assistant_name_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, assistant_name_ar: e.target.value })
                  }
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label>اسم المساعد الذكي بالإنجليزية</Label>
                <Input
                  value={formData.assistant_name_en}
                  onChange={(e) =>
                    setFormData({ ...formData, assistant_name_en: e.target.value })
                  }
                  dir="ltr"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="w-5 h-5 text-[#722F37]" />
              معلومات الاتصال
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>العنوان بالعربية</Label>
                <Input
                  value={formData.address_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, address_ar: e.target.value })
                  }
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label>العنوان بالإنجليزية</Label>
                <Input
                  value={formData.address_en}
                  onChange={(e) =>
                    setFormData({ ...formData, address_en: e.target.value })
                  }
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>رقم الهاتف</Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                dir="ltr"
                placeholder="+971 4 XXX XXXX"
              />
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-[#722F37]" />
              ساعات العمل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ساعات العمل بالعربية</Label>
                <Input
                  value={formData.working_hours_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, working_hours_ar: e.target.value })
                  }
                  dir="rtl"
                  placeholder="9:00 ص - 9:00 م"
                />
              </div>
              <div className="space-y-2">
                <Label>ساعات العمل بالإنجليزية</Label>
                <Input
                  value={formData.working_hours_en}
                  onChange={(e) =>
                    setFormData({ ...formData, working_hours_en: e.target.value })
                  }
                  dir="ltr"
                  placeholder="9:00 AM - 9:00 PM"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-[#722F37]" />
              الروابط
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>رابط خرائط جوجل</Label>
              <Input
                value={formData.google_maps_url}
                onChange={(e) =>
                  setFormData({ ...formData, google_maps_url: e.target.value })
                }
                dir="ltr"
                placeholder="https://maps.google.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>رابط انستغرام</Label>
              <Input
                value={formData.instagram_url}
                onChange={(e) =>
                  setFormData({ ...formData, instagram_url: e.target.value })
                }
                dir="ltr"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>رابط الموقع الإلكتروني</Label>
              <Input
                value={formData.website_url}
                onChange={(e) =>
                  setFormData({ ...formData, website_url: e.target.value })
                }
                dir="ltr"
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
