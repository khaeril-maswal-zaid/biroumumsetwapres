'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, Calendar, CheckCircle, Clock, MessageSquare, Search, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function BookingsAdmin({ bookingRooms }: any) {
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['bookingRooms'],
            });
        }, 60 * 1000); // 60 detik

        return () => clearInterval(interval);
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [adminMessage, setAdminMessage] = useState('');
    const [actionType, setActionType] = useState<'confirmed' | 'cancelled' | null>(null);

    const handleSubmit = async (bookingCode: string) => {
        setIsProcessing(true);

        router.patch(
            route('ruangrapat.status', bookingCode),
            {
                action: actionType,
                message: adminMessage,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsProcessing(false);
                    setIsDetailsOpen(false);
                    setAdminMessage('');
                    setActionType(null);
                },
                onError: (errors) => {
                    console.log('Validation Errors: ', errors);
                },
            },
        );
    };

    // Filter bookings based on search term and status
    const filteredBookings = bookingRooms.data.filter((booking: any) => {
        const matchesSearch =
            booking?.pemesan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.kode_booking.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (booking: any) => {
        setSelectedBooking(booking);
        setIsDetailsOpen(true);
        setActionType(null);
        setAdminMessage('');
    };

    const handleActionClick = (action: 'confirmed' | 'cancelled') => {
        setActionType(action);
        setAdminMessage('');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="mb-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pengajuan</Badge>;
            case 'confirmed':
                return <Badge className="mb-1 bg-green-100 text-green-800 hover:bg-green-200">Disetujui</Badge>;
            case 'cancelled':
                return <Badge className="mb-1 bg-red-100 text-red-800 hover:bg-red-200">Dibatalkan</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const formatTanggalIna = (tanggal: string) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date(tanggal));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pemesanan</CardTitle>
                        <CardDescription>Semua pemesanan ruang rapat yang telah diajukan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Search className="h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama pengaju, kegiatan, atau kode permintaan..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="pending">Pengajuan</SelectItem>
                                        <SelectItem value="confirmed">Disetujui</SelectItem>
                                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode Permintaan</TableHead>
                                        <TableHead>Nama Pemesan</TableHead>
                                        <TableHead>Ruangan</TableHead>
                                        <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                                        <TableHead className="hidden md:table-cell">Waktu</TableHead>
                                        <TableHead className="hidden lg:table-cell">Kegiatan/ Keperluan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBookings.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="py-4 text-center text-gray-500">
                                                Tidak ada data pemesanan yang ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredBookings.map((booking: any) => (
                                            <TableRow key={booking.kode_booking}>
                                                <TableCell>
                                                    <div className="font-mono text-sm font-medium">{booking.kode_booking}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{booking?.pemesan.name}</div>
                                                    <div className="text-sm text-gray-500">{booking.unit_kerja}</div>
                                                </TableCell>
                                                <TableCell>{booking?.ruangans.nama_ruangan}</TableCell>
                                                <TableCell className="hidden md:table-cell">{formatTanggalIna(booking.tanggal_penggunaan)}</TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {booking.jam_mulai} - {booking.jam_selesai}
                                                </TableCell>
                                                <TableCell className="hidden max-w-[200px] truncate lg:table-cell">{booking.deskripsi}</TableCell>
                                                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(booking)}>
                                                        Detail
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Booking Details Dialog */}
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto px-10 pt-12 sm:max-w-2xl">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Detail Pemesanan Ruang Rapat
                            </DialogTitle>
                            <DialogDescription>Tinjau informasi pemesanan dan berikan keputusan dengan pesan untuk pengaju.</DialogDescription>
                        </DialogHeader>

                        {selectedBooking && (
                            <div className="space-y-6">
                                {/* Status and Room Info */}
                                <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="mb-2 flex items-center gap-1">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span className="text-xs text-gray-600">{formatTanggalIna(selectedBooking.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-mono text-sm font-medium text-gray-700">
                                                Kode Permintaan: {selectedBooking.kode_booking}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">{getStatusBadge(selectedBooking.status)}</div>
                                </div>

                                {/* Booking Details */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Users className="my-auto h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">{selectedBooking?.pemesan.name}</p>
                                                <p className="text-xs text-gray-600">{selectedBooking.unit_kerja}</p>
                                                <p className="text-xs text-gray-500">{selectedBooking.no_hp}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Tanggal kegiatan</p>
                                                <p className="text-sm text-gray-600">{formatTanggalIna(selectedBooking.tanggal_penggunaan)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-orange-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Waktu kegiatan</p>
                                                <p className="text-sm text-gray-600">
                                                    {selectedBooking.jam_mulai} - {selectedBooking.jam_selesai}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-purple-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Info Ruangan</p>
                                                <p className="text-xs text-gray-600">{selectedBooking.ruangans.nama_ruangan}</p>
                                                <p className="text-xs text-gray-600">{selectedBooking.ruangans.lokasi}</p>
                                                <p className="text-xs text-gray-600">Kapasitas {selectedBooking.ruangans.kapasitas} Orang</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="mb-2 font-medium text-gray-900">Keperluan/ Kegiatan</p>
                                            <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">{selectedBooking.deskripsi}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Message Display for Disetujui/Rejected */}
                                {selectedBooking.keterangan &&
                                    selectedBooking.status !== 'pending' &&
                                    (() => {
                                        // Mapping warna berdasarkan status
                                        const colorMap: any = {
                                            confirmed: {
                                                border: 'border-green-200',
                                                bg: 'bg-green-50',
                                                icon: 'text-green-600',
                                                title: 'text-green-900',
                                                text: 'text-green-800',
                                            },
                                            in_progress: {
                                                border: 'border-blue-200',
                                                bg: 'bg-blue-50',
                                                icon: 'text-blue-600',
                                                title: 'text-blue-900',
                                                text: 'text-blue-800',
                                            },
                                            cancelled: {
                                                border: 'border-red-200',
                                                bg: 'bg-red-50',
                                                icon: 'text-red-600',
                                                title: 'text-red-900',
                                                text: 'text-red-800',
                                            },
                                        };

                                        const color = colorMap[selectedBooking.status] ?? colorMap['in_progress'];

                                        return (
                                            <div className={`rounded-lg border ${color.border} ${color.bg} p-4`}>
                                                <div className="mb-2 flex items-center gap-2">
                                                    <MessageSquare className={`h-4 w-4 ${color.icon}`} />
                                                    <h4 className={`font-medium ${color.title}`}>Pesan dari Admin</h4>
                                                </div>
                                                <p className={`text-sm ${color.text}`}>{selectedBooking.keterangan}</p>
                                            </div>
                                        );
                                    })()}

                                <Separator />

                                {/* Action Section */}
                                {selectedBooking.status === 'pending' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-5 w-5 text-blue-600" />
                                            <h4 className="font-medium text-gray-900">Persetujuan:</h4>
                                        </div>

                                        {!actionType && (
                                            <div className="flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-red-200 bg-transparent text-red-700 hover:bg-red-50"
                                                    onClick={() => handleActionClick('cancelled')}
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Tolak Pemesanan
                                                </Button>
                                                <Button
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleActionClick('confirmed')}
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Setujui Pemesanan
                                                </Button>
                                            </div>
                                        )}

                                        {actionType && (
                                            <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
                                                <div className="flex items-center gap-2">
                                                    {actionType === 'confirmed' ? (
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                                    )}
                                                    <h5 className="font-medium">
                                                        {actionType === 'confirmed' ? 'Menyetujui Pemesanan' : 'Menolak Pemesanan'}
                                                    </h5>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-message">
                                                        Pesan untuk Pengaju
                                                        {actionType === 'cancelled' && <span className="text-red-500">*</span>}
                                                    </Label>
                                                    <Textarea
                                                        id="admin-message"
                                                        placeholder={
                                                            actionType === 'confirmed'
                                                                ? 'Tambahkan catatan atau instruksi khusus (opsional)...'
                                                                : 'Jelaskan alasan penolakan pemesanan...'
                                                        }
                                                        value={adminMessage}
                                                        onChange={(e) => setAdminMessage(e.target.value)}
                                                        rows={3}
                                                        className="mt-1 resize-none"
                                                    />
                                                    {actionType === 'cancelled' && !adminMessage.trim() && (
                                                        <p className="text-sm text-red-600">Pesan wajib diisi untuk penolakan</p>
                                                    )}
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setActionType(null);
                                                            setAdminMessage('');
                                                        }}
                                                        disabled={isProcessing}
                                                    >
                                                        Batal
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            if (actionType === 'confirmed') {
                                                                handleSubmit(selectedBooking.kode_booking);
                                                            } else {
                                                                handleSubmit(selectedBooking.kode_booking);
                                                            }
                                                        }}
                                                        disabled={isProcessing || (actionType === 'cancelled' && !adminMessage.trim())}
                                                        className={
                                                            actionType === 'confirmed'
                                                                ? 'bg-green-600 hover:bg-green-700'
                                                                : 'bg-red-600 hover:bg-red-700'
                                                        }
                                                    >
                                                        {isProcessing
                                                            ? 'Memproses...'
                                                            : actionType === 'confirmed'
                                                              ? 'Konfirmasi Setuju'
                                                              : 'Konfirmasi Tolak'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDetailsOpen(false)} disabled={isProcessing}>
                                Tutup
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
