import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calendar, ChevronLeft, ChevronRight, Clock, Filter, Mail, MapPin, Phone, User, Users } from 'lucide-react';
import { useState } from 'react';

const RoomScheduleCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filterRoom, setFilterRoom] = useState('all');
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Data dummy jadwal ruangan
    const roomSchedules = [
        {
            id: 1,
            room: 'Meeting A',
            roomImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop',
            start: '09:00',
            end: '11:00',
            date: '2025-07-31',
            variant: 'default',
            bookerName: 'Ahmad Rizki',
            bookerEmail: 'ahmad.rizki@company.com',
            bookerPhone: '+62 812-3456-7890',
            activity: 'Rapat Tim Marketing',
            description: 'Rapat bulanan tim marketing untuk membahas strategi pemasaran Q3 2025 dan evaluasi performa campaign sebelumnya.',
            participants: 8,
            notes: 'Membutuhkan proyektor dan flip chart',
            status: 'confirmed',
        },
        {
            id: 2,
            room: 'Meeting B',
            roomImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop',
            start: '13:00',
            end: '15:00',
            date: '2025-07-31',
            variant: 'secondary',
            bookerName: 'Sari Dewi',
            bookerEmail: 'sari.dewi@company.com',
            bookerPhone: '+62 821-9876-5432',
            activity: 'Presentasi Proposal Client',
            description: 'Presentasi proposal pengembangan sistem informasi untuk klien PT. Maju Bersama.',
            participants: 12,
            notes: 'Persiapkan laptop dan sound system',
            status: 'confirmed',
        },
        {
            id: 3,
            room: 'Training',
            roomImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop',
            start: '08:00',
            end: '17:00',
            date: '2025-07-31',
            variant: 'outline',
            bookerName: 'HR Department',
            bookerEmail: 'hr@company.com',
            bookerPhone: '+62 811-2233-4455',
            activity: 'Pelatihan Karyawan Baru',
            description: 'Orientasi dan pelatihan untuk 25 karyawan baru yang akan bergabung dengan perusahaan.',
            participants: 25,
            notes: 'Makan siang disediakan, persiapkan materi training kit',
            status: 'confirmed',
        },
        {
            id: 4,
            room: 'Meeting A',
            roomImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop',
            start: '14:00',
            end: '16:00',
            date: '2025-08-01',
            variant: 'default',
            bookerName: 'Budi Santoso',
            bookerEmail: 'budi.santoso@company.com',
            bookerPhone: '+62 813-5555-6666',
            activity: 'Review Quarterly Performance',
            description: 'Review performa kuartal Q2 2025 dengan tim management dan diskusi target Q3.',
            participants: 6,
            notes: 'Siapkan laporan keuangan dan data performa',
            status: 'pending',
        },
        {
            id: 5,
            room: 'Seminar',
            roomImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
            start: '09:30',
            end: '12:00',
            date: '2025-08-02',
            variant: 'destructive',
            bookerName: 'Digital Marketing Team',
            bookerEmail: 'digitalmarketing@company.com',
            bookerPhone: '+62 814-7777-8888',
            activity: 'Workshop Digital Marketing',
            description: 'Workshop tentang tren digital marketing terbaru dan strategi media sosial untuk meningkatkan engagement.',
            participants: 20,
            notes: 'Persiapkan mic wireless dan recording equipment',
            status: 'confirmed',
        },
        {
            id: 6,
            room: 'Meeting B',
            roomImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop',
            start: '10:00',
            end: '11:30',
            date: '2025-08-01',
            variant: 'secondary',
            bookerName: 'Rina Putri',
            bookerEmail: 'rina.putri@company.com',
            bookerPhone: '+62 815-9999-0000',
            activity: 'Client Meeting',
            description: 'Pertemuan dengan klien untuk membahas progress project dan timeline delivery.',
            participants: 4,
            notes: 'Coffee break disediakan',
            status: 'confirmed',
        },
        {
            id: 7,
            room: 'Training',
            roomImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop',
            start: '15:00',
            end: '17:00',
            date: '2025-08-02',
            variant: 'outline',
            bookerName: 'IT Support',
            bookerEmail: 'it.support@company.com',
            bookerPhone: '+62 816-1111-2222',
            activity: 'Technical Training',
            description: 'Pelatihan teknis penggunaan software baru untuk tim IT dan admin.',
            participants: 15,
            notes: 'Laptop tersedia, bawa charger masing-masing',
            status: 'confirmed',
        },
    ];

    const rooms = [
        { value: 'all', label: 'Semua Ruangan' },
        { value: 'Meeting A', label: 'Meeting A' },
        { value: 'Meeting B', label: 'Meeting B' },
        { value: 'Training', label: 'Training' },
        { value: 'Seminar', label: 'Seminar' },
    ];

    // Fungsi untuk mendapatkan nama bulan dalam bahasa Indonesia
    const getMonthName = (date) => {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return months[date.getMonth()];
    };

    // Fungsi untuk mendapatkan jadwal berdasarkan tanggal
    const getSchedulesByDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return roomSchedules.filter((schedule) => {
            const matchesDate = schedule.date === dateStr;
            const matchesRoom = filterRoom === 'all' || schedule.room === filterRoom;
            return matchesDate && matchesRoom;
        });
    };

    // Fungsi untuk navigasi bulan
    const navigateMonth = (direction) => {
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
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

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
    const handleScheduleClick = (schedule) => {
        setSelectedSchedule(schedule);
        setIsDialogOpen(true);
    };

    // Fungsi untuk mendapatkan status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return (
                    <Badge variant="default" className="text-xs">
                        Terkonfirmasi
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge variant="secondary" className="text-xs">
                        Menunggu
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-xs">
                        Draft
                    </Badge>
                );
        }
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Calendar className="h-8 w-8 text-primary" />
                            Jadwal Penggunaan Ruangan
                        </CardTitle>
                        <CardDescription>Kelola dan pantau penggunaan ruangan dengan mudah</CardDescription>
                    </CardHeader>
                </Card>

                {/* Kalender */}
                <Card>
                    <CardHeader>
                        {/* Kontrol Kalender */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                <CardTitle className="text-xl">
                                    {getMonthName(currentDate)} {currentDate.getFullYear()}
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
                                        {rooms.map((room) => (
                                            <SelectItem key={room.value} value={room.value}>
                                                {room.label}
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
                            {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => (
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

                                return (
                                    <Card
                                        key={index}
                                        className={`relative min-h-[120px] transition-all duration-200 ${isCurrentMonth ? 'bg-card' : 'bg-muted/30'} ${isToday ? 'shadow-md ring-2 ring-primary' : ''} `}
                                    >
                                        <CardContent className="p-2">
                                            {/* Tanggal */}
                                            <div
                                                className={`mb-2 flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'} ${isToday ? 'bg-primary font-bold text-primary-foreground' : ''} `}
                                            >
                                                {day.getDate()}
                                            </div>

                                            {/* Jadwal Ruangan */}
                                            <div className="space-y-1">
                                                {daySchedules.map((schedule) => (
                                                    <Badge
                                                        key={schedule.id}
                                                        variant={schedule.variant}
                                                        className="block w-full cursor-pointer justify-start truncate px-2 py-1 text-xs transition-opacity hover:opacity-80"
                                                        title={`${schedule.room} (${schedule.start}-${schedule.end})`}
                                                        onClick={() => handleScheduleClick(schedule)}
                                                    >
                                                        <div className="flex w-full flex-col items-start">
                                                            <span className="w-full truncate">{schedule.room}</span>
                                                            <span className="flex items-center gap-1 text-xs opacity-75">
                                                                <Clock className="h-3 w-3" />
                                                                {schedule.start}-{schedule.end}
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
                                    <DialogTitle className="flex items-center gap-2 text-2xl">
                                        <MapPin className="h-6 w-6 text-primary" />
                                        Detail Reservasi Ruangan
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-6">
                                    {/* Foto Ruangan */}
                                    <div className="relative">
                                        <img
                                            src={selectedSchedule.roomImage}
                                            alt={selectedSchedule.room}
                                            className="h-48 w-full rounded-lg object-cover"
                                        />
                                        <div className="absolute top-4 right-4">{getStatusBadge(selectedSchedule.status)}</div>
                                    </div>

                                    {/* Info Ruangan */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <MapPin className="h-5 w-5" />
                                                {selectedSchedule.room}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                    <span>
                                                        {selectedSchedule.start} - {selectedSchedule.end}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Users className="h-4 w-4" />
                                                    <span>{selectedSchedule.participants} Peserta</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Info Pemesan */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="h-5 w-5" />
                                                Informasi Pemesan
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSchedule.bookerName}`}
                                                    />
                                                    <AvatarFallback>
                                                        {selectedSchedule.bookerName
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{selectedSchedule.bookerName}</p>
                                                    <p className="text-sm text-muted-foreground">{selectedSchedule.bookerEmail}</p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Mail className="h-4 w-4" />
                                                    <span>{selectedSchedule.bookerEmail}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="h-4 w-4" />
                                                    <span>{selectedSchedule.bookerPhone}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Detail Kegiatan */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>{selectedSchedule.activity}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <h4 className="mb-2 font-semibold">Deskripsi Kegiatan</h4>
                                                <p className="leading-relaxed text-muted-foreground">{selectedSchedule.description}</p>
                                            </div>

                                            <Separator />

                                            <div>
                                                <h4 className="mb-2 font-semibold">Catatan Tambahan</h4>
                                                <p className="text-muted-foreground">{selectedSchedule.notes}</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-4">
                                        <Button className="flex-1">Edit Reservasi</Button>
                                        <Button variant="outline" className="flex-1">
                                            Batalkan
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Legend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Keterangan Ruangan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="default" className="h-4 w-4 p-0"></Badge>
                                <span className="text-sm text-muted-foreground">Meeting A</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="h-4 w-4 p-0"></Badge>
                                <span className="text-sm text-muted-foreground">Meeting B</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="h-4 w-4 p-0"></Badge>
                                <span className="text-sm text-muted-foreground">Training</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="destructive" className="h-4 w-4 p-0"></Badge>
                                <span className="text-sm text-muted-foreground">Seminar</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RoomScheduleCalendar;
