"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Wrench, Car, PenTool } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface ServiceItem {
  icon: LucideIcon
  label: string
  href: string
}

export function ServiceMenu() {
  const layananItems: ServiceItem[] = [
    {
      icon: Users,
      label: "Pemesanan Ruang Rapat",
      href: "/booking",
    },
    {
      icon: Wrench,
      label: "Kerusakan Gedung",
      href: "/damage",
    },
    {
      icon: Car,
      label: "Permintaan Kendaraan",
      href: "/vehicle",
    },
    {
      icon: PenTool,
      label: "Permintaan Alat Tulis Kantor",
      href: "/supplies",
    },
  ]

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Layanan Biro Umum</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {layananItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700 leading-tight">{item.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
