'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle, Clock, Shuffle, TrendingDown, TrendingUp, XCircle } from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function SuppliesReports({
    statusDistribution,
    divisionStats,
    topUsers,
    monthlyTrend,
    approvalRateTrend,
    summaryData,
    itemComparison,
    urgencyData,
}: any) {
    const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

    const iconMap: any = {
        approved: CheckCircle,
        pending: Clock,
        rejected: XCircle,
        partial: Shuffle,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Laporan Permintaan ATK</h1>
                            <p className="text-gray-500">Analisis dan statistik permintaan alat tulis kantor</p>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="summary" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="summary">Ringkasan</TabsTrigger>
                        <TabsTrigger value="items">Analisis Item</TabsTrigger>
                        <TabsTrigger value="trends">Tren</TabsTrigger>
                        <TabsTrigger value="users">Analisa Pengguna</TabsTrigger>
                    </TabsList>

                    {/* Summary Tab */}
                    <TabsContent value="summary" className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {Object.entries(summaryData).map(([key, item]: any) => {
                                const Icon = iconMap[key] || CheckCircle;
                                const TrendIcon = item.trend === 'up' ? TrendingUp : TrendingDown;
                                const trendColor = item.trend === 'up' ? 'text-green-500' : 'text-red-500';

                                return (
                                    <Card key={key} className="gap-0">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="flex items-center gap-1 text-sm font-medium">{item.title}</CardTitle>
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold">{item.value}</div>
                                            {/* <div className="flex items-center text-xs text-muted-foreground">
                                                <TrendIcon className={`mr-1 h-3 w-3 ${trendColor}`} />
                                                {item.change} dari bulan lalu
                                            </div> */}
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
                                    <CardTitle>Distribusi Status Permintaan</CardTitle>
                                    <CardDescription>Persentase status permintaan ATK</CardDescription>
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

                            {/* Top 5 Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top 5 Item Paling Diminta</CardTitle>
                                    <CardDescription>Item ATK dengan permintaan tertinggi</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {itemComparison.slice(0, 5).map((item: any, index: any) => (
                                            <div key={item.name} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-500">{item.requested} diminta</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-green-100 text-green-800">{item.approvalRate} %</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Items Analysis Tab */}
                    <TabsContent value="items" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tingkat Urgensi Laporan</CardTitle>
                                    <CardDescription>Distribusi laporan berdasarkan tingkat urgensi</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={urgencyData}
                                                cx="50%"
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
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Tingkat Persetujuan per Item</CardTitle>
                                    <CardDescription>Persentase persetujuan untuk setiap jenis item ATK</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {itemComparison.map((item: any) => (
                                            <div key={item.name} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">{item.name}</span>
                                                    <span className="text-sm text-gray-500">
                                                        {item.approved}/{item.requested} ({item.approvalRate}%)
                                                    </span>
                                                </div>
                                                <Progress value={item.approvalRate} className="h-2" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Perbandingan Permintaan vs Persetujuan per Item</CardTitle>
                                <CardDescription>Analisis tingkat persetujuan untuk setiap jenis item ATK</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={itemComparison}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="requested" fill="#3b82f6" name="Diminta" />
                                            <Bar dataKey="approved" fill="#10b981" name="Disetujui" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Trends Tab */}
                    <TabsContent value="trends" className="space-y-6">
                        {/* Monthly Trend */}
                        <Card>
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
                                            <Area
                                                type="monotone"
                                                dataKey="approved"
                                                stackId="2"
                                                stroke="#10b981"
                                                fill="#10b981"
                                                fillOpacity={0.6}
                                                name="Disetujui"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="partial"
                                                stackId="2"
                                                stroke="#b87333"
                                                fill="#b87333"
                                                fillOpacity={0.6}
                                                name="Sebagian"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Approval Rate Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tren Tingkat Persetujuan</CardTitle>
                                <CardDescription>Persentase tingkat persetujuan permintaan ATK per bulan</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={approvalRateTrend}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis domain={[75, 90]} />
                                            <Tooltip formatter={(value) => [`${value}%`, 'Tingkat Persetujuan']} />
                                            <Line
                                                type="monotone"
                                                dataKey="rate"
                                                stroke="#10b981"
                                                strokeWidth={3}
                                                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Top Users */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top 5 Pengguna Paling Aktif</CardTitle>
                                    <CardDescription>Pengguna dengan permintaan ATK terbanyak</CardDescription>
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
                                                    <p className="font-medium">{user.requests} permintaan</p>
                                                    <Badge
                                                        className={
                                                            user.rate >= 90
                                                                ? 'bg-green-100 text-green-800'
                                                                : user.rate >= 80
                                                                  ? 'bg-yellow-100 text-yellow-800'
                                                                  : 'bg-red-100 text-red-800'
                                                        }
                                                    >
                                                        {user.rate}% disetujui
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Division Statistics */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistik per Divisi</CardTitle>
                                    <CardDescription>Tingkat permintaan dan persetujuan per divisi</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {divisionStats.map((division: any) => (
                                            <div key={division.division} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">{division.division}</span>
                                                    <span className="text-sm text-gray-500">
                                                        {division.approved}/{division.requests} permintaan
                                                    </span>
                                                </div>
                                                <Progress value={division.rate} className="h-2" />
                                                <p className="text-xs text-gray-500">{division.rate}% tingkat persetujuan</p>
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
