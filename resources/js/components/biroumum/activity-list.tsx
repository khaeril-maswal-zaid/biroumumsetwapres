import { Card, CardContent } from "@/components/ui/card"

interface ActivityItem {
  waktu: string
  ruang: string
  keterangan: string
}

interface ActivityListProps {
  activities: ActivityItem[]
}

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Aktivitas</h2>
      <div className="space-y-3">
        {activities.map((item, index) => (
          <Card key={index} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {item.waktu} - {item.ruang}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{item.keterangan}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
