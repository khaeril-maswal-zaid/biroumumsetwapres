'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Filter, Hash, House, MapPin, Phone, User, Users } from 'lucide-react';
import { useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const iconMap: any = {
    totalBookings: Calendar,
    booked: User,
    rejected: Clock,
    pending: MapPin,
};

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
    roomSchedules,
    rooms,
}: any) {
    const formatHours = (hours: number) => {
        return `${hours} jam`;
    };

    const [currentDate, setCurrentDate] = useState(new Date());
    const [filterRoom, setFilterRoom] = useState('all');
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fungsi untuk mendapatkan nama bulan dalam bahasa Indonesia
    const getMonthName = (tanggal_penggunaan: any) => {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return months[tanggal_penggunaan.getMonth()];
    };

    // Fungsi untuk mendapatkan jadwal berdasarkan tanggal
    const getSchedulesByDate = (tanggal_penggunaan: any) => {
        const dateStr = tanggal_penggunaan.toLocaleDateString('sv-SE'); // Format: YYYY-MM-DD

        return roomSchedules.filter((schedule: any) => {
            const matchesDate = schedule.tanggal_penggunaan === dateStr;
            const matchesRoom = filterRoom === 'all' || schedule?.ruangans?.nama_ruangan === filterRoom;
            return matchesDate && matchesRoom;
        });
    };

    // Fungsi untuk navigasi bulan
    const navigateMonth = (direction: any) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    // Fungsi untuk mendapatkan tanggal dalam bulan
    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Kalender dimulai dari hari Senin
        const startDate = new Date(firstDay);
        const dayOfWeek = firstDay.getDay(); // 0 (Minggu) - 6 (Sabtu)

        const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Geser ke Senin
        startDate.setDate(startDate.getDate() - offset);

        const days = [];
        const current = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    const days = getDaysInMonth();

    // Fungsi untuk membuka detail jadwal
    const handleScheduleClick = (schedule: any) => {
        setSelectedSchedule(schedule);
        setIsDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-linear-to-br from-white to-blue-100 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="ps-2">
                            <h1 className="text-lg font-bold tracking-tight">Dashboard Pemesanan Ruangan</h1>
                            <p className="text-sm text-gray-500">Analisis dan statistik pemesanan ruangan fasilitas</p>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="summary" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="summary">Ringkasan</TabsTrigger>
                        <TabsTrigger value="utilization">Penggunaan Ruangan</TabsTrigger>
                        <TabsTrigger value="pekan">Jadwal Pekan ini</TabsTrigger>
                        <TabsTrigger value="detail">Kalender Bulanan</TabsTrigger>
                        <TabsTrigger value="analytics">Analisis Pengguna</TabsTrigger>
                    </TabsList>

                    {/* Summary Tab */}
                    <TabsContent value="summary" className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(summaryData).map(([key, item]: any) => {
                                const Icon = iconMap[key] || Calendar;

                                return (
                                    <Card key={key} className="gap-0">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold">{item.value}</div>
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
                                                    dataKey="booked"
                                                    stackId="2"
                                                    stroke="#10b981"
                                                    fill="#10b981"
                                                    fillOpacity={0.6}
                                                    name="Telah dipesan"
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="rejected"
                                                    stackId="2"
                                                    stroke="#ef4444"
                                                    fill="#ef4444"
                                                    fillOpacity={0.6}
                                                    name="Ditolak"
                                                />
                                            </AreaChart>
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
                                <div className="space-y-6">
                                    {penggunaanRuangan.map((room: any) => (
                                        <div key={room.room} className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-medium whitespace-nowrap">{room.room}</h4>
                                                {' | '}
                                                <p className="truncate text-sm text-gray-500">
                                                    {room.bookings} pemesanan • {formatHours(room.hours)} • Kapasitas {room.capacity} orang
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Jadwal Pekan ini */}
                    <TabsContent value="pekan" className="space-y-6">
                        {/* Weekly Booking Schedule */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pemantauan Jadwal Pemesanan Mingguan</CardTitle>
                                <CardDescription>Jadwal pemesanan ruangan untuk minggu ini</CardDescription>
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
                                                {weeklySchedule.map((room: any) => (
                                                    <tr key={room.room} className="hover:bg-gray-50">
                                                        <td className="border-b p-3 text-sm font-medium text-nowrap">{room.room}</td>
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
                                                                            {bookings.map((booking: any, index: any) => (
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

                    {/* Jadwal Detail ini */}
                    <TabsContent value="detail" className="space-y-6">
                        {/* Kalender */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Kalender Pemesanan Ruangan</CardTitle>
                                <CardDescription>Pantau seluruh jadwal pemesanan ruangan dalam tampilan kalender bulanan.</CardDescription>

                                {/* Kontrol Kalender */}
                                <div className="mt-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        <CardTitle className="text-xl">
                                            {getMonthName(currentDate)}
                                            {currentDate.getFullYear()}
                                        </CardTitle>

                                        <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Filter Ruangan */}
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        <Select value={filterRoom} onValueChange={setFilterRoom}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Pilih ruangan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem key="all" value="all">
                                                    Semua Ruangan
                                                </SelectItem>
                                                {rooms.map((room) => (
                                                    <SelectItem key={room.nama_ruangan} value={room.nama_ruangan}>
                                                        {room.nama_ruangan}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Header Hari */}
                                <div className="grid grid-cols-7 gap-2">
                                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => (
                                        <div key={day} className="rounded-lg bg-muted p-3 text-center text-sm font-medium text-muted-foreground">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Grid Tanggal */}
                                <div className="grid grid-cols-7 gap-2">
                                    {days.map((day, index) => {
                                        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                                        const isToday = day.toDateString() === new Date().toDateString();
                                        const daySchedules = getSchedulesByDate(day);

                                        console.log(daySchedules);

                                        return (
                                            <Card
                                                key={index}
                                                className={`relative min-h-[120px] py-3 transition-all duration-200 ${isCurrentMonth ? 'bg-card' : 'bg-muted/30'} ${isToday ? 'shadow-md ring-2 ring-primary' : ''} `}
                                            >
                                                <CardContent className="p-2">
                                                    {/* Tanggal */}
                                                    <div
                                                        className={`mb-2 flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'} ${isToday ? 'bg-primary font-bold text-primary-foreground' : ''} `}
                                                    >
                                                        {day.getDate()}
                                                    </div>

                                                    {/* Jadwal Ruangan */}
                                                    <div className="space-y-1 px-5">
                                                        {daySchedules.map((schedule: any) => (
                                                            <Badge
                                                                key={schedule.id}
                                                                variant="secondary"
                                                                className="block w-full cursor-pointer justify-start truncate bg-green-100 px-2 py-1 text-xs text-green-800 transition-opacity hover:opacity-80"
                                                                title={`${schedule.room} (${schedule.jam_mulai}-${schedule.jam_selesai})`}
                                                                onClick={() => handleScheduleClick(schedule)}
                                                            >
                                                                <div className="flex w-full flex-col items-start">
                                                                    <span className="w-full truncate">{schedule?.ruangans?.nama_ruangan}</span>
                                                                    <span className="flex items-center gap-1 text-xs opacity-75">
                                                                        <Clock className="h-3 w-3" />
                                                                        {schedule.jam_mulai} - {schedule.jam_selesai}
                                                                    </span>
                                                                </div>
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Modal Detail Jadwal */}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                                {selectedSchedule && (
                                    <>
                                        <DialogHeader className="space-y-4">
                                            <DialogTitle className="flex items-center gap-2 text-lg">
                                                <MapPin className="h-6 w-6 text-primary" />
                                                Detail Reservasi Ruangan
                                            </DialogTitle>
                                        </DialogHeader>

                                        <div className="space-y-5">
                                            {/* Foto Ruangan */}
                                            <div className="relative">
                                                <img
                                                    src={`/storage/${selectedSchedule?.ruangans?.image}`}
                                                    alt={selectedSchedule?.ruangans?.nama_ruangan}
                                                    className="h-48 w-full rounded-lg object-cover"
                                                />
                                            </div>

                                            {/* Detail Kegiatan */}
                                            <Card>
                                                <CardContent className="space-y-4">
                                                    <div className="mb-2 flex items-center gap-1.5 text-muted-foreground">
                                                        <MapPin className="h-5 w-5" />
                                                        {selectedSchedule?.ruangans?.nama_ruangan}
                                                    </div>

                                                    <div className="ml-0.5 flex items-center gap-1.5 text-muted-foreground">
                                                        <Clock className="h-4 w-4" />
                                                        <span>
                                                            {selectedSchedule.jam_mulai} - {selectedSchedule.jam_selesai}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="mb-2 font-semibold">Kegiatan :</h4>
                                                        <p className="leading-relaxed text-muted-foreground">{selectedSchedule.deskripsi}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Info Pemesan */}
                                            <Card className="gap-4">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-2">
                                                        <Users className="h-5 w-5" />
                                                        Informasi Pemesan
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            {/* <span className="font-mono text-sm font-medium">Kode Permintaan :</span> */}
                                                            <Hash className="h-4 w-4" />
                                                            <span className="font-mono text-sm font-medium">{selectedSchedule.kode_booking}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <User className="h-4 w-4" />
                                                            <span>{selectedSchedule.pemesan?.pegawai?.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <House className="h-4 w-4" />
                                                            <span>{selectedSchedule.pemesan?.pegawai?.biro?.nama_biro}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Phone className="h-4 w-4" />
                                                            <span>{selectedSchedule.no_hp}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </>
                                )}
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-2">
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
                                                        <p className="font-medium">{user.user}</p>
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
                                    <CardTitle>Penggunaan per Unit Kerja</CardTitle>
                                    <CardDescription>Statistik pemesanan berdasarkan unit kerja</CardDescription>
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
