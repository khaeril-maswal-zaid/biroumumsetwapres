import { StatusBadge } from '@/components/badges/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Calendar, CheckCircle, MessageSquare, Package, User, X } from 'lucide-react';
import { useState } from 'react';
('use client');

const formatTanggalIna = (tanggal: string) => {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(tanggal));
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function SupplieDetailsPage({ selectedRequest }: any) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [adminMessage, setAdminMessage] = useState('');
    const [actionType, setActionType] = useState<'confirmed' | 'reject' | null>(null);
    const [approvedQuantities, setApprovedQuantities] = useState<{ [key: string]: number }>({});

    const handleSubmit = (supplyCode: string) => {
        setIsProcessing(true);

        const trimmedMessage = adminMessage.trim();

        const payload: Record<string, any> = {
            status: actionType,
        };

        // Hanya kirim jika tidak kosong
        if (trimmedMessage !== '') {
            payload.message = trimmedMessage;
        }

        payload.item = approvedQuantities;

        router.patch(route('permintaanatk.status', supplyCode), payload, {
            preserveScroll: true,
            onSuccess: () => {
                setIsProcessing(false);
                setAdminMessage('');
                setActionType(null);
                setApprovedQuantities({});
            },
            onError: (errors) => {
                console.log('Validation Errors: ', errors);
            },
        });
    };

    const handleActionClick = (action: 'confirmed' | 'reject') => {
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
        if (approved == 0) return 'rejected';
        if (approved == requested) return 'approved';
        return 'partial';
    };

    const getItemStatusBadge = (requested: number, approved: number) => {
        const status = getItemStatus(requested, approved);
        const percentage = requested > 0 ? Math.round((approved / requested) * 100) : 0;

        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">100%</Badge>;
            case 'partial':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{percentage}%</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">0%</Badge>;
            default:
                return <Badge variant="outline">-</Badge>;
        }
    };

    const calculateRequestStatus = () => {
        const items = selectedRequest.daftar_kebutuhan;
        let approvedCount = 0;
        let partialCount = 0;
        let rejectedCount = 0;

        items.forEach((item: any) => {
            const approvedQty = approvedQuantities[item.id] || 0;

            if (approvedQty == 0) {
                rejectedCount++;
            } else if (approvedQty == item.requested) {
                approvedCount++;
            } else {
                partialCount++;
            }
        });

        if (rejectedCount == items.length) return 'rejected';
        if (approvedCount == items.length) return 'approved';

        return 'partial';
    };

    console.log(selectedRequest);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl bg-linear-to-br from-white to-blue-100 p-4">
                <Link href={route('permintaanatk.index')}>
                    <Button
                        variant="ghost"
                        className="mb-1 flex items-center space-x-2 border bg-accent text-accent-foreground hover:border-gray-300 hover:bg-gray-200"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Kembali</span>
                    </Button>
                </Link>

                <Card className="max-w-4xl">
                    <CardHeader>
                        <CardTitle className="mb-2 flex items-center gap-1">
                            <Package className="h-5 w-5" />
                            Detail Permintaan ATK
                        </CardTitle>
                        <CardDescription>Tinjau setiap item yang diminta dan tentukan jumlah yang akan disetujui.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {selectedRequest && (
                            <div className="space-y-6">
                                {/* Status and Request Info */}
                                <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="mb-2 flex items-center gap-1">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span className="text-xs text-gray-600">{formatTanggalIna(selectedRequest.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-mono text-sm font-medium text-gray-700">
                                                Kode Permintaan: {selectedRequest.kode_pelaporan}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <StatusBadge status={selectedRequest.status} />
                                    </div>
                                </div>

                                {/* Request Details */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <User className="my-auto h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">{selectedRequest?.pemesan?.pegawai?.name}</p>
                                                <p className="text-xs text-gray-600">{selectedRequest?.pemesan?.pegawai?.biro?.nama_biro}</p>
                                                <p className="text-xs text-gray-500">{selectedRequest.no_hp}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Package className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">Total Item</p>
                                                <p className="text-sm text-gray-600">{selectedRequest.daftar_kebutuhan.length} jenis barang</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-2 font-medium text-gray-900">Keterangan</p>
                                        <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">{selectedRequest.deskripsi}</p>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div>
                                    <h4 className="mb-4 font-medium text-gray-900">Daftar Item yang Dimintas</h4>
                                    <div className="space-y-3">
                                        {selectedRequest.daftar_kebutuhan.map((item: any, index: number) => {
                                            const approvedQty = approvedQuantities[item.id] || item.approved;
                                            const status = getItemStatus(item.requested, approvedQty);
                                            const percentage = item.requested > 0 ? (approvedQty / item.requested) * 100 : 0;
                                            const remainingStock = item.stock - approvedQty;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`rounded-lg border p-4 ${
                                                        status === 'approved'
                                                            ? 'border-green-200 bg-green-50'
                                                            : status === 'partial'
                                                              ? 'border-blue-200 bg-blue-50'
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
                                                                    Diminta: {item.requested}{' '}
                                                                    {item.satuan && item.satuan.charAt(0).toUpperCase() + item.satuan.slice(1)}
                                                                </span>
                                                                <span>•</span>
                                                                <span>
                                                                    Disetujui: {approvedQty}{' '}
                                                                    {item.satuan && item.satuan.charAt(0).toUpperCase() + item.satuan.slice(1)}
                                                                </span>
                                                            </div>
                                                            {selectedRequest.status === 'pending' && actionType === 'confirmed' && (
                                                                <div className="mt-2 flex items-center gap-4 text-sm">
                                                                    <span className="font-medium text-blue-700">
                                                                        Stok Tersedia: {item.stock}{' '}
                                                                        {item.satuan && item.satuan.charAt(0).toUpperCase() + item.satuan.slice(1)}
                                                                    </span>
                                                                    <span>•</span>
                                                                    <span
                                                                        className={`font-medium ${remainingStock < 0 ? 'text-red-600' : 'text-green-700'}`}
                                                                    >
                                                                        Sisa Stok: {remainingStock}{' '}
                                                                        {item.satuan && item.satuan.charAt(0).toUpperCase() + item.satuan.slice(1)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {percentage > 0 && (
                                                                <div className="mt-4">
                                                                    <Progress value={percentage} className="h-2" />
                                                                    <p className="mt-1 text-xs text-gray-500">
                                                                        {Math.round(percentage)}% dari yang diminta
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {selectedRequest.status === 'pending' && actionType === 'confirmed' && (
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
                                                                <span className="text-sm text-gray-500">{item.satuan}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Separator />

                                {/* Admin Message Display for Approved/Rejected */}
                                {selectedRequest.keterangan &&
                                    selectedRequest.status !== 'pending' &&
                                    (() => {
                                        // Mapping warna berdasarkan status (Meskipun sekarang hanya confirmed)
                                        const colorMap: any = {
                                            confirmed: {
                                                border: 'border-green-600',
                                                bg: 'bg-green-400',
                                                icon: '',
                                                title: '',
                                                text: '',
                                            },

                                            rejected: {
                                                border: 'border-red-300',
                                                bg: 'bg-red-300',
                                                icon: 'text-red-600',
                                                title: 'text-red-900',
                                                text: 'text-red-800',
                                            },

                                            partial: {
                                                border: 'border-blue-300',
                                                bg: 'bg-blue-300',
                                                icon: 'text-blue-600',
                                                title: 'text-blue-900',
                                                text: 'text-blue-800',
                                            },
                                        };

                                        const color = colorMap[selectedRequest.status] ?? colorMap['confirmed'];

                                        return (
                                            <>
                                                <Separator />{' '}
                                                <div className={`rounded-lg border ${color.border} ${color.bg} p-4`}>
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <MessageSquare className={`h-4 w-4 ${color.icon}`} />
                                                        <h4 className={`font-medium ${color.title}`}>Pesan dari Admin</h4>
                                                    </div>
                                                    <p className={`text-sm ${color.text}`}>{selectedRequest.keterangan}</p>
                                                </div>
                                            </>
                                        );
                                    })()}

                                {/* Action Section */}
                                {selectedRequest.status === 'pending' && (
                                    <>
                                        <Separator />
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
                                                        onClick={() => handleActionClick('confirmed')}
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Proses Permintaan
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
                                                            {actionType === 'confirmed' ? 'Memproses Permintaan ATK' : 'Menolak Permintaan ATK'}
                                                        </h5>
                                                    </div>

                                                    {actionType === 'confirmed' && (
                                                        <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                                                            <p className="mb-2 text-sm text-blue-800">
                                                                <strong>Status Permintaan:</strong>
                                                                {calculateRequestStatus() == 'approved'
                                                                    ? ' Disetujui Penuh'
                                                                    : calculateRequestStatus() == 'partial'
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
                                                                actionType === 'confirmed'
                                                                    ? 'Tambahkan catatan atau instruksi pengambilan ATK (opsional)...'
                                                                    : 'Jelaskan alasan penolakan permintaan ATK...'
                                                            }
                                                            value={adminMessage}
                                                            onChange={(e) => setAdminMessage(e.target.value)}
                                                            rows={3}
                                                            className="mt-1 resize-none"
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
                                                                handleSubmit(selectedRequest.kode_pelaporan);
                                                            }}
                                                            disabled={
                                                                isProcessing ||
                                                                (actionType === 'reject' &&
                                                                    selectedRequest.status === 'pending' &&
                                                                    !adminMessage.trim())
                                                            }
                                                            className={
                                                                actionType === 'confirmed'
                                                                    ? 'bg-green-600 hover:bg-green-700'
                                                                    : 'bg-red-600 hover:bg-red-700'
                                                            }
                                                        >
                                                            {isProcessing
                                                                ? 'Memproses...'
                                                                : actionType === 'confirmed'
                                                                  ? 'Konfirmasi Persetujuan'
                                                                  : 'Konfirmasi Penolakan'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
