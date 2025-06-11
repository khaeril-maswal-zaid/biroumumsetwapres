import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, Car, CheckCircle, Clock, PenTool, Users, Wrench } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-gray-500">Selamat datang di panel admin Biro Umum.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                        <Calendar className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Pemesanan Ruang</p>
                                        <h3 className="text-2xl font-bold">12</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                        <Wrench className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Kerusakan Gedung</p>
                                        <h3 className="text-2xl font-bold">8</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                        <Car className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Permintaan Kendaraan</p>
                                        <h3 className="text-2xl font-bold">5</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                                        <PenTool className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Permintaan ATK</p>
                                        <h3 className="text-2xl font-bold">15</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Aktivitas Terbaru</CardTitle>
                                <CardDescription>Daftar aktivitas terbaru dari semua layanan.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium">Pemesanan Ruang Holding</p>
                                            <p className="text-sm text-gray-500">Dani Martinez - Biro 1</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="h-3 w-3" />
                                                <span>10 menit yang lalu</span>
                                            </div>
                                        </div>
                                        <div className="flex h-6 items-center rounded-full bg-blue-100 px-2 text-xs font-medium text-blue-600">
                                            Baru
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                                            <Wrench className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium">Laporan Kerusakan AC</p>
                                            <p className="text-sm text-gray-500">Budi Santoso - Biro 2</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="h-3 w-3" />
                                                <span>1 jam yang lalu</span>
                                            </div>
                                        </div>
                                        <div className="flex h-6 items-center rounded-full bg-yellow-100 px-2 text-xs font-medium text-yellow-600">
                                            Diproses
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                                            <Car className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium">Permintaan Kendaraan MPV</p>
                                            <p className="text-sm text-gray-500">Siti Aminah - Biro 3</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="h-3 w-3" />
                                                <span>3 jam yang lalu</span>
                                            </div>
                                        </div>
                                        <div className="flex h-6 items-center rounded-full bg-green-100 px-2 text-xs font-medium text-green-600">
                                            Selesai
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100">
                                            <PenTool className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium">Permintaan ATK</p>
                                            <p className="text-sm text-gray-500">Rudi Hartono - Biro 4</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="h-3 w-3" />
                                                <span>5 jam yang lalu</span>
                                            </div>
                                        </div>
                                        <div className="flex h-6 items-center rounded-full bg-green-100 px-2 text-xs font-medium text-green-600">
                                            Selesai
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistik Layanan</CardTitle>
                                <CardDescription>Ringkasan status permintaan layanan.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Baru</span>
                                            <span className="font-medium">12</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-100">
                                            <div className="h-full w-[30%] rounded-full bg-blue-500"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Diproses</span>
                                            <span className="font-medium">18</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-100">
                                            <div className="h-full w-[45%] rounded-full bg-yellow-500"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Selesai</span>
                                            <span className="font-medium">10</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-100">
                                            <div className="h-full w-[25%] rounded-full bg-green-500"></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Jadwal Pemesanan Ruang Hari Ini</CardTitle>
                            <CardDescription>Daftar pemesanan ruang rapat untuk hari ini.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <p className="font-medium">Ruang Holding</p>
                                        <p className="text-sm text-gray-500">09:00 - 11:00</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Users className="h-3 w-3" />
                                            <span>Rapat Divisi - Biro 1</span>
                                        </div>
                                    </div>
                                    <div className="flex h-8 items-center rounded-full bg-green-100 px-3 text-xs font-medium text-green-600">
                                        <CheckCircle className="mr-1 h-3 w-3" />
                                        Terkonfirmasi
                                    </div>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <p className="font-medium">Ruang Rapat</p>
                                        <p className="text-sm text-gray-500">13:00 - 14:30</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Users className="h-3 w-3" />
                                            <span>Briefing Mingguan - Biro 2</span>
                                        </div>
                                    </div>
                                    <div className="flex h-8 items-center rounded-full bg-green-100 px-3 text-xs font-medium text-green-600">
                                        <CheckCircle className="mr-1 h-3 w-3" />
                                        Terkonfirmasi
                                    </div>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-1">
                                        <p className="font-medium">Ruang Holding</p>
                                        <p className="text-sm text-gray-500">15:00 - 17:00</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Users className="h-3 w-3" />
                                            <span>Presentasi Proyek - Biro 3</span>
                                        </div>
                                    </div>
                                    <div className="flex h-8 items-center rounded-full bg-green-100 px-3 text-xs font-medium text-green-600">
                                        <CheckCircle className="mr-1 h-3 w-3" />
                                        Terkonfirmasi
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
