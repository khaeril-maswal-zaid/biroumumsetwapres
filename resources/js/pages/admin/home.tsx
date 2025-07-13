'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Calendar, Car, Clock, Home, Package, TrendingUp } from 'lucide-react';

// Mock data yang sesuai dengan struktur form user
const dashboardStats = {
    roomBookings: {
        total: 45,
        pending: 8,
        approved: 32,
        rejected: 5,
        todayBookings: 6,
    },
    damageReports: {
        total: 23,
        pending: 5,
        inProgress: 12,
        completed: 6,
        urgentReports: 3,
    },
    vehicleRequests: {
        total: 18,
        pending: 4,
        approved: 11,
        rejected: 3,
        activeTrips: 7,
    },
    suppliesRequests: {
        total: 67,
        pending: 12,
        approved: 48,
        rejected: 7,
        processingToday: 15,
    },
};

const recentActivities = [
    {
        id: 1,
        type: 'room',
        title: 'Permintaan Ruang Meeting A',
        user: 'Dani Martinez',
        time: '2 jam yang lalu',
        status: 'pending',
    },
    {
        id: 2,
        type: 'damage',
        title: 'Laporan Kerusakan AC',
        user: 'Siti Aminah',
        time: '4 jam yang lalu',
        status: 'in_progress',
    },
    {
        id: 3,
        type: 'vehicle',
        title: 'Permintaan Kendaraan Dinas',
        user: 'Budi Santoso',
        time: '6 jam yang lalu',
        status: 'approved',
    },
    {
        id: 4,
        type: 'supplies',
        title: 'Permintaan ATK Biro 2',
        user: 'Rudi Hartono',
        time: '1 hari yang lalu',
        status: 'completed',
    },
];

const upcomingBookings = [
    {
        id: 1,
        room: 'Ruang Meeting A',
        user: 'Tim Marketing',
        date: 'Besok',
        time: '09:00 - 11:00',
        purpose: 'Rapat Bulanan',
    },
    {
        id: 2,
        room: 'Auditorium',
        user: 'HR Department',
        date: '15 Jan 2025',
        time: '14:00 - 16:00',
        purpose: 'Training Karyawan',
    },
    {
        id: 3,
        room: 'Ruang Meeting B',
        user: 'Tim IT',
        date: '16 Jan 2025',
        time: '10:00 - 12:00',
        purpose: 'Review Sistem',
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function AdminDashboard() {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>;
            case 'approved':
                return <Badge className="bg-green-100 text-green-800">Disetujui</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800">Ditolak</Badge>;
            case 'in_progress':
                return <Badge className="bg-blue-100 text-blue-800">Proses</Badge>;
            case 'completed':
                return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
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
                <div className="space-y-6 p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Booking Ruangan</CardTitle>
                                <Home className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboardStats.roomBookings.total}</div>
                                <p className="text-xs text-muted-foreground">{dashboardStats.roomBookings.pending} menunggu persetujuan</p>
                                <div className="flex items-center pt-1">
                                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">{dashboardStats.roomBookings.todayBookings} booking hari ini</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Laporan Kerusakan</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboardStats.damageReports.total}</div>
                                <p className="text-xs text-muted-foreground">{dashboardStats.damageReports.pending} belum ditangani</p>
                                <div className="flex items-center pt-1">
                                    <AlertTriangle className="mr-1 h-3 w-3 text-red-500" />
                                    <span className="text-xs text-red-600">{dashboardStats.damageReports.urgentReports} laporan mendesak</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Permintaan Kendaraan</CardTitle>
                                <Car className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboardStats.vehicleRequests.total}</div>
                                <p className="text-xs text-muted-foreground">{dashboardStats.vehicleRequests.pending} menunggu persetujuan</p>
                                <div className="flex items-center pt-1">
                                    <Car className="mr-1 h-3 w-3 text-green-500" />
                                    <span className="text-xs text-green-600">{dashboardStats.vehicleRequests.activeTrips} perjalanan aktif</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Permintaan ATK</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboardStats.suppliesRequests.total}</div>
                                <p className="text-xs text-muted-foreground">{dashboardStats.suppliesRequests.pending} menunggu persetujuan</p>
                                <div className="flex items-center pt-1">
                                    <Package className="mr-1 h-3 w-3 text-blue-500" />
                                    <span className="text-xs text-blue-600">{dashboardStats.suppliesRequests.processingToday} diproses hari ini</span>
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
                                        <div key={activity.id} className="flex items-center justify-between rounded-lg border p-3">
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
                                <div className="mt-4 border-t pt-4">
                                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                                        Lihat Semua Aktivitas
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Upcoming Bookings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Mendatang</CardTitle>
                                <CardDescription>Ruangan yang akan digunakan dalam 2 hari ke depan</CardDescription>
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

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Aksi Cepat</CardTitle>
                            <CardDescription>Akses cepat ke fungsi admin yang sering digunakan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                <Link href="/admin/bookings">
                                    <Button variant="outline" className="flex h-20 w-full flex-col gap-2 bg-transparent">
                                        <Home className="h-6 w-6" />
                                        <span className="text-sm">Kelola Booking</span>
                                    </Button>
                                </Link>
                                <Link href="/admin/damages">
                                    <Button variant="outline" className="flex h-20 w-full flex-col gap-2 bg-transparent">
                                        <AlertTriangle className="h-6 w-6" />
                                        <span className="text-sm">Laporan Kerusakan</span>
                                    </Button>
                                </Link>
                                <Link href="/admin/vehicles">
                                    <Button variant="outline" className="flex h-20 w-full flex-col gap-2 bg-transparent">
                                        <Car className="h-6 w-6" />
                                        <span className="text-sm">Kelola Kendaraan</span>
                                    </Button>
                                </Link>
                                <Link href="/admin/supplies">
                                    <Button variant="outline" className="flex h-20 w-full flex-col gap-2 bg-transparent">
                                        <Package className="h-6 w-6" />
                                        <span className="text-sm">Kelola ATK</span>
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
