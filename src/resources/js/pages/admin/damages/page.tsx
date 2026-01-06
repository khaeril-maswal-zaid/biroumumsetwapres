'use client';

import { StatusBadge } from '@/components/badges/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ImageIcon, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function DamagesAdmin({ kerusakan }: any) {
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['kerusakan'],
            });
        }, 60 * 1000); // 60 detik

        return () => clearInterval(interval);
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter damages based on search term and status
    const filteredDamages = kerusakan.data.filter((damage: any) => {
        const matchesSearch =
            damage?.pelapor?.pegawai?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            damage.lokasi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            damage.kode_pelaporan.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || damage.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto bg-linear-to-br from-white to-blue-100 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Laporan Kerusakan</CardTitle>
                        <CardDescription>Semua laporan kerusakan gedung yang telah diajukan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Search className="h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama, lokasi, atau kode laporan......"
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
                                        <SelectItem value="pending">Menunggu</SelectItem>
                                        <SelectItem value="confirmed">Selesai</SelectItem>
                                        <SelectItem value="cancelled">Ditolak</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Kode Laporan</TableHead>
                                        <TableHead>Nama Pelapor</TableHead>
                                        <TableHead>Lokasi</TableHead>
                                        <TableHead className="hidden md:table-cell">Nama Item Rusak</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden md:table-cell">Foto</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDamages.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-4 text-center text-gray-500">
                                                Tidak ada laporan kerusakan yang ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredDamages.map((damage: any, index: any) => (
                                            <TableRow key={damage.kode_pelaporan}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="font-mono text-sm font-medium">{damage.kode_pelaporan}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{damage?.pelapor?.pegawai?.name}</div>
                                                    <div className="text-sm text-gray-500">{damage.unit_kerja}</div>
                                                </TableCell>
                                                <TableCell>{damage.lokasi}</TableCell>
                                                <TableCell className="hidden md:table-cell">{damage.item}</TableCell>
                                                <TableCell>
                                                    <StatusBadge status={damage.status} isRead={damage.is_read} />
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {damage.picture.length > 0 ? (
                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                            <ImageIcon className="h-3 w-3" />
                                                            <span>{damage.picture.length}</span>
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link className="font-medium" href={route('kerusakangedung.show', damage.kode_pelaporan)}>
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
