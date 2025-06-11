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
import { CheckCircle, Package, PenTool, Search, User, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Mock data for supplies requests
const supplies = [
    {
        id: '1',
        name: 'Dewi Lestari',
        devisi: 'Biro 1',
        items: [
            { name: 'Kertas A4', quantity: '5', unit: 'rim' },
            { name: 'Pulpen', quantity: '20', unit: 'pcs' },
            { name: 'Spidol', quantity: '10', unit: 'pcs' },
        ],
        justification: 'Untuk kebutuhan administrasi dan dokumentasi proyek baru',
        urgency: 'normal',
        contact: '0812-3456-7894',
        status: 'pending',
        createdAt: '2025-06-10T09:15:00',
    },
    {
        id: '2',
        name: 'Ahmad Fauzi',
        devisi: 'Biro 2',
        items: [
            { name: 'Tinta Printer', quantity: '4', unit: 'pcs' },
            { name: 'Stapler', quantity: '2', unit: 'pcs' },
        ],
        justification: 'Tinta printer habis dan stapler rusak',
        urgency: 'mendesak',
        contact: '0812-3456-7895',
        status: 'approved',
        createdAt: '2025-06-09T14:30:00',
    },
    {
        id: '3',
        name: 'Sari Indah',
        devisi: 'Biro 3',
        items: [
            { name: 'Map Plastik', quantity: '50', unit: 'pcs' },
            { name: 'Klip Kertas', quantity: '5', unit: 'box' },
            { name: 'Post-it', quantity: '10', unit: 'pack' },
        ],
        justification: 'Untuk organisasi dokumen dan arsip divisi',
        urgency: 'normal',
        contact: '0812-3456-7896',
        status: 'completed',
        createdAt: '2025-06-08T11:20:00',
    },
    {
        id: '4',
        name: 'Budi Santoso',
        devisi: 'Biro 2',
        items: [
            { name: 'Kertas HVS', quantity: '10', unit: 'rim' },
            { name: 'Amplop', quantity: '100', unit: 'pcs' },
        ],
        justification: 'Untuk surat menyurat dan korespondensi',
        urgency: 'segera',
        contact: '0812-3456-7891',
        status: 'rejected',
        createdAt: '2025-06-07T16:45:00',
    },
];

export default function SuppliesAdmin() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedSupply, setSelectedSupply] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleApprove = async (supplyId: string) => {
        setIsProcessing(true);
        // Simulasi API call
        setTimeout(() => {
            console.log(`Supply request ${supplyId} approved`);
            setIsProcessing(false);
            setIsDetailsOpen(false);
            // Di aplikasi nyata, ini akan update data dari server
        }, 1000);
    };

    const handleReject = async (supplyId: string) => {
        setIsProcessing(true);
        // Simulasi API call
        setTimeout(() => {
            console.log(`Supply request ${supplyId} rejected`);
            setIsProcessing(false);
            setIsDetailsOpen(false);
            // Di aplikasi nyata, ini akan update data dari server
        }, 1000);
    };

    // Filter supplies based on search term and status
    const filteredSupplies = supplies.filter((supply) => {
        const matchesSearch =
            supply.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supply.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || supply.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (supply: any) => {
        setSelectedSupply(supply);
        setIsDetailsOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Menunggu</Badge>;
            case 'approved':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Disetujui</Badge>;
            case 'completed':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Selesai</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Ditolak</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const getUrgencyBadge = (urgency: string) => {
        switch (urgency) {
            case 'normal':
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Normal</Badge>;
            case 'mendesak':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Mendesak</Badge>;
            case 'segera':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Segera</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Permintaan Alat Tulis Kantor</h1>
                        <p className="text-gray-500">Kelola semua permintaan alat tulis kantor.</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Permintaan ATK</CardTitle>
                            <CardDescription>Semua permintaan alat tulis kantor yang telah diajukan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex w-full max-w-sm items-center space-x-2">
                                    <Search className="h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari nama atau barang..."
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
                                            <SelectItem value="completed">Selesai</SelectItem>
                                            <SelectItem value="rejected">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Pengaju</TableHead>
                                            <TableHead>Jumlah Item</TableHead>
                                            <TableHead className="hidden md:table-cell">Urgensi</TableHead>
                                            <TableHead className="hidden lg:table-cell">Tanggal</TableHead>
                                            <TableHead>Status</TableHead>
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
                                            filteredSupplies.map((supply) => (
                                                <TableRow key={supply.id}>
                                                    <TableCell>
                                                        <div className="font-medium">{supply.name}</div>
                                                        <div className="text-sm text-gray-500">{supply.devisi}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="flex w-fit items-center gap-1">
                                                            <Package className="h-3 w-3" />
                                                            <span>{supply.items.length} item</span>
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">{getUrgencyBadge(supply.urgency)}</TableCell>
                                                    <TableCell className="hidden lg:table-cell">
                                                        {new Date(supply.createdAt).toLocaleDateString('id-ID')}
                                                    </TableCell>
                                                    <TableCell>{getStatusBadge(supply.status)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(supply)}>
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

                    {/* Supply Details Dialog */}
                    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Detail Permintaan ATK</DialogTitle>
                                <DialogDescription>Informasi lengkap tentang permintaan alat tulis kantor.</DialogDescription>
                            </DialogHeader>
                            {selectedSupply && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">Permintaan ATK</h3>
                                        {getStatusBadge(selectedSupply.status)}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium">{selectedSupply.name}</p>
                                                <p className="text-xs text-gray-500">{selectedSupply.devisi}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <PenTool className="h-4 w-4 text-gray-500" />
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm">Urgensi:</p>
                                                {getUrgencyBadge(selectedSupply.urgency)}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <p className="mb-2 text-sm font-medium">Daftar Barang:</p>
                                            <div className="space-y-2">
                                                {selectedSupply.items.map((item: any, index: number) => (
                                                    <div key={index} className="flex items-center justify-between rounded bg-gray-50 p-2">
                                                        <span className="text-sm">{item.name}</span>
                                                        <span className="text-sm font-medium">
                                                            {item.quantity} {item.unit}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <p className="text-sm font-medium">Justifikasi:</p>
                                            <p className="text-sm text-gray-700">{selectedSupply.justification}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">Kontak:</p>
                                            <p className="text-sm text-gray-700">{selectedSupply.contact}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">Tanggal Pengajuan:</p>
                                            <p className="text-sm text-gray-700">{formatDate(selectedSupply.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <DialogFooter className="flex justify-between sm:justify-between">
                                {selectedSupply && selectedSupply.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleReject(selectedSupply.id)}
                                            disabled={isProcessing}
                                        >
                                            <X className="h-4 w-4" />
                                            <span>{isProcessing ? 'Memproses...' : 'Tolak'}</span>
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleApprove(selectedSupply.id)}
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
