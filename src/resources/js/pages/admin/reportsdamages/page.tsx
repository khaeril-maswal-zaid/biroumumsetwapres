'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, MapPin, TrendingDown, TrendingUp, Users, XCircle } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const iconMap: any = {
    totalReports: Calendar,
    pending: Clock,
    confirmed: CheckCircle,
    cancelled: XCircle,
};

export default function DamageReports({
    monthlyTrend,
    locationData,
    divisionReports,
    topReportersData,
    summaryData,
    statusDistribution,
    damageTypeData,
    urgencyData,
}: any) {
    console.log(monthlyTrend);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-linear-to-br from-white to-blue-100 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="ps-2">
                            <h1 className="text-lg font-bold tracking-tight">Dashboard laporan Kerusakan Gedung</h1>
                            <p className="text-sm text-gray-500">Analisis mendalam tentang laporan kerusakan fasilitas.</p>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="summary" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="summary">Ringkasan</TabsTrigger>
                        <TabsTrigger value="analysis">Analisis Kerusakan</TabsTrigger>
                        <TabsTrigger value="trends">Analisa Pengguna</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="space-y-6">
                        {/* Key Metrics */}
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
                                            <div className="text-4xl font-bold">{item.value}</div>
                                            {/* <div className="flex items-center text-xs text-muted-foreground">
                                                <TrendIcon className={`mr-1 h-3 w-3 ${trendColor}`} />
                                                {trendPrefix}
                                                {Math.abs(item.change)} dari bulan lalu
                                            </div> */}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Status Distribution */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card className="pb-0">
                                <CardHeader>
                                    <CardTitle>Distribusi Status Pemesanan</CardTitle>
                                    <CardDescription>Persentase status pemesanan ruangan</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height={'100%'}>
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

                            <Card className="gap-0">
                                <CardHeader>
                                    <CardTitle>Tren Permintaan Bulanan</CardTitle>
                                    <CardDescription>Perkembangan jumlah permintaan ATK dalam 6 bulan terakhir</CardDescription>
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
                                                    dataKey="requests"
                                                    stackId="1"
                                                    stroke="#3b82f6"
                                                    fill="#3b82f6"
                                                    fillOpacity={0.6}
                                                    name="Total Permintaan"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-6">
                        {/* Damage Types */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* <Card>
                                <CardHeader>
                                    <CardTitle>Tingkat Urgensi Laporan</CardTitle>
                                    <CardDescription>Distribusi laporan berdasarkan tingkat urgensi</CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <PieChart>
                                            <Pie
                                                data={urgencyData}
                                                cx="40%" // agak geser ke kiri karena legend nanti di kanan
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                dataKey="value"
                                                nameKey="name"
                                                paddingAngle={3}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {urgencyData.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card> */}

                            <Card className="pb-0">
                                <CardHeader>
                                    <CardTitle>Waktu Respons per Kategori</CardTitle>
                                    <CardDescription>Rata-rata waktu respons dalam hari</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height={500}>
                                            <BarChart data={damageTypeData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" fontSize={12} />
                                                <YAxis fontSize={12} />
                                                <Tooltip
                                                    formatter={(value: any) => [`${value} laporan`, 'Jumlah']}
                                                    labelFormatter={(label) => `Kategori: ${label}`}
                                                />
                                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Lokasi Rawan Kerusakan</CardTitle>
                                    <CardDescription>5 lokasi teratas dengan laporan kerusakan paling banyak.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {locationData.slice(0, 6).map((location: any, index: any) => (
                                            <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="h-4 w-4 text-gray-500" />
                                                    <div>
                                                        <div className="font-medium">{location.location}</div>
                                                        <div className="text-sm text-gray-500">{location.reports} laporan</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium">{location.resolved} selesai</div>
                                                    <div className="text-xs text-gray-500">
                                                        {location.reports > 0 ? Math.round((location.resolved / location.reports) * 100) : 0}% selesai
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="trends" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Top Reporters */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pelapor Paling Aktif</CardTitle>
                                    <CardDescription>Karyawan yang paling sering melaporkan kerusakan</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {topReportersData.map((reporter: any, index: any) => (
                                            <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                                        <Users className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{reporter.name}</div>
                                                        <div className="text-sm text-gray-500">{reporter.division}</div>
                                                    </div>
                                                </div>
                                                <Badge variant="outline">{reporter.reports} laporan</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Division Performance */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Kinerja per Unit Kerja</CardTitle>
                                    <CardDescription>Perbandingan jumlah laporan dan tingkat penyelesaian</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {divisionReports.map((division: any) => (
                                            <div key={division.division} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium">{division.division}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            {division.reports} laporan • {division.resolved} selesai
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        className={
                                                            division.resolved / division.reports >= 0.8
                                                                ? 'bg-green-100 text-green-800'
                                                                : division.resolved / division.reports >= 0.6
                                                                  ? 'bg-yellow-100 text-yellow-800'
                                                                  : 'bg-red-100 text-red-800'
                                                        }
                                                    >
                                                        {Math.round((division.resolved / division.reports) * 100)}% selesai
                                                    </Badge>
                                                </div>
                                                <Progress value={(division.resolved / division.reports) * 100} className="h-2" />
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
