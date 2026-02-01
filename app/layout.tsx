import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/layout/Sidebar"
import { Toaster } from "sonner"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "Elite Life - لوحة التحكم",
  description: "لوحة إدارة مركز إيليت لايف الطبي",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} antialiased bg-[#F9FAFB] min-h-screen`}>
        <div className="flex min-h-screen">
          <main className="flex-1 mr-64 p-6">{children}</main>
          <Sidebar />
        </div>
        <Toaster position="top-center" richColors dir="rtl" />
      </body>
    </html>
  )
}
