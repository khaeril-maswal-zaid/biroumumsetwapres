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

const iconMap = {
    totalBookings: Calendar,
    approved: User,
    rejected: Clock,
    pending: MapPin,
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
                                    <CardDescription>Distribusi pemesanan berdasarkan jam</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={peakHours}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="hour" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="bookings" fill="#3b82f6" name="Jumlah Pemesanan" />
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

                        {/* Duration Analysis */}
                        <Card className="">
                            <CardHeader>
                                <CardTitle>Analisis Durasi Penggunaan</CardTitle>
                                <CardDescription>Rata-rata durasi penggunaan ruangan per hari</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {weeklyPattern.map((day: any) => (
                                        <div key={day.day} className="flex items-center justify-between rounded-lg border p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 font-medium">{day.day}</div>
                                                <div className="text-sm text-gray-600">{day.bookings} pemesanan</div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{day.avgDuration} jam</p>
                                                <p className="text-sm text-gray-500">rata-rata</p>
                                            </div>
                                        </div>
                                    ))}
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
