'use client';
import { StatusBadge } from '@/components/badges/StatusBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, Calendar, Car, Clock, Home, Package } from 'lucide-react';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: '/dashboard',
    },
];

const iconMap = {
    room: <Home className="h-4 w-4 text-muted-foreground" />,
    damage: <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
    supplies: <Package className="h-4 w-4 text-muted-foreground" />,
};

export default function AdminDashboard({ dashboardStats, recentActivities, upcomingBookings }: any) {
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['dashboardStats', 'recentActivities', 'upcomingBookings'],
            });
        }, 60 * 1000); // 60 detik

        return () => clearInterval(interval);
    }, []);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'room':
                return <Home className="h-4 w-4 text-blue-600" />;
            case 'damage':
                return <AlertTriangle className="h-4 w-4 text-red-600" />;
            case 'vehicle':
                return <Car className="h-4 w-4 text-green-600" />;
            case 'supplies':
                return <Package className="h-4 w-4 text-purple-600" />;
            default:
                return <Clock className="h-4 w-4 text-gray-600" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-linear-to-br from-white to-blue-100 p-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 xl:gap-6">
                    {Object.entries(dashboardStats).map(([key, item], index: any) => (
                        <Card key={index} className="gap-2">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                                {iconMap[item.icon]}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {item.total} <span className="text-sm">Total {item.title.split(' ')[0]}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{item.pending} menunggu persetujuan</p>
                            </CardContent>
                        </Card>
                    ))}

                    <Card className="gap-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Permintaan Kendaraan</CardTitle>
                            <Car className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                123 <span className="text-sm">Total Permintaan</span>
                            </div>
                            <p className="text-xs text-muted-foreground">123 menunggu persetujuan</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:gap-6">
                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Aktivitas Terbaru</CardTitle>
                            <CardDescription>Permintaan dan laporan yang baru masuk</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity: any, index: any) => (
                                    <div key={index} className="mb-2 flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex items-center gap-3">
                                            {getActivityIcon(activity.type)}
                                            <div className="pe-3">
                                                <p className="text-sm font-medium">{activity.title}</p>
                                                <p className="line-clamp-1 text-xs text-gray-500">Oleh {activity.user}</p>
                                                <p className="text-xs text-gray-400">{activity.time}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={activity.status} isRead={activity.isRead} />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Bookings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Jadwal Pemesanan Ruangan Terdekat</CardTitle>
                            <CardDescription>Ruangan yang akan digunakan dalam 5 hari ke depan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingBookings.map((booking: any, index: any) => (
                                    <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex min-w-0 flex-1 items-center gap-3">
                                            <Calendar className="h-7 w-7 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium">{booking.room}</p>
                                                <p className="text-xs text-gray-500">{booking.user}</p>
                                                <p className="text-xs text-gray-400">{booking.purpose}</p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 flex-col items-end text-right">
                                            <p className="text-sm font-medium">{booking.date}</p>
                                            <p className="text-xs text-gray-500">{booking.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* <div className="mt-4 border-t pt-4">
                                <Link href="/admin/bookings">
                                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                                        Kelola Semua Booking
                                    </Button>
                                </Link>
                            </div> */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
