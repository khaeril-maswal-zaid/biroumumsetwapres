'use client';

import { StatusBadge } from '@/components/badges/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pemesanan Ruang Rapat',
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

    // Filter bookings based on search term and status
    const filteredBookings = bookingRooms.data.filter((booking: any) => {
        const matchesSearch =
            booking?.pemesan?.pegawai?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.kode_booking.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const formatTanggalIna = (tanggal: string) => {
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date(tanggal));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pemesanan Ruang Rapat" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-linear-to-br from-white to-blue-100 p-4">
                <Card>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Search className="h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama pengaju, kegiatan, atau kode pemesanan..."
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
                                        <TableHead>No</TableHead>
                                        <TableHead>Kode Pemesanan</TableHead>
                                        <TableHead>Nama Pemesan</TableHead>
                                        <TableHead>Ruangan</TableHead>
                                        <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                                        <TableHead className="hidden md:table-cell">Waktu</TableHead>
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
                                        filteredBookings.map((booking: any, index: any) => (
                                            <TableRow key={booking.kode_booking}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    <div className="font-mono text-sm font-medium">{booking.kode_booking}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{booking?.pemesan?.pegawai?.name}</div>
                                                    <div className="text-sm text-gray-500">{booking.unit_kerja}</div>
                                                </TableCell>
                                                <TableCell>{booking?.ruangans.nama_ruangan}</TableCell>
                                                <TableCell className="hidden md:table-cell">{formatTanggalIna(booking.tanggal_penggunaan)}</TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {booking.jam_mulai.slice(0, 5)} - {booking.jam_selesai.slice(0, 5)}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={booking.status} isRead={booking.is_read} />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link className="font-medium" href={route('ruangrapat.show', booking.kode_booking)}>
                                                        Detail
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
