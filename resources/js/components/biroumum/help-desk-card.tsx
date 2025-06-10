import { Card, CardContent } from "@/components/ui/card"
import { Headphones } from "lucide-react"

export function HelpDeskCard() {
  return (
    <Card className="bg-yellow-100 border-yellow-200 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
            <Headphones className="w-6 h-6 text-yellow-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">Help Desk Biro Umum</h3>
            <p className="text-sm text-gray-600">+62</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
