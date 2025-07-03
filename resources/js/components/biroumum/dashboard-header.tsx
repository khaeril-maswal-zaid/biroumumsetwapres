import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell } from "lucide-react"

interface DashboardHeaderProps {
  userName: string
  currentTime: string
}

export function DashboardHeader({ userName, currentTime }: DashboardHeaderProps) {
  return (
      <div className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt={userName} />
            <AvatarFallback>
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-gray-600">Selamat datang</p>
            <p className="font-semibold">{userName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-gray-600" />
        </div>
      </div>

  )
}
