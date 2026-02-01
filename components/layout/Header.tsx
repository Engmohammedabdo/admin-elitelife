"use client"

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-[#722F37]">{title}</h1>
      {description && (
        <p className="text-gray-600 mt-1">{description}</p>
      )}
    </div>
  )
}
