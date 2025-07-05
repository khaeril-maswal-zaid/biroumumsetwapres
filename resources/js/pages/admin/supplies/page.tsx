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
import { AlertCircle, CheckCircle, Clock, Hash, MessageSquare, Package, Search, User, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function SuppliesAdmin({ permintaanAtk }: any) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedSupply, setSelectedSupply] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [adminMessage, setAdminMessage] = useState('');
    const [actionType, setActionType] = useState<'in_progress' | 'cancelled' | null>(null);

    const handleSubmit = async (supplyCode: string, message: string) => {
        setIsProcessing(true);
        router.patch(
            route('permintaanatk.status', supplyCode),
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

    // Filter supplies based on search term and status
    const filteredSupplies = permintaanAtk.data.filter((supply: any) => {
        const matchesSearch =
            supply?.pemesan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supply.daftar_kebutuhan.some((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || supply.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = (supply: any) => {
        setSelectedSupply(supply);
        setIsDetailsOpen(true);
    };

    const handleActionClick = (action: 'in_progress' | 'cancelled') => {
        setActionType(action);
        setAdminMessage('');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="mb-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Menunggu</Badge>;
            case 'in_progress':
                return <Badge className="mb-1 bg-blue-100 text-blue-800 hover:bg-blue-200">Disetujui</Badge>;
            case 'confirmed':
                return <Badge className="mb-1 bg-green-100 text-green-800 hover:bg-green-200">Selesai</Badge>;
            case 'cancelled':
                return <Badge className="mb-1 bg-red-100 text-red-800 hover:bg-red-200">Ditolak</Badge>;
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
        }).format(date);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                                        <SelectItem value="in_progress">Disetujui</SelectItem>
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
                                        <TableHead>Kode Permintaan</TableHead>
                                        <TableHead>Nama Pemesan</TableHead>
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
                                        filteredSupplies.map((supply: any) => (
                                            <TableRow key={supply.kode_pelaporan}>
                                                <TableCell>
                                                    <div className="font-medium">{supply.kode_pelaporan}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{supply?.pemesan.name}</div>
                                                    <div className="text-sm text-gray-500">{supply?.pemesan.unit_kerja}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="flex w-fit items-center gap-1">
                                                        <Package className="h-3 w-3" />
                                                        <span>{supply.daftar_kebutuhan.length} item</span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">{getUrgencyBadge(supply.urgensi)}</TableCell>
                                                <TableCell className="hidden lg:table-cell">{formatDate(supply.created_at)}</TableCell>
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
                    <DialogContent className="max-h-[90vh] overflow-y-auto px-10 pt-12 sm:max-w-2xl">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Detail Permintaan ATK
                            </DialogTitle>
                            <DialogDescription>Tinjau informasi permintaan ATK dan berikan keputusan dengan pesan untuk pengaju.</DialogDescription>
                        </DialogHeader>

                        {selectedSupply && (
                            <div className="space-y-6">
                                {/* Status and Supply Info */}
                                <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="mb-2 flex items-center gap-1">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            <span className="text-xs text-gray-600">{formatDate(selectedSupply.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Hash className="h-4 w-4 text-gray-500" />
                                            <span className="font-mono text-sm font-medium text-gray-700">{selectedSupply.kode_pelaporan}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {getStatusBadge(selectedSupply.status)}
                                        {/* <h3 className="text-xl font-semibold text-gray-900">Permintaan ATK</h3> */}
                                    </div>
                                </div>

                                {/* Supply Details */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <User className="my-auto h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">{selectedSupply?.pemesan?.name}</p>
                                                <p className="text-xs text-gray-600">{selectedSupply?.pemesan?.unit_kerja}</p>
                                                <p className="text-xs text-gray-500">{selectedSupply.no_hp}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="h-5 w-5 text-purple-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Tingkat Urgensi</p>
                                                {getUrgencyBadge(selectedSupply.urgensi)}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Package className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Total Item</p>
                                                <p className="text-sm text-gray-600">{selectedSupply.daftar_kebutuhan.length} jenis barang</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="mb-2 font-medium text-gray-900">Justifikasi Permintaan</p>
                                            <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">{selectedSupply.deskripsi}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div>
                                    <p className="mb-3 font-medium text-gray-900">Daftar Barang yang Diminta</p>
                                    <div className="space-y-2">
                                        {selectedSupply.daftar_kebutuhan.map((item: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
                                                <div className="flex items-center gap-3">
                                                    <Package className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm font-medium">{item.name}</span>
                                                </div>
                                                <Badge variant="outline" className="font-medium">
                                                    {item.quantity} {item.unit}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Admin Message Display for Approved/Rejected */}
                                {selectedSupply.keterangan &&
                                    selectedSupply.status !== 'pending' &&
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

                                        const color = colorMap[selectedSupply.status] ?? colorMap['in_progress'];

                                        return (
                                            <div className={`rounded-lg border ${color.border} ${color.bg} p-4`}>
                                                <div className="mb-2 flex items-center gap-2">
                                                    <MessageSquare className={`h-4 w-4 ${color.icon}`} />
                                                    <h4 className={`font-medium ${color.title}`}>Pesan dari Admin</h4>
                                                </div>
                                                <p className={`text-sm ${color.text}`}>{selectedSupply.keterangan}</p>
                                            </div>
                                        );
                                    })()}

                                <Separator />

                                {/* Action Section */}
                                {selectedSupply.status === 'pending' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-5 w-5 text-blue-600" />
                                            <h4 className="font-medium text-gray-900">Keputusan Admin</h4>
                                        </div>

                                        {!actionType && (
                                            <div className="flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-red-200 bg-transparent text-red-700 hover:bg-red-50"
                                                    onClick={() => handleActionClick('cancelled')}
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Tolak Permintaan
                                                </Button>
                                                <Button
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                                    onClick={() => handleActionClick('in_progress')}
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Setujui Permintaan
                                                </Button>
                                            </div>
                                        )}

                                        {actionType && (
                                            <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
                                                <div className="flex items-center gap-2">
                                                    {actionType === 'in_progress' ? (
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                                    )}
                                                    <h5 className="font-medium">
                                                        {actionType === 'in_progress' ? 'Menyetujui Permintaan' : 'Menolak Permintaan'}
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
                                                            actionType === 'in_progress'
                                                                ? 'Tambahkan informasi kapan barang bisa diambil, lokasi pengambilan, atau catatan khusus...'
                                                                : 'Jelaskan alasan penolakan permintaan ATK (misal: stok habis, tidak sesuai kebutuhan, dll)...'
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
                                                            if (actionType === 'in_progress') {
                                                                handleSubmit(selectedSupply.kode_pelaporan, 'in_progress');
                                                            } else {
                                                                handleSubmit(selectedSupply.kode_pelaporan, 'cancelled');
                                                            }
                                                        }}
                                                        disabled={isProcessing || (actionType === 'cancelled' && !adminMessage.trim())}
                                                        className={
                                                            actionType === 'in_progress'
                                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                                : 'bg-red-600 hover:bg-red-700'
                                                        }
                                                    >
                                                        {isProcessing
                                                            ? 'Memproses...'
                                                            : actionType === 'in_progress'
                                                              ? 'Konfirmasi Setuju'
                                                              : 'Konfirmasi Tolak'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* SENGAJA TUTUP KARENA KAYAKNYA BAGUS KALAU USER YANG CONFIRMED */}
                                {/* {selectedSupply.status === 'in_progress' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <h4 className="font-medium text-gray-900">Tandai Selesai</h4>
                                        </div>

                                        <div className="rounded-lg border bg-green-50 p-4">
                                            <p className="mb-3 text-sm text-green-800">
                                                Permintaan ATK telah disetujui. Tandai sebagai selesai setelah barang diserahkan kepada pengaju.
                                            </p>

                                            <div className="space-y-2">
                                                <Label htmlFor="completion-message">Catatan Penyelesaian (Opsional)</Label>
                                                <Textarea
                                                    id="completion-message"
                                                    placeholder="Tambahkan catatan bahwa barang telah diserahkan..."
                                                    value={adminMessage}
                                                    onChange={(e) => setAdminMessage(e.target.value)}
                                                    rows={2}
                                                    className="mt-1 resize-none"
                                                />
                                            </div>

                                            <div className="flex gap-2 pt-3">
                                                <Button
                                                    onClick={() => handleSubmit(selectedSupply.kode_pelaporan, 'confirmed')}
                                                    disabled={isProcessing}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    {isProcessing ? 'Memproses...' : 'Tandai Selesai'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )} */}
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
