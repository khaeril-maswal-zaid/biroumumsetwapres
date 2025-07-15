'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Calendar, Car, Clock, Home, Package, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>;
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-800">Disetujui</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800">Ditolak</Badge>;
            case 'partial':
                return <Badge className="bg-blue-100 text-blue-800">Sebagian</Badge>;
            case 'approved':
                return <Badge className="bg-green-100 text-green-800">Disetujui</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

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
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(dashboardStats).map(([key, item]) => (
                        <Card key={key} className="gap-2">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                                {iconMap[item.icon]}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{item.total}</div>
                                <p className="text-xs text-muted-foreground">{item.pending} menunggu persetujuan</p>
                                <div className="flex items-center pt-1">
                                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">{item.todayBookings} hari ini</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Card className="gap-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Permintaan Kendaraan</CardTitle>
                            <Car className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">123</div>
                            <p className="text-xs text-muted-foreground">123 menunggu persetujuan</p>
                            <div className="flex items-center pt-1">
                                <Car className="mr-1 h-3 w-3 text-green-500" />
                                <span className="text-xs text-green-600">123 perjalanan aktif</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Activities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Aktivitas Terbaru</CardTitle>
                            <CardDescription>Permintaan dan laporan yang baru masuk</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="mb-2 flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex items-center gap-3">
                                            {getActivityIcon(activity.type)}
                                            <div>
                                                <p className="text-sm font-medium">{activity.title}</p>
                                                <p className="text-xs text-gray-500">oleh {activity.user}</p>
                                                <p className="text-xs text-gray-400">{activity.time}</p>
                                            </div>
                                        </div>
                                        {getStatusBadge(activity.status)}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Bookings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Jadwal Pemesanan Terdekat</CardTitle>
                            <CardDescription>Ruangan yang akan digunakan dalam 3 hari ke depan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingBookings.map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-blue-600" />
                                            <div>
                                                <p className="text-sm font-medium">{booking.room}</p>
                                                <p className="text-xs text-gray-500">{booking.user}</p>
                                                <p className="text-xs text-gray-400">{booking.purpose}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{booking.date}</p>
                                            <p className="text-xs text-gray-500">{booking.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 border-t pt-4">
                                <Link href="/admin/bookings">
                                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                                        Kelola Semua Booking
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
