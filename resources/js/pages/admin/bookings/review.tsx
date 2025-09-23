import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, Calendar, CheckCircle, Clock, MessageSquare, Users, X } from 'lucide-react';
import { useState } from 'react';

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

export default function BookingDetailsPage({ selectedBooking }: any) {
    const [actionType, setActionType] = useState<'confirmed' | 'cancelled' | null>(null);
    const [adminMessage, setAdminMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleActionClick = (action: 'confirmed' | 'cancelled') => {
        setActionType(action);
        setAdminMessage('');
    };

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
                    setAdminMessage('');
                    setActionType(null);
                },
                onError: (errors) => {
                    console.log('Validation Errors: ', errors);
                },
            },
        );
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle className="mb-2 flex items-center gap-1">
                            <Calendar className="inline-block h-5 w-5" />
                            <span className="py-auto">Detail Pemesanan Ruang Rapat</span>
                        </CardTitle>
                        <CardDescription>Tinjau informasi pemesanan dan berikan keputusan dengan pesan untuk pengaju.</CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
