'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, Clock, MapPin, TrendingDown, TrendingUp, User } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const iconMap: any = {
    totalBookings: Calendar,
    approved: User,
    rejected: Clock,
    pending: MapPin,
};

// Mock data for weekly booking schedule
const weeklySchedule = [
    {
        room: 'Ruang Rapat A',
        bookings: {
            monday: [{ time: '09:00-11:00', user: 'Dani Martinez', purpose: 'Rapat Koordinasi' }],
            tuesday: [
                { time: '10:00-12:00', user: 'Siti Aminah', purpose: 'Presentasi' },
                { time: '14:00-16:00', user: 'Budi Santoso', purpose: 'Training' },
            ],
            wednesday: [],
            thursday: [{ time: '13:00-15:00', user: 'Dewi Lestari', purpose: 'Meeting Klien' }],
            friday: [{ time: '09:00-10:30', user: 'Rudi Hartono', purpose: 'Workshop' }],
            saturday: [],
            sunday: [],
        },
    },
    {
        room: 'Ruang Rapat B',
        bookings: {
            monday: [{ time: '14:00-16:00', user: 'Ahmad Fauzi', purpose: 'Rapat Koordinasi' }],
            tuesday: [],
            wednesday: [
                { time: '09:00-11:00', user: 'Lisa Permata', purpose: 'Presentasi' },
                { time: '13:00-14:30', user: 'Eko Prasetyo', purpose: 'Training' },
            ],
            thursday: [],
            friday: [{ time: '10:00-12:00', user: 'Maya Sari', purpose: 'Meeting Klien' }],
            saturday: [{ time: '09:00-12:00', user: 'Toni Wijaya', purpose: 'Workshop' }],
            sunday: [],
        },
    },
    {
        room: 'Ruang Rapat C',
        bookings: {
            monday: [],
            tuesday: [{ time: '09:00-10:00', user: 'Rina Kusuma', purpose: 'Rapat Koordinasi' }],
            wednesday: [{ time: '14:00-17:00', user: 'Hadi Nugroho', purpose: 'Training' }],
            thursday: [
                { time: '09:00-11:00', user: 'Sari Indah', purpose: 'Presentasi' },
                { time: '13:00-15:00', user: 'Joko Susilo', purpose: 'Meeting Klien' },
            ],
            friday: [],
            saturday: [],
            sunday: [],
        },
    },
    {
        room: 'Ruang Rapat D',
        bookings: {
            monday: [{ time: '10:00-12:00', user: 'Fitri Handayani', purpose: 'Workshop' }],
            tuesday: [],
            wednesday: [],
            thursday: [{ time: '14:00-16:00', user: 'Agus Setiawan', purpose: 'Rapat Koordinasi' }],
            friday: [{ time: '09:00-11:00', user: 'Nita Sari', purpose: 'Presentasi' }],
            saturday: [],
            sunday: [],
        },
    },
    {
        room: 'Ruang Rapat E',
        bookings: {
            monday: [{ time: '13:00-15:00', user: 'Bambang Tri', purpose: 'Training' }],
            tuesday: [{ time: '10:00-12:00', user: 'Wati Lestari', purpose: 'Meeting Klien' }],
            wednesday: [],
            thursday: [],
            friday: [{ time: '14:00-16:00', user: 'Dedi Kurnia', purpose: 'Workshop' }],
            saturday: [],
            sunday: [],
        },
    },
    {
        room: 'Aula Utama',
        bookings: {
            monday: [],
            tuesday: [],
            wednesday: [{ time: '09:00-17:00', user: 'Tim HR', purpose: 'Training Besar' }],
            thursday: [],
            friday: [],
            saturday: [{ time: '08:00-12:00', user: 'Divisi IT', purpose: 'Workshop' }],
            sunday: [],
        },
    },
];

const daysOfWeek = [
    { key: 'monday', label: 'Senin', short: 'Sen' },
    { key: 'tuesday', label: 'Selasa', short: 'Sel' },
    { key: 'wednesday', label: 'Rabu', short: 'Rab' },
    { key: 'thursday', label: 'Kamis', short: 'Kam' },
    { key: 'friday', label: 'Jumat', short: 'Jum' },
    { key: 'saturday', label: 'Sabtu', short: 'Sab' },
    { key: 'sunday', label: 'Minggu', short: 'Min' },
];

// Get current day for highlighting
const getCurrentDay = () => {
    const today = new Date().getDay();
    const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return dayMap[today];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function BookingReports({
    penggunaanRuangan,
    divisionUsage,
    topUsers,
    summaryData,
    statusDistribution,
    peakHours,
    monthlyTrend,
    weeklyPattern,
    weeklySchedule,
}: any) {
    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    const formatHours = (hours: number) => {
        return `${hours} jam`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Laporan Pemesanan Ruangan</h1>
                            <p className="text-gray-500">Analisis dan statistik pemesanan ruangan fasilitas</p>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="summary" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="summary">Ringkasan</TabsTrigger>
                        <TabsTrigger value="utilization">Penggunaan Ruangan</TabsTrigger>
                        <TabsTrigger value="patterns">Pola Penggunaan</TabsTrigger>
                        <TabsTrigger value="analytics">Analisis Pengguna</TabsTrigger>
                    </TabsList>

                    {/* Summary Tab */}
                    <TabsContent value="summary" className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {Object.entries(summaryData).map(([key, item]: any) => {
                                const Icon = iconMap[key] || Calendar;
                                const TrendIcon = item.trend === 'up' ? TrendingUp : TrendingDown;
                                const trendColor = item.trend === 'up' ? 'text-green-500' : 'text-red-500';
                                const trendPrefix = item.trend === 'up' ? '+' : '';

                                return (
                                    <Card key={key} className="gap-0">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">{item.value}</div>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <TrendIcon className={`mr-1 h-3 w-3 ${trendColor}`} />
                                                {trendPrefix}
                                                {Math.abs(item.change)} dari bulan lalu
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Charts Row */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Status Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Distribusi Status Pemesanan</CardTitle>
                                    <CardDescription>Persentase status pemesanan ruangan</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={statusDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {statusDistribution.map((entry: any, index: any) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Peak Hours */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Jam Sibuk Pemesanan</CardTitle>
                                    <CardDescription>Distribusi jumlah pemesanan berdasarkan jam operasional</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[350px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={peakHours} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="hour" interval={0} angle={-45} textAnchor="end" tick={{ fontSize: 12 }} />
                                                <YAxis tick={{ fontSize: 12 }} />
                                                <Tooltip />
                                                <Bar dataKey="bookings" fill="#3b82f6" name="Jumlah Pemesanan" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Utilization Tab */}
                    <TabsContent value="utilization" className="space-y-6">
                        {/* Room Utilization */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tingkat Utilisasi Ruangan</CardTitle>
                                <CardDescription>Analisis penggunaan ruangan berdasarkan kapasitas dan waktu</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {penggunaanRuangan.map((room: any) => (
                                        <div key={room.room} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium">{room.room}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {room.bookings} pemesanan • {formatHours(room.hours)} • Kapasitas {room.capacity} orang
                                                    </p>
                                                </div>
                                                <Badge className="bg-green-100 text-green-800">{room.percent} % Penggunaan</Badge>
                                            </div>
                                            <Progress value={room.percent} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Patterns Tab */}
                    <TabsContent value="patterns" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Weekly Pattern */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pola Mingguan</CardTitle>
                                    <CardDescription>Distribusi pemesanan berdasarkan hari dalam seminggu</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={weeklyPattern}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="day" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="bookings" fill="#3b82f6" name="Jumlah Pemesanan" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Monthly Bookings Trend */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tren Pemesanan Bulanan</CardTitle>
                                    <CardDescription>Perkembangan jumlah pemesanan dalam 6 bulan terakhir</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={monthlyTrend}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip />
                                                <Area
                                                    type="monotone"
                                                    dataKey="bookings"
                                                    stackId="1"
                                                    stroke="#3b82f6"
                                                    fill="#3b82f6"
                                                    fillOpacity={0.6}
                                                    name="Total Pemesanan"
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="approved"
                                                    stackId="2"
                                                    stroke="#10b981"
                                                    fill="#10b981"
                                                    fillOpacity={0.6}
                                                    name="Disetujui"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Weekly Booking Schedule */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pemantauan Jadwal Pemesanan Mingguan</CardTitle>
                                <CardDescription>Jadwal pemesanan ruangan yang telah disetujui untuk minggu ini</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-4">
                                    {/* Desktop View */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="w-32 border-b p-3 text-left font-medium">Ruangan</th>
                                                    {daysOfWeek.map((day) => (
                                                        <th
                                                            key={day.key}
                                                            className={`min-w-[120px] border-b p-3 text-center font-medium ${
                                                                getCurrentDay() === day.key ? 'border-blue-200 bg-blue-50 text-blue-900' : ''
                                                            }`}
                                                        >
                                                            {day.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {weeklySchedule.map((room) => (
                                                    <tr key={room.room} className="hover:bg-gray-50">
                                                        <td className="border-b p-3 text-sm font-medium">{room.room}</td>
                                                        {daysOfWeek.map((day) => {
                                                            const bookings = room.bookings[day.key as keyof typeof room.bookings];
                                                            const isToday = getCurrentDay() === day.key;

                                                            return (
                                                                <td
                                                                    key={day.key}
                                                                    className={`border-b p-2 text-center ${isToday ? 'border-blue-200 bg-blue-50' : ''}`}
                                                                >
                                                                    {bookings.length > 0 ? (
                                                                        <div className="space-y-1">
                                                                            {bookings.map((booking, index) => (
                                                                                <div key={index} className="group relative">
                                                                                    <Badge
                                                                                        variant="secondary"
                                                                                        className={`cursor-pointer px-2 py-1 text-xs ${
                                                                                            isToday
                                                                                                ? 'bg-blue-200 text-blue-800 hover:bg-blue-300'
                                                                                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                                        }`}
                                                                                    >
                                                                                        {booking.time}
                                                                                    </Badge>
                                                                                    {/* Tooltip */}
                                                                                    <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform rounded-lg bg-gray-900 px-3 py-2 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                                                        <div className="font-medium">{booking.user}</div>
                                                                                        <div>{booking.purpose}</div>
                                                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 transform border-4 border-transparent border-t-gray-900"></div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                            {bookings.length > 1 && (
                                                                                <div className="mt-1 text-xs text-gray-500">
                                                                                    {bookings.length} pemesanan
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-xs text-gray-300">-</div>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Legend */}
                                    <div className="flex flex-wrap items-center gap-4 border-t pt-4">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                09:00-11:00
                                            </Badge>
                                            <span className="text-sm text-gray-600">Pemesanan Terjadwal</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                                                09:00-11:00
                                            </Badge>
                                            <span className="text-sm text-gray-600">Pemesanan Hari Ini</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 rounded border bg-gray-100"></div>
                                            <span className="text-sm text-gray-600">Tidak Ada Pemesanan</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Top Users */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top 5 Pengguna Aktif</CardTitle>
                                    <CardDescription>Pengguna yang paling sering memesan ruangan</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {topUsers.map((user: any, index: any) => (
                                            <div key={user.name} className="flex items-center justify-between rounded-lg border p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-sm text-gray-500">{user.division}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">{user.bookings} pemesanan</p>
                                                    <p className="text-sm text-gray-500">{formatHours(user.hours)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Division Usage */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Penggunaan per Divisi</CardTitle>
                                    <CardDescription>Statistik pemesanan berdasarkan divisi</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {divisionUsage.map((division: any) => (
                                            <div key={division.division} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium">{division.division}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            {division.bookings} pemesanan • {formatHours(division.hours)}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline">{division.bookings}</Badge>
                                                </div>
                                                <Progress value={(division.bookings / 68) * 100} className="h-2" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
