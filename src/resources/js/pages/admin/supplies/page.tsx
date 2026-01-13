'use client';

import { StatusBadge } from '@/components/badges/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Package, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permintaan ATK',
        href: '/dashboard',
    },
];

export default function SuppliesAdmin({ permintaanAtk }: any) {
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['permintaanAtk'],
            });
        }, 60 * 1000); // 60 detik

        return () => clearInterval(interval);
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isMemoOpen, setIsMemoOpen] = useState(false);

    // Filter supplies based on search term and status
    const filteredSupplies = permintaanAtk.data.filter((supply: any) => {
        const matchesSearch =
            supply?.pemesan?.pegawai?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supply?.kode_pelaporan.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || supply.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleViewMemo = (request: any) => {
        setSelectedRequest(request);
        setIsMemoOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto bg-linear-to-br from-white to-blue-100 p-4">
                <Card>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Search className="h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama pengaju atau kode permintaan..."
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
                                        <SelectItem value="approved">Disetujui</SelectItem>
                                        <SelectItem value="partial">Sebagian</SelectItem>
                                        <SelectItem value="rejected">Ditolak</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Kode Permintaan</TableHead>
                                        <TableHead>Nama Pemesan</TableHead>
                                        <TableHead>Jumlah Item</TableHead>
                                        <TableHead>Status</TableHead>
                                        {/* <TableHead>Memo</TableHead> */}
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSupplies.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-4 text-center text-gray-500">
                                                Tidak ada permintaan ATK yang ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredSupplies.map((supply: any, index: any) => (
                                            <TableRow key={supply.kode_pelaporan}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    <div className="font-mono text-sm font-medium">{supply.kode_pelaporan}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{supply?.pemesan?.pegawai?.name}</div>
                                                    <div className="text-sm text-gray-500">{supply.unit_kerja}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="flex w-fit items-center gap-1">
                                                        <Package className="h-3 w-3" />
                                                        <span>{supply.daftar_kebutuhan.length} item</span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={supply.status} isRead={supply.is_read} />
                                                </TableCell>
                                                {/* <TableCell>
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewMemo(supply)}>
                                                        Lihat memo
                                                    </Button>
                                                </TableCell> */}
                                                <TableCell className="text-right">
                                                    <Link className="font-medium" href={route('permintaanatk.show', supply.kode_pelaporan)}>
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

                {/* Memo ATK Dialog */}
                <Dialog open={isMemoOpen} onOpenChange={setIsMemoOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Memo Permintaan ATK
                            </DialogTitle>
                            <DialogDescription>Dokumen memo yang dilampirkan sebagai dasar permintaan alat tulis kantor.</DialogDescription>
                        </DialogHeader>

                        {selectedRequest && selectedRequest.memo && (
                            <div className="space-y-6">
                                <div className="h-[70vh] w-full">
                                    <div className="h-[70vh] w-full">
                                        <iframe src={route('memo', selectedRequest.memo)} className="h-full w-full rounded-md" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsMemoOpen(false)}>
                                Tutup
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
