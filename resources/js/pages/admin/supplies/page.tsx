'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Clock, Hash, MessageSquare, NotebookText, Package, Search, User, X } from 'lucide-react';
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
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [adminMessage, setAdminMessage] = useState('');
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
    const [approvedQuantities, setApprovedQuantities] = useState<{ [key: string]: number }>({});

    const handleSubmit = async (supplyCode: string) => {
        setIsProcessing(true);
        router.patch(
            route('permintaanatk.status', supplyCode),
            {
                item: approvedQuantities,
                status: calculateRequestStatus(),
                message: adminMessage,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsProcessing(false);
                    setIsDetailsOpen(false);
                    setAdminMessage('');
                    setActionType(null);
                    setApprovedQuantities({});
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

    const handleApprove = async (requestId: string) => {
        setIsProcessing(true);
        // Simulasi API call
        setTimeout(() => {
            console.log(`ATK request ${requestId} processed with quantities:`, approvedQuantities);
            console.log(`Admin message: ${adminMessage}`);
            setIsProcessing(false);
            setIsDetailsOpen(false);
            setAdminMessage('');
            setActionType(null);
            setApprovedQuantities({});
            // Di aplikasi nyata, ini akan update data dari server
        }, 1000);
    };

    const handleReject = async (requestId: string) => {
        setIsProcessing(true);
        // Simulasi API call
        setTimeout(() => {
            // console.log(`ATK request ${requestId} rejected with message: ${adminMessage}`);
            setIsProcessing(false);
            setIsDetailsOpen(false);
            setAdminMessage('');
            setActionType(null);
            setApprovedQuantities({});
            // Di aplikasi nyata, ini akan update data dari server
        }, 1000);
    };

    const handleViewDetails = (request: any) => {
        setSelectedRequest(request);
        setIsDetailsOpen(true);
        setActionType(null);
        setAdminMessage('');

        // Initialize approved quantities with current approved values
        const initialQuantities: { [key: string]: number } = {};
        request.daftar_kebutuhan.forEach((item: any) => {
            initialQuantities[item.id] = item.approved;
        });
        setApprovedQuantities(initialQuantities);
    };

    const handleActionClick = (action: 'approve' | 'reject') => {
        setActionType(action);
        setAdminMessage('');
    };

    const handleQuantityChange = (itemId: string, quantity: number, maxQuantity: number) => {
        const validQuantity = Math.max(0, Math.min(quantity, maxQuantity));
        setApprovedQuantities((prev) => ({
            ...prev,
            [itemId]: validQuantity,
        }));
    };

    const getItemStatus = (requested: number, approved: number) => {
        if (approved === 0) return 'rejected';
        if (approved === requested) return 'approved';
        return 'partial';
    };

    const getItemStatusBadge = (requested: number, approved: number) => {
        const status = getItemStatus(requested, approved);
        const percentage = requested > 0 ? Math.round((approved / requested) * 100) : 0;

        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">100%</Badge>;
            case 'partial':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{percentage}%</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">0%</Badge>;
            default:
                return <Badge variant="outline">-</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Disetujui</Badge>;
            case 'partial':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Sebagian</Badge>;
            case 'pending':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Menunggu</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Ditolak</Badge>;
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

    const calculateRequestStatus = () => {
        if (!selectedRequest || actionType !== 'approve') return 'pending';

        const items = selectedRequest.daftar_kebutuhan;
        let approvedCount = 0;
        let partialCount = 0;
        let rejectedCount = 0;

        items.forEach((item: any) => {
            const approvedQty = approvedQuantities[item.id] || 0;

            if (approvedQty === 0) {
                rejectedCount++;
            } else if (approvedQty === item.requested) {
                approvedCount++;
            } else {
                partialCount++;
            }
        });

        if (rejectedCount === items.length) return 'rejected';
        if (approvedCount === items.length) return 'approved';

        return 'partial';
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
                                        <SelectItem value="approved">Disetujui</SelectItem>
                                        <SelectItem value="confirmed">Selesai</SelectItem>
                                        <SelectItem value="rejected">Ditolak</SelectItem>
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

                {/* ATK Request Details Dialog */}
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Detail Permintaan ATK
                            </DialogTitle>
                            <DialogDescription>Tinjau setiap item yang diminta dan tentukan jumlah yang akan disetujui.</DialogDescription>
                        </DialogHeader>

                        {selectedRequest && (
                            <div className="space-y-6">
                                {/* Status and Request Info */}
                                <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="mb-2 flex items-center gap-1">
                                            <NotebookText className="h-4 w-4 text-gray-500" />
                                            <span className="text-xs text-gray-600">{formatDate(selectedRequest.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Hash className="h-4 w-4 text-gray-500" />
                                            <span className="font-mono text-sm font-medium text-gray-700">{selectedRequest.kode_pelaporan}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">{getStatusBadge(selectedRequest.status)}</div>
                                </div>

                                {/* Request Details */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <User className="my-auto h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">{selectedRequest?.pemesan?.name}</p>
                                                <p className="text-xs text-gray-600">{selectedRequest?.pemesan?.unit_kerja}</p>
                                                <p className="text-xs text-gray-500">{selectedRequest.no_hp}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Clock className="mt-0.5 h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Lokasi</p>
                                                <p className="text-sm text-gray-600">{formatDate(selectedRequest.created_at)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Package className="h-5 w-5 text-purple-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Total Item</p>
                                                <p className="text-sm text-gray-600">{selectedRequest.daftar_kebutuhan.length} jenis item</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div>
                                    <h4 className="mb-4 font-medium text-gray-900">Daftar Item yang Diminta</h4>
                                    <div className="space-y-3">
                                        {selectedRequest.daftar_kebutuhan.map((item: any, index: number) => {
                                            const approvedQty = approvedQuantities[item.id] || item.approved;
                                            const status = getItemStatus(item.requested, approvedQty);
                                            const percentage = item.requested > 0 ? (approvedQty / item.requested) * 100 : 0;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`rounded-lg border p-4 ${
                                                        status === 'approved'
                                                            ? 'border-green-200 bg-green-50'
                                                            : status === 'partial'
                                                              ? 'border-yellow-200 bg-yellow-50'
                                                              : status === 'rejected'
                                                                ? 'border-red-200 bg-red-50'
                                                                : 'border-gray-200 bg-white'
                                                    }`}
                                                >
                                                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                                        <div className="flex-1">
                                                            <div className="mb-2 flex items-center gap-2">
                                                                <h5 className="font-medium text-gray-900">{item.name}</h5>
                                                                {getItemStatusBadge(item.requested, approvedQty)}
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                <span>
                                                                    Diminta: {item.requested} {item.unit}
                                                                </span>
                                                                <span>•</span>
                                                                <span>
                                                                    Disetujui: {approvedQty} {item.unit}
                                                                </span>
                                                            </div>
                                                            {percentage > 0 && percentage < 100 && (
                                                                <div className="mt-2">
                                                                    <Progress value={percentage} className="h-2" />
                                                                    <p className="mt-1 text-xs text-gray-500">
                                                                        {Math.round(percentage)}% dari yang diminta
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {selectedRequest.status === 'pending' && actionType === 'approve' && (
                                                            <div className="flex items-center gap-2">
                                                                <Label htmlFor={`qty-${item.id}`} className="text-sm whitespace-nowrap">
                                                                    Setujui:
                                                                </Label>
                                                                <Input
                                                                    id={`qty-${item.id}`}
                                                                    type="number"
                                                                    min="0"
                                                                    max={item.requested}
                                                                    value={approvedQty}
                                                                    onChange={(e) =>
                                                                        handleQuantityChange(
                                                                            item.id,
                                                                            Number.parseInt(e.target.value) || 0,
                                                                            item.requested,
                                                                        )
                                                                    }
                                                                    className="w-20"
                                                                />
                                                                <span className="text-sm text-gray-500">{item.unit}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Admin Message Display for Processed Requests */}
                                {selectedRequest.adminMessage && selectedRequest.status !== 'pending' && (
                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                        <div className="mb-2 flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 text-blue-600" />
                                            <h4 className="font-medium text-blue-900">Pesan dari Admin</h4>
                                        </div>
                                        <p className="text-sm text-blue-800">{selectedRequest.adminMessage}</p>
                                    </div>
                                )}

                                <Separator />

                                {/* Action Section */}
                                {selectedRequest.status === 'pending' && (
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
                                                    onClick={() => handleActionClick('reject')}
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Tolak Permintaan
                                                </Button>
                                                <Button
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleActionClick('approve')}
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Proses Permintaan
                                                </Button>
                                            </div>
                                        )}

                                        {actionType && (
                                            <div className="space-y-4 rounded-lg border bg-gray-50 p-4">
                                                <div className="flex items-center gap-2">
                                                    {actionType === 'approve' ? (
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                                    )}
                                                    <h5 className="font-medium">
                                                        {actionType === 'approve' ? 'Memproses Permintaan ATK' : 'Menolak Permintaan ATK'}
                                                    </h5>
                                                </div>

                                                {actionType === 'approve' && (
                                                    <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                                                        <p className="mb-2 text-sm text-blue-800">
                                                            <strong>Status Permintaan:</strong>
                                                            {calculateRequestStatus() === 'approved'
                                                                ? ' Disetujui Penuh'
                                                                : calculateRequestStatus() === 'partial'
                                                                  ? ' Disetujui Sebagian'
                                                                  : ' Ditolak'}
                                                        </p>
                                                        <p className="text-xs text-blue-600">
                                                            Pastikan jumlah yang disetujui sudah sesuai dengan ketersediaan stok.
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="space-y-2">
                                                    <Label htmlFor="admin-message">
                                                        Pesan untuk Pemohon {actionType === 'reject' && <span className="text-red-500">*</span>}
                                                    </Label>
                                                    <Textarea
                                                        id="admin-message"
                                                        placeholder={
                                                            actionType === 'approve'
                                                                ? 'Tambahkan catatan atau instruksi pengambilan ATK (opsional)...'
                                                                : 'Jelaskan alasan penolakan permintaan ATK...'
                                                        }
                                                        value={adminMessage}
                                                        onChange={(e) => setAdminMessage(e.target.value)}
                                                        rows={3}
                                                        className="resize-none"
                                                    />
                                                    {actionType === 'reject' && !adminMessage.trim() && (
                                                        <p className="text-sm text-red-600">Pesan wajib diisi untuk penolakan</p>
                                                    )}
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setActionType(null);
                                                            setAdminMessage('');
                                                            // Reset approved quantities to original values
                                                            const resetQuantities: { [key: string]: number } = {};
                                                            selectedRequest.daftar_kebutuhan.forEach((item: any) => {
                                                                resetQuantities[item.id] = item.approved;
                                                            });
                                                            setApprovedQuantities(resetQuantities);
                                                        }}
                                                        disabled={isProcessing}
                                                    >
                                                        Batal
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            if (actionType === 'approve') {
                                                                handleSubmit(selectedRequest.kode_pelaporan);
                                                            } else {
                                                                handleSubmit(selectedRequest.kode_pelaporan);
                                                            }
                                                        }}
                                                        disabled={isProcessing || (actionType === 'reject' && !adminMessage.trim())}
                                                        className={
                                                            actionType === 'approve'
                                                                ? 'bg-green-600 hover:bg-green-700'
                                                                : 'bg-red-600 hover:bg-red-700'
                                                        }
                                                    >
                                                        {isProcessing
                                                            ? 'Memproses...'
                                                            : actionType === 'approve'
                                                              ? 'Konfirmasi Persetujuan'
                                                              : 'Konfirmasi Penolakan'}
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
