'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, Search, Users, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function BookingsAdmin({ bookingRooms }: any) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleApprove = async (bookingId: string) => {
        setIsProcessing(true);
        // Simulasi API call
        setTimeout(() => {
            console.log(`Booking ${bookingId} approved`);
            setIsProcessing(false);
            setIsDetailsOpen(false);
            // Di aplikasi nyata, ini akan update data dari server
        }, 1000);
    };

    const handleReject = async (bookingId: string) => {
        setIsProcessing(true);
        // Simulasi API call
        setTimeout(() => {
            console.log(`Booking ${bookingId} rejected`);
            setIsProcessing(false);
            setIsDetailsOpen(false);
            // Di aplikasi nyata, ini akan update data dari server
        }, 1000);
    };

    // Filter bookings based on search term and status
    const filteredBookings = bookingRooms.data.filter((booking: any) => {
        const matchesSearch =
            booking?.pemesan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking?.ruangans.nama_ruangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (booking: any) => {
        setSelectedBooking(booking);
        setIsDetailsOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Terkonfirmasi</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Menunggu</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Dibatalkan</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pemesanan Ruang Rapat</h1>
                        <p className="text-gray-500">Kelola semua pemesanan ruang rapat.</p>
                    </div>

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
                                        placeholder="Cari nama, ruangan, atau keperluan..."
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
                                            <SelectItem value="confirmed">Terkonfirmasi</SelectItem>
                                            <SelectItem value="pending">Menunggu</SelectItem>
                                            <SelectItem value="cancelled">Dibatalkan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Ruangan</TableHead>
                                            <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                                            <TableHead className="hidden md:table-cell">Waktu</TableHead>
                                            <TableHead className="hidden lg:table-cell">Keperluan</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBookings.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="py-4 text-center text-gray-500">
                                                    Tidak ada data pemesanan yang ditemukan
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredBookings.map((booking) => (
                                                <TableRow key={booking.kode_booking}>
                                                    <TableCell>
                                                        <div className="font-medium">{booking?.pemesan.name}</div>
                                                        <div className="text-sm text-gray-500">{booking?.pemesan.unit_kerja}</div>
                                                    </TableCell>
                                                    <TableCell>{booking?.ruangans.nama_ruangan}</TableCell>
                                                    <TableCell className="hidden md:table-cell">{booking.created_at}</TableCell>
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
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Detail Pemesanan Ruang</DialogTitle>
                                <DialogDescription>Informasi lengkap tentang pemesanan ruang rapat.</DialogDescription>
                            </DialogHeader>
                            {selectedBooking && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">{selectedBooking?.ruangans.nama_ruangan}</h3>
                                        {getStatusBadge(selectedBooking.status)}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium">{selectedBooking?.pemesan.name}</p>
                                                <p className="text-xs text-gray-500">{selectedBooking?.pemesan.unit_kerja}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <p className="text-sm">{selectedBooking.created_at}</p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            <p className="text-sm">
                                                {selectedBooking.jam_mulai} - {selectedBooking.jam_selesai}
                                            </p>
                                        </div>

                                        <div className="pt-2">
                                            <p className="text-sm font-medium">Keperluan:</p>
                                            <p className="text-sm text-gray-700">{selectedBooking.deskripsi}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">Kontak:</p>
                                            <p className="text-sm text-gray-700">{selectedBooking.contact}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <DialogFooter className="flex justify-between sm:justify-between">
                                {selectedBooking && selectedBooking.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleReject(selectedBooking.id)}
                                            disabled={isProcessing}
                                        >
                                            <X className="h-4 w-4" />
                                            <span>{isProcessing ? 'Memproses...' : 'Tolak'}</span>
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleApprove(selectedBooking.id)}
                                            disabled={isProcessing}
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            <span>{isProcessing ? 'Memproses...' : 'Setujui'}</span>
                                        </Button>
                                    </div>
                                )}
                                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                                    Tutup
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AppLayout>
    );
}
