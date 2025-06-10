"use client"

import { Button } from "@/components/ui/button"
import { Home, Calendar, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function DesktopNavigation() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-6">
        <Link href="/">
          <Button variant={pathname === "/" ? "default" : "ghost"} className="flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Beranda</span>
          </Button>
        </Link>
        <Link href="/booking">
          <Button variant={pathname === "/booking" ? "default" : "ghost"} className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Booking</span>
          </Button>
        </Link>
        <Link href="/profile">
          <Button variant={pathname === "/profile" ? "default" : "ghost"} className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Profil</span>
          </Button>
        </Link>
      </div>
    </nav>
  )
}
