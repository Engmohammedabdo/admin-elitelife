import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { ar } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DUBAI_TIMEZONE = "Asia/Dubai"

export function formatDateDubai(date: Date | string, formatStr: string = "yyyy-MM-dd"): string {
  const zonedDate = toZonedTime(new Date(date), DUBAI_TIMEZONE)
  return format(zonedDate, formatStr, { locale: ar })
}

export function formatTimeDubai(time: string): string {
  const [hours, minutes] = time.split(":")
  const hour = parseInt(hours)
  const period = hour >= 12 ? "م" : "ص"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${period}`
}

export function formatDateArabic(date: Date | string): string {
  const zonedDate = toZonedTime(new Date(date), DUBAI_TIMEZONE)
  return format(zonedDate, "d MMMM yyyy", { locale: ar })
}

export async function generateCode(prefix: string, supabase: any, table: string): Promise<string> {
  const { data } = await supabase
    .from(table)
    .select("code")
    .order("code", { ascending: false })
    .limit(1)

  if (!data || data.length === 0) {
    return `${prefix}-0001`
  }

  const lastCode = data[0].code
  const lastNumber = parseInt(lastCode.split("-")[1])
  const newNumber = (lastNumber + 1).toString().padStart(4, "0")
  return `${prefix}-${newNumber}`
}
