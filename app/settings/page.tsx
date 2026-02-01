"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Building2, Phone, Globe, Clock, Star, Image } from "lucide-react"
import { useConfig } from "@/hooks/useConfig"
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton"
import { Header } from "@/components/layout/Header"

interface SettingsForm {
  // Clinic Info
  clinic_name_ar: string
  clinic_name_en: string
  clinic_address: string
  clinic_phone: string
  // Assistant Info
  assistant_name_ar: string
  assistant_name_en: string
  // Working Hours
  working_hours_start: string
  working_hours_end: string
  // Durations
  consultation_duration: string
  procedure_duration: string
  // Links
  google_maps_link: string
  google_review_link: string
  instagram_url: string
  website_url: string
  logo_url: string
}

export default function SettingsPage() {
  const { config, loading, updateMultipleConfig, getConfigValue } = useConfig()
  const [formData, setFormData] = useState<SettingsForm>({
    clinic_name_ar: "",
    clinic_name_en: "",
    clinic_address: "",
    clinic_phone: "",
    assistant_name_ar: "",
    assistant_name_en: "",
    working_hours_start: "09:00",
    working_hours_end: "20:00",
    consultation_duration: "30",
    procedure_duration: "60",
    google_maps_link: "",
    google_review_link: "",
    instagram_url: "",
    website_url: "",
    logo_url: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (config.length > 0) {
      setFormData({
        clinic_name_ar: getConfigValue("clinic_name_ar") || "",
        clinic_name_en: getConfigValue("clinic_name_en") || "",
        clinic_address: getConfigValue("clinic_address") || "",
        clinic_phone: getConfigValue("clinic_phone") || "",
        assistant_name_ar: getConfigValue("assistant_name_ar") || "",
        assistant_name_en: getConfigValue("assistant_name_en") || "",
        working_hours_start: getConfigValue("working_hours_start") || "09:00",
        working_hours_end: getConfigValue("working_hours_end") || "20:00",
        consultation_duration: getConfigValue("consultation_duration") || "30",
        procedure_duration: getConfigValue("procedure_duration") || "60",
        google_maps_link: getConfigValue("google_maps_link") || "",
        google_review_link: getConfigValue("google_review_link") || "",
        instagram_url: getConfigValue("instagram_url") || "",
        website_url: getConfigValue("website_url") || "",
        logo_url: getConfigValue("logo_url") || "",
      })
    }
  }, [config])

  const handleSave = async () => {
    setIsSaving(true)

    const configs = [
      { key: "clinic_name_ar", value: formData.clinic_name_ar, description: "Clinic name in Arabic" },
      { key: "clinic_name_en", value: formData.clinic_name_en, description: "Clinic name in English" },
      { key: "clinic_address", value: formData.clinic_address, description: "Clinic address" },
      { key: "clinic_phone", value: formData.clinic_phone, description: "Clinic phone number" },
      { key: "assistant_name_ar", value: formData.assistant_name_ar, description: "اسم المساعد الذكي بالعربية" },
      { key: "assistant_name_en", value: formData.assistant_name_en, description: "اسم المساعد الذكي بالإنجليزية" },
      { key: "working_hours_start", value: formData.working_hours_start, description: "Clinic opening time" },
      { key: "working_hours_end", value: formData.working_hours_end, description: "Clinic closing time" },
      { key: "consultation_duration", value: formData.consultation_duration, description: "Consultation duration in minutes" },
      { key: "procedure_duration", value: formData.procedure_duration, description: "Procedure duration in minutes" },
      { key: "google_maps_link", value: formData.google_maps_link, description: "Google Maps link" },
      { key: "google_review_link", value: formData.google_review_link, description: "Google Review link" },
      { key: "instagram_url", value: formData.instagram_url, description: "رابط انستغرام" },
      { key: "website_url", value: formData.website_url, description: "رابط الموقع الإلكتروني" },
      { key: "logo_url", value: formData.logo_url, description: "Logo URL" },
    ]

    await updateMultipleConfig(configs)
    setIsSaving(false)
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
        {/* Clinic Info */}
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
                  value={formData.clinic_name_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, clinic_name_ar: e.target.value })
                  }
                  dir="rtl"
                  placeholder="مركز إيليت لايف الطبي"
                />
              </div>
              <div className="space-y-2">
                <Label>اسم المركز بالإنجليزية</Label>
                <Input
                  value={formData.clinic_name_en}
                  onChange={(e) =>
                    setFormData({ ...formData, clinic_name_en: e.target.value })
                  }
                  dir="ltr"
                  placeholder="Elite Life Medical Centre"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>العنوان</Label>
              <Input
                value={formData.clinic_address}
                onChange={(e) =>
                  setFormData({ ...formData, clinic_address: e.target.value })
                }
                dir="ltr"
                placeholder="Jumeirah Beach Road, Near Jumeirah Plaza Villa No.87"
              />
            </div>

            <div className="space-y-2">
              <Label>رقم الهاتف</Label>
              <Input
                value={formData.clinic_phone}
                onChange={(e) =>
                  setFormData({ ...formData, clinic_phone: e.target.value })
                }
                dir="ltr"
                placeholder="+971 4 3495363"
              />
            </div>
          </CardContent>
        </Card>

        {/* Assistant Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-[#722F37]" />
              المساعد الذكي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم المساعد بالعربية</Label>
                <Input
                  value={formData.assistant_name_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, assistant_name_ar: e.target.value })
                  }
                  dir="rtl"
                  placeholder="بايرا"
                />
              </div>
              <div className="space-y-2">
                <Label>اسم المساعد بالإنجليزية</Label>
                <Input
                  value={formData.assistant_name_en}
                  onChange={(e) =>
                    setFormData({ ...formData, assistant_name_en: e.target.value })
                  }
                  dir="ltr"
                  placeholder="Pyra"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-[#722F37]" />
              ساعات العمل والمدد
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>وقت الفتح</Label>
                <Input
                  type="time"
                  value={formData.working_hours_start}
                  onChange={(e) =>
                    setFormData({ ...formData, working_hours_start: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>وقت الإغلاق</Label>
                <Input
                  type="time"
                  value={formData.working_hours_end}
                  onChange={(e) =>
                    setFormData({ ...formData, working_hours_end: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>مدة الاستشارة (بالدقائق)</Label>
                <Input
                  type="number"
                  value={formData.consultation_duration}
                  onChange={(e) =>
                    setFormData({ ...formData, consultation_duration: e.target.value })
                  }
                  placeholder="30"
                />
              </div>
              <div className="space-y-2">
                <Label>مدة الإجراء (بالدقائق)</Label>
                <Input
                  type="number"
                  value={formData.procedure_duration}
                  onChange={(e) =>
                    setFormData({ ...formData, procedure_duration: e.target.value })
                  }
                  placeholder="60"
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>رابط خرائط جوجل</Label>
                <Input
                  value={formData.google_maps_link}
                  onChange={(e) =>
                    setFormData({ ...formData, google_maps_link: e.target.value })
                  }
                  dir="ltr"
                  placeholder="https://maps.app.goo.gl/..."
                />
              </div>
              <div className="space-y-2">
                <Label>رابط تقييم جوجل</Label>
                <Input
                  value={formData.google_review_link}
                  onChange={(e) =>
                    setFormData({ ...formData, google_review_link: e.target.value })
                  }
                  dir="ltr"
                  placeholder="https://www.google.com/search?q=..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>رابط انستغرام</Label>
                <Input
                  value={formData.instagram_url}
                  onChange={(e) =>
                    setFormData({ ...formData, instagram_url: e.target.value })
                  }
                  dir="ltr"
                  placeholder="https://www.instagram.com/..."
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
                  placeholder="https://elitelifemedicalcentre.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>رابط الشعار (Logo URL)</Label>
              <Input
                value={formData.logo_url}
                onChange={(e) =>
                  setFormData({ ...formData, logo_url: e.target.value })
                }
                dir="ltr"
                placeholder="https://..."
              />
              {formData.logo_url && (
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={formData.logo_url}
                    alt="Logo Preview"
                    className="max-h-20 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
