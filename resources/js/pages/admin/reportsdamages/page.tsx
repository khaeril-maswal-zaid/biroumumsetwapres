'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, Clock, DollarSign, MapPin, TrendingDown, TrendingUp, Users, Wrench } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Mock data for damage reports analytics
const summaryStats = {
    totalReports: 156,
    completedReports: 98,
    pendingReports: 23,
    inProgressReports: 35,
    avgResponseTime: 2.4,
    totalCost: 15750000,
    avgCost: 125000,
    completionRate: 62.8,
};

const damageTypeData = [
    { name: 'Elektronik', value: 45, color: '#3b82f6' },
    { name: 'Furniture', value: 32, color: '#10b981' },
    { name: 'Sanitasi', value: 28, color: '#f59e0b' },
    { name: 'Infrastruktur', value: 25, color: '#ef4444' },
    { name: 'AC/Ventilasi', value: 18, color: '#8b5cf6' },
    { name: 'Lainnya', value: 8, color: '#6b7280' },
];

const locationData = [
    { location: 'Ruang Meeting A', reports: 12, avgCost: 180000 },
    { location: 'Toilet Lantai 2', reports: 8, avgCost: 95000 },
    { location: 'Ruang Kerja B', reports: 7, avgCost: 150000 },
    { location: 'Parkiran', reports: 6, avgCost: 220000 },
    { location: 'Lobby', reports: 5, avgCost: 75000 },
];

const responseTimeData = [
    { division: 'Biro 1', avgTime: 1.8, reports: 35 },
    { division: 'Biro 2', avgTime: 2.1, reports: 28 },
    { division: 'Biro 3', avgTime: 2.8, reports: 42 },
    { division: 'Biro 4', avgTime: 3.2, reports: 31 },
    { division: 'IT Support', avgTime: 1.2, reports: 20 },
];

const monthlyTrendData = [
    { month: 'Jan', reports: 18, cost: 2100000, completed: 15 },
    { month: 'Feb', reports: 22, cost: 2800000, completed: 19 },
    { month: 'Mar', reports: 15, cost: 1950000, completed: 12 },
    { month: 'Apr', reports: 28, cost: 3200000, completed: 24 },
    { month: 'May', reports: 31, cost: 2750000, completed: 28 },
    { month: 'Jun', reports: 42, cost: 2950000, completed: 35 },
];

const costDistributionData = [
    { range: '< 50K', count: 45, percentage: 28.8 },
    { range: '50K - 100K', count: 38, percentage: 24.4 },
    { range: '100K - 200K', count: 32, percentage: 20.5 },
    { range: '200K - 500K', count: 28, percentage: 17.9 },
    { range: '> 500K', count: 13, percentage: 8.3 },
];

const topReportersData = [
    { name: 'Dani Martinez', reports: 8, division: 'Biro 1' },
    { name: 'Siti Aminah', reports: 6, division: 'Biro 3' },
    { name: 'Budi Santoso', reports: 5, division: 'Biro 2' },
    { name: 'Rudi Hartono', reports: 4, division: 'Biro 4' },
    { name: 'Maya Sari', reports: 4, division: 'Biro 1' },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function DamageReports() {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Laporan & Analisis Kerusakan</h1>
                            <p className="text-gray-500">Analisis mendalam tentang laporan kerusakan dan perbaikan fasilitas.</p>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="summary" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="summary">Ringkasan</TabsTrigger>
                        <TabsTrigger value="analysis">Analisis Kerusakan</TabsTrigger>
                        <TabsTrigger value="performance">Kinerja Perbaikan</TabsTrigger>
                        <TabsTrigger value="trends">Tren & Biaya</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="gap-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
                                    <Wrench className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatNumber(summaryStats.totalReports)}</div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="flex items-center text-green-600">
                                            <TrendingUp className="mr-1 h-3 w-3" />
                                            +12% dari bulan lalu
                                        </span>
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="gap-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Tingkat Penyelesaian</CardTitle>
                                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{summaryStats.completionRate}%</div>
                                    <Progress value={summaryStats.completionRate} className="mt-2" />
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        {summaryStats.completedReports} dari {summaryStats.totalReports} laporan
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="gap-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Waktu Respons Rata-rata</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{summaryStats.avgResponseTime} hari</div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="flex items-center text-green-600">
                                            <TrendingDown className="mr-1 h-3 w-3" />
                                            -0.3 hari dari bulan lalu
                                        </span>
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="gap-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Biaya Perbaikan</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatCurrency(summaryStats.totalCost)}</div>
                                    <p className="text-xs text-muted-foreground">Rata-rata: {formatCurrency(summaryStats.avgCost)} per laporan</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Status Distribution */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card className="gap-0">
                                <CardHeader>
                                    <CardTitle>Distribusi Status Laporan</CardTitle>
                                    <CardDescription>Breakdown status laporan kerusakan saat ini</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                                <span className="text-sm">Selesai</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">{summaryStats.completedReports}</div>
                                                <div className="text-xs text-gray-500">
                                                    {((summaryStats.completedReports / summaryStats.totalReports) * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                                <span className="text-sm">Dalam Proses</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">{summaryStats.inProgressReports}</div>
                                                <div className="text-xs text-gray-500">
                                                    {((summaryStats.inProgressReports / summaryStats.totalReports) * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                                <span className="text-sm">Menunggu</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">{summaryStats.pendingReports}</div>
                                                <div className="text-xs text-gray-500">
                                                    {((summaryStats.pendingReports / summaryStats.totalReports) * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="gap-0">
                                <CardHeader>
                                    <CardTitle>Waktu Respons per Divisi</CardTitle>
                                    <CardDescription>Rata-rata waktu respons dalam hari</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={responseTimeData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="division" fontSize={12} />
                                            <YAxis fontSize={12} />
                                            <Tooltip
                                                formatter={(value: any) => [`${value} hari`, 'Waktu Respons']}
                                                labelFormatter={(label) => `Divisi: ${label}`}
                                            />
                                            <Bar dataKey="avgTime" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-6">
                        {/* Damage Types */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card className="gap-0">
                                <CardHeader>
                                    <CardTitle>Jenis Kerusakan Terbanyak</CardTitle>
                                    <CardDescription>Distribusi laporan berdasarkan jenis kerusakan</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={damageTypeData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                dataKey="value"
                                                label={({ name, value }) => `${name}: ${value}`}
                                            >
                                                {damageTypeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="gap-0">
                                <CardHeader>
                                    <CardTitle>Lokasi Rawan Kerusakan</CardTitle>
                                    <CardDescription>Area dengan laporan kerusakan terbanyak</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {locationData.map((location, index) => (
                                            <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="h-4 w-4 text-gray-500" />
                                                    <div>
                                                        <div className="font-medium">{location.location}</div>
                                                        <div className="text-sm text-gray-500">{location.reports} laporan</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium">{formatCurrency(location.avgCost)}</div>
                                                    <div className="text-xs text-gray-500">rata-rata biaya</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Top Reporters */}
                        <Card className="gap-0">
                            <CardHeader>
                                <CardTitle>Pelapor Paling Aktif</CardTitle>
                                <CardDescription>Karyawan yang paling sering melaporkan kerusakan</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topReportersData.map((reporter, index) => (
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
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-6">
                        {/* Performance Metrics */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <Card className="gap-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Laporan Tertunda</CardTitle>
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-yellow-600">{summaryStats.pendingReports}</div>
                                    <p className="text-xs text-muted-foreground">Memerlukan perhatian segera</p>
                                </CardContent>
                            </Card>

                            <Card className="gap-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Dalam Perbaikan</CardTitle>
                                    <Wrench className="h-4 w-4 text-blue-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">{summaryStats.inProgressReports}</div>
                                    <p className="text-xs text-muted-foreground">Sedang ditangani teknisi</p>
                                </CardContent>
                            </Card>

                            <Card className="gap-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Selesai Bulan Ini</CardTitle>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">{summaryStats.completedReports}</div>
                                    <p className="text-xs text-muted-foreground">Target: 100 laporan</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Division Performance */}
                        <Card className="gap-0">
                            <CardHeader>
                                <CardTitle>Kinerja per Divisi</CardTitle>
                                <CardDescription>Perbandingan jumlah laporan dan waktu respons</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={responseTimeData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="division" />
                                        <YAxis yAxisId="left" orientation="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Bar yAxisId="left" dataKey="reports" fill="#3b82f6" name="Jumlah Laporan" />
                                        <Bar yAxisId="right" dataKey="avgTime" fill="#10b981" name="Waktu Respons (hari)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="trends" className="space-y-6">
                        {/* Monthly Trends */}
                        <Card className="gap-0">
                            <CardHeader>
                                <CardTitle>Tren Bulanan Laporan Kerusakan</CardTitle>
                                <CardDescription>Perkembangan jumlah laporan dan biaya perbaikan</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={monthlyTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip
                                            formatter={(value: any, name: string) => {
                                                if (name === 'cost') return [formatCurrency(value), 'Biaya'];
                                                return [value, name === 'reports' ? 'Laporan' : 'Selesai'];
                                            }}
                                        />
                                        <Line yAxisId="left" type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} name="reports" />
                                        <Line yAxisId="left" type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="completed" />
                                        <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#f59e0b" strokeWidth={2} name="cost" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Cost Analysis */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card className="gap-0">
                                <CardHeader>
                                    <CardTitle>Distribusi Biaya Perbaikan</CardTitle>
                                    <CardDescription>Rentang biaya perbaikan yang paling umum</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {costDistributionData.map((range, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>{range.range}</span>
                                                    <span>
                                                        {range.count} laporan ({range.percentage}%)
                                                    </span>
                                                </div>
                                                <Progress value={range.percentage} className="h-2" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="gap-0">
                                <CardHeader>
                                    <CardTitle>Prediksi & Rekomendasi</CardTitle>
                                    <CardDescription>Insight untuk perbaikan sistem</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                            <div className="mb-2 flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                                <h4 className="font-medium text-blue-900">Prediksi Bulan Depan</h4>
                                            </div>
                                            <p className="text-sm text-blue-800">
                                                Diperkirakan akan ada 48-52 laporan kerusakan dengan biaya sekitar {formatCurrency(3200000)}.
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                            <div className="mb-2 flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                                <h4 className="font-medium text-yellow-900">Area Perhatian</h4>
                                            </div>
                                            <p className="text-sm text-yellow-800">
                                                Ruang Meeting A memerlukan maintenance preventif untuk mengurangi kerusakan elektronik.
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                            <div className="mb-2 flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <h4 className="font-medium text-green-900">Rekomendasi</h4>
                                            </div>
                                            <p className="text-sm text-green-800">
                                                Implementasi jadwal maintenance rutin dapat mengurangi laporan kerusakan hingga 30%.
                                            </p>
                                        </div>
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
