"use client"

import { Button } from "@/components/ui/button"
import { Home, Calendar, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 ${pathname === "/" ? "text-blue-600" : "text-gray-600"}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Beranda</span>
          </Button>
        </Link>
        <Link href="/booking">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 ${
              pathname === "/booking" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Booking</span>
          </Button>
        </Link>
        <Link href="/profile">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 ${
              pathname === "/profile" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profil</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
