import { StatusBadge } from '@/components/badges/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Car, Package, Wrench } from 'lucide-react';

interface ActivityItem {
    waktu: string;
    ruang: string;
    keterangan: string;
}

interface ActivityListProps {
    activities: ActivityItem[];
}

export function ActivityList({ activities }: ActivityListProps) {
    const getUrgencyBadge = (urgency: string) => {
        switch (urgency) {
            case 'rendah':
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Rendah</Badge>;
            case 'sedang':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Sedang</Badge>;
            case 'tinggi':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Tinggi</Badge>;
            case 'normal':
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Normal</Badge>;
            case 'mendesak':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Mendesak</Badge>;
            case 'segera':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Segera</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'booking':
                return <Calendar className="h-4 w-4" />;
            case 'vehicle':
                return <Car className="h-4 w-4" />;
            case 'supplies':
                return <Package className="h-4 w-4" />;
            case 'damage':
                return <Wrench className="h-4 w-4" />;
            default:
                return <Calendar className="h-4 w-4" />;
        }
    };

    return (
        <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Aktivitas</h2>
            <div className="space-y-3">
                <div className="space-y-3">
                    {activities.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <p className="text-gray-500">Tidak ada riwayat permintaan yang ditemukan</p>
                            </CardContent>
                        </Card>
                    ) : (
                        activities.map((request: any) => (
                            <Card key={request.code} className="py-2 transition-shadow hover:shadow-md">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-1 items-start space-x-3">
                                            <div className="mt-1 shrink-0">{getTypeIcon(request.id)}</div>
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 flex items-center gap-2">
                                                    <span className="font-mono text-xs text-gray-500">{request.code}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {request.type}
                                                    </Badge>
                                                </div>
                                                <h3 className="truncate font-semibold text-gray-900">{request.title}</h3>
                                                <p className="line-clamp-1 text-sm text-gray-600">{request?.info}</p>
                                                {/* <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                                    {request ? (
                                                        request.id !== 'booking' ? (
                                                            getUrgencyBadge(request.subtitle)
                                                        ) : (
                                                            <span>{request.subtitle}</span>
                                                        )
                                                    ) : null}
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <StatusBadge status={request.status} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
