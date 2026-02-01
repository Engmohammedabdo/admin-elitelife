"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Config } from "@/types/database"
import { toast } from "sonner"

export function useConfig() {
  const [config, setConfig] = useState<Config[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from("config")
      .select("*")
      .order("key", { ascending: true })

    if (error) {
      setError(error.message)
      toast.error("خطأ في تحميل الإعدادات")
    } else {
      setConfig(data || [])
    }

    setLoading(false)
  }, [])

  const getConfigValue = (key: string): string | null => {
    const item = config.find((c) => c.key === key)
    return item?.value || null
  }

  const updateConfig = async (key: string, value: string, description?: string) => {
    const { error } = await supabase
      .from("config")
      .upsert(
        { key, value, description },
        { onConflict: "key" }
      )

    if (error) {
      toast.error("خطأ في حفظ الإعداد")
      return false
    }

    toast.success("تم حفظ الإعداد بنجاح")
    await fetchConfig()
    return true
  }

  const updateMultipleConfig = async (configs: { key: string; value: string; description?: string }[]) => {
    const { error } = await supabase
      .from("config")
      .upsert(configs, { onConflict: "key" })

    if (error) {
      toast.error("خطأ في حفظ الإعدادات")
      return false
    }

    toast.success("تم حفظ الإعدادات بنجاح")
    await fetchConfig()
    return true
  }

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  return {
    config,
    loading,
    error,
    fetchConfig,
    getConfigValue,
    updateConfig,
    updateMultipleConfig,
  }
}
